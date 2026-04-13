/**
 * hoa_binaural.js
 * HOA AmbiX → Binaural (2ch) — implémentation native Node.js
 * Remplace hoa_binaural.py, même algorithme :
 *   1. Lecture SOFA (HDF5) via h5wasm (WASM, cross-platform)
 *   2. Décodage WAV AmbiX via SoX (pipe raw PCM float32)
 *   3. Matrice SH ACN/SN3D + pseudo-inverse (Gauss)
 *   4. Filtres HOA-binaural par combinaison linéaire des HRTF
 *   5. Convolution overlap-add (fft.js)
 *   6. Encodage WAV stéréo 24-bit via wav-encoder
 *
 * Exports : renderHoaBinaural(ambiXPath, outPath, { soxPath, soxiPath, sofaPath? })
 */

'use strict';

const fs      = require('fs');
const path    = require('path');
const { spawn } = require('child_process');
const WavEncoder = require('wav-encoder');
const FFTModule  = require('fft.js');

// Chemin vers le module h5wasm ESM (chargé via import() dynamique)
const H5WASM_ESM = path.join(__dirname, 'node_modules/h5wasm/dist/node/hdf5_hl.js');

// SOFA par défaut selon le système
const DEFAULT_SOFA = process.platform === 'win32'
    ? path.join(process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)',
                'libmysofa', 'MIT_KEMAR_normal_pinna.sofa')
    : '/usr/share/libmysofa/MIT_KEMAR_normal_pinna.sofa';

// ─── Utilitaires mathématiques ────────────────────────────────────────────────

function factorial(n) {
    let r = 1;
    for (let i = 2; i <= n; i++) r *= i;
    return r;
}

/** Facteur de normalisation SN3D pour l'ordre l, degré m */
function sn3dNorm(l, m) {
    const delta = m === 0 ? 1 : 0;
    return Math.sqrt((2 - delta) * factorial(l - Math.abs(m)) / factorial(l + Math.abs(m)));
}

/** Polynôme de Legendre associé P_l^|m|(x) */
function assocLegendre(l, m, x) {
    const am = Math.abs(m);
    let Pmm = 1.0;
    if (am > 0) {
        const sx = Math.sqrt(Math.max(0.0, 1.0 - x * x));
        let fact = 1.0;
        for (let i = 1; i <= am; i++) { Pmm *= -fact * sx; fact += 2.0; }
    }
    if (l === am) return Pmm;
    let Pmm1 = x * (2 * am + 1) * Pmm;
    if (l === am + 1) return Pmm1;
    let Plm = 0.0;
    for (let ll = am + 2; ll <= l; ll++) {
        Plm = ((2 * ll - 1) * x * Pmm1 - (ll + am - 1) * Pmm) / (ll - am);
        Pmm = Pmm1; Pmm1 = Plm;
    }
    return Plm;
}

/** Harmonique sphérique réelle Y_nAcn (convention ACN/SN3D) */
function realShAcn(nAcn, azDeg, elDeg) {
    const l = Math.floor(Math.sqrt(nAcn));
    const m = nAcn - l * l - l;
    const cosTheta = Math.cos((90.0 - elDeg) * Math.PI / 180.0);
    const phi = azDeg * Math.PI / 180.0;
    const P = assocLegendre(l, m, cosTheta);
    const N = sn3dNorm(l, m);
    if (m > 0) return N * P * Math.SQRT2 * Math.cos(m * phi);
    if (m < 0) return N * P * Math.SQRT2 * Math.sin(Math.abs(m) * phi);
    return N * P;
}

/**
 * Construit la matrice Y (M × nHoa) des harmoniques sphériques
 * positions : [[az, el], ...] en degrés
 */
function buildShMatrix(positions, nHoa) {
    const M = positions.length;
    const Y = new Float64Array(M * nHoa);
    for (let k = 0; k < M; k++) {
        const az = positions[k][0], el = positions[k][1];
        for (let n = 0; n < nHoa; n++) Y[k * nHoa + n] = realShAcn(n, az, el);
    }
    return Y; // layout row-major (M, nHoa)
}

