//*******************************************************************************************************
//														objets
//*******************************************************************************************************
function getObjActif() {
	return objActif;
}
function getObjSelect() {
	return selectObj;
}
function muteObjet(id,mute) {
	tableObjet[id].mute=mute;
}
function gainObjet(id,g){
	if(g<0){
		g=0;
	}
	if(g>10){
		g=10;
	}
	tableObjet[id].gain=g;
}
function fadeInTypeObjet(id,type){
	if(type<1){
		type=0;
	}
	if(type>3){
		type=3;
	}
	tableObjet[id].fadeInType=type;
}
function fadeOutTypeObjet(id,type){
	if(type<1){
		type=0;
	}
	if(type>3){
		type=3;
	}
	tableObjet[id].fadeOutType=type;
}
function envObjet(id,x1,y1,x2,y2,x3,y3,x4,y4,x5,y5,x6,y6,x7,y7){
	if(x1<0){
		x1=0;
	}
	if(x1>x2){
		x1=x2-0.01;
	}
	tableObjet[id].envX[0]=x1;
	if(y1<0){
		y1=0;
	}
	if(y1>1){
		y1=1;
	}
	tableObjet[id].envY[0]=y1;
	if(x2<x1){
		x2=x1+0.01;
	}
	if(x2>x3){
		x2=x3-0.01;
	}
	tableObjet[id].envX[1]=x2;
	if(y2<0){
		y2=0;
	}
	if(y2>1){
		y2=1;
	}
	tableObjet[id].envY[1]=y2;
	if(x3<x2){
		x3=x2+0.01;
	}
	if(x3>x4){
		x3=x4-0.01;
	}
	tableObjet[id].envX[2]=x3;
	if(y3<0){
		y3=0;
	}
	if(y3>1){
		y3=1;
	}
	tableObjet[id].envY[2]=y3;
	if(x4<x3){
		x4=x3+0.01;
	}
	if(x4>x5){
		x4=x5-0.01;
	}
	tableObjet[id].envX[3]=x4;
	if(y4<0){
		y4=0;
	}
	if(y4>1){
		y4=1;
	}
	tableObjet[id].envY[3]=y4;
	if(x5<x4){
		x5=x4+0.01;
	}
	if(x5>x6){
		x5=x6-0.01;
	}
	tableObjet[id].envX[4]=x5;
	if(y5<0){
		y5=0;
	}
	if(y5>1){
		y5=1;
	}
	tableObjet[id].envY[4]=y5;
	if(x6<x5){
		x6=x5+0.01;
	}
	if(x6>x7){
		x6=x7-0.01;
	}
	tableObjet[id].envX[5]=x6;
	if(y6<0){
		y6=0;
	}
	if(y6>1){
		y6=1;
	}
	tableObjet[id].envY[5]=y6;
	if(x7<x6){
		x7=x6-0.01;
	}
	if(x7>1){
		x7=1;
	}
	tableObjet[id].envX[6]=x7;
	if(y7<0){
		y7=0;
	}
	if(y7>1){
		y7=1;
	}
	tableObjet[id].envY[6]=y7;
}
function detuneObjet(id,d){
	if(d<-1199){
		d=-1199;
	}
	if(d>1199){
		d=1199;
	}
	tableObjet[id].detune=d;
}
function dbfObjet(id,d,f){
	if(d<0){
		d=0;
	}
	if(d>f){
		d=f-0.01;
	}
	if(f<d){
		f=d+0.01;
	}
	if(f>1){
		f=1;
	}
	tableObjet[id].debut=d;
	tableObjet[id].fin=f;
}
function nameObjet(id,name){
	tableObjet[id].nom=name;
}
function trackObjet(id,track){
	tableObjet[id].piste=track;
}
function convolObjet(id,convol){
	if(convol<1){
		convol=0;
	}
	if(convol>32){
		convol=32;
	}
	if (convol<1){
		tableObjet[id].convolver="";
	}else{
		tableObjet[id].convolver=tableIR[convol];
	}
}
function reverseObjet(id,rv){
	tableObjet[id].reverse=rv;
}
function timePosObjet(id,t){
	if(t<0){
		t=0;
	}
	if(t>720){
		t=720;
	}
	tableObjet[id].posX=t*18*zoomScale;
	document.getElementById(tableObjet[id].id).style.left=tableObjet[id].posX+'px';
}
function rateObjet(id,etat,r){
	tableObjet[id].flagTranspo=etat;
	if(r<0.1){
		r=0.1;
	}
	if(r>2){
		r=2;
	}
	var ms=(spaceHeight-40)/2;
	var nh=r-1;
	if(r>1){
		tableObjet[id].posY=ms+(ms*nh);
	}else {
		tableObjet[id].posY=ms-(ms*nh);
	}
	document.getElementById(tableObjet[id].id).style.top=tableObjet[id].posY+'px';
	tableObjet[id].basePosY=((scrollDemo.scrollTop/zoomScale)+tableObjet[id].posY)*(1/ratioSpaceHeight);
	tableObjet[id].transposition=r;
}
function loadAudioTableBuffer(id,url) {
    var request = new XMLHttpRequest();
	    request.open('GET', url, true);
	    request.responseType = 'arraybuffer';
	    request.onload = function() {
	    contextAudio.decodeAudioData(request.response, function(buffer) {
	        tableObjet[id].duree = buffer.duration;
	        var pathnom=url.split('/');
	        tableObjet[id].file=pathnom[pathnom.length-1];
	        
	       var hasKey = -1;
	       var hasKey =tableBuffer.findIndex(elem => elem.name === pathnom[pathnom.length-1]);
			 
			 if(hasKey>-1){
			 	console.log("le fichier existe déjà",hasKey,tableBuffer);
			 	tableObjet[id].bufferId=hasKey;
	        }else{
	         tableBuffer.push({name:pathnom[pathnom.length-1],buffer:buffer});
	        	tableObjet[id].bufferId=tableBuffer.length-1;							
	        }
	    });
	    };
	    request.send();
}

function createObjet(t,etat,r,type,color){
	selectobjet(type,color);
	timePosObjet(objActif,t);
	rateObjet(objActif,etat,r);
}
//*******************************************************************************************************
//														Objet : éléments graphiques
//*******************************************************************************************************
function objetColor(id,color){
	tableObjet[id].objColor=color;
	document.getElementById(tableObjet[id].id).firstChild.firstChild.setAttribute("fill",color);
}
function objetDim(id,w,h){
	objScaleX(id,w);
	objScaleY(id,h);
}
function objetBordure(id,width,color,opacity){
	objetBordureWidth(id,width);
	objetBordureColor(id,color);
	objetOpacity(id,opacity);
}

function objetBkgColor(id,color){
	tableObjet[id].bkgColor=color;
	document.getElementById(tableObjet[id].id).style.backgroundColor=color;
}
function objetBkgDim(id,w,h){
	objetBkgWidth(id,w);
	objetBkgHeight(id,h);
}
function objetBkgOpacity(id,opacity){
	bkgOpacity(id,opacity);
}
function objetBkgTransparent(id){
	bkgTransparent(id);
}
function objCadreLeft(id,type,w,r,color){
	borderGaucheType(id,type);
	borderGaucheWidth(id,w);
	borderGaucheRadius(id,r);
	borderGaucheColor(id,color);
}
function objCadreTop(id,type,w,r,color){
	borderHautType(id,type);
	borderHautWidth(id,w);
	borderHautRadius(id,r);
	borderHautColor(id,color);
}
function objCadreRight(id,type,w,r,color){
	borderDroitType(id,type);
	borderDroitWidth(id,w);
	borderDroitRadius(id,r);
	borderDroitColor(id,color);
}
function objCadreBottom(id,type,w,r,color){
	borderBasType(id,type);
	borderBasWidth(id,w);
	borderBasRadius(id,r);
	borderBasColor(id,color);
}
function objetMarge(id,x,y){
	objetPlGauche(id,x);
	objetPlHaut(id,y);
}

