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
function createGrp(nom,grp) {
	lsgrp=[].concat(grp)
	console.log(lsgrp,tableObjet,lsgrp[0],tableObjet[lsgrp[0]])
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
			minl=minl-8
			nwidth=maxl-minl+16

			mint=mint-16
			nheight=maxt-mint+16
			
	    	if(lsgrp.length>0){
	    		var dupnode=document.createElement('div');
				dupnode.setAttribute("id","grp"+nbObjets);
				dupnode.setAttribute("class","groupe");
				dupnode.setAttribute("title",nom+"-"+grp);
				dupnode.setAttribute("style","position:absolute;top:"+mint+"px;left:"+minl+"px;width:"+nwidth+"px;height:"+nheight+"px;border:1px solid black;");
				document.getElementById("space").appendChild(dupnode);
				objActif=nbObjets;
				selectObj="grp"+nbObjets;
				
    		}
    		tableObjet[objActif] = {
				bkgColor:"#ffffff",
				bkgHeight:20,
				bkgImg:"",
				bkgTrp:true,
				bkgWidth:20,
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
				height:nheight,
				id:selectObj,
				groupe:16777216,
				liste:lsgrp,
				margeG:0,
				margeH:0,
				nom:selectObj,
				objBorderC:'#008000',
				objBorderW:0,
				posX:minl-8,
				posY:mint-8,
				scaleX:1.0,
				scaleY:1.0,
				width:nwidth,
			}
			dragElement(document.getElementById(selectObj));	
			document.getElementById(selectObj).addEventListener('mouseup',selectBkgObj);
			preservSelect=[].concat(lsgrp);
    	}
    nbObjets++;
}
function augmDim() {
	document.getElementById("augmDim").style.display="block";
}
function annulAugm() {
	document.getElementById("augmDim").style.display="none";
}
function validAugmDim() {
	let copyX=0;
	let copyY=0;
	let baseX=0;
	let baseY=0;
	copySelect=[];
	if(grpSelect==1){
		copySelect=[].concat(preservSelect);
		objActif=copySelect[0];
		baseX=parseFloat(document.getElementById("grpSelect").style.left)+40;
		baseY=parseFloat(document.getElementById("grpSelect").style.top)+40;
	}else{
		copySelect=[].concat(tableObjet[objActif].liste);
		baseX=tableObjet[objActif].posX+40;
		baseY=tableObjet[objActif].posY+40;
	}
	copySelect=copySelect.sort((s1, s2) => {
   		 return tableObjet[s1].posX - tableObjet[s2].posX;
			});
	var resActif=objActif;
	var resObj=nbObjets;
	collerA(baseX,baseY);
	if(document.getElementById("aleatoire").checked==false){
		var dLine=parseFloat(document.getElementById("variaLineaire").value);
		var dVertic=parseFloat(document.getElementById("variaVertic").value)/2;
		for(let i=1;i<copySelect.length;i++){
			copyX=parseFloat(document.getElementById(tableObjet[i+resObj].id).style.left);
			copyX=copyX+((dLine*18*zoomScale)*i);
			copyY=parseFloat(document.getElementById(tableObjet[i+resObj].id).style.top);
			if(tableObjet[i+resObj].posY>tableObjet[i+resObj-1].posY){
				copyY=copyY+dVertic;
			}else{
				copyY=copyY-dVertic;
			}
			document.getElementById(tableObjet[i+resObj].id).style.top=copyY+"px";
			document.getElementById(tableObjet[i+resObj].id).style.left=copyX+"px";
		}
	}else{
		dLine=getRandomArbitrary(parseFloat(document.getElementById("augMin").value),parseFloat(document.getElementById("augMax").value));
		dVertic=getRandomArbitrary(parseFloat(document.getElementById("augMinV").value),parseFloat(document.getElementById("augMaxV").value));
		for(let i=1;i<copySelect.length;i++){
			copyX=parseFloat(document.getElementById(tableObjet[i+resObj].id).style.left);
			copyX=copyX+(dLine*i);
			copyY=parseFloat(document.getElementById(tableObjet[i+resObj].id).style.top);
			if(tableObjet[i+resObj].posY>tableObjet[i+resObj-1].posY){
				copyY=copyY+dVertic;
			}else{
				copyY=copyY-dVertic;
			}
			document.getElementById(tableObjet[i+resObj].id).style.top=copyY+"px";
			document.getElementById(tableObjet[i+resObj].id).style.left=copyX+"px";
			
		}
	}
	lsgrp=[];
	for(let i=0;i<copySelect.length;i++){
		lsgrp.push(i+resObj);
	}
	console.log(copySelect)
	createGrp("Augm/Dim",lsgrp);
	tableObjet[objActif].width=tableObjet[objActif].width+((lsgrp.length-1)*dLine)
	tableObjet[objActif].height=tableObjet[objActif].height+((lsgrp.length-1)*dVertic)
	document.getElementById("grp"+objActif).style.width=tableObjet[objActif].width+"px"
	document.getElementById("grp"+objActif).style.height=tableObjet[objActif].height+"px"
	document.getElementById("augmDim").style.display="none";
	if(grpSelect==1){
 		document.getElementById("space").removeChild(document.getElementById("grpSelect"));
 		grpSelect=0;
	}
}
function permutLineaire() {
	lsgrp=[];
	var nls=[];
	var resObj=nbObjets;
	var refId=objActif;
	copySelect=[];
	if(grpSelect==1){
		copySelect=[].concat(preservSelect);
	}else{
		copySelect=[].concat(tableObjet[objActif].liste);
	}
	var nb=copySelect.length;
	copySelect.sort(function (a, b) {
  	return tableObjet[a].posX - tableObjet[b].posX;});
	for(let i=1;i<copySelect.length;i++){
		lsgrp.push(copySelect[i]);
	}
	lsgrp.push(copySelect[0]);
	var delta=tableObjet[copySelect[1]].posX-tableObjet[copySelect[0]].posX;
	copySelect=[];
	copySelect=[].concat(lsgrp);
	collerA(tableObjet[objActif].posX+40,tableObjet[objActif].posY+40);
	
	
	var nobj=nbObjets-1;
	tableObjet[nobj].posX=tableObjet[nbObjets-2].posX+delta;
	document.getElementById(tableObjet[nobj].id).style.left=tableObjet[nobj].posX+"px";
	
	lsgrp=[];
	for(let i=0;i<copySelect.length;i++){
		lsgrp.push(copySelect[i]+resObj);
	}
	createGrp("Permutation",lsgrp);
	if(grpSelect==1){
 		document.getElementById("space").removeChild(document.getElementById("grpSelect"));
 		grpSelect=0;
	}
}
function palindrome() {
	lsgrp=[];
	var nls=[];
	var resObj=nbObjets;
	copySelect=[];
	if(grpSelect==1){
		alert("Vous devez grouper vos objets!");
	}else{
		copySelect=[].concat(tableObjet[objActif].liste);
		let refId=objActif;
		var nbc=nbObjets;
		copySelect.sort(function (a, b) {
	  	return tableObjet[a].posX - tableObjet[b].posX;});
		var nb=copySelect.length;
		for(let i=0;i<copySelect.length;i++){
			lsgrp.push(copySelect[i]);
		}
		var j=copySelect.length-2;
		for(let i=0;i<copySelect.length-1;i++){
			lsgrp.push(copySelect[j]);
			j--;
			
		}
	
		copySelect=[];
		copySelect=[].concat(lsgrp);
		
		collerA(tableObjet[objActif].posX+40,tableObjet[objActif].posY+40);
		var delta=0;
		var nobj=nbObjets-nb;
		var j=nobj-1;
		var k=nobj+1;
		for(let i=0;i<nb-1;i++){
			delta=tableObjet[nobj].posX-tableObjet[j].posX;
			tableObjet[k].posX=tableObjet[nobj].posX+delta;
			document.getElementById(tableObjet[k].id).style.left=tableObjet[k].posX+"px";
			k++;
			j--;
		}
		for(let i=nbc;i<nbc+copySelect.length;i++){
			nls.push(i);
		}
		lsgrp=[].concat(nls);
		createGrp("Palindrome",lsgrp);
		
		if(grpSelect==1){
	 		document.getElementById("space").removeChild(document.getElementById("grpSelect"));
	 		grpSelect=0;
		}
	}
}
function inclusion() {
	inclusionEtat=1;
	inclusionId=objActif;
	
	
}
function annulInclusion() {
	document.getElementById("inclusionWin").style.display="none";
	inclusionEtat=0;
}
function inclusionRet() {
	if(inclusionEtat==1){
		document.getElementById("inclusionWin").style.display="block";
	}
}
function validInclusion() {
	if(tableObjet[objActif]==1 || grpSelect==1){
		alert("Vous devez grouper vos objets!");
	}else{
		copySelect=[];
		var baseX=parseFloat(document.getElementById("variaInclusion").value);
		var lg=nbObjets;
		var tbInc=[];
		var tbAct=[];
		var nls=[];
		var refId=objActif;
		tbInc=[].concat(tableObjet[inclusionId].liste);
		tbInc.sort(function (a, b) {
	  	return tableObjet[a].posX - tableObjet[b].posX;});
		tbAct=[].concat(tableObjet[objActif].liste);
		
		tbAct.sort(function (a, b){
	  	return tableObjet[a].posX - tableObjet[b].posX;});
	
		for(let i=0;i<tbInc.length-1;i++){
			copySelect.push(tbInc[i]);
			for(let j=0;j<tbAct.length;j++){
				copySelect.push(tbAct[j]);
			}
		}
		copySelect.push(tbInc[tbInc.length-1]);
		var nbc=nbObjets;
		collerA(tableObjet[objActif].posX+baseX,tableObjet[objActif].posY+baseX);
		for(let i=lg+1;i<copySelect.length+lg;i++){
			tableObjet[i].posX=tableObjet[i-1].posX+baseX;
			document.getElementById(tableObjet[i].id).style.left=tableObjet[i].posX+"px";
		}
		document.getElementById("inclusionWin").style.display="none";
		inclusionEtat=0;
		for(let i=nbc;i<nbc+copySelect.length;i++){
			nls.push(i);
		}
		lsgrp=[].concat(nls);
		createGrp("Inclusion",lsgrp);
	}
}
function renversement() {
	preservSelect=[];
	preservSelect=[].concat(lsgrp);
	preservSelect.sort(function (a, b) {
  		return tableObjet[a].posX - tableObjet[b].posX;
	});
	lsgrp=[];
	let copyX=0;
	let copyY=0;
	let refId=objActif;
	copySelect=[].concat(preservSelect);
	
	var clientX=tableObjet[copySelect[0]].posX+218;
	var clientY=tableObjet[copySelect[0]].posX+144;
	lsgrp.push(nbObjets);																																												
	for(i=0;i<copySelect.length;i++){
		copyX=tableObjet[copySelect[0]].posX-tableObjet[copySelect[i]].posX;
		copyY=-(tableObjet[copySelect[0]].posY-tableObjet[copySelect[i]].posY);
		if(tableObjet[copySelect[i]].class==1){
			var x=clientX-copyX
			var y=clientY-copyY
			pasteObjet(copySelect[i],x,y)
			nbObjets++
			lsgrp.push(nbObjets);
		}
	}
	lsgrp.pop()
	createGrp("Renversement",lsgrp);
	if(grpSelect==1){
 		document.getElementById("space").removeChild(document.getElementById("grpSelect"));
 		grpSelect=0;
	}
}
function retrograde() {
	preservSelect=[];
	preservSelect=[].concat(lsgrp);
	preservSelect.reverse();
	lsgrp=[];
	let copyX=0;
	let copyY=0;
	let refId=objActif;
	copySelect=[].concat(preservSelect);
	var clientX=tableObjet[copySelect[0]].posX+218;
	var clientY=tableObjet[copySelect[0]].posX+144;
	lsgrp.push(nbObjets);
																																															
	for(i=0;i<copySelect.length;i++){
		if(i==0){
			copyX=0;
			copyY=0;
		}else{
			copyX=tableObjet[copySelect[i]].posX-tableObjet[copySelect[0]].posX;
			copyY=-(tableObjet[copySelect[i]].posY-tableObjet[copySelect[0]].posY);
		}
		if(tableObjet[copySelect[i]].class==1){
			var x=clientX-copyX
			var y=clientY-copyY
			pasteObjet(copySelect[i],x,y)
			nbObjets++
			lsgrp.push(nbObjets);
		}
	}
	lsgrp.pop()
	createGrp("Rétrograde",lsgrp);
	if(grpSelect==1){
 		document.getElementById("space").removeChild(document.getElementById("grpSelect"));
 		grpSelect=0;
	}
}
function renvRetro() {
	preservSelect=[];
	preservSelect=[].concat(lsgrp);
	preservSelect.reverse();
	lsgrp=[];
	let copyX=0;
	let copyY=0;
	let refId=objActif;
	copySelect=[];
	copySelect=[].concat(preservSelect);
	var clientX=tableObjet[copySelect[0]].posX+218;
	var clientY=tableObjet[copySelect[0]].posX+144;
	lsgrp.push(nbObjets);																																																	
	for(i=0;i<copySelect.length;i++){
	if(i==0){
		copyX=0;
		copyY=0;
	}else{
		copyX=tableObjet[copySelect[i]].posX-tableObjet[copySelect[0]].posX;
		copyY=(tableObjet[copySelect[i]].posY-tableObjet[copySelect[0]].posY);
	}

		if(tableObjet[copySelect[i]].class==1){
			var x=clientX-copyX
			var y=clientY-copyY
			pasteObjet(copySelect[i],x,y)
			nbObjets++
			lsgrp.push(nbObjets);
		}
	}
	lsgrp.pop()
	createGrp("Renv.Rétrograde",lsgrp);
	if(grpSelect==1){
 		document.getElementById("space").removeChild(document.getElementById("grpSelect"));
 		grpSelect=0;
	}
}