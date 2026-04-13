// Ce fichier appartient à l'application Kandiskyscore.
// Ce logiciel est sous license GNU.: GPL-3.0-or-later
// Auteur : D.Blanchemain
// ***************************************************** variables globales **************************
// License
// 
// This Architecture section is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 3 of the License, or (at your option) any later version.
// 
// This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License along with this program; If not, see http://www.gnu.org/licenses.var contextAudio=new AudioContext();

// main.js

// Modules de controle du cycle de vie de l'application et de création 
// de fenêtre native de navigateur
const { app, dialog, BrowserWindow, Menu, MenuItem, ipcMain, ipcRenderer, shell } = require('electron');
const url = require('url');
const path = require('path');
const fs = require("fs-extra");
const archiver = require('archiver');
const os = require("os");
const { existsSync } = require("fs");
const tkill = require("tree-kill");

const { WaveFile } = require("wavefile");

const createModule = require('./public/split_wasm.js');
const createMergeModule = require('./public/merge_wasm.js');

//const { AudioContext } = require('web-audio-api');
const WavDecoder = require("wav-decoder");
const WavEncoder = require("wav-encoder");
const wav = require("node-wav");

const FFTModule = require('fft.js'); 

var AudioBuffer = require('audiobuffer');
const { exec, execSync, spawn , spawnSync} = require("child_process");
const { PDFDocument } = require("pdf-lib");
const util = require("util");
const execAsync = util.promisify(exec);

const baseDir = getBinBaseDir();
const platform = os.platform();
let playState=0;
let playProcess=new Set();

function getBinBaseDir() {
  return app.isPackaged
    ? path.join(process.resourcesPath, "bin")
    : path.join(__dirname, "resources", "bin");
}
function getWam2File(...parts) {
  return app.isPackaged
    ? path.join(process.resourcesPath, 'Wam2', ...parts)
    : path.join(__dirname, 'Wam2', ...parts);
}



function findSoxPath() {
  let localPath;
  switch (platform) {
    case "win32":
      localPath = path.join(baseDir, "win", "sox.exe");
      break;
    case "darwin":
      localPath = path.join(baseDir, "mac", "sox");
      break;
    default:
      localPath = path.join(baseDir, "linux", "sox");
  }

  if (existsSync(localPath)) return localPath;

  // fallback global
  try {
    execSync("sox --version", { stdio: "ignore" });
    return "sox";
  } catch {
    throw new Error(
      `❌ sox introuvable. Place le binaire dans ${baseDir}/[win|mac|linux]/ ou installe-le globalement.`
    );
  }
}

/**
 * Retourne le chemin correct vers le binaire soxi (local ou global)
 */
function findSoxiPath() {
  let localPath;
  switch (platform) {
    case "win32":
      localPath = path.join(baseDir, "win", "soxi.exe");
      break;
    case "darwin":
      localPath = path.join(baseDir, "mac", "soxi");
      break;
    default:
      localPath = path.join(baseDir, "linux", "soxi");
  }
  if (existsSync(localPath)) return localPath;
  return "soxi"; // fallback global
}
/**
 * Retourne le chemin correct vers le binaire play (local ou global)
 */

function findPlayPath() {
  let localPath;
  switch (platform) {
    case "win32":
      localPath = path.join(baseDir, "win", "sox.exe");
      break;
    case "darwin":
      localPath = path.join(baseDir, "mac", "play");
      break;
    default:
      localPath = path.join(baseDir, "linux", "play");
  }

  if (existsSync(localPath)) return localPath;
  return "play"; // fallback global
}


function findRubberbandPath() {
  const baseDir = getBinBaseDir();
  const platform = os.platform();

  let localPath;
  switch (platform) {
    case "win32":
      localPath = path.join(baseDir, "win", "rubberband.exe");
      break;
    case "darwin":
      localPath = path.join(baseDir, "mac", "rubberband");
      break;
    default:
      localPath = path.join(baseDir, "linux", "rubberband");
  }

  if (existsSync(localPath)) return `${localPath}`;
  return "rubberband"; // fallback global
}

function getFFmpegPaths() {
  const platform = process.platform;
  const baseDir = getBinBaseDir();
  const basePath = path.join(process.resourcesPath, "bin");

  let binDir;
  if (platform === "win32") binDir = path.join(baseDir, "win");
  else if (platform === "darwin") binDir = path.join(baseDir, "mac");
  else binDir = path.join(baseDir, "linux");

  const ffmpegPath = path.join(binDir, platform === "win32" ? "ffmpeg.exe" : "ffmpeg");
  const ffplayPath = path.join(binDir, platform === "win32" ? "ffplay.exe" : "ffplay");
  const ffprobePath = path.join(binDir, platform === "win32" ? "ffprobe.exe" : "ffprobe");

  // Vérifie la présence des binaires
  for (const p of [ffmpegPath, ffplayPath, ffprobePath]) {
    if (!fs.existsSync(p)) console.warn("⚠️ Binaire manquant :", p);
  }

  return { ffmpegPath, ffplayPath, ffprobePath };
}
const soxPath = findSoxPath();
const soxiPath = findSoxiPath();
const playPath = findPlayPath();
console.log("playPath",playPath);
const rubberbandPath = findRubberbandPath();
const { ffmpegPath, ffplayPath, ffprobePath } = getFFmpegPaths();
console.log("🎧 Sox détecté :", soxPath,soxiPath,playPath,rubberbandPath,ffmpegPath, ffplayPath, ffprobePath );

function waitForFile(file, timeout = 4000) {
  const start = Date.now();

  return new Promise((resolve, reject) => {
    const check = () => {
      try {
        if (fs.existsSync(file)) {
          const size = fs.statSync(file).size;
          if (size > 44) return resolve();
        }

        if (Date.now() - start > timeout) {
          return reject(new Error("Timeout waiting for " + file));
        }

        setTimeout(check, 40);
      } catch (e) {
        reject(e);
      }
    };
    check();
  });
}
async function callRubberbandCLI(rb, id, mode, inputPath, outputPath, timeRatio, pitchSemitones, timeMapPath = null) {

  const args = [
    '-t', String(timeRatio),
    '-p', String(pitchSemitones),
    '--window-long',
    '--no-transients',
    '--smoothing',
    '--no-threads',
    inputPath,
    outputPath
  ];

  if (timeMapPath) {
    args.push('-M', timeMapPath);
  }

  const wrb = platform === "win"
    ? path.join(process.resourcesPath, 'bin', 'win', 'rubberband.exe')
    : rubberbandPath;

  await new Promise((resolve, reject) => {
    const proc = spawn(wrb, args, { windowsHide: true, cwd: path.dirname(wrb) });

    //proc.stdout.on('data', d => console.log(d.toString()));

    proc.stderr.on('data', d => console.error(d.toString()));

    proc.on('error', reject);
    
    proc.on('close', code => {
      code === 0 ? resolve() : reject(new Error("Rubberband exit " + code));
    });
    
  });
  await waitForFile(outputPath);

  mainWindow.webContents.send("fromMain", "processRubberband;"+id+";"+mode+";"+outputPath);
}
async function autoRubberbandCLI(rb,inputPath, outputPath, timeRatio, pitchSemitones, timeMapPath = null,obj) {
  let cmd = rb+` -t ${timeRatio} -p ${pitchSemitones}  --window-long --no-transients --smoothing --threads "${inputPath}" "${outputPath}"`;
  if (timeMapPath) {
    cmd += ` -M "${timeMapPath}"`;
  }
  const { stdout, stderr } = await execAsync(cmd);
  //if (stderr) console.error("rubberband stderr:", stderr);
  console.log("Rubberband terminé !");
  mainWindow.webContents.send("fromMain", "autoRubberband;"+obj+";"+outputPath);
}
async function checkTimeMapLength(timeMapPath) {
  try {
    const content = await fs.promises.readFile(timeMapPath, "utf8");
    const lines = content
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(line => line.length > 0); // ignore lignes vides

    return lines.length;
  } catch (err) {
    console.error("Erreur de lecture du timeMap :", err);
    return 0;
  }
}
ipcMain.on("audio-buffer", (event, data) => {
  const { sampleRate, numberOfChannels, length, channels, savePath } = data;
  const buffers = channels.map(ch => new Float32Array(ch));

  saveWavFile(savePath, buffers, sampleRate);
});
function saveSerializedAudioBufferToWav(data, outputPath) {
  if (!data || !data.channels) {
    console.error("❌ Données audio invalides :", data);
    return;
  }

  // Reconvertit chaque ArrayBuffer reçu en Float32Array
  const channelData = data.channels.map(ch => new Float32Array(ch));

  const audioData = {
    sampleRate: data.sampleRate,
    channelData,
  };

  WavEncoder.encode(audioData)
    .then(buffer => {
      fs.writeFileSync(outputPath, Buffer.from(buffer));
      console.log("✅ WAV sauvegardé :", outputPath);
    })
    .catch(err => console.error("❌ Erreur encodage :", err));
}
/*
async function saveAudioBufferToWav(audioBuffer, outputPath) {
	//let result= fs.readFileSync(file);
	//let audioBuffer = WavDecoder.decode(result);
	console.log("audioBuffer",atob(audioBuffer))
	/*
  const wavData = await WavEncoder.encode({
    sampleRate: audioBuffer.sampleRate,
    channelData: Array.from({ length: audioBuffer.numberOfChannels }, (_, i) =>
      audioBuffer.getChannelData(i)
    ),
  });

  fs.writeFileSync(outputPath, Buffer.from(wavData));
  console.log("WAV correctement sauvegardé :", outputPath);
  
}
*/