//*******************************************************************************************************
//														symboles
//*******************************************************************************************************
function xPosSymb(id,x){
	if(x<0){
		x=0;
	}
	if(x>12960){
		x=12960;
	}
	tableObjet[id].posX=x;
	document.getElementById(tableObjet[id].id).style.left=tableObjet[id].posX+'px';
}
function yPosSymb(id,y){
	if(y<0){
		y=0;
	}
	if(y>spaceHeight-40){
		y=spaceHeight-40;
	}
	tableObjet[id].posY=y;
	document.getElementById(tableObjet[id].id).style.top=tableObjet[id].posY+'px';
}
function posSymb(id,x,y){
	xPosSymb(id,x);
	yPosSymb(id,y);
}
function rotateSymb(id,r){
	tableObjet[id].rotate=r;
	symbRotate(id,r);
}
function gCadreSymb(id,gstyle,geps,grd,gcolor){
	borderGaucheType(id,gstyle);
	borderGaucheWidth(id,geps);
	borderGaucheRadius(id,grd); 
	borderGaucheColor(id,gcolor);
}
function hCadreSymb(id,gstyle,geps,grd,gcolor){
	borderHautType(id,gstyle);
	borderHautWidth(id,geps);
	borderHautRadius(id,grd); 
	borderHautColor(id,gcolor);
}
function dCadreSymb(id,gstyle,geps,grd,gcolor){
	borderDroitType(id,gstyle);
	borderDroitWidth(id,geps);
	borderDroitRadius(id,grd); 
	borderDroitColor(id,gcolor);
}
function bCadreSymb(id,gstyle,geps,grd,gcolor){
	borderBasType(id,gstyle);
	borderBasWidth(id,geps);
	borderBasRadius(id,grd); 
	borderBasColor(id,gcolor);
}
function cadreSymb(id,gstyle,geps,grd,gcolor){
	gCadreSymb(id,gstyle,geps,grd,gcolor);
	hCadreSymb(id,gstyle,geps,grd,gcolor);
	dCadreSymb(id,gstyle,geps,grd,gcolor); 
	bCadreSymb(id,gstyle,geps,grd,gcolor);
}
function bkgSymb(id,opacity,width,height,color){
	bkgOpacity(id,opacity);
	symbBkgColor(id,color);
	symbBkgWidth(id,width);
	symbBkgHeight(id,height);
}
function createSymbole(x,y,type,color){
	selectSymboleb(type,color);
	xPosSymb(objActif,x);
	yPosSymb(objActif,y);
}
//*******************************************************************************************************
//														groupe
//*******************************************************************************************************

function createGroupe(color,w,liste){
	var lst=liste.split(",");
	objActif=nbObjets;
	selectObj="grp"+nbObjets;
	var refViewBoxHeight=parseFloat(document.getElementById("space").style.height);
	tableObjet[objActif] = {
		bkgColor:"#ffffff",
		bkgHeight:10,
		bkgImg:"",
		bkgOpacity:1,
		bkgTrp:true,
		bkgWidth:10,
		borderBc:"#000000",
		borderBr:'0%',
		borderBs:'none',
		borderBw:0,
		borderDc:"#000000",
		borderDr:'0%',
		borderDs:'none',
		borderDw:0,
		borderGc:"#000000",
		borderGr:'0%',
		borderGs:'none',
		borderGw:0,
		borderHc:'#000000',
		borderHr:'0%',
		borderHs:'none',
		borderHw:0,
		class:4,
		etat:1,
		height:0,
		id:selectObj,
		groupe:16777216,
		liste:[].concat(lst),
		margeG:0,
		margeH:0,
		nom:selectObj,
		objBorderC:'#008000',
		objBorderW:0,
		posX:0,
		posY:0,
		r:0,
		rotate:0,
		scaleX:1.0,
		scaleY:1.0,
		width:0
	};
	for(let i=0;i<lst.length;i++){
		tableObjet[lst[i]].groupe=objActif;
	}
	graphGrp(objActif);
	dragElement(document.getElementById(selectObj));
	document.getElementById(selectObj).addEventListener('mouseup',selectBkgObj);
	nbObjets++;
	var minl=tableObjet[lst[0]].posX;
 	var mint=tableObjet[lst[0]].posY;
 	var maxl=tableObjet[lst[0]].posX+(tableObjet[lst[0]].bkgWidth);
 	var maxt=tableObjet[lst[0]].posY+(tableObjet[lst[0]].bkgHeight);
 	for(let i=1;i<lst.length;i++){
 			if(tableObjet[lst[i]].posX<minl){
 				minl=tableObjet[lst[i]].posX;
 			}
 			if(tableObjet[lst[i]].posY<mint){
 				mint=tableObjet[lst[i]].posY;
 			}
 			if(tableObjet[lst[i]].posX+(tableObjet[lst[i]].bkgWidth)>maxl){
 				maxl=tableObjet[lst[i]].posX+(tableObjet[lst[i]].bkgWidth);
 			}
 			if(tableObjet[lst[i]].posY+(tableObjet[lst[i]].bkgHeight)>maxt){
 				maxt=tableObjet[lst[i]].posY+(tableObjet[lst[i]].bkgHeight);
 			}
 	}	
 	minl=minl-4;
 	maxl=maxl+2;
 	mint=mint+2;
 	maxt=maxt+4;
	tableObjet[objActif].posX=minl;
	document.getElementById(tableObjet[objActif].id).style.left=tableObjet[objActif].posX+'px';
	tableObjet[objActif].posY=mint;
	document.getElementById(tableObjet[objActif].id).style.top=tableObjet[objActif].posY+'px';
	tableObjet[objActif].width=maxl-minl;
	tableObjet[objActif].height=maxt-mint;
	tableObjet[objActif].bkgWidth=maxl-minl;
	tableObjet[objActif].bkgHeight=maxt-mint;
	document.getElementById(tableObjet[objActif].id).style.width=tableObjet[objActif].bkgWidth+'px';
	document.getElementById(tableObjet[objActif].id).style.height=tableObjet[objActif].bkgHeight+'px';
	cadreSymb(objActif,'solid',w,'0%',color);
}
function dimCadreGroupe(id,w,h){
	grpBkgWidth(id,w);
	grpBkgHeight(id,h);
}
function borderGrpLeft(id,style,eps,r,color){
	borderGrpGType(id,style);
	borderGrpGWidth(id,eps);
	borderGrpGRadius(id,r); 
	borderGrpGColor(id,color);
}
function borderGrpTop(id,style,eps,r,color){
	borderGrpHType(id,style);
	borderGrpHWidth(id,eps);
	borderGrpHRadius(id,r); 
	borderGrpHColor(id,color);
}
function borderGrpRight(id,style,eps,r,color){
	borderGrpDType(id,style);
	borderGrpDWidth(id,eps);
	borderGrpDRadius(id,r); 
	borderGrpDColor(id,color);
}
function borderGrpBottom(id,style,eps,r,color){
	borderGrpBType(id,style);
	borderGrpBWidth(id,eps);
	borderGrpBRadius(id,r); 
	borderGrpBColor(id,color);
}
function cadreGrp(id,gstyle,geps,grd,gcolor){
	borderGrpLeft(id,gstyle,geps,grd,gcolor);
	borderGrpTop(id,gstyle,geps,grd,gcolor);
	borderGrpRight(id,gstyle,geps,grd,gcolor); 
	borderGrpBottom(id,gstyle,geps,grd,gcolor);
}
function bkgGroupe(id,width,height,color,opacity){
	grpBkgWidth(id,width);
	grpBkgHeight(id,height);
	grpBkgColor(id,color);
	bkgGrpOpacity(id,opacity);
}
function groupeTransparent(id){
	bkgTransparent(id);
}
//*******************************************************************************************************
//														functions génrérales
//*******************************************************************************************************
function copyObjets(obj) {
	grpSelect=1;
	copySelect=[];
 	copySelect=obj.split(',');
 	for(let i=0;i<copySelect.length;i++){
 		copySelect[i]=parseInt(copySelect[i]);
 	}
 	console.log(copySelect);
 	grpSelect=0;
}
function pasteObjets(x,y) {
	collerA(x,y);
}
//*******************************************************************************************************
//														fenêtre popup
//*******************************************************************************************************
function openPopup(title,x,y,width,height,padding,content) {
	var dupnode=document.createElement('div');
	dupnode.setAttribute("id","popup"+title);
	dupnode.setAttribute("class","popup");
	dupnode.setAttribute("style","position:absolute;top:"+y+"px;left:"+x+"px;width:"+width+"px"+";height:"+height+"px;");
	var dupnode1=document.createElement('div');
	dupnode1.setAttribute("id","popup"+title+"Header");
	dupnode1.setAttribute("class","popupHeader");
	dupnode.appendChild(dupnode1);
	var dupnode2=document.createElement('div');
	dupnode2.setAttribute("id","popupContent"+title);
	dupnode.appendChild(dupnode2);
	document.getElementsByTagName('body')[0].appendChild(dupnode);
	dragElement(dupnode);
	document.getElementById('popup'+title+"Header").style.color=popupFontTitreColor;
	document.getElementById('popup'+title+"Header").innerHTML="<b>"+title+"</b>";
	document.getElementById('popupContent'+title).innerHTML=content;
	document.getElementById('popup'+title).style.display='block';
}
function closePopup(title) {
	document.getElementById('popup'+title).style.display='none';
	document.getElementById('popup'+title).remove();
}
//*******************************************************************************************************
//														fx
//*******************************************************************************************************

