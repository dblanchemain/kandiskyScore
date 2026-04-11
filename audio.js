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

// audio.js

let sourceStat=0;
let playerStat=0;
let tableSrc=[];
let vueStudio=0;
var points=0;
var compteur=0;
var tempoFoo=[];
var curTempo=0;
let dureePlayer=0;
let tableListSource=[];
let timer;


document.getElementById("simpleSpeaker").addEventListener('click',readSimpleAudio);
document.getElementById("actualiseObj").addEventListener('click',actualiseObjets);
document.getElementById("inpTempo").addEventListener('input',inpTempo);
document.getElementById("sliderTempo").addEventListener('input',sliderTempo);
document.getElementById("renderPlay").addEventListener('click',player);

let maxDuree=0;

function readPart(){
	let nbp=0;
	var lsgrp=[];
	for(i=0;i<tableObjet.length;i++){
		if(tableObjet[i].etat==1){
			if (tableObjet[i].file!=="" && tableObjet[i].file!==undefined) {
				if (tableObjet[i].class==1 && tableObjet[i].type<23) {
					lsgrp.push(i);
				}
			}
		}
	}
	
	if(playerStat==0){
		playerStat=1;
		defStudioSrc(lsgrp);
	   console.log("table",lsgrp,tableListSource,tableListSource[0].etat,tableListSource[0].start);
		 maxDuree=0;
		 for(i=0;i<tableListSource.length;i++){
			 var obj=tableObjet[tableListSource[i].obj];
			 var m=((obj.duree*obj.fin)-(obj.duree*obj.debut))/obj.transposition;
			 m=m+(obj.posX/18);
			 if(m>maxDuree){
			 	maxDuree=m;
			 }
		 }
		console.log("maxduree",maxDuree); 
		curTempo=0;
		foo(); 
		 

		document.getElementById("play3").firstChild.firstChild.setAttribute('d','M5,40 L5,0 M25,0 L25,40');
		//renderPartAudio(0);
		
	}else{
		document.getElementById("play3").firstChild.firstChild.setAttribute('d','M0,40 0,5 30,20 0,35');
		playerStat=0;
		//clearTimeout(timer);
		//multiStop();
		window.api.send("toMain", 'killPlay');
		if(vueStudio==1 ){
			window.api.send("toMain", "endEvtAudio;");
		}
	}
}
function playerDebut(){
	document.getElementById("barVerticale").style.left="0px";
	dheures=0;
	dsecondes=0;
	dminutes=0;
	document.getElementById("compteurH").innerHTML = " 00 : ";
	document.getElementById("compteurM").innerHTML = " 00 : ";
	document.getElementById("compteurS").innerHTML = "00";
	document.getElementById("tempo").value=60;
	console.log('debut bar',document.getElementById("barVerticale").style.left);
}
function playerPrec(){
	document.getElementById("barVerticale").style.left=(parseInt(document.getElementById("barDebut").style.left)+35)+"px";
	tmp=(parseInt(document.getElementById("barVerticale").style.left)*(720/12960));
	defTime("barVerticale");
}
function playerSuiv(){
	document.getElementById("barVerticale").style.left=(parseInt(document.getElementById("barFin").style.left)-4)+"px";
	defTime("barVerticale");
}
function playerEnd(){
var nsgrp=[];
nsgrp=[].concat(tableObjet);
console.log("nsgrp",nsgrp);
nsgrp=nsgrp.sort((s1, s2) => {
 return s1.posX - s2.posX;
});
document.getElementById("barVerticale").style.left=nsgrp[nsgrp.length-1].posX+"px";
defTime("barVerticale");
}
function foo() {
	var ht;
	var st;
	var mt;
	
	
	var gtempo=60/parseFloat(document.getElementById("tempo").value);
	var delay=55*gtempo;
	
	var nbp2;
	var nbp=-1;
    // your function code here
	if(playerStat==1){
    var lleft=parseFloat(document.getElementById("barVerticale").style.left)+(1*zoomScale);
    document.getElementById("barVerticale").style.left=lleft+"px";
    nbp2=Math.floor(parseInt(document.getElementById("barVerticale").style.left)/1200); 
    /*
    if(points<(18/gtempo)){
    	points+=1.065;
    }else{

    	if(nbp2>nbp){	
			 document.getElementById("work").scrollLeft=nbp2*1200;
			 nbp=nbp2;
		 }
		 */
		 document.getElementById("work").scrollLeft=nbp2*1200;
		
		// Temps réel calculé depuis la position de la barre, en tenant compte du tempo
		var _barLeft = parseFloat(document.getElementById("barVerticale").style.left);
		var _totalSec;
		try { _totalSec = pixelToTime(_barLeft); } catch(e) { _totalSec = _barLeft / (18 * zoomScale); }
		dheures   = Math.floor(_totalSec / 3600);
		dminutes  = Math.floor((_totalSec % 3600) / 60);
		dsecondes = _totalSec % 60;
		ht = dheures  < 10 ? "0"+dheures  : ""+dheures;
		mt = dminutes < 10 ? "0"+dminutes : ""+dminutes;
		st = dsecondes < 10 ? "0"+dsecondes.toFixed(2) : dsecondes.toFixed(2);
	 	 document.getElementById("compteurH").innerHTML = ht+" : ";
		 document.getElementById("compteurM").innerHTML = mt+" : ";
		 document.getElementById("compteurS").innerHTML = st;
		 points=0;
		 
		 for(i=0;i<tableListSource.length;i++){
			if(tableListSource[i].etat==0 && tableListSource[i].start<=parseFloat(document.getElementById("barVerticale").style.left)/18){
				try {
				var obj=tableObjet[tableListSource[i].obj];
				var outPath=window.api.joinPath(toAbsPath(paramProjet.audioPath),'tmp',`${obj.id}-fx.wav`);
				 tableListSource[i].etat=1;
				const options = {
			    pitchSemitones: obj.detune,
			    speedFactor: obj.transposition,
			    gain: obj.gain,
			    startSec: obj.debut,
			    lengthSec: ((obj.duree*obj.fin)-(obj.duree*obj.debut))/obj.transposition
				 };
				 const durationAfterSpeed=((obj.duree*obj.fin)-(obj.duree*obj.debut))/obj.transposition;
				 const envX0 = (obj.envX && obj.envX[0] !== undefined) ? obj.envX[0] : 0;
				 const envX1 = (obj.envX && obj.envX[1] !== undefined) ? obj.envX[1] : 1;
				 const fadeIn = obj.fadeIn || 0;
				 const defFade=fadeIn+" "+(durationAfterSpeed*envX0)+" "+durationAfterSpeed+" "+durationAfterSpeed*(1-envX1);
				 var soxParams="pitch "+options.pitchSemitones+" speed "+options.speedFactor+" vol "+(options.gain*soxVolume)+" trim "+options.startSec+" "+options.lengthSec+" fade "+defFade;
		 		window.api.playDirectFile(1, outPath, soxParams);
		 		console.log("obj",obj.id,options);
				} catch(e) { console.error("playback trigger error",e); }
		 	}
		 }
		 
		 if(vueStudio==1 ){
		 	
		 	for(i=0;i<tableListSource.length;i++){
			 	if(tableListSource[i].etat==1 && tableListSource[i].start<parseFloat(document.getElementById("barVerticale").style.left)/18){
			 		tableListSource[i].etat=2;
			 		cmd="obj"+i+";"+tableListSource[i].x+";"+tableListSource[i].y+";"+tableListSource[i].z+";"+tableListSource[i].w+";"+tableListSource[i].index+";"+tableListSource[i].img;
					console.log("createEvtAudio",cmd);					
					window.api.send("toMain", "createEvtAudio;"+cmd);
			 	}
		 	}
		 	for(i=0;i<tableListSource.length;i++){
			 	if(tableListSource[i].etat==2 && tableListSource[i].end<parseFloat(document.getElementById("barVerticale").style.left)/18){
			 		tableListSource[i].etat=3;
			 		window.api.send("toMain", "delEvtAudio;obj"+i);
			 	}
		 	}
		 
		 }
	//}
	// console.log('time',document.getElementById("renduWav").currentTime)

	 
	 if(curTempo < tempoFoo.length && parseFloat(document.getElementById("barVerticale").style.left)>tempoFoo[curTempo].X){
	 	//document.getElementById("renduWav").playbackRate =tempoFoo[curTempo].Y/60;
	 	document.getElementById("tempo").value=tempoFoo[curTempo].Y.toFixed(2);
	 	 curTempo++;
	 }
	 
		 if(parseFloat(document.getElementById("barVerticale").style.left)/18<maxDuree){
	    	timer=setTimeout(foo, delay);
	    }
    }
}

function foo2() {	
	var nb=240/(dureePlayer*3000);
	document.getElementById("renderPos").value=parseFloat(document.getElementById("renderPos").value)+nb;
	var delay=81;
	if(document.getElementById("renderPos").value<240){
		timer=setTimeout(foo2, delay);
	}else{
		window.api.send("toMain", 'killPlay');
	}
}
function defStudioSrc(lsgrp) {
	tableListSource=[];
	for (let i=0;i<lsgrp.length;i++){
		var graph=defTypeDb(tableObjet[lsgrp[i]].rmsdb);
		var obj=tableObjet[lsgrp[i]];
		var startSec=obj.debut;
	   var lengthSec= (obj.duree*obj.fin)-(obj.duree*obj.debut);
	   var numSamples=obj.duree*contextAudio.sampleRate;
	   const startSample = Math.floor(startSec * contextAudio.sampleRate);
      const endSample = Math.min(Math.floor((startSec + lengthSec) * contextAudio.sampleRate), numSamples);
      const trimmedLength = endSample - startSample;
		const renderedLength = Math.floor(trimmedLength /obj.transposition);
		const rduree=renderedLength/contextAudio.sampleRate;
		var ntime=obj.posX/18;
		for(let j=0;j<obj.spT.length;j++){
			var npoint={};
			var npz=(1.4-obj.spZ[j])/2;
			npoint.start=ntime+(obj.spT[j]*rduree);
			if(obj.spT[j+1]){
				npoint.end=ntime+(obj.spT[j+1]*rduree);
			}else{
				npoint.end=ntime+(renderedLength/contextAudio.sampleRate) ;
			}
			npoint.obj=lsgrp[i];
			npoint.x=obj.spX[j];
			npoint.y=obj.spY[j];
			npoint.etat=0;
			npoint.z=npz;
			npoint.w=graph.wd*npz;
			npoint.img=graph.img;
			npoint.index=Math.round((npz*100)+1);
			tableListSource.push(npoint);
		}
		console.log(obj,tableListSource);
	}
	
}
function defTypeDb(objDb) {
	var lscale2=2;	
	if (objDb<-40){
		var ws=30*lscale2;
		var im="./images/png/path4484.png";
	}
	if (objDb>=-39 && objDb<-32){
		var ws=35*lscale2;
		var im="./images/png/path4488.png";
	} 
	if (objDb>=-31 && objDb<-24){
		var ws=40*lscale2;
		var im="./images/png/path4487.png";
	}
	if (objDb>=-23 && objDb<-16){
		var ws=50*lscale2;
		var im="./images/png/path4486.png";
	}
	if (objDb>=-15 && objDb<-8){
		var ws=60*lscale2;
		var im="./images/png/path4489.png";
	}
	if (objDb>=-8 && objDb<-2){
		var ws=70*lscale2;
		var im="./images/png/path4490.png";
	}
	if (objDb>=-2.0){
		var ws=80*lscale2;
		var im="./images/png/path4485.png";
	}
	var rt={
		wd:ws,
		img:im
	};
	return rt;
}

