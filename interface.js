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

//window.addEventListener("resize", upDateWorkSpace);
dragElement(document.getElementById("space"))

let paletteArpegesetat=0
let paletteArticulationsetat=0
let paletteBlockVetat=0
let paletteLignesetat=0
let paletteNuancesetat=0
let paletteObjetsetat=0
let paletteFonctionsetat=0
let paletteInscriptionsetat=0

let vueDuree=0

let barverticTime=0;
let barDebutTime=4;
let barFinTime=6;

dragElement(document.getElementById("fenetreFlot"))
dragElement(document.getElementById("augmDim"))
dragElement(document.getElementById("inclusionWin"))
dragElement(document.getElementById("renderAudio"))
dragElement(document.getElementById("tempoAudio"));
dragElement(document.getElementById("canvas"));
dragElement(document.getElementById("popupScaleGrpObjets"));
dragElement(document.getElementById("listeAudios"));

document.getElementById("arpeges").addEventListener('click',paletteArpeges);
document.getElementById("articulations").addEventListener('click',paletteArticulations);
document.getElementById("paletteLignes").addEventListener('click',paletteLignes);
document.getElementById("paletteNuances").addEventListener('click',paletteNuances);
document.getElementById("paletteObjets").addEventListener('click',paletteObjets);
document.getElementById("inscriptions").addEventListener('click',inscriptions);
document.getElementById("paletteFonctions").addEventListener('click',paletteFonctions);

/*
Copyright © 2020 Xah Lee

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

URL: SVG Circle Arc http://xahlee.info/js/svg_circle_arc.html
Version 2019-06-19
*/

const cos = Math.cos;
const sin = Math.sin;
const π = Math.PI;

const f_matrix_times = (( [[a,b], [c,d]], [x,y]) => [ a * x + b * y, c * x + d * y]);
const f_rotate_matrix = (x => [[cos(x),-sin(x)], [sin(x), cos(x)]]);
const f_vec_add = (([a1, a2], [b1, b2]) => [a1 + b1, a2 + b2]);

const f_svg_ellipse_arc = (([cx,cy],[rx,ry], [t1, Δ], φ ) => {
/*
returns a SVG path element that represent a ellipse.
cx,cy → center of ellipse
rx,ry → major minor radius
t1 → start angle, in radian.
Δ → angle to sweep, in radian. positive.
φ → rotation on the whole, in radian
URL: SVG Circle Arc http://xahlee.info/js/svg_circle_arc.html
Version 2019-06-19
 */
Δ = Δ % (2*π);
const rotMatrix = f_rotate_matrix (φ);
const [sX, sY] = ( f_vec_add ( f_matrix_times ( rotMatrix, [rx * cos(t1), ry * sin(t1)] ), [cx,cy] ) );
const [eX, eY] = ( f_vec_add ( f_matrix_times ( rotMatrix, [rx * cos(t1+Δ), ry * sin(t1+Δ)] ), [cx,cy] ) );
const fA = ( (  Δ > π ) ? 1 : 0 );
const fS = ( (  Δ > 0 ) ? 1 : 0 );
const path_2wk2r = document.createElementNS("http://www.w3.org/2000/svg", "path");
path_2wk2r.setAttribute("d", "M " + sX + " " + sY + " A " + [ rx , ry , φ / (2*π) *360, fA, fS, eX, eY ].join(" "));
path_2wk2r.setAttribute("style", "stroke:red; fill:none; stroke-width:2");
return path_2wk2r;
});

let spaceWidth=0
let spaceHeight=0;
document.getElementById("reglette").addEventListener('wheel', zoom, { passive: false });
//document.getElementById("regle").addEventListener('click',defPosLecture);
//document.getElementById("barDebut").addEventListener('click',selectBarDebut);
//document.getElementById("barFin").addEventListener('click',selectBarFin);

function upDateWorkSpace(type){
	spaceWidth=mainwinWidth-214;
	spaceHeight=mainwinheight-100;
	document.getElementById('paramGlobal').style.width=spaceWidth+"px";
	document.getElementById('work').style.width=spaceWidth+"px";
	document.getElementById('work').style.height=(spaceHeight+30)+"px";
	document.getElementById('work2').style.width="12960px"//spaceWidth+"px";
	document.getElementById('work2').style.height=(spaceHeight+30)+"px";
	document.getElementById('space').style.height=(spaceHeight-40)+"px";
	document.getElementById('regle').style.width=baseSpaceWidth+"px";

	document.getElementById('principal').style.height=(mainwinheight-30)+"px";
	document.getElementById('secondaire').style.height=(mainwinheight-30)+"px";
	document.getElementById('secondaire').style.width=spaceWidth+"px";
	document.getElementById('bvsvg').style.height=(mainwinheight-120)+"px";
	ratioSpaceHeight=spaceHeight/baseSpaceHeight;
	/*
	windowOuterWidth=window.outerWidth;
	windowOuterHeight=window.outerHeight;
	
*/	
	for(let i=0;i<tableObjet.length;i++){
		if(tableObjet[i].etat==1){
			tableObjet[i].posY=tableObjet[i].basePosY*ratioSpaceHeight;
			document.getElementById(tableObjet[i].id).style.top=tableObjet[i].posY+"px";
		}
	}
	

	
	if(type==1){
		if(setTimeRegle==true){
				createReglette(zoomScale,"reglette",regleBackground,parseFloat(regleFontSize),regleFontColor)
		}
		if(setSignRegle==true){
			regSolfege(zoomScale,"reglette",parseFloat(regleFontSize),regleFontColor,regleFontColor,1)
		}
	}
	if(setGrille==true){
		deleteGrille()
		deleteGrille()
		grilleSpace(zoomScale,"space",colorGrille)
	}
}

function createReglette(scale,dest,bkg,fontSize,fontColor){
	var nbmax=12960*scale
	var tempo=60/parseFloat(document.getElementById("tempo").value)
	document.querySelector("#"+dest).innerHTML="";
	var t=0;
	for(let i=0;i<nbmax;i+=(18*scale)){
		var dupnode=document.createElementNS("http://www.w3.org/2000/svg",'line');
		dupnode.setAttribute("x1",i);
		dupnode.setAttribute("y1",0);
		dupnode.setAttribute("x2",i);
		dupnode.setAttribute("y2",10);
		dupnode.setAttribute("style","stroke:"+fontColor+";stroke-width:1;");
		document.querySelector("#"+dest).appendChild(dupnode);
		//document.querySelector("#"+dest).appendChild(dupnode2);
		if(t<90){
			t+=10;
		}else{
			t=0;
		}
	}
	t=0;
	
	for(let i=0;i<nbmax;i+=(180*scale/tempo)){
		
		var dupnode=document.createElementNS("http://www.w3.org/2000/svg",'line');
		dupnode.setAttribute("x1",i);
		dupnode.setAttribute("y1",0);
		dupnode.setAttribute("x2",i);
		dupnode.setAttribute("y2",15);
		dupnode.setAttribute("style","stroke:"+fontColor+";stroke-width:1;"); 
		var dupnode3=document.createElementNS("http://www.w3.org/2000/svg",'text');
		dupnode3.setAttribute("x",i+2);
		dupnode3.setAttribute("y",24);
		dupnode3.setAttribute("style","fill:"+fontColor+";font: "+fontSize+"em sans-serif;");
		var textNode = document.createTextNode(t);
		dupnode3.appendChild(textNode);
		//document.querySelector("#"+dest).appendChild(dupnode);
		//document.querySelector("#"+dest).appendChild(dupnode2);
		document.querySelector("#"+dest).appendChild(dupnode3);
		t+=10;
	}
}
function regSolfege(scale,dest,fontSize,fontColor,bkg,opac){
	var nbmax=12960*scale
	var nbdiv=parseFloat(document.getElementById("nbDiv").value);
	var nbmes=parseFloat(document.getElementById("nbMesure").value);
	var tempo=parseFloat(document.getElementById("tempo").value);
	var delta=((1080/(tempo*nbdiv))*nbmes*scale)/nbmes;
	
	for(let i=0;i<nbmax;i+=delta){
		var dupnode=document.createElementNS("http://www.w3.org/2000/svg",'line');
		dupnode.setAttribute("x1",i);
		dupnode.setAttribute("y1",26);
		dupnode.setAttribute("x2",i);
		dupnode.setAttribute("y2",31);
		dupnode.setAttribute("style","stroke:"+bkg+";stroke-width:1;opacity:"+opac);
		document.querySelector("#"+dest).appendChild(dupnode);
	}
	let t=1;
	for(let i=0;i<nbmax;i+=delta*nbmes*scale*(tempo/60)){
		var dupnode=document.createElementNS("http://www.w3.org/2000/svg",'line');
		dupnode.setAttribute("x1",i);
		dupnode.setAttribute("y1",26);
		dupnode.setAttribute("x2",i);
		dupnode.setAttribute("y2",38);
		dupnode.setAttribute("style","stroke:"+bkg+";stroke-width:1;");
		var dupnode2=document.createElementNS("http://www.w3.org/2000/svg",'text');
		dupnode2.setAttribute("x",i+2);
		dupnode2.setAttribute("y",42);
		dupnode2.setAttribute("style","fill:"+fontColor+";font: "+(fontSize-0.1)+"em sans-serif;opacity:"+opac);
		var textNode = document.createTextNode(t);
		dupnode2.appendChild(textNode);		
		document.querySelector("#"+dest).appendChild(dupnode);
		document.querySelector("#"+dest).appendChild(dupnode2);
		t=t+1;
	}
}
function deleteGrille(){
	var obj=document.getElementById("space")
	var tabg=obj.getElementsByClassName("grille")
	if(tabg.length>0){
		for(let i in tabg){
			if(tabg[i].nodeType === Node.ELEMENT_NODE){
			obj.removeChild(tabg[i])
			}
		}
	}
}
function grilleSpace(scale,dest,bkg) {
	var nbdiv=parseFloat(document.getElementById("nbDiv").value)
	var nbmes=parseFloat(document.getElementById("nbMesure").value)
	var tempo=parseFloat(document.getElementById("tempo").value)
	var dest=document.getElementById("spaceBkg")
	var nbmax=12960*scale
	deleteGrille()
	deleteGrille()
	var tmpbuffer=[]
	document.getElementById("spaceBkg").innerHTML=""
	
	var delta=(270/(tempo*nbdiv))*nbmes

	if(spaceSeconde==false){
		delta=delta*nbmes
	}
	if(tempo>=120){
		delta=delta*4
	}

	for(let i=0;i<12960;i+=delta){
		var dupnode=document.createElement("div")
		dupnode.setAttribute("class","grille")
		
		dupnode.style.left=i+"px"
		dupnode.style.height=((spaceHeight-40)*zoomScale)+"px"
		dupnode.style.backgroundColor=bkg
		dupnode.style.opacity=spaceGrilleOpacity
		dupnode.style.width="1px"
		if(scale<0.99){
			dupnode.style.width="2px"
		}
		if(scale>2.35){
			dupnode.style.width="0.5px"
		}
		if(scale>4){
			dupnode.style.width="0.25px"
		}
		dest.appendChild(dupnode)
	}
	
}
function zoomInit(sc) {
	zoomScale=sc/100;
	document.querySelector("#reglette").innerHTML="";
	createReglette(zoomScale,"reglette",regleBackground,parseFloat(regleFontSize),regleFontColor);
	if(setSignRegle==true){
		regSolfege(zoomScale,"reglette",parseFloat(regleFontSize),regleFontColor,regleFontColor,1);
	}
   upDateZoom();
}