let localFilePath='';
//const Buffer = require("buffer")
var copyFileOutsideOfElectronAsar = function (sourceInAsarArchive, destOutsideAsarArchive) {
    if (fs.existsSync(app.getAppPath() + "/" + sourceInAsarArchive)) {

        // file will be copied
        if (fs.statSync(app.getAppPath() + "/" + sourceInAsarArchive).isFile()) {

            let file = destOutsideAsarArchive; 
            let dir = path.dirname(file);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            fs.writeFileSync(file, fs.readFileSync(app.getAppPath() + "/" + sourceInAsarArchive));

        }

        // dir is browsed
        else if (fs.statSync(app.getAppPath() + "/" + sourceInAsarArchive).isDirectory()) {

            fs.readdirSync(app.getAppPath() + "/" + sourceInAsarArchive).forEach(function (fileOrFolderName) {

                copyFileOutsideOfElectronAsar(sourceInAsarArchive + "/" + fileOrFolderName, destOutsideAsarArchive + "/" + fileOrFolderName);
            });
        }
    }

};
if (fs.existsSync(path.join(app.getPath('appData'), 'kandiskyscore'))) {
  console.log('The directory exists');
} else {
  console.log('The directory does NOT exist');
  fs.mkdir(path.join(app.getPath('appData'), 'kandiskyscore'), (err) => {
    if (err) { 
        return console.error(err); 
    } 
    console.log('Directory created successfully!'); 
	}); 
}
for (const dir of ['Projets', 'Actions']) {
  const dirPath = path.join(app.getPath('home'), 'kandiskyscore', dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Directory ${dir} created successfully!`);
  }
}


if (fs.existsSync(path.join(app.getPath('appData'), 'kandiskyscore', 'config.js'))) {
	 console.log('config');
	}else{
    copyFileOutsideOfElectronAsar('./config.js', path.join(app.getPath('appData'), 'kandiskyscore', 'config.js'));
   }
copyFileOutsideOfElectronAsar('./menuDefaut.js', path.join(app.getPath('appData'), 'kandiskyscore', 'menuDefaut.js'));
const Mn = require(path.join(app.getPath('appData'), 'kandiskyscore', 'menuDefaut.js'));
if (typeof Mstretching === 'undefined') Mstretching = 'Stretching (objet)';
console.log('copy menuDefaut');

const themesPath = app.isPackaged
  ? path.join(process.resourcesPath, 'Themes')
  : path.join(__dirname, 'resources', 'Themes');

// Copie des scripts Ardour vers ~/.config/ardour*/scripts/
const ardourScriptsSrc = app.isPackaged
  ? path.join(process.resourcesPath, 'Scripts', 'Ardour')
  : path.join(__dirname, 'resources', 'Scripts', 'Ardour');
const ardourScripts = ['insertKs3.lua', 'importKandiskyScore2.lua'];
[6, 7, 8].forEach(function(v) {
  const ardourConfigBase = process.platform === 'win32'
    ? path.join(app.getPath('appData'), 'Ardour' + v)
    : path.join(app.getPath('home'), '.config', 'ardour' + v);
  const dest = path.join(ardourConfigBase, 'scripts');
  if (fs.existsSync(ardourConfigBase)) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    ardourScripts.forEach(function(script) {
      const src = path.join(ardourScriptsSrc, script);
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, path.join(dest, script));
        console.log('Ardour script copied: ' + script + ' → ardour' + v);
      }
    });
  }
});



const isMac = process.platform === 'darwin';

let mainWindow ="";
let winConfig =""; 
let winConfigEtat=0;
let winProjetEtat=0;
let winSpatialEtat=0;
let winGraphObjEtat=0;
let winGraphSymbEtat=0;
let winGraphGrpEtat=0;
let winTrajectoireEtat=0;
let winStudioEtat=0;
let winStudio3DEtat=0;
let winSpectrEditEtat=0;
let winAideEtat=0;
let winAproposEtat=0;
let newStudioEtat=0;
let winVueStudio3DEtat=0;
let winDocEtat=0;
let winSpectroEtat=0;
let winMediaExplorerEtat=0;
let winImgViewerEtat=0;
let winHostEtat=0;
let winPro54Etat=0;
let winObxdEtat=0;
let winSpatMassEtat=0;
let winMassWasmEtat=0;
let winSpectWamEtat=0;
let winTrajectoryEtat=0;
let winSvgEtat=0;
let projetName='';
let projetPath=path.join(app.getPath('home'), 'kandiskyscore', 'Projets');
let audioPath=path.join(app.getPath('home'), 'kandiskyscore', 'Projets');
let imgPath=path.join(app.getPath('home'), 'kandiskyscore', 'Projets');
let editor='libreoffice --draw';
let editAudioCmd='audacity';
let daw=0;
let cmdDaw=path.join(app.getPath('home'), 'Reaper', 'reaper_linux_x86_64', 'REAPER', 'reaper');
let pdfPage=1;
let pdfLandscape=1;
let pdfScale=1;
let pdfMgTop=0.2;
let pdfMgBot=0.2;
let pdfMgLeft=0.2;
let pdfMgRight=0.2;
let pdfBkg=0;

let currentProjet=path.join(app.getPath('home'), 'kandiskyscore', 'Projets');
app.disableHardwareAcceleration();
const createWindow = () => {
  // Création de la fenêtre de navigateur.
  mainWindow = new BrowserWindow({
    width: 1510,
    height: 870,
    useContentSize: true,
    webPreferences: {
    	nodeIntegration: false, // is default value after Electron v5
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      preload: path.join(__dirname, 'preload.js'),
      sandbox: false
    }
    
  });

  // et chargement de l'index.html de l'application.
  mainWindow.loadFile('index.html');
  ipcMain.handle('ping', () =>  mainWindow.getSize());
  
  // Ouvrir les outils de développement (mode dev uniquement).
  if (!app.isPackaged) mainWindow.webContents.openDevTools();
  
	mainWindow.on('close', e => { // Line 49
  e.preventDefault();
  dialog.showMessageBox({
    type: 'info',
    buttons: [Qcont, Qok],
    cancelId: 1,
    defaultId: 0,
    title: Qwarning,
    detail: Qquit
  }).then(({ response, checkboxChecked }) => {
    console.log(`response: ${response}`);
    if (response) {
      mainWindow.destroy();
      app.quit();
    }
  });
});  
};
//"../../kandiskyscore/Projets/Projet3/Audios/outfoxing.wav"



function buildSmoothRubberbandTimeMap(tempoCurve, sampleRate, durationSec, totalInFrames, stepSec = 0.1) {
  const lines = [];
  let outTime = 0;

  const tempoAt = (x) => {
    // interpolation linéaire entre deux points de tempoCurve
    for (let i = 1; i < tempoCurve.length; i++) {
      const a = tempoCurve[i - 1];
      const b = tempoCurve[i];
      if (x <= a.x) return a.y;
      if (x < b.x) {
        const t = (x - a.x) / (b.x - a.x);
        return a.y + t * (b.y - a.y);
      }
    }
    return tempoCurve.at(-1).y;
  };

  lines.push(`0 0`);

  for (let t = stepSec; t <= durationSec; t += stepSec) {
    const y = tempoAt(t);
    outTime += stepSec / y;
    const inFrame = Math.round(t * sampleRate);
    const outFrame = Math.round(outTime * sampleRate);

    if (inFrame > totalInFrames) break;
    lines.push(`${inFrame} ${outFrame}`);
  }

  // dernière ligne exacte
  if (lines.at(-1).split(" ")[0] != totalInFrames.toString()) {
    const lastTempo = tempoAt(durationSec);
    const remaining = (totalInFrames / sampleRate) - durationSec;
    const outExtra = remaining / lastTempo;
    const finalOut = outTime + outExtra;
    lines.push(`${totalInFrames} ${Math.round(finalOut * sampleRate)}`);
  }

  return lines.join("\n");
}


// Cette méthode sera appelée quand Electron aura fini
// de s'initialiser et sera prêt à créer des fenêtres de navigation.
// Certaines APIs peuvent être utilisées uniquement quant cet événement est émit.
app.whenReady().then(async () => {
  if (app.isPackaged) {
    console.log = () => {};
    console.debug = () => {};
  }
  // Charger dynamiquement Rubber Band
 	//await initializeRubberBand();
	//testRubberband().catch(console.error);
  createWindow();
  
  

  app.on('activate', () => {
    // Sur macOS il est commun de re-créer une fenêtre  lors 
    // du click sur l'icone du dock et qu'il n'y a pas d'autre fenêtre ouverte.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
 
const template = [
  
  // Menu principal 
  {
    label: Mfichier,
    submenu: [
    	{ label: Mnew, click: nouveauProjet, accelerator:'CommandOrControl+N'},
    	{ label: Mouvrir, click: openProjet, accelerator:'CommandOrControl+O' },
    	{ type: 'separator' },
    	{ label: Msave,
				click: () => saveDefProjet(), accelerator:'CommandOrControl+S' },
		{ label: MsaveAs,
				click: () => saveDefProjetAs(), accelerator:'CommandOrControl+P' },

		{ label: Mrename,
				click: () => renameProjetAs(), accelerator:'CommandOrControl+R' },
		{ label: Mdel,
				click: () => delProjet(), accelerator:'CommandOrControl+D' },
    	{ type: 'separator' },
    	{ label: Msavegrp,
				click: () => saveDefGrp() },
    	{ label: Mimportgrp,
    	 		click: () => openGrp() },
    	{ type: 'separator' },
    	{ label: Mlisteaudios ,
				click: () => lstAudio() },
    	{ label: Mexport,
      	submenu: [
  				{ label: MexportObj,
					click: () => exportObjetActif() },
     			 { label: MexportGrp,
					click: () => exportGrp() },
      		{ label: MexportInterv,
					click: () => exportIntv()  },
      		{ label: MexportPart,
					click: () => exportPart()  },
  				]
  		 },
		{ label: "ADM",
			submenu: [
				{ label: "Export ADM", click: () => exportAdm() },
				{ label: "Import ADM", click: () => importAdmMenu() }
			]},
		{ label: "HOA",
			submenu: [
				{ label: "Export HOA AmbiX (B-format)", click: () => exportHoaAmbiX() },
				{ label: "Mix HOA AmbiX final", click: () => mixHoaAmbiXFinal() },
				{ label: "Ouvrir dans Reaper (IEM BinauralDecoder)", click: () => exportHoaToReaper() },
				{ label: "Ouvrir dans Reaper (IEM AllRADecoder)", click: () => exportHoaToReaperAllRA() },
				{ label: "Ouvrir dans Ardour (IEM BinauralDecoder)", click: () => exportHoaToArdourBinaural() },
				{ label: "Ouvrir dans Ardour (IEM AllRADecoder)", click: () => exportHoaToArdourAllRA() }
			]},
		{ label: Marchive, click: () => archiveProjet() },
    	{ type: 'separator' },
      isMac ? { role: 'close' } : { role: 'quit' }
    ]
  },
  // { role: 'editMenu' }
  {
    label: Medition,
    submenu: [
      { label: Mcouper,
				click: () => menuPopupCouper()  },
      { label: Mcopier,
				click: () => menuPopupCopier()  },
      { label: Mcoller,
				click: () => menuPopupColler()  },
      { type: 'separator' },
      { label: Mgrouper, click: () => menuPopupGrouper() },
      { label: Mdegrouper, click: () => menuPopupDegrouper() },
      { label: Mregrouper, click: () => menuPopupRegrouper() },
      { label: MtoutDegrouper, click: () => menuPopupToutDegrouper() },
      { type: 'separator' },
      { label: 'Media Explorer',
				click: () => mediaExplorer()  },
		{ label: 'Image viewer',
				click: () => imgViewer()  },  
      { type: 'separator' },
      { label: McouleurGrp,
				click: () => grpColor() },
      { label: MformeGrp,
				click: () => grpForme()  },
		{ label: MscaleGrp,
				click: () => grpScale()  },
      { type: 'separator' },
      { label: Malign,
      	submenu: [
  					{ label: MaGauche,
				click: () => alignLeft()  },
				{ label: MenHaut,
				click: () => alignTop() },
				{ label: MaDroite,
				click: () => alignRight() },
				{ label: MenBas,
				click: () => alignBottom() }
  				]
      },
      { label: Mdeplacement,
      	submenu: [
  				{ label: MtoutBas,
				click: () => toutBas() },
				{ label: MversBas,
				click: () => descendre() },
				{ label: MversHaut,
				click: () => monter() },
				{ label: MtoutHaut,
				click: () => toutHaut() }
  				]
      },
      { type: 'separator' },
      { label: Mzoom,
      	submenu: [
  				{ label: ' 200%',
  				click: () => zoom(200)},
				{ label: ' 175%',
				click: () => zoom(175)},
				{ label: ' 150%',
				click: () => zoom(150) },
				{ label: ' 125%',
				click: () => zoom(125) },
				{ label: ' 100%',
				click: () => zoom(100) },
				{ label: ' 75%',
				click: () => zoom(75) },
				{ label: ' 50%',
				click: () => zoom(50) },
				{ label: ' 25%',
				click: () => zoom(25) }
  				]
      },
      { label: Mwindow,
      	submenu: [
				{ label: ' 200%',
				click: () => dimWin(3020,1788)},
				{ label: ' 175%',
				click: () => dimWin(2642,1564)},
				{ label: ' 150%',
				click: () => dimWin(2265,1341)},
				{ label: ' 125%',
				click: () => dimWin(1887,1117)},
				{ label: ' 100%',
				click: () => dimWin(1510,894) },
				{ label: ' 75%',
				click: () => dimWin(1132,670) },
				{ label: ' 50%',
				click: () => dimWin(755,447) }
  				]
      },
    ]
  },
  // { role: 'Atelier' }
  {
    label: Matelier,
    submenu: [
      { label: MaugDim,
				click: () => augm() },
      { label: Mpermut ,
				click: () => permut() },
      { label: Mpalindrome,
				click: () => defPalindrome()  },
      { label: Minclus,
				click: () => defInclusion() },
      { type: 'separator' },
      { label: Mrenv,
				click: () => defRenvers() },
      { label: Mretro,
				click: () => defRetro()  },
      { label: MrenvRet,
				click: () => defRenvRetro()  },
		{ type: 'separator' },
		{ label: 'MetaMass',
      		click: async () => defSpatMass() },
      { label: 'SpectrEdit',
				click: () => defSpectrEdit() },
		{ label: 'Wam2 Plugins',
      	submenu: [
      		{ label: 'host',
      		click: async () => host() },
      		{ label: 'Synthétiseur',
					submenu: [
						{ label: 'Obxd',
						click: () => sObxd()},
		  				{ label: 'Pro24 synth',
		  				click: () => sPro24()}
  				]
				}
  				]
      },
      { type: 'separator' },
      { label: Mtempo,
				click: () => tempoAudio() },
      { label: Mstretching,
				click: () => stretchingAudio() },
		{ type: 'separator' },
		{ label: "Actions",
				click: () => interp() },
      { label: Mstudio,
				click: () => createStudio() }
    ]
  },
  // { role: 'Rendus' }
  {
    label: Mrendus,
    submenu: [
      { label: Mimgsvg,
      		click: () => renduObjSvg()},
      { label: Mgrpsvg,
      		click: () => renduGrpSvg() },
      { label: Mpartsvg,
      		click: () => renduPartSvg() },
      { label: "pdf",
      		click: () => createPdf() },
      { type: 'separator' },
      { label: Mwaveform,
      		click: () => waveForm() },
      { label: 'Spectrogram',
      		click: async () => spectrogram() },
      { type: 'separator' },
      { label: Mobjetwav,
      		click: () => renduObjet() },
      { label: Mgrpwav,
      		click: () => renduGrp() },
      { label: Mintervwav,
      		click: () => renduIntervalle() },
      { label: Mpartwav,
      		click: () => renduPart() },
    ]
  },
   // { role: 'Outils' }
  {
    label: Mprefs,
    submenu: [
      { label: Mconfig,
				click: () => defProjet() },
		{ label: MsaveTheme,
				click: () => defTheme() },
		{ label: MloadTheme,
				click: () => selectTheme() }
    ]
  },
  // { role: 'Help' }
  {
    label: Mhelp,
    submenu: [
      {
        label: Mdoc,
        click: async () => openDoc() },
      { type: 'separator' },
      {
        label: MApropos,
        click: () => openApropos() }
    ]
  }
];
/*
const template2 = [
  
  // Menu principal 
  {
    label: Mfichier,
    submenu: [
    	{ label: Mnew, click: stdSelect, accelerator:'CommandOrControl+N'},
    	{ label: Mouvrir, click: stdSelect, accelerator:'CommandOrControl+O' },
    	{ type: 'separator' },
    	{ label: Mouvrir, click: saveDsp, accelerator:'CommandOrControl+O' },
    	{ type: 'separator' },
    	{ label: Mouvrir, click: ide, accelerator:'CommandOrControl+O' },
    	{ type: 'separator' },
      isMac ? { role: 'close' } : { role: 'quit' }
    ]
  }
]
*/
const template2 = [
  
  // Menu principal 
  {
    label: Mfichier,
    submenu: [
    	{ label: Mstudio, click: newDefStudio, accelerator:'CommandOrControl+N'},
    	{ label: MStdLoad, click: stdSelect, accelerator:'CommandOrControl+O' },
    	{ type: 'separator' },
    	{ label: MStdSave,
				click: () => defStudio(), accelerator:'CommandOrControl+S' },
		{ type: 'separator' },
		{ label: MIde,
				click: () => ide(), accelerator:'CommandOrControl+P' },
    	{ type: 'separator' },
      isMac ? { role: 'close' } : { role: 'quit' }
    ]
   }
];
// ****************************************************************************************************************
//																	Popup Menu
// ****************************************************************************************************************

const menuPopup = new Menu();
menuPopup.append(new MenuItem({ label: Mcouper,
click: () => menuPopupCouper()},));
menuPopup.append(new MenuItem({ label: Mcopier,
click: () => menuPopupCopier()},));
menuPopup.append(new MenuItem({ label: Mcoller,
click: () => menuPopupColler()},));
menuPopup.append(new MenuItem({ type: 'separator' }));
menuPopup.append(new MenuItem({ label: Mgrouper,
click: () => menuPopupGrouper()},));
menuPopup.append(new MenuItem({ label: Mdegrouper,
click: () => menuPopupDegrouper()},));
menuPopup.append(new MenuItem({ label: MtoutDegrouper,
click: () => menuPopupToutDegrouper()}));

																						  // fonction popup menu
function menuPopupCouper() {
   mainWindow.webContents.send("fromMain", 'couper');
}
function menuPopupCopier() {
   mainWindow.webContents.send("fromMain", 'copier');
}
function menuPopupColler() {
   mainWindow.webContents.send("fromMain", 'coller');
}
function menuPopupGrouper() {
   mainWindow.webContents.send("fromMain", 'grouper');
}
function menuPopupDegrouper() {
   mainWindow.webContents.send("fromMain", 'deGrouper');
}
function menuPopupRegrouper() {
   mainWindow.webContents.send("fromMain", 'reGrouper');
}
function menuPopupToutDegrouper() {
   mainWindow.webContents.send("fromMain", 'toutDeGrouper');
}

ipcMain.on ("showmenu", (event, args) => {									// Affichage du menu popup
	console.log(`Restore ${args} 1 from param`);
    const winMenu = BrowserWindow.fromWebContents(event.sender);
  	 menuPopup.popup(winMenu);
});
function autoFileSave(event,filePath,audioData) {
	const buffer = Buffer.from(audioData);
	fs.writeFile(filePath, buffer, (err) => {
				       if (err) throw err;
		    console.log('Saved! '+filePath);
				    });
}

ipcMain.on ("saveAudio", (event, ...args) => {									// Affichage du menu popup
	console.log(`Save`+ args[1] +` from param`);
    autoFileSave(event,args[1],args[2]);
});

// ── Export ADM en streaming (RF64 pour les gros fichiers) ────────────────────
let admStream = null;

ipcMain.handle('adm-stream-start', async (event, { filePath, sampleRate, channelCount, totalSamples, axmlLength, chnaData }) => {
	try {
		fs.mkdirSync(path.dirname(filePath), { recursive: true });
		const chnaDataBuf  = Buffer.from(chnaData);
		const chnaDataSize = chnaDataBuf.length;
		const dataStart    = 80 + chnaDataSize;
		const pcmDataSize  = totalSamples * channelCount * 2;
		const totalSize    = dataStart + 8 + pcmDataSize + 8 + axmlLength;
		const isRF64       = totalSize > 0xFFFFFFFF;

		const fd  = fs.openSync(filePath, 'w');
		const hdr = Buffer.alloc(80);

		if (isRF64) {
			hdr.write('RF64', 0);
			hdr.writeUInt32LE(0xFFFFFFFF, 4);
			hdr.write('WAVE', 8);
			hdr.write('ds64', 12);
			hdr.writeUInt32LE(28, 16);
			const riffSize = totalSize - 8;
			hdr.writeUInt32LE(riffSize >>> 0, 20);
			hdr.writeUInt32LE(Math.floor(riffSize / 0x100000000), 24);
			hdr.writeUInt32LE(pcmDataSize >>> 0, 28);
			hdr.writeUInt32LE(Math.floor(pcmDataSize / 0x100000000), 32);
			hdr.writeUInt32LE(totalSamples >>> 0, 36);
			hdr.writeUInt32LE(Math.floor(totalSamples / 0x100000000), 40);
			hdr.writeUInt32LE(0, 44);
		} else {
			hdr.write('RIFF', 0);
			hdr.writeUInt32LE((totalSize - 8) >>> 0, 4);
			hdr.write('WAVE', 8);
			hdr.write('JUNK', 12);
			hdr.writeUInt32LE(28, 16);
			// bytes 20-47 : zéros
		}
		// fmt chunk (offset 48)
		hdr.write('fmt ', 48);
		hdr.writeUInt32LE(16, 52);
		hdr.writeUInt16LE(1, 56);
		hdr.writeUInt16LE(channelCount, 58);
		hdr.writeUInt32LE(sampleRate, 60);
		hdr.writeUInt32LE(sampleRate * channelCount * 2, 64);
		hdr.writeUInt16LE(channelCount * 2, 68);
		hdr.writeUInt16LE(16, 70);
		// chna chunk header (offset 72)
		hdr.write('chna', 72);
		hdr.writeUInt32LE(chnaDataSize, 76);

		fs.writeSync(fd, hdr);
		fs.writeSync(fd, chnaDataBuf);

		// data chunk header
		const dataHdr = Buffer.alloc(8);
		dataHdr.write('data', 0);
		dataHdr.writeUInt32LE(isRF64 ? 0xFFFFFFFF : (pcmDataSize >>> 0), 4);
		fs.writeSync(fd, dataHdr);

		admStream = { fd, filePath };
		return { ok: true };
	} catch (e) {
		console.error('adm-stream-start:', e);
		return { ok: false, error: e.message };
	}
});

ipcMain.handle('adm-stream-chunk', async (event, pcmBuffer) => {
	try {
		fs.writeSync(admStream.fd, Buffer.from(pcmBuffer));
		return { ok: true };
	} catch (e) {
		console.error('adm-stream-chunk:', e);
		return { ok: false, error: e.message };
	}
});

ipcMain.handle('adm-stream-end', async (event, { axmlString }) => {
	try {
		const axmlBuf = Buffer.from(axmlString, 'utf8');
		const axmlHdr = Buffer.alloc(8);
		axmlHdr.write('axml', 0);
		axmlHdr.writeUInt32LE(axmlBuf.length, 4);
		fs.writeSync(admStream.fd, axmlHdr);
		fs.writeSync(admStream.fd, axmlBuf);
		fs.closeSync(admStream.fd);
		const filePath = admStream.filePath;
		admStream = null;
		return { ok: true, filePath };
	} catch (e) {
		console.error('adm-stream-end:', e);
		if (admStream) { try { fs.closeSync(admStream.fd); } catch(_) {} admStream = null; }
		return { ok: false, error: e.message };
	}
});

ipcMain.handle('copyGrpAudio', async (event, files, srcDir, destDir) => {
	const results = [];
	for (const file of files) {
		const dest = path.join(destDir, file);
		const src  = path.join(srcDir,  file);
		try {
			await fs.promises.access(dest);
			results.push({ file, copied: false });
		} catch {
			try {
				await fs.promises.copyFile(src, dest);
				results.push({ file, copied: true });
			} catch (e) {
				results.push({ file, copied: false, error: e.message });
			}
		}
	}
	return results;
});

// ── Import ADM ────────────────────────────────────────────────────────────────

function admTimeToSecondsNode(str) {
	const parts = str.split(':');
	return (parseInt(parts[0]) || 0) * 3600
	     + (parseInt(parts[1]) || 0) * 60
	     + (parseFloat(parts[2]) || 0);
}

async function archiveProjet() {
	const projetDir = path.dirname(currentProjet);
	const defaultName = path.basename(projetDir) + '.zip';
	const result = await dialog.showSaveDialog(mainWindow, {
		title: 'Archiver le projet',
		defaultPath: path.join(projetDir, '..', defaultName),
		filters: [{ name: 'Archive ZIP', extensions: ['zip'] }]
	});
	if (result.canceled) return;
	await new Promise((resolve, reject) => {
		const output = fs.createWriteStream(result.filePath);
		const arc = archiver('zip', { zlib: { level: 9 } });
		output.on('close', resolve);
		arc.on('error', reject);
		arc.pipe(output);
		arc.glob('*.xml', { cwd: projetDir });
		arc.glob('**/*', {
			cwd: projetDir,
			ignore: ['Audios/tmp/**', 'Audios/exports/**']
		});
		arc.finalize();
	});
}

async function importAdmMenu() {
	const result = await dialog.showOpenDialog(mainWindow, {
		title: 'Import ADM / BW64',
		filters: [{ name: 'BW64/WAV', extensions: ['wav', 'w64'] }],
		properties: ['openFile']
	});
	if (result.canceled || !result.filePaths.length) return;
	try {
		const data = await parseAndExtractAdm(result.filePaths[0]);
		const encoded = Buffer.from(JSON.stringify(data)).toString('base64');
		mainWindow.webContents.send('fromMain', 'importAdm;' + encoded);
	} catch (e) {
		dialog.showErrorBox('Import ADM', e.message);
	}
}

async function parseAndExtractAdm(filePath) {
	const fd = fs.openSync(filePath, 'r');
	try {
		const fileSize = fs.fstatSync(fd).size;

		// Lire l'en-tête RIFF/RF64+WAVE
		const header = Buffer.alloc(12);
		fs.readSync(fd, header, 0, 12, 0);
		const tag = header.slice(0, 4).toString('ascii');
		if (tag !== 'RIFF' && tag !== 'RF64') throw new Error('Pas un fichier WAV/BW64');
		if (header.slice(8, 12).toString('ascii') !== 'WAVE') throw new Error('Pas un fichier WAVE');

		// Scanner tous les chunks
		const chunks = {};
		let offset = 12;
		let ds64DataSize = null;

		while (offset < fileSize - 8) {
			const hdr = Buffer.alloc(8);
			if (fs.readSync(fd, hdr, 0, 8, offset) < 8) break;
			const id = hdr.slice(0, 4).toString('ascii');
			const size32 = hdr.readUInt32LE(4);

			if (id === 'ds64') {
				const d = Buffer.alloc(24);
				fs.readSync(fd, d, 0, 24, offset + 8);
				ds64DataSize = Number(d.readBigUInt64LE(8));
			}

			const actualSize = (id === 'data' && size32 === 0xFFFFFFFF && ds64DataSize !== null)
				? ds64DataSize : size32;
			chunks[id] = { offset: offset + 8, size: actualSize };
			offset += 8 + actualSize;
			if (actualSize % 2 !== 0) offset++;
		}

		// Lire fmt
		const fmtKey = 'fmt ';
		if (!chunks[fmtKey]) throw new Error('Chunk fmt manquant');
		const fmtSize = Math.min(chunks[fmtKey].size, 40);
		const fmtBuf = Buffer.alloc(fmtSize);
		fs.readSync(fd, fmtBuf, 0, fmtSize, chunks[fmtKey].offset);
		if (fmtBuf.readUInt16LE(0) !== 1) throw new Error('Seul PCM est supporté pour l\'import ADM');
		const channelCount = fmtBuf.readUInt16LE(2);
		const sampleRate   = fmtBuf.readUInt32LE(4);
		const bitsPerSample = fmtBuf.readUInt16LE(14);
		if (channelCount % 2 !== 0) throw new Error('Le fichier doit avoir un nombre pair de canaux (paires stéréo)');
		const bytesPerSample = bitsPerSample / 8;
		const N = channelCount / 2;

		// Lire axml
		if (!chunks['axml']) throw new Error('Chunk axml manquant — ce fichier n\'est pas un ADM BW64');
		const axmlBuf = Buffer.alloc(chunks['axml'].size);
		fs.readSync(fd, axmlBuf, 0, chunks['axml'].size, chunks['axml'].offset);
		const axmlString = axmlBuf.toString('utf8');

		// Extraire start/duration de chaque audioObject via regex
		const aoRe = /<audioObject\b([^>]*)>/g;
		const aoTimings = [];
		let m;
		while ((m = aoRe.exec(axmlString)) !== null) {
			const attrs = m[1];
			const sm = /\bstart="([^"]+)"/.exec(attrs);
			const dm = /\bduration="([^"]+)"/.exec(attrs);
			if (sm && dm) {
				aoTimings.push({
					startSec: admTimeToSecondsNode(sm[1]),
					durSec:   admTimeToSecondsNode(dm[1])
				});
			}
		}

		const nObjects = Math.min(N, aoTimings.length);
		if (nObjects === 0) throw new Error('Aucun audioObject trouvé dans le fichier ADM');

		// Extraire les fichiers WAV stéréo
		const files = extractStereoChannels(
			fd, chunks['data'].offset, chunks['data'].size,
			channelCount, bytesPerSample, sampleRate, aoTimings.slice(0, nObjects)
		);

		const objects = aoTimings.slice(0, nObjects).map((t, i) => ({
			file:     files[i],
			startSec: t.startSec,
			durSec:   t.durSec
		}));

		return { sampleRate, objects, axml: axmlString };
	} finally {
		fs.closeSync(fd);
	}
}

function extractStereoChannels(fd, dataOffset, dataSize, channelCount, bytesPerSample, sampleRate, aoTimings) {
	const N = aoTimings.length;
	const bytesPerFrame = channelCount * bytesPerSample;
	const CHUNK_FRAMES = 65536;
	const totalFrames = Math.floor(dataSize / bytesPerFrame);

	const filenames = [], outFds = [], outDataSizes = [];

	for (let n = 0; n < N; n++) {
		const fname = 'adm_import_' + String(n + 1).padStart(2, '0') + '.wav';
		filenames.push(fname);
		const outFd = fs.openSync(path.join(audioPath, fname), 'w');
		outFds.push(outFd);
		outDataSizes.push(0);

		const wavHdr = Buffer.alloc(44);
		wavHdr.write('RIFF', 0);
		wavHdr.writeUInt32LE(0, 4);
		wavHdr.write('WAVE', 8);
		wavHdr.write('fmt ', 12);
		wavHdr.writeUInt32LE(16, 16);
		wavHdr.writeUInt16LE(1, 20);
		wavHdr.writeUInt16LE(2, 22);
		wavHdr.writeUInt32LE(sampleRate, 24);
		wavHdr.writeUInt32LE(sampleRate * 2 * bytesPerSample, 28);
		wavHdr.writeUInt16LE(2 * bytesPerSample, 32);
		wavHdr.writeUInt16LE(bytesPerSample * 8, 34);
		wavHdr.write('data', 36);
		wavHdr.writeUInt32LE(0, 40);
		fs.writeSync(outFd, wavHdr);
	}

	// Extraire chaque paire de canaux stéréo (trim silence : extraction depuis startFrame)
	const readBuf = Buffer.alloc(CHUNK_FRAMES * bytesPerFrame);
	for (let n = 0; n < N; n++) {
		const startFrame = Math.min(Math.round(aoTimings[n].startSec * sampleRate), totalFrames);
		const durFrame   = Math.round(aoTimings[n].durSec * sampleRate);
		const endFrame   = Math.min(startFrame + durFrame, totalFrames);
		const ch0 = n * 2;
		let f = startFrame;

		while (f < endFrame) {
			const framesToRead = Math.min(endFrame - f, CHUNK_FRAMES);
			const bytesRead = fs.readSync(fd, readBuf, 0, framesToRead * bytesPerFrame,
			                              dataOffset + f * bytesPerFrame);
			if (bytesRead === 0) break;
			const framesRead = Math.floor(bytesRead / bytesPerFrame);
			const outBuf = Buffer.alloc(framesRead * 2 * bytesPerSample);
			let p = 0;
			for (let i = 0; i < framesRead; i++) {
				const base = i * bytesPerFrame;
				for (let b = 0; b < bytesPerSample; b++)
					outBuf[p++] = readBuf[base + ch0 * bytesPerSample + b];
				for (let b = 0; b < bytesPerSample; b++)
					outBuf[p++] = readBuf[base + (ch0 + 1) * bytesPerSample + b];
			}
			fs.writeSync(outFds[n], outBuf);
			outDataSizes[n] += outBuf.length;
			f += framesRead;
		}
	}

	// Corriger les tailles dans les en-têtes WAV
	const sizeBuf = Buffer.alloc(4);
	for (let n = 0; n < N; n++) {
		sizeBuf.writeUInt32LE(outDataSizes[n] + 36, 0);
		fs.writeSync(outFds[n], sizeBuf, 0, 4, 4);
		sizeBuf.writeUInt32LE(outDataSizes[n], 0);
		fs.writeSync(outFds[n], sizeBuf, 0, 4, 40);
		fs.closeSync(outFds[n]);
	}

	return filenames;
}

ipcMain.handle('playDirectFile', async (event, mode, filePath, soxParams) => {
    if (winStudioEtat == 1) {
        winStudio.webContents.send("fromMain", "endEvtAudio");
    }
    let proc;
    if (os.platform() === "win32") {
        const extraArgs = (soxParams || "").match(/(?:[^\s"]+|"[^"]*")+/g) || [];
        const args = [filePath, "-t", "waveaudio", "-d", ...extraArgs];
        proc = spawn(soxPath, args, { shell: false });
    } else {
        proc = spawn(playPath, [filePath, soxParams], {
            shell: true,
            stdio: "ignore",
            env: process.env
        });
    }
    if (!proc) {
        console.error("playDirectFile: impossible de lancer le lecteur audio");
        return;
    }
    playProcess.add(proc);
    if (proc.stderr) {
        proc.stderr.on("data", data => console.error("playDirectFile stderr:", data.toString()));
    }
    proc.on("exit", (code) => {
        playProcess.delete(proc);
        if (mode == 0) {
            mainWindow.webContents.send("fromMain", "playStop;");
            if (winSpatMassEtat == 1) {
                winSpatMass.webContents.send("fromMain", "playStop;");
            }
        }
    });
});

ipcMain.handle('saveAudioTempo', async (event, filePath, arrayBuffer) => {
  try {
    const fullPath = path.resolve(filePath);
    const buffer = Buffer.from(arrayBuffer);

    // ✅ On attend la fin complète de l'écriture
    await fs.promises.writeFile(fullPath, buffer);

    console.log("✅ WAV sauvegardé :", fullPath);

    // ✅ Vérification que le fichier existe et a une taille > 0
    const stats = await fs.promises.stat(fullPath);
    if (stats.size === 0) throw new Error("Le fichier est vide après écriture.");

    // ✅ On renvoie explicitement la confirmation
    return { success: true, path: fullPath, size: stats.size };

  } catch (err) {
    console.error("❌ Erreur lors de la sauvegarde du WAV :", err);
    throw err;
  }
});


ipcMain.on("save-File", (event, { filename, data }) => {
  const savePath = path.join(app.getPath('home'), 'kandiskyscore', filename);
  console.log(savePath);
	
  dialog.showSaveDialog({
        title: 'Select the File Path to save',
        defaultPath: path.join(app.getPath('home'), 'kandiskyscore', 'Projets', projetName),
        buttonLabel: 'Save',
        // Restricting the user to only Text Files.

    }).then(file => {
        // Stating whether dialog operation was cancelled or not.
        console.log(file.canceled);
        if (!file.canceled) {
            console.log(file.filePath.toString());
            
            currentProjet=file.filePath.toString();
            // Creating and Writing to the sample.txt file
            fs.writeFile(file.filePath.toString(), 
                         data, function (err) {
                if (err) throw err;
                console.log('État sauvegardé dans', savePath);
            });
        }
    }).catch(err => {
        console.log(err);
    });  
  
});
//******************************************audio tempo ***********************************************************

async function playRubberBand(filePath, tempoFoo = 1.0) {
  const data = await fs.readFile(filePath);
  const audioCtx = new AudioContext();
  const audioBuffer = await audioCtx.decodeAudioData(data.buffer);

  const rb = await RubberBandWasm();
  const stretcher = new rb.RubberBandStretcher(
    audioBuffer.sampleRate,
    audioBuffer.numberOfChannels,
    rb.OptionProcessRealTime | rb.OptionPitchHighQuality
  );

  const channels = [];
  for (let ch = 0; ch < audioBuffer.numberOfChannels; ch++) {
    channels.push(audioBuffer.getChannelData(ch));
  }

  stretcher.setTempoChange(tempoFoo);
  stretcher.process(channels);

  const outChannels = stretcher.retrieve();
  const outLen = outChannels[0].length;

  const outBuffer = new Float32Array(outLen * audioBuffer.numberOfChannels);
  for (let ch = 0; ch < audioBuffer.numberOfChannels; ch++) {
    const chData = outChannels[ch];
    for (let i = 0; i < outLen; i++) {
      outBuffer[i * audioBuffer.numberOfChannels + ch] = chData[i];
    }
  }

  return {
    buffer: outBuffer.buffer,
    sampleRate: audioBuffer.sampleRate,
    channels: audioBuffer.numberOfChannels,
  };
}

// Listener IPC "process-audio"
ipcMain.on("process-audio", async (event, args) => {
  try {
    const result = await playRubberBand(args.filePath, args.tempo);
    event.sender.send("process-audio-done", result);
  } catch (err) {
    event.sender.send("process-audio-done", { error: err.message });
  }
});

// ****************************************************************************************************************
//																	Menu principal
// ****************************************************************************************************************
function winDefSvg(obj,mode) {
	if(winSvgEtat==1){
		winSvg.destroy();
  			winSvgEtat=0;
	}
	winSvg = new BrowserWindow({width:800,height:640,alwaysOnTop:false,
	webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            enableRemoteModule: false, // turn off remote
            preload: path.join(__dirname, 'preload.js')
        }
	});
	winSvg.loadFile('winSvg.html');
	winSvg.removeMenu();
	//winSvg.setMenu(menu2)
	if (!app.isPackaged) winSvg.webContents.openDevTools()
	winSvgEtat=1;
	winSvg.webContents.on('did-finish-load', function() { //					On attend que la fenêtre soit totalement chargée
 		winSvg.webContents.send("fromMain", "defSvg;"+obj+";"+mode);
  		});

	winSvg.on('close', e => { 		//													Contrôle à la fermeture de la fenêtre
   e.preventDefault();
   
  winSvg.destroy();
  winSvgEtat=0;
  }); 
}


function newDefStudio() {
	newStudio.webContents.send("fromMain", 'newStudio');
}
function createStudio() {
	if(newStudioEtat==0){
		newStudio= new BrowserWindow({width:1110,height:950,
		webPreferences: {
	            nodeIntegration: true,
	            contextIsolation: true,
	            enableRemoteModule: false, // turn off remote
	            preload: path.join(__dirname, 'preload.js')
	        }
		});
		newStudio.loadFile('studioCreate.html');
		newStudio.setMenu(menu2);
		if (!app.isPackaged) newStudio.webContents.openDevTools()
		newStudioEtat=1;
		

		newStudio.on('close', e => { 		//													Contrôle à la fermeture de la fenêtre
	   e.preventDefault();
	   
	  newStudio.destroy();
	  newStudioEtat=0;
	  if(winVueStudio3DEtat==1){
		 winVueStudio3D.destroy();
  		 winVueStudio3DEtat=0;
	  }
	}); 
	
	}else{
		/*
		dialog.showMessageBox({
	    type: 'info',
	    buttons: [Qok],
	    cancelId: 1,
	    defaultId: 0,
	    title: Qwarning,
	    detail: AlertWinOpen
	  })
	  */
	  //winConfig.destroy()
	  newStudio=0;
		console.log('close createStudio');
	}
}

function copyDefautMenu(lang) {
   copyFileOutsideOfElectronAsar(path.join('Local', lang, 'menu-'+lang+'.js'), path.join(app.getPath('appData'), 'kandiskyscore', 'menuDefaut.js'));
   console.log(path.join('Local', lang, 'menu-'+lang+'.js')+' was copied to '+path.join(app.getPath('appData'), 'kandiskyscore', 'menuDefaut.js'));
    mainWindow.webContents.send("fromMain", 'configSave;'+lang);
//});
}
const menu = Menu.buildFromTemplate(template);								// construction du menu principal
Menu.setApplicationMenu(menu);
app.on("ready", createWindow);

mainWindow.on('resize', function () {
    var size   = mainWindow.getSize();
    var width  = size[0];
    var height = size[1];
    //console.log("width: " + width);
    //console.log("height: " + height);
    mainWindow.webContents.send("fromMain", 'winSize;'+width+','+height);
});

																						  // fonctions menu principal

function nouveauProjet() {
	dialog.showMessageBox({
	    type: 'info',
	    buttons: [Annul, NewProject],
	    cancelId: 1,
	    defaultId: 0,
	    title: Qwarning,
	    detail: Qquit
	  }).then(({ response, checkboxChecked }) => {
	    console.log(`response: ${response}`);
	    if (response) {
	      mainWindow.webContents.send("fromMain", 'newProject;');
	    }
	  });
}
function openProjet() {
	dialog.showMessageBox({
	    type: 'info',
	    buttons: [Annul, NewProject],
	    cancelId: 1,
	    defaultId: 0,
	    title: Qwarning,
	    detail: Qnew
	  }).then(({ response, checkboxChecked }) => {
	    console.log(`response: ${response}`);
	    if (response) {
	      var testfile = dialog.showOpenDialog({
			properties: [
		    'openFile'],
		     defaultPath: app.getPath('home'),
			filters: [
		    { name: 'kandiskyscore', extensions: ['xml'] },
		    { name: 'All Files', extensions: ['*'] }
		  ]
		   }).then(result => {
		   	console.log(result.canceled);
		  		if(!result.canceled){
		  			currentProjet=result.filePaths[0];
		  			mainWindow.webContents.send("fromMain", 'loadProjet;'+result.filePaths);
		  		}
			});
	    }
	  });
}
function openGrp() {
var testfile = dialog.showOpenDialog({
	properties: [
    'openFile'],
     defaultPath: app.getPath('home'),
	filters: [
    { name: 'kandiskyscore', extensions: ['xml'] },
    { name: 'All Files', extensions: ['*'] }
  ]
   }).then(result => {
   	console.log(result.canceled);
  		console.log(result.filePaths);
  		if(!result.canceled){
  			mainWindow.webContents.send("fromMain", 'loadGrp;'+result.filePaths);
  		}
	});
	
}
function renameProjetAs() {
	dialog.showSaveDialog({
        title: 'Select the File Path to save',
        defaultPath: path.join(app.getPath('home'), 'kandiskyscore', 'Projets'),
        buttonLabel: 'Save',
        // Restricting the user to only Text Files.
        filters: [
            {name: 'Kandiskyscore',extensions: ['xml']},
             {name: 'All Files',extensions: ['*']},
             ],
        properties: []
    }).then(file => {
        // Stating whether dialog operation was cancelled or not.
        console.log(file.canceled);
        if (!file.canceled) {
            var base=path.join(app.getPath('home'), 'kandiskyscore', 'Projets', projetName);
            // Creating and Writing to the sample.txt file
            
            if (fs.lstatSync(base).isDirectory()) {
			      fs.copySync(base, file.filePath.toString());
			      fs.rmSync(base, { recursive: true });
			    }
            currentProjet=file.filePath.toString();
            var nm=currentProjet.split('/');
            projetName=nm[nm.length-1];
            mainWindow.webContents.send("fromMain", "renameProjet;"+projetName);
        }
    }).catch(err => {
        console.log(err);
    });
}
function delProjet() {
	dialog.showMessageBox({
	    type: 'info',
	    buttons: [Annul, 'Ok'],
	    cancelId: 1,
	    defaultId: 0,
	    title: Qalerte,
	    detail: Qcontinu
	  }).then(({ response, checkboxChecked }) => {
	    console.log(`response: ${response}`);
	    if (response) {
	    	var base=path.join(app.getPath('home'), 'kandiskyscore', 'Projets', projetName);
	    	if (fs.lstatSync(base).isDirectory()) {
			      fs.rmSync(base, { recursive: true });
			      mainWindow.webContents.send("fromMain", 'newProject;');
			    }
	    }
	  });
}
function defStudio() {
	console.log("saveStudio");
	newStudio.webContents.send("fromMain", 'saveStudio;');
}
function sPro24() {
	winPro54Open();
}
function sObxd() {
	winObxdOpen();
}

// Dans votre main process
ipcMain.handle("readFile", async (event, path) => {
  const data = await fs.promises.readFile(path);
  return data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
});
ipcMain.handle('read-file', async (event, filePath) => {
    try {
      const data = await fs.readFile(filePath);
      return data.buffer;
    } catch (err) {
      console.error('Erreur lors de la lecture du fichier :', err);
      throw err;
    }
  });

// ******************************************************************************************************
async function ide() {
          const { shell } = require('electron');
          await shell.openExternal('https://faustide.grame.fr/');
}
function audioBufferToWav(buffer) {
	//var leftchannel = buffer.getChannelData(0)
	//var rightchannel = buffer.getChannelData(1)
	var recordingLength = buffer.length;
    var leftBuffer = flattenArray(buffer.getChannelData(0), recordingLength); // flattenArray is on GitHub (see below)
var rightBuffer = flattenArray(buffer.getChannelData(1), recordingLength);

// we interleave both channels together
// [left[0],right[0],left[1],right[1],...]
var interleaved = interleave(leftBuffer, rightBuffer); // interleave is on GitHub (see below)

// we create our wav file
var buffer = new ArrayBuffer(44 + interleaved.length * 2);
var view = new DataView(buffer);

// RIFF chunk descriptor
writeUTFBytes(view, 0, 'RIFF');
view.setUint32(4, 44 + interleaved.length * 2, true);
writeUTFBytes(view, 8, 'WAVE');

// FMT sub-chunk
writeUTFBytes(view, 12, 'fmt ');
view.setUint32(16, 16, true);             // chunkSize
view.setUint16(20, 1, true);              // wFormatTag
view.setUint16(22, 2, true);              // wChannels: stereo (2 channels)
view.setUint32(24, sampleRate, true);     // dwSamplesPerSec
view.setUint32(28, sampleRate * 4, true); // dwAvgBytesPerSec
view.setUint16(32, 4, true);              // wBlockAlign
view.setUint16(34, 16, true);             // wBitsPerSample

// data sub-chunk
writeUTFBytes(view, 36, 'data');
view.setUint32(40, interleaved.length * 2, true);

// write the PCM samples
var index = 44;
var volume = 1;
for (var i = 0; i < interleaved.length; i++) {
    view.setInt16(index, interleaved[i] * (0x7FFF * volume), true);
    index += 2;
}

// our final blob
var blob = new Blob([view], { type: 'audio/wav' });
}
function flattenArray(channelBuffer, recordingLength) {
   var result = new Float32Array(recordingLength);
   var offset = 0;
   for (var i = 0; i < channelBuffer.length; i++) {
       var buffer = channelBuffer[i];
       result.set(buffer, offset);
       offset += buffer.length;
   }
   return result;
 }

function interleave(leftChannel, rightChannel) {
   var length = leftChannel.length + rightChannel.length;
   var result = new Float32Array(length);

   var inputIndex = 0;

   for (var index = 0; index < length;) {
       result[index++] = leftChannel[inputIndex];
       result[index++] = rightChannel[inputIndex];
       inputIndex++;
   }
   return result;
}

 function writeUTFBytes(view, offset, string) {
   for (var i = 0; i < string.length; i++) {
       view.setUint8(offset + i, string.charCodeAt(i));
   }
 }
function saveAudioObjet(dest,buf) {
	/*
//const wav = new Blob([buf], { type: "audio/wav" });
	//var nbuf2=Buffer.from(nbuf)
	//console.log("blob",wav.size)
	fs.writeFile(dest, 
		 buf, function (err) {
		    if (err) throw err;
		    console.log('Saved!')
		})
*/
console.log("blob",buf.size);

//var blob =new Blob([buf], { type: 'audio/wav' });

 fs.writeFile(dest, 
		Buffer.from(buf), function (err) {
		    if (err) throw err;
		    console.log('Saved!');
		});
}
// **************************************************************************************************************
function saveConfig(txt) {
	var npath=path.join(app.getPath('appData'),'kandiskyscore','config.js');
	fs.writeFile(npath, 
                   atob(txt), function (err) {
          if (err) throw err;
          console.log('Saved at',npath);
      });
}
function saveModifProjet(txt) {
	if(currentProjet==""){
		saveModifProjetAs(txt);
	}else{
		var dest=currentProjet;
		fs.writeFile(dest, 
                   aenu(txt), function (err) {
          if (err) throw err;
          console.log('Saved at',currentProjet);
      });
	}
}
function saveModifProjetAs(txt) {
	dialog.showSaveDialog({
        title: 'Select the File Path to save',
        defaultPath: path.join(app.getPath('home'), 'kandiskyscore', 'Projets', projetName),
        buttonLabel: 'Save',
        // Restricting the user to only Text Files.
        filters: [
            {name: 'Kandiskyscore',extensions: ['xml']},
             {name: 'All Files',extensions: ['*']},
             ],
        properties: []
    }).then(file => {
        // Stating whether dialog operation was cancelled or not.
        console.log(file.canceled);
        if (!file.canceled) {
            console.log(file.filePath.toString());
            
            console.log(file.filePath.toString());
            currentProjet=file.filePath.toString();
            // Creating and Writing to the sample.txt file
            fs.writeFile(file.filePath.toString(), 
                         aenu(txt), function (err) {
                if (err) throw err;
                console.log('Saved!');
            });
        }
    }).catch(err => {
        console.log(err);
    });
}
function stdSelect() {
   var rt="";
	var themeFile = dialog.showOpenDialog({
	properties: [
    'openFile'],
   defaultPath: path.join(app.getPath('appData'), 'kandiskyscore', 'Dsp'),
	filters: [
	 { name: 'Studio', extensions: ['std'] },
    { name: 'All Files', extensions: ['*'] }
   ]
   }).then(result => {
   	if(result.canceled==false){
   		rt=result.filePaths[0];
   	}
  		newStudio.webContents.send("fromMain", "loadStudio;"+result.filePaths[0]);
	});
}
function getExecutableDir() {
  if (app.isPackaged) {
    // PROD : dossier de l'exécutable
    return path.dirname(process.execPath);
  } else {
    // DEV : racine du projet
    return process.cwd();
  }
}
function dspSave(txtHtml,txt,dsp,fjson) {
	console.log(app.getAppPath(),getExecutableDir());
	dialog.showSaveDialog({
        title: 'Select the File Path to save',
        defaultPath: path.join( getExecutableDir(), 'resources','Dsp/',projetName),
        buttonLabel: 'Save',
        // Restricting the user to only Text Files.
        filters: [
             {name: 'All Files',extensions: ['*']},
             ],
       properties: [
    'saveFile'],
	filters: [
	 { name: 'Studio', extensions: ['std'] },
    { name: 'All Files', extensions: ['*'] }
   ]
    }).then(file => {
        // Stating whether dialog operation was cancelled or not.
        console.log(file.canceled);
        if (!file.canceled) {
            console.log(file.filePath.toString());
            currentProjet=file.filePath.toString();
            // Creating and Writing to the sample.txt file
            var gfile=file.filePath.toString().split("/");
            var dfile=gfile[gfile.length-1].split(".");
            var path="";
            for(let i=0;i<gfile.length-1;i++){
            	path=path+gfile[i]+'/';
            }
            varfile1=path+dfile[0]+".html";
            varfile2=path+dfile[0]+".std";
            varfile3=path+dfile[0]+".dsp";
            varfile4=path+dfile[0]+".json";
            console.log("dsp file",file.filePath,dfile,varfile1,varfile2,varfile3);
            var ndsp="declare name        \""+dfile[0]+"\";\n"+atob(dsp);
            fs.writeFile(varfile1.toString(), 
                         atob(txtHtml), function (err) {
                if (err) throw err;
                console.log('Saved html!');
            });
            fs.writeFile(varfile2.toString(), 
                         atob(txt), function (err) {
                if (err) throw err;
                console.log('Saved std!');
            });
            fs.writeFile(varfile3.toString(), 
                         ndsp, function (err) {
                if (err) throw err;
                console.log('Saved dsp!');
            });
            ndsp='{ \n\
	"name":"'+dfile[0]+'",\n\
	"speakers":[\n';
	console.log("json",JSON.parse(fjson));
	ndsp=ndsp+JSON.parse(fjson);
            fs.writeFile(varfile4.toString(), 
                        ndsp, function (err) {
                if (err) throw err;
                console.log('Saved json!');
            });
        }
    }).catch(err => {
        console.log(err);
    });
}
function saveTheme(txt) {
	dialog.showSaveDialog({
        title: 'Select the File Path to save',
        defaultPath: themesPath,
        // defaultPath: path.join(__dirname, '../assets/'),
        buttonLabel: 'Save',
        // Restricting the user to only Text Files.
        filters: [
             {name: 'All Files',extensions: ['*']},
             ],
        properties: []
    }).then(file => {
        // Stating whether dialog operation was cancelled or not.
        console.log(file.canceled);
        if (!file.canceled) {
            console.log(file.filePath.toString());
            currentProjet=file.filePath.toString();
            // Creating and Writing to the sample.txt file
            fs.writeFile(file.filePath.toString(), 
                         atob(txt), function (err) {
                if (err) throw err;
                console.log('Saved!');
            });
        }
    }).catch(err => {
        console.log(err);
    });
}
function saveSvgAs(txt) {
	dialog.showSaveDialog({
        title: 'Select the File Path to save',
       defaultPath: path.join(app.getPath('home'), 'kandiskyscore', 'Projets', projetName, 'Images'),
        // defaultPath: path.join(__dirname, '../assets/'),
        buttonLabel: 'Save',
        // Restricting the user to only Text Files.
        filters: [
            {name: 'svg',extensions: ['svg']},
             {name: 'All Files',extensions: ['*']},
             ],
        properties: []
    }).then(file => {
        // Stating whether dialog operation was cancelled or not.
        console.log('canceled',file.canceled);
        if (!file.canceled) {
            
            fs.writeFile(file.filePath.toString(), 
                         atob(txt), function (err) {
                if (err) throw err;
                console.log('Saved!');
            });
        }
    }).catch(err => {
        console.log(err);
    });
}
function saveDefGrp() {
	mainWindow.webContents.send("fromMain", 'saveGrp');
}
function saveModifGrp(txt) {
	dialog.showSaveDialog({
        title: 'Select the File Path to save',
        defaultPath: path.join(__dirname, '../'),
        // defaultPath: path.join(__dirname, '../assets/'),
        buttonLabel: 'Save',
        // Restricting the user to only Text Files.
        filters: [
            {name: 'Kandiskyscore',extensions: ['xml']},
             {name: 'All Files',extensions: ['*']},
             ],
        properties: []
    }).then(file => {
        // Stating whether dialog operation was cancelled or not.
        console.log(file.canceled);
        if (!file.canceled) {
            console.log(file.filePath.toString());
            currentProjet=file.filePath.toString();
            // Creating and Writing to the sample.txt file
            
            fs.writeFile(file.filePath.toString(), 
                         txt, function (err) {
                if (err) throw err;
                console.log('Saved!');
            });
        }
    }).catch(err => {
        console.log(err);
    });
}
async function nettoyerAudios(utilisesStr) {
	const audioExts=['.wav','.flac','.ogg','.aiff','.aac','.au','.w64','.mp3'];
	const utilises=utilisesStr ? utilisesStr.split(',').filter(f=>f!='') : [];
	let entries=[];
	try { entries=fs.readdirSync(audioPath); } catch(e){ return; }
	const inutilises=entries.filter(f=>{
		const ext=path.extname(f).toLowerCase();
		return audioExts.includes(ext) && utilises.indexOf(f)===-1;
	});
	if(inutilises.length===0){
		dialog.showMessageBox(mainWindow,{type:'info',title:'Nettoyage',message:'Aucun fichier inutilisé dans le dossier audio.',buttons:['Ok']});
		return;
	}
	const res=await dialog.showMessageBox(mainWindow,{
		type:'warning',
		title:'Nettoyage dossier audio',
		message:'Fichiers inutilisés à supprimer :\n\n'+inutilises.join('\n'),
		buttons:['Supprimer','Annuler'],
		defaultId:1,
		cancelId:1
	});
	if(res.response===0){
		inutilises.forEach(f=>{
			try { fs.unlinkSync(path.join(audioPath,f)); } catch(e){ console.error('Erreur suppression',f,e); }
		});
		mainWindow.webContents.send("fromMain","nettoyageOk;"+inutilises.length);
	}
}
function nouvelEspace() {
	const _plt = os.platform();
	const _execName = _plt === 'win32'
		? path.join('kandiskyscore-win32-x64', 'kandiskyscore.exe')
		: _plt === 'darwin'
			? path.join('kandiskyscore-darwin-x64', 'kandiskyscore')
			: path.join('kandiskyscore-linux-x64', 'kandiskyscore');
	exec(path.join(app.getAppPath(), 'out', _execName), (error) => {
    if (error) { console.error(`nouvelEspace error: ${error.message}`); return; }
});
}
function neweditor(cmd) {
	exec(cmd, (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});
}
function saveDefProjet() {
	mainWindow.webContents.send("fromMain", 'saveProjet;0');
}
function saveDefProjetAs() {
	mainWindow.webContents.send("fromMain", 'saveProjet;1');
}


function grpColor(){
   mainWindow.webContents.send("fromMain", 'grpColor');
}
function grpForme(){
   mainWindow.webContents.send("fromMain", 'grpForme');
} 
function grpScale(){
   mainWindow.webContents.send("fromMain", 'grpScale');
} 
function alignTop(){
   mainWindow.webContents.send("fromMain", 'topAlign');
} 
function alignLeft(){
   mainWindow.webContents.send("fromMain", 'leftAlign');
}
function alignBottom(){
   mainWindow.webContents.send("fromMain", 'bottomAlign');
}
function alignRight(){
   mainWindow.webContents.send("fromMain", 'rightAlign');
} 
function descendre(){
   mainWindow.webContents.send("fromMain", 'descendre');
} 
function toutBas(){
   mainWindow.webContents.send("fromMain", 'toutBas');
} 
function monter(){
   mainWindow.webContents.send("fromMain", 'monter');
}
function toutHaut(){
   mainWindow.webContents.send("fromMain", 'toutHaut');
} 
function augm(){
   mainWindow.webContents.send("fromMain", 'augmDim');
}
function permut(){
   mainWindow.webContents.send("fromMain", 'permut');
}
function defPalindrome(){
   mainWindow.webContents.send("fromMain", 'palindrome');
}
function defInclusion(){
   mainWindow.webContents.send("fromMain", 'inclusion');
}
function defRenvers(){
   mainWindow.webContents.send("fromMain", 'renversement');
}
function defRetro(){
   mainWindow.webContents.send("fromMain", 'retrograde');
}
function defRenvRetro(){
   mainWindow.webContents.send("fromMain", 'renvRetro');
}
function zoom(z) {
   mainWindow.webContents.send("fromMain", 'zoom;'+z);
}
function renduObjet(){
	mainWindow.webContents.send("fromMain", 'renduObjet');
}
function renduGrp(){
	mainWindow.webContents.send("fromMain", 'renduGrp');
}
function renduIntervalle(){
	mainWindow.webContents.send("fromMain", 'renduIntervalle');
}

function renduPart(){
	mainWindow.webContents.send("fromMain", 'renduPart');
}
function exportObjetActif(){
	mainWindow.webContents.send("fromMain", 'exportObj');
}
function renduObjSvg(){
	mainWindow.webContents.send("fromMain", 'renduObjSvg');
}

function renduGrpSvg(){
	mainWindow.webContents.send("fromMain", 'renduGrpSvg');
}
function renduPartSvg(){
	mainWindow.webContents.send("fromMain", 'renduPartSvg');
}
function dimWin(zx,zy) {
	mainWindow.setSize(zx,zy);
	mainWindow.webContents.send("fromMain", 'winSize;'+zx+','+zy);
}
function configProjet() {
	mainWindow.webContents.send("fromMain", 'configProjet');
}
function waveForm() {
	mainWindow.webContents.send("fromMain", 'waveForm;0.5;1');
}
function lstAudio() {
	mainWindow.webContents.send("fromMain", 'listeAudios');
}
function exportBlock(block) {
	console.log("block",block);
	dialog.showSaveDialog({
        title: 'Select the File Path to save',
        defaultPath: path.join(__dirname, '../'),
        // defaultPath: path.join(__dirname, '../assets/'),
        buttonLabel: 'Save',
        // Restricting the user to only Text Files.
        filters: [
             {name: 'All Files',extensions: ['*']}
             ],
        properties: []
    }).then(file => {
        // Stating whether dialog operation was cancelled or not.
        console.log(file.canceled);
        if (!file.canceled) {
            console.log(file.filePath.toString());
            currentProjet=file.filePath.toString();
            // Creating and Writing to the sample.txt file
            fs.writeFile(file.filePath.toString(), 
                         atob(block), function (err) {
                if (err) throw err;
                console.log('Saved!');
            });
        }
    }).catch(err => {
        console.log(err);
    });
}
function defExportFile(dir,cmd) {
	dialog.showSaveDialog({
        title: 'Select the File Path to save',
        defaultPath: dir,
        // defaultPath: path.join(__dirname, '../assets/'),
        buttonLabel: 'Save',
        // Restricting the user to only Text Files.
        filters: [
             {name: 'All Files',extensions: ['*']}
             ],
        properties: []
    }).then(file => {
        // Stating whether dialog operation was cancelled or not.
        console.log(file.canceled);
        if (!file.canceled) {
            console.log(cmd,file.filePath.toString());
            fs.renameSync(cmd, file.filePath.toString());
        }
    }).catch(err => {
        console.log(err);
    });
}
function exportSelect(block) {
	console.log("block",block);
  // Stating whether dialog operation was cancelled or not.
  	file=path.join(app.getPath('appData'), 'kandiskyscore', 'autoInsert.txt');
   // Creating and Writing to the sample.txt file
   fs.writeFile(file, 
                atob(block), function (err) {
       if (err) throw err;
       console.log('Saved autoInsert!');
       mainRead3D();
   });
}

function configuration(lang,cmd2,cmd3,cmd4,cmd5,cmd6) {
	if(winProjetEtat==0){
		winProjet = new BrowserWindow({width:840,height:720,
		webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            enableRemoteModule: false, // turn off remote
            preload: path.join(__dirname, 'preload.js')
        }
		});
		winProjet.loadFile('configuration.html');
		winProjet.removeMenu();
		if (!app.isPackaged) winProjet.webContents.openDevTools()
		winProjetEtat=1;
		winProjet.webContents.on('did-finish-load', function() { //					On attend que la fenêtre soit totalement chargée
    		winProjet.webContents.send("fromMain", "defProjet;"+lang+";"+cmd2+";"+cmd3+";"+cmd4+";"+cmd5+";"+cmd6);
  		});
		winProjet.on('close', e => { 		//													Contrôle à la fermeture de la fenêtre
	   e.preventDefault();
	   dialog.showMessageBox({
	    type: 'info',
	    buttons: [Qcont, Qok],
	    cancelId: 1,
	    defaultId: 0,
	    title: Qwarning,
	    detail: Qquit
	  }).then(({ response, checkboxChecked }) => {
	    console.log(`response: ${response}`);
	    if (response) {
	      winProjet.destroy();
	      winProjetEtat=0;
	    }
	  });
	}); 
	}else{
		dialog.showMessageBox({
	    type: 'info',
	    buttons: [Qok],
	    cancelId: 1,
	    defaultId: 0,
	    title: Qwarning,
	    detail: AlertWinOpen
	  });
	}
}
function configClose() {
	winProjet.destroy();
	winProjetEtat=0;
}
function spectrEdit(id,fpath,obj) {
	if(winSpectrEditEtat==0){
		var npath=path.join(audioPath,fpath);
		const spectroOutPath1 = path.join(app.getPath('home'), 'kandiskyscore', 'Projets', 'spectrogram.png');
		exec(`"${soxPath}" "${npath}" -n remix 1 spectrogram -x 2000 -o "${spectroOutPath1}"`, (error, stdout, stderr) => {
		    if (error) {
		        console.error(`error: ${error.message}`);
		        return;
		    }
		    if (stderr) {
		        //console.log(`stderr: ${stderr}`);
		        //return;
		    }
		});
		winSpectrEdit = new BrowserWindow({width:1040,height:840,alwaysOnTop:false,
		webPreferences: {
	            nodeIntegration: true,
	            contextIsolation: true,
	            preload: path.join(__dirname, 'preload.js')
	        }
		});
		winSpectrEdit.loadFile('spectrEdit.html');
		winSpectrEdit.removeMenu();
		if (!app.isPackaged) winSpectrEdit.webContents.openDevTools();
		winSpectrEditEtat=1;
		winSpectrEdit.webContents.on('did-finish-load', function() { //					On attend que la fenêtre soit totalement chargée
    		winSpectrEdit.webContents.send("fromMain", "defObjet;"+id+";"+obj+";"+audioPath+";"+app.getPath('userData'));
  		});

		winSpectrEdit.on('close', e => { 		//													Contrôle à la fermeture de la fenêtre
	   e.preventDefault();
	   
	  winSpectrEdit.destroy();
	  winSpectrEditEtat=0;
	}); 
	
	}else{
		/*
		dialog.showMessageBox({
	    type: 'info',
	    buttons: [Qok],
	    cancelId: 1,
	    defaultId: 0,
	    title: Qwarning,
	    detail: AlertWinOpen
	  })
	  */
	  //winSpectrEdit.destroy()
	  winSpectrEditEtat=0;
		console.log('');
	}
}
function winObjetParam(objId,lang,obj,c,t) {
	if(winConfigEtat==0){
		winConfig = new BrowserWindow({width:410,height:640,alwaysOnTop:true,
		webPreferences: {
	            nodeIntegration: true,
	            contextIsolation: true,
	            enableRemoteModule: false, // turn off remote
	            preload: path.join(__dirname, 'preload.js')
	        }
		});
		winConfig.loadFile('objetParam.html');
		winConfig.removeMenu();
		if (!app.isPackaged) winConfig.webContents.openDevTools()
		winConfigEtat=1;
		winConfig.webContents.on('did-finish-load', function() { //					On attend que la fenêtre soit totalement chargée
    		winConfig.webContents.send("fromMain", "defObjet;"+objId+";"+lang+";"+obj+";"+c+";"+t);
  		});

		winConfig.on('close', e => { 		//													Contrôle à la fermeture de la fenêtre
	   e.preventDefault();
	   
	  winConfig.destroy();
	  winConfigEtat=0;
	}); 
	
	}else{
		/*
		dialog.showMessageBox({
	    type: 'info',
	    buttons: [Qok],
	    cancelId: 1,
	    defaultId: 0,
	    title: Qwarning,
	    detail: AlertWinOpen
	  })
	  */
	  //winConfig.destroy()
	  winConfigEtat=0;
		console.log('');
	}
}
function spatMass(id,obj) {
	if(winSpatMassEtat==0){
		winSpatMass = new BrowserWindow({width:780,height:570,alwaysOnTop:true,
		webPreferences: {
	            nodeIntegration: true,
	            contextIsolation: true,
	            enableRemoteModule: false, // turn off remote
	            preload: path.join(__dirname, 'preload.js')
	        }
		});
		winSpatMass.loadFile('spatMass.html');
		winSpatMass.removeMenu();
		if (!app.isPackaged) winSpatMass.webContents.openDevTools()
		winSpatMassEtat=1;
		winSpatMass.webContents.on('did-finish-load', function() { //					On attend que la fenêtre soit totalement chargée
    		winSpatMass.webContents.send("fromMain", "openSpatMass;"+id+";"+audioPath+";"+obj+";0");
  		});

		winSpatMass.on('close', e => { 		//													Contrôle à la fermeture de la fenêtre
	   e.preventDefault();
	   
	  winSpatMass.destroy();
	  winSpatMassEtat=0;
	  if(winMassWasmEtat==1){
			winMassWasm.destroy();
			winMassWasmEtat=0;
		}
	}); 
	
	}else{
		/*
		dialog.showMessageBox({
	    type: 'info',
	    buttons: [Qok],
	    cancelId: 1,
	    defaultId: 0,
	    title: Qwarning,
	    detail: AlertWinOpen
	  })
	  */
	  //winSpatMass.destroy()
	  winSpatMassEtat=0;
		console.log('');
	}
}
function openMassWasm(id,file,rate) {
	if(winMassWasmEtat==0){
		winMassWasm = new BrowserWindow({width:680,height:530,alwaysOnTop:true,
		webPreferences: {
	            nodeIntegration: true,
	            contextIsolation: true,
	            enableRemoteModule: false, // turn off remote
	            preload: path.join(__dirname, 'preload.js')
	        }
		});
		winMassWasm.loadFile(getWam2File('wam-examples-master', 'packages', 'hostModules', 'host.html'));
		winMassWasm.removeMenu();
		if (!app.isPackaged) winMassWasm.webContents.openDevTools()
		winMassWasmEtat=1;
		winMassWasm.webContents.on('did-finish-load', function() { //					On attend que la fenêtre soit totalement chargée
    		winMassWasm.webContents.send("fromMain", "objsource;"+id+";"+audioPath+";"+url.pathToFileURL(file).href+";"+rate+";0");
  		});

		winMassWasm.on('close', e => { 		//													Contrôle à la fermeture de la fenêtre
	   e.preventDefault();
	   
	  winMassWasm.destroy();
	  winMassWasmEtat=0;
	}); 
	
	}else{
		/*
		dialog.showMessageBox({
	    type: 'info',
	    buttons: [Qok],
	    cancelId: 1,
	    defaultId: 0,
	    title: Qwarning,
	    detail: AlertWinOpen
	  })
	  */
	  //winMassWasm.destroy()
	  winMassWasmEtat=0;
		console.log('');
	}
}
function openSpectWasm(id,file,rate,mode) {
	if(winSpectWamEtat==0){
		winSpectWam = new BrowserWindow({width:680,height:530,alwaysOnTop:true,
		webPreferences: {
	            nodeIntegration: true,
	            contextIsolation: true,
	            enableRemoteModule: false, // turn off remote
	            preload: path.join(__dirname, 'preload.js')
	        }
		});
		winSpectWam.loadFile(getWam2File('wam-examples-master', 'packages', 'hostModules', 'host.html'));
		winSpectWam.removeMenu();
		if (!app.isPackaged) winSpectWam.webContents.openDevTools()
		winSpectWamEtat=1;
		winSpectWam.webContents.on('did-finish-load', function() { //					On attend que la fenêtre soit totalement chargée
    		winSpectWam.webContents.send("fromMain", "objsource;"+id+";"+audioPath+";"+url.pathToFileURL(file).href+";"+rate+";"+mode);
  		});

		winSpectWam.on('close', e => { 		//													Contrôle à la fermeture de la fenêtre
	   e.preventDefault();
	   
	  winSpectWam.destroy();
	  winSpectWamEtat=0;
	}); 
	
	}else{
		/*
		dialog.showMessageBox({
	    type: 'info',
	    buttons: [Qok],
	    cancelId: 1,
	    defaultId: 0,
	    title: Qwarning,
	    detail: AlertWinOpen
	  })
	  */
	  //winSpectWam.destroy()
	  winSpectWamEtat=0;
		console.log('');
	}
}
const menu2 = Menu.buildFromTemplate(template2);


function createWinGraph(id,lang,param,type) {
	if(winGraphObjEtat==0){
		winGraphObj = new BrowserWindow({width:575,height:544,alwaysOnTop:true,
		webPreferences: {
	            nodeIntegration: true,
	            contextIsolation: true,
	            enableRemoteModule: false, // turn off remote
	            preload: path.join(__dirname, 'preload.js')
	        }
		});
		winGraphObj.loadFile('defgraphObj.html');
		winGraphObj.removeMenu();
		if (!app.isPackaged) winGraphObj.webContents.openDevTools()
		winGraphObjEtat=1;
		winGraphObj.webContents.on('did-finish-load', function() { //					On attend que la fenêtre soit totalement chargée
    		winGraphObj.webContents.send("fromMain", "defGraphObjet;"+id+";"+lang+";"+param+";"+type);
  		});
		winGraphObj.on('close', e => { 		//													Contrôle à la fermeture de la fenêtre
	   e.preventDefault();
	   winGraphObj.destroy();
	      winGraphObjEtat=0;
	}); 
	}else{
		dialog.showMessageBox({
	    type: 'info',
	    buttons: [Qok],
	    cancelId: 1,
	    defaultId: 0,
	    title: Qwarning,
	    detail: AlertWinOpen
	  });
	}
}
function createWinSymb(id,lang,param,type) {
	if(winGraphSymbEtat==0){
		winGraphSymb = new BrowserWindow({width:535,height:544,
		webPreferences: {
	            nodeIntegration: true,
	            contextIsolation: true,
	            enableRemoteModule: false, // turn off remote
	            preload: path.join(__dirname, 'preload.js')
	        }
		});
		winGraphSymb.loadFile('defSymbObj.html');
		winGraphSymb.removeMenu();
		if (!app.isPackaged) winGraphSymb.webContents.openDevTools()
		winGraphSymbEtat=1;
		winGraphSymb.webContents.on('did-finish-load', function() { //					On attend que la fenêtre soit totalement chargée
    		winGraphSymb.webContents.send("fromMain", "defGraphObjet;"+id+";"+lang+";"+param+";"+type);
  		});
		winGraphSymb.on('close', e => { 		//													Contrôle à la fermeture de la fenêtre
	   e.preventDefault();
	   dialog.showMessageBox({
	    type: 'info',
	    buttons: [Qcont, Qok],
	    cancelId: 1,
	    defaultId: 0,
	    title: Qwarning,
	    detail: Qquit
	  }).then(({ response, checkboxChecked }) => {
	    console.log(`response: ${response}`);
	    if (response) {
	      winGraphSymb.destroy();
	      winGraphSymbEtat=0;
	    }
	  });
	}); 
	}else{
		dialog.showMessageBox({
	    type: 'info',
	    buttons: [Qok],
	    cancelId: 1,
	    defaultId: 0,
	    title: Qwarning,
	    detail: AlertWinOpen
	  });
	}
}
function createWinGrp(id,lang,param) {
	if(winGraphGrpEtat==0){
		winGraphGrp = new BrowserWindow({width:575,height:544,
		webPreferences: {
	            nodeIntegration: true,
	            contextIsolation: true,
	            enableRemoteModule: false, // turn off remote
	            preload: path.join(__dirname, 'preload.js')
	        }
		});
		winGraphGrp.loadFile('defGrp.html');
		winGraphGrp.removeMenu();
		if (!app.isPackaged) winGraphGrp.webContents.openDevTools()
		winGraphGrpEtat=1;
		winGraphGrp.webContents.on('did-finish-load', function() { //					On attend que la fenêtre soit totalement chargée
    		winGraphGrp.webContents.send("fromMain", "defGrp;"+id+";"+lang+";"+param);
  		});
		winGraphGrp.on('close', e => { 		//													Contrôle à la fermeture de la fenêtre
	   e.preventDefault();
	   dialog.showMessageBox({
	    type: 'info',
	    buttons: [Qcont, Qok],
	    cancelId: 1,
	    defaultId: 0,
	    title: Qwarning,
	    detail: Qquit
	  }).then(({ response, checkboxChecked }) => {
	    console.log(`response: ${response}`);
	    if (response) {
	      winGraphGrp.destroy();
	      winGraphGrpEtat=0;
	    }
	  });
	}); 
	}else{
		dialog.showMessageBox({
	    type: 'info',
	    buttons: [Qok],
	    cancelId: 1,
	    defaultId: 0,
	    title: Qwarning,
	    detail: AlertWinOpen
	  });
	}
}
function createTrajectoire(id,cmd2) {
	if(winTrajectoireEtat==0){
		winTrajectoire = new BrowserWindow({width:650,height:220,
		webPreferences: {
	            nodeIntegration: true,
	            contextIsolation: true,
	            enableRemoteModule: false, // turn off remote
	            preload: path.join(__dirname, 'preload.js')
	        }
		});
		winTrajectoire.loadFile('trajectoire.html');
		winTrajectoire.removeMenu();
		if (!app.isPackaged) winTrajectoire.webContents.openDevTools()
		winTrajectoireEtat=1;
		winTrajectoire.webContents.on('did-finish-load', function() { //					On attend que la fenêtre soit totalement chargée
    		winTrajectoire.webContents.send("fromMain", "deftrajectoire;"+id+";"+cmd2);
  		});
  		winTrajectoire.on('close', e => { 		//													Contrôle à la fermeture de la fenêtre
		   e.preventDefault();
		   winTrajectoire.destroy();
		   winTrajectoireEtat=0;
	   });
	}else{
		dialog.showMessageBox({
	    type: 'info',
	    buttons: [Qok],
	    cancelId: 1,
	    defaultId: 0,
	    title: Qwarning,
	    detail: AlertWinOpen
	  });
	}
}
function createTrajectory(id) {
	if(winTrajectoryEtat==0){
		winTrajectory = new BrowserWindow({width:600,height:320,
		webPreferences: {
	            nodeIntegration: true,
	            contextIsolation: true,
	            enableRemoteModule: false, // turn off remote
	            preload: path.join(__dirname, 'preload.js')
	        }
		});
		winTrajectory.loadFile('trajectory.html');
		winTrajectory.removeMenu();
		if (!app.isPackaged) winTrajectory.webContents.openDevTools()
		winTrajectoryEtat=1;
		winTrajectory.webContents.on('did-finish-load', function() { //					On attend que la fenêtre soit totalement chargée
    		winTrajectory.webContents.send("fromMain", "trajectory;"+id);
  		});
  		winTrajectory.on('close', e => { 		//													Contrôle à la fermeture de la fenêtre
		   e.preventDefault();
		   winTrajectory.destroy();
		   winTrajectoryEtat=0;
	   });
	}else{
		dialog.showMessageBox({
	    type: 'info',
	    buttons: [Qok],
	    cancelId: 1,
	    defaultId: 0,
	    title: Qwarning,
	    detail: AlertWinOpen
	  });
	}
}
function openStudio(X,Y,Z,gain) {
	if(winStudioEtat==0){
		winStudio = new BrowserWindow({width:804,height:604,
		webPreferences: {
	            nodeIntegration: true,
	            contextIsolation: true,
	            enableRemoteModule: false, // turn off remote
	            preload: path.join(__dirname, 'preload.js')
	        }
		});
		winStudio.loadFile('studio.html');
		winStudio.removeMenu();
		if (!app.isPackaged) winStudio.webContents.openDevTools()
		winStudioEtat=1;
		winStudio.webContents.on('did-finish-load', function() { //					On attend que la fenêtre soit totalement chargée
    		//winStudio.webContents.send("fromMain", "drawObjActif;"+X+";"+Y+"+;"+Z+";"+gain);
  		});
  		winStudio.on('close', e => { 		//													Contrôle à la fermeture de la fenêtre
		   e.preventDefault();
		   winStudio.destroy();
		   winStudioEtat=0;
		   mainWindow.webContents.send("fromMain", "studioEnd");
	   });
	}else{
		dialog.showMessageBox({
	    type: 'info',
	    buttons: [Qok],
	    cancelId: 1,
	    defaultId: 0,
	    title: Qwarning,
	    detail: AlertWinOpen
	  });
	}
}
function open3dStudio(X,Y,Z,gain) {
	if(winStudio3DEtat==0){
		winStudio3D = new BrowserWindow({width:864,height:664,
		webPreferences: {
	            nodeIntegration: true,
	            contextIsolation: true,
	            enableRemoteModule: false, // turn off remote
	            preload: path.join(__dirname, 'preload.js')
	        }
		});
		winStudio3D.loadFile('studio3D.html');
		winStudio3D.removeMenu();
		if (!app.isPackaged) winStudio3D.webContents.openDevTools()
		winStudio3DEtat=1;
		winStudio3D.webContents.on('did-finish-load', function() { //					On attend que la fenêtre soit totalement chargée
    		winStudio3D.webContents.send("fromMain", "draw3dObj;"+X+";"+Y+"+;"+Z+";"+gain);
  		});
  		winStudio3D.on('close', e => { 		//													Contrôle à la fermeture de la fenêtre
		   e.preventDefault();
		   winStudio3D.destroy();
		   winStudio3DEtat=0;
	   });
	}else{
		dialog.showMessageBox({
	    type: 'info',
	    buttons: [Qok],
	    cancelId: 1,
	    defaultId: 0,
	    title: Qwarning,
	    detail: AlertWinOpen
	  });
	}
}
function vueStudio3D(lst) {
	if(winVueStudio3DEtat==0){
		winVueStudio3D = new BrowserWindow({width:864,height:664,
		webPreferences: {
	            nodeIntegration: true,
	            contextIsolation: true,
	            enableRemoteModule: false, // turn off remote
	            preload: path.join(__dirname, 'preload.js')
	        }
		});
		winVueStudio3D.loadFile('vueStudio3D.html');
		winVueStudio3D.removeMenu();
		if (!app.isPackaged) winVueStudio3D.webContents.openDevTools()
		winVueStudio3DEtat=1;
		winVueStudio3D.webContents.on('did-finish-load', function() { //					On attend que la fenêtre soit totalement chargée
    		winVueStudio3D.webContents.send("fromMain", "draw3dObj;"+lst);
  		});
  		winVueStudio3D.on('close', e => { 		//													Contrôle à la fermeture de la fenêtre
		   e.preventDefault();
		   winVueStudio3D.destroy();
		   winVueStudio3DEtat=0;
	   });
	}else{
		dialog.showMessageBox({
	    type: 'info',
	    buttons: [Qok],
	    cancelId: 1,
	    defaultId: 0,
	    title: Qwarning,
	    detail: AlertWinOpen
	  });
	}
}
function spatialOpen(objId,cmd2,cmd3,cmd4,cmd5,cmd6,cmd7) {
	
	if(winSpatialEtat==0){
		winSpatial = new BrowserWindow({width:600,height:710,
		webPreferences: {
	            nodeIntegration: true,
	            contextIsolation: true,
	            enableRemoteModule: false, // turn off remote
	            preload: path.join(__dirname, 'preload.js')
	        }
		});
		winSpatial.loadFile('spatialisation.html');
		winSpatial.removeMenu();
		if (!app.isPackaged) winSpatial.webContents.openDevTools()
		winSpatialEtat=1;
		winSpatial.webContents.on('did-finish-load', function() { //					On attend que la fenêtre soit totalement chargée
    		winSpatial.webContents.send("fromMain", "defObjetSpatial;"+objId+";"+cmd2+";"+cmd3+";"+cmd4+";"+cmd5+";"+cmd6+";"+cmd7);
  		});
		
		winSpatial.on('close', e => { 		//													Contrôle à la fermeture de la fenêtre
	   e.preventDefault();
	   dialog.showMessageBox({
	    type: 'info',
	    buttons: [Qcont, Qok],
	    cancelId: 1,
	    defaultId: 0,
	    title: Qwarning,
	    detail: Qquit
	  }).then(({ response, checkboxChecked }) => {
	    console.log(`response: ${response}`);
	    if (response) {
	      winSpatial.destroy();
	      winSpatialEtat=0;
	      if(winTrajectoryEtat==1){
				winTrajectoire.destroy();
				winTrajectoireEtat=0;
			}
	    }
	  });
	}); 
	}else{
		dialog.showMessageBox({
	    type: 'info',
	    buttons: [Qok],
	    cancelId: 1,
	    defaultId: 0,
	    title: Qwarning,
	    detail: AlertWinOpen
	  });
		console.log('');
	}
	
}
function openDoc() {
	if(winDocEtat==0){
		winDoc = new BrowserWindow({width:940,height:900,
		webPreferences: {
	            nodeIntegration: true,
	            contextIsolation: true,
	            enableRemoteModule: false, // turn off remote
	            preload: path.join(__dirname, 'preload.js')
	        }
		});
		winDoc.loadURL('http://blanchemain.info/Documents/Programmation/index.php?page=kandiskyScore');
		winDoc.removeMenu();
		if (!app.isPackaged) winDoc.webContents.openDevTools()
		winDocEtat=1;
  		winDoc.on('close', e => { 		//													Contrôle à la fermeture de la fenêtre
		   e.preventDefault();
		   winDoc.destroy();
		   winDocEtat=0;
	   });
	}
}
function openApropos() {
	if(winAproposEtat==0){
		winApropos = new BrowserWindow({width:420,height:800,resizable:false,
		webPreferences: {
	            nodeIntegration: true,
	            contextIsolation: true,
	            enableRemoteModule: false,
	            preload: path.join(__dirname, 'preload.js')
	        }
		});
		winApropos.loadFile('apropos.html');
		winApropos.removeMenu();
		winAproposEtat=1;
  		winApropos.on('close', e => {
		   e.preventDefault();
		   winApropos.destroy();
		   winAproposEtat=0;
	   });
	}
}
function mediaExplorer() {
	if(winMediaExplorerEtat==0){
		winMediaExplorer = new BrowserWindow({width:900,height:680,alwaysOnTop:true,
		webPreferences: {
	            nodeIntegration: true,
	            contextIsolation: true,
	            enableRemoteModule: false, // turn off remote
	            preload: path.join(__dirname, 'preload.js')
	        }
		});
		winMediaExplorer.loadFile('./mediaExplorer.html');
		winMediaExplorer.removeMenu();
		if (!app.isPackaged) winMediaExplorer.webContents.openDevTools()
		winMediaExplorerEtat=1;
		winMediaExplorer.webContents.on('did-finish-load', function() { //					On attend que la fenêtre soit totalement chargée
    		const toSlash = p => p.split(path.sep).join('/');
    		winMediaExplorer.webContents.send("fromMain", "defParam;"+toSlash(app.getPath('home'))+";"+toSlash(path.join(app.getPath('home'),'kandiskyscore'))+';'+toSlash(currentProjet));
  		});

		winMediaExplorer.on('close', e => { 		//													Contrôle à la fermeture de la fenêtre
	   e.preventDefault();
	   
	  winMediaExplorer.destroy();
	  winMediaExplorerEtat=0;
	}); 
	
	}else{
		/*
		dialog.showMessageBox({
	    type: 'info',
	    buttons: [Qok],
	    cancelId: 1,
	    defaultId: 0,
	    title: Qwarning,
	    detail: AlertWinOpen
	  })
	  */
	  //winGraphicEqua.destroy()
	  winMediaExplorerEtat=0;
		console.log('');
	}
}
function imgViewer() {
	if(winImgViewerEtat==0){
		winImgViewer = new BrowserWindow({width:898,height:530,alwaysOnTop:true,
		webPreferences: {
	            nodeIntegration: true,
	            contextIsolation: true,
	            enableRemoteModule: false, // turn off remote
	            preload: path.join(__dirname, 'preload.js')
	        }
		});
		winImgViewer.loadFile('./imgViewer.html');
		winImgViewer.removeMenu();
		if (!app.isPackaged) winImgViewer.webContents.openDevTools()
		winImgViewerEtat=1;
		winImgViewer.webContents.on('did-finish-load', function() { //					On attend que la fenêtre soit totalement chargée
    		const kandiskyPath = path.join(app.getPath('home'), 'kandiskyscore');
    		const toSlashI = p => p.split(path.sep).join('/');
    		winImgViewer.webContents.send("fromMain", "defParam;"+toSlashI(app.getPath('home'))+";"+toSlashI(kandiskyPath)+";"+toSlashI(currentProjet));
  		});

		winImgViewer.on('close', e => { 		//													Contrôle à la fermeture de la fenêtre
	   e.preventDefault();
	   
	  winImgViewer.destroy();
	  winImgViewerEtat=0;
	}); 
	
	}else{
		/*
		dialog.showMessageBox({
	    type: 'info',
	    buttons: [Qok],
	    cancelId: 1,
	    defaultId: 0,
	    title: Qwarning,
	    detail: AlertWinOpen
	  })
	  */
	  //winGraphicEqua.destroy()
	  winImgViewerEtat=0;
		console.log('');
	}
}
function winPro54Open() {
	if(winPro54Etat==0){
		winPro54 = new BrowserWindow({width:825,height:854,alwaysOnTop:true,
		webPreferences: {
	            nodeIntegration: true,
	            contextIsolation: true,
	            enableRemoteModule: false, // turn off remote
	            preload: path.join(__dirname, 'preload.js')
	        }
		});
		console.log('winPro54Open');
		winPro54.loadFile(getWam2File('wam-examples-master', 'packages', 'Synthe', 'Pro54', 'index.html'));
		winPro54.removeMenu();
		if (!app.isPackaged) winPro54.webContents.openDevTools()
		winPro54Etat=1;
		winPro54.webContents.on('did-finish-load', function() { //					On attend que la fenêtre soit totalement chargée
    		//winPro54.webContents.send("fromMain", "equalizer;"+id+";"+objWav);
  		});

		winPro54.on('close', e => { 		//													Contrôle à la fermeture de la fenêtre
	   e.preventDefault();
	   
	  winPro54.destroy();
	  winPro54Etat=0;
	}); 
	
	}else{
		/*
		dialog.showMessageBox({
	    type: 'info',
	    buttons: [Qok],
	    cancelId: 1,
	    defaultId: 0,
	    title: Qwarning,
	    detail: AlertWinOpen
	  })
	  */
	  //winPro54.destroy()
	  winPro54Etat=0;
		console.log('');
	}
}
function winObxdOpen() {
	if(winObxdEtat==0){
		winObxd = new BrowserWindow({width:825,height:854,alwaysOnTop:true,
		webPreferences: {
	            nodeIntegration: true,
	            contextIsolation: true,
	            enableRemoteModule: false, // turn off remote
	            preload: path.join(__dirname, 'preload.js')
	        }
		});
		console.log('winObxdOpen');
		winObxd.loadFile(getWam2File('wam-examples-master', 'packages', 'Synthe', 'Obxd', 'index.html'));
		winObxd.removeMenu();
		if (!app.isPackaged) winObxd.webContents.openDevTools()
		winObxdEtat=1;
		winObxd.webContents.on('did-finish-load', function() { //					On attend que la fenêtre soit totalement chargée
    		//winObxd.webContents.send("fromMain", "equalizer;"+id+";"+objWav);
  		});

		winObxd.on('close', e => { 		//													Contrôle à la fermeture de la fenêtre
	   e.preventDefault();
	   
	  winObxd.destroy();
	  winObxdEtat=0;
	}); 
	
	}else{
		/*
		dialog.showMessageBox({
	    type: 'info',
	    buttons: [Qok],
	    cancelId: 1,
	    defaultId: 0,
	    title: Qwarning,
	    detail: AlertWinOpen
	  })
	  */
	  //winObxd.destroy()
	  winObxdEtat=0;
		console.log('');
	}
}

function winHostOpen(id,objWav) {
	if(winHostEtat==0){
		winHost = new BrowserWindow({width:835,height:310,alwaysOnTop:true,
		webPreferences: {
	            nodeIntegration: true,
	            contextIsolation: true,
	            enableRemoteModule: false, // turn off remote
	            preload: path.join(__dirname, 'preload.js')
	        }
		});
		winHost.loadFile(getWam2File('wam-examples-master', 'packages', 'hostModules', 'index.html'));
		winHost.removeMenu();
		if (!app.isPackaged) winHost.webContents.openDevTools()
		winHostEtat=1;
		winHost.webContents.on('did-finish-load', function() { //					On attend que la fenêtre soit totalement chargée
    		winHost.webContents.send("fromMain", "equalizer;"+id+";"+audioPath+";"+objWav);
  		});

		winHost.on('close', e => { 		//													Contrôle à la fermeture de la fenêtre
	   e.preventDefault();
	   
	  winHost.destroy();
	  winHostEtat=0;
	}); 
	
	}else{
		/*
		dialog.showMessageBox({
	    type: 'info',
	    buttons: [Qok],
	    cancelId: 1,
	    defaultId: 0,
	    title: Qwarning,
	    detail: AlertWinOpen
	  })
	  */
	  //winHost.destroy()
	  winHostEtat=0;
		console.log('');
	}
}
function tempoAudio() {
	mainWindow.webContents.send("fromMain", "tempoAudio");
}
function stretchingAudio() {
	mainWindow.webContents.send("fromMain", "stretchingAudio");
}
function exportObj(){
	mainWindow.webContents.send("fromMain", "exportObj");
}
function exportGrp(){
	mainWindow.webContents.send("fromMain", "exportGrp");
}

function exportIntv(){
	mainWindow.webContents.send("fromMain", "exportIntv");
}
function exportPart(){
	mainWindow.webContents.send("fromMain", "exportPart");
}
function exportAdm(){
	mainWindow.webContents.send("fromMain", "exportAdm");
}
function exportHoaAmbiX(){
	mainWindow.webContents.send("fromMain", "exportHoaAmbiX");
}
function mixHoaAmbiXFinal(){
	mainWindow.webContents.send("fromMain", "mixHoaAmbiXFinal");
}
function exportHoaToReaper(){
	mainWindow.webContents.send("fromMain", "exportHoaToReaper");
}
function exportHoaToReaperAllRA(){
	mainWindow.webContents.send("fromMain", "exportHoaToReaperAllRA");
}
function exportHoaToArdourBinaural(){
	mainWindow.webContents.send("fromMain", "exportHoaToArdourBinaural");
}
function exportHoaToArdourAllRA(){
	mainWindow.webContents.send("fromMain", "exportHoaToArdourAllRA");
}
function pdfSettings() {
    var option = {
        printSelectionOnly: false,
        printBackground: pdfBkg === 0,
        landscape: pdfLandscape === 1,
        pageSize: pdfPage === 1 ? 'A4' : 'A3',
        margins: {
            marginType: 'custom',
            top: Number(pdfMgTop),
            bottom: Number(pdfMgBot),
            left: Number(pdfMgLeft),
            right: Number(pdfMgRight),
        },
    };
    console.log(option);
    return option;
}

function buildPdfHtml(nbPages) {
    const pageWidth = 1364;
    const pageHeight = 800;
    let pages = '';
    for (let i = 0; i < nbPages; i++) {
        const offset = i * pageWidth;
        pages += `
    <div class="page" style="background-position: -${offset}px 0px;"></div>`;
    }
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  @page {
    margin-top: ${pdfMgTop}in;
    margin-bottom: ${pdfMgBot}in;
    margin-left: ${pdfMgLeft}in;
    margin-right: ${pdfMgRight}in;
    size: ${pdfPage === 1 ? 'A4' : 'A3'} ${pdfLandscape === 1 ? 'landscape' : 'portrait'};
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: ${pdfBkg === 0 ? 'white' : 'transparent'}; }
  .page {
    width: ${pageWidth}px;
    height: ${pageHeight}px;
    background-image: url('./tmpsvg.svg');
    background-repeat: no-repeat;
    break-after: page;
  }
  .page:last-child { break-after: avoid; }
</style>
</head>
<body>${pages}
</body>
</html>`;
}

async function collectProjectPdfPages(projPath) {
    const pdfDir = path.join(path.dirname(currentProjet), 'pdf');
    if (!fs.existsSync(pdfDir)) return { before: [], after: [] };

    const fixed = ['couverture1', 'couverture2', 'dedicace1', 'dedicace2', 'preface1', 'preface2'];
    const before = [];
    for (const name of fixed) {
        const p = path.join(pdfDir, name + '.pdf');
        if (fs.existsSync(p)) before.push(p);
    }
    // Tous les fichiers glossaire*.pdf triés
    const all = await fs.promises.readdir(pdfDir);
    const glossaires = all
        .filter(f => /^glossaire\d*\.pdf$/i.test(f))
        .sort()
        .map(f => path.join(pdfDir, f));
    before.push(...glossaires);

    const after = [];
    for (const name of ['couverture3', 'couverture4']) {
        const p = path.join(pdfDir, name + '.pdf');
        if (fs.existsSync(p)) after.push(p);
    }
    return { before, after };
}

async function mergePdfs(pdfPaths) {
    const merged = await PDFDocument.create();
    for (const p of pdfPaths) {
        try {
            const bytes = await fs.promises.readFile(p);
            const doc = await PDFDocument.load(bytes);
            const pages = await merged.copyPages(doc, doc.getPageIndices());
            for (const page of pages) merged.addPage(page);
        } catch (e) {
            console.error('mergePdfs: impossible de charger', p, e.message);
        }
    }
    return await merged.save();
}

async function svgToPdf(svgPath, projPath) {
    const NB_PAGES = 10;
    const pdfDir = path.join(app.getPath('appData'), 'kandiskyscore', 'pdf');
    const htmlPath = path.join(pdfDir, 'partition.html');
    const scorePdfPath = path.join(pdfDir, 'score.pdf');
    const pdfPath = path.join(pdfDir, 'partition.pdf');

    await fs.promises.mkdir(pdfDir, { recursive: true });

    const html = buildPdfHtml(NB_PAGES);
    await fs.promises.writeFile(htmlPath, html, 'utf8');

    const win = new BrowserWindow({ show: false });
    await win.loadFile(htmlPath);
    // Attendre que les images de fond soient chargées avant l'impression
    await new Promise(resolve => setTimeout(resolve, 300));

    const data = await win.webContents.printToPDF(pdfSettings());
    win.destroy();
    await fs.promises.writeFile(scorePdfPath, data);

    // Fusion avec les pages du dossier pdf du projet
    const { before, after } = await collectProjectPdfPages(projPath || '');
    if (before.length === 0 && after.length === 0) {
        await fs.promises.writeFile(pdfPath, data);
    } else {
        const merged = await mergePdfs([...before, scorePdfPath, ...after]);
        await fs.promises.writeFile(pdfPath, merged);
    }

    shell.openPath(pdfPath);
}
function createPdf(txt) {
	mainWindow.webContents.send("fromMain", "createPdf");
}
function spectrogram() {
	mainWindow.webContents.send("fromMain", "spectrogram");
}

function host() {
	mainWindow.webContents.send("fromMain", "host");
}
function soxSpectrogram(npath) {
	var txt="";
	if(winSpectroEtat==0){
		const spectroOutPath2 = path.join(app.getPath('home'), 'kandiskyscore', 'Projets', 'spectrogram.png');
		exec(`"${soxPath}" "${npath}" -n remix 1 spectrogram -x 2000 -o "${spectroOutPath2}"`, (error, stdout, stderr) => {
		    if (error) {
		        console.error(`error: ${error.message}`);
		        return;
		    }
		    if (stderr) {
		        //console.log(`stderr: ${stderr}`);
		        //return;
		    }
		setTimeout(function(){
		exec(`"${soxPath}" "${npath}" -n stats`, (error, stdout, stderr) => {
		    if (error) {
		        //console.log(`error: ${error.message}`);
		        return;
		    }
		    if (stderr) {
		        //console.log(`stderr: ${stderr}`);
		        //return;
		       //var ntxt=stderr.split(' ').join(' ')
		       var ttxt=stderr.split("\n");
			    
			    var ntxt='';
			    var sr=-1;
			    for(i=0;i<ttxt.length;i++){
			    	sr=ttxt[i].indexOf("sox");
			    	if(sr==-1){
			    		ntxt=ntxt+"    \n"+ttxt[i];
			    	}
			    	sr=-1;
			    }
			    txt="<pre><code>"+ntxt+"</code></pre>";
			    winSpectro = new BrowserWindow({width:920,height:544,
				webPreferences: {
			            nodeIntegration: true,
			            contextIsolation: true,
			            enableRemoteModule: false, // turn off remote
			            preload: path.join(__dirname, 'preload.js')
			        }
				});
				winSpectro.loadFile('spectrogram.html');
				winSpectro.removeMenu();
				if (!app.isPackaged) winSpectro.webContents.openDevTools()
				winSpectroEtat=1;
				winSpectro.webContents.on('did-finish-load', function() { //					On attend que la fenêtre soit totalement chargée
		    		const kandiskyProjetsPath = path.join(app.getPath('home'), 'kandiskyscore', 'Projets');
	    		winSpectro.webContents.send("fromMain", "defSpectro;"+kandiskyProjetsPath+";"+uena(txt)+";"+npath);
		  		});
				winSpectro.on('close', e => { 		//													Contrôle à la fermeture de la fenêtre
			   e.preventDefault();
			   winSpectro.destroy();
			   winSpectroEtat=0;
			    });
			}
	 	  }); 
	 	  }, 400);
	   });
	}else{
		dialog.showMessageBox({
	    type: 'info',
	    buttons: [Qok],
	    cancelId: 1,
	    defaultId: 0,
	    title: Qwarning,
	    detail: AlertWinOpen
	  });

	}
}
function saveSpectro(npath) {
	dialog.showSaveDialog({
        title: 'Select the File Path to save',
        //defaultPath: path.join(__dirname, imgPath),
        defaultPath: path.join(imgPath),
        // defaultPath: path.join(__dirname, '../assets/'),
        buttonLabel: 'Save',
        // Restricting the user to only Text Files.
        filters: [
             {name: 'All Files',extensions: ['*']},
             ],
        properties: []
    }).then(file => {
        // Stating whether dialog operation was cancelled or not.
        exec(`"${soxPath}" "${npath}" -n remix 1 spectrogram -x 2000 -o "${file.filePath.toString()}"`, (error, stdout, stderr) => {
		    if (error) {
		        console.error(`error: ${error.message}`);
		        return;
		    }
		    if (stderr) {
		        //console.log(`stderr: ${stderr}`);
		        //return;
		    }
		    });
    }).catch(err => {
        console.log(err);
    });
}
function uena(chn) {
  return btoa(unescape(encodeURIComponent(chn)));
}
function aenu(chn) {
  return decodeURIComponent(escape(atob(chn)));
}
async function spaceToSvg(projPath, txt) {
    const pdfDir = path.join(app.getPath('appData'), 'kandiskyscore', 'pdf');
    const svgPath = path.join(pdfDir, 'tmpsvg.svg');
    const ntxt = aenu(txt).replaceAll("&nbsp;", "");
    try {
        await fs.promises.mkdir(pdfDir, { recursive: true });
        await fs.promises.writeFile(svgPath, ntxt, 'utf8');
        await svgToPdf(svgPath, projPath);
    } catch (err) {
        console.error('spaceToSvg error:', err);
    }
}
function audioEditor(obj) {
	var cm=editAudioCmd+" "+obj;
	console.log('cm',cm);
	exec(cm);
}
function pro54Preset() {
	var testfile = dialog.showOpenDialog({
	properties: [
    'openFile'],
     defaultPath: app.getPath('home'),
	filters: [
    { name: 'kandiskyscore', extensions: ['pro'] },
    { name: 'All Files', extensions: ['*'] }
  ]
   }).then(result => {
   	console.log(result.canceled);
  		console.log('result.filePaths',result.filePaths);
  		if(!result.canceled){
  			try {
			    const data = fs.readFileSync(result.filePaths.toString(), "utf-8");
			    winPro54.webContents.send("fromMain", 'presetPro54;'+data);
			  } catch (err) {
			    console.error("⚠️ Impossible de charger le state :", err);
			  }
  			
  		}
	});
}
// ****************************************************************************************************************
//const ipc = require('electron').ipcRenderer;

ipcMain.on ("toMain", (event, args) => {
  if (typeof args === "string") {
	let cmd=args.split(';');
	switch(cmd[0]) {
		case 'basePath':
			mainWindow.webContents.send("fromMain", "dconfig;"+app.getPath('userData'));
			break;
		case 'defPdf':
			divToPdf(cmd[1]);
			break;
		case 'spaceToSvg':
			spaceToSvg(cmd[1],cmd[2]);
			break;
		case 'openObjetParam':
		console.log(`openObjetParam ${args} from param`);
			winObjetParam(cmd[1],cmd[2],cmd[3],cmd[4],cmd[6]);
			break;
		case 'openSymbParam':
			console.log(`openSymbParam ${args} from param`);
			createWinSymb(cmd[1],cmd[2],cmd[3],cmd[4]);
			break;
		case 'openGrpParam':
			console.log(`openGrpParam ${args} from param`);
			createWinGrp(cmd[1],cmd[2],cmd[3]);
			break;
		case 'objParamAnnul':
			//console.log(`Restore ${args} from param`);
			mainWindow.webContents.send("fromMain", "annulModifObj;"+cmd[1]);
			winConfigEtat=0;
			winConfig.destroy();
			break;
		case 'objParamClose':
			if(winConfigEtat==1){
				winConfigEtat=0;
				winConfig.destroy();
			}
			if(winGraphObjEtat==1){
				winGraphObj.destroy();
				winGraphObjEtat=0;
			}
			break;
		case 'objParamChange':
			if(winConfigEtat==1){
				winConfigEtat=0;
				winConfig.destroy();
			}
			if(winGraphObjEtat==1){
				winGraphObj.destroy();
				winGraphObjEtat=0;
			}
			break;
		case 'objParamValid':
			console.log(`Restore spatial ${args}`);
			if(winGraphObjEtat==1){
				winGraphObj.destroy();
				winGraphObjEtat=0;
			}
			if(winSpatialEtat==1){
				winSpatial.destroy();
				winSpatialEtat=0;
			}
			if(winTrajectoireEtat==1){
				winTrajectoire.destroy();
				winTrajectoireEtat=0;
			}
			if(winTrajectoryEtat==1){
				winTrajectory.destroy();
				winTrajectoryEtat=0;
			}
			winConfig.destroy();
			winConfigEtat=0;
			mainWindow.webContents.send("fromMain", "objValid;"+cmd[1]);
			break;
		case 'objGraphValid':
			if(winGraphObjEtat==1){
				winGraphObj.destroy();
				winGraphObjEtat=0;
			}
			/*
			if(winConfigEtat==1){
				winConfig.destroy()
				winConfigEtat=0
			}
			*/
			break;
		case 'symbGraphValid':
			winGraphSymb.destroy();
			winGraphSymbEtat=0;
			break;
		case 'grpValid':
			winGraphGrp.destroy();
			winGraphGrpEtat=0;
			break;
		case 'grpAnnul':
			winGraphGrp.destroy();
			winGraphGrpEtat=0;
			break;
		case 'objGraphAnnul':
			mainWindow.webContents.send("fromMain", "objGraphAnnul;"+cmd[1]);
			break;
		case 	'objWinGraphAnnul':
			winGraphObj.destroy();
			winGraphObjEtat=0;
			/*
			if(winConfigEtat==1){
				winConfig.destroy()
				winConfigEtat=0
			}
			*/
			break;
		case 	'symbGraphAnnul':
			winGraphSymb.destroy();
			winGraphSymbEtat=0;
			break;
		case "saveFile":
			console.log(cmd[1]);
			break;
		case "saveRubberbandOutput": {
			const { src, dest } = JSON.parse(cmd[1]);
			fs.copyFile(src, dest, (err) => {
				if (err) console.error("saveRubberbandOutput error:", err);
			});
			break;
		}
		case "neweditor":
			neweditor(cmd[1]);
			break;
		case 'spatialAnnul':
			console.log(`Restore spatial ${args}`);
			//winSpatial.webContents.send("fromMain", "annulModifObj;"+cmd[1]+";"+cmd[2])
			winSpatialEtat=0;
			winSpatial.destroy();
			if(winStudioEtat==1){
				winStudioEtat=0;
				winStudio.destroy();
			}
			if(winStudio3DEtat==1){
				winStudio3D.destroy();
	     	   winStudio3DEtat=0;
	      }
			break;	
		case "spatialAnnulPoints":
			winTrajectoire.destroy();
		   winTrajectoireEtat=0;
			break;
		case 'spatialValid':
			console.log(`Valid spatial ${args}`);
			//winSpatial.webContents.send("fromMain", "annulModifObj;"+cmd[1]+";"+cmd[2])
			winSpatialEtat=0;
			winSpatial.destroy();
			if(winStudioEtat==1){
				winStudioEtat=0;
				winStudio.destroy();
			}
			if(winTrajectoireEtat==1){
				winTrajectoire.destroy();
				winTrajectoireEtat=0;
			}
			if(winStudio3DEtat==1){
				winStudio3D.destroy();
	     	   winStudio3DEtat=0;
	      }
	      if(winTrajectoryEtat==1){
				winTrajectory.destroy();
				winTrajectoryEtat=0;
			}
			break;	
		case 'winSpatial':
			console.log('winSpatial',cmd[1],cmd[2],cmd[3],cmd[4],cmd[5],cmd[6],cmd[7]);
			spatialOpen(cmd[1],cmd[2],cmd[3],cmd[4],cmd[5],cmd[6],cmd[7]);
			break;
		case 'winTrajectoire':
			createTrajectoire(cmd[1],cmd[2]);
			break;
		case 'createSpatialPoint':
			mainWindow.webContents.send("fromMain", "createSpatialPoint;"+cmd[1]+";"+cmd[2]+";"+cmd[3]);
			winSpatial.webContents.send("fromMain", "createSpatialPoint;"+cmd[1]+";"+cmd[2]+";"+cmd[3]);
			winConfig.webContents.send("fromMain", "createSpatialPoint;"+cmd[1]+";"+cmd[2]+";"+cmd[3]);
			if(winStudio3DEtat==1){
				winStudio3D.destroy();
	     	   winStudio3DEtat=0;
	      }
			break;
		case "createTrajectory":
			createTrajectory(cmd[1]);
			break;
		case "defTrajectory":
			winSpatial.webContents.send("fromMain", "defTrajectory;"+cmd[1]+";"+cmd[2]);
			mainWindow.webContents.send("fromMain", "defTrajectory;"+cmd[1]+";"+cmd[2]);
			winConfig.webContents.send("fromMain", "defTrajectory;"+cmd[1]+";"+cmd[2]);
			break;
		case 'audioFileObj':
			console.log("id1",cmd[1]);
			objetAudio(cmd[1]);
			break;
		case 'audioFileObj2':
			console.log("id1",cmd[1]);
			objetAudio(cmd[1],2);
			break;
		case 'replaceAudio':
			replaceAudio(cmd[1],cmd[2]);
			break;
		case 'saveFxAudio':
			saveFxAudio(cmd[1],cmd[2]);
			break;
		case 'fileAudioParam':
			console.log("id1",cmd[1]);
			//console.log(`openObjetParam ${args} from param`);
			if (winConfig && !winConfig.isDestroyed()) winConfig.webContents.send("fromMain", "fileAudioParam;"+cmd[1]+";"+cmd[2]+";"+cmd[3]+";"+cmd[4]);
			break;
		case 'mute':
			if(winConfigEtat==1){
				mainWindow.webContents.send("fromMain", "audioMute;"+cmd[1]+";"+cmd[2]);
			}
			break;
		case 'gain':
			if(winConfigEtat==1){
				mainWindow.webContents.send("fromMain", "audioGain;"+cmd[1]+";"+cmd[2]);
			}
			break;
		case 'reverse':
				mainWindow.webContents.send("fromMain", "defReverse;"+cmd[1]+";"+cmd[2]);
			break;
		case 'fadeInType':
			if(winConfigEtat==1){
				mainWindow.webContents.send("fromMain", "fadeInType;"+cmd[1]+";"+cmd[2]);
			}
			break;
		case 'fadeOutType':
			if(winConfigEtat==1){
				mainWindow.webContents.send("fromMain", "fadeOutType;"+cmd[1]+";"+cmd[2]);
			}
			break;
		case 'flagTranspo':
			if(winConfigEtat==1){
				mainWindow.webContents.send("fromMain", "audioFlagTranspo;"+cmd[1]+";"+cmd[2]);
			}
			break;
		case 'transposition':
			if(winConfigEtat==1){
				winConfig.webContents.send("fromMain", "transposition;"+cmd[1]+";"+cmd[2]);
			}
			break;
		case 'detune':
			if(winConfigEtat==1){
				mainWindow.webContents.send("fromMain", "audioDetune;"+cmd[1]+";"+cmd[2]);
			}
			break;
		case 'debut':
			mainWindow.webContents.send("fromMain", "audioDebut;"+cmd[1]+";"+cmd[2]);
			break;
		case 'fin':
			mainWindow.webContents.send("fromMain", "audioFin;"+cmd[1]+";"+cmd[2]);
			break;
		case 'position':
			if(winConfigEtat==1){
				winConfig.webContents.send("fromMain", "position;"+cmd[1]+";"+cmd[2]+";"+cmd[3]);
			}
			break;
		case 'nom':
			mainWindow.webContents.send("fromMain", "audioNom;"+cmd[1]+";"+cmd[2]);
			break;
		case 'piste':
			mainWindow.webContents.send("fromMain", "audioPiste;"+cmd[1]+";"+cmd[2]);
			break;
		case 'convolver':
			mainWindow.webContents.send("fromMain", "audioConvolver;"+cmd[1]+";"+cmd[2]);
			break;
		case 'env':
			mainWindow.webContents.send("fromMain", "audioEnv;"+cmd[1]+";"+cmd[2]+";"+cmd[3]+";"+cmd[4]);
			break;
		case 'defEnv':
			mainWindow.webContents.send("fromMain", "defEnv;"+cmd[1]);
			break;
		case 'objRayon':
			mainWindow.webContents.send("fromMain", "objetRayon;"+cmd[1]+";"+cmd[2]);
			break;
		case 'objScaleX':
			//console.log(`scaleX ${args} from renderer process`);
			mainWindow.webContents.send("fromMain", "objetScaleX;"+cmd[1]+";"+cmd[2]);
			break;
		case 'objScaleY':
			mainWindow.webContents.send("fromMain", "objetScaleY2;"+cmd[1]+";"+cmd[2]);
			break;
		case 'objScaleY2':
			mainWindow.webContents.send("fromMain", "objetScaleY;"+cmd[1]+";"+cmd[2]);
			break;
		case 'objScaleGrpXY':
			mainWindow.webContents.send("fromMain", "objetScaleGrpXY;"+cmd[1]+";"+cmd[2]);
			break;
		case 'objScaleXY':
			mainWindow.webContents.send("fromMain", "objetScaleXY;"+cmd[1]+";"+cmd[2]);
			break;
		case 'objOpacity':
			mainWindow.webContents.send("fromMain", "objetOpacity;"+cmd[1]+";"+cmd[2]);
			break;
		case 'bkgOpacity':
			mainWindow.webContents.send("fromMain", "bkgOpacity;"+cmd[1]+";"+cmd[2]);
			break;
		case 'bkgGrpOpacity':
			mainWindow.webContents.send("fromMain", "bkgGrpOpacity;"+cmd[1]+";"+cmd[2]);
			break;
		case 'bkgTransparent':
			mainWindow.webContents.send("fromMain", "bkgTransparent;"+cmd[1]);
			winConfig.webContents.send("fromMain", "bkgTransparent;"+cmd[1]);
			break;
		case 'symbBkgTransparent':
			console.log(`symbBkgTransparent ${args} from renderer process`);
			mainWindow.webContents.send("fromMain", "bkgTransparent;"+cmd[1]);
			break;
		case 'grpBkgTransparent':
			mainWindow.webContents.send("fromMain", "bkgGrpTransparent;"+cmd[1]);
			break;
		case 'grpNom':
			mainWindow.webContents.send("fromMain", "grpNom;"+cmd[1]+";"+cmd[2]);
			break;
		case 'defWinGraphObj':
			createWinGraph(cmd[1],cmd[2],cmd[3],cmd[4]);
			break;
		case 'defGraphObj':
			mainWindow.webContents.send("fromMain", "defGraphParam;"+cmd[1]);
			break;
		case 'objColor':
			console.log(`defGraphObj ${args} from renderer process`);
			winConfig.webContents.send("fromMain", "objColor;"+cmd[1]+";"+cmd[2]);
			mainWindow.webContents.send("fromMain", "objColor;"+cmd[1]+";"+cmd[2]);
			break;
		case 'bkgGrpColor':
			console.log(`defGraphObj ${args} from renderer process`);
			mainWindow.webContents.send("fromMain", "grpBkgColor;"+cmd[1]+";"+cmd[2]);
			break;
		case 'preDefNom':
			mainWindow.webContents.send("fromMain", "symbNom;"+cmd[1]+";"+cmd[2]);
			break;
		case 'symbColor':
			console.log(`defGraphObj ${args} from renderer process`);
			mainWindow.webContents.send("fromMain", "symbColor;"+cmd[1]+";"+cmd[2]);
			break;
		case 'symbBkgColor':
			console.log(`symbBkgColor ${args} from renderer process`);
			mainWindow.webContents.send("fromMain", "bkgNColor;"+cmd[1]+";"+cmd[2]);
			break;
		case 'symbRotate':
			console.log(`defGraphObj ${args} from renderer process`);
			mainWindow.webContents.send("fromMain", "symbRotate;"+cmd[1]+";"+cmd[2]);
			break;
		case 'imgRotate':
			console.log(`imgRotate ${args} from renderer process`);
			mainWindow.webContents.send("fromMain", "objRotate;"+cmd[1]+";"+cmd[2]);
			break;
		case 'symbWidth':
			console.log(`defGraphObj ${args} from renderer process`);
			mainWindow.webContents.send("fromMain", "symbWidth;"+cmd[1]+";"+cmd[2]);
			break;
		case 'symbHeight':
			console.log(`defGraphObj ${args} from renderer process`);
			mainWindow.webContents.send("fromMain", "symbHeight;"+cmd[1]+";"+cmd[2]);
			break;
		case 'symbBkgOpacity':
			mainWindow.webContents.send("fromMain", "bkgOpacity;"+cmd[1]+";"+cmd[2]);
			break;
		case 'symbMGauche':
			mainWindow.webContents.send("fromMain", "symbMGauche;"+cmd[1]+";"+cmd[2]);
			break;
		case 'symbMHaut':
			mainWindow.webContents.send("fromMain", "symbMHaut;"+cmd[1]+";"+cmd[2]);
			break;
		case 'bkgSymbWidth':
			console.log(`symbBkgWidth ${args} from renderer process`);
			mainWindow.webContents.send("fromMain", "symbBkgWidth;"+cmd[1]+";"+cmd[2]);
			break;
		case 'bkgSymbHeight':
			console.log(`defGraphObj ${args} from renderer process`);
			mainWindow.webContents.send("fromMain", "symbBkgHeight;"+cmd[1]+";"+cmd[2]);
			break;
		case 'bkgColor':
			winConfig.webContents.send("fromMain", "defBkgColor;"+cmd[1]+";"+cmd[2]);
			mainWindow.webContents.send("fromMain", "bkgNColor;"+cmd[1]+";"+cmd[2]);
			break;
		case 'defBkgImg':
			defBkgImg(cmd[1]);
			break;
		case 'bkgGrpImg':
			defBkgGrpImg(cmd[1]);
			break;
		case 'defSymbBkgImg':
			defSymbBkgImg(cmd[1]);
			break;
		case 'bkgWidth':
			mainWindow.webContents.send("fromMain", "bkgWidth;"+cmd[1]+";"+cmd[2]);
			winConfig.webContents.send("fromMain", "bkgSize;"+cmd[1]+";"+cmd[2]+";"+cmd[3]);
			break;
		case 'bkgHeight':
			mainWindow.webContents.send("fromMain", "bkgHeight;"+cmd[1]+";"+cmd[2]);
			winConfig.webContents.send("fromMain", "bkgSize;"+cmd[1]+";"+cmd[2]+";"+cmd[3]);
			break;
		case 'bkgGrpWidth':
			mainWindow.webContents.send("fromMain", "bkgGrpWidth;"+cmd[1]+";"+cmd[2]);
			break;
		case 'bkgHeight':
			mainWindow.webContents.send("fromMain", "bkgHeight;"+cmd[1]+";"+cmd[2]);
			winConfig.webContents.send("fromMain", "bkgSize;"+cmd[1]+";"+cmd[2]+";"+cmd[3]);
			break;
		case 'bkgGrpHeight':
			mainWindow.webContents.send("fromMain", "bkgGrpHeight;"+cmd[1]+";"+cmd[2]);
			break;
		case 'bordureWidth':
			mainWindow.webContents.send("fromMain", "defBordureWidth;"+cmd[1]+";"+cmd[2]);
			winConfig.webContents.send("fromMain", "defBordureWidth;"+cmd[1]+";"+cmd[2]);
			
			break;
		case 'bordureColor':
			mainWindow.webContents.send("fromMain", "defBordureColor;"+cmd[1]+";"+cmd[2]);
			winConfig.webContents.send("fromMain", "defBordureColor;"+cmd[1]+";"+cmd[2]);
			break;
		case 'margeGauche':
			mainWindow.webContents.send("fromMain", "defMargeGauche;"+cmd[1]+";"+cmd[2]);
			winConfig.webContents.send("fromMain", "defPlGauche;"+cmd[1]+";"+cmd[2]);
			break;
		case 'margeHaut':
			mainWindow.webContents.send("fromMain", "defMargeHaut;"+cmd[1]+";"+cmd[2]);
			winConfig.webContents.send("fromMain", "defPlHaut;"+cmd[1]+";"+cmd[2]);
			break;
		case 'grpMGauche':
			mainWindow.webContents.send("fromMain", "grpMGauche;"+cmd[1]+";"+cmd[2]);
			break;
		case 'grpMHaut':
			mainWindow.webContents.send("fromMain", "grpMHaut;"+cmd[1]+";"+cmd[2]);
			break;
		case 'grpGaucheType':
			mainWindow.webContents.send("fromMain", "grpGaucheType;"+cmd[1]+";"+cmd[2]);
			break;
		case 'grpGaucheColor':
			mainWindow.webContents.send("fromMain", "grpGaucheColor;"+cmd[1]+";"+cmd[2]);
			break;
		case 'grpGaucheWidth':
			mainWindow.webContents.send("fromMain", "grpGaucheWidth;"+cmd[1]+";"+cmd[2]);
			break;
		case 'grpGaucheRadius':
			mainWindow.webContents.send("fromMain", "grpGaucheRadius;"+cmd[1]+";"+cmd[2]);
			break;
		case 'grpHautType':
			mainWindow.webContents.send("fromMain", "grpHautType;"+cmd[1]+";"+cmd[2]);
			break;
		case 'grpHautColor':
			mainWindow.webContents.send("fromMain", "grpHautColor;"+cmd[1]+";"+cmd[2]);
			break;
		case 'grpHautWidth':
			mainWindow.webContents.send("fromMain", "grpHautWidth;"+cmd[1]+";"+cmd[2]);
			break;
		case 'grpHautRadius':
			mainWindow.webContents.send("fromMain", "grpHautRadius;"+cmd[1]+";"+cmd[2]);
			break;
		case 'grpDroitType':
			mainWindow.webContents.send("fromMain", "grpDroitType;"+cmd[1]+";"+cmd[2]);
			break;
		case 'grpDroitColor':
			mainWindow.webContents.send("fromMain", "grpDroitColor;"+cmd[1]+";"+cmd[2]);
			break;
		case 'grpDroitWidth':
			mainWindow.webContents.send("fromMain", "grpDroitWidth;"+cmd[1]+";"+cmd[2]);
			break;
		case 'grpDroitRadius':
			mainWindow.webContents.send("fromMain", "grpDroitRadius;"+cmd[1]+";"+cmd[2]);
			break;
		case 'grpBasType':
			mainWindow.webContents.send("fromMain", "grpBasType;"+cmd[1]+";"+cmd[2]);
			break;
		case 'grpBasColor':
			mainWindow.webContents.send("fromMain", "grpBasColor;"+cmd[1]+";"+cmd[2]);
			break;
		case 'grpBasWidth':
			mainWindow.webContents.send("fromMain", "grpBasWidth;"+cmd[1]+";"+cmd[2]);
			break;
		case 'grpBasRadius':
			mainWindow.webContents.send("fromMain", "grpBasRadius;"+cmd[1]+";"+cmd[2]);
			break;
		case 'gaucheType':
			mainWindow.webContents.send("fromMain", "defGaucheType;"+cmd[1]+";"+cmd[2]);
			break;
		case 'gaucheColor':
			mainWindow.webContents.send("fromMain", "defGaucheColor;"+cmd[1]+";"+cmd[2]);
			break;
		case 'gaucheWidth':
			mainWindow.webContents.send("fromMain", "defGaucheWidth;"+cmd[1]+";"+cmd[2]);
			break;
		case 'gaucheRadius':
			mainWindow.webContents.send("fromMain", "defGaucheRadius;"+cmd[1]+";"+cmd[2]);
			break;
		case 'droitType':
			mainWindow.webContents.send("fromMain", "defDroitType;"+cmd[1]+";"+cmd[2]);
			break;
		case 'droitColor':
			mainWindow.webContents.send("fromMain", "defDroitColor;"+cmd[1]+";"+cmd[2]);
			break;
		case 'droitWidth':
			mainWindow.webContents.send("fromMain", "defDroitWidth;"+cmd[1]+";"+cmd[2]);
			break;
		case 'droitRadius':
			mainWindow.webContents.send("fromMain", "defDroitRadius;"+cmd[1]+";"+cmd[2]);
			break;
		case 'hautType':
			mainWindow.webContents.send("fromMain", "defHautType;"+cmd[1]+";"+cmd[2]);
			break;
		case 'hautColor':
			mainWindow.webContents.send("fromMain", "defHautColor;"+cmd[1]+";"+cmd[2]);
			break;
		case 'hautWidth':
			mainWindow.webContents.send("fromMain", "defHautWidth;"+cmd[1]+";"+cmd[2]);
			break;
		case 'hautRadius':
			mainWindow.webContents.send("fromMain", "defHautRadius;"+cmd[1]+";"+cmd[2]);
			break;
		case 'basType':
			mainWindow.webContents.send("fromMain", "defBasType;"+cmd[1]+";"+cmd[2]);
			break;
		case 'basColor':
			mainWindow.webContents.send("fromMain", "defBasColor;"+cmd[1]+";"+cmd[2]);
			break;
		case 'basWidth':
			mainWindow.webContents.send("fromMain", "defBasWidth;"+cmd[1]+";"+cmd[2]);
			break;
		case 'basRadius':
			mainWindow.webContents.send("fromMain", "defBasRadius;"+cmd[1]+";"+cmd[2]);
			break;
		case 'saveModifProjet':
			saveModifProjet(cmd[1]);
			break;
		case 'saveModifProjetAs':
			
			saveModifProjetAs(cmd[1]);
			break;
		case 'saveModifGrp':
			saveModifGrp(cmd[1]);
			break;
		case 'nettoyerAudios':
			nettoyerAudios(cmd[1]);
			break;
		case 'configProjet':
			configuration(cmd[1],cmd[2],cmd[3],cmd[4],cmd[5],cmd[6]);
			break;
		case 'configClose':
			configClose();
			break;
		case 'configSave':
			mainWindow.webContents.send("fromMain", "configSave;"+cmd[1]);
			break;
		case 'exportBlock':
			exportBlock(cmd[1]);
			break;
		case 'defExportFile':
		console.log(`deffile ${args} from renderer process`);
			defExportFile(cmd[1],cmd[2]);
			break;
		case 'exportProjet':
			mainWindow.webContents.send("fromMain", "exportProjet;"+cmd[1]);
			break;
		case 'exportSpace':
			mainWindow.webContents.send("fromMain", "exportSpace;"+cmd[1]);
			break;
		case 'exportInterface':
			mainWindow.webContents.send("fromMain", "exportInterface;"+cmd[1]);
			break;
		case 'exportPalette':
			mainWindow.webContents.send("fromMain", "exportPalette;"+cmd[1]);
			break;
		case 'spatialspXZ':
			mainWindow.webContents.send("fromMain", "spatialspXZ;"+cmd[1]+";"+cmd[2]+";"+cmd[3]+";"+cmd[4]);
			winConfig.webContents.send("fromMain", "spatialspXZ;"+cmd[2]+";"+cmd[3]+";"+cmd[4]);
			break;
		case 'spatialspZY':
			mainWindow.webContents.send("fromMain", "spatialspZY;"+cmd[1]+";"+cmd[2]+";"+cmd[3]+";"+cmd[4]);
			winConfig.webContents.send("fromMain", "spatialspZY;"+cmd[2]+";"+cmd[3]+";"+cmd[4]);
			break;
		case 'spatialspXY':
			mainWindow.webContents.send("fromMain", "spatialspXY;"+cmd[1]+";"+cmd[2]+";"+cmd[3]+";"+cmd[4]);
			winConfig.webContents.send("fromMain", "spatialspXY;"+cmd[2]+";"+cmd[3]+";"+cmd[4]);
			break;
		case 'spatialspD':
			mainWindow.webContents.send("fromMain", "spatialspD;"+cmd[1]+";"+cmd[2]+";"+cmd[3]);
			winConfig.webContents.send("fromMain", "spatialspD;"+cmd[2]+";"+cmd[3]);
			break;
		case 'spatialspT':
			mainWindow.webContents.send("fromMain", "spatialspT;"+cmd[1]+";"+cmd[2]+";"+cmd[3]);
			winSpatial.webContents.send("fromMain", "spatialspT;"+cmd[2]+";"+cmd[3]);
			winConfig.webContents.send("fromMain", "spatialspT;"+cmd[2]+";"+cmd[3]);
			break;
		case 'trajectSpatial':
			mainWindow.webContents.send("fromMain", "trajectSpatial;"+cmd[1]+";"+cmd[2]);
			break;
		case 'openListeFx':
			mainWindow.webContents.send("fromMain", "openListeFx");
			break;
		case 'openStudio':
			openStudio(cmd[2],cmd[3],cmd[4],cmd[5]);
			mainWindow.webContents.send("fromMain", "openStudio");
			if(winSpatialEtat==1){
				winSpatial.webContents.send("fromMain", "openStudio");
			}
			
			break;
		case 'moveObjActif':
			if(winStudioEtat==1){
				winStudio.webContents.send("fromMain", "moveObjActif;"+cmd[1]+";"+cmd[2]+";"+cmd[3]+";"+cmd[4]);
			}
			break;
		case 'drawObjActif':
			winStudio.webContents.send("fromMain", "drawObjActif;"+cmd[2]+";"+cmd[3]+";"+cmd[4]+";"+cmd[5]+";"+cmd[6]);
			if(winSpatialEtat==1){
				winSpatial.webContents.send("fromMain", "openStudio3D");
			}
			break;
		case 'createEvtAudio':
		console.log(`createEvtAudio ${args} from renderer save`);
			if(winStudioEtat==1){
				winStudio.webContents.send("fromMain", "createEvtAudio;"+cmd[1]+";"+cmd[2]+";"+cmd[3]+";"+cmd[4]+";"+cmd[5]+";"+cmd[6]+";"+cmd[7]);
				console.log("evt",cmd[1]);
			}
			break;
		case 'delEvtAudio':
			if(winStudioEtat==1){
				winStudio.webContents.send("fromMain", "delEvtAudio;"+cmd[1]);
			}
			break;
		case 'endEvtAudio':
			if(winStudioEtat==1){
				winStudio.webContents.send("fromMain", "endEvtAudio;");
			}
			break;
		case 'openStudio3d':
			open3dStudio(cmd[1],cmd[2],cmd[3],cmd[4]);
			winSpatial.webContents.send("fromMain", "openStudio3D");
			break;
		case 'move3dObj':
			if(winStudio3DEtat==1){
				winStudio3D.webContents.send("fromMain", "moveObjActif;"+cmd[1]+";"+cmd[2]+";"+cmd[3]+";"+cmd[4]);
			}
			break;
		case 'selectImg':
			selectImg();
			break;
		case 'saveSvg':
			//console.log(`savd1Svg ${args} from renderer save`);
			winDefSvg(cmd[1],cmd[2]);
			break;
		case 'saveVueSvg':
			//console.log(`savdSvg ${args} from renderer process`);
			saveSvgAs(cmd[1]);
			break;
		case 'vueSvgValid':
			if(winSvgEtat==1){
				winSvg.destroy();
	  			winSvgEtat=0;
	  		}
			break;
		case 'spectroAnnul':
			if(winSpectroEtat==1){
				winSpectro.destroy();
	  			winSpectroEtat=0;
	  		}
			break;
		case 'saveAudioObjet':
			saveAudioObjet(cmd[1],cmd[2]);
			break;
		case 'substituerFx':
			mainWindow.webContents.send("fromMain", "substituerFx");
			break;
		case 'dureeReelle':
			mainWindow.webContents.send("fromMain", "dureeReelle;"+cmd[1]);
			break;
		case 'defPosition':
			mainWindow.webContents.send("fromMain", "defPosition;"+cmd[1]+";"+cmd[2]);
			break;
		case 'transpoToPosY':
			console.log(`transpoToPosY ${args} from renderer process`);
			mainWindow.webContents.send("fromMain", "transpoToPosY;"+cmd[1]+";"+cmd[2]);
			break;
		case 'saveConfig':
			saveConfig(cmd[1]);
			break;
		case 'saveTheme':
			saveTheme(cmd[1]);
			break;
		case 'copyDefautMenu':
			copyDefautMenu(cmd[1]);
			break;
		case 'saveDsp':
			dspSave(cmd[1],cmd[2],cmd[3],cmd[4]);
			break;
		case 'selectStd':
			stdSelect();
			break;
		case 'ide':
			ide();
			break;
		case 'defStudioOk':
			if(winVueStudio3DEtat==1){
				winVueStudio3D.destroy();
	  			winVueStudio3DEtat=0;
	  		}
			newStudio.destroy();
	  		newStudioEtat=0;
			break; 
		case 'vueStudio3D':
			vueStudio3D(cmd[1]);
			break; 
		case 'vueModifStudio3D':
			winVueStudio3D.webContents.send("fromMain", "moveObjActif;"+cmd[1]);
			break;
		case 'closeVue3D':
			if(winVueStudio3DEtat==1){
				winVueStudio3D.destroy();
	  			winVueStudio3DEtat=0;
	  		}
			break;
		case 'read3D':
		console.log(`externe ${args} from renderer process`);
			mainRead3D();
			break;
		case 'exportExterne':
		console.log(`externe ${args} from renderer process`);
			mainExternes(cmd[1]);
			mainWindow.webContents.send("fromMain", "exportExterne;"+cmd[1]);
			break;
		case 'defExterne':
		console.log(`externe ${args} from renderer process`);
			mainExternes2(cmd[1]);
			break;
		case 'exportSelect':
			exportSelect(cmd[1]);
			break;
		case 'vueSpectrogram':
			//console.log(`spectro ${args} from renderer process`);
			soxSpectrogram(cmd[1]);
			break;
		case 'saveSpectro':
			//console.log(`save spectro ${args} from renderer process`);
			saveSpectro(cmd[1]);
			break;
		case 'audioEditor':
			console.log(`save spectro ${args} from renderer process`);
			audioEditor(cmd[1]);
			break;
		case 'openGraphEqua':
		   console.log(`openObjetParam ${args} from param`);
			winGraphicEqualizer(cmd[1],cmd[2]);
			break;
		case 'openBigMuff':
		   console.log(`openObjetParam ${args} from param`);
			winBigMuffOpen(cmd[1],cmd[2]);
			break;
		case 'bigMuffExit':
		   console.log(`openObjetParam ${args} from param`);
			if(winBigMuffEtat==1){
				winBigMuff.destroy();
	  			winBigMuffEtat=0;
	  		}
			break;
		case 'openStonePhaser':
		   console.log(`openObjetParam ${args} from param`);
			winStonePhaserOpen(cmd[1],cmd[2]);
			break;
		case 'stonePhaserExit':
		   console.log(`openObjetParam ${args} from param`);
			if(winStonePhaserEtat==1){
				winStonePhaser.destroy();
	  			winStonePhaserEtat=0;
	  		}
			break;
		case 'openDistoM':
		   console.log(`openObjetParam ${args} from param`);
			winDistoMOpen(cmd[1],cmd[2]);
			break;
		case 'distoMExit':
		   console.log(`openObjetParam ${args} from param`);
			if(winDistoMEtat==1){
				winDistoMOpen.destroy();
	  			winDistoMEtat=0;
	  		}
			break;
		case 'openGuitarAmp':
		   console.log(`openObjetParam ${args} from param`);
			winGuitarAmpOpen(cmd[1],cmd[2]);
			break;
		case 'guitarAmpExit':
		   console.log(`openObjetParam ${args} from param`);
			if(winGuitarAmpEtat==1){
				winGuitarAmp.destroy();
	  			winGuitarAmpEtat=0;
	  		}
	  		break;
	  	case 'openQuadrafuzz':
		   console.log(`openObjetParam ${args} from param`);
			winQuadrafuzzOpen(cmd[1],cmd[2]);
			break;
		case 'quadrafuzzExit':
		   console.log(`openObjetParam ${args} from param`);
			if(winQuadrafuzzEtat==1){
				winQuadrafuzz.destroy();
	  			winQuadrafuzzEtat=0;
	  		}
	  		break;
	  	case 'openHost':
		   console.log(`openObjetParam ${args} from param`);
			winHostOpen(cmd[1],cmd[2]);
			break;
		case 'hostExit':
		   console.log(`openObjetParam ${args} from param`);
			if(winHostEtat==1){
				winHost.destroy();
	  			winHostEtat=0;
	  		}
	  		break;
	  	case 'hostWamsExit':
		   console.log(`openObjetParam ${args} from param`);
			if(winMassWasmEtat==1){
				winMassWasm.destroy();
	  			winMassWasmEtat=0;
	  		}
	  		break;
	  	case 'pro54Exit':
		   console.log(`openObjetParam ${args} from param`);
			if(winPro54Etat==1){
				winPro54.destroy();
	  			winPro54Etat=0;
	  		}
	  		break;
	  	case 'pro54Preset':
		   console.log(`openObjetParam ${args} from param`);
			pro54Preset();
	  		break;
	  	case 'readNewSelect':
			const toSlash = p => p.split(path.sep).join('/');
		   const folders = listSubfolders(cmd[1]).map(toSlash);
		   const files = listAudioFiles(cmd[1],cmd[2]).map(toSlash);
		   var fsize=[];
		   var mtime=[];
		   var ninfo;
			for(let i=0;i<files.length;i++){
				ninfo=fs.statSync(files[i]);
				fsize[i]=ninfo.size;
				mtime[i]=ninfo.mtime;
			}
			winMediaExplorer.webContents.send("fromMain", "retReadDir;"+JSON.stringify({
			  path: toSlash(cmd[1]),
			  folders: folders,
			  files: files,
			  fsize: fsize,
			  mtime: mtime
			}));
	  		break;
	  	case 'readListSpat':
		   console.log(`openList ${args} from param`);
		   var f=[];
		   const npath = path.join(getExecutableDir(), 'resources', 'Dsp');
		   var entries=listAudioFiles(npath,'json');
			for(i=0;i<entries.length;i++){
				var nf=entries[i].split("/");
				var nnf=nf[nf.length-1].split('.');
				f[i]=nnf[0];
			}
			winProjet.webContents.send("fromMain", "rtSpatList;"+f);
	  		break;
	  	case 'readImgsSelect': {
		   const toSlashJ = p => p.split(path.sep).join('/');
			const ifolders = listSubfolders(cmd[1]).map(toSlashJ);
		   const ifiles = listImgFiles(cmd[1],cmd[2]).map(toSlashJ);
			winImgViewer.webContents.send("fromMain", "retImgDir;"+JSON.stringify({folders:ifolders,files:ifiles}));
	  		break; }
	  	case 'insertImgSelect':
			mainWindow.webContents.send("fromMain", "insertImgSelect;"+cmd[1]);
	  		break;
	   case "processAudio":
	   	//console.log(`openObjetParam ${args} from param`);
	   	var { id, mode, sampleRate, channels,length, duration, tempoMap } = JSON.parse(cmd[1]);
	   	
	   	var totalFrames = length;//4298112 ton WAV
	   	var durationSec = totalFrames / sampleRate; 
			var inputPath =path.join(app.getPath('userData'),'renduin.wav');
			var outputPath = path.join(app.getPath('userData'),'renduout.wav');
			var timeMapPath = path.join(app.getPath('userData'),'timemap.txt');

		(async  () => {
		  const timemap = await buildSmoothRubberbandTimeMap(tempoMap, sampleRate, duration, length,0.1);
			await fs.writeFileSync(timeMapPath, timemap, "utf8");
		
		//rubberband --timemap timemap.txt --window 3 --pitch 0 --no-transients --smooth --threads -1 inputPath outputPath
		//await callRubberbandCLI(inputPath, outputPath, 1.0, 0, timeMapPath);
			const result = await validateAndFixTimeMapFile(timeMapPath, totalFrames);

			if (!result.valid) {
			  console.error("Timemap invalide :", result.reason);
			} else { 
			  
			  try {
				 await callRubberbandCLI(rubberbandPath,id,mode,inputPath, outputPath, 1.0, 0, timeMapPath);
				} catch (err) {
				  console.error("Rubberband failed:", err);
				  mainWindow.webContents.send(
				    "fromMain",
				    "processRubberbandError;" + id + ";" + err.message
				  );
				}
			}
			})();
     	  break;
		case "processAutoTempo":
	   	//console.log(`openObjetParam ${args} from param`);
	   	var { sampleRate, channels,length, duration, obj, tempoMap } = JSON.parse(cmd[1]);
	   	
	   	var totalFrames = length;//4298112 ton WAV
	   	var durationSec = totalFrames / sampleRate; 
			var inputPath = path.resolve("./renduin.wav");
			var outputPath = path.resolve("./renduout.wav");
			var timeMapPath = path.resolve("./timemap.txt");

		(async  () => {
		  const timemap = await buildSmoothRubberbandTimeMap(tempoMap, sampleRate, duration, length,0.1);
			await fs.writeFileSync(timeMapPath, timemap, "utf8");
		
		//rubberband --timemap timemap.txt --window 3 --pitch 0 --no-transients --smooth --threads -1 inputPath outputPath
		//await callRubberbandCLI(inputPath, outputPath, 1.0, 0, timeMapPath);
			const result = await validateAndFixTimeMapFile(timeMapPath, totalFrames);

			if (!result.valid) {
			  console.error("Timemap invalide :", result.reason);
			} else {
			  		await autoRubberbandCLI(rubberbandPath,inputPath, outputPath, 1.0, 0, timeMapPath,obj);
			}
			})();
     	  break;
		case "processTempo": {
			const { id, filePath, ratio, destPath } = JSON.parse(cmd[1]);
			(async () => {
				try {
					await callRubberbandCLI(rubberbandPath, id, 'tempo', filePath, destPath, ratio, 0);
				} catch (err) {
					console.error("Rubberband tempo failed:", err);
					mainWindow.webContents.send("fromMain", "tempoError");
				}
			})();
			break;
		}
		case "processStretching": {
			const { id: strId, filePath: strFile, ratio: strRatio, pitch: strPitch, destPath: strDest } = JSON.parse(cmd[1]);
			(async () => {
				try {
					// Varispeed : la hauteur suit le ratio (bande magnétique), + décalage manuel éventuel
					const autoSemitones = -12 * Math.log2(strRatio);
					await callRubberbandCLI(rubberbandPath, strId, 'stretching', strFile, strDest, strRatio, autoSemitones + strPitch);
				} catch (err) {
					console.error("Rubberband stretching failed:", err);
					mainWindow.webContents.send("fromMain", "tempoError");
				}
			})();
			break;
		}
     	  case "infoSpectrogram":
     	  	if (playProcess) {
		        killPlay();
		      }
     	  	try {
			  const chans = parseInt(execSync(`"${soxPath}" --i -c "${cmd[1]}"`).toString().trim(),10);
			  const rate = parseInt(execSync(`"${soxPath}" --i -r "${cmd[1]}"`).toString().trim(),10);
			  const nbsamples = parseInt(execSync(`"${soxPath}" --i -s "${cmd[1]}"`).toString().trim(),10);
  			  const spectroPath1 = path.join(app.getPath('home'), 'kandiskyscore', 'Projets', 'spectrogram.png');
  			  execSync(`"${soxPath}" "${cmd[1]}" -n remix 1 spectrogram -x 750 -y 100 -o "${spectroPath1}"`);
  			  winMediaExplorer.webContents.send("fromMain", "infoFile;"+chans+";"+rate+";"+nbsamples+";"+cmd[1]+";"+spectroPath1);
			} catch (err) {
			  console.error("Erreur lors de l'exécution de sox --i :", err);
			}
     	  	break;
     	  case "wasmSpectrogram":
     	  		console.log(`openObjetParam ${args} from param`);
     	  	  const spectroPath2 = path.join(app.getPath('home'), 'kandiskyscore', 'Projets', 'spectrogram.png');
     	  	  execSync(`"${soxPath}" "${cmd[1]}" -n remix 1 spectrogram -x 250 -y 100 -o "${spectroPath2}"`);
  			  winSpatMass.webContents.send("fromMain", "spectrogram;"+spectroPath2);

     	   break;
     	  case "playFile":
	     	  
	     	  var args;
	     	  	if (playProcess) {
		        killPlay();
		      }
	     	  	var proc ;
			  if (platform === "win32") {
				     if (cmd[2] > 0) {
					      args = [cmd[1], "-d", "trim", cmd[2].toString()];
					    } else {
					      args = [cmd[1], "-d"];
					  }
			  } else {
			  	if (cmd[2] > 0) {
			      args = [cmd[1], "trim", cmd[2].toString(),"vol", cmd[3].toString()];
			    } else {
			      args = [cmd[1],"vol", cmd[3].toString()];
			    }
			    proc = spawn(playPath, args, {
		        shell: true,
		        detached: true, // 🔑 crée un groupe de processus
		      });
		      playProcess.add(proc);
				console.log("args :",args);
		      console.log("PID du lecteur :", proc.pid);
		
		      proc.stdout.on("data", (data) =>
		        console.log("stdout:", data.toString())
		      );
		      proc.stderr.on("data", (data) =>
		        console.error("stderr:", data.toString())
		      );
			    
			  }

				 proc.on("exit", (code) => {
				      console.log("Lecture terminée, code:", code);
				      playProcess.delete(proc);
				      if(cmd[4]==1){
				      	winMediaExplorer.webContents.send("fromMain", "loop");
				      }
				    });
     	  	break;
     	  case "playDirectFile":
     	  	// Migré vers ipcMain.handle('playDirectFile') — voir ci-dessous
     	  	break;
     	       	  case "killPlay":
     	  	console.log("killPlay");
  			killPlay();
     	  	break;
     	  case "mediaExplorerQuit":
			if(winMediaExplorerEtat==1){
				winMediaExplorer.destroy();
				winMediaExplorerEtat=0;
			}
			break;
		case "imagesViewerQuit":
			if(winImgViewerEtat==1){
				winImgViewer.destroy();
				winImgViewerEtat=0;
			}
			break;
		case "splitCanaux":
		console.log(`splitCanaux ${args} from param`);
			(async () => {
			  try {
			    //await splitChannels(cmd[1]);
			    	const audioFilePath=path.join(app.getPath('home'), 'kandiskyscore', 'Projets', 'Projet3', 'Audios', cmd[1]+".wav");
	     	  	const outputDir=path.join(app.getPath('home'), 'kandiskyscore', 'Projets', 'Projet3', 'Audios', cmd[1]);
	     	  	await splitW64ToWav(audioFilePath, outputDir, 18, "stem");
    console.log("🎚️ Fichiers exportés dans :", outputDir);
			  } catch (err) {
			    console.error(err);
			  }
			})();
			break;
		case "playAudioFile":
			console.log(`openObjetParam ${args} from param`);
			(async () => {
				if (playProcess) {
			        //killPlay();
			      }
	     	  	try {
	     	  	//const path=app.getPath('home')+"/kandiskyscore/Projets/Projet3/Audios/"+cmd[1]+".wav";
	     	  	//const outputDir=app.getPath('home')+"/kandiskyscore/Projets/Projet3/Audios/"+cmd[1]
	     	  	//await splitW64ToWav(path, outputDir, 18, "stem");
   // console.log("🎚️ Fichiers exportés dans :", outputDir);
	     	  	/*
				  await execSync(`"${soxPath}" -M "${path}"//*.wav "${path}"//out.w64 `);
				  const dest=path+"/out.w64";
				  playProcess = spawn(playPath, [dest], {
		        shell: true,
		        detached: true, // 🔑 crée un groupe de processus
		      	});
		      	*/
		      	
				  playProcess = spawn(playPath, [cmd[1]], {
		        shell: true,
		        detached: true, // 🔑 crée un groupe de processus
		      	});

				} catch (err) {
				  console.error("Erreur lors de l'exécution de sox --i :", err);
				}
			})();
			break;
			case "openSpatMass":
				 spatMass(cmd[1],cmd[2]);
			break;
			case "openSpectrEdit":
				console.log(`openSpectrEdit ${args} from param`);
				 spectrEdit(cmd[1],cmd[2],cmd[3]);
			break;
			case "closeSpectrEdit":
				if(winSpectrEditEtat==1){
					winSpectrEdit.destroy();
					winSpectrEditEtat=0;
				}
				if(winSpectWamEtat==1){
					winSpectWam.destroy();
					winSpectWamEtat=0;
				}
				winSpectWam;
			break;
			case "openSpectWasm":
				console.log(`openObjetParam ${args} from param`);
				 openSpectWasm(cmd[1],cmd[2],cmd[3],cmd[4]);
			break;
			case "openMassWasm":
				console.log(`openObjetParam ${args} from param`);
				 openMassWasm(cmd[1],cmd[2],cmd[3]);
			break;
			case "closeMassPath":
				if(winMassWasmEtat==1){
					winMassWasm.destroy();
					winMassWasmEtat=0;
				}
				if(winSpatMassEtat==1){
					winSpatMass.destroy();
					winSpatMassEtat=0;
				}
			break;
        }
		}   
		if (args && typeof args === "object" && args.type) {
        switch (args.type) {

            case "rtWasmHost": {
                const canal = args.canal;
                const mode = args.mode;
                const buffer = args.buffer;

                console.log(
                    "rtWasmHost reçu",
                    "canal =", canal,
                    "mode =" ,mode,
                    "buffer =", buffer?.constructor?.name
                );
                if(mode==0){
						 winSpatMass.webContents.send("fromMain", {
						    type: "rtWasmHost",
						    canal:canal,
						    buffer: buffer
					    });
					 }else{
					 	winSpectrEdit.webContents.send("fromMain", {
						    type: "rtWasmHost",
						    canal:canal,
						    mode:mode,
						    buffer: buffer
					    });
					 }
                if (!(buffer instanceof Float32Array)) {
                    console.error("buffer n'est pas un Float32Array");
                    return;
                }

                //currentChannels[canal] = new Float32Array(buffer);
                break;
            }

            default:
                console.warn("Message objet inconnu :", args.type);
        }
        return;
    }
		
		
		
		   
   });


});
async function rtWasmHost(canal, buffer) {
    console.log("AudioBuffer reçu", buffer.numberOfChannels);

    const data = buffer.getChannelData(0);
    //currentChannels[canal] = new Float32Array(data);
}
function defSpatMass() {
	mainWindow.webContents.send("fromMain", "defSpatMass;");
}
function defSpectrEdit() {
	mainWindow.webContents.send("fromMain", "defSpectrEdit;");
}
ipcMain.handle('get-app-paths', () => {
  return {
  	 os:os.platform(),
    resourcesPath: process.resourcesPath,
    exe: app.getPath('exe'),
    home: app.getPath('home'),
    basedir: app.getAppPath(),
    userData: app.getPath('userData'),
    appData: app.getPath('appData'),
    documents: app.getPath('documents'),
    temp: app.getPath('temp'),
    isPackaged: app.isPackaged
  };
});
ipcMain.handle("loadFileAsArrayBuffer", async (event, filePath) => {
  const buf = fs.readFileSync(filePath);
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
});
ipcMain.handle("infoFile", async (event, filePath) => {
	const info = {
  	 chans : parseInt(execSync(`"${soxPath}" --i -c "${filePath}"`).toString().trim(),10),
  	 rate : parseInt(execSync(`"${soxPath}" --i -r "${filePath}"`).toString().trim(),10),
  	 nbsamples : parseInt(execSync(`"${soxPath}" --i -s "${filePath}"`).toString().trim(),10)
  	};
  	console.log(info);
  	return info;
});
ipcMain.handle("loadBuffers", async (event, filePath) => {

    if (!fs.existsSync(filePath)) {
        throw new Error("Fichier introuvable : " + filePath);
    }

    const buffer = fs.readFileSync(filePath);
    const wav = await WavDecoder.decode(buffer);

    const sampleRate = wav.sampleRate;
    const numChannels = wav.channelData.length;
    const numSamples = wav.channelData[0].length;

    // ENVOYER DIRECTEMENT DES Float32Array
    const channels = wav.channelData.map(ch => {
        const copy = new Float32Array(ch.length);
        copy.set(ch);
        return copy;   // ✔ Float32Array, pas copy.buffer !
    });

    let rt= {
        sampleRate,
        bitsPerSample: 32,
        numChannels,
        numSamples,
        channels
    };
    return rt;
});