/** Multiplication A(ra×ca) @ B(ca×cb) → C(ra×cb), Float64Array */
function matmul(A, ra, ca, B, cb) {
    const C = new Float64Array(ra * cb);
    for (let i = 0; i < ra; i++)
        for (let k = 0; k < ca; k++) {
            const aik = A[i * ca + k];
            if (aik === 0.0) continue;
            for (let j = 0; j < cb; j++) C[i * cb + j] += aik * B[k * cb + j];
        }
    return C;
}

/** Transposée A(r×c) → A^T(c×r) */
function transpose(A, r, c) {
    const B = new Float64Array(r * c);
    for (let i = 0; i < r; i++)
        for (let j = 0; j < c; j++) B[j * r + i] = A[i * c + j];
    return B;
}

/**
 * Résolution de A X = B par élimination de Gauss avec pivot partiel
 * A : Float64Array n×n, B : Float64Array n×m → X : Float64Array n×m
 */
function gaussSolve(A, n, B, m) {
    const nm = n + m;
    const aug = new Float64Array(n * nm);
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) aug[i * nm + j] = A[i * n + j];
        for (let j = 0; j < m; j++) aug[i * nm + n + j] = B[i * m + j];
    }
    for (let col = 0; col < n; col++) {
        let maxRow = col, maxVal = Math.abs(aug[col * nm + col]);
        for (let row = col + 1; row < n; row++) {
            const v = Math.abs(aug[row * nm + col]);
            if (v > maxVal) { maxVal = v; maxRow = row; }
        }
        if (maxRow !== col) {
            for (let j = 0; j < nm; j++) {
                const tmp = aug[col * nm + j];
                aug[col * nm + j] = aug[maxRow * nm + j];
                aug[maxRow * nm + j] = tmp;
            }
        }
        const piv = aug[col * nm + col];
        if (Math.abs(piv) < 1e-14) continue;
        for (let row = col + 1; row < n; row++) {
            const f = aug[row * nm + col] / piv;
            for (let j = col; j < nm; j++) aug[row * nm + j] -= f * aug[col * nm + j];
        }
    }
    const X = new Float64Array(n * m);
    for (let i = n - 1; i >= 0; i--) {
        const piv = aug[i * nm + i];
        for (let j = 0; j < m; j++) {
            let s = aug[i * nm + n + j];
            for (let k = i + 1; k < n; k++) s -= aug[i * nm + k] * X[k * m + j];
            X[i * m + j] = Math.abs(piv) > 1e-14 ? s / piv : 0.0;
        }
    }
    return X;
}

/**
 * Pseudo-inverse de Y (M×N) → D (N×M)  via  D = (Y^T Y)^{-1} Y^T
 */
function pseudoInverse(Y, M, N) {
    const Yt  = transpose(Y, M, N);             // (N, M)
    const YtY = matmul(Yt, N, M, Y, N);         // (N, N)
    return gaussSolve(YtY, N, Yt, M);            // (N, M)
}

// ─── Rééchantillonnage linéaire (pour HRTF si sr_hrtf ≠ sr_audio) ────────────

function resampleLinear(src, srIn, srOut) {
    if (srIn === srOut) return src instanceof Float64Array ? src : Float64Array.from(src);
    const ratio  = srIn / srOut;
    const outLen = Math.round(src.length * srOut / srIn);
    const out    = new Float64Array(outLen);
    for (let i = 0; i < outLen; i++) {
        const pos = i * ratio;
        const idx = Math.floor(pos), frac = pos - idx;
        const a = src[idx] ?? 0, b = src[idx + 1] ?? 0;
        out[i] = a + frac * (b - a);
    }
    return out;
}

// ─── Lecture SOFA via h5wasm (import dynamique ESM) ──────────────────────────

