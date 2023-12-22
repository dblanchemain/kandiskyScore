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

let tableObjet=[]
let tableBuffer=[];
let selectObjet=''
let objActif=1048576
let nbObjets=0
let saveObjet={}
let nselector=0
let grpSelect=0
let lsgrp=[]
let preservSelect=[]
let inclusionEtat=0
let paramProjet={}
let paramSpace={}

var contextAudio=new AudioContext()



function importLang(name) {
   // Load lang
   var xhttp = new XMLHttpRequest()
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var txt=xhttp.responseText
			defLang(txt)
		}
	}
	xhttp.open("GET", name, true)
	xhttp.send()
}
function defLang (txt) {
	var ntxt = txt.split('\n')
	var sp=[]
	for(let i=0;i<ntxt.length-1;i++){
		sp=ntxt[i].split('=')
		tableLang[sp[0]]=sp[1]
	}
	interfaceLang ()
}
function interfaceLang () {
	document.getElementById('compteur').innerHTML=tableLang['Icompt']  //                   Espace de travail
	document.getElementById('tempo1').innerHTML=tableLang['Itempo']
	document.getElementById('sign').innerHTML=tableLang['Isign']
	document.getElementById('workspace').innerHTML=tableLang['Iworkspace']
	document.getElementById('contexte').innerHTML=tableLang['Icontext']
	document.getElementById('bdsvgt').innerHTML=tableLang['Rdeb']
	document.getElementById('bfsvgt').innerHTML=tableLang['Rfin']
	
	document.getElementById('arpegest').innerHTML=tableLang['Parpeges']  //                   Palette
	document.getElementById('articulationst').innerHTML=tableLang['Particul']
	document.getElementById('inscriptionst').innerHTML=tableLang['Pinscript']
	document.getElementById('paletteLignest').innerHTML=tableLang['Plignes']
	document.getElementById('paletteNuancest').innerHTML=tableLang['Pnuances']
	document.getElementById('paletteObjetst').innerHTML=tableLang['Psymboles']
	document.getElementById('paletteLignest').innerHTML=tableLang['Plignes']
	
	document.getElementById('varial').innerHTML=tableLang['Variation']
	document.getElementById('variah').innerHTML=tableLang['VHaut']
	document.getElementById('alea').innerHTML=tableLang['Aleat']
}
function defInterface() {
 document.getElementById("principal").style.backgroundColor=paletteBkg;
 document.getElementById("principal").style.color=fontPalette;
 document.getElementById("principal").style.fontSize=fontPaletteSize;
 document.getElementById("paramGlobal").style.backgroundColor=bkgInfo;
 document.getElementById("paramGlobal").style.color=fontInfoColor;
 document.getElementById("paramGlobal").style.fontSize=fontInfoSize;
 var lstPalette=document.getElementsByClassName("palette");
	for(let i=0;i<lstPalette.length;i++){
	lstPalette[i].style.borderColor=separateurPalette;
	}
 document.getElementById("regle").style.backgroundColor=regleBackground;
 document.getElementById("reglette").style.backgroundColor=regleBackground;
 document.getElementById("regle").firstChild.setAttribute('style',"font:"+regleFontSize+"em sans-serif;stroke:"+regleFontColor+";fill:"+regleFontColor)
  document.getElementById("reglette").firstChild.setAttribute('style',"font:"+(regleFontSize-1)+"em sans-serif;stroke:"+regleFontColor+";fill:"+regleFontColor)
 document.getElementById("bdsvg").setAttribute("fill",intervalBackground);
 document.getElementById("bfsvg").setAttribute("fill",intervalBackground);
 document.getElementById("bdsvgt").setAttribute("style","fill:"+fontIntervalColor+";font-size:"+intervalFontSize+"em;");
 document.getElementById("bfsvgt").setAttribute("style","fill:"+fontIntervalColor+";font-size:"+intervalFontSize+"em;");
 document.getElementById("bdsvgt").setAttribute("font-size",intervalFontSize);
 document.getElementById("bfsvgt").setAttribute("font-size",intervalFontSize);
 document.getElementById("space").style.backgroundColor=workSpaceBkg;
 /*
 document.getElementById("clgrilleBkg").style.backgroundColor=colorGrille;
 document.getElementById("opacityGrille").value=spaceGrilleOpacity;
 var tbgrille=document.getElementById("space").getElementsByClassName("grille");
	for(let i=0;i<tbgrille.length;i++){
		tbgrille[i].style.backgroundColor=colorGrille;
		tbgrille[i].style.opacity=spaceGrilleOpacity;
	}
*/
 document.getElementById("bvsvg").style.backgroundColor=suiveurBkg;
 document.getElementById("bvsvgt").setAttribute("fill",suiveurBkg);
  
 var tbgrille=document.getElementsByClassName("popupHeader");
for(let i=0;i<tbgrille.length;i++){
	tbgrille[i].style.backgroundColor=popupTitreBkg;
	tbgrille[i].style.color=popupFontTitreColor;
	tbgrille[i].style.fontSize=popupHeaderFontSize;
}
var tbgrille=document.getElementsByClassName("popup");
for(let i=0;i<tbgrille.length;i++){
	tbgrille[i].style.backgroundColor=popupBkgColor;
	tbgrille[i].style.color=popupFontColor;
	tbgrille[i].style.fontSize=popupFontSize;
}
	
}
function configPalette() {
	
	document.getElementById("circle").setAttribute("fill",paletteDisque)
	document.getElementById("carre").setAttribute("fill",paletteCarre)
	document.getElementById("triangle").setAttribute("fill",paletteTriangle)
	document.getElementById("ellipse").setAttribute("fill",paletteEllipse)
	document.getElementById("rectangle").setAttribute("fill",paletteRectangle)
	document.getElementById("triangle").setAttribute("fill",paletteTrianglelong)
	document.getElementById("rondlong").firstChild.firstChild.setAttribute("fill",paletteRondlong)
	document.getElementById("rondlong").firstChild.firstChild.nextSibling.setAttribute("fill",paletteRondlong)
	document.getElementById("carrelong").firstChild.firstChild.setAttribute("fill",paletteCarrelong)
	document.getElementById("carrelong").firstChild.firstChild.nextSibling.setAttribute("fill",paletteCarrelong)
	document.getElementById("crescendo").setAttribute("fill",paletteCrescendo)
	document.getElementById("ligne").setAttribute("stroke",paletteLigne)
	document.getElementById("glissando").setAttribute("stroke",paletteGlissando)
	document.getElementById("block").setAttribute("stroke",paletteBlock)
	document.getElementById("decresc").firstChild.firstChild.setAttribute("fill",paletteDecresc)
	document.getElementById("decrescb").firstChild.firstChild.setAttribute("fill",paletteDecrescb)
	document.getElementById("cresc").firstChild.firstChild.setAttribute("fill",paletteCresc)
	document.getElementById("crescb").firstChild.firstChild.setAttribute("fill",paletteCrescb)
	document.getElementById("agregat").firstChild.firstChild.setAttribute("fill",paletteAgregat)
	document.getElementById("agregat").firstChild.firstChild.nextSibling.setAttribute("fill",paletteAgregat)
	document.getElementById("agregat").firstChild.firstChild.nextSibling.nextSibling.setAttribute("fill",paletteAgregat)
	document.getElementById("agregat").firstChild.firstChild.nextSibling.nextSibling.nextSibling.setAttribute("fill",paletteAgregat)
	document.getElementById("arpege").firstChild.firstChild.setAttribute("fill",paletteArpege)
	document.getElementById("arpege").firstChild.firstChild.nextSibling.setAttribute("fill",paletteArpege)
	document.getElementById("arpege").firstChild.firstChild.nextSibling.nextSibling.setAttribute("fill",paletteArpege)
	document.getElementById("arpege").firstChild.firstChild.nextSibling.nextSibling.nextSibling.setAttribute("fill",paletteArpege)
	document.getElementById("arpege").firstChild.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.setAttribute("fill",paletteArpege)
	document.getElementById("arpege").firstChild.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.setAttribute("fill",paletteArpege)
	document.getElementById("arpege").firstChild.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.setAttribute("fill",paletteArpege)
	document.getElementById("multilignes").firstChild.firstChild.setAttribute("stroke",paletteMultilignes)
	document.getElementById("multilignes").firstChild.firstChild.nextSibling.setAttribute("stroke",paletteMultilignes)
	document.getElementById("multilignes").firstChild.firstChild.nextSibling.nextSibling.setAttribute("stroke",paletteMultilignes)
	document.getElementById("multilignes").firstChild.firstChild.nextSibling.nextSibling.nextSibling.setAttribute("stroke",paletteMultilignes)
	document.getElementById("multilignes").firstChild.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.setAttribute("stroke",paletteMultilignes)
	document.getElementById("multilignes").firstChild.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.setAttribute("stroke",paletteMultilignes)
	document.getElementById("multilignes").firstChild.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.setAttribute("stroke",paletteMultilignes)
	document.getElementById("nuage").firstChild.firstChild.setAttribute("fill",paletteNuage)
	document.getElementById("texture").firstChild.firstChild.nextSibling.setAttribute("fill",paletteTexture)
	document.getElementById("texture").firstChild.firstChild.nextSibling.nextSibling.setAttribute("fill",paletteTexture)
	document.getElementById("texture").firstChild.firstChild.nextSibling.nextSibling.nextSibling.setAttribute("fill",paletteTexture)
	document.getElementById("texture").firstChild.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.setAttribute("fill",paletteTexture)
	document.getElementById("texture").firstChild.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.setAttribute("fill",paletteTexture)
	document.getElementById("texture").firstChild.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.setAttribute("fill",paletteTexture)
	document.getElementById("texture").firstChild.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.setAttribute("fill",paletteTexture)
	document.getElementById("texture").firstChild.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.setAttribute("fill",paletteTexture)
	//paletteSymb = obj.getElementsByTagName("palettesymb")[0].getAttribute("value")
	/*
	paletteFleche = obj.getElementsByTagName("palettefleche")[0].getAttribute("value")
	paletteMarque1 = obj.getElementsByTagName("palettemarque1")[0].getAttribute("value")
	paletteMarque2 = obj.getElementsByTagName("palettemarque2")[0].getAttribute("value")
	paletteLecteur = obj.getElementsByTagName("palettelecteur")[0].getAttribute("value")
	*/
	var txt=imgpart.replaceAll('#000000', paletteImage)
	txt=imgpart.replaceAll('#000000', paletteImage)
	document.getElementById("Image").innerHTML=txt
	symbCreate()
}
function symbCreate(){
	document.getElementById("symb1").firstChild.firstChild.innerHTML=glyphArpege
	document.getElementById("symb1").firstChild.firstChild.setAttribute("stroke",paletteSymb)
	document.getElementById("symb1").firstChild.firstChild.setAttribute("fill",paletteSymb)
	document.getElementById("symb1").firstChild.setAttribute("transform",'scale(1.2 1.2) translate(10 0) rotate(0 0 0) ')
	document.getElementById("symb2").firstChild.firstChild.innerHTML=glyphFlecheHautArp
	document.getElementById("symb2").firstChild.firstChild.setAttribute("stroke",paletteSymb)
	document.getElementById("symb2").firstChild.firstChild.setAttribute("fill",paletteSymb)
	document.getElementById("symb2").firstChild.setAttribute("transform",'scale(1.2 1.2) translate(10 0) rotate(0 0 0) ')
	document.getElementById("symb3").firstChild.firstChild.innerHTML=glyphFlecheHaut
	document.getElementById("symb3").firstChild.firstChild.setAttribute("stroke",paletteSymb)
	document.getElementById("symb3").firstChild.firstChild.setAttribute("fill",paletteSymb)
	document.getElementById("symb3").firstChild.setAttribute("transform",'scale(1.8 1.2) translate(10 0) rotate(0 0 0) ')
	document.getElementById("symb4").firstChild.firstChild.innerHTML=glyphArtAccentDessus
	document.getElementById("symb4").firstChild.firstChild.setAttribute("stroke",paletteSymb)
	document.getElementById("symb4").firstChild.firstChild.setAttribute("fill",paletteSymb)
	document.getElementById("symb4").firstChild.setAttribute("transform",'scale(1.2 1.2) translate(10 10) rotate(0 0 0) ')
	document.getElementById("symb5").firstChild.firstChild.innerHTML=glyphArtStaccatossimo
	document.getElementById("symb5").firstChild.firstChild.setAttribute("stroke",paletteSymb)
	document.getElementById("symb5").firstChild.firstChild.setAttribute("fill",paletteSymb)
	document.getElementById("symb5").firstChild.setAttribute("transform",'scale(1.2 1.2) translate(10 10) rotate(0 0 0) ')
	document.getElementById("symb6").firstChild.firstChild.innerHTML=glyphArtTenuto
	document.getElementById("symb6").firstChild.firstChild.setAttribute("stroke",paletteSymb)
	document.getElementById("symb6").firstChild.firstChild.setAttribute("fill",paletteSymb)
	document.getElementById("symb6").firstChild.setAttribute("transform",'scale(1.2 1.2) translate(10 10) rotate(0 0 0) ')
	document.getElementById("symb7").firstChild.firstChild.innerHTML=glyphArtLoure
	document.getElementById("symb7").firstChild.firstChild.setAttribute("stroke",paletteSymb)
	document.getElementById("symb7").firstChild.firstChild.setAttribute("fill",paletteSymb)
	document.getElementById("symb7").firstChild.setAttribute("transform",'scale(1.2 1.2) translate(10 10) rotate(0 0 0) ')
	document.getElementById("symb8").firstChild.firstChild.innerHTML=glyphArtMarcato
	document.getElementById("symb8").firstChild.firstChild.setAttribute("stroke",paletteSymb)
	document.getElementById("symb8").firstChild.firstChild.setAttribute("fill",paletteSymb)
	document.getElementById("symb8").firstChild.setAttribute("transform",'scale(1.2 1.2) translate(10 10) rotate(0 0 0) ')
	document.getElementById("symb9").firstChild.firstChild.innerHTML=glyphArtStaccato
	document.getElementById("symb9").firstChild.firstChild.setAttribute("stroke",paletteSymb)
	document.getElementById("symb9").firstChild.firstChild.setAttribute("fill",paletteSymb)
	document.getElementById("symb9").firstChild.setAttribute("transform",'scale(1.2 1.2) translate(10 10) rotate(0 0 0) ')
	document.getElementById("symb10").firstChild.firstChild.innerHTML=glyphArtStaccatoPointe
	document.getElementById("symb10").firstChild.firstChild.setAttribute("stroke",paletteSymb)
	document.getElementById("symb10").firstChild.firstChild.setAttribute("fill",paletteSymb)
	document.getElementById("symb10").firstChild.setAttribute("transform",'scale(1.2 1.2) translate(10 10) rotate(0 0 0) ')
	document.getElementById("symb11").firstChild.firstChild.innerHTML=glyphArtVibration
	document.getElementById("symb11").firstChild.firstChild.setAttribute("stroke",paletteSymb)
	document.getElementById("symb11").firstChild.firstChild.setAttribute("fill",paletteSymb)
	document.getElementById("symb11").firstChild.setAttribute("transform",'scale(1.2 1.2) translate(10 10) rotate(0 0 0) ')
	document.getElementById("symb12").firstChild.firstChild.innerHTML=glyphArtMarcatoStaccato
	document.getElementById("symb12").firstChild.firstChild.setAttribute("stroke",paletteSymb)
	document.getElementById("symb12").firstChild.firstChild.setAttribute("fill",paletteSymb)
	document.getElementById("symb12").firstChild.setAttribute("transform",'scale(1.2 1.2) translate(10 10) rotate(0 0 0) ')
	document.getElementById("symb13").firstChild.firstChild.innerHTML=glyphArtInaccentue
	document.getElementById("symb13").firstChild.firstChild.setAttribute("stroke",paletteSymb)
	document.getElementById("symb13").firstChild.firstChild.setAttribute("fill",paletteSymb)
	document.getElementById("symb13").firstChild.setAttribute("transform",'scale(1.0 1.0) translate(1 10) rotate(0 0 0) ')
	document.getElementById("symb14").firstChild.firstChild.innerHTML=glyphArtVibrato
	document.getElementById("symb14").firstChild.firstChild.setAttribute("stroke",paletteSymb)
	document.getElementById("symb14").firstChild.firstChild.setAttribute("fill",paletteSymb)
	document.getElementById("symb14").firstChild.setAttribute("transform",'scale(1.2 1.2) translate(10 10) rotate(0 0 0) ')
	document.getElementById("symb15").firstChild.firstChild.innerHTML=glyphArtMarcatoTenuto
	document.getElementById("symb15").firstChild.firstChild.setAttribute("stroke",paletteSymb)
	document.getElementById("symb15").firstChild.firstChild.setAttribute("fill",paletteSymb)
	document.getElementById("symb15").firstChild.setAttribute("transform",'scale(1.2 1.2) translate(10 10) rotate(0 0 0) ')
	document.getElementById("symb16").firstChild.firstChild.innerHTML=glyphArtOuvert
	document.getElementById("symb16").firstChild.firstChild.setAttribute("stroke",paletteSymb)
	document.getElementById("symb16").firstChild.firstChild.setAttribute("fill",paletteSymb)
	document.getElementById("symb16").firstChild.setAttribute("transform",'scale(1.2 1.2) translate(10 10) rotate(0 0 0) ')
	document.getElementById("symb17").firstChild.firstChild.innerHTML=glyphArtPousser
	document.getElementById("symb17").firstChild.firstChild.setAttribute("stroke",paletteSymb)
	document.getElementById("symb17").firstChild.firstChild.setAttribute("fill",paletteSymb)
	document.getElementById("symb17").firstChild.setAttribute("transform",'scale(1.2 1.2) translate(10 10) rotate(0 0 0) ')
	document.getElementById("symb18").firstChild.firstChild.innerHTML=glyphArtTirer
	document.getElementById("symb18").firstChild.firstChild.setAttribute("stroke",paletteSymb)
	document.getElementById("symb18").firstChild.firstChild.setAttribute("fill",paletteSymb)
	document.getElementById("symb18").firstChild.setAttribute("transform",'scale(1.2 1.2) translate(10 10) rotate(0 0 0) ')
	document.getElementById("symb19").firstChild.firstChild.innerHTML=glyphBlocAccolade
	document.getElementById("symb19").firstChild.firstChild.setAttribute("stroke",paletteSymb)
	document.getElementById("symb19").firstChild.firstChild.setAttribute("fill",paletteSymb)
	document.getElementById("symb19").firstChild.setAttribute("transform",'scale(1 1) translate(10 0) rotate(0 0 0) ')
	document.getElementById("symb20").firstChild.firstChild.innerHTML=glyphBlocDroit
	document.getElementById("symb20").firstChild.firstChild.setAttribute("stroke",paletteSymb)
	document.getElementById("symb20").firstChild.firstChild.setAttribute("fill",paletteSymb)
	document.getElementById("symb20").firstChild.setAttribute("transform",'scale(1 1) translate(10 0) rotate(0 0 0) ')
	document.getElementById("symb21").firstChild.firstChild.innerHTML=glyphBlocLigne
	document.getElementById("symb21").firstChild.firstChild.setAttribute("stroke",paletteSymb)
	document.getElementById("symb21").firstChild.firstChild.setAttribute("fill",paletteSymb)
	document.getElementById("symb21").firstChild.setAttribute("transform",'scale(1 1) translate(10 0) rotate(0 0 0) ')
	document.getElementById("symb22").firstChild.firstChild.innerHTML=glyphBlocLigneDouble
	document.getElementById("symb22").firstChild.firstChild.setAttribute("stroke",paletteSymb)
	document.getElementById("symb22").firstChild.firstChild.setAttribute("fill",paletteSymb)
	document.getElementById("symb22").firstChild.setAttribute("transform",'scale(1 1) translate(10 0) rotate(0 0 0) ')
	document.getElementById("symb23").firstChild.firstChild.innerHTML=glyphBlocBordure
	document.getElementById("symb23").firstChild.firstChild.setAttribute("stroke",paletteSymb)
	document.getElementById("symb23").firstChild.firstChild.setAttribute("fill",paletteSymb)
	document.getElementById("symb23").firstChild.setAttribute("transform",'scale(1 1) translate(10 0) rotate(0 0 0) ')
	document.getElementById("symb24").firstChild.firstChild.innerHTML=glyphBlocBordureCentree
	document.getElementById("symb24").firstChild.firstChild.setAttribute("stroke",paletteSymb)
	document.getElementById("symb24").firstChild.firstChild.setAttribute("fill",paletteSymb)
	document.getElementById("symb24").firstChild.setAttribute("transform",'scale(1 1) translate(10 0) rotate(0 0 0) ')
	document.getElementById("symb25").firstChild.firstChild.innerHTML=glyphLignesLiaison
	document.getElementById("symb25").firstChild.firstChild.setAttribute("stroke",paletteSymb)
	document.getElementById("symb25").firstChild.firstChild.setAttribute("fill",paletteSymb)
	document.getElementById("symb25").firstChild.setAttribute("transform",'scale(0.8 1.0) translate(0 10) rotate(0 0 0) ')
	document.getElementById("symb26").firstChild.firstChild.innerHTML=glyphLignesCrescendo
	document.getElementById("symb26").firstChild.firstChild.setAttribute("stroke",paletteSymb)
	document.getElementById("symb26").firstChild.firstChild.setAttribute("fill",paletteSymb)
	document.getElementById("symb26").firstChild.setAttribute("transform",'scale(1 1) translate(-4 10) rotate(0 0 0) ')
	document.getElementById("symb27").firstChild.firstChild.innerHTML=glyphLignesDentsdescie
	document.getElementById("symb27").firstChild.firstChild.setAttribute("stroke",paletteSymb)
	document.getElementById("symb27").firstChild.firstChild.setAttribute("fill",paletteSymb)
	document.getElementById("symb27").firstChild.setAttribute("transform",'scale(1 1) translate(10 0) rotate(0 0 0) ')
	document.getElementById("symb28").firstChild.firstChild.innerHTML=glyphSymboleOndulation
	document.getElementById("symb28").firstChild.firstChild.setAttribute("stroke",paletteSymb)
	document.getElementById("symb28").firstChild.firstChild.setAttribute("fill",paletteSymb)
	document.getElementById("symb28").firstChild.setAttribute("transform",'scale(1 1) translate(10 -4) rotate(0 0 0) ')
	document.getElementById("symb29").firstChild.firstChild.innerHTML=glyphLignesDim
	document.getElementById("symb29").firstChild.firstChild.setAttribute("stroke",paletteSymb)
	document.getElementById("symb29").firstChild.firstChild.setAttribute("fill",paletteSymb)
	document.getElementById("symb29").firstChild.setAttribute("transform",'scale(1 1) translate(10 10) rotate(0 0 0) ')
	document.getElementById("symb30").firstChild.firstChild.innerHTML=glyphLignesCresc
	document.getElementById("symb30").firstChild.firstChild.setAttribute("stroke",paletteSymb)
	document.getElementById("symb30").firstChild.firstChild.setAttribute("fill",paletteSymb)
	document.getElementById("symb30").firstChild.setAttribute("transform",'scale(1 1) translate(10 14) rotate(0 0 0) ')
	document.getElementById("symb31").firstChild.firstChild.innerHTML=glyphLignesTrille
	document.getElementById("symb31").firstChild.firstChild.setAttribute("stroke",paletteSymb)
	document.getElementById("symb31").firstChild.firstChild.setAttribute("fill",paletteSymb)
	document.getElementById("symb31").firstChild.setAttribute("transform",'scale(1 1) translate(20 10) rotate(0 0 0) ')
	document.getElementById("symb32").firstChild.firstChild.innerHTML=glyphStringGliss
	document.getElementById("symb32").firstChild.firstChild.setAttribute("stroke",paletteSymb)
	document.getElementById("symb32").firstChild.firstChild.setAttribute("fill",paletteSymb)
	document.getElementById("symb32").firstChild.setAttribute("transform",'scale(1.2 1.2) translate(10 10) rotate(0 0 0) ')
	document.getElementById("symb33").firstChild.firstChild.innerHTML=glyphNuancesPPP
	document.getElementById("symb33").firstChild.firstChild.setAttribute("stroke",paletteSymb)
	document.getElementById("symb33").firstChild.firstChild.setAttribute("fill",paletteSymb)
	document.getElementById("symb33").firstChild.setAttribute("transform",'scale(1.2 1.2) translate(10 10) rotate(0 0 0) ')
	document.getElementById("symb34").firstChild.firstChild.innerHTML=glyphNuancesPP
	document.getElementById("symb34").firstChild.firstChild.setAttribute("stroke",paletteSymb)
	document.getElementById("symb34").firstChild.firstChild.setAttribute("fill",paletteSymb)
	document.getElementById("symb34").firstChild.setAttribute("transform",'scale(1.2 1.2) translate(10 10) rotate(0 0 0) ')
	document.getElementById("symb35").firstChild.firstChild.innerHTML=glyphNuancesP
	document.getElementById("symb35").firstChild.firstChild.setAttribute("stroke",paletteSymb)
	document.getElementById("symb35").firstChild.firstChild.setAttribute("fill",paletteSymb)
	document.getElementById("symb35").firstChild.setAttribute("transform",'scale(1.2 1.2) translate(10 10) rotate(0 0 0) ')
	document.getElementById("symb36").firstChild.firstChild.innerHTML=glyphNuancesMP
	document.getElementById("symb36").firstChild.firstChild.setAttribute("stroke",paletteSymb)
	document.getElementById("symb36").firstChild.firstChild.setAttribute("fill",paletteSymb)
	document.getElementById("symb36").firstChild.setAttribute("transform",'scale(1.2 1.2) translate(10 10) rotate(0 0 0) ')
	document.getElementById("symb37").firstChild.firstChild.innerHTML=glyphNuancesMF
	document.getElementById("symb37").firstChild.firstChild.setAttribute("stroke",paletteSymb)
	document.getElementById("symb37").firstChild.firstChild.setAttribute("fill",paletteSymb)
	document.getElementById("symb37").firstChild.setAttribute("transform",'scale(1.2 1.2) translate(10 4) rotate(0 0 0) ')
	document.getElementById("symb38").firstChild.firstChild.innerHTML=glyphNuancesF
	document.getElementById("symb38").firstChild.firstChild.setAttribute("stroke",paletteSymb)
	document.getElementById("symb38").firstChild.firstChild.setAttribute("fill",paletteSymb)
	document.getElementById("symb38").firstChild.setAttribute("transform",'scale(1.2 1.2) translate(10 4) rotate(0 0 0) ')
	document.getElementById("symb39").firstChild.firstChild.innerHTML=glyphNuancesFF
	document.getElementById("symb39").firstChild.firstChild.setAttribute("stroke",paletteSymb)
	document.getElementById("symb39").firstChild.firstChild.setAttribute("fill",paletteSymb)
	document.getElementById("symb39").firstChild.setAttribute("transform",'scale(1.2 1.2) translate(10 4) rotate(0 0 0) ')
	document.getElementById("symb40").firstChild.firstChild.innerHTML=glyphNuancesFFF
	document.getElementById("symb40").firstChild.firstChild.setAttribute("stroke",paletteSymb)
	document.getElementById("symb40").firstChild.firstChild.setAttribute("fill",paletteSymb)
	document.getElementById("symb40").firstChild.setAttribute("transform",'scale(1.2 1.2) translate(10 4) rotate(0 0 0) ')
	document.getElementById("symb41").firstChild.firstChild.innerHTML=glyphNuancesFP
	document.getElementById("symb41").firstChild.firstChild.setAttribute("stroke",paletteSymb)
	document.getElementById("symb41").firstChild.firstChild.setAttribute("fill",paletteSymb)
	document.getElementById("symb41").firstChild.setAttribute("transform",'scale(1.2 1.2) translate(10 0) rotate(0 0 0) ')
	document.getElementById("symb42").firstChild.firstChild.innerHTML=glyphNuancesSF
	document.getElementById("symb42").firstChild.firstChild.setAttribute("stroke",paletteSymb)
	document.getElementById("symb42").firstChild.firstChild.setAttribute("fill",paletteSymb)
	document.getElementById("symb42").firstChild.setAttribute("transform",'scale(1.2 1.2) translate(10 0) rotate(0 0 0) ')
	document.getElementById("symb43").firstChild.firstChild.innerHTML=glyphNuancesSFZ
	document.getElementById("symb43").firstChild.firstChild.setAttribute("stroke",paletteSymb)
	document.getElementById("symb43").firstChild.firstChild.setAttribute("fill",paletteSymb)
	document.getElementById("symb43").firstChild.setAttribute("transform",'scale(1.2 1.2) translate(10 0) rotate(0 0 0) ')
	document.getElementById("symb44").firstChild.firstChild.innerHTML=glyphNuancesFZ
	document.getElementById("symb44").firstChild.firstChild.setAttribute("stroke",paletteSymb)
	document.getElementById("symb44").firstChild.firstChild.setAttribute("fill",paletteSymb)
	document.getElementById("symb44").firstChild.setAttribute("transform",'scale(1.2 1.2) translate(10 0) rotate(0 0 0) ')
	document.getElementById("symb45").firstChild.firstChild.innerHTML=glyphSymboleOrgue
	document.getElementById("symb45").firstChild.firstChild.setAttribute("stroke",paletteSymb)
	document.getElementById("symb45").firstChild.firstChild.setAttribute("fill",paletteSymb)
	document.getElementById("symb45").firstChild.setAttribute("transform",'scale(1.2 1.2) translate(10 10) rotate(0 0 0) ')
	document.getElementById("symb46").firstChild.firstChild.innerHTML=glyphSymboleOrgueCourt
	document.getElementById("symb46").firstChild.firstChild.setAttribute("stroke",paletteSymb)
	document.getElementById("symb46").firstChild.firstChild.setAttribute("fill",paletteSymb)
	document.getElementById("symb46").firstChild.setAttribute("transform",'scale(1.2 1.2) translate(10 10) rotate(0 0 0) ')
	document.getElementById("symb47").firstChild.firstChild.innerHTML=glyphSymboleOrgueLong
	document.getElementById("symb47").firstChild.firstChild.setAttribute("stroke",paletteSymb)
	document.getElementById("symb47").firstChild.firstChild.setAttribute("fill",paletteSymb)
	document.getElementById("symb47").firstChild.setAttribute("transform",'scale(1.2 1.2) translate(10 10) rotate(0 0 0) ')
	document.getElementById("symb48").firstChild.firstChild.innerHTML=glyphSymboleOrgueTresLong
	document.getElementById("symb48").firstChild.firstChild.setAttribute("stroke",paletteSymb)
	document.getElementById("symb48").firstChild.firstChild.setAttribute("fill",paletteSymb)
	document.getElementById("symb48").firstChild.setAttribute("transform",'scale(1.2 1.2) translate(10 10) rotate(0 0 0) ')
	document.getElementById("symb49").firstChild.firstChild.innerHTML=glyphSymboleOrgueTresCourt
	document.getElementById("symb49").firstChild.firstChild.setAttribute("stroke",paletteSymb)
	document.getElementById("symb49").firstChild.firstChild.setAttribute("fill",paletteSymb)
	document.getElementById("symb49").firstChild.setAttribute("transform",'scale(1.2 1.2) translate(10 10) rotate(0 0 0) ')
	document.getElementById("symb50").firstChild.firstChild.innerHTML=glyphSymbolePizzBartok
	document.getElementById("symb50").firstChild.firstChild.setAttribute("stroke",paletteSymb)
	document.getElementById("symb50").firstChild.firstChild.setAttribute("fill",paletteSymb)
	document.getElementById("symb50").firstChild.setAttribute("transform",'scale(1.2 1.2) translate(10 10) rotate(0 0 0) ')
	
}