ipcMain.handle("loadFile", async (event, filePath) => {
    const abs = path.resolve(filePath);

    try {
        const ext = path.extname(abs).toLowerCase();

        // BINAIRE → Uint8Array
        if ([".wasm", ".wav", ".mp3", ".ogg"].includes(ext)) {
            const buffer = fs.readFileSync(abs);
            return new Uint8Array(buffer);
        }

        // TEXTE → string
        if ([".json", ".txt"].includes(ext)) {
            return fs.readFileSync(abs, "utf8");
        }

        // fallback : binaire par défaut
        const buffer = fs.readFileSync(abs);
        return new Uint8Array(buffer);

    } catch (err) {
        console.error("Error loadFile:", err);
        throw err;
    }
});
ipcMain.handle("toMainAsync", async (event, msg) => {
    if (msg.cmd === "saveAudioBuffer") {
        await saveSerializedAudioBufferToWav(msg.buffer, msg.path);
        return { ok: true };
    }
});
ipcMain.handle("faust-load-file", async (event, path) => {
    try {
        const buffer = fs.readFileSync(path);
        return new Uint8Array(buffer);
    } catch (e) {
        console.error("Erreur lecture fichier:", path, e);
        throw e;
    }
});
ipcMain.handle('soxProcessExport', async (event, filePath, soxParams) => {
    const tmpPath = filePath + '.tmp.wav';
    const extraArgs = (soxParams || "").match(/(?:[^\s"]+|"[^"]*")+/g) || [];
    const args = [filePath, tmpPath, ...extraArgs];
    console.log('[soxProcessExport]', args.join(' '));
    return new Promise((resolve, reject) => {
        const proc = spawn(soxPath, args, { shell: false });
        if (proc.stderr) {
            proc.stderr.on('data', d => console.error('soxProcessExport stderr:', d.toString()));
        }
        proc.on('exit', (code) => {
            if (code === 0) {
                try {
                    fs.renameSync(tmpPath, filePath);
                    resolve({ ok: true });
                } catch (e) {
                    reject(e);
                }
            } else {
                reject(new Error(`soxProcessExport: SoX exit code ${code}`));
            }
        });
        proc.on('error', reject);
    });
});

ipcMain.handle("saveAudioBuffer", async (event, payload) => {
    const { filePath, buffer } = payload;
consolg.log("payload",payload);
    if (!buffer || !buffer.channels || buffer.channels.length === 0) {
        throw new Error("buffer.channels vide !");
    }

    const floatChannels = buffer.channels.map(ch => new Float32Array(ch));

    const wavArrayBuffer = await WavEncoder.encode({
        sampleRate: buffer.sampleRate,
        channelData: floatChannels
    });

    fs.writeFileSync(filePath, Buffer.from(wavArrayBuffer));

    return { ok: true };
});

ipcMain.handle("saveFile", async (event, { filename, data }) => {
    try {
        // data = ArrayBuffer ou Buffer
        const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data);

        await fs.promises.writeFile(filename, buffer);

        console.log("[main] saveFile OK:", filename);
        return { ok: true, path: filename };

    } catch (err) {
        console.error("[main] saveFile ERROR:", err);
        return { ok: false, error: err.message };
    }
});

ipcMain.handle('readFxFile', async (event, relPath) => {
    const fullPath = path.resolve(__dirname, relPath);
    const data = await fs.readFile(fullPath);
    return new Uint8Array(data); // renvoyer Uint8Array ou ArrayBuffer
});
ipcMain.handle('load-wasm', async (event, dspName) => {
  const wasmPath = path.join(__dirname, 'greffons', `${dspName}-wasm`, 'faustwasm', `${dspName}.wasm`);
  const jsonPath = path.join(__dirname, 'greffons', `${dspName}-wasm`, 'faustwasm', `${dspName}.json`);

  const wasmBytes = fs.readFileSync(wasmPath).buffer;
  const json = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  return { wasmBytes, json };
});
ipcMain.handle("save-audio-buffer", async (event, { filePath, buffer }) => {
    try {
        const { sampleRate, channels } = buffer;
        const floatChannels = channels.map(ch => new Float32Array(ch));

        const audioData = {
            sampleRate,
            channelData: floatChannels
        };

        const wavArrayBuffer = await WavEncoder.encode(audioData);

        let normalizedPath = path.resolve(filePath);
        const dir = path.dirname(normalizedPath);

        // créer le dossier parent si nécessaire
        await fs.promises.mkdir(dir, { recursive: true });

        // ajouter le préfixe Windows uniquement
        if (os.platform() === "win32") {
            normalizedPath = `\\\\?\\${normalizedPath}`;
        }

        await fs.promises.writeFile(normalizedPath, Buffer.from(wavArrayBuffer));

        return true;

    } catch (err) {
        console.error("Erreur save-audio-buffer:", err);
        throw err;
    }
});

ipcMain.handle('load-buffers', async (event, filePath) => {
  const fileData = fs.readFileSync(filePath);
  const audioBuffer = await audioDecode(fileData);

  const numChannels = audioBuffer.numberOfChannels;
  const numSamples = audioBuffer.length;
  const sampleRate = audioBuffer.sampleRate;

  const channels = [];
  for (let c = 0; c < numChannels; c++) {
    channels.push(audioBuffer.getChannelData(c));
  }

  return { channels, numChannels, numSamples, sampleRate };
});
ipcMain.handle("saveBuffer", async (event, { buffer, path }) => {
  const fs = require("fs");
  // buffer est un ArrayBuffer
  fs.writeFileSync(path, Buffer.from(buffer));
  return true;
});
ipcMain.handle("loadAB", async (event, path) => {
    const fs = require("fs");
    const buf = fs.readFileSync(path);
    return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength); // ← ArrayBuffer !!!
});
async function splitW64ToWav(inputPath, outputDir, channelCount, prefix = "ch") {
  try {
    if (!fs.existsSync(inputPath)) throw new Error(`❌ Fichier introuvable : ${inputPath}`);
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    console.log(`▶ Extraction de ${channelCount} canaux depuis ${path.basename(inputPath)}...`);

    // Génération des commandes de mapping audio
    const mapArgs = [];
    for (let i = 0; i < channelCount; i++) {
      const outputFile = path.join(outputDir, `${prefix}${i + 1}.wav`);
      mapArgs.push(`-map_channel 0.0.${i} "${outputFile}"`);
    }

    // Commande ffmpeg
    const cmd = `ffmpeg -y -i "${inputPath}" ${mapArgs.join(" ")}`;
    console.log("🧩 Commande :", cmd);

    // Exécution non bloquante
    const { stderr } = await execAsync(cmd, { maxBuffer: 1024 * 1024 * 20 });
    if (stderr && !stderr.includes("frame=")) console.warn("⚠️ ffmpeg:", stderr);

    console.log(`✅ Séparation terminée → ${outputDir}`);
    return outputDir;
  } catch (err) {
    console.error("❌ Erreur lors de la séparation :", err.message);
    throw err;
  }
}