function zoom(event) {
  event.preventDefault();
  zoomScale += event.deltaY * -0.001;
  if(zoomScale>4){
  	zoomScale=4;
  }
  if(zoomScale<0.25){
  	zoomScale=0.25;
  }
  document.querySelector("#reglette").innerHTML="";
  
  createReglette(zoomScale,"reglette",regleBackground,parseFloat(regleFontSize),regleFontColor);
  if(setSignRegle==true){
		regSolfege(zoomScale,"reglette",parseFloat(regleFontSize),regleFontColor,regleFontColor,1);
	}
  upDateZoom();
}
function upDateZoom(){
	/*
	var tbgrille=document.getElementById("space").getElementsByClassName("grille");
	for(let i=0;i<tbgrille.length;i++){
		document.getElementById("space").removeChild(tbgrille[i]);
	}
	*/
	if(zoomScale>1){
	  document.querySelector("#reglette").setAttribute('width',(12960*zoomScale))
	  document.querySelector("#reglette").setAttribute('viewBox','0 0 '+(12960*zoomScale)+' 50')
	  document.querySelector("#regle").style.width=(12960*zoomScale)+"px"
	  document.querySelector("#work2").style.width=(12960*zoomScale)+"px"
	  document.querySelector("#space").style.width=(12960*zoomScale)+"px"
  }else{
  	  document.querySelector("#space").style.width=document.querySelector("#regle").style.width
  }
	document.getElementById("space").style.transform="scale("+zoomScale+","+zoomScale+")";
	//document.getElementById("spaceBkg").style.transform="scale("+zoomScale+","+zoomScale+")";
	document.getElementById("bvsvg").style.height=((parseFloat(document.getElementById("space").style.height)*zoomScale)+40)+"px";
	document.getElementById("barVerticale").style.left=secToPosx(barverticTime)+"px"
	
	document.getElementById("barDebut").style.left=(secToPosx(barDebutTime-1)-40)+"px"
	document.getElementById("barFin").style.left=secToPosx(barFinTime-1)+"px"
	if(setGrille==true){
		deleteGrille()
		deleteGrille()
		grilleSpace(zoomScale,"space",colorGrille)
	}
}
function newSelector(e){
	if(nselector==0){
		document.getElementById("selector").style.display="block";
		document.getElementById("selector").style.top=((e.clientY-94+scrollDemo2.scrollTop)/zoomScale)+"px";
		document.getElementById("selector").style.left=((e.clientX-208+scrollDemo.scrollLeft)/zoomScale)+"px";
		document.getElementById("selector").style.width=(20*zoomScale)+"px";
		document.getElementById("selector").style.height=(20*zoomScale)+"px";
		document.getElementById("selector").style.borderWidth=(1/zoomScale)+"px";
		nselector=1;
	}
}
function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0, Y1;
  var reservMorph;
  if(elmnt){
	  if (document.getElementById(elmnt.id + "Header")) {
	    /* if present, the header is where you move the DIV from:*/
	    document.getElementById(elmnt.id + "Header").onmousedown = dragMouseDown;
	  } else {
	    /* otherwise, move the DIV from anywhere inside the DIV:*/
		  	elmnt.onmousedown = dragMouseDown;
	  }
  }
  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    e.stopPropagation();
    if(elmnt.id=="space" && e.button==0){
	    if(nselector==0){
	    	if(grpSelect==1){
	    		document.getElementById("space").removeChild(document.getElementById("grpSelect"));
	    		grpSelect=0;
	    	}
	  		newSelector(e);
	  	 }
  		elmnt=document.getElementById("selector");
  		coordClientX=scrollDemo.scrollLeft-204+e.clientX;
	   coordClientY=scrollDemo2.scrollTop-94+e.clientY;
    }
    if(elmnt.id=="space" && e.button==2){
    	coordClientX=scrollDemo.scrollLeft-204+e.clientX;
	   coordClientY=scrollDemo2.scrollTop-94+e.clientY;
    	window.api.contextmenu("showmenu","")
    }

    if(elmnt.id.substring(0,5)=="gliss"){
    	Y1=parseFloat(document.getElementById("objet"+elmnt.id.substring(5)).style.height)
    	reservY1=document.getElementById("objet"+elmnt.id.substring(5)).firstChild.firstChild.getAttribute('y1')
    	
    	reservTop1=parseFloat(document.getElementById("objet"+elmnt.id.substring(5)).style.top)
    	reservHeight1=parseFloat(document.getElementById("objet"+elmnt.id.substring(5)).style.height)
    }
    if(elmnt.id.substring(0,5)=="sglis"){
    	Y1=parseFloat(document.getElementById("objet"+elmnt.id.substring(5)).style.height)
    	reservTop1=parseFloat(document.getElementById("objet"+elmnt.id.substring(5)).style.top)
    }
    if(elmnt.id.substring(0,5)=="gliss"){
   	document.getElementById("gliss"+elmnt.id.substring(5)).style.border='1px solid red'
    }
    if(elmnt.id.substring(0,5)=="sglis"){
   	document.getElementById("sglis"+elmnt.id.substring(5)).style.border='1px solid red'
    }
    
    if(elmnt.id.substring(0,5)=="objet" && tableObjet[elmnt.id.substring(5)].class==3){
    	if (tableObjet[elmnt.id.substring(5)].type==1 || tableObjet[elmnt.id.substring(5)].type==2  || tableObjet[elmnt.id.substring(5)].type==3 || tableObjet[elmnt.id.substring(5)].type==21  || tableObjet[elmnt.id.substring(5)].type==22  || tableObjet[elmnt.id.substring(5)].type==23 || tableObjet[elmnt.id.substring(5)].type==24 || tableObjet[elmnt.id.substring(5)].type==27 || tableObjet[elmnt.id.substring(5)].type==28  || tableObjet[elmnt.id.substring(5)].type==84){
   	document.getElementById("sglis"+elmnt.id.substring(5)).style.border='1px solid red'
   	}
    }
    if(elmnt.id.substring(0,2)=="fx"){
    	selectPointFx=elmnt.id
    	if(e.button==2 && parseInt(elmnt.id.substring(2,3))>0){
    		var pt=elmnt.parentNode.firstChild.nextSibling
		   elmnt.parentNode.removeChild(elmnt)
		   var tbdiv=pt.parentNode.getElementsByTagName('div')
		   var greffon=pt.parentNode.parentNode.parentNode.parentNode.parentNode.id
		   
			var tableLabel=listeFx[greffon].label.split(',')
			var index=tableLabel.indexOf(pt.parentNode.id)
		   for(i=0;i<tbdiv.length;i++){
				if(tbdiv[i].id.substring(0,2)=='fx'){
					tbdiv[i].id="fx"+i+index
					tbdiv[i].title="fx"+i+index
				}
			}
    		updateFxAutomation(pt)
			for(i=0;i<tbdiv.length;i++){
				if(tbdiv[i].id.substring(0,2)=='fx'){
					dragElement(tbdiv[i])
				}
			}
    	}else{
   		elmnt.style.backgroundColor='green'
   		document.getElementById('Y'+elmnt.parentNode.id).value=elmnt.title.substring(5)
   	}
    }
    /*
    if(elmnt.id.substring(0,5)=="objet" && tableObjet[elmnt.id.substring(5)].type==11){
    	document.getElementById("gliss"+elmnt.id.substring(5)).style.border='1px solid red'
    	document.getElementById("gliss"+elmnt.id.substring(5)).style.top=(parseFloat(document.getElementById("objet"+elmnt.id.substring(5)).top)+parseFloat(document.getElementById("objet"+elmnt.id.substring(5)).firstChild.firstChild.getAttribute('y2')))+"px"
    	document.getElementById("gliss"+elmnt.id.substring(5)).style.left=(parseFloat(document.getElementById("objet"+elmnt.id.substring(5)).left)+document.getElementById("objet"+elmnt.id.substring(5)).firstChild.firstChild.getAttribute('x2'))+"px"
    }
    */
    
    // get the mouse cursor position at startup:
    pos3 = e.clientX/zoomScale;
    pos4 = e.clientY/zoomScale;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
  	 //elmnt.style.cursor="move";
    e = e || window.event;
    e.preventDefault();
    e.stopPropagation();
    // calculate the new cursor position:

    pos1 = pos3 - (e.clientX/zoomScale);
    pos2 = pos4 - (e.clientY/zoomScale);
    pos3 = e.clientX/zoomScale;
    pos4 = e.clientY/zoomScale;

    // set the element's new position:
    if(e.target.id=="selector"){
    	document.getElementById("selector").style.height=(parseInt(elmnt.style.height) - pos2)  + "px";
    	document.getElementById("selector").style.width =(parseInt(elmnt.style.width) - pos1) + "px";
    }else {

    	if(elmnt.id.substring(0,3)=="grp"){
    		var px=(elmnt.offsetLeft - pos1);
    		var py=(elmnt.offsetTop - pos2);
    		if(py<1){
    			py = 0;
    		}
    		if(py>spaceHeight){
    			py = spaceHeight;
    		}
    		if(px<1){
    			px = 0;
    		}
    		elmnt.style.top = py + "px";
    		elmnt.style.left = px + "px";
    		if(elmnt.id!="grpSelect"){
    		   tableObjet[parseInt(elmnt.id.substring(3))].posX=px;
		   	tableObjet[parseInt(elmnt.id.substring(3))].posY=py;
    		}
    		var elmnt2;
 			objActif=elmnt.id.substring(3);
 			selectObj=elmnt.id;
 			if(py>0 && py<spaceHeight && px>0){
 				if(elmnt.id!="grpSelect"){
	 				tableObjet[objActif].posX=px;
		    		tableObjet[objActif].posY=py;
		    		tableObjet[objActif].basePosY=py*(1/ratioSpaceHeight);
		    		lsgrp=tableObjet[objActif].liste
	    		}
	    		for(let i=0;i<lsgrp.length;i++){
	    			elmnt2=document.getElementById(tableObjet[lsgrp[i]].id);
	    			
					if (elmnt2.id.substring(0,5)=="objet") {
	
						px=(elmnt2.offsetLeft - pos1);
		    		   py=(elmnt2.offsetTop - pos2);
		    		   elmnt2.style.top = py + "px";
		    			elmnt2.style.left = px + "px";
		    			if(tableObjet[lsgrp[i]].type<24){
		    				transposition(elmnt2.id.substring(5),elmnt2.offsetTop - pos2);
		    			}
			    		//var dt=px*(1/zoomScale);
			    		position(px);
			    		tableObjet[lsgrp[i]].posX=px;
			    		tableObjet[lsgrp[i]].posY=py;
			    		tableObjet[lsgrp[i]].basePosY=py*(1/ratioSpaceHeight);
			    	}
	    			if (elmnt2.id.substring(0,3)=="grp") {
	    				px=(elmnt2.offsetLeft - pos1);
		    		   py=(elmnt2.offsetTop - pos2);
	    				elmnt2.style.top = py + "px";
	    				elmnt2.style.left = px + "px";
	    				tableObjet[lsgrp[i]].posX=px;
			    		tableObjet[lsgrp[i]].posY=py;
			    		tableObjet[lsgrp[i]].basePosY=py*(1/ratioSpaceHeight);
	    			}
	    		}
			}
    	}else if (elmnt.id.substring(0,5)=="objet"){

				objActif=elmnt.id.substring(5);
	    		var px=(elmnt.offsetLeft - pos1);
	    		var py=(elmnt.offsetTop - pos2);
	    		if(py<1){
	    			py = 0;
	    		}
	    		if(py>spaceHeight-49){
	    			py = spaceHeight-49;
	    		}
	    		if(px<1){
	    			px = 0;
	    		}
	    		elmnt.style.top = py + "px";
	    		elmnt.style.left = px + "px";

	    		if(tableObjet[objActif].type<24 && tableObjet[objActif].class==1){
	    			if(tableObjet[objActif].type==11){
	    				transposition(objActif,py)
	    				var lobj=document.getElementById("gliss"+elmnt.id.substring(5))
	    				var ly1=parseFloat(elmnt.firstChild.firstChild.getAttribute('y1'))
	    				var ly2=parseFloat(elmnt.firstChild.firstChild.getAttribute('y2'))
			    		if(ly2>ly1){
			    			lobj.style.top=(tableObjet[objActif].posY+(ly1+(ly2-ly1)))+"px"
			    		}else{
			    			lobj.style.top=tableObjet[objActif].posY+ly2+"px"
			    		}
			    		lobj.style.left=(parseFloat(elmnt.style.left)+parseFloat(elmnt.firstChild.firstChild.getAttribute('x2')))+"px"
					}else {
	    				transposition(objActif,py);
	    			}
	    		}
	    		if(tableObjet[objActif].class==3){
	    			if(tableObjet[objActif].type==1 || tableObjet[objActif].type==2 || tableObjet[objActif].type==3 || tableObjet[objActif].type==21 || tableObjet[objActif].type==22 || tableObjet[objActif].type==23  || tableObjet[objActif].type==24 || tableObjet[objActif].type==27 || tableObjet[objActif].type==28 || tableObjet[objActif].type==84){
	    				var lobj=document.getElementById("sglis"+elmnt.id.substring(5))
	    				var ly1=tableObjet[objActif].y1
	    				var ly2=tableObjet[objActif].y2
			    		if(ly1<ly2){
			    			lobj.style.top=(tableObjet[objActif].posY+ly2)+"px"
			    		}else{
			    			lobj.style.top=(tableObjet[objActif].posY)+"px"
			    		}
			    		lobj.style.left=(parseFloat(elmnt.style.left)+tableObjet[objActif].x2)+"px"
					}
	    		}
	    		position(px);
	    		tableObjet[objActif].posX=px;
	    		tableObjet[objActif].posY=py;
	    		tableObjet[objActif].basePosY=py*(1/ratioSpaceHeight);
	    	}else if (elmnt.id.substring(0,2)=="fx"){
				var px=elmnt.offsetLeft - pos1
				var py=elmnt.offsetTop - pos2	
	
				if(px<0){
					px=0
				}
				if(px>200){
					px=200
				}
				if (elmnt.id.substring(0,3)=="fx0"){
					px=0
				}
				if(parseInt(elmnt.id.substring(2,3))>0){
					var point=elmnt.id.substring(2,3)-1
					if(px<parseFloat(document.getElementById("fx"+point+elmnt.id.substring(3,4)).style.left)){
						px=parseFloat(document.getElementById("fx"+point+elmnt.id.substring(3,4)).style.left)+4
					}
				}
				if(py<0){
					py=0
				}
				if(py>60){
					py=60
				}
				
				
				var rw=tableObjet[objActif].fin-tableObjet[objActif].debut;
				var nduree=tableObjet[objActif].duree/tableObjet[objActif].transposition
				var relative=nduree*rw
				var inp=elmnt.parentNode.id
				var rp=document.getElementById("Y"+inp).max-((document.getElementById("Y"+inp).max-document.getElementById("Y"+inp).min))*(py/60)
				var nbv=document.getElementById("Y"+inp).step.toString().split(".");
				
				if(nbv.length>1){
					document.getElementById("Y"+inp).value=parseFloat(rp).toFixed(nbv[1].length)
				}else{
					document.getElementById("Y"+inp).value=parseInt(rp)
				}
				document.getElementById("X"+inp).value=((px/200)*relative).toFixed(2)
				elmnt.title=elmnt.id+":"+document.getElementById("Y"+inp).value
				elmnt.style.top = py+'px'
				elmnt.style.left = px+'px'
				
				updateFxAutomation(elmnt)
	    	}else if (elmnt.id.substring(0,5)=="butta"){
	    		var pp=elmnt.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
	    		var w=parseInt(elmnt.style.height);
	    		var r=(w-(pos4-elmnt.offsetTop-parseInt(pp.style.top)-elmnt.parentNode.offsetTop))*(w/100)
	    		var rt=2.70*r
	    		if(rt<0){
	    			rt=0
	    			r=0
	    		}
	    		if(rt>270){
	    			rt=270
	    			r=100
	    		}
	    		var doc=document.getElementById("inp"+elmnt.id.substring(5))
				var mx=parseFloat(doc.min)+(parseFloat(doc.max)-parseFloat(doc.min))*(r/99)
				if(mx<doc.min){
					mx=doc.min
				}
				if(mx>doc.max){
					mx=doc.max
				}
				var nbv=doc.step.toString().split(".");
				if(nbv.length>1){
					doc.value=parseFloat(mx).toFixed(nbv[1].length)
				}else{
					doc.value=parseInt(mx)
				}
	    		elmnt.firstChild.firstChild.firstChild.nextSibling.setAttribute('transform','rotate('+rt+' 22 22)')
	    		var cx=22
	    		var cy=22
	    		var rx=24
	    		var ry=24
	    		var t1=2.4
	    		var Δ= rt*(π/180)
	    		var φ= 0
	    		var arc=f_svg_ellipse_arc([cx,cy],[rx,ry], [t1, Δ], φ )
	    		elmnt.firstChild.firstChild.firstChild.setAttribute('d',arc.getAttribute('d'))
	    	}else if (elmnt.id.substring(0,5)=="slide"){
	    		var pp=elmnt.firstChild.firstChild;
	    		var p=parseInt(elmnt.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style.top);
	    		var w=parseInt(pp.getAttribute('height'));
	    		var r=((pos4+50-p-elmnt.offsetTop-elmnt.parentNode.offsetTop)-w)*(w/100)

	    		if(r<0){
	    			r=0
	    		}
	    		if(r>100){
	    			r=100
	    		}
	    		var doc=document.getElementById("inp"+elmnt.id.substring(6))
				var mx=doc.max-((parseFloat(doc.max)-parseFloat(doc.min))*(r/w))
				if(mx<doc.min){
					mx=doc.min
				}
				if(mx>doc.max){
					mx=doc.max
				}
				var nbv=doc.step.toString().split(".");
				if(nbv.length>1){
					doc.value=parseFloat(mx).toFixed(nbv[1].length)
				}else{
					doc.value=parseInt(mx)
				}
				
	    		elmnt.firstChild.firstChild.nextSibling.setAttribute("y",r+3)
	    		elmnt.firstChild.firstChild.nextSibling.nextSibling.setAttribute("cy",r+10)
	    		elmnt.firstChild.firstChild.nextSibling.nextSibling.nextSibling.setAttribute("y",r+14)
	    		elmnt.firstChild.firstChild.nextSibling.nextSibling.nextSibling.setAttribute("height",100-r)
	    	}else if(elmnt.id=="barVerticale"){
	    			elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
	    			barverticTime=defMoveLecture(1)-1;
	    		}else if(elmnt.id=="barDebut"){
	    			elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
	    			barDebutTime=defMoveLecture(2);
	    				
	    		}else if(elmnt.id=="barFin"){
	    			elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
	    			barFinTime=defMoveLecture(3);
	    			
	    			}else if(elmnt.id.substring(0,5)=="gliss"){
		    			var px=(elmnt.offsetLeft - pos1);
			    		var py=(elmnt.offsetTop - pos2);
			    		if(py<1){
		    			py = 0;
			    		}
			    		if(py>714){
			    			py = 714;
			    		}
			    		if(px<1){
			    			px = 0;
			    		}
			    		var orig=document.getElementById("objet"+elmnt.id.substring(5));
			    		if(px<parseFloat(orig.style.left)+1){
			    			px=parseFloat(orig.style.left)+1;
			    		}
			    		var actif=elmnt.id.substring(5)
			    		elmnt.style.top = py + "px";
			    		elmnt.style.left = px + "px";
			    		
			    		var basey1=reservTop1
			    		orig.style.width=(px-parseFloat(orig.style.left))+"px"
			    		
			    		orig.firstChild.setAttribute('width',parseFloat(orig.style.width))
			    	 
			    		if(py>basey1){
			    			orig.style.height=Math.abs(py-reservTop1)+"px"
			    			orig.firstChild.setAttribute('height',parseFloat(orig.style.height))
				    		orig.firstChild.firstChild.setAttribute('x1',0)
				    		orig.firstChild.firstChild.setAttribute('y1',0)
				    		orig.firstChild.firstChild.setAttribute('x2',parseFloat(orig.style.width))
				    		orig.firstChild.firstChild.setAttribute('y2',parseFloat(orig.style.height))
				    		
				    		tableObjet[actif].x1=0
				    		tableObjet[actif].y1=0
				    		tableObjet[actif].x2=parseFloat(orig.style.width)
				    		tableObjet[actif].y2=parseFloat(orig.style.height)
				    		
			    		}else{
			    			orig.style.top=py+"px"
			    			orig.style.height=Y1+Math.abs(py-reservTop1)+"px"
			    			orig.firstChild.setAttribute('height',parseFloat(orig.style.height))
			    			orig.firstChild.firstChild.setAttribute('x1',0)
				    		orig.firstChild.firstChild.setAttribute('y1',parseFloat(orig.style.height))
				    		orig.firstChild.firstChild.setAttribute('x2',parseFloat(orig.style.width))
				    		orig.firstChild.firstChild.setAttribute('y2',0)

				    		tableObjet[actif].posY=py
				    		tableObjet[actif].x1=0
				    		tableObjet[actif].y1=parseFloat(orig.style.height)
				    		tableObjet[actif].x2=parseFloat(orig.style.width)
				    		tableObjet[actif].y2=0

				    		objActif=actif

			    		}
				    		tableObjet[actif].width=parseFloat(orig.style.width)
				    		tableObjet[actif].height=parseFloat(orig.style.height)
				    		tableObjet[actif].bkgWidth=parseFloat(orig.style.width)
				    		tableObjet[actif].bkgHeight=parseFloat(orig.style.height)
			    		}else if(elmnt.id.substring(0,5)=="sglis"){
			    			var px=(elmnt.offsetLeft - pos1);
				    		var py=(elmnt.offsetTop - pos2);
				    		if(py<1){
					 		py = 0;
					 		}
					 		if(py>714){
					 			py = 714;
					 		}
					 		if(px<1){
					 			px = 0;
					 		}
					 		
					 		elmnt.style.top = py + "px";
					 		elmnt.style.left = px + "px";

				    		smarpege(elmnt,px,py)

			    		}else{
			    			if(elmnt.id!="space"){
				    			elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
				    			elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
			    			}
			    		}

	}
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
    elmnt.style.cursor="default";

    if(nselector==1){
    	lsgrp=[];
    	
    	var sl=document.getElementById("selector");
    	let groupet=0;
    	let groupeb=0;
    	let lsright=(parseFloat(sl.style.left)+parseFloat(sl.style.width));
    	let lsbas=(parseFloat(sl.style.top)+parseFloat(sl.style.height));
    	for(let i=0;i<tableObjet.length;i++){
    		groupet=tableObjet[i].posX+(tableObjet[i].bkgWidth);
    		groupeb=tableObjet[i].posY+(tableObjet[i].bkgHeight);
    		if(tableObjet[i].etat==1 && tableObjet[i].posX>parseFloat(sl.style.left) && groupet<lsright && tableObjet[i].posY>parseFloat(sl.style.top) && groupeb<lsbas){
    			lsgrp.push(i);
    		}
    	}

    	if(lsgrp.length>1){
	    	var minl=tableObjet[lsgrp[0]].posX;
	    	var mint=tableObjet[lsgrp[0]].posY;
	    	var maxl=tableObjet[lsgrp[0]].posX+(tableObjet[lsgrp[0]].bkgWidth);
	    	var maxt=tableObjet[lsgrp[0]].posY+(tableObjet[lsgrp[0]].bkgHeight);

	    	for(let i=1;i<lsgrp.length;i++){
	 			if(tableObjet[lsgrp[i]].posX<minl){
	 				minl=tableObjet[lsgrp[i]].posX;
	 			}
	 			if(tableObjet[lsgrp[i]].posY<mint){
	 				mint=tableObjet[lsgrp[i]].posY;
	 			}
	 			if(tableObjet[lsgrp[i]].posX+(tableObjet[lsgrp[i]].bkgWidth)>maxl){
	 				maxl=tableObjet[lsgrp[i]].posX+(tableObjet[lsgrp[i]].bkgWidth);
	 			}
	 			if(tableObjet[lsgrp[i]].posY+(tableObjet[lsgrp[i]].bkgHeight)>maxt){
	 				maxt=tableObjet[lsgrp[i]].posY+(tableObjet[lsgrp[i]].bkgHeight);
	 			}
	    	}

	    	if(lsgrp.length>0){
	    		var dupnode=document.createElement('div');
				dupnode.setAttribute("id","grpSelect");
				dupnode.setAttribute("class","selector");
				dupnode.setAttribute("style","position:absolute;top:"+(mint)+"px;left:"+(minl)+"px;width:"+((maxl-minl))+"px;height:"+((maxt-mint))+"px;transform-origin: 0 0;");
				document.getElementById("space").appendChild(dupnode);
				dragElement(document.getElementById("grpSelect"));
				grpSelect=1;
				preservSelect=[];
    			preservSelect=[].concat(lsgrp);
    			
    		}
    		
    	}
    	//document.getElementById("space").removeChild(document.getElementById("selector"));
    	document.getElementById("selector").style.display="none";
    	elmnt=document.getElementById("space");
    	nselector=0;
    }
   if(elmnt.id.substring(0,5)=="gliss"){
   	document.getElementById("gliss"+elmnt.id.substring(5)).style.border='0px solid red'
   }
   if(elmnt.id.substring(0,5)=="sglis"){
   	document.getElementById("sglis"+elmnt.id.substring(5)).style.border='0px solid red'

   }
   
   if(elmnt.id.substring(0,5)=="morph"){
   	document.getElementById("morph"+elmnt.id.substring(5)).style.border='0px solid red'
   }
   if(elmnt.id.substring(0,5)=="objet" && tableObjet[elmnt.id.substring(5)].type==11){
   	document.getElementById("gliss"+elmnt.id.substring(5)).style.border='0px solid red'
    }
	if(elmnt.id.substring(0,2)=="fx"){
   	elmnt.style.backgroundColor='#f100fa'
   	
    }
    /*
    if(selectObj.substring(0,5)=="objet"){
    	objActif=selectObj.substring(5);
    }
    */
  }
}
function smarpege(elmnt,px,py) {
 		var orig=document.getElementById("objet"+elmnt.id.substring(5));
 		if(px<parseFloat(orig.style.left)+1){
 			px=parseFloat(orig.style.left)+1;
 		}
 		var actif=elmnt.id.substring(5)
 		
 		
 		var basey1=reservTop1
 		orig.style.width=(px-parseFloat(orig.style.left))+"px"
 		
 		orig.firstChild.setAttribute('width',parseFloat(orig.style.width))
 	 
 		if(py>basey1){
 			orig.style.height=Math.abs(py-parseFloat(tableObjet[actif].posY))+"px"
 			orig.firstChild.setAttribute('height',parseFloat(orig.style.height))
 			
    		var x1=0
    		var y1=0
    		var x2=px-parseFloat(tableObjet[actif].posX)
    		var y2=py-parseFloat(tableObjet[actif].posY);
    		
    		var nb=Math.hypot(x2-x1, y2-y1)
    		var nb2=nb/4.9222416
    		var txt="";
    		switch(tableObjet[actif].type) {
    			case 1:
					for(i=0;i<nb2;i++){
						txt=txt+'<path d="m 2.8301032,'+(i*4.9222416)+' c 0,-0.275616 0.137821,-0.413411 0.413411,-0.413411 0.121285,0 0.216376,0.03445 0.285274,0.103346 l 3.381699,2.815326 c 0.190169,0.154358 0.285254,0.356235 0.285254,0.605657 0,0.249423 -0.2322,0.572585 -0.696598,0.9694604 -0.464399,0.396875 -0.826135,0.749644 -1.085207,1.058325 -0.413411,0.413412 -0.620117,0.866098 -0.620117,1.358059 0,0.491958 0.146074,0.910193 0.438216,1.254703 l 0.826823,0.669728 c 0.104733,0.08819 0.157096,0.1881 0.157096,0.299723 0,0.111619 -0.04341,0.21015 -0.130222,0.29559 -0.08682,0.08544 -0.181901,0.128156 -0.285256,0.128156 -0.103351,0 -0.189478,-0.03445 -0.258381,-0.103352 l -3.410651,-2.815333 c -0.190156,-0.137803 -0.285248,-0.336241 -0.285248,-0.595313 0,-0.259072 0.228759,-0.586356 0.68625,-0.981855 0.457518,-0.395499 0.85852,-0.778589 1.203034,-1.1492714 0.344514,-0.370707 0.516758,-0.797216 0.516758,-1.279525 0,-0.482309 -0.147426,-0.89572 -0.44233,-1.240234 l -0.826823,-0.669713 c -0.101971,-0.08821 -0.152982,-0.191559 -0.152982,-0.310066" />'
					}
					break;
				case 2:
					for(i=0;i<nb2;i++){
						txt=txt+'<path d="m 2.8301032,'+(i*4.9222416)+' c 0,-0.275616 0.137821,-0.413411 0.413411,-0.413411 0.121285,0 0.216376,0.03445 0.285274,0.103346 l 3.381699,2.815326 c 0.190169,0.154358 0.285254,0.356235 0.285254,0.605657 0,0.249423 -0.2322,0.572585 -0.696598,0.9694604 -0.464399,0.396875 -0.826135,0.749644 -1.085207,1.058325 -0.413411,0.413412 -0.620117,0.866098 -0.620117,1.358059 0,0.491958 0.146074,0.910193 0.438216,1.254703 l 0.826823,0.669728 c 0.104733,0.08819 0.157096,0.1881 0.157096,0.299723 0,0.111619 -0.04341,0.21015 -0.130222,0.29559 -0.08682,0.08544 -0.181901,0.128156 -0.285256,0.128156 -0.103351,0 -0.189478,-0.03445 -0.258381,-0.103352 l -3.410651,-2.815333 c -0.190156,-0.137803 -0.285248,-0.336241 -0.285248,-0.595313 0,-0.259072 0.228759,-0.586356 0.68625,-0.981855 0.457518,-0.395499 0.85852,-0.778589 1.203034,-1.1492714 0.344514,-0.370707 0.516758,-0.797216 0.516758,-1.279525 0,-0.482309 -0.147426,-0.89572 -0.44233,-1.240234 l -0.826823,-0.669713 c -0.101971,-0.08821 -0.152982,-0.191559 -0.152982,-0.310066" />'
						txt=txt+'<path d="m -0.0010629,8.447791 c -0.113482,0.09554 -0.205008,0.128211 -0.274563,0.09804 -0.139145,0 -0.208699,-0.110603 -0.208699,-0.331842 0,-0.2212239 0.366119,-0.8032039 1.098324,-1.7459321 0.732238,-0.942734 1.567877,-2.192175 2.506918,-3.7482813 0.939074,-1.5561528 1.735386,-3.0054418 2.009949,-4.16691018 0,-0.060335 -0.126309,0 0,0 0,0 -0.02197,-0.060334 0,0 0.296547,1.28715688 1.130351,2.76786758 2.056605,4.26117708 0.926253,1.4932624 1.7564011,2.7112804 2.4904471,3.6540144 0.734046,0.9427282 1.101069,1.5159092 1.101069,1.7195411 0,0.203627 -0.03477,0.314242 -0.104344,0.331841 -0.06957,0.01752 -0.195871,-0.0062 -0.378924,-0.07163 0,0 -4.3303111,-2.9588331 -5.1290491,-3.3170971" />'
					}	
					break;
				case 3:
						txt=txt+'<path d="m 5,0 l 0,'+(nb2*5)+'"  stroke="#000000" stroke-width="1"/>'
						txt=txt+'<path d="m -0.0010629,8.447791 c -0.113482,0.09554 -0.205008,0.128211 -0.274563,0.09804 -0.139145,0 -0.208699,-0.110603 -0.208699,-0.331842 0,-0.2212239 0.366119,-0.8032039 1.098324,-1.7459321 0.732238,-0.942734 1.567877,-2.192175 2.506918,-3.7482813 0.939074,-1.5561528 1.735386,-3.0054418 2.009949,-4.16691018 0,-0.060335 -0.126309,0 0,0 0,0 -0.02197,-0.060334 0,0 0.296547,1.28715688 1.130351,2.76786758 2.056605,4.26117708 0.926253,1.4932624 1.7564011,2.7112804 2.4904471,3.6540144 0.734046,0.9427282 1.101069,1.5159092 1.101069,1.7195411 0,0.203627 -0.03477,0.314242 -0.104344,0.331841 -0.06957,0.01752 -0.195871,-0.0062 -0.378924,-0.07163 0,0 -4.3303111,-2.9588331 -5.1290491,-3.3170971" />'
					break;
				case 21:
						txt=txt+'<path d="m 2,0 l 0,'+(nb2*5)+'"  stroke="#000000" stroke-width="2"/>'
						//x2=x2*tableObjet[elmnt.id.substring(5)].scaleX
					break;
				case 22:
						txt=txt+'<path d="m 3,0 l 0,'+(nb2*5)+' M 6,0 l 0,'+(nb2*5)+'"  stroke="#000000" stroke-width="1"/>'
					break;
				case 23:
						txt=txt+'<path d="m 10,0 l 0,'+(nb2*5)+'"  stroke="#000000" stroke-width="4"/><path d="m 16,0 l 0,'+(nb2*5)+'"  stroke="#000000" stroke-width="1"/>'
					break;
				case 24:
						txt=txt+'<path d="m 16,0 l 0,'+(nb2*5)+'"  stroke="#000000" stroke-width="1"/><path d="M 22,0 l 0,'+(nb2*5)+'"  stroke="#000000" stroke-width="4"/><path d="m 28,0 l 0,'+(nb2*5)+'"  stroke="#000000" stroke-width="1"/>'
					break;
				case 27:
					var nb2=nb/21
					for(i=0;i<nb;i++){
						txt=txt+'<path d="m 14.363434,0.18913237 c 0.258693,0.013148 0.380911,0.1573854 0.366917,0.432726 -0.0062,0.1210228 -0.06372,0.2216822 -0.172436,0.3017283 L 1.6223882,9.6293854 13.608379,19.606306 c 0.100038,0.09066 0.147564,0.187649 0.142326,0.290703 -0.0053,0.103319 -0.04902,0.208654 -0.131845,0.316243 -0.08283,0.107588 -0.167575,0.15918 -0.254247,0.154775 -0.08667,-0.0044 -0.179246,-0.04381 -0.277488,-0.117689 L 0.67783617,9.8918714 c -0.1177947,-0.07486 -0.1730554,-0.181262 -0.1660585,-0.318932 0.006984,-0.137406 0.0727466,-0.237649 0.1975248,-0.300188 L 14.104858,0.22579657 c 0.0511,-0.030516 0.137289,-0.042827 0.258576,-0.036662" transform="translate(0,'+(i*20)+')"/>'
					}
					break;
				case 28:
					var nb2=nb/14
					for(i=0;i<nb;i++){
						txt=txt+'<path d="m 10.167981,15.973817 v 0.148562 c -0.02099,0.04898 -0.09601,0.07238 -0.2182617,0.07238 C 5.6722328,15.352847 2.827939,14.213761 1.4160494,12.773795 0.60102532,11.928078 0.19372322,11.257589 0.19372322,10.76238 c 0,-0.8685722 0.68758146,-1.6342943 2.06305888,-2.3047839 C 3.6323122,7.7871071 5.1569537,7.2842801 6.8307073,6.9490081 8.5044593,6.61379 10.106596,6.179477 11.63706,5.6461765 13.167578,5.1166849 14.039897,4.5375635 14.254015,3.9166492 13.083107,3.2499689 11.648446,2.7280416 9.9497193,2.3547312 9.6170768,2.2556897 9.2342253,1.882379 8.8019484,1.2385545 8.6104428,0.96809488 8.5149528,0.69377148 8.5149528,0.41950255 V 0.2709402 c 0.02624,-0.0489766 0.074504,-0.0761858 0.1437605,-0.0761858 1.4614707,0.32759902 2.6819607,0.68572668 3.6611547,1.081893 0.97956,0.3999755 1.840493,0.9790423 2.582797,1.7447641 0.860566,0.8952377 1.291058,1.6647691 1.291058,2.312403 0,0.838098 -0.663708,1.5809645 -1.991493,2.2285436 -1.327365,0.643825 -2.810138,1.1352775 -4.447532,1.470496 -1.6373932,0.335217 -3.2274082,0.754293 -4.7689445,1.2647379 -1.5418505,0.506635 -2.4696264,1.059092 -2.7836945,1.653396 1.7486764,0.891374 3.9006673,1.588528 6.4566543,2.083791 0.168419,0.02721 0.3237221,0.11428 0.4674821,0.262839 0.143759,0.152373 0.2927655,0.331408 0.4475445,0.54092 0.1547758,0.209511 0.2570887,0.339027 0.3069325,0.392357 0.1909786,0.297126 0.2869946,0.544782 0.2869946,0.742866"  transform="translate(0,'+i*14+')"/>'
					}
					break;
				case 84:
						txt=txt+'<path d="m 5,0 l 0,'+(nb2*5)+'"  stroke="#000000" stroke-width="1"/>'
						txt=txt+'<path d="m -0.0010629,8.447791 c -0.113482,0.09554 -0.205008,0.128211 -0.274563,0.09804 -0.139145,0 -0.208699,-0.110603 -0.208699,-0.331842 0,-0.2212239 0.366119,-0.8032039 1.098324,-1.7459321 0.732238,-0.942734 1.567877,-2.192175 2.506918,-3.7482813 0.939074,-1.5561528 1.735386,-3.0054418 2.009949,-4.16691018 0,-0.060335 -0.126309,0 0,0 0,0 -0.02197,-0.060334 0,0 0.296547,1.28715688 1.130351,2.76786758 2.056605,4.26117708 0.926253,1.4932624 1.7564011,2.7112804 2.4904471,3.6540144 0.734046,0.9427282 1.101069,1.5159092 1.101069,1.7195411 0,0.203627 -0.03477,0.314242 -0.104344,0.331841 -0.06957,0.01752 -0.195871,-0.0062 -0.378924,-0.07163 0,0 -4.3303111,-2.9588331 -5.1290491,-3.3170971" /><path d="m -0.0010629,8.447791 c -0.113482,0.09554 -0.205008,0.128211 -0.274563,0.09804 -0.139145,0 -0.208699,-0.110603 -0.208699,-0.331842 0,-0.2212239 0.366119,-0.8032039 1.098324,-1.7459321 0.732238,-0.942734 1.567877,-2.192175 2.506918,-3.7482813 0.939074,-1.5561528 1.735386,-3.0054418 2.009949,-4.16691018 0,-0.060335 -0.126309,0 0,0 0,0 -0.02197,-0.060334 0,0 0.296547,1.28715688 1.130351,2.76786758 2.056605,4.26117708 0.926253,1.4932624 1.7564011,2.7112804 2.4904471,3.6540144 0.734046,0.9427282 1.101069,1.5159092 1.101069,1.7195411 0,0.203627 -0.03477,0.314242 -0.104344,0.331841 -0.06957,0.01752 -0.195871,-0.0062 -0.378924,-0.07163 0,0 -4.3303111,-2.9588331 -5.1290491,-3.3170971"  transform="translate(10,'+((nb2*5)-10)+') rotate(180 0 0)"/>'
					break;
			}
			var al=Math.floor(90+(Math.asin((y2/nb))*180/Math.PI))

			if(al>175){
				al=180
				document.getElementById("objet"+actif).style.width=(20+x2)+"px"
				x2=x2+20
				}
			if(al>85 && al<91){
				al=90
				
				document.getElementById("objet"+actif).style.height=(40+y2)+"px"
				y1=y2+30
				y2=y2+70
				}
			document.getElementById("objet"+actif).firstChild.setAttribute("height",Math.abs(y2-y1))
			document.getElementById("objet"+actif).firstChild.setAttribute("width",x2)
			document.getElementById("objet"+actif).style.height=(y2-y1)+"px"
			document.getElementById("objet"+actif).style.width=x2+"px"
			document.getElementById("objet"+actif).firstChild.firstChild.innerHTML=txt
			
			var transf=" rotate("+al+" 0 0 "+") scale("+tableObjet[actif].scaleX+" "+tableObjet[actif].scaleY+") translate("+(tableObjet[actif].margeG)+" "+(tableObjet[actif].margeH)+")"
			document.getElementById("objet"+actif).firstChild.firstChild.setAttribute("transform",transf)
			tableObjet[actif].rotate=al
			
			symbMGauche(actif,x2)
			symbMHaut(actif,y2)
			
			tableObjet[actif].x1=x1
 		tableObjet[actif].y1=y1
 		tableObjet[actif].x2=x2
 		tableObjet[actif].y2=y2
 		
			//console.log(al,px,x2,py,y2,orig,elmnt)
 		
 		}else{
 			orig.style.top=(py)+"px"
 			orig.style.height=(py)+"px"
 			orig.firstChild.setAttribute('height',parseFloat(orig.style.height))
 			var x1=0
    		var y1=0
    		var x2=px-parseFloat(tableObjet[actif].posX);
    		var y2=parseFloat(tableObjet[actif].posY)-py;
    		
    		var nb=Math.hypot(x2-x1, Math.abs(y2-y1))
    		var nb2=nb/4.9222416
    		var txt="";
    		switch(tableObjet[actif].type) {
    			case 1:
					for(i=0;i<nb2;i++){
						txt=txt+'<path d="m 2.8301032,'+(i*4.9222416)+' c 0,-0.275616 0.137821,-0.413411 0.413411,-0.413411 0.121285,0 0.216376,0.03445 0.285274,0.103346 l 3.381699,2.815326 c 0.190169,0.154358 0.285254,0.356235 0.285254,0.605657 0,0.249423 -0.2322,0.572585 -0.696598,0.9694604 -0.464399,0.396875 -0.826135,0.749644 -1.085207,1.058325 -0.413411,0.413412 -0.620117,0.866098 -0.620117,1.358059 0,0.491958 0.146074,0.910193 0.438216,1.254703 l 0.826823,0.669728 c 0.104733,0.08819 0.157096,0.1881 0.157096,0.299723 0,0.111619 -0.04341,0.21015 -0.130222,0.29559 -0.08682,0.08544 -0.181901,0.128156 -0.285256,0.128156 -0.103351,0 -0.189478,-0.03445 -0.258381,-0.103352 l -3.410651,-2.815333 c -0.190156,-0.137803 -0.285248,-0.336241 -0.285248,-0.595313 0,-0.259072 0.228759,-0.586356 0.68625,-0.981855 0.457518,-0.395499 0.85852,-0.778589 1.203034,-1.1492714 0.344514,-0.370707 0.516758,-0.797216 0.516758,-1.279525 0,-0.482309 -0.147426,-0.89572 -0.44233,-1.240234 l -0.826823,-0.669713 c -0.101971,-0.08821 -0.152982,-0.191559 -0.152982,-0.310066" />'
					}
					break;
				case 2:
			for(i=0;i<nb2;i++){
						txt=txt+'<path d="m 2.8301032,'+(i*4.9222416)+' c 0,-0.275616 0.137821,-0.413411 0.413411,-0.413411 0.121285,0 0.216376,0.03445 0.285274,0.103346 l 3.381699,2.815326 c 0.190169,0.154358 0.285254,0.356235 0.285254,0.605657 0,0.249423 -0.2322,0.572585 -0.696598,0.9694604 -0.464399,0.396875 -0.826135,0.749644 -1.085207,1.058325 -0.413411,0.413412 -0.620117,0.866098 -0.620117,1.358059 0,0.491958 0.146074,0.910193 0.438216,1.254703 l 0.826823,0.669728 c 0.104733,0.08819 0.157096,0.1881 0.157096,0.299723 0,0.111619 -0.04341,0.21015 -0.130222,0.29559 -0.08682,0.08544 -0.181901,0.128156 -0.285256,0.128156 -0.103351,0 -0.189478,-0.03445 -0.258381,-0.103352 l -3.410651,-2.815333 c -0.190156,-0.137803 -0.285248,-0.336241 -0.285248,-0.595313 0,-0.259072 0.228759,-0.586356 0.68625,-0.981855 0.457518,-0.395499 0.85852,-0.778589 1.203034,-1.1492714 0.344514,-0.370707 0.516758,-0.797216 0.516758,-1.279525 0,-0.482309 -0.147426,-0.89572 -0.44233,-1.240234 l -0.826823,-0.669713 c -0.101971,-0.08821 -0.152982,-0.191559 -0.152982,-0.310066" />'
						txt=txt+'<path d="m -0.0010629,8.447791 c -0.113482,0.09554 -0.205008,0.128211 -0.274563,0.09804 -0.139145,0 -0.208699,-0.110603 -0.208699,-0.331842 0,-0.2212239 0.366119,-0.8032039 1.098324,-1.7459321 0.732238,-0.942734 1.567877,-2.192175 2.506918,-3.7482813 0.939074,-1.5561528 1.735386,-3.0054418 2.009949,-4.16691018 0,-0.060335 -0.126309,0 0,0 0,0 -0.02197,-0.060334 0,0 0.296547,1.28715688 1.130351,2.76786758 2.056605,4.26117708 0.926253,1.4932624 1.7564011,2.7112804 2.4904471,3.6540144 0.734046,0.9427282 1.101069,1.5159092 1.101069,1.7195411 0,0.203627 -0.03477,0.314242 -0.104344,0.331841 -0.06957,0.01752 -0.195871,-0.0062 -0.378924,-0.07163 0,0 -4.3303111,-2.9588331 -5.1290491,-3.3170971" />'
					}
					break;
				case 3:
						txt=txt+'<path d="m 5,0 l 0,'+(nb2*5)+'"  stroke="#000000" stroke-width="1"/>'
						txt=txt+'<path d="m -0.0010629,8.447791 c -0.113482,0.09554 -0.205008,0.128211 -0.274563,0.09804 -0.139145,0 -0.208699,-0.110603 -0.208699,-0.331842 0,-0.2212239 0.366119,-0.8032039 1.098324,-1.7459321 0.732238,-0.942734 1.567877,-2.192175 2.506918,-3.7482813 0.939074,-1.5561528 1.735386,-3.0054418 2.009949,-4.16691018 0,-0.060335 -0.126309,0 0,0 0,0 -0.02197,-0.060334 0,0 0.296547,1.28715688 1.130351,2.76786758 2.056605,4.26117708 0.926253,1.4932624 1.7564011,2.7112804 2.4904471,3.6540144 0.734046,0.9427282 1.101069,1.5159092 1.101069,1.7195411 0,0.203627 -0.03477,0.314242 -0.104344,0.331841 -0.06957,0.01752 -0.195871,-0.0062 -0.378924,-0.07163 0,0 -4.3303111,-2.9588331 -5.1290491,-3.3170971" />'
					break;
				 case 21:
						txt=txt+'<path d="m 2,0 l 0,'+(nb2*5)+'"  stroke="#000000" stroke-width="1"/>'
					break;
				case 22:
						txt=txt+'<path d="m 3,0 l 0,'+(nb2*5)+' M 6,0 l 0,'+(nb2*5)+'"  stroke="#000000" stroke-width="1"/>'
					break;
				case 23:
						txt=txt+'<path d="m 3,0 l 0,'+(nb2*5)+'"  stroke="#000000" stroke-width="4"/><path d="m 8,0 l 0,'+(nb2*5)+'"  stroke="#000000" stroke-width="1"/>'
					break;
				case 24:
						txt=txt+'<path d="m 3,0 l 0,'+(nb2*5)+'"  stroke="#000000" stroke-width="1"/><path d="M 8,0 l 0,'+(nb2*5)+'"  stroke="#000000" stroke-width="4"/><path d="m 14,0 l 0,'+(nb2*5)+'"  stroke="#000000" stroke-width="1"/>'
					break;
				case 27:
					var nb2=nb/21
						for(i=0;i<nb;i++){
		txt=txt+'<path d="m 14.363434,0.18913237 c 0.258693,0.013148 0.380911,0.1573854 0.366917,0.432726 -0.0062,0.1210228 -0.06372,0.2216822 -0.172436,0.3017283 L 1.6223882,9.6293854 13.608379,19.606306 c 0.100038,0.09066 0.147564,0.187649 0.142326,0.290703 -0.0053,0.103319 -0.04902,0.208654 -0.131845,0.316243 -0.08283,0.107588 -0.167575,0.15918 -0.254247,0.154775 -0.08667,-0.0044 -0.179246,-0.04381 -0.277488,-0.117689 L 0.67783617,9.8918714 c -0.1177947,-0.07486 -0.1730554,-0.181262 -0.1660585,-0.318932 0.006984,-0.137406 0.0727466,-0.237649 0.1975248,-0.300188 L 14.104858,0.22579657 c 0.0511,-0.030516 0.137289,-0.042827 0.258576,-0.036662" transform="translate(0,'+(i*20)+')"/>'
	}
					break;
					case 28:
					var nb2=nb/14
					for(i=0;i<nb;i++){
						txt=txt+'<path <path d="m 10.167981,15.973817 v 0.148562 c -0.02099,0.04898 -0.09601,0.07238 -0.2182617,0.07238 C 5.6722328,15.352847 2.827939,14.213761 1.4160494,12.773795 0.60102532,11.928078 0.19372322,11.257589 0.19372322,10.76238 c 0,-0.8685722 0.68758146,-1.6342943 2.06305888,-2.3047839 C 3.6323122,7.7871071 5.1569537,7.2842801 6.8307073,6.9490081 8.5044593,6.61379 10.106596,6.179477 11.63706,5.6461765 13.167578,5.1166849 14.039897,4.5375635 14.254015,3.9166492 13.083107,3.2499689 11.648446,2.7280416 9.9497193,2.3547312 9.6170768,2.2556897 9.2342253,1.882379 8.8019484,1.2385545 8.6104428,0.96809488 8.5149528,0.69377148 8.5149528,0.41950255 V 0.2709402 c 0.02624,-0.0489766 0.074504,-0.0761858 0.1437605,-0.0761858 1.4614707,0.32759902 2.6819607,0.68572668 3.6611547,1.081893 0.97956,0.3999755 1.840493,0.9790423 2.582797,1.7447641 0.860566,0.8952377 1.291058,1.6647691 1.291058,2.312403 0,0.838098 -0.663708,1.5809645 -1.991493,2.2285436 -1.327365,0.643825 -2.810138,1.1352775 -4.447532,1.470496 -1.6373932,0.335217 -3.2274082,0.754293 -4.7689445,1.2647379 -1.5418505,0.506635 -2.4696264,1.059092 -2.7836945,1.653396 1.7486764,0.891374 3.9006673,1.588528 6.4566543,2.083791 0.168419,0.02721 0.3237221,0.11428 0.4674821,0.262839 0.143759,0.152373 0.2927655,0.331408 0.4475445,0.54092 0.1547758,0.209511 0.2570887,0.339027 0.3069325,0.392357 0.1909786,0.297126 0.2869946,0.544782 0.2869946,0.742866"  transform="translate(0,'+i*14+')"/>'
					}
					break;
				case 84:
						txt=txt+'<path d="m 5,0 l 0,'+(nb2*5)+'"  stroke="#000000" stroke-width="1"/>'
						txt=txt+'<path d="m -0.0010629,8.447791 c -0.113482,0.09554 -0.205008,0.128211 -0.274563,0.09804 -0.139145,0 -0.208699,-0.110603 -0.208699,-0.331842 0,-0.2212239 0.366119,-0.8032039 1.098324,-1.7459321 0.732238,-0.942734 1.567877,-2.192175 2.506918,-3.7482813 0.939074,-1.5561528 1.735386,-3.0054418 2.009949,-4.16691018 0,-0.060335 -0.126309,0 0,0 0,0 -0.02197,-0.060334 0,0 0.296547,1.28715688 1.130351,2.76786758 2.056605,4.26117708 0.926253,1.4932624 1.7564011,2.7112804 2.4904471,3.6540144 0.734046,0.9427282 1.101069,1.5159092 1.101069,1.7195411 0,0.203627 -0.03477,0.314242 -0.104344,0.331841 -0.06957,0.01752 -0.195871,-0.0062 -0.378924,-0.07163 0,0 -4.3303111,-2.9588331 -5.1290491,-3.3170971" /><path d="m -0.0010629,8.447791 c -0.113482,0.09554 -0.205008,0.128211 -0.274563,0.09804 -0.139145,0 -0.208699,-0.110603 -0.208699,-0.331842 0,-0.2212239 0.366119,-0.8032039 1.098324,-1.7459321 0.732238,-0.942734 1.567877,-2.192175 2.506918,-3.7482813 0.939074,-1.5561528 1.735386,-3.0054418 2.009949,-4.16691018 0,-0.060335 -0.126309,0 0,0 0,0 -0.02197,-0.060334 0,0 0.296547,1.28715688 1.130351,2.76786758 2.056605,4.26117708 0.926253,1.4932624 1.7564011,2.7112804 2.4904471,3.6540144 0.734046,0.9427282 1.101069,1.5159092 1.101069,1.7195411 0,0.203627 -0.03477,0.314242 -0.104344,0.331841 -0.06957,0.01752 -0.195871,-0.0062 -0.378924,-0.07163 0,0 -4.3303111,-2.9588331 -5.1290491,-3.3170971"  transform="translate(10,'+((nb2*5)-6)+') rotate(180 0 0)"/>'
					break;
				}
			document.getElementById("objet"+actif).firstChild.setAttribute("height",Math.abs(y2-y1))
			document.getElementById("objet"+actif).style.height=Math.abs(y2-y1)+"px"
			document.getElementById("objet"+actif).style.width=x2+"px"
			document.getElementById("objet"+actif).firstChild.firstChild.innerHTML=txt
			var al=90-Math.floor(Math.asin(Math.abs(y1-y2)/nb)*180/Math.PI)
			var transf="rotate("+al+" 0 "+(0)+")  scale("+tableObjet[actif].scaleX+" "+tableObjet[actif].scaleY+") translate("+(tableObjet[actif].margeG+(0))+" "+(tableObjet[actif].margeH-(0))+") "
			document.getElementById("objet"+actif).firstChild.firstChild.setAttribute("transform",transf)
			symbMGauche(actif,x2)
			symbMHaut(actif,y1)
			tableObjet[actif].rotate=al
			//console.log(al,py,nb,x1,y1,x2,y2,orig.style.top,orig,elmnt)
 		   tableObjet[actif].x1=x1
 		tableObjet[actif].y1=y2
 		tableObjet[actif].x2=x2
 		tableObjet[actif].y2=y1

 		}
 			objActif=actif
 		tableObjet[actif].width=x2-x1
 		tableObjet[actif].height=Math.abs(y1-y2)
 		tableObjet[actif].bkgWidth=x2-x1
 		tableObjet[actif].bkgHeight=Math.abs(y1-y2)
}
function updateFxAutomation(obj) {
	var liste=tableObjet[objActif].tableFxParam
	var greffon=obj.parentNode.parentNode.parentNode.parentNode.parentNode.id
	var index=tableObjet[objActif].tableFx.indexOf(greffon)
	var fxParam=liste[index].split("/")
	var tableLabel=listeFx[greffon].label.split(',')
	var index2=tableLabel.indexOf(obj.parentNode.id)
	var FxparamValue= fxParam[index2].split("&")
	var listPoints=obj.parentNode.getElementsByTagName('div')
	txt="<line  x1='0' y1='32' x2='200' y2='32' strocke-width='2' stroke='#43434366' />"
	for(i=1;i< listPoints.length;i++){
		txt=txt+"<line  x1="+(parseFloat(listPoints[i-1].style.left)+3)+" y1="+(parseFloat(listPoints[i-1].style.top)+3)+" x2="+parseFloat(listPoints[i].style.left)+" y2="+(parseFloat(listPoints[i].style.top)+3)+" strocke-width='2' stroke='#434343' />"
	}
	if(parseFloat(listPoints[listPoints.length-1].style.left)<200){
		txt=txt+"<line  x1="+(parseFloat(listPoints[listPoints.length-1].style.left)+3)+" y1="+(parseFloat(listPoints[listPoints.length-1].style.top)+3)+" x2='200' y2="+(parseFloat(listPoints[listPoints.length-1].style.top)+3)+" strocke-width='2' stroke='#434343' />"
	}
	var dest=obj.parentNode.getElementsByTagName('svg')
	dest[0].innerHTML=txt
}
function drawFxAutomation(greffon) {
	var rw=tableObjet[objActif].fin-tableObjet[objActif].debut;
	var nduree=tableObjet[objActif].duree/tableObjet[objActif].transposition
	var relative=nduree*rw
	var txt="";
	var txt1="<line  x1='0' y1='32' x2='200' y2='32' strocke-width='2' stroke='#43434366' />"
	var index=tableObjet[objActif].tableFx.indexOf(greffon)
	var fx=tableObjet[objActif].tableFxParam[index]
	var fxParam=fx.split("/")
	var fxDefMax=listeFx[greffon].max.split(",")
	var fxDefMin=listeFx[greffon].min.split(",")
	var tableLabel=listeFx[greffon].label.split(',')
	for(i=0;i<fxParam.length;i++){
		var mx=parseFloat(fxDefMax[i])-parseFloat(fxDefMin[i])
		var h=60-(60*(-parseFloat(fxDefMin[i])/mx))
		var npoints=fxParam[i].split("&")
		var r0;
		var t0;
		for(j=0;j<npoints.length;j++){
			if(j==0){
				var cd0=npoints[0].split("?")
				r0=(h-((60/mx)*parseFloat(cd0[1])))-4;
				t0=0
				document.getElementById('Y'+tableLabel[i]).value=cd0[1]
			}else{
				var cd0=npoints[j-1].split("?")
				t0=cd0[0]*(200/relative)
			}
			r0=(h-((60/mx)*parseFloat(cd0[1])))-4
			var cd=npoints[j].split("?")
			r=(h-((60/mx)*parseFloat(cd[1])))-4
			t=cd[0]*(200/relative)
			if(j==0 && npoints.length==1){
				txt1=txt1+"<line  x1='0' y1='"+(r0+2)+"' x2='200' y2='"+(r0+2)+"' strocke-width='2' stroke='#434343' />"
			}else{
				if(j==npoints.length-1 && r<200){
					txt1=txt1+"<line  x1='"+t0+"' y1='"+(r0+2)+"' x2='"+t+"' y2='"+(r+2)+"' strocke-width='2' stroke='#434343' />"
					txt1=txt1+"<line  x1='"+t+"' y1='"+(r+2)+"' x2='200' y2='"+(r+2)+"' strocke-width='2' stroke='#434343' />"
				}else{
					txt1=txt1+"<line  x1='"+t0+"' y1='"+(r0+2)+"' x2='"+t+"' y2='"+(r+2)+"' strocke-width='2' stroke='#434343' />"
				}
			}
		//console.log("id","fx"+j+i,"j",j,'y1',r0+2,"y2",r+2)
		txt=txt+"<div id='fx"+j+i+"' style='position:absolute;top:"+r+"px;left:"+t+"px;width:5px;height:5px;background-color:#f100fa;' title='fx"+j+i+":"+cd[1]+"'></div>"
		document.getElementById(tableLabel[i]).innerHTML=""
		document.getElementById(tableLabel[i]).innerHTML="<svg>"+txt1+"</svg>"+txt
		}
		
		txt="";
		txt1="<line  x1='0' y1='32' x2='200' y2='32' strocke-width='2' stroke='#43434366' />"
	}
	
	var tbdiv=document.getElementById(tableLabel[0]).parentNode.parentNode.parentNode.getElementsByTagName('div')
	for(i=0;i<tbdiv.length;i++){
		if(tbdiv[i].id.substring(0,2)=='fx'){
			dragElement(tbdiv[i])
		}
	}
}
// ************************************************************ palette panel *********************************************************

