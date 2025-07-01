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

document.getElementById("simpleSpeaker").addEventListener('click',readSimpleAudio)
document.getElementById("inpTempo").addEventListener('input',inpTempo);
document.getElementById("sliderTempo").addEventListener('input',sliderTempo);

function stop(){
	try{
		if(playerStat==1){
			multiStop();
			playerStat=0;
		}else{
  			source.stop();
  		}
  }catch(InvalidStateNode){
  }
}
function multiStop(){
	try{
		for(i=0;i<tableSrc.length;i++){
			if(tableSrc[i]){
				tableSrc[i].stop();
			}
  		}
  }catch(InvalidStateNode){
  }
}
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
		//document.getElementById("play3").src="./images/png/stop.png";
		playerStat=1;
		//readMultiAudio();
		renderGrpAudio2(lsgrp,1)
		
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
	document.getElementById("barVerticale").style.left="-4px";
	dheures=0;
	dsecondes=0;
	dminutes=0;
	document.getElementById("compteurH").innerHTML = " 00 : ";
	document.getElementById("compteurM").innerHTML = " 00 : ";
	document.getElementById("compteurS").innerHTML = "00";
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
    
    if(points<(18/gtempo)){
    	points+=1.065;
    }else{

    	if(nbp2>nbp){	
			 document.getElementById("work").scrollLeft=nbp2*1200;
			 nbp=nbp2;
		 }
		
		dsecondes=Math.round(dsecondes+1);
	 	if(dsecondes>59){
	 		dminutes=dminutes+1;
	 		dsecondes=0;
	 	}
	 	if(dminutes>60){
	 		dheures=dheures+1;
	 		dminutes=0;
	 	}
	 	if(dheures<10){
	 		ht="0"+dheures;
	 	}
	 	else{
	 		ht=dheures;
	 	}
	 	if(dminutes<10){
	 		mt="0"+dminutes;
	 	}else{
	 		mt=dminutes;
	 	}
	 	if(dsecondes<10){
	 		st="0"+dsecondes;
	 	}else{
	 		st=dsecondes;
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
	 }
	 
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
	console.log("read speaker",objActif)
	if(sourceStat==0){
		sourceStat=1;
		if(grpSelect==1){
			playerStat=1;
			readGrpAudio(0);
		}else if(tableObjet[objActif].class==1){
			playerStat=0;
			readSimpleAudioA(0);
			}else if(grpSelect==1 ||  tableObjet[objActif].class==4){
				playerStat=1;
				readGrpAudio(0);
			}
	}else{
		sourceStat=0;
		playerStat=0;
		if(tableObjet[objActif].class==1){
			stop();
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

async function readSimpleAudioA(mode){
	var audioRate=tableBuffer[0].buffer.sampleRate;
	if(tableObjet[objActif].class==1){
		if (tableObjet[objActif].type<24) {
			if (tableObjet[objActif].file) {
				if(tableObjet[objActif].mute==0){
					var source2=contextAudio.createBufferSource();
					if(tableObjet[objActif].convolver!="" && tableBufferIR[tableObjet[objActif].convolver].duration>tableBuffer[tableObjet[objActif].bufferId].buffer.duration*tableObjet[objActif].fin){					
						source2.buffer=copySliceBuffer(tableBuffer[tableObjet[objActif].bufferId].buffer,tableBufferIR[tableObjet[objActif].convolver].length,0)
					}else{
						source2.buffer =tableBuffer[tableObjet[objActif].bufferId].buffer;
					}
					var source=contextAudio.createBufferSource();
					if(tableObjet[objActif].reverse==true){
						var buf1= new Float32Array()
						var buf2= new Float32Array()
						buf1=source2.buffer.getChannelData(0)
        				buf2=source2.buffer.getChannelData(1);
        				var myArrayBuffer = contextAudio.createBuffer(2, source2.buffer.duration*contextAudio.sampleRate, contextAudio.sampleRate)
        				myArrayBuffer.copyToChannel(buf1.toReversed(), 0, 0)
        				myArrayBuffer.copyToChannel(buf2.toReversed(), 1, 0)
        				source.buffer=myArrayBuffer
        			}else{
        				source=source2
        			}
					source.onended = () => {
						if(mode==1){
							recorder.addEventListener('dataavailable',function(e){
				  				e.data.arrayBuffer().then(arrayBuffer => {
				  					console.log('recorder mode',mode)
								   contextAudio.decodeAudioData(arrayBuffer, (audioBuffer) => {
			      				var rwav=convertAudioBufferToBlob(audioBuffer);
								   document.getElementById("renduWav").src=URL.createObjectURL(rwav);
								   document.getElementById("renderAudio").style.display="block";
			    				});
							});
				  			recorder=false;
	    					recordingstream=false;
	    					
	  						});
	    					recorder.stop();
						}
			  			sourceStat=0;
			  			console.log("source end");
			  			clearTimeout(timer);
	  					playerStat=0;
					};
					const gainNode = contextAudio.createGain();
					const panner = contextAudio.createPanner();
					const convolver = contextAudio.createConvolver();
					var now=contextAudio.currentTime;
					var rt=await readSourceAudio(contextAudio,source,objActif,gainNode,now,panner,convolver);
					if(mode==1){
						recordingstream=contextAudio.createMediaStreamDestination();
	  					recorder=new MediaRecorder(recordingstream.stream);
	  					panner.connect(recordingstream);
					}
					rt.src.start(0,rt.ndeb,rt.nfin);
					console.log("source",source.buffer.duration, rt.ndeb, rt.nfin);
					if(mode==1){
						recorder.start();
					}
					document.getElementById("barVerticale").style.left=((tableObjet[objActif].posX-4)*zoomScale)+"px";
	  				playerStat=1;
	  				defTime("barVerticale");
	  				foo();
					sourceStat=1;
					
				}
			}
		}
	}
}
function renderAllFxAudio(){
	for(let i=0;i<tableObjet.length;i++){
		if(tableObjet[i].tableFx[0] !='' || tableObjet[i].tableFx[0]!=0){
			renderFxAudioA(i)	
		}
	}
}
function renderFxAudio(){
	renderFxAudioA(objActif)	
}
async function renderFxAudioA(obj){
	var audioRate=tableBuffer[0].buffer.sampleRate;
	if (tableObjet[obj].type<24) {
		if (tableObjet[obj].file) {
			console.log("source1",tableObjet[obj].file);
			if(tableObjet[obj].mute==0){
				console.log("source",tableObjet[obj].file);
				var source="";
				source=contextAudio.createBufferSource();
				source.buffer =tableBuffer[tableObjet[obj].bufferId].buffer;
				source.onended = () => {
					
					recorder.addEventListener('dataavailable',function(e){
	  				e.data.arrayBuffer().then(arrayBuffer => {
					   contextAudio.decodeAudioData(arrayBuffer, (audioBuffer) => {
      				var rwav=convertAudioBufferToBlob(audioBuffer);
					   document.getElementById("renduWav").src=URL.createObjectURL(rwav);
					   document.getElementById("renderAudio").style.display="block";
					   const regex = new RegExp('-');
					   var lab=tableObjet[obj].file.split('.')
					   var label=''
					   var sch=lab[0].search(regex)
						if(sch==-1){
							label=lab[0]+"-1.wav"
						}else{
							var ft=lab[0].substring(0,sch)
							var rt=lab[0].substring(sch+1)
							if(isNaN(rt)){
								rt=0
							}
							var rft=parseInt(lab[0].substring(sch+1))+1
							label=ft+"-"+rft+".wav"
						}
						tableObjet[obj].tableFx=['','','','','','','']
						tableObjet[obj].tableFxParam=['','','','','','','']
						var reader = new FileReader();
						reader.readAsArrayBuffer(rwav);
						reader.onloadend = (event) => {
	    					// The contents of the BLOB are in reader.result:	
	    					window.api.saveAudio('saveAudio',(audioDirectory+label), reader.result);
	    					window.api.send('toMain','replaceAudio;'+obj+';'+audioDirectory+label);
	    				}
	    					
					   	console.log(label);
    					});
					});
		  			recorder=false;
 					recordingstream=false;
  						});
  						
 					recorder.stop();
					
		  			sourceStat=0;
		  			console.log("source end");
		  			clearTimeout(timer);
  					playerStat=0;
				};
				const gainNode = contextAudio.createGain();
				var now=contextAudio.currentTime;
				var rt=await readFxAudio(contextAudio,source,obj,gainNode,now);
				source=rt;
				recordingstream=contextAudio.createMediaStreamDestination();
  				recorder=new MediaRecorder(recordingstream.stream);
  				gainNode.connect(recordingstream);
				source.start(0);
				recorder.start();
				document.getElementById("barVerticale").style.left=(tableObjet[obj].posX-4)+"px";
  				playerStat=1;
  				defTime("barVerticale");
  				foo();
				if(tableObjet[obj].type==13){
					source2.start(0);
						
				}
				sourceStat=1;
			}
		}
	}
}
async function readFxAudio(audioContext,nsource,id,gainNode,now){
	if(tableObjet[id].class==1){
		var typevar=tableObjet[id].envType;
		var tableGreffons=[];
		var nduree=nsource.buffer.duration
	   gainNode.gain=1
		var j=0;
		for(let i=0;i<7;i++){
			if(tableObjet[id].tableFx[i]!=""  && tableObjet[id].tableFx[i]!=0 ){
				j++;
			}
		}
		var nbg=j;
		console.log("nbfx",nbg)
		tableGreffons[0]=nsource;
		console.log("convolver",tableObjet[id])
		if(nbg==0){
			tableGreffons[0].connect(gainNode);
			return nsource
		}else{
			var j=1;
			for(let i=0;i<7;i++){
				if(tableObjet[id].tableFx[i]!="" && tableObjet[id].tableFx[i]!=0 ){
										 const createFaustNode = async (audioContext, dspName , voices = 0, sp = false) => {
				    // Set to true if the DSP has an effect
				    const FAUST_DSP_HAS_EFFECT = false;
				
				    // Import necessary Faust modules and data
				    const { FaustMonoDspGenerator, FaustPolyDspGenerator } = await import("./greffons/"+dspName+"-wasm/faustwasm/index.js");
				
				    // Load DSP metadata from JSON
				    /** @type {FaustDspMeta} */
				    const dspMeta = await (await fetch("./greffons/"+dspName+"-wasm/dsp-meta.json")).json();
				
				    // Compile the DSP module from WebAssembly binary data
				    const dspModule = await WebAssembly.compileStreaming(await fetch("./greffons/"+dspName+"-wasm/dsp-module.wasm"));
				
				    // Create an object representing Faust DSP with metadata and module
				    /** @type {FaustDspDistribution} */
				    const faustDsp = { dspMeta, dspModule };
				
				    /** @type {FaustNode | null} */
				    let faustNode = null;
				
				    // Create either a polyphonic or monophonic Faust audio node based on the number of voices
				        // Create a standard Faust audio node
				        const generator = new FaustMonoDspGenerator();
				        faustNode = await generator.createNode(
				            audioContext,
				            dspName,
				            { module: faustDsp.dspModule, json: JSON.stringify(faustDsp.dspMeta), soundfiles: {} },
				            sp
				        );
				     
				
				    // Return an object with the Faust audio node and the DSP metadata
				     return { faustNode, dspMeta };
					}			
					
					const { faustNode, dspMeta: { name } } = await createFaustNode(audioContext, listeFx[tableObjet[id].tableFx[i]].greffon, 0);
    				if (!faustNode) throw new Error("Faust DSP not compiled");
    				tableGreffons[j]=faustNode
    				console.log(faustNode)
					
						var dest= listeFx[tableObjet[id].tableFx[i]].paramname.split(',')
						var fxparam=tableObjet[id].tableFxParam[i].split('/')
						for(let m=0;m<fxparam.length;m++){
						var param=fxparam[m].split("&")
						var shiftParam = tableGreffons[j].parameters.get(dest[m]);
						var paramvalue=param[0].split("?")
						console.log("obj",tableObjet[id],"dest",dest[m],"fxparam",fxparam[m],"param",param,"shiftParam",shiftParam);
						shiftParam.setValueAtTime(parseFloat(paramvalue[1]), now);
						
						for(k=1;k<param.length;k++){
							paramvalue=param[k].split("?")
							console.log('paramvalue',param[k]," ",param.length)
							shiftParam.linearRampToValueAtTime(parseFloat(paramvalue[1]), now + parseFloat(paramvalue[0]));
						}
						tableGreffons[j-1].connect(tableGreffons[j]);
						}
						console.log("faust",shiftParam)
						j++;
						if (j>nbg) {
							tableGreffons[j-1].connect(gainNode);
							
							if(tableObjet[id].convolver==""){
								gainNode.connect(audioContext.destination);
							}else{
								convolver.buffer=tableBufferIR[tableObjet[id].convolver];
								gainNode.connect(convolver);
								convolver.connect(audioContext.destination);
							}
					
					
				}
					
				}
			}
			gainNode.connect(audioContext.destination);
			return nsource
		}
	
		console.log("nduree",nduree,tableBufferIR[tableObjet[id].convolver]);
	}
	
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
function defPeak(id,buf,g) {
	var bufleft= new Float32Array()
	var bufRight= new Float32Array()
	var lpeak=0
	bufLeft = buf.buffer.getChannelData(0)
	bufRight = buf.buffer.getChannelData(1)
	console.log("bufLeft",bufLeft.length,bufLeft[100])
	for(i in bufLeft){
		if(Math.abs(bufLeft[i])>lpeak){
			lpeak=bufLeft[i]
		}
	}
	for(i in bufRight){
		if(Math.abs(bufRight[i])>lpeak){
			lpeak=bufRight[i]
		}
	}
	peak[id]=lpeak*g
	console.log("peak",lpeak,20 * Math.log (lpeak) / Math.log(10), "dBFS")
}
async function renderGrpAudio(ngrp){
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
	if(ngrp && ngrp.length>0){
		var minx=tableObjet[ngrp[0]].posX
		for(let i=0;i<ngrp.length;i++){
			if(tableObjet[ngrp[i]].posX<minx){
				minx=tableObjet[ngrp[i]].posX
			}
		}
		var maxx=tableObjet[ngrp[ngrp.length-1]].posX
		for(let i=0;i<ngrp.length;i++){
			if(tableObjet[ngrp[i]].posX>maxx){
				maxx=tableObjet[ngrp[i]].posX
			}
		}
		for(let i=0;i<tableObjet.length;i++){
			if(tableObjet[i].posX>=minx && tableObjet[i].posX<=maxx){
				if(tableObjet[i].etat==1 && tableObjet[i].class==1  && tableObjet[i].file && tableObjet[i].mute==0){
					grp.push(i)
				}
			}	
		}
	}else{
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
	recordingstream=contextAudio.createMediaStreamDestination();
  	recorder=new MediaRecorder(recordingstream.stream);
  	var deflastObj=lastAudioInGrp(grp)
  	
  	console.log("lastAudioInGrp",deflastObj.id)
  	var j=0
	if(grp.length>0){
		document.getElementById("barVerticale").style.left=tableObjet[grp[idpos]].posX-10+"px";
		posX=tableObjet[grp[idpos]].posX-10;
		bar=(posX*ratioT/zoomScale);
		for(let i=0;i<grp.length;i++){
			if(tableObjet[grp[i]].posX>posX){
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
				now=curTime+((tableObjet[grp[i]].posX*ratioT)-bar);
				var rt=await readSourceAudio(contextAudio,tableSrc[j],grp[i],gainNode[j],now,panner[j],convolver[j]);	
				tableSrc[j]=rt.src;
				ndeb[j]=rt.ndeb;
				nfin[j]=rt.nfin;
				tablePosX.push(tableObjet[grp[i]].posX)
				j++
			}
		}		
		
		recorder.start();	
		
  		playerStat=1;
  		defTime("barVerticale");
  		foo();
  		console.log("nbsources",tableSrc.length);	
		for(let i=0;i<tableSrc.length;i++){
			if(tableSrc[i] && tablePosX[i]>posX){
				startX=(tablePosX[i]-posX)*ratioT;//startX=(tablePosX[i])*ratioT;
				panner[i].connect(recordingstream);
				console.log("source",i)
				tableSrc[i].start( contextAudio.currentTime+startX,ndeb[i],nfin[i]);
				playerStat=1;
			}
		}
		
		tableSrc[deflastObj.id].onended = () => {
  			sourcEtat=0;
  			console.log("lastAudioInGrp",deflastObj.id)
  			recorder.addEventListener('dataavailable',function(e){
  				e.data.arrayBuffer().then(arrayBuffer => {
				   contextAudio.decodeAudioData(arrayBuffer, (audioBuffer) => {
					var rwav=convertAudioBufferToBlob(audioBuffer);
				   document.getElementById("renduWav").src=URL.createObjectURL(rwav);
				   document.getElementById("renderAudio").style.display="block";
	 					});
				});
 				recorder=false;
 				recordingstream=false;
  				});
  				recorder.stop();
  				clearTimeout(timer);
  				playerStat=0;
  				console.log("grp end");
		};	
		
	}
}


async function renderGrpAudio2(ngrp,mode) {
	var ratioT=(720/12960);
	var tempo=60/parseFloat(document.getElementById("tempo").value)
	var startX;
	var maxT=0;
	var maxPosX=0;
	var id=0;
	tableSrc=[];
	var gainNode=[];
	var panner=[];
	var convolver=[];
	var grp=[];
	var ndeb=[];
	var nfin=[];
	
	tableListSource=[];

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
	var minpos=tableObjet[grp[0]].posX;
	var idpos=0;
	for(let i=0;i<grp.length;i++){
		if(tableObjet[grp[i]].posX<minpos){
			minpos=tableObjet[grp[i]].posX;
			idpos=i;
		}
	}
	var posX=parseFloat(document.getElementById("barVerticale").style.left);
		console.log("liste",grp);
		
		if(grp.length>0){
		
		var audioLast=lastAudioInGrp(grp);
		var minId=indexFirstObjInGrp(grp);
		var maxT= ((Math.abs(tableObjet[audioLast.id].posX-tableObjet[minId].posX))*ratioT)+audioLast.maxDuree+15;
		var audioRate=tableBuffer[0].buffer.sampleRate;
		console.log("maxT",maxT)
		const offlineCtx = new OfflineAudioContext(2,audioRate*maxT,audioRate);

		var curTime = offlineCtx.currentTime;
		posX=tableObjet[grp[idpos]].posX-10;
		bar=(posX*ratioT/zoomScale);
		console.log("grp",grp,posX);
		offlineCtx.oncomplete = function(e) {
	  		var renderedBuffer = e.renderedBuffer;
	  		// do something with the rendered buffer
	  		console.log('Rendering is completed',renderedBuffer.duration);
	  		const song = contextAudio.createBufferSource();
	  		//var newBuffer = removeFirstNSeconds(offlineCtx,renderedBuffer,audioRate,4);
	  		song.buffer=renderedBuffer
  			var rwav3=removeSilenceFromStart(song.buffer)
				var rwav4 = trimSilenceAtEnd(contextAudio, rwav3, threshold = 0.001)
				var rwav5=addSilenceToBuffer(contextAudio, rwav4, (tablePosX[0]*ratioT*tempo))
				var rwav6=convertAudioBufferToBlob(rwav5);
				document.getElementById("renduWav").src=URL.createObjectURL(rwav6);
		  if(mode==0){
		  		console.log("mode0")
		 	 document.getElementById("renderAudio").style.display="block";
		  }else{
		  		defTime("barVerticale");
				tmp=(parseInt(document.getElementById("barVerticale").style.left)*(720/12960));
				console.log("mode1")
				var ht=0;
				var mt=tmp/60;
				var st=tmp%60;
				console.log(tmp,mt,st);
				points=0;
				document.getElementById("renduWav").currentTime=tmp;
				document.getElementById("renduWav").play()
				console.log(tableListSource)
				compteur=Date.now()
				foo();
				  }
		};	
		var tablePosX=[];
		var j=0;
		for(let i=0;i<grp.length;i++){
			if(tableObjet[grp[i]].etat==1 && tableObjet[grp[i]].class==1  && tableObjet[i].type<24){
				if (tableObjet[grp[i]].file && tableObjet[i].mute==0) {
					if(tableObjet[grp[i]].posX>posX){
						
						var source2=offlineCtx.createBufferSource();
						if(tableObjet[grp[i]].convolver!="" && tableBufferIR[tableObjet[grp[i]].convolver].duration>tableBuffer[tableObjet[grp[i]].bufferId].buffer.duration*tableObjet[grp[i]].fin){					
							source2.buffer=copySliceBuffer(tableBuffer[tableObjet[grp[i]].bufferId].buffer,tableBufferIR[tableObjet[grp[i]].convolver].length,0)
						}else{
							source2.buffer =tableBuffer[tableObjet[grp[i]].bufferId].buffer;
						}
						tableSrc[j]=offlineCtx.createBufferSource();
						if(tableObjet[grp[i]].reverse==true){
							var buf1= new Float32Array()
							var buf2= new Float32Array()
							buf1=source2.buffer.getChannelData(0)
		     				buf2=source2.buffer.getChannelData(1);
		     				var myArrayBuffer = offlineCtx.createBuffer(2, source2.buffer.duration*contextAudio.sampleRate, contextAudio.sampleRate)
		     				myArrayBuffer.copyToChannel(buf1.toReversed(), 0, 0)
		     				myArrayBuffer.copyToChannel(buf2.toReversed(), 1, 0)
		     				tableSrc[j].buffer=myArrayBuffer
		     			}else{
		     				tableSrc[j]=source2
		     			}
						
						gainNode[j] = offlineCtx.createGain();
						panner[j] = offlineCtx.createPanner();
						convolver[j] = offlineCtx.createConvolver();
						now=curTime+((tableObjet[grp[i]].posX*ratioT)-bar);
						var rt=await readSourceAudio(offlineCtx,tableSrc[j],grp[i],gainNode[j],now,panner[j],convolver[j]);	
						tableSrc[j]=rt.src;
						ndeb[j]=rt.ndeb;
						nfin[j]=tableObjet[grp[i]].fin;
						tablePosX.push(tableObjet[grp[i]].posX);
						
						defPeak(j,rt.src,tableObjet[grp[i]].gain)
						var gain=peak[j]
						var obj = {};
						if(vueStudio==1){
							var lscale=(1-tableObjet[grp[i]].spZ[0])/2;
							console.log("lscale",lscale)
							var cX=tableObjet[grp[i]].spX[0]
							var cY=tableObjet[grp[i]].spY[0]
						}else{
							var lscale=(1-tableObjet[grp[i]].spZ[0])/2;
							var cX=0;
							var cY=0;
						}
						var lscale2=2	
						if (gain<0.30){
							var ws=30*lscale2;
							var im="./images/png/path4484.png";
						}
						if (gain>=-0.30 && gain<-0.60){
							var ws=35*lscale2;
							var im="./images/png/path4488.png";
						} 
						if (gain>=-0.60 && gain<-0.90){
							var ws=40*lscale2;
							var im="./images/png/path4487.png";
						}
						if (gain>=-0.90 && gain<1.10){
							var ws=50*lscale2;
							var im="./images/png/path4486.png";
						}
						if (gain>=1.10 && gain<1.5){
							var ws=60*lscale2;
							var im="./images/png/path4489.png";
						}
						if (gain>=1.5 && gain<2.0){
							var ws=70*lscale2;
							var im="./images/png/path4490.png";
						}
						if (gain>=2.0){
							var ws=80*lscale2;
							var im="./images/png/path4485.png";
						}
						
						var nduree=rt.src.buffer.duration/tableObjet[grp[i]].transposition;
						obj = {
							start:tableObjet[grp[i]].posX,
							end:tableObjet[grp[i]].posX+(rt.nfin/ratioT),
							id:tableObjet[grp[i]].id,
							etat:0,
							posX:cX,
							posY:cY,
							scale:lscale,
							width:ws,
							image:im,
							zindex:Math.round((lscale*100)+1)
						}	
						if(tableObjet[grp[i]].spT.length>1){
							obj.end=tableObjet[grp[i]].posX+((nduree*parseFloat(tableObjet[grp[i]].spT[1]))/ratioT)
						}				
						tableListSource.push(obj);
						var posTrajectoire=[]
						if(vueStudio==1 && tableObjet[grp[i]].spT.length>1){
							for(t=1;t<tableObjet[grp[i]].spT.length;t++){
								posTrajectoire[t] = {
								start:tableObjet[grp[i]].posX+((nduree*tableObjet[grp[i]].spT[t])/ratioT),
								end:0,
								id:tableObjet[grp[i]].id,
								etat:0,
								posX:tableObjet[grp[i]].spX[t],
								posY:tableObjet[grp[i]].spY[t],
								scale:(1-tableObjet[grp[i]].spZ[t])/2,
								width:ws,
								image:im,
								zindex:Math.round((lscale*100)+1)
								}
								if(t==tableObjet[grp[i]].spT.length-1){
									posTrajectoire[t].end=tableObjet[grp[i]].posX+(rt.nfin/ratioT)
								}else{
									posTrajectoire[t].end=tableObjet[grp[i]].posX+((nduree*parseFloat(tableObjet[grp[i]].spT[t+1]))/ratioT)
								}
								tableListSource.push(posTrajectoire[t]);
								console.log("duree",nduree,tableObjet[grp[i]].spT[t])
							}
							
						}
					}
				}
			}
			j++;
		}
		
	   for(let i=0;i<tableSrc.length;i++){
	   	
   		startX=((tablePosX[i])-posX)*ratioT*tempo;
   		console.log("startX",tempo,startX)
			//tableSrc[i].start(startX,ndeb[i],nfin[i]);
			tableSrc[i].start(startX,ndeb[i],tableSrc[i].buffer.duration*nfin[i]);			
			console.log("grpstart",i,startX,tablePosX[i],tableSrc[i].buffer.duration,rt.ndeb,rt.nfin,nfin[i]);
	   }
		offlineCtx.startRendering().then(function(renderedBuffer) {
	   	console.log('Rendering completed successfully');
		}).catch((err) => {
		    console.error(`Rendering failed: ${err}`);
		    // Note: The promise should reject when startRendering is called a second time on an OfflineAudioContext
		});	
			
	}
	
}
function renderObjeteAudio(){
	var lsgrp=[];
	lsgrp.push(objActif);
	document.getElementById("barVerticale").style.left=tableObjet[objActif].posX+"px";
	renderGrpAudio2(lsgrp,0);
}
function renderGrpAudio(ngrp){
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
	renderGrpAudio2(lsgrp,0);
}
function renderIntervalleAudio(){
	var lsgrp=[];
	var deb=parseFloat(document.getElementById("barDebut").style.left);
	var fin=parseFloat(document.getElementById("barFin").style.left);
	for(i=0;i<tableObjet.length;i++){
		if(tableObjet[i].etat==1 && tableObjet[i].posX>deb && tableObjet[i].posX<fin){
			if (tableObjet[i].file!="" || tableObjet[i].file!==undefined) {
				lsgrp.push(i);
			}
		}
	}
	console.log("debut",deb,"fin",fin,lsgrp);
	document.getElementById("barVerticale").style.left="0px";
	renderGrpAudio2(lsgrp,0);
}

function renderPartAudio(){
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
	console.log(lsgrp);
	document.getElementById("barVerticale").style.left="0px";
	renderGrpAudio2(lsgrp,0);
}


function exportObjetActif() {
	exportAudioObjet(objActif,0)
}

var defrenderedBuffer={};
async function exportAudioObjet(obj,mode) {	
console.log("obj",obj,tableBufferIR,tableObjet[obj],tableBufferIR[tableObjet[obj].convolver],contextAudio.sampleRate)
	var audioRate=contextAudio.sampleRate;
	var nduree=tableObjet[obj].duree/tableObjet[obj].transposition;
	if(tableObjet[obj].convolver!="" && tableBufferIR[tableObjet[obj].convolver].buffer.duration>nduree){
			var ndt=tableBufferIR[tableObjet[obj].convolver].duration
		}else{
			var ndt=nduree
		}
	const offlineCtx = new OfflineAudioContext(2,ndt*audioRate,audioRate);
	var curTime = offlineCtx.currentTime;

	
	var source=offlineCtx.createBufferSource();
	source.buffer =tableBuffer[tableObjet[obj].bufferId].buffer;
	var myArrayBuffer = contextAudio.createBuffer(2, source.buffer.duration*contextAudio.sampleRate, contextAudio.sampleRate)
	if(tableObjet[obj].reverse==true){
		var buf1= new Float32Array()
		var buf2= new Float32Array()
		buf1=source.buffer.getChannelData(0)
  		buf2=source.buffer.getChannelData(1);
  		var myArrayBuffer = contextAudio.createBuffer(2, source.buffer.duration*contextAudio.sampleRate, contextAudio.sampleRate)
  		myArrayBuffer.copyToChannel(buf1.toReversed(), 0, 0)
  		myArrayBuffer.copyToChannel(buf2.toReversed(), 1, 0)
  		source.buffer=myArrayBuffer
  	}
	var gainNode = offlineCtx.createGain();
	var convolver = offlineCtx.createConvolver();
	if(tableObjet[obj].mute==0){
		var now=curTime				
		var rt=await defSourceAudio(offlineCtx,source,obj,gainNode,now,convolver);
		console.log("source",convolver,tableBuffer[tableObjet[obj].bufferId].name,rt.src.buffer.duration,rt.src.playbackRate.value,rt.nfin)
		rt.src.start(0,rt.debut,rt.fin)
					
		offlineCtx.startRendering().then(function(renderedBuffer) {
	   	console.log('Start Rendering');
		}).catch((err) => {
		    console.error(`Rendering failed: ${err}`);
		    // Note: The promise should reject when startRendering is called a second time on an OfflineAudioContext
		});
			
	}
var nrc={}
	rt.src.onended = () => {
		offlineCtx.oncomplete = function(e) {
		  	var renderedBuffer = e.renderedBuffer;
		  	console.log("objet"+obj,' Rendering is completed',renderedBuffer.duration);
		  	
 			if(mode==0){
			var rwav=convertAudioBufferToBlob(renderedBuffer)
	
			var reader = new FileReader();
			reader.readAsArrayBuffer(rwav);
			reader.onloadend = (event) => {
	    		// The contents of the BLOB are in reader.result:	
	    	console.log("result ",audioDirectory+"exports/"+tableObjet[obj].id+".wav"," ",reader.result);
	    	window.api.saveAudio('saveAudio',(audioDirectory+"exports/"+tableObjet[obj].id+".wav"), reader.result);
			}
			}else{
					nrc.obj=obj;
					nrc.buffer=renderedBuffer;
			}
		}
		
	}	
return nrc
}

		
async function defAudioObjet(obj) {	
console.log("obj",obj,tableObjet[obj],tableBufferIR[tableObjet[obj].convolver])
	var audioRate=tableBuffer[0].buffer.sampleRate;
	var nduree=tableObjet[obj].duree/tableObjet[obj].transposition;
	if(tableObjet[obj].convolver!="" && tableBufferIR[tableObjet[obj].convolver].duration>nduree){
			var ndt=tableBufferIR[tableObjet[obj].convolver].duration
		}else{
			var ndt=nduree
		}
	const offlineCtx = new OfflineAudioContext(2,ndt*audioRate,audioRate);
	var curTime = offlineCtx.currentTime;

	
	var source=offlineCtx.createBufferSource();
	source.buffer =tableBuffer[tableObjet[obj].bufferId].buffer;
	var myArrayBuffer = contextAudio.createBuffer(2, source.buffer.duration*contextAudio.sampleRate, contextAudio.sampleRate)
	if(tableObjet[obj].reverse==true){
		var buf1= new Float32Array()
		var buf2= new Float32Array()
		buf1=source.buffer.getChannelData(0)
  		buf2=source.buffer.getChannelData(1);
  		var myArrayBuffer = contextAudio.createBuffer(2, source.buffer.duration*contextAudio.sampleRate, contextAudio.sampleRate)
  		myArrayBuffer.copyToChannel(buf1.toReversed(), 0, 0)
  		myArrayBuffer.copyToChannel(buf2.toReversed(), 1, 0)
  		source.buffer=myArrayBuffer
  	}
	var gainNode = offlineCtx.createGain();
	var convolver = offlineCtx.createConvolver();
	if(tableObjet[obj].mute==0){
		var now=curTime				
		var rt=await defSourceAudio(offlineCtx,source,obj,gainNode,now,convolver);
		console.log("sourcedefAudioObjet",convolver,tableBuffer[tableObjet[obj].bufferId].name,rt.src.buffer.duration,rt.src.playbackRate.value,rt.nfin)
		rt.src.start(0,rt.debut,rt.fin)
					
		offlineCtx.startRendering().then(function(renderedBuffer) {
	   	console.log('Start Rendering');
		}).catch((err) => {
		    console.error(`Rendering failed: ${err}`);
		    // Note: The promise should reject when startRendering is called a second time on an OfflineAudioContext
		});
			
	}

	rt.src.onended = () => {
		offlineCtx.oncomplete = function(e) {
			console.log('Rendering complete');
			drawSvgWaveform(e.renderedBuffer, document.getElementById("canvas").firstChild.nextSibling.firstChild, 0.5,1)
		}
	}	
	
}	


function defSourceEnveloppe(id,nduree,gainNode,dtime){
	var typevar=tableObjet[id].envType;
	const waveArray = new Float32Array(7); //                                      selection type enveloppe
	
	var ngain=tableObjet[id].gain //*tableObjet[id].spD;	
	if(typevar==3){ //                                                                CurveAtTime
		for(i=0;i<7;i++){
			waveArray[i] = ngain*parseFloat(tableObjet[id].envY[i]);
		}
		gainNode.gain.setValueCurveAtTime(waveArray, dtime, dtime+nduree);
	}else{
		gainNode.gain.setValueAtTime(ngain*parseFloat(tableObjet[id].envY[0]),dtime);
		for(i=1;i<7;i++){
			switch(typevar) {
				case 1: //                                                               linearRampToValueAtTime
					gainNode.gain.linearRampToValueAtTime(ngain*parseFloat(tableObjet[id].envY[i]), dtime+ (nduree*parseFloat(tableObjet[id].envX[i])));
					break;
				case 2: //                                                               exponentialRampToValueAtTime
					gainNode.gain.exponentialRampToValueAtTime(ngain*parseFloat(tableObjet[id].envY[i]), dtime + (nduree*parseFloat(tableObjet[id].envX[i])));
					break;
			}
		}
   }
   return gainNode;
}

async function readSourceAudio(audioContext,nsource,id,gainNode,now,panner,convolver){
	console.log("id resource",id)
	var spgain=[]
	if(tableObjet[id].class==1){
		var tableGreffons=[];
		var nduree=nsource.buffer.duration/tableObjet[id].transposition;
		console.log("nduree",id,nduree,tableObjet[id].transposition)
	   gainNode=defSourceEnveloppe(id,nduree,gainNode,now);
		nsource.detune.value=tableObjet[id].detune;
		nsource.playbackRate.value=tableObjet[id].transposition;
		
		switch(tableObjet[id].type) {
		case 11:
			var defEndRate=invTransposition(tableObjet[id].y2);
			nsource.playbackRate.setValueAtTime(tableObjet[id].transposition,now);
			var ratioT=(720/12960);
			var ntime=((tableObjet[id].x2-tableObjet[id].x1)*ratioT)/zoomScale;
			console.log("defEndRate11",tableObjet[id].y1,tableObjet[id].y2,ntime,defEndRate);
			nsource.playbackRate.linearRampToValueAtTime(defEndRate, now + ntime);
			break;
		case 13:
			var defEndRate=invTransposition(tableObjet[id].posY-tableObjet[id].bkgHeight);
			nsource.playbackRate.setValueAtTime(tableObjet[id].transposition,now);
			console.log("readSourceAudio",tableObjet[id].transposition,defEndRate,"debut",now,"fin",now+nduree);
			nsource.playbackRate.linearRampToValueAtTime(defEndRate, now + nduree);
			break;
		case 14:
			var defEndRate=invTransposition(tableObjet[id].posY+tableObjet[id].bkgHeight);
			nsource.playbackRate.setValueAtTime(tableObjet[id].transposition,now);
			console.log("defEndRate15",defEndRate);
			nsource.playbackRate.linearRampToValueAtTime(defEndRate, now + nduree);
			break;
		case 15:
			var defEndRate=invTransposition(tableObjet[id].posY-tableObjet[id].bkgHeight);
			nsource.playbackRate.setValueAtTime(tableObjet[id].transposition,now);
			console.log("defEndRate16",defEndRate);
			nsource.playbackRate.linearRampToValueAtTime(defEndRate, now + nduree);
			break;
		case 16:
			var defEndRate=invTransposition(tableObjet[id].posY+tableObjet[id].bkgHeight);
			nsource.playbackRate.setValueAtTime(tableObjet[id].transposition,now);
			console.log("defEndRate17",defEndRate);
			nsource.playbackRate.linearRampToValueAtTime(defEndRate, now + nduree);
			break;
	}
		
		var ndeb=nduree*tableObjet[id].debut;
		if(tableObjet[id].convolver!="" && tableBufferIR[tableObjet[id].convolver].duration>nduree*tableObjet[id].fin){
			nfin=tableBufferIR[tableObjet[id].convolver].duration
		}else{
			var nfin=(nduree*tableObjet[id].fin)
		}
	
		panner.panningModel = pannerPanningModel;
		panner.distanceModel = pannerDistanceModel;
		panner.refDistance = pannerRefDistance;
		panner.maxDistance = pannerMaxDistance;
		panner.rolloffFactor =pannerRolloffFactor;
		panner.coneInnerAngle =pannerConeInnerAngle;
		panner.coneOuterAngle =pannerConeOuterAngle;
		panner.coneOuterGain = pannerConeOuterGain;
		
		if (panner.orientationX) {
		  panner.orientationX.setValueAtTime(pannerOrientationX, audioContext.currentTime);
		  panner.orientationY.setValueAtTime(pannerOrientationY, audioContext.currentTime);
		  panner.orientationZ.setValueAtTime(pannerOrientationZ, audioContext.currentTime);
		} else {
		  panner.setOrientation(pannerOrientationX, pannerOrientationY, pannerOrientationZ);
		}
		var j=0;
		for(let i=0;i<7;i++){
			if(tableObjet[id].tableFx[i]!=""  && tableObjet[id].tableFx[i]!=0 ){
				j++;
			}
		}
		var nbg=j;
		console.log("nbfx",nbg)
		tableGreffons[0]=nsource;
		console.log("convolver",tableObjet[id])

		if(nbg==0){

			tableGreffons[0].connect(gainNode);
			positionPanner();
			if(tableObjet[id].convolver==""){
				gainNode.connect(panner);
			}else{
				convolver.buffer=tableBufferIR[tableObjet[id].convolver];
				gainNode.connect(convolver);
				convolver.connect(panner);
			}
			panner.connect(audioContext.destination);
			console.log("nsource an",nsource.buffer.duration)

		}else{
			var j=1;
			for(let i=0;i<7;i++){
				if(tableObjet[id].tableFx[i]!="" && tableObjet[id].tableFx[i]!=0 ){
			
					 const createFaustNode = async (audioContext, dspName , voices = 0, sp = false) => {
				    // Set to true if the DSP has an effect
				    const FAUST_DSP_HAS_EFFECT = false;
				
				    // Import necessary Faust modules and data
				    const { FaustMonoDspGenerator, FaustPolyDspGenerator } = await import("./greffons/"+dspName+"-wasm/faustwasm/index.js");
				
				    // Load DSP metadata from JSON
				    /** @type {FaustDspMeta} */
				    const dspMeta = await (await fetch("./greffons/"+dspName+"-wasm/dsp-meta.json")).json();
				
				    // Compile the DSP module from WebAssembly binary data
				    const dspModule = await WebAssembly.compileStreaming(await fetch("./greffons/"+dspName+"-wasm/dsp-module.wasm"));
				
				    // Create an object representing Faust DSP with metadata and module
				    /** @type {FaustDspDistribution} */
				    const faustDsp = { dspMeta, dspModule };
				
				    /** @type {FaustNode | null} */
				    let faustNode = null;
				
				    // Create either a polyphonic or monophonic Faust audio node based on the number of voices
				        // Create a standard Faust audio node
				        const generator = new FaustMonoDspGenerator();
				        faustNode = await generator.createNode(
				            audioContext,
				            dspName,
				            { module: faustDsp.dspModule, json: JSON.stringify(faustDsp.dspMeta), soundfiles: {} },
				            sp
				        );
				     
				
				    // Return an object with the Faust audio node and the DSP metadata
				     return { faustNode, dspMeta };
					}			
					
					const { faustNode, dspMeta: { name } } = await createFaustNode(audioContext, listeFx[tableObjet[id].tableFx[i]].greffon, 0);
    				if (!faustNode) throw new Error("Faust DSP not compiled");
    				tableGreffons[j]=faustNode
    				console.log(faustNode)
					
						var dest= listeFx[tableObjet[id].tableFx[i]].paramname.split(',')
						var fxparam=tableObjet[id].tableFxParam[i].split('/')
						for(let m=0;m<fxparam.length;m++){
						var param=fxparam[m].split("&")
						var shiftParam = tableGreffons[j].parameters.get(dest[m]);
						var paramvalue=param[0].split("?")
						console.log("obj",tableObjet[id],"dest",dest[m],"fxparam",fxparam[m],"param",param,"shiftParam",shiftParam);
						shiftParam.setValueAtTime(parseFloat(paramvalue[1]), now);
						
						for(k=1;k<param.length;k++){
							paramvalue=param[k].split("?")
							console.log('paramvalue',param[k]," ",param.length)
							shiftParam.linearRampToValueAtTime(parseFloat(paramvalue[1]), now + parseFloat(paramvalue[0]));
						}
						tableGreffons[j-1].connect(tableGreffons[j]);
						}
						console.log("faust",shiftParam)
						j++;
						if (j>nbg) {
							tableGreffons[j-1].connect(gainNode);
							positionPanner();
							if(tableObjet[id].convolver==""){
								gainNode.connect(panner);
							}else{
								convolver.buffer=tableBufferIR[tableObjet[id].convolver];
								gainNode.connect(convolver);
								convolver.connect(panner);
							}
							panner.connect(audioContext.destination);
							
						}
					
				}
			}
			
		}
	 
		function positionPanner() {
		  var xPos=parseFloat(tableObjet[id].spX[0]);
		  var yPos=-parseFloat(tableObjet[id].spY[0]);
		  var zPos=parseFloat(tableObjet[id].spZ[0]);
			  
	     panner.positionX.setValueAtTime(xPos, now);
	     panner.positionY.setValueAtTime(yPos, now);
	     panner.positionZ.setValueAtTime(zPos, now);
			  
		  for(i=1;i<tableObjet[id].spT.length;i++){
		  	var xPos=parseFloat(tableObjet[id].spX[i]);
		   var yPos=-parseFloat(tableObjet[id].spY[i]);
		   var zPos=parseFloat(tableObjet[id].spZ[i]);
		   var posT=parseFloat(tableObjet[id].spT[i])*nduree;
		  	panner.positionX.linearRampToValueAtTime(xPos, now+posT);
		   panner.positionY.linearRampToValueAtTime(yPos, now+posT);
		   panner.positionZ.linearRampToValueAtTime(zPos, now+posT);
		  }
		}
		
		
		//console.log("nduree",nduree,tableBufferIR[tableObjet[id].convolver]);

		return param = {
				src:nsource,
				ndeb: ndeb,
				nfin: nfin}
	}
	
}
async function defSourceAudio(audioContext,nsource,id,gainNode,now,convolver){
	if(tableObjet[id].class==1){
		var typevar=tableObjet[id].envType;
		var tableGreffons=[];
		var nduree=nsource.buffer.duration/tableObjet[id].transposition;
		
	   gainNode=defSourceEnveloppe(id,nduree,gainNode,now);
		nsource.detune.value=tableObjet[id].detune;
		nsource.playbackRate.value=tableObjet[id].transposition;
		
		var ndeb=nduree*tableObjet[id].debut;
		if(tableObjet[id].convolver!="" && tableBufferIR[tableObjet[id].convolver].duration>nduree*tableObjet[id].fin){
			nfin=tableBufferIR[tableObjet[id].convolver].duration
		}else{
			var nfin=(nduree*tableObjet[id].fin)
		}
		
		var j=0;
		for(let i=0;i<7;i++){
			if(tableObjet[id].tableFx[i]!=""  && tableObjet[id].tableFx[i]!=0 ){
				j++;
			}
		}
		var nbg=j;
		console.log("nbfx",nbg)
		tableGreffons[0]=nsource;
		if(nbg==0){

			tableGreffons[0].connect(gainNode);
			//positionPanner();
			/*
			if(tableObjet[id].convolver==""){
				gainNode.connect(panner);
			}else{
				convolver.buffer=tableBufferIR[tableObjet[id].convolver];
				gainNode.connect(convolver);
				convolver.connect(panner);
			}
			//panner.connect(audioContext.destination);
			*/
			tableGreffons[0].connect(gainNode);
					
			if(tableObjet[id].convolver==""){
				gainNode.connect(audioContext.destination);
			}else{
				convolver.buffer=tableBufferIR[tableObjet[id].convolver];
				gainNode.connect(convolver);
				convolver.connect(audioContext.destination);
			}
			console.log("nsource an",nsource.buffer.duration)

		}else{
			var j=1;
		for(let i=0;i<7;i++){
			if(tableObjet[id].tableFx[i]!=""  && tableObjet[id].tableFx[i]!=0 ){
				const createFaustNode = async (audioContext, dspName , voices = 0, sp = false) => {
				    // Set to true if the DSP has an effect
				    const FAUST_DSP_HAS_EFFECT = false;
				
				    // Import necessary Faust modules and data
				    const { FaustMonoDspGenerator, FaustPolyDspGenerator } = await import("./greffons/"+dspName+"-wasm/faustwasm/index.js");
				
				    // Load DSP metadata from JSON
				    /** @type {FaustDspMeta} */
				    const dspMeta = await (await fetch("./greffons/"+dspName+"-wasm/dsp-meta.json")).json();
				
				    // Compile the DSP module from WebAssembly binary data
				    const dspModule = await WebAssembly.compileStreaming(await fetch("./greffons/"+dspName+"-wasm/dsp-module.wasm"));
				
				    // Create an object representing Faust DSP with metadata and module
				    /** @type {FaustDspDistribution} */
				    const faustDsp = { dspMeta, dspModule };
				
				    /** @type {FaustNode | null} */
				    let faustNode = null;
				
				    // Create either a polyphonic or monophonic Faust audio node based on the number of voices
				        // Create a standard Faust audio node
				        const generator = new FaustMonoDspGenerator();
				        faustNode = await generator.createNode(
				            audioContext,
				            dspName,
				            { module: faustDsp.dspModule, json: JSON.stringify(faustDsp.dspMeta), soundfiles: {} },
				            sp
				        );
				     
				
				    // Return an object with the Faust audio node and the DSP metadata
				     return { faustNode, dspMeta };
					}			
					
					const { faustNode, dspMeta: { name } } = await createFaustNode(audioContext, listeFx[tableObjet[id].tableFx[i]].greffon, 0);
    				if (!faustNode) throw new Error("Faust DSP not compiled");
    				
    				tableGreffons[j]=faustNode
    				console.log(faustNode)
						var dest= listeFx[tableObjet[id].tableFx[i]].paramname.split(',')
						console.log("dest",listeFx[tableObjet[id].tableFx[i]].paramname)
						var fxparam=tableObjet[id].tableFxParam[i].split('/')
						for(let m=0;m<fxparam.length;m++){
						var param=fxparam[m].split("&")
						console.log("dest",dest[m],"fxparam",fxparam[m]," param",param)
						var shiftParam = tableGreffons[j].parameters.get(dest[m]);
						var paramvalue=param[0].split("?")
						shiftParam.setValueAtTime(parseFloat(paramvalue[1]), now);
						for(k=1;k<param.length;k++){
							paramvalue=param[k].split("?")
							console.log('paramvalue',param[k]," ",param.length)
							shiftParam.linearRampToValueAtTime(parseFloat(paramvalue[1]), now + parseFloat(paramvalue[0]));
						}
						tableGreffons[j-1].connect(tableGreffons[j]);
						}
						console.log("faust",shiftParam,dest[i])
				j++;
				if (j>nbg) {
					tableGreffons[j-1].connect(gainNode);
					
					if(tableObjet[id].convolver==""){
						gainNode.connect(audioContext.destination);
					}else{
						convolver.buffer=tableBufferIR[tableObjet[id].convolver];
						gainNode.connect(convolver);
						convolver.connect(audioContext.destination);
					}
					
					
				}
			
		  }
		 }
		}
		
		return param = {
			src:nsource,
			ndeb: ndeb,
			nfin: nfin}
	}
	
}
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