function killPlay() {
console.log("KILL ALL AUDIO");
for (const proc of playProcess) {
	try {
	tkill(proc.pid, "SIGKILL");
	} catch (e) {
	console.error("Kill error:", e);
	}
}
playProcess.clear();
mainWindow.webContents.send("fromMain", "playStop;");
}
 function allocStringSafe(str,Module) {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(str + '\0'); // NUL terminated
    const ptr = Module._malloc(bytes.length);
    if (!ptr) throw new Error("malloc failed");
    Module.HEAPU8.set(bytes, ptr);
    return ptr;
  }
ipcMain.handle("load-multichannel-wav", async (event, filePath) => {
    const wav = parseWAV(filePath);

    // Convert Float32Array → ArrayBuffer pour transfert IPC
    const channels = wav.channels.map(ch => ch.buffer);

    return {
        sampleRate: wav.sampleRate,
        bitsPerSample: wav.bitsPerSample,
        numChannels: wav.numChannels,
        numSamples: wav.numSamples,
        channels  // ArrayBuffer[]
    };
});
function splitChannels(inputFile, outDir) {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
console.log("inputFile",inputFile,outDir);
        const info = spawn(soxPath, ["--i", "-c", inputFile]);
        info.on("error", (err) => {
    console.error("Spawn error INFO:", err);
});
        let chD = "";
        info.stdout.on("data", d => chD += d.toString());

        info.on("close", () => {
            const channels = parseInt(chD.trim());
            if (!channels) return reject("Unable to read number of channels");

            let doneCount = 0;

            for (let c = 1; c <= channels; c++) {
				    const outfile = path.join(outDir, `chan${c - 1}.wav`);
				    const args = [inputFile, outfile, "remix", c];
				
				    const p = spawn(soxPath, args);
				
				    p.on("close", () => {
				        doneCount++;
				        if (doneCount === channels) resolve();
				    });
				}
        });
    });
}


