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
const fs = require("fs")
//const Buffer = require("buffer")

const Mn = require('./menuDefaut')
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

let currentProjet=""
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
    	{ label: Mnewspace,
				click: () => nouvelEspace() },
    	{ type: 'separator' },
    	{ label: Msave,
				click: () => saveDefProjet(), accelerator:'CommandOrControl+S' },
		{ label: MsaveAs,
				click: () => saveDefProjetAs(), accelerator:'CommandOrControl+P' },
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
					click: () => exportPart()  }
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
		,
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
      { type: 'separator' },
      { label: Mobjetwav,
      		click: () => renduObjet() },
      { label: Mgrpwav,
      		click: () => renduGrp() },
      { label: Mintervwav,
      		click: () => renduIntervalle() },
      { label: Mpartwav,
      		click: () => renduPart() }
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
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('http://blanchemain.info/Documents/Programmation/index.php?page=kandiskyScore')
        }
      }
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
		    console.log('Saved!')
				    });
}
ipcMain.on ("saveAudio", (event, ...args) => {									// Affichage du menu popup
	console.log(`Save`+ args[1] +` from param`)
    autoFileSave(event,args[1],args[2])
});
// ****************************************************************************************************************
//																	Menu principal
// ****************************************************************************************************************

function createStudio() {
	if(newStudioEtat==0){
		newStudio= new BrowserWindow({width:1110,height:950,alwaysOnTop:true,
		webPreferences: {
	            nodeIntegration: true,
	            contextIsolation: true,
	            enableRemoteModule: false, // turn off remote
	            preload: path.join(__dirname, 'preload.js')
	        }
		})
		newStudio.loadFile('studioCreate.html')
		newStudio.removeMenu();
		newStudio.webContents.openDevTools()
		newStudioEtat=1
		

		newStudio.on('close', e => { 		//													Contrôle à la fermeture de la fenêtre
	   e.preventDefault()
	   
	  newStudio.destroy()
	  newStudioEtat=0
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
	fs.copyFile('./Local/'+lang+'/menu-'+lang+'.js', './menuDefaut.js', (err) => {
    if (err) 
        throw err;
    console.log('./Local/'+lang+'/menu-'+lang+'.js was copied to ./menuDefaut.js');
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
    console.log("width: " + width);
    console.log("height: " + height);
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
		     defaultPath: '../',
			filters: [
		    { name: 'kandiskyscore', extensions: ['xml'] },
		    { name: 'All Files', extensions: ['*'] }
		  ]
		   }).then(result => {
		   	console.log(result.canceled)
		  		console.log(result.filePaths)
		  		if(!result.canceled){
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
     defaultPath: '../',
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
	var path="./config.js"
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
		fs.writeFile(currentProjet, 
                   txt, function (err) {
          if (err) throw err;
          console.log('Saved at',currentProjet);
      });
	}
}
function saveModifProjetAs(txt) {
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
function stdSelect() {
   var rt=""
	var themeFile = dialog.showOpenDialog({
	properties: [
    'openFile'],
   defaultPath: './Dsp',
	filters: [
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
        defaultPath: path.join(__dirname, './Dsp'),
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
        defaultPath: path.join(__dirname, '../'),
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
	exec("npm start ", (error, stdout, stderr) => {
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
function configuration(lang,cmd2,cmd3,cmd4,cmd5) {
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
		winProjet.webContents.openDevTools()
		winProjetEtat=1
		winProjet.webContents.on('did-finish-load', function() { //					On attend que la fenêtre soit totalement chargée
    		winProjet.webContents.send("fromMain", "defProjet;"+lang+";"+cmd2+";"+cmd3+";"+cmd4+";"+cmd5);
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

function winObjetParam(objId,lang,obj,c) {
	if(winConfigEtat==0){
		winConfig = new BrowserWindow({width:400,height:620,alwaysOnTop:true,
		webPreferences: {
	            nodeIntegration: true,
	            contextIsolation: true,
	            enableRemoteModule: false, // turn off remote
	            preload: path.join(__dirname, 'preload.js')
	        }
		})
		winConfig.loadFile('objetParam.html')
		winConfig.removeMenu();
		winConfig.webContents.openDevTools()
		winConfigEtat=1
		winConfig.webContents.on('did-finish-load', function() { //					On attend que la fenêtre soit totalement chargée
    		winConfig.webContents.send("fromMain", "defObjet;"+objId+";"+lang+";"+obj+";"+c);
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
function createPreDef(objId,lang,obj) {
	if(winPreDefEtat==0){
		winPreDef = new BrowserWindow({width:940,height:620,
		webPreferences: {
	            nodeIntegration: true,
	            contextIsolation: true,
	            enableRemoteModule: false, // turn off remote
	            preload: path.join(__dirname, 'preload.js')
	        }
		})
		winPreDef.loadFile('preDefGrp.html')
		winPreDef.removeMenu();
		winPreDef.webContents.openDevTools()
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
		winGraphObj = new BrowserWindow({width:535,height:544,alwaysOnTop:true,
		webPreferences: {
	            nodeIntegration: true,
	            contextIsolation: true,
	            enableRemoteModule: false, // turn off remote
	            preload: path.join(__dirname, 'preload.js')
	        }
		})
		winGraphObj.loadFile('defgraphObj.html')
		winGraphObj.removeMenu();
		winGraphObj.webContents.openDevTools()
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
		winGraphSymb.webContents.openDevTools()
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
		winGraphGrp = new BrowserWindow({width:535,height:544,
		webPreferences: {
	            nodeIntegration: true,
	            contextIsolation: true,
	            enableRemoteModule: false, // turn off remote
	            preload: path.join(__dirname, 'preload.js')
	        }
		})
		winGraphGrp.loadFile('defGrp.html')
		winGraphGrp.removeMenu();
		winGraphGrp.webContents.openDevTools()
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
		winTrajectoire.webContents.openDevTools()
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
		winStudio.webContents.openDevTools()
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
		winStudio3D.webContents.openDevTools()
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
		winVueStudio3D.webContents.openDevTools()
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
		winSpatial.webContents.openDevTools()
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
function pdfSettings() {
    var paperSizeArray = ["A4", "A5"];
    var option = {
        landscape: true,
     	  top : 0.2,
     	  bottom: 0.2,
     	  left : 0.2,
     	  right : 0.2,
        printBackground: true,
        printSelectionOnly: false,
        pageSize: 'A4',
        pageRanges: '1-2'
    };
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

	for(let i=1;i<11;i++){
	nwin[i].loadFile('./pdf/p'+i+'.html')
	nwin[i].webContents.on('did-finish-load', function() { 
	
	   nwin[i].webContents.printToPDF(pdfSettings()).then(data => {
		   fs.writeFile("./pdf/p"+i+".pdf", data, function (err) {
			   if (err) {
			       console.log(err);
			   } else {
			       console.log('PDF Generated Successfully');
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
function aenu(chn) {
  return decodeURIComponent(escape(atob(chn)));
}
function spaceToSvg(txt) {
	fs.writeFile('./pdf/tmpsvg.svg', aenu(txt), function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log('PDF Generated Successfully');
                svgToPdf(txt) 
            }
        });
        
}

// ****************************************************************************************************************
//const ipc = require('electron').ipcRenderer;

ipcMain.on ("toMain", (event, args) => {
	let cmd=args.split(';')
	switch(cmd[0]) {
		case 'defPdf':
			divToPdf(cmd[1])
			break
		case 'spaceToSvg':
			spaceToSvg(cmd[1])
			break
		case 'openObjetParam':
			winObjetParam(cmd[1],cmd[2],cmd[3],cmd[4])
			break
		case 'openSymbParam':
			createWinSymb(cmd[1],cmd[2],cmd[3],cmd[4])
			break
		case 'openGrpParam':
			console.log(`openGrpParam ${args} from param`);
			createWinGrp(cmd[1],cmd[2],cmd[3])
			break
		case 'openPreDef':
			console.log(`openGrpParam ${args} from param`);
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
			if(winStudio3DEtat==1){
				winStudio3D.destroy()
	     	   winStudio3DEtat=0
	      }
			break	
		case 'winSpatial':
			spatialOpen(cmd[1],cmd[2],cmd[3],cmd[4],cmd[5],cmd[6],cmd[7])
			console.log('winSpatial',cmd[1],cmd[2],cmd[3],cmd[4],cmd[5],cmd[6],cmd[7])
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
		case 'envm':
			mainWindow.webContents.send("fromMain", "audioEnv2;"+cmd[1]+";"+cmd[2]+";"+cmd[3]+";"+cmd[4])
			break
		case 'preDefEnv':
			mainWindow.webContents.send("fromMain", "preDefEnv;"+cmd[1]+";"+cmd[2]+";"+cmd[3]+";"+cmd[4])
			break
		case 'objRayon':
			console.log(`rayon ${args} from renderer process`);
			mainWindow.webContents.send("fromMain", "objetRayon;"+cmd[1]+";"+cmd[2])
			break
		case 'objScaleX':
			console.log(`scaleX ${args} from renderer process`);
			mainWindow.webContents.send("fromMain", "objetScaleX;"+cmd[1]+";"+cmd[2])
			break
		case 'objScaleY':
			console.log(`scaleY ${args} from renderer process`);
			mainWindow.webContents.send("fromMain", "objetScaleY;"+cmd[1]+";"+cmd[2])
			break
		case 'objScaleGrpXY':
			console.log(`scaleXY ${args} from renderer process`);
			mainWindow.webContents.send("fromMain", "objetScaleGrpXY;"+cmd[1]+";"+cmd[2])
			break
		case 'objScaleXY':
			console.log(`scaleXY ${args} from renderer process`);
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
			mainWindow.webContents.send("fromMain", "objColor;"+cmd[1]+";"+cmd[2])
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
			console.log(`defGraphObj ${args} from renderer process`);
			mainWindow.webContents.send("fromMain", "bkgColor;"+cmd[1]+";"+cmd[2])
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
			console.log(`defbkgObj ${args} from renderer process`);
			winConfig.webContents.send("fromMain", "defBkgColor;"+cmd[1]+";"+cmd[2])
			mainWindow.webContents.send("fromMain", "bkgColor;"+cmd[1]+";"+cmd[2])
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
			configuration(cmd[1],cmd[2],cmd[3],cmd[4],cmd[5])
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
			saveSvgAs(cmd[1])
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
	}
         
});


})

// ****************************************************************************************************************
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
   defaultPath: '/home/dominique/public_html/kandiskyscore2/Projets/decouverte/Audios',
	filters: [
    { name: 'Audios', extensions: ['wav', 'flac', 'ogg', 'aiff'] },
    { name: 'All Files', extensions: ['*'] }
  ]
   }).then(result => {
   	if(result.canceled==false){
   		console.log("result.filePaths",result.filePaths[0],id)
   		rt=result.filePaths[0]
   	}
  		winConfig.webContents.send("fromMain", "defAudioObj;"+id+";"+rt+";"+num);
  		mainWindow.webContents.send("fromMain", "audioImport;"+id+";"+rt+";"+num);
	})
}
function replaceAudio(id,rt) {
	winConfig.webContents.send("fromMain", "defAudioObj;"+id+";"+rt+";1");
  	mainWindow.webContents.send("fromMain", "audioImport;"+id+";"+rt+";1");
}
function preDefAudio(id) {
	console.log("id2",id)
	var rt=""
	var audiofile = dialog.showOpenDialog({
	properties: [
    'openFile'],
   defaultPath: '/home/dominique/public_html/kandiskyscore2/Projets/decouverte/Audios',
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
   defaultPath: '/home/dominique/public_html/kandiskyscore2/Projets/decouverte',
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
   defaultPath: '/home/dominique/public_html/kandiskyscore2/Projets/decouverte',
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
   defaultPath: '/home/dominique/public_html/kandiskyscore2/Projets/decouverte',
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
   defaultPath: '/home/dominique/public_html/kandiskyscore2/Projets/decouverte',
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
