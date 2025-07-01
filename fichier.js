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



/* ******************************************* Fichiers ****************************************************************** */
function defObjGrp(id,nbobjets,cla) {
	var txt=""
	if(id.etat==1){
		txt=txt+"<objet id='objet"+nbobjets+"'>\n\
		<baseposy value='"+id.basePosY+"'></baseposy>\n\
		<bkgcolor value='"+id.bkgColor+"'></bkgcolor>\n\
		<bkgheight value='"+id.bkgHeight+"'></bkgheight>\n\
		<bkgimg value='"+id.bkgImg+"'></bkgimg>\n\
		<bkgtrp value='"+id.bkgTrp+"'></bkgtrp>\n\
		<bkgwidth value='"+id.bkgWidth+"'></bkgwidth>\n\
		<bkgopacity value='"+id.bkgOpacity+"'></bkgopacity>\n\
		<borderbc value='"+id.borderBc+"'></borderbc>\n\
		<borderbr value='"+id.borderBr+"'></borderbr>\n\
		<borderbs value='"+id.borderBs+"'></borderbs>\n\
		<borderbw value='"+id.borderBw+"'></borderbw>\n\
		<borderdc value='"+id.borderDc+"'></borderdc>\n\
		<borderdr value='"+id.borderDr+"'></borderdr>\n\
		<borderds value='"+id.borderDs+"'></borderds>\n\
		<borderdw value='"+id.borderDw+"'></borderdw>\n\
		<bordergc value='"+id.borderGc+"'></bordergc>\n\
		<bordergr value='"+id.borderGr+"'></bordergr>\n\
		<bordergs value='"+id.borderGs+"'></bordergs>\n\
		<bordergw value='"+id.borderGw+"'></bordergw>\n\
		<borderhc value='"+id.borderHc+"'></borderhc>\n\
		<borderhr value='"+id.borderHr+"'></borderhr>\n\
		<borderhs value='"+id.borderHs+"'></borderhs>\n\
		<borderhw value='"+id.borderHw+"'></borderhw>\n\
		<buffer value='"+id.buffer+"'></buffer>\n"
		if(parseInt(id.type)==13){
			txt=txt+"		<buffer2 value='"+id.buffer2+"'></buffer2>\n";
		}
		txt=txt+"		<class value='"+cla+"'></class>\n"
		if(cla==1 || cla==2){
			txt=txt+"		<convolver value='"+id.convolver+"'></convolver>\n";
		}
		txt=txt+"		<cx value='"+id.cx+"'></cx>\n\
		<cy  value='"+id.cy+"'></cy>\n\
		<debut value='"+id.debut+"'></debut>\n\
		<detune value='"+id.detune+"'></detune>\n\
		<duree value='"+id.duree+"'></duree>\n\
		<envtype value='"+id.envType+"'></envtype>\n\
		<envx value='"+id.envX+"'></envx>\n\
		<envy value='"+id.envY+"'></envy>\n\
		<etat value='1'></etat>\n\
		<file value='"+id.file+"'></file>\n\
		<fin value='"+id.fin+"'></fin>\n\
		<flagtranspo value='"+id.flagTranspo+"'></flagtranspo>\n\
		<gain value='"+id.gain+"'></gain>\n\
		<groupe value='"+id.groupe+"'></groupe>\n\
		<height value='"+id.height+"'></height>\n"
		if(parseInt(id.type)==23){
			txt=txt+"		<imag value='"+id.img+"'></imag>\n";
		}
		if(cla==2){
			txt=txt+"		<liste value='"+id.liste+"'></liste>\n";
		}
		txt=txt+"		<margeg value='"+id.margeG+"'></margeg>\n\
		<margeh value='"+id.margeH+"'></margeh>\n\
		<mute value='"+id.mute+"'></mute>\n\
		<nom value='"+id.nom+"'></nom>\n\
		<objborderc value='"+id.objBorderC+"'></objborderc>\n\
		<objborderw value='"+id.objBorderW+"'></objborderw>\n\
		<objcolor value='"+id.objColor+"'></objcolor>\n\
		<objopacity value='"+id.objOpacity+"'></objopacity>\n\
		<piste value='"+id.piste+"'></piste>\n\
		<posx value='"+id.posX+"'></posx>\n\
		<posy value='"+id.posY+"'></posy>\n"
		if(parseInt(id.type)==1){
			txt=txt+"		<r value='"+id.r+"'></r>\n";
		}
		txt=txt+"<reverse value='"+id.reverse+"' ></reverse>\n"
		if(parseInt(id.type)==23){
		txt=txt+"		   	        <rotation value='"+id.rotate+"'></rotation>\n";
		}
		if(parseInt(id.type)>24){
		txt=txt+"		   	        <rotation value='"+id.rotate+"'></rotation>\n";
		}
		if(parseInt(id.type)==4){
			txt=txt+"		<rx value='"+id.rx+"'></rx>\n\
		<ry value='"+id.ry+"'></ry>\n";
		}
		txt=txt+"		<scalex value='"+id.scaleX+"'></scalex>\n\
		<scaley value='"+id.scaleY+"'></scaley>\n"
		if(id.scaleY2){
			txt=txt+"<scaley2 value='"+id.scaleY2+"'></scaley2>\n"
		}
		txt=txt+"<spd value='"+id.spD+"'></spd>\n\
		<spt value='"+id.spT+"'></spt>\n\
		<spx value='"+id.spX+"'></spx>\n\
		<spy value='"+id.spY+"'></spy>\n\
		<spz value='"+id.spZ+"'></spz>\n"
		txt=txt+"		<tablefx value='";
		console.log(id)
			for(let j=0;j<7;j++){
				txt=txt+id.tableFx[j]+",";
			}
			var newStr = txt.substring(0, txt.length - 1);
			txt=newStr+"'></tablefx>\n";
			txt=txt+"		<tablefxparam value='";
			var txt2=""
			for(let j=0;j<7;j++){
				txt2=txt2+id.tableFxParam[j]+",";
				console.log("neewstr",id.tableFxParam[j]+",")
			}
			newStr = txt2.substring(0, txt2.length - 1);
			console.log("neewstr",newStr)
			
			txt=txt+newStr+"'></tablefxparam>\n\
		<type value='"+id.type+"'></type>\n"
		if(parseInt(id.type)==11){
			txt=txt+"<x1 value='"+id.x1+"'></x1>\n\
			<y1 value='"+id.y1+"'></y1>\n\
			<x2 value='"+id.x2+"'></x2>\n\
			<y2 value='"+id.y2+"'></y2>\n";
		}
		
		txt=txt+"		<width value='"+id.width+"'></width>\n"	
	}
	return txt
}
function defSymbGrp(id,nbobjets) {
	var txt=""
	if(id.etat==1){
		txt=txt+"<objet id='objet"+nbobjets+"'>\n\
		<baseposy value='"+id.basePosY+"'></baseposy>\n\
		<bkgcolor value='"+id.bkgColor+"'></bkgcolor>\n\
		<bkgheight value='"+id.bkgHeight+"'></bkgheight>\n\
		<bkgimg value='"+id.bkgImg+"'></bkgimg>\n\
		<bkgopacity value='"+id.bkgOpacity+"'></bkgopacity>\n\
		<bkgtrp value='"+id.bkgTrp+"'></bkgtrp>\n\
		<bkgwidth value='"+id.bkgWidth+"'></bkgwidth>\n\
		<borderbc value='"+id.borderBc+"'></borderbc>\n\
		<borderbr value='"+id.borderBr+"'></borderbr>\n\
		<borderbs value='"+id.borderBs+"'></borderbs>\n\
		<borderbw value='"+id.borderBw+"'></borderbw>\n\
		<borderdc value='"+id.borderDc+"'></borderdc>\n\
		<borderdr value='"+id.borderDr+"'></borderdr>\n\
		<borderds value='"+id.borderDs+"'></borderds>\n\
		<borderdw value='"+id.borderDw+"'></borderdw>\n\
		<bordergc value='"+id.borderGc+"'></bordergc>\n\
		<bordergr value='"+id.borderGr+"'></bordergr>\n\
		<bordergs value='"+id.borderGs+"'></bordergs>\n\
		<bordergw value='"+id.borderGw+"'></bordergw>\n\
		<borderhc value='"+id.borderHc+"'></borderhc>\n\
		<borderhr value='"+id.borderHr+"'></borderhr>\n\
		<borderhs value='"+id.borderHs+"'></borderhs>\n\
		<borderhw value='"+id.borderHw+"'></borderhw>\n\
		<class value='3'></class>\n\
		<etat value='1'></etat>\n\
		<groupe value='"+id.groupe+"'></groupe>\n\
		<height value='"+id.height+"'></height>\n\
		<margeg value='"+id.margeG+"'></margeg>\n\
		<margeh value='"+id.margeH+"'></margeh>\n\
		<nom value=\""+id.nom+"\"></nom>\n\
		<objborderc  value='"+id.objBorderC+"'></objborderc>\n\
		<objborderw  value='"+id.objBorderW+"'></objborderw>\n\
		<objcolor value='"+id.objColor+"'></objcolor>\n\
		<objopacity value='"+id.objOpacity+"'></objopacity>\n\
		<posx value='"+id.posX+"'></posx>\n\
		<posy value='"+id.posY+"'></posy>\n\
		<rotate value='"+id.rotate+"'></rotate>\n\
		<scalex value='"+id.scaleX+"'></scalex>\n\
		<scaley value='"+id.scaleY+"'></scaley>\n"
		if(id.scaleY2){
			txt=txt+"		<scaley2 value='"+id.scaleY2+"'></scaley2>\n"
		}
		txt=txt+"		<type value='"+id.type+"'></type>\n\
		<x1 value='"+id.x1+"'></x1>\n\
			<y1 value='"+id.y1+"'></y1>\n\
			<x2 value='"+id.x2+"'></x2>\n\
			<y2 value='"+id.y2+"'></y2>\n\
		<width value='"+id.width+"'></width>\n"	
	}
	return txt
}
function defGrpGrp(id,nbobjets,i) {
	lsgrp=[]
	var txt=""
	txt=txt+"<objet id='grp"+nbobjets+"'>\n\
	<baseposy value='"+id.basePosY+"'></baseposy>\n\
	<bkgcolor value='"+id.bkgColor+"'></bkgcolor>\n\
	<bkgheight value='"+id.bkgHeight+"'></bkgheight>\n\
	<bkgimg value='"+id.bkgImg+"'></bkgimg>\n\
	<bkgopacity value='"+id.bkgOpacity+"'></bkgopacity>\n\
	<bkgtrp value='"+id.bkgTrp+"'></bkgtrp>\n\
	<bkgwidth value='"+id.bkgWidth+"'></bkgwidth>\n\
	<borderbc value='"+id.borderBc+"'></borderbc>\n\
	<borderbr value='"+id.borderBr+"'></borderbr>\n\
	<borderbs value='"+id.borderBs+"'></borderbs>\n\
	<borderbw value='"+id.borderBw+"'></borderbw>\n\
	<borderdc value='"+id.borderDc+"'></borderdc>\n\
	<borderdr value='"+id.borderDr+"'></borderdr>\n\
	<borderds value='"+id.borderDs+"'></borderds>\n\
	<borderdw value='"+id.borderDw+"'></borderdw>\n\
	<bordergc value='"+id.borderGc+"'></bordergc>\n\
	<bordergr value='"+id.borderGr+"'></bordergr>\n\
	<bordergs value='"+id.borderGs+"'></bordergs>\n\
	<bordergw value='"+id.borderGw+"'></bordergw>\n\
	<borderhc value='"+id.borderHc+"'></borderhc>\n\
	<borderhr value='"+id.borderHr+"'></borderhr>\n\
	<borderhs value='"+id.borderHs+"'></borderhs>\n\
	<borderhw value='"+id.borderHw+"'></borderhw>\n\
	<class value='4'></class>\n\
	<etat value='1'></etat>\n\
	<groupe value='"+id.groupe+"'></groupe>\n\
	<height value='"+id.height+"'></height>\n\
	<margeg value='"+id.margeG+"'></margeg>\n\
	<margeh value='"+id.margeH+"'></margeh>\n\
	<nom value='"+id.nom+"'></nom>\n\
	<liste value='"+id.liste+"'></liste>\n\
	<piste value='"+id.piste+"'></piste>\n\
	<posx value='"+id.posX+"'></posx>\n\
	<posy value='"+id.posY+"'></posy>\n\
	<width value='"+id.width+"'></width>\n\
	</objet>\n";

	return txt

}
function defProjetConf(txt) {
	txt=txt+"<general>\n\
	<name value='"+paramProjet.name+"'></name>\n\
	<start value='"+paramProjet.start+"'></start>\n\
	<end value='"+paramProjet.end+"'></end>\n\
	<comment value='"+paramProjet.comment+"'></comment>\n\
	<path value='"+paramProjet.path+"'></path>\n\
	<audiopath value='"+paramProjet.audioPath+"'></audiopath>\n\
	<imgpath value='"+paramProjet.imgPath+"'></imgpath>\n\
	<greffon3d value='"+paramProjet.greffon3D+"'></greffon3d>\n\
	<channels value='"+paramProjet.greffonC+"'></channels>\n\
	<regle value='"+paramProjet.regle+"'></regle>\n\
	<mesure value='"+paramProjet.mesure+"'></mesure>\n\
	<grille value='"+paramProjet.grille+"'></grille>\n\
	<spaceseconde value='"+paramProjet.spaceSeconde+"'></spaceseconde>\n\
	<winwidth value='"+paramProjet.width+"'></winwidth>\n\
	<winheight value='"+paramProjet.height+"'></winheight>\n\
	<zoom value='"+paramProjet.zoom+"'></zoom>\n\
	<svgregle value='"+paramProjet.svgRegle+"'></svgregle>\n\
	<svgmesure value='"+paramProjet.svgMesure+"'></svgmesure>\n\
	<svggrille value='"+paramProjet.svgGrille+"'></svggrille>\n\
	<svgseconde value='"+paramProjet.svgSeconde+"'></svgseconde>\n\
	</general>\n";
	txt=txt+"<spatialisation>\n\
	<lforwardx value='"+paramSpace.lForwardX+"'></lforwardx>\n\
	<lforwardy value='"+paramSpace.lForwardY+"'></lforwardy>\n\
	<lforwardz value='"+paramSpace.lForwardZ+"'></lforwardz>\n\
	<lupx value='"+paramSpace.lUpX+"'></lupx>\n\
	<lupy value='"+paramSpace.lUpY+"'></lupy>\n\
	<lupz value='"+paramSpace.lUpZ+"'></lupz>\n\
	<lposx value='"+paramSpace.lPosX+"'></lposx>\n\
	<lposy value='"+paramSpace.lPosY+"'></lposy>\n\
	<lposz value='"+paramSpace.lPosZ+"'></lposz>\n\
	<pmodel value='"+paramSpace.PModel+"'></pmodel>\n\
	<dmodel value='"+paramSpace.DModel+"'></dmodel>\n\
	<refd value='"+paramSpace.refD+"'></refd>\n\
	<maxd value='"+paramSpace.maxD+"'></maxd>\n\
	<rolf value='"+paramSpace.rolF+"'></rolf>\n\
	<coneia value='"+paramSpace.coneIA+"'></coneia>\n\
	<coneoa value='"+paramSpace.coneOA+"'></coneoa>\n\
	<coneog value='"+paramSpace.coneOG+"'></coneog>\n\
	<orx value='"+paramSpace.orX+"'></orx>\n\
	<ory value='"+paramSpace.orY+"'></ory>\n\
	<orz value='"+paramSpace.orZ+"'></orz>\n\
	</spatialisation>\n"
	txt=txt+"<interface>\n\
	<palettebkg value='"+paletteBkg+"'></palettebkg>\n\
 	<fontpalette value='"+fontPalette+"'></fontpalette>\n\
 	<fontpalettesize value='"+fontPaletteSize+"'></fontpalettesize>\n\
 	<separateurpalette value='"+separateurPalette+"'></separateurpalette>\n\
 	<bkginfo value='"+bkgInfo+"'></bkginfo>\n\
 	<fontinfosize value='"+fontInfoSize+"'></fontinfosize>\n\
 	<fontinfocolor value='"+fontInfoColor+"'></fontinfocolor>\n\
 	<reglebackground value='"+regleBackground+"'></reglebackground>\n\
 	<reglefontsize value='"+regleFontSize+"'></reglefontsize>\n\
 	<regleFontColor value='"+regleFontColor+"'></regleFontColor>\n\
 	<intervalbackground value='"+intervalBackground+"'></intervalbackground>\n\
 	<intervalfontsize value='"+intervalFontSize+"'></intervalfontsize>\n\
 	<fontintervalcolor value='"+fontIntervalColor+"'></fontintervalcolor>\n\
 	<workspacebkg value='"+workSpaceBkg+"'></workspacebkg>\n\
 	<spacegrilleopacity value='"+spaceGrilleOpacity+"'></spacegrilleopacity>\n\
 	<colorgrille value='"+colorGrille+"'></colorgrille>\n\
 	<suiveurbkg value='"+suiveurBkg+"'></suiveurbkg>\n\
 	<popuptitrebkg value='"+popupTitreBkg+"'></popuptitrebkg>\n\
 	<popupheaderfontsize value='"+popupHeaderFontSize+"'></popupheaderfontsize>\n\
 	<popupfonttitreColor value='"+popupFontTitreColor+"'></popupFontTitreColor>\n\
 	<popupfontcolor value='"+popupFontColor+"'></popupfontcolor>\n\
 	<popupbkgcolor value='"+popupBkgColor+"'></popupbkgcolor>\n\
 	<popupfontsize value='"+popupFontSize+"'></popupfontsize>\n\
 	<popupongletfontcolor value='"+popupOngletFontColor+"'></popupongletfontcolor>\n\
 	<popupfontongletsize value='"+popupFontOngletSize+"'></popupfontongletsize>\n\
 	<popupongletbkg value='"+popupOngletBkg+"'></popupongletbkg>\n\
 	<popupongletactifbkg value='"+popupOngletActifBkg+"'></popupongletactifbkg>\n\
 	<lang value='"+lang+"'></lang>\n\
	</interface>\n"
	txt=txt+"<palette>\n\
	<palettedisque value='"+paletteDisque+"'></palettedisque>\n\
	<palettecarre value='"+paletteCarre+"'></palettecarre>\n\
	<palettetriangle value='"+paletteTriangle+"'></palettetriangle>\n\
	<paletteellipse value='"+paletteEllipse+"'></paletteellipse>\n\
	<paletterectangle value='"+paletteRectangle+"'></paletterectangle>\n\
	<palettetrianglelong value='"+paletteTrianglelong+"'></palettetrianglelong>\n\
	<paletterondlong value='"+paletteRondlong+"'></paletterondlong>\n\
	<palettecarrelong value='"+paletteCarrelong+"'></palettecarrelong>\n\
	<palettecrescendo value='"+paletteCrescendo+"'></palettecrescendo>\n\
	<paletteligne value='"+paletteLigne+"'></paletteligne>\n\
	<paletteglissando value='"+paletteGlissando+"'></paletteglissando>\n\
	<paletteblock value='"+paletteBlock+"'></paletteblock>\n\
	<palettedecresc value='"+paletteDecresc+"'></palettedecresc>\n\
	<palettedecrescb value='"+paletteDecrescb+"'></palettedecrescb>\n\
	<palettecresc value='"+paletteCresc+"'></palettecresc>\n\
	<paletteCrescb value='"+paletteCrescb+"'></palettecrescb>\n\
	<paletteagregat value='"+paletteAgregat+"'></paletteagregat>\n\
	<palettearpege value='"+paletteArpege+"'></palettearpege>\n\
	<palettemultilignes value='"+paletteMultilignes+"'></palettemultilignes>\n\
	<palettenuage value='"+paletteNuage+"'></palettenuage>\n\
	<palettetexture value='"+paletteTexture+"'></palettetexture>\n\
	<paletteimage value='"+paletteImage+"'></paletteimage>\n\
	<palettesymb value='"+paletteSymb+"'></palettesymb>\n\
	<palettefleche value='"+paletteFleche+"'></palettefleche>\n\
	<palettemarque1 value='"+paletteMarque1+"'></palettemarque1>\n\
	<palettemarque2 value='"+paletteMarque2+"'></palettemarque2>\n\
	<palettelecteur value='"+paletteLecteur+"'></palettelecteur>\n\
	</palette>\n"
	txt=txt+"<externe>\n\
	<externeeditor value='"+editor+"'></externeeditor>\n\
	<externedaw value='"+daw+"'></externedaw>\n\
	<externecmddaw value='"+cmdDaw+"'></externecmddaw>\n\
	<externepdfpage value='"+pdfPage+"'></externepdfpage>\n\
	<externepdflandscape value='"+pdfLandscape+"'></externepdflandscape>\n\
	<externepdfscale value='"+pdfScale+"'></externepdfscale>\n\
	<externepdftop value='"+pdfMgTop+"'></externepdftop>\n\
	<externepdfbot value='"+pdfMgBot+"'></externepdfbot>\n\
	<externepdfleft value='"+pdfMgLeft+"'></externepdfleft>\n\
	<externepdfright value='"+pdfMgRight+"'></externepdfright>\n\
	<externepdfbkg value='"+pdfBkg+"'></externepdfbkg>\n\
	<externepdfass value='"+pdfAssCmd+"'></externepdfass>\n\
	<externepdfapp value='"+pdfAppCmd+"'></externepdfapp>\n\
	<externeaudioedit value='"+editAudioCmd+"'></externeaudioedit>\n\
	</externe>\n"
	return txt
}
function saveProjet(t){
	saveProjetA(t,0,tableObjet)
}
function saveProjetA(t,offset,tabgrp){
	var obj=document.getElementById("fichierSave");
	var txt="<?xml version='1.0' encoding='UTF-8' ?>\n<kandiskyscore>\n";
	if(t!=2){
		txt=defProjetConf(txt)
	}
	
	var lsgrp=[]
	let j=0
	for(let i=0;i<tabgrp.length;i++){
		if(tabgrp[i].etat==1){
			lsgrp[i]=j
			j++
		}
	}
	var ntable=[]
	ntable=structuredClone(tabgrp)
	
	txt=txt+"<audioliste value='"
	for(let i=0;i<ntable.length;i++){
		if(ntable[i].class==1){
			if(ntable[i].file!=""){
				txt=txt+tableBuffer[ntable[i].bufferId].name+","
			}
		}
	}
	if(txt.substring(txt.length - 1)==","){
		txt = txt.substring(0, txt.length - 1);
	}
	txt=txt+"'></audioliste>\n"
	
	for(let i=0;i<ntable.length;i++){
		
		if(ntable[i].etat==1 && (ntable[i].class==2 || ntable[i].class==4)){
			
			var lst=[].concat(ntable[i].liste)
			var k=[]
			for(let j=0;j<lst.length;j++){
				if(ntable[i].etat==1){
					k.push(parseInt(lsgrp[lst[j]])-offset)
				}
			}
			ntable[i].liste=[].concat(k)
		}
	}
	for(let i=0;i<ntable.length;i++){
		if(ntable[i].etat==1){
			switch (ntable[i].class){
				case 1:
					txt=txt+defObjGrp(ntable[i],lsgrp[i],ntable[i].class)
					txt=txt+"		</objet>\n";
					break
				case 2:
					txt=txt+defObjGrp(ntable[i],lsgrp[i],2)
					break
				case 3:
					txt=txt+defSymbGrp(ntable[i],lsgrp[i])
					txt=txt+"		</objet>\n";
					break
				case 4:
					txt=txt+defGrpGrp(ntable[i],lsgrp[i],i)
					break
			}
		}
	}
	txt=txt+"<nbobjets value='"+j+"' ></nbobjets>\n";
	txt=txt+"</kandiskyscore>";
	document.getElementById("fichierSave").innerHTML=txt;	
	//var new_window = window.open(URL.createObjectURL(new Blob([obj.innerHTML], { type: "text/xml" })),'Partition')
	switch(t){
		case "0":
			window.api.send("toMain", "saveModifProjet;"+uena(txt))
			break
		case "1":
			window.api.send("toMain", "saveModifProjetAs;"+uena(txt))
			break
		case "2":
			window.api.send("toMain", "saveModifGrp;"+txt)
			break
	}
}
function saveGrp() {
	var defgrp=[]
	for(let i=0;i<tableObjet[objActif].liste.length;i++){
		defgrp[i]=tableObjet[tableObjet[objActif].liste[i]]
	}
	defgrp.push(tableObjet[objActif])
	saveProjetA("2",tableObjet[objActif].liste[0],defgrp)
	
}
function loadGrp(path){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var txt=xhttp.responseText;
			document.getElementById("fichierSave").innerHTML = txt
			var obj=document.getElementById("fichierSave").getElementsByTagName("kandiskyscore")[0].getElementsByTagName("audioliste")[0]
			var tmpv=obj.getAttribute("value")
			tmpbuffer=tmpv.split(',')
			initTableGrp(0,tmpbuffer,coordClientX,coordClientY)
		}
	};
	xhttp.open("GET", path, true);
	xhttp.send();
}
function loadProjet(path) {
	initProject()
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var txt=xhttp.responseText;
			document.getElementById("fichierSave").innerHTML = txt;//.replace("\n","");
			fileXmlToScore(0,0,0) 
			//var new_window = window.open(URL.createObjectURL(new Blob([document.getElementById("fichierSave").innerHTML], { type: "text/xml" })),'Partition')
		}
	};
	xhttp.open("GET", path, true);
	xhttp.send();
}
function objXmlToScore(id,i) {
	var obj=document.getElementById("fichierSave").getElementsByTagName("kandiskyscore")[0]
	var org=obj.getElementsByTagName("objet")[i]
	tableObjet[id]={
		basePosY:parseFloat(org.getElementsByTagName("baseposy")[0].getAttribute("value")),
		bkgColor:org.getElementsByTagName("bkgcolor")[0].getAttribute("value"),
		bkgHeight:parseFloat(org.getElementsByTagName("bkgheight")[0].getAttribute("value")),
		bkgImg:org.getElementsByTagName("bkgimg")[0].getAttribute("value"),
		bkgWidth:parseFloat(org.getElementsByTagName("bkgwidth")[0].getAttribute("value")),
		bkgOpacity:parseFloat(org.getElementsByTagName("bkgopacity")[0].getAttribute("value")),
		borderBc:org.getElementsByTagName("borderbc")[0].getAttribute("value"),
		borderBr:org.getElementsByTagName("borderbr")[0].getAttribute("value"),
		borderBs:org.getElementsByTagName("borderbs")[0].getAttribute("value"),
		borderBw:parseFloat(org.getElementsByTagName("borderbw")[0].getAttribute("value")),
		borderDc:org.getElementsByTagName("borderdc")[0].getAttribute("value"),
		borderDr:org.getElementsByTagName("borderdr")[0].getAttribute("value"),
		borderDs:org.getElementsByTagName("borderds")[0].getAttribute("value"),
		borderDw:parseFloat(org.getElementsByTagName("borderdw")[0].getAttribute("value")),
		borderGc:org.getElementsByTagName("bordergc")[0].getAttribute("value"),
		borderGr:org.getElementsByTagName("bordergr")[0].getAttribute("value"),
		borderGs:org.getElementsByTagName("bordergs")[0].getAttribute("value"),
		borderGw:parseFloat(org.getElementsByTagName("bordergw")[0].getAttribute("value")),
		borderHc:org.getElementsByTagName("borderhc")[0].getAttribute("value"),
		borderHr:org.getElementsByTagName("borderhr")[0].getAttribute("value"),
		borderHs:org.getElementsByTagName("borderhs")[0].getAttribute("value"),
		borderHw:parseFloat(org.getElementsByTagName("borderhw")[0].getAttribute("value")),
		class:parseInt(org.getElementsByTagName("class")[0].getAttribute("value")),
		convolver:org.getElementsByTagName("convolver")[0].getAttribute("value"),
		cx:parseFloat(org.getElementsByTagName("cx")[0].getAttribute("value")),
		cy:parseFloat(org.getElementsByTagName("cy")[0].getAttribute("value")),
		debut:parseFloat(org.getElementsByTagName("debut")[0].getAttribute("value")),
		detune:parseFloat(org.getElementsByTagName("detune")[0].getAttribute("value")),
		duree:parseFloat(org.getElementsByTagName("duree")[0].getAttribute("value")),
		envType:parseInt(org.getElementsByTagName("envtype")[0].getAttribute("value")),
		envX:org.getElementsByTagName("envx")[0].getAttribute("value").split(','),
		envY:org.getElementsByTagName("envy")[0].getAttribute("value").split(','),
		etat:parseInt(org.getElementsByTagName("etat")[0].getAttribute("value")),
		file:org.getElementsByTagName("file")[0].getAttribute("value"),
		fin:parseFloat(org.getElementsByTagName("fin")[0].getAttribute("value")),
		flagTranspo:parseInt(org.getElementsByTagName("flagtranspo")[0].getAttribute("value")),
		gain:parseFloat(org.getElementsByTagName("gain")[0].getAttribute("value")),
		groupe:org.getElementsByTagName("groupe")[0].getAttribute("value"),
		height:parseFloat(org.getElementsByTagName("height")[0].getAttribute("value")),
		id:"objet"+nbObjets,
		margeG:parseFloat(org.getElementsByTagName("margeg")[0].getAttribute("value")),
		margeH:parseFloat(org.getElementsByTagName("margeh")[0].getAttribute("value")),
		mute:org.getElementsByTagName("mute")[0].getAttribute("value"),
		nom:org.getElementsByTagName("nom")[0].getAttribute("value"),
		objBorderC:org.getElementsByTagName("objborderc")[0].getAttribute("value"),
		objBorderW:parseFloat(org.getElementsByTagName("objborderw")[0].getAttribute("value")),
		objColor:org.getElementsByTagName("objcolor")[0].getAttribute("value"),
		objOpacity:parseInt(org.getElementsByTagName("objopacity")[0].getAttribute("value")),
		piste:parseInt(org.getElementsByTagName("piste")[0].getAttribute("value")),
		posX:parseFloat(org.getElementsByTagName("posx")[0].getAttribute("value")),
		posY:parseFloat(org.getElementsByTagName("posY")[0].getAttribute("value")),
		scaleX:parseFloat(org.getElementsByTagName("scalex")[0].getAttribute("value")),
		scaleY:parseFloat(org.getElementsByTagName("scaleY")[0].getAttribute("value")),
		spD:org.getElementsByTagName("spd")[0].getAttribute("value").split(','),
		spT:org.getElementsByTagName("spt")[0].getAttribute("value").split(','),
		spX:org.getElementsByTagName("spx")[0].getAttribute("value").split(','),
		spY:org.getElementsByTagName("spy")[0].getAttribute("value").split(','),
		spZ:org.getElementsByTagName("spz")[0].getAttribute("value").split(','),
		tableFx:org.getElementsByTagName("tableFx")[0].getAttribute("value").split(','),
		tableFxParam:org.getElementsByTagName("tableFxParam")[0].getAttribute("value").split(','),
		type:parseInt(org.getElementsByTagName("type")[0].getAttribute("value")),
		width:parseFloat(org.getElementsByTagName("width")[0].getAttribute("value"))
		}
		
		//console.log(tableObjet[id])
		var np=tableObjet[id].tableFxParam[0].split("&")
		var vp=np[0].split(",")
		
		if(vp.length<2){
			for(k=0;k<7;k++){
				if(tableObjet[id].tableFxParam[k]=='' || tableObjet[id].tableFxParam[k]=='undefined'  || tableObjet[id].tableFxParam[k]=='0' ){
					tableObjet[id].tableFxParam[k]="0?0"
				}else{
					var np=tableObjet[id].tableFxParam[k].split('/')
					var txt=""
					for(m=0;m<np.length;m++){
						txt=txt+np[m]+"/"
					}
					txt=txt.substring(0,txt.length-1)
					tableObjet[id].tableFxParam[k]=txt
				}
			}
		}
		
		if(tableObjet[id].flagTranspo==1){
			tableObjet[id].transposition=invTransposition(tableObjet[id].posY)
		}else{
			tableObjet[id].transposition=1
		}
		for(let i=0;i<7;i++){
			tableObjet[id].envX[i]=parseFloat(tableObjet[id].envX[i])
		}
		for(let i=0;i<7;i++){
			tableObjet[id].envY[i]=parseFloat(tableObjet[id].envY[i])
		}
		var trp=org.getElementsByTagName("bkgTrp")[0].getAttribute("value")
		if(trp=="true"){
			tableObjet[id].bkgTrp=true
		}else{
			tableObjet[id].bkgTrp=false
		}
		var rv=org.getElementsByTagName("reverse")[0].getAttribute("value")
		if(rv=="true"){
			tableObjet[id].reverse=true
		}else{
			tableObjet[id].reverse=false
		}
		if(tableObjet[id].type==23){
			tableObjet[id].img=org.getElementsByTagName("imag")[0].getAttribute("value")
			tableObjet[id].rotate=org.getElementsByTagName("rotation")[0].getAttribute("value")
		}
		
		if(parseInt(org.getElementsByTagName("class")[0].getAttribute("value"))==2){
			sp=[]
   		sp=obj.getElementsByTagName("objet")[i].getElementsByTagName("liste")[0].getAttribute("value").split(",")
   		for(let j=0;j<sp.length;j++){
   			sp[j]=parseInt(sp[j]);	
			}
			tableObjet[i].liste=[].concat(sp)
		}
		if(org.getElementsByTagName("type")[0].getAttribute("value")==1){
			tableObjet[id].r=parseFloat(org.getElementsByTagName("r")[0].getAttribute("value"))
		}
		if(parseInt(obj.getElementsByTagName("objet")[i].getElementsByTagName("type")[0].getAttribute("value"))==4){
			tableObjet[id].rx=org.getElementsByTagName("rx")[0].getAttribute("value")
			tableObjet[id].ry=org.getElementsByTagName("ry")[0].getAttribute("value")
		}
		if(tableObjet[i].class==2){
			var ln=org.getElementsByTagName("liste")[0].getAttribute("value")
			var nl=ln.split(',')
			tableObjet[id].liste=[]
			for(let i=0;i<nl.length;i++){
				tableObjet[id].liste[i]=parseInt(nl[i])
			}
		}
		if(org.getElementsByTagName("type")[0].getAttribute("value")==7 || org.getElementsByTagName("type")[0].getAttribute("value")==8){
			if(org.getElementsByTagName("scaleY2")[0]){
				tableObjet[id].scaleY2=parseFloat(org.getElementsByTagName("scaleY2")[0].getAttribute("value"))
			}
		}
		if(org.getElementsByTagName("type")[0].getAttribute("value")==11){
			tableObjet[id].x1=parseFloat(org.getElementsByTagName("x1")[0].getAttribute("value"))
			tableObjet[id].y1=parseFloat(org.getElementsByTagName("y1")[0].getAttribute("value"))
			tableObjet[id].x2=parseFloat(org.getElementsByTagName("x2")[0].getAttribute("value"))
			tableObjet[id].y2=parseFloat(org.getElementsByTagName("y2")[0].getAttribute("value"))
		}
}
function symbXmlToScore(id,i) {
	var obj=document.getElementById("fichierSave").getElementsByTagName("kandiskyscore")[0]
	var org=obj.getElementsByTagName("objet")[i]
	tableObjet[id]={
		basePosY:parseFloat(org.getElementsByTagName("baseposy")[0].getAttribute("value")),
		bkgColor:org.getElementsByTagName("bkgcolor")[0].getAttribute("value"),
		bkgHeight:parseFloat(org.getElementsByTagName("bkgheight")[0].getAttribute("value")),
		bkgImg:org.getElementsByTagName("bkgimg")[0].getAttribute("value"),
		bkgOpacity:parseFloat(org.getElementsByTagName("bkgopacity")[0].getAttribute("value")),
		bkgWidth:parseFloat(org.getElementsByTagName("bkgwidth")[0].getAttribute("value")),
		borderBc:org.getElementsByTagName("borderbc")[0].getAttribute("value"),
		borderBr:org.getElementsByTagName("borderbr")[0].getAttribute("value"),
		borderBs:org.getElementsByTagName("borderbs")[0].getAttribute("value"),
		borderBw:parseFloat(org.getElementsByTagName("borderbw")[0].getAttribute("value")),
		borderDc:org.getElementsByTagName("borderdc")[0].getAttribute("value"),
		borderDr:org.getElementsByTagName("borderdr")[0].getAttribute("value"),
		borderDs:org.getElementsByTagName("borderds")[0].getAttribute("value"),
		borderDw:parseFloat(org.getElementsByTagName("borderdw")[0].getAttribute("value")),
		borderGc:org.getElementsByTagName("bordergc")[0].getAttribute("value"),
		borderGr:org.getElementsByTagName("bordergr")[0].getAttribute("value"),
		borderGs:org.getElementsByTagName("bordergs")[0].getAttribute("value"),
		borderGw:parseFloat(org.getElementsByTagName("bordergw")[0].getAttribute("value")),
		borderHc:org.getElementsByTagName("borderhc")[0].getAttribute("value"),
		borderHr:org.getElementsByTagName("borderhr")[0].getAttribute("value"),
		borderHs:org.getElementsByTagName("borderhs")[0].getAttribute("value"),
		borderHw:parseFloat(org.getElementsByTagName("borderhw")[0].getAttribute("value")),
		class:parseInt(org.getElementsByTagName("class")[0].getAttribute("value")),
		etat:org.getElementsByTagName("etat")[0].getAttribute("value"),
		groupe:org.getElementsByTagName("groupe")[0].getAttribute("value"),
		height:parseFloat(org.getElementsByTagName("height")[0].getAttribute("value")),
		id:"objet"+nbObjets,
		margeG:parseFloat(org.getElementsByTagName("margeg")[0].getAttribute("value")),
		margeH:parseFloat(org.getElementsByTagName("margeh")[0].getAttribute("value")),
		nom:org.getElementsByTagName("nom")[0].getAttribute("value"),
		objColor:org.getElementsByTagName("objcolor")[0].getAttribute("value"),
		objOpacity:parseFloat(org.getElementsByTagName("objopacity")[0].getAttribute("value")),
		posX:parseFloat(org.getElementsByTagName("posx")[0].getAttribute("value")),
		posY:parseFloat(org.getElementsByTagName("posY")[0].getAttribute("value")),
		rotate:parseFloat(org.getElementsByTagName("rotate")[0].getAttribute("value")),
		scaleX:parseFloat(org.getElementsByTagName("scalex")[0].getAttribute("value")),
		scaleY:parseFloat(org.getElementsByTagName("scaley")[0].getAttribute("value")),
		scaleY2:parseFloat(org.getElementsByTagName("scaley2")[0].getAttribute("value")),
		type:parseInt(org.getElementsByTagName("type")[0].getAttribute("value")),
		x1:parseFloat(org.getElementsByTagName("x1")[0].getAttribute("value")),
		y1:parseFloat(org.getElementsByTagName("y1")[0].getAttribute("value")),
		x2:parseFloat(org.getElementsByTagName("x2")[0].getAttribute("value")),
		y2:parseFloat(org.getElementsByTagName("y2")[0].getAttribute("value")),
		width:parseFloat(org.getElementsByTagName("width")[0].getAttribute("value"))
		}
		
		var trp=org.getElementsByTagName("bkgTrp")[0].getAttribute("value")
		if(trp=="true"){
			tableObjet[id].bkgTrp=true
		}else{
			tableObjet[id].bkgTrp=false
		}
}
function grpXmlToScore(id,i,offset) {
	var obj=document.getElementById("fichierSave").getElementsByTagName("kandiskyscore")[0]
	var org=obj.getElementsByTagName("objet")[i]
	tableObjet[id]={
	basePosY:parseFloat(org.getElementsByTagName("baseposy")[0].getAttribute("value")),
	bkgColor:org.getElementsByTagName("bkgcolor")[0].getAttribute("value"),
	bkgHeight:parseFloat(org.getElementsByTagName("bkgheight")[0].getAttribute("value")),
	bkgImg:org.getElementsByTagName("bkgimg")[0].getAttribute("value"),
	bkgOpacity:parseFloat(org.getElementsByTagName("bkgopacity")[0].getAttribute("value")),
	bkgTrp:org.getElementsByTagName("bkgtrp")[0].getAttribute("value"),
	bkgWidth:parseFloat(org.getElementsByTagName("bkgwidth")[0].getAttribute("value")),
	borderBc:org.getElementsByTagName("borderbc")[0].getAttribute("value"),
	borderBr:org.getElementsByTagName("borderbr")[0].getAttribute("value"),
	borderBs:org.getElementsByTagName("borderbs")[0].getAttribute("value"),
	borderBw:parseFloat(org.getElementsByTagName("borderbw")[0].getAttribute("value")),
	borderDc:org.getElementsByTagName("borderdc")[0].getAttribute("value"),
	borderDr:org.getElementsByTagName("borderdr")[0].getAttribute("value"),
	borderDs:org.getElementsByTagName("borderds")[0].getAttribute("value"),
	borderDw:parseFloat(org.getElementsByTagName("borderdw")[0].getAttribute("value")),
	borderGc:org.getElementsByTagName("bordergc")[0].getAttribute("value"),
	borderGr:org.getElementsByTagName("bordergr")[0].getAttribute("value"),
	borderGs:org.getElementsByTagName("bordergs")[0].getAttribute("value"),
	borderGw:parseFloat(org.getElementsByTagName("bordergw")[0].getAttribute("value")),
	borderHc:org.getElementsByTagName("borderhc")[0].getAttribute("value"),
	borderHr:org.getElementsByTagName("borderhr")[0].getAttribute("value"),
	borderHs:org.getElementsByTagName("borderhs")[0].getAttribute("value"),
	borderHw:parseFloat(org.getElementsByTagName("borderhw")[0].getAttribute("value")),
	class:parseInt(org.getElementsByTagName("class")[0].getAttribute("value")),
	etat:org.getElementsByTagName("etat")[0].getAttribute("value"),
	groupe:org.getElementsByTagName("groupe")[0].getAttribute("value"),
	height:parseFloat(org.getElementsByTagName("height")[0].getAttribute("value")),
	id:"grp"+nbObjets,
	nom:org.getElementsByTagName("nom")[0].getAttribute("value"),
	piste:parseInt(org.getElementsByTagName("piste")[0].getAttribute("value")),
	posX:parseFloat(org.getElementsByTagName("posx")[0].getAttribute("value")),
	posY:parseFloat(org.getElementsByTagName("posy")[0].getAttribute("value")),
	width:parseFloat(org.getElementsByTagName("width")[0].getAttribute("value"))
	}
	var trp=org.getElementsByTagName("bkgTrp")[0].getAttribute("value")
		if(trp=="true"){
			tableObjet[id].bkgTrp=true
		}else{
			tableObjet[id].bkgTrp=false
		}
	var ln=org.getElementsByTagName("liste")[0].getAttribute("value")
	var nl=ln.split(',')

	tableObjet[id].liste=[]
	for(let i=0;i<nl.length;i++){
		tableObjet[id].liste[i]=parseInt(nl[i])+offset
	}
}
function syncDelay(milliseconds) {
  var start = new Date().getTime();
  var end = 0;
  while ((end - start) < milliseconds) {
    end = new Date().getTime();
  }
}
function defObjets(i,liste,dx,dy){
	var obj=document.getElementById("fichierSave").getElementsByTagName("kandiskyscore")[0];
			var nb=obj.getElementsByTagName("objet").length
			for(let i=0;i<nb;i++){
				var cl=parseInt(obj.getElementsByTagName("objet")[i].getElementsByTagName("class")[0].getAttribute("value"))
				
				switch(cl){
					case 1:
						objXmlToScore(nbObjets,i)
						tableObjet[nbObjets].posX=tableObjet[nbObjets].posX+dx
						tableObjet[nbObjets].posY=tableObjet[nbObjets].posY+dy
						drawObj(nbObjets)
						for(let j=0;j<tableBuffer.length;j++){
							if(tableObjet[nbObjets].file==tableBuffer[j].name){
								tableObjet[nbObjets].bufferId=j
								tableObjet[nbObjets].duree=tableBuffer[j].buffer.duration
								break
							}
						}
						nbObjets++
						break
					case 2:
						objXmlToScore(nbObjets,i)
						tableObjet[nbObjets].posX=tableObjet[nbObjets].posX+dx
						tableObjet[nbObjets].posY=tableObjet[nbObjets].posY+dy
						drawObj(nbObjets)
						document.getElementById(tableObjet[nbObjets].id).id="grp"+nbObjets
						tableObjet[nbObjets].id="grp"+nbObjets
						nbObjets++
						break
					case 3:
						symbXmlToScore(nbObjets,i)
						tableObjet[nbObjets].posX=tableObjet[nbObjets].posX+dx
						tableObjet[nbObjets].posY=tableObjet[nbObjets].posY+dy
						objActif=nbObjets
						createSymbole2(tableObjet[objActif].type)
						dragElement(document.getElementById(tableObjet[objActif].id))
						document.getElementById(tableObjet[objActif].id).addEventListener('mouseup',selectBkgObj)
						nbObjets++
						break
					case 4:
						grpXmlToScore(nbObjets,i,offset)
						tableObjet[nbObjets].posX=tableObjet[nbObjets].posX+dx
						tableObjet[nbObjets].posY=tableObjet[nbObjets].posY+dy
						graphGrp(nbObjets)
						dragElement(document.getElementById(tableObjet[nbObjets].id))
						document.getElementById(tableObjet[nbObjets].id).addEventListener('mouseup',selectBkgObj)
						nbObjets++
						break
				}
			}
			var txt=paramProjet.name+","+paramProjet.path+","+paramProjet.audioPath+","+paramProjet.imgPath+","+editor+","+daw+","+cmdDaw+","+pdfPage+","+pdfLandscape+","+pdfScale+","+pdfMgTop+","+pdfMgBot+","+pdfMgLeft+','+pdfMgRight+","+pdfBkg+","+pdfAssCmd+","+pdfAppCmd+","+editAudioCmd
			window.api.send("toMain", 'defExterne;'+btoa(txt))
}
function initTableBuffer(i,liste,dx,dy) {
	var request = new XMLHttpRequest();
    request.open('GET', paramProjet.audioPath+liste[i], true);
    request.responseType = 'arraybuffer';
    
    request.onload = function() {
    contextAudio.decodeAudioData(request.response, function(buffer) {
    	var url=paramProjet.audioPath+liste[i]
    	var pathnom=url.split('/')
     	var file=pathnom[pathnom.length-1]
    	tableBuffer.push({name:file,buffer:buffer});
    	
    	i++
    
    	if(i<liste.length){
    		initTableBuffer(i,liste,dx,dy)
    	}else{
			defObjets(i,liste,dx,dy)
		}
    });
 	}
    request.send();

}
function initTableGrp(i,liste,dx,dy) {
	var obj=document.getElementById("fichierSave").getElementsByTagName("kandiskyscore")[0];
	var offset=nbObjets
	var nb=obj.getElementsByTagName("objet").length

	var request = new XMLHttpRequest();
    request.open('GET', paramProjet.audioPath+liste[i], true);
    request.responseType = 'arraybuffer';
    request.onload = function() {
    contextAudio.decodeAudioData(request.response, function(buffer) {
    	var url=paramProjet.audioPath+liste[i]
    	var pathnom=url.split('/')
     	var file=pathnom[pathnom.length-1]
    	tableBuffer.push({name:file,buffer:buffer});
    	i++
    	if(i<liste.length){
    		initTableGrp(i,liste,dx,dy)
    	}else{	
			for(let i=0;i<nb;i++){
				var cl=parseInt(obj.getElementsByTagName("objet")[i].getElementsByTagName("class")[0].getAttribute("value"))
				switch(cl){
					case 1:
						objXmlToScore(nbObjets,i)
						if(nbObjets==offset){
							var offsetX=tableObjet[nbObjets].posX
							var offsetY=tableObjet[nbObjets].posY
							tableObjet[nbObjets].posX=dx
							tableObjet[nbObjets].posY=dy
						}else{
							tableObjet[nbObjets].posX=(tableObjet[nbObjets].posX-offsetX)+dx
							tableObjet[nbObjets].posY=(tableObjet[nbObjets].posY-offsetY)+dy
						}
						drawObj(nbObjets)
						for(let j=0;j<tableBuffer.length;j++){
							if(tableObjet[nbObjets].file==tableBuffer[j].name){
								tableObjet[nbObjets].bufferId=j
								tableObjet[nbObjets].duree=tableBuffer[j].buffer.duration
								break
							}
						}
						nbObjets++
						break
					case 2:
						objXmlToScore(nbObjets,i)
						if(nbObjets==offset){
							var offsetX=tableObjet[nbObjets].posX
							var offsetY=tableObjet[nbObjets].posY
							tableObjet[nbObjets].posX=dx
							tableObjet[nbObjets].posY=dy
						}else{
							tableObjet[nbObjets].posX=(tableObjet[nbObjets].posX-offsetX)+dx
							tableObjet[nbObjets].posY=(tableObjet[nbObjets].posY-offsetY)+dy
						}
						drawObj(nbObjets)
						document.getElementById(tableObjet[nbObjets].id).id="grp"+nbObjets
						tableObjet[nbObjets].id="grp"+nbObjets
						nbObjets++
						break
					case 3:
						symbXmlToScore(nbObjets,i)
						objActif=nbObjets
						if(nbObjets==offset){
							var offsetX=tableObjet[nbObjets].posX
							var offsetY=tableObjet[nbObjets].posY
							tableObjet[nbObjets].posX=dx
							tableObjet[nbObjets].posY=dy
						}else{
							tableObjet[nbObjets].posX=(tableObjet[nbObjets].posX-offsetX)+dx
							tableObjet[nbObjets].posY=(tableObjet[nbObjets].posY-offsetY)+dy
						}
						createSymbole2(tableObjet[nbObjets].type)
						dragElement(document.getElementById(tableObjet[nbObjets].id))
						document.getElementById(tableObjet[nbObjets].id).addEventListener('mouseup',selectBkgObj)
						nbObjets++
						break
					case 4:
						grpXmlToScore(nbObjets,i,offset)
						if(nbObjets==offset){
							var offsetX=tableObjet[nbObjets].posX
							var offsetY=tableObjet[nbObjets].posY
							tableObjet[nbObjets].posX=dx
							tableObjet[nbObjets].posY=dy
						}else{
							tableObjet[nbObjets].posX=(tableObjet[nbObjets].posX-offsetX)+dx
							tableObjet[nbObjets].posY=(tableObjet[nbObjets].posY-offsetY)+dy
						}
						graphGrp(nbObjets)
						dragElement(document.getElementById(tableObjet[nbObjets].id))
						document.getElementById(tableObjet[nbObjets].id).addEventListener('mouseup',selectBkgObj)
						nbObjets++
						break
				}
			}
		}
	});
    }
	 request.send();
}
function fileXmlToScore(offset,dx,dy) {
	nbObjets=offset
	if(offset==0){
		defProjetConfig()
		defSpaceConfig()
		defInterfaceConfig()
		defPaletteConfig()
		configPalette()
		defExterneConfig()
		upDateWorkSpace(1)
	}
	var tmpbuffer=[]
	if(offset==0){
	var obj=document.getElementById("fichierSave").getElementsByTagName("kandiskyscore")[0].getElementsByTagName("audioliste")[0]
	var tmpv=obj.getAttribute("value")
		if(tmpv!=""){
			tmpbuffer=tmpv.split(',')
			initTableBuffer(0,tmpbuffer,dx,dy)
		}else{
			defObjets(0,tmpbuffer,dx,dy)
		}
	}
}
function drawObj(id) {
	var obj=""
	switch(tableObjet[id].type){
		case 1:
			graphCircle(id)
			break
		case 2:
			graphCarre(id)
			break
		case 3:
			graphTriangle(id)
			break
		case 4:
			graphEllipse(id)
			break
		case 5:
			graphRectangle(id)
			break
		case 6:
			graphTriangleLong(id)
			break
		case 7:
			graphRondLong(id)
			break
		case 8:
			graphCarreLong(id)
			break
		case 9:
			graphCrescr(id)
			break
		case 10:
			graphLigne(id)
			break
		case 11:
			graphGlissando(id)
			dragElement(document.getElementById('gliss'+id));
			break
		case 12:
			graphBlock(id)
			break
		case 13:
			graphFusion(id)
			break
		case 14:
			graphDecresc(id)
			break
		case 15:
			graphDecrescb(id)
			break
		case 16:
			graphCresc(id)
			break
		case 17:
			graphCrescb(id)
			break
		case 18:
			graphGroupe(id)
			break
		case 19:
			graphGroupe(id)
			break
		case 20:
			graphGroupe(id)
			break
		case 21:
			graphNuage(id)
			break
		case 22:
			graphGroupe(id)
			break
		case 23:
			objActif=id
			selectObj="objet"+objActif
			graphImage(imgDirectory+tableObjet[id].img)
			break
		case 24:
			//graphText(objActif)
			break
	}
	obj="objet"+id
	dragElement(document.getElementById(tableObjet[id].id))
	document.getElementById(tableObjet[id].id).addEventListener('mouseup',selectBkgObj)
}
function defProjetConfig() {
	paramProjet={}
	var obj=document.getElementById("fichierSave").getElementsByTagName("kandiskyscore")[0].getElementsByTagName("general")[0]
	paramProjet={
		name:obj.getElementsByTagName("name")[0].getAttribute("value"),
		start:obj.getElementsByTagName("start")[0].getAttribute("value"),
		end:obj.getElementsByTagName("end")[0].getAttribute("value"),
		comment:obj.getElementsByTagName("comment")[0].getAttribute("value"),
		path:obj.getElementsByTagName("path")[0].getAttribute("value"),
		audioPath:obj.getElementsByTagName("audiopath")[0].getAttribute("value"),
		imgPath:obj.getElementsByTagName("imgpath")[0].getAttribute("value"),
		greffon3D:obj.getElementsByTagName("greffon3d")[0].getAttribute("value"),
		greffonC:obj.getElementsByTagName("channels")[0].getAttribute("value"),
		regle:JSON.parse(obj.getElementsByTagName("regle")[0].getAttribute("value")),
		mesure:JSON.parse(obj.getElementsByTagName("mesure")[0].getAttribute("value")),
		grille:JSON.parse(obj.getElementsByTagName("grille")[0].getAttribute("value")),
		spaceSeconde:JSON.parse(obj.getElementsByTagName("spaceseconde")[0].getAttribute("value")),
		width:obj.getElementsByTagName("winwidth")[0].getAttribute("value"),
		height:obj.getElementsByTagName("winheight")[0].getAttribute("value"),
		zoom:obj.getElementsByTagName("zoom")[0].getAttribute("value"),
		svgRegle:JSON.parse(obj.getElementsByTagName("svgregle")[0].getAttribute("value")),
		svgMesure:JSON.parse(obj.getElementsByTagName("svgmesure")[0].getAttribute("value")),
		svgGrille:JSON.parse(obj.getElementsByTagName("svggrille")[0].getAttribute("value")),
		svgSeconde:JSON.parse(obj.getElementsByTagName("svgseconde")[0].getAttribute("value"))
	}
	importConfigProjet()
}
function defSpaceConfig() {
	paramSpace={}
	var obj=document.getElementById("fichierSave").getElementsByTagName("kandiskyscore")[0].getElementsByTagName("spatialisation")[0]
	paramSpace={
		lForwardX:obj.getElementsByTagName("lforwardx")[0].getAttribute("value"),
		lForwardY:obj.getElementsByTagName("lforwardy")[0].getAttribute("value"),
		lForwardZ:obj.getElementsByTagName("lforwardz")[0].getAttribute("value"),
		lUpX:obj.getElementsByTagName("lupx")[0].getAttribute("value"),
		lUpY:obj.getElementsByTagName("lupy")[0].getAttribute("value"),
		lUpZ:obj.getElementsByTagName("lupz")[0].getAttribute("value"),
		lPosX:obj.getElementsByTagName("lposx")[0].getAttribute("value"),
		lPosY:obj.getElementsByTagName("lposy")[0].getAttribute("value"),
		lPosZ:obj.getElementsByTagName("lposz")[0].getAttribute("value"),
		PModel:obj.getElementsByTagName("pmodel")[0].getAttribute("value"),
		DModel:obj.getElementsByTagName("dmodel")[0].getAttribute("value"),
		refD:obj.getElementsByTagName("refd")[0].getAttribute("value"),
		maxD:obj.getElementsByTagName("maxd")[0].getAttribute("value"),
		rolF:obj.getElementsByTagName("rolf")[0].getAttribute("value"),
		coneIA:obj.getElementsByTagName("coneia")[0].getAttribute("value"),
		coneOA:obj.getElementsByTagName("coneoa")[0].getAttribute("value"),
		coneOG:obj.getElementsByTagName("coneog")[0].getAttribute("value"),
		orX:obj.getElementsByTagName("orx")[0].getAttribute("value"),
		orY:obj.getElementsByTagName("ory")[0].getAttribute("value"),
		orZ:obj.getElementsByTagName("orz")[0].getAttribute("value")
	}
	importConfigSpace()
}
function defInterfaceConfig() {
	var obj=document.getElementById("fichierSave").getElementsByTagName("kandiskyscore")[0].getElementsByTagName("interface")[0]
	paletteBkg = obj.getElementsByTagName("palettebkg")[0].getAttribute("value")
	fontPalette = obj.getElementsByTagName("fontpalette")[0].getAttribute("value")
	fontPaletteSize = obj.getElementsByTagName("fontpalettesize")[0].getAttribute("value")
	separateurPalette = obj.getElementsByTagName("separateurpalette")[0].getAttribute("value")
	bkgInfo = obj.getElementsByTagName("bkginfo")[0].getAttribute("value")
	fontInfoSize = obj.getElementsByTagName("fontinfosize")[0].getAttribute("value")
	fontInfoColor = obj.getElementsByTagName("fontinfocolor")[0].getAttribute("value")
	regleBackground = obj.getElementsByTagName("reglebackground")[0].getAttribute("value")
	regleFontSize = obj.getElementsByTagName("reglefontsize")[0].getAttribute("value")
	regleFontColor = obj.getElementsByTagName("reglefontcolor")[0].getAttribute("value")
	intervalBackground = obj.getElementsByTagName("intervalbackground")[0].getAttribute("value")
	intervalFontSize = obj.getElementsByTagName("intervalfontsize")[0].getAttribute("value")
	fontintervalcolor = obj.getElementsByTagName("separateurpalette")[0].getAttribute("value")
	workSpaceBkg = obj.getElementsByTagName("workspacebkg")[0].getAttribute("value")
	spaceGrilleOpacity = obj.getElementsByTagName("spacegrilleopacity")[0].getAttribute("value")
	colorgrille = obj.getElementsByTagName("colorgrille")[0].getAttribute("value")
	suiveurBkg = obj.getElementsByTagName("suiveurbkg")[0].getAttribute("value")
	popupTitreBkg = obj.getElementsByTagName("popuptitrebkg")[0].getAttribute("value")
	popupHeaderFontSize = obj.getElementsByTagName("popupheaderfontsize")[0].getAttribute("value")
	popupFontTitreColor = obj.getElementsByTagName("popupfonttitrecolor")[0].getAttribute("value")
	popupFontColor = obj.getElementsByTagName("popupfontcolor")[0].getAttribute("value")
	popupBkgColor = obj.getElementsByTagName("popupbkgcolor")[0].getAttribute("value")
	popupFontSize = obj.getElementsByTagName("popupfontsize")[0].getAttribute("value")
	popupongletfontcolor = obj.getElementsByTagName("separateurpalette")[0].getAttribute("value")
	popupFontOngletSize = obj.getElementsByTagName("popupongletfontcolor")[0].getAttribute("value")
	popupOngletBkg = obj.getElementsByTagName("popupongletbkg")[0].getAttribute("value")
	popupOngletActifBkg = obj.getElementsByTagName("popupongletactifbkg")[0].getAttribute("value")
	lang = obj.getElementsByTagName("lang")[0].getAttribute("value")
	defInterface()
}
function defPaletteConfig() {
	var obj=document.getElementById("fichierSave").getElementsByTagName("kandiskyscore")[0].getElementsByTagName("palette")[0]
	paletteDisque = obj.getElementsByTagName("palettedisque")[0].getAttribute("value")
	paletteCarre = obj.getElementsByTagName("palettecarre")[0].getAttribute("value")
	paletteTriangle = obj.getElementsByTagName("palettetriangle")[0].getAttribute("value")
	paletteEllipse = obj.getElementsByTagName("paletteellipse")[0].getAttribute("value")
	paletteRectangle = obj.getElementsByTagName("paletterectangle")[0].getAttribute("value")
	paletteTrianglelong = obj.getElementsByTagName("palettetrianglelong")[0].getAttribute("value")
	paletteRondlong = obj.getElementsByTagName("paletterondlong")[0].getAttribute("value")
	paletteCarrelong = obj.getElementsByTagName("palettecarrelong")[0].getAttribute("value")
	paletteCrescendo = obj.getElementsByTagName("palettecrescendo")[0].getAttribute("value")
	paletteLigne = obj.getElementsByTagName("paletteligne")[0].getAttribute("value")
	paletteGlissando = obj.getElementsByTagName("paletteglissando")[0].getAttribute("value")
	paletteBlock = obj.getElementsByTagName("paletteblock")[0].getAttribute("value")
	paletteDecresc = obj.getElementsByTagName("palettedecresc")[0].getAttribute("value")
	paletteDecrescb = obj.getElementsByTagName("palettedecrescb")[0].getAttribute("value")
	paletteCresc = obj.getElementsByTagName("palettecresc")[0].getAttribute("value")
	paletteCrescb = obj.getElementsByTagName("palettecrescb")[0].getAttribute("value")
	paletteAgregat = obj.getElementsByTagName("paletteagregat")[0].getAttribute("value")
	paletteArpege = obj.getElementsByTagName("palettearpege")[0].getAttribute("value")
	paletteMultilignes = obj.getElementsByTagName("palettemultilignes")[0].getAttribute("value")
	paletteNuage = obj.getElementsByTagName("palettenuage")[0].getAttribute("value")
	paletteTexture = obj.getElementsByTagName("palettetexture")[0].getAttribute("value")
	paletteImage = obj.getElementsByTagName("paletteimage")[0].getAttribute("value")
	paletteSymb = obj.getElementsByTagName("palettesymb")[0].getAttribute("value")
	paletteFleche = obj.getElementsByTagName("palettefleche")[0].getAttribute("value")
	paletteMarque1 = obj.getElementsByTagName("palettemarque1")[0].getAttribute("value")
	paletteMarque2 = obj.getElementsByTagName("palettemarque2")[0].getAttribute("value")
	paletteLecteur = obj.getElementsByTagName("palettelecteur")[0].getAttribute("value")
}
function defExterneConfig() {
	if(document.getElementById("fichierSave").getElementsByTagName("kandiskyscore")[0].getElementsByTagName("externe")[0]){
		var obj=document.getElementById("fichierSave").getElementsByTagName("kandiskyscore")[0].getElementsByTagName("externe")[0]
		editor = obj.getElementsByTagName("externeeditor")[0].getAttribute("value")
		daw = obj.getElementsByTagName("externedaw")[0].getAttribute("value")
		cmdDaw = obj.getElementsByTagName("externecmddaw")[0].getAttribute("value")
		pdfPage = obj.getElementsByTagName("externepdfpage")[0].getAttribute("value")
		pdfLandscape = obj.getElementsByTagName("externepdflandscape")[0].getAttribute("value")
		pdfScale = parseFloat(obj.getElementsByTagName("externepdfscale")[0].getAttribute("value"))
		pdfMgTop = parseFloat(obj.getElementsByTagName("externepdftop")[0].getAttribute("value"))
		pdfMgBot = parseFloat(obj.getElementsByTagName("externepdfbot")[0].getAttribute("value"))
		pdfMgLeft = parseFloat(obj.getElementsByTagName("externepdfleft")[0].getAttribute("value"))
		pdfMgRight = parseFloat(obj.getElementsByTagName("externepdfright")[0].getAttribute("value"))
		pdfBkg = obj.getElementsByTagName("externepdfbkg")[0].getAttribute("value")
		pdfAssCmd = obj.getElementsByTagName("externepdfass")[0].getAttribute("value")
		pdfAppCmd = obj.getElementsByTagName("externepdfapp")[0].getAttribute("value")
		editAudioCmd = obj.getElementsByTagName("externeaudioedit")[0].getAttribute("value")
		if(daw=='reaper'){
			document.getElementById("read3d").src="./images/png/reaper.png"
		}else{
			document.getElementById("read3d").src="./images/png/Ardour-icon.png"
		}
	}
}
let tableBufferIR=[]
function importReverbImpulseResponse(name) {
        // Load impulse response asynchronously
        var request = new XMLHttpRequest();
        var url = "./impulseReponse/"+name+".wav";
        request.open("GET", url, true);
        request.responseType = "arraybuffer";

        request.onload = function () {
          contextAudio.decodeAudioData(
            request.response,
            function (buffer) {
             tableBufferIR[name] = buffer;
            },

            function (buffer) {
              console.log("Error decoding impulse response!");
            }
          );
        };

        request.send();
}
for(let i=0;i<tableIR.length;i++){
	importReverbImpulseResponse(tableIR[i]);
}
let listObjSelect=16777216