async function mixMultichannelAudio(inputPath, outputPath, mode = "stereo", bitDepth = "pcm16") {
  // --- 1️⃣ Lecture et décodage WAV ---
  const buffer = fs.readFileSync(inputPath);
  const decoded = await WavDecoder.decode(buffer);

  const numChannels = decoded.channelData.length;
  const length = decoded.channelData[0].length;
  const sampleRate = decoded.sampleRate;

  console.log(`Décodé : ${numChannels} canaux @ ${sampleRate} Hz`);

  // --- 2️⃣ Création des buffers de sortie ---
  let outChannels = [];
  let numOutChannels = mode === "mono" ? 1 : 2;

  if (mode === "mono") {
    outChannels = [new Float32Array(length)];
  } else {
    outChannels = [new Float32Array(length), new Float32Array(length)];
  }

  // --- 3️⃣ Mixage ---
  for (let c = 0; c < numChannels; c++) {
    const ch = decoded.channelData[c];
    if (mode === "mono") {
      const weight = 1 / numChannels;
      for (let i = 0; i < length; i++) {
        outChannels[0][i] += ch[i] * weight;
      }
    } else {
      const weightL = (c % 2 === 0 ? 1 : 0.7) / numChannels;
      const weightR = (c % 2 === 1 ? 1 : 0.7) / numChannels;
      for (let i = 0; i < length; i++) {
        outChannels[0][i] += ch[i] * weightL;
        outChannels[1][i] += ch[i] * weightR;
      }
    }
  }

  // --- 4️⃣ Normalisation ---
  let peak = 0;
  for (let i = 0; i < length; i++) {
    if (mode === "mono") {
      peak = Math.max(peak, Math.abs(outChannels[0][i]));
    } else {
      peak = Math.max(
        peak,
        Math.abs(outChannels[0][i]),
        Math.abs(outChannels[1][i])
      );
    }
  }
  const gain = peak > 0 ? 1 / peak : 1;
  for (let i = 0; i < length; i++) {
    if (mode === "mono") {
      outChannels[0][i] *= gain;
    } else {
      outChannels[0][i] *= gain;
      outChannels[1][i] *= gain;
    }
  }

  // --- 5️⃣ Encodage WAV ---
  const encoded = await WavEncoder.encode({
    sampleRate,
    channelData: outChannels,
    bitDepth, // "16" | "24" | "32" | "32f"
  });

  fs.writeFileSync(outputPath, Buffer.from(encoded));
  console.log(`✅ Mix ${mode} (${bitDepth}) terminé : ${outputPath}`);
}
/**
 * Convertit des Float32Arrays vers PCM16, PCM24 ou PCM32
 */
