// Assigne à chaque objet audio une piste (obj.piste) de façon à éviter tout
// chevauchement temporel. Algorithme greedy : pour chaque objet (trié par posX),
// on choisit la première piste dont la fin est <= au début de l'objet courant.
// Retourne le nombre de pistes utilisées.
function assignPistesExport(objets) {
	var ratioT = 720 / 12960; // pixels → secondes
	var pisteFin = []; // pisteFin[j] = posX de fin du dernier objet sur la piste j

	for (var i = 0; i < objets.length; i++) {
		var obj = objets[i];
		var transpo = obj.transposition || 1;
		var duree = obj.duree / transpo;
		if (obj.convolver === "cathedrale") {
			duree = 7 / transpo;
		}
		var dureePixels = duree / ratioT;

		// Cherche la première piste libre (fin <= début de l'objet)
		var piste = -1;
		for (var j = 0; j < pisteFin.length; j++) {
			if (obj.posX >= pisteFin[j]) {
				piste = j;
				break;
			}
		}
		if (piste === -1) {
			// Aucune piste libre → ouvrir une nouvelle
			piste = pisteFin.length;
			pisteFin.push(0);
		}
		pisteFin[piste] = obj.posX + dureePixels;

		var id = parseInt(obj.id.substring(5));
		tableObjet[id].piste = piste;
	}

	return pisteFin.length;
}

async function exportIntv(){
	exportTable=[];
	var deb=parseFloat(document.getElementById("barDebut").style.left)+36;
	var fin=parseFloat(document.getElementById("barFin").style.left);
	for(let i=0;i<tableObjet.length;i++){
		console.log("intvObj",tableObjet[i],tableObjet[i].posX,deb,fin);
		if(tableObjet[i].posX> deb && tableObjet[i].posX<fin){
			exportTable.push(tableObjet[i]);
		}
	}
	console.log("intv",exportTable);
	exportTable=exportTable.sort((s1, s2) => {
 		return s1.posX - s2.posX;
	});
	assignPistesExport(exportTable);
	await exportAudioObjet(exportTable[0].id.substring(5),0);
	exportToSeq(1,exportTable);
}
async function exportObj(){
	exportTable=[];
	exportTable.push(tableObjet[objActif]);
	await exportAudioObjet(objActif,0);
	exportToSeq(1,exportTable);
}
async function exportGrp(){
	let grp=[];
	exportTable=[];
	if(grpSelect==1){
		grp=[].concat(preservSelect);
	}else{
		if(tableObjet[objActif].class==4 ){
			grp=[].concat(tableObjet[objActif].liste);
		}
	}
	for(let i=0;i<grp.length;i++){
		exportTable.push(tableObjet[grp[i]]);
	}
	exportTable=exportTable.sort((s1, s2) => {
 		return s1.posX - s2.posX;
	});
	assignPistesExport(exportTable);
	await exportAudioObjet(exportTable[0].id.substring(5),0);
	exportToSeq(1,exportTable);

}

async function exportPart(adm){
	tablePiste=[];
	exportTable=[];
	for(let i=0;i<tableObjet.length;i++){
		if(tableObjet[i].etat==1 && tableObjet[i].file && tableObjet[i].class==1 ){
			exportTable.push(tableObjet[i]);
		}
	}

	exportTable=exportTable.sort((s1, s2) => {
 		return s1.posX - s2.posX;
	});

	if(adm==0){
		assignPistesExport(exportTable);
		exportToSeq(1,exportTable);
	}
}
function exportToSeq(type,refGrp){
	var autoTempo="";
	var autoGain="";
	for(i=0;i<tempoPoints.length;i++){
		autoTempo=autoTempo+((tempoPoints[i].X/18).toFixed(2))+","+(Math.floor(240-tempoPoints[i].Y/0.4167))+";";
	}
	console.log("tempo",autoTempo);
	autoTempo=autoTempo.substring(0,autoTempo.length-1);
	for(i=0;i<gainPoints.length;i++){
		autoGain=autoGain+((gainPoints[i].X/18).toFixed(2))+","+((100-gainPoints[i].Y)*0.05).toFixed(2)+";";
	}
	autoGain=autoGain.substring(0,autoGain.length-1);
	var txt=toAbsPath(audioDirectory)+"\n"+spat3D+"\n"+spat3DCanaux+"\n"+contextAudio.sampleRate+"\n"+autoTempo+"\n"+autoGain+"\n";
	var nfilesave=[];
	var ratioT=(720/12960);
	var offsetPiste=1;
	var track=1;
	nfilesave=[].concat(refGrp);
	nfilesave.sort((a, b) => a.piste - b.piste);
	
	for(let i=0;i<nfilesave.length;i++){
		if(nfilesave[i].etat==1 && nfilesave[i].file && nfilesave[i].class==1 && nfilesave[i].type<24){
			if(refGrp.length>1){
				track=nfilesave[i].piste+offsetPiste;
			}
			txt=txt+nfilesave[i].nom+";"+(nfilesave[i].objColor.substring(1)+"ff")+";"+nfilesave[i].id+";"+track+";"+Math.floor((nfilesave[i].posX*ratioT)*48000);			
			txt=txt+";"+nfilesave[i].spT+";"+nfilesave[i].spX+";"+nfilesave[i].spY+";"+nfilesave[i].spZ+";"+nfilesave[i].spD+"\n";   	
		 }
		
	}
	if(type==0){
		window.api.send("toMain", "exportBlock;"+btoa(txt));
   }else{
   	window.api.send("toMain", "exportSelect;"+btoa(txt));
   }
	//var new_window = window.open(URL.createObjectURL(new Blob([txt], { type: "text/html" })),'Export');

}

