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

let sourceStat=0
let playerStat=0
let tableSrc=[]
let vueStudio=0
var points=0
var compteur=0
var tempoFoo=[]
var curTempo=0;
let dureePlayer=0;

document.getElementById("simpleSpeaker").addEventListener('click',readSimpleAudio)
document.getElementById("inpTempo").addEventListener('input',inpTempo);
document.getElementById("sliderTempo").addEventListener('input',sliderTempo);
document.getElementById("renderPlay").addEventListener('click',player);


function readPart(){
	let nbp=0;
	var lsgrp=[];
	for(i=0;i<tableObjet.length;i++){
		if(tableObjet[i].etat==1){
			if (tableObjet[i].file!="" || tableObjet[i].file!==undefined) {
				if (tableObjet[i].class==1 && tableObjet[i].type<24) {
					lsgrp.push(i);
				}
			}
		}
	}
	
	if(playerStat==0){
		playerStat=1;
		renderPartAudio(0);
		
	}else{
		//document.getElementById("play3").src="./images/png/read.png";
		playerStat=0;
		clearTimeout(timer);
		//multiStop();
		document.getElementById("renduWav").pause();
		if(vueStudio==1 ){
			window.api.send("toMain", "endEvtAudio;")
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
	document.getElementById("tempo").value=60
	console.log('debut bar',document.getElementById("barVerticale").style.left)
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
var nsgrp=[]
nsgrp=[].concat(tableObjet)
console.log("nsgrp",nsgrp)
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
	
	
	var gtempo=60/parseFloat(document.getElementById("tempo").value)
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
		
		dsecondes=Math.round(dsecondes+1);
		//dsecondes=document.getElementById("renduWav").currentTime+0.01
	 	if(dsecondes>59){
	 		dminutes=dminutes+1;
	 		dsecondes=0;
	 	}
	 	if(dminutes>59){
	 		dheures=dheures+1;
	 		dminutes=0;
	 		dsecondes=0;
	 	}
	 	if(dminutes<10){
	 		mt="0"+dminutes;
	 	}else{
	 		mt=dminutes;
	 	}
	 	if(dheures<10){
	 		ht="0"+dheures;
	 	}
	 	else{
	 		ht=dheures;
	 	}
	 	
	 	if(dsecondes<10){
	 		st="0"+dsecondes.toFixed(2);
	 	}else{
	 		st=dsecondes.toFixed(2);
	 	}
	 	 document.getElementById("compteurH").innerHTML = ht+" : ";
		 document.getElementById("compteurM").innerHTML = mt+" : ";
		 document.getElementById("compteurS").innerHTML = st;
		 points=0;

		 if(vueStudio==1 ){
		 	for(i=0;i<tableListSource.length;i++){
			 	if(tableListSource[i].etat==0 && tableListSource[i].start<parseInt(document.getElementById("barVerticale").style.left)+9){
			 		tableListSource[i].etat=1
			 		//console.log('date',Date.now()-compteur)
			 		console.log("create",i,tableListSource[i].start,parseInt(document.getElementById("barVerticale").style.left))
			 		cmd="obj"+i+";"+tableListSource[i].posX+";"+tableListSource[i].posY+";"+tableListSource[i].scale+";"+tableListSource[i].width+";"+tableListSource[i].zindex+";"+tableListSource[i].image;
					window.api.send("toMain", "createEvtAudio;"+cmd)
			 	}
		 	}
		 	for(i=0;i<tableListSource.length;i++){
			 	if(tableListSource[i].etat==1 && tableListSource[i].end<parseInt(document.getElementById("barVerticale").style.left)+9){
			 		console.log("del",i,tableListSource[i].end,parseInt(document.getElementById("barVerticale").style.left))
			 		tableListSource[i].etat=2
			 		window.api.send("toMain", "delEvtAudio;obj"+i)
			 	}
		 	}
		 
		 }
	//}
	// console.log('time',document.getElementById("renduWav").currentTime)
	
	 
	 if(parseFloat(document.getElementById("barVerticale").style.left)>tempoFoo[curTempo].X){
	 	//document.getElementById("renduWav").playbackRate =tempoFoo[curTempo].Y/60;
	 	document.getElementById("tempo").value=tempoFoo[curTempo].Y.toFixed(2)
	 	 curTempo++;
	 }
//console.log('curTempo',curTempo,tempoFoo)
    	timer=setTimeout(foo, delay);
    }
}
function defTime(elem) {
	tmp=((parseInt(document.getElementById(elem).style.left)/zoomScale)*(720/12960))+1;
	if(elem=="barDebut"){
		tmp=(((parseInt(document.getElementById(elem).style.left)+40)/zoomScale)*(720/12960));
	}else if(elem=="barFin"){
		tmp=(((parseInt(document.getElementById(elem).style.left))/zoomScale)*(720/12960));
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
	return tmp
}
function convertAudioBufferToBlob(audioBuffer) {

    var channelData = [],
      totalLength = 0,
      channelLength = 0;

    for (var i = 0; i < audioBuffer.numberOfChannels; i++) {
      channelData.push(audioBuffer.getChannelData(i));
      totalLength += channelData[i].length;
      if (i == 0) channelLength = channelData[i].length;
    }

    // interleaved
    const interleaved = new Float32Array(totalLength);

    for (
      let src = 0, dst = 0;
      src < channelLength;
      src++, dst += audioBuffer.numberOfChannels
    ) {
      for (var j = 0; j < audioBuffer.numberOfChannels; j++) {
        interleaved[dst + j] = channelData[j][src];
      }
    }

    // get WAV file bytes and audio params of your audio source
    const wavBytes = this.getWavBytes(interleaved.buffer, {
      isFloat: true, // floating point or 16-bit integer
      numChannels:2,
      sampleRate: contextAudio.sampleRate,
    });
    const wav = new Blob([wavBytes], { type: "audio/wav" });
    return wav
  }
  function getWavBytes(buffer, options) {
  const type = options.isFloat ? Float32Array : Uint16Array
  const numFrames = buffer.byteLength / type.BYTES_PER_ELEMENT

  const headerBytes = getWavHeader(Object.assign({}, options, { numFrames }))
  const wavBytes = new Uint8Array(headerBytes.length + buffer.byteLength);

  // prepend header, then add pcmBytes
  wavBytes.set(headerBytes, 0)
  wavBytes.set(new Uint8Array(buffer), headerBytes.length)

  return wavBytes
}
function getWavHeader(options) {
  const numFrames =      options.numFrames
  const numChannels =    options.numChannels || 2
  const sampleRate =     options.sampleRate || contextAudio.sampleRate
  const bytesPerSample = options.isFloat? 4 : 2
  const format =         options.isFloat? 3 : 1

  const blockAlign = numChannels * bytesPerSample
  const byteRate = sampleRate * blockAlign
  const dataSize = numFrames * blockAlign

  const buffer = new ArrayBuffer(44)
  const dv = new DataView(buffer)

  let p = 0

  function writeString(s) {
    for (let i = 0; i < s.length; i++) {
      dv.setUint8(p + i, s.charCodeAt(i))
    }
    p += s.length
  }

  function writeUint32(d) {
    dv.setUint32(p, d, true)
    p += 4
  }

  function writeUint16(d) {
    dv.setUint16(p, d, true)
    p += 2
  }

  writeString('RIFF')              // ChunkID
  writeUint32(dataSize + 36)       // ChunkSize
  writeString('WAVE')              // Format
  writeString('fmt ')              // Subchunk1ID
  writeUint32(16)                  // Subchunk1Size
  writeUint16(format)              // AudioFormat https://i.stack.imgur.com/BuSmb.png
  writeUint16(numChannels)         // NumChannels
  writeUint32(sampleRate)          // SampleRate
  writeUint32(byteRate)            // ByteRate
  writeUint16(blockAlign)          // BlockAlign
  writeUint16(bytesPerSample * 8)  // BitsPerSample
  writeString('data')              // Subchunk2ID
  writeUint32(dataSize)            // Subchunk2Size

  return new Uint8Array(buffer)
}
function readSimpleAudio() {
	console.log("read speaker",tableObjet[objActif],objActif)
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
		    const dir = rdDirName(filePath);
		    const baseName = rdBaseName(filePath).split(".")[0];
		    const outPath = `${dir}/${baseName}-fx.wav`;
		    const options = {
			    pitchSemitones: obj.detune,  // équivalent à -500 cents
			    speedFactor: obj.transposition,       // speed 2x
			    gain: obj.gain,
			    startSec: obj.debut,
			    lengthSec: ((obj.duree*obj.fin)-(obj.duree*obj.debut))/obj.transposition
				 };
				 console.log("read speaker opt",options)
				 document.getElementById("barVerticale").style.left=((tableObjet[objActif].posX-4)*zoomScale)+"px";
				 defTime("barVerticale");
	  			 foo();
			 window.api.send("toMain", 'playDirectFile;'+outPath+";"+"pitch "+options.pitchSemitones+" speed "+options.speedFactor+" vol "+ options.gain+" trim "+options.startSec+" "+options.lengthSec);
	  				
			//spatialiseObjet(objActif,"spline");
			}else if(grpSelect==1 ||  tableObjet[objActif].class==4){
				playerStat=1;
				readGrpAudio(0);
			}
	}else{
		sourceStat=0;
		playerStat=0;
		if(tableObjet[objActif].class==1){
			console.log("stop speaker",objActif)
			window.api.send("toMain", 'killPlay')
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
		console.log("last",i,tableObjet[lgrp[i]].posX,tableObjet[lgrp[i]].posX+lgi,tableObjet[lgrp[i]].posX+lgi)
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
			maxPosX:maxPos}
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
		console.log("last",i,tableObjet[i].posX,tableObjet[i].posX+lgi,tableObjet[i].posX+lgi)
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
			maxPosX:maxPos}
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
	 window.api.send("toMain", 'playDirectFile;'+filePath+";"+"pitch "+options.pitchSemitones+" speed "+options.speedFactor+" vol "+ options.gain+" trim "+options.startSec+" "+options.lengthSec);
	 
	 }else{
	 	playerStat=0;
	 	document.getElementById("renderPlay").src="./images/png/lecture.png";
	 	window.api.send("toMain", 'killPlay')
	 }
}
function copySliceBuffer(source,len,offset) {
	const buffer1 = source

	// Créez un AudioBuffer pour la destination (buffer2) avec une longueur plus grande
	var length2= tableBufferIR[tableObjet[objActif].convolver].length
	console.log("length2",length2)
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
	return buffer2	
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


function rdDirName(path) {
	const ndir=path.split("/");
	let dir="";
	for(i=0;i<ndir.length-1;i++){
		dir=dir+ndir[i]+"/"
	}
	dir=dir.substring(0, dir.length - 1);
	return dir;
}
function rdBaseName(path) {
	const ndir=path.split("/");
	const baseName=ndir[ndir.length-1]
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
		var minx=tableObjet[preservSelect[0]].posX
		for(let i=0;i<preservSelect.length;i++){
			if(tableObjet[preservSelect[i]].posX<minx){
				minx=tableObjet[preservSelect[i]].posX
			}
		}
		var maxx=tableObjet[preservSelect[preservSelect.length-1]].posX
		for(let i=0;i<preservSelect.length;i++){
			if(tableObjet[preservSelect[i]].posX>maxx){
				maxx=tableObjet[preservSelect[i]].posX
			}
		}
		for(let i=0;i<tableObjet.length;i++){
			if(tableObjet[i].posX>=minx && tableObjet[i].posX<=maxx){
				if(tableObjet[i].etat==1 && tableObjet[i].class==1  && tableObjet[i].file && tableObjet[i].mute==0){
					grp.push(i)
				}
			}	
		}
		console.log("minmax",tableObjet[preservSelect[0]].posX,minx,maxx,grp)
	}else if(tableObjet[objActif].class==2 || tableObjet[objActif].class==4){
		var minx=tableObjet[tableObjet[objActif].liste[0]].posX
		
		for(let i=0;i<tableObjet[objActif].liste.length;i++){
			if(tableObjet[tableObjet[objActif].liste[i]].posX<minx){
				minx=tableObjet[preservSelect[i]].posX
			}
		}
		var maxx=tableObjet[tableObjet[objActif].liste[tableObjet[objActif].liste.length-1]].posX
		for(let i=0;i<tableObjet[objActif].liste.length;i++){
			if(tableObjet[tableObjet[objActif].liste[i]].posX>maxx){
				maxx=tableObjet[preservSelect[i]].posX
			}
		}
		for(let i=0;i<tableObjet.length;i++){
			if(tableObjet[i].posX>=minx && tableObjet[i].posX<=maxx){
				if(tableObjet[i].etat==1 && tableObjet[i].class==1 && tableObjet[i].file && tableObjet[i].mute==0){
					grp.push(i)
				}
			}
		}
		console.log("minmax",tableObjet[preservSelect[0]].posX,minx,maxx,grp)
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
  	var deflastObj=lastAudioInGrp(grp)
  	
  	console.log("lastAudioInGrp",deflastObj.id)
  	var j=0
	if(grp.length>0){
		document.getElementById("barVerticale").style.left=((tableObjet[grp[idpos]].posX-10)*zoomScale)+"px";
		posX=parseFloat(document.getElementById("barVerticale").style.left)/zoomScale;
		bar=(posX*ratioT);
		for(let i=0;i<grp.length;i++){
			if(tableObjet[grp[i]].posX*zoomScale>posX){
				console.log("id",i,tableObjet[grp[i]].bufferId)
				
				var source2=contextAudio.createBufferSource();
				if(tableObjet[grp[i]].convolver!="" && tableBufferIR[tableObjet[grp[i]].convolver].duration>tableBuffer[tableObjet[grp[i]].bufferId].buffer.duration*tableObjet[grp[i]].fin){					
						source2.buffer=copySliceBuffer(tableBuffer[tableObjet[grp[i]].bufferId].buffer,tableBufferIR[tableObjet[grp[i]].convolver].length,0)
				}else{
						source2.buffer =tableBuffer[tableObjet[grp[i]].bufferId].buffer;
				}
				
				tableSrc[j]=contextAudio.createBufferSource();
				if(tableObjet[grp[i]].reverse==true){
					var buf1= new Float32Array()
					var buf2= new Float32Array()
					buf1=source2.buffer.getChannelData(0)
     				buf2=source2.buffer.getChannelData(1);
     				var myArrayBuffer = contextAudio.createBuffer(2, source2.buffer.duration*contextAudio.sampleRate, contextAudio.sampleRate)
     				myArrayBuffer.copyToChannel(buf1.toReversed(), 0, 0)
     				myArrayBuffer.copyToChannel(buf2.toReversed(), 1, 0)
     				tableSrc[j].buffer=myArrayBuffer
     			}else{
     				tableSrc[j]=source2
     			}
     			

				gainNode[j] = contextAudio.createGain();
				panner[j] = contextAudio.createPanner();
				convolver[j] = contextAudio.createConvolver();
				now=curTime+((tableObjet[i].posX*ratioT)-bar);
				var rt=readSourceAudio(contextAudio,tableSrc[j],grp[i],gainNode[j],now,panner[j],convolver[j]);	
				tableSrc[j]=rt.src;
				defPeak(j,rt.src,tableObjet[grp[i]].gain)
				ndeb[j]=rt.ndeb;
				nfin[j]=rt.nfin;
				tablePosX.push(tableObjet[grp[i]].posX)
				j++
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
				console.log("source",i)
				tableSrc[i].start(contextAudio.currentTime+(startX-bar),ndeb[i],nfin[i]);
				playerStat=1;
			}
		}	
		
	}
}
let peak=[]

function saveRenduAudio(duree,file){
dureePlayer = duree;
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
  a.href = file//URL.createObjectURL(rwav);
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
	console.log("retour",rt.mixDuration,rt.output);
	saveRenduAudio(rt.mixDuration,rt.output);
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
	var nfin=tableObjet[lsgrp[lsgrp.length-1]].posX+(tableObjet[lsgrp[lsgrp.length-1]].duree*18)
	var indFin=tempoFoo.find((element) => element.X>=nfin);
	let j=tempoPoints.findIndex((element) => element.X>=indDebut.X);
	var i=0;
	var base=tableObjet[lsgrp[0]].posX;
	console.log("base",base);
	document.getElementById("barVerticale").style.left=(tableObjet[lsgrp[0]].posX-8)+"px";
	tempoMap[0]={
			x:0,
			y:indDebut.Y/60
			}
			console.log("tempoMap",lsgrp,indDebut,indFin,nfin,j)
			i++;
	while(tempoPoints[j].X<indFin.X){
		console.log("tempoMap",j,indDebut.X,(tempoPoints[j].X-base)/18,(240-(parseFloat(tempoPoints[j].Y)/0.4167)))
		if(tempoPoints[j].X>indDebut.X){
		tempoMap[i]={
			x:(parseFloat(tempoPoints[j].X)-base)/18,
			y:(240-(parseFloat(tempoPoints[j].Y)/0.4167))/60
			}
			i++;
		 }
			j++;
	}
	tempoMap[i]={
			x:(parseFloat(indFin.X)-base)/18,
			y:indFin.Y/60
			}
	i++;
	
	(async () => {
		const rt= await window.api.renderGroupWidthSoX(lsgrp,JSON.stringify(tableObjet),base);
		console.log("retour",rt);
		saveRenduAudio(rt.mixDuration,rt.output);
	})();
}
function renderIntervalleAudio(){
	var lsgrp=[];
	var tempoMap=[];
	var deb=parseFloat(document.getElementById("barDebut").style.left)+36;
	var fin=parseFloat(document.getElementById("barFin").style.left);
	for(i=0;i<tableObjet.length;i++){
		if(tableObjet[i].etat==1 && tableObjet[i].posX>deb && tableObjet[i].posX<fin){
			if (tableObjet[i].file!="" || tableObjet[i].file!==undefined) {
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
		console.log("retour",rt.duree,rt.path);
		saveRenduAudio(rt.mixDuration,rt.output);
	})();
}
async function renderPartAudio(mode){
	var lsgrp=[];
	var startx=parseFloat(document.getElementById("barVerticale").style.left);
	for(i=0;i<tableObjet.length;i++){
		if(tableObjet[i].etat==1){
			if (tableObjet[i].file!="" || tableObjet[i].file!==undefined) {
				if (tableObjet[i].class==1 && tableObjet[i].type<24 && tableObjet[i].posX>startx) {
					lsgrp.push(i);
				}
			}
		}
	}
	console.log(lsgrp);
	
	const rt= await window.api.renderGroupWidthSoX(lsgrp,JSON.stringify(tableObjet),startx);
	console.log("retour",rt);
	var start=startx/18;
	var end=rt.mixDuration-start;
	console.log("read start",start,rt.mixDuration,end)
	
	var tempoMap=[]
	for(i=0;i<tempoPoints.length;i++){
		tempoMap[i]={
			x:parseFloat(tempoPoints[i].X)/18,
			y:(240-(parseFloat(tempoPoints[i].Y)/0.4167))/60
			}
	}
	console.log("tempoMap",tempoPoints,tempoMap);
	//console.warn("TYPE console.log =", typeof console.log);
		
		if(mode==0){
			console.log("read");
			defTime("barVerticale");
	  		foo();
			window.api.send("toMain", 'playDirectFile;'+rt.output+";"+"pitch 0 speed 1 vol 1 trim 0 "+rt.mixDuration);
			
		}else{
			saveRenduAudio(rt.mixDuration,rt.output);
		}
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
	var indDebut=tempoFoo.find((element) => element.X>=tableObjet[id].posX);
	var nfin=tableObjet[id].posX+(tableObjet[id].duree*18);
	var indFin=tempoFoo.find((element) => element.X>=nfin);
	let j=tempoPoints.findIndex((element) => element.X>=indDebut.X);
	var i=0;
	var base=tableObjet[id].posX;
	
	tempoMap[0]={
			x:0,
			y:indDebut.Y/60
			}
			console.log("tempoMap",lsgrp,indDebut,indFin,nfin,j)
			i++;
	while(tempoPoints[j].X<indFin.X){
		console.log("tempoMap",j,indDebut.X,(tempoPoints[j].X-base)/18,(240-(parseFloat(tempoPoints[j].Y)/0.4167)))
		if(tempoPoints[j].X>indDebut.X){
		tempoMap[i]={
			x:(parseFloat(tempoPoints[j].X)-base)/18,
			y:(240-(parseFloat(tempoPoints[j].Y)/0.4167))/60
			}
			i++;
		 }
			j++;
	}
	tempoMap[i]={
			x:(parseFloat(indFin.X)-base)/18,
			y:indFin.Y/60
			}
	i++;
	
	console.log("tempoMap",tempoPoints,tempoMap,indDebut,indFin)	
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
    console.log("source",source.playbackRate.value,source.detune.value)
    source.playbackRate.value = speedFactor;
    
    source.detune.value = pitchSemitones;
console.log("source",source.playbackRate.value,source.detune.value)
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
    console.time()
    if (!obj || !obj.file) throw new Error("Objet ou fichier introuvable");
	 document.getElementById("loading").style.display="block";
    const filePath = obj.file;
    const dir = rdDirName(filePath);
    const baseName = rdBaseName(filePath).split(".")[0];
    const outPath = `${dir}/${baseName}-fx.wav`;

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
		 console.log("options",options)
		
    // ----- Sauvegarde finale ----- 
    //
    const startSample = Math.floor(options.startSec * sampleRate);
    const endSample = Math.min(Math.floor((options.startSec + options.lengthSec) * sampleRate), numSamples);
    const trimmedLength = endSample - startSample;

    // ----- NOUVELLE DURÉE APRÈS SPEED -----
    const renderedLength = Math.floor(trimmedLength / options.speedFactor);
    console.log("nbsamples",renderedLength);
    numSamples =  renderedLength;
    
	    
	
	 currentChannels = await applyFxBuffers(obj,numChannels,currentChannels,numSamples,sampleRate) 
	 const monoBuffer = await mixToMono(currentChannels);
	 
	  await window.api.saveAudioBuffer({
        filePath: "renduin.wav",
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

    window.api.send("toMain", "processAudio;" + JSON.stringify(info));
	 
    console.log("[pipeline] saved →", "renduout.wav");
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
	
	console.log("listeFx",obj,obj.tableFx)
    // ----- WAM / GREFFONS -----
    const fxSlots = obj.tableFx || [];
    const validSlots = fxSlots.filter(k => k && listeFx && listeFx[k]);

    const blockSize = 1024;

    // Import faustwasm once
    
    const faustPkg = await import("./node_modules/@grame/faustwasm/dist/esm/index.js");
    const { instantiateFaustModuleFromFile, LibFaust, FaustCompiler, FaustMonoDspGenerator } = faustPkg;
    const faustModule = await instantiateFaustModuleFromFile("./node_modules/@grame/faustwasm/libfaust-wasm/libfaust-wasm.js");
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
	console.log("layoutName",layoutName)
    if (!layoutName) throw new Error("layoutName missing");
    const buf = await window.api.readFile(`./Dsp/${layoutName}.json`);
    const txt = new TextDecoder("utf-8").decode(buf);
    return JSON.parse(txt);
}
function interpolate(times, values, t, type = "linear") {
    if (!times || !times.length) return values && values[0] || 0;
    if (!values || !values.length) return 0;
    if (t <= times[0]) return values[0];
    if (t >= times[times.length - 1]) return values[values.length - 1];

    // trouve l’intervalle
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
async function createLayout(layout, numChannels) {
    console.log("[compile] START", layout);
    // ===== LOAD LAYOUT =====
    const layoutJSON = await loadLayoutJSON(layout, numChannels);
    const dspSource = generateSpatDSP(layoutJSON, numChannels);
	 const NP = layoutJSON.speakers.length;
    // ===== INIT FAUST & COMPILE DSP =====
    const { instantiateFaustModuleFromFile, LibFaust, FaustCompiler, FaustMonoDspGenerator } =
        await import("./node_modules/@grame/faustwasm/dist/esm/index.js");

    const faustModule = await instantiateFaustModuleFromFile(
        "./node_modules/@grame/faustwasm/libfaust-wasm/libfaust-wasm.js"
    );

    const libFaust = new LibFaust(faustModule);
    const compiler = new FaustCompiler(libFaust);
    const generator = new FaustMonoDspGenerator();

    await generator.compile(compiler, "spat", dspSource, "");
    return {
    	generator:generator,
    	P:NP
    	};
}
async function spatialiseBuffer(id, outPath, numChannels, numSamples, sampleRate , currentChannels, interpType = "linear") {
    console.log("[spatialiseObjet] START", id);

    const obj = tableObjet[id];
    // ===== OFFLINE PROCESSOR =====
    const blockSize = 64; // plus réactif
    console.log("generator",await window.wamSpat.generator)
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

async function spatialise(id,filePath,interpType="linear") {
	 const obj = tableObjet[id];
    const baseName = rdBaseName(filePath).split(".")[0];
    const outPath = `${rdDirName(filePath)}/${baseName}-fx.wav`;

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
        await import("./node_modules/@grame/faustwasm/dist/esm/index.js");

    const faustModule = await instantiateFaustModuleFromFile(
        "./node_modules/@grame/faustwasm/libfaust-wasm/libfaust-wasm.js"
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
	const response = await fetch(file);
  	const arrayBuffer = await response.arrayBuffer();

  	// Décode les données en AudioBuffer via Web Audio API
  	const audioBuffer = await contextAudio.decodeAudioData(arrayBuffer);				
	console.log("audioBuffer",file,audioBuffer.length);
	const numChannels = audioBuffer.numberOfChannels;
   const numSamples = audioBuffer.length;
   const sampleRate =audioBuffer.sampleRate;
   
   const trimmed= await endTrim(audioBuffer,0)
	const trimmedLength = trimmed.length; 
   console.log("TRIMMED LENGTH =", trimmedLength);
   console.log("rendu",numChannels,numSamples,sampleRate)
	const offlineCtx = new OfflineAudioContext(1,trimmedLength,sampleRate );
	const song = offlineCtx.createBufferSource();
	const resultBuffer = offlineCtx.createBuffer(1, trimmedLength, sampleRate);
	resultBuffer.copyToChannel(trimmed, 0);  // copie dans le canal 0
	song.buffer = resultBuffer; 
	const gainNode = offlineCtx.createGain();
	console.log("gain",gainPoints)
	const extracted = extractEnvelopeForObject(
    gainPoints,
    tableObjet[id].posX,        // position de l’objet dans le X global
    song.buffer.duration * 18     // durée en X dans la partition
);
	const localEnv = convertToLocalEnvelope(
    extracted,
    song.buffer.duration   // durée de l’audio en secondes
);
	applyEnvelopeToGainNode(gainNode, localEnv);
	song.connect(gainNode);
	gainNode.connect(offlineCtx.destination);
	song.start(0);	
	const renderedBuffer = await offlineCtx.startRendering();
	
   console.log("renderedBuffer",id,renderedBuffer.length,renderedBuffer.numberOfChannels);
	const currentChannels = [new Float32Array(renderedBuffer.getChannelData(0))];
	 const obj = tableObjet[id];
	const filePath = obj.file;
    const dir = rdDirName(filePath);
    const baseName = rdBaseName(filePath).split(".")[0];
    let outPath = `${dir}/${baseName}-fx.wav`;
    if(mode==0){
	   await spatialiseBuffer(id,outPath, numChannels, trimmedLength, sampleRate , currentChannels, interpType = "linear");
	   console.timeEnd()
	   console.log("[pipeline] saved →", outPath);
    }else{
    	outPath = `${dir}/exports/${tableObjet[id].id}.wav`;
    	await window.api.saveAudioBuffer({ filePath: outPath, buffer: { sampleRate, channels: currentChannels } });
    	document.getElementById("loading").style.display="none";
   	console.log("[no spatialiseObjet] File save:", outPath);
   	exportCompteur++;
   	console.log("exportTable",exportCompteur,exportTable)
   	if(exportCompteur<exportTable.length){
   	await readSimpleAudioA(exportTable[exportCompteur],1);
   	}
    }
}

async function exportObjAudio(){
	var lsgrp=[];
	lsgrp.push(objActif);
	await readSimpleAudioA(objActif,1);
	exportToSeq(lsgrp);
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
			if (tableObjet[i].file!="" || tableObjet[i].file!==undefined) {
				lsgrp.push(i);
			}
		}
	}
	lsgrp.sort(function (a, b) {
  		return tableObjet[a].posX - tableObjet[b].posX;
	});
	console.log("debut",deb,"fin",fin,lsgrp);
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
	lsgrp.sort(function (a, b) {
   return tableObjet[a].posX - tableObjet[b].posX;
   });
	exportTable=lsgrp;
	exportCompteur=0;
	await readSimpleAudioA(lsgrp[0],1);
	exportToSeq(lsgrp);
}
async function exportPart(){
	var tempoMap=[];
	if(grpSelect==1){
		grp=[].concat(preservSelect);
		document.getElementById("barVerticale").style.left=document.getElementById("grpSelect").style.left;
	}else if(tableObjet[objActif].class==2 || tableObjet[objActif].class==4 || tableObjet[objActif].class=="groupe"){
		grp=[].concat(tableObjet[objActif].liste);
		document.getElementById("barVerticale").style.left=tableObjet[objActif].posX+"px";
		}
	lsgrp.sort(function (a, b) {
   return tableObjet[a].posX - tableObjet[b].posX;
   });
	exportTable=lsgrp;
	exportCompteur=0;
	await readSimpleAudioA(lsgrp[0],1);
	exportToSeq(lsgrp);
}
function exportToSeq(refGrp){
	var autoGain="";
	for(i=0;i<gainPoints.length;i++){
		autoGain=autoGain+((gainPoints[i].X/18).toFixed(2))+","+((100-gainPoints[i].Y)*0.05).toFixed(2)+";"
	}
	autoGain=autoGain.substring(0,autoGain.length-1)
	var txt=audioDirectory+"\n"+spat3D+"\n"+spat3DCanaux+"\n"+contextAudio.sampleRate+"\n"+autoGain+"\n";
	var nfilesave=[];
	var ratioT=(720/12960);
	var offsetPiste=1;
	var track=1
	nfilesave=[].concat(refGrp);
	nfilesave.sort((a, b) => a.piste - b.piste);
	console.log("exportToSeq",refGrp,nfilesave)
	console.log(tableObjet[0])
	for(let i in nfilesave){
		if(tableObjet[i].etat==1 && tableObjet[i].file && tableObjet[i].class==1 && tableObjet[i].type<24){
			if(refGrp.length>0){
				track=tableObjet[nfilesave[i]].piste+offsetPiste
			}
			txt=txt+tableObjet[nfilesave[i]].nom+";"+(tableObjet[nfilesave[i]].objColor.substring(1)+"ff")+";"+tableObjet[nfilesave[i]].id+";"+(tableObjet[nfilesave[i]].piste+offsetPiste)+";"+Math.floor((tableObjet[nfilesave[i]].posX*ratioT)*48000)			
			txt=txt+";"+tableObjet[nfilesave[i]].spT+";"+tableObjet[nfilesave[i]].spX+";"+tableObjet[nfilesave[i]].spY+";"+tableObjet[nfilesave[i]].spZ+";"+tableObjet[nfilesave[i]].spD+"\n";   	
		 }
		
	}
   	window.api.send("toMain", "exportSelect;"+btoa(txt))
}

// ***********************************************************************************************************************


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

async function tempoAudio() {
	document.getElementById("tempoAudio").style.display="block";
	document.getElementById("sliderTempo").value=1.00;
	document.getElementById("inpTempo").value=document.getElementById("sliderTempo").value;
	var recorder=false;
	var recordingstream=false;
	if (tableObjet[objActif].type<24) {
		if (tableObjet[objActif].file) {
			console.log("source1",tableObjet[objActif].file);
			if(tableObjet[objActif].mute==0){
				console.log("source",tableObjet[objActif].file);
				source="";
				source=contextAudio.createBufferSource();
				source.buffer =tableBuffer[tableObjet[objActif].bufferId].buffer;
				source.onended = () => {
		  			sourcEtat=0;
		  			recorder.addEventListener('dataavailable',function(e){
		  				document.getElementById("tempoWav").src=URL.createObjectURL(e.data);
		  				
    					recorder=false;
    					recordingstream=false;
  						});
  						recorder.stop();
  						playerStat=0;
		  			console.log("source init end");
		  			
				};
				const gainNode = contextAudio.createGain();
				const panner = contextAudio.createPanner();
				const convolver = contextAudio.createConvolver();
				console.log("source",tableObjet[objActif].file);
				var now=contextAudio.currentTime;
				var rt=await readSourceAudio(contextAudio,source,objActif,gainNode,now,panner,convolver);
				source=rt.src;
				var ndeb=rt.ndeb;
				var nfin=rt.nfin;
				recordingstream=contextAudio.createMediaStreamDestination();
  				recorder=new MediaRecorder(recordingstream.stream);
  				panner.connect(recordingstream);
  				console.log("source",source)
  				source.start(0,ndeb,nfin);
  				recorder.start();
				sourcEtat=1;
			}
		}
	}
}

function sliderTempo(){
	document.getElementById("inpTempo").value=document.getElementById("sliderTempo").value;
	document.getElementById("tempoWav").playbackRate=parseFloat(document.getElementById("inpTempo").value);
}
function inpTempo(){
	document.getElementById("sliderTempo").value=document.getElementById("inpTempo").value;
	document.getElementById("tempoWav").playbackRate=parseFloat(document.getElementById("inpTempo").value);
}

var mediasource2=contextAudio.createMediaElementSource(document.getElementById("tempoWav"))
var recorder2=false;
var recordingstream2=false;	
recordingstream2=contextAudio.createMediaStreamDestination();
recorder2=new MediaRecorder(recordingstream2.stream);
mediasource2.connect(recordingstream2);
mediasource2.connect(contextAudio.destination);
function validTempoAudio() {
  	recorder2.start();
  	document.getElementById("tempoWav").play();
  	document.getElementById("tempoWav").onended = () => {
  			recorder2.addEventListener('dataavailable',function(e){
  				e.data.arrayBuffer().then(arrayBuffer => {
				   contextAudio.decodeAudioData(arrayBuffer, (audioBuffer) => {
   				var rwav=convertAudioBufferToBlob(audioBuffer);
				   document.getElementById("renduWav").src=URL.createObjectURL(rwav);
 					});
				});
 					recordingstream2=false;
 					document.getElementById("renderAudio").style.display="block";
 					console.log("source tempo end");
  						});
  						recorder2.stop();
		};
}
function annulTempoAudio() {
	document.getElementById("tempoAudio").style.display="none";
}