function fxOnDef(id,name) {
	idFxParam=id;
	tableObjet[objActif].tableFx[id]=name;
	console.log(listeFx[name]);
	//tableObjet[objActif].tableFxParam[idFxParam]=listeFx[id].defaut
}
function fxDefParam(id,param) {
	tableObjet[objActif].tableFxParam[id]=param;
}
//*******************************************************************************************************
//														Audio
//*******************************************************************************************************
/**
 * Calcule le RMS et le niveau en dB d'un tableau de samples audio
 * @param {Float32Array|number[]} samples - tableau d'échantillons (valeurs entre -1 et 1)
 * @param {number} gain - gain linéaire à appliquer (par défaut 1)
 * @returns {number} niveau en dB
 */
function rmsToDb(samples, gain = 1) {
    if (!samples || samples.length === 0) return -Infinity;

    // Calcul du RMS
    let sumSquares = 0;
    for (let i = 0; i < samples.length; i++) {
        sumSquares += samples[i] * samples[i];
    }
    const rms = Math.sqrt(sumSquares / samples.length);

    // Appliquer le gain et convertir en dB
    const rmsWithGain = rms * gain;
    const db = 20 * Math.log10(rmsWithGain);

    return db;
}
/**
 * Calcule le RMS et le niveau en dB d'un AudioBuffer Web Audio
 * @param {AudioBuffer} audioBuffer - AudioBuffer contenant les pistes
 * @param {number} gain - gain linéaire à appliquer (optionnel, défaut 1)
 * @returns {number} Niveau moyen en dB
 */
function getRmsDbFromAudioBuffer(audioBuffer, gain = 1) {
    if (!audioBuffer) return -Infinity;

    let sumSquares = 0;
    let totalSamples = 0;

    // Parcourir toutes les pistes
    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
        const samples = audioBuffer.getChannelData(channel);
        totalSamples += samples.length;

        for (let i = 0; i < samples.length; i++) {
            sumSquares += samples[i] * samples[i];
        }
    }

    if (totalSamples === 0) return -Infinity;

    // Calcul du RMS
    const rms = Math.sqrt(sumSquares / totalSamples);

    // Appliquer le gain et convertir en dB
    const rmsWithGain = rms * gain;
    const db = 20 * Math.log10(rmsWithGain);

    return db;
}
/**
 * Calcule le RMS et le niveau en dB pour chaque piste d'un AudioBuffer
 * @param {AudioBuffer} audioBuffer - AudioBuffer contenant les pistes
 * @param {number} gain - gain linéaire à appliquer à chaque piste (optionnel, défaut 1)
 * @returns {Array} tableau d'objets { channel: numéro, rms: RMS linéaire, db: niveau en dB }
 */
function getRmsDbPerChannel(audioBuffer, gain = 1) {
    if (!audioBuffer) return [];

    const results = [];

    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
        const samples = audioBuffer.getChannelData(channel);
        if (!samples || samples.length === 0) {
            results.push({ channel, rms: 0, db: -Infinity });
            continue;
        }

        // Calcul du RMS
        let sumSquares = 0;
        for (let i = 0; i < samples.length; i++) {
            sumSquares += samples[i] * samples[i];
        }
        const rms = Math.sqrt(sumSquares / samples.length);

        // Appliquer le gain et convertir en dB
        const rmsWithGain = rms * gain;
        const db = 20 * Math.log10(rmsWithGain);

        results.push({ channel, rms, db });
    }

    return results;
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
		var localDuree=tableObjet[i].duree/tableObjet[i].transposition;
		lgi= localDuree/ratioT;
		console.log("last",i,tableObjet[i].posX,tableObjet[i].posX+lgi,localDuree);
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
function secondeToAdmTime(stime) {

 	var ht=0;
	var mt=Math.floor(stime/60);
	var st=Math.floor(stime%60);
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
 	
 	var ct=(stime-((dheures*3600)+(dminutes*60)+dsecondes)).toFixed(5);
 	var dcid=ct.toString().indexOf(".");
 	ct=ct.toString().substring(dcid);
	return ntime={
		h:ht,
		m:mt,
		s:st+ct
	};
}
async function removeSilenceFromStart(audioBuffer, threshold = 0.001) {
	/*
	Explications
threshold: Définit le niveau en dessous duquel on considère un échantillon comme silence (ex. 0.001).
startOffset: Position du premier échantillon dépassant le seuil de silence pour chaque canal.
trimmedBuffer: Nouveau AudioBuffer sans silence au début, contenant les données audio à partir de startOffset.
	*/
  const { numberOfChannels, sampleRate, length } = audioBuffer;
  let startOffset = 0;

  // Parcourir chaque canal et trouver le début du signal
  for (let channel = 0; channel < numberOfChannels; channel++) {
    const channelData = audioBuffer.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      if (Math.abs(channelData[i]) > threshold) {
        startOffset = Math.max(startOffset, i); // Obtenir l'index max de chaque canal
        break;
      }
    }
  }

  // Calculer la durée à partir du début du signal
  const trimmedLength = length - startOffset;
  const trimmedBuffer = new AudioBuffer({
    length: trimmedLength,
    numberOfChannels,
    sampleRate,
  });

  // Copier les données sans silence dans le nouveau buffer
  for (let channel = 0; channel < numberOfChannels; channel++) {
    trimmedBuffer.copyToChannel(
      audioBuffer.getChannelData(channel).subarray(startOffset),
      channel
    );
  }

  return trimmedBuffer;
}
function removeEndSpikes(audioBuffer, tailDuration, threshold) {
  const sampleRate = audioBuffer.sampleRate;
  const nChannels = audioBuffer.numberOfChannels;
  const len = audioBuffer.length;
  const startIndex = Math.max(0, len - Math.floor(tailDuration * sampleRate));

  for (let ch = 0; ch < nChannels; ch++) {
    const data = audioBuffer.getChannelData(ch);
    for (let i = startIndex; i < len; i++) {
      if (Math.abs(data[i]) > threshold) data[i] = 0;
    }
  }
  return audioBuffer;
}
function trimBeforEnd(context, audioBuffer, duration ) {
  const sampleRate = audioBuffer.sampleRate;
  const numChannels = audioBuffer.numberOfChannels;
  const length = audioBuffer.length;
  duration=duration*48000;
  
  let cutoffIndex = Math.min(length-duration, length);
console.log("cutoffIndex",length,length-duration,cutoffIndex);
  // Créer un nouveau buffer coupé
  const trimmed = context.createBuffer(numChannels, cutoffIndex, sampleRate);
  for (let ch = 0; ch < numChannels; ch++) {
    const src = audioBuffer.getChannelData(ch);
    trimmed.copyToChannel(src.subarray(0, cutoffIndex), ch);
  }

  return trimmed;
}
function trimAfterSilence(context, audioBuffer, silenceDuration, threshold ) {
  const sampleRate = audioBuffer.sampleRate;
  const numChannels = audioBuffer.numberOfChannels;
  const length = audioBuffer.length;
  const silenceSamples = Math.floor(silenceDuration * sampleRate);
  const nbuffer=removeEndSpikes(audioBuffer, 0.1, 0.1);
  let lastActiveSample = 0;
  let consecutiveSilent = 0;

  for (let i = 0; i < length; i++) {
    let active = false;

    for (let ch = 0; ch < numChannels; ch++) {
      const data = nbuffer.getChannelData(ch);
      if (Math.abs(data[i]) > threshold) {
        active = true;
        break;
      }
    }

    if (active) {
      lastActiveSample = i;
      consecutiveSilent = 0;
    } else {
      consecutiveSilent++;
    }
  }
	console.log("silenceSamples",consecutiveSilent,lastActiveSample/48000,silenceSamples,length/48000);
  // S'il reste plus de silence que la durée autorisée à la fin
  let cutoffIndex = Math.min(lastActiveSample + silenceSamples, length);

  // Créer un nouveau buffer coupé
  const trimmed = context.createBuffer(numChannels, cutoffIndex, sampleRate);
  for (let ch = 0; ch < numChannels; ch++) {
    const src = nbuffer.getChannelData(ch);
    trimmed.copyToChannel(src.subarray(0, cutoffIndex), ch);
  }

  return trimmed;
}
function trimSilenceAtEnd(context,audioBuffer, threshold = 0.001) {
	/*
	Explications
threshold : Détermine le niveau en dessous duquel un échantillon est considéré comme du silence. Un seuil de 0.001 est généralement adéquat pour la plupart des situations, mais vous pouvez l'ajuster.
endIndex : Indique l'index du dernier échantillon significatif dans le buffer.
subarray(0, endIndex) : Sélectionne uniquement la partie utile du buffer, en excluant les silences de la fin.
copyToChannel() : Copie les données significatives dans un nouveau buffer de taille réduite.
	*/
  const sampleRate = audioBuffer.sampleRate;
  const numberOfChannels = audioBuffer.numberOfChannels;
  const bufferLength = audioBuffer.length;

  // Variable pour stocker l'index du dernier échantillon significatif
  let endIndex = bufferLength;

  // Parcourir chaque canal pour trouver la fin du signal
  for (let channel = 0; channel < numberOfChannels; channel++) {
    const channelData = audioBuffer.getChannelData(channel);

    // Recherche du dernier échantillon avec un niveau supérieur au seuil
    for (let i = bufferLength - 1; i >= 0; i--) {
      if (Math.abs(channelData[i]) > threshold) {
        endIndex = Math.min(endIndex, i + 1);
        break;
      }
    }
  }

  // Si endIndex est égal à la longueur initiale, il n'y a pas de silence à la fin
  if (endIndex === bufferLength) {
    return audioBuffer;
  }

  // Créer un nouveau buffer avec seulement la partie utile
  const trimmedBuffer = context.createBuffer(
    numberOfChannels,
    endIndex,
    sampleRate
  );

  // Copier les données utiles dans le nouveau buffer
  for (let channel = 0; channel < numberOfChannels; channel++) {
    const channelData = audioBuffer.getChannelData(channel).subarray(0, endIndex);
    trimmedBuffer.copyToChannel(channelData, channel);
  }

  return trimmedBuffer;
}
function removeSilenceFromStartSimple(audioBuffer) {
	const channelData = audioBuffer.getChannelData(0); // Supposons que nous travaillons avec un buffer mono
	const newLength = channelData.length;
    const newAudioBuffer = contextAudio.createBuffer(2, newLength, audioBuffer.sampleRate);
	for(k=0;k<2;k++){
    
    var startIndex = 0;
    
    const channelData = audioBuffer.getChannelData(k);

    // Trouver l'index de début du premier échantillon non silencieux
    for (let i = 0; i < channelData.length; i++) {
        if (Math.abs(channelData[i]) > 0.01) { // Vous pouvez ajuster ce seuil selon vos besoins
            startIndex = i;
            break;
        }
    }

    // Créer un nouveau buffer audio sans les silences au début
    
    const newChannelData = newAudioBuffer.getChannelData(k);

    // Copier les données audio du buffer original vers le nouveau buffer
    for (let i = 0; i < newLength; i++) {
        newChannelData[i] = channelData[i + startIndex];
    }
	}
    return newAudioBuffer;
}
function addSilenceToBuffer(audioContext, originalBuffer, silenceDuration) {
    // Calculer le nombre d'échantillons pour le silence
    const sampleRate = originalBuffer.sampleRate;
    const silenceSamples = Math.floor(sampleRate * silenceDuration)+1;
    // Créer un nouveau buffer avec la durée totale (silence + son original)
    const totalDuration = originalBuffer.duration + silenceDuration;
    const totalSamples = sampleRate * totalDuration;
    const newBuffer = audioContext.createBuffer(2, totalSamples, sampleRate);

    // Remplir le nouveau buffer avec du silence
    for (let channel = 0; channel < 2; channel++) {
        const channelData = newBuffer.getChannelData(channel);
        for (let i = 0; i < silenceSamples; i++) {
            channelData[i] = 0; // Silence
        }
    }

    // Copier les données audio originales après le silence
    for (let channel = 0; channel < 2; channel++) {
        const originalChannelData = originalBuffer.getChannelData(channel);
        const newChannelData = newBuffer.getChannelData(channel);
        for (let i = 0; i < originalChannelData.length; i++) {
            newChannelData[i + silenceSamples] = originalChannelData[i];
        }
    }

    return newBuffer;
}
/* Exemple d'utilisation
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
fetch('path/to/audiofile.mp3')
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
    .then(audioBuffer => {
        const trimmedAudioBuffer = removeSilenceFromStart(audioBuffer);
        // Vous pouvez maintenant utiliser trimmedAudioBuffer comme vous le souhaitez
    });
 */
