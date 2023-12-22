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
			
			console.log("vue",lsgrp.width,lsgrp.height,document.getElementById("svgGrpVue").innerHTML);
			var obj=document.getElementById("svgGrpVue");
			var new_window = window.open(URL.createObjectURL(new Blob([obj.innerHTML], { type: "image/svg+xml" })));
			break
		case 3:
		console.log("symbole")
			txt="<g transform='translate("+lsgrp.posX+","+(lsgrp.posY)+")' >\n"
			if(lsgrp.borderGs!="" && lsgrp.borderGw>0){
				var radius=lsgrp.borderGr.split(" ")
					txt=txt+"<rect x='0' y='0' width='"+(lsgrp.bkgWidth)+"' height='"+(lsgrp.bkgHeight)+"' rx='"+parseFloat(radius[0])+"%' ry='"+parseFloat(radius[1])+"%' fill='"+lsgrp.bkgColor+"'  fill-opacity='"+lsgrp.bkgOpacity+"' stroke='"+lsgrp.borderGc+"' stroke-width='"+parseFloat(lsgrp.borderGw)+"' />\n"
			}else{
				if(lsgrp.bkgTrp==true){
					txt=txt+"<rect x='0' y='0' width='"+(lsgrp.bkgWidth)+"' height='"+(lsgrp.bkgHeight)+"' fill='"+lsgrp.bkgColor+"' fill-opacity='"+lsgrp.bkgOpacity+"' />\n"
				}else{
					txt=txt+"<rect x='0' y='0' width='"+(lsgrp.bkgWidth)+"' height='"+(lsgrp.bkgHeight)+"' fill='none'  />\n"
				}
			}
			if(lsgrp.bkgImg!=""){
				txt=txt+"<image x='0' y='0' width='"+lsgrp.bkgWidth+"' height='"+lsgrp.bkgHeight+"' href='file:///"+lsgrp.bkgImg+"' />\n"
			}
			txt=transformSymbSvg(txt,lsgrp)
			document.getElementById("svgGrpVue").firstChild.innerHTML=txt;
			document.getElementById("svgGrpVue").firstChild.setAttribute("width",lsgrp.bkgWidth+200);
			document.getElementById("svgGrpVue").firstChild.setAttribute("height",lsgrp.bkgHeight+200);
			document.getElementById("svgGrpVue").firstChild.setAttribute("viewBox","0 0 "+(lsgrp.bkgWidth+400)+" "+(lsgrp.bkgHeight+400))
			
			console.log("vue",lsgrp.width,lsgrp.height,document.getElementById("svgGrpVue").innerHTML);
			var obj=document.getElementById("svgGrpVue");
			var new_window = window.open(URL.createObjectURL(new Blob([obj.innerHTML], { type: "image/svg+xml" })));
			break
	}
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
function transformObjSvg(pdf,txt,lsgrp) {
		if(lsgrp.borderGs!="" && lsgrp.borderGw>0 && lsgrp.borderGr!="0%"){
			var radius=lsgrp.borderGr.split(" ")
			txt=txt+"<rect x='0' y='0' width='"+(lsgrp.bkgWidth)+"' height='"+(lsgrp.bkgHeight)+"' rx='"+parseFloat(radius[0])+"%' ry='"+parseFloat(radius[1])+"%' fill='"+lsgrp.bkgColor+"' stroke='"+lsgrp.borderGc+"' stroke-width='"+parseFloat(lsgrp.borderGw)+"' />\n"
		}else{
			var nopac=Math.round(parseFloat(lsgrp.bkgOpacity)*255)
			var color=lsgrp.bkgColor+ (nopac.toString(16))
			if(lsgrp.bkgTrp=="true"){
				var nc="none"
			}else{
				var nc=color
			}
			console.log("transparence",lsgrp.bkgTrp)
			txt=txt+"<rect x='0' y='0' width='"+(lsgrp.bkgWidth)+"' height='"+(lsgrp.bkgHeight)+"' fill='"+nc+"'  />\n"
			if(lsgrp.bkgImg!=""){
				if(pdf==1){
					importSvgImage(lsgrp.bkgImg)
					txt=txt+document.getElementById("fichierSave").innerHTML
				}else{
					txt=txt+"<image x='0' y='0' width='"+lsgrp.bkgWidth+"' height='"+lsgrp.bkgHeight+"' href='file:///"+lsgrp.bkgImg+"' />\n"
				}
			}
			txt=txt+"<line x1='0' y1='0' x2='"+lsgrp.bkgWidth+"' y2='0' stroke='"+lsgrp.borderHc+"' stroke-width='"+lsgrp.borderHw+"' stroke-linecap='round'  />\n"
			txt=txt+"<line x1='0' y1='"+lsgrp.bkgHeight+"' x2='"+lsgrp.bkgWidth+"' y2='"+lsgrp.bkgHeight+"' stroke='"+lsgrp.borderBc+"' stroke-width='"+lsgrp.borderBw+"' stroke-linecap='round' />\n"
			txt=txt+"<line x1='0' y1='0' x2='0' y2='"+lsgrp.bkgHeight+"' stroke='"+lsgrp.borderGc+"' stroke-width='"+lsgrp.borderGw+"' stroke-linecap='round' />\n"
			txt=txt+"<line x1='"+lsgrp.bkgWidth+"' y1='0' x2='"+lsgrp.bkgWidth+"' y2='"+lsgrp.bkgHeight+"' stroke='"+lsgrp.borderDc+"' stroke-width='"+lsgrp.borderDw+"'stroke-linecap='round'  />\n"
			
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
			var r=10*lsgrp.scaleY
			var ly=((10*lsgrp.scaleY)+lsgrp.margeH)-((10*lsgrp.scaleY)/2)
			txt=txt+"<circle cx='"+((10*lsgrp.scaleY)+lsgrp.margeG)+"' cy='"+((10*lsgrp.scaleY)+lsgrp.margeH)+"' r='"+(r)+"'  fill='"+lsgrp.objColor+"' stroke='"+lsgrp.objBorderC+"' stroke-width='"+lsgrp.objBorder+"' /><rect x='"+(18+lsgrp.margeG)+"' y='"+ly+"' width='"+(20*lsgrp.scaleX)+"' height='"+(10*lsgrp.scaleY)+"' fill='"+lsgrp.objColor+"' stroke='"+lsgrp.objBorderC+"' stroke-width='"+lsgrp.objBorderW+"' />\n"
			break
		case 8:
			var ly=((10*lsgrp.scaleY)+lsgrp.margeH)-((10*lsgrp.scaleY)/2)
			txt=txt+"<rect x='"+(lsgrp.margeG)+"' y='"+(lsgrp.margeH)+"' width='"+(20*lsgrp.scaleY)+"' height='"+(20*lsgrp.scaleY)+"'  fill='"+lsgrp.objColor+"' stroke='"+lsgrp.objBorderC+"' stroke-width='"+lsgrp.objBorder+"' /><rect x='"+(18+lsgrp.margeG)+"' y='"+ly+"' width='"+(20*lsgrp.scaleX)+"' height='"+(10*lsgrp.scaleY)+"' fill='"+lsgrp.objColor+"' stroke='"+lsgrp.objBorderC+"' stroke-width='"+lsgrp.objBorderW+"' />\n"
			break
		case 9:
			txt=txt+"<path d='M 0,10 0,5 50,0 50,15 0,10 Z' transform='scale("+lsgrp.scaleX+","+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+")'  fill='"+lsgrp.objColor+"' stroke='"+lsgrp.objBorderC+"' stroke-width='"+lsgrp.objBorderW+"' />\n"
			break
		case 10:
			txt=txt+"<line x1='"+(lsgrp.margeG*lsgrp.scaleX)+"'  y1='"+(lsgrp.margeH*lsgrp.scaleY)+"' x2='"+((50*lsgrp.scaleX)+lsgrp.margeG)+"' y2='"+(lsgrp.margeH*lsgrp.scaleY)+"'  fill='"+lsgrp.objColor+"' stroke='"+lsgrp.objColor+"' stroke-width='"+(6*lsgrp.scaleY)+"' />\n"
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
			if(pdf==1 && lsgrp.img.split('.')[1]=="svg"){
				importSvgImage(imgDirectory+lsgrp.img)
				txt=txt+"<g width='"+lsgrp.bkgWidth+"' height='"+lsgrp.bkgHeight+"' transform='scale("+lsgrp.scaleX+","+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" "+(lsgrp.bkgWidth/2)+" "+(lsgrp.bkgHeight/2)+")' >"
				txt=txt+document.getElementById("fichierSave").innerHTML+"</g>"
			}else{
				txt=txt+"<image x='0' y='0' width='"+lsgrp.bkgWidth+"' height='"+lsgrp.bkgHeight+"' href='file:///"+imgDirectory+lsgrp.img+"' transform='scale("+lsgrp.scaleX+","+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" "+(lsgrp.bkgWidth/2)+" "+(lsgrp.bkgHeight/2)+")' />\n"

			}
			break
		}
	
	return txt
}
function transformSymbSvg(txt,lsgrp) {
	switch(lsgrp.type){
		case 1:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'  >"+glyphArpege+"</g>"
			txt=txt+"</g>"
			break
		case 2:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'  >"+glyphFlecheHautArp+"</g>"
			txt=txt+"</g>"
			break
		case 3:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"' stroke='"+lsgrp.objColor+"' stroke-width='"+(lsgrp.width*lsgrp.scaleX)+"'  >"+glyphFlecheHaut+"</g>"
			txt=txt+"</g>"
			break
		case 4:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'  >"+glyphArtAccentDessus+"</g>"
			txt=txt+"</g>"
			break
		case 5:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'  >"+glyphArtStaccatossimo+"</g>"
			txt=txt+"</g>"
			break
		case 6:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'  >"+glyphArtTenuto+"</g>"
			txt=txt+"</g>"
			break
		case 7:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'  >"+glyphArtLoure+"</g>"
			txt=txt+"</g>"
			break
		case 8:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'  >"+glyphArtMarcato+"</g>"
			txt=txt+"</g>"
			break
		case 9:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'  >"+glyphArtStaccato+"</g>"
			txt=txt+"</g>"
			break
		case 10:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'  >"+glyphArtStaccatoPointe+"</g>"
			txt=txt+"</g>"
			break
		case 11:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'  >"+glyphArtVibration+"</g>"
			txt=txt+"</g>"
			break
		case 12:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'  >"+glyphArtMarcatoStaccato+"</g>"
			txt=txt+"</g>"
			break
		case 13:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'  >"+glyphArtInaccentue+"</g>"
			txt=txt+"</g>"
			break
		case 14:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'  >"+glyphArtVibrato+"</g>"
			txt=txt+"</g>"
			break
		case 15:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'  >"+glyphArtMarcatoTenuto+"</g>"
			txt=txt+"</g>"
			break
		case 16:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'  >"+glyphArtOuvert+"</g>"
			txt=txt+"</g>"
			break
		case 17:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'  >"+glyphArtPousser+"</g>"
			txt=txt+"</g>"
			break
		case 18:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'  >"+glyphArtTirer+"</g>"
			txt=txt+"</g>"
			break
		case 19:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'  >"+glyphBlocAccolade+"</g>"
			txt=txt+"</g>"
			break
		case 20:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'  stroke='"+lsgrp.objColor+"' stroke-width='"+lsgrp.objWidth+"'  >"+glyphBlocDroit+"</g>"
			txt=txt+"</g>"
			break
		case 21:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'  stroke='"+lsgrp.objColor+"'   >"+glyphBlocLigne+"</g>"
			txt=txt+"</g>"
			break
		case 22:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"' stroke='"+lsgrp.objColor+"'  stroke-width='"+lsgrp.objWidth+"' >"+glyphBlocLigneDouble+"</g>"
			txt=txt+"</g>"
			break
		case 23:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'   stroke='"+lsgrp.objColor+"' >"+glyphBlocBordure+"</g>"
			txt=txt+"</g>"
			break
		case 24:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'   stroke='"+lsgrp.objColor+"' >"+glyphBlocBordureCentree+"</g>"
			txt=txt+"</g>"
			break
		case 25:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'   stroke='"+lsgrp.objColor+"'  >"+glyphLignesLiaison+"</g>"
			txt=txt+"</g>"
			break
		case 26:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'   stroke='"+lsgrp.objColor+"'  >"+glyphLignesCrescendo+"</g>"
			txt=txt+"</g>"
			break
		case 27:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'   stroke='"+lsgrp.objColor+"'  >"+glyphLignesDentsdescie+"</g>"
			txt=txt+"</g>"
			break
		case 28:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"+glyphSymboleOndulation+"</g>"
			txt=txt+"</g>"
			break
		case 29:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"+glyphLignesDim+"</g>"
			txt=txt+"</g>"
			break
		case 30:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"+glyphLignesCresc+"</g>"
			txt=txt+"</g>"
			break
		case 31:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"+glyphLignesTrille+"</g>"
			txt=txt+"</g>"
			break
		case 32:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"+glyphStringGliss+"</g>"
			txt=txt+"</g>"
			break
		case 33:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"+glyphNuancesPPP+"</g>"
			txt=txt+"</g>"
			break
		case 34:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"+glyphNuancesPP+"</g>"
			txt=txt+"</g>"
			break
		case 35:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"+glyphNuancesP+"</g>"
			txt=txt+"</g>"
			break
		case 36:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"+glyphNuancesMP+"</g>"
			txt=txt+"</g>"
			break
		case 37:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"+glyphNuancesMF+"</g>"
			txt=txt+"</g>"
			break
		case 38:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"+glyphNuancesF+"</g>"
			txt=txt+"</g>"
			break
		case 39:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"+glyphNuancesFF+"</g>"
			txt=txt+"</g>"
			break
		case 40:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"+glyphNuancesFFF+"</g>"
			txt=txt+"</g>"
			break
		case 41:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"+glyphNuancesFP+"</g>"
			txt=txt+"</g>"
			break
		case 42:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"+glyphNuancesSF+"</g>"
			txt=txt+"</g>"
			break
		case 43:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"+glyphNuancesSFZ+"</g>"
			txt=txt+"</g>"
			break
		case 44:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"+glyphNuancesFZ+"</g>"
			txt=txt+"</g>"
			break
		case 45:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"+glyphSymboleOrgue+"</g>"
			txt=txt+"</g>"
			break
		case 46:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"+glyphSymboleOrgueCourt+"</g>"
			txt=txt+"</g>"
			break
		case 47:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"+glyphSymboleOrgueLong+"</g>"
			txt=txt+"</g>"
			break
		case 48:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"+glyphSymboleOrgueTresLong+"</g>"
			txt=txt+"</g>"
			break
		case 49:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"+glyphSymboleOrgueTresCourt+"</g>"
			txt=txt+"</g>"
			break
		case 50:
			txt=txt+"<g transform='scale("+lsgrp.scaleX+" "+lsgrp.scaleY+") translate("+lsgrp.margeG+" "+lsgrp.margeH+") rotate("+lsgrp.rotate+" 0 0) '  fill='"+lsgrp.objColor+"'     stroke='"+lsgrp.objColor+"' >"+glyphSymbolePizzBartok+"</g>"
			txt=txt+"</g>"
			break
		
	}
	return txt
}
function vuePartSvg(){
	var txt="";
	console.log('fontcolor',vueSvgFontColor)
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
function vueGrpSvg(){
	lsgrp=[];
	var rt;
	var slblock;
	console.log("actif",objActif);
	if(grpSelect==1){
		for(let i=0;i<preservSelect.length;i++){
			lsgrp.push(tableObjet[preservSelect[i]]);
		}
		var slblock=document.getElementById("grpSelect").style;
		console.log("actif2",objActif);
	}else if(tableObjet[objActif].class==2 || tableObjet[objActif].class==4){
		for(let i=0;i<tableObjet[objActif].liste.length;i++){
			lsgrp.push(tableObjet[tableObjet[objActif].liste[i]]);
			console.log("actif",i,lsgrp[i]);
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
	
	var new_window = window.open(URL.createObjectURL(new Blob([obj.innerHTML], { type: "image/svg+xml" })));
	window.api.send("toMain", "saveSvg;"+btoa(obj.innerHTML))
}

function vuePartitionA(pdf,grp,grpObjets){
console.log("actif2 lsgrp",grpObjets,vueSvgGrille);
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
	for(let j=0;j<6;j++){
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
	obj.innerHTML=obj.innerHTML+txt;
	if(grp==0){
		obj=document.getElementById("svgVue");
		var new_window = window.open(URL.createObjectURL(new Blob([obj.innerHTML], { type: "image/svg+xml" })));
		window.api.send("toMain", "saveSvg;"+btoa(obj.innerHTML))
	}
}
function simpleCadre(lsgrp) {
	ntxt=""
						
	if(lsgrp.borderGs!="" && lsgrp.borderGw>0 && lsgrp.borderGr!="0%"){
		var radius=lsgrp.borderGr.split(" ")
		ntxt=ntxt+"<rect x='0' y='0' width='"+(lsgrp.bkgWidth)+"' height='"+(lsgrp.bkgHeight)+"' rx='"+parseFloat(radius[0])+"%' ry='"+parseFloat(radius[1])+"%' fill='"+lsgrp.bkgColor+"' stroke='"+lsgrp.borderGc+"' stroke-width='"+parseFloat(lsgrp.borderGw)+"' />\n"
	}else{
		var nopac=Math.round(parseFloat(lsgrp.bkgOpacity)*255)
		var color=lsgrp.bkgColor+ (nopac.toString(16))
		if(lsgrp.bkgTrp==false){
			ntxt=ntxt+"<rect x='0' y='0' width='"+(lsgrp.bkgWidth)+"' height='"+(lsgrp.bkgHeight)+"' fill='"+color+"'  />\n"
		}
		console.log("transparence",lsgrp.bkgTrp)
		
		if(lsgrp.bkgImg!=""){
			ntxt=ntxt+"<image x='0' y='0' width='"+lsgrp.bkgWidth+"' height='"+lsgrp.bkgHeight+"' href='file:///"+lsgrp.bkgImg+"' />\n"
		}
		ntxt=ntxt+"<line x1='0' y1='0' x2='"+lsgrp.bkgWidth+"' y2='0' stroke='"+lsgrp.borderHc+"' stroke-width='"+lsgrp.borderHw+"' stroke-linecap='round'  />\n"
		ntxt=ntxt+"<line x1='0' y1='"+lsgrp.bkgHeight+"' x2='"+lsgrp.bkgWidth+"' y2='"+lsgrp.bkgHeight+"' stroke='"+lsgrp.borderBc+"' stroke-width='"+lsgrp.borderBw+"' stroke-linecap='round' />\n"
		ntxt=ntxt+"<line x1='0' y1='0' x2='0' y2='"+lsgrp.bkgHeight+"' stroke='"+lsgrp.borderGc+"' stroke-width='"+lsgrp.borderGw+"' stroke-linecap='round' />\n"
		ntxt=ntxt+"<line x1='"+lsgrp.bkgWidth+"' y1='0' x2='"+lsgrp.bkgWidth+"' y2='"+lsgrp.bkgHeight+"' stroke='"+lsgrp.borderDc+"' stroke-width='"+lsgrp.borderDw+"'stroke-linecap='round'  />\n"
		
		}

	console.log("ntxt",lsgrp,ntxt)
	return ntxt
}