// Convertit une position CSS (px) en temps réel (secondes) en tenant compte du tempoFoo
function pixelToTime(cssPosX) {
	if (tempoFoo.length <= 1) {
		return cssPosX / (18 * zoomScale);
	}
	var seconds = 0;
	var prevX = 0;
	for (var _i = 0; _i < tempoFoo.length; _i++) {
		var entry = tempoFoo[_i];
		if (entry.X >= cssPosX) {
			seconds += (cssPosX - prevX) * 60 / (entry.Y * 18 * zoomScale);
			return seconds;
		}
		seconds += (entry.X - prevX) * 60 / (entry.Y * 18 * zoomScale);
		prevX = entry.X;
	}
	var lastBPM = tempoFoo[tempoFoo.length - 1].Y;
	seconds += (cssPosX - prevX) * 60 / (lastBPM * 18 * zoomScale);
	return seconds;
}

// Convertit un temps réel (secondes) en position CSS (px) en tenant compte du tempoFoo
function timeToPixel(seconds) {
	if (tempoFoo.length <= 1) {
		return seconds * 18 * zoomScale;
	}
	var remain = seconds;
	var prevX = 0;
	for (var _i = 0; _i < tempoFoo.length; _i++) {
		var entry = tempoFoo[_i];
		var segDur = (entry.X - prevX) * 60 / (entry.Y * 18 * zoomScale);
		if (segDur >= remain) {
			return prevX + remain * entry.Y * 18 * zoomScale / 60;
		}
		remain -= segDur;
		prevX = entry.X;
	}
	var lastBPM = tempoFoo[tempoFoo.length - 1].Y;
	return prevX + remain * lastBPM * 18 * zoomScale / 60;
}

function defTime(elem) {
	var _posCSS = parseInt(document.getElementById(elem).style.left);
	if(elem=="barDebut"){
		tmp = pixelToTime(_posCSS + 40);
	}else if(elem=="barFin"){
		tmp = pixelToTime(_posCSS);
	}else{
		tmp = pixelToTime(_posCSS) + 1;
	}
	document.getElementById("compteurH").innerHTML = " 00 : ";
	document.getElementById("compteurM").innerHTML = " 00 : ";
	document.getElementById("compteurS").innerHTML = "00";
	dsecondes=Math.round(tmp);

 	var ht=0;
	var mt=Math.floor(tmp/60);
	var st=Math.floor(tmp%60);
	dheures=ht;
	dsecondes=st;
	dminutes=mt;
 	if(ht<10){
 		ht="0"+ht;
 	}
 	if(dminutes<10){
 		mt="0"+mt;
 	}
 	if(dsecondes<10){
 		st="0"+st;
 	}
 	 document.getElementById("compteurH").innerHTML = ht+" : ";
	 document.getElementById("compteurM").innerHTML = mt+" : ";
	 document.getElementById("compteurS").innerHTML = st;
	return tmp;
}

async function readSimpleAudio() {
	console.log("read speaker",tableObjet[objActif],objActif);
	if(playerStat==0){
		sourceStat=1;
		if(grpSelect==1){
			playerStat=1;
			readGrpAudio(0);
		}else if(tableObjet[objActif].class==1){
			playerStat=1;
			const obj = tableObjet[objActif];
		    if (!obj || !obj.file) throw new Error("Objet ou fichier introuvable");
		    
		    const filePath = obj.file;
		    const dir = await rdDirName(filePath);
		    let baseName = await rdBaseName(filePath);
		    baseName=baseName.split(".")[0];
		    let outPath ="";
		    outPath=window.api.joinPath(toAbsPath(paramProjet.audioPath),'tmp',`${obj.id}-fx.wav`);
		    console.log('baseName',dir,baseName,outPath);
		    const durationAfterSpeed=((obj.duree*obj.fin)-(obj.duree*obj.debut))/obj.transposition;
		    const defFade=obj.fadeIn +" "+(durationAfterSpeed*obj.envX[0])+" "+durationAfterSpeed+" "+durationAfterSpeed*(1-obj.envX[1]);
		    const options = {
			    pitchSemitones: obj.detune,  // équivalent à -500 cents
			    speedFactor: obj.transposition,       // speed 2x
			    gain: obj.gain,
			    startSec: obj.debut,
			    fade:defFade,
			    lengthSec: ((obj.duree*obj.fin)-(obj.duree*obj.debut))/obj.transposition
				 };
				 console.log("read speaker opt",options);
				 document.getElementById("barVerticale").style.left=((tableObjet[objActif].posX-4)*zoomScale)+"px";
				 defTime("barVerticale");
				 if(vueStudio==1 ){
					defStudioSrc([objActif]);
				 }
				 lsgrp=[];
				 lsgrp[0]=objActif;
				 defStudioSrc(lsgrp);
				 maxDuree=durationAfterSpeed+(obj.posX/18);
				 console.log("maxDuree",maxDuree);
	  			 foo();
			 window.api.playDirectFile(0, outPath, "pitch "+options.pitchSemitones+" speed "+options.speedFactor+" vol "+(options.gain*soxVolume)+" trim "+options.startSec+" "+options.lengthSec+" fade "+options.fade);
	  				
			//spatialiseObjet(objActif,"spline");
			}else if(grpSelect==1 ||  tableObjet[objActif].class==4){
				playerStat=1;
				readGrpAudio(0);
			}
	}else{
		sourceStat=0;
		playerStat=0;
		if(tableObjet[objActif].class==1){
			console.log("stop speaker",objActif);
			window.api.send("toMain", 'killPlay');
		}else{
			multiStop();
		}
	}
	
}
function lastAudioInGrp(lgrp) {
	var lmax=-1;
	var iref=0;
	var maxDuree=0;
	var lmin=65535;
	var ratioT=(720/12960);
	var lgi=0;
	var maxPos=0;
	for(let i=0;i<lgrp.length;i++){
		var localDuree=tableObjet[lgrp[i]].duree/tableObjet[lgrp[i]].transposition;
		lgi= localDuree/ratioT;
		console.log("last",i,tableObjet[lgrp[i]].posX,tableObjet[lgrp[i]].posX+lgi,tableObjet[lgrp[i]].posX+lgi);
		if(tableObjet[lgrp[i]].posX+lgi>maxPos){
			lmax=tableObjet[lgrp[i]].posX;
			iref=i;
			maxDuree=localDuree;
			maxPos=tableObjet[lgrp[i]].posX+lgi;
		}
	}
	return param = {
			id:iref,
			maxDuree:maxDuree,
			maxPosX:maxPos};
}
function lastAudio() {
	var lmax=-1;
	var iref=0;
	var maxDuree=0;
	var lmin=65535;
	var ratioT=(720/12960);
	var lgi=0;
	var maxPos=0;
	for(let i=0;i<tableObjet.length;i++){
		var localDuree=(tableObjet[i].duree*(1/tableObjet[i].transposition));
		lgi= localDuree/ratioT;
		console.log("last",i,tableObjet[i].posX,tableObjet[i].posX+lgi,tableObjet[i].posX+lgi);
		if(tableObjet[i].posX+lgi>maxPos){
			lmax=tableObjet[i].posX;
			iref=i;
			maxDuree=localDuree;
			maxPos=tableObjet[i].posX+lgi;
		}
	}
	return param = {
			id:iref,
			maxDuree:maxDuree,
			maxPosX:maxPos};
}
function annulAudio(){
	document.getElementById("renderAudio").style.display="none";
}
function player() {
	if (playerStat==0) {
	 playerStat=1;
	
	 const filePath = document.getElementById("rubber").href.substring(6);
	 const startx = dureePlayer*parseFloat(document.getElementById("renderPos").value);
	 const options = {
	 pitchSemitones: 0,  // équivalent à -500 cents
	 speedFactor: 1,       // speed 2x
	 gain: 1,
	 startSec: startx,
	 lengthSec:dureePlayer-startx
	 };
	 console.log("player",filePath,"duree",dureePlayer,parseFloat(document.getElementById("renderPos").value),options);
	 document.getElementById("renderPlay").src="./images/png/pauseLect.png";
	 foo2();
	 window.api.playDirectFile(0, filePath, "pitch "+options.pitchSemitones+" speed "+options.speedFactor+" vol "+(options.gain*soxVolume)+" trim "+options.startSec+" "+options.lengthSec);
	 
	 }else{
	 	playerStat=0;
	 	document.getElementById("renderPlay").src="./images/png/lecture.png";
	 	document.getElementById("renderPos").value=0;
	 	if(timer){
			clearTimeout(timer);
		}
	 	window.api.send("toMain", 'killPlay');
	 }
}
function copySliceBuffer(source,len,offset) {
	const buffer1 = source;

	// Créez un AudioBuffer pour la destination (buffer2) avec une longueur plus grande
	var length2= tableBufferIR[tableObjet[objActif].convolver].length;
	console.log("length2",length2);
	const buffer2 = contextAudio.createBuffer(
 	 	buffer1.numberOfChannels, // Nombre de canaux
 	 	length2,                   // Longueur souhaitée pour buffer2 (en échantillons)
 	 	buffer1.sampleRate         // Taux d'échantillonnage
	);

	// Copiez les échantillons de chaque canal de buffer1 vers buffer2
	for (let channel = 0; channel < buffer1.numberOfChannels; channel++) {
	  const sourceChannelData = buffer1.getChannelData(channel);
	  const destinationChannelData = buffer2.getChannelData(channel);
	
	  // Utilisez Float32Array.set pour copier les échantillons, avec ajustement de longueur
	  destinationChannelData.set(sourceChannelData.slice(offset, length2));
	}	
	return buffer2;	
}

// audio.js (Renderer)

// Convertir un ArrayBuffer en AudioBuffer côté Renderer
function arrayBufferToAudioBuffer(audioContext, buf, numChannels, numSamples, sampleRate) {
    const audioBuffer = audioContext.createBuffer(numChannels, numSamples, sampleRate);
    for (let ch = 0; ch < numChannels; ch++) {
        const floatArray = new Float32Array(buf[ch], 0, numSamples);
        audioBuffer.copyToChannel(floatArray, ch, 0);
    }
    return audioBuffer;
}