function paletteArpeges(){

	if(paletteArpegesetat==0){
		document.getElementById("defArpeges").style.display="block";
		paletteArpegesetat=1;
	}else{
		document.getElementById("defArpeges").style.display="none";
		paletteArpegesetat=0;
	}
}
function paletteArticulations(){
	if(paletteArticulationsetat==0){
		document.getElementById("defArticulations").style.display="block";
		paletteArticulationsetat=1;
	}else{
		document.getElementById("defArticulations").style.display="none";
		paletteArticulationsetat=0;
	}
}
function paletteBlockV(){
	if(paletteBlockVetat==0){
		document.getElementById("defBlockVerticaux").style.display="block";
		paletteBlockVetat=1;
	}else{
		document.getElementById("defBlockVerticaux").style.display="none";
		paletteBlockVetat=0;
	}
}
function paletteLignes(){
	if(paletteLignesetat==0){
		document.getElementById("defPaletteLignes").style.display="block";
		paletteLignesetat=1;
	}else{
		document.getElementById("defPaletteLignes").style.display="none";
		paletteLignesetat=0;
	}
}
function paletteNuances(){
	if(paletteNuancesetat==0){
		document.getElementById("defpaletteNuances").style.display="block";
		paletteNuancesetat=1;
	}else{
		document.getElementById("defpaletteNuances").style.display="none";
		paletteNuancesetat=0;
	}
}
function paletteObjets(){
	if(paletteObjetsetat==0){
		document.getElementById("defpaletteObjets").style.display="block";
		paletteObjetsetat=1;
	}else{
		document.getElementById("defpaletteObjets").style.display="none";
		paletteObjetsetat=0;
	}
}
function paletteFonctions(){
	if(paletteFonctionsetat==0){
		document.getElementById("defpaletteFonctions").style.display="block";
		paletteFonctionsetat=1;
	}else{
		document.getElementById("defpaletteFonctions").style.display="none";
		paletteFonctionsetat=0;
	}
}
function inscriptions(){
	if(paletteInscriptionsetat==0){
		document.getElementById("defInscriptions").style.display="block";
		paletteInscriptionsetat=1;
	}else{
		document.getElementById("defInscriptions").style.display="none";
		paletteInscriptionsetat=0;
	}
}

