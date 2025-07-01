function vueImageSvg(){
	var lsgrp={};
	lsgrp=tableObjet[objActif];
	reslsgrpX=lsgrp.posX;
	reslsgrpY=lsgrp.posY;
	var txt=""
	lsgrp.posX=10;
	lsgrp.posY=10;
	document.getElementById("svgGrpVue").firstChild.innerHTML="";
	switch(lsgrp.class){
		case 1:
			txt="<g transform='translate("+lsgrp.posX+","+(lsgrp.posY)+")' >\n"
			
			txt=transformObjSvg(0,txt,lsgrp)
			
			document.getElementById("svgGrpVue").firstChild.innerHTML=txt;
			document.getElementById("svgGrpVue").firstChild.setAttribute("width",lsgrp.bkgWidth+20);
			document.getElementById("svgGrpVue").firstChild.setAttribute("height",lsgrp.bkgHeight+20);
			document.getElementById("svgGrpVue").firstChild.setAttribute("viewBox","0 0 "+(lsgrp.bkgWidth+40)+" "+(lsgrp.bkgHeight+40))

			//var obj=document.getElementById("svgGrpVue");
			//var new_window = window.open(URL.createObjectURL(new Blob([obj.innerHTML], { type: "image/svg+xml" })));
			break
		case 3:

			txt="<g transform='translate("+lsgrp.posX+","+(lsgrp.posY)+")' >\n"
			txt=transformSymbSvg(txt,lsgrp)
			document.getElementById("svgGrpVue").firstChild.innerHTML=txt;
			document.getElementById("svgGrpVue").firstChild.setAttribute("width",lsgrp.bkgWidth+200);
			document.getElementById("svgGrpVue").firstChild.setAttribute("height",lsgrp.bkgHeight+200);
			document.getElementById("svgGrpVue").firstChild.setAttribute("viewBox","0 0 "+(lsgrp.bkgWidth+400)+" "+(lsgrp.bkgHeight+400))


			break
	}
				var obj=document.getElementById("svgGrpVue");
			//var new_window = window.open(URL.createObjectURL(new Blob([obj.innerHTML], { type: "image/svg+xml" })));
			tableObjet[objActif].posX=reslsgrpX;
			tableObjet[objActif].posY=reslsgrpY;
			window.api.send("toMain", "saveSvg;"+btoa(obj.innerHTML),1)
			
}
function importSvgImage(filePath) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var rtxt=xhttp.responseText;
			document.getElementById("fichierSave").innerHTML="";
			document.getElementById("fichierSave").innerHTML = rtxt;
		}
	};
	xhttp.open("GET", filePath, false);
	xhttp.send();
}
let dataImg=''
function transformObjSvg(pdf,txt,lsgrp) {
		if(lsgrp.borderGs!="" && lsgrp.borderGw>0 && lsgrp.borderGr!="0%"){
			var radius=lsgrp.borderGr.split(" ")
			txt=txt+"<rect x='0' y='0' width='"+(lsgrp.bkgWidth)+"' height='"+(lsgrp.bkgHeight)+"' rx='"+parseFloat(radius[0])+"%' ry='"+parseFloat(radius[1])+"%' fill='"+lsgrp.bkgColor+"' stroke='"+lsgrp.borderGc+"' stroke-width='"+parseFloat(lsgrp.borderGw)+"' />\n"
		}else{
			var nopac=Math.round(parseFloat(lsgrp.bkgOpacity)*255)
			var color=lsgrp.bkgColor+ (nopac.toString(16))
			console.log('trp',lsgrp.bkgTrp)
			if(lsgrp.bkgTrp==true){
				var nc="none"
			}else{
				var nc=color
			}
			switch(lsgrp.type){
				case 7:
					var dh=lsgrp.bkgHeight;//(20*lsgrp.scaleY2)+lsgrp.margeH
					break
				case 8:
					var dh=20*lsgrp.scaleY2
					break
				default:
					var dh=lsgrp.bkgHeight
					break
			}
			txt=txt+"<rect x='0' y='0' width='"+(lsgrp.bkgWidth)+"' height='"+dh+"' fill='"+nc+"'  />\n"
			if(lsgrp.bkgImg!=""){
				if(pdf==1){
					importSvgImage(lsgrp.bkgImg)
					console.log(document.getElementById("fichierSave").getElementsByTagName('svg')[0].getAttribute('width'))
					document.getElementById("fichierSave").getElementsByTagName('svg')[0].setAttribute('width',lsgrp.bkgWidth)
					document.getElementById("fichierSave").getElementsByTagName('svg')[0].setAttribute('height',lsgrp.bkgHeight)
					txt=txt+document.getElementById("fichierSave").innerHTML
				}else{
					txt=txt+"<image x='0' y='0' width='"+lsgrp.bkgWidth+"' height='"+lsgrp.bkgHeight+"' href='file:///"+lsgrp.bkgImg+"' />\n"
				}
			}
			
			txt=txt+"<line x1='0' y1='0' x2='"+lsgrp.bkgWidth+"' y2='0' stroke='"+lsgrp.borderHc+"' stroke-width='"+lsgrp.borderHw+"' stroke-linecap='round'  />\n"
			txt=txt+"<line x1='0' y1='"+dh+"' x2='"+lsgrp.bkgWidth+"' y2='"+dh+"' stroke='"+lsgrp.borderBc+"' stroke-width='"+lsgrp.borderBw+"' stroke-linecap='round' />\n"
			txt=txt+"<line x1='0' y1='0' x2='0' y2='"+dh+"' stroke='"+lsgrp.borderGc+"' stroke-width='"+lsgrp.borderGw+"' stroke-linecap='round' />\n"
			txt=txt+"<line x1='"+lsgrp.bkgWidth+"' y1='0' x2='"+lsgrp.bkgWidth+"' y2='"+dh+"' stroke='"+lsgrp.borderDc+"' stroke-width='"+lsgrp.borderDw+"'stroke-linecap='round'  />\n"
			
		}
	
	switch(lsgrp.type){
		case 1:
			var r=lsgrp.r*lsgrp.scaleX
			txt=txt+"<circle cx='"+((lsgrp.r+parseFloat(lsgrp.margeG))*lsgrp.scaleX)+"' cy='"+((lsgrp.r+parseFloat(lsgrp.margeH))*lsgrp.scaleX)+"' r='"+(r)+"'  fill='"+lsgrp.objColor+"' stroke='"+lsgrp.objBorderC+"' stroke-width='"+parseFloat(lsgrp.objBorderW)+"' />\n"
			break
		case 2:
			txt=txt+"<rect x='"+(lsgrp.margeG*lsgrp.scaleX)+"' y='"+(lsgrp.margeH*lsgrp.scaleY)+"' width='"+(lsgrp.width*lsgrp.scaleX)+"' height='"+(lsgrp.height*lsgrp.scaleY)+"' fill='"+lsgrp.objColor+"' stroke='"+lsgrp.objBorderC+"' stroke-width='"+lsgrp.objBorderW+"' />\n"
			break
		case 3:
			txt=txt+"<polyline points='0,20 0,0 20,10 0,20' fill='"+lsgrp.objColor+"' transform='scale("+lsgrp.scaleX+","+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+")'  fill='"+lsgrp.objColor+"'stroke='"+lsgrp.objBorderC+"' stroke-width='"+lsgrp.objBorderW+"' />\n"
			break
		case 4:
			txt=txt+"<ellipse cx='"+((20+parseFloat(lsgrp.margeG))*lsgrp.scaleX)+"' cy='"+((10+lsgrp.margeH)*lsgrp.scaleY)+"' rx='"+(20*lsgrp.scaleX)+"' ry='"+(10*lsgrp.scaleY)+"' fill='"+lsgrp.objColor+"'stroke='"+lsgrp.objBorderC+"' stroke-width='"+lsgrp.objBorderW+"' />\n"
			break
		case 5:
			txt=txt+"<rect x='"+(lsgrp.margeG*lsgrp.scaleX)+"' y='"+(lsgrp.margeH*lsgrp.scaleY)+"' width='"+(lsgrp.width*lsgrp.scaleX)+"' height='"+(lsgrp.height*lsgrp.scaleY)+"' fill='"+lsgrp.objColor+"' stroke='"+lsgrp.objBorderC+"' stroke-width='"+parseFloat(lsgrp.objBorderW)+"' />\n"
			break
		case 6:
			txt=txt+"<polyline points='0,0 0,10 50,5 0,0' transform='scale("+lsgrp.scaleX+","+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+")'  fill='"+lsgrp.objColor+"' stroke='"+lsgrp.objBorderC+"' stroke-width='"+lsgrp.objBorderW+"' />\n"
			break
		case 7:
			var r=10*lsgrp.scaleY2
			var ly=(r-((10*lsgrp.scaleY)/2))+lsgrp.margeH
			var rw=(20*lsgrp.scaleX)
			txt=txt+"<circle cx='"+(r+lsgrp.margeG)+"' cy='"+(r+lsgrp.margeH)+"' r='"+r+"'  fill='"+lsgrp.objColor+"' stroke='"+lsgrp.objBorderC+"' stroke-width='"+lsgrp.objBorder+"' /><rect x='"+(r+lsgrp.margeG)+"' y='"+ly+"' width='"+(rw)+"' height='"+(10*lsgrp.scaleY)+"' fill='"+lsgrp.objColor+"' stroke='"+lsgrp.objColor+"' stroke-width='"+lsgrp.objBorderW+"' />\n"
			break
		case 8:
			var ly=((10*lsgrp.scaleY2)+lsgrp.margeH)-((10*lsgrp.scaleY)/2)
			txt=txt+"<rect x='"+(lsgrp.margeG)+"' y='"+(lsgrp.margeH)+"' width='"+(20*lsgrp.scaleY2)+"' height='"+(20*lsgrp.scaleY2)+"'  fill='"+lsgrp.objColor+"' stroke='"+lsgrp.objBorderC+"' stroke-width='"+lsgrp.objBorder+"' /><rect x='"+((10*lsgrp.scaleY2)+lsgrp.margeG)+"' y='"+ly+"' width='"+((20*lsgrp.scaleX)-(5*lsgrp.scaleY2))+"' height='"+(10*lsgrp.scaleY)+"' fill='"+lsgrp.objColor+"' stroke='"+lsgrp.objColor+"' stroke-width='"+lsgrp.objBorderW+"' />\n"
			break
		case 9:
			txt=txt+"<path d='M 0,10 0,5 50,0 50,15 0,10 Z' transform='scale("+lsgrp.scaleX+","+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+")'  fill='"+lsgrp.objColor+"' stroke='"+lsgrp.objBorderC+"' stroke-width='"+lsgrp.objBorderW+"' />\n"
			break
		case 10:
			txt=txt+"<line x1='"+(lsgrp.margeG*lsgrp.scaleX)+"'  y1='"+(lsgrp.margeH*lsgrp.scaleY)+"' x2='"+((20*lsgrp.scaleX)+lsgrp.margeG)+"' y2='"+(lsgrp.margeH*lsgrp.scaleY)+"'  fill='"+lsgrp.objColor+"' stroke='"+lsgrp.objColor+"' stroke-width='"+(lsgrp.height*lsgrp.scaleY)+"' />\n"
			break
		case 11:
			txt=txt+"<line x1='"+lsgrp.x1+"'  y1='"+lsgrp.y1+"' x2='"+lsgrp.x2+"' y2='"+lsgrp.y2+"'  fill='"+lsgrp.objColor+"' stroke='"+lsgrp.objColor+"' stroke-width='"+(1*lsgrp.scaleX)+"' />\n"
			break
		case 12:
			txt=txt+"<rect x='"+(lsgrp.margeG*lsgrp.scaleX)+"' y='"+(lsgrp.margeH*lsgrp.scaleY)+"' width='"+(10*lsgrp.scaleX)+"' height='"+(40*lsgrp.scaleY)+"' fill='"+lsgrp.objColor+"' stroke='"+lsgrp.objBorderC+"' stroke-width='"+lsgrp.objBorderW+"' />\n"
			break
		case 13:
			txt=txt+"<path d='M 0 25 Q 25 30 50 0  Q 45 30 0 40  L 0 25 Z ' transform='scale("+lsgrp.scaleX+","+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+")'  fill='"+lsgrp.objColor+"' stroke='"+lsgrp.objBorderC+"' stroke-width='"+lsgrp.objBorderW+"' />\n"
			break
		case 14:
			txt=txt+"<path d='M 0 0 Q 45 3 40 38 Q 30 10 0 7 Z '  transform='scale("+lsgrp.scaleX+","+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+")'  fill='"+lsgrp.objColor+"' stroke='"+lsgrp.objBorderC+"' stroke-width='"+lsgrp.objBorderW+"' />\n"
			break
		case 15:
			txt=txt+"<path d='M 0 35 L 0 30 Q 30 30 50 0 L 50 20  Q 40 30 0 35 Z'  transform='scale("+lsgrp.scaleX+","+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+")'  fill='"+lsgrp.objColor+"' stroke='"+lsgrp.objBorderC+"' stroke-width='"+lsgrp.objBorderW+"' />\n"
			break
		case 16:
			txt=txt+"<path d='M 0 0  Q 30 5 50 20 L 50 50  Q 40 10 0 5 Z'  transform='scale("+lsgrp.scaleX+","+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+")'  fill='"+lsgrp.objColor+"' stroke='"+lsgrp.objBorderC+"' stroke-width='"+lsgrp.objBorderW+"' />\n"
			break
		case 21:
			txt=txt+"<path d='m 0,18 c 2.563522,-4.224314 5.082396,-8.502207 9.5544,-10.436343 15.408596,-2.005519 10.194491,-4.131414 15.287035,-6.173611 15.94465,-2.511366 17.400141,2.490165 23.66551,4.997685 2.271129,3.188679 5.724476,4.406994 4.703704,13.082175 -1.620314,13.767922 -5.475164,14.575533 -8.966435,17.4919 -8.306339,2.87551 -16.042438,4.467977 -22.783564,3.821758  -6.306339,0.87551 -14.042438,2.467977 -20.783564,-10.821758 Z'  transform='scale("+lsgrp.scaleX+","+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+")' fill='"+lsgrp.objColor+"' stroke='"+lsgrp.objBorderC+"' stroke-width='"+lsgrp.objBorderW+"' />\n"
			break
		
		case 23:
			if(pdf==1){
				if(lsgrp.img.split('.')[1]=="svg"){
					console.log('marge '+lsgrp.margeH)
					importSvgImage(imgDirectory+lsgrp.img)
					txt=txt+"<g width='"+lsgrp.bkgWidth+"' height='"+lsgrp.bkgHeight+"' transform='scale("+lsgrp.scaleX+","+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" "+(lsgrp.bkgWidth/2)+" "+(lsgrp.bkgHeight/2)+")' >"
					var dest=document.getElementById("fichierSave").getElementsByTagName('svg')
					dest[0].setAttribute('width',lsgrp.bkgWidth)
					dest[0].setAttribute('height',lsgrp.bkgHeight)
					dest[0].setAttribute('y',-lsgrp.margeH)
					document.getElementById("fichierSave").innerHTML = document.getElementById("fichierSave").innerHTML.replaceAll("&nbsp;", "");
					txt=txt+document.getElementById("fichierSave").innerHTML+"</g>"
					return txt
				}else{
				
			var img = new Image();
			img.src = imgDirectory+lsgrp.img;
			var imageData = getImageDataFromImage(img); 
			 var td = "<image x='"+lsgrp.margeG+"' y='"+lsgrp.margeH+"' width='" + lsgrp.bkgWidth + "' height='" + lsgrp.bkgHeight + "'  xlink:href='" +imageData+ "' transform='scale(1,1) translate(0 0) rotate(0 125 75)'></image>\n";
				txt=txt+td
				} 
			}else{
				txt=txt+"<image x='"+lsgrp.margeG+"' y='"+(-lsgrp.margeH)+"'  width='"+lsgrp.bkgWidth+"' height='"+lsgrp.bkgHeight+"' xlink:href='file://"+imgDirectory+lsgrp.img+"' transform='scale("+lsgrp.scaleX+","+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" "+(lsgrp.bkgWidth/2)+" "+(lsgrp.bkgHeight/2)+")' />\n"
			}				
				break
		}
	
	return txt
}
function getImageDataFromImage(img) {
    // Créer un nouveau canevas
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');

    // Définir la taille du canevas comme la taille de l'image
    canvas.width = img.width;
    canvas.height = img.height;

    // Dessiner l'image sur le canevas
    ctx.drawImage(img, 0, 0);

    // Obtenir les données d'image à partir du canevas
    var imageDataUrl = canvas.toDataURL();

    return imageDataUrl;
}