async function rdDirName(path) {
	const appPaths = await window.api.getPaths();
	let dir="";
	if(appPaths.os=="win32"){
		const ndir=path.split("\\");
		for(i=0;i<ndir.length-1;i++){
			dir=dir+ndir[i]+"\\";
		}
	}else{
		const ndir=path.split("/");
		for(i=0;i<ndir.length-1;i++){
			dir=dir+ndir[i]+"/";
		}
	}
	dir=dir.substring(0, dir.length - 1);
	return dir;
}
async function rdBaseName(path) {
	const appPaths = await window.api.getPaths();
	let baseName="";
	if(appPaths.os=="win32"){
		const ndir=path.split("\\");
		baseName=ndir[ndir.length-1];
	}else{
		const ndir=path.split("/");
		baseName=ndir[ndir.length-1];
	}
	return baseName;
}

function readGrpAudio(){
	var ratioT=(720/12960);
	var posX;
	var bar;
	var startX;
	var curTime = contextAudio.currentTime;
	tableSrc=[];
	var gainNode=[];
	var panner=[];
	var convolver=[];
	var ndeb=[];
	var nfin=[];
	var grp=[];

	if(grpSelect==1){
		var minx=tableObjet[preservSelect[0]].posX;
		for(let i=0;i<preservSelect.length;i++){
			if(tableObjet[preservSelect[i]].posX<minx){
				minx=tableObjet[preservSelect[i]].posX;
			}
		}
		var maxx=tableObjet[preservSelect[preservSelect.length-1]].posX;
		for(let i=0;i<preservSelect.length;i++){
			if(tableObjet[preservSelect[i]].posX>maxx){
				maxx=tableObjet[preservSelect[i]].posX;
			}
		}
		for(let i=0;i<tableObjet.length;i++){
			if(tableObjet[i].posX>=minx && tableObjet[i].posX<=maxx){
				if(tableObjet[i].etat==1 && tableObjet[i].class==1  && tableObjet[i].file && tableObjet[i].mute==0){
					grp.push(i);
				}
			}	
		}
		console.log("minmax",tableObjet[preservSelect[0]].posX,minx,maxx,grp);
	}else if(tableObjet[objActif].class==2 || tableObjet[objActif].class==4){
		var minx=tableObjet[tableObjet[objActif].liste[0]].posX;
		
		for(let i=0;i<tableObjet[objActif].liste.length;i++){
			if(tableObjet[tableObjet[objActif].liste[i]].posX<minx){
				minx=tableObjet[preservSelect[i]].posX;
			}
		}
		var maxx=tableObjet[tableObjet[objActif].liste[tableObjet[objActif].liste.length-1]].posX;
		for(let i=0;i<tableObjet[objActif].liste.length;i++){
			if(tableObjet[tableObjet[objActif].liste[i]].posX>maxx){
				maxx=tableObjet[preservSelect[i]].posX;
			}
		}
		for(let i=0;i<tableObjet.length;i++){
			if(tableObjet[i].posX>=minx && tableObjet[i].posX<=maxx){
				if(tableObjet[i].etat==1 && tableObjet[i].class==1 && tableObjet[i].file && tableObjet[i].mute==0){
					grp.push(i);
				}
			}
		}
		console.log("minmax",tableObjet[preservSelect[0]].posX,minx,maxx,grp);
	}
	
	var minpos=tableObjet[grp[0]].posX;
	var idpos=0;
	for(let i=0;i<grp.length;i++){
		if(tableObjet[grp[i]].posX<minpos){
			minpos=tableObjet[grp[i]].posX;
			idpos=i;
		}
	}
	var tablePosX=[];
  	var deflastObj=lastAudioInGrp(grp);
  	
  	console.log("lastAudioInGrp",deflastObj.id);
  	var j=0;
	if(grp.length>0){
		document.getElementById("barVerticale").style.left=((tableObjet[grp[idpos]].posX-10)*zoomScale)+"px";
		posX=parseFloat(document.getElementById("barVerticale").style.left)/zoomScale;
		bar=(posX*ratioT);
		for(let i=0;i<grp.length;i++){
			if(tableObjet[grp[i]].posX*zoomScale>posX){
				console.log("id",i,tableObjet[grp[i]].bufferId);
				
				var source2=contextAudio.createBufferSource();
				if(tableObjet[grp[i]].convolver!="" && tableBufferIR[tableObjet[grp[i]].convolver].duration>tableBuffer[tableObjet[grp[i]].bufferId].buffer.duration*tableObjet[grp[i]].fin){					
						source2.buffer=copySliceBuffer(tableBuffer[tableObjet[grp[i]].bufferId].buffer,tableBufferIR[tableObjet[grp[i]].convolver].length,0);
				}else{
						source2.buffer =tableBuffer[tableObjet[grp[i]].bufferId].buffer;
				}
				
				tableSrc[j]=contextAudio.createBufferSource();
				if(tableObjet[grp[i]].reverse==true){
					var buf1= new Float32Array();
					var buf2= new Float32Array();
					buf1=source2.buffer.getChannelData(0);
     				buf2=source2.buffer.getChannelData(1);
     				var myArrayBuffer = contextAudio.createBuffer(2, source2.buffer.duration*contextAudio.sampleRate, contextAudio.sampleRate);
     				myArrayBuffer.copyToChannel(buf1.toReversed(), 0, 0);
     				myArrayBuffer.copyToChannel(buf2.toReversed(), 1, 0);
     				tableSrc[j].buffer=myArrayBuffer;
     			}else{
     				tableSrc[j]=source2;
     			}
     			

				gainNode[j] = contextAudio.createGain();
				panner[j] = contextAudio.createPanner();
				convolver[j] = contextAudio.createConvolver();
				now=curTime+((tableObjet[i].posX*ratioT)-bar);
				var rt=readSourceAudio(contextAudio,tableSrc[j],grp[i],gainNode[j],now,panner[j],convolver[j]);	
				tableSrc[j]=rt.src;
				defPeak(j,rt.src,tableObjet[grp[i]].gain);
				ndeb[j]=rt.ndeb;
				nfin[j]=rt.nfin;
				tablePosX.push(tableObjet[grp[i]].posX);
				j++;
			}
		}		
		tableSrc[deflastObj.id].onended = () => {
			  			sourceStat=0;
			  			console.log("source end");
			  				clearTimeout(timer);
	  						playerStat=0;

					};
  		playerStat=1;
  		defTime("barVerticale");
  		foo();
  		console.log("nbsources",tableSrc.length);	
		for(let i=0;i<tableSrc.length;i++){
			if(tableSrc[i] && tablePosX[i]>posX){
				startX=(tablePosX[i])*ratioT;
				console.log("source",i);
				tableSrc[i].start(contextAudio.currentTime+(startX-bar),ndeb[i],nfin[i]);
				playerStat=1;
			}
		}	
		
	}
}
let peak=[];

function saveRenduAudio(duree,file){
dureePlayer = duree;
playerStat=0;
console.log("duree",duree,file);
	var a;
	document.getElementById("renderAudio").style.display="block";
	if(document.getElementById("rubber")){
		a=document.getElementById("rubber");
	}else{
	a = document.createElement('a');
	document.getElementById("renderAudioBlock").appendChild(a);
	a.id="rubber";
	}
  //const fileName = file.split(/[\\/]/).pop(); 
  a.href = file;//URL.createObjectURL(rwav);
  a.download = file;
  a.textContent = 'Sauvegarder le fichier audio';
  a.style.display = 'inline-block';
  a.style.margin = '10px';
  a.style.padding = '2px 12px';
  a.style.background = '#0078d7';
  a.style.color = 'white';
  a.style.borderRadius = '6px';
  a.style.textDecoration = 'none';
}

async function renderObjAudio(){
	var lsgrp=[];
	lsgrp.push(objActif);
	const rt= await window.api.renderGroupWidthSoX(lsgrp,JSON.stringify(tableObjet),tableObjet[objActif].posX);
	console.log("retour",rt.duration,rt.output);
	 
	saveRenduAudio(rt.duration,rt.output);
	
}

function renderGrpAudio3(ngrp){
	var tempoMap=[];
	if(ngrp && ngrp.length>0){
		grp=[].concat(ngrp);
	}else{
		if(grpSelect==1){
			grp=[].concat(preservSelect);
			document.getElementById("barVerticale").style.left=document.getElementById("grpSelect").style.left;
		}else if(tableObjet[objActif].class==2 || tableObjet[objActif].class==4 || tableObjet[objActif].class=="groupe"){
			grp=[].concat(tableObjet[objActif].liste);
			document.getElementById("barVerticale").style.left=tableObjet[objActif].posX+"px";
			}
	}
	lsgrp.sort(function (a, b) {
  return tableObjet[a].posX - tableObjet[b].posX;
});
	
	var indDebut=tempoFoo.find((element) => element.X>=tableObjet[lsgrp[0]].posX);
	var nfin=tableObjet[lsgrp[lsgrp.length-1]].posX+(tableObjet[lsgrp[lsgrp.length-1]].duree*18);
	var indFin=tempoFoo.find((element) => element.X>=nfin);
	let j=tempoPoints.findIndex((element) => element.X>=indDebut.X);
	var i=0;
	var base=tableObjet[lsgrp[0]].posX;
	console.log("base",base);
	document.getElementById("barVerticale").style.left=(tableObjet[lsgrp[0]].posX-8)+"px";
	(async () => {
		const rt= await window.api.renderGroupWidthSoX(lsgrp,JSON.stringify(tableObjet),base);
		console.log("retour",rt);
		saveRenduAudio(rt.duration,rt.output);
	})();
}
function renderIntervalleAudio(){
	var lsgrp=[];
	var tempoMap=[];
	var deb=(parseFloat(document.getElementById("barDebut").style.left)+36)/zoomScale;
	var fin=parseFloat(document.getElementById("barFin").style.left)/zoomScale;
	for(i=0;i<tableObjet.length;i++){
		if(tableObjet[i].etat==1  && tableObjet[i].type<23 && tableObjet[i].posX>deb && tableObjet[i].posX<fin){
			if (tableObjet[i].file!=="" && tableObjet[i].file!==undefined) {
				lsgrp.push(i);
			}
		}
	}
	lsgrp.sort(function (a, b) {
  		return tableObjet[a].posX - tableObjet[b].posX;
	});
	console.log("debut",deb,"fin",fin,lsgrp);
	// window.api.send("toMain", "renderGroupSoX;"+lsgrp+";"+JSON.stringify(tableObjet)+";"+tableObjet[0].posX);
	(async () => {
		const rt= await window.api.renderGroupWidthSoX(lsgrp,JSON.stringify(tableObjet),deb);
		console.log("retour",rt.duration,rt.output);
		saveRenduAudio(rt.duration,rt.output);
	})();
}
async function renderPartAudio(mode){
	var lsgrp=[];
	var lstate=[];
	var startx=parseFloat(document.getElementById("barVerticale").style.left)/zoomScale;
	for(i=0;i<tableObjet.length;i++){
		if(tableObjet[i].etat==1){
			if (tableObjet[i].file!=="" && tableObjet[i].file!==undefined) {
				if (tableObjet[i].class==1 && tableObjet[i].type<23 && tableObjet[i].posX>startx) {
					lsgrp.push(i);
					lstate.push(0);
				}
			}
		}
	}
	console.log(lsgrp);
	const rt= await window.api.renderGroupWidthSoX(lsgrp,JSON.stringify(tableObjet),startx);
	console.log("retour",rt);
	var start=startx/18;
	var end=rt.duration-start;
	console.log("read start",start,rt.duration,end,rt.output);
	saveRenduAudio(rt.duration+start,rt.output);
}

