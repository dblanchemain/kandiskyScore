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
dragElement(document.getElementById("space"));

let paletteArpegesetat=0;
let paletteArticulationsetat=0;
let paletteBlockVetat=0;
let paletteLignesetat=0;
let paletteNuancesetat=0;
let paletteObjetsetat=0;
let paletteFonctionsetat=0;
let paletteInscriptionsetat=0;

let vueDuree=0;

let barverticTime=0;
let barDebutTime=4;
let barFinTime=6;
let nbTempoPoints=0;
tempoInitPoint('tmp0',0,100-(0.4167*parseFloat(document.getElementById("tempo").value)));
tempoInitPoint('tmp1',12960,100-(0.4167*parseFloat(document.getElementById("tempo").value)));
drawTempo();
let nbGainPoints=0;
gainInitPoint('gna0',0,81);
gainInitPoint('gna1',12960,81);
drawGain();

dragElement(document.getElementById("fenetreFlot"));
dragElement(document.getElementById("augmDim"));
dragElement(document.getElementById("inclusionWin"));
dragElement(document.getElementById("renderAudio"));
dragElement(document.getElementById("tempoAudio"));
dragElement(document.getElementById("canvas"));
dragElement(document.getElementById("popupScaleGrpObjets"));
dragElement(document.getElementById("listeAudios"));
dragElement(document.getElementById("popupLoader"));

document.getElementById("arpeges").addEventListener('click',paletteArpeges);
document.getElementById("articulations").addEventListener('click',paletteArticulations);
document.getElementById("paletteLignes").addEventListener('click',paletteLignes);
document.getElementById("paletteNuances").addEventListener('click',paletteNuances);
document.getElementById("paletteObjets").addEventListener('click',paletteObjets);
document.getElementById("inscriptions").addEventListener('click',inscriptions);
document.getElementById("paletteFonctions").addEventListener('click',paletteFonctions);

document.getElementById("lineTempo").addEventListener('click',tempoInsetPoint);
document.getElementById("lineGain").addEventListener('click',gainInsetPoint);
document.getElementById("flagTempo").addEventListener('click',flagTempo);
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

let spaceWidth=0;
let spaceHeight=0;
let defFlagTempo=0;
document.getElementById("reglette").addEventListener('wheel', zoom, { passive: false });
//document.getElementById("regle").addEventListener('click',defPosLecture);
//document.getElementById("barDebut").addEventListener('click',selectBarDebut);
//document.getElementById("barFin").addEventListener('click',selectBarFin);
function flagTempo() {
	if(defFlagTempo==0){
		defFlagTempo=1;
		document.getElementById('wtempo').style.display="block";
		document.getElementById('work2').style.top=152+"px";
	}else{
		defFlagTempo=0;
		document.getElementById('wtempo').style.display="none";
		document.getElementById('work2').style.top=52+"px";
	}
}
function upDateWorkSpace(type){
	spaceWidth=mainwinWidth-214;
	spaceHeight=mainwinheight-100;
	document.getElementById('paramGlobal').style.width=spaceWidth+"px";
	document.getElementById('work').style.width=spaceWidth+"px";
	document.getElementById('work').style.height=(spaceHeight+30)+"px";
	document.getElementById('work2').style.width="12960px";//spaceWidth+"px";
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
	defTempoFoo();
	for(let i=0;i<tableObjet.length;i++){
		if(tableObjet[i].etat==1){
			tableObjet[i].posY=tableObjet[i].basePosY*ratioSpaceHeight;
			document.getElementById(tableObjet[i].id).style.top=tableObjet[i].posY+"px";
		}
	}
	
	if(type==1){
		if(setTimeRegle==true){
				createReglette(zoomScale,"reglette",regleBackground,parseFloat(regleFontSize),regleFontColor);
		}
		if(setSignRegle==true){
			regSolfege(zoomScale,"reglette",parseFloat(regleFontSize),regleFontColor,regleFontColor,1);
		}
	}
	if(setGrille==true){
		deleteGrille();
		deleteGrille();
		grilleSpace(zoomScale,"space",colorGrille);
	}
}

