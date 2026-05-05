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



/* ******************************************* Undo / Redo *********************************************************** */
const _undoStack = [];
const _redoStack = [];
const _UNDO_MAX  = 20;

const _SNAP_PROPS = {
  color: ['objColor'],
  forme: ['type', 'bkgWidth', 'bkgHeight', 'width', 'height', 'cx', 'cy', 'r', 'rx', 'ry', 'scaleY2', 'bkgTrp',
          'cp1x', 'cp1y', 'cp2x', 'cp2y', 'crvBaseW', 'crvBaseH'],
  scale: ['posX', 'posY', 'scaleX', 'scaleY', 'bkgWidth', 'bkgHeight', 'x2', 'y2', 'x3', 'y3',
          'cp1x', 'cp1y', 'cp2x', 'cp2y', 'crvBaseW', 'crvBaseH'],
  align: ['posX', 'posY']
};

function _captureSnap(ids, type) {
  return { type, objects: ids.map(id => {
    const props = {};
    for (const p of _SNAP_PROPS[type])
      if (tableObjet[id] !== undefined && tableObjet[id][p] !== undefined) props[p] = tableObjet[id][p];
    return { id, props };
  })};
}

function _updateUndoButtons() {
  const u = document.getElementById('btnUndo');
  const r = document.getElementById('btnRedo');
  if (u) u.style.opacity = _undoStack.length > 0 ? '1' : '0.3';
  if (r) r.style.opacity = _redoStack.length > 0 ? '1' : '0.3';
}

function pushUndo(ids, type) {
  _undoStack.push(_captureSnap(ids, type));
  if (_undoStack.length > _UNDO_MAX) _undoStack.shift();
  _redoStack.length = 0;
  _updateUndoButtons();
}

function _redrawObj(id) {
  const o = tableObjet[id];
  if (o.class === 3) { redrawArpege(id); return; }
  const el = document.getElementById('objet' + id);
  if (el && el.parentNode) el.parentNode.removeChild(el);
  switch (parseInt(o.type)) {
    case 1:  graphCircle(id);       break;
    case 2:  graphCarre(id);        break;
    case 3:  graphTriangle(id);     break;
    case 4:  graphEllipse(id);      break;
    case 5:  graphRectangle(id);    break;
    case 6:  graphTriangleLong(id); break;
    case 7:  graphRondLong(id);     break;
    case 8:  graphCarreLong(id);    break;
    case 9:  graphCrescr(id);        break;
    case 10: graphLigne(id);        break;
    case 11: graphGlissando(id);
      { const p1 = document.getElementById('p1'+id); if(p1) dragElement(p1); }
      { const sg = document.getElementById('sglis'+id); if(sg) dragElement(sg); }
      break;
    case 12: graphBlock(id);        break;
    case 13: graphDecresc(id);
      dragElement(document.getElementById('pcrv1'+id));
      dragElement(document.getElementById('pcrv2'+id));
      dragElement(document.getElementById('plen'+id));
      break;
    case 14: graphDecrescb(id);
      dragElement(document.getElementById('pcrv1'+id));
      dragElement(document.getElementById('pcrv2'+id));
      dragElement(document.getElementById('plen'+id));
      break;
    case 15: graphCresc(id);
      dragElement(document.getElementById('pcrv1'+id));
      dragElement(document.getElementById('pcrv2'+id));
      dragElement(document.getElementById('plen'+id));
      break;
    case 16: graphCrescb(id);
      dragElement(document.getElementById('pcrv1'+id));
      dragElement(document.getElementById('pcrv2'+id));
      dragElement(document.getElementById('plen'+id));
      break;
    case 21: graphNuage(id);        break;
  }
  const domEl = document.getElementById(o.id);
  if (domEl) {
    dragElement(domEl);
    domEl.addEventListener('mouseup', selectBkgObj);
  }
  const domObjet = document.getElementById('objet' + id);
  if (domObjet) {
    domObjet.style.top  = o.posY + 'px';
    domObjet.style.left = o.posX + 'px';
  }
}

function _applySnap(snap) {
  const savedObj = objActif, savedSel = selectObj;
  for (const { id, props } of snap.objects) {
    Object.assign(tableObjet[id], props);
    objActif  = id;
    selectObj = tableObjet[id].id;
    if (snap.type === 'color') {
      defColorM(props.objColor);
    } else if (snap.type === 'forme' || snap.type === 'scale') {
      _redrawObj(id);
    } else if (snap.type === 'align') {
      const domAlign = document.getElementById(tableObjet[id].id);
      if (domAlign) {
        domAlign.style.top  = props.posY + 'px';
        domAlign.style.left = props.posX + 'px';
      }
    }
  }
  objActif  = savedObj;
  selectObj = savedSel;
}

function undo() {
  if (_undoStack.length === 0) return;
  const snap = _undoStack.pop();
  _redoStack.push(_captureSnap(snap.objects.map(o => o.id), snap.type));
  _applySnap(snap);
  _updateUndoButtons();
}

function redo() {
  if (_redoStack.length === 0) return;
  const snap = _redoStack.pop();
  _undoStack.push(_captureSnap(snap.objects.map(o => o.id), snap.type));
  _applySnap(snap);
  _updateUndoButtons();
}

/* ******************************************* Edition ****************************************************************** */
let copySelect=[];