function insertAudioBufferPart(targetBuffer, sourceBuffer, targetOffset, sourceStart = 0, sourceEnd = sourceBuffer.length) {
	/*
Explications des paramètres
targetBuffer : L'AudioBuffer cible dans lequel vous souhaitez insérer les données.
sourceBuffer : L'AudioBuffer dont vous souhaitez copier une partie.
targetOffset : La position (en échantillons) dans targetBuffer où insérer la portion de sourceBuffer.
sourceStart et sourceEnd : Les indices d'échantillons pour définir la portion de sourceBuffer à copier.
*/

  const numberOfChannels =sourceBuffer.numberOfChannels;
  const sourceLength = sourceEnd - sourceStart;
  // Parcourir chaque canal pour copier les données
  for (let channel = 0; channel < numberOfChannels; channel++) {
    const targetChannelData = targetBuffer.getChannelData(channel);
    const sourceChannelData = sourceBuffer.getChannelData(channel).subarray(sourceStart, sourceEnd);

    // Copier les données du buffer source dans le buffer cible à l'offset spécifié
    targetChannelData.set(sourceChannelData, targetOffset);
  }
}
function insertAdmBufferPart(targetBuffer,targetChannel, sourceBuffer, targetOffset, sourceStart = 0, sourceEnd = sourceBuffer.length) {
	/*
Explications des paramètres
targetBuffer : L'AudioBuffer cible dans lequel vous souhaitez insérer les données.
sourceBuffer : L'AudioBuffer dont vous souhaitez copier une partie.
targetOffset : La position (en échantillons) dans targetBuffer où insérer la portion de sourceBuffer.
sourceStart et sourceEnd : Les indices d'échantillons pour définir la portion de sourceBuffer à copier.
*/

  //const numberOfChannels =sourceBuffer.numberOfChannels;
  const sourceLength = sourceEnd - sourceStart;
  // Parcourir chaque canal pour copier les données
  for (let channel = 0; channel < 2; channel++) {
    const targetChannelData = targetBuffer.getChannelData(targetChannel+channel);
    const sourceChannelData = sourceBuffer.getChannelData(channel).subarray(sourceStart, sourceEnd);

    // Copier les données du buffer source dans le buffer cible à l'offset spécifié
    const available = targetChannelData.length - targetOffset;
    if (available <= 0) continue;
    const clippedSrc = sourceChannelData.length > available ? sourceChannelData.subarray(0, available) : sourceChannelData;
    targetChannelData.set(clippedSrc, targetOffset);
  }
}
function insertMonoBufferPart(targetBuffer,targetChannel, sourceBuffer, targetOffset, sourceStart = 0, sourceEnd = sourceBuffer.length) {
	/*
Explications des paramètres
targetBuffer : L'AudioBuffer cible dans lequel vous souhaitez insérer les données.
sourceBuffer : L'AudioBuffer dont vous souhaitez copier une partie.
targetOffset : La position (en échantillons) dans targetBuffer où insérer la portion de sourceBuffer.
sourceStart et sourceEnd : Les indices d'échantillons pour définir la portion de sourceBuffer à copier.
*/

  //const numberOfChannels =sourceBuffer.numberOfChannels;
  const sourceLength = sourceEnd - sourceStart;
  // Parcourir chaque canal pour copier les données
  channel = 0; 
    const targetChannelData = targetBuffer.getChannelData(targetChannel+channel);
    const sourceChannelData = sourceBuffer.getChannelData(channel).subarray(sourceStart, sourceEnd);

    // Copier les données du buffer source dans le buffer cible à l'offset spécifié
    targetChannelData.set(sourceChannelData, targetOffset);
  
}
function audioBufferToWav(sampleRate, channelBuffers, axml, chna, tracks) {
  const totalSamples = channelBuffers[0].length * channelBuffers.length;
  const activeCount = tableObjet.filter(o => o.etat === 1).length;
  const nbobjs = activeCount * 2;
  const chnaDataSize = 4 + (40 * nbobjs);
  const dataStart = 80 + chnaDataSize;  // fmt ends at 72, chna = 8 + chnaDataSize
  const bufferSize = dataStart + 8 + (totalSamples * 2) + 8 + axml.length;
  const buffer = new ArrayBuffer(bufferSize);
  const view = new DataView(buffer);

  const writeString = (view, offset, string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  console.log('channelBuffers.length', channelBuffers.length);

  // RIFF header
  writeString(view, 0, "RIFF");
  view.setUint32(4, bufferSize - 8, true);
  writeString(view, 8, "WAVE");

  // JUNK chunk (placeholder, 36 bytes total)
  writeString(view, 12, 'JUNK');
  view.setUint32(16, 28, true);
  view.setUint32(20, 0, true);
  view.setUint32(24, 0, true);
  view.setUint32(28, totalSamples * 2, true);
  view.setUint32(32, 0, true);
  view.setUint32(36, 0, true);
  view.setUint32(40, 0, true);
  view.setUint32(44, 0, true);

  // fmt chunk (24 bytes total, offset 48-71)
  writeString(view, 48, "fmt ");
  view.setUint32(52, 16, true);
  view.setUint16(56, 1, true);
  view.setUint16(58, channelBuffers.length, true);
  view.setUint32(60, sampleRate, true);
  view.setUint32(64, sampleRate * channelBuffers.length * 2, true);
  view.setUint16(68, channelBuffers.length * 2, true);
  view.setUint16(70, 16, true);

  // chna chunk (before data, per BW64 spec ITU-R BS.2088)
  writeString(view, 72, "chna");
  view.setUint32(76, chnaDataSize, true);
  view.setUint16(80, tracks * 2, true);
  view.setUint16(82, nbobjs, true);

  var cmax = nbtracks + 1;
  var nbobjets = tableObjet.length;
  var coffset = 1;
  var chnaStr = "";
  var chnaOff = 84;
  for (let i = 1; i < cmax; i++) {
    for (j = 0; j < nbobjets; j++) {
      if (tableObjet[j].etat == 1 && tableObjet[j].piste == i) {
        var at = 4096 + coffset;
        var idx = numToHex16String(coffset);
        view.setUint16(chnaOff, (i * 2) - 1, true);
        chnaOff += 2;
        chnaStr = 'ATU_0000' + idx + 'AT_0003' + at.toString(16) + '_01AP_0003' + at.toString(16);
        for (let m = 0; m < 38; m++) { view.setUint8(chnaOff + m, chnaStr.charCodeAt(m)); }
        chnaOff += 38;
        coffset++;
      }
    }
    for (j = 0; j < nbobjets; j++) {
      if (tableObjet[j].etat == 1 && tableObjet[j].piste == i) {
        var at = 4096 + coffset;
        var idx = numToHex16String(coffset);
        view.setUint16(chnaOff, (i * 2), true);
        chnaOff += 2;
        chnaStr = 'ATU_0000' + idx + 'AT_0003' + at.toString(16) + '_01AP_0003' + at.toString(16);
        for (let m = 0; m < 38; m++) { view.setUint8(chnaOff + m, chnaStr.charCodeAt(m)); }
        chnaOff += 38;
        coffset++;
      }
    }
  }

  // data chunk
  writeString(view, dataStart, "data");
  view.setUint32(dataStart + 4, totalSamples * 2, true);

  // PCM audio (16-bit interleaved)
  let offset = dataStart + 8;
  for (let i = 0; i < channelBuffers[0].length; i++) {
    for (let channel = 0; channel < channelBuffers.length; channel++) {
      const s = Math.max(-1, Math.min(1, channelBuffers[channel][i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
      offset += 2;
    }
  }

  // axml chunk (after data)
  writeString(view, offset, "axml");
  view.setUint32(offset + 4, axml.length, true);
  offset += 8;
  for (let i = 0; i < axml.length; i++) {
    view.setUint8(offset + i, axml.charCodeAt(i));
  }

  return buffer;
}
function convertStereoToMono(audioBuffer) {
  const numberOfChannels = audioBuffer.numberOfChannels;
  if (numberOfChannels === 1) {
    // Déjà en mono
    return audioBuffer;
  }

  const sampleRate = audioBuffer.sampleRate;
  const bufferLength = audioBuffer.length;

  // Créer un nouveau buffer mono
  //const context = audioBuffer.context || new AudioContext();
  const monoBuffer = contextAudio.createBuffer(1, bufferLength, sampleRate);

  // Obtenir les données des deux canaux
  const leftChannel = audioBuffer.getChannelData(0);
  const rightChannel = audioBuffer.getChannelData(1);
  const monoChannel = monoBuffer.getChannelData(0);

  // Calculer la moyenne des canaux gauche et droit
  for (let i = 0; i < bufferLength; i++) {
    monoChannel[i] = (leftChannel[i] + rightChannel[i]) / 2;
  }

  return monoBuffer;
}

function convertoFloat32ToInt16(buffer) {
  var l = buffer.length;  //Buffer
  var buf = new Int16Array(l/3);

  while (l--) {
    s = Math.max(-1, Math.min(1, samples[l]));
    buf[l] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    //buf[l] = buffer[l]*0xFFFF; //old   //convert to 16 bit
  }
  return buf.buffer;
}

function defAxml(nbtracks) {
	var txt='<?xml version="1.0" encoding="UTF-8"?>\n\
<ebuCoreMain xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns="urn:ebu:metadata-schema:ebuCore" xml:lang="en">\n\
  <coreMetadata>\n\
    <title typeLabel="FileTitle">\n\
      <dc:title xml:lang="en">'+paramProjet.name+'</dc:title>\n\
    </title>\n\
    <creator>\n\
      <organisationDetails>\n\
        <organisationName>KandiskyScore</organisationName>\n\
      </organisationDetails>\n\
    </creator>\n\
    <description typeLabel="Description" typeLink="http://www.ebu.ch/metadata/cs/ebu_DescriptionTypeCodeCS.xml#1">\n\
      <dc:description>'+paramProjet.comment+': '+paramProjet.name+' ('+nbtracks+' tracks, '+tableObjet.length+' objects)\n\
    </dc:description>\n\
    </description>\n\
    <date>\n\
      <created startDate="'+paramProjet.start+'"/>\n\
    </date>\n\
    <format>\n\
    	<audioFormatExtended>\n';

	// Collecter les objets actifs dans l'ordre des pistes
	var cmax = nbtracks + 1;
	var nbobjets = tableObjet.length;
	var activeObjs = [];
	for (let i = 1; i < cmax; i++) {
		for (let j = 0; j < nbobjets; j++) {
			if (tableObjet[j].etat == 1 && tableObjet[j].piste == i) {
				activeObjs.push(tableObjet[j]);
			}
		}
	}
	var N = activeObjs.length;

	// ── audioObject (un par objet, deux audioTrackUIDRef) ──────────────────────
	for (let n = 0; n < N; n++) {
		var o = activeObjs[n];
		var idx = n + 1;
		var ao_s  = numToHex16String(idx);
		var atu_L = numToHex16String(2*idx - 1);
		var atu_R = numToHex16String(2*idx);
		var debut = o.posX * (720/12960);
		var tm = secondeToAdmTime(debut);
		var dt = tm.h+':'+tm.m+':'+tm.s;
		var duree = o.duree / o.transposition;
		var d = secondeToAdmTime(duree);
		txt += '<audioObject audioObjectID="AO_0003'+ao_s+'" audioObjectName="Object '+idx+'" start="'+dt+'" duration="'+d.h+':'+d.m+':'+d.s+'">\n\
          <audioPackFormatIDRef>AP_0003'+ao_s+'</audioPackFormatIDRef>\n\
          <audioTrackUIDRef>ATU_0000'+atu_L+'</audioTrackUIDRef>\n\
          <audioTrackUIDRef>ATU_0000'+atu_R+'</audioTrackUIDRef>\n\
        </audioObject>\n';
	}

	// ── audioPackFormat (un par objet, deux audioChannelFormatIDRef) ───────────
	for (let n = 0; n < N; n++) {
		var idx = n + 1;
		var ap_s  = numToHex16String(idx);
		var ac_sL = numToHex16String(2*idx - 1);
		var ac_sR = numToHex16String(2*idx);
		txt += '<audioPackFormat audioPackFormatID="AP_0003'+ap_s+'" audioPackFormatName="object '+idx+'" typeLabel="0003" typeDefinition="Objects">\n\
          <audioChannelFormatIDRef>AC_0003'+ac_sL+'</audioChannelFormatIDRef>\n\
          <audioChannelFormatIDRef>AC_0003'+ac_sR+'</audioChannelFormatIDRef>\n\
        </audioPackFormat>\n';
	}

	// ── audioChannelFormat (L et R par objet, même données spatiales) ──────────
	for (let n = 0; n < N; n++) {
		var o = activeObjs[n];
		var idx = n + 1;
		var duree = o.duree / o.transposition;
		for (let ch = 0; ch < 2; ch++) {
			var ac_s   = numToHex16String(2*idx - 1 + ch);
			var chName = ch === 0 ? 'L' : 'R';
			txt += '<audioChannelFormat audioChannelFormatID="AC_0003'+ac_s+'" audioChannelFormatName="object '+idx+' '+chName+'" typeDefinition="Objects">\n';
			if (o.spT.length > 1) {
				var rt2 = 0;
				for (let m = 0; m < o.spT.length; m++) {
					var rtime = secondeToAdmTime(rt2);
					var rt = (m === o.spT.length - 1) ? duree : o.spT[m+1] * duree;
					var duration = rt - rt2;
					var dr = secondeToAdmTime(duration);
					var blk_s = ('0000000' + (m+1).toString(16)).slice(-8);
					txt += '<audioBlockFormat audioBlockFormatID="AB_0003'+ac_s+'_'+blk_s+'" rtime="'+rtime.h+':'+rtime.m+':'+rtime.s+'" duration="'+dr.h+':'+dr.m+':'+dr.s+'">\n\
					      <position coordinate="X">'+o.spX[m]+'</position>\n\
					      <position coordinate="Y">'+o.spZ[m]+'</position>\n\
					      <position coordinate="Z">'+o.spY[m]+'</position>\n\
					      <cartesian>1</cartesian>\n\
					    </audioBlockFormat>\n';
					rt2 = rt;
				}
			} else {
				txt += '<audioBlockFormat audioBlockFormatID="AB_0003'+ac_s+'_00000001">\n\
					      <position coordinate="X">'+o.spX[0]+'</position>\n\
					      <position coordinate="Y">'+o.spZ[0]+'</position>\n\
					      <position coordinate="Z">'+o.spY[0]+'</position>\n\
					      <cartesian>1</cartesian>\n\
					    </audioBlockFormat>\n';
			}
			txt += '</audioChannelFormat>\n';
		}
	}

	// ── audioStreamFormat (L et R par objet) ───────────────────────────────────
	for (let n = 0; n < N; n++) {
		var idx = n + 1;
		for (let ch = 0; ch < 2; ch++) {
			var s = numToHex16String(2*idx - 1 + ch);
			var chName = ch === 0 ? 'L' : 'R';
			txt += '<audioStreamFormat audioStreamFormatID="AS_0003'+s+'" audioStreamFormatName="object '+idx+' '+chName+'" formatLabel="0001" formatDefinition="PCM">\n\
          <audioChannelFormatIDRef>AC_0003'+s+'</audioChannelFormatIDRef>\n\
          <audioTrackFormatIDRef>AT_0003'+s+'_01</audioTrackFormatIDRef>\n\
          </audioStreamFormat>\n';
		}
	}

	// ── audioTrackFormat (L et R par objet) ────────────────────────────────────
	for (let n = 0; n < N; n++) {
		var idx = n + 1;
		for (let ch = 0; ch < 2; ch++) {
			var s = numToHex16String(2*idx - 1 + ch);
			var chName = ch === 0 ? 'L' : 'R';
			txt += '<audioTrackFormat audioTrackFormatID="AT_0003'+s+'_01" audioTrackFormatName="object '+idx+' '+chName+'" formatLabel="0001" formatDefinition="PCM">\n\
 			<audioStreamFormatIDRef>AS_0003'+s+'</audioStreamFormatIDRef>\n\
 			</audioTrackFormat>\n';
		}
	}

	// ── audioTrackUID (L et R par objet) ───────────────────────────────────────
	for (let n = 0; n < N; n++) {
		var idx = n + 1;
		var ap_s = numToHex16String(idx);
		for (let ch = 0; ch < 2; ch++) {
			var s   = numToHex16String(2*idx - 1 + ch);
			txt += '<audioTrackUID UID="ATU_0000'+s+'" sampleRate="48000" bitDepth="16">\n\
    		<audioTrackFormatIDRef>AT_0003'+s+'_01</audioTrackFormatIDRef>\n\
          <audioPackFormatIDRef>AP_0003'+ap_s+'</audioPackFormatIDRef>\n\
          </audioTrackUID>\n';
		}
	}

	txt += '</audioFormatExtended>\n\
    </format>\n\
  </coreMetadata>\n\
</ebuCoreMain>';

	console.log('length', txt.length);
	if (txt.length % 2 > 0) { txt = txt + ' '; }
	console.log('length', txt.length);
	return txt;
}function audioBufferToWav(sampleRate, channelBuffers, axml, chna, tracks) {
  const totalSamples = channelBuffers[0].length * channelBuffers.length;
  const activeObjs = [];
  const cmax2 = nbtracks + 1;
  for (let i = 1; i < cmax2; i++) {
    for (let j = 0; j < tableObjet.length; j++) {
      if (tableObjet[j].etat === 1 && tableObjet[j].piste === i) activeObjs.push(tableObjet[j]);
    }
  }
  const N = activeObjs.length;
  const nbobjs = N * 2;
  const chnaDataSize = 4 + (40 * nbobjs);
  const dataStart = 80 + chnaDataSize;
  const bufferSize = dataStart + 8 + (totalSamples * 2) + 8 + axml.length;
  const buffer = new ArrayBuffer(bufferSize);
  const view = new DataView(buffer);

  const writeString = (view, offset, string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  console.log('channelBuffers.length', channelBuffers.length);

  // RIFF header
  writeString(view, 0, "RIFF");
  view.setUint32(4, bufferSize - 8, true);
  writeString(view, 8, "WAVE");

  // JUNK chunk (placeholder, 36 bytes total)
  writeString(view, 12, 'JUNK');
  view.setUint32(16, 28, true);
  view.setUint32(20, 0, true);
  view.setUint32(24, 0, true);
  view.setUint32(28, totalSamples * 2, true);
  view.setUint32(32, 0, true);
  view.setUint32(36, 0, true);
  view.setUint32(40, 0, true);
  view.setUint32(44, 0, true);

  // fmt chunk (offset 48-71)
  writeString(view, 48, "fmt ");
  view.setUint32(52, 16, true);
  view.setUint16(56, 1, true);
  view.setUint16(58, channelBuffers.length, true);
  view.setUint32(60, sampleRate, true);
  view.setUint32(64, sampleRate * channelBuffers.length * 2, true);
  view.setUint16(68, channelBuffers.length * 2, true);
  view.setUint16(70, 16, true);

  // chna chunk (avant data — spec ITU-R BS.2088)
  writeString(view, 72, "chna");
  view.setUint32(76, chnaDataSize, true);
  view.setUint16(80, tracks * 2, true);   // numTracks
  view.setUint16(82, nbobjs, true);       // numUIDs

  var chnaOff = 84;
  for (let n = 0; n < N; n++) {
    var o = activeObjs[n];
    var idx = n + 1;
    var ap_s = numToHex16String(idx);
    for (let ch = 0; ch < 2; ch++) {
      var trackIdx = (o.piste * 2) - 1 + ch;
      var s = numToHex16String(2*idx - 1 + ch);
      var chnaStr = 'ATU_0000' + s + 'AT_0003' + s + '_01AP_0003' + ap_s;
      view.setUint16(chnaOff, trackIdx, true);
      chnaOff += 2;
      for (let m = 0; m < 38; m++) { view.setUint8(chnaOff + m, chnaStr.charCodeAt(m)); }
      chnaOff += 38;
    }
  }

  // data chunk
  writeString(view, dataStart, "data");
  view.setUint32(dataStart + 4, totalSamples * 2, true);

  // PCM audio (16-bit interleaved)
  let offset = dataStart + 8;
  for (let i = 0; i < channelBuffers[0].length; i++) {
    for (let channel = 0; channel < channelBuffers.length; channel++) {
      const s = Math.max(-1, Math.min(1, channelBuffers[channel][i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
      offset += 2;
    }
  }

  // axml chunk (après data)
  writeString(view, offset, "axml");
  view.setUint32(offset + 4, axml.length, true);
  offset += 8;
  for (let i = 0; i < axml.length; i++) {
    view.setUint8(offset + i, axml.charCodeAt(i));
  }

  return buffer;
}
function convertStereoToMono(audioBuffer) {
  const numberOfChannels = audioBuffer.numberOfChannels;
  if (numberOfChannels === 1) {
    // Déjà en mono
    return audioBuffer;
  }

  const sampleRate = audioBuffer.sampleRate;
  const bufferLength = audioBuffer.length;

  // Créer un nouveau buffer mono
  //const context = audioBuffer.context || new AudioContext();
  const monoBuffer = contextAudio.createBuffer(1, bufferLength, sampleRate);

  // Obtenir les données des deux canaux
  const leftChannel = audioBuffer.getChannelData(0);
  const rightChannel = audioBuffer.getChannelData(1);
  const monoChannel = monoBuffer.getChannelData(0);

  // Calculer la moyenne des canaux gauche et droit
  for (let i = 0; i < bufferLength; i++) {
    monoChannel[i] = (leftChannel[i] + rightChannel[i]) / 2;
  }

  return monoBuffer;
}

function convertoFloat32ToInt16(buffer) {
  var l = buffer.length;  //Buffer
  var buf = new Int16Array(l/3);

  while (l--) {
    s = Math.max(-1, Math.min(1, samples[l]));
    buf[l] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    //buf[l] = buffer[l]*0xFFFF; //old   //convert to 16 bit
  }
  return buf.buffer;
}


function admTimeToSeconds(str) {
	const parts = str.split(':');
	return (parseInt(parts[0]) || 0) * 3600
	     + (parseInt(parts[1]) || 0) * 60
	     + (parseFloat(parts[2]) || 0);
}

async function importAdmFromData(data) {
	// data = { sampleRate, objects: [{file, startSec, durSec}], axml }
	const cleanXml = data.axml.replace(/\s+xmlns(?::\w+)?="[^"]*"/g, '');
	const parser = new DOMParser();
	const xmlDoc = parser.parseFromString(cleanXml, 'text/xml');
	const aoEls = xmlDoc.getElementsByTagName('audioObject');
	const N = data.objects.length;
	const spaceH = spaceHeight || 600;

	for (let n = 0; n < N; n++) {
		const obj = data.objects[n];
		const ao  = aoEls[n];

		// Construire les tableaux de spatialisation depuis le canal L (premier audioChannelFormat)
		let spX = [0], spY = [0], spZ = [0], spT = [0], spD = [1];

		if (ao) {
			const apRefEls = ao.getElementsByTagName('audioPackFormatIDRef');
			if (apRefEls.length) {
				const apRef = apRefEls[0].textContent.trim();
				let acRef = '';
				const allPacks = xmlDoc.getElementsByTagName('audioPackFormat');
				for (let i = 0; i < allPacks.length; i++) {
					if (allPacks[i].getAttribute('audioPackFormatID') === apRef) {
						const acRefs = allPacks[i].getElementsByTagName('audioChannelFormatIDRef');
						if (acRefs.length) acRef = acRefs[0].textContent.trim();
						break;
					}
				}
				if (acRef) {
					const allChans = xmlDoc.getElementsByTagName('audioChannelFormat');
					for (let i = 0; i < allChans.length; i++) {
						if (allChans[i].getAttribute('audioChannelFormatID') === acRef) {
							const blocks = allChans[i].getElementsByTagName('audioBlockFormat');
							if (blocks.length) {
								spX = []; spY = []; spZ = []; spT = []; spD = [];
								for (let b = 0; b < blocks.length; b++) {
									const blk = blocks[b];
									const rt = admTimeToSeconds(blk.getAttribute('rtime') || '00:00:00.00000');
									spT.push(obj.durSec > 0 ? rt / obj.durSec : 0);
									spD.push(1);
									let bX = 0, bY = 0, bZ = 0;
									let az = 0, el = 0, dist = 1;
									const cartEl = blk.getElementsByTagName('cartesian');
									const isCartesian = cartEl.length > 0 && cartEl[0].textContent.trim() === '1';
									const positions = blk.getElementsByTagName('position');
									for (let p = 0; p < positions.length; p++) {
										const coord = positions[p].getAttribute('coordinate');
										const val   = parseFloat(positions[p].textContent) || 0;
										if (isCartesian) {
											if      (coord === 'X') bX = val;
											else if (coord === 'Y') bZ = val; // ADM Y → spZ
											else if (coord === 'Z') bY = val; // ADM Z → spY
										} else {
											if      (coord === 'azimuth')   az   = val;
											else if (coord === 'elevation') el   = val;
											else if (coord === 'distance')  dist = val;
										}
									}
									if (!isCartesian) {
										// Conversion sphérique ADM → cartésien (BS.2076)
										// azimuth : 0=avant, +90=gauche ; elevation : 0=horizontal, +90=haut
										const azRad = az * Math.PI / 180;
										const elRad = el * Math.PI / 180;
										const admX  = -Math.sin(azRad) * Math.cos(elRad) * dist;
										const admY  =  Math.cos(azRad) * Math.cos(elRad) * dist;
										const admZ  =  Math.sin(elRad) * dist;
										bX = admX; // ADM X → spX
										bZ = admY; // ADM Y → spZ
										bY = admZ; // ADM Z → spY
									}
									spX.push(bX); spY.push(bY); spZ.push(bZ);
								}
							}
							break;
						}
					}
				}
			}
		}

		// Position verticale : distribuer N objets équitablement
		const posY = ((n + 1) / (N + 1)) * (spaceH - 40) + 20;
		const id = nbObjets;
		objActif = id;

		tableObjet[id] = {
			basePosY:      posY * (1 / ratioSpaceHeight),
			bkgColor:      '#ffffff',
			bkgHeight:     20,
			bkgImg:        '',
			bkgOpacity:    1,
			bkgTrp:        true,
			bkgWidth:      20,
			borderBc: '#000000', borderBr: '0%', borderBs: 'none', borderBw: 0,
			borderDc: '#000000', borderDr: '0%', borderDs: 'none', borderDw: 0,
			borderGc: '#000000', borderGr: '0%', borderGs: 'none', borderGw: 0,
			borderHc: '#000000', borderHr: '0%', borderHs: 'none', borderHw: 0,
			buffer:        '',
			canaux:        2,
			class:         1,
			convolver:     '',
			cx:            20,
			cy:            10,
			debut:         0,
			detune:        0,
			duree:         obj.durSec,
			envX:          [0.2, 0.8],
			etat:          1,
			fadeIn:        'l',
			file:          obj.file,
			fin:           1,
			flagTranspo:   0,
			gain:          1,
			groupe:        16777216,
			height:        20,
			id:            'objet' + id,
			margeG:        0,
			margeH:        0,
			mute:          0,
			nom:           'objet' + id,
			objBorderC:    '#008000',
			objBorderW:    0,
			objColor:      '#4CAF50',
			objOpacity:    1,
			piste:         n + 1,
			posX:          obj.startSec * 18 * zoomScale,
			posY:          posY,
			r:             10,
			reverse:       false,
			rmsdb:         -10,
			rotate:        0,
			rx:            20,
			ry:            10,
			scaleX:        1.0,
			scaleY:        1.0,
			spD:           spD,
			spT:           spT,
			spX:           spX,
			spY:           spY,
			spZ:           spZ,
			tableFx:       [0, 0, 0, 0, 0, 0, 0],
			tableFxParam:  ['0?0', '0?0', '0?0', '0?0', '0?0', '0?0', '0?0'],
			transposition: 1.0,
			type:          1,
			vueDuree:      0,
			width:         20,
		};

		nbObjets++;
		drawObj(id);
		timePosObjet(id, obj.startSec);

		if (obj.file) {
			loadSoundTableBufferB(id, '', obj.file, 2, obj.durSec);
		}

		await new Promise(resolve => setTimeout(resolve, 20));
	}
}
function numToHex16String(v) {
	var lv=(v.toString(16)).length;
 		var at="";
 		switch(lv){
 			case 1:
 				at="000"+v.toString(16);
 				break;
 			case 2:
 				at="00"+v.toString(16);
 				break;
 			case 3:
 				at="0"+v.toString(16);
 				break;
 			case 4:
 				at=v.toString(16);
 				break;
 		}
 		return at;
}

function buildChnaData(nbtracks) {
	var cmax = nbtracks + 1;
	var activeObjs = [];
	for (let i = 1; i < cmax; i++) {
		for (let j = 0; j < tableObjet.length; j++) {
			if (tableObjet[j].etat === 1 && tableObjet[j].piste === i) activeObjs.push(tableObjet[j]);
		}
	}
	var N = activeObjs.length;
	var nbobjs = N * 2;
	var buf = new ArrayBuffer(4 + nbobjs * 40);
	var view = new DataView(buf);
	view.setUint16(0, nbtracks * 2, true);
	view.setUint16(2, nbobjs, true);
	var off = 4;
	for (let n = 0; n < N; n++) {
		var o = activeObjs[n];
		var idx = n + 1;
		var ap_s = numToHex16String(idx);
		for (let ch = 0; ch < 2; ch++) {
			var trackIdx = (o.piste * 2) - 1 + ch;
			var s = numToHex16String(2*idx - 1 + ch);
			var chnaStr = 'ATU_0000' + s + 'AT_0003' + s + '_01AP_0003' + ap_s;
			view.setUint16(off, trackIdx, true); off += 2;
			for (let m = 0; m < 38; m++) { view.setUint8(off + m, chnaStr.charCodeAt(m)); }
			off += 38;
		}
	}
	return buf;
}

async function getObjAudioBuffer(id) {
	const obj = tableObjet[id];
	if (!obj || !obj.file) return null;
	const filePath = window.api.joinPath(toAbsPath(paramProjet.audioPath), obj.file);
	const rt = await window.api.loadBuffers(filePath);
	if (!rt || !rt.channels || !rt.channels.length) return null;
	const sr = rt.sampleRate;
	const numCh = rt.numChannels;
	const startSample = Math.floor((obj.debut || 0) * rt.numSamples);
	const endSample   = Math.floor((obj.fin   || 1) * rt.numSamples);
	const length = Math.max(1, endSample - startSample);
	const gain = obj.gain || 1;
	const outBuf = contextAudio.createBuffer(2, length, sr);
	for (let ch = 0; ch < 2; ch++) {
		const srcCh = ch < numCh ? ch : 0;
		const src = new Float32Array(rt.channels[srcCh]).subarray(startSample, endSample);
		const dst = outBuf.getChannelData(ch);
		for (let s = 0; s < length; s++) dst[s] = src[s] * gain;
	}
	return outBuf;
}

async function exportAdm() {
	const filePath = await window.api.showSaveDialog();
	if (!filePath) return;

	tablePiste = [];
	var ratioT = (720/12960);
	var ntableObjet = [];
	nbtracks = 1;
	var nlast = lastAudio();
	console.log("nlast", nlast, tableObjet[nlast.id]);
	var mduree = Math.round(nlast.maxPosX * ratioT * contextAudio.sampleRate) + 1;

	for (let i = 0; i < tableObjet.length; i++) { ntableObjet[i] = tableObjet[i]; }
	for (let i = 0; i < ntableObjet.length; i++) {
		if (ntableObjet[i].piste > nbtracks) nbtracks = ntableObjet[i].piste;
	}
	console.log('nbtracks', nbtracks);

	// Composition du buffer audio multicanal
	var nBuffer = contextAudio.createBuffer(2*nbtracks, mduree, contextAudio.sampleRate);
	for (let j = 0; j < nbtracks; j++) {
		var k = j * 2;
		for (let i = 0; i < ntableObjet.length; i++) {
			if (tableObjet[i].etat == 1 && tableObjet[i].piste == j+1) {
				var id = parseInt(ntableObjet[i].id.substring(5));
				const srcBuf = await getObjAudioBuffer(id);
				if (!srcBuf) continue;
				var tpos = Math.round((tableObjet[i].posX * ratioT) * contextAudio.sampleRate);
				insertAdmBufferPart(nBuffer, k, srcBuf, tpos, 0, srcBuf.length);
			}
		}
	}

	const xmlString   = defAxml(nbtracks);
	const chnaData    = buildChnaData(nbtracks);
	const channelCount = nBuffer.numberOfChannels;
	const totalSamples = nBuffer.length;

	// Démarrer le streaming — le main process crée le fichier et écrit l'en-tête
	const startRes = await window.api.admStreamStart({
		filePath, sampleRate: 48000, channelCount, totalSamples,
		axmlLength: xmlString.length, chnaData
	});
	if (!startRes.ok) { console.error('ADM stream start failed:', startRes.error); return; }

	// Extraire les canaux depuis l'AudioBuffer
	const channelBuffers = [];
	for (let ch = 0; ch < channelCount; ch++) channelBuffers.push(nBuffer.getChannelData(ch));

	// Streamer le PCM par blocs de 65 536 samples (~2 Mo max pour 16 canaux)
	const CHUNK = 65536;
	for (let offset = 0; offset < totalSamples; offset += CHUNK) {
		const end   = Math.min(offset + CHUNK, totalSamples);
		const count = end - offset;
		const pcm   = new Int16Array(count * channelCount);
		var p = 0;
		for (let i = 0; i < count; i++) {
			for (let ch = 0; ch < channelCount; ch++) {
				const s = Math.max(-1, Math.min(1, channelBuffers[ch][offset + i]));
				pcm[p++] = s < 0 ? (s * 0x8000) | 0 : (s * 0x7fff) | 0;
			}
		}
		const chunkRes = await window.api.admStreamChunk(pcm.buffer);
		if (!chunkRes.ok) { console.error('ADM stream chunk failed:', chunkRes.error); return; }
	}

	// Finaliser : écriture du chunk axml et fermeture du fichier
	const endRes = await window.api.admStreamEnd({ axmlString: xmlString });
	if (!endRes.ok) { console.error('ADM stream end failed:', endRes.error); return; }
	console.log("Export ADM terminé :", filePath);
}

function saveFxAudio(obj,mode,nom){
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
      				if(mode==0){
						   const regex = new RegExp('-');
						   var lab=tableObjet[obj].file.split('.');
						   var label='';
						   var sch=lab[0].search(regex);
							if(sch==-1){
								label=lab[0]+"-1.wav";
							}else{
								var ft=lab[0].substring(0,sch);
								var rt=lab[0].substring(sch+1);
								if(isNaN(rt)){
									rt=0;
								}
								var rft=parseInt(lab[0].substring(sch+1))+1;
								label=ft+"-"+rft+".wav";
							}
						}else{
							label=nom;
						}
						tableObjet[obj].tableFx=['','','','','','',''];
						tableObjet[obj].tableFxParam=['','','','','','',''];
						var reader = new FileReader();
						reader.readAsArrayBuffer(rwav);
						reader.onloadend = (event) => {
	    					// The contents of the BLOB are in reader.result:	
	    					window.api.saveAudio('saveAudio',(audioDirectory+label), reader.result);
	    					window.api.send('toMain','saveFxAudio;'+obj+';'+audioDirectory+label);
	    				};
	    					
					   	console.log(label);
    					});
					});
		  			recorder=false;
 					recordingstream=false;
  						});
  						
 					recorder.stop();
					
		  			sourceStat=0;
		  			//console.log("source end");
		  			//clearTimeout(timer);
  					playerStat=0;
				};
				const gainNode = contextAudio.createGain();
				var now=contextAudio.currentTime;
				var rt=readFxAudio(contextAudio,source,obj,gainNode,now);
				source=rt;
				recordingstream=contextAudio.createMediaStreamDestination();
  				recorder=new MediaRecorder(recordingstream.stream);
  				gainNode.connect(recordingstream);
				source.start(0);
				recorder.start();
				
			}
		}
	}
}
// exportObj() 
// exportGrp()
// exportPart()