function defSourceEnveloppe(id, nduree, gainNode, dtime) {

    const typevar = tableObjet[id].envType;
    const ngain = tableObjet[id].gain;
    const envX = tableObjet[id].envX;
    const envY = tableObjet[id].envY;

    if (typevar === 3) {
        // ----- CURVE -----
        const waveArray = new Float32Array(7);
        for (let i = 0; i < 7; i++) {
            waveArray[i] = ngain * parseFloat(envY[i]);
        }

        // 3e paramètre = durée, pas endTime !
        gainNode.gain.setValueCurveAtTime(waveArray, dtime, nduree);

    } else {

        // point 0
        gainNode.gain.setValueAtTime(ngain * parseFloat(envY[0]), dtime);

        for (let i = 1; i < 7; i++) {

            const t = nduree * parseFloat(envX[i]);
            let v = ngain * parseFloat(envY[i]);

            switch (typevar) {

                case 1: // ----- LINEAR -----
                    gainNode.gain.linearRampToValueAtTime(v, dtime + t);
                    break;

                case 2: // ----- EXPONENTIAL -----
                    // valeurs > 0 obligatoires
                    v = Math.max(v, 1e-6);
                    gainNode.gain.exponentialRampToValueAtTime(v, dtime + t);
                    break;
            }
        }
    }

    return gainNode;
}


// ======================================================================

function reverseMultiBuffersFloat32(srcBuffers) {
    const out = new Array(srcBuffers.length);

    for (let i = 0; i < srcBuffers.length; i++) {
        const ch = srcBuffers[i];
        const rev = new Float32Array(ch.length);

        // copie inversée
        for (let j = 0, k = ch.length - 1; j < ch.length; j++, k--) {
            rev[j] = ch[k];
        }

        out[i] = rev;
    }
    return out;
}
async function convolveMultiBuffers(rt, irBuffer) {
    const numChannels = rt.numChannels;
    const numSamples  = rt.numSamples;
    const sampleRate  = rt.sampleRate;

    console.log("convolveMultiBuffers →", { numChannels, numSamples, sampleRate });

    // Convertir IR en AudioBuffer mono si besoin
    let irAudioBuffer;
    if (irBuffer instanceof AudioBuffer) {
        irAudioBuffer = irBuffer;
    } else if (irBuffer instanceof Float32Array) {
        const tmpCtx = new OfflineAudioContext(1, irBuffer.length, sampleRate);
        irAudioBuffer = tmpCtx.createBuffer(1, irBuffer.length, sampleRate);
        irAudioBuffer.copyToChannel(irBuffer, 0);
    } else {
        throw new Error("IR invalide");
    }

    // === Traitement canal-par-canal SANS MIXAGE ===
    const outputChannels = [];

    for (let ch = 0; ch < numChannels; ch++) {

        // Un OfflineAudioContext *par canal*
        const ctx = new OfflineAudioContext({
            numberOfChannels: 1,
            length: numSamples + irAudioBuffer.length,
            sampleRate : irAudioBuffer.sampleRate
        });

        const source = ctx.createBufferSource();
        const conv   = ctx.createConvolver();

        conv.buffer = irAudioBuffer;

        const buf = ctx.createBuffer(1, numSamples, sampleRate);
        buf.copyToChannel(rt.channels[ch], 0);
        source.buffer = buf;

        source.connect(conv);
        conv.connect(ctx.destination);

        source.start();

        const rendered = await ctx.startRendering();

        outputChannels[ch] = rendered.getChannelData(0).slice();
    }

    return {
        sampleRate,
        buffers: outputChannels
    };
}
async function createTempoMap(id){
	var tempoMap=[];
	var base=tableObjet[id].posX;
	var nfin=base+(tableObjet[id].duree*18);
	var indDebut=tempoFoo.find((element) => element.X>=base) || tempoFoo[tempoFoo.length-1];
	var indFin=tempoFoo.find((element) => element.X>=nfin) || tempoFoo[tempoFoo.length-1];
	if(!indDebut || !indFin){
		return [{x:0,y:1},{x:tableObjet[id].duree,y:1}];
	}
	let j=tempoPoints.findIndex((element) => element.X>=indDebut.X);
	if(j<0) j=0;
	var i=0;

	tempoMap[0]={x:0, y:indDebut.Y/60};
	console.log("tempoMap",indDebut,indFin,nfin,j);
	i++;
	while(j<tempoPoints.length && tempoPoints[j].X<indFin.X){
		console.log("tempoMap",j,indDebut.X,(tempoPoints[j].X-base)/18,(240-(parseFloat(tempoPoints[j].Y)/0.4167)));
		if(tempoPoints[j].X>indDebut.X){
			tempoMap[i]={
				x:(parseFloat(tempoPoints[j].X)-base)/18,
				y:(240-(parseFloat(tempoPoints[j].Y)/0.4167))/60
			};
			i++;
		}
		j++;
	}
	tempoMap[i]={x:(parseFloat(indFin.X)-base)/18, y:indFin.Y/60};

	console.log("tempoMap",tempoPoints,tempoMap,indDebut,indFin);
	return tempoMap;
}
// ======================================================================
async function prepareAudio(id, currentChannels, sampleRate, options) {
    const { pitchSemitones, speedFactor, gain, startSec, lengthSec } = options;

    const numChannels = currentChannels.length;
    const totalLength = Math.max(...currentChannels.map(ch => ch.length));

    // ----- TRIM -----
    const startSample = Math.floor(startSec * sampleRate);
    const endSample = Math.min(Math.floor((startSec + lengthSec) * sampleRate), totalLength);
    const trimmedLength = endSample - startSample;

    // ----- NOUVELLE DURÉE APRÈS SPEED -----
    const renderedLength = Math.floor(trimmedLength / speedFactor);

    // ----- CONTEXTE OFFLINE AVEC LA BONNE DURÉE -----
    const offlineCtx = new OfflineAudioContext(numChannels, renderedLength, sampleRate);

    // ----- AudioBuffer avec la portion originale -----
    const buffer = offlineCtx.createBuffer(numChannels, trimmedLength, sampleRate);
    for (let ch = 0; ch < numChannels; ch++) {
        buffer.copyToChannel(currentChannels[ch].subarray(startSample, endSample), ch);
    }

    // ----- SOURCE -----
    const source = offlineCtx.createBufferSource();
    source.buffer = buffer;

    // Speed (change durée finale)
    console.log("source",source.playbackRate.value,source.detune.value);
    source.playbackRate.value = speedFactor;
    
    source.detune.value = pitchSemitones;
console.log("source",source.playbackRate.value,source.detune.value);
    // Gain
    const gainNode = offlineCtx.createGain();
    gainNode.gain.value = gain;

    if (typeof defSourceEnveloppe === "function") {
        defSourceEnveloppe(id, lengthSec, gainNode, 0);
    }

    source.connect(gainNode);
    gainNode.connect(offlineCtx.destination);

    source.start(0);

    // ----- RENDU -----
    const renderedBuffer = await offlineCtx.startRendering();

    // ----- EXTRACTION -----
    const processedChannels = [];
    for (let ch = 0; ch < numChannels; ch++) {
        processedChannels.push(new Float32Array(renderedBuffer.getChannelData(ch)));
    }

    return {
    	newlength:renderedLength,
    	buffers:processedChannels
    };
}
function extractEnvelopeForObject(gainPoints, objStartX, objDurationX) {
	 function lerp(a, b, t) {
        return a + (b - a) * t;
    }
    const objEndX = objStartX + objDurationX;
    let result = [];

    // Parcours des segments successifs
    for (let i = 0; i < gainPoints.length - 1; i++) {

        const p1 = gainPoints[i];
        const p2 = gainPoints[i + 1];

        // Segment hors zone → skip
        if (p2.X < objStartX || p1.X > objEndX) 
            continue;

        // Interpolation du point d'entrée (si le segment croise objStartX)
        if (p1.X <= objStartX && p2.X >= objStartX) {
            let t = (objStartX - p1.X) / (p2.X - p1.X);
            result.push({
                X: objStartX,
                Y: lerp(p1.Y, p2.Y, t)
            });
        }

        // Points internes
        if (p1.X >= objStartX && p1.X <= objEndX) {
            result.push({...p1});
        }
    }

    // Interpolation du point de sortie
    for (let i = 0; i < gainPoints.length - 1; i++) {

        const p1 = gainPoints[i];
        const p2 = gainPoints[i + 1];

        if (p1.X <= objEndX && p2.X >= objEndX) {
            let t = (objEndX - p1.X) / (p2.X - p1.X);

            result.push({
                X: objEndX,
                Y: lerp(p1.Y, p2.Y, t)
            });
            break;
        }
    }

    return result;
}
function convertToLocalEnvelope(extracted, objAudioDurationSec) {

    const startX = extracted[0].X;
    const endX = extracted[extracted.length - 1].X;
    const lenX = endX - startX;

    return extracted.map(p => ({
        t: ((p.X - startX) / lenX) * objAudioDurationSec,
        v: (100 - p.Y) * 0.05
    }));
}
function applyEnvelopeToGainNode(gainNode, localEnv) {

    gainNode.gain.cancelScheduledValues(0);

    // Premier point = valeur instantanée
    gainNode.gain.setValueAtTime(localEnv[0].v, 0);

    // Ramps pour les autres points
    for (let i = 1; i < localEnv.length; i++) {
        gainNode.gain.linearRampToValueAtTime(localEnv[i].v, localEnv[i].t);
    }
}


