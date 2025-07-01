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
const { app, dialog, BrowserWindow, Menu, MenuItem, ipcMain, ipcRenderer } = require('electron')
const url = require('url');
const path = require('path')
const fs = require("fs-extra")
//const fsx = require("fs-extra")

let localFilePath='';
//const Buffer = require("buffer")
var copyFileOutsideOfElectronAsar = function (sourceInAsarArchive, destOutsideAsarArchive) {
    if (fs.existsSync(app.getAppPath() + "/" + sourceInAsarArchive)) {

        // file will be copied
        if (fs.statSync(app.getAppPath() + "/" + sourceInAsarArchive).isFile()) {

            let file = destOutsideAsarArchive 
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

}
if (fs.existsSync(app.getPath('appData')+'/kandiskyscore')) {
  console.log('The directory exists');
} else {
  console.log('The directory does NOT exist');
  fs.mkdir(app.getPath('appData')+'/kandiskyscore', (err) => { 
    if (err) { 
        return console.error(err); 
    } 
    console.log('Directory created successfully!'); 
	}); 
}
if (fs.existsSync(app.getPath('home')+'/kandiskyscore')) {
  console.log('The directory exists');
    copyFileOutsideOfElectronAsar('./Scripts', app.getPath('home')+'/kandiskyscore/Scripts')
} else {
  console.log('The directory does NOT exist');
  fs.mkdir(app.getPath('home')+'/kandiskyscore', (err) => { 
    if (err) { 
        return console.error(err); 
    } 
    console.log('Directory '+app.getPath('home')+'/kandiskyscore created successfully!'); 
    copyFileOutsideOfElectronAsar('./Pdf', app.getPath('home')+'/kandiskyscore/Pdf')
    copyFileOutsideOfElectronAsar('./Scripts', app.getPath('home')+'/kandiskyscore/Scripts')
    copyFileOutsideOfElectronAsar('./Dsp', app.getPath('home')+'/kandiskyscore/Dsp')
	}); 
}


fs.access(app.getPath('appData')+'/kandiskyscore/config.js', (err) => {
	   if (err) {
	      console.log('does not exist')
			copyFileOutsideOfElectronAsar('./config.js', app.getPath('appData')+'/kandiskyscore/config.js')
	    } else {
	      console.log('exists')
	    }
   })

copyFileOutsideOfElectronAsar('./menuDefaut.js', app.getPath('appData')+'/kandiskyscore/menuDefaut.js')
const Mn = require(app.getPath('appData')+'/kandiskyscore/menuDefaut.js')
console.log('copy menuDefaut')
fs.access(app.getPath('appData')+'/kandiskyscore/Dsp', (err) => {
	   if (err) {
	      console.log('does not exist')
			copyFileOutsideOfElectronAsar('./Dsp', app.getPath('appData')+'/kandiskyscore/Dsp')
	    } else {
	      console.log('exists')
	    }
   })
fs.access(app.getPath('appData')+'/kandiskyscore/Pdf', (err) => {
	   if (err) {
	      console.log('does not exist')
			copyFileOutsideOfElectronAsar('./Pdf', app.getPath('appData')+'/kandiskyscore/Pdf')
	    } else {
	      console.log('exists')
	    }
   })

const { exec } = require("child_process");

const isMac = process.platform === 'darwin'

let mainWindow =""
let winConfig ="" 
let winConfigEtat=0
let winProjetEtat=0
let winSpatialEtat=0
let winGraphObjEtat=0
let winGraphSymbEtat=0
let winGraphGrpEtat=0
let winTrajectoireEtat=0
let winStudioEtat=0
let winStudio3DEtat=0
let winPreDefEtat=0
let winAideEtat=0
let newStudioEtat=0
let winVueStudio3DEtat=0
let winDocEtat=0
let winSpectroEtat=0
let winSvgEtat=0

let projetName=''
let projetPath=app.getPath('home')+'/kandiskyscore/projets'
let audioPath=app.getPath('home')+'/kandiskyscore/projets'
let imgPath=app.getPath('home')+'/kandiskyscore/projets'
let editor='libreoffice --draw'
let editAudioCmd='audacity'
let daw=0
let cmdDaw=app.getPath('home')+'/Reaper/reaper_linux_x86_64/REAPER/reaper'
let pdfPage=1
let pdfLandscape=1
let pdfScale=1
let pdfMgTop=0.2
let pdfMgBot=0.2
let pdfMgLeft=0.2
let pdfMgRight=0.2
let pdfBkg=0
let pdfAssCmd='pdfunite'
let pdfAppCmd='atril'

let currentProjet=app.getPath('home')+'/kandiskyscore/Projets'
app.disableHardwareAcceleration()
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
      preload: path.join(__dirname, 'preload.js')
    }
    
  })

  // et chargement de l'index.html de l'application.
  mainWindow.loadFile('index.html')
  ipcMain.handle('ping', () =>  mainWindow.getSize())
  
  // Ouvrir les outils de développement.
  mainWindow.webContents.openDevTools()
  
	mainWindow.on('close', e => { // Line 49
  e.preventDefault()
  dialog.showMessageBox({
    type: 'info',
    buttons: [Qcont, Qok],
    cancelId: 1,
    defaultId: 0,
    title: Qwarning,
    detail: Qquit
  }).then(({ response, checkboxChecked }) => {
    console.log(`response: ${response}`)
    if (response) {
      mainWindow.destroy()
      app.quit()
    }
  })
})  
}

// Cette méthode sera appelée quand Electron aura fini
// de s'initialiser et sera prêt à créer des fenêtres de navigation.
// Certaines APIs peuvent être utilisées uniquement quant cet événement est émit.
app.whenReady().then(() => {
	
  createWindow()
  
  

  app.on('activate', () => {
    // Sur macOS il est commun de re-créer une fenêtre  lors 
    // du click sur l'icone du dock et qu'il n'y a pas d'autre fenêtre ouverte.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
 
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
				{ label: "ADM",
					click: () => exportAdm()  }	
  				]
  		 },
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
      { label: Mgrouper },
      { label: Mdegrouper },
      { label: Mregrouper },
      { label: MtoutDegrouper },
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
      { label: Mtempo,
				click: () => tempoAudio() },
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
        click: async () => openDoc() }
    ]
  }
]
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
]
// ****************************************************************************************************************
//																	Popup Menu
// ****************************************************************************************************************

const menuPopup = new Menu()
menuPopup.append(new MenuItem({ label: Mcouper,
click: () => menuPopupCouper()},))
menuPopup.append(new MenuItem({ label: Mcopier,
click: () => menuPopupCopier()},))
menuPopup.append(new MenuItem({ label: Mcoller,
click: () => menuPopupColler()},))
menuPopup.append(new MenuItem({ type: 'separator' }))
menuPopup.append(new MenuItem({ label: Mgrouper,
click: () => menuPopupGrouper()},))
menuPopup.append(new MenuItem({ label: Mdegrouper,
click: () => menuPopupDegrouper()},))
menuPopup.append(new MenuItem({ label: Mregrouper,
click: () => menuPopupRegrouper()},))
menuPopup.append(new MenuItem({ label: MtoutDegrouper,
click: () => menuPopupToutDegrouper()}))

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
	console.log(`Restore ${args} 1 from param`)
    const winMenu = BrowserWindow.fromWebContents(event.sender)
  	 menuPopup.popup(winMenu)
});
function autoFileSave(event,filePath,audioData) {
	const buffer = Buffer.from(audioData)
	fs.writeFile(filePath, buffer, (err) => {
				       if (err) throw err;
		    console.log('Saved! '+filePath)
				    });
}
ipcMain.on ("saveAudio", (event, ...args) => {									// Affichage du menu popup
	console.log(`Save`+ args[1] +` from param`)
    autoFileSave(event,args[1],args[2])
});


// ****************************************************************************************************************
//																	Menu principal
// ****************************************************************************************************************
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
		})
		newStudio.loadFile('studioCreate.html')
		newStudio.setMenu(menu2);
		newStudio.webContents.openDevTools()
		newStudioEtat=1
		

		newStudio.on('close', e => { 		//													Contrôle à la fermeture de la fenêtre
	   e.preventDefault()
	   
	  newStudio.destroy()
	  newStudioEtat=0
	  if(winVueStudio3DEtat==1){
		 winVueStudio3D.destroy()
  		 winVueStudio3DEtat=0
	  }
	}) 
	
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
	  newStudio=0
		console.log('close createStudio')
	}
}