function copier(){
	if(grpSelect==1){
    	if(preservSelect.length>0){
    		copySelect=[];
    		copySelect=[].concat(preservSelect);
    	}
    	document.getElementById("space").removeChild(document.getElementById("grpSelect"));
    	grpSelect=0;
   }else{
   
   	if(tableObjet[objActif].class==1 || tableObjet[objActif].class==3){
   		copySelect=[];
   		copySelect.push(objActif);
   	}
   	if(tableObjet[objActif].class==4 ){
   		copySelect=[];
   		copySelect=[].concat(tableObjet[objActif].liste);
    		copySelect.push(parseInt(objActif));
   	}
   	
   }
}
function coller(){
	collerA(coordClientX,coordClientY);
}
function collerA(clientX,clientY){
lsgrp=[];
let copyX=0;
let copyY=0;
let refId=copySelect[0];
let refObjet=nbObjets;
	for(let i=0;i<copySelect.length;i++){
		copyX=tableObjet[refId].posX-tableObjet[copySelect[i]].posX;
		copyY=tableObjet[refId].posY-tableObjet[copySelect[i]].posY;
		if(tableObjet[copySelect[i]].etat==1){
			switch(tableObjet[copySelect[i]].class) {
				case 1:
					var x=clientX-copyX;
					var y=clientY-copyY;
					pasteObjet(copySelect[i],x,y);
					nbObjets++;
					break;
				case 3:
					var x=clientX-copyX;
					var y=clientY-copyY;
					pasteSymbole(copySelect[i],x,y);
					nbObjets++;
					break;	
				case 4:
					var x=clientX-copyX;
					var y=clientY-copyY;
					pasteGrp(copySelect[i],x,y);
					tableObjet[nbObjets].liste=[];
					for(let j=0;j<tableObjet[copySelect[i]].liste.length;j++){
						tableObjet[nbObjets].liste.push(refObjet+j);
					}
					nbObjets++;
					break;
			 }
		}
	}
}
function couper(){
	if(grpSelect==1){
    	if(preservSelect.length>0){
    		for(i=0;i<preservSelect.length;i++){
    			document.getElementById("space").removeChild(document.getElementById(tableObjet[preservSelect[i]].id));
    			tableObjet[preservSelect[i]].etat=0;
    		}

    	}
    	document.getElementById("space").removeChild(document.getElementById("grpSelect"));
    	grpSelect=0;
   }else{
   
   	if(tableObjet[objActif].class==1 || tableObjet[objActif].class==3){
   		document.getElementById("space").removeChild(document.getElementById(tableObjet[objActif].id));
   		tableObjet[objActif].etat=0;
   		//copySelect=[];
   		//copySelect.push(objActif);
   	}
   	if(tableObjet[objActif].class==4){
   		for(i=0;i<tableObjet[objActif].liste.length;i++){
   			document.getElementById("space").removeChild(document.getElementById(tableObjet[tableObjet[objActif].liste[i]].id));
   			tableObjet[tableObjet[objActif].liste[i]].etat=0;
   			
   		}
   		document.getElementById("space").removeChild(document.getElementById(tableObjet[objActif].id));
   		tableObjet[objActif].etat=0;
   		//copySelect=[];
    		//copySelect=tableObjet[objActif].liste;
    		//copySelect.push(objActif);
   	}
   }
}
function grouper() {
	selectGrp();
}
function deGrouper(){
	if(tableObjet[objActif].etat==1 && false){
		document.getElementById("space").removeChild(document.getElementById(tableObjet[objActif].id));
		tableObjet[objActif].etat=0;
	   grpSelect=0;
   }else if(tableObjet[objActif].etat==1 && tableObjet[objActif].class==4 ){
   	toutDegrouper();
   }
}
function reGrouper(e){
	if(tableObjet[objActif].groupe!=16777216){
		if(tableObjet[objActif].class==1 || false ||tableObjet[tableObjet[objActif].groupe].class==4 ){
			let sgrp=[];
			objActif=tableObjet[objActif].groupe;
	console.log(tableObjet[objActif]);
			for(let i=0;i<tableObjet.length;i++){
				if(tableObjet[i].etat==1 && tableObjet[i].groupe==objActif){
					sgrp.push(i);
				}
			}
			
			if(sgrp.length>1){
		    	var minl=tableObjet[sgrp[0]].posX;
		    	var mint=tableObjet[sgrp[0]].posY;
		    	var maxl=tableObjet[sgrp[0]].posX+(tableObjet[sgrp[0]].width);
		    	var maxt=tableObjet[sgrp[0]].posY+(tableObjet[sgrp[0]].height);
		
		    	for(let i=1;i<sgrp.length;i++){
		 			if(tableObjet[sgrp[i]].posX<minl){
		 				minl=tableObjet[sgrp[i]].posX;
		 			}
		 			if(tableObjet[sgrp[i]].posY<mint){
		 				mint=tableObjet[sgrp[i]].posY;
		 			}
		 			if(tableObjet[sgrp[i]].posX+(tableObjet[sgrp[i]].width)>maxl){
		 				maxl=tableObjet[sgrp[i]].posX+(tableObjet[sgrp[i]].width);
		 			}
		 			if(tableObjet[sgrp[i]].posY+(tableObjet[sgrp[i]].height)>maxt){
		 				maxt=tableObjet[sgrp[i]].posY+(tableObjet[sgrp[i]].height);
		 			}
		    	}
		    	
	    	minl=minl-10;
	    	maxl=maxl+2;
	    	mint=mint+2;
	    	maxt=maxt+4;
			tableObjet[objActif].etat=1;
			selectObj=tableObjet[objActif].id;
			tableObjet[objActif].posX=minl;
			tableObjet[objActif].posY=mint;
			tableObjet[objActif].width=maxl-minl;
			tableObjet[objActif].height=maxt-mint;
			tableObjet[objActif].bkgWidth=maxl-minl;
			tableObjet[objActif].bkgHeight=maxt-mint;
			tableObjet[objActif].bkgTrp=true;
			//tableObjet[objActif].bkgOpacity=1;
			var st=defCadre(objActif);
			
			var dupnode=document.createElement('div');
			dupnode.setAttribute("id",selectObj);
			dupnode.setAttribute("title",selectObj);
			dupnode.setAttribute("style",st);		
			document.getElementById("space").appendChild(dupnode);
			dragElement(document.getElementById(selectObj));
			document.getElementById(selectObj).addEventListener('mouseup',selectBkgObj);
			document.getElementById(selectObj).style.zIndex=0;
			for(i=0;i<tableObjet[objActif].liste.length;i++){
				document.getElementById("objet"+tableObjet[objActif].liste[i]).style.zIndex=10;
			}
			
			}
		}
	}
}
function toutDegrouper(){
	if(tableObjet[objActif].class==4){
		for(let i=0;i<tableObjet[objActif].liste.length;i++){
			if(false ){
				var orig=tableObjet[tableObjet[objActif].liste[i]].id.substring(3);
				for(let j=0;j<tableObjet[orig].liste.length;j++){
					tableObjet[tableObjet[orig].liste[j]].groupe=orig;
				}
			}
			
		}
		for(let i=0;i<tableObjet[objActif].liste.length;i++){
			var _mid=tableObjet[objActif].liste[i];
			var _mgrp=tableObjet[_mid].groupe;
			if(tableObjet[_mid].etat==1 && (_mgrp==16777216 || tableObjet[_mgrp].class!=2)){
				tableObjet[_mid].groupe=16777216;
			}
		}
		for(let i=0;i<tableObjet[objActif].liste.length;i++){
			if(tableObjet[tableObjet[objActif].liste[i]].etat==1 && tableObjet[tableObjet[objActif].liste[i]].class==4 ){
				document.getElementById("space").removeChild(document.getElementById(tableObjet[tableObjet[objActif].liste[i]].id));
				tableObjet[tableObjet[objActif].liste[i]].etat=0;
		   }
		}
		document.getElementById("space").removeChild(document.getElementById(tableObjet[objActif].id));
		tableObjet[objActif].etat=0;
		document.getElementById("selector").style.display="none";
		if(grpSelect==1){
			document.getElementById("space").removeChild(document.getElementById("grpSelect"));
		}
	   elmnt=document.getElementById("space");
	   nselector=0;
	   grpSelect=0;	
   }
}