async function readSimpleAudioA(id,mode) {
    const obj = tableObjet[id];
    console.time();
    if (!obj || !obj.file) throw new Error("Objet ou fichier introuvable");
	 document.getElementById("loading").style.display="block";
    const filePath =window.api.joinPath(toAbsPath(paramProjet.audioPath),obj.file);
    const dir = await rdDirName(filePath);
    let baseName = await rdBaseName(filePath);
    baseName=baseName.split(".")[0];
    console.log('baseName',dir,baseName);

    const outPath = window.api.joinPath(toAbsPath(paramProjet.audioPath),"tmp",`${obj.id}-fx.wav`);

    console.log("[pipeline] readSimpleAudioA start", { filePath, outPath });

    // ----- LOAD BUFFERS (via preload, déjà Float32Array) -----
    const rt = await window.api.loadBuffers(filePath);
    if (!rt || !Array.isArray(rt.channels) || rt.channels.length === 0) {
        throw new Error("loadBuffers: aucun canal renvoyé par preload");
    }
    const numChannels = rt.numChannels;
    let numSamples = rt.numSamples;
    const sampleRate = rt.sampleRate;
	 console.log("length",numSamples);
    // Clone des buffers pour traitement
    let currentChannels = rt.channels.map(chAb => new Float32Array(chAb));
    var nbrms=0;
    for(let i=0;i<numChannels;i++){
    	nbrms=nbrms+rmsToDb(currentChannels[i],tableObjet[id].gain);
    }
	 tableObjet[id].rmsdb=nbrms/numChannels;
    // ----- REVERSE -----
    if (obj.reverse) {
        currentChannels = await reverseMultiBuffersFloat32(currentChannels);
    }

    // ----- CONVOLUTION IR -----
    if (obj.convolver && tableBufferIR[obj.convolver]) {
        const convResult = await convolveMultiBuffers(rt, tableBufferIR[obj.convolver]);
        currentChannels = convResult.buffers.map(b => new Float32Array(b));
    }
    
	    const options = {
	    pitchSemitones: obj.detune/100,  // équivalent à -500 cents
	    speedFactor: obj.transposition,       // speed 2x
	    gain: obj.gain,
	    startSec: obj.debut,
	    lengthSec: (obj.duree*obj.fin)-(obj.duree*obj.debut)
		 };
		 console.log("options",options);
		
    // ----- Sauvegarde finale ----- 
    //
    const startSample = Math.floor(options.startSec * sampleRate);
    const endSample = Math.min(Math.floor((options.startSec + options.lengthSec) * sampleRate), numSamples);
    const trimmedLength = endSample - startSample;

    // ----- NOUVELLE DURÉE APRÈS SPEED -----
    const renderedLength = Math.floor(trimmedLength / options.speedFactor);
    console.log("nbsamples",renderedLength);
    numSamples =  renderedLength;
    
	    
	
	 currentChannels = await applyFxBuffers(obj,numChannels,currentChannels,numSamples,sampleRate); 
	 const monoBuffer = await mixToMono(currentChannels);
	 
	  
	 
	 if(tempoPoints.length>=2){
	 	 await window.api.saveAudioBuffer({
        filePath: window.api.joinPath(`${baseDatatPath}`,"renduin.wav"),
        buffer: { sampleRate, channels: [monoBuffer] }
   	 });
		 const tempoMap = await createTempoMap(id);
		 const info = {
		 	id:id,
		 	mode:mode,
	      sampleRate:sampleRate,
	      channels: 1,
	      length: numSamples,
	      duration: numSamples*sampleRate,
	      tempoMap,
	    };
	  console.log("[pipeline] saved →rubber");
    window.api.send("toMain", "processAudio;" + JSON.stringify(info));
	 }else{
	 	await window.api.saveAudioBuffer({
        filePath: window.api.joinPath(`${baseDatatPath}`,"renduout.wav"),
        buffer: { sampleRate, channels: [monoBuffer] }
   	 });
   	 await postRubberband(id,mode,window.api.joinPath(`${baseDatatPath}`,"renduout.wav"));
   	 console.log("[pipeline] saved → no rubber");
	 }
    
    return true;
}
async function endTrim(renderedBuffer, nsecondes) {
    const sampleRate = renderedBuffer.sampleRate;
    const full = renderedBuffer.getChannelData(0);

    // Nombre d'échantillons à retirer
    const removeSamples = Math.floor(nsecondes * sampleRate);

    // Longueur finale minimale = 1 (sinon AudioBuffer plante)
    const finalLength = Math.max(1, full.length - removeSamples);

    // Créer le buffer tronqué
    const trimmed = new Float32Array(finalLength);
    trimmed.set(full.subarray(0, finalLength));

    return trimmed;
}
async function applyFxBuffers(obj,numChannels,currentChannels,numSamples,sampleRate) {
	
	console.log("listeFx",obj,obj.tableFx);
    // ----- WAM / GREFFONS -----
    const fxSlots = obj.tableFx || [];
    const validSlots = fxSlots.filter(k => k && listeFx && listeFx[k]);

    const blockSize = 1024;

    // Import faustwasm once
    const appPaths = await window.api.getPaths();
    const faust=window.api.joinPath(window.api.resources,"@grame","faustwasm","dist","esm","index.js");
    console.log("faust",appPaths.basedir,faust);
    const faustPkg = await import(`file://${faust}`);
    const { instantiateFaustModuleFromFile, LibFaust, FaustCompiler, FaustMonoDspGenerator } = faustPkg;
    const faustModule = await instantiateFaustModuleFromFile(window.api.joinPath(window.api.resources, '@grame', 'faustwasm', 'libfaust-wasm', 'libfaust-wasm.js'));
    const libFaust = new LibFaust(faustModule);
    const compiler = new FaustCompiler(libFaust);

    for (let slotIndex = 0; slotIndex < validSlots.length; slotIndex++) {
        const fxKey = validSlots[slotIndex];
        const fxDesc = listeFx[fxKey];
        const dspName = fxDesc.greffon;

        let processor = null;
        let paramsPaths = [];

        try {
            const generator = new FaustMonoDspGenerator();
            let dspSource = await window.api.readFxFile(`./greffons/${dspName}-wasm/${dspName}.dsp`);
            if (dspSource instanceof Uint8Array || dspSource instanceof ArrayBuffer) {
                dspSource = new TextDecoder().decode(dspSource);
            }

            await generator.compile(compiler, dspName, dspSource, "");
            processor = await generator.createOfflineProcessor(sampleRate, blockSize);

            // récupère les paramètres WAM
            const paramDest = processor.getParams();
            if (paramDest && paramDest.length > 0) {
                paramsPaths = paramDest.map(p => p.path || p);
            }
        } catch (err) {
            console.warn(`[pipeline] DSP compilation failed for slot ${slotIndex} → passthrough`, err);
            processor = null;
        }

        // ----- Parse automation -----
        const tableFxParam = obj.tableFxParam || [];
        const fxParamString = tableFxParam[slotIndex] || "";
        const paramBlocks = fxParamString.split("/").map(blockStr => {
            if (!blockStr) return [];
            return blockStr.split("&").map(seg => {
                const [t, v] = seg.split("?");
                return { time: parseFloat(t||0), value: parseFloat(v||0) };
            }).sort((a,b)=>a.time-b.time);
        });

        // ----- Traitement multi-canaux -----
        const processedChannels = new Array(numChannels);

        for (let ch = 0; ch < numChannels; ch++) {
            const inBuf = currentChannels[ch];
            const outBuf = new Float32Array(numSamples);

            for (let offset = 0; offset < numSamples; offset += blockSize) {
                const len = Math.min(blockSize, numSamples - offset);
                const t0 = offset / sampleRate;
                
                // --- Automation WAM ---
                for (let pIndex = 0; pIndex < paramsPaths.length; pIndex++) {
                    const path = paramsPaths[pIndex];
                    const events = paramBlocks[pIndex] || [];
                    if (!events.length) continue;

                    let val = events[0].value;
                    if (t0 <= events[0].time) val = events[0].value;
                    else if (t0 >= events[events.length-1].time) val = events[events.length-1].value;
                    else {
                        for (let i = 0; i < events.length-1; i++) {
                            const a = events[i], b = events[i+1];
                            if (t0 >= a.time && t0 < b.time) {
                                const frac = (t0 - a.time)/(b.time - a.time);
                                val = a.value + frac*(b.value - a.value);
                                break;
                            }
                        }
                    }
                    try { processor.setParamValue(path, val); } catch(e){}
                }

                // --- Process block ---
                const sliceIn = inBuf.subarray(offset, offset+len);
                let blockOut = sliceIn;
                if (processor) {
                    const tmp = processor.render([sliceIn], len);
                    blockOut = Array.isArray(tmp)?tmp[0]:tmp;
                }
                outBuf.set(blockOut, offset);
            }
            processedChannels[ch] = outBuf;
        }

        // mise à jour pour le slot suivant
        currentChannels = processedChannels.map(c => new Float32Array(c));
    }
    return currentChannels;
}