function copyDefautMenu(lang) {
	fs.copyFile(app.getPath('appData')+'/kandiskyscore'+'/Local/'+lang+'/menu-'+lang+'.js', app.getPath('appData')+'/kandiskyscore/menuDefaut.js', (err) => {
    if (err) 
        throw err;
   // console.log('./Local/'+lang+'/menu-'+lang+'.js was copied to ./menuDefaut.js');
    mainWindow.webContents.send("fromMain", 'configSave;'+lang)
});
}
const menu = Menu.buildFromTemplate(template)								// construction du menu principal
Menu.setApplicationMenu(menu)
app.on("ready", createWindow)

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
	    console.log(`response: ${response}`)
	    if (response) {
	      mainWindow.webContents.send("fromMain", 'newProject;')
	    }
	  })
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
	    console.log(`response: ${response}`)
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
		   	console.log(result.canceled)
		  		if(!result.canceled){
		  			currentProjet=result.filePaths[0]
		  			mainWindow.webContents.send("fromMain", 'loadProjet;'+result.filePaths)
		  		}
			})
	    }
	  })
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
   	console.log(result.canceled)
  		console.log(result.filePaths)
  		if(!result.canceled){
  			mainWindow.webContents.send("fromMain", 'loadGrp;'+result.filePaths)
  		}
	})
	
}
function renameProjetAs() {
	dialog.showSaveDialog({
        title: 'Select the File Path to save',
        defaultPath: app.getPath('home')+'/kandiskyscore/Projets/',
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
            var base=path.join( app.getPath('home'), '/kandiskyscore/Projets/',projetName)
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
        console.log(err)
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
	    console.log(`response: ${response}`)
	    if (response) {
	    	var base=path.join( app.getPath('home'), '/kandiskyscore/Projets/',projetName)
	    	if (fs.lstatSync(base).isDirectory()) {
			      fs.rmSync(base, { recursive: true });
			      mainWindow.webContents.send("fromMain", 'newProject;');
			    }
	    }
	  })
}
function defStudio() {
	console.log("saveStudio")
	newStudio.webContents.send("fromMain", 'saveStudio;');
}
// ******************************************************************************************************
async function ide() {
          const { shell } = require('electron')
          await shell.openExternal('https://faustide.grame.fr/')
}
function audioBufferToWav(buffer) {
	//var leftchannel = buffer.getChannelData(0)
	//var rightchannel = buffer.getChannelData(1)
	var recordingLength = buffer.length
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
console.log("blob",buf.size)

//var blob =new Blob([buf], { type: 'audio/wav' });

 fs.writeFile(dest, 
		Buffer.from(buf), function (err) {
		    if (err) throw err;
		    console.log('Saved!')
		})
}
// **************************************************************************************************************
function saveConfig(txt) {
	var path=app.getPath('appData')+'/kandiskyscore/config.js'
	fs.writeFile(path, 
                   atob(txt), function (err) {
          if (err) throw err;
          console.log('Saved at',path);
      });
}
function saveModifProjet(txt) {
	if(currentProjet==""){
		saveModifProjetAs(txt)
	}else{
		var dest=currentProjet
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
        defaultPath: path.join( app.getPath('home'), '/kandiskyscore/Projets/',projetName),
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
            currentProjet=file.filePath.toString()
            // Creating and Writing to the sample.txt file
            fs.writeFile(file.filePath.toString(), 
                         aenu(txt), function (err) {
                if (err) throw err;
                console.log('Saved!');
            });
        }
    }).catch(err => {
        console.log(err)
    });
}
function stdSelect() {
   var rt=""
	var themeFile = dialog.showOpenDialog({
	properties: [
    'openFile'],
   defaultPath: app.getPath('appData')+"/kandiskyscore/Dsp",
	filters: [
	 { name: 'Studio', extensions: ['std'] },
    { name: 'All Files', extensions: ['*'] }
   ]
   }).then(result => {
   	if(result.canceled==false){
   		rt=result.filePaths[0]
   	}
  		newStudio.webContents.send("fromMain", "loadStudio;"+result.filePaths[0]);
	})
}

function dspSave(txtHtml,txt,dsp) {
	console.log("maindsp",txt)
	dialog.showSaveDialog({
        title: 'Select the File Path to save',
        defaultPath: path.join( app.getPath('appData'), '/kandiskyscore/Dsp/',projetName),
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
            currentProjet=file.filePath.toString()
            // Creating and Writing to the sample.txt file
            var gfile=file.filePath.toString().split("/")
            var dfile=gfile[gfile.length-1].split(".")
            var path=""
            for(let i=0;i<gfile.length-1;i++){
            	path=path+gfile[i]+'/'
            }
            varfile1=path+dfile[0]+".html"
            varfile2=path+dfile[0]+".std"
            varfile3=path+dfile[0]+".dsp"
            console.log("dsp file",file.filePath,dfile,varfile1,varfile2,varfile3)
            var ndsp="declare name        \""+dfile[0]+"\";\n"+atob(dsp)
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
        }
    }).catch(err => {
        console.log(err)
    });
}
function saveTheme(txt) {
	dialog.showSaveDialog({
        title: 'Select the File Path to save',
        defaultPath: path.join(__dirname, './Themes'),
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
            currentProjet=file.filePath.toString()
            // Creating and Writing to the sample.txt file
            fs.writeFile(file.filePath.toString(), 
                         atob(txt), function (err) {
                if (err) throw err;
                console.log('Saved!');
            });
        }
    }).catch(err => {
        console.log(err)
    });
}
function saveSvgAs(txt) {
	dialog.showSaveDialog({
        title: 'Select the File Path to save',
       defaultPath: path.join( app.getPath('home'), '/kandiskyscore/Projets/',projetName,'/Images'),
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
                if(winSvgEtat==1){
						winSvg.destroy()
	  					winSvgEtat=0
	  				}
            });
        }
    }).catch(err => {
        console.log(err)
    });
}
function saveDefGrp() {
	mainWindow.webContents.send("fromMain", 'saveGrp')
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
            currentProjet=file.filePath.toString()
            // Creating and Writing to the sample.txt file
            
            fs.writeFile(file.filePath.toString(), 
                         txt, function (err) {
                if (err) throw err;
                console.log('Saved!');
            });
        }
    }).catch(err => {
        console.log(err)
    });
}
function nouvelEspace() {
	exec(app.getAppPath()+"/out/kandiskyscore-linux-x64/kandiskyscore", (error, stdout, stderr) => {
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
	mainWindow.webContents.send("fromMain", 'saveProjet;0')
}
function saveDefProjetAs() {
	mainWindow.webContents.send("fromMain", 'saveProjet;1')
}

function grpColor(){
   mainWindow.webContents.send("fromMain", 'grpColor')
}
function grpForme(){
   mainWindow.webContents.send("fromMain", 'grpForme')
} 
function grpScale(){
   mainWindow.webContents.send("fromMain", 'grpScale')
} 
function alignTop(){
   mainWindow.webContents.send("fromMain", 'topAlign')
} 
function alignLeft(){
   mainWindow.webContents.send("fromMain", 'leftAlign')
}
function alignBottom(){
   mainWindow.webContents.send("fromMain", 'bottomAlign')
}
function alignRight(){
   mainWindow.webContents.send("fromMain", 'rightAlign')
} 
function descendre(){
   mainWindow.webContents.send("fromMain", 'descendre')
} 
function toutBas(){
   mainWindow.webContents.send("fromMain", 'toutBas')
} 
function monter(){
   mainWindow.webContents.send("fromMain", 'monter')
}
function toutHaut(){
   mainWindow.webContents.send("fromMain", 'toutHaut')
} 
function augm(){
   mainWindow.webContents.send("fromMain", 'augmDim')
}
function permut(){
   mainWindow.webContents.send("fromMain", 'permut')
}
function defPalindrome(){
   mainWindow.webContents.send("fromMain", 'palindrome')
}
function defInclusion(){
   mainWindow.webContents.send("fromMain", 'inclusion')
}
function defRenvers(){
   mainWindow.webContents.send("fromMain", 'renversement')
}
function defRetro(){
   mainWindow.webContents.send("fromMain", 'retrograde')
}
function defRenvRetro(){
   mainWindow.webContents.send("fromMain", 'renvRetro')
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
	mainWindow.setSize(zx,zy)
	mainWindow.webContents.send("fromMain", 'winSize;'+zx+','+zy)
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
	console.log("block",block)
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
            currentProjet=file.filePath.toString()
            // Creating and Writing to the sample.txt file
            fs.writeFile(file.filePath.toString(), 
                         atob(block), function (err) {
                if (err) throw err;
                console.log('Saved!');
            });
        }
    }).catch(err => {
        console.log(err)
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
        console.log(err)
    });
}
function exportSelect(block) {
	console.log("block",block)
  // Stating whether dialog operation was cancelled or not.
  	file=app.getPath('home')+'/kandiskyscore/Projets/autoInsert.txt'
   // Creating and Writing to the sample.txt file
   fs.writeFile(file, 
                atob(block), function (err) {
       if (err) throw err;
       console.log('Saved autoInsert!');
       mainRead3D()
   });
}

function configuration(lang,cmd2,cmd3,cmd4,cmd5,cmd6) {
	if(winProjetEtat==0){
		winProjet = new BrowserWindow({width:840,height:650,
		webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            enableRemoteModule: false, // turn off remote
            preload: path.join(__dirname, 'preload.js')
        }
		})
		winProjet.loadFile('configuration.html')
		winProjet.removeMenu();
		//winProjet.webContents.openDevTools()
		winProjetEtat=1
		winProjet.webContents.on('did-finish-load', function() { //					On attend que la fenêtre soit totalement chargée
    		winProjet.webContents.send("fromMain", "defProjet;"+lang+";"+cmd2+";"+cmd3+";"+cmd4+";"+cmd5+";"+cmd6);
  		});
		winProjet.on('close', e => { 		//													Contrôle à la fermeture de la fenêtre
	   e.preventDefault()
	   dialog.showMessageBox({
	    type: 'info',
	    buttons: [Qcont, Qok],
	    cancelId: 1,
	    defaultId: 0,
	    title: Qwarning,
	    detail: Qquit
	  }).then(({ response, checkboxChecked }) => {
	    console.log(`response: ${response}`)
	    if (response) {
	      winProjet.destroy()
	      winProjetEtat=0
	    }
	  })
	}) 
	}else{
		dialog.showMessageBox({
	    type: 'info',
	    buttons: [Qok],
	    cancelId: 1,
	    defaultId: 0,
	    title: Qwarning,
	    detail: AlertWinOpen
	  })
	}
}
function configClose() {
	winProjet.destroy()
	winProjetEtat=0
}