function createReglette(scale,dest,bkg,fontSize,fontColor){
	var nbmax=12960*scale;
	document.querySelector("#"+dest).innerHTML="";
	// Retourne le BPM local à une position pixel donnée
	function getBPMat(px){
		if(tempoFoo.length<=1) return 60;
		for(var i=0;i<tempoFoo.length;i++){
			if(tempoFoo[i].X>=px) return tempoFoo[i].Y;
		}
		return tempoFoo[tempoFoo.length-1].Y;
	}
	// Itère par pixel : pas inversement proportionnel au BPM
	// → plus le tempo est élevé, plus les ticks sont serrés
	var p=0;
	var tickCount=0;
	while(p<nbmax){
		var bpm=getBPMat(p);
		var step=18*scale*60/bpm;
		if(step<=0) break;
		var isMajor=(tickCount%10===0);
		var dupnode=document.createElementNS("http://www.w3.org/2000/svg",'line');
		dupnode.setAttribute("x1",p);
		dupnode.setAttribute("y1",0);
		dupnode.setAttribute("x2",p);
		dupnode.setAttribute("y2",isMajor?15:10);
		dupnode.setAttribute("style","stroke:"+fontColor+";stroke-width:1;");
		document.querySelector("#"+dest).appendChild(dupnode);
		if(isMajor){
			var timeVal=pixelToTime(p);
			var dupnode3=document.createElementNS("http://www.w3.org/2000/svg",'text');
			dupnode3.setAttribute("x",p+2);
			dupnode3.setAttribute("y",24);
			dupnode3.setAttribute("style","fill:"+fontColor+";font: "+fontSize+"em sans-serif;");
			dupnode3.appendChild(document.createTextNode(Math.round(timeVal)));
			document.querySelector("#"+dest).appendChild(dupnode3);
		}
		p+=step;
		tickCount++;
	}
}
function regSolfege(scale,dest,fontSize,fontColor,bkg,opac){
	var nbmax=12960*scale;
	var nbdiv=parseFloat(document.getElementById("nbDiv").value);
	var nbmes=parseFloat(document.getElementById("nbMesure").value);
	//var tempo=parseFloat(document.getElementById("tempo").value);
	var tempo=60;
	var delta=((1080/(tempo*nbdiv))*nbmes*scale)/nbmes;
	console.log(nbdiv,nbmes,tempo,delta);
	for(let i=0;i<nbmax;i+=delta){
		var dupnode=document.createElementNS("http://www.w3.org/2000/svg",'line');
		dupnode.setAttribute("x1",i);
		dupnode.setAttribute("y1",26);
		dupnode.setAttribute("x2",i);
		dupnode.setAttribute("y2",31);
		dupnode.setAttribute("style","stroke:"+bkg+";stroke-width:1;opacity:"+opac);
		document.querySelector("#"+dest).appendChild(dupnode);
	}
	let t=2;
	//for(let i=0;i<nbmax;i+=delta*nbmes*scale*(tempo/60)){
	let k=0;
	for(let i=0;i<nbmax;i+=delta){
		var dupnode=document.createElementNS("http://www.w3.org/2000/svg",'line');
		dupnode.setAttribute("x1",i);
		dupnode.setAttribute("y1",26);
		dupnode.setAttribute("x2",i);
		dupnode.setAttribute("y2",38);
		dupnode.setAttribute("style","stroke:"+bkg+";stroke-width:1;");

		if(k>nbmes-1){
			var dupnode2=document.createElementNS("http://www.w3.org/2000/svg",'text');
			dupnode2.setAttribute("x",i+2);
			dupnode2.setAttribute("y",42);
			dupnode2.setAttribute("style","fill:"+fontColor+";font: "+(fontSize-0.1)+"em sans-serif;opacity:"+opac);
			var textNode = document.createTextNode(t);
			dupnode2.appendChild(textNode);		
			document.querySelector("#"+dest).appendChild(dupnode);
			document.querySelector("#"+dest).appendChild(dupnode2);
			t=t+1;
			k=1;
		}else{
			k++;
		}
	}
}
function deleteGrille(){
	var obj=document.getElementById("space");
	var tabg=obj.getElementsByClassName("grille");
	if(tabg.length>0){
		for(let i in tabg){
			if(tabg[i].nodeType === Node.ELEMENT_NODE){
			obj.removeChild(tabg[i]);
			}
		}
	}
}
function grilleSpace(scale,dest,bkg) {
	var nbdiv=parseFloat(document.getElementById("nbDiv").value);
	var nbmes=parseFloat(document.getElementById("nbMesure").value);
	var tempo=parseFloat(document.getElementById("tempo").value);
	var dest=document.getElementById("spaceBkg");
	var nbmax=12960*scale;
	deleteGrille();
	deleteGrille();
	var tmpbuffer=[];
	document.getElementById("spaceBkg").innerHTML="";
	
	//var delta=(270/(tempo*nbdiv))*nbmes
	var delta=18*scale;

	if(spaceSeconde==false){
		delta=delta*nbmes;
	}
	if(tempo>=120){
		delta=delta*4;
	}

	for(let i=0;i<12960;i+=delta){
		var dupnode=document.createElement("div");
		dupnode.setAttribute("class","grille");
		
		dupnode.style.left=i+"px";
		dupnode.style.height=((spaceHeight-40)*zoomScale)+"px";
		dupnode.style.backgroundColor=bkg;
		dupnode.style.opacity=spaceGrilleOpacity;
		dupnode.style.width="1px";
		if(scale<0.99){
			dupnode.style.width="2px";
		}
		if(scale>2.35){
			dupnode.style.width="0.5px";
		}
		if(scale>4){
			dupnode.style.width="0.25px";
		}
		dest.appendChild(dupnode);
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
	  document.querySelector("#reglette").setAttribute('width',(12960*zoomScale));
	  document.querySelector("#reglette").setAttribute('viewBox','0 0 '+(12960*zoomScale)+' 50');
	  document.querySelector("#regle").style.width=(12960*zoomScale)+"px";
	  document.querySelector("#work2").style.width=(12960*zoomScale)+"px";
	  document.querySelector("#space").style.width=(12960*zoomScale)+"px";
  }else{
  	  document.querySelector("#space").style.width=document.querySelector("#regle").style.width;
  }
	document.getElementById("space").style.transform="scale("+zoomScale+","+zoomScale+")";
	//document.getElementById("spaceBkg").style.transform="scale("+zoomScale+","+zoomScale+")";
	document.getElementById("bvsvg").style.height=((parseFloat(document.getElementById("space").style.height)*zoomScale)+40)+"px";
	document.getElementById("barVerticale").style.left=secToPosx(barverticTime)+"px";
	
	document.getElementById("barDebut").style.left=(secToPosx(barDebutTime-1)-40)+"px";
	document.getElementById("barFin").style.left=secToPosx(barFinTime-1)+"px";
	if(setGrille==true){
		deleteGrille();
		deleteGrille();
		grilleSpace(zoomScale,"space",colorGrille);
	}
}
function newSelector(e){
	if(nselector==0){
		if(defFlagTempo==0){
			var ftemp=0;
		}else{
			var ftemp=100;
		}
		document.getElementById("selector").style.display="block";
		document.getElementById("selector").style.top=(((e.clientY-94-ftemp)+scrollDemo2.scrollTop)/zoomScale)+"px";
		document.getElementById("selector").style.left=((e.clientX-208+scrollDemo.scrollLeft)/zoomScale)+"px";
		document.getElementById("selector").style.width=(20*zoomScale)+"px";
		document.getElementById("selector").style.height=(20*zoomScale)+"px";
		document.getElementById("selector").style.borderWidth=(1/zoomScale)+"px";
		nselector=1;
	}
}
function tempoInitPoint(id,x,y) {
	var p={
		id:id,
		X:x,
		Y:y
	};
	tempoPoints.push(p);
	nbTempoPoints++;
	tempoPoints.sort(function compare(a, b) {
  if (a.X < b.X)
     return -1;
  if (a.X > b.X )
     return 1;
  return 0;
});
	console.log("tmp",tempoPoints);
	
	var dupnode=document.createElement('div');
	dupnode.setAttribute("id",id);
	dupnode.setAttribute("title","ts="+((p.X/18).toFixed(2))+" tempo="+((240-p.Y/0.4167).toFixed(2)));
	var xpos=x;
	var ypos=y;
	var st="position:absolute;top:"+p.Y+"px;left:"+p.X+"px;border:1px solid green;width:5px;height:5px;";
	dupnode.setAttribute("style",st);
	
	document.getElementById("wtempo").appendChild(dupnode);
	console.log(document.getElementById("wtempo"),tempoPoints);
	dragElement(document.getElementById(id));
}
function gainInitPoint(id,x,y) {
	var p={
		id:id,
		X:x,
		Y:y
	};
	gainPoints.push(p);
	nbGainPoints++;
	gainPoints.sort(function compare(a, b) {
  if (a.X < b.X)
     return -1;
  if (a.X > b.X )
     return 1;
  return 0;
});
	console.log("tmp",gainPoints);
	
	var dupnode=document.createElement('div');
	dupnode.setAttribute("id",id);
	dupnode.setAttribute("title","ts="+((p.X/18).toFixed(2))+" gain="+((100-p.Y)*0.05).toFixed(2));
	var xpos=x;
	var ypos=y;
	var st="position:absolute;top:"+p.Y+"px;left:"+p.X+"px;border:1px solid red;width:5px;height:5px;";
	dupnode.setAttribute("style",st);
	
	document.getElementById("wtempo").appendChild(dupnode);
	console.log(document.getElementById("wtempo"),gainPoints);
	dragElement(document.getElementById(id));
}
function tempoInsetPoint(e) {
	var p={
		id:"tmp"+nbTempoPoints,
		X:scrollDemo.scrollLeft+e.clientX-200,
		Y:e.clientY-100
	};
	tempoPoints.push(p);
	
	tempoPoints.sort(function compare(a, b) {
  if (a.X < b.X)
     return -1;
  if (a.X > b.X )
     return 1;
  return 0;
});
	console.log("tmp"+nbTempoPoints,tempoPoints);
	
	var dupnode=document.createElement('div');
	dupnode.setAttribute("id","tmp"+nbTempoPoints);
	dupnode.setAttribute("title","ts="+((p.X/18).toFixed(2))+" tempo="+((240-p.Y/0.4167).toFixed(2)));
	var xpos=e.clientX-200;
	var ypos=e.clientY-100;
	var st="position:absolute;top:"+p.Y+"px;left:"+p.X+"px;border:1px solid green;width:5px;height:5px;";
	dupnode.setAttribute("style",st);
	
	document.getElementById("wtempo").appendChild(dupnode);
	console.log(document.getElementById("wtempo"),tempoPoints);
	dragElement(document.getElementById("tmp"+nbTempoPoints));
	if(tempoPoints.length>1){
		drawTempo();
		defTempoFoo();
	}
	nbTempoPoints++;
}
function gainInsetPoint(e) {
	var p={
		id:"gna"+nbGainPoints,
		X:scrollDemo.scrollLeft+e.clientX-200,
		Y:e.clientY-100
	};
	gainPoints.push(p);
	
	gainPoints.sort(function compare(a, b) {
  if (a.X < b.X)
     return -1;
  if (a.X > b.X )
     return 1;
  return 0;
});
	console.log("gna"+nbGainPoints,gainPoints);
	
	var dupnode=document.createElement('div');
	dupnode.setAttribute("id","gna"+nbGainPoints);
	dupnode.setAttribute("title","ts="+((p.X/18).toFixed(2))+" gain="+((240-p.Y/0.4167).toFixed(2)));
	var xpos=e.clientX-200;
	var ypos=e.clientY-100;
	var st="position:absolute;top:"+p.Y+"px;left:"+p.X+"px;border:1px solid green;width:5px;height:5px;";
	dupnode.setAttribute("style",st);
	
	document.getElementById("wtempo").appendChild(dupnode);
	console.log(document.getElementById("wtempo"),gainPoints);
	dragElement(document.getElementById("gna"+nbGainPoints));
	if(gainPoints.length>1){
		drawGain();
	}
	nbGainPoints++;
}
function defTempoFoo() {
	//document.getElementById("renduWav").preservesPitch=true;
				tempoFoo=[];
				
				if(tempoPoints.length>1){
					var j=0;
					for(i=0;i<tempoPoints.length-1;i++){
						var px=tempoPoints[i+1].X-tempoPoints[i].X;
						var deltaY=tempoPoints[i+1].Y-tempoPoints[i].Y;
						if(Math.abs(deltaY)<0.001){
							// Segment horizontal : BPM constant, une seule entrée
							tempoFoo[j]={X:tempoPoints[i].X, Y:240-tempoPoints[i].Y/0.4167};
							j++;
						} else {
							var ps=px/Math.abs(deltaY);
							var inctp=deltaY/Math.abs(deltaY); // ±1 : signe de la pente
							var n=0;
							for(k=tempoPoints[i].X;k<tempoPoints[i+1].X;k=k+Math.abs(ps)){
								var p={
									X:k,
									Y:240-(tempoPoints[i].Y+(inctp*n))/0.4167
								};
								tempoFoo[j]=p;
								j++;
								n++;
							}
						}

						}	
					
					var p={
							X:12960,
							Y:240-(tempoPoints[tempoPoints.length-1].Y)/0.4167
						};
					tempoFoo[j]=p;		
					var p={
							X:0,
							Y:240-(tempoPoints[0].Y)/0.4167
						};
					tempoFoo[0]=p;		
				}
					
				document.querySelector("#reglette").innerHTML="";
		createReglette(zoomScale,"reglette",regleBackground,parseFloat(regleFontSize),regleFontColor);
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
    if(elmnt.id.substring(0,3)=="tmp"){
    	if(e.button==2 && parseInt(elmnt.id.substring(3))>0){
    		console.log("gain",elmnt,elmnt.id);
	    		console.log("tempo",elmnt,elmnt.id);
			   elmnt.parentNode.removeChild(elmnt);
				const pos =tempoPoints.map(e => e.id).indexOf(elmnt.id);
				const x = tempoPoints.splice(pos, 1);
				console.log("tempoPoints",pos,tempoPoints);
			   drawTempo();
			   defTempoFoo();
    	}else{
    		console.log(elmnt.style.backgroundColor);
   		elmnt.style.backgroundColor='green';
   	}
    }
    if(elmnt.id.substring(0,3)=="gna"){
	    if (e.button==2 && parseInt(elmnt.id.substring(3))>0) {
			   	console.log("gain",elmnt,elmnt.id);
				   elmnt.parentNode.removeChild(elmnt);
					const pos =gainPoints.map(e => e.id).indexOf(elmnt.id);
					const x = gainPoints.splice(pos, 1);
					console.log("gainPoints",pos,gainPoints);
				   drawGain();
		 }else{
    		console.log(elmnt.style.backgroundColor);
   		elmnt.style.backgroundColor='red';
   	}
   }
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
    	window.api.contextmenu("showmenu","");
    }

    if(elmnt.id.substring(0,5)=="gliss"){
    	Y1=parseFloat(document.getElementById("objet"+elmnt.id.substring(5)).style.height);
    	reservY1=document.getElementById("objet"+elmnt.id.substring(5)).firstChild.firstChild.getAttribute('y1');
    	
    	reservTop1=parseFloat(document.getElementById("objet"+elmnt.id.substring(5)).style.top);
    	reservHeight1=parseFloat(document.getElementById("objet"+elmnt.id.substring(5)).style.height);
    }
    if(elmnt.id.substring(0,5)=="sglis"){
    	Y1=parseFloat(document.getElementById("objet"+elmnt.id.substring(5)).style.height);
    	reservTop1=parseFloat(document.getElementById("objet"+elmnt.id.substring(5)).style.top);
    }
    if(elmnt.id.substring(0,5)=="gliss"){
   	document.getElementById("gliss"+elmnt.id.substring(5)).style.border='1px solid red';
    }
    if(elmnt.id.substring(0,5)=="sglis"){
   	document.getElementById("sglis"+elmnt.id.substring(5)).style.border='1px solid red';
    }
    if(elmnt.id.substring(0,2)=="p1"){
   	document.getElementById("p1"+elmnt.id.substring(2)).style.border='1px solid blue';
    }
    if(elmnt.id.substring(0,2)=="p2"){
   	document.getElementById("p2"+elmnt.id.substring(2)).style.border='1px solid green';
    }

    if(elmnt.id.substring(0,5)=="objet" && tableObjet[elmnt.id.substring(5)].class==3){
    	var _t56=tableObjet[elmnt.id.substring(5)].type;
    	if (_t56==1 || _t56==2 || _t56==3 || _t56==21 || _t56==22 || _t56==23 || _t56==24 || _t56==26 || _t56==27 || _t56==28 || _t56==56 || _t56==57 || _t56==58 || _t56==59 || _t56==84 || _t56==63 || _t56==64 || _t56==65 || _t56==66 || _t56==67 || _t56==68){
   		document.getElementById("sglis"+elmnt.id.substring(5)).style.border='1px solid red';
   	}
    }
    if(elmnt.id.substring(0,2)=="fx"){
    	selectPointFx=elmnt.id;
    	if(e.button==2 && parseInt(elmnt.id.substring(2,3))>0){
    		var pt=elmnt.parentNode.firstChild.nextSibling;
		   elmnt.parentNode.removeChild(elmnt);
		   var tbdiv=pt.parentNode.getElementsByTagName('div');
		   var greffon=pt.parentNode.parentNode.parentNode.parentNode.parentNode.id;
		   
			var tableLabel=listeFx[greffon].label.split(',');
			var index=tableLabel.indexOf(pt.parentNode.id);
		   for(i=0;i<tbdiv.length;i++){
				if(tbdiv[i].id.substring(0,2)=='fx'){
					tbdiv[i].id="fx"+i+index;
					tbdiv[i].title="fx"+i+index;
				}
			}
    		updateFxAutomation(pt);
			for(i=0;i<tbdiv.length;i++){
				if(tbdiv[i].id.substring(0,2)=='fx'){
					dragElement(tbdiv[i]);
				}
			}
    	}else{
   		elmnt.style.backgroundColor='green';
   		document.getElementById('Y'+elmnt.parentNode.id).value=elmnt.title.substring(5);
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
		    		lsgrp=tableObjet[objActif].liste;
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
	    				transposition(objActif,py);
	    				var lobj=document.getElementById("gliss"+elmnt.id.substring(5));
	    				var ly1=parseFloat(elmnt.firstChild.firstChild.getAttribute('y1'));
	    				var ly2=parseFloat(elmnt.firstChild.firstChild.getAttribute('y2'));
			    		if(ly2>ly1){
			    			lobj.style.top=(tableObjet[objActif].posY+(ly1+(ly2-ly1)))+"px";
			    		}else{
			    			lobj.style.top=tableObjet[objActif].posY+ly2+"px";
			    		}
			    		lobj.style.left=(parseFloat(elmnt.style.left)+parseFloat(elmnt.firstChild.firstChild.getAttribute('x2')))+"px";
					}else {
	    				transposition(objActif,py);
	    			}
	    		}
	    		var _type56=tableObjet[objActif].type;
	    		if(tableObjet[objActif].class==3 && (_type56==1 || _type56==2 || _type56==3 || _type56==21 || _type56==22 || _type56==23 || _type56==24 || _type56==25 || _type56==26 || _type56==27 || _type56==28 || _type56==56 || _type56==57 || _type56==58 || _type56==59 || _type56==84 || _type56==63 || _type56==64 || _type56==65 || _type56==66 || _type56==67 || _type56==68)){
	    			tableObjet[objActif].posX=parseFloat(tableObjet[objActif].posX)-pos1;
	    			tableObjet[objActif].posY=parseFloat(tableObjet[objActif].posY)-pos2;
	    			redrawArpege(objActif);
	    		}else{
	    		position(px);
	    		tableObjet[objActif].posX=px;
	    		tableObjet[objActif].posY=py;
	    		tableObjet[objActif].basePosY=py*(1/ratioSpaceHeight);
	    		}
	    	}else if (elmnt.id.substring(0,2)=="fx"){
				var px=elmnt.offsetLeft - pos1;
				var py=elmnt.offsetTop - pos2;	
	
				if(px<0){
					px=0;
				}
				if(px>200){
					px=200;
				}
				if (elmnt.id.substring(0,3)=="fx0"){
					px=0;
				}
				if(parseInt(elmnt.id.substring(2,3))>0){
					var point=elmnt.id.substring(2,3)-1;
					if(px<parseFloat(document.getElementById("fx"+point+elmnt.id.substring(3,4)).style.left)){
						px=parseFloat(document.getElementById("fx"+point+elmnt.id.substring(3,4)).style.left)+4;
					}
				}
				if(py<0){
					py=0;
				}
				if(py>60){
					py=60;
				}
				
				
				var rw=tableObjet[objActif].fin-tableObjet[objActif].debut;
				var nduree=tableObjet[objActif].duree/tableObjet[objActif].transposition;
				var relative=nduree*rw;
				var inp=elmnt.parentNode.id;
				var rp=document.getElementById("Y"+inp).max-((document.getElementById("Y"+inp).max-document.getElementById("Y"+inp).min))*(py/60);
				var nbv=document.getElementById("Y"+inp).step.toString().split(".");
				
				if(nbv.length>1){
					document.getElementById("Y"+inp).value=parseFloat(rp).toFixed(nbv[1].length);
				}else{
					document.getElementById("Y"+inp).value=parseInt(rp);
				}
				document.getElementById("X"+inp).value=((px/200)*relative).toFixed(2);
				elmnt.title=elmnt.id+":"+document.getElementById("Y"+inp).value;
				elmnt.style.top = py+'px';
				elmnt.style.left = px+'px';
				
				updateFxAutomation(elmnt);
	    	}else if (elmnt.id.substring(0,5)=="butta"){
	    		var pp=elmnt.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
	    		var w=parseInt(elmnt.style.height);
	    		var r=(w-(pos4-elmnt.offsetTop-parseInt(pp.style.top)-elmnt.parentNode.offsetTop))*(w/100);
	    		var rt=2.70*r;
	    		if(rt<0){
	    			rt=0;
	    			r=0;
	    		}
	    		if(rt>270){
	    			rt=270;
	    			r=100;
	    		}
	    		var doc=document.getElementById("inp"+elmnt.id.substring(5));
				var mx=parseFloat(doc.min)+(parseFloat(doc.max)-parseFloat(doc.min))*(r/99);
				if(mx<doc.min){
					mx=doc.min;
				}
				if(mx>doc.max){
					mx=doc.max;
				}
				var nbv=doc.step.toString().split(".");
				if(nbv.length>1){
					doc.value=parseFloat(mx).toFixed(nbv[1].length);
				}else{
					doc.value=parseInt(mx);
				}
	    		elmnt.firstChild.firstChild.firstChild.nextSibling.setAttribute('transform','rotate('+rt+' 22 22)');
	    		var cx=22;
	    		var cy=22;
	    		var rx=24;
	    		var ry=24;
	    		var t1=2.4;
	    		var Δ= rt*(π/180);
	    		var φ= 0;
	    		var arc=f_svg_ellipse_arc([cx,cy],[rx,ry], [t1, Δ], φ );
	    		elmnt.firstChild.firstChild.firstChild.setAttribute('d',arc.getAttribute('d'));
	    	}else if (elmnt.id.substring(0,5)=="slide"){
	    		var pp=elmnt.firstChild.firstChild;
	    		var p=parseInt(elmnt.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style.top);
	    		var w=parseInt(pp.getAttribute('height'));
	    		var r=((pos4+50-p-elmnt.offsetTop-elmnt.parentNode.offsetTop)-w)*(w/100);

	    		if(r<0){
	    			r=0;
	    		}
	    		if(r>100){
	    			r=100;
	    		}
	    		var doc=document.getElementById("inp"+elmnt.id.substring(6));
				var mx=doc.max-((parseFloat(doc.max)-parseFloat(doc.min))*(r/w));
				if(mx<doc.min){
					mx=doc.min;
				}
				if(mx>doc.max){
					mx=doc.max;
				}
				var nbv=doc.step.toString().split(".");
				if(nbv.length>1){
					doc.value=parseFloat(mx).toFixed(nbv[1].length);
				}else{
					doc.value=parseInt(mx);
				}
				
	    		elmnt.firstChild.firstChild.nextSibling.setAttribute("y",r+3);
	    		elmnt.firstChild.firstChild.nextSibling.nextSibling.setAttribute("cy",r+10);
	    		elmnt.firstChild.firstChild.nextSibling.nextSibling.nextSibling.setAttribute("y",r+14);
	    		elmnt.firstChild.firstChild.nextSibling.nextSibling.nextSibling.setAttribute("height",100-r);
	    	}else if(elmnt.id=="barVerticale"){
	    			elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
	    			barverticTime=defTempoAtPos(elmnt.offsetLeft - pos1)-1;
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
			    		var actif=elmnt.id.substring(5);
			    		elmnt.style.top = py + "px";
			    		elmnt.style.left = px + "px";
			    		
			    		var basey1=reservTop1;
			    		orig.style.width=(px-parseFloat(orig.style.left))+"px";
			    		
			    		orig.firstChild.setAttribute('width',parseFloat(orig.style.width));
			    	 
			    		if(py>basey1){
			    			orig.style.height=Math.abs(py-reservTop1)+"px";
			    			orig.firstChild.setAttribute('height',parseFloat(orig.style.height));
				    		orig.firstChild.firstChild.setAttribute('x1',0);
				    		orig.firstChild.firstChild.setAttribute('y1',0);
				    		orig.firstChild.firstChild.setAttribute('x2',parseFloat(orig.style.width));
				    		orig.firstChild.firstChild.setAttribute('y2',parseFloat(orig.style.height));
				    		
				    		tableObjet[actif].x1=0;
				    		tableObjet[actif].y1=0;
				    		tableObjet[actif].x2=parseFloat(orig.style.width);
				    		tableObjet[actif].y2=parseFloat(orig.style.height);
				    		
			    		}else{
			    			orig.style.top=py+"px";
			    			orig.style.height=Y1+Math.abs(py-reservTop1)+"px";
			    			orig.firstChild.setAttribute('height',parseFloat(orig.style.height));
			    			orig.firstChild.firstChild.setAttribute('x1',0);
				    		orig.firstChild.firstChild.setAttribute('y1',parseFloat(orig.style.height));
				    		orig.firstChild.firstChild.setAttribute('x2',parseFloat(orig.style.width));
				    		orig.firstChild.firstChild.setAttribute('y2',0);

				    		tableObjet[actif].posY=py;
				    		tableObjet[actif].x1=0;
				    		tableObjet[actif].y1=parseFloat(orig.style.height);
				    		tableObjet[actif].x2=parseFloat(orig.style.width);
				    		tableObjet[actif].y2=0;

				    		objActif=actif;

			    		}
				    		tableObjet[actif].width=parseFloat(orig.style.width);
				    		tableObjet[actif].height=parseFloat(orig.style.height);
				    		tableObjet[actif].bkgWidth=parseFloat(orig.style.width);
				    		tableObjet[actif].bkgHeight=parseFloat(orig.style.height);
			    		}else if(elmnt.id.substring(0,2)=="p2"){
				var px=(elmnt.offsetLeft - pos1);
				var py=(elmnt.offsetTop - pos2);
				if(py<1){ py=0; }
				if(py>714){ py=714; }
				if(px<1){ px=0; }
				elmnt.style.top = py + "px";
				elmnt.style.left = px + "px";
				smarpegeP2(elmnt,px,py);
			}else if(elmnt.id.substring(0,2)=="p1"){
				var px=(elmnt.offsetLeft - pos1);
				var py=(elmnt.offsetTop - pos2);
				if(py<1){ py=0; }
				if(py>714){ py=714; }
				if(px<1){ px=0; }
				elmnt.style.top = py + "px";
				elmnt.style.left = px + "px";
				smarpegeP1(elmnt,px,py);
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

				    		smarpege(elmnt,px,py);
							}else if(elmnt.id.substring(0,3)=="tmp"){
				    			var px=(elmnt.offsetLeft - pos1);
					    		var py=(elmnt.offsetTop - pos2);
					    		console.log("move elmnt",elmnt.id,px,py);
					    		if(py<0){
						 		py = 0;
						 		}
						 		if(py>100){
						 			py = 95;
						 		}
						 		if(px<0){
						 			px =0;
						 		}
						 		if(px>12960){
						 			px = 12960;
						 		}
						 		elmnt.style.top = py + "px";
						 		elmnt.style.left = px + "px";
						 		const resultat = tempoPoints.find((obj) => obj.id === elmnt.id);
console.log('resultat',tempoPoints,resultat);
						 		
						 		resultat.X=px;
						 		resultat.Y=py;
						 		elmnt.title="ts="+((px/18).toFixed(2))+" tempo="+((240-py/0.4167).toFixed(2));
						 		
						 			drawTempo();
						}else if(elmnt.id.substring(0,3)=="gna"){
				    			var px=(elmnt.offsetLeft - pos1);
					    		var py=(elmnt.offsetTop - pos2);
					    		console.log("move elmnt",elmnt.id,px,py);
					    		if(py<0){
						 		py = 0;
						 		}
						 		if(py>100){
						 			py = 95;
						 		}
						 		if(px<0){
						 			px =0;
						 		}
						 		if(px>12960){
						 			px = 12960;
						 		}
						 		elmnt.style.top = py + "px";
						 		elmnt.style.left = px + "px";
						 		const resultat = gainPoints.find((obj) => obj.id === elmnt.id);
console.log('resultat',gainPoints,resultat);
						 		
						 		resultat.X=px;
						 		resultat.Y=py;
						 		elmnt.title="ts="+((px/18).toFixed(2))+" gain="+((100-py)*0.05).toFixed(2);
						 		
						 			drawGain();
						  			
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
    	console.log("nbselect",lsgrp);
    }
   if(elmnt.id.substring(0,5)=="gliss"){
   	document.getElementById("gliss"+elmnt.id.substring(5)).style.border='0px solid red';
   }
   if(elmnt.id.substring(0,5)=="sglis"){
   	showArpegeHandles(elmnt.id.substring(5));
   }
   if(elmnt.id.substring(0,2)=="p1"){
   	showArpegeHandles(elmnt.id.substring(2));
   }
   if(elmnt.id.substring(0,2)=="p2"){
   	showArpegeHandles(elmnt.id.substring(2));
   }

   if(elmnt.id.substring(0,5)=="morph"){
   	document.getElementById("morph"+elmnt.id.substring(5)).style.border='0px solid red';
   }
   if(elmnt.id.substring(0,5)=="objet" && tableObjet[elmnt.id.substring(5)].type==11){
   	document.getElementById("gliss"+elmnt.id.substring(5)).style.border='0px solid red';
    }
	if(elmnt.id.substring(0,2)=="fx"){
   	elmnt.style.backgroundColor='#f100fa';
   	
    }
    if(elmnt.id.substring(0,3)=="tmp"){
   	elmnt.style.backgroundColor='#f5f5f5';
		defTempoFoo();
   	console.log(elmnt.id,tempoPoints);
    }
    if(elmnt.id.substring(0,3)=="gna"){
   	elmnt.style.backgroundColor='#f5f5f5';
   	console.log(elmnt.id,gainPoints);
    }
    /*
    if(selectObj.substring(0,5)=="objet"){
    	objActif=selectObj.substring(5);
    }
    */
  }
}
function drawTempo() {
	
	var txt="";
	for(i=0;i<tempoPoints.length;i++){
		 txt=txt+tempoPoints[i].X+","+tempoPoints[i].Y+" ";
	}
	var newStr = txt.substring(0, txt.length - 1);
 	document.getElementById("lineTempo").setAttribute("points",newStr);
 	
 		//document.getElementById("wtempo").firstChild.appendChild(dupnode2)
 		
 		
}
function drawGain() {
	
	var txt="";
	for(i=0;i<gainPoints.length;i++){
		 txt=txt+gainPoints[i].X+","+gainPoints[i].Y+" ";
	}
	var newStr = txt.substring(0, txt.length - 1);
 	document.getElementById("lineGain").setAttribute("points",newStr);
 	
 		//document.getElementById("wtempo").firstChild.appendChild(dupnode2)
 		
 		
}
function buildLiaisonPath(h){
	var nL=63.578052;
	var ck=-4*h/3;
	return "<path style='fill-rule:evenodd;stroke-width:0.23542766;stroke-linecap:round;stroke-linejoin:round' d='M 0,0 C "+(nL/3)+","+ck+" "+(2*nL/3)+","+ck+" "+nL+",0 C "+(2*nL/3)+","+(ck+2)+" "+(nL/3)+","+(ck+2)+" 0,0 Z' />";
}
function smarpegeP2(elmnt,px,py){
	var actif=elmnt.id.substring(2);
	var t=tableObjet[actif];
	var posX=parseFloat(t.posX), posY=parseFloat(t.posY);
	var x2=parseFloat(t.x2), y2=parseFloat(t.y2);
	var dist=Math.hypot(x2,y2)||1;
	var p2X=px+4, p2Y=py+4;
	if(t.type==26){
		var openEndX=posX+x2, openEndY=posY+y2;
		t.openH=(p2Y-openEndY)*x2/dist-(p2X-openEndX)*y2/dist;
	}else{
		var midX=posX+x2/2, midY=posY+y2/2;
		t.curveH=(p2X-midX)*y2/dist-(p2Y-midY)*x2/dist;
	}
	objActif=actif;
	redrawArpege(actif);
}
function smarpege(elmnt,px,py) {
 		var actif=elmnt.id.substring(5);
 		var posX=parseFloat(tableObjet[actif].posX);
 		var posY=parseFloat(tableObjet[actif].posY);
 		tableObjet[actif].x2=px+4-posX;
 		tableObjet[actif].y2=py+4-posY;
 		objActif=actif;
 		redrawArpege(actif);
}