async function loadSofa(sofaPath) {
    const { ready, File: H5File } = await import(H5WASM_ESM);
    await ready;
    const f = new H5File(sofaPath, 'r');
    try {
        const posDs  = f.get('SourcePosition');   // (M, 3)
        const irsDs  = f.get('Data.IR');           // (M, 2, irLen)
        const srDs   = f.get('Data.SamplingRate'); // (1,)

        const posFlat = posDs.value;  // Float64Array, M*3
        const irsFlat = irsDs.value;  // Float64Array, M*2*irLen
        const srHrtf  = Number(srDs.value[0]);
        const [M, , irLen] = irsDs.shape;

        const positions = [];
        for (let k = 0; k < M; k++) {
            positions.push([posFlat[k * 3], posFlat[k * 3 + 1]]);
        }
        return { positions, irsFlat, M, irLen, srHrtf };
    } finally {
        f.close();
    }
}

// ─── Décodage WAV multichannel via SoX (pipe raw float32 PCM) ────────────────

function soxInfo(soxiPath, filePath) {
    const { execSync } = require('child_process');
    const nHoa     = parseInt(execSync(`"${soxiPath}" -c "${filePath}"`).toString().trim(), 10);
    const srAudio  = parseInt(execSync(`"${soxiPath}" -r "${filePath}"`).toString().trim(), 10);
    const nSamples = parseInt(execSync(`"${soxiPath}" -s "${filePath}"`).toString().trim(), 10);
    return { nHoa, srAudio, nSamples };
}

/**
 * Décode le WAV en raw float32 little-endian via SoX (pipe stdout).
 * Retourne un Buffer interleaved nSamples*nHoa float32.
 */
function soxDecodeRaw(soxPath, filePath) {
    return new Promise((resolve, reject) => {
        const proc = spawn(soxPath, [
            filePath, '-t', 'raw', '-e', 'float', '-b', '32', '-L', '-'
        ], { stdio: ['ignore', 'pipe', 'pipe'] });
        const chunks = [];
        proc.stdout.on('data', c => chunks.push(c));
        proc.stderr.on('data', c => {}); // ignorer stderr sox (infos)
        proc.on('close', code => {
            if (code !== 0) return reject(new Error(`SoX decode error (code ${code})`));
            resolve(Buffer.concat(chunks));
        });
        proc.on('error', reject);
    });
}

// ─── Prochain exposant de 2 ───────────────────────────────────────────────────

function nextPow2(n) {
    let p = 1;
    while (p < n) p <<= 1;
    return p;
}

// ─── Convolution HOA → stéréo binaural par overlap-add (fft.js) ──────────────

/**
 * @param {Float32Array[]} hoaChannels  nHoa Float32Array, chacune nSamples
 * @param {Float64Array}   C            filtres (nHoa, 2, irLen) row-major flat
 * @param {number}         nHoa
 * @param {number}         irLen
 * @param {number}         nSamples
 * @returns {{ L: Float64Array, R: Float64Array }}  stéréo, longueur nSamples+irLen-1
 */