function winObjetParam(objId,lang,obj,c,t) {
	if(winConfigEtat==0){
		winConfig = new BrowserWindow({width:400,height:640,alwaysOnTop:true,
		webPreferences: {
	            nodeIntegration: true,
	            contextIsolation: true,
	            enableRemoteModule: false, // turn off remote
	            preload: path.join(__dirname, 'preload.js')
	        }
		})
		winConfig.loadFile('objetParam.html')
		winConfig.removeMenu();
		//winConfig.webContents.openDevTools()
		winConfigEtat=1
		winConfig.webContents.on('did-finish-load', function() { //					On attend que la fenêtre soit totalement chargée
    		winConfig.webContents.send("fromMain", "defObjet;"+objId+";"+lang+";"+obj+";"+c+";"+t);
  		});

		winConfig.on('close', e => { 		//													Contrôle à la fermeture de la fenêtre
	   e.preventDefault()
	   
	  winConfig.destroy()
	  winConfigEtat=0
	}) 
	
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
	  winConfigEtat=0
		console.log('')
	}
}
const menu2 = Menu.buildFromTemplate(template2)
function winDefSvg(obj,mode) {
	if(winSvgEtat==1){
		winSvg.destroy()
  			winSvgEtat=0
	}
	winSvg = new BrowserWindow({width:800,height:640,alwaysOnTop:false,
	webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            enableRemoteModule: false, // turn off remote
            preload: path.join(__dirname, 'preload.js')
        }
	})
	winSvg.loadFile('winSvg.html')
	winSvg.removeMenu();
	//winSvg.setMenu(menu2)
	winSvg.webContents.openDevTools()
	winSvgEtat=1
	winSvg.webContents.on('did-finish-load', function() { //					On attend que la fenêtre soit totalement chargée
 		winSvg.webContents.send("fromMain", "defSvg;"+obj+";"+mode);
  		});

	winSvg.on('close', e => { 		//													Contrôle à la fermeture de la fenêtre
   e.preventDefault()
   
  winSvg.destroy()
  winSvgEtat=0
  }) 
}

function createPreDef(objId,lang,obj) {
	if(winPreDefEtat==0){
		winPreDef = new BrowserWindow({width:980,height:620,
		webPreferences: {
	            nodeIntegration: true,
	            contextIsolation: true,
	            enableRemoteModule: false, // turn off remote
	            preload: path.join(__dirname, 'preload.js')
	        }
		})
		winPreDef.loadFile('preDefGrp.html')
		winPreDef.removeMenu();
		//winPreDef.webContents.openDevTools()
		winPreDefEtat=1
		winPreDef.webContents.on('did-finish-load', function() { //					On attend que la fenêtre soit totalement chargée
    		winPreDef.webContents.send("fromMain", "defPreDef;"+objId+";"+lang+";"+obj);
  		});
		
		winPreDef.on('close', e => { 		//													Contrôle à la fermeture de la fenêtre
	   e.preventDefault()
	   dialog.showMessageBox({
	    type: 'info',
	    buttons: [Qcont, Qok],
	    cancelId: 1,
	    defaultId: 0,
	    title: Qwarning,
	    detail: Qquit
	  }).then(({ response, checkboxChecked }) => {
	    console.log(`response: ${response}`)
	    if (response) {
	      winPreDef.destroy()
	      winPreDefEtat=0
	    }
	  })
	}) 
	}else{
		dialog.showMessageBox({
	    type: 'info',
	    buttons: [Qok],
	    cancelId: 1,
	    defaultId: 0,
	    title: Qwarning,
	    detail: AlertWinOpen
	  })
		console.log('')
	}
}
function createWinGraph(id,lang,param,type) {
	if(winGraphObjEtat==0){
		winGraphObj = new BrowserWindow({width:575,height:544,alwaysOnTop:true,
		webPreferences: {
	            nodeIntegration: true,
	            contextIsolation: true,
	            enableRemoteModule: false, // turn off remote
	            preload: path.join(__dirname, 'preload.js')
	        }
		})
		winGraphObj.loadFile('defgraphObj.html')
		winGraphObj.removeMenu();
		//winGraphObj.webContents.openDevTools()
		winGraphObjEtat=1
		winGraphObj.webContents.on('did-finish-load', function() { //					On attend que la fenêtre soit totalement chargée
    		winGraphObj.webContents.send("fromMain", "defGraphObjet;"+id+";"+lang+";"+param+";"+type);
  		});
		winGraphObj.on('close', e => { 		//													Contrôle à la fermeture de la fenêtre
	   e.preventDefault()
	   winGraphObj.destroy()
	      winGraphObjEtat=0
	}) 
	}else{
		dialog.showMessageBox({
	    type: 'info',
	    buttons: [Qok],
	    cancelId: 1,
	    defaultId: 0,
	    title: Qwarning,
	    detail: AlertWinOpen
	  })
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
		})
		winGraphSymb.loadFile('defSymbObj.html')
		winGraphSymb.removeMenu();
		//winGraphSymb.webContents.openDevTools()
		winGraphSymbEtat=1
		winGraphSymb.webContents.on('did-finish-load', function() { //					On attend que la fenêtre soit totalement chargée
    		winGraphSymb.webContents.send("fromMain", "defGraphObjet;"+id+";"+lang+";"+param+";"+type);
  		});
		winGraphSymb.on('close', e => { 		//													Contrôle à la fermeture de la fenêtre
	   e.preventDefault()
	   dialog.showMessageBox({
	    type: 'info',
	    buttons: [Qcont, Qok],
	    cancelId: 1,
	    defaultId: 0,
	    title: Qwarning,
	    detail: Qquit
	  }).then(({ response, checkboxChecked }) => {
	    console.log(`response: ${response}`)
	    if (response) {
	      winGraphSymb.destroy()
	      winGraphSymbEtat=0
	    }
	  })
	}) 
	}else{
		dialog.showMessageBox({
	    type: 'info',
	    buttons: [Qok],
	    cancelId: 1,
	    defaultId: 0,
	    title: Qwarning,
	    detail: AlertWinOpen
	  })
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
		})
		winGraphGrp.loadFile('defGrp.html')
		winGraphGrp.removeMenu();
		//winGraphGrp.webContents.openDevTools()
		winGraphGrpEtat=1
		winGraphGrp.webContents.on('did-finish-load', function() { //					On attend que la fenêtre soit totalement chargée
    		winGraphGrp.webContents.send("fromMain", "defGrp;"+id+";"+lang+";"+param);
  		});
		winGraphGrp.on('close', e => { 		//													Contrôle à la fermeture de la fenêtre
	   e.preventDefault()
	   dialog.showMessageBox({
	    type: 'info',
	    buttons: [Qcont, Qok],
	    cancelId: 1,
	    defaultId: 0,
	    title: Qwarning,
	    detail: Qquit
	  }).then(({ response, checkboxChecked }) => {
	    console.log(`response: ${response}`)
	    if (response) {
	      winGraphGrp.destroy()
	      winGraphGrpEtat=0
	    }
	  })
	}) 
	}else{
		dialog.showMessageBox({
	    type: 'info',
	    buttons: [Qok],
	    cancelId: 1,
	    defaultId: 0,
	    title: Qwarning,
	    detail: AlertWinOpen
	  })
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
		})
		winTrajectoire.loadFile('trajectoire.html')
		winTrajectoire.removeMenu();
		//winTrajectoire.webContents.openDevTools()
		winTrajectoireEtat=1
		winTrajectoire.webContents.on('did-finish-load', function() { //					On attend que la fenêtre soit totalement chargée
    		winTrajectoire.webContents.send("fromMain", "deftrajectoire;"+id+";"+cmd2);
  		});
  		winTrajectoire.on('close', e => { 		//													Contrôle à la fermeture de la fenêtre
		   e.preventDefault()
		   winTrajectoire.destroy()
		   winTrajectoireEtat=0
	   })
	}else{
		dialog.showMessageBox({
	    type: 'info',
	    buttons: [Qok],
	    cancelId: 1,
	    defaultId: 0,
	    title: Qwarning,
	    detail: AlertWinOpen
	  })
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
		})
		winStudio.loadFile('studio.html')
		winStudio.removeMenu();
		//winStudio.webContents.openDevTools()
		winStudioEtat=1
		winStudio.webContents.on('did-finish-load', function() { //					On attend que la fenêtre soit totalement chargée
    		//winStudio.webContents.send("fromMain", "drawObjActif;"+X+";"+Y+"+;"+Z+";"+gain);
  		});
  		winStudio.on('close', e => { 		//													Contrôle à la fermeture de la fenêtre
		   e.preventDefault()
		   winStudio.destroy()
		   winStudioEtat=0
	   })
	}else{
		dialog.showMessageBox({
	    type: 'info',
	    buttons: [Qok],
	    cancelId: 1,
	    defaultId: 0,
	    title: Qwarning,
	    detail: AlertWinOpen
	  })
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
		})
		winStudio3D.loadFile('studio3D.html')
		winStudio3D.removeMenu();
		//winStudio3D.webContents.openDevTools()
		winStudio3DEtat=1
		winStudio3D.webContents.on('did-finish-load', function() { //					On attend que la fenêtre soit totalement chargée
    		winStudio3D.webContents.send("fromMain", "draw3dObj;"+X+";"+Y+"+;"+Z+";"+gain);
  		});
  		winStudio3D.on('close', e => { 		//													Contrôle à la fermeture de la fenêtre
		   e.preventDefault()
		   winStudio3D.destroy()
		   winStudio3DEtat=0
	   })
	}else{
		dialog.showMessageBox({
	    type: 'info',
	    buttons: [Qok],
	    cancelId: 1,
	    defaultId: 0,
	    title: Qwarning,
	    detail: AlertWinOpen
	  })
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
		})
		winVueStudio3D.loadFile('vueStudio3D.html')
		winVueStudio3D.removeMenu();
		//winVueStudio3D.webContents.openDevTools()
		winVueStudio3DEtat=1
		winVueStudio3D.webContents.on('did-finish-load', function() { //					On attend que la fenêtre soit totalement chargée
    		winVueStudio3D.webContents.send("fromMain", "draw3dObj;"+lst);
  		});
  		winVueStudio3D.on('close', e => { 		//													Contrôle à la fermeture de la fenêtre
		   e.preventDefault()
		   winVueStudio3D.destroy()
		   winVueStudio3DEtat=0
	   })
	}else{
		dialog.showMessageBox({
	    type: 'info',
	    buttons: [Qok],
	    cancelId: 1,
	    defaultId: 0,
	    title: Qwarning,
	    detail: AlertWinOpen
	  })
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
		})
		winSpatial.loadFile('spatialisation.html')
		winSpatial.removeMenu();
		//winSpatial.webContents.openDevTools()
		winSpatialEtat=1
		winSpatial.webContents.on('did-finish-load', function() { //					On attend que la fenêtre soit totalement chargée
    		winSpatial.webContents.send("fromMain", "defObjetSpatial;"+objId+";"+cmd2+";"+cmd3+";"+cmd4+";"+cmd5+";"+cmd6+";"+cmd7);
  		});
		
		winSpatial.on('close', e => { 		//													Contrôle à la fermeture de la fenêtre
	   e.preventDefault()
	   dialog.showMessageBox({
	    type: 'info',
	    buttons: [Qcont, Qok],
	    cancelId: 1,
	    defaultId: 0,
	    title: Qwarning,
	    detail: Qquit
	  }).then(({ response, checkboxChecked }) => {
	    console.log(`response: ${response}`)
	    if (response) {
	      winSpatial.destroy()
	      winSpatialEtat=0
	    }
	  })
	}) 
	}else{
		dialog.showMessageBox({
	    type: 'info',
	    buttons: [Qok],
	    cancelId: 1,
	    defaultId: 0,
	    title: Qwarning,
	    detail: AlertWinOpen
	  })
		console.log('')
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
		})
		winDoc.loadURL('http://blanchemain.info/Documents/Programmation/index.php?page=kandiskyScore')
		winDoc.removeMenu();
		//winDoc.webContents.openDevTools()
		winDocEtat=1
  		winDoc.on('close', e => { 		//													Contrôle à la fermeture de la fenêtre
		   e.preventDefault()
		   winDoc.destroy()
		   winDocEtat=0
	   })
	}
}