function defGrpColor(){
	document.getElementById("menuColorGrp").style.display="block";
	document.getElementById("menuColorGrp").click();
}

function defColorMenu(e) {
	document.getElementById("menuColorGrp").style.display="none";
	if(grpSelect==1){
		lsgrp=[];
		lsgrp=[].concat(preservSelect);
		pushUndo(lsgrp, 'color');
		for(let i=0;i<lsgrp.length;i++){
			objActif=lsgrp[i];
			selectObj="objet"+objActif;
			defColorM(document.getElementById("menuColorGrp").value);
		}
		var dc=document.getElementById("grpSelect");
		document.getElementById("space").removeChild(dc);
		grpSelect=0;
	}else if(tableObjet[objActif].class==4){
			lsgrp=[];
			lsgrp=[].concat(tableObjet[objActif].liste);
			pushUndo(lsgrp, 'color');
			var svi=objActif;
			var svo="grp"+svi;

			for(let i=0;i<lsgrp.length;i++){
				objActif=lsgrp[i];
				selectObj="objet"+objActif;
				defColorM(document.getElementById("menuColorGrp").value);
			}
			objActif=svi;
			selectObj=svo;
		}
	lsgrp=[];
}
function defColorM(color) {
	if(tableObjet[objActif].class==1){
	switch (tableObjet[objActif].type){
		case 1:
			document.getElementById(selectObj).firstChild.firstChild.setAttribute("fill",color);
			tableObjet[objActif].objColor=color;
			break;
		case 2:
			document.getElementById(selectObj).firstChild.firstChild.setAttribute("fill",color);
			tableObjet[objActif].objColor=color;
			break;
		case 3:
			document.getElementById(selectObj).firstChild.firstChild.setAttribute("fill",color);
			tableObjet[objActif].objColor=color;
			break;
		case 4:
			document.getElementById(selectObj).firstChild.firstChild.setAttribute("fill",color);
			tableObjet[objActif].objColor=color;
			break;
		case 5:
			document.getElementById(selectObj).firstChild.firstChild.setAttribute("fill",color);
			tableObjet[objActif].objColor=color;
			break;	
		case 6:
			document.querySelector("#"+selectObj).firstChild.firstChild.setAttribute("fill",color);
			tableObjet[objActif].objColor=color;
			break;
		case 7:
			var dest=document.querySelector("#"+selectObj).firstChild.firstChild;
			dest.setAttribute("fill",color);
			dest.nextSibling.setAttribute("fill",color);
			tableObjet[objActif].objColor=color;
			break;
		case 8:
			var dest=document.querySelector("#"+selectObj).firstChild.firstChild;
			dest.setAttribute("fill",color);
			dest.nextSibling.setAttribute("fill",color);
			tableObjet[objActif].objColor=color;
			break;
		case 9:
			var dest=document.querySelector("#"+selectObj).firstChild.firstChild;
			dest.setAttribute("fill",color);
			tableObjet[objActif].objColor=color;
			break;
		case 10:
			var dest=document.querySelector("#"+selectObj).firstChild.firstChild;
			tableObjet[objActif].objColor=color;
			dest.setAttribute("stroke",color);
			tableObjet[objActif].objColor=color;
			//document.querySelector("#objColor").firstChild.setAttribute("stroke",color);
			break;
		case 11:
			var dest=document.getElementById(selectObj).firstChild.firstChild;
			dest.setAttribute("stroke",color);
			tableObjet[objActif].objColor=color;
			tableObjet[objActif].objColor=color;
			document.querySelector("#objColor").firstChild.setAttribute("stroke",color);
			break;
		case 12:
			document.getElementById(selectObj).firstChild.firstChild.setAttribute("fill",color);
			tableObjet[objActif].objColor=color;
			break;
		case 13:
			var dest=document.querySelector("#"+selectObj).firstChild.firstChild;;
			dest.setAttribute("fill",color);
			tableObjet[objActif].objColor=color;
			document.querySelector("#objColor").firstChild.setAttribute("fill",color);
			break;
		case 14:
			var dest=document.querySelector("#"+selectObj).firstChild.firstChild;
			dest.setAttribute("fill",color);
			tableObjet[objActif].objColor=color;
			document.querySelector("#objColor").firstChild.setAttribute("fill",color);
			break;
		case 15:
			var dest=document.querySelector("#"+selectObj).firstChild.firstChild;
			dest.setAttribute("fill",color);
			tableObjet[objActif].objColor=color;
			document.querySelector("#objColor").firstChild.setAttribute("fill",color);
			break;
		case 16:
			var dest=document.querySelector("#"+selectObj).firstChild.firstChild;
			dest.setAttribute("fill",color);
			tableObjet[objActif].objColor=color;
			document.querySelector("#objColor").firstChild.setAttribute("fill",color);
			break;
		case 18:
			var obj=document.getElementById(selectObj).firstChild;
			for(i=0;i<obj.children.length;i++){
				obj.children[i].style.fill=color;
			}
			break;
		case 19:
			var obj=document.getElementById(selectObj).firstChild;
			for(i=0;i<obj.children.length;i++){
				obj.children[i].style.fill=color;
			}
			break;
		case 21:
			document.getElementById(selectObj).firstChild.firstChild.setAttribute("fill",color);
			tableObjet[objActif].objColor=color;
			break;
		case 23:
			document.getElementById(selectObj).style.backgroundColor=color;
			tableObjet[objActif].objColor=color;
			break;
		case 26:
			document.getElementById(selectObj).firstChild.firstChild.setAttribute("fill",color);
			document.getElementById(selectObj).firstChild.firstChild.setAttribute("stroke",color);
			tableObjet[objActif].objColor=color;
			break;
		case 27:
			document.getElementById(selectObj).firstChild.firstChild.setAttribute("fill",color);
			document.getElementById(selectObj).firstChild.firstChild.setAttribute("stroke",color);
			tableObjet[objActif].objColor=color;
			break;
		default :
			document.getElementById(selectObj).firstChild.firstChild.setAttribute("fill",color);
			document.getElementById(selectObj).firstChild.firstChild.setAttribute("stroke",color);
			tableObjet[objActif].objColor=color;
			break;
	}
	}else if(tableObjet[objActif].class!=3){
		document.getElementById(selectObj).firstChild.firstChild.setAttribute("fill",color);
		document.getElementById(selectObj).firstChild.firstChild.setAttribute("stroke",color);
		tableObjet[objActif].objColor=color;
	}
}
function defGrpForme() {
	document.getElementById("fenetreFlot").style.display="block";
}
function retObjetPaletteA(id,f) {
	if(tableObjet[id].class==1 || tableObjet[id].class==4){
			//document.getElementById("space").removeChild(document.getElementById(tableObjet[id].id))
			tableObjet[id].type=f;
			switch(parseInt(f)) {
				case 1:
					tableObjet[id].cx=tableObjet[id].posX;
					tableObjet[id].cy=tableObjet[id].posY;
					tableObjet[id].r=5;
					tableObjet[id].bkgWidth=10;
					tableObjet[id].bkgHeight=tableObjet[id].width;
					tableObjet[id].width=10;
					tableObjet[id].height=tableObjet[id].width;
					tableObjet[id].bkgTrp=false;
					var obj=document.getElementById("objet"+id);
					if(obj && obj.parentNode) obj.parentNode.removeChild(obj);
					graphCircle(id);
					
					break;
				case 2:
					tableObjet[id].bkgWidth=10;
					tableObjet[id].bkgHeight=tableObjet[id].width;
					tableObjet[id].width=10;
					tableObjet[id].height=tableObjet[id].width;
					var obj=document.getElementById("objet"+id);
					tableObjet[id].bkgTrp=false;
					if(obj && obj.parentNode) obj.parentNode.removeChild(obj);
					graphCarre(id);
					break;
				case 3:
					tableObjet[id].bkgWidth=30;
					tableObjet[id].bkgHeight=30;
					tableObjet[id].width=30;
					tableObjet[id].height=30;
					tableObjet[id].bkgTrp=false;
					var obj=document.getElementById("objet"+id);
					if(obj && obj.parentNode) obj.parentNode.removeChild(obj);
					graphTriangle(id);
					break;
				case 4:
					tableObjet[id].bkgWidth=30;
					tableObjet[id].bkgHeight=20;
					tableObjet[id].rx=10;
					tableObjet[id].ry=5;
					tableObjet[id].width=30;
					tableObjet[id].height=20;
					tableObjet[id].bkgTrp=false;
					var obj=document.getElementById("objet"+id);
					if(obj && obj.parentNode) obj.parentNode.removeChild(obj);
					graphEllipse(id);
					break;
				case 5:
					tableObjet[id].bkgWidth=20;
					tableObjet[id].bkgHeight=10;
					tableObjet[id].width=20;
					tableObjet[id].height=10;
					tableObjet[id].bkgTrp=false;
					tableObjet[id].bkgTrp=false;
					var obj=document.getElementById("objet"+id);
					if(obj && obj.parentNode) obj.parentNode.removeChild(obj);
					graphRectangle(id);
					break;
				case 6:
					tableObjet[id].bkgWidth=50;
					tableObjet[id].bkgHeight=10;
					tableObjet[id].width=50;
					tableObjet[id].height=10;
					tableObjet[id].bkgTrp=false;
					var obj=document.getElementById("objet"+id);
					if(obj && obj.parentNode) obj.parentNode.removeChild(obj);
					graphTriangleLong(id);
					break;
				case 7:
					tableObjet[id].width=30;
					tableObjet[id].height=20;
					tableObjet[id].bkgWidth=30;
					tableObjet[id].bkgHeight=20;
					tableObjet[id].r=10;
					tableObjet[id].bkgTrp=false;
					if(!tableObjet[id].scaleY2){
						tableObjet[id].scaleY2=1;
					}
					var obj=document.getElementById("objet"+id);
					if(obj && obj.parentNode) obj.parentNode.removeChild(obj);
					graphRondLong(id);
					break;	
				case 8:
					tableObjet[id].width=30;
					tableObjet[id].height=20;
					tableObjet[id].bkgWidth=30;
					tableObjet[id].bkgHeight=20;
					tableObjet[id].bkgTrp=false;
					if(!tableObjet[id].scaleY2){
						tableObjet[id].scaleY2=1;
					}
					var obj=document.getElementById("objet"+id);
					if(obj && obj.parentNode) obj.parentNode.removeChild(obj);
					graphCarreLong(id);	
					break;
				case 10:
					tableObjet[id].bkgWidth=40;
					tableObjet[id].bkgHeight=6;
					tableObjet[id].width=40;
					tableObjet[id].height=6;
					tableObjet[id].bkgTrp=false;
					var obj=document.getElementById("objet"+id);
					if(obj && obj.parentNode) obj.parentNode.removeChild(obj);
					graphLigne(id);
					break;
			}
			dragElement(document.getElementById(tableObjet[id].id));
			document.getElementById(tableObjet[id].id).addEventListener('mouseup',selectBkgObj);
	}
}
function retObjetPalette(f) {
	document.getElementById("fenetreFlot").style.display="none";
	if(grpSelect==1){
		pushUndo(lsgrp, 'forme');
		for(let i=0;i<lsgrp.length;i++){
			tableObjet[lsgrp[i]].type=f;
			retObjetPaletteA(lsgrp[i],f);
		}
	}else{
		if(tableObjet[objActif].class==1) {
			pushUndo([objActif], 'forme');
			retObjetPaletteA(objActif,f);
		}else if(tableObjet[objActif].class==4){
				let lsgrp=[];
				lsgrp=[].concat(tableObjet[objActif].liste);
				pushUndo(lsgrp, 'forme');
				var savobjActif=objActif;
				var savselectObj=selectObj;
				for(let i=0;i<lsgrp.length;i++){
					tableObjet[lsgrp[i]].type=f;
					objActif=lsgrp[i];
					selectObj="objet"+objActif;
					retObjetPaletteA(lsgrp[i],f);
					document.getElementById("objet"+lsgrp[i]).style.top=(tableObjet[lsgrp[i]].posY)+"px";
					document.getElementById("objet"+lsgrp[i]).style.left=(tableObjet[lsgrp[i]].posX)+"px";
				}
				objActif=savobjActif;
				selectObj=savselectObj;
				}
		}
		console.log(tableObjet);
}