function convertBitDepth(left, right, bitDepth) {
  switch (bitDepth) {
    case "pcm16": {
      const left16 = new Int16Array(left.length);
      const right16 = new Int16Array(right.length);
      for (let i = 0; i < left.length; i++) {
        left16[i] = Math.max(-1, Math.min(1, left[i])) * 0x7fff;
        right16[i] = Math.max(-1, Math.min(1, right[i])) * 0x7fff;
      }
      return { leftConv: left16, rightConv: right16 };
    }

    case "pcm24": {
      const left24 = new Int32Array(left.length);
      const right24 = new Int32Array(right.length);
      for (let i = 0; i < left.length; i++) {
        left24[i] = Math.max(-1, Math.min(1, left[i])) * 0x7fffff;
        right24[i] = Math.max(-1, Math.min(1, right[i])) * 0x7fffff;
      }
      return { leftConv: left24, rightConv: right24 };
    }

    case "pcm32": {
      const left32 = new Int32Array(left.length);
      const right32 = new Int32Array(right.length);
      for (let i = 0; i < left.length; i++) {
        left32[i] = Math.max(-1, Math.min(1, left[i])) * 0x7fffffff;
        right32[i] = Math.max(-1, Math.min(1, right[i])) * 0x7fffffff;
      }
      return { leftConv: left32, rightConv: right32 };
    }

    default:
      throw new Error(`Format non pris en charge : ${bitDepth}`);
  }
}
function parseWavHeader(buffer) {
  const format = buffer.readUInt16LE(20);
  const channels = buffer.readUInt16LE(22);
  const sampleRate = buffer.readUInt32LE(24);
  const bitsPerSample = buffer.readUInt16LE(34);
  const dataSize = buffer.readUInt32LE(40);
  const dataOffset = 44;
  if (format !== 1 && format !== 3)
    throw new Error(`Format WAV non supporté (${format})`);
  return { channels, sampleRate, bitsPerSample, dataOffset, dataSize, format };
}