function tempoAudio() {
	mainWindow.webContents.send("fromMain", "tempoAudio")
}
function exportObj(){
	mainWindow.webContents.send("fromMain", "exportObj")
}
function exportGrp(){
	mainWindow.webContents.send("fromMain", "exportGrp")
}

function exportIntv(){
	mainWindow.webContents.send("fromMain", "exportIntv")
}
function exportPart(){
	mainWindow.webContents.send("fromMain", "exportPart")
}
function exportAdm(){
	mainWindow.webContents.send("fromMain", "exportAdm")
}
function pdfSettings() {
    var paperSizeArray = ["A4", "A5"];
    var option = {
     	  top : pdfMgTop,
     	  bottom: pdfMgBot,
     	  left : pdfMgLeft,
     	  right : pdfMgRight,
     	  printSelectionOnly: false,
        pageRanges: '1-2'
    };
    console.log(option)
    if(pdfLandscape==1){
        option.landscape = true
    }else{
        option.landscape = false
    }
    if(pdfBkg==0){
         option.printBackground=true
        }else{
        	option.printBackground=false
        }
        
     if(pdfPage==1){
     		option.pageSize= "A4"
     }else{
     		option.pageSize= "A3"
     }
     console.log(option)
  return option;
}

function svgToPdf(txt) {
	var win1 = new BrowserWindow({show : false})
	var win2 = new BrowserWindow({show : false})
	var win3 = new BrowserWindow({show : false})
	var win4 = new BrowserWindow({show : false})
	var win5 = new BrowserWindow({show : false})
	var win6 = new BrowserWindow({show : false})
	var win7 = new BrowserWindow({show : false})
	var win8 = new BrowserWindow({show : false})
	var win9 = new BrowserWindow({show : false})
	var win10 = new BrowserWindow({show : false})
	var nwin=[]
	nwin[1]=win1
	nwin[2]=win2
	nwin[3]=win3
	nwin[4]=win4
	nwin[5]=win5
	nwin[6]=win6
	nwin[7]=win7
	nwin[8]=win8
	nwin[9]=win9
	nwin[10]=win10
   var nbw=0
	for(let i=1;i<11;i++){
	nwin[i].loadFile(app.getPath('appData')+'/kandiskyscore/pdf/p'+i+'.html')
	nwin[i].webContents.on('did-finish-load', function() { 
	
	   nwin[i].webContents.printToPDF(pdfSettings()).then(data => {
		   fs.writeFile(app.getPath('appData')+"/kandiskyscore/pdf/p"+i+".pdf", data, function (err) {
			   if (err) {
			       console.log(err);
			   } else {
			       console.log('PDF Generated Successfully',app.getPath('appData')+"/kandiskyscore/pdf/p"+i+".pdf");
			       nbw++
			       if(nbw>9){
					   var listPdf=''
					   for(let i=1;i<11;i++){
					   	listPdf=listPdf+app.getPath('appData')+"/kandiskyscore/pdf/p"+i+".pdf "
					   }
					   console.log("listepdf",listPdf)
					   exec(pdfAssCmd+" " +listPdf+app.getPath('appData')+"/kandiskyscore/merged.pdf", (error, stdout, stderr) => {
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
					
					   exec(pdfAppCmd+" " +app.getPath('appData')+"/kandiskyscore/merged.pdf", (error, stdout, stderr) => {
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
			   }
			 });
		 	}).catch(error => {
		  	console.log(error)
		 	});
	 });
   }
   
}
function createPdf(txt) {
	mainWindow.webContents.send("fromMain", "createPdf")
}
function spectrogram() {
	mainWindow.webContents.send("fromMain", "spectrogram")
}

function soxSpectrogram(npath) {
	var txt="";
	if(winSpectroEtat==0){
		exec("sox "+npath+"  -n remix 1  spectrogram -x 2000 -o "+app.getPath('home')+'/kandiskyscore/Projets/spectrogram.png', (error, stdout, stderr) => {
		    if (error) {
		        console.log(`error: ${error.message}`);
		        return;
		    }
		    if (stderr) {
		        //console.log(`stderr: ${stderr}`);
		        //return;
		    }
		setTimeout(function(){    
		exec("sox  "+npath+" -n stats ", (error, stdout, stderr) => {
		    if (error) {
		        //console.log(`error: ${error.message}`);
		        return;
		    }
		    if (stderr) {
		        //console.log(`stderr: ${stderr}`);
		        //return;
		       //var ntxt=stderr.split(' ').join(' ')
		       var ttxt=stderr.split("\n");
			    
			    var ntxt=''
			    var sr=-1
			    for(i=0;i<ttxt.length;i++){
			    	sr=ttxt[i].indexOf("sox");
			    	if(sr==-1){
			    		ntxt=ntxt+"    \n"+ttxt[i]
			    	}
			    	sr=-1
			    }
			    txt="<pre><code>"+ntxt+"</code></pre>"
			    winSpectro = new BrowserWindow({width:920,height:544,
				webPreferences: {
			            nodeIntegration: true,
			            contextIsolation: true,
			            enableRemoteModule: false, // turn off remote
			            preload: path.join(__dirname, 'preload.js')
			        }
				})
				winSpectro.loadFile('spectrogram.html')
				winSpectro.removeMenu();
				winSpectro.webContents.openDevTools()
				winSpectroEtat=1
				winSpectro.webContents.on('did-finish-load', function() { //					On attend que la fenêtre soit totalement chargée
		    		winSpectro.webContents.send("fromMain", "defSpectro;"+app.getPath('home')+'/kandiskyscore/Projets;'+uena(txt)+";"+npath);
		  		});
				winSpectro.on('close', e => { 		//													Contrôle à la fermeture de la fenêtre
			   e.preventDefault()
			   winSpectro.destroy()
			   winSpectroEtat=0
			    });
			}
	 	  }) 
	 	  }, 400)
	   });
	}else{
		dialog.showMessageBox({
	    type: 'info',
	    buttons: [Qok],
	    cancelId: 1,
	    defaultId: 0,
	    title: Qwarning,
	    detail: AlertWinOpen
	  })

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
        console.log(file.canceled);
        exec("sox "+npath+"  -n remix 1  spectrogram -x 2000 -o "+file.filePath.toString(), (error, stdout, stderr) => {
		    if (error) {
		        console.log(`error: ${error.message}`);
		        return;
		    }
		    if (stderr) {
		        //console.log(`stderr: ${stderr}`);
		        //return;
		    }
		    })
    }).catch(err => {
        console.log(err)
    });
}
function uena(chn) {
  return btoa(unescape(encodeURIComponent(chn)));
}
function aenu(chn) {
  return decodeURIComponent(escape(atob(chn)));
}
function spaceToSvg(path,txt) {
	var ntxt=aenu(txt);
	ntxt=ntxt.replaceAll("&nbsp;", "");
	console.log(ntxt)
	fs.writeFile(app.getPath('appData')+'/kandiskyscore/pdf/tmpsvg.svg', ntxt, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log('PDF Generated Successfully');
                svgToPdf(txt) 
            }
        });
        
}
function audioEditor(obj) {
	var cm=editAudioCmd+" "+app.getPath('home')+'/kandiskyscore/Projets/'+projetName+'/Audios/'+obj
	console.log('cm',cm)
	exec(cm)
}
// ****************************************************************************************************************
//const ipc = require('electron').ipcRenderer;

ipcMain.on ("toMain", (event, args) => {
	let cmd=args.split(';')
	switch(cmd[0]) {
		case 'basePath':
			mainWindow.webContents.send("fromMain", "dconfig;"+app.getPath('appData')+'/kandiskyscore/')
			break
		case 'defPdf':
			divToPdf(cmd[1])
			break
		case 'spaceToSvg':
			spaceToSvg(cmd[1],cmd[2])
			break
		case 'openObjetParam':
		//console.log(`openObjetParam ${args} from param`);
			winObjetParam(cmd[1],cmd[2],cmd[3],cmd[4],cmd[6])
			break
		case 'openSymbParam':
			console.log(`openSymbParam ${args} from param`);
			createWinSymb(cmd[1],cmd[2],cmd[3],cmd[4])
			break
		case 'openGrpParam':
			console.log(`openGrpParam ${args} from param`);
			createWinGrp(cmd[1],cmd[2],cmd[3])
			break
		case 'openPreDef':
			//console.log(`openGrpParam ${args} from param`);
			createPreDef(cmd[1],cmd[2],cmd[3])
			break
		case 'objParamAnnul':
			console.log(`Restore ${args} from param`);
			mainWindow.webContents.send("fromMain", "annulModifObj;"+cmd[1])
			winConfigEtat=0
			winConfig.destroy()
			break
		case 'objParamClose':
			if(winConfigEtat==1){
				winConfigEtat=0
				winConfig.destroy()
			}
			if(winGraphObjEtat==1){
				winGraphObj.destroy()
				winGraphObjEtat=0
			}
			break
		case 'objParamChange':
			if(winConfigEtat==1){
				winConfigEtat=0
				winConfig.destroy()
			}
			if(winGraphObjEtat==1){
				winGraphObj.destroy()
				winGraphObjEtat=0
			}
			break
		case 'objParamValid':
			if(winGraphObjEtat==1){
				winGraphObj.destroy()
				winGraphObjEtat=0
			}
			if(winSpatialEtat==1){
				winSpatial.destroy()
				winSpatialEtat=0
			}
			if(winTrajectoireEtat==1){
				winTrajectoire.destroy()
				winTrajectoireEtat=0
			}
			winConfig.destroy()
			winConfigEtat=0
			break
		case 'objGraphValid':
			if(winGraphObjEtat==1){
				winGraphObj.destroy()
				winGraphObjEtat=0
			}
			/*
			if(winConfigEtat==1){
				winConfig.destroy()
				winConfigEtat=0
			}
			*/
			break
		case 'symbGraphValid':
			winGraphSymb.destroy()
			winGraphSymbEtat=0
			break
		case 'grpValid':
			winGraphGrp.destroy()
			winGraphGrpEtat=0
			break
		case 'grpAnnul':
			winGraphGrp.destroy()
			winGraphGrpEtat=0
			break
		case 'preDefValid':
			winPreDef.destroy()
			winPreDefEtat=0
			break
		case 'objGraphAnnul':
			mainWindow.webContents.send("fromMain", "objGraphAnnul;"+cmd[1])
			break
		case 	'objWinGraphAnnul':
			winGraphObj.destroy()
			winGraphObjEtat=0
			/*
			if(winConfigEtat==1){
				winConfig.destroy()
				winConfigEtat=0
			}
			*/
			break
		case 	'symbGraphAnnul':
			winGraphSymb.destroy()
			winGraphSymbEtat=0
			break
		case "saveFile":
			console.log(cmd[1])
			break
		case "neweditor":
			neweditor(cmd[1])
			break
		case 'spatialAnnul':
			console.log(`Restore spatial ${args}`);
			//winSpatial.webContents.send("fromMain", "annulModifObj;"+cmd[1]+";"+cmd[2])
			winSpatialEtat=0
			winSpatial.destroy()
			if(winStudioEtat==1){
				winStudioEtat=0
				winStudio.destroy()
			}
			if(winStudio3DEtat==1){
				winStudio3D.destroy()
	     	   winStudio3DEtat=0
	      }
			break	
		case "spatialAnnulPoints":
			winTrajectoire.destroy()
		   winTrajectoireEtat=0
			break
		case 'spatialValid':
			console.log(`Valid spatial ${args}`);
			//winSpatial.webContents.send("fromMain", "annulModifObj;"+cmd[1]+";"+cmd[2])
			winSpatialEtat=0
			winSpatial.destroy()
			if(winStudioEtat==1){
				winStudioEtat=0
				winStudio.destroy()
			}
			if(winTrajectoireEtat==1){
				winTrajectoire.destroy()
				winTrajectoireEtat=0
			}
			if(winStudio3DEtat==1){
				winStudio3D.destroy()
	     	   winStudio3DEtat=0
	      }
			break	
		case 'winSpatial':
			console.log('winSpatial',cmd[1],cmd[2],cmd[3],cmd[4],cmd[5],cmd[6],cmd[7])
			spatialOpen(cmd[1],cmd[2],cmd[3],cmd[4],cmd[5],cmd[6],cmd[7])
			break
		case 'winTrajectoire':
			createTrajectoire(cmd[1],cmd[2])
			break
		case 'createSpatialPoint':
			mainWindow.webContents.send("fromMain", "createSpatialPoint;"+cmd[1]+";"+cmd[2]+";"+cmd[3])
			winSpatial.webContents.send("fromMain", "createSpatialPoint;"+cmd[1]+";"+cmd[2]+";"+cmd[3])
			winConfig.webContents.send("fromMain", "createSpatialPoint;"+cmd[1]+";"+cmd[2]+";"+cmd[3])
			if(winStudio3DEtat==1){
				winStudio3D.destroy()
	     	   winStudio3DEtat=0
	      }
			break
		case 'audioFileObj':
			console.log("id1",cmd[1])
			objetAudio(cmd[1],1)
			break
		case 'audioFileObj2':
			console.log("id1",cmd[1])
			objetAudio(cmd[1],2)
			break
		case 'replaceAudio':
			replaceAudio(cmd[1],cmd[2])
			break
		case 'saveFxAudio':
			saveFxAudio(cmd[1],cmd[2])
			break
		case 'audioPreDef':
			console.log("id1",cmd[1])
			preDefAudio(cmd[1])
			break
		case 'fileAudioParam':
			console.log("id1",cmd[1])
			winConfig.webContents.send("fromMain", "fileAudioParam;"+cmd[1]+";"+cmd[2]+";"+cmd[3])
			break
		case 'fileAudioPreDef':
			console.log("id1",cmd[1])
			winPreDef.webContents.send("fromMain", "fileAudioParam;"+cmd[1]+";"+cmd[2]+";"+cmd[3])
			break
		case 'mute':
			if(winConfigEtat==1){
				mainWindow.webContents.send("fromMain", "audioMute;"+cmd[1]+";"+cmd[2])
			}
			break
		case 'mutePreDef':
				mainWindow.webContents.send("fromMain", "preDefMute;"+cmd[1]+";"+cmd[2])
			break
		case 'gain':
			if(winConfigEtat==1){
				mainWindow.webContents.send("fromMain", "audioGain;"+cmd[1]+";"+cmd[2])
			}
			break
		case 'reverse':
				mainWindow.webContents.send("fromMain", "defReverse;"+cmd[1]+";"+cmd[2])
			break
		case 'preDefGain':
			mainWindow.webContents.send("fromMain", "preDefGain;"+cmd[1]+";"+cmd[2])
			break
		case 'envType':
			if(winConfigEtat==1){
				mainWindow.webContents.send("fromMain", "audioEnvType;"+cmd[1]+";"+cmd[2])
			}
			break
		case 'envPreDefType':
			mainWindow.webContents.send("fromMain", "preDefEnvType;"+cmd[1]+";"+cmd[2])
			break
		case 'flagTranspo':
			if(winConfigEtat==1){
				mainWindow.webContents.send("fromMain", "audioFlagTranspo;"+cmd[1]+";"+cmd[2])
			}
			break
		case 'preDefFlagTranspo':
			mainWindow.webContents.send("fromMain", "preDefFlagTranspo;"+cmd[1]+";"+cmd[2])
			break
		case 'transposition':
			if(winConfigEtat==1){
				winConfig.webContents.send("fromMain", "transposition;"+cmd[1]+";"+cmd[2])
			}
			if(winPreDefEtat==1){
				winPreDef.webContents.send("fromMain", "transposition;"+cmd[1]+";"+cmd[2])
			}
			break
		case 'detune':
			if(winConfigEtat==1){
				mainWindow.webContents.send("fromMain", "audioDetune;"+cmd[1]+";"+cmd[2])
			}
			break
		case 'preDefDetune':
			mainWindow.webContents.send("fromMain", "preDefDetune;"+cmd[1]+";"+cmd[2])
			break
		case 'debut':
			mainWindow.webContents.send("fromMain", "audioDebut;"+cmd[1]+";"+cmd[2])
			break
		case 'preDefDebut':
			mainWindow.webContents.send("fromMain", "preDefDebut;"+cmd[1]+";"+cmd[2])
			break
		case 'fin':
			mainWindow.webContents.send("fromMain", "audioFin;"+cmd[1]+";"+cmd[2])
			break
		case 'preDefFin':
			mainWindow.webContents.send("fromMain", "preDefFin;"+cmd[1]+";"+cmd[2])
			break
		case 'position':
			if(winConfigEtat==1){
				winConfig.webContents.send("fromMain", "position;"+cmd[1]+";"+cmd[2]+";"+cmd[3])
			}
			if(winPreDefEtat==1){
				winPreDef.webContents.send("fromMain", "position;"+cmd[1]+";"+cmd[2]+";"+cmd[3])
			}
			break
		case 'nom':
			mainWindow.webContents.send("fromMain", "audioNom;"+cmd[1]+";"+cmd[2])
			break
		case 'preDefNom':
			mainWindow.webContents.send("fromMain", "preDefNom;"+cmd[1]+";"+cmd[2])
			break
		case 'preDefColor':
			mainWindow.webContents.send("fromMain", "preDefColor;"+cmd[1]+";"+cmd[2])
			break
		case 'piste':
			mainWindow.webContents.send("fromMain", "audioPiste;"+cmd[1]+";"+cmd[2])
			break
		case 'preDefPiste':
			mainWindow.webContents.send("fromMain", "preDefPiste;"+cmd[1]+";"+cmd[2])
			break
		case 'convolver':
			mainWindow.webContents.send("fromMain", "audioConvolver;"+cmd[1]+";"+cmd[2])
			break
		case 'preDefConvolver':
			mainWindow.webContents.send("fromMain", "preDefConvolver;"+cmd[1]+";"+cmd[2])
			break
		case 'env':
			mainWindow.webContents.send("fromMain", "audioEnv;"+cmd[1]+";"+cmd[2]+";"+cmd[3]+";"+cmd[4])
			break
		case 'preDefEnv':
			mainWindow.webContents.send("fromMain", "preDefEnv;"+cmd[1]+";"+cmd[2]+";"+cmd[3]+";"+cmd[4])
			break
		case 'objRayon':
			mainWindow.webContents.send("fromMain", "objetRayon;"+cmd[1]+";"+cmd[2])
			break
		case 'objScaleX':
			//console.log(`scaleX ${args} from renderer process`);
			mainWindow.webContents.send("fromMain", "objetScaleX;"+cmd[1]+";"+cmd[2])
			break
		case 'objScaleY':
			mainWindow.webContents.send("fromMain", "objetScaleY2;"+cmd[1]+";"+cmd[2])
			break
		case 'objScaleY2':
			mainWindow.webContents.send("fromMain", "objetScaleY;"+cmd[1]+";"+cmd[2])
			break
		case 'objScaleGrpXY':
			mainWindow.webContents.send("fromMain", "objetScaleGrpXY;"+cmd[1]+";"+cmd[2])
			break
		case 'objScaleXY':
			mainWindow.webContents.send("fromMain", "objetScaleXY;"+cmd[1]+";"+cmd[2])
			break
		case 'objOpacity':
			mainWindow.webContents.send("fromMain", "objetOpacity;"+cmd[1]+";"+cmd[2])
			break
		case 'bkgOpacity':
			mainWindow.webContents.send("fromMain", "bkgOpacity;"+cmd[1]+";"+cmd[2])
			break
		case 'bkgGrpOpacity':
			mainWindow.webContents.send("fromMain", "bkgGrpOpacity;"+cmd[1]+";"+cmd[2])
			break
		case 'bkgTransparent':
			mainWindow.webContents.send("fromMain", "bkgTransparent;"+cmd[1])
			winConfig.webContents.send("fromMain", "bkgTransparent;"+cmd[1])
			break
		case 'symbBkgTransparent':
			console.log(`symbBkgTransparent ${args} from renderer process`);
			mainWindow.webContents.send("fromMain", "bkgTransparent;"+cmd[1])
			break
		case 'grpBkgTransparent':
			mainWindow.webContents.send("fromMain", "bkgGrpTransparent;"+cmd[1])
			break
		case 'grpNom':
			mainWindow.webContents.send("fromMain", "grpNom;"+cmd[1]+";"+cmd[2])
			break
		case 'defWinGraphObj':
			createWinGraph(cmd[1],cmd[2],cmd[3],cmd[4])
			break
		case 'defGraphObj':
			mainWindow.webContents.send("fromMain", "defGraphParam;"+cmd[1])
			break
		case 'objColor':
			console.log(`defGraphObj ${args} from renderer process`);
			winConfig.webContents.send("fromMain", "objColor;"+cmd[1]+";"+cmd[2])
			mainWindow.webContents.send("fromMain", "objNColor;"+cmd[1]+";"+cmd[2])
			break
		case 'bkgGrpColor':
			console.log(`defGraphObj ${args} from renderer process`);
			mainWindow.webContents.send("fromMain", "grpBkgColor;"+cmd[1]+";"+cmd[2])
			break
		case 'symbColor':
			console.log(`defGraphObj ${args} from renderer process`);
			mainWindow.webContents.send("fromMain", "symbColor;"+cmd[1]+";"+cmd[2])
			break
		case 'symbBkgColor':
			console.log(`symbBkgColor ${args} from renderer process`);
			mainWindow.webContents.send("fromMain", "bkgNColor;"+cmd[1]+";"+cmd[2])
			break
		case 'symbRotate':
			console.log(`defGraphObj ${args} from renderer process`);
			mainWindow.webContents.send("fromMain", "symbRotate;"+cmd[1]+";"+cmd[2])
			break
		case 'imgRotate':
			console.log(`imgRotate ${args} from renderer process`);
			mainWindow.webContents.send("fromMain", "objRotate;"+cmd[1]+";"+cmd[2])
			break
		case 'symbWidth':
			console.log(`defGraphObj ${args} from renderer process`);
			mainWindow.webContents.send("fromMain", "symbWidth;"+cmd[1]+";"+cmd[2])
			break
		case 'symbHeight':
			console.log(`defGraphObj ${args} from renderer process`);
			mainWindow.webContents.send("fromMain", "symbHeight;"+cmd[1]+";"+cmd[2])
			break
		case 'symbBkgOpacity':
			mainWindow.webContents.send("fromMain", "bkgOpacity;"+cmd[1]+";"+cmd[2])
			break
		case 'symbMGauche':
			mainWindow.webContents.send("fromMain", "symbMGauche;"+cmd[1]+";"+cmd[2])
			break
		case 'symbMHaut':
			mainWindow.webContents.send("fromMain", "symbMHaut;"+cmd[1]+";"+cmd[2])
			break
		case 'bkgSymbWidth':
			console.log(`symbBkgWidth ${args} from renderer process`);
			mainWindow.webContents.send("fromMain", "symbBkgWidth;"+cmd[1]+";"+cmd[2])
			break
		case 'bkgSymbHeight':
			console.log(`defGraphObj ${args} from renderer process`);
			mainWindow.webContents.send("fromMain", "symbBkgHeight;"+cmd[1]+";"+cmd[2])
			break
		case 'bkgColor':
			winConfig.webContents.send("fromMain", "defBkgColor;"+cmd[1]+";"+cmd[2])
			mainWindow.webContents.send("fromMain", "bkgNColor;"+cmd[1]+";"+cmd[2])
			break
		case 'defBkgImg':
			defBkgImg(cmd[1])
			break
		case 'bkgGrpImg':
			defBkgGrpImg(cmd[1])
			break
		case 'defSymbBkgImg':
			defSymbBkgImg(cmd[1])
			break
		case 'bkgWidth':
			mainWindow.webContents.send("fromMain", "bkgWidth;"+cmd[1]+";"+cmd[2])
			winConfig.webContents.send("fromMain", "bkgSize;"+cmd[1]+";"+cmd[2]+";"+cmd[3])
			break
		case 'bkgHeight':
			mainWindow.webContents.send("fromMain", "bkgHeight;"+cmd[1]+";"+cmd[2])
			winConfig.webContents.send("fromMain", "bkgSize;"+cmd[1]+";"+cmd[2]+";"+cmd[3])
			break
		case 'bkgGrpWidth':
			mainWindow.webContents.send("fromMain", "bkgGrpWidth;"+cmd[1]+";"+cmd[2])
			break
		case 'bkgHeight':
			mainWindow.webContents.send("fromMain", "bkgHeight;"+cmd[1]+";"+cmd[2])
			winConfig.webContents.send("fromMain", "bkgSize;"+cmd[1]+";"+cmd[2]+";"+cmd[3])
			break
		case 'bkgGrpHeight':
			mainWindow.webContents.send("fromMain", "bkgGrpHeight;"+cmd[1]+";"+cmd[2])
			break
		case 'bordureWidth':
			mainWindow.webContents.send("fromMain", "defBordureWidth;"+cmd[1]+";"+cmd[2])
			winConfig.webContents.send("fromMain", "defBordureWidth;"+cmd[1]+";"+cmd[2])
			
			break
		case 'bordureColor':
			mainWindow.webContents.send("fromMain", "defBordureColor;"+cmd[1]+";"+cmd[2])
			winConfig.webContents.send("fromMain", "defBordureColor;"+cmd[1]+";"+cmd[2])
			break
		case 'margeGauche':
			mainWindow.webContents.send("fromMain", "defMargeGauche;"+cmd[1]+";"+cmd[2])
			winConfig.webContents.send("fromMain", "defPlGauche;"+cmd[1]+";"+cmd[2])
			break
		case 'margeHaut':
			mainWindow.webContents.send("fromMain", "defMargeHaut;"+cmd[1]+";"+cmd[2])
			winConfig.webContents.send("fromMain", "defPlHaut;"+cmd[1]+";"+cmd[2])
			break
		case 'grpMGauche':
			mainWindow.webContents.send("fromMain", "grpMGauche;"+cmd[1]+";"+cmd[2])
			break
		case 'grpMHaut':
			mainWindow.webContents.send("fromMain", "grpMHaut;"+cmd[1]+";"+cmd[2])
			break
		case 'grpGaucheType':
			mainWindow.webContents.send("fromMain", "grpGaucheType;"+cmd[1]+";"+cmd[2])
			break
		case 'grpGaucheColor':
			mainWindow.webContents.send("fromMain", "grpGaucheColor;"+cmd[1]+";"+cmd[2])
			break
		case 'grpGaucheWidth':
			mainWindow.webContents.send("fromMain", "grpGaucheWidth;"+cmd[1]+";"+cmd[2])
			break
		case 'grpGaucheRadius':
			mainWindow.webContents.send("fromMain", "grpGaucheRadius;"+cmd[1]+";"+cmd[2])
			break
		case 'grpHautType':
			mainWindow.webContents.send("fromMain", "grpHautType;"+cmd[1]+";"+cmd[2])
			break
		case 'grpHautColor':
			mainWindow.webContents.send("fromMain", "grpHautColor;"+cmd[1]+";"+cmd[2])
			break
		case 'grpHautWidth':
			mainWindow.webContents.send("fromMain", "grpHautWidth;"+cmd[1]+";"+cmd[2])
			break
		case 'grpHautRadius':
			mainWindow.webContents.send("fromMain", "grpHautRadius;"+cmd[1]+";"+cmd[2])
			break
		case 'grpDroitType':
			mainWindow.webContents.send("fromMain", "grpDroitType;"+cmd[1]+";"+cmd[2])
			break
		case 'grpDroitColor':
			mainWindow.webContents.send("fromMain", "grpDroitColor;"+cmd[1]+";"+cmd[2])
			break
		case 'grpDroitWidth':
			mainWindow.webContents.send("fromMain", "grpDroitWidth;"+cmd[1]+";"+cmd[2])
			break
		case 'grpDroitRadius':
			mainWindow.webContents.send("fromMain", "grpDroitRadius;"+cmd[1]+";"+cmd[2])
			break
		case 'grpBasType':
			mainWindow.webContents.send("fromMain", "grpBasType;"+cmd[1]+";"+cmd[2])
			break
		case 'grpBasColor':
			mainWindow.webContents.send("fromMain", "grpBasColor;"+cmd[1]+";"+cmd[2])
			break
		case 'grpBasWidth':
			mainWindow.webContents.send("fromMain", "grpBasWidth;"+cmd[1]+";"+cmd[2])
			break
		case 'grpBasRadius':
			mainWindow.webContents.send("fromMain", "grpBasRadius;"+cmd[1]+";"+cmd[2])
			break
		case 'gaucheType':
			mainWindow.webContents.send("fromMain", "defGaucheType;"+cmd[1]+";"+cmd[2])
			break
		case 'gaucheColor':
			mainWindow.webContents.send("fromMain", "defGaucheColor;"+cmd[1]+";"+cmd[2])
			break
		case 'gaucheWidth':
			mainWindow.webContents.send("fromMain", "defGaucheWidth;"+cmd[1]+";"+cmd[2])
			break
		case 'gaucheRadius':
			mainWindow.webContents.send("fromMain", "defGaucheRadius;"+cmd[1]+";"+cmd[2])
			break
		case 'droitType':
			mainWindow.webContents.send("fromMain", "defDroitType;"+cmd[1]+";"+cmd[2])
			break
		case 'droitColor':
			mainWindow.webContents.send("fromMain", "defDroitColor;"+cmd[1]+";"+cmd[2])
			break
		case 'droitWidth':
			mainWindow.webContents.send("fromMain", "defDroitWidth;"+cmd[1]+";"+cmd[2])
			break
		case 'droitRadius':
			mainWindow.webContents.send("fromMain", "defDroitRadius;"+cmd[1]+";"+cmd[2])
			break
		case 'hautType':
			mainWindow.webContents.send("fromMain", "defHautType;"+cmd[1]+";"+cmd[2])
			break
		case 'hautColor':
			mainWindow.webContents.send("fromMain", "defHautColor;"+cmd[1]+";"+cmd[2])
			break
		case 'hautWidth':
			mainWindow.webContents.send("fromMain", "defHautWidth;"+cmd[1]+";"+cmd[2])
			break
		case 'hautRadius':
			mainWindow.webContents.send("fromMain", "defHautRadius;"+cmd[1]+";"+cmd[2])
			break
		case 'basType':
			mainWindow.webContents.send("fromMain", "defBasType;"+cmd[1]+";"+cmd[2])
			break
		case 'basColor':
			mainWindow.webContents.send("fromMain", "defBasColor;"+cmd[1]+";"+cmd[2])
			break
		case 'basWidth':
			mainWindow.webContents.send("fromMain", "defBasWidth;"+cmd[1]+";"+cmd[2])
			break
		case 'basRadius':
			mainWindow.webContents.send("fromMain", "defBasRadius;"+cmd[1]+";"+cmd[2])
			break
		case 'saveModifProjet':
			saveModifProjet(cmd[1])
			break
		case 'saveModifProjetAs':
			
			saveModifProjetAs(cmd[1])
			break
		case 'saveModifGrp':
			saveModifGrp(cmd[1])
			break	
		case 'configProjet':
			configuration(cmd[1],cmd[2],cmd[3],cmd[4],cmd[5],cmd[6])
			break
		case 'configClose':
			configClose()
			break
		case 'configSave':
			mainWindow.webContents.send("fromMain", "configSave;"+cmd[1])
			break
		case 'exportBlock':
			exportBlock(cmd[1])
			break
		case 'defExportFile':
		console.log(`deffile ${args} from renderer process`);
			defExportFile(cmd[1],cmd[2])
			break;
		case 'exportProjet':
			mainWindow.webContents.send("fromMain", "exportProjet;"+cmd[1])
			break
		case 'exportSpace':
			mainWindow.webContents.send("fromMain", "exportSpace;"+cmd[1])
			break
		case 'exportInterface':
			mainWindow.webContents.send("fromMain", "exportInterface;"+cmd[1])
			break
		case 'exportPalette':
			mainWindow.webContents.send("fromMain", "exportPalette;"+cmd[1])
			break
		case 'spatialspXZ':
			mainWindow.webContents.send("fromMain", "spatialspXZ;"+cmd[1]+";"+cmd[2]+";"+cmd[3]+";"+cmd[4])
			winConfig.webContents.send("fromMain", "spatialspXZ;"+cmd[2]+";"+cmd[3]+";"+cmd[4])
			break
		case 'spatialspZY':
			mainWindow.webContents.send("fromMain", "spatialspZY;"+cmd[1]+";"+cmd[2]+";"+cmd[3]+";"+cmd[4])
			winConfig.webContents.send("fromMain", "spatialspZY;"+cmd[2]+";"+cmd[3]+";"+cmd[4])
			break
		case 'spatialspXY':
			mainWindow.webContents.send("fromMain", "spatialspXY;"+cmd[1]+";"+cmd[2]+";"+cmd[3]+";"+cmd[4])
			winConfig.webContents.send("fromMain", "spatialspXY;"+cmd[2]+";"+cmd[3]+";"+cmd[4])
			break
		case 'spatialspD':
			mainWindow.webContents.send("fromMain", "spatialspD;"+cmd[1]+";"+cmd[2]+";"+cmd[3])
			winConfig.webContents.send("fromMain", "spatialspD;"+cmd[2]+";"+cmd[3])
			break
		case 'spatialspT':
			mainWindow.webContents.send("fromMain", "spatialspT;"+cmd[1]+";"+cmd[2]+";"+cmd[3])
			winSpatial.webContents.send("fromMain", "spatialspT;"+cmd[2]+";"+cmd[3])
			winConfig.webContents.send("fromMain", "spatialspT;"+cmd[2]+";"+cmd[3])
			break
		case 'openListeFx':
			mainWindow.webContents.send("fromMain", "openListeFx")
			break
		case 'openStudio':
			openStudio(cmd[2],cmd[3],cmd[4],cmd[5])
			mainWindow.webContents.send("fromMain", "openStudio")
			if(winSpatialEtat==1){
				winSpatial.webContents.send("fromMain", "openStudio")
			}
			
			break
		case 'moveObjActif':
			if(winStudioEtat==1){
				winStudio.webContents.send("fromMain", "moveObjActif;"+cmd[1]+";"+cmd[2]+";"+cmd[3]+";"+cmd[4])
			}
			break
		case 'drawObjActif':
			winStudio.webContents.send("fromMain", "drawObjActif;"+cmd[2]+";"+cmd[3]+";"+cmd[4]+";"+cmd[5]+";"+cmd[6])
			if(winSpatialEtat==1){
				winSpatial.webContents.send("fromMain", "openStudio3D")
			}
			break
		case 'createEvtAudio':
			if(winStudioEtat==1){
				winStudio.webContents.send("fromMain", "createEvtAudio;"+cmd[1]+";"+cmd[2]+";"+cmd[3]+";"+cmd[4]+";"+cmd[5]+";"+cmd[6]+";"+cmd[7])
				console.log("evt",cmd[1])
			}
			break
		case 'delEvtAudio':
			if(winStudioEtat==1){
				winStudio.webContents.send("fromMain", "delEvtAudio;"+cmd[1])
			}
			break
		case 'endEvtAudio':
			if(winStudioEtat==1){
				winStudio.webContents.send("fromMain", "endEvtAudio;")
			}
			break
		case 'openStudio3d':
			open3dStudio(cmd[1],cmd[2],cmd[3],cmd[4])
			winSpatial.webContents.send("fromMain", "openStudio3D")
			break
		case 'move3dObj':
			if(winStudio3DEtat==1){
				winStudio3D.webContents.send("fromMain", "moveObjActif;"+cmd[1]+";"+cmd[2]+";"+cmd[3]+";"+cmd[4])
			}
			break
		case 'selectImg':
			selectImg()
			break
		case 'saveSvg':
			//console.log(`savd1Svg ${args} from renderer save`);
			winDefSvg(cmd[1],cmd[2])
			break
		case 'saveVueSvg':
			//console.log(`savdSvg ${args} from renderer process`);
			saveSvgAs(cmd[1])
			break
		case 'vueSvgValid':
			if(winSvgEtat==1){
				winSvg.destroy()
	  			winSvgEtat=0
	  		}
			break
		case 'spectroAnnul':
			if(winSpectroEtat==1){
				winSpectro.destroy()
	  			winSpectroEtat=0
	  		}
			break
		case 'saveAudioObjet':
			saveAudioObjet(cmd[1],cmd[2])
			break
		case 'substituerFx':
			mainWindow.webContents.send("fromMain", "substituerFx")
			break
		case 'dureeReelle':
			mainWindow.webContents.send("fromMain", "dureeReelle;"+cmd[1])
			break
		case 'defPosition':
			mainWindow.webContents.send("fromMain", "defPosition;"+cmd[1]+";"+cmd[2])
			break
		case 'transpoToPosY':
			console.log(`transpoToPosY ${args} from renderer process`);
			mainWindow.webContents.send("fromMain", "transpoToPosY;"+cmd[1]+";"+cmd[2])
			break
		case 'saveConfig':
			saveConfig(cmd[1])
			break
		case 'saveTheme':
			saveTheme(cmd[1])
			break
		case 'copyDefautMenu':
			copyDefautMenu(cmd[1])
			break
		case 'saveDsp':
			dspSave(cmd[1],cmd[2],cmd[3])
			break
		case 'selectStd':
			stdSelect()
			break
		case 'ide':
			ide()
			break
		case 'defStudioOk':
			if(winVueStudio3DEtat==1){
				winVueStudio3D.destroy()
	  			winVueStudio3DEtat=0
	  		}
			newStudio.destroy()
	  		newStudioEtat=0
			break 
		case 'vueStudio3D':
			vueStudio3D(cmd[1])
			break 
		case 'vueModifStudio3D':
			winVueStudio3D.webContents.send("fromMain", "moveObjActif;"+cmd[1])
			break
		case 'closeVue3D':
			if(winVueStudio3DEtat==1){
				winVueStudio3D.destroy()
	  			winVueStudio3DEtat=0
	  		}
			break
		case 'read3D':
			mainRead3D()
			break
		case 'exportExterne':
		console.log(`externe ${args} from renderer process`);
			mainExternes(cmd[1])
			mainWindow.webContents.send("fromMain", "exportExterne;"+cmd[1])
			break
		case 'defExterne':
			mainExternes2(cmd[1])
			break
		case 'exportSelect':
			exportSelect(cmd[1])
			break
		case 'vueSpectrogram':
			//console.log(`spectro ${args} from renderer process`);
			soxSpectrogram(cmd[1])
			break
		case 'saveSpectro':
			//console.log(`save spectro ${args} from renderer process`);
			saveSpectro(cmd[1])
			break
		case 'audioEditor':
			console.log(`save spectro ${args} from renderer process`);
			audioEditor(cmd[1])
			break
	}
         
});


})