function smarpegeP1(elmnt,px,py) {
 		var actif=elmnt.id.substring(2);
 		var posX=parseFloat(tableObjet[actif].posX);
 		var posY=parseFloat(tableObjet[actif].posY);
 		var x2=parseFloat(tableObjet[actif].x2);
 		var y2=parseFloat(tableObjet[actif].y2);
 		// point2 absolu reste fixe, point1 déplacé
 		var newPosX=px+4;
 		var newPosY=py+4;
 		tableObjet[actif].posX=newPosX;
 		tableObjet[actif].posY=newPosY;
 		tableObjet[actif].x2=(posX+x2)-newPosX;
 		tableObjet[actif].y2=(posY+y2)-newPosY;
 		objActif=actif;
 		redrawArpege(actif);
}

var arpegeHideTimers={};
function showArpegeHandles(actif){
	if(arpegeHideTimers[actif]){clearTimeout(arpegeHideTimers[actif]);delete arpegeHideTimers[actif];}
	var p1=document.getElementById("p1"+actif);
	var sg=document.getElementById("sglis"+actif);
	var p2=document.getElementById("p2"+actif);
	if(p1)p1.style.border='1px solid blue';
	if(sg)sg.style.border='1px solid red';
	if(p2)p2.style.border='1px solid green';
}
function startHideArpegeHandles(actif){
	if(arpegeHideTimers[actif])clearTimeout(arpegeHideTimers[actif]);
	arpegeHideTimers[actif]=setTimeout(function(){
		var p1=document.getElementById("p1"+actif);
		var sg=document.getElementById("sglis"+actif);
		var p2=document.getElementById("p2"+actif);
		if(p1)p1.style.border='none';
		if(sg)sg.style.border='none';
		if(p2)p2.style.border='none';
		delete arpegeHideTimers[actif];
	},200);
}
function redrawArpege(actif) {
 		var t=tableObjet[actif];
 		var posX=parseFloat(t.posX);
 		var posY=parseFloat(t.posY);
 		var x2=parseFloat(t.x2);
 		var y2=parseFloat(t.y2);
 		// Redessinage spécifique pour types 56-59 (symboles copie avec rotation)
 		if(t.type>=63&&t.type<=68){
 			var dist63=Math.hypot(x2,y2)||36;
 			var angle63=Math.atan2(y2,x2)*180/Math.PI;
 			var minX63=Math.min(posX,posX+x2), minY63=Math.min(posY,posY+y2);
 			var bw63=Math.abs(x2)||10, bh63=Math.abs(y2)||10;
 			var txOff63=posX-minX63, tyOff63=posY-minY63;
 			t.bkgWidth=bw63; t.bkgHeight=bh63;
 			var orig63=document.getElementById("objet"+actif);
 			orig63.style.top=minY63+"px"; orig63.style.left=minX63+"px";
 			orig63.style.width=bw63+"px"; orig63.style.height=bh63+"px";
 			orig63.firstChild.setAttribute('width',bw63); orig63.firstChild.setAttribute('height',bh63);
 			orig63.firstChild.firstChild.setAttribute("transform","translate("+txOff63+","+tyOff63+") rotate("+angle63+",0,0)");
 			var inner63="";
 			if(t.type==63){
 				inner63="<line stroke='#000000' stroke-width='0.80' fill='none' x1='0' y1='-8' x2='0' y2='8' />";
 				inner63+="<line stroke='#000000' stroke-width='0.80' fill='none' x1='0' y1='0' x2='"+dist63+"' y2='0' />";
 				inner63+="<line stroke='#000000' stroke-width='0.80' fill='none' x1='"+dist63+"' y1='-8' x2='"+dist63+"' y2='8' />";
 				inner63+="<path style='fill:#000000;stroke-width:0.50;stroke-opacity:1' d='M 1,0 L 8,-4 8,4 Z' />";
 				inner63+="<path style='fill:#000000;stroke-width:0.50;stroke-opacity:1' d='M "+(dist63-1)+",0 L "+(dist63-8)+",-4 "+(dist63-8)+",4 Z' />";
 			}else if(t.type==64){
 				inner63="<line stroke='#000000' stroke-width='0.80' fill='none' x1='8' y1='-8' x2='8' y2='8' />";
 				inner63+="<line stroke='#000000' stroke-width='0.80' fill='none' x1='0' y1='0' x2='"+dist63+"' y2='0' />";
 				inner63+="<line stroke='#000000' stroke-width='0.80' fill='none' x1='"+dist63+"' y1='-8' x2='"+dist63+"' y2='8' />";
 				inner63+="<path style='fill:#000000;stroke-width:0.50;stroke-opacity:1' d='M 7,0 L 0,-4 0,4 Z' />";
 				inner63+="<path style='fill:#000000;stroke-width:0.50;stroke-opacity:1' d='M "+dist63+",0 L "+(dist63+7)+",-4 "+(dist63+7)+",4 Z' />";
 			}else if(t.type==65){
 				var sc65=dist63/36;
 				inner63="<g transform='scale("+sc65+",1) translate(0,-14)'><line style='fill:none;stroke:#000000;stroke-width:1;stroke-opacity:1' x1='4' y1='10' x2='4' y2='28' /><line style='fill:none;stroke:#000000;stroke-width:1;stroke-opacity:1' x1='14' y1='8' x2='14' y2='26' /><line style='fill:none;stroke:#000000;stroke-width:0.80;stroke-opacity:1' x1='24' y1='4' x2='24' y2='20' /><line style='fill:none;stroke:#000000;stroke-width:0.80;stroke-opacity:1' x1='34' y1='0' x2='34' y2='20' /><line style='fill:none;stroke:#000000;stroke-width:1.40;stroke-opacity:1' x1='4' y1='28' x2='34' y2='16' /><line style='fill:none;stroke:#000000;stroke-width:1.40;stroke-opacity:1' x1='4' y1='28' x2='34' y2='20' /></g>";
 			}else if(t.type==66){
 				var sc66=dist63/36;
 				inner63="<g transform='scale("+sc66+",1) translate(0,-14)'><line style='fill:none;stroke:#000000;stroke-width:1;stroke-opacity:1' x1='4' y1='10' x2='4' y2='28' /><line style='fill:none;stroke:#000000;stroke-width:1;stroke-opacity:1' x1='14' y1='8' x2='14' y2='26' /><line style='fill:none;stroke:#000000;stroke-width:0.80;stroke-opacity:1' x1='24' y1='4' x2='24' y2='20' /><line style='fill:none;stroke:#000000;stroke-width:0.80;stroke-opacity:1' x1='34' y1='0' x2='34' y2='20' /><line style='fill:none;stroke:#000000;stroke-width:1.40;stroke-opacity:1' x1='4' y1='28' x2='34' y2='14' /><line style='fill:none;stroke:#000000;stroke-width:1.40;stroke-opacity:1' x1='4' y1='28' x2='34' y2='17' /><line style='fill:none;stroke:#000000;stroke-width:1.40;stroke-opacity:1' x1='4' y1='28' x2='34' y2='20' /></g>";
 			}else if(t.type==67){
 				var sc67=dist63/36;
 				inner63="<g transform='scale("+sc67+",1) translate(0,-10)'><line style='fill:none;stroke:#000000;stroke-width:1;stroke-opacity:1' x1='4' y1='0' x2='4' y2='18' /><line style='fill:none;stroke:#000000;stroke-width:1;stroke-opacity:1' x1='14' y1='4' x2='14' y2='16' /><line style='fill:none;stroke:#000000;stroke-width:0.80;stroke-opacity:1' x1='24' y1='8' x2='24' y2='20' /><line style='fill:none;stroke:#000000;stroke-width:0.80;stroke-opacity:1' x1='34' y1='10' x2='34' y2='20' /><line style='fill:none;stroke:#000000;stroke-width:1.40;stroke-opacity:1' x1='4' y1='14' x2='34' y2='20' /><line style='fill:none;stroke:#000000;stroke-width:1.40;stroke-opacity:1' x1='4' y1='18' x2='34' y2='20' /></g>";
 			}else if(t.type==68){
 				var sc68=dist63/36;
 				inner63="<g transform='scale("+sc68+",1) translate(0,-10)'><line style='fill:none;stroke:#000000;stroke-width:1;stroke-opacity:1' x1='4' y1='0' x2='4' y2='18' /><line style='fill:none;stroke:#000000;stroke-width:1;stroke-opacity:1' x1='14' y1='4' x2='14' y2='16' /><line style='fill:none;stroke:#000000;stroke-width:0.80;stroke-opacity:1' x1='24' y1='8' x2='24' y2='20' /><line style='fill:none;stroke:#000000;stroke-width:0.80;stroke-opacity:1' x1='34' y1='10' x2='34' y2='20' /><line style='fill:none;stroke:#000000;stroke-width:1.40;stroke-opacity:1' x1='4' y1='12' x2='34' y2='20' /><line style='fill:none;stroke:#000000;stroke-width:1.40;stroke-opacity:1' x1='4' y1='15' x2='34' y2='20' /><line style='fill:none;stroke:#000000;stroke-width:1.40;stroke-opacity:1' x1='4' y1='18' x2='34' y2='20' /></g>";
 			}
 			orig63.firstChild.firstChild.innerHTML=inner63;
 			document.getElementById("p1"+actif).style.top=(posY-4)+"px";
 			document.getElementById("p1"+actif).style.left=(posX-4)+"px";
 			document.getElementById("sglis"+actif).style.top=(posY+y2-4)+"px";
 			document.getElementById("sglis"+actif).style.left=(posX+x2-4)+"px";
 			showArpegeHandles(actif);
 			return;
 		}
 		if(t.type>=56&&t.type<=59){
 			var dist56=Math.hypot(x2,y2)||94;
 			var angle56=Math.atan2(y2,x2)*180/Math.PI;
 			var minX56=Math.min(posX,posX+x2), minY56=Math.min(posY,posY+y2);
 			var bw56=Math.abs(x2)||10, bh56=Math.abs(y2)||10;
 			var txOff56=posX-minX56, tyOff56=posY-minY56;
 			t.bkgWidth=bw56; t.bkgHeight=bh56;
 			var orig56=document.getElementById("objet"+actif);
 			orig56.style.top=minY56+"px"; orig56.style.left=minX56+"px";
 			orig56.style.width=bw56+"px"; orig56.style.height=bh56+"px";
 			orig56.firstChild.setAttribute('width',bw56); orig56.firstChild.setAttribute('height',bh56);
 			orig56.firstChild.firstChild.setAttribute("transform","translate("+txOff56+","+tyOff56+") rotate("+angle56+",0,0)");
 			var inner="<circle fill='#ffffff' stroke='#000000' fill-opacity='1' stroke-width='0.6' cx='0' cy='0' r='7' />";
 			inner+="<circle fill='#ffffff' stroke='#000000' fill-opacity='1' stroke-width='0.6' cx='"+dist56+"' cy='0' r='7' />";
 			inner+="<line stroke='#000000' stroke-width='0.6' x1='7' y1='0' x2='"+(dist56-7)+"' y2='0' />";
 			if(t.type==56||t.type==58){
 				inner+="<path style='fill:#000000;stroke-width:0.50;stroke-opacity:1' d='M "+(dist56-4)+",0 L "+(dist56-11)+",-4 "+(dist56-11)+",4 Z' />";
 			}else{
 				inner+="<path style='fill:#000000;stroke-width:0.50;stroke-opacity:1' d='M 4,0 L 11,-4 11,4 Z' />";
 			}
 			if(t.type==58||t.type==59){
 				inner+="<g transform='translate("+(dist56/2)+",-8) scale(6,6)'><path style='fill:none;stroke:#000000;stroke-width:0.1;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:3;stroke-dasharray:none;stroke-opacity:1' d='m 0.87037671,1.9635921 c -0.06468,-0.07449 -0.352828,-0.03968 -0.394197,-0.574872 0.01372,-0.70638403 0.55035799,-0.74558403 0.62098599,-0.73461103 0.590522,0.07128 0.670251,0.60724103 0.524974,1.05662603 -0.136678,0.396526 -0.545612,0.461145 -0.545612,0.461145' stroke='#000000' /><path style='fill:#000000;stroke-width:0.0500108px;stroke-opacity:1' transform='translate(0.14 0.56) rotate(-30)' d='M 0,1.8 L 0,1.8 0.4,1.5 0.4,2.2 0,1.8' /></g>";
 			}
 			orig56.firstChild.firstChild.innerHTML=inner;
 			document.getElementById("p1"+actif).style.top=(posY-4)+"px";
 			document.getElementById("p1"+actif).style.left=(posX-4)+"px";
 			document.getElementById("sglis"+actif).style.top=(posY+y2-4)+"px";
 			document.getElementById("sglis"+actif).style.left=(posX+x2-4)+"px";
 			showArpegeHandles(actif);
 			return;
 		}
 		var dist=Math.hypot(x2,y2);
 		var nb2=dist/4.9222416;
 		var naturalLength=(Math.floor(dist/5)-1)*4.9222416;
 		var scaleY=naturalLength>0?dist/naturalLength:1;
 		var angle=Math.atan2(y2,x2)*180/Math.PI-90;
 		var nb=dist;
 		var minX=Math.min(posX,posX+x2), minY=Math.min(posY,posY+y2);
 		var bw=Math.abs(x2)||10, bh=Math.abs(y2)||10;
 		var txOff=posX-minX, tyOff=posY-minY;
 		var txt="";
 		switch(t.type) {
    			case 1:
					for(i=0;i<nb2;i++){
						txt=txt+'<path d="m 2.8301032,'+(i*4.9222416)+' c 0,-0.275616 0.137821,-0.413411 0.413411,-0.413411 0.121285,0 0.216376,0.03445 0.285274,0.103346 l 3.381699,2.815326 c 0.190169,0.154358 0.285254,0.356235 0.285254,0.605657 0,0.249423 -0.2322,0.572585 -0.696598,0.9694604 -0.464399,0.396875 -0.826135,0.749644 -1.085207,1.058325 -0.413411,0.413412 -0.620117,0.866098 -0.620117,1.358059 0,0.491958 0.146074,0.910193 0.438216,1.254703 l 0.826823,0.669728 c 0.104733,0.08819 0.157096,0.1881 0.157096,0.299723 0,0.111619 -0.04341,0.21015 -0.130222,0.29559 -0.08682,0.08544 -0.181901,0.128156 -0.285256,0.128156 -0.103351,0 -0.189478,-0.03445 -0.258381,-0.103352 l -3.410651,-2.815333 c -0.190156,-0.137803 -0.285248,-0.336241 -0.285248,-0.595313 0,-0.259072 0.228759,-0.586356 0.68625,-0.981855 0.457518,-0.395499 0.85852,-0.778589 1.203034,-1.1492714 0.344514,-0.370707 0.516758,-0.797216 0.516758,-1.279525 0,-0.482309 -0.147426,-0.89572 -0.44233,-1.240234 l -0.826823,-0.669713 c -0.101971,-0.08821 -0.152982,-0.191559 -0.152982,-0.310066" />';
					}
					break;
				case 2:
					var nbSeg=Math.floor(dist/5);
					for(i=1;i<nbSeg-1;i++){
						txt=txt+'<path d="m 2.8301032,'+(i*4.9222416)+' c 0,-0.275616 0.137821,-0.413411 0.413411,-0.413411 0.121285,0 0.216376,0.03445 0.285274,0.103346 l 3.381699,2.815326 c 0.190169,0.154358 0.285254,0.356235 0.285254,0.605657 0,0.249423 -0.2322,0.572585 -0.696598,0.9694604 -0.464399,0.396875 -0.826135,0.749644 -1.085207,1.058325 -0.413411,0.413412 -0.620117,0.866098 -0.620117,1.358059 0,0.491958 0.146074,0.910193 0.438216,1.254703 l 0.826823,0.669728 c 0.104733,0.08819 0.157096,0.1881 0.157096,0.299723 0,0.111619 -0.04341,0.21015 -0.130222,0.29559 -0.08682,0.08544 -0.181901,0.128156 -0.285256,0.128156 -0.103351,0 -0.189478,-0.03445 -0.258381,-0.103352 l -3.410651,-2.815333 c -0.190156,-0.137803 -0.285248,-0.336241 -0.285248,-0.595313 0,-0.259072 0.228759,-0.586356 0.68625,-0.981855 0.457518,-0.395499 0.85852,-0.778589 1.203034,-1.1492714 0.344514,-0.370707 0.516758,-0.797216 0.516758,-1.279525 0,-0.482309 -0.147426,-0.89572 -0.44233,-1.240234 l -0.826823,-0.669713 c -0.101971,-0.08821 -0.152982,-0.191559 -0.152982,-0.310066" />';
					}
					txt=txt+'<path d="m -0.0010629,8.447791 c -0.113482,0.09554 -0.205008,0.128211 -0.274563,0.09804 -0.139145,0 -0.208699,-0.110603 -0.208699,-0.331842 0,-0.2212239 0.366119,-0.8032039 1.098324,-1.7459321 0.732238,-0.942734 1.567877,-2.192175 2.506918,-3.7482813 0.939074,-1.5561528 1.735386,-3.0054418 2.009949,-4.16691018 0,-0.060335 -0.126309,0 0,0 0,0 -0.02197,-0.060334 0,0 0.296547,1.28715688 1.130351,2.76786758 2.056605,4.26117708 0.926253,1.4932624 1.7564011,2.7112804 2.4904471,3.6540144 0.734046,0.9427282 1.101069,1.5159092 1.101069,1.7195411 0,0.203627 -0.03477,0.314242 -0.104344,0.331841 -0.06957,0.01752 -0.195871,-0.0062 -0.378924,-0.07163 0,0 -4.3303111,-2.9588331 -5.1290491,-3.3170971" />';
					break;
				case 3:
						txt=txt+'<path d="m 5,0 l 0,'+naturalLength+'"  stroke="#000000" stroke-width="1"/>';
						txt=txt+'<path d="m -0.0010629,8.447791 c -0.113482,0.09554 -0.205008,0.128211 -0.274563,0.09804 -0.139145,0 -0.208699,-0.110603 -0.208699,-0.331842 0,-0.2212239 0.366119,-0.8032039 1.098324,-1.7459321 0.732238,-0.942734 1.567877,-2.192175 2.506918,-3.7482813 0.939074,-1.5561528 1.735386,-3.0054418 2.009949,-4.16691018 0,-0.060335 -0.126309,0 0,0 0,0 -0.02197,-0.060334 0,0 0.296547,1.28715688 1.130351,2.76786758 2.056605,4.26117708 0.926253,1.4932624 1.7564011,2.7112804 2.4904471,3.6540144 0.734046,0.9427282 1.101069,1.5159092 1.101069,1.7195411 0,0.203627 -0.03477,0.314242 -0.104344,0.331841 -0.06957,0.01752 -0.195871,-0.0062 -0.378924,-0.07163 0,0 -4.3303111,-2.9588331 -5.1290491,-3.3170971" />';
					break;
				case 21:
						txt=txt+'<path d="m 2,0 l 0,'+(nb2*5)+'"  stroke="#000000" stroke-width="1"/>';
					break;
				case 22:
						txt=txt+'<path d="m 3,0 l 0,'+(nb2*5)+' M 6,0 l 0,'+(nb2*5)+'"  stroke="#000000" stroke-width="1"/>';
					break;
				case 23:
						txt=txt+'<path d="m 10,0 l 0,'+(nb2*5)+'"  stroke="#000000" stroke-width="4"/><path d="m 16,0 l 0,'+(nb2*5)+'"  stroke="#000000" stroke-width="1"/>';
					break;
				case 24:
						txt=txt+'<path d="m 16,0 l 0,'+(nb2*5)+'"  stroke="#000000" stroke-width="1"/><path d="M 22,0 l 0,'+(nb2*5)+'"  stroke="#000000" stroke-width="4"/><path d="m 28,0 l 0,'+(nb2*5)+'"  stroke="#000000" stroke-width="1"/>';
					break;
					case 25:
					txt+=buildLiaisonPath(t.curveH!==undefined?t.curveH:10);
					break;
					case 26:
					var nL26=69.68;
					var openH26r=t.openH!==undefined?t.openH:4;
					txt+="<polyline style='fill:none;stroke:#000000;stroke-width:0.864' points='0,0 "+nL26+","+-openH26r+"'/>"
						+"<polyline style='fill:none;stroke:#000000;stroke-width:0.864' points='0,0 "+nL26+","+openH26r+"'/>";
					break;
				case 27:
					var nb27=Math.max(1,Math.floor(nb/20));
					for(var i=0;i<nb27;i++){
						txt=txt+'<path d="m 14.363434,0.18913237 c 0.258693,0.013148 0.380911,0.1573854 0.366917,0.432726 -0.0062,0.1210228 -0.06372,0.2216822 -0.172436,0.3017283 L 1.6223882,9.6293854 13.608379,19.606306 c 0.100038,0.09066 0.147564,0.187649 0.142326,0.290703 -0.0053,0.103319 -0.04902,0.208654 -0.131845,0.316243 -0.08283,0.107588 -0.167575,0.15918 -0.254247,0.154775 -0.08667,-0.0044 -0.179246,-0.04381 -0.277488,-0.117689 L 0.67783617,9.8918714 c -0.1177947,-0.07486 -0.1730554,-0.181262 -0.1660585,-0.318932 0.006984,-0.137406 0.0727466,-0.237649 0.1975248,-0.300188 L 14.104858,0.22579657 c 0.0511,-0.030516 0.137289,-0.042827 0.258576,-0.036662" transform="translate(0,'+(i*20)+')"/>';
					}
					break;
				case 28:
					var nb28=Math.max(1,Math.floor(nb/14));
					for(var i=0;i<nb28;i++){
						txt=txt+'<path d="m 10.167981,15.973817 v 0.148562 c -0.02099,0.04898 -0.09601,0.07238 -0.2182617,0.07238 C 5.6722328,15.352847 2.827939,14.213761 1.4160494,12.773795 0.60102532,11.928078 0.19372322,11.257589 0.19372322,10.76238 c 0,-0.8685722 0.68758146,-1.6342943 2.06305888,-2.3047839 C 3.6323122,7.7871071 5.1569537,7.2842801 6.8307073,6.9490081 8.5044593,6.61379 10.106596,6.179477 11.63706,5.6461765 13.167578,5.1166849 14.039897,4.5375635 14.254015,3.9166492 13.083107,3.2499689 11.648446,2.7280416 9.9497193,2.3547312 9.6170768,2.2556897 9.2342253,1.882379 8.8019484,1.2385545 8.6104428,0.96809488 8.5149528,0.69377148 8.5149528,0.41950255 V 0.2709402 c 0.02624,-0.0489766 0.074504,-0.0761858 0.1437605,-0.0761858 1.4614707,0.32759902 2.6819607,0.68572668 3.6611547,1.081893 0.97956,0.3999755 1.840493,0.9790423 2.582797,1.7447641 0.860566,0.8952377 1.291058,1.6647691 1.291058,2.312403 0,0.838098 -0.663708,1.5809645 -1.991493,2.2285436 -1.327365,0.643825 -2.810138,1.1352775 -4.447532,1.470496 -1.6373932,0.335217 -3.2274082,0.754293 -4.7689445,1.2647379 -1.5418505,0.506635 -2.4696264,1.059092 -2.7836945,1.653396 1.7486764,0.891374 3.9006673,1.588528 6.4566543,2.083791 0.168419,0.02721 0.3237221,0.11428 0.4674821,0.262839 0.143759,0.152373 0.2927655,0.331408 0.4475445,0.54092 0.1547758,0.209511 0.2570887,0.339027 0.3069325,0.392357 0.1909786,0.297126 0.2869946,0.544782 0.2869946,0.742866"  transform="translate(0,'+i*14+')"/>';
					}
					break;
				case 84:
						txt=txt+'<path d="m 5,0 l 0,'+naturalLength+'"  stroke="#000000" stroke-width="1"/>';
						txt=txt+'<path d="m -0.0010629,8.447791 c -0.113482,0.09554 -0.205008,0.128211 -0.274563,0.09804 -0.139145,0 -0.208699,-0.110603 -0.208699,-0.331842 0,-0.2212239 0.366119,-0.8032039 1.098324,-1.7459321 0.732238,-0.942734 1.567877,-2.192175 2.506918,-3.7482813 0.939074,-1.5561528 1.735386,-3.0054418 2.009949,-4.16691018 0,-0.060335 -0.126309,0 0,0 0,0 -0.02197,-0.060334 0,0 0.296547,1.28715688 1.130351,2.76786758 2.056605,4.26117708 0.926253,1.4932624 1.7564011,2.7112804 2.4904471,3.6540144 0.734046,0.9427282 1.101069,1.5159092 1.101069,1.7195411 0,0.203627 -0.03477,0.314242 -0.104344,0.331841 -0.06957,0.01752 -0.195871,-0.0062 -0.378924,-0.07163 0,0 -4.3303111,-2.9588331 -5.1290491,-3.3170971" /><path d="m -0.0010629,8.447791 c -0.113482,0.09554 -0.205008,0.128211 -0.274563,0.09804 -0.139145,0 -0.208699,-0.110603 -0.208699,-0.331842 0,-0.2212239 0.366119,-0.8032039 1.098324,-1.7459321 0.732238,-0.942734 1.567877,-2.192175 2.506918,-3.7482813 0.939074,-1.5561528 1.735386,-3.0054418 2.009949,-4.16691018 0,-0.060335 -0.126309,0 0,0 0,0 -0.02197,-0.060334 0,0 0.296547,1.28715688 1.130351,2.76786758 2.056605,4.26117708 0.926253,1.4932624 1.7564011,2.7112804 2.4904471,3.6540144 0.734046,0.9427282 1.101069,1.5159092 1.101069,1.7195411 0,0.203627 -0.03477,0.314242 -0.104344,0.331841 -0.06957,0.01752 -0.195871,-0.0062 -0.378924,-0.07163 0,0 -4.3303111,-2.9588331 -5.1290491,-3.3170971"  transform="translate(10,'+naturalLength+') rotate(180 0 0)"/>';
					break;
			}
		var orig=document.getElementById("objet"+actif);
		orig.style.top=minY+"px"; orig.style.left=minX+"px";
		orig.style.width=bw+"px"; orig.style.height=bh+"px";
		orig.firstChild.setAttribute('width',bw); orig.firstChild.setAttribute('height',bh);
		orig.firstChild.firstChild.innerHTML=txt;
		var transf, tAngle, tScale;
		if(t.type==25||t.type==26){
			var naturalLengthH=t.type==25?63.578052:69.68;
			tAngle=angle+90;
			tScale=naturalLengthH>0?dist/naturalLengthH:1;
			transf="translate("+txOff+","+tyOff+") rotate("+tAngle+",0,0) scale("+tScale+",1)";
		}else{
			tAngle=angle; tScale=scaleY;
			transf="translate("+txOff+","+tyOff+") rotate("+angle+",0,0) scale(1,"+scaleY+")";
		}
		orig.firstChild.firstChild.setAttribute("transform",transf);
		t.rotate=tAngle;
		t.scaleY2=tScale;
		t.width=bw;
		t.height=bh;
		t.bkgWidth=bw;
		t.bkgHeight=bh;
		document.getElementById("p1"+actif).style.top=(posY-4)+"px";
		document.getElementById("p1"+actif).style.left=(posX-4)+"px";
		document.getElementById("sglis"+actif).style.top=(posY+y2-4)+ "px";
		document.getElementById("sglis"+actif).style.left=(posX+x2-4)+"px";
		if(t.type==25){
			var p2el=document.getElementById("p2"+actif);
			if(p2el){
				var curveH25=t.curveH!==undefined?t.curveH:10;
				var _dist25=dist||1;
				p2el.style.top=(posY+y2/2-curveH25*x2/_dist25-4)+"px";
				p2el.style.left=(posX+x2/2+curveH25*y2/_dist25-4)+"px";
			}
		}else if(t.type==26){
			var p2el26=document.getElementById("p2"+actif);
			if(p2el26){
				var openH26p=t.openH!==undefined?t.openH:4;
				var _dist26p=dist||1;
				p2el26.style.top=(posY+y2+openH26p*x2/_dist26p-4)+"px";
				p2el26.style.left=(posX+x2-openH26p*y2/_dist26p-4)+"px";
			}
		}
		showArpegeHandles(actif);
}
function updateFxAutomation(obj) {
	var liste=tableObjet[objActif].tableFxParam;
	var greffon=obj.parentNode.parentNode.parentNode.parentNode.parentNode.id;
	var index=tableObjet[objActif].tableFx.indexOf(greffon);
	var fxParam=liste[index].split("/");
	var tableLabel=listeFx[greffon].label.split(',');
	var index2=tableLabel.indexOf(obj.parentNode.id);
	var FxparamValue= fxParam[index2].split("&");
	var listPoints=obj.parentNode.getElementsByTagName('div');
	txt="<line  x1='0' y1='32' x2='200' y2='32' strocke-width='2' stroke='#43434366' />";
	for(i=1;i< listPoints.length;i++){
		txt=txt+"<line  x1="+(parseFloat(listPoints[i-1].style.left)+3)+" y1="+(parseFloat(listPoints[i-1].style.top)+3)+" x2="+parseFloat(listPoints[i].style.left)+" y2="+(parseFloat(listPoints[i].style.top)+3)+" strocke-width='2' stroke='#434343' />";
	}
	if(parseFloat(listPoints[listPoints.length-1].style.left)<200){
		txt=txt+"<line  x1="+(parseFloat(listPoints[listPoints.length-1].style.left)+3)+" y1="+(parseFloat(listPoints[listPoints.length-1].style.top)+3)+" x2='200' y2="+(parseFloat(listPoints[listPoints.length-1].style.top)+3)+" strocke-width='2' stroke='#434343' />";
	}
	var dest=obj.parentNode.getElementsByTagName('svg');
	dest[0].innerHTML=txt;
}
function drawFxAutomation(greffon) {
	var rw=tableObjet[objActif].fin-tableObjet[objActif].debut;
	var nduree=tableObjet[objActif].duree/tableObjet[objActif].transposition;
	var relative=nduree*rw;
	var txt="";
	var txt1="<line  x1='0' y1='32' x2='200' y2='32' strocke-width='2' stroke='#43434366' />";
	var index=tableObjet[objActif].tableFx.indexOf(greffon);
	var fx=tableObjet[objActif].tableFxParam[index];
	var fxParam=fx.split("/");
	var fxDefMax=listeFx[greffon].max.split(",");
	var fxDefMin=listeFx[greffon].min.split(",");
	var tableLabel=listeFx[greffon].label.split(',');
	for(i=0;i<fxParam.length;i++){
		var mx=parseFloat(fxDefMax[i])-parseFloat(fxDefMin[i]);
		var h=60-(60*(-parseFloat(fxDefMin[i])/mx));
		var npoints=fxParam[i].split("&");
		var r0;
		var t0;
		for(j=0;j<npoints.length;j++){
			if(j==0){
				var cd0=npoints[0].split("?");
				r0=(h-((60/mx)*parseFloat(cd0[1])))-4;
				t0=0;
				document.getElementById('Y'+tableLabel[i]).value=cd0[1];
			}else{
				var cd0=npoints[j-1].split("?");
				t0=cd0[0]*(200/relative);
			}
			r0=(h-((60/mx)*parseFloat(cd0[1])))-4;
			var cd=npoints[j].split("?");
			r=(h-((60/mx)*parseFloat(cd[1])))-4;
			t=cd[0]*(200/relative);
			if(j==0 && npoints.length==1){
				txt1=txt1+"<line  x1='0' y1='"+(r0+2)+"' x2='200' y2='"+(r0+2)+"' strocke-width='2' stroke='#434343' />";
			}else{
				if(j==npoints.length-1 && r<200){
					txt1=txt1+"<line  x1='"+t0+"' y1='"+(r0+2)+"' x2='"+t+"' y2='"+(r+2)+"' strocke-width='2' stroke='#434343' />";
					txt1=txt1+"<line  x1='"+t+"' y1='"+(r+2)+"' x2='200' y2='"+(r+2)+"' strocke-width='2' stroke='#434343' />";
				}else{
					txt1=txt1+"<line  x1='"+t0+"' y1='"+(r0+2)+"' x2='"+t+"' y2='"+(r+2)+"' strocke-width='2' stroke='#434343' />";
				}
			}
		//console.log("id","fx"+j+i,"j",j,'y1',r0+2,"y2",r+2)
		txt=txt+"<div id='fx"+j+i+"' style='position:absolute;top:"+r+"px;left:"+t+"px;width:5px;height:5px;background-color:#f100fa;' title='fx"+j+i+":"+cd[1]+"'></div>";
		console.log("txt",txt);
		document.getElementById(tableLabel[i]).innerHTML="";
		document.getElementById(tableLabel[i]).innerHTML="<svg>"+txt1+"</svg>"+txt;
		}
		
		txt="";
		txt1="<line  x1='0' y1='32' x2='200' y2='32' strocke-width='2' stroke='#43434366' />";
	}
	
	var tbdiv=document.getElementById(tableLabel[0]).parentNode.parentNode.parentNode.getElementsByTagName('div');
	for(i=0;i<tbdiv.length;i++){
		if(tbdiv[i].id.substring(0,2)=='fx'){
			dragElement(tbdiv[i]);
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
function defTempoAtPos(posX){
	var indx=tempoFoo.find((element) => element.X>=posX);
	var ratioT=(720/12960);
	var tempo=60/parseFloat(document.getElementById("tempo").value);
	var tmp=((posX*ratioT/zoomScale))+1;
	var mn=Math.floor(tmp/60);
	var s=Math.floor(tmp%60);
	if(mn<10){
		var smn="0"+mn;
	}else{
		var smn=mn;
	}
	if(s<10){
		var ss="0"+s;
	}else{
		var ss=s;
	}
	document.getElementById("compteurM").innerHTML = smn+" : ";
	document.getElementById("compteurS").innerHTML = ss;
	dsecondes=s;
	dminutes=mn;
	document.getElementById("tempo").value=indx.Y.toFixed(2);
	console.log("tpx",tempoPoints,posX,indx,tmp);
	return tmp;
}
function defMoveLecture(obj){
	switch(obj){
			case 1:
				var posX=parseInt(document.getElementById("barVerticale").style.left);
				break;
			case 2:
				var posX=parseInt(document.getElementById("barDebut").style.left)+40;
				break;
			case 3:
				var posX=parseInt(document.getElementById("barFin").style.left);
				break;
	}
	
	var ratioT=(720/12960);
	defTempoAtPos(posX);
	
	var tempo=60/parseFloat(document.getElementById("tempo").value);
	var tmp=posX*ratioT/zoomScale;
	/*
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
	*/
	return tmp;
}
function posxToSec(obj){
	var ratioT=(720/12960);
	var x=parseFloat(document.getElementById(obj).style.left);
	var tmp=(tmp*ratioT/zoomScale)+1;
	return tmp;
}
function secToPosx(s){
	var ratioT=12960/720;
	var tmp=s*ratioT*zoomScale;
	return tmp;
}
function defPosition(id,tmp){
	tableObjet[id].posX=tmp;
	document.getElementById(tableObjet[id].id).style.left=tmp+"px";
}
function transpoToPosY(id,tmp){
	var refViewBoxHeight=parseFloat(document.getElementById("space").style.height)/2;
	var transpo=parseFloat(document.getElementById("space").style.height)-(refViewBoxHeight*tmp);
	selectObj.posY=transpo;
	tableObjet[id].posY=transpo;
	tableObjet[id].transposition=tmp;
	document.getElementById(tableObjet[id].id).style.top=transpo+"px";
}
function voirLength() {
	if(vueDuree==0 && tableObjet[objActif].duree){
		var ratioT=(720/12960);
		var nduree=(tableObjet[objActif].fin-tableObjet[objActif].debut)*tableObjet[objActif].duree;
		nduree=nduree/tableObjet[objActif].transposition;
		if(tableObjet[objActif].convolver!="" && tableBufferIR[tableObjet[objActif].convolver].duration>nduree*tableObjet[objActif].fin){
			var localDuree=tableBufferIR[tableObjet[objActif].convolver].duration/tableObjet[objActif].transposition;
		}else{
			var localDuree=nduree;
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