function topAlign(){
	if(grpSelect==1){
		pushUndo(lsgrp, 'align');
		for(let i=0;i<lsgrp.length;i++){
			tableObjet[lsgrp[i]].posY=parseInt(document.getElementById("grpSelect").style.top);
			document.getElementById(tableObjet[lsgrp[i]].id).style.top=document.getElementById("grpSelect").style.top;
		}
		var dc=document.getElementById("grpSelect");
		document.getElementById("space").removeChild(dc);
		grpSelect=0;
	}else if(tableObjet[objActif].class==4 || tableObjet[objActif].class=="route"){
			lsgrp=[].concat(tableObjet[objActif].liste);
			pushUndo(lsgrp, 'align');
			for(let i=0;i<lsgrp.length;i++){
				tableObjet[lsgrp[i]].posY=parseInt(document.getElementById(selectObj).style.top);
				document.getElementById(tableObjet[lsgrp[i]].id).style.top=document.getElementById(selectObj).style.top;
			}
		}
	lsgrp=[];
}
function leftAlign(){
	if(grpSelect==1){
		pushUndo(lsgrp, 'align');
		for(let i=0;i<lsgrp.length;i++){
			tableObjet[lsgrp[i]].posX=parseInt(document.getElementById("grpSelect").style.left);
			document.getElementById(tableObjet[lsgrp[i]].id).style.left=document.getElementById("grpSelect").style.left;
		}
		var dc=document.getElementById("grpSelect");
		document.getElementById("space").removeChild(dc);
		grpSelect=0;
		}else if(tableObjet[objActif].class==4 || tableObjet[objActif].class=="route"){
			lsgrp=[].concat(tableObjet[objActif].liste);
			pushUndo(lsgrp, 'align');
			for(let i=0;i<lsgrp.length;i++){
				if(tableObjet[lsgrp[i]].class==1){
					tableObjet[lsgrp[i]].posX=parseInt(document.getElementById(selectObj).style.left);
					document.getElementById(tableObjet[lsgrp[i]].id).style.left=document.getElementById(selectObj).style.left;
				}
			}
	}
	lsgrp=[];
}
function bottomAlign(){
	var ydiff=0;
	if(grpSelect==1){
		pushUndo(lsgrp, 'align');
		for(let i=0;i<lsgrp.length;i++){
			var id=tableObjet[lsgrp[i]].id;
			var y1d=parseInt(document.getElementById("grpSelect").style.top)+parseInt(document.getElementById("grpSelect").style.height);
			var y2d=parseInt(document.getElementById(id).style.top)+parseInt(document.getElementById(id).style.height);
			ydiff=y1d-y2d;
			tableObjet[lsgrp[i]].posY=(parseInt(document.getElementById(id).style.top)+ydiff);
			document.getElementById(tableObjet[lsgrp[i]].id).style.top=tableObjet[lsgrp[i]].posY+"px";
		}
		var dc=document.getElementById("grpSelect");
		document.getElementById("space").removeChild(dc);
		grpSelect=0;
	}else if(tableObjet[objActif].class==4 || tableObjet[objActif].class=="route"){
			lsgrp=[].concat(tableObjet[objActif].liste);
			pushUndo(lsgrp, 'align');
			for(let i=0;i<lsgrp.length;i++){
				if(tableObjet[lsgrp[i]].class==1){
					var id=tableObjet[lsgrp[i]].id;
					var y1d=parseInt(document.getElementById(selectObj).style.top)+parseInt(document.getElementById(selectObj).style.height);
					var y2d=parseInt(document.getElementById(id).style.top)+parseInt(document.getElementById(id).style.height);
					ydiff=y1d-y2d;
					tableObjet[lsgrp[i]].posY=(parseInt(document.getElementById(id).style.top)+ydiff);
					document.getElementById(tableObjet[lsgrp[i]].id).style.top=tableObjet[lsgrp[i]].posY+"px";
				}
			}
	}
	lsgrp=[];
}
function rightAlign(){
	var ydiff=0;
	if(grpSelect==1){
		pushUndo(lsgrp, 'align');
		for(let i=0;i<lsgrp.length;i++){
			var id=tableObjet[lsgrp[i]].id;
			var y1d=parseInt(document.getElementById("grpSelect").style.left)+parseInt(document.getElementById("grpSelect").style.width);
			var y2d=parseInt(document.getElementById(id).style.left)+parseInt(document.getElementById(id).style.width);
			ydiff=y1d-y2d;
			tableObjet[lsgrp[i]].posX=(parseInt(document.getElementById(id).style.left)+ydiff);
			document.getElementById(tableObjet[lsgrp[i]].id).style.left=tableObjet[lsgrp[i]].posX+"px";
		}
		var dc=document.getElementById("grpSelect");
		document.getElementById("space").removeChild(dc);
		grpSelect=0;
	}else if(tableObjet[objActif].class==4 || tableObjet[objActif].class=="route"){
		lsgrp=[].concat(tableObjet[objActif].liste);
		pushUndo(lsgrp, 'align');
		for(let i=0;i<lsgrp.length;i++){
			if(tableObjet[lsgrp[i]].class==1){
				var id=tableObjet[lsgrp[i]].id;
				var y1d=parseInt(document.getElementById(selectObj).style.left)+parseInt(document.getElementById(selectObj).style.width);
				var y2d=parseInt(document.getElementById(id).style.left)+parseInt(document.getElementById(id).style.width);
				ydiff=y1d-y2d;
				tableObjet[lsgrp[i]].posX=(parseInt(document.getElementById(id).style.left)+ydiff);
				document.getElementById(tableObjet[lsgrp[i]].id).style.left=tableObjet[lsgrp[i]].posX+"px";
			}
		}
	}
	lsgrp=[];
}
function zDescendre(){
	if(tableObjet[objActif].class==1){
		if(document.getElementById(tableObjet[objActif].id).style.zIndex>0){
			document.getElementById(tableObjet[objActif].id).style.zIndex=document.getElementById(tableObjet[objActif].id).style.zIndex-1;
		}
	}else if(tableObjet[objActif].class==4){
		for(let i=0;i<tableObjet[objActif].liste.length;i++){
			document.getElementById(tableObjet[tableObjet[objActif].liste[i]].id).style.zIndex=document.getElementById(tableObjet[tableObjet[objActif].liste[i]].id).style.zIndex-1;
		}
	}
}
function zToutBas(){
	if(tableObjet[objActif].class==1){
		if(document.getElementById(tableObjet[objActif].id).style.zIndex>0){
			document.getElementById(tableObjet[objActif].id).style.zIndex=0;
		}
	}else if(tableObjet[objActif].class==4){
		for(let i=0;i<tableObjet[objActif].liste.length;i++){
			document.getElementById(tableObjet[tableObjet[objActif].liste[i]].id).style.zIndex=0;
		}
	}
}
function zMonter(){
	if(tableObjet[objActif].class==1){
		document.getElementById(tableObjet[objActif].id).style.zIndex=document.getElementById(tableObjet[objActif].id).style.zIndex+1;
	}else if(tableObjet[objActif].class==4){
		for(let i=0;i<tableObjet[objActif].liste.length;i++){
			document.getElementById(tableObjet[tableObjet[objActif].liste[i]].id).style.zIndex=document.getElementById(tableObjet[tableObjet[objActif].liste[i]].id).style.zIndex+1;
		}
	}
}
function zToutHaut(){
	if(tableObjet[objActif].class==1){
		document.getElementById(tableObjet[objActif].id).style.zIndex=5;
	}else if(tableObjet[objActif].class==4){
		for(let i=0;i<tableObjet[objActif].liste.length;i++){
			document.getElementById(tableObjet[tableObjet[objActif].liste[i]].id).style.zIndex=5;
		}
	}
}
function defScaleGrp() {
	document.getElementById("popupScaleGrpObjets").style.display="block";
}
function scaleGrpValid(){
	document.getElementById("popupScaleGrpObjets").style.display="none";
	lsgrp=[];
	if(grpSelect==1){
		lsgrp=[].concat(preservSelect);
	}else{
		lsgrp=[].concat(tableObjet[objActif].liste);
	}
	pushUndo(lsgrp, 'scale');
	if(lsgrp.length>1){
		var cl=0;
		for(let i=0;i<lsgrp.length;i++){
			if(tableObjet[lsgrp[i]].false ){
				cl=2;
				break;
			}
		}
		if (cl==0){
			var posX=tableObjet[lsgrp[0]].posX;
			var posY=tableObjet[lsgrp[0]].posY;
			for(let i=0;i<lsgrp.length;i++){
				var id=lsgrp[i];
				if(tableObjet[id].groupe=="16777216"){
					cl=0;
				}else{
					cl=tableObjet[tableObjet[id].groupe].class;
				}
				if(tableObjet[id].class==3 && cl!=2){
						var scale=parseFloat(document.getElementById("scaleGrpValue").value);
						tableObjet[id].x2=parseFloat(tableObjet[id].x2)*scale;
						tableObjet[id].y2=parseFloat(tableObjet[id].y2)*scale;
						if(tableObjet[id].x3!==undefined && tableObjet[id].x3!==""){
							tableObjet[id].x3=parseFloat(tableObjet[id].x3)*scale;
							tableObjet[id].y3=parseFloat(tableObjet[id].y3)*scale;
						}
						if(document.getElementById('scaleGrpPreserve').checked==false){
							tableObjet[lsgrp[i]].posX=((tableObjet[lsgrp[i]].posX-posX)*scale)+posX;
							tableObjet[lsgrp[i]].posY=((tableObjet[lsgrp[i]].posY-posY)*scale)+posY;
						}
						redrawArpege(id);
					}
				if(tableObjet[id].class==1 && cl!=2){
					switch(parseInt(tableObjet[id].type)) {
						case 1:
							tableObjet[id].scaleX=parseFloat(document.getElementById("scaleGrpValue").value);
							tableObjet[id].scaleY=parseFloat(document.getElementById("scaleGrpValue").value);
							tableObjet[id].bkgWidth=tableObjet[id].bkgWidth*tableObjet[id].scaleX;
							tableObjet[id].bkgHeight=tableObjet[id].bkgHeight*tableObjet[id].scaleY;
							if(document.getElementById('scaleGrpPreserve').checked==false){
								tableObjet[lsgrp[i]].posX=((tableObjet[lsgrp[i]].posX-posX)*tableObjet[id].scaleX)+posX;
								tableObjet[lsgrp[i]].posY=((tableObjet[lsgrp[i]].posY-posY)*tableObjet[id].scaleY)+posY;
								
							}
							var obj=document.getElementById("objet"+id);
							if(obj && obj.parentNode) obj.parentNode.removeChild(obj);
							graphCircle(id);
							dragElement(document.getElementById(tableObjet[id].id));
							document.getElementById(tableObjet[id].id).addEventListener('mouseup',selectBkgObj);
							break;
						case 2:
							tableObjet[id].scaleX=parseFloat(document.getElementById("scaleGrpValue").value);
							tableObjet[id].scaleY=parseFloat(document.getElementById("scaleGrpValue").value);
							tableObjet[id].bkgWidth=tableObjet[id].bkgWidth*tableObjet[id].scaleX;
							tableObjet[id].bkgHeight=tableObjet[id].bkgHeight*tableObjet[id].scaleY;
							if(document.getElementById('scaleGrpPreserve').checked==false){
								tableObjet[lsgrp[i]].posX=((tableObjet[lsgrp[i]].posX-posX)*tableObjet[id].scaleX)+posX;
								tableObjet[lsgrp[i]].posY=((tableObjet[lsgrp[i]].posY-posY)*tableObjet[id].scaleY)+posY;
							}
							var obj=document.getElementById("objet"+id);
							if(obj && obj.parentNode) obj.parentNode.removeChild(obj);
							graphCarre(id);
							dragElement(document.getElementById(tableObjet[id].id));
							document.getElementById(tableObjet[id].id).addEventListener('mouseup',selectBkgObj);
							break;
						case 3:
							tableObjet[id].scaleX=parseFloat(document.getElementById("scaleGrpValue").value);
							tableObjet[id].scaleY=parseFloat(document.getElementById("scaleGrpValue").value);
							tableObjet[id].bkgWidth=tableObjet[id].bkgWidth*tableObjet[id].scaleX;
							tableObjet[id].bkgHeight=tableObjet[id].bkgHeight*tableObjet[id].scaleY;
							if(document.getElementById('scaleGrpPreserve').checked==false){
								tableObjet[lsgrp[i]].posX=((tableObjet[lsgrp[i]].posX-posX)*tableObjet[id].scaleX)+posX;
								tableObjet[lsgrp[i]].posY=((tableObjet[lsgrp[i]].posY-posY)*tableObjet[id].scaleY)+posY;
							}
							var obj=document.getElementById("objet"+id);
							if(obj && obj.parentNode) obj.parentNode.removeChild(obj);
							graphTriangle(id);
							dragElement(document.getElementById(tableObjet[id].id));
							document.getElementById(tableObjet[id].id).addEventListener('mouseup',selectBkgObj);
							break;
						case 4:
							tableObjet[id].scaleX=parseFloat(document.getElementById("scaleGrpValue").value);
							tableObjet[id].scaleY=parseFloat(document.getElementById("scaleGrpValue").value);
							tableObjet[id].bkgWidth=tableObjet[id].bkgWidth*tableObjet[id].scaleX;
							tableObjet[id].bkgHeight=tableObjet[id].bkgHeight*tableObjet[id].scaleY;
							if(document.getElementById('scaleGrpPreserve').checked==false){
								tableObjet[lsgrp[i]].posX=((tableObjet[lsgrp[i]].posX-posX)*tableObjet[id].scaleX)+posX;
								tableObjet[lsgrp[i]].posY=((tableObjet[lsgrp[i]].posY-posY)*tableObjet[id].scaleY)+posY;
							}
							var obj=document.getElementById("objet"+id);
							if(obj && obj.parentNode) obj.parentNode.removeChild(obj);
							graphEllipse(id);
							dragElement(document.getElementById(tableObjet[id].id));
							document.getElementById(tableObjet[id].id).addEventListener('mouseup',selectBkgObj);
							break;
						case 5:
							tableObjet[id].scaleX=parseFloat(document.getElementById("scaleGrpValue").value);
							tableObjet[id].scaleY=parseFloat(document.getElementById("scaleGrpValue").value);
							tableObjet[id].bkgWidth=tableObjet[id].bkgWidth*tableObjet[id].scaleX;
							tableObjet[id].bkgHeight=tableObjet[id].bkgHeight*tableObjet[id].scaleY;
							if(document.getElementById('scaleGrpPreserve').checked==false){
								tableObjet[lsgrp[i]].posX=((tableObjet[lsgrp[i]].posX-posX)*tableObjet[id].scaleX)+posX;
								tableObjet[lsgrp[i]].posY=((tableObjet[lsgrp[i]].posY-posY)*tableObjet[id].scaleY)+posY;
							}
							var obj=document.getElementById("objet"+id);
							if(obj && obj.parentNode) obj.parentNode.removeChild(obj);
							graphRectangle(id);
							dragElement(document.getElementById(tableObjet[id].id));
							document.getElementById(tableObjet[id].id).addEventListener('mouseup',selectBkgObj);
							break;
						case 6:
							tableObjet[id].scaleX=parseFloat(document.getElementById("scaleGrpValue").value);
							tableObjet[id].scaleY=parseFloat(document.getElementById("scaleGrpValue").value);
							tableObjet[id].bkgWidth=tableObjet[id].bkgWidth*tableObjet[id].scaleX;
							tableObjet[id].bkgHeight=tableObjet[id].bkgHeight*tableObjet[id].scaleY;
							if(document.getElementById('scaleGrpPreserve').checked==false){
								tableObjet[lsgrp[i]].posX=((tableObjet[lsgrp[i]].posX-posX)*tableObjet[id].scaleX)+posX;
								tableObjet[lsgrp[i]].posY=((tableObjet[lsgrp[i]].posY-posY)*tableObjet[id].scaleY)+posY;
							}
							var obj=document.getElementById("objet"+id);
							if(obj && obj.parentNode) obj.parentNode.removeChild(obj);
							graphTriangleLong(id);
							dragElement(document.getElementById(tableObjet[id].id));
							document.getElementById(tableObjet[id].id).addEventListener('mouseup',selectBkgObj);
							break;
						case 7:
							tableObjet[id].scaleX=parseFloat(document.getElementById("scaleGrpValue").value);
							tableObjet[id].scaleY=parseFloat(document.getElementById("scaleGrpValue").value);
							tableObjet[id].bkgWidth=tableObjet[id].bkgWidth*tableObjet[id].scaleX;
							tableObjet[id].bkgHeight=tableObjet[id].bkgHeight*tableObjet[id].scaleY;
							if(document.getElementById('scaleGrpPreserve').checked==false){
								tableObjet[lsgrp[i]].posX=((tableObjet[lsgrp[i]].posX-posX)*tableObjet[id].scaleX)+posX;
								tableObjet[lsgrp[i]].posY=((tableObjet[lsgrp[i]].posY-posY)*tableObjet[id].scaleY)+posY;
							}
							var obj=document.getElementById("objet"+id);
							if(obj && obj.parentNode) obj.parentNode.removeChild(obj);
							graphRondLong(id);
							dragElement(document.getElementById(tableObjet[id].id));
							document.getElementById(tableObjet[id].id).addEventListener('mouseup',selectBkgObj);
							break;	
						case 8:
							tableObjet[id].scaleX=parseFloat(document.getElementById("scaleGrpValue").value);
							tableObjet[id].scaleY=parseFloat(document.getElementById("scaleGrpValue").value);
							tableObjet[id].bkgWidth=tableObjet[id].bkgWidth*tableObjet[id].scaleX;
							tableObjet[id].bkgHeight=tableObjet[id].bkgHeight*tableObjet[id].scaleY;
							if(document.getElementById('scaleGrpPreserve').checked==false){
								tableObjet[lsgrp[i]].posX=((tableObjet[lsgrp[i]].posX-posX)*tableObjet[id].scaleX)+posX;
								tableObjet[lsgrp[i]].posY=((tableObjet[lsgrp[i]].posY-posY)*tableObjet[id].scaleY)+posY;
							}
							var obj=document.getElementById("objet"+id);
							if(obj && obj.parentNode) obj.parentNode.removeChild(obj);
							graphCarreLong(id);
							dragElement(document.getElementById(tableObjet[id].id));
							document.getElementById(tableObjet[id].id).addEventListener('mouseup',selectBkgObj);
							break;
						case 9:
							tableObjet[id].scaleX=parseFloat(document.getElementById("scaleGrpValue").value);
							tableObjet[id].scaleY=parseFloat(document.getElementById("scaleGrpValue").value);
							tableObjet[id].bkgWidth=tableObjet[id].bkgWidth*tableObjet[id].scaleX;
							tableObjet[id].bkgHeight=tableObjet[id].bkgHeight*tableObjet[id].scaleY;
							if(document.getElementById('scaleGrpPreserve').checked==false){
								tableObjet[lsgrp[i]].posX=((tableObjet[lsgrp[i]].posX-posX)*tableObjet[id].scaleX)+posX;
								tableObjet[lsgrp[i]].posY=((tableObjet[lsgrp[i]].posY-posY)*tableObjet[id].scaleY)+posY;
							}
							var obj=document.getElementById("objet"+id);
							if(obj && obj.parentNode) obj.parentNode.removeChild(obj);
							graphCrescr(id);
							dragElement(document.getElementById(tableObjet[id].id));
							document.getElementById(tableObjet[id].id).addEventListener('mouseup',selectBkgObj);	
							break;
						case 10:
							tableObjet[id].scaleX=parseFloat(document.getElementById("scaleGrpValue").value);
							tableObjet[id].scaleY=parseFloat(document.getElementById("scaleGrpValue").value);
							tableObjet[id].bkgWidth=tableObjet[id].bkgWidth*tableObjet[id].scaleX;
							tableObjet[id].bkgHeight=tableObjet[id].bkgHeight*tableObjet[id].scaleY;
							if(document.getElementById('scaleGrpPreserve').checked==false){
								tableObjet[lsgrp[i]].posX=((tableObjet[lsgrp[i]].posX-posX)*tableObjet[id].scaleX)+posX;
								tableObjet[lsgrp[i]].posY=((tableObjet[lsgrp[i]].posY-posY)*tableObjet[id].scaleY)+posY;
							}
							var obj=document.getElementById("objet"+id);
							if(obj && obj.parentNode) obj.parentNode.removeChild(obj);
							graphLigne(id);
							dragElement(document.getElementById(tableObjet[id].id));
							document.getElementById(tableObjet[id].id).addEventListener('mouseup',selectBkgObj);
							break;
						case 12:
							tableObjet[id].scaleX=parseFloat(document.getElementById("scaleGrpValue").value);
							tableObjet[id].scaleY=parseFloat(document.getElementById("scaleGrpValue").value);
							tableObjet[id].bkgWidth=tableObjet[id].bkgWidth*tableObjet[id].scaleX;
							tableObjet[id].bkgHeight=tableObjet[id].bkgHeight*tableObjet[id].scaleY;
							if(document.getElementById('scaleGrpPreserve').checked==false){
								tableObjet[lsgrp[i]].posX=((tableObjet[lsgrp[i]].posX-posX)*tableObjet[id].scaleX)+posX;
								tableObjet[lsgrp[i]].posY=((tableObjet[lsgrp[i]].posY-posY)*tableObjet[id].scaleY)+posY;
							}
							var obj=document.getElementById("objet"+id);
							if(obj && obj.parentNode) obj.parentNode.removeChild(obj);
							graphBlock(id);
							dragElement(document.getElementById(tableObjet[id].id));
							document.getElementById(tableObjet[id].id).addEventListener('mouseup',selectBkgObj);
							break;
						case 13:
							tableObjet[id].scaleX=parseFloat(document.getElementById("scaleGrpValue").value);
							tableObjet[id].scaleY=parseFloat(document.getElementById("scaleGrpValue").value);
							tableObjet[id].bkgWidth=tableObjet[id].bkgWidth*tableObjet[id].scaleX;
							tableObjet[id].bkgHeight=tableObjet[id].bkgHeight*tableObjet[id].scaleY;
							if(document.getElementById('scaleGrpPreserve').checked==false){
								tableObjet[lsgrp[i]].posX=((tableObjet[lsgrp[i]].posX-posX)*tableObjet[id].scaleX)+posX;
								tableObjet[lsgrp[i]].posY=((tableObjet[lsgrp[i]].posY-posY)*tableObjet[id].scaleY)+posY;
							}
							var obj=document.getElementById("objet"+id);
							if(obj && obj.parentNode) obj.parentNode.removeChild(obj);
							graphDecresc(id);
							dragElement(document.getElementById(tableObjet[id].id));
							dragElement(document.getElementById('pcrv1'+id));
							dragElement(document.getElementById('pcrv2'+id));
							dragElement(document.getElementById('plen'+id));
							document.getElementById(tableObjet[id].id).addEventListener('mouseup',selectBkgObj);
							break;
						case 14:
							tableObjet[id].scaleX=parseFloat(document.getElementById("scaleGrpValue").value);
							tableObjet[id].scaleY=parseFloat(document.getElementById("scaleGrpValue").value);
							tableObjet[id].bkgWidth=tableObjet[id].bkgWidth*tableObjet[id].scaleX;
							tableObjet[id].bkgHeight=tableObjet[id].bkgHeight*tableObjet[id].scaleY;
							if(document.getElementById('scaleGrpPreserve').checked==false){
								tableObjet[lsgrp[i]].posX=((tableObjet[lsgrp[i]].posX-posX)*tableObjet[id].scaleX)+posX;
								tableObjet[lsgrp[i]].posY=((tableObjet[lsgrp[i]].posY-posY)*tableObjet[id].scaleY)+posY;
							}
							var obj=document.getElementById("objet"+id);
							if(obj && obj.parentNode) obj.parentNode.removeChild(obj);
							graphDecrescb(id);
							dragElement(document.getElementById(tableObjet[id].id));
							dragElement(document.getElementById('pcrv1'+id));
							dragElement(document.getElementById('pcrv2'+id));
							dragElement(document.getElementById('plen'+id));
							document.getElementById(tableObjet[id].id).addEventListener('mouseup',selectBkgObj);
							break;
						case 15:
							tableObjet[id].scaleX=parseFloat(document.getElementById("scaleGrpValue").value);
							tableObjet[id].scaleY=parseFloat(document.getElementById("scaleGrpValue").value);
							tableObjet[id].bkgWidth=tableObjet[id].bkgWidth*tableObjet[id].scaleX;
							tableObjet[id].bkgHeight=tableObjet[id].bkgHeight*tableObjet[id].scaleY;
							if(document.getElementById('scaleGrpPreserve').checked==false){
								tableObjet[lsgrp[i]].posX=((tableObjet[lsgrp[i]].posX-posX)*tableObjet[id].scaleX)+posX;
								tableObjet[lsgrp[i]].posY=((tableObjet[lsgrp[i]].posY-posY)*tableObjet[id].scaleY)+posY;
							}
							var obj=document.getElementById("objet"+id);
							if(obj && obj.parentNode) obj.parentNode.removeChild(obj);
							graphCresc(id);
							dragElement(document.getElementById(tableObjet[id].id));
							dragElement(document.getElementById('pcrv1'+id));
							dragElement(document.getElementById('pcrv2'+id));
							dragElement(document.getElementById('plen'+id));
							document.getElementById(tableObjet[id].id).addEventListener('mouseup',selectBkgObj);
							break;
						case 16:
							tableObjet[id].scaleX=parseFloat(document.getElementById("scaleGrpValue").value);
							tableObjet[id].scaleY=parseFloat(document.getElementById("scaleGrpValue").value);
							tableObjet[id].bkgWidth=tableObjet[id].bkgWidth*tableObjet[id].scaleX;
							tableObjet[id].bkgHeight=tableObjet[id].bkgHeight*tableObjet[id].scaleY;
							if(document.getElementById('scaleGrpPreserve').checked==false){
								tableObjet[lsgrp[i]].posX=((tableObjet[lsgrp[i]].posX-posX)*tableObjet[id].scaleX)+posX;
								tableObjet[lsgrp[i]].posY=((tableObjet[lsgrp[i]].posY-posY)*tableObjet[id].scaleY)+posY;
							}
							var obj=document.getElementById("objet"+id);
							if(obj && obj.parentNode) obj.parentNode.removeChild(obj);
							graphCrescb(id);
							dragElement(document.getElementById(tableObjet[id].id));
							dragElement(document.getElementById('pcrv1'+id));
							dragElement(document.getElementById('pcrv2'+id));
							dragElement(document.getElementById('plen'+id));
							document.getElementById(tableObjet[id].id).addEventListener('mouseup',selectBkgObj);
							break;
						case 21:
							tableObjet[id].scaleX=parseFloat(document.getElementById("scaleGrpValue").value);
							tableObjet[id].scaleY=parseFloat(document.getElementById("scaleGrpValue").value);
							tableObjet[id].bkgWidth=tableObjet[id].bkgWidth*tableObjet[id].scaleX;
							tableObjet[id].bkgHeight=tableObjet[id].bkgHeight*tableObjet[id].scaleY;
							if(document.getElementById('scaleGrpPreserve').checked==false){
								tableObjet[lsgrp[i]].posX=((tableObjet[lsgrp[i]].posX-posX)*tableObjet[id].scaleX)+posX;
								tableObjet[lsgrp[i]].posY=((tableObjet[lsgrp[i]].posY-posY)*tableObjet[id].scaleY)+posY;
							}
							var obj=document.getElementById("objet"+id);
							if(obj && obj.parentNode) obj.parentNode.removeChild(obj);
							graphNuage(id);
							dragElement(document.getElementById(tableObjet[id].id));
							document.getElementById(tableObjet[id].id).addEventListener('mouseup',selectBkgObj);
							break;
					
						}
					}
				}
			}
		}
}
function scaleGrpAnnul(){
	document.getElementById("popupScaleGrpObjets").style.display="none";
}