/**
 * Écrit l'en-tête W64 (64-bit)
 */
function writeWave64Header(fd, numChannels, sampleRate, bitsPerSample, numSamples) {
  const bytesPerSample = bitsPerSample / 8;
  const blockAlign = numChannels * bytesPerSample;
  const dataSize = BigInt(numSamples) * BigInt(blockAlign);

  // GUIDs pour W64
  const GUID_RIFF = Buffer.from("726966662E91CF11A5D628DB04C10000", "hex");
  const GUID_WAVE = Buffer.from("77617665F3ACD3118CD100C04F8EDB8A", "hex");
  const GUID_FMT  = Buffer.from("666D7420F3ACD3118CD100C04F8EDB8A", "hex");
  const GUID_DATA = Buffer.from("64617461F3ACD3118CD100C04F8EDB8A", "hex");

  const fmtSize = 40n;
  const fmt = Buffer.alloc(Number(fmtSize));
  fmt.writeUInt16LE(3, 0); // ⚠️ 3 = IEEE FLOAT (au lieu de 1)
  fmt.writeUInt16LE(numChannels, 2);
  fmt.writeUInt32LE(sampleRate, 4);
  fmt.writeUInt32LE(sampleRate * blockAlign, 8);
  fmt.writeUInt16LE(blockAlign, 12);
  fmt.writeUInt16LE(bitsPerSample, 14);

  const fmtChunkSize = 24n + fmtSize;
  const dataChunkSize = 24n + dataSize;
  const riffSize = 24n + fmtChunkSize + dataChunkSize;

  function writeGUID(guid, size) {
    fs.writeSync(fd, guid);
    const buf = Buffer.alloc(8);
    buf.writeBigUInt64LE(size);
    fs.writeSync(fd, buf);
  }

  // RIFF chunk
  writeGUID(GUID_RIFF, riffSize);
  fs.writeSync(fd, GUID_WAVE);

  // fmt chunk
  writeGUID(GUID_FMT, fmtChunkSize);
  fs.writeSync(fd, fmt);

  // data chunk
  writeGUID(GUID_DATA, dataChunkSize);
}

/** Fusion rapide de WAV mono → W64 multicanaux */
async function mergeToW64(inputDir, outputFile) {
  const files = fs.readdirSync(inputDir)
    .filter(f => f.toLowerCase().endsWith(".wav"))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  if (!files.length) throw new Error("Aucun fichier .wav trouvé");

  console.log(`🎧 Fusion de ${files.length} fichiers...`);

  const channels = [];
  let sampleRate = null;
  let bitsPerSample = 32;

  for (const f of files) {
    const filePath = path.join(inputDir, f);
    const buffer = fs.readFileSync(filePath);
    const decoded = wav.decode(buffer);
    if (decoded.channelData.length !== 1) throw new Error(`${f} nest pas mono`);
    if (!sampleRate) sampleRate = decoded.sampleRate;
    else if (sampleRate !== decoded.sampleRate) throw new Error(`Taux différent dans ${f}`);

    channels.push(decoded.channelData[0]);
  }

  const numChannels = channels.length;
  const numSamples = channels[0].length;

  console.log(`📦 ${numChannels} canaux, ${numSamples} échantillons @ ${sampleRate} Hz`);

  const fd = fs.openSync(outputFile, "w");
  writeWave64Header(fd, numChannels, sampleRate, bitsPerSample, numSamples);

  console.log("💾 Écriture par blocs...");
  const frameSize = numChannels * 4;
  const blockSize = 65536;
  const block = Buffer.alloc(blockSize * frameSize);

  for (let i = 0; i < numSamples; i += blockSize) {
    const n = Math.min(blockSize, numSamples - i);
    for (let j = 0; j < n; j++) {
      for (let ch = 0; ch < numChannels; ch++) {
        block.writeFloatLE(channels[ch][i + j], (j * numChannels + ch) * 4);
      }
    }
    fs.writeSync(fd, block, 0, n * frameSize);
  }

  fs.closeSync(fd);
  console.log(`✅ Fusion terminée → ${outputFile}`);
}
async function mergeMulticanal(inputDir, outputFile) {
  console.log("🚀 Initialisation du module WASM (NODERAWFS)...");
  const Module = await createMergeModule(); // compile avec -s NODERAWFS=1
  console.log("✅ Module prêt !");

  if (!fs.existsSync(inputDir)) throw new Error("Le dossier d'entrée n'existe pas");
  const files = fs.readdirSync(inputDir).filter(f => f.endsWith(".wav"));
  if (files.length === 0) throw new Error("Aucun fichier .wav trouvé dans " + inputDir);

  console.log(`🎧 Fichiers trouvés : ${files.length}`);
  console.log("📂 Dossier d'entrée :", inputDir);
  console.log("📄 Fichier de sortie :", outputFile);

  // ⚙️ Appel direct de la fonction C++ (pas de MEMFS)
  const merge_files = Module.cwrap("merge_files", "number", ["string", "string"]);

  console.log("▶ Appel de merge_files()...");
  const code = merge_files(inputDir, outputFile);

  console.log("✅ Fusion terminée avec code :", code);
}

async function validateAndFixTimeMapFile(timeMapPath, totalFrames) {
  try {
    const content = await fs.promises.readFile(timeMapPath, "utf8");
    const rawLines = content
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(line => line.length > 0);

    if (rawLines.length < 2) {
      return { valid: false, corrected: false, reason: "Pas assez de points (minimum 2 requis)." };
    }

    let fixedLines = [];
    let lastIn = -Infinity;
    let lastOut = -Infinity;

    for (const line of rawLines) {
      const parts = line.split(/\s+/);
      if (parts.length !== 2) continue;

      const [inFrame, outFrame] = parts.map(Number);
      if (isNaN(inFrame) || isNaN(outFrame)) continue;

      // Supprimer les points non croissants
      if (inFrame <= lastIn || outFrame <= lastOut) continue;

      fixedLines.push(`${inFrame} ${outFrame}`);
      lastIn = inFrame;
      lastOut = outFrame;
    }

    // Vérifie et corrige le dernier point
    const [lastInFrame, lastOutFrame] = fixedLines.at(-1).split(" ").map(Number);
    if (Math.abs(lastInFrame - totalFrames) > totalFrames * 0.01) {
      fixedLines.push(`${totalFrames} ${Math.round(lastOutFrame * (totalFrames / lastInFrame))}`);
    }

    // Supprimer doublons exacts
    fixedLines = [...new Set(fixedLines)];

    // Vérifie le résultat final
    if (fixedLines.length < 2) {
      return { valid: false, corrected: false, reason: "Aucune donnée exploitable dans le timemap." };
    }

    // Si différent du fichier original → le réécrire
    const newContent = fixedLines.join("\n") + "\n";
    if (newContent !== content) {
      await fs.promises.writeFile(timeMapPath, newContent, "utf8");
      console.log(`🛠 Timemap corrigé et réécrit (${fixedLines.length} lignes) :`, timeMapPath);
      return { valid: true, corrected: true, lineCount: fixedLines.length };
    }

    return { valid: true, corrected: false, lineCount: fixedLines.length };

  } catch (err) {
    return { valid: false, corrected: false, reason: "Erreur de lecture du timemap : " + err.message };
  }
}

async function encodeAudioBufferToWav(audioBuffer) {
  return await WavEncoder.encode({
    sampleRate: audioBuffer.sampleRate,
    channelData: Array.from({ length: audioBuffer.numberOfChannels }, (_, i) =>
      audioBuffer.getChannelData(i)
    ),
  });
}
function base64ToArrayBuffer(base64) {
  const binary = Buffer.from(base64, 'base64');
  return binary.buffer.slice(binary.byteOffset, binary.byteOffset + binary.byteLength);
}
// *****************************************************************************************************************
function listSubfolders(dirPath) {
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    return entries
      .filter(entry => entry.isDirectory())
      .map(entry => path.join(dirPath, entry.name));
  } catch (err) {
    console.error("Erreur lecture dossier :", err);
    return [];
  }
}
function listAudioFiles(dirPath,type) {
  try {
    const entries = fs.readdirSync(dirPath);
    return entries
      .filter(f => f.endsWith("."+type))
    .map(f => path.join(dirPath, f));
  } catch (err) {
    console.error("Erreur lecture fichiers :", err);
    return [];
  }
}
function listImgFiles(dirPath,type) {
  try {
    const entries = fs.readdirSync(dirPath);
    return entries
      .filter(f => f.endsWith("."+type))
    .map(f => path.join(dirPath, f));
  } catch (err) {
    console.error("Erreur lecture fichiers :", err);
    return [];
  }
}
// ****************************************************************************************************************
function mainExternes(txt) {
	var defc=JSON.parse(atob(txt));
	console.log('importExterne',defc);
	editor=defc.editor;
	daw=defc.daw;
	cmdDaw=defc.cmdDaw;
	pdfPage=parseInt(defc.pdfPage);
	pdfLandscape=defc.pdfLandscape;
	pdfScale=parseFloat(defc.pdfScale);
	pdfMgTop=parseFloat(defc.pdfMgTop);
	pdfMgBot=parseFloat(defc.pdfMgBot);
	pdfMgLeft=parseFloat(defc.pdfMgLeft);
	pdfMgRight=parseFloat(defc.pdfMgRight);
	pdfBkg=parseInt(defc.pdfBkg);
	editAudioCmd=defc.editAudioCmd;
}
function mainExternes2(txt) {
	var defc=JSON.parse(decodeURIComponent(escape(atob(txt))));
	projetName=defc.name;
	projetPath=defc.path;
	audioPath=defc.audioPath;
	imgPath=defc.imgPath;
	if (audioPath && !fs.existsSync(audioPath)) {
		try { fs.mkdirSync(audioPath, { recursive: true }); } catch(e) { console.error('Erreur création dossier Audios:', e); }
	}
	if (imgPath && !fs.existsSync(imgPath)) {
		try { fs.mkdirSync(imgPath, { recursive: true }); } catch(e) { console.error('Erreur création dossier Images:', e); }
	}
	editor=defc.editor;
	daw=defc.daw;
	cmdDaw=defc.cmdDaw;
	pdfPage=parseInt(defc.pdfPage);
	pdfLandscape=defc.pdfLandscape;
	pdfScale=parseFloat(defc.pdfScale);
	pdfMgTop=parseFloat(defc.pdfMgTop);
	pdfMgBot=parseFloat(defc.pdfMgBot);
	pdfMgLeft=parseFloat(defc.pdfMgLeft);
	pdfMgRight=parseFloat(defc.pdfMgRight);
	pdfBkg=parseInt(defc.pdfBkg);
	editAudioCmd=defc.editAudioCmd;
}
ipcMain.handle('launchReaperHoaBinaural', async (event, ambiXPath, hoaOrder, sampleRate) => {
    const scriptsPath = app.isPackaged
        ? path.join(process.resourcesPath, 'Scripts')
        : path.join(__dirname, 'resources', 'Scripts');

    // Écrire le fichier de config dans le dossier Resources de Reaper
    const reaperResourcePath = path.join(app.getPath('home'), '.config', 'REAPER');
    if (!fs.existsSync(reaperResourcePath)) fs.mkdirSync(reaperResourcePath, { recursive: true });
    const configFile = path.join(reaperResourcePath, 'kandiskyscore_hoa.txt');
    fs.writeFileSync(configFile, [ambiXPath, hoaOrder, sampleRate].join('\n'), 'utf8');

    const luaScript = path.join(scriptsPath, 'Reaper', 'importHoaBinaural.lua');
    const tmpRpp    = path.join(scriptsPath, 'Reaper', 'tmp.rpp');
    const cmd = `"${cmdDaw}" "${tmpRpp}" "${luaScript}"`;
    return new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
            if (error) { console.error('Reaper HOA:', error.message); }
            resolve({ configFile, luaScript });
        });
    });
});

ipcMain.handle('launchReaperHoaAllRA', async (event, ambiXPath, hoaOrder, sampleRate, layoutName) => {
    const scriptsPath = app.isPackaged
        ? path.join(process.resourcesPath, 'Scripts')
        : path.join(__dirname, 'resources', 'Scripts');

    // Charger le JSON du layout
    const layoutPath = app.isPackaged
        ? path.join(process.resourcesPath, 'Dsp', layoutName + '.json')
        : path.join(__dirname, 'resources', 'Dsp', layoutName + '.json');
    if (!fs.existsSync(layoutPath)) throw new Error('Layout introuvable : ' + layoutPath);
    const layoutJSON = JSON.parse(fs.readFileSync(layoutPath, 'utf8'));
    const speakers = layoutJSON.speakers;

    // Conversion Cartésien KS → sphérique AllRADecoder
    const spkSph = speakers.map((sp) => {
        const r  = Math.sqrt(sp.x*sp.x + sp.y*sp.y + sp.z*sp.z) || 1;
        const nx = sp.x/r, ny = sp.y/r, nz = sp.z/r;
        return {
            az: Math.atan2(-nx, nz) * 180 / Math.PI,
            el: Math.asin(Math.max(-1, Math.min(1, ny))) * 180 / Math.PI,
            r
        };
    });

    // Écrire le fichier de config AllRA
    const reaperResourcePath = path.join(app.getPath('home'), '.config', 'REAPER');
    if (!fs.existsSync(reaperResourcePath)) fs.mkdirSync(reaperResourcePath, { recursive: true });
    const configFile = path.join(reaperResourcePath, 'kandiskyscore_allra.txt');
    const spkLines = spkSph.map(sp => `${sp.az.toFixed(4)},${sp.el.toFixed(4)},${sp.r.toFixed(4)}`);
    const lines = [ambiXPath, String(hoaOrder), String(sampleRate), layoutName, String(speakers.length), ...spkLines];
    fs.writeFileSync(configFile, lines.join('\n'), 'utf8');

    // Générer le JSON AllRADecoder (fallback si vst_chunk échoue dans le Lua)
    const allraJSON = {
        LoudspeakerLayout: {
            Name: layoutName,
            Loudspeakers: spkSph.map((sp, i) => ({
                Azimuth:     parseFloat(sp.az.toFixed(4)),
                Elevation:   parseFloat(sp.el.toFixed(4)),
                Radius:      parseFloat(sp.r.toFixed(4)),
                IsImaginary: false,
                Channel:     i + 1,
                Gain:        1.0
            }))
        }
    };
    const jsonPath = path.join(reaperResourcePath, 'allra_layout.json');
    fs.writeFileSync(jsonPath, JSON.stringify(allraJSON, null, 2), 'utf8');

    const luaScript = path.join(scriptsPath, 'Reaper', 'importHoaAllRA.lua');
    const tmpRpp    = path.join(scriptsPath, 'Reaper', 'tmp.rpp');
    const cmd = `"${cmdDaw}" "${tmpRpp}" "${luaScript}"`;
    return new Promise((resolve) => {
        exec(cmd, (error) => {
            if (error) console.error('Reaper AllRA:', error.message);
            resolve({ configFile, jsonPath, luaScript, nSpeakers: speakers.length });
        });
    });
});

// ── Helpers Ardour ─────────────────────────────────────────────────
function findArdourScriptsDir(homeDir) {
    for (const ver of ['ardour8', 'ardour7', 'ardour6', 'ardour5']) {
        const confDir = path.join(homeDir, '.config', ver);
        if (fs.existsSync(confDir)) {
            const scriptsDir = path.join(confDir, 'scripts');
            if (!fs.existsSync(scriptsDir)) fs.mkdirSync(scriptsDir, { recursive: true });
            return scriptsDir;
        }
    }
    return null;
}

ipcMain.handle('launchArdourHoaBinaural', async (event, ambiXPath, hoaOrder, sampleRate) => {
    const scriptsPath = app.isPackaged
        ? path.join(process.resourcesPath, 'Scripts')
        : path.join(__dirname, 'resources', 'Scripts');

    // Écrire la config dans ~/.config/kandiskyscore/
    const ksConfigDir = path.join(app.getPath('home'), '.config', 'kandiskyscore');
    if (!fs.existsSync(ksConfigDir)) fs.mkdirSync(ksConfigDir, { recursive: true });
    const configFile = path.join(ksConfigDir, 'kandiskyscore_hoa.txt');
    fs.writeFileSync(configFile, [ambiXPath, hoaOrder, sampleRate].join('\n'), 'utf8');

    // Copier le script dans le dossier scripts Ardour
    const luaScript = path.join(scriptsPath, 'Ardour', 'importHoaBinaural.lua');
    const ardourScriptsDir = findArdourScriptsDir(app.getPath('home'));
    if (ardourScriptsDir) {
        fs.copyFileSync(luaScript, path.join(ardourScriptsDir, 'importHoaBinaural.lua'));
    }

    // Lancer Ardour
    const ardourCmd = process.platform === 'win32' ? 'ardour.exe' : 'ardour';
    exec(ardourCmd, (error) => {
        if (error) console.error('Ardour HOA binaural:', error.message);
    });

    return { configFile, ardourScriptsDir };
});

ipcMain.handle('launchArdourHoaAllRA', async (event, ambiXPath, hoaOrder, sampleRate, layoutName) => {
    const scriptsPath = app.isPackaged
        ? path.join(process.resourcesPath, 'Scripts')
        : path.join(__dirname, 'resources', 'Scripts');

    // Charger le JSON du layout
    const layoutPath = app.isPackaged
        ? path.join(process.resourcesPath, 'Dsp', layoutName + '.json')
        : path.join(__dirname, 'resources', 'Dsp', layoutName + '.json');
    if (!fs.existsSync(layoutPath)) throw new Error('Layout introuvable : ' + layoutPath);
    const layoutJSON = JSON.parse(fs.readFileSync(layoutPath, 'utf8'));
    const speakers = layoutJSON.speakers;

    // Conversion Cartésien KS → sphérique AllRADecoder
    const spkSph = speakers.map((sp) => {
        const r  = Math.sqrt(sp.x*sp.x + sp.y*sp.y + sp.z*sp.z) || 1;
        const nx = sp.x/r, ny = sp.y/r, nz = sp.z/r;
        return {
            az: Math.atan2(-nx, nz) * 180 / Math.PI,
            el: Math.asin(Math.max(-1, Math.min(1, ny))) * 180 / Math.PI,
            r
        };
    });

    // Écrire la config dans ~/.config/kandiskyscore/
    const ksConfigDir = path.join(app.getPath('home'), '.config', 'kandiskyscore');
    if (!fs.existsSync(ksConfigDir)) fs.mkdirSync(ksConfigDir, { recursive: true });
    const configFile = path.join(ksConfigDir, 'kandiskyscore_allra.txt');
    const spkLines = spkSph.map(sp => `${sp.az.toFixed(4)},${sp.el.toFixed(4)},${sp.r.toFixed(4)}`);
    const lines = [ambiXPath, String(hoaOrder), String(sampleRate), layoutName, String(speakers.length), ...spkLines];
    fs.writeFileSync(configFile, lines.join('\n'), 'utf8');

    // Générer le JSON AllRADecoder (JSON.stringify garantit des points décimaux quelle que soit la locale)
    const allraJSON = {
        LoudspeakerLayout: {
            Name: layoutName,
            Loudspeakers: spkSph.map((sp, i) => ({
                Azimuth:     parseFloat(sp.az.toFixed(4)),
                Elevation:   parseFloat(sp.el.toFixed(4)),
                Radius:      parseFloat(sp.r.toFixed(4)),
                IsImaginary: false,
                Channel:     i + 1,
                Gain:        1.0
            }))
        }
    };
    const jsonPath = path.join(ksConfigDir, 'allra_layout.json');
    fs.writeFileSync(jsonPath, JSON.stringify(allraJSON, null, 2), 'utf8');

    // Copier le script dans le dossier scripts Ardour
    const luaScript = path.join(scriptsPath, 'Ardour', 'importHoaAllRA.lua');
    const ardourScriptsDir = findArdourScriptsDir(app.getPath('home'));
    if (ardourScriptsDir) {
        fs.copyFileSync(luaScript, path.join(ardourScriptsDir, 'importHoaAllRA.lua'));
    }

    // Lancer Ardour
    const ardourCmd = process.platform === 'win32' ? 'ardour.exe' : 'ardour';
    exec(ardourCmd, (error) => {
        if (error) console.error('Ardour HOA AllRA:', error.message);
    });

    return { configFile, jsonPath, ardourScriptsDir, nSpeakers: speakers.length };
});