function hoaConvolve(hoaChannels, C, nHoa, irLen, nSamples) {
    const B       = 512;
    const fftSize = nextPow2(B + irLen - 1);
    const nOut    = nSamples + irLen - 1;
    const outL    = new Float64Array(nOut);
    const outR    = new Float64Array(nOut);
    const fft     = new FFTModule(fftSize);

    // Pré-calculer FFT des filtres H[n][ear] (nHoa × 2 filtres)
    console.log(`[binaural-js] pré-calcul FFT des filtres (${nHoa} ch × 2 oreilles, taille ${fftSize})…`);
    const HL = new Array(nHoa);
    const HR = new Array(nHoa);
    const fbuf = new Float64Array(fftSize);
    for (let n = 0; n < nHoa; n++) {
        const hL = fft.createComplexArray();
        const hR = fft.createComplexArray();
        // Filtre gauche : C[n, 0, :]
        fbuf.fill(0);
        for (let i = 0; i < irLen; i++) fbuf[i] = C[(n * 2)     * irLen + i];
        fft.realTransform(hL, fbuf);
        fft.completeSpectrum(hL);
        // Filtre droit : C[n, 1, :]
        fbuf.fill(0);
        for (let i = 0; i < irLen; i++) fbuf[i] = C[(n * 2 + 1) * irLen + i];
        fft.realTransform(hR, fbuf);
        fft.completeSpectrum(hR);
        HL[n] = hL;
        HR[n] = hR;
    }

    // Overlap-add bloc par bloc
    const nBlocks = Math.ceil(nSamples / B);
    console.log(`[binaural-js] overlap-add : ${nBlocks} blocs × ${nHoa} canaux HOA…`);

    const xBuf   = new Float64Array(fftSize);
    const xFreq  = fft.createComplexArray();
    const yLFreq = fft.createComplexArray();
    const yRFreq = fft.createComplexArray();
    const yLTime = fft.createComplexArray();
    const yRTime = fft.createComplexArray();
    const fftSize2 = fftSize * 2;

    for (let b = 0; b < nBlocks; b++) {
        const start = b * B;
        const end   = Math.min(start + B, nSamples);

        yLFreq.fill(0);
        yRFreq.fill(0);

        for (let n = 0; n < nHoa; n++) {
            xBuf.fill(0);
            const ch = hoaChannels[n];
            for (let i = start; i < end; i++) xBuf[i - start] = ch[i];

            fft.realTransform(xFreq, xBuf);
            fft.completeSpectrum(xFreq);

            const hL = HL[n], hR = HR[n];
            for (let k = 0; k < fftSize2; k += 2) {
                const xRe = xFreq[k], xIm = xFreq[k + 1];
                yLFreq[k]     += xRe * hL[k]     - xIm * hL[k + 1];
                yLFreq[k + 1] += xRe * hL[k + 1] + xIm * hL[k];
                yRFreq[k]     += xRe * hR[k]     - xIm * hR[k + 1];
                yRFreq[k + 1] += xRe * hR[k + 1] + xIm * hR[k];
            }
        }

        fft.inverseTransform(yLTime, yLFreq);
        fft.inverseTransform(yRTime, yRFreq);

        // Overlap-add (partie réelle, normalisée par fftSize)
        const limit = Math.min(start + fftSize, nOut);
        for (let i = start, j = 0; i < limit; i++, j++) {
            outL[i] += yLTime[j * 2] / fftSize;
            outR[i] += yRTime[j * 2] / fftSize;
        }

        if ((b + 1) % 200 === 0 || b === nBlocks - 1) {
            const pct = Math.round((b + 1) / nBlocks * 100);
            console.log(`[binaural-js]   ${b + 1}/${nBlocks} (${pct}%)`);
        }
    }

    return { L: outL, R: outR };
}

// ─── Pipeline principal ───────────────────────────────────────────────────────

/**
 * Rendu HOA AmbiX → stéréo binaural
 *
 * @param {string} ambiXPath  Chemin du fichier AmbiX multichannel WAV
 * @param {string} outPath    Chemin du fichier stéréo binaural WAV de sortie
 * @param {object} opts       { soxPath, soxiPath, sofaPath? }
 */