//*******************************************************************************************************
//														Spatialisation
//*******************************************************************************************************

function spaceListerner(fwX,fwY,fwZ,upX,upY,upZ,X,Y,Z) {
	listenerForwardX=fwX;
 	listenerForwardY=fwY;
	listenerForwardZ=fwZ;
   listenerUpX=upX;
 	listenerUpY=upY;
 	listenerUpZ=upZ;
 	listenerPositionX=X;
 	listenerPositionY=Y;
 	listenerPositionZ=Z;
 	paramSpace.lForwardX=fwX;
 	paramSpace.lForwardY=fwY;
	paramSpace.lForwardZ=fwZ;
   paramSpace.lUpX=upX;
 	paramSpace.lUpY=upY;
 	paramSpace.lUpZ=upZ;
 	paramSpace.lPosX=X;
 	paramSpace.lPosY=Y;
 	paramSpace.lPosZ=Z;
}
function spacePanningModel(model) {
	PModel=model;
 	paramSpace.PModel=model;
}
function spacePanningDistance(mode,redD,maxD,Rolloff,ConeInnerA,ConeOuterA,ConeOuterG) {
  	pannerDistanceModel = mode;
 	pannerRefDistance = redD;
 	pannerMaxDistance = maxD;
  	pannerRolloffFactor = Rolloff;
  	pannerConeInnerAngle = ConeInnerA;
  	pannerConeOuterAngle =ConeOuterA;
  	pannerConeOuterGain = ConeOuterG;
 	paramSpace.DModel=mode;
 	paramSpace.refD=redD;
	paramSpace.maxD=maxD;
	paramSpace.rolF=Rolloff;
	paramSpace.coneIA=ConeInnerA;
	paramSpace.coneOA=ConeOuterA;
	paramSpace.coneOG=ConeOuterG;
}
function spacePanningOrientation(X,Y,Z) {
  	pannerOrientationX=X;
   pannerOrientationY=Y;
   pannerOrientationZ=Z;
 	paramSpace.orX=X;
	paramSpace.orY=Y;
	paramSpace.orZ=Z;
}
function spaceDefPoint(id,t,d,x,y,z) {
	tableObjet[objActif].spT[id]=t;
	tableObjet[objActif].spD[id]=d;
	tableObjet[objActif].spX[id]=x;
	tableObjet[objActif].spY[id]=y;
	tableObjet[objActif].spZ[id]=z;
}