async function loadLayoutJSON(layoutName) {
	console.log("layoutName",layoutName);
  const appPaths = await window.api.getPaths();
		  const buf = await window.api.readFile(window.api.joinPath(window.api.resources, 'Dsp', layoutName + '.json'));
		  console.log("layoutPath",`${appPaths}/resources/Dsp/${layoutName}.json`);
    	  const txt = new TextDecoder("utf-8").decode(buf);
    	  return JSON.parse(txt);  
}
function interpolate(times, values, t, type = "linear") {
    if (!times || !times.length) return values && values[0] || 0;
    if (!values || !values.length) return 0;
    if (t <= times[0]) return values[0];
    if (t >= times[times.length - 1]) return values[values.length - 1];

    // trouve l'intervalle
    let lo = 0, hi = times.length - 1;
    while (hi - lo > 1) {
        const m = (lo + hi) >> 1;
        if (times[m] <= t) lo = m; else hi = m;
    }

    const t0 = times[lo], t1 = times[hi];
    const v0 = values[lo] !== undefined ? values[lo] : values[0];
    const v1 = values[hi] !== undefined ? values[hi] : v0;
    const mu = (t - t0) / (t1 - t0 || 1);

    switch (type.toLowerCase()) {
        case "linear":
            return v0 * (1 - mu) + v1 * mu;

        case "exp":
            // évite zéro ou négatif
            const v0e = v0 <= 0 ? 0.0001 : v0;
            const v1e = v1 <= 0 ? 0.0001 : v1;
            return v0e * Math.pow(v1e / v0e, mu);

        case "spline":
        case "catmull-rom":
            const p0 = lo > 0 ? values[lo - 1] : v0;
            const p1 = v0;
            const p2 = v1;
            const p3 = hi + 1 < values.length ? values[hi + 1] : v1;
            const mu2 = mu * mu, mu3 = mu2 * mu;
            return 0.5 * (
                (2 * p1) +
                (-p0 + p2) * mu +
                (2*p0 - 5*p1 + 4*p2 - p3) * mu2 +
                (-p0 + 3*p1 - 3*p2 + p3) * mu3
            );

        default:
            return v0 * (1 - mu) + v1 * mu;
    }
}
function mixToMono(channels) {
    if (channels.length === 0) return null;

    const length = channels[0].length;
    const out = new Float32Array(length);

    for (let i = 0; i < length; i++) {
        let sum = 0;

        for (let c = 0; c < channels.length; c++) {
            sum += channels[c][i];
        }

        out[i] = sum / channels.length; // moyenne → évite clipping
    }

    return out;
}
async function createLayout(layout, numChannels, mode = "vbap3d", order = 3) {
    console.log("[compile] START", layout, "mode:", mode);
    // ===== LOAD LAYOUT =====
    const layoutJSON = await loadLayoutJSON(layout, numChannels);
    const NP = layoutJSON.speakers.length;

    // ===== INIT FAUST =====
    const appPaths = await window.api.getPaths();
    const faustIdx = window.api.joinPath(window.api.resources, '@grame', 'faustwasm', 'dist', 'esm', 'index.js');
    const { instantiateFaustModuleFromFile, LibFaust, FaustCompiler, FaustMonoDspGenerator } =
        await import(`file://${faustIdx}`);
    const faustModule = await instantiateFaustModuleFromFile(
        window.api.joinPath(window.api.resources, '@grame', 'faustwasm', 'libfaust-wasm', 'libfaust-wasm.js')
    );
    const libFaust = new LibFaust(faustModule);
    const compiler = new FaustCompiler(libFaust);

    if (mode === "hoa") {
        // === HOA : encodeur + décodeur séparés ===
        const N = parseInt(order) || 3;
        const nHoa = (N + 1) * (N + 1);

        const encGen = new FaustMonoDspGenerator();
        const encSrc = generateHoaEncoderDSP(N);
        await encGen.compile(compiler, "hoaenc", encSrc, "");

        const decGen = new FaustMonoDspGenerator();
        const decSrc = generateHoaDecoderDSP(layoutJSON, N);
        await decGen.compile(compiler, "hoadec", decSrc, "");

        return { mode: "hoa", encGenerator: encGen, decGenerator: decGen, P: NP, nHoa, order: N };
    } else {
        // === VBAP 3D (comportement existant) ===
        const dspSource = generateSpatDSP(layoutJSON, numChannels);
        const generator = new FaustMonoDspGenerator();
        await generator.compile(compiler, "spat", dspSource, "");
        return { mode: "vbap3d", generator, P: NP };
    }
}
async function spatialiseBuffer(id, outPath, numChannels, numSamples, sampleRate, currentChannels, interpType = "linear") {
    if (window.wamSpat && window.wamSpat.mode === "hoa") {
        return spatialiseBufferHoa(id, outPath, numChannels, numSamples, sampleRate, currentChannels, interpType);
    }
    console.log("[spatialiseObjet] START VBAP", id);

    // Si wamSpat absent, attend la compilation initiale (lancée dans importConfigProjet)
    // sans en démarrer une seconde, pour éviter la double compilation qui cause la coupure.
    if (!window.wamSpat) {
        if (window.wamSpatPromise) {
            console.warn("[spatialiseBuffer] wamSpat pas encore prêt, attente...");
            window.wamSpat = await window.wamSpatPromise;
        } else {
            window.wamSpatPromise = createLayout(spat3D, 1, spatMode, hoaOrder)
                .then(r => { window.wamSpat = r; return r; })
                .catch(e => { console.error("createLayout fallback:", e); return null; });
            window.wamSpat = await window.wamSpatPromise;
        }
        if (!window.wamSpat) { console.error("[spatialiseBuffer] wamSpat toujours absent"); return; }
    }

    const obj = tableObjet[id];
    // ===== OFFLINE PROCESSOR =====
    const blockSize = 64;
    const processor = await window.wamSpat.generator.createOfflineProcessor(sampleRate, blockSize);
	
    // ===== READ AVAILABLE PARAMS =====
    const faustParams = processor.getParams();
    function findParamFor(prefix) {
        const reIndexed = new RegExp(`^/?${prefix}\\d+`, "i");
        return faustParams.find(p => reIndexed.test(p)) || faustParams.find(p => p.toLowerCase().includes(prefix.toLowerCase())) || null;
    }
    const paramX = findParamFor("X");
    const paramY = findParamFor("Y");
    const paramZ = findParamFor("Z");
    const paramD = faustParams.find(p => /dt|dist|cdistance|distance/i.test(p)) || null;

    // ===== PREPARE AUTOMATION ARRAYS =====
    const spX = Array.isArray(obj.spX) ? obj.spX.slice() : [];
    const spY = Array.isArray(obj.spY) ? obj.spY.slice() : [];
    const spZ = Array.isArray(obj.spZ) ? obj.spZ.slice() : [];
    const spD = Array.isArray(obj.spD) ? obj.spD.slice() : [];
    const spT = Array.isArray(obj.spT) ? obj.spT.slice() : [];

    // fallback timeline si absent
    if (!spT.length) {
        const n = Math.max(spX.length, spY.length, spZ.length, spD.length, 1);
        for (let i = 0; i < n; i++) spT[i] = i / (n - 1 || 1);
        console.warn("[spatialiseObjet] spT absent -> synthetic timeline created", spT);
    }

    // convert spT ratio -> secondes
    const durationSec = numSamples / sampleRate;
    const spTimesSec = spT.map(ratio => ratio * durationSec);
    
    // ===== PROCESS AUDIO =====
    const P = window.wamSpat.P;//layoutJSON.speakers.length; window.wamSpat.generator.P;
    let processedChannels = Array.from({ length: P }, () => new Float32Array(numSamples));

    for (let offset = 0; offset < numSamples; offset += blockSize) {
	    const len = Math.min(blockSize, numSamples - offset);
	
	    // --- INPUT BLOCK ---
	    // Mono = 1 seul canal
	    // Multi = N canaux
	    // Nombre de canaux d'entrée (1 si mono)
		 const C = currentChannels.length;
	    const inputBlock = [];
	    for (let ch = 0; ch < C; ch++) {
	        inputBlock[ch] = currentChannels[ch].subarray(offset, offset + len);
	    }
	
	    // --- PARAMS PAR ÉCHANTILLON ---
	    for (let i = 0; i < len; i++) {
	        const t = (offset + i) / sampleRate;
	
	        if (paramX) processor.setParamValue(paramX, interpolate(spTimesSec, spX, t, interpType));
	        if (paramY) processor.setParamValue(paramY, interpolate(spTimesSec, spY, t, interpType));
	        if (paramZ) processor.setParamValue(paramZ, interpolate(spTimesSec, spZ, t, interpType));
	        if (paramD) processor.setParamValue(paramD, interpolate(spTimesSec, spD, t, interpType));
	    }
	
	    // --- TRAITEMENT DSP ---
	    const outputBlock = processor.render(inputBlock, len);
	
	    // --- COPIE OUTPUT ---
	    for (let ch = 0; ch < P; ch++) {
	        processedChannels[ch].set(outputBlock[ch], offset);
	    }
	}
    // ===== SAVE RESULT =====
     document.getElementById("loading").style.display="none";
    await window.api.saveAudioBuffer({ filePath: outPath, buffer: { sampleRate, channels: processedChannels } });
    console.log("[spatialiseObjet] Fichier spatialisé écrit:", outPath);

    return outPath;
}

// ══════════════════════════════════════════════════════════
//  HOA pipeline : encodeur → décodeur → P canaux enceintes
//  (ou encodeur seul si exportAmbiX===true → B-format brut)
// ══════════════════════════════════════════════════════════
async function spatialiseBufferHoa(id, outPath, numChannels, numSamples, sampleRate, currentChannels, interpType = "linear") {
    console.log("[spatialiseHOA] START", id);
    if (!window.wamSpat && window.wamSpatPromise) {
        window.wamSpat = await window.wamSpatPromise;
    }
    if (!window.wamSpat) { console.error("[spatialiseHOA] wamSpat absent"); return; }
    const obj = tableObjet[id];
    const blockSize = 64;
    const { encGenerator, decGenerator, P, nHoa } = window.wamSpat;

    // ===== OFFLINE PROCESSORS =====
    const encProc = await encGenerator.createOfflineProcessor(sampleRate, blockSize);
    const encParams = encProc.getParams();
    const paramX = encParams.find(p => /^\/X$/i.test(p)) || encParams.find(p => /\bX\b/i.test(p));
    const paramY = encParams.find(p => /^\/Y$/i.test(p)) || encParams.find(p => /\bY\b/i.test(p));
    const paramZ = encParams.find(p => /^\/Z$/i.test(p)) || encParams.find(p => /\bZ\b/i.test(p));
    const paramG = encParams.find(p => /gain/i.test(p));

    // ===== AUTOMATION =====
    const spX = Array.isArray(obj.spX) ? obj.spX.slice() : [];
    const spY = Array.isArray(obj.spY) ? obj.spY.slice() : [];
    const spZ = Array.isArray(obj.spZ) ? obj.spZ.slice() : [];
    const spT = Array.isArray(obj.spT) ? obj.spT.slice() : [];
    if (!spT.length) {
        const n = Math.max(spX.length, spY.length, spZ.length, 1);
        for (let i = 0; i < n; i++) spT[i] = i / (n - 1 || 1);
    }
    const durationSec = numSamples / sampleRate;
    const spTimesSec = spT.map(r => r * durationSec);

    // ===== DÉTERMINER SI EXPORT AmbiX (B-format brut) =====
    const isAmbiX = (typeof exportAmbiX !== "undefined") && exportAmbiX;
    const outChannels = isAmbiX ? nHoa : P;

    // Tampons de sortie intermédiaires
    const hoaBuf  = Array.from({ length: nHoa }, () => new Float32Array(numSamples));
    const outBuf  = isAmbiX ? hoaBuf : Array.from({ length: P }, () => new Float32Array(numSamples));

    // ===== PASSE 1 : ENCODAGE =====
    for (let offset = 0; offset < numSamples; offset += blockSize) {
        const len = Math.min(blockSize, numSamples - offset);
        const inputBlock = currentChannels.map(ch => ch.subarray(offset, offset + len));

        for (let i = 0; i < len; i++) {
            const t = (offset + i) / sampleRate;
            if (paramX) encProc.setParamValue(paramX, interpolate(spTimesSec, spX, t, interpType));
            if (paramY) encProc.setParamValue(paramY, interpolate(spTimesSec, spY, t, interpType));
            if (paramZ) encProc.setParamValue(paramZ, interpolate(spTimesSec, spZ, t, interpType));
        }
        const encOut = encProc.render(inputBlock, len);
        for (let ch = 0; ch < nHoa; ch++) hoaBuf[ch].set(encOut[ch], offset);
    }

    // ===== PASSE 2 : DÉCODAGE (si pas export AmbiX) =====
    if (!isAmbiX) {
        const decProc = await decGenerator.createOfflineProcessor(sampleRate, blockSize);
        for (let offset = 0; offset < numSamples; offset += blockSize) {
            const len = Math.min(blockSize, numSamples - offset);
            const decIn = hoaBuf.map(ch => ch.subarray(offset, offset + len));
            const decOut = decProc.render(decIn, len);
            for (let ch = 0; ch < P; ch++) outBuf[ch].set(decOut[ch], offset);
        }
    }

    // ===== SAVE =====
    document.getElementById("loading").style.display = "none";
    // Si AmbiX : modifier le chemin pour indiquer le format
    const finalPath = isAmbiX ? outPath.replace(/\.wav$/i, '_ambiX.wav') : outPath;
    await window.api.saveAudioBuffer({ filePath: finalPath, buffer: { sampleRate, channels: outBuf } });
    console.log("[spatialiseHOA] Fichier écrit:", finalPath, `(${isAmbiX ? "AmbiX "+nHoa+"ch" : "decoded "+P+"ch"})`);
    return finalPath;
}

async function spatialise(id,filePath,interpType="linear") {
	 const obj = tableObjet[id];
    const baseName = rdBaseName(filePath).split(".")[0];
    const outPath = `${rdDirName(filePath)}/tmp/${obj.id}-fx.wav`;

    // ===== LOAD AUDIO BUFFERS =====
    const rt = await window.api.loadBuffers(filePath);
    const numChannels = rt.numChannels;
    let numSamples = rt.numSamples;
    const sampleRate = rt.sampleRate;
    let currentChannels = rt.channels.map(ch => new Float32Array(ch));

    // ===== LOAD LAYOUT =====
    const layoutJSON = await loadLayoutJSON(spat3D);
    const dspSource = generateSpatDSP(layoutJSON, 6);

    // ===== INIT FAUST & COMPILE DSP =====
    const { instantiateFaustModuleFromFile, LibFaust, FaustCompiler, FaustMonoDspGenerator } =
        await import("./resources/@grame/faustwasm/dist/esm/index.js");

    const faustModule = await instantiateFaustModuleFromFile(
        "./resources/@grame/faustwasm/libfaust-wasm/libfaust-wasm.js"
    );

    const libFaust = new LibFaust(faustModule);
    const compiler = new FaustCompiler(libFaust);
    const generator = new FaustMonoDspGenerator();

    await generator.compile(compiler, "spat", dspSource, "");

    // ===== OFFLINE PROCESSOR =====
    const blockSize = 64; // plus réactif
    const processor = await generator.createOfflineProcessor(sampleRate, blockSize);

    // ===== READ AVAILABLE PARAMS =====
    const faustParams = processor.getParams();
    function findParamFor(prefix) {
        const reIndexed = new RegExp(`^/?${prefix}\\d+`, "i");
        return faustParams.find(p => reIndexed.test(p)) || faustParams.find(p => p.toLowerCase().includes(prefix.toLowerCase())) || null;
    }
    const paramX = findParamFor("X");
    const paramY = findParamFor("Y");
    const paramZ = findParamFor("Z");
    const paramD = faustParams.find(p => /dt|dist|cdistance|distance/i.test(p)) || null;

    // ===== PREPARE AUTOMATION ARRAYS =====
    const spX = Array.isArray(obj.spX) ? obj.spX.slice() : [];
    const spY = Array.isArray(obj.spY) ? obj.spY.slice() : [];
    const spZ = Array.isArray(obj.spZ) ? obj.spZ.slice() : [];
    const spD = Array.isArray(obj.spD) ? obj.spD.slice() : [];
    const spT = Array.isArray(obj.spT) ? obj.spT.slice() : [];

    // fallback timeline si absent
    if (!spT.length) {
        const n = Math.max(spX.length, spY.length, spZ.length, spD.length, 1);
        for (let i = 0; i < n; i++) spT[i] = i / (n - 1 || 1);
        console.warn("[spatialiseObjet] spT absent -> synthetic timeline created", spT);
    }

    // convert spT ratio -> secondes
    const durationSec = numSamples / sampleRate;
    const spTimesSec = spT.map(ratio => ratio * durationSec);
    
    // ===== PROCESS AUDIO =====
    const P = layoutJSON.speakers.length;
    let processedChannels = Array.from({ length: P }, () => new Float32Array(numSamples));

    for (let offset = 0; offset < numSamples; offset += blockSize) {
        const len = Math.min(blockSize, numSamples - offset);
        const inputBlock = currentChannels.map(ch => ch.subarray(offset, offset + len));

        // update params par échantillon
        for (let i = 0; i < len; i++) {
            const t = (offset + i) / sampleRate;
            if (paramX) processor.setParamValue(paramX, interpolate(spTimesSec, spX, t, interpType));
            if (paramY) processor.setParamValue(paramY, interpolate(spTimesSec, spY, t, interpType));
            if (paramZ) processor.setParamValue(paramZ, interpolate(spTimesSec, spZ, t, interpType));
            if (paramD) processor.setParamValue(paramD, interpolate(spTimesSec, spD, t, interpType));
        }

        const outputBlock = processor.render(inputBlock, len);

        for (let ch = 0; ch < P; ch++) {
            processedChannels[ch].set(outputBlock[ch], offset);
        }
    }

    // ===== SAVE RESULT =====
    await window.api.saveAudioBuffer({ filePath: outPath, buffer: { sampleRate, channels: processedChannels } });
    console.log("[spatialiseObjet] Fichier spatialisé écrit:", outPath);

    return outPath;
}

async function postRubberband(id,mode,file) {
	const buffer = await window.api.readFile(file);
  	// Décode les données en AudioBuffer via Web Audio API
  	const audioBuffer = await contextAudio.decodeAudioData(buffer);				
	console.log("audioBuffer",file,audioBuffer.length);
	const numChannels = audioBuffer.numberOfChannels;
   const numSamples = audioBuffer.length;
   const sampleRate =audioBuffer.sampleRate;
   
   const trimmed= await endTrim(audioBuffer,0);
	const trimmedLength = trimmed.length; 
   console.log("TRIMMED LENGTH =", trimmedLength);
   console.log("rendu",numChannels,numSamples,sampleRate);
	const offlineCtx = new OfflineAudioContext(1,trimmedLength,sampleRate );
	const song = offlineCtx.createBufferSource();
	const resultBuffer = offlineCtx.createBuffer(1, trimmedLength, sampleRate);
	resultBuffer.copyToChannel(trimmed, 0);  // copie dans le canal 0
	song.buffer = resultBuffer; 
	const gainNode = offlineCtx.createGain();
	console.log("gain",gainPoints);
	const extracted = extractEnvelopeForObject(
    gainPoints,
    tableObjet[id].posX,        // position de l'objet dans le X global
    song.buffer.duration * 18     // durée en X dans la partition
);
	const localEnv = convertToLocalEnvelope(
    extracted,
    song.buffer.duration   // durée de l'audio en secondes
);
	applyEnvelopeToGainNode(gainNode, localEnv);
	song.connect(gainNode);
	gainNode.connect(offlineCtx.destination);
	song.start(0);	
	const renderedBuffer = await offlineCtx.startRendering();
	
   console.log("renderedBuffer",id,renderedBuffer.length,renderedBuffer.numberOfChannels);
	const currentChannels = [new Float32Array(renderedBuffer.getChannelData(0))];
	const obj = tableObjet[id];
	const filePath=window.api.joinPath(toAbsPath(paramProjet.audioPath),obj.file);
    const dir = await rdDirName(filePath);
    let baseName = await rdBaseName(filePath);
    baseName = baseName.split(".")[0];
    let outPath = window.api.joinPath(`${dir}`,"tmp",`${obj.id}-fx.wav`);
    if (mode == 0) {
        // ===== MODE LECTURE : spatialisation VBAP ou HOA décodé =====
        const premixPath = window.api.joinPath(`${dir}`,"tmp",`${obj.id}-premix.wav`);
        await window.api.saveAudioBuffer({ filePath: premixPath, buffer: { sampleRate, channels: currentChannels } });
        await spatialiseBuffer(id, outPath, numChannels, trimmedLength, sampleRate, currentChannels, "linear");
        console.log("[pipeline] saved ->spatialised", outPath);

    } else if (mode == 2) {
        // ===== MODE HOA AmbiX : encodage HOA -> B-format, 1 fichier par objet =====
        const ambiXPath = window.api.joinPath(`${dir}`,'exports',`${obj.id}_ambiX.wav`);
        // spatialiseBufferHoa avec exportAmbiX=true sort le B-format brut
        const prevAmbiX = (typeof exportAmbiX !== "undefined") ? exportAmbiX : false;
        exportAmbiX = true;
        try {
            await spatialiseBufferHoa(id, ambiXPath, numChannels, trimmedLength, sampleRate, currentChannels, "linear");
        } finally {
            exportAmbiX = prevAmbiX;
        }
        console.log("[HOA export] fichier AmbiX:", ambiXPath);
        exportCompteur++;
        if (exportCompteur < exportTable.length) {
            document.getElementById("sliderLParam").style.width = (Math.floor((exportCompteur / exportTable.length) * 100)) + "%";
            await readSimpleAudioA(exportTable[exportCompteur], 2);
        } else {
            document.getElementById("sliderLParam").style.width = "100%";
            document.getElementById("popupLoader").style.display = "none";
        }

    } else {
        // ===== MODE EXPORT DAW (mode=1) : audio sec + SoX =====
        outPath = window.api.joinPath(`${dir}`,'exports',`${tableObjet[id].id}.wav`);
        await window.api.saveAudioBuffer({ filePath: outPath, buffer: { sampleRate, channels: currentChannels } });
        const exportObj = tableObjet[id];
        const durationAfterSpeed = ((exportObj.duree * exportObj.fin) - (exportObj.duree * exportObj.debut)) / exportObj.transposition;
        const envX0 = (exportObj.envX && exportObj.envX[0] !== undefined) ? exportObj.envX[0] : 0;
        const envX1 = (exportObj.envX && exportObj.envX[1] !== undefined) ? exportObj.envX[1] : 1;
        const exportFadeIn = exportObj.fadeIn || 0;
        const exportFade = `${exportFadeIn} ${durationAfterSpeed * envX0} ${durationAfterSpeed} ${durationAfterSpeed * (1 - envX1)}`;
        const exportLengthSec = ((exportObj.duree * exportObj.fin) - (exportObj.duree * exportObj.debut)) / exportObj.transposition;
        const exportSoxParams = `pitch ${exportObj.detune} speed ${exportObj.transposition} vol ${exportObj.gain} trim ${exportObj.debut} ${exportLengthSec} fade ${exportFade}`;
        console.log("[export SoX]", exportSoxParams);
        await window.api.soxProcessExport(outPath, exportSoxParams);
        document.getElementById("loading").style.display = "none";
        console.log("[export DAW] fichier:", outPath);
        exportCompteur++;
        if (exportCompteur < exportTable.length) {
            document.getElementById("sliderLParam").style.width = (Math.floor((exportCompteur / exportTable.length) * 100)) + "%";
            await readSimpleAudioA(exportTable[exportCompteur], 1);
        } else {
            document.getElementById("sliderLParam").style.width = "100%";
            document.getElementById("popupLoader").style.display = "none";
        }
    }
}

async function exportObjAudio(mode){
	const obj = tableObjet[objActif];
	if (!obj || !obj.file) return;
	var lsgrp=[];
	lsgrp.push(objActif);
	await readSimpleAudioA(objActif,1);
	if(mode==0){
		exportToSeq(lsgrp);
	}
}