async function renderHoaBinaural(ambiXPath, outPath, opts = {}) {
    const soxPath  = opts.soxPath  || 'sox';
    const soxiPath = opts.soxiPath || 'soxi';
    const sofaPath = opts.sofaPath || DEFAULT_SOFA;

    if (!fs.existsSync(ambiXPath)) throw new Error(`Fichier AmbiX introuvable : ${ambiXPath}`);
    if (!fs.existsSync(sofaPath))  throw new Error(`Fichier SOFA introuvable : ${sofaPath}\nPour Linux : apt install libmysofa-data`);

    // ── 1. Informations sur le fichier AmbiX ──────────────────────────────────
    console.log(`[binaural-js] analyse : ${path.basename(ambiXPath)}`);
    const { nHoa, srAudio, nSamples } = soxInfo(soxiPath, ambiXPath);
    const order = Math.round(Math.sqrt(nHoa)) - 1;
    console.log(`[binaural-js] AmbiX ${nHoa}ch ordre ${order}, ${nSamples} samples @ ${srAudio} Hz`);

    // ── 2. Décodage AmbiX → raw PCM float32 interleaved ──────────────────────
    console.log(`[binaural-js] décodage AmbiX via SoX…`);
    const rawBuf = await soxDecodeRaw(soxPath, ambiXPath);
    const rawF32 = new Float32Array(rawBuf.buffer, rawBuf.byteOffset, rawBuf.byteLength / 4);
    // Désentrelacement : hoaChannels[n][i] = rawF32[i * nHoa + n]
    const hoaChannels = [];
    for (let n = 0; n < nHoa; n++) {
        const ch = new Float32Array(nSamples);
        for (let i = 0; i < nSamples; i++) ch[i] = rawF32[i * nHoa + n];
        hoaChannels.push(ch);
    }
    console.log(`[binaural-js] décodage terminé (${(rawBuf.byteLength / 1024 / 1024).toFixed(1)} Mo)`);

    // ── 3. Chargement SOFA ────────────────────────────────────────────────────
    console.log(`[binaural-js] chargement SOFA : ${path.basename(sofaPath)}`);
    const { positions, irsFlat, M, irLen, srHrtf } = await loadSofa(sofaPath);
    console.log(`[binaural-js] HRTF ${M} positions, IR ${irLen} @ ${srHrtf} Hz`);

    // ── 4. Rééchantillonnage HRTF si nécessaire ───────────────────────────────
    let irs = irsFlat;
    let irLenFinal = irLen;
    if (srHrtf !== srAudio) {
        console.log(`[binaural-js] rééchantillonnage HRTF ${srHrtf}→${srAudio} Hz…`);
        irLenFinal = Math.round(irLen * srAudio / srHrtf);
        const irsR = new Float64Array(M * 2 * irLenFinal);
        for (let k = 0; k < M; k++) {
            for (let ear = 0; ear < 2; ear++) {
                const src = irsFlat.subarray((k * 2 + ear) * irLen, (k * 2 + ear + 1) * irLen);
                const res = resampleLinear(src, srHrtf, srAudio);
                irsR.set(res.subarray(0, irLenFinal), (k * 2 + ear) * irLenFinal);
            }
        }
        irs = irsR;
    }

    // ── 5. Matrice SH + pseudo-inverse ────────────────────────────────────────
    console.log(`[binaural-js] matrice SH (${M} × ${nHoa})…`);
    const Y = buildShMatrix(positions, nHoa);    // (M, nHoa)
    console.log(`[binaural-js] pseudo-inverse (système ${nHoa} × ${nHoa})…`);
    const D = pseudoInverse(Y, M, nHoa);          // (nHoa, M)

    // ── 6. Filtres HOA-binaural : C[n, ear, i] = Σ_k D[n,k] × irs[k,ear,i]
    //    = matmul(D(nHoa×M), irs_reshape(M × 2*irLen)) → C(nHoa × 2*irLen)
    console.log(`[binaural-js] calcul des filtres de rendu HOA…`);
    const C = matmul(D, nHoa, M, irs, 2 * irLenFinal); // (nHoa, 2*irLen)

    // ── 7. Convolution overlap-add ────────────────────────────────────────────
    const { L, R } = hoaConvolve(hoaChannels, C, nHoa, irLenFinal, nSamples);

    // ── 8. Normalisation (peak ≤ 0.99) ───────────────────────────────────────
    let peak = 0;
    for (let i = 0; i < L.length; i++) {
        const al = Math.abs(L[i]), ar = Math.abs(R[i]);
        if (al > peak) peak = al;
        if (ar > peak) peak = ar;
    }
    if (peak > 0) {
        const g = 0.99 / peak;
        for (let i = 0; i < L.length; i++) { L[i] *= g; R[i] *= g; }
    }

    // ── 9. Encoder et écrire le WAV stéréo ───────────────────────────────────
    console.log(`[binaural-js] encodage WAV stéréo 24-bit…`);
    const encoded = await WavEncoder.encode(
        { sampleRate: srAudio, channelData: [new Float32Array(L), new Float32Array(R)] },
        { bitDepth: 24 }
    );
    fs.writeFileSync(outPath, Buffer.from(encoded));
    console.log(`[binaural-js] ✓  ${path.basename(outPath)}  (${L.length} samples, 24-bit)`);

    return outPath;
}

module.exports = { renderHoaBinaural };
