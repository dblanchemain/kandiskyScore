#!/usr/bin/env python3
"""
HOA AmbiX → Binaural (2ch) via décodage par haut-parleurs virtuels + HRTF KEMAR.
Usage: hoa_binaural.py <input_ambiX.wav> <output_binaural.wav> [sofa_path]
"""
import sys
import math
import numpy as np
import soundfile as sf
import h5py
from scipy.signal import fftconvolve, resample_poly
from math import factorial

DEFAULT_SOFA = '/usr/share/libmysofa/MIT_KEMAR_normal_pinna.sofa'

# ─────────────────────────────────────────────────────────────────
# Harmoniques sphériques réelles, convention ACN / SN3D
# ─────────────────────────────────────────────────────────────────

def sn3d_norm(l, m):
    """Facteur de normalisation SN3D pour l'ordre l, degré m."""
    delta = 1 if m == 0 else 0
    num = factorial(l - abs(m))
    den = factorial(l + abs(m))
    return math.sqrt((2 - delta) * num / den)

def assoc_legendre(l, m, x):
    """Polynôme de Legendre associé P_l^|m|(x) (semi-normalisation scipy)."""
    # Utilise la récurrence directe pour rester indépendant de scipy.special.lpmv
    am = abs(m)
    # P_am^am(x) = (-1)^am * (2am-1)!! * (1-x^2)^(am/2)
    Pmm = 1.0
    if am > 0:
        sx = math.sqrt(max(0.0, 1.0 - x * x))
        fact = 1.0
        for i in range(1, am + 1):
            Pmm *= -fact * sx
            fact += 2.0
    if l == am:
        return Pmm
    Pmm1 = x * (2 * am + 1) * Pmm
    if l == am + 1:
        return Pmm1
    Plm = 0.0
    for ll in range(am + 2, l + 1):
        Plm = ((2 * ll - 1) * x * Pmm1 - (ll + am - 1) * Pmm) / (ll - am)
        Pmm = Pmm1
        Pmm1 = Plm
    return Plm

def real_sh_acn(n_acn, az_deg, el_deg):
    """
    Harmonique sphérique réelle Y_n (convention ACN/SN3D).
    n_acn : indice ACN (0-based)
    az_deg : azimut en degrés (0=avant, croissant sens anti-horaire vu du dessus)
    el_deg : élévation en degrés (-90=bas, 0=horizon, +90=zénith)
    """
    l = int(math.isqrt(n_acn))       # ordre
    m = n_acn - l * l - l            # degré (de -l à +l)
    # Colatitude θ (0=zénith, π=nadir)
    theta = math.radians(90.0 - el_deg)
    phi   = math.radians(az_deg)
    cos_theta = math.cos(theta)
    P = assoc_legendre(l, m, cos_theta)
    N = sn3d_norm(l, m)
    if m > 0:
        return N * P * math.sqrt(2) * math.cos(m * phi)
    elif m < 0:
        return N * P * math.sqrt(2) * math.sin(abs(m) * phi)
    else:
        return N * P

# ─────────────────────────────────────────────────────────────────
# Matrice SH (M mesures × N_hoa canaux)
# ─────────────────────────────────────────────────────────────────

def sh_matrix(positions_deg, n_hoa):
    """
    positions_deg : array (M, 2) [az, el] en degrés
    Retourne Y : (M, N_hoa)
    """
    M = len(positions_deg)
    Y = np.zeros((M, n_hoa))
    for k in range(M):
        az, el = positions_deg[k]
        for n in range(n_hoa):
            Y[k, n] = real_sh_acn(n, az, el)
    return Y

# ─────────────────────────────────────────────────────────────────
# Pipeline principal
# ─────────────────────────────────────────────────────────────────

def hoa_to_binaural(in_path, out_path, sofa_path=DEFAULT_SOFA):
    # ── Chargement du fichier AmbiX ────────────────────────────────
    hoa_sig, sr_audio = sf.read(in_path, always_2d=True)  # (samples, N_hoa)
    N_samples, N_hoa  = hoa_sig.shape
    order = int(math.isqrt(N_hoa)) - 1
    print(f"[binaural] AmbiX {N_hoa}ch ordre {order}, {N_samples} samples @ {sr_audio} Hz")

    # ── Chargement SOFA ────────────────────────────────────────────
    with h5py.File(sofa_path, 'r') as f:
        pos  = f['SourcePosition'][:]          # (M, 3) [az, el, r]
        irs  = f['Data.IR'][:]                 # (M, 2, ir_len)
        sr_hrtf = float(f['Data.SamplingRate'][0])

    positions_deg = pos[:, :2]                 # az, el uniquement
    M, _, ir_len  = irs.shape
    print(f"[binaural] HRTF {M} positions, IR {ir_len} @ {sr_hrtf} Hz")

    # ── Rééchantillonnage HRTF si nécessaire ──────────────────────
    if sr_hrtf != sr_audio:
        from math import gcd
        g   = gcd(int(sr_audio), int(sr_hrtf))
        up  = int(sr_audio) // g
        dn  = int(sr_hrtf) // g
        print(f"[binaural] rééchantillonnage HRTF {int(sr_hrtf)}→{int(sr_audio)} Hz ({up}/{dn})")
        irs_r = np.zeros((M, 2, ir_len * up // dn + 1))
        for k in range(M):
            for ear in range(2):
                irs_r[k, ear] = resample_poly(irs[k, ear], up, dn)
        irs   = irs_r
        ir_len = irs.shape[2]

    # ── Matrice SH et décodeur pseudo-inverse ──────────────────────
    print("[binaural] calcul matrice SH …")
    Y = sh_matrix(positions_deg, N_hoa)        # (M, N_hoa)
    # Pseudo-inverse de Y : D = (Y^T Y)^-1 Y^T  →  (N_hoa, M)
    D = np.linalg.lstsq(Y, np.eye(M), rcond=None)[0]  # (N_hoa, M)

    # ── Filtres binaural HOA : C[ear, n] = sum_k D[n,k] * H[k,ear] ──
    # En fréquentiel pour efficacité : (N_hoa, 2, ir_len) dans le domaine temporel
    print("[binaural] calcul des filtres de rendu HOA …")
    # D: (N_hoa, M), irs: (M, 2, ir_len)  →  C: (N_hoa, 2, ir_len)
    C = np.tensordot(D, irs, axes=([1], [0]))  # (N_hoa, 2, ir_len)

    # ── Convolution HOA × filtres → L/R ───────────────────────────
    print("[binaural] convolution …")
    out_len = N_samples + ir_len - 1
    out     = np.zeros((out_len, 2))
    for n in range(N_hoa):
        chan = hoa_sig[:, n]
        for ear in range(2):
            out[:, ear] += fftconvolve(chan, C[n, ear])

    # Normalisation douce (peak ≤ 0.99)
    peak = np.max(np.abs(out))
    if peak > 0.0:
        out *= 0.99 / peak

    sf.write(out_path, out, sr_audio, subtype='PCM_24')
    print(f"[binaural] ✓ {out_path}  ({out_len} samples, 24-bit)")

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Usage: hoa_binaural.py <input.wav> <output.wav> [sofa_path]")
        sys.exit(1)
    sofa = sys.argv[3] if len(sys.argv) > 3 else DEFAULT_SOFA
    hoa_to_binaural(sys.argv[1], sys.argv[2], sofa)
