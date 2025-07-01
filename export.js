var tablePiste=[]
var maxPiste=0
function tableObjetToPistes(ntableObjet,i,j){
	
	var ratioT=(720/12960)
	var lgi=0
	var localDuree=0
	if (i<ntableObjet.length ){
		if(ntableObjet[i].mute==0 && ntableObjet[i].etat==1  && ntableObjet[i].class==1){
			
			if(j>tablePiste.length-1){
				if(ntableObjet[i].id.substring(0,5)=="objet"){
					var id=parseInt(ntableObjet[i].id.substring(5))
				}
				tablePiste[j]=id+","
				tableObjet[id].piste=j
				i++
				if(j>maxPiste){
					maxPiste=j
				}
				tableObjetToPistes(ntableObjet,i,1)
			}else{
				var ls=tablePiste[j].split(",")
				var lg=ls.length-2
				var last=parseInt(ls[lg])
				localDuree=(ntableObjet[last].duree/ntableObjet[last].transposition);
				if(ntableObjet[last].convolver=="cathedrale"){
					localDuree=7/ntableObjet[last].transposition;
				}
				lgi= localDuree/ratioT
				if(ntableObjet[i].posX>ntableObjet[last].posX+lgi){
					if(ntableObjet[i].id.substring(0,5)=="objet"){
						var id=parseInt(ntableObjet[i].id.substring(5))
					}
					tablePiste[j]=tablePiste[j]+id+","
					tableObjet[id].piste=j
					i++
					tableObjetToPistes(ntableObjet,i,1)
				}else{
					j++
					tableObjetToPistes(ntableObjet,i,j)
				}
			}
		}
	}
	return maxPiste
}

function exportIntv(){
	let grp=[];
	refStorage=[];
	tablePiste=[]
	var ntableObjet=[]
	var posDeb=parseFloat(document.getElementById("barDebut").style.left);
	var posFin=parseFloat(document.getElementById("barFin").style.left);
	for(let i=0;i<tableObjet.length;i++){
		if(tableObjet[i].etat==1 && tableObjet[i].file && tableObjet[i].class==1 && tableObjet[i].type<24){
				if(tableObjet[i].posX>posDeb && tableObjet[i].posX<posFin){
					ntableObjet.push(tableObjet[i])
				}
		}
	}
	/*
	ntableObjet=refStorage.sort((s1, s2) => {
 		return s1.posX - s2.posX;
	});
	*/
	for(let i=0;i<ntableObjet.length;i++){
		var id=parseInt(ntableObjet[i].id.substring(5))
		exportAudioObjet(id,0)
	}
	if(ntableObjet[0].id.substring(0,5)=="objet"){
		var id=parseInt(ntableObjet[0].id.substring(5))
		tablePiste[1]=id+","
		tableObjet[id].piste=1
		maxPiste=1
		tableObjetToPistes(ntableObjet,1,1)
		exportToSeq(1,ntableObjet)
	}
}
function exportObj(){
	exportAudioObjet(objActif,0)
	refGrp=[]
	refGrp.push(tableObjet[objActif])
	exportToSeq(1,refGrp)
}
function exportGrp(){
	let grp=[];
	refStorage=[];
	tablePiste=[]
	var ntableObjet=[]
	if(grpSelect==1){
		grp=[].concat(preservSelect);
	}else{
		if(tableObjet[objActif].class==2 || tableObjet[objActif].class==4 ){
			grp=[].concat(tableObjet[objActif].liste);
		}
	}
	for(let i=0;i<grp.length;i++){
		ntableObjet.push(tableObjet[grp[i]]);
	}
	/*
	ntableObjet=refStorage.sort((s1, s2) => {
 		return s1.posX - s2.posX;
	});
	*/
	for(let i=0;i<ntableObjet.length;i++){
		var id=parseInt(ntableObjet[i].id.substring(5))
		exportAudioObjet(id,0)
	}
	if(ntableObjet[0].id.substring(0,5)=="objet"){
		var id=parseInt(ntableObjet[0].id.substring(5))
		tablePiste[1]=id+","
		tableObjet[id].piste=1
		maxPiste=1
		tableObjetToPistes(ntableObjet,1,1)
		exportToSeq(1,ntableObjet)
	}
}
function exportSelect(){
	let grp=[];
	refStorage=[];
	tablePiste=[]
	var ntableObjet=[]
	grp=[].concat(preservSelect);
	for(let i=0;i<grp.length;i++){
		ntableObjet.push(tableObjet[grp[i]]);
	}
	/*
	ntableObjet=refStorage.sort((s1, s2) => {
 		return s1.posX - s2.posX;
	});
	*/
	for(let i=0;i<ntableObjet.length;i++){
		var id=parseInt(ntableObjet[i].id.substring(5))
		exportAudioObjet(id,0)
	}
	if(ntableObjet[0].id.substring(0,5)=="objet"){
		var id=parseInt(ntableObjet[0].id.substring(5))
		tablePiste[1]=id+","
		tableObjet[id].piste=1
		maxPiste=1
		tableObjetToPistes(ntableObjet,1,1)
		exportToSeq(1,ntableObjet)
	}
}
function exportPart(adm){
	tablePiste=[]
	var ntableObjet=[]
	for(let i=0;i<tableObjet.length;i++){
		if(tableObjet[i].etat==1 && tableObjet[i].file && tableObjet[i].class==1 ){
		ntableObjet[i]=tableObjet[i]
		}
	}
	
	ntableObjet=ntableObjet.sort((s1, s2) => {
 		return s1.posX - s2.posX;
	});
	
	console.log("export nb",ntableObjet.length)
	for(let i=0;i<ntableObjet.length;i++){
		var id=parseInt(ntableObjet[i].id.substring(5))
		exportAudioObjet(id,0)
	}
	/*
	if(ntableObjet[0].id.substring(0,5)=="objet"){
		var id=parseInt(ntableObjet[0].id.substring(5))
		tablePiste[1]=id+","
		tableObjet[id].piste=1
		maxPiste=1
		tableObjetToPistes(ntableObjet,1,1)
		if(adm==0){
			exportToSeq(1,ntableObjet)
		}
	}
	*/
	if(adm==0){
			exportToSeq(1,ntableObjet)
		}
}
function exportToSeq(type,refGrp){
	var txt=audioDirectory+"\n"
	+spat3D+"\n"+spat3DCanaux+"\n";
	var nfilesave=[];
	var ratioT=(720/12960);
	var offsetPiste=1;
	var track=1
	nfilesave=[].concat(refGrp);
	nfilesave.sort((a, b) => a.piste - b.piste);
	
	for(let i=0;i<nfilesave.length;i++){
		if(nfilesave[i].etat==1 && nfilesave[i].file && nfilesave[i].class==1 && nfilesave[i].type<24){
			if(refGrp.length>1){
				track=nfilesave[i].piste+offsetPiste
			}
			txt=txt+nfilesave[i].nom+";"+(nfilesave[i].objColor.substring(1)+"ff")+";"+nfilesave[i].id+";"+track+";"+Math.floor((nfilesave[i].posX*ratioT)*48000)			
			txt=txt+";"+nfilesave[i].spT+";"+nfilesave[i].spX+";"+nfilesave[i].spY+";"+nfilesave[i].spZ+";"+nfilesave[i].spD+"\n";   	
		 }
		
	}
	if(type==0){
		window.api.send("toMain", "exportBlock;"+btoa(txt))
   }else{
   	window.api.send("toMain", "exportSelect;"+btoa(txt))
   }
	//var new_window = window.open(URL.createObjectURL(new Blob([txt], { type: "text/html" })),'Export');

}