function listeAudios() {
	var txt="<table border='1' style='width:100%;' cellpadding='4' cellspacing='0' ><tbody><tr>"
	for(let i=0;i<tableBuffer.length;i++){
		txt=txt+"<td style='width:40%;'>"+tableBuffer[i].name+"</td><td style='width:60%;'>"
		for(let j=0;j<tableObjet.length;j++){
			if(tableObjet[j].bufferId==i){
				txt=txt+"<span class='liste' onclick='selectListeAudios("+j+")'>"+tableObjet[j].nom+"</span>,"
				
			}
		}
		txt=txt.substring(0,txt.length-1)
		txt=txt+"</td></tr>\n"
		txt=txt+"<tr>"
	}
	txt=txt+"</tr></tbody></table>"
	document.getElementById("listeAudiosDiv").innerHTML=txt
	document.getElementById("listeAudios").style.display="block"
}
function listeAnnul() {
	document.getElementById("listeAudios").style.display="none"
	if(listObjSelect<16777216){
		document.getElementById(tableObjet[listObjSelect].id).style.borderLeft=tableObjet[listObjSelect].borderGw+"px "+ tableObjet[listObjSelect].borderGs+" "+tableObjet[listObjSelect].borderGc
		document.getElementById(tableObjet[listObjSelect].id).style.borderTop=tableObjet[listObjSelect].borderHw+"px "+ tableObjet[listObjSelect].borderHs+" "+tableObjet[listObjSelect].borderHc
		document.getElementById(tableObjet[listObjSelect].id).style.borderRight=tableObjet[listObjSelect].borderDw+"px "+ tableObjet[listObjSelect].borderDs+" "+tableObjet[listObjSelect].borderDc
		document.getElementById(tableObjet[listObjSelect].id).style.borderBottom=tableObjet[listObjSelect].borderBw+"px "+ tableObjet[listObjSelect].borderBs+" "+tableObjet[listObjSelect].borderBc
	}
	listObjSelect=16777216
}
function selectListeAudios(def) {
	if(listObjSelect<16777216){
		document.getElementById(tableObjet[listObjSelect].id).style.borderLeft=tableObjet[listObjSelect].borderGw+"px "+ tableObjet[listObjSelect].borderGs+" "+tableObjet[listObjSelect].borderGc
		document.getElementById(tableObjet[listObjSelect].id).style.borderTop=tableObjet[listObjSelect].borderHw+"px "+ tableObjet[listObjSelect].borderHs+" "+tableObjet[listObjSelect].borderHc
		document.getElementById(tableObjet[listObjSelect].id).style.borderRight=tableObjet[listObjSelect].borderDw+"px "+ tableObjet[listObjSelect].borderDs+" "+tableObjet[listObjSelect].borderDc
		document.getElementById(tableObjet[listObjSelect].id).style.borderBottom=tableObjet[listObjSelect].borderBw+"px "+ tableObjet[listObjSelect].borderBs+" "+tableObjet[listObjSelect].borderBc
	}
	document.getElementById(tableObjet[def].id).style.border="4px solid red"
	var bd=Math.floor(tableObjet[def].posX/1270)
	scrollDemo.scrollLeft=bd*1270
	listObjSelect=def
}
function configSave(lg) {
var txt=lg+"\n"
+setTimeRegle+"\n"
+setSignRegle+"\n"
+setGrille+"\n"
+spaceSeconde+"\n"
+zoomScale+"\n"
+baseSpaceHeight+"\n"
+baseSpaceWidth+"\n"
+ratioSpaceHeight+"\n"
+listenerForwardX+"\n"
+listenerForwardY+"\n"
+listenerForwardZ+"\n"
+listenerUpX+"\n"
+listenerUpY+"\n"
+listenerUpZ+"\n"
+listenerPositionX+"\n"
+listenerPositionY+"\n"
+listenerPositionZ+"\n"
+pannerPanningModel+"\n"
+pannerDistanceModel+"\n"
+pannerRefDistance+"\n"
+pannerMaxDistance+"\n"
+pannerRolloffFactor+"\n"
+pannerConeInnerAngle+"\n"
+pannerConeOuterAngle+"\n"
+pannerConeOuterGain+"\n"
+pannerOrientationX+"\n"
+pannerOrientationY+"\n"
+pannerOrientationZ+"\n"
+baseFontSize+"\n"
+paletteBkg+"\n"
+fontPalette+"\n"
+fontPaletteSize+"\n"
+separateurPalette+"\n"
+bkgInfo+"\n"
+fontInfoSize+"\n"
+fontInfoColor+"\n"
+regleBackground+"\n"
+regleFontSize+"\n"
+regleFontColor+"\n"
+intervalBackground+"\n"
+intervalFontSize+"\n"
+fontIntervalColor+"\n"
+workSpaceBkg+"\n"
+spaceGrilleOpacity+"\n"
+colorGrille+"\n"
+suiveurBkg+"\n"
+popupTitreBkg+"\n"
+popupHeaderFontSize+"\n"
+popupFontTitreColor+"\n"
+popupFontColor+"\n"
+popupBkgColor+"\n"
+popupFontSize+"\n"
+popupOngletFontColor+"\n"
+popupFontOngletSize+"\n"
+popupOngletBkg+"\n"
+popupOngletActifBkg+"\n"
+windowOuterWidth+"\n"
+windowOuterHeight+"\n"
+path+"\n"
+imgDirectory+"\n"
+audioDirectory+"\n"
+spat3D+"\n"
+spat3DCanaux+"\n"
+editor+"\n"
+paletteDisque+"\n"
+paletteCarre+"\n"
+paletteTriangle+"\n"
+paletteEllipse+"\n"
+paletteRectangle+"\n"
+paletteTrianglelong+"\n"
+paletteRondlong+"\n"
+paletteCarrelong+"\n"
+paletteCrescendo+"\n"
+paletteLigne+"\n"
+paletteGlissando+"\n"
+paletteBlock+"\n"
+paletteDecresc+"\n"
+paletteDecrescb+"\n"
+paletteCresc+"\n"
+paletteCrescb+"\n"
+paletteAgregat+"\n"
+paletteArpege+"\n"
+paletteMultilignes+"\n"
+paletteNuage+"\n"
+paletteTexture+"\n"
+paletteImage+"\n"
+paletteSymb+"\n"
+paletteFleche+"\n"
+paletteMarque1+"\n"
+paletteMarque2+"\n"
+paletteLecteur+"\n"
+regleSvgFontSize+"\n"
+regleSvgFontColor+"\n"
+vueSvgGrille+"\n"
+vueSvgGrilleColor+"\n"
+vueSvgGrilleOpacity+"\n"
+vueSvgBackground+"\n"
+vueSvgFontSize+"\n"
+vueSvgFontColor+"\n"
+vueSvgRegle+"\n"
+vueSvgMesure+"\n"
+svgSeconde+"\n"
+setTimeRegleSvg+"\n"
+setSignRegleSvg+"\n"
+winWidth+"\n"
+winHeight+"\n"
+daw+"\n"
+cmdDaw+"\n"
+pdfPage+"\n"
+pdfScale+"\n"
+pdfMgTop+"\n"
+pdfMgBot+"\n"
+pdfMgLeft+"\n"
+pdfMgRight+"\n"
+pdfBkg+"\n"
+pdfAssCmd+"\n"
+pdfAppCmd+"\n"
window.api.send("toMain", 'saveConfig;'+btoa(txt))
}
function defTheme() {
var txt=baseFontSize+";"+paletteBkg+";"+fontPalette+";"+fontPaletteSize+";"+separateurPalette+";"+bkgBarreMenu+";"+interfaceMenuOuter+";"+interfaceMenuOver+";"+menuFontColor+";"
txt=txt+fontSizeMenu+";"+bkgInfo+";"+fontInfoSize+";"+fontInfoColor+";"+regleBackground+";"+regleFontSize+";"+regleFontColor+";"+intervalBackground+";"+intervalFontSize+";"+fontIntervalColor+";"
txt=txt+workSpaceBkg+";"+spaceGrilleOpacity+";"+colorGrille+";"+suiveurBkg+";"+popupTitreBkg+";"+popupHeaderFontSize+";"+popupFontTitreColor+";"+popupFontColor+";"+popupBkgColor+";"
txt=txt+popupFontSize+";"+popupOngletFontColor+";"+popupFontOngletSize+";"+popupOngletBkg+";"+popupOngletActifBkg+";"
txt=txt+paletteDisque+";"+paletteCarre+";"+paletteTriangle+";"+paletteEllipse+";"+paletteRectangle+";"+paletteTrianglelong+";"+paletteRondlong+";"+paletteCarrelong+";"+paletteCrescendo+";"
txt=txt+paletteLigne+";"+paletteGlissando+";"+paletteBlock+";"+paletteDecresc+";"+paletteDecrescb+";"+paletteCresc+";"+paletteCrescb+";"+paletteAgregat+";"+paletteArpege+";"+paletteMultilignes
txt=txt+";"+paletteNuage+";"+paletteTexture+";"+paletteImage+";"+paletteSymb+";"+paletteFleche+";"+paletteMarque1+";"+paletteMarque2+";"+paletteLecteur

window.api.send("toMain", 'saveTheme;'+btoa(txt))
}
function selectTheme(txt) {

   // Load lang
   var xhttp = new XMLHttpRequest()
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var fichier=xhttp.responseText
			loadTheme(fichier)
		}
	}
	xhttp.open("GET", txt, true)
	xhttp.send()

}
function loadTheme(file) {
var theme=file.split(";")

baseFontSize=theme[0]
paletteBkg=theme[1]
fontPalette=theme[2]
fontPaletteSize=theme[3]
separateurPalette=theme[4]
bkgBarreMenu=theme[5]
interfaceMenuOuter=theme[6]
interfaceMenuOver=theme[7]
menuFontColor=theme[8]
fontSizeMenu=theme[9]
bkgInfo=theme[10]
fontInfoSize=theme[11]
fontInfoColor=theme[12]
regleBackground=theme[13]
regleFontSize=theme[14]
regleFontColor=theme[15]
intervalBackground=theme[16]
intervalFontSize=theme[17]
fontIntervalColor=theme[18]
workSpaceBkg=theme[19]
spaceGrilleOpacity=theme[20]
colorGrille=theme[21]
suiveurBkg=theme[22]
popupTitreBkg=theme[23]
popupHeaderFontSize=theme[24]
popupFontTitreColor=theme[25]
popupFontColor=theme[26]
popupBkgColor=theme[27]
popupFontSize=theme[28]
popupOngletFontColor=theme[29]
popupFontOngletSize=theme[30]
popupOngletBkg=theme[31]
popupOngletActifBkg=theme[32]

defInterface()
}