function transformSymbSvg(txt,lsgrp) {
	console.log('txt',lsgrp.type)
		if(!lsgrp.scaleY2){
			lsgrp.scaleY2=1
		}
	/*	
	if(lsgrp.borderGs!="" && lsgrp.borderGw>0 && lsgrp.borderGr!="0%"){
			var radius=lsgrp.borderGr.split(" ")
			txt=txt+"<rect x='0' y='0' width='"+(lsgrp.bkgWidth)+"' height='"+(lsgrp.bkgHeight)+"' rx='"+parseFloat(radius[0])+"%' ry='"+parseFloat(radius[1])+"%' fill='"+lsgrp.bkgColor+"' stroke='"+lsgrp.borderGc+"' stroke-width='"+parseFloat(lsgrp.borderGw)+"' />\n"
			
		}else{
		*/	
			var nopac=Math.round(parseFloat(lsgrp.bkgOpacity)*255)
			var color=lsgrp.bkgColor+ (nopac.toString(16))
			if(lsgrp.bkgTrp==true){
				console.log('trpSym transparent')
				var nc="none"
			}else{
				var nc=color
			}
			switch(lsgrp.type){
				case 7:
					var dh=lsgrp.bkgHeight;//(20*lsgrp.scaleY2)+lsgrp.margeH
					break
				case 8:
					var dh=20*lsgrp.scaleY2
					break
				default:
					var dh=lsgrp.bkgHeight
					break
			}
			txt=txt+"<rect x='0' y='0' width='"+(lsgrp.bkgWidth)+"' height='"+dh+"' fill='"+nc+"'  />\n"
			
			if(lsgrp.bkgImg!=""){
				if(pdf==1){
					importSvgImage(lsgrp.bkgImg)
					console.log(document.getElementById("fichierSave").getElementsByTagName('svg')[0].getAttribute('width'))
					document.getElementById("fichierSave").getElementsByTagName('svg')[0].setAttribute('width',lsgrp.bkgWidth)
					document.getElementById("fichierSave").getElementsByTagName('svg')[0].setAttribute('height',lsgrp.bkgHeight)
					txt=txt+document.getElementById("fichierSave").innerHTML
				}else{
					txt=txt+"<image x='0' y='0' width='"+lsgrp.bkgWidth+"' height='"+lsgrp.bkgHeight+"' href='file:///"+lsgrp.bkgImg+"' />\n"
				}
			//}
			
			txt=txt+"<line x1='0' y1='0' x2='"+lsgrp.bkgWidth+"' y2='0' stroke='"+lsgrp.borderHc+"' stroke-width='"+lsgrp.borderHw+"' stroke-linecap='round'  />\n"
			txt=txt+"<line x1='0' y1='"+dh+"' x2='"+lsgrp.bkgWidth+"' y2='"+dh+"' stroke='"+lsgrp.borderBc+"' stroke-width='"+lsgrp.borderBw+"' stroke-linecap='round' />\n"
			txt=txt+"<line x1='0' y1='0' x2='0' y2='"+dh+"' stroke='"+lsgrp.borderGc+"' stroke-width='"+lsgrp.borderGw+"' stroke-linecap='round' />\n"
			txt=txt+"<line x1='"+lsgrp.bkgWidth+"' y1='0' x2='"+lsgrp.bkgWidth+"' y2='"+dh+"' stroke='"+lsgrp.borderDc+"' stroke-width='"+lsgrp.borderDw+"'stroke-linecap='round'  />\n"
			
		}
		var x1=0
    		var y1=0
    		var x2=lsgrp.width;
    		var y2=lsgrp.height;
	switch(lsgrp.type){
		case 1:
			var nb=Math.hypot(x2-x1, y2-y1)
    		var nb2=nb/4.9222416
    		txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'  >"
			for(i=0;i<nb2;i++){
				
				txt=txt+'<path d="m 2.8301032,'+(i*4.9222416)+' c 0,-0.275616 0.137821,-0.413411 0.413411,-0.413411 0.121285,0 0.216376,0.03445 0.285274,0.103346 l 3.381699,2.815326 c 0.190169,0.154358 0.285254,0.356235 0.285254,0.605657 0,0.249423 -0.2322,0.572585 -0.696598,0.9694604 -0.464399,0.396875 -0.826135,0.749644 -1.085207,1.058325 -0.413411,0.413412 -0.620117,0.866098 -0.620117,1.358059 0,0.491958 0.146074,0.910193 0.438216,1.254703 l 0.826823,0.669728 c 0.104733,0.08819 0.157096,0.1881 0.157096,0.299723 0,0.111619 -0.04341,0.21015 -0.130222,0.29559 -0.08682,0.08544 -0.181901,0.128156 -0.285256,0.128156 -0.103351,0 -0.189478,-0.03445 -0.258381,-0.103352 l -3.410651,-2.815333 c -0.190156,-0.137803 -0.285248,-0.336241 -0.285248,-0.595313 0,-0.259072 0.228759,-0.586356 0.68625,-0.981855 0.457518,-0.395499 0.85852,-0.778589 1.203034,-1.1492714 0.344514,-0.370707 0.516758,-0.797216 0.516758,-1.279525 0,-0.482309 -0.147426,-0.89572 -0.44233,-1.240234 l -0.826823,-0.669713 c -0.101971,-0.08821 -0.152982,-0.191559 -0.152982,-0.310066" />'
			}
			console.log(lsgrp.height,lsgrp,txt)
			txt=txt+"</g> "
			break
		case 2:
			var nb=Math.hypot(x2-x1, y2-y1)
    		var nb2=nb/4.9222416
    		txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'  >"
			for(i=0;i<nb2;i++){
				txt=txt+'<path d="m 2.8301032,'+(i*4.9222416)+' c 0,-0.275616 0.137821,-0.413411 0.413411,-0.413411 0.121285,0 0.216376,0.03445 0.285274,0.103346 l 3.381699,2.815326 c 0.190169,0.154358 0.285254,0.356235 0.285254,0.605657 0,0.249423 -0.2322,0.572585 -0.696598,0.9694604 -0.464399,0.396875 -0.826135,0.749644 -1.085207,1.058325 -0.413411,0.413412 -0.620117,0.866098 -0.620117,1.358059 0,0.491958 0.146074,0.910193 0.438216,1.254703 l 0.826823,0.669728 c 0.104733,0.08819 0.157096,0.1881 0.157096,0.299723 0,0.111619 -0.04341,0.21015 -0.130222,0.29559 -0.08682,0.08544 -0.181901,0.128156 -0.285256,0.128156 -0.103351,0 -0.189478,-0.03445 -0.258381,-0.103352 l -3.410651,-2.815333 c -0.190156,-0.137803 -0.285248,-0.336241 -0.285248,-0.595313 0,-0.259072 0.228759,-0.586356 0.68625,-0.981855 0.457518,-0.395499 0.85852,-0.778589 1.203034,-1.1492714 0.344514,-0.370707 0.516758,-0.797216 0.516758,-1.279525 0,-0.482309 -0.147426,-0.89572 -0.44233,-1.240234 l -0.826823,-0.669713 c -0.101971,-0.08821 -0.152982,-0.191559 -0.152982,-0.310066" />'
				txt=txt+'<path d="m -0.0010629,8.447791 c -0.113482,0.09554 -0.205008,0.128211 -0.274563,0.09804 -0.139145,0 -0.208699,-0.110603 -0.208699,-0.331842 0,-0.2212239 0.366119,-0.8032039 1.098324,-1.7459321 0.732238,-0.942734 1.567877,-2.192175 2.506918,-3.7482813 0.939074,-1.5561528 1.735386,-3.0054418 2.009949,-4.16691018 0,-0.060335 -0.126309,0 0,0 0,0 -0.02197,-0.060334 0,0 0.296547,1.28715688 1.130351,2.76786758 2.056605,4.26117708 0.926253,1.4932624 1.7564011,2.7112804 2.4904471,3.6540144 0.734046,0.9427282 1.101069,1.5159092 1.101069,1.7195411 0,0.203627 -0.03477,0.314242 -0.104344,0.331841 -0.06957,0.01752 -0.195871,-0.0062 -0.378924,-0.07163 0,0 -4.3303111,-2.9588331 -5.1290491,-3.3170971" />'
			}
			txt=txt+"</g>"
			break
		case 3:
			var nb=Math.hypot(x2-x1, y2-y1)
    		var nb2=nb/4.9222416
    		txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'  >"
			for(i=0;i<nb2;i++){
				txt=txt+'<path d="m 5,0 l 0,'+(nb2*5)+'"  stroke="#000000" stroke-width="1"/>'
				txt=txt+'<path d="m -0.0010629,8.447791 c -0.113482,0.09554 -0.205008,0.128211 -0.274563,0.09804 -0.139145,0 -0.208699,-0.110603 -0.208699,-0.331842 0,-0.2212239 0.366119,-0.8032039 1.098324,-1.7459321 0.732238,-0.942734 1.567877,-2.192175 2.506918,-3.7482813 0.939074,-1.5561528 1.735386,-3.0054418 2.009949,-4.16691018 0,-0.060335 -0.126309,0 0,0 0,0 -0.02197,-0.060334 0,0 0.296547,1.28715688 1.130351,2.76786758 2.056605,4.26117708 0.926253,1.4932624 1.7564011,2.7112804 2.4904471,3.6540144 0.734046,0.9427282 1.101069,1.5159092 1.101069,1.7195411 0,0.203627 -0.03477,0.314242 -0.104344,0.331841 -0.06957,0.01752 -0.195871,-0.0062 -0.378924,-0.07163 0,0 -4.3303111,-2.9588331 -5.1290491,-3.3170971" />'
				}
			txt=txt+"</g>"
			break
		case 4:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'  >"+glyphArtAccentDessus+"</g>"
			txt=txt+"</g>"
			break
		case 5:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'  >"+glyphArtStaccatossimo+"</g>"
			txt=txt+"</g>"
			break
		case 6:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'  >"+glyphArtTenuto+"</g>"
			txt=txt+"</g>"
			break
		case 7:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'  >"+glyphArtLoure+"</g>"
			txt=txt+"</g>"
			break
		case 8:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'  >"+glyphArtMarcato+"</g>"
			txt=txt+"</g>"
			break
		case 9:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'  >"+glyphArtStaccato+"</g>"
			txt=txt+"</g>"
			break
		case 10:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'  >"+glyphArtStaccatoPointe+"</g>"
			txt=txt+"</g>"
			break
		case 11:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'  >"+glyphArtVibration+"</g>"
			txt=txt+"</g>"
			break
		case 12:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'  >"+glyphArtMarcatoStaccato+"</g>"
			txt=txt+"</g>"
			break
		case 13:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'  >"+glyphArtInaccentue+"</g>"
			txt=txt+"</g>"
			break
		case 14:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'  >"+glyphArtVibrato+"</g>"
			txt=txt+"</g>"
			break
		case 15:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'  >"+glyphArtMarcatoTenuto+"</g>"
			txt=txt+"</g>"
			break
		case 16:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'  >"+glyphArtOuvert+"</g>"
			txt=txt+"</g>"
			break
		case 17:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'  >"+glyphArtPousser+"</g>"
			txt=txt+"</g>"
			break
		case 18:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'  >"+glyphArtTirer+"</g>"
			txt=txt+"</g>"
			break
		case 19:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'  >"+glyphBlocAccolade+"</g>"
			txt=txt+"</g>"
			break
		case 20:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'  stroke='"+lsgrp.objColor+"' stroke-width='"+lsgrp.objWidth+"'  >"+glyphBlocDroit+"</g>"
			txt=txt+"</g>"
			break
		case 21:
			var nb=Math.hypot(x2-x1, y2-y1)
    		var nb2=nb/4.9222416
    		txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'  >"
    		txt=txt+'<path d="m 2,0 l 0,'+(nb2*5)+'"  stroke="#000000" stroke-width="2"/>'
			txt=txt+"</g>"
			break
		case 22:
			var nb=Math.hypot(x2-x1, y2-y1)
    		var nb2=nb/4.9222416
    		txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'  >"
			txt=txt+'<path d="m 3,0 l 0,'+(nb2*5)+' M 6,0 l 0,'+(nb2*5)+'"  stroke="#000000" stroke-width="1"/>'
			txt=txt+"</g>"
			break
		case 23:
			var nb=Math.hypot(x2-x1, y2-y1)
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'  >"
    		var nb2=nb/4.922241
			txt=txt+'<path d="m 10,0 l 0,'+(nb2*5)+'"  stroke="#000000" stroke-width="4"/><path d="m 16,0 l 0,'+(nb2*5)+'"  stroke="#000000" stroke-width="1"/>'
			txt=txt+"</g>"
			break
		case 24:
			var nb=Math.hypot(x2-x1, y2-y1)
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'  >"
    		var nb2=nb/4.9222416
    		txt=txt+'<path d="m 16,0 l 0,'+(nb2*5)+'"  stroke="#000000" stroke-width="1"/><path d="M 22,0 l 0,'+(nb2*5)+'"  stroke="#000000" stroke-width="4"/><path d="m 28,0 l 0,'+(nb2*5)+'"  stroke="#000000" stroke-width="1"/>'
			txt=txt+"</g>"
			break
		case 25:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'   stroke='"+lsgrp.objColor+"'  >"+glyphLignesLiaison+"</g>"
			txt=txt+"</g>"
			break
		case 26:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'   stroke='"+lsgrp.objColor+"'  >"+glyphLignesCrescendo+"</g>"
			txt=txt+"</g>"
			break
		case 27:
			var nb=Math.hypot(lsgrp.x2, lsgrp.y2)
    		var nb2=nb/21
    		txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'  >"
			for(i=0;i<nb2;i++){
				txt=txt+'<path d="m 14.363434,0.18913237 c 0.258693,0.013148 0.380911,0.1573854 0.366917,0.432726 -0.0062,0.1210228 -0.06372,0.2216822 -0.172436,0.3017283 L 1.6223882,9.6293854 13.608379,19.606306 c 0.100038,0.09066 0.147564,0.187649 0.142326,0.290703 -0.0053,0.103319 -0.04902,0.208654 -0.131845,0.316243 -0.08283,0.107588 -0.167575,0.15918 -0.254247,0.154775 -0.08667,-0.0044 -0.179246,-0.04381 -0.277488,-0.117689 L 0.67783617,9.8918714 c -0.1177947,-0.07486 -0.1730554,-0.181262 -0.1660585,-0.318932 0.006984,-0.137406 0.0727466,-0.237649 0.1975248,-0.300188 L 14.104858,0.22579657 c 0.0511,-0.030516 0.137289,-0.042827 0.258576,-0.036662" transform="translate(0,'+(i*20)+')"/>'
			}
			txt=txt+"</g>"
			break
		case 28:
		var nb=Math.hypot(lsgrp.x2, lsgrp.y2)
    		var nb2=nb/14
    		txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'  >"
    		for(i=0;i<nb2;i++){
				txt=txt+'<path d="m 10.167981,15.973817 v 0.148562 c -0.02099,0.04898 -0.09601,0.07238 -0.2182617,0.07238 C 5.6722328,15.352847 2.827939,14.213761 1.4160494,12.773795 0.60102532,11.928078 0.19372322,11.257589 0.19372322,10.76238 c 0,-0.8685722 0.68758146,-1.6342943 2.06305888,-2.3047839 C 3.6323122,7.7871071 5.1569537,7.2842801 6.8307073,6.9490081 8.5044593,6.61379 10.106596,6.179477 11.63706,5.6461765 13.167578,5.1166849 14.039897,4.5375635 14.254015,3.9166492 13.083107,3.2499689 11.648446,2.7280416 9.9497193,2.3547312 9.6170768,2.2556897 9.2342253,1.882379 8.8019484,1.2385545 8.6104428,0.96809488 8.5149528,0.69377148 8.5149528,0.41950255 V 0.2709402 c 0.02624,-0.0489766 0.074504,-0.0761858 0.1437605,-0.0761858 1.4614707,0.32759902 2.6819607,0.68572668 3.6611547,1.081893 0.97956,0.3999755 1.840493,0.9790423 2.582797,1.7447641 0.860566,0.8952377 1.291058,1.6647691 1.291058,2.312403 0,0.838098 -0.663708,1.5809645 -1.991493,2.2285436 -1.327365,0.643825 -2.810138,1.1352775 -4.447532,1.470496 -1.6373932,0.335217 -3.2274082,0.754293 -4.7689445,1.2647379 -1.5418505,0.506635 -2.4696264,1.059092 -2.7836945,1.653396 1.7486764,0.891374 3.9006673,1.588528 6.4566543,2.083791 0.168419,0.02721 0.3237221,0.11428 0.4674821,0.262839 0.143759,0.152373 0.2927655,0.331408 0.4475445,0.54092 0.1547758,0.209511 0.2570887,0.339027 0.3069325,0.392357 0.1909786,0.297126 0.2869946,0.544782 0.2869946,0.742866"  transform="translate(0,'+i*14+')"/>'
			}
			txt=txt+"</g>"
			break
		case 29:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"+glyphLignesDim+"</g>"
			txt=txt+"</g>"
			break
		case 30:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"+glyphLignesCresc+"</g>"
			txt=txt+"</g>"
			break
		case 31:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"+glyphLignesTrille+"</g>"
			txt=txt+"</g>"
			break
		case 32:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"+glyphStringGliss+"</g>"
			txt=txt+"</g>"
			break
		case 33:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"+glyphNuancesPPP+"</g>"
			txt=txt+"</g>"
			break
		case 34:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"+glyphNuancesPP+"</g>"
			txt=txt+"</g>"
			break
		case 35:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"+glyphNuancesP+"</g>"
			txt=txt+"</g>"
			break
		case 36:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"+glyphNuancesMP+"</g>"
			txt=txt+"</g>"
			break
		case 37:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"+glyphNuancesMF+"</g>"
			txt=txt+"</g>"
			break
		case 38:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"+glyphNuancesF+"</g>"
			txt=txt+"</g>"
			break
		case 39:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"+glyphNuancesFF+"</g>"
			txt=txt+"</g>"
			break
		case 40:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"+glyphNuancesFFF+"</g>"
			txt=txt+"</g>"
			break
		case 41:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"+glyphNuancesFP+"</g>"
			txt=txt+"</g>"
			break
		case 42:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"+glyphNuancesSF+"</g>"
			txt=txt+"</g>"
			break
		case 43:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"+glyphNuancesSFZ+"</g>"
			txt=txt+"</g>"
			break
		case 44:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"+glyphNuancesFZ+"</g>"
			txt=txt+"</g>"
			break
		case 45:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"+glyphSymboleOrgue+"</g>"
			txt=txt+"</g>"
			break
		case 46:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"+glyphSymboleOrgueCourt+"</g>"
			txt=txt+"</g>"
			break
		case 47:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"+glyphSymboleOrgueLong+"</g>"
			txt=txt+"</g>"
			break
		case 48:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"+glyphSymboleOrgueTresLong+"</g>"
			txt=txt+"</g>"
			break
		case 49:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"+glyphSymboleOrgueTresCourt+"</g>"
			txt=txt+"</g>"
			break
		case 50:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"+glyphSymbolePizzBartok+"</g>"
			txt=txt+"</g>"
			break
		case 51:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"+glyphTremolo+"</g>"
			txt=txt+"</g>"
			break
		case 52:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"+glyphSoftAccent+"</g>"
			txt=txt+"</g>"
			break
		case 53:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"+glyphSoftAccentPointe+"</g>"
			txt=txt+"</g>"
			break
		case 54:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"+glyphSoftTenuto+"</g>"
			txt=txt+"</g>"
			break
		case 55:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"+glyphSoftTenutoPointe+"</g>"
			txt=txt+"</g>"
			break
		case 56:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleX+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"
			var lx=47*(parseFloat(lsgrp.scaleY2)+parseFloat(lsgrp.scaleX))	
			txt=txt+"<g transform='scale(1 1)'><circle fill='#ffffff' stroke='#000000' fill-opacity='1' stroke-width='0.6' cx='8.0' cy='8.0' r='7' /><circle  fill='#ffffff' stroke='#000000' fill-opacity='1' stroke-width='0.6' cx='"+lx+"' cy='8.0' r='7' /><line fill='#ffffff' stroke='#000000' fill-opacity='1' stroke-width='0.6'  x1='15' y1='8' x2='"+(lx-8)+"' y2='8' /><path style='fill:#000000;stroke-width:0.50;stroke-opacity:1' d='M 47,8 L 47,8 40,4 40,12 47,8' transform='translate("+(lx-51)+" 0)' /></g>"
			txt=txt+"</g>"
			break
		case 57:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleX+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"
			var lx=47*(parseFloat(lsgrp.scaleY2)+parseFloat(lsgrp.scaleX))
			txt=txt+"<g transform='scale(1 1)'><circle style='fill:#ffffff;fill-opacity:1;stroke:#000000;stroke-width:0.6;stroke-opacity:1' cx='8.0' cy='8.0' r='7' /><circle style='fill:#ffffff;fill-opacity:1;stroke:#000000;stroke-width:0.6;stroke-opacity:1' cx='"+lx+"' cy='8.0' r='7' /><line style='fill:none;;stroke:#000000;stroke-width:0.60;stroke-opacity:1' x1='15' y1='8' x2='"+(lx-8)+"' y2='8' /><path style='fill:#000000;stroke-width:0.50;stroke-opacity:1' d='M 15,8 L 15,8 22,4 22,12 15,8' /></g>"
			txt=txt+"</g>"
			break
		case 58:
			var lx=47*(parseFloat(lsgrp.scaleY2)+parseFloat(lsgrp.scaleX))	
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleX+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"
			txt=txt+"<g transform='scale(1 1)'><circle style='fill:#ffffff;fill-opacity:1;stroke:#000000;stroke-width:0.6;stroke-opacity:1' cx='8.0' cy='8.0' r='7' /><circle style='fill:#ffffff;fill-opacity:1;stroke:#000000;stroke-width:0.6;stroke-opacity:1' cx='"+lx+"' cy='8.0' r='7' /><line style='fill:none;stroke:#000000;stroke-width:0.60;stroke-opacity:1' x1='15' y1='8' x2='"+(lx-8)+"' y2='8' /><path style='fill:#000000;stroke-width:0.50;stroke-opacity:1' d='M 47,8 L 47,8 40,4 40,12 47,8' transform='translate("+(lx-51)+")'/><g transform='translate("+(lx/2)+" 0) scale(6 6)' ><path style='fill:none;stroke-width:0.1;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:3;stroke-dasharray:none;stroke-opacity:1' d='m 0.87037671,1.9635921 c -0.06468,-0.07449 -0.352828,-0.03968 -0.394197,-0.574872 0.01372,-0.70638403 0.55035799,-0.74558403 0.62098599,-0.73461103 0.590522,0.07128 0.670251,0.60724103 0.524974,1.05662603 -0.136678,0.396526 -0.545612,0.461145 -0.545612,0.461145' stroke='#000000' /><path style='fill:#000000;stroke-width:0.0500108px;stroke-opacity:1' transform='translate(0.14 0.56) rotate(-30)' d='M 0,1.8 L 0,1.8 0.4,1.5 0.4,2.2 0,1.8' /> </g></g>"
			txt=txt+"</g>"
			break
		case 59:
			var lx=47*(parseFloat(lsgrp.scaleY2)+parseFloat(lsgrp.scaleX))	
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleX+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"
			txt=txt+"<g transform='scale(1 1)'><circle style='fill:#ffffff;fill-opacity:1;stroke-width:0.6;stroke:#000000;stroke-opacity:1' cx='8.0' cy='8.0' r='7' /><circle style='fill:#ffffff;fill-opacity:1;stroke-width:0.6;stroke:#000000;stroke-opacity:1' cx='"+lx+"' cy='8.0' r='7' /><line style='fill:none;stroke-width:0.60;stroke:#000000;stroke-opacity:1' x1='15' y1='8' x2='"+(lx-8)+"' y2='8' /><path style='fill:#000000;stroke-width:0.50;stroke-opacity:1' d='M 15,8 L 15,8 22,4 22,12 15,8' /><g transform='translate("+(lx/2)+" 0) scale(6 6)' ><path style='fill:none;stroke-width:0.1;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:3;stroke-dasharray:none;stroke-opacity:1' d='m 0.87037671,1.9635921 c -0.06468,-0.07449 -0.352828,-0.03968 -0.394197,-0.574872 0.01372,-0.70638403 0.55035799,-0.74558403 0.62098599,-0.73461103 0.590522,0.07128 0.670251,0.60724103 0.524974,1.05662603 -0.136678,0.396526 -0.545612,0.461145 -0.545612,0.461145'  stroke='#000000' /><path style='fill:#000000;stroke-width:0.0500108px;stroke-opacity:1' transform='translate(0.14 0.56) rotate(-30)' d='M 0,1.8 L 0,1.8 0.4,1.5 0.4,2.2 0,1.8' /> </g></g>"
			txt=txt+"</g>"
			break
		case 60:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleX+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"+glyphSuperposition+"</g>"
			txt=txt+"</g>"
			break
		case 61:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleX+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"+glyphTuilageInf+"</g>"
			txt=txt+"</g>"
			break
		case 62:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleX+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"+glyphTuilageSup+"</g>"
			txt=txt+"</g>"
			break
		case 63:
			var lx=47*(parseFloat(lsgrp.scaleY2)+parseFloat(lsgrp.scaleX))
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleX+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"
			txt=txt+"<g transform='translate(0 -8)'><line style='fill:none;stroke-width:0.80;stroke:#000000;stroke-opacity:1' x1='0' y1='24' x2='0' y2='8' /><line style='fill:none;stroke-width:0.80;stroke:#000000;stroke-opacity:1' x1='0' y1='16' x2='"+lx+"' y2='16' /><line style='fill:none;stroke-width:0.80;stroke:#000000;stroke-opacity:1' x1='"+lx+"' y1='8' x2='"+lx+"' y2='24' /><path style='fill:#000000;stroke-width:0.50;stroke-opacity:1' d='M 1,16 L 1,16 8,12 8,20 1,16' /><path style='fill:#000000;stroke-width:0.50;stroke-opacity:1' d='M 46,16 L 46,16 39,12 39,20 46,16' transform='translate("+(lx-47)+" 0)'/></g>"
			txt=txt+"</g>"
			break
		case 64:
			var lx=47*(parseFloat(lsgrp.scaleY2)+parseFloat(lsgrp.scaleX))
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleX+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"
			txt=txt+"<g transform='translate(0 -8)'><line style='fill:none;stroke-width:0.80;stroke:#000000;stroke-opacity:1' x1='8' y1='24' x2='8' y2='8' /><line style='fill:none;stroke-width:0.80;stroke:#000000;stroke-opacity:1' x1='0' y1='16' x2='"+lx+"' y2='16' /><line style='fill:none;stroke-width:0.80;stroke:#000000;stroke-opacity:1' x1='"+lx+"' y1='8' x2='"+lx+"' y2='24' /><path style='fill:#000000;stroke-width:0.50;stroke-opacity:1' d='M 0,12 L 0,12 0,20 7,16 0,12' /><path style='fill:#000000;stroke-width:0.50;stroke-opacity:1' d='M 47,16 L 47,16 54,12 54,20 47,16'  transform='translate("+(lx-47)+" 0)'/></g>"
			txt=txt+"</g>"
			break
		case 65:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleX+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"+glyphAccelerando+"</g>"
			txt=txt+"</g>"
			break
		case 66:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleX+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"+glyphFastAccelerando+"</g>"
			txt=txt+"</g>"
			break
		case 67:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleX+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"+glyphRitardando+"</g>"
			txt=txt+"</g>"
			break
		case 68:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleX+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"+glyphFastRitardando+"</g>"
			txt=txt+"</g>"
			break
		case 69:
			txt=txt+"<g transform='rotate(0 0 0) scale("+parseFloat(lsgrp.scaleX)+" "+(parseFloat(lsgrp.scaleX))+") translate(0 0)' >"
			var lx=53*(parseFloat(lsgrp.scaleY2)+parseFloat(lsgrp.scaleX))
			txt=txt+"<g transform='translate(0 0)'><path style='fill:none;stroke-width:1.5;stroke:#000000;stroke-opacity:1' d='M 0,8 L 0,8 20,8  20,24 ' /><path style='fill:none;stroke-width:1.5;stroke:#000000;stroke-opacity:1' d='M 20,24 L "+lx+",24' /><path style='fill:#000000;stroke-width:0.50;stroke-opacity:1' d='M 54,24 L 54,24 48,20 48,28 54,24'  transform='translate("+(lx-53)+" 0)'/></g>";
			txt=txt+"</g>"
			break
		case 70:
			txt=txt+"<g transform='rotate(0 0 0) scale("+parseFloat(lsgrp.scaleX)+" "+(parseFloat(lsgrp.scaleX))+") translate(0 0)' >"
			var lx=53*(parseFloat(lsgrp.scaleY2)+parseFloat(lsgrp.scaleX))
			txt=txt+"<g transform='translate(0 0)'><path style='fill:none;stroke-width:1.5;stroke:#000000;stroke-opacity:1' d='M 0,24 L 0,24 20,24 20,8' /><path style='fill:none;stroke-width:1.5;stroke:#000000;stroke-opacity:1' d='M 20,8 L "+lx+",8' /><path style='fill:#000000;stroke-width:0.50;stroke-opacity:1' d='M 54,8 L 54,8 48,4 48,12 54,8'  transform='translate("+(lx-53)+" 0)'/></g>";
			txt=txt+"</g>"
			break
		case 71:
			txt=txt+"<g transform='rotate(0 0 0) scale("+parseFloat(lsgrp.scaleX)+" "+(parseFloat(lsgrp.scaleX))+") translate(0 0)' >"
			var lx=53*(parseFloat(lsgrp.scaleY2)+parseFloat(lsgrp.scaleX))
			txt=txt+"<g transform='translate(0 0)'><path style='fill:none;stroke-width:1.5;stroke:#000000;stroke-opacity:1' d='M 0,8 L 0,8 0,24' /><path style='fill:none;stroke-width:1.5;stroke:#000000;stroke-opacity:1' d='M 0,24 L "+lx+",24' /><path style='fill:#000000;stroke-width:0.50;stroke-opacity:1' d='M 54,24 L 54,24 48,20 48,28 54,24'  transform='translate("+(lx-53)+" 0)'/></g>";
			txt=txt+"</g>"
			break
		case 72:
			txt=txt+"<g transform='rotate(0 0 0) scale("+parseFloat(lsgrp.scaleX)+" "+(parseFloat(lsgrp.scaleX))+") translate(0 0)' >"
			var lx=53*(parseFloat(lsgrp.scaleY2)+parseFloat(lsgrp.scaleX))
			txt=txt+"<g transform='translate(0 0)'><path style='fill:none;stroke-width:1.5;stroke:#000000;stroke-opacity:1' d='M 0,24 L 0,24 0,8' /><path style='fill:none;stroke-width:1.5;stroke:#000000;stroke-opacity:1' d='M 0,8 L "+lx+",8' /><path style='fill:#000000;stroke-width:0.50;stroke-opacity:1' d='M 54,8 L 54,8 48,4 48,12 54,8'  transform='translate("+(lx-53)+" 0)'/></g>";
			txt=txt+"</g>"
			break
		case 73:
			txt=txt+"<g transform='rotate(0 0 0) scale("+parseFloat(lsgrp.scaleX)+" "+(parseFloat(lsgrp.scaleX))+") translate(0 0)' >"
			var lx=53*(parseFloat(lsgrp.scaleY2)+parseFloat(lsgrp.scaleX))
	txt=txt+"<g transform='translate(0 0)'><line style='fill:none;stroke-width:1.5;stroke:#000000;stroke-opacity:1' x1='0' y1='8' x2='"+lx+"' y2='8' /><path style='fill:#000000;stroke-width:0.50;stroke-opacity:1' d='M 54,8 L 54,8 48,4 48,12 54,8'  transform='translate("+(lx-53)+" 0)'/></g>";
			txt=txt+"</g>"
			break
		case 74:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleX+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' ><text x='5' y='16' font-size='12'   style='stroke-width:0.1;stroke-opacity:1' >"+lsgrp.nom+"</text></g>"
			txt=txt+"</g>"
			break
		case 75:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleX+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"+glyphInsertion+"</g>"
			txt=txt+"</g>"
			break
		case 76:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleX+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"+glyphPermutation+"</g>"
			txt=txt+"</g>"
			break
		case 77:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleX+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"+glyphPalindrome+"</g>"
			txt=txt+"</g>"
			break
		case 78:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  style='fill:"+lsgrp.objColor+";fill-opacity:1;stroke:"+lsgrp.objColor+";stroke-width:1;stroke-opacity:1'><line x1='4' y1='0' x2='4' y2='25' /><line x1='12' y1='0' x2='12' y2='25' /><line x1='20' y1='0' x2='20' y2='25' /><line x1='0' y1='4' x2='25' y2='4' /><line x1='0' y1='12' x2='25' y2='12' /><line x1='0' y1='20' x2='25' y2='20' /></g>"
			txt=txt+"</g>"
			break
		case 79:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  style='fill:"+lsgrp.objColor+";fill-opacity:1;stroke:"+lsgrp.objColor+";stroke-width:1;stroke-opacity:1'><line x1='4' y1='0' x2='6' y2='25' /><line x1='12' y1='0' x2='10' y2='25' /><line x1='20' y1='0' x2='18' y2='25' /><line x1='0' y1='4' x2='25' y2='6' /><line x1='0' y1='12' x2='25' y2='10' /><line x1='0' y1='18' x2='25' y2='20' /></g>"
			txt=txt+"</g>"
			break
		case 80:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  style='fill:"+lsgrp.objColor+";fill-opacity:1;stroke:"+lsgrp.objColor+";stroke-width:1;stroke-opacity:1'><line x1='4' y1='0' x2='4' y2='25' /><line x1='12' y1='0' x2='12' y2='25' /><line x1='20' y1='0' x2='20' y2='25' /><line x1='0' y1='4' x2='25' y2='4' /><line x1='0' y1='12' x2='25' y2='12' /><line x1='0' y1='20' x2='25' y2='20' /><circle cx='4.0' cy='4.0' r='2' /><circle cx='12.0' cy='4.0' r='2' /><circle  cx='20.0' cy='4.0' r='2' /><circle cx='4.0' cy='12.0' r='2' /><circle  cx='12.0' cy='12.0' r='2' /><circle  cx='20.0' cy='12.0' r='2' /><circle cx='20.0' cy='4.0' r='2' /><circle cx='4.0' cy='20.0' r='2' /><circle  cx='12.0' cy='20.0' r='2' /><circle  cx='20.0' cy='20.0' r='2' /></g>"
			txt=txt+"</g>"
			break
		case 81:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  style='fill:"+lsgrp.objColor+";fill-opacity:1;stroke:"+lsgrp.objColor+";stroke-width:1;stroke-opacity:1'><path  d='m 1.5948139,6.5063422 c -0.02104,-0.117348 -0.0505,-0.234279 -0.05311,-0.355615 -0.0049,-0.226789 0.04127,-0.451519 0.07588,-0.672271 0.05794,-0.283743 0.09113,-0.585715 0.203043,-0.847915 0.07188,-0.168403 0.109211,-0.200012 0.213629,-0.340863 -0.121108,0.04671 0.419634,-0.354677 0.315875,-0.263932 -0.103079,0.09015 -0.224758,0.147939 -0.319725,0.25092 -0.04087,0.04432 0.101106,-0.04914 0.152734,-0.06984 0.126806,-0.05085 0.163988,-0.05364 0.295875,-0.08362 0.360035,-0.04608 0.732862,-0.0145 1.071865,0.155014 0.06555,0.03278 0.126523,0.0782 0.189785,0.117298 0.267302,0.185673 0.466832,0.469773 0.654624,0.762937 0.135567,0.231624 0.157185,0.510546 0.185297,0.785159 0.03494,0.237467 0.09976,0.46604 0.149586,0.698903 0.145489,0.679932 -0.05682,-0.218873 0.101796,0.477525 0.09692,0.412669 0.235261,0.724285 0.489357,1.015119 0.126281,0.14304 0.276082,0.224027 0.441729,0.263604 0.172591,0.03394 0.338444,-0.03733 0.484709,-0.15054 0.226212,-0.175091 0.447122,-0.360535 0.670684,-0.540801 0.529838,-0.65223 0.939947,-1.432286 1.317617,-2.22612 0.33047,-0.684653 0.711186,-1.327845 1.055991,-2.001064 0.154296,-0.274609 0.265025,-0.602312 0.465013,-0.834606 0.03355,-0.03897 0.149574,-0.131351 0.108862,-0.104936 -0.132515,0.08598 -0.257079,0.189669 -0.385618,0.284503 0.03896,-0.01574 0.07654,-0.03829 0.116877,-0.04721 0.241507,-0.05341 0.4321621,0.156955 0.6056951,0.330266 0.44161,0.502609 0.796254,1.110191 1.136735,1.718653 0.237538,0.422124 0.445427,0.866502 0.649716,1.313833 0.0573,0.101412 0.136312,0.338145 0.239904,0.381923 0.02479,0.01048 0.05477,0.02206 0.0783,0.0078 0.20484,-0.124268 0.397275,-0.277875 0.595913,-0.416813 0.254668,-0.329084 0.435091,-0.749629 0.616892,-1.143906 0.190229,-0.425934 0.395047,-0.841958 0.630638,-1.231579 0.196613,-0.304922 0.410591,-0.59316 0.647497,-0.850289 0.303158,-0.2538 -0.204061,0.126389 -0.297147,0.207267 -0.03605,0.03132 0.08139,-0.04198 0.123437,-0.05807 0.142573,-0.05453 0.279546,-0.06522 0.427404,-0.06592 0.0465,0.01109 0.09438,0.01547 0.139506,0.03331 0.277419,0.109625 0.422811,0.451675 0.554789,0.746208 0.137316,0.329091 0.256634,0.667632 0.366885,1.011657 0.01566,0.03058 0.02553,0.06717 0.04698,0.09174 0.132102,0.151334 0.348913,0.01291 0.473411,-0.07436 0.221872,-0.155549 0.440261,-0.318645 0.660392,-0.477968 0.42467,-0.356573 0.789092,-0.807486 1.15369,-1.251519 -0.147004,0.06577 0.367121,-0.360834 0.260795,-0.29729 -0.110447,0.06601 -0.239085,0.119746 -0.311587,0.242492 -0.05041,0.08534 0.157362,-0.08156 0.237597,-0.117229 0.198706,-0.08833 0.312112,-0.121956 0.51372,-0.190554 0.183914,-0.04947 0.36662,-0.119523 0.554864,-0.14165 0.153058,-0.01799 0.303174,-9.55e-4 0.454934,0.02169 0.09856,0.0247 0.204142,0.04092 0.286753,0.119558 0.06056,0.05765 0.102507,0.14995 0.149723,0.222922 0.028,0.02348 0.05226,0.05606 0.08399,0.07045 0.221766,0.10057 0.526725,0.05165 0.751099,0.0221 0.302609,-0.03985 0.413234,-0.07006 0.710614,-0.134466 0.500414,-0.124444 0.988139,-0.313716 1.475782,-0.498075 0.356716,-0.1274 0.550625,-0.295576 0.899543,-0.576077 0.01524,-0.01224 0.116256,-0.153229 0.128612,-0.170212 0,0 -0.543165,0.282237 -0.543165,0.282237 v 0 c -0.186177,0.24046 -0.355294,0.313288 0.299731,-0.137376 0.02688,-0.01849 -0.05298,0.03903 -0.08107,0.05447 -0.03643,0.02002 -0.07463,0.03466 -0.112046,0.05166 -0.04768,0.02166 -0.0955,0.04288 -0.143244,0.06431 -0.495997,0.197539 -0.993123,0.395782 -1.502425,0.534141 -0.29986,0.06829 -0.397065,0.09868 -0.701459,0.134829 -0.202838,0.02409 -0.484599,0.05873 -0.686689,-0.02302 -0.02633,-0.01066 -0.04749,-0.03539 -0.07123,-0.05308 -0.05324,-0.07932 -0.09827,-0.175335 -0.163073,-0.241373 -0.08975,-0.09147 -0.199882,-0.11179 -0.31061,-0.137057 -0.15354,-0.02393 -0.312037,-0.04945 -0.467218,-0.03485 -0.19678,0.01852 -0.385744,0.10486 -0.577731,0.153291 -0.614935,0.206464 -1.209105,0.419615 -1.65255,1.043471 -0.360923,0.449066 -0.729226,0.895864 -1.162567,1.237823 0.103677,-0.07271 0.20792,-0.14419 0.311033,-0.218128 0.0461,-0.03306 -0.09169,0.06767 -0.139991,0.09548 -0.06051,0.03485 -0.200112,0.112582 -0.269933,0.05137 -0.02082,-0.01826 -0.03038,-0.05084 -0.04556,-0.07626 -0.124917,-0.337886 -0.248094,-0.676481 -0.38609,-1.00672 -0.139351,-0.309196 -0.289036,-0.669876 -0.573341,-0.802747 -0.04705,-0.02199 -0.09768,-0.02961 -0.146516,-0.04442 -0.05019,-0.0025 -0.100359,-0.009 -0.150573,-0.0074 -0.416385,0.0132 -0.789847,0.294369 -1.105735,0.615252 -0.230016,0.265586 -0.444796,0.552639 -0.637516,0.860808 -0.227934,0.391941 -0.421257,0.811193 -0.613893,1.230871 -0.113416,0.240257 -0.111356,0.241109 -0.230686,0.473522 -0.09681,0.18856 -0.192856,0.384648 -0.321615,0.543243 -0.03197,0.03937 -0.06847,0.07262 -0.102712,0.108922 0.14272,-0.09604 0.28662,-0.189416 0.428159,-0.288113 0.01786,-0.01245 -0.03632,0.02843 -0.0568,0.02916 -0.01912,7.64e-4 -0.0383,-0.01108 -0.05365,-0.02525 -0.07878,-0.07269 -0.127463,-0.217643 -0.186132,-0.310019 -0.108071,-0.219396 -0.05293,-0.105026 -0.165041,-0.343422 -0.160927,-0.327153 -0.343128,-0.637481 -0.518232,-0.952859 -0.273994,-0.47013 -0.08623,-0.152856 -0.380349,-0.636731 -0.233543,-0.38422 -0.461222,-0.776927 -0.737963,-1.116276 -0.178553,-0.195292 -0.370409,-0.416683 -0.627474,-0.394664 -0.04284,0.0037 -0.08413,0.02146 -0.1261891,0.03218 -0.200831,0.146224 -0.4057,0.284207 -0.602492,0.43867 -0.0384,0.03014 -0.06998,0.0724 -0.101065,0.11355 -0.182142,0.241146 -0.286654,0.556648 -0.432987,0.828612 -0.138783,0.276217 -0.176344,0.356085 -0.326009,0.63207 -0.244905,0.451606 -0.504773,0.891173 -0.720626,1.366235 -0.37423,0.801396 -0.783531,1.590277 -1.343896,2.213088 0.09575,-0.05326 0.187479,-0.119473 0.287247,-0.159777 0.05155,-0.02082 -0.09208,0.07163 -0.140981,0.100689 -0.07167,0.0426 -0.162674,0.07184 -0.242883,0.07294 -0.01927,1.91e-4 -0.03846,-0.0029 -0.0577,-0.0044 -0.161162,-0.02387 -0.308718,-0.0874 -0.435017,-0.219406 -0.03017,-0.03139 -0.06217,-0.06025 -0.09051,-0.09417 -0.198413,-0.237437 -0.319322,-0.550202 -0.398385,-0.873677 -0.08604,-0.390064 -0.162575,-0.784444 -0.228029,-1.180549 -0.03135,-0.286635 -0.06184,-0.576938 -0.204917,-0.816586 -0.195144,-0.302512 -0.408422,-0.585845 -0.685448,-0.775213 -0.06584,-0.04094 -0.129534,-0.08769 -0.197512,-0.12283 -0.338848,-0.175139 -0.70972,-0.219513 -1.073055,-0.195706 -0.485917,0.08985 -0.614553,0.23538 -1.115069,0.583572 -0.172256,0.119832 -0.163355,0.126388 -0.311552,0.285315 -0.107866,0.158293 -0.136232,0.179239 -0.208583,0.36388 -0.105183,0.268426 -0.137214,0.570308 -0.192916,0.857277 -0.03627,0.230277 -0.08209,0.46422 -0.08235,0.700421 -1.38e-4,0.126741 0.02664,0.251204 0.03888,0.37625 0,0 0.528541,-0.355022 0.528541,-0.355022 z' /></g>"
			txt=txt+"</g>"
			break
		case 82:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  style='fill:"+lsgrp.objColor+";fill-opacity:1;stroke:"+lsgrp.objColor+";stroke-width:1;stroke-opacity:1'><line x1='2' y1='1' x2='2' y2='32' /><line x1='2' y1='1' x2='14' y2='1' /><line x1='2' y1='8' x2='14' y2='8' /><line x1='2' y1='16' x2='14' y2='16' /><line x1='2' y1='24' x2='14' y2='24' /><line x1='2' y1='32' x2='14' y2='32' /></g>"
			txt=txt+"</g>"
			break
		case 83:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  style='fill:"+lsgrp.objColor+";fill-opacity:1;stroke:"+lsgrp.objColor+";stroke-width:1;stroke-opacity:1'><path  d='M 0.81216837,10.376281 C 5.8843064,-3.7334191 16.447123,1.5452539 16.447123,1.5452539 l 5.611576,4.438109 c 9.654774,5.2558461 15.417136,4.1220851 15.417136,4.1220851' /><path d='M 0.81216837,10.37628 C 37.475834,10.105447 37.475834,10.105447 37.475834,10.105447' /></g>"
			txt=txt+"</g>"
			break
		case 84:
			var nb=Math.hypot(x2-x1, y2-y1)
    		var nb2=nb/4.9222416
    		txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY2+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'  >"
			for(i=0;i<nb2;i++){
				txt=txt+'<path d="m 5,0 l 0,'+(nb2*5)+'"  stroke="#000000" stroke-width="1"/>'
				txt=txt+'<path d="m -0.0010629,8.447791 c -0.113482,0.09554 -0.205008,0.128211 -0.274563,0.09804 -0.139145,0 -0.208699,-0.110603 -0.208699,-0.331842 0,-0.2212239 0.366119,-0.8032039 1.098324,-1.7459321 0.732238,-0.942734 1.567877,-2.192175 2.506918,-3.7482813 0.939074,-1.5561528 1.735386,-3.0054418 2.009949,-4.16691018 0,-0.060335 -0.126309,0 0,0 0,0 -0.02197,-0.060334 0,0 0.296547,1.28715688 1.130351,2.76786758 2.056605,4.26117708 0.926253,1.4932624 1.7564011,2.7112804 2.4904471,3.6540144 0.734046,0.9427282 1.101069,1.5159092 1.101069,1.7195411 0,0.203627 -0.03477,0.314242 -0.104344,0.331841 -0.06957,0.01752 -0.195871,-0.0062 -0.378924,-0.07163 0,0 -4.3303111,-2.9588331 -5.1290491,-3.3170971" /><path d="m -0.0010629,8.447791 c -0.113482,0.09554 -0.205008,0.128211 -0.274563,0.09804 -0.139145,0 -0.208699,-0.110603 -0.208699,-0.331842 0,-0.2212239 0.366119,-0.8032039 1.098324,-1.7459321 0.732238,-0.942734 1.567877,-2.192175 2.506918,-3.7482813 0.939074,-1.5561528 1.735386,-3.0054418 2.009949,-4.16691018 0,-0.060335 -0.126309,0 0,0 0,0 -0.02197,-0.060334 0,0 0.296547,1.28715688 1.130351,2.76786758 2.056605,4.26117708 0.926253,1.4932624 1.7564011,2.7112804 2.4904471,3.6540144 0.734046,0.9427282 1.101069,1.5159092 1.101069,1.7195411 0,0.203627 -0.03477,0.314242 -0.104344,0.331841 -0.06957,0.01752 -0.195871,-0.0062 -0.378924,-0.07163 0,0 -4.3303111,-2.9588331 -5.1290491,-3.3170971"  transform="translate(10,'+((nb2*5)-1)+') rotate(180 0 0)"/>'
				}
			txt=txt+"</g>"
			break
	}
	return txt
}
function vuePartSvg(){
	var txt="";

	document.getElementById('svgTime').innerHTML="";
	document.getElementById('vueSign').innerHTML="";
	txt="<rect x='0' y='0' width='12960' height='30' fill='"+vueSvgBackground+"' />"
	document.getElementById('svgTime').innerHTML=txt
	txt="<rect x='0' y='24' width='12960' height='30' fill='"+vueSvgBackground+"' />"
	document.getElementById('vueSign').innerHTML=txt
	if(vueSvgRegle==true){
		createReglette(1,"svgTime",vueSvgBackground,vueSvgFontSize,vueSvgFontColor);
	}
	if(vueSvgMesure==true){
		regSolfege(1,"vueSign",vueSvgFontSize,vueSvgFontColor,vueSvgFontColor,1);
	}
	vuePartitionA(0,0,tableObjet);
	
}
function vueGrpSvg(mode){
	lsgrp=[];
	var rt;
	var slblock;

	if(grpSelect==1){
		for(let i=0;i<preservSelect.length;i++){
			lsgrp.push(tableObjet[preservSelect[i]]);
		}
		var slblock=document.getElementById("grpSelect").style;

	}else if(tableObjet[objActif].class==2 || tableObjet[objActif].class==4){
		for(let i=0;i<tableObjet[objActif].liste.length;i++){
			lsgrp.push(tableObjet[tableObjet[objActif].liste[i]]);

		}
		lsgrp.push(tableObjet[objActif]);
	}
	
	var reslsgrpX=[];
	var reslsgrpY=[];
	for(let i=0;i<lsgrp.length;i++){
			reslsgrpX[i]=lsgrp[i].posX;
			reslsgrpY[i]=lsgrp[i].posY;
		}
;	for(let i=0;i<lsgrp.length;i++){
		if(grpSelect==1){
			lsgrp[i].posX=lsgrp[i].posX-parseFloat(slblock.left)+10;
			lsgrp[i].posY=lsgrp[i].posY-parseFloat(slblock.top)+10;
		}else{
			lsgrp[i].posX=lsgrp[i].posX-tableObjet[objActif].posX+10;
			lsgrp[i].posY=lsgrp[i].posY-tableObjet[objActif].posY+10;
		}
	}
	vuePartitionA(0,1,lsgrp);
	for(let i=0;i<lsgrp.length;i++){
			lsgrp[i].posX=reslsgrpX[i];
			lsgrp[i].posY=reslsgrpY[i];
		}
		
	document.getElementById("svgGrpVue").firstChild.innerHTML=document.getElementById("vueSvg").innerHTML;
	document.getElementById("vueSvg").innerHTML=""
	if(grpSelect==1){
		document.getElementById("svgGrpVue").firstChild.setAttribute("width",parseFloat(slblock.width)+20);
		document.getElementById("svgGrpVue").firstChild.setAttribute("height",parseFloat(slblock.height)+20);
		document.getElementById("svgGrpVue").firstChild.setAttribute("viewBox","0 0 "+(parseFloat(slblock.width)+20)+" "+(parseFloat(slblock.height)+20));
		grpSelect=0;
		document.getElementById("space").removeChild(document.getElementById("grpSelect"));
	}else{
	var actif=lsgrp.length-1
	document.getElementById("svgGrpVue").firstChild.setAttribute("width",lsgrp[actif].width+20);
	document.getElementById("svgGrpVue").firstChild.setAttribute("height",lsgrp[actif].height+20);
	document.getElementById("svgGrpVue").firstChild.setAttribute("viewBox","0 0 "+(lsgrp[actif].width+20)+" "+(lsgrp[actif].height+20));
	}
	
	var obj=document.getElementById("svgGrpVue");
	
	//var new_window = window.open(URL.createObjectURL(new Blob([obj.innerHTML], { type: "image/svg+xml" })));
	window.api.send("toMain", "saveSvg;"+btoa(obj.innerHTML)+";"+mode)
}

