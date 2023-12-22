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
let paletteInscriptionsetat=0

let vueDuree=0

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
			console.log("tableObjet[i].id",tableObjet[i].id);
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
	console.log("scale",scale,nbmax)
	/*
	for(let i=0;i<nbmax;i+=(1*scale)){
		var dupnode=document.createElementNS("http://www.w3.org/2000/svg",'line');
		dupnode.setAttribute("x1",i);
		dupnode.setAttribute("y1",0);
		dupnode.setAttribute("x2",i);
		dupnode.setAttribute("y2",5);
		dupnode.setAttribute("style","stroke:"+fontColor+";stroke-width:1;");
		document.querySelector("#"+dest).appendChild(dupnode);
	}
	*/
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
	for(let i=0;i<nbmax;i+=(180*scale)){
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
		document.querySelector("#"+dest).appendChild(dupnode);
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
	var delta=((1080/(tempo*nbdiv))*nbmes*scale)/4;
	for(let i=0;i<nbmax;i+=delta){
		var dupnode=document.createElementNS("http://www.w3.org/2000/svg",'line');
		dupnode.setAttribute("x1",i);
		dupnode.setAttribute("y1",26);
		dupnode.setAttribute("x2",i);
		dupnode.setAttribute("y2",31);
		dupnode.setAttribute("style","stroke:"+bkg+";stroke-width:1;opacity:"+opac);
		document.querySelector("#"+dest).appendChild(dupnode);
	}
	delta=(1080/(tempo*nbdiv))*nbmes*scale;
	for(let i=0;i<nbmax;i+=delta){
		var dupnode=document.createElementNS("http://www.w3.org/2000/svg",'line');
		dupnode.setAttribute("x1",i);
		dupnode.setAttribute("y1",26);
		dupnode.setAttribute("x2",i);
		dupnode.setAttribute("y2",46);
		dupnode.setAttribute("style","stroke:"+bkg+";stroke-width:1;opacity:"+opac);
		document.querySelector("#"+dest).appendChild(dupnode);
	}
	delta=delta*nbmes;
	let t=1;
	for(let i=0;i<nbmax;i+=delta){
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
		t=t+nbmes;
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
	var nbmax=12960*scale
	console.log("grille scale",scale)
	deleteGrille()
	deleteGrille()
	var delta=(270/(tempo*nbdiv))*nbmes
	
	if(spaceSeconde==false){
		delta=delta*nbmes
	}
	for(let i=0;i<12960;i+=delta){
		var dupnode=document.createElement("div")
		dupnode.setAttribute("class","grille")
		
		dupnode.style.left=i+"px"
		dupnode.style.height=(spaceHeight-40)+"px"
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
		document.getElementById(dest).appendChild(dupnode)
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
  
  //console.log("zoom", zoomScale);
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
	//console.log("tbgrille",tbgrille);
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
	document.getElementById("bvsvg").style.height=((parseFloat(document.getElementById("space").style.height)*zoomScale)+40)+"px";
	
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
	console.log("selector")
}
function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
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
    
    	reservY1=document.getElementById("objet"+elmnt.id.substring(5)).firstChild.firstChild.getAttribute('y1')
    	reservTop1=parseFloat(document.getElementById("objet"+elmnt.id.substring(5)).style.top)
    	reservHeight1=parseFloat(document.getElementById("objet"+elmnt.id.substring(5)).style.height)
    }
    if(elmnt.id.substring(0,5)=="gliss"){
   	document.getElementById("gliss"+elmnt.id.substring(5)).style.border='1px solid red'
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
	    		if(py>spaceHeight){
	    			py = spaceHeight;
	    		}
	    		if(px<1){
	    			px = 0;
	    		}
	    		elmnt.style.top = py + "px";
	    		elmnt.style.left = px + "px";

	    		if(tableObjet[objActif].type<24){
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
	    		position(px);
	    		tableObjet[objActif].posX=px;
	    		tableObjet[objActif].posY=py;
	    		tableObjet[objActif].basePosY=py*(1/ratioSpaceHeight);
	    	}else if(elmnt.id=="barVerticale"){
	    			elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
	    			defMoveLecture(1);
	    		}else if(elmnt.id=="barDebut"){
	    			elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
	    			defTime("barDebut");
	    			defMoveLecture(2);	
	    		}else if(elmnt.id=="barFin"){
	    			elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
	    			defTime("barFin");
	    			defMoveLecture(3);
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
			    			orig.style.height=Math.abs(py-reservTop1)+"px"
			    			orig.firstChild.setAttribute('height',parseFloat(orig.style.height))
			    			orig.firstChild.firstChild.setAttribute('x1',0)
				    		orig.firstChild.firstChild.setAttribute('y1',orig.style.height)
				    		orig.firstChild.firstChild.setAttribute('x2',parseFloat(orig.style.width))
				    		orig.firstChild.firstChild.setAttribute('y2',0)

				    		tableObjet[actif].posY=py
				    		tableObjet[actif].x1=0
				    		tableObjet[actif].y1=orig.style.height
				    		tableObjet[actif].x2=parseFloat(orig.style.width)
				    		tableObjet[actif].y2=0
				    		objActif=actif
			    		}
			    		tableObjet[actif].width=orig.style.width
			    		tableObjet[actif].height=orig.style.height
			    		
			    		console.log(orig,px,py)
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
    	//console.log(parseFloat(sl.style.left),parseFloat(sl.style.top),lsright,lsbas);
    	for(let i=0;i<tableObjet.length;i++){
    		groupet=tableObjet[i].posX+(tableObjet[i].bkgWidth);
    		groupeb=tableObjet[i].posY+(tableObjet[i].bkgHeight);
    		if(tableObjet[i].etat==1 && tableObjet[i].posX>parseFloat(sl.style.left) && groupet<lsright && tableObjet[i].posY>parseFloat(sl.style.top) && groupeb<lsbas){
    			lsgrp.push(i);
    		}
    	}
    	//console.log(tableObjet);
		//console.log("lsgrp",lsgrp);
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
   if(elmnt.id.substring(0,5)=="morph"){
   	document.getElementById("morph"+elmnt.id.substring(5)).style.border='0px solid red'
   }
   if(elmnt.id.substring(0,5)=="objet" && tableObjet[elmnt.id.substring(5)].type==11){
   	document.getElementById("gliss"+elmnt.id.substring(5)).style.border='0px solid red'
    }
    //console.log("click gauche objet",elmnt.id,selectObj,objActif);
    /*
    if(selectObj.substring(0,5)=="objet"){
    	objActif=selectObj.substring(5);
    }
    */
  }
}

// ************************************************************ palette panel *********************************************************

function paletteArpeges(){
	console.log("block");
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
 	console.log("refViewBoxHeight",refViewBoxHeight);
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
	var tmp=(posX*ratioT/zoomScale)+1;
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
	console.log("voirDuree",bar,tableObjet[objActif],document.getElementById("vueLength"))
}