// ****************************************************************************************************************
function mainExternes(txt) {
	var defc=atob(txt).split(',')
	console.log('importExterne',txt,defc)
	editor=defc[0]
	daw=defc[1]
	cmdDaw=defc[2]
	pdfPage=parseInt(defc[3])
	pdfLandscape=defc[4]
	pdfScale=parseFloat(defc[5])
	pdfMgTop=parseFloat(defc[6])
	pdfMgBot=parseFloat(defc[7])
	pdfMgLeft=parseFloat(defc[8])
	pdfMgRight=parseFloat(defc[9])
	pdfBkg=parseInt(defc[10])
	pdfAssCmd=defc[11]
	pdfAppCmd=defc[12]
	editAudioCmd=defc[13]
}
function mainExternes2(txt) {
	var defc=atob(txt).split(',')
	console.log('importExterne',txt,defc)
	projetName=defc[0]
	projetPath=defc[1]
	audioPath=defc[2]
	imgPath=defc[3]
	editor=defc[4]
	daw=defc[5]
	cmdDaw=defc[6]
	pdfPage=defc[7]
	pdfLandscape=defc[8]
	pdfScale=defc[9]
	pdfMgTop=defc[10]
	pdfMgBot=defc[11]
	pdfMgLeft=defc[12]
	pdfMgRight=defc[13]
	pdfBkg=defc[14]
	pdfAssCmd=defc[15]
	pdfAppCmd=defc[16]
	editAudioCmd=defc[17]
}
function mainRead3D() {
	if(daw=='reaper'){
		//cmdDaw='/home/dominique/Reaper/reaper_linux_x86_64/REAPER/reaper'
		cmd=cmdDaw+' '+app.getPath('home')+'/kandiskyscore/Scripts/Reaper/tmp.rpp'+' '+app.getPath('home')+'/kandiskyscore/Scripts/Reaper/insertKandiskyScore2.lua' 
	}else{
		cmdDaw='ardour'
		cmd=cmdDaw+' '+app.getPath('home')+'/kandiskyscore/Scripts/Ardour/tmp/tmp.ardour'

	}
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

function defProjet(){
	mainWindow.webContents.send("fromMain", "configProjet")
}
function defTheme() {
	mainWindow.webContents.send("fromMain", "defTheme")
}
function objetAudio(id,num) {
	console.log("id2",id)
	var rt=""
	var audiofile = dialog.showOpenDialog({
	properties: [
    'openFile'],
   defaultPath: app.getPath('home')+'/kandiskyscore/Projets/',
	filters: [
    { name: 'Audios', extensions: ['wav', 'flac', 'ogg', 'aiff'] },
    { name: 'All Files', extensions: ['*'] }
  ]
   }).then(result => {
   	if(result.canceled==false){
   		console.log("result.filePaths",result.filePaths[0],id,num)
   		rt=result.filePaths[0]
   	}
  		winConfig.webContents.send("fromMain", "defAudioObj;"+id+";"+rt+";"+num);
  		mainWindow.webContents.send("fromMain", "audioImport;"+id+";"+rt+";"+num);
	})
}
function replaceAudio(id,rt) {
	winConfig.webContents.send("fromMain", "defAudioObj;"+id+";"+rt+";1");
  	mainWindow.webContents.send("fromMain", "audioImport;"+id+";"+rt+";1;0");
}
function saveFxAudio(id,rt) {
  	mainWindow.webContents.send("fromMain", "audioImport;"+id+";"+rt+";1;1");
}
function preDefAudio(id) {
	console.log("id2",id)
	var rt=""
	var audiofile = dialog.showOpenDialog({
	properties: [
    'openFile'],
   defaultPath: app.getPath('home')+'/kandiskyscore/Projets/',
	filters: [
    { name: 'Audios', extensions: ['wav', 'flac', 'ogg', 'aiff'] },
    { name: 'All Files', extensions: ['*'] }
  ]
   }).then(result => {
   	if(result.canceled==false){
   		console.log("result.filePaths",result.filePaths[0],id)
   		rt=result.filePaths[0]
   	}
  		winPreDef.webContents.send("fromMain", "defAudioObj;"+id+";"+rt);
  		mainWindow.webContents.send("fromMain", "audioPreDefImport;"+id+";"+rt);
	})
}
function defBkgImg(id) {
	console.log("id2",id)
	var rt=""
	var imgfile = dialog.showOpenDialog({
	properties: [
    'openFile'],
   defaultPath: app.getPath('home')+'/kandiskyscore/Projets/'+projetName,
	filters: [
    { name: 'img', extensions: ['png', 'jpg', 'svg'] },
    { name: 'All Files', extensions: ['*'] }
  ]
   }).then(result => {
   	if(result.canceled==false){
   		console.log("result.filePaths",result.filePaths[0],id)
   		rt=result.filePaths[0]
   	}
  		winGraphObj.webContents.send("fromMain", "defBkgImg;"+id+";"+rt);
  		if(winConfigEtat==1){
  			winConfig.webContents.send("fromMain", "defBkgImg;"+id+";"+rt);
  		}
  		mainWindow.webContents.send("fromMain", "defBkgImg;"+id+";"+rt);
	})
}
function defBkgGrpImg(id) {
	console.log("id2",id)
	var rt=""
	var imgfile = dialog.showOpenDialog({
	properties: [
    'openFile'],
   defaultPath: app.getPath('home')+'/kandiskyscore/Projets/',
	filters: [
    { name: 'img', extensions: ['png', 'jpg', 'svg'] },
    { name: 'All Files', extensions: ['*'] }
  ]
   }).then(result => {
   	if(result.canceled==false){
   		console.log("result.filePaths",result.filePaths[0],id)
   		rt=result.filePaths[0]
   	}
  		mainWindow.webContents.send("fromMain", "defBkgGrpImg;"+id+";"+rt);
  		if(winGraphGrpEtat==1){
  			winGraphGrp.webContents.send("fromMain", "defGrpImg;"+id+";"+rt);
  		}
  		if(winPreDefEtat==1){
  			winPreDef.webContents.send("fromMain", "defGrpImg;"+id+";"+rt);
  		}
	})
}
function defSymbBkgImg(id) {
	console.log("id2",id)
	var rt=""
	var imgfile = dialog.showOpenDialog({
	properties: [
    'openFile'],
   defaultPath: app.getPath('home')+'/kandiskyscore/Projets/',
	filters: [
    { name: 'img', extensions: ['png', 'jpg', 'svg'] },
    { name: 'All Files', extensions: ['*'] }
  ]
   }).then(result => {
   	if(result.canceled==false){
   		console.log("result.filePaths",result.filePaths[0],id)
   		rt=result.filePaths[0]
   	}
  		winGraphSymb.webContents.send("fromMain", "defSymbBkgImg;"+id+";"+rt);
  		if(winConfigEtat==1){
  			winConfig.webContents.send("fromMain", "defBkgImg;"+id+";"+rt);
  		}
  		mainWindow.webContents.send("fromMain", "defSymbBkgImg;"+id+";"+rt);
	})
}
function selectImg() {
	var rt=""
	var imgfile = dialog.showOpenDialog({
	properties: [
    'openFile'],
   defaultPath: app.getPath('home')+'/kandiskyscore/Projets/'+projetName,
	filters: [
    { name: 'img', extensions: ['png', 'jpg', 'svg'] },
    { name: 'All Files', extensions: ['*'] }
  ]
   }).then(result => {
   	if(result.canceled==false){
   		rt=result.filePaths[0]
   	}
  		mainWindow.webContents.send("fromMain", "defSelectImg;"+rt);
	})
}
function selectTheme() {
	var rt=""
	var themeFile = dialog.showOpenDialog({
	properties: [
    'openFile'],
   defaultPath: './Themes',
	filters: [
    { name: 'All Files', extensions: ['*'] }
  ]
   }).then(result => {
   	if(result.canceled==false){
   		rt=result.filePaths[0]
   	}
  		mainWindow.webContents.send("fromMain", "selectTheme;"+result.filePaths[0]);
	})
}
function interp() {
	var rt=""
	var themeFile = dialog.showOpenDialog({
	properties: [
    'openFile'],
   defaultPath: app.getPath('home')+'/kandiskyscore/Actions',
	filters: [
    { name: 'Js', extensions: ['js'] }
  ]
   }).then(result => {
   	if(result.canceled==false){
   		rt=result.filePaths[0]
   	}
  		//mainWindow.webContents.send("fromMain", "selectTheme;"+result.filePaths[0]);
  		mainWindow.webContents.send("fromMain", "interpreteur;"+rt);
	})
	
}
// ****************************************************************************************************************

// Quitter quand toutes les fenêtres sont fermées, sauf sur macOS. Dans ce cas il est courant
// que les applications et barre de menu restents actives jusqu'à ce que l'utilisateur quitte 
// de manière explicite par Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// Dans ce fichier vous pouvez inclure le reste du code spécifique au processus principal. Vous pouvez également le mettre dans des fichiers séparés et les inclure ici.


// preload.js

// Toutes les API Node.js sont disponibles dans le processus de préchargement.
// Il a la même sandbox qu'une extension Chrome.