let exportTable=[];
let exportCompteur=0;
async function exportIntv(){
	var lsgrp=[];
	var tempoMap=[];
	var deb=parseFloat(document.getElementById("barDebut").style.left)+36;
	var fin=parseFloat(document.getElementById("barFin").style.left);
	for(i=0;i<tableObjet.length;i++){
		if(tableObjet[i].etat==1 && tableObjet[i].posX>deb && tableObjet[i].posX<fin){
			if (tableObjet[i].file!=="" && tableObjet[i].file!==undefined) {
				if( tableObjet[i].type<23 ){
					lsgrp.push(i);
				}
			}
		}
	}
	lsgrp.sort(function (a, b) {
  		return tableObjet[a].posX - tableObjet[b].posX;
	});
	console.log("debut",deb,"fin",fin,lsgrp);
	if(lsgrp.length===0) return;
	exportTable=lsgrp;
	exportCompteur=0;
	await readSimpleAudioA(lsgrp[0],1);

	exportToSeq(lsgrp);
}
async function exportGrp(){
	var tempoMap=[];
	if(grpSelect==1){
		grp=[].concat(preservSelect);
		document.getElementById("barVerticale").style.left=document.getElementById("grpSelect").style.left;
	}else if(tableObjet[objActif].class==2 || tableObjet[objActif].class==4 || tableObjet[objActif].class=="groupe"){
		grp=[].concat(tableObjet[objActif].liste);
		document.getElementById("barVerticale").style.left=tableObjet[objActif].posX+"px";
	}
	var lsgrp=grp.filter(i => tableObjet[i] && tableObjet[i].file!=="" && tableObjet[i].file!==undefined && tableObjet[i].type<23);
	lsgrp.sort(function (a, b) {
   return tableObjet[a].posX - tableObjet[b].posX;
   });
	if(lsgrp.length===0) return;
	exportTable=lsgrp;
	exportCompteur=0;
	await readSimpleAudioA(lsgrp[0],1);
	exportToSeq(lsgrp);
}
async function exportPart(){
	var tempoMap=[];
	var lsgrp=[];
	for(i=0;i<tableObjet.length;i++){
		if(tableObjet[i].etat==1 && tableObjet[i].mute==0){
			if (tableObjet[i].file!=="" && tableObjet[i].file!==undefined) {
				if( tableObjet[i].type<23 ){
					lsgrp.push(i);
				}
			}
		}
	}
	lsgrp.sort(function (a, b) {
   return tableObjet[a].posX - tableObjet[b].posX;
   });
	if(lsgrp.length===0) return;
	exportTable=lsgrp;
	exportCompteur=0;
	document.getElementById("sliderLParam").style.width="0%";
	document.getElementById("popupLoader").style.display="block";
	await readSimpleAudioA(lsgrp[0],1);
	exportToSeq(lsgrp);
}
function exportToSeq(refGrp){
	var autoGain="";
	for(i=0;i<gainPoints.length;i++){
		autoGain=autoGain+((gainPoints[i].X/18).toFixed(2))+","+((100-gainPoints[i].Y)*0.05).toFixed(2)+";";
	}
	autoGain=autoGain.substring(0,autoGain.length-1);
	var txt=toAbsPath(audioDirectory)+"\n"+spat3D+"\n"+spat3DCanaux+"\n"+contextAudio.sampleRate+"\n"+autoGain+"\n";
	var nfilesave=[];
	var ratioT=(720/12960);
	var offsetPiste=1;
	var track=1;
	nfilesave=[].concat(refGrp);
	nfilesave.sort((a, b) => {
		const pd = tableObjet[a].piste - tableObjet[b].piste;
		return pd !== 0 ? pd : tableObjet[a].posX - tableObjet[b].posX;
	});
	console.log("exportToSeq",refGrp,nfilesave);
	for(let i in nfilesave){
		if(tableObjet[nfilesave[i]].etat==1 && tableObjet[nfilesave[i]].file && tableObjet[nfilesave[i]].class==1 && tableObjet[nfilesave[i]].type<24){
			if(refGrp.length>0){
				track=tableObjet[nfilesave[i]].piste+offsetPiste;
			}
			txt=txt+tableObjet[nfilesave[i]].nom+";"+(tableObjet[nfilesave[i]].objColor.substring(1)+"ff")+";"+tableObjet[nfilesave[i]].id+";"+(tableObjet[nfilesave[i]].piste+offsetPiste)+";"+Math.floor((tableObjet[nfilesave[i]].posX*ratioT)*48000);			
			txt=txt+";"+tableObjet[nfilesave[i]].spT+";"+tableObjet[nfilesave[i]].spX+";"+tableObjet[nfilesave[i]].spY+";"+tableObjet[nfilesave[i]].spZ+";"+tableObjet[nfilesave[i]].spD+"\n";   	
		 }
		
	}
   	window.api.send("toMain", "exportSelect;"+btoa(txt));
}

// ***********************************************************************************************************************
async function actualiseObjets(){
	var lsgrp=[];
	for(i=0;i<tableObjet.length;i++){
		if(tableObjet[i].etat==1 && tableObjet[i].mute==0){
			if (tableObjet[i].file!=="" && tableObjet[i].file!==undefined) {
				if( tableObjet[i].type<23 ){
					lsgrp.push(i);
				}
			}
		}
	}
   console.log(lsgrp);
	if(lsgrp.length===0) return;
	document.getElementById("sliderLParam").style.width="0%";
	document.getElementById("popupLoader").style.display="block";
	var nb=100/lsgrp.length;
	for (let i=0;i<lsgrp.length;i++){
		await readSimpleAudioA(lsgrp[i],0);
		document.getElementById("sliderLParam").style.width=((i+1)*nb)+"%";
	}
	if(parseFloat(document.getElementById("sliderLParam").style.width)>99){
		document.getElementById("popupLoader").style.display="none";
		}
}
// -----------------------------------------------------------------------------------------------------------------------


function appendBuffer(context,buffer1, buffer2,audioRate) {
 var numberOfChannels = Math.min( buffer1.numberOfChannels, buffer2.numberOfChannels );
 var tmp = context.createBuffer( numberOfChannels, (buffer1.length + buffer2.length), audioRate );
 for (var i=0; i<numberOfChannels; i++) {
	var channel = tmp.getChannelData(i);
	channel.set( buffer1.getChannelData(i), 0);
	channel.set( buffer2.getChannelData(i), buffer1.length);
 }
 return tmp;
}
function indexFirstObjInGrp(lgrp) {
	var lmin=65535;
	for(let i=0;i<lgrp.length;i++){
		if(tableObjet[lgrp[i]].posX<lmin){
			lmin=tableObjet[lgrp[i]].posX;
			id=i;
		}
	}
	return id;
}

let tempoFilePath = '';
let stretchingFilePath = '';
let tempoPlayerStat = 0;
let stretchingPlayerStat = 0;

async function tempoAudio() {
	const obj = tableObjet[objActif];
	if (!obj || !obj.file || obj.type >= 24) return;
	tempoFilePath = window.api.joinPath(toAbsPath(paramProjet.audioPath), obj.file);
	document.getElementById("sliderTempo").value = 1.00;
	document.getElementById("inpTempo").value = 1.00;
	tempoPlayerStat = 0;
	document.getElementById("tempoPlay").src = "./images/png/lecture.png";
	document.getElementById("tempoAudio").style.display = "block";
}

function playTempoFile() {
	if (tempoPlayerStat === 0) {
		tempoPlayerStat = 1;
		document.getElementById("tempoPlay").src = "./images/png/pauseLect.png";
		const ratio = parseFloat(document.getElementById("sliderTempo").value) || 1.0;
		window.api.playDirectFile(0, tempoFilePath, "vol " + soxVolume + " tempo " + ratio);
	} else {
		tempoPlayerStat = 0;
		document.getElementById("tempoPlay").src = "./images/png/lecture.png";
		window.api.send("toMain", "killPlay");
	}
}

function sliderTempo(){
	document.getElementById("inpTempo").value=document.getElementById("sliderTempo").value;
}
function inpTempo(){
	document.getElementById("sliderTempo").value=document.getElementById("inpTempo").value;
}

async function validTempoAudio() {
	const ratio = parseFloat(document.getElementById("sliderTempo").value);
	if (!tempoFilePath) return;
	const obj = tableObjet[objActif];
	const baseName = obj.file.replace(/\.[^.]+$/, '');
	const suggested = window.api.joinPath(toAbsPath(paramProjet.audioPath), baseName + '-tempo.wav');
	const destPath = await window.api.showSaveDialog(suggested);
	if (!destPath) return;
	if (tempoPlayerStat === 1) { tempoPlayerStat = 0; window.api.send("toMain", "killPlay"); }
	document.getElementById("tempoAudio").style.display = "none";
	document.getElementById("loading").style.display = "block";
	window.api.send("toMain", "processTempo;" + JSON.stringify({ id: objActif, filePath: tempoFilePath, ratio: 1 / ratio, destPath }));
}
function annulTempoAudio() {
	if (tempoPlayerStat === 1) { tempoPlayerStat = 0; window.api.send("toMain", "killPlay"); }
	document.getElementById("tempoAudio").style.display = "none";
}

async function stretchingAudio() {
	const obj = tableObjet[objActif];
	if (!obj || !obj.file || obj.type >= 24) return;
	stretchingFilePath = window.api.joinPath(toAbsPath(paramProjet.audioPath), obj.file);
	document.getElementById("sliderStretching").value = 1.00;
	document.getElementById("inpStretching").value = 1.00;
	document.getElementById("sliderPitch").value = 0;
	document.getElementById("inpPitch").value = 0;
	stretchingPlayerStat = 0;
	document.getElementById("stretchingPlay").src = "./images/png/lecture.png";
	document.getElementById("stretchingAudio").style.display = "block";
}
function playStretchingFile() {
	if (stretchingPlayerStat === 0) {
		stretchingPlayerStat = 1;
		document.getElementById("stretchingPlay").src = "./images/png/pauseLect.png";
		const ratio = parseFloat(document.getElementById("sliderStretching").value) || 1.0;
		const pitch = parseFloat(document.getElementById("sliderPitch").value) || 0;
		let soxFx = "vol " + soxVolume + " speed " + ratio;
		if (pitch !== 0) soxFx += " pitch " + Math.round(pitch * 100);
		window.api.playDirectFile(0, stretchingFilePath, soxFx);
	} else {
		stretchingPlayerStat = 0;
		document.getElementById("stretchingPlay").src = "./images/png/lecture.png";
		window.api.send("toMain", "killPlay");
	}
}
function sliderStretching() {
	document.getElementById("inpStretching").value = document.getElementById("sliderStretching").value;
}
function inpStretching() {
	document.getElementById("sliderStretching").value = document.getElementById("inpStretching").value;
}
function sliderPitch() {
	document.getElementById("inpPitch").value = document.getElementById("sliderPitch").value;
}
function inpPitch() {
	document.getElementById("sliderPitch").value = document.getElementById("inpPitch").value;
}
async function validStretchingAudio() {
	const ratio = parseFloat(document.getElementById("sliderStretching").value);
	const pitch = parseFloat(document.getElementById("sliderPitch").value);
	if (!stretchingFilePath) return;
	const obj = tableObjet[objActif];
	const baseName = obj.file.replace(/\.[^.]+$/, '');
	const suggested = window.api.joinPath(toAbsPath(paramProjet.audioPath), baseName + '-stretching.wav');
	const destPath = await window.api.showSaveDialog(suggested);
	if (!destPath) return;
	if (stretchingPlayerStat === 1) { stretchingPlayerStat = 0; window.api.send("toMain", "killPlay"); }
	document.getElementById("stretchingAudio").style.display = "none";
	document.getElementById("loading").style.display = "block";
	window.api.send("toMain", "processStretching;" + JSON.stringify({ id: objActif, filePath: stretchingFilePath, ratio: 1 / ratio, pitch, destPath }));
}
function annulStretchingAudio() {
	if (stretchingPlayerStat === 1) { stretchingPlayerStat = 0; window.api.send("toMain", "killPlay"); }
	document.getElementById("stretchingAudio").style.display = "none";
}