function mainRead3D() {
	const scriptsPath = app.isPackaged ? path.join(process.resourcesPath, 'Scripts') : path.join(__dirname, 'resources', 'Scripts');
	if(daw=='reaper'){
		cmd=`"${cmdDaw}" "${path.join(scriptsPath,'Reaper','tmp.rpp')}" "${path.join(scriptsPath,'Reaper','importKandiskyScore2.lua')}"`;
		exec(cmd, (error, stdout, stderr) => {
		    if (error) { console.log(`error: ${error.message}`); return; }
		    if (stderr) { console.log(`stderr: ${stderr}`); return; }
		    console.log(`stdout: ${stdout}`);
		});
	}else{
		const tmpDir        = path.join(app.getPath('home'), 'kandiskyscore', 'Scripts', 'Ardour', 'tmp');
		const tmpArdour     = path.join(tmpDir, 'tmp.ardour');
		const autoInsertTxt = path.join(app.getPath('appData'), 'kandiskyscore', 'autoInsert.txt');

		// Générer la session Ardour complète depuis autoInsert.txt
		try {
			const { buildArdourSession } = require('./buildArdourSession');
			const templatePath      = path.join(scriptsPath, 'Ardour', 'template.ardour');
			const autoInsertContent = fs.readFileSync(autoInsertTxt, 'utf8');
			const templateXml       = fs.readFileSync(templatePath, 'utf8');
			const generatedXml      = buildArdourSession(autoInsertContent, templateXml);
			fs.ensureDirSync(tmpDir);
			fs.writeFileSync(tmpArdour, generatedXml);
			console.log('Session Ardour générée :', tmpArdour);
			// Lancer Ardour sans argument pour qu'il propose son dialog de sélection de session
			const ardourCmd = process.platform === 'win32' ? 'ardour.exe' : 'ardour';
			exec(ardourCmd, (error) => {
				if (error) console.error(`Ardour error: ${error.message}`);
			});
		} catch(e) {
			console.log('Erreur génération session Ardour:', e.message);
			dialog.showErrorBox('KandiskyScore', 'Erreur génération session Ardour :\n' + e.message);
		}
	}
}

function defProjet(){
	mainWindow.webContents.send("fromMain", "configProjet");
}
function defTheme() {
	mainWindow.webContents.send("fromMain", "defTheme");
}
function objetAudio(id) {
	console.log("id2",id);
	var rt="";
	var audiofile = dialog.showOpenDialog({
	properties: [
    'openFile'],
   defaultPath: path.join(app.getPath('home'),'kandiskyscore','Projets'),
	filters: [
    { name: 'Audios', extensions: ['wav', 'flac', 'ogg', 'aiff'] },
    { name: 'All Files', extensions: ['*'] }
  ]
   }).then(result => {
   	if (result.canceled) return;
   		console.log("result.filePaths",result.filePaths[0],id,soxiPath);
   		let wsoxi="";
   		let chans ="";
		   let rate ="";
		   let nbsamples = "";
   		rt=result.filePaths[0];
   		try {
	   		if(os.platform()=="win32"){
	   			wsoxi=path.join(baseDir, "win", "sox.exe");
	   			
	   			chans = parseInt(execSync(`"${wsoxi}" --i -c "${rt}"`).toString().trim(), 10);
			    	rate = parseInt(execSync(`"${wsoxi}" --i -r "${rt}"`).toString().trim(),10);
			   	nbsamples = parseInt(execSync(`"${wsoxi}" --i -s "${rt}"`).toString().trim(),10);
			   	
	   		}else{
		   		chans = parseInt(execSync(`"${soxiPath}" -c "${rt}"`).toString().trim(), 10);
				   rate = parseInt(execSync(`"${soxiPath}" -r "${rt}"`).toString().trim(),10);
				   nbsamples = parseInt(execSync(`"${soxiPath}" -s "${rt}"`).toString().trim(),10);
			    }
		    } catch (err) {
			    console.error("soxi failed:", err);
			    dialog.showErrorBox("Erreur audio", "Impossible de lire le fichier audio.");
			    return;
			  }
			const dir = path.dirname(rt);
		const base = path.basename(rt);
		let destFile = rt;
		let destDir = dir;
		// Copier le fichier dans audioPath s'il vient d'un autre dossier
		if(path.resolve(dir) !== path.resolve(audioPath)){
			const dest = path.join(audioPath, base);
			try {
				fs.copyFileSync(rt, dest);
				destFile = dest;
				destDir = audioPath;
			} catch(e) {
				console.error("Erreur copie fichier audio:", e);
				dialog.showErrorBox("Erreur", "Impossible de copier le fichier dans le dossier audio du projet.");
				return;
			}
		}
		mainWindow.webContents.send("fromMain", "loadSound;"+id+";"+destDir+";"+base+";"+chans+";"+(nbsamples/rate));
  		
	});
}
ipcMain.handle("load-buffers-multichannel", async (_, path) => {
  // 1) lecture brute
  const buffer = fs.readFileSync(path);

  // 2) parsing WAV (PCM / extensible / multicanal OK)
  const wav = new WaveFile(buffer);

  // 3) conversion float32 (important pour DSP / WAM)
  wav.toBitDepth("32f");

  // 4) extraction des canaux (déinterleavé)
  const channels = wav.getSamples(true); 
  // => [Float32Array, Float32Array, ...]

  const sampleRate = wav.fmt.sampleRate;
  const length = channels[0].length;
  const duration = length / sampleRate;

  return {
    sampleRate,
    duration,
    numberOfChannels: channels.length,
    channels
  };
});
ipcMain.handle('stft', async (event, buffer, fftSize, hopSize, sampleRate) => {
    const fft = new FFTModule(fftSize);

    const window = new Float32Array(fftSize);
    for (let i = 0; i < fftSize; i++) {
        window[i] = 0.5 * (1 - Math.cos(2 * Math.PI * i / (fftSize - 1)));
    }

    const frames = [];

    for (let pos = 0; pos + fftSize <= buffer.length; pos += hopSize) {

        const frame = new Float32Array(fftSize);
        for (let i = 0; i < fftSize; i++) {
            frame[i] = buffer[pos + i] * window[i];
        }

        const spectrum = fft.createComplexArray();
        fft.realTransform(spectrum, frame);
        fft.completeSpectrum(spectrum);

        frames.push({
            time: pos / sampleRate,
            spectrum
        });
    }

    return frames;
});

ipcMain.handle("showSaveDialog", async (event, defaultPath) => {

    const { canceled, filePath } = await dialog.showSaveDialog({
        title: "Sauvegarder le rendu audio",
        defaultPath: defaultPath || "rendu.wav",
        filters: [
            { name: "WAV audio", extensions: ["wav"] }
        ]
    });

    if (canceled) return null;

    return filePath;
});

ipcMain.handle('renderBinauralFromAmbiX', async (event, ambiXPath, outPath) => {
    const scriptPath = path.join(__dirname, 'hoa_binaural.py');
    const result = spawnSync('python3', [scriptPath, ambiXPath, outPath], { stdio: 'inherit' });
    if (result.error) throw result.error;
    if (result.status !== 0) throw new Error(`hoa_binaural.py exited with code ${result.status}`);
    return { output: outPath };
});

ipcMain.handle('renderHoaAmbiXMix', async (event, objects, exportDir) => {
    const tmpDir = path.join(exportDir, 'tmp_hoa');
    fs.mkdirSync(tmpDir, { recursive: true });

    const paddedFiles = [];
    const endTimes = [];

    for (let idx = 0; idx < objects.length; idx++) {
        const obj = objects[idx];
        if (!fs.existsSync(obj.file)) {
            console.warn('[HOA mix] fichier absent:', obj.file);
            continue;
        }
        const tStart = obj.posX / 18;
        let duration;
        try {
            duration = parseFloat(execSync(`"${soxiPath}" -D "${obj.file}"`).toString().trim());
        } catch(e) {
            console.error('[HOA mix] soxi erreur:', e);
            continue;
        }
        endTimes.push(tStart + duration);
        const tmpOut = path.join(tmpDir, `hoa_padded_${idx}.wav`);
        spawnSync(soxPath, [obj.file, tmpOut, 'pad', tStart.toString()], { stdio: 'inherit' });
        paddedFiles.push(tmpOut);
    }

    if (paddedFiles.length === 0) return { error: 'Aucun fichier AmbiX trouve' };

    const mixDuration = Math.max(...endTimes);
    const output = path.join(exportDir, 'partition_ambiX.wav');

    let args;
    if (paddedFiles.length > 1) {
        args = ['-m', ...paddedFiles, output, 'trim', '0', mixDuration.toString()];
    } else {
        args = [paddedFiles[0], output];
    }
    console.log('[HOA mix] SoX:', [soxPath, ...args].join(' '));
    spawnSync(soxPath, args, { stdio: 'inherit' });

    // Nettoyage tmp
    for (const f of paddedFiles) { try { fs.unlinkSync(f); } catch(_) {} }
    try { fs.rmdirSync(tmpDir); } catch(_) {}

    return { output };
});


ipcMain.handle('renderGroupWidthSoX', async (event, lsgrp,tbobjets,start) => {


    tableObjet = JSON.parse(tbobjets);
	
    // lsgrp peut être "[0,1,2]" ou "0,1,2"
    if (typeof lsgrp === "string") {
        try {
            lsgrp = JSON.parse(lsgrp);
        } catch {
            lsgrp = lsgrp.split(",").map(n => Number(n));
        }
    }
    console.log("audioPath",audioPath);
	if(lsgrp.length>0){
    const tmpDir = path.join(audioPath, "tmp");
    //if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

    let paddedFiles = [];
    let endTimes = [];
	 let durationAfterSpeed =0;
    let idx = 0;
    for (let i of lsgrp) {

        const obj = tableObjet[i];

        const objfile = path.join(audioPath,obj.file);
        const { dir, name } = path.parse(objfile);
        const premixFile = path.join(tmpDir, `${obj.id}-premix.wav`);
        const input = fs.existsSync(premixFile) ? premixFile : path.join(tmpDir, `${obj.id}-fx.wav`);
			console.log("sox_dir", input);
        // Position dans la timeline (en secondes)
        const tStart = (obj.posX-start) / 18;

        // Durée réelle du fichier
        let realDuration;
        if(platform=='win32'){
        		var wsoxPath = path.join(baseDir, "win", "sox.exe ");
        		realDuration = parseFloat(
            execSync(`"${wsoxPath}" --info -D "${input}"`).toString()
        		);
        }else{
        	console.log("soxi",soxiPath);
	        realDuration = parseFloat(execSync(`"${soxiPath}" -D "${input}"`).toString());
        }

        // Durée demandée après trim
        let trimmedDuration = (obj.fin - obj.debut)*realDuration ;
        if (trimmedDuration < 0) trimmedDuration = 0;

       
        // SPEED dans SoX : si transposition < 1 → ralentissement
        const speedFactor = obj.transposition || 1;

        // Durée finale après speed
        durationAfterSpeed = trimmedDuration / speedFactor;

        console.log(
            "realDuration=", realDuration,
            "trim=", trimmedDuration,
            "afterSpeed=", durationAfterSpeed
        );

        // Fin dans la timeline
        const tEnd = tStart + durationAfterSpeed;
        endTimes.push(tEnd);

        const tmpOut = path.join(tmpDir, `object_${idx}.wav`);
        console.log("path", input, tmpOut);
		  var fade = obj.fadeIn +" "+(durationAfterSpeed*obj.envX[0])+" "+durationAfterSpeed+" "+durationAfterSpeed*(1-obj.envX[1]);
        // -- COMMAND SOX ---------------------------------------------------
        spawnSync(soxPath, [
			  input,
			  tmpOut,
			  "trim", obj.debut.toString(), trimmedDuration.toString(),
			  "pitch", (obj.detune * 100).toString(),
			  "speed", speedFactor.toString(),
			  "vol", obj.gain.toString(),
			  "fade", obj.fadeIn.toString(),
			          (durationAfterSpeed * obj.envX[0]).toString(),
			          durationAfterSpeed.toString(),
			          (durationAfterSpeed * (1 - obj.envX[1])).toString(),
			  "pad", tStart.toString()
			], {
			  stdio: "inherit"
			});
        paddedFiles.push(tmpOut);

        idx++;
    }

    // Durée finale pour le mix
    const mixDuration = Math.max(...endTimes);
    console.log("mixDuration", endTimes);
    // Fichier final
    let output;
	  if (paddedFiles.length > 1) {
	    output = path.join(app.getPath('userData') , "renduout.wav");
	    // Crée le dossier si nécessaire
	    fs.mkdirSync(path.dirname(output), { recursive: true });
	  } else {
	    output = path.join(audioPath, "exports", `${tableObjet[lsgrp[0]].id}.wav`);
	    fs.mkdirSync(path.dirname(output), { recursive: true });
	  }
	
	  console.log("Préparation mix final:", paddedFiles, "Nombre de fichiers:", paddedFiles.length);
	  console.log("Output choisi:", output);
	
	  // Construction des arguments pour spawnSync (séparés, sécurisés)
	  let args = [];
	
	  if (paddedFiles.length > 1) {
		  args.push("-m", ...paddedFiles); // mix
		  args.push(output);
		  args.push("trim", "0", mixDuration.toString());
		  args.push("fade", "0.005", "0", "0.02");
		} else {
		  args.push(paddedFiles[0]);
		  args.push("-b", "32");
		  args.push(output);
		  args.push("fade", "0.005", "0", "0.1");
		}
	
	  console.log("Commande SoX:", [soxPath, ...args].join(" "));
	
	  // Exécution sécurisée
	  const result = spawnSync(soxPath, args, { stdio: "inherit" });
	
	  if (result.error) {
	    throw new Error(`Erreur lors du mix final: ${result.error.message}`);
	  }
	
	  return {
	    duration: mixDuration,
	    output
	  };
   }
});

function replaceAudio(id,rt) {
	winConfig.webContents.send("fromMain", "defAudioObj;"+id+";"+rt+";1");
  	mainWindow.webContents.send("fromMain", "audioImport;"+id+";"+rt+";1;0");
}
function saveFxAudio(id,rt) {
  	mainWindow.webContents.send("fromMain", "audioImport;"+id+";"+rt+";1;1");
}

function defBkgImg(id) {
	console.log("id2",id);
	var rt="";
	var imgfile = dialog.showOpenDialog({
	properties: [
    'openFile'],
   defaultPath: path.join(app.getPath('home'), 'kandiskyscore', 'Projets', projetName),
	filters: [
    { name: 'img', extensions: ['png', 'jpg', 'svg'] },
    { name: 'All Files', extensions: ['*'] }
  ]
   }).then(result => {
   	if(result.canceled==false){
   		console.log("result.filePaths",result.filePaths[0],id);
   		rt=result.filePaths[0];
   	}
  		winGraphObj.webContents.send("fromMain", "defBkgImg;"+id+";"+rt);
  		if(winConfigEtat==1){
  			winConfig.webContents.send("fromMain", "defBkgImg;"+id+";"+rt);
  		}
  		mainWindow.webContents.send("fromMain", "defBkgImg;"+id+";"+rt);
	});
}
function defBkgGrpImg(id) {
	console.log("id2",id);
	var rt="";
	var imgfile = dialog.showOpenDialog({
	properties: [
    'openFile'],
   defaultPath: path.join(app.getPath('home'), 'kandiskyscore', 'Projets'),
	filters: [
    { name: 'img', extensions: ['png', 'jpg', 'svg'] },
    { name: 'All Files', extensions: ['*'] }
  ]
   }).then(result => {
   	if(result.canceled==false){
   		console.log("result.filePaths",result.filePaths[0],id);
   		rt=result.filePaths[0];
   	}
  		mainWindow.webContents.send("fromMain", "defBkgGrpImg;"+id+";"+rt);
  		if(winGraphGrpEtat==1){
  			winGraphGrp.webContents.send("fromMain", "defGrpImg;"+id+";"+rt);
  		}
	});
}
function defSymbBkgImg(id) {
	console.log("id2",id);
	var rt="";
	var imgfile = dialog.showOpenDialog({
	properties: [
    'openFile'],
   defaultPath: path.join(app.getPath('home'), 'kandiskyscore', 'Projets'),
	filters: [
    { name: 'img', extensions: ['png', 'jpg', 'svg'] },
    { name: 'All Files', extensions: ['*'] }
  ]
   }).then(result => {
   	if(result.canceled==false){
   		console.log("result.filePaths",result.filePaths[0],id);
   		rt=result.filePaths[0];
   	}
  		winGraphSymb.webContents.send("fromMain", "defSymbBkgImg;"+id+";"+rt);
  		if(winConfigEtat==1){
  			winConfig.webContents.send("fromMain", "defBkgImg;"+id+";"+rt);
  		}
  		mainWindow.webContents.send("fromMain", "defSymbBkgImg;"+id+";"+rt);
	});
}
function selectImg() {
	var rt="";
	var imgfile = dialog.showOpenDialog({
	properties: [
    'openFile'],
   defaultPath: path.join(app.getPath('home'), 'kandiskyscore', 'Projets', projetName),
	filters: [
    { name: 'img', extensions: ['png', 'jpg', 'svg'] },
    { name: 'All Files', extensions: ['*'] }
  ]
   }).then(result => {
   	if(result.canceled==false){
   		rt=result.filePaths[0];
   	}
  		mainWindow.webContents.send("fromMain", "defSelectImg;"+rt);
	});
}
function selectTheme() {
	var rt="";
	var themeFile = dialog.showOpenDialog({
	properties: [
    'openFile'],
   defaultPath: themesPath,
	filters: [
    { name: 'All Files', extensions: ['*'] }
  ]
   }).then(result => {
   	if(result.canceled==false){
   		rt=result.filePaths[0];
   	}
  		mainWindow.webContents.send("fromMain", "selectTheme;"+result.filePaths[0]);
	});
}
function interp() {
	var rt="";
	var themeFile = dialog.showOpenDialog({
	properties: [
    'openFile'],
   defaultPath: path.join(app.getPath('home'), 'kandiskyscore', 'Actions'),
	filters: [
    { name: 'Js', extensions: ['js'] }
  ]
   }).then(result => {
   	if(result.canceled==false){
   		rt=result.filePaths[0];
   	}
  		//mainWindow.webContents.send("fromMain", "selectTheme;"+result.filePaths[0]);
  		mainWindow.webContents.send("fromMain", "interpreteur;"+rt);
	});
	
}


ipcMain.handle('spectralShift', async (
    event,
    buffers,       // Float32Array[] par canal
    sampleRate,
    start,         // début de la sélection (en samples)
    end,           // fin de la sélection (en samples)
    fTarget,       // fréquence cible
    objSelect      // objet contenant Fl/Fh
) => {

    const fftSize = 2048;
    const hop = fftSize / 4;
    const fft = new FFTModule(fftSize);

    const length = end - start;
    if (!Array.isArray(buffers) || buffers.length === 0 || length <= 0) return buffers;
    if (!Number.isFinite(fTarget) || !objSelect || !Number.isFinite(objSelect.Fl) || !Number.isFinite(objSelect.Fh)) return buffers;

    buffers = buffers.map(ch => new Float32Array(ch));

    // fenêtre Hann
    const window = new Float32Array(fftSize);
    for (let i = 0; i < fftSize; i++) window[i] = 0.5 * (1 - Math.cos(2 * Math.PI * i / (fftSize - 1)));

    const shiftedBuffers = buffers.map(ch => {
        const out = new Float32Array(length);

        for (let offset = 0; offset < length; offset += hop) {
            const input = fft.createComplexArray();
            const spectrum = fft.createComplexArray();
            const shifted = fft.createComplexArray();
            const output = fft.createComplexArray();

            input.fill(0);
            shifted.fill(0);

            // remplissage input avec zéro-padding
            for (let i = 0; i < fftSize; i++) {
                const idx = start + offset + i;
                input[2*i] = (ch && idx < ch.length && idx < end) ? ch[idx] * window[i] : 0;
                input[2*i+1] = 0;
            }

            fft.realTransform(spectrum, input);
            fft.completeSpectrum(spectrum);

            // calcul binShift
            const fSel = (objSelect.Fl + objSelect.Fh) / 2;
            const binWidth = sampleRate / fftSize;
            const binShift = Math.round((fTarget - fSel) / binWidth);

            // décalage avec wrap-around
            const half = fftSize / 2;
            for (let k = 0; k < half; k++) {
                const targetBin = (k + binShift + half) % half;
                shifted[2*targetBin] = spectrum[2*k];
                shifted[2*targetBin+1] = spectrum[2*k+1];
            }

            fft.inverseTransform(output, shifted);

            // overlap-add compensé pour garder le volume
            // hop = fftSize/4 → facteur 4 pour compenser l'overlap
            for (let i = 0; i < fftSize; i++) {
                const outIdx = offset + i;
                if (outIdx < length) out[outIdx] += output[2*i] * window[i] * 4;
            }
        }

        return out;
    });

    return shiftedBuffers;
});

ipcMain.handle('eraseSelection', async (event, buffers, sampleRate, objSelect) => {
    if (!buffers || !buffers.length) return buffers;

    const fftSize = 2048;
    const hop     = fftSize / 4;
    const bins    = fftSize / 2;

    const window = new Float32Array(fftSize);
    for (let i = 0; i < fftSize; i++)
        window[i] = 0.5 * (1 - Math.cos(2 * Math.PI * i / (fftSize - 1)));

    const binStart    = Math.floor(objSelect.Fl * fftSize / sampleRate);
    const binEnd      = Math.ceil(objSelect.Fh * fftSize / sampleRate);
    const startSample = Math.floor(objSelect.debut * sampleRate);
    const endSample   = Math.floor(objSelect.fin * sampleRate);

    const fft = new FFTModule(fftSize);

    const outBuffers = buffers.map((channelSignal) => {
        const length = channelSignal.length;

        // 1️⃣ Zone sélectionnée avec padding avant
        const pad = fftSize;
        const selStart = Math.max(0, startSample - pad);
        const selEnd   = endSample;
        const selLength = selEnd - selStart;
        const signal = channelSignal.subarray(selStart, selEnd);

        // 2️⃣ STFT
        const frames = Math.floor((signal.length - fftSize) / hop) + 1;
        const real = [];
        const imag = [];

        for (let f = 0; f < frames; f++) {
            const pos = f * hop;
            const input = fft.createComplexArray();
            const spectrum = fft.createComplexArray();
            input.fill(0);

            for (let i = 0; i < fftSize; i++) {
                input[2*i]   = (pos + i < signal.length) ? signal[pos + i] * window[i] : 0;
                input[2*i+1] = 0;
            }

            fft.realTransform(spectrum, input);
            fft.completeSpectrum(spectrum);

            const frameReal = new Float32Array(bins);
            const frameImag = new Float32Array(bins);
            for (let k = 0; k < bins; k++) {
                frameReal[k] = spectrum[2*k];
                frameImag[k] = spectrum[2*k+1];
            }

            real.push(frameReal);
            imag.push(frameImag);
        }

        // 3️⃣ Masque spectral
        for (let f = 0; f < frames; f++) {
            const frameStart = f * hop + selStart;
            const frameEnd   = frameStart + fftSize;

            if (frameEnd <= startSample || frameStart >= endSample) continue;

            for (let k = binStart; k <= binEnd && k < bins; k++) {
                real[f][k] = 0;
                imag[f][k] = 0;
            }
        }

        // 4️⃣ ISTFT
        const accum = new Float32Array(selLength);
        const norm  = new Float32Array(selLength);

        for (let f = 0; f < frames; f++) {
            const spectrum = fft.createComplexArray();
            const frame    = fft.createComplexArray();

            for (let k = 0; k < bins; k++) {
                spectrum[2*k]   = real[f][k];
                spectrum[2*k+1] = imag[f][k];
            }

            fft.completeSpectrum(spectrum);
            fft.inverseTransform(frame, spectrum);

            const pos = f * hop;
            for (let i = 0; i < fftSize; i++) {
                const idx = pos + i;
                if (idx >= selLength) break;

                accum[idx] += frame[2*i] * window[i];
                norm[idx]  += window[i] * window[i];
            }
        }

        for (let i = 0; i < selLength; i++) {
            if (norm[i] > 0) accum[i] /= norm[i];
        }

        // 5️⃣ Fade-out cosinus fixe 30 ms (ANTI-ARTEFACT FIN)
        const fadeDuration = 0.03; // 30 ms
        const fadeSamples = Math.floor(fadeDuration * sampleRate);

        for (let i = 0; i < selLength; i++) {
            const globalIdx = selStart + i;

            if (globalIdx >= endSample - fadeSamples && globalIdx < endSample) {
                const x = (endSample - globalIdx) / fadeSamples;
                const gain = 0.5 * (1 - Math.cos(Math.PI * x));
                accum[i] *= Math.max(0, Math.min(1, gain));
            }
        }

        // 6️⃣ Recoller dans le buffer original
        const out = new Float32Array(length);
        out.set(channelSignal);

        for (let i = startSample; i < endSample; i++) {
            const idxInSel = i - selStart;
            if (idxInSel >= 0 && idxInSel < accum.length)
                out[i] = accum[idxInSel];
        }

        return out;
    });

    return outBuffers;
});
ipcMain.handle('filtreSelection', async (event, currentBuffers,sampleRate, objSelect) => {
    if (objSelect.Fl === undefined || objSelect.Fh === undefined)
        return currentBuffers;

    const fftSize = 2048;
    const hop     = fftSize / 4;
    const bins    = fftSize / 2;

    const window = new Float32Array(fftSize);
    for (let i = 0; i < fftSize; i++)
        window[i] = 0.5 * (1 - Math.cos(2 * Math.PI * i / (fftSize - 1)));

    const fft = new FFTModule(fftSize);

    const binStart = Math.max(0, Math.floor(objSelect.Fl * fftSize / sampleRate));
    const binEnd   = Math.min(bins - 1, Math.ceil(objSelect.Fh * fftSize / sampleRate));

    const fadeDuration = 0.03; // 30 ms
    const fadeSamples  = Math.floor(fadeDuration * sampleRate);

    const outputBuffers = [];

    for (let ch = 0; ch < currentBuffers.length; ch++) {
        const channelData = currentBuffers[ch];
        const length = channelData.length;

        const accum = new Float32Array(length);
        const norm  = new Float32Array(length);

        const frames = Math.ceil(length / hop);

        for (let f = 0; f < frames; f++) {
            const pos = f * hop;

            const inputFrame    = fft.createComplexArray();
            const spectrumFrame = fft.createComplexArray();
            inputFrame.fill(0);

            for (let i = 0; i < fftSize; i++) {
                const idx = pos + i;
                inputFrame[2*i]   = (idx < length) ? channelData[idx] * window[i] : 0;
                inputFrame[2*i+1] = 0;
            }

            fft.realTransform(spectrumFrame, inputFrame);
            fft.completeSpectrum(spectrumFrame);

            // Masque fréquentiel global
            for (let k = binStart; k <= binEnd; k++) {
                spectrumFrame[2*k]   = 0;
                spectrumFrame[2*k+1] = 0;
            }

            const outputFrame = fft.createComplexArray();
            fft.inverseTransform(outputFrame, spectrumFrame);

            for (let i = 0; i < fftSize; i++) {
                const idx = pos + i;
                if (idx >= length) break;

                accum[idx] += outputFrame[2*i] * window[i];
                norm[idx]  += window[i] * window[i];
            }
        }

        // Normalisation et fade début/fin
        for (let i = 0; i < length; i++) {
            if (norm[i] > 0) accum[i] /= norm[i];
            else accum[i] = channelData[i];

            // Fade début
            if (i < fadeSamples) {
                const x = i / fadeSamples;
                const gain = 0.5 * (1 - Math.cos(Math.PI * x)); // Hann fade
                accum[i] *= gain;
            }

            // Fade fin
            if (i >= length - fadeSamples) {
                const x = (length - i) / fadeSamples;
                const gain = 0.5 * (1 - Math.cos(Math.PI * x));
                accum[i] *= gain;
            }
        }

        outputBuffers.push(accum);
    }

    return outputBuffers;
});
ipcMain.handle('audioSelect', async (event) => {
	const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    defaultPath: path.join(app.getPath('home'), 'kandiskyscore', 'Projets'),
    filters: [
      { name: 'Wave', extensions: ['wav'] }
    ]
  });

  if (result.canceled || !result.filePaths.length) {
    return null;
  }

  return result.filePaths[0];
});
// ****************************************************************************************************************

// Quitter quand toutes les fenêtres sont fermées, sauf sur macOS. Dans ce cas il est courant
// que les applications et barre de menu restents actives jusqu'à ce que l'utilisateur quitte 
// de manière explicite par Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Dans ce fichier vous pouvez inclure le reste du code spécifique au processus principal. Vous pouvez également le mettre dans des fichiers séparés et les inclure ici.


// preload.js

// Toutes les API Node.js sont disponibles dans le processus de préchargement.
// Il a la même sandbox qu'une extension Chrome.