//*******************************************************************************************************
//													Configuration
//*******************************************************************************************************

function baseDefProjet(name,start,end,comment,ppath,audioPath,imgPath,greffon3D,canaux) {
	paramProjet.name=name;
	paramProjet.start=start;
	paramProjet.end=end;
	paramProjet.comment=comment;
	paramProjet.path=ppath;
	paramProjet.audioPath=audioPath;
	paramProjet.imgPath=imgPath;
	paramProjet.greffon3D=greffon3D;
	paramProjet.greffonC=canaux;
	path=ppath;
	audioDirectory=audioPath;
	imgDirectory=imgPath;
	spat3D=greffon3D;
	spat3dCanaux=canaux;
}
function appExternes(ledit,sequenceur,dawPath,AssCmd,AppCmd) {
	editor=ledit;
	daw=sequenceur;
   cmdDaw=dawPath;
}
function pdfConfig(page,landscape,scale,margeT,margeL,margeB,margeR,Bkg) {
	pdfPage=page;
  	pdfScale=scale;
  	pdfLandscape=landscape;
  	pdfMgTop=margeT;
  	pdfMgBot=margeB;
  	pdfMgLeft=margeL;
  	pdfMgRight=margeR;
  	pdfBkg=Bkg;
}
function apiParamProjet() {
	var obj = Object.assign({}, paramProjet, {
		editor: editor,
		daw: daw,
		cmdDaw: cmdDaw,
		pdfPage: pdfPage,
		pdfLandscape: pdfLandscape,
		pdfScale: pdfScale,
		pdfMgTop: pdfMgTop,
		pdfMgBot: pdfMgBot,
		pdfMgLeft: pdfMgLeft,
		pdfMgRight: pdfMgRight,
		pdfBkg: pdfBkg,
		editAudioCmd: editAudioCmd
	});
	var txt = JSON.stringify(obj);
	window.api.send("toMain", 'defExterne;'+btoa(unescape(encodeURIComponent(txt))));
}