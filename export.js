var tablePiste=[];
var maxPiste=0;
function tableObjetToPistes(ntableObjet,i,j){
	
	var ratioT=(720/12960);
	var lgi=0;
	var localDuree=0;
	if (i<ntableObjet.length ){
		if(ntableObjet[i].mute==0 && ntableObjet[i].etat==1  && ntableObjet[i].class==1){
			
			if(j>tablePiste.length-1){
				if(ntableObjet[i].id.substring(0,5)=="objet"){
					var id=parseInt(ntableObjet[i].id.substring(5));
				}
				tablePiste[j]=id+",";
				tableObjet[id].piste=j;
				i++;
				if(j>maxPiste){
					maxPiste=j;
				}
				tableObjetToPistes(ntableObjet,i,1);
			}else{
				var ls=tablePiste[j].split(",");
				var lg=ls.length-2;
				var last=parseInt(ls[lg]);
				localDuree=(ntableObjet[last].duree/ntableObjet[last].transposition);
				if(ntableObjet[last].convolver=="cathedrale"){
					localDuree=7/ntableObjet[last].transposition;
				}
				lgi= localDuree/ratioT;
				if(ntableObjet[i].posX>ntableObjet[last].posX+lgi){
					if(ntableObjet[i].id.substring(0,5)=="objet"){
						var id=parseInt(ntableObjet[i].id.substring(5));
					}
					tablePiste[j]=tablePiste[j]+id+",";
					tableObjet[id].piste=j;
					i++;
					tableObjetToPistes(ntableObjet,i,1);
				}else{
					j++;
					tableObjetToPistes(ntableObjet,i,j);
				}
			}
		}
	}
	return maxPiste;
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
		if(tableObjet[objActif].class==2 || tableObjet[objActif].class==4 ){
			grp=[].concat(tableObjet[objActif].liste);
		}
	}
	for(let i=0;i<grp.length;i++){
		exportTable.push(tableObjet[grp[i]]);
	}
	exportTable=exportTable.sort((s1, s2) => {
 		return s1.posX - s2.posX;
	});
	await exportAudioObjet(exportTable[0].id.substring(5),0);
	exportToSeq(1,exportTable);
	
}

async function exportPart(adm){
	tablePiste=[];
	exportTable=[];
	for(let i=0;i<tableObjet.length;i++){
		if(tableObjet[i].etat==1 && tableObjet[i].file && tableObjet[i].class==1 ){
		exportTable[i]=tableObjet[i];
		}
	}
	
	exportTable=exportTable.sort((s1, s2) => {
 		return s1.posX - s2.posX;
	});

	if(adm==0){
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
	var txt=audioDirectory+"\n"+spat3D+"\n"+spat3DCanaux+"\n"+contextAudio.sampleRate+"\n"+autoTempo+"\n"+autoGain+"\n";
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