// ************************************************************ fonctions générales ********************************************************* 
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
function transposition(objActif,y){
	if(tableObjet[objActif].flagTranspo==1){
		var refViewBoxHeight=parseFloat(document.getElementById("space").style.height);
	 	tableObjet[objActif].transposition=(refViewBoxHeight-y )/(refViewBoxHeight/2);
	 	//document.getElementById("transposition").innerHTML="Vitesse de lecture : "+tableObjet[objActif].transposition.toFixed(2);
	 	window.api.send("toMain", "transposition;"+objActif+";"+tableObjet[objActif].transposition);
 	}
}
function invTransposition(y){
	var refViewBoxHeight=parseFloat(document.getElementById("space").style.height);
 	let invT=(refViewBoxHeight-y )/(refViewBoxHeight/2);
   return invT;
}
function position(x){
	var ratioT=(720/12960);
	var tmp=x*ratioT;
	var mn=Math.floor(tmp/60);
	var s=Math.floor(tmp%60);
	var ml=tmp-((mn*60)+s);
	window.api.send("toMain", "position;"+mn+";"+s+";"+ml);
}
function defMoveLecture(obj){
	switch(obj){
			case 1:
				var posX=parseInt(document.getElementById("barVerticale").style.left)
				break
			case 2:
				var posX=parseInt(document.getElementById("barDebut").style.left)+40
				break
			case 3:
				var posX=parseInt(document.getElementById("barFin").style.left)
				break
	}
	
	var ratioT=(720/12960);
	var tempo=60/parseFloat(document.getElementById("tempo").value)
	var tmp=((posX*ratioT/zoomScale)*tempo)+1;
	var mn=Math.floor(tmp/60);
	var s=Math.floor(tmp%60);
	if(mn<10){
		var smn="0"+mn
	}else{
		var smn=mn
	}
	if(s<10){
		var ss="0"+s
	}else{
		var ss=s
	}
	document.getElementById("compteurM").innerHTML = smn+" : ";
	document.getElementById("compteurS").innerHTML = ss;
	dsecondes=s;
	dminutes=mn;
	return tmp
}
function posxToSec(obj){
	var ratioT=(720/12960);
	var x=parseFloat(document.getElementById(obj).style.left)
	var tmp=(tmp*ratioT/zoomScale)+1;
	return tmp;
}
function secToPosx(s){
	var ratioT=12960/720;
	var tmp=s*ratioT*zoomScale;
	return tmp;
}
function defPosition(id,tmp){
	tableObjet[id].posX=tmp
	document.getElementById(tableObjet[id].id).style.left=tmp+"px"
}
function transpoToPosY(id,tmp){
	var refViewBoxHeight=parseFloat(document.getElementById("space").style.height)/2;
	var transpo=parseFloat(document.getElementById("space").style.height)-(refViewBoxHeight*tmp)
	selectObj.posY=transpo;
	tableObjet[id].posY=transpo
	tableObjet[id].transposition=tmp
	document.getElementById(tableObjet[id].id).style.top=transpo+"px"
}
function voirLength() {
	if(vueDuree==0 && tableObjet[objActif].duree){
		var ratioT=(720/12960);
		var nduree=tableObjet[objActif].duree/tableObjet[objActif].transposition
		if(tableObjet[objActif].convolver!="" && tableBufferIR[tableObjet[objActif].convolver].duration>nduree*tableObjet[objActif].fin){
			var localDuree=tableBufferIR[tableObjet[objActif].convolver].duration/tableObjet[objActif].transposition
		}else{
			var localDuree=nduree
		}
		var bar=(localDuree/ratioT);
		document.getElementById("vueLength").style.width=(bar*zoomScale)+'px';
		document.getElementById("vueLength").style.top=(tableObjet[objActif].posY*zoomScale)+"px";
		document.getElementById("vueLength").style.left=(tableObjet[objActif].posX*zoomScale)+"px";
		document.getElementById("vueLength").style.display="block";
		vueDuree=1;
	}else{
		document.getElementById("vueLength").style.display="none";
		vueDuree=0;
	}
}