function vuePartitionA(pdf,grp,grpObjets){

	var txt="";
	document.getElementById('svgVue').firstChild.style.backgroundColor='"+vueSvgBackground+"';
	var nbdiv=parseFloat(document.getElementById("nbDiv").value);
	var nbmes=parseFloat(document.getElementById("nbMesure").value);
	var tempo=parseFloat(document.getElementById("tempo").value);
	//var delta=(180/(tempo*nbdiv))*nbmes;
	var delta=(270/(tempo*nbdiv))*nbmes;
	var wstroke="1px";
	if(zoomScale<0.99){
			wstroke="2px";
		}
	if(zoomScale>2.35){
		wstroke="0.5px";
	}
	if(zoomScale>4){
		wstroke="0.25px";
	}
	if(vueSvgGrille==true){
		if(svgSeconde==false){
			delta=delta*nbmes
		}
		for(let i=0;i<12960;i+=delta){
			txt=txt+"<line x1='"+i+"' y1='0' x2='"+i+"' y2='"+spaceHeight+"' style='stroke:black;opacity:"+vueSvgGrilleOpacity+";stroke-width:"+wstroke+";' ></line>"; 
		}	
	}
	for(let j=0;j<11;j++){
		for(let i=0;i<grpObjets.length;i++){
			if(grpObjets[i].etat==1 && document.getElementById(grpObjets[i].id).style.zIndex==j){
				switch(grpObjets[i].class) {
					case 1:
						txt=txt+"<g transform='translate("+grpObjets[i].posX+" "+grpObjets[i].posY+")' >"
						txt=transformObjSvg(pdf,txt,grpObjets[i]);
						txt=txt+"</g>"
						break;
					case 3:
						txt=txt+"<g transform='translate("+grpObjets[i].posX+" "+grpObjets[i].posY+")' >"
						txt=transformSymbSvg(txt,grpObjets[i]);
						txt=txt+"</g>"
						break;
					case 2:
						txt=txt+"<g transform=translate("+grpObjets[i].posX+","+grpObjets[i].posY+")  >";
						txt=txt+simpleCadre(grpObjets[i])
						txt=txt+"</g>";
						/*
						for(let j=0;i<grpObjets[i].liste.length;j++){
							txt=tranfomSvg(grpObjets[i].liste[j],txt);
						}
						txt=txt+"<line x1='0' y1='0' x2='0' y2='"+(grpObjets[i].height+2)+"' stroke='"+grpObjets[i].bkgLeft+"' ";
						switch(grpObjets[i].typeLeft) {
							case "dotted":
								txt=txt+" stroke-width='"+grpObjets[i].epsLeft+"' stroke-dasharray='2' />";
								break;
							case "dashed":
								txt=txt+" stroke-width='"+grpObjets[i].epsLeft+"' stroke-dasharray='4 4' />";
								break;
							case "double":
								txt=txt+" stroke-width='"+(grpObjets[i].epsLeft/3)+"' /> <line x1='"+grpObjets[i].epsLeft+"' y1='"+grpObjets[i].epsTop+"' x2='"+(grpObjets[i].epsLeft)+"' y2='"+(grpObjets[i].height-grpObjets[i].epsBas+2)+"' stroke='"+grpObjets[i].bkgLeft+"'  stroke-width='"+(grpObjets[i].epsLeft/3)+"' />";
								break;
							case "none":
								txt=txt+" stroke-width='0' />";
								break;
							default:
								txt=txt+" stroke-width='"+grpObjets[i].epsLeft+"' />";
								break;	
						}
						txt=txt+"<line x1='0' y1='0' x2='"+(grpObjets[i].width+14)+"' y2='0' stroke='"+grpObjets[i].bkgTop+"' ";
						switch(grpObjets[i].typeTop) {
							case "dotted":
								txt=txt+" stroke-width='"+grpObjets[i].epsTop+"' stroke-dasharray='2' />";
								break;
							case "dashed":
								txt=txt+" stroke-width='"+grpObjets[i].epsTop+"' stroke-dasharray='4 4' />";
								break;
							case "double":
								txt=txt+" stroke-width='"+(grpObjets[i].epsTop/3)+"' /> <line x1='"+grpObjets[i].epsTop+"' y1='"+grpObjets[i].epsTop+"' x2='"+(grpObjets[i].width+14-grpObjets[i].epsRight)+"' y2='"+grpObjets[i].epsTop+"' stroke='"+grpObjets[i].bkgTop+"'  stroke-width='"+(grpObjets[i].epsTop/3)+"' />";
								break;
							case "none":
								txt=txt+" stroke-width='0' />";
								break;
							default:
								txt=txt+" stroke-width='"+grpObjets[i].epsTop+"' />";
								break;	
						}
						txt=txt+"<line x1='"+(grpObjets[i].width+14)+"' y1='0' x2='"+(grpObjets[i].width+14)+"' y2='"+(grpObjets[i].height+2)+"' stroke='"+grpObjets[i].bkgRight+"' ";
						switch(grpObjets[i].typeRight) {
							case "dotted":
								txt=txt+" stroke-width='"+grpObjets[i].epsRight+"' stroke-dasharray='2' />";
								break;
							case "dashed":
								txt=txt+" stroke-width='"+grpObjets[i].epsRight+"' stroke-dasharray='4 4' />";
								break;
							case "double":
								txt=txt+" stroke-width='"+(grpObjets[i].epsRight/3)+"' /> <line x1='"+(grpObjets[i].width+14-grpObjets[i].epsRight)+"' y1='"+grpObjets[i].epsTop+"' x2='"+(grpObjets[i].width+14-grpObjets[i].epsRight)+"' y2='"+(grpObjets[i].height+2-grpObjets[i].epsBas)+"' stroke='"+grpObjets[i].bkgRight+"'  stroke-width='"+(grpObjets[i].epsRight/3)+"' />";
								break;
							case "none":
								txt=txt+" stroke-width='0' />";
								break;
							default:
								txt=txt+" stroke-width='"+grpObjets[i].epsRight+"' />";
								break;	
						}
						txt=txt+"<line x1='"+(grpObjets[i].width+14)+"' y1='"+(grpObjets[i].height+2)+"' x2='0' y2='"+(grpObjets[i].height+2)+"' stroke='"+grpObjets[i].bkgBas+"'   ";
						switch(grpObjets[i].typeBas) {
							case "dotted":
								txt=txt+" stroke-width='"+grpObjets[i].epsBas+"' stroke-dasharray='2' />";
								break;
							case "dashed":
								txt=txt+" stroke-width='"+grpObjets[i].epsBas+"' stroke-dasharray='4 4' />";
								break;
							case "double":
								txt=txt+" stroke-width='"+(grpObjets[i].epsBas/3)+"' /> <line x1='"+(grpObjets[i].width+14-grpObjets[i].epsRight)+"' y1='"+(grpObjets[i].height-grpObjets[i].epsBas)+"' x2='"+grpObjets[i].epsLeft+"' y2='"+(grpObjets[i].height-grpObjets[i].epsBas)+"' stroke='"+grpObjets[i].bkgBas+"'  stroke-width='"+(grpObjets[i].epsBas/3)+"' />";
								break;
							case "none":
								txt=txt+" stroke-width='0' />";
								break;
							default:
								txt=txt+" stroke-width='"+grpObjets[i].epsBas+"' />";
								break;	
						}
						txt=txt+"</g>";
						*/
						break;
					case 4:
						txt=txt+"<g transform=translate("+grpObjets[i].posX+","+grpObjets[i].posY+")  >";
						txt=txt+simpleCadre(grpObjets[i])
						txt=txt+"</g>";
						break;	
				}	
			}
		}
	}
	var obj=document.getElementById("vueSvg");
	obj.innerHTML="";
	obj.innerHTML=txt;
	console.log("obj",grpObjets)
	if(grp==0){
		obj=document.getElementById("svgVue");
		//var new_window = window.open(URL.createObjectURL(new Blob([obj.innerHTML], { type: "image/svg+xml" })));
		window.api.send("toMain", "saveSvg;"+btoa(obj.innerHTML),0)
	}
}
function simpleCadre(lsgrp) {
	ntxt=""
	console.log(lsgrp)			
	if(lsgrp.borderGs!="" && lsgrp.borderGw>0 && lsgrp.borderGr!="0%"){
		var radius=lsgrp.borderGr.split(" ")
		ntxt=ntxt+"<rect x='0' y='0' width='"+(lsgrp.bkgWidth)+"' height='"+(lsgrp.bkgHeight)+"' rx='"+parseFloat(radius[0])+"%' ry='"+parseFloat(radius[1])+"%' fill='"+lsgrp.bkgColor+"' stroke='"+lsgrp.borderGc+"' stroke-width='"+parseFloat(lsgrp.borderGw)+"' />\n"
	}else{
		var nopac=Math.round(parseFloat(lsgrp.bkgOpacity)*255)
		var color=lsgrp.bkgColor+ (nopac.toString(16))
		if(lsgrp.bkgTrp==false){
			ntxt=ntxt+"<rect x='0' y='0' width='"+(lsgrp.bkgWidth)+"' height='"+(lsgrp.bkgHeight)+"' fill='"+color+"'  />\n"
		}

		
		if(lsgrp.bkgImg!=""){
			ntxt=ntxt+"<image x='0' y='0' width='"+lsgrp.bkgWidth+"' height='"+lsgrp.bkgHeight+"' href='file:///"+lsgrp.bkgImg+"' />\n"
		}
		ntxt=ntxt+"<line x1='0' y1='0' x2='"+lsgrp.bkgWidth+"' y2='0' stroke='"+lsgrp.borderHc+"' stroke-width='"+lsgrp.borderHw+"' stroke-linecap='round'  />\n"
		ntxt=ntxt+"<line x1='0' y1='"+lsgrp.bkgHeight+"' x2='"+lsgrp.bkgWidth+"' y2='"+lsgrp.bkgHeight+"' stroke='"+lsgrp.borderBc+"' stroke-width='"+lsgrp.borderBw+"' stroke-linecap='round' />\n"
		ntxt=ntxt+"<line x1='0' y1='0' x2='0' y2='"+lsgrp.bkgHeight+"' stroke='"+lsgrp.borderGc+"' stroke-width='"+lsgrp.borderGw+"' stroke-linecap='round' />\n"
		ntxt=ntxt+"<line x1='"+lsgrp.bkgWidth+"' y1='0' x2='"+lsgrp.bkgWidth+"' y2='"+lsgrp.bkgHeight+"' stroke='"+lsgrp.borderDc+"' stroke-width='"+lsgrp.borderDw+"'stroke-linecap='round'  />\n"
		
		}
	return ntxt
}
