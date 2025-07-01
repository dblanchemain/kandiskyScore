// expression [a-zA-Z "'\.\+\(\)]*=

var mainwinWidth=1510
var mainwinheight=894
let baseDatatPath=""
window.api.send("toMain", "basePath")
const tableLang=[]

function importUconfig() {
   var name=baseDatatPath+'config.js'
   var xhttp = new XMLHttpRequest()
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var txt=xhttp.responseText
			defconfig(txt)
			document.addEventListener('mousemove', logKey);
			//var orig=baseDatatPath+'Local/'+lang+'/lang-'+lang+'.txt'
			var orig='./Local/'+lang+'/lang-'+lang+'.txt'
			importLang(orig)
			defInterface()
			symbCreate()
			upDateWorkSpace(1)
			defautProjet()
			defautSpace()
			defautExterne()
		}
	}
	xhttp.open("GET", name, true)
	xhttp.send()
}
function defconfig(conf) {
	var defc=conf.split("\n")
	lang=defc[0]
   setTimeRegle=JSON.parse(defc[1])
	setSignRegle=JSON.parse(defc[2])
   setGrille=JSON.parse(defc[3])
   spaceSeconde=JSON.parse(defc[4])
  zoomScale=parseFloat(defc[5])
  baseSpaceHeight=parseFloat(defc[6])
  baseSpaceWidth=parseFloat(defc[7])
  ratioSpaceHeight=parseFloat(defc[8])
  listenerForwardX=defc[9]
  listenerForwardY=defc[10]
  listenerForwardZ=defc[11]
  listenerUpX=defc[12]
  listenerUpY=defc[13]
  listenerUpZ=defc[14]
  listenerPositionX=defc[15]
  listenerPositionY=defc[16]
  listenerPositionZ=defc[17]
  pannerPanningModel = defc[18]
  pannerDistanceModel = defc[19]
  pannerRefDistance = defc[20]
  pannerMaxDistance = defc[21]
  pannerRolloffFactor = defc[22]
  pannerConeInnerAngle = defc[23]
  pannerConeOuterAngle =defc[24]
  pannerConeOuterGain = defc[25]
  pannerOrientationX=defc[26]
  pannerOrientationY=defc[27]
  pannerOrientationZ=defc[28]
  baseFontSize=defc[29]
  paletteBkg=defc[30]
  fontPalette=defc[31]
  fontPaletteSize=defc[32]
  separateurPalette=defc[33]
  bkgInfo=defc[34]
  fontInfoSize=defc[35]
  fontInfoColor=defc[36]
  regleBackground=defc[37]
  regleFontSize=parseFloat(defc[38])
  regleFontColor=defc[39]
  intervalBackground=defc[40]
  intervalFontSize=defc[41]
  fontIntervalColor=defc[42]
  workSpaceBkg=defc[43]
  spaceGrilleOpacity=parseFloat(defc[44])
  colorGrille=defc[45]
  suiveurBkg=defc[46]
  popupTitreBkg=defc[47]
  popupHeaderFontSize=defc[48]
  popupFontTitreColor=defc[49]
  popupFontColor=defc[50]
  popupBkgColor=defc[51]
  popupFontSize=defc[52]
  popupOngletFontColor=defc[53]
  popupFontOngletSize=defc[54]
  popupOngletBkg=defc[55]
  popupOngletActifBkg=defc[56]
  windowOuterWidth=defc[57]
  windowOuterHeight=defc[58]
  path=defc[591]
  imgDirectory=defc[60]
  audioDirectory=defc[61]
  spat3D=defc[62]
  spat3DCanaux=defc[63]
  editor=defc[64]
  paletteDisque=defc[65]
  paletteCarre=defc[66]
  paletteTriangle=defc[67]
  paletteEllipse=defc[68]
  paletteRectangle=defc[69]
  paletteTrianglelong=defc[70]
  paletteRondlong=defc[71]
  paletteCarrelong=defc[72]
  paletteCrescendo=defc[73]
  paletteLigne=defc[74]
  paletteGlissando=defc[75]
  paletteBlock=defc[76]
  paletteDecresc=defc[77]
  paletteDecrescb=defc[78]
  paletteCresc=defc[79]
  paletteCrescb=defc[80]
  paletteAgregat=defc[81]
  paletteArpege=defc[82]
  paletteMultilignes=defc[83]
  paletteNuage=defc[84]
  paletteTexture=defc[85]
  paletteImage=defc[86]
  paletteSymb=defc[87]
  paletteFleche=defc[88]
  paletteMarque1=defc[89]
  paletteMarque2=defc[90]
  paletteLecteur=defc[91]
  regleSvgFontSize=defc[92]
  regleSvgFontColor=defc[93]
  vueSvgGrille=defc[94]
  vueSvgGrilleColor=defc[95]
  vueSvgGrilleOpacity=defc[96]
  vueSvgBackground=defc[97]
  vueSvgFontSize=defc[98]
  vueSvgFontColor=defc[99]
  vueSvgRegle=defc[100]
  vueSvgMesure=defc[101]
  svgSeconde=defc[102]
  setTimeRegleSvg=defc[103]
  setSignRegleSvg=defc[104]
  winWidth=defc[105]
  winHeight=defc[106]
  daw=parseInt(defc[107])
  cmdDaw=defc[108]
  pdfPage=parseFloat(defc[109])
  pdfScale=parseFloat(defc[110])
  pdfMgTop=parseFloat(defc[111])
  pdfMgBot=parseFloat(defc[112])
  pdfMgLeft=parseFloat(defc[113])
  pdfMgRight=parseFloat(defc[114])
  pdfBkg=parseInt(defc[115])
  pdfAssCmd=defc[116]
  pdfAppCmd=defc[117]
}

dragElement(document.getElementById("listNewFx"));
dragElement(document.getElementById("popupParamFx"));
dragElement(document.getElementById("popupParam"));

let idFxParam=0

defSelectListeFx()

const loadScript = (FILE_URL, async = true, type = "text/javascript") => {
    return new Promise((resolve, reject) => {
        try {
            const scriptEle = document.createElement("script");
            scriptEle.type = type;
            scriptEle.async = async;
            scriptEle.src =FILE_URL;

            scriptEle.addEventListener("load", (ev) => {
                resolve({ status: true });
            });

            scriptEle.addEventListener("error", (ev) => {
                reject({
                    status: false,
                    message: `Failed to load the script ＄{FILE_URL}`
                });
            });

            document.body.appendChild(scriptEle);
        } catch (error) {
            reject(error);
        }
    });
};
/*
for (var i in listeFx){
	if(listeFx[i].greffon){
	loadScript("./greffons/"+listeFx[i].greffon+".js")
	.then( data  => {
        //console.log("Script loaded successfully", data);
    })
    .catch( err => {
        console.error(err);
    });
    }
}
*/
window.api.receive("fromMain", (data) => {
	var nsize=data
	var cmd=data.split(";")
	switch(cmd[0]){
			case 'dconfig':
				baseDatatPath=cmd[1]
				importUconfig()
				break
			case 'audioImport':
				loadSoundTableBuffer(cmd[1],cmd[2],parseInt(cmd[3]),parseInt(cmd[4]))
				break
			case 'audioPreDefImport':
				loadPreDefSound(cmd[1],cmd[2])
				break
			case 'audioMute':
				audioMute(cmd[1],cmd[2])
				break
			case 'preDefMute':
				preDefMute(cmd[1],cmd[2])
				break
			case 'audioGain':
				audioGain(cmd[1],cmd[2])
				break
			case 'defReverse':
				defReverse(cmd[1],cmd[2])
				break
			case 'preDefGain':
				preDefGain(cmd[1],cmd[2])
				break
			case 'audioEnvType':
				audioEnvType(cmd[1],cmd[2])
				break
			case 'preDefEnvType':
				preDefEnvType(cmd[1],cmd[2])
				break
			case 'audioFlagTranspo':
				audioFlagTranspo(cmd[1],cmd[2])
				break
			case 'preDefFlagTranspo':
				preDefFlagTranspo(cmd[1],cmd[2])
				break
			case 'audioDetune':
				audioDetune(cmd[1],cmd[2])
				break
			case 'preDefDetune':
				preDefDetune(cmd[1],cmd[2])
				break
			case 'audioDebut':
				audioDebut(cmd[1],cmd[2])
				break
			case 'preDefDebut':
				preDefDebut(cmd[1],cmd[2])
				break
			case 'audioFin':
				audioFin(cmd[1],cmd[2])
				break
			case 'preDefFin':
				preDefFin(cmd[1],cmd[2])
				break
			case 'audioNom':
				audioNom(cmd[1],cmd[2])
				break
			case 'preDefNom':
				preDefNom(cmd[1],cmd[2])
				break
			case 'preDefColor':
				preDefColor(cmd[1],cmd[2])
				break
			case 'audioPiste':
				audioPiste(cmd[1],cmd[2])
				break
			case 'preDefPiste':
				preDefPiste(cmd[1],cmd[2])
				break
			case 'audioConvolver':
				audioConvolver(cmd[1],cmd[2])
				break
			case 'preDefConvolver':
				preDefConvolver(cmd[1],cmd[2])
				break
			case 'audioEnv':
				audioEnv(cmd[1],cmd[2],cmd[3],cmd[4])
				break
			case 'preDefEnv':
				preDefEnv(cmd[1],cmd[2],cmd[3],cmd[4])
				break
			case 'tempoAudio':
				tempoAudio()
				break
			case 'objetRayon':
				objetRayon(cmd[1],cmd[2])
				break
			case 'objetScaleGrpXY':
				objScaleGrpXY(cmd[1],cmd[2])
				break
			case 'objetScaleXY':
				objScaleXY(cmd[1],cmd[2])
				break
			case 'objetScaleX':
				objScaleX(cmd[1],cmd[2])
				break
			case 'objetScaleY':
				objScaleY(cmd[1],cmd[2])
				break
			case 'objetScaleY2':
				objScaleY2(cmd[1],cmd[2])
				break
			case 'objetOpacity':
				objetOpacity(cmd[1],cmd[2])
				break
			case 'bkgOpacity':
				bkgOpacity(cmd[1],cmd[2])
				break
			case 'bkgGrpOpacity':
				bkgGrpOpacity(cmd[1],cmd[2])
				break	
			case 'bkgTransparent':
				bkgTransparent(cmd[1])
				break
			case 'bkgGrpTransparent':
				bkgGrpTransparent(cmd[1])
				break
			case 'objColor':
				objetRColor(cmd[1],cmd[2])
				break
			case 'symbColor':
				symbColor(cmd[1],cmd[2])
				break
			case 'grpBkgColor':
				grpBkgColor(cmd[1],cmd[2])
				break
			case 'symbRotate':
				symbRotate(cmd[1],cmd[2])
				break
			case 'objRotate':
				objRotate(cmd[1],cmd[2])
				break
			case 'symbWidth':
				symbWidth(cmd[1],cmd[2])
				break
			case 'symbHeight':
				symHeight(cmd[1],cmd[2])
				break
			case 'bkgNColor':
				objetBkgNColor(cmd[1],cmd[2])
				break
			case 'defBkgImg':
				objetBkgImg(cmd[1],cmd[2])
				break
			case 'defBkgGrpImg':
				bkgGrpImg(cmd[1],cmd[2])
				break
			case 'defSymbBkgImg':
				objetBkgImg(cmd[1],cmd[2])
				break
			case 'bkgWidth':
				objetBkgWidth(cmd[1],cmd[2])
				break
			case 'bkgHeight':
				objetBkgHeight(cmd[1],cmd[2])
				break
			case 'bkgGrpWidth':
				grpBkgWidth(cmd[1],cmd[2])
				break
			case 'bkgGrpHeight':
				grpBkgHeight(cmd[1],cmd[2])
				break
			case 'symbBkgWidth':
				symbBkgWidth(cmd[1],cmd[2])
				break
			case 'symbBkgHeight':
				symbBkgHeight(cmd[1],cmd[2])
				break
			case 'symbMGauche':
				symbMGauche(cmd[1],cmd[2])
				break
			case 'symbMHaut':
				symbMHaut(cmd[1],cmd[2])
				break
			case 'defBordureWidth':
				objetBordureWidth(cmd[1],cmd[2])
				break
			case 'defBordureColor':
				objetBordureColor(cmd[1],cmd[2])
				break
			case 'defGraphParam':
				objetToGraphParams(cmd[1])
				var txt=objetGrapĥToString(cmd[1])
				var ntxt="defWinGraphObj;"+cmd[1]+";"+lang+";"+txt+";"+tableObjet[cmd[1]].type							
	     		window.api.send("toMain", ntxt);
				break
			case 'objGraphAnnul':
				objetRestorGraph(cmd[1])
				var ntxt="objWinGraphAnnul;"+cmd[1]							
	     		window.api.send("toMain", ntxt);
				break
			case 'defMargeGauche':
				objetPlGauche(cmd[1],cmd[2])
				break
			case 'defMargeHaut':
				objetPlHaut(cmd[1],cmd[2])
				break
			case 'grpNom':
				grpNom(cmd[1],cmd[2])
				break
			case 'grpMGauche':
				grpPlGauche(cmd[1],cmd[2])
				break
			case 'grpMHaut':
				grpPlHaut(cmd[1],cmd[2])
				break
			case 'defGaucheType':
				borderGaucheType(cmd[1],cmd[2])
				break
			case 'defGaucheColor':
				borderGaucheColor(cmd[1],cmd[2])
				break
			case 'defGaucheWidth':
				borderGaucheWidth(cmd[1],cmd[2])
				break
			case 'defGaucheRadius':
				borderGaucheRadius(cmd[1],cmd[2])
				break
			case 'defHautType':
				borderHautType(cmd[1],cmd[2])
				break
			case 'defHautColor':
				borderHautColor(cmd[1],cmd[2])
				break
			case 'defHautWidth':
				borderHautWidth(cmd[1],cmd[2])
				break
			case 'defHautRadius':
				borderHautRadius(cmd[1],cmd[2])
				break
			case 'defDroitType':
				borderDroitType(cmd[1],cmd[2])
				break
			case 'defDroitColor':
				borderDroitColor(cmd[1],cmd[2])
				break
			case 'defDroitWidth':
				borderDroitWidth(cmd[1],cmd[2])
				break
			case 'defDroitRadius':
				borderDroitRadius(cmd[1],cmd[2])
				break
			case 'defBasType':
				borderBasType(cmd[1],cmd[2])
				break
			case 'defBasColor':
				borderBasColor(cmd[1],cmd[2])
				break
			case 'defBasWidth':
				borderBasWidth(cmd[1],cmd[2])
				break
			case 'defBasRadius':
				borderBasRadius(cmd[1],cmd[2])
				break
			case 'grpGaucheType':
				borderGrpGType(cmd[1],cmd[2])
				break
			case 'grpGaucheColor':
				borderGrpGColor(cmd[1],cmd[2])
				break
			case 'grpGaucheWidth':
				borderGrpGWidth(cmd[1],cmd[2])
				break
			case 'grpGaucheRadius':
				borderGrpGRadius(cmd[1],cmd[2])
				break
			case 'grpHautType':
				borderGrpHType(cmd[1],cmd[2])
				break
			case 'grpHautColor':
				borderGrpHColor(cmd[1],cmd[2])
				break
			case 'grpHautWidth':
				borderGrpHWidth(cmd[1],cmd[2])
				break
			case 'grpHautRadius':
				borderGrpHRadius(cmd[1],cmd[2])
				break
			case 'grpDroitType':
				borderGrpDType(cmd[1],cmd[2])
				break
			case 'grpDroitColor':
				borderGrpDColor(cmd[1],cmd[2])
				break
			case 'grpDroitWidth':
				borderGrpDWidth(cmd[1],cmd[2])
				break
			case 'grpDroitRadius':
				borderGrpDRadius(cmd[1],cmd[2])
				break
			case 'grpBasType':
				borderGrpBType(cmd[1],cmd[2])
				break
			case 'grpBasColor':
				borderGrpBColor(cmd[1],cmd[2])
				break
			case 'grpBasWidth':
				borderGrpBWidth(cmd[1],cmd[2])
				break
			case 'grpBasRadius':
				borderGrpBRadius(cmd[1],cmd[2])
				break
			case 'coller':
				coller()
				break
			case 'copier':
				copier()
				break
			case 'couper':
				couper()
				break
			case 'grouper':
				grouper()
				break
			case 'deGrouper':
				deGrouper()
				break
			case 'newProject':
				newProject()
				break
			case 'loadProjet':
				loadProjet(cmd[1])
				break
			case 'loadGrp':
				loadGrp(cmd[1])
				break
			case 'reGrouper':
				reGrouper()
				break
			case 'toutDeGrouper':
				toutDegrouper()
				break
			case 'grpColor':
				defGrpColor()
				break
			case 'grpForme':
				defGrpForme()
				break
			case 'grpScale':
				defScaleGrp()
				break
			case 'topAlign':
				topAlign()
				break
			case 'leftAlign':
				leftAlign()
				break
			case 'bottomAlign':
				bottomAlign()
				break
			case 'rightAlign':
				rightAlign()
				break
			case 'descendre':
				zDescendre()
				break
			case 'toutBas':
				zToutBas()
				break
			case 'monter':
				zMonter()
				break
			case 'toutHaut':
				zToutHaut()
				break
			case 'augmDim':
				augmDim()
				break
			case 'permut':
				permutLineaire()
				break
			case 'palindrome':
				palindrome()
				break
			case 'inclusion':
				inclusion()
				break
			case 'renversement':
				renversement()
				break
			case 'retrograde':
				retrograde()
				break
			case 'renvRetro':
				renvRetro()
				break
			case 'saveGrp':
				saveGrp()
				break
			case 'saveProjet':
				saveProjet(cmd[1])
				break
			case 'zoom':
				zoomInit(cmd[1])
				break
			case 'winSize':
				winResize(cmd[1])
				break
			case 'annulModifObj':
				//Object.assign(tableObjet[cmd[1]],saveObjet)
				//tableObjet[cmd[1]]=structuredClone(saveObjet)
				break
			case 'validModifObj':
				//objetStringDefParams(cmd[1],cmd[2])
				break
			case 'renduObjet':
				renderObjeteAudio();//readSimpleAudioA(1)
				break
			case 'renduGrp':
				renderGrpAudio()
				break
			case 'renduIntervalle':
				renderIntervalleAudio()
				break
			case 'renduPart':
				renderPartAudio()
				break
			case 'exportProjet':
				importProjet(cmd[1])
				importConfigProjet()
				break
			case 'renameProjet':
				renameProjet(cmd[1])
				break
			case 'exportSpace':
				importSpace(cmd[1])
				importConfigSpace()
				break
			case 'exportExterne':
				importExterne(cmd[1])
				break
			case 'exportInterface':
				importInterface(cmd[1])
				defInterface()
				break
			case 'exportPalette':
				importPalette(cmd[1])
				break
			case 'configProjet':
				exportConfig()
				break
			case 'configSave':
				configSave(cmd[1])
				break
			case 'defTheme':
				defTheme()
				break
			case 'selectTheme':
				selectTheme(cmd[1])
				break
			case 'spatialspXZ':
				spatialspXZ(cmd[1],cmd[2],cmd[3],cmd[4])
				break
			case 'spatialspZY':
				spatialspZY(cmd[1],cmd[2],cmd[3],cmd[4])
				break
			case 'spatialspXY':
				spatialspXY(cmd[1],cmd[2],cmd[3],cmd[4])
				break
			case 'spatialspT':
				spatialspT(cmd[1],cmd[2],cmd[3])
				break
			case 'spatialspD':
				spatialspD(cmd[1],cmd[2],cmd[3])
				break
			case 'createSpatialPoint':
				createSpatialPoint(cmd[1],cmd[2],cmd[3])
				break
			case 'openListeFx':
				openListeFx()
				break
			case 'openStudio':
				vueStudio=1
				break
			case 'defSelectImg':
				defSelectImg(cmd[1])
				break
			case 'renduObjSvg':
				vueImageSvg(cmd[1])
				break
			case 'renduGrpSvg':
				vueGrpSvg(1)
				break
			case 'renduPartSvg':
				vuePartSvg(0)
				break
			case 'exportIntv':
				exportIntv()
				break
			case 'exportObj':
				exportObj()
				break
			case 'exportGrp':
				exportGrp()
				break
			case 'exportPart':
				exportPart(0)
				break
			case 'exportAdm':
				exportAdm(1)
				break
			case 'createPdf':
				createPdf()
				break
			case 'waveForm':
				waveSvgForm(parseFloat(cmd[1]),parseFloat(cmd[2]))
				break
			case 'substituerFx':
				renderFxAudio()
				break
			case 'dureeReelle':
				objActif=parseInt(cmd[1])
				voirLength()
				break
			case 'defPosition':
				defPosition(cmd[1],cmd[2])
				break
			case 'transpoToPosY':
				transpoToPosY(cmd[1],cmd[2])
				break
			case 'listeAudios':
				listeAudios()
				break
			case 'interpreteur':
				testInterpreteur(cmd[1])
				break
			case 'spectrogram':
				spectrogram()
				break
			default :			

				break
	}         
});


function winResize(param) {
	var dt=param.split(',')
	mainwinWidth=dt[0]
	mainwinheight=dt[1]
	upDateWorkSpace(0)
}
document.getElementById("regle").addEventListener('click',selectBkgObj)

function appZoom(param) {
		
}
function initProject(){
	tableObjet=[]
	tableBuffer=[];
	selectObjet=''
	objActif=1048576
	nbObjets=0
	saveObjet={}
	nselector=0
	grpSelect=0
	lsgrp=[]
	preservSelect=[]
	inclusionEtat=0
	copySelect=[]
	document.getElementById("space").innerHTML=""
	document.getElementById("space").innerHTML="<div id='selector' style='position:absolute;top:0px;left:0px;width:10px;height:10px;border: 1px dashed #000000;display:none;z-index:10;'></div><div id='vueLength'  style='position:absolute; top:30px;left:0px;padding:0px;margin:0px;width:20px;height:4px;background-color:red;z-index:6;display:none'></div>"
	if(setGrille==1){
		grilleSpace(zoomScale,"space",colorGrille)
	}
	playerDebut()
}
function newProject() {
	initProject()
	exportConfig()
}

window.addEventListener(
  "keydown",
  function (event) {
	  	if(event.key=="Delete"){
	  		couper()
	  	}
  	},
  true,
);

function selectBkgObj(e){
	if (e.button==0){
		if(e.target.id=='space'){
			if(nselector==1){
				nselector=0
				document.getElementById("selector").style.display="none";
			}
		}
		if(e.target.parentNode.id=='regle'){
			document.getElementById("barVerticale").style.left=(e.x-206+scrollDemo.scrollLeft)+"px"
			barverticTime=defMoveLecture(1)-1
		} 
		if (e.target.parentNode.parentNode.id.substring(0,5)=="objet"){	
     		selectObj=e.target.parentNode.parentNode.id;
   		objActif=parseInt(selectObj.substring(5));

	     
     	}
     	if (e.target.parentNode.parentNode.id.substring(0,3)=="grp"){	
     		selectObj=e.target.parentNode.parentNode.id;
   		objActif=parseInt(selectObj.substring(3));
	     
     	}
     	if(inclusionEtat==1 && tableObjet[objActif].class==4){
   		selectObj=e.target.id;
   		objActif=parseInt(selectObj.substring(3));
			inclusionRet();
		}
   }else if(e.button==2){
		if (e.target.id=="space"){												// si click droit sur l'espace de travail => popup menu   	
	     window.api.contextmenu("showmenu","")
     	}
     	if (e.target.id.substring(0,5)=="objet"){
     		if(selectObj!=e.target.id){
     			selectObj=e.target.id;
   			objActif=parseInt(selectObj.substring(5));
   			if(tableObjet[objActif].class==1){
   				window.api.send("toMain", 'objParamClose')
   			}
     	   }
     	   let id=e.target.id.substring(5)
     	 	objetSaveParams(id)
     	 	nselector=0
      	grpSelect=0
      	if(tableObjet[objActif].file=="" || tableObjet[objActif].file==undefined){
     	 		var ntxt="openObjetParam;"+id+";"+lang+";"+objetParamsToString(objActif)+";0;"+tableObjet[objActif].class+";"+parseFloat(document.getElementById("tempo").value);
     	 	}else{
     	 		var ntxt="openObjetParam;"+id+";"+lang+";"+objetParamsToString(objActif)+";"+tableBuffer[tableObjet[objActif].bufferId].buffer.numberOfChannels+";"+tableObjet[objActif].class+";"+parseFloat(document.getElementById("tempo").value);
     	 	}	
	      window.api.send("toMain", ntxt );
	      
     	}
     	if (e.target.parentNode.id.substring(0,5)=="objet"){
     		if(e.target.parentNode.id!="space"){
     			selectObj=e.target.parentNode.id
     			/*
	     		if(selectObj!=e.target.parentNode.id){
	     			selectObj=e.target.parentNode.id;
	   			objActif=parseInt(selectObj.substring(5));
	   			if(tableObjet[objActif].class==1){
	   				window.api.send("toMain", 'objParamClose')
	   			}
	     	   }
	     	   */
	     	   let id=e.target.parentNode.id.substring(5)
	     	 	objetSaveParams(id)
	     	 	nselector=0
	      	grpSelect=0
	      	objActif=e.target.parentNode.id.substring(5)
	      	if(tableObjet[e.target.parentNode.id.substring(5)].class==1){
		      	if(tableObjet[objActif].file=="" || tableObjet[objActif].file==undefined){
		     	 		var ntxt="openObjetParam;"+id+";"+lang+";"+objetParamsToString(objActif)+";0;"+tableObjet[objActif].class+";"+parseFloat(document.getElementById("tempo").value)
		     	 	}else{
		     	 		var ntxt="openObjetParam;"+id+";"+lang+";"+objetParamsToString(objActif)+";"+tableBuffer[tableObjet[objActif].bufferId].buffer.numberOfChannels+";"+tableObjet[objActif].class+";"+parseFloat(document.getElementById("tempo").value)
		     	 	}
		     	 	
	     	 	}
	     	 	if(tableObjet[objActif].class==3){
		     	 	var ntxt="openSymbParam;"+id+";"+lang+";"+objetGrapĥToString(objActif)+";"+tableObjet[objActif].type
	     	 	}
		      window.api.send("toMain", ntxt );
	   	}
	   	
     	}
     	if (e.target.parentNode.parentNode.id.substring(0,5)=="objet"){
     		/*
     		if(selectObj && selectObj!=e.target.parentNode.parentNode.id){
     			selectObj=e.target.parentNode.parentNode.id;
   			objActif=parseInt(selectObj.substring(5));
   			if(tableObjet[objActif].class==1){
   				window.api.send("toMain", 'objParamClose')
   			}
     	   }
     	   */
     	   let id=parseInt(e.target.parentNode.parentNode.id.substring(5))
     	   selectObj="objet"+id
     	   if(id==objActif){
	     	 	objetSaveParams(id)
	     	 	nselector=0
	      	grpSelect=0
	      	if(tableObjet[objActif].file=="" || tableObjet[objActif].file==undefined){
	     	 		var ntxt="openObjetParam;"+objActif+";"+lang+";"+objetParamsToString(objActif)+";0;"+tableObjet[objActif].class+";"+parseFloat(document.getElementById("tempo").value)
	     	 	}else{
	     	 		var ntxt="openObjetParam;"+objActif+";"+lang+";"+objetParamsToString(objActif)+";"+tableBuffer[tableObjet[objActif].bufferId].buffer.numberOfChannels+";"+tableObjet[objActif].class+";"+parseFloat(document.getElementById("tempo").value)
	     	 	}
	     	 	window.api.send("toMain", 'objGraphValid')

		      window.api.send("toMain", ntxt );
	      }else{
	      	window.api.send("toMain", 'objParamChange')
	      	objActif=id
	      	objetSaveParams(id)
	     	 	nselector=0
	      	grpSelect=0
	      	if(tableObjet[objActif].file=="" || tableObjet[objActif].file==undefined){
	     	 		var ntxt="openObjetParam;"+id+";"+lang+";"+objetParamsToString(objActif)+";0;"+tableObjet[objActif].class+";"+parseFloat(document.getElementById("tempo").value)
	     	 	}else{
	     	 		var ntxt="openObjetParam;"+id+";"+lang+";"+objetParamsToString(objActif)+";"+tableBuffer[tableObjet[objActif].bufferId].buffer.numberOfChannels+";"+tableObjet[objActif].class+";"+parseFloat(document.getElementById("tempo").value)
	     	 	}	
		      window.api.send("toMain", ntxt );
	      }
     	}
     	if (e.target.parentNode.parentNode.parentNode.id.substring(0,5)=="objet"){
     		if(selectObj!=e.target.parentNode.parentNode.parentNode.id){
     			selectObj=e.target.parentNode.parentNode.parentNode.id;
   			objActif=parseInt(selectObj.substring(5));
   			if(tableObjet[objActif].class==1){
   				window.api.send("toMain", 'objParamClose')
   			}
     	   }
     	   let id=e.target.parentNode.parentNode.parentNode.id.substring(5)
     	 	objetSaveParams(id)
     	 	nselector=0
      	grpSelect=0
      	if(tableObjet[objActif].class==1){
	      	if(tableObjet[objActif].file=="" || tableObjet[objActif].file==undefined){
	     	 		var ntxt="openObjetParam;"+id+";"+objetGrapĥToString(objActif)+";"+tableObjet[objActif].type+";"+tableObjet[objActif].class+";"+parseFloat(document.getElementById("tempo").value)
	     	 	}else{
	     	 		var ntxt="openObjetParam;"+id+";"+objetGrapĥToString(objActif)+";"+tableObjet[objActif].type+";"+tableObjet[objActif].class+";"+parseFloat(document.getElementById("tempo").value)
	     	 	}
	     	 }
     	 	if(tableObjet[objActif].class==3){
		     	 	var ntxt="openSymbParam;"+id+";"+lang+";"+objetGrapĥToString(objActif)+";"+tableObjet[objActif].type
	     	}					
	      window.api.send("toMain", ntxt );
     	}
     	if(e.target.id.substring(0,3)=="grp"){
     		selectObj=e.target.id;
   		objActif=parseInt(selectObj.substring(3));
   		if(tableObjet[objActif].class==4){
   			objetSaveParams(objActif)
   			var ntxt="openGrpParam;"+objActif+";"+lang+";"+grpGrapĥToString(objActif)				
		      window.api.send("toMain", ntxt );
   		}
			if(tableObjet[objActif].class==2){
   			objetSaveParams(objActif)
   			var ntxt="openPreDef;"+objActif+";"+lang+";"+preDefToString(objActif)					
		      window.api.send("toMain", ntxt );
   		}
     		/*
     		console.log("type",tableObjet[objActif].type)
     		let id=e.target.id.substring(3)
     		switch(tableObjet[objActif].type) {
     		case 18:	
	     	 	objetSaveParams(id)
	     	 	nselector=0
	      	grpSelect=0
	     	   var ntxt="openObjetParam;"+id+";"+objetParamsToString(id)+";"+tableObjet[objActif].type	+";1"							
		      window.api.send("toMain", ntxt );
		      break
		   case 19:	
	     	 	objetSaveParams(id)
	     	 	nselector=0
	      	grpSelect=0
	     	   var ntxt="openObjetParam;"+id+";"+objetParamsToString(id)+";"+tableObjet[objActif].type	+";1"								
		      window.api.send("toMain", ntxt );
		      break
		   case 20:
	     	 	objetSaveParams(id)
	     	 	nselector=0
	      	grpSelect=0
	     	   var ntxt="openObjetParam;"+id+";"+objetParamsToString(id)+";"+tableObjet[objActif].type	+";1" 								
		      window.api.send("toMain", ntxt );
		      break
		   case 22:	
	     	 	objetSaveParams(id)
	     	 	nselector=0
	      	grpSelect=0
	     	   var ntxt="openObjetParam;"+id+";"+objetParamsToString(id)+";"+tableObjet[objActif].type	+";1" 									
		      window.api.send("toMain", ntxt );
		      break
	      }
	      */
     	}
   }
}
function defautProjet(){
	paramProjet={}
		paramProjet={
		name:"",
		start:"",
		end:"",
		comment:"",
		path:"",
		audioPath:"",
		imgPath:"",
		greffon3D:"",
		greffonC:18,
		regle:true,
		mesure:true,
		grille:true,
		spaceSeconde:true,
		width:1510,
		height:870,
		zoom:1,
		svgRegle:false,
		svgMesure:false,
		svgGrille:false,
		svgSeconde:false
	}
}
function defautSpace(){
	paramSpace={}
		paramSpace={
		lForwardX:0,
		lForwardY:0,
		lForwardZ:-1,
		lUpX:0,
		lUpY:1,
		lUpZ:0,
		lPosX:0,
		lPosY:0,
		lPosZ:0,
		PModel:'equalpower',
		DModel:'linear',
		refD:1,
		maxD:10000,
		rolF:1,
		coneIA:360,
		coneOA:0,
		coneOG:0,
		orX:1,
		orY:0,
		orZ:0
	}
}
function defautExterne() {
	daw=0
	cmdDaw=''
	pdfPage=0
	pdfLandscape=1
	pdfScale=1
	pdfMgTop=0.2
	pdfMgBot=0.2
	pdfMgLeft=0.2
	pdfMgRight=0.2
	pdfBkg=0
	pdfAssCmd=''
	pdfAppCmd=''
	editAudioCmd=''
}
function exportConfig() {

var txt=paramProjet.name+","+paramProjet.start+","+paramProjet.end+","+paramProjet.comment+","+paramProjet.path+","+paramProjet.audioPath+","+paramProjet.imgPath+","+paramProjet.greffon3D+","+paramProjet.greffonC+","+paramProjet.regle+","+paramProjet.mesure+","+paramProjet.grille+","+paramProjet.width+","+paramProjet.height+","+paramProjet.zoom+","+paramProjet.svgRegle+","+paramProjet.svgMesure+","+paramProjet.svgGrille+","+paramProjet.spaceSeconde+","+paramProjet.svgSeconde

var txt2=paramSpace.lForwardX+","+paramSpace.lForwardY+","+paramSpace.lForwardZ+","+paramSpace.lUpX+","+paramSpace.lUpY+","+paramSpace.lUpZ+","+paramSpace.lPosX+","+paramSpace.lPosY+","+paramSpace.lPosZ+","+paramSpace.PModel+","+paramSpace.DModel+","+paramSpace.refD+","+paramSpace.maxD+","+paramSpace.rolF+","+paramSpace.coneIA+","+paramSpace.coneOA+","+paramSpace.coneOG+","+paramSpace.orX+","+paramSpace.orY+","+paramSpace.orZ
var txt3=paletteBkg+":"+fontPalette+":"+ fontPaletteSize+":"+ separateurPalette+":0:"+ bkgInfo+":"+ fontInfoSize+":"+ fontInfoColor+":"+ regleBackground+":"+ regleFontSize+":"+ regleFontColor+":"+ intervalBackground+":"+ intervalFontSize+":"+ fontIntervalColor+":"+ workSpaceBkg+":"+ spaceGrilleOpacity+":"+ colorGrille+":"+ suiveurBkg+":"+ popupTitreBkg+":"+ popupHeaderFontSize+":"+ popupFontTitreColor+":"+ popupFontColor+":"+ popupBkgColor+":"+ popupFontSize+":"+ popupOngletFontColor+":"+ popupFontOngletSize+":"+ popupOngletBkg+":"+popupOngletActifBkg+":"+lang+":"+ vueSvgBackground+":"+vueSvgFontSize+":"+vueSvgFontColor
var txt4=paletteDisque+","+paletteCarre+","+paletteTriangle+","+paletteEllipse+","+paletteRectangle+","+paletteTrianglelong+","+paletteRondlong+","+paletteCarrelong+","+paletteCrescendo+","+paletteLigne+","+paletteGlissando+","+paletteBlock+","+paletteDecresc+","+paletteDecrescb+","+paletteCresc+","+paletteCrescb+","+paletteAgregat+","+paletteArpege+","+paletteMultilignes+","+paletteNuage+","+paletteTexture+","+paletteImage+","+paletteSymb+","+paletteFleche+","+paletteMarque1+","+paletteMarque2+","+paletteLecteur

txt5=editor+','+daw+','+cmdDaw+','+pdfPage+','+pdfLandscape+','+pdfScale+','+pdfMgTop+','+pdfMgBot+','+pdfMgLeft+','+pdfMgRight+','+pdfBkg+','+pdfAssCmd+','+pdfAppCmd+','+editAudioCmd

window.api.send("toMain", 'configProjet;'+lang+";"+txt+";"+txt2+";"+txt3+";"+txt4+";"+txt5)
}
function objetParamsToString(id) {
	var txt=tableObjet[id].basePosY+":"+tableObjet[id].bkgColor+":"+tableObjet[id].bkgHeight+":"+tableObjet[id].bkgImg+":"+tableObjet[id].bkgOpacity+":"+tableObjet[id].bkgTrp+":"+tableObjet[id].bkgWidth+":"+tableObjet[id].borderBc+":"+tableObjet[id].borderBr+":"+tableObjet[id].borderBs+":"+tableObjet[id].borderBw+":"+tableObjet[id].borderDc+":"+tableObjet[id].borderDr+":"+tableObjet[id].borderDs+":"+tableObjet[id].borderDw+":"+tableObjet[id].borderGc+":"+tableObjet[id].borderGr+":"+tableObjet[id].borderGs+":"+tableObjet[id].borderGw+":"+tableObjet[id].borderHc+":"+tableObjet[id].borderHr+":"+tableObjet[id].borderHs+":"+tableObjet[id].borderHw+":"+tableObjet[id].buffer+":"+tableObjet[id].class+":"+tableObjet[id].convolver+":"+tableObjet[id].cx+":"+tableObjet[id].cy+":"+tableObjet[id].debut+":"+tableObjet[id].detune+":"+tableObjet[id].duree+":"+tableObjet[id].envType+":"+tableObjet[id].envX+":"+tableObjet[id].envY+":"+tableObjet[id].etat+":"+tableObjet[id].file+":"+tableObjet[id].fin+":"+tableObjet[id].flagTranspo+":"+tableObjet[id].gain+":"+tableObjet[id].height+":"+tableObjet[id].id+":"+tableObjet[id].img+":"+tableObjet[id].margeG+":"+tableObjet[id].margeH+":"+tableObjet[id].mute+":"+tableObjet[id].nom+":"+tableObjet[id].objBorderC+":"+tableObjet[id].objBorderW+":"+tableObjet[id].objColor+":"+tableObjet[id].objOpacity+":"+tableObjet[id].piste+":"+tableObjet[id].posX+":"+tableObjet[id].posY+":"+tableObjet[id].r+":"+tableObjet[id].radius+":"+tableObjet[id].scaleX+":"+tableObjet[id].scaleY+":"+tableObjet[id].spD+":"+tableObjet[id].spT+":"+tableObjet[id].spX+":"+tableObjet[id].spY+":"+tableObjet[id].spZ+":"+tableObjet[id].tableFx+":"+tableObjet[id].tableFxParam+":"+tableObjet[id].transposition+":"+tableObjet[id].type+":"+tableObjet[id].vueDuree+":"+tableObjet[id].x1+":"+tableObjet[id].x2+":"+tableObjet[id].y1+":"+tableObjet[id].y2+":"+tableObjet[id].width+":"+tableObjet[id].reverse
	
	return txt
}
function preDefToString(id) {
	var txt=tableObjet[id].basePosY+":"+tableObjet[id].bkgColor+":"+tableObjet[id].bkgHeight+":"+tableObjet[id].bkgImg+":"+tableObjet[id].bkgOpacity+":"+tableObjet[id].bkgTrp+":"+tableObjet[id].bkgWidth+":"+tableObjet[id].borderBc+":"+tableObjet[id].borderBr+":"+tableObjet[id].borderBs+":"+tableObjet[id].borderBw+":"+tableObjet[id].borderDc+":"+tableObjet[id].borderDr+":"+tableObjet[id].borderDs+":"+tableObjet[id].borderDw+":"+tableObjet[id].borderGc+":"+tableObjet[id].borderGr+":"+tableObjet[id].borderGs+":"+tableObjet[id].borderGw+":"+tableObjet[id].borderHc+":"+tableObjet[id].borderHr+":"+tableObjet[id].borderHs+":"+tableObjet[id].borderHw+":"+tableObjet[id].buffer+":"+tableObjet[id].class+":"+tableObjet[id].convolver+":"+tableObjet[id].cx+":"+tableObjet[id].cy+":"+tableObjet[id].debut+":"+tableObjet[id].detune+":"+tableObjet[id].duree+":"+tableObjet[id].envType+":"+tableObjet[id].envX+":"+tableObjet[id].envY+":"+tableObjet[id].etat+":"+tableObjet[id].file+":"+tableObjet[id].fin+":"+tableObjet[id].flagTranspo+":"+tableObjet[id].gain+":"+tableObjet[id].height+":"+tableObjet[id].id+":"+tableObjet[id].img+":"+tableObjet[id].liste+":"+tableObjet[id].margeG+":"+tableObjet[id].margeH+":"+tableObjet[id].mute+":"+tableObjet[id].nom+":"+tableObjet[id].objBorderC+":"+tableObjet[id].objBorderW+":"+tableObjet[id].objColor+":"+tableObjet[id].objOpacity+":"+tableObjet[id].piste+":"+tableObjet[id].posX+":"+tableObjet[id].posY+":"+tableObjet[id].r+":"+tableObjet[id].radius+":"+tableObjet[id].scaleX+":"+tableObjet[id].scaleY+":"+tableObjet[id].spD+":"+tableObjet[id].spT+":"+tableObjet[id].spX+":"+tableObjet[id].spY+":"+tableObjet[id].spZ+":"+tableObjet[id].tableFx+":"+tableObjet[id].tableFxParam+":"+tableObjet[id].transposition+":"+tableObjet[id].type+":"+tableObjet[id].vueDuree+":"+tableObjet[id].x1+":"+tableObjet[id].x2+":"+tableObjet[id].y1+":"+tableObjet[id].y2+":"+tableObjet[id].width
	
	return txt
}
function objetGrapĥToString(id) {
	var txt=tableObjet[id].bkgColor+":"+tableObjet[id].bkgHeight+":"+tableObjet[id].bkgImg+":"+tableObjet[id].bkgOpacity+":"+tableObjet[id].bkgTrp+":"+tableObjet[id].bkgWidth+":"+tableObjet[id].borderBc+":"+tableObjet[id].borderBr+":"+tableObjet[id].borderBs+":"+tableObjet[id].borderBw+":"+tableObjet[id].borderDc+":"+tableObjet[id].borderDr+":"+tableObjet[id].borderDs+":"+tableObjet[id].borderDw+":"+tableObjet[id].borderGc+":"+tableObjet[id].borderGr+":"+tableObjet[id].borderGs+":"+tableObjet[id].borderGw+":"+tableObjet[id].borderHc+":"+tableObjet[id].borderHr+":"+tableObjet[id].borderHs+":"+tableObjet[id].borderHw+":"+tableObjet[id].cx+":"+tableObjet[id].cy+":"+tableObjet[id].height+":"+tableObjet[id].margeG+":"+tableObjet[id].margeH+":"+tableObjet[id].objBorderC+":"+tableObjet[id].objBorderW+":"+tableObjet[id].objColor+":"+tableObjet[id].objOpacity+":"+tableObjet[id].r+":"+tableObjet[id].rotate+":"+tableObjet[id].scaleX+":"+tableObjet[id].scaleY+":"+tableObjet[id].scaleY2+":"+tableObjet[id].width+":"+tableObjet[id].nom
	return txt
}
function grpGrapĥToString(id) {
	var txt=tableObjet[id].bkgColor+":"+tableObjet[id].bkgHeight+":"+tableObjet[id].bkgImg+":"+tableObjet[id].bkgOpacity+":"+tableObjet[id].bkgTrp+":"+tableObjet[id].bkgWidth+":"+tableObjet[id].borderBc+":"+tableObjet[id].borderBr+":"+tableObjet[id].borderBs+":"+tableObjet[id].borderBw+":"+tableObjet[id].borderDc+":"+tableObjet[id].borderDr+":"+tableObjet[id].borderDs+":"+tableObjet[id].borderDw+":"+tableObjet[id].borderGc+":"+tableObjet[id].borderGr+":"+tableObjet[id].borderGs+":"+tableObjet[id].borderGw+":"+tableObjet[id].borderHc+":"+tableObjet[id].borderHr+":"+tableObjet[id].borderHs+":"+tableObjet[id].borderHw+":"+tableObjet[id].height+":"+tableObjet[id].nom+":"+tableObjet[id].scaleX+":"+tableObjet[id].scaleY+":"+tableObjet[id].width
	return txt
}
function objetStringToParams(id,txt) {
	var tbtxt=txt.split(',')
	tableObjet[id].basePosY=tbtxt[0]
	tableObjet[id].bkgColor=tbtxt[1]
	tableObjet[id].bkgHeight=parseFloat(tbtxt[2])
	tableObjet[id].bkgImg=tbtxt[3]
	tableObjet[id].bkgOpacity=tbtxt[4]
	tableObjet[id].bkgTrp=tbtxt[5]
	tableObjet[id].bkgWidth=parseFloat(tbtxt[6])
	tableObjet[id].borderBc=tbtxt[7]
	tableObjet[id].borderBr=tbtxt[8]
	tableObjet[id].borderBs=tbtxt[9]
	tableObjet[id].borderBw=parseFloat(tbtxt[10])
	tableObjet[id].borderDc=tbtxt[11]
	tableObjet[id].borderDr=tbtxt[12]
	tableObjet[id].borderDs=tbtxt[13]
	tableObjet[id].borderDw=parseFloat(tbtxt[14])
	tableObjet[id].borderGc=tbtxt[15]
	tableObjet[id].borderGr=tbtxt[16]
	tableObjet[id].borderGs=tbtxt[17]
	tableObjet[id].borderGw=parseFloat(tbtxt[18])
	tableObjet[id].borderHc=tbtxt[19]
	tableObjet[id].borderHr=tbtxt[20]
	tableObjet[id].borderHs=tbtxt[21]
	tableObjet[id].borderHw=parseFloat(tbtxt[22])
	tableObjet[id].buffer=tbtxt[23]
	tableObjet[id].class=tbtxt[24]
	tableObjet[id].convolver=tbtxt[25]
	tableObjet[id].cx=tbtxt[26]
	tableObjet[id].cy=tbtxt[27]
	tableObjet[id].debut=tbtxt[28]
	tableObjet[id].detune=tbtxt[29]
	tableObjet[id].duree=tbtxt[30]
	tableObjet[id].envType=tbtxt[31]
	tableObjet[id].envX=tbtxt[32]
	tableObjet[id].envY=tbtxt[33]
	tableObjet[id].etat=tbtxt[34]
	tableObjet[id].file=tbtxt[35]
	tableObjet[id].fin=tbtxt[36]
	tableObjet[id].flagTranspo=tbtxt[37]
	tableObjet[id].gain=tbtxt[38]
	tableObjet[id].height=tbtxt[39]
	tableObjet[id].id=tbtxt[40]
	tableObjet[id].img=tbtxt[41]
	tableObjet[id].margeG=tbtxt[42]
	tableObjet[id].margeH=tbtxt[43]
	tableObjet[id].mute=tbtxt[44]
	tableObjet[id].nom=tbtxt[45]
	tableObjet[id].objBorderC=tbtxt[46]
	tableObjet[id].objBorderW=tbtxt[47]
	tableObjet[id].objColor=tbtxt[48]
	tableObjet[id].objOpacity=tbtxt[49]
	tableObjet[id].piste=tbtxt[50]
	tableObjet[id].posX=tbtxt[51]
	tableObjet[id].posY=tbtxt[52]
	tableObjet[id].r=tbtxt[53]
	tableObjet[id].radius=tbtxt[54]
	tableObjet[id].rotate=tbtxt[55]
	tableObjet[id].scaleX=tbtxt[56]
	tableObjet[id].scaleY=tbtxt[57]
	tableObjet[id].spD=tbtxt[58]
	tableObjet[id].spT=tbtxt[59]
	tableObjet[id].spX=tbtxt[60]
	tableObjet[id].spY=tbtxt[61]
	tableObjet[id].spZ=tbtxt[62]
	tableObjet[id].tableFx=tbtxt[63]
	tableObjet[id].tableFxParam=tbtxt[64]
	tableObjet[id].transposition=tbtxt[65]
	tableObjet[id].type=tbtxt[66]
	tableObjet[id].vueDuree=tbtxt[67]
	tableObjet[id].x1=tbtxt[68]
	tableObjet[id].x2=tbtxt[69]
	tableObjet[id].y1=tbtxt[70]
	tableObjet[id].y2=tbtxt[71]
	tableObjet[id].width=tbtxt[71]
		
}
function objetToGraphParams(id) {
	objGraph={
	bkgColor:tableObjet[id].bkgColor,
	bkgHeight:tableObjet[id].bkgHeight,
	bkgImg:tableObjet[id].bkgImg,
	bkgOpacity:tableObjet[id].bkgOpacity,
	bkgTrp:tableObjet[id].bkgTrp,
	bkgWidth:tableObjet[id].bkgWidth,
	borderBc:tableObjet[id].borderBc,
	borderBr:tableObjet[id].borderBr,
	borderBs:tableObjet[id].borderBs,
	borderBw:tableObjet[id].borderBw,
	borderDc:tableObjet[id].borderDc,
	borderDr:tableObjet[id].borderDr,
	borderDs:tableObjet[id].borderDs,
	borderDw:tableObjet[id].borderDw,
	borderGc:tableObjet[id].borderGc,
	borderGr:tableObjet[id].borderGr,
	borderGs:tableObjet[id].borderGs,
	borderGw:tableObjet[id].borderGw,
	borderHc:tableObjet[id].borderHc,
	borderHr:tableObjet[id].borderHr,
	borderHs:tableObjet[id].borderHs,
	borderHw:tableObjet[id].borderHw,
	cx:tableObjet[id].cx,
	cy:tableObjet[id].cy,
	height:tableObjet[id].height,
	margeG:tableObjet[id].margeG,
	margeH:tableObjet[id].margeH,
	objBorderC:tableObjet[id].objBorderC,
	objBorderW:tableObjet[id].objBorderW,
	objColor:tableObjet[id].objColor,
	objOpacity:tableObjet[id].objOpacity,
	radius:tableObjet[id].radius,
	rayon:tableObjet[id].r,
	rotate:tableObjet[id].rotate,
	scaleX:tableObjet[id].scaleX,
	scaleY:tableObjet[id].scaleY,
	scaleY2:tableObjet[id].scaleY2,
	width:tableObjet[id].width,
	type:tableObjet[id].type
	}
}
function objetStringCopieParams(id) {
	Object.assign(tableObjet[id],refParam) 
}
function objetSaveParams(id) {
	saveObjet={}
	saveObjet=structuredClone(tableObjet[id])
	//Object.assign(saveObjet,tableObjet[id])
	
}
function objetRestorGraph(id) {
	if(tableObjet[id].type!=18 && tableObjet[id].type!=19 && tableObjet[id].type!=20 && tableObjet[id].type!=22){
		var opac=Math.round(objGraph.bkgOpacity*255)
		var ncolor=objGraph.bkgColor+(opac.toString(16))
		document.getElementById(tableObjet[id].id).style.backgroundColor=ncolor
		document.getElementById(tableObjet[id].id).style.width=objGraph.bkgWidth+"px"
		document.getElementById(tableObjet[id].id).style.height=objGraph.bkgHeight+"px"
		document.getElementById(tableObjet[id].id).style.backgroundImage='url('+objGraph.bkgImg+')'
		document.getElementById(tableObjet[id].id).style.backgroundSize=objGraph.bkgWidth+"px "+objGraph.bkgHeight+"px"
		document.getElementById(tableObjet[id].id).style.borderBottomColor=objGraph.borderBc
		document.getElementById(tableObjet[id].id).style.borderBottomLeftRadius=objGraph.bordeBr
		document.getElementById(tableObjet[id].id).style.borderBottomStyle=objGraph.borderBs
		document.getElementById(tableObjet[id].id).style.borderBottomWidth=objGraph.borderBw+"px"
		document.getElementById(tableObjet[id].id).style.borderRightColor=objGraph.borderDc
		document.getElementById(tableObjet[id].id).style.borderBottomRightRadius=objGraph.bordeDr
		document.getElementById(tableObjet[id].id).style.borderRightStyle=objGraph.borderDs
		document.getElementById(tableObjet[id].id).style.borderRightWidth=objGraph.borderDw+"px"
		document.getElementById(tableObjet[id].id).style.borderLeftColor=objGraph.borderGc
		document.getElementById(tableObjet[id].id).style.borderTopLeftRadius=objGraph.borderGr
		document.getElementById(tableObjet[id].id).style.borderLeftStyle=objGraph.borderGs
		document.getElementById(tableObjet[id].id).style.borderLeftWidth=objGraph.borderGw+"px"
		document.getElementById(tableObjet[id].id).style.borderTopColor=objGraph.borderHc
		document.getElementById(tableObjet[id].id).style.borderTopRightRadius=objGraph.borderHr
		document.getElementById(tableObjet[id].id).style.borderTopStyle=objGraph.borderHs
		document.getElementById(tableObjet[id].id).style.borderTopWidth=objGraph.borderHw+"px"
	
		document.getElementById(tableObjet[id].id).firstChild.firstChild.setAttribute('transform',"translate("+objGraph.margeG+" "+objGraph.margeH+")")
		document.getElementById(tableObjet[id].id).firstChild.firstChild.setAttribute('stroke',objGraph.objBorderC)
		document.getElementById(tableObjet[id].id).firstChild.firstChild.setAttribute('stroke-width',objGraph.objBorderW)
		document.getElementById(tableObjet[id].id).firstChild.firstChild.setAttribute("opacity",objGraph.objOpacity)
		document.getElementById(tableObjet[id].id).firstChild.firstChild.setAttribute("r",objGraph.rayon)
		document.getElementById(tableObjet[id].id).firstChild.firstChild.setAttribute("fill",objGraph.objColor)
		if(objGraph.bkgTrp==true){
			document.getElementById(tableObjet[id].id).style.backgroundColor='transparent'
		}else{
			document.getElementById(tableObjet[id].id).style.backgroundColor=objGraph.bkgColor
		}
	}
	
	tableObjet[id].bkgColor=objGraph.bkgColor
	tableObjet[id].width=objGraph.bkgWidth
	tableObjet[id].height=objGraph.bkgHeight
	tableObjet[id].bkgImg=objGraph.bkgImg
	tableObjet[id].bkgImg=objGraph.bkgOpacity
	tableObjet[id].bkgWidth=objGraph.bkgWidth
	tableObjet[id].bkgHeight=objGraph.bkgHeight
	tableObjet[id].borderBc=objGraph.borderBc
	tableObjet[id].borderBr=objGraph.bordeBr
	tableObjet[id].borderBs=objGraph.borderBs
	tableObjet[id].borderBw=objGraph.borderBw+"px"
	tableObjet[id].borderDc=objGraph.borderDc
	tableObjet[id].borderDr=objGraph.bordeDr
	tableObjet[id].borderDs=objGraph.borderDs
	tableObjet[id].borderDw=objGraph.borderDw+"px"
	tableObjet[id].borderGc=objGraph.borderGc
	tableObjet[id].borderGr=objGraph.borderGr
	tableObjet[id].borderGs=objGraph.borderGs
	tableObjet[id].borderGw=objGraph.borderGw+"px"
	tableObjet[id].borderHc=objGraph.borderHc
	tableObjet[id].borderHr=objGraph.borderHr
	tableObjet[id].borderHs=objGraph.borderHs
	tableObjet[id].borderHw=objGraph.borderHw+"px"
	tableObjet[id].margeG=objGraph.margeG
	tableObjet[id].margeH=objGraph.margeH
	tableObjet[id].objBorderC=objGraph.objBorderC
	tableObjet[id].objBorderW=objGraph.objBorderW
	tableObjet[id].objOpacity=objGraph.objOpacity
	tableObjet[id].radius=objGraph.radius
	tableObjet[id].rayon=objGraph.rayon
	tableObjet[id].objColor=objGraph.objColor
	tableObjet[id].bkgTrp=objGraph.bkgTrp
	
	
}
let screenLog = document.getElementById('screen-log');
function logKey(e) {
	var ratioT=(720/12960);
	if(e.clientX>204 && e.clientY>40){
	var posX=e.clientX-204+scrollDemo.scrollLeft
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
	}
	if(e.clientX>204 && e.clientY>94){
  screenLog.innerText = `
    Screen X/Y: ${e.screenX}, ${e.screenY}
    WorkSpace X/Y: ${Math.floor(e.clientX-204+scrollDemo.scrollLeft)}, ${Math.floor(e.clientY-94+scrollDemo.scrollTop)}
    Zoom : ${zoomScale.toFixed(2)}`;
    Slider : document.getElementById("work").scrollLeft;
    }
}

const scrollDemo = document.querySelector("#work");
scrollDemo.addEventListener("scroll", event => {
            output.innerHTML = `scrollTop: ${Math.floor(scrollDemo.scrollTop)} <br>
                                scrollLeft: ${Math.floor(scrollDemo.scrollLeft)} `;
        }, { passive: true });
const scrollDemo2 = document.querySelector("#work2");
scrollDemo.addEventListener("scroll", event => {
            output2.innerHTML = `scrollTop: ${Math.floor(scrollDemo2.scrollTop)} <br>
                                scrollLeft: ${Math.floor(scrollDemo2.scrollLeft)} `;
        }, { passive: true });
function createPdf() {
	var txt="";
	document.getElementById('svgTime').innerHTML="";
	document.getElementById('vueSign').innerHTML="";
	txt="<rect x='0' y='0' width='12960' height='24' fill='"+vueSvgBackground+"' />"
	document.getElementById('svgTime').innerHTML=txt
	txt="<rect x='0' y='24' width='12960' height='30' fill='"+vueSvgBackground+"' />"
	document.getElementById('vueSign').innerHTML=txt
	if(vueSvgRegle==1){
		createReglette(1,"svgTime",vueSvgBackground,vueSvgFontSize,vueSvgFontColor);
	}
	if(vueSvgMesure==1){
		regSolfege(1,"vueSign",vueSvgFontSize,vueSvgFontColor,vueSvgFontColor,1);
	}
	vuePartitionA(1,2,tableObjet);
	
	var doc=document.getElementById("svgVue").innerHTML
	//console.log(document.getElementById("svgVue").getElementsByTagName('svg')[1].getAttribute('width'))
	
	doc=uena(doc)
	window.api.send("toMain", "spaceToSvg;"+paramProjet.path+";"+doc)
}
function uena(chn) {
  return window.btoa(unescape(encodeURIComponent(chn)));
}

function loadSoundTableBuffer(id,url,num,mode) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    request.onload = function() {
    contextAudio.decodeAudioData(request.response, function(buffer) {
        
        //document.getElementById("paramDuree").innerHTML="Durée : "+buffer.duration.toFixed(2)+"s";
        //document.getElementById("paramCanaux").innerHTML="Canaux : "+buffer.numberOfChannels;
        tableObjet[id].duree = buffer.duration;
        tableObjet[id].fin=1;
        tableObjet[id].debut=0;
        var pathnom=url.split('/')
        if(num==1){
        	tableObjet[id].file=pathnom[pathnom.length-1]
        }else{
        	tableObjet[id].file2=pathnom[pathnom.length-1]
        }
        
       var hasKey = -1;
       var hasKey =tableBuffer.findIndex(elem => elem.name === pathnom[pathnom.length-1]);
		 
		 if(hasKey>-1){
		 	if(num==1){
		 		tableObjet[id].bufferId=hasKey;
		 		window.api.send("toMain", "fileAudioParam;"+id+";"+tableObjet[id].duree+";"+buffer.numberOfChannels )
		 	}else{
		 		tableObjet[id].bufferId2=hasKey;
		 	}
        }else{
         tableBuffer.push({name:pathnom[pathnom.length-1],buffer:buffer});
         if(num==1){
        		 tableObjet[id].bufferId=tableBuffer.length-1;
        		 window.api.send("toMain", "fileAudioParam;"+id+";"+tableObjet[id].duree+";"+buffer.numberOfChannels )
        	}else{
        		 tableObjet[id].bufferId2=tableBuffer.length-1;
        	}
         								
        }
        if(mode==0){
        	window.api.send("toMain", "fileAudioParam;"+id+";"+tableObjet[id].duree+";"+buffer.numberOfChannels )
        }
    });
    }
    request.send();
}
function loadPreDefSound(id,url) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    request.onload = function() {
    contextAudio.decodeAudioData(request.response, function(buffer) {
        tableObjet[id].duree = buffer.duration;
        tableObjet[id].fin=1;
        tableObjet[id].debut=0;
        var pathnom=url.split('/')
        tableObjet[id].file=pathnom[pathnom.length-1]
        
       var hasKey = -1;
       var hasKey =tableBuffer.findIndex(elem => elem.name === tableObjet[id].file);
		 
		 if(hasKey>-1){
		 	tableObjet[id].bufferId=hasKey;
        }else{
         tableBuffer.push({name:tableObjet[id].file,buffer:buffer});
         tableObjet[id].bufferId=tableBuffer.length-1;
         								
        }
       
        for(let i=0;i<tableObjet[id].liste.length;i++){
        	  var ls=tableObjet[tableObjet[id].liste[i]]
	        ls.duree = tableObjet[id].duree
	        ls.fin=tableObjet[id].fin
	        ls.debut=tableObjet[id].debut
	        ls.bufferId=tableObjet[id].bufferId
	        ls.file=tableObjet[id].file
        }
        window.api.send("toMain", "fileAudioPreDef;"+id+";"+tableObjet[id].duree+";"+buffer.numberOfChannels )
    });
    }
    request.send();
}
function defTempo(){
	if(setTimeRegle==true){
		createReglette(zoomScale,"reglette",regleBackground,parseFloat(regleFontSize),regleFontColor)
	}
	if(setSignRegle==true){
		regSolfege(zoomScale,"reglette",parseFloat(regleFontSize),regleFontColor,regleFontColor,1)
	}
	grilleSpace(zoomScale,"space",colorGrille)
}
function audioMute(id,m) {  
	tableObjet[id].mute=m
}
function preDefMute(id,m) {
	for(let i=0;i<tableObjet[id].liste.length;i++){
  	  var ls=tableObjet[tableObjet[id].liste[i]]
     ls.mute = m
   }
   tableObjet[id].mute=m
}
function audioGain(id,m) {  
	tableObjet[id].gain=parseFloat(m)
}
function defReverse(id,m) {  
	tableObjet[id].reverse=JSON.parse(m)
}
function preDefGain(id,m) {
	for(let i=0;i<tableObjet[id].liste.length;i++){
  	  var ls=tableObjet[tableObjet[id].liste[i]]
     ls.gain = parseFloat(m)
   }
   tableObjet[id].gain=parseFloat(m)
  
}
function audioEnvType(id,m) {
   tableObjet[id].envType=parseInt(m)
}
function preDefEnvType(id,m) {
	for(let i=0;i<tableObjet[id].liste.length;i++){
  	  var ls=tableObjet[tableObjet[id].liste[i]]
     ls.envType = parseInt(m)
   }
   tableObjet[id].envType=parseInt(m)
}

function preDefFlagTranspo(id,m) {
	for(let i=0;i<tableObjet[id].liste.length;i++){
  	  var ls=tableObjet[tableObjet[id].liste[i]]
     ls.flagTranspo = parseInt(m)
   }
   tableObjet[id].flagTranspo=parseInt(m) 
}
function audioFlagTranspo(id,m) {  
	tableObjet[id].flagTranspo=m
}
function audioDetune(id,m) {  
	tableObjet[id].detune=parseFloat(m)
}
function preDefDetune(id,m) {
	for(let i=0;i<tableObjet[id].liste.length;i++){
  	  var ls=tableObjet[tableObjet[id].liste[i]]
     ls.detune = parseFloat(m)
   } 
	tableObjet[id].detune=parseFloat(m)
}
function preDefDebut(id,m) {
	for(let i=0;i<tableObjet[id].liste.length;i++){
  	  var ls=tableObjet[tableObjet[id].liste[i]]
     ls.debut = parseFloat(m)
   }   
	tableObjet[id].debut=parseFloat(m)
}
function preDefFin(id,m) {
	for(let i=0;i<tableObjet[id].liste.length;i++){
  	  var ls=tableObjet[tableObjet[id].liste[i]]
     ls.fin = parseFloat(m)
   }   
	tableObjet[id].fin=parseFloat(m)
}
function audioDebut(id,m) {  
	tableObjet[id].debut=parseFloat(m)
}
function audioFin(id,m) {  
	tableObjet[id].fin=parseFloat(m)
}
function audioNom(id,m) {  
	tableObjet[id].nom=m
	document.getElementById(tableObjet[id].id).title=m
}
function preDefNom(id,m) {  
	if(tableObjet[id].type==74){	
		tableObjet[id].nom=m	
		document.getElementById(tableObjet[id].id).firstChild.firstChild.firstChild.firstChild.innerHTML=m
	}
}
function preDefColor(id,m) { 
 	for(let i=0;i<tableObjet[id].liste.length;i++){
  	  var ls=tableObjet[tableObjet[id].liste[i]]
     ls.piste = m
     document.getElementById(ls.id).firstChild.firstChild.setAttribute("fill",m)
   }
	tableObjet[id].piste=m
}
function audioPiste(id,m) {  
	tableObjet[id].piste=parseInt(m)
}
function preDefPiste(id,m) { 
 	for(let i=0;i<tableObjet[id].liste.length;i++){
  	  var ls=tableObjet[tableObjet[id].liste[i]]
     ls.piste = parseFloat(m)
   }
	tableObjet[id].piste=parseInt(m)
}
function audioConvolver(id,m) {  
	tableObjet[id].convolver=m
}
function preDefConvolver(id,m) {  
	for(let i=0;i<tableObjet[id].liste.length;i++){
  	  var ls=tableObjet[tableObjet[id].liste[i]]
     ls.convolver = m
   }
	tableObjet[id].convolver=m
}
function audioEnv(id,ev,x,y) {  
	tableObjet[id].envX[ev]=parseFloat(x)
	tableObjet[id].envY[ev]=parseFloat(y)
}

function preDefEnv(id,ev,x,y) {  
	for(let i=0;i<tableObjet[id].liste.length;i++){
  	  var ls=tableObjet[tableObjet[id].liste[i]]
     ls.envX[ev]=parseFloat(x)
	  ls.envY[ev]=parseFloat(y)
   }
	tableObjet[id].envX[ev]=parseFloat(x)
	tableObjet[id].envY[ev]=parseFloat(y)
}
function objetRayon(id,r) {  
	document.getElementById("objet"+id).firstChild.firstChild.setAttribute("r",r)
	tableObjet[id].r=r
}
function objScaleGrpXY(id,scaleX) { 
	tableObjet[id].scaleX=parseFloat(scaleX)
	tableObjet[id].scaleY=parseFloat(scaleX)
	tableObjet[id].bkgHeight=tableObjet[id].bkgHeight*parseFloat(scaleX)
	tableObjet[id].bkgWidth=tableObjet[id].bkgWidth*parseFloat(scaleX)
	for(let i=0;i<tableObjet[id].liste.length;i++){
		switch(tableObjet[id].type) {
		case 7:
			objScaleX(id,scaleX)
			objScaleY2(id,scaleX)
			break
		case 8:
			objScaleX(id,scaleX)
			objScaleY2(id,scaleX)
			break
		default:
			objScaleXY(tableObjet[id].liste[i],scaleX)
		}
	}
}
function objScaleXY(id,scX) {
	var scaleX=parseFloat(scX)
	tableObjet[id].scaleX=parseFloat(scaleX)
	tableObjet[id].scaleY=parseFloat(scaleX)
	if(tableObjet[id].class==1){
		switch(tableObjet[id].type) {
			case 7:
				objScaleX(id,scaleX)
				objScaleY2(id,scaleX)
				break
			case 8:
				objScaleX(id,scaleX)
				objScaleY2(id,scaleX)
				break
			case 18:
				document.getElementById("grp"+id).style.transform="scale("+scaleX+","+scaleX+")"
				var pos=tableObjet[tableObjet[id].liste[0]].posY
				for(let i=0;i<tableObjet[id].liste.length;i++){
					var nid=tableObjet[tableObjet[id].liste[i]].id
					tableObjet[tableObjet[id].liste[i]].posY=((tableObjet[tableObjet[id].liste[i]].posY-pos)*scaleX)+pos
					document.getElementById(nid).style.transform="scale("+scaleX+" "+scaleX+")"
					document.getElementById(nid).firstChild.setAttribute("width",(10*scaleX))
					document.getElementById(nid).firstChild.setAttribute("height",(10*scaleX))
					document.getElementById(nid).firstChild.firstChild.setAttribute("transform","scale("+scaleX+" "+scaleX+")")
					document.getElementById(nid).style.top=(((tableObjet[tableObjet[id].liste[i]].posY-pos)*scaleX)+pos)+"px"
					tableObjet[tableObjet[id].liste[i]].scaleX=parseFloat(scaleX)
					tableObjet[tableObjet[id].liste[i]].scaleY=parseFloat(scaleX)
					tableObjet[tableObjet[id].liste[i]].bkgWidth=10*scaleX
					tableObjet[tableObjet[id].liste[i]].bkgHeight=10*scaleX
					tableObjet[tableObjet[id].liste[i]].bkgTrp="true"
				}
				break
			case 19:
				document.getElementById("grp"+id).style.transform="scale("+scaleX+","+scaleX+")"
				var ypos=tableObjet[tableObjet[id].liste[0]].posY
				var xpos=tableObjet[tableObjet[id].liste[0]].posX
				for(let i=0;i<tableObjet[id].liste.length;i++){
					var nid=tableObjet[tableObjet[id].liste[i]].id
					tableObjet[tableObjet[id].liste[i]].posX=((tableObjet[tableObjet[id].liste[i]].posX-pos)*scaleX)+xpos
					//tableObjet[tableObjet[id].liste[i]].posY=((tableObjet[tableObjet[id].liste[i]].posY-pos)*scaleX)+ypos
					document.getElementById(nid).style.transform="scale("+scaleX+" "+scaleX+")"
					document.getElementById(nid).firstChild.setAttribute("width",20*scaleX)
					document.getElementById(nid).firstChild.setAttribute("height",20*scaleX)
					document.getElementById(nid).firstChild.firstChild.setAttribute("transform","scale("+scaleX+" "+scaleX+")")
					document.getElementById(nid).style.top=(((tableObjet[tableObjet[id].liste[i]].posY-pos)*scaleX)+pos)+"px"
					tableObjet[tableObjet[id].liste[i]].scaleX=scaleX
					tableObjet[tableObjet[id].liste[i]].scaleY=scaleX
					tableObjet[tableObjet[id].liste[i]].bkgWidth=10*scaleX
					tableObjet[tableObjet[id].liste[i]].bkgHeight=10*scaleX
					tableObjet[tableObjet[id].liste[i]].bkgTrp="true"
				}
				break
			case 20:
				document.getElementById("grp"+id).style.transform="scale("+scaleX+","+scaleX+")"
				var pos=tableObjet[tableObjet[id].liste[0]].posY
				for(let i=0;i<tableObjet[id].liste.length;i++){
					var nid=tableObjet[tableObjet[id].liste[i]].id
					//tableObjet[tableObjet[id].liste[i]].posY=((tableObjet[tableObjet[id].liste[i]].posY-pos)*scaleX)+pos
					document.getElementById(nid).style.transform="scale("+scaleX+" "+scaleX+")"
					document.getElementById(nid).firstChild.firstChild.setAttribute("transform","scale("+scaleX+" "+scaleX+")")
					document.getElementById(nid).style.top=(((tableObjet[tableObjet[id].liste[i]].posY-pos)*scaleX)+pos)+"px"
					
				}
				break
			case 22:
				document.getElementById("grp"+id).style.transform="scale("+scaleX+","+scaleX+")"
				var pos=tableObjet[tableObjet[id].liste[0]].posY
				for(let i=0;i<tableObjet[id].liste.length;i++){
					var nid=tableObjet[tableObjet[id].liste[i]].id
					//tableObjet[tableObjet[id].liste[i]].posY=(tableObjet[tableObjet[id].liste[i]].posY-pos)*scaleX)+pos
					document.getElementById(nid).style.transform="scale("+scaleX+" "+scaleX+")"
					document.getElementById(nid).firstChild.setAttribute("width",20*scaleX)
					document.getElementById(nid).firstChild.setAttribute("height",20*scaleX)
					document.getElementById(nid).firstChild.firstChild.setAttribute("transform","scale("+scaleX+" "+scaleX+")")
					document.getElementById(nid).style.top=(((tableObjet[tableObjet[id].liste[i]].posY-pos)*scaleX)+pos)+"px"
					tableObjet[tableObjet[id].liste[i]].scaleX=scaleX
					tableObjet[tableObjet[id].liste[i]].scaleY=scaleX
					tableObjet[tableObjet[id].liste[i]].bkgWidth=6*scaleX
					tableObjet[tableObjet[id].liste[i]].bkgHeight=6*scaleX
					tableObjet[tableObjet[id].liste[i]].bkgTrp="true"
				}
				break
			default:
				document.getElementById("objet"+id).style.transform="scale("+scaleX+" "+scaleX+")"
				tableObjet[id].bkgHeight=tableObjet[id].height*scaleX
				tableObjet[id].bkgWidth=tableObjet[id].width*scaleX
				document.getElementById("objet"+id).firstChild.setAttribute("width",tableObjet[id].width*scaleX)
				document.getElementById("objet"+id).firstChild.setAttribute("height",tableObjet[id].height*scaleX)
				document.getElementById("objet"+id).firstChild.firstChild.setAttribute("transform","scale("+scaleX+" "+scaleX+") translate("+tableObjet[id].margeG+" "+tableObjet[id].margeH+")")
		}
	}else{
		tableObjet[id].bkgHeight=tableObjet[id].height*scaleX
		tableObjet[id].bkgWidth=tableObjet[id].width*scaleX
		tableObjet[id].scaleY2=parseFloat(scaleX)
		document.getElementById("objet"+id).style.width=tableObjet[id].bkgWidth+"px"
		document.getElementById("objet"+id).style.height=tableObjet[id].bkgHeight+"px"
		document.getElementById("objet"+id).firstChild.setAttribute("width",tableObjet[id].width*scaleX)
		document.getElementById("objet"+id).firstChild.setAttribute("height",tableObjet[id].height*scaleX)
		document.getElementById("objet"+id).firstChild.firstChild.setAttribute("transform","scale("+scaleX+" "+scaleX+") translate("+tableObjet[id].margeG+" "+tableObjet[id].margeH+")")
	}
}
function objScaleX(id,scaleX) { 	
	
	if(tableObjet[id].class==1){
		tableObjet[id].scaleX=parseFloat(scaleX)
		tableObjet[id].bkgWidth=tableObjet[id].width*scaleX
		switch(tableObjet[id].type) {
			
			case 7:
				document.getElementById("objet"+id).firstChild.firstChild.nextSibling.setAttribute('width',(20*tableObjet[id].scaleX))
				document.getElementById("objet"+id).style.width=((20*tableObjet[id].scaleX)+((10*tableObjet[id].scaleY2))+tableObjet[id].margeG)+"px"
				objetBkgWidth(id,document.getElementById("objet"+id).style.width)
				break
			case 8:
				document.getElementById("objet"+id).firstChild.firstChild.nextSibling.style.width=(20*tableObjet[id].scaleX)+"px"
				document.getElementById("objet"+id).style.width=((20*tableObjet[id].scaleX)+((10*tableObjet[id].scaleY2))+tableObjet[id].margeG)+"px"
				objetBkgWidth(id,document.getElementById("objet"+id).style.width)
				break
			case 11:
				document.getElementById("objet"+id).firstChild.firstChild.setAttribute("stroke-width",scaleX)
				break
	
			case 23:
				document.getElementById("objet"+id).firstChild.style.width=(tableObjet[id].width*tableObjet[id].scaleX)+"px"
				break
			default:
				var transf='scale('+tableObjet[id].scaleX+' '+tableObjet[id].scaleY+') translate('+tableObjet[id].margeG+' '+tableObjet[id].margeH+') '	
				objetBkgWidth(id,tableObjet[id].width*scaleX)			
				document.getElementById("objet"+id).firstChild.firstChild.setAttribute("transform",transf)
		}
	
	}else {
		switch(tableObjet[id].type) {
			case 56:
			   var lx=47*(parseFloat(scaleX)+parseFloat(tableObjet[id].scaleX))
			   tableObjet[id].bkgWidth=lx*(tableObjet[id].scaleX+0.1)
				document.getElementById("objet"+id).firstChild.firstChild.firstChild.firstChild.nextSibling.setAttribute("cx",lx+4)
				document.getElementById("objet"+id).firstChild.firstChild.firstChild.firstChild.nextSibling.nextSibling.setAttribute("x2",lx)
				var ldm='translate('+(lx-51)+',0)'
				document.getElementById("objet"+id).firstChild.firstChild.firstChild.firstChild.nextSibling.nextSibling.nextSibling.setAttribute('transform',ldm)
				document.getElementById("objet"+id).firstChild.setAttribute('width',(lx*(tableObjet[id].scaleX+0.1)))
				document.getElementById("objet"+id).style.width=(lx*(tableObjet[id].scaleX+0.1))+"px"
				tableObjet[id].scaleY2=parseFloat(scaleX)
				break
			case 57:
				var lx=47*(parseFloat(scaleX)+parseFloat(tableObjet[id].scaleX))
			   tableObjet[id].bkgWidth=lx*(tableObjet[id].scaleX+0.1)
				document.getElementById("objet"+id).firstChild.firstChild.firstChild.firstChild.nextSibling.setAttribute("cx",lx+4)
				document.getElementById("objet"+id).firstChild.firstChild.firstChild.firstChild.nextSibling.nextSibling.setAttribute("x2",lx)
				document.getElementById("objet"+id).firstChild.setAttribute('width',(lx*(tableObjet[id].scaleX+0.1)))
				document.getElementById("objet"+id).style.width=(lx*(tableObjet[id].scaleX+0.1))+"px"
				tableObjet[id].scaleY2=parseFloat(scaleX)
				break
			case 58:
				var lx=47*(parseFloat(scaleX)+parseFloat(tableObjet[id].scaleX))
			   tableObjet[id].bkgWidth=lx*(tableObjet[id].scaleX+0.1)
				document.getElementById("objet"+id).firstChild.firstChild.firstChild.firstChild.nextSibling.setAttribute("cx",lx+4)
				document.getElementById("objet"+id).firstChild.firstChild.firstChild.firstChild.nextSibling.nextSibling.setAttribute("x2",lx)
				var ldm='translate('+(lx-51)+',0)'
				document.getElementById("objet"+id).firstChild.firstChild.firstChild.firstChild.nextSibling.nextSibling.nextSibling.setAttribute('transform',ldm)
				ldm='translate('+(lx/2)+' 0) scale(6 6)'
				document.getElementById("objet"+id).firstChild.firstChild.firstChild.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.setAttribute('transform',ldm)
				document.getElementById("objet"+id).firstChild.setAttribute('width',(lx*(tableObjet[id].scaleX+0.1)))
				document.getElementById("objet"+id).style.width=(lx*(tableObjet[id].scaleX+0.1))+"px"
				tableObjet[id].scaleY2=parseFloat(scaleX)
				break
			case 59:
				var lx=47*(parseFloat(scaleX)+parseFloat(tableObjet[id].scaleX))
			   tableObjet[id].bkgWidth=lx*(tableObjet[id].scaleX+0.1)
				document.getElementById("objet"+id).firstChild.firstChild.firstChild.firstChild.nextSibling.setAttribute("cx",lx+4)
				document.getElementById("objet"+id).firstChild.firstChild.firstChild.firstChild.nextSibling.nextSibling.setAttribute("x2",lx)
				ldm='translate('+(lx/2)+' 0) scale(6 6)'
				document.getElementById("objet"+id).firstChild.firstChild.firstChild.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.setAttribute('transform',ldm)
				document.getElementById("objet"+id).firstChild.setAttribute('width',(lx*(tableObjet[id].scaleX+0.1)))
				document.getElementById("objet"+id).style.width=(lx*(tableObjet[id].scaleX+0.1))+"px"
				tableObjet[id].scaleY2=parseFloat(scaleX)
				break	
			case 63:
				var lx=47*(parseFloat(scaleX)+parseFloat(tableObjet[id].scaleX))
			   tableObjet[id].bkgWidth=lx*(tableObjet[id].scaleX+0.1)
				document.getElementById("objet"+id).firstChild.firstChild.firstChild.firstChild.nextSibling.setAttribute("x2",lx)
				document.getElementById("objet"+id).firstChild.firstChild.firstChild.firstChild.nextSibling.nextSibling.setAttribute("x1",lx)
				document.getElementById("objet"+id).firstChild.firstChild.firstChild.firstChild.nextSibling.nextSibling.setAttribute("x2",lx)
				var ldm='translate('+(lx-47)+',0)'
				document.getElementById("objet"+id).firstChild.firstChild.firstChild.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.setAttribute('transform',ldm)
				document.getElementById("objet"+id).style.width=(48*parseFloat(scaleX)*tableObjet[id].scaleY)+"px"
				document.getElementById("objet"+id).firstChild.setAttribute("width",48*parseFloat(scaleX)*tableObjet[id].scaleY)
				tableObjet[id].scaleY2=parseFloat(scaleX)
				break
			case 64:
				var lx=47*(parseFloat(scaleX)+parseFloat(tableObjet[id].scaleX))
				document.getElementById("objet"+id).firstChild.firstChild.firstChild.firstChild.nextSibling.setAttribute("x2",lx)
				document.getElementById("objet"+id).firstChild.firstChild.firstChild.firstChild.nextSibling.nextSibling.setAttribute("x1",lx)
				document.getElementById("objet"+id).firstChild.firstChild.firstChild.firstChild.nextSibling.nextSibling.setAttribute("x2",lx)
				var ldm='translate('+(lx-47)+',0)'
				document.getElementById("objet"+id).firstChild.firstChild.firstChild.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.setAttribute('transform',ldm)
				document.getElementById("objet"+id).style.width=((48*parseFloat(scaleX)*tableObjet[id].scaleY)+(8*parseFloat(scaleX)))+"px"
				document.getElementById("objet"+id).firstChild.setAttribute("width",(48*parseFloat(scaleX)*tableObjet[id].scaleY)+(8*parseFloat(scaleX)))
				tableObjet[id].scaleY2=parseFloat(scaleX)
				break
			case 69:
				var lx=54*(parseFloat(scaleX)+parseFloat(tableObjet[id].scaleX))
				var ldm='M 20,24 L '+lx+',24 '
				document.getElementById("objet"+id).firstChild.firstChild.firstChild.firstChild.nextSibling.setAttribute("d",ldm)
				var ldm='translate('+(lx-47)+',0)'
				document.getElementById("objet"+id).firstChild.firstChild.firstChild.firstChild.nextSibling.nextSibling.setAttribute("transform",ldm)
				document.getElementById("objet"+id).style.width=((54*parseFloat(scaleX)*tableObjet[id].scaleY)+(8*parseFloat(scaleX)))+"px"
				document.getElementById("objet"+id).firstChild.setAttribute("width",(54*parseFloat(scaleX)*tableObjet[id].scaleY)+(8*parseFloat(scaleX)))
				tableObjet[id].scaleY2=parseFloat(scaleX)
				break
			case 70:
				var lx=54*(parseFloat(scaleX)+parseFloat(tableObjet[id].scaleX))
				var ldm='M 20,8 L '+lx+',8 '
				document.getElementById("objet"+id).firstChild.firstChild.firstChild.firstChild.nextSibling.setAttribute("d",ldm)
				var ldm='translate('+(lx-47)+',0)'
				document.getElementById("objet"+id).firstChild.firstChild.firstChild.firstChild.nextSibling.nextSibling.setAttribute("transform",ldm)
				document.getElementById("objet"+id).style.width=((54*parseFloat(scaleX)*tableObjet[id].scaleY)+(8*parseFloat(scaleX)))+"px"
				document.getElementById("objet"+id).firstChild.setAttribute("width",(54*parseFloat(scaleX)*tableObjet[id].scaleY)+(8*parseFloat(scaleX)))
				tableObjet[id].scaleY2=parseFloat(scaleX)
				break
			case 71:
				var lx=54*(parseFloat(scaleX)+parseFloat(tableObjet[id].scaleX))
				var ldm='M 0,24 L '+lx+',24 '
				document.getElementById("objet"+id).firstChild.firstChild.firstChild.firstChild.nextSibling.setAttribute("d",ldm)
				var ldm='translate('+(lx-47)+',0)'
				document.getElementById("objet"+id).firstChild.firstChild.firstChild.firstChild.nextSibling.nextSibling.setAttribute("transform",ldm)
				document.getElementById("objet"+id).style.width=((54*parseFloat(scaleX)*tableObjet[id].scaleY)+(8*parseFloat(scaleX)))+"px"
				document.getElementById("objet"+id).firstChild.setAttribute("width",(54*parseFloat(scaleX)*tableObjet[id].scaleY)+(8*parseFloat(scaleX)))
				tableObjet[id].scaleY2=parseFloat(scaleX)
				break
			case 72:
				var lx=54*(parseFloat(scaleX)+parseFloat(tableObjet[id].scaleX))
				var ldm='M 0,8 L '+lx+',8 '
				document.getElementById("objet"+id).firstChild.firstChild.firstChild.firstChild.nextSibling.setAttribute("d",ldm)
				var ldm='translate('+(lx-47)+',0)'
				document.getElementById("objet"+id).firstChild.firstChild.firstChild.firstChild.nextSibling.nextSibling.setAttribute("transform",ldm)
				document.getElementById("objet"+id).style.width=((54*parseFloat(scaleX)*tableObjet[id].scaleY)+(8*parseFloat(scaleX)))+"px"
				document.getElementById("objet"+id).firstChild.setAttribute("width",(54*parseFloat(scaleX)*tableObjet[id].scaleY)+(8*parseFloat(scaleX)))
				tableObjet[id].scaleY2=parseFloat(scaleX)
				break
			case 73:
				var lx=54*(parseFloat(scaleX)+parseFloat(tableObjet[id].scaleX))
				document.getElementById("objet"+id).firstChild.firstChild.firstChild.firstChild.setAttribute("x2",lx)
				var ldm='translate('+(lx-47)+',0)'
				document.getElementById("objet"+id).firstChild.firstChild.firstChild.firstChild.nextSibling.setAttribute("transform",ldm)
				document.getElementById("objet"+id).style.width=((54*parseFloat(scaleX)*tableObjet[id].scaleY)+(8*parseFloat(scaleX)))+"px"
				document.getElementById("objet"+id).firstChild.setAttribute("width",(54*parseFloat(scaleX)*tableObjet[id].scaleY)+(8*parseFloat(scaleX)))
				tableObjet[id].scaleY2=parseFloat(scaleX)
				break
			case 74:
				tableObjet[id].scaleX=parseFloat(scaleX)
				tableObjet[id].scaleY=parseFloat(scaleX)
				tableObjet[id].bkgWidth=40*parseFloat(scaleX)
				tableObjet[id].bkgHeight=20*parseFloat(scaleX)

				document.getElementById("objet"+id).style.width=(40*parseFloat(scaleX))+"px"
				document.getElementById("objet"+id).style.height=(20*parseFloat(scaleX))+"px"
				document.getElementById("objet"+id).firstChild.setAttribute("width",40*parseFloat(scaleX))
				document.getElementById("objet"+id).firstChild.setAttribute("height",20*parseFloat(scaleX))
				break
			default:
				tableObjet[id].scaleX=parseFloat(scaleX)
				//document.getElementById("objet"+id).firstChild.firstChild.setAttribute("transform",transf)
				//console.log("scaleX",transf," ",document.getElementById("objet"+id).firstChild.firstChild)
		}
		var transf=' rotate('+tableObjet[id].rotate+' 0 0) scale('+tableObjet[id].scaleX+' '+tableObjet[id].scaleY+') translate('+tableObjet[id].margeG+' '+tableObjet[id].margeH+') '
		document.getElementById("objet"+id).firstChild.firstChild.setAttribute("transform",transf)
		
	}

}
function objScaleY(id,scaleY) { 
	tableObjet[id].scaleY=parseFloat(scaleY)
	tableObjet[id].scaleY2=parseFloat(scaleY)
	switch(tableObjet[id].type) {
		case 7:
			document.getElementById("objet"+id).firstChild.firstChild.nextSibling.setAttribute("height",10*scaleY)
			var r=document.getElementById("objet"+id).firstChild.firstChild.getAttribute("cy")
			var ly=r-(10*scaleY/2)
			document.getElementById("objet"+id).firstChild.firstChild.nextSibling.setAttribute("y",ly)
			break
		case 8:
			var dm=10*scaleY
			var ty=((20*tableObjet[id].scaleY2))/2-(dm/2)
			document.getElementById("objet"+id).firstChild.firstChild.nextSibling.setAttribute("height",dm)
			document.getElementById("objet"+id).firstChild.firstChild.nextSibling.setAttribute("y",ty)
			break
		case 23:
			document.getElementById("objet"+id).firstChild.style.height=(tableObjet[id].height*tableObjet[id].scaleY)+"px"
			break
		default:
			var transf="scale("+tableObjet[id].scaleX+" "+tableObjet[id].scaleY+") translate("+tableObjet[id].margeG+" "+tableObjet[id].margeH+") rotate("+tableObjet[id].rotate+" 0 0) "
			document.getElementById("objet"+id).firstChild.firstChild.setAttribute("transform",transf)
	}
}
function objScaleY2(id,scaleY) { 
	tableObjet[id].scaleY2=parseFloat(scaleY)
	if(tableObjet[id].class==1){

		switch(tableObjet[id].type) {
			case 7:
				var dm=10*scaleY
				document.getElementById("objet"+id).firstChild.firstChild.setAttribute("r",dm)
				document.getElementById("objet"+id).firstChild.firstChild.setAttribute("cx",dm)
				document.getElementById("objet"+id).firstChild.firstChild.setAttribute("cy",dm)
				document.getElementById("objet"+id).firstChild.setAttribute("height",((dm*2)+tableObjet[id].margeH))
				document.getElementById("objet"+id).firstChild.setAttribute("width",parseFloat(document.getElementById("objet"+id).firstChild.firstChild.nextSibling.getAttribute("width"))+dm+tableObjet[id].margeG)
				document.getElementById("objet"+id).firstChild.firstChild.nextSibling.setAttribute("x",(tableObjet[id].margeG+dm))
				document.getElementById("objet"+id).firstChild.firstChild.nextSibling.setAttribute("y",(tableObjet[id].margeH+(dm-(document.getElementById("objet"+id).firstChild.firstChild.nextSibling.getAttribute("height")/2))))
				document.getElementById("objet"+id).style.width=document.getElementById("objet"+id).firstChild.getAttribute("width")+"px"
				tableObjet[id].bkgWidth=parseFloat(document.getElementById("objet"+id).firstChild.getAttribute("width"))  
				tableObjet[id].bkgHeight=parseFloat(document.getElementById("objet"+id).firstChild.getAttribute("height"))  
				document.getElementById(tableObjet[id].id).style.width=tableObjet[id].bkgWidth+"px"
				document.getElementById(tableObjet[id].id).style.height=tableObjet[id].bkgHeight+"px"
				document.getElementById(tableObjet[id].id).style.backgroundSize=tableObjet[id].bkgWidth+" "+tableObjet[id].bkgHeight
				break
			case 8:
				var dm=20*scaleY
				document.getElementById("objet"+id).firstChild.firstChild.setAttribute("width",dm)
				document.getElementById("objet"+id).firstChild.firstChild.setAttribute("height",dm)
				document.getElementById("objet"+id).style.height=(20*scaleY)+"px"
				dm=(dm/2)-((10*tableObjet[id].scaleY)/2)
				document.getElementById("objet"+id).firstChild.firstChild.nextSibling.setAttribute("y",dm)
				
				break
			case 23:
				document.getElementById("objet"+id).firstChild.style.height=(tableObjet[id].height*tableObjet[id].scaleY)+"px"
				break
				
			default:
			
				var transf=' rotate('+tableObjet[id].rotate+' 0 0) scale('+tableObjet[id].scaleX+' '+tableObjet[id].scaleY2+') translate('+tableObjet[id].margeG+' '+tableObjet[id].margeH+') '				
				document.getElementById("objet"+id).firstChild.firstChild.setAttribute("transform",transf)
		}
	}else {
		tableObjet[id].scaleY=parseFloat(scaleY)
		var transf='scale('+tableObjet[id].scaleX+' '+tableObjet[id].scaleY2+') translate('+tableObjet[id].margeG+' '+tableObjet[id].margeH+')  rotate('+tableObjet[id].rotate+' 0 0) '
			document.getElementById("objet"+id).firstChild.firstChild.setAttribute("transform",transf)
	}
	
}
function objetOpacity(id,opac) {  
	document.getElementById(tableObjet[id].id).firstChild.firstChild.setAttribute("opacity",opac)
	tableObjet[id].objOpacity=opac
} 
function bkgOpacity(id,opac) {
	var nopac=Math.round(parseFloat(opac)*255)
	var color=tableObjet[id].bkgColor+ (nopac.toString(16))
	document.getElementById(tableObjet[id].id).style.backgroundColor=color
	tableObjet[id].bkgOpacity=parseFloat(opac)
}
function bkgGrpOpacity(id,opac) {
	var nopac=Math.round(parseFloat(opac)*255)
	var color=tableObjet[id].bkgColor+ (nopac.toString(16))
	document.getElementById(tableObjet[id].id).style.backgroundColor=color
	tableObjet[id].bkgOpacity=parseFloat(opac)
}
function bkgTransparent(id) {  
	document.getElementById(tableObjet[id].id).style.backgroundColor='transparent'
	tableObjet[id].bkgTrp=true
} 
function bkgGrpTransparent(id) {  
	document.getElementById(tableObjet[id].id).style.backgroundColor='transparent'
	tableObjet[id].bkgTrp=true
} 
function objetRColor(id,color) {  
	tableObjet[id].objColor=color
		switch(tableObjet[id].type) {
			case 7:
				document.getElementById("objet"+id).firstChild.firstChild.setAttribute("fill",color)
				document.getElementById("objet"+id).firstChild.firstChild.nextSibling.setAttribute("fill",color)
				document.getElementById("objet"+id).firstChild.firstChild.setAttribute("stroke",color)
				document.getElementById("objet"+id).firstChild.firstChild.nextSibling.setAttribute("stroke",color)
				break
			case 8:
				document.getElementById("objet"+id).firstChild.firstChild.setAttribute("fill",color)
				document.getElementById("objet"+id).firstChild.firstChild.nextSibling.setAttribute("fill",color)
				document.getElementById("objet"+id).firstChild.firstChild.setAttribute("stroke",color)
				document.getElementById("objet"+id).firstChild.firstChild.nextSibling.setAttribute("stroke",color)
				break
			case 18:
				for(let i=0;i<tableObjet[id].liste.length;i++){
					var nid=tableObjet[tableObjet[id].liste[i]].id
					document.getElementById(nid).firstChild.firstChild.setAttribute("fill",color)
				}
				break
			case 19:
				for(let i=0;i<tableObjet[id].liste.length;i++){
					var nid=tableObjet[tableObjet[id].liste[i]].id
					document.getElementById(nid).firstChild.firstChild.setAttribute("fill",color)
				}
				break
			case 20:
				for(let i=0;i<tableObjet[id].liste.length;i++){
					var nid=tableObjet[tableObjet[id].liste[i]].id
					document.getElementById(nid).firstChild.firstChild.setAttribute("fill",color)
				}
				break
			case 22:
				for(let i=0;i<tableObjet[id].liste.length;i++){
					var nid=tableObjet[tableObjet[id].liste[i]].id
					document.getElementById(nid).firstChild.firstChild.setAttribute("fill",color)
				}
				break
			default:
				document.getElementById("objet"+id).firstChild.firstChild.setAttribute("fill",color)
		}
}
function objRotate(id,rotate) {  
	tableObjet[id].rotate=parseFloat(rotate) 
	var transf="transform:scale("+tableObjet[id].scaleX+","+tableObjet[id].scaleY+") translate("+tableObjet[id].margeG+"px,"+tableObjet[id].margeH+"px) rotate("+rotate+"deg 0 0);"
	document.getElementById("objet"+id).firstChild.style.transform="scale("+tableObjet[id].scaleX+","+tableObjet[id].scaleY+") translate("+tableObjet[id].margeG+"px,"+tableObjet[id].margeH+"px) rotate("+rotate+"deg)"
	//document.getElementById("objet"+id).firstChild.style.transform=rotate+"deg"

}
function symbRotate(id,rotate) {  
	tableObjet[id].rotate=parseInt(rotate) 
	var transf=" scale("+tableObjet[id].scaleX+" "+tableObjet[id].scaleY+") translate("+tableObjet[id].margeG+" "+tableObjet[id].margeH+") rotate("+rotate+" 0 0)  "
	document.getElementById("objet"+id).firstChild.firstChild.setAttribute("transform",transf)
	//symbBkgWidth(id,tableObjet[id].width*tableObjet[id].scaleX)
}
function symbColor(id,color) {  
	tableObjet[id].objColor=color 
	if(tableObjet[id].type>77 && tableObjet[id].type<84){
		var st=style='fill:'+color+';fill-opacity:1;stroke:'+color+';stroke-width:1'
		document.getElementById("objet"+id).firstChild.firstChild.firstChild.setAttribute("style",st)
	}else{
		document.getElementById("objet"+id).firstChild.firstChild.setAttribute("stroke",color)
		document.getElementById("objet"+id).firstChild.firstChild.setAttribute("fill",color)
	}
	
}
function grpBkgColor(id,color) {  
	tableObjet[id].bkgColor=color 
	tableObjet[id].bkgTrp=true
	document.getElementById("grp"+id).style.backgroundColor=color
}
function symbStroke(id,width) {  
	
	document.getElementById("objet"+id).firstChild.firstChild.setAttribute("stroke",tableObjet[objActif].stroke)
}
function symbWidth(id,width) { 
	
	tableObjet[id].scaleX=width
	var transf="rotate("+tableObjet[id].rotate+") scale("+tableObjet[id].scaleX+" "+tableObjet[id].scaleY2+") translate("+tableObjet[id].margeG+" "+tableObjet[id].margeH+")"
	document.getElementById("objet"+id).firstChild.firstChild.setAttribute("transform",transf)
	
}
function symbHeight(id,height) {  
	tableObjet[id].scaleY2=height
	var transf="rotate("+tableObjet[id].rotate+") scale("+tableObjet[id].scaleX+" "+tableObjet[id].scaleY2+") translate("+tableObjet[id].margeG+" "+tableObjet[id].margeH+")"
	document.getElementById("objet"+id).firstChild.firstChild.setAttribute("transform",transf)
}
function symbBkgWidth(id,w) {     
	document.getElementById(tableObjet[id].id).style.width=w+"px"
	document.getElementById(tableObjet[id].id).style.backgroundSize=document.getElementById(tableObjet[id].id).style.width+" "+document.getElementById(tableObjet[id].id).style.height
	document.getElementById(tableObjet[id].id).firstChild.setAttribute('width',w)
	tableObjet[id].bkgWidth=parseFloat(w)
}
function symbBkgHeight(id,h) {
	document.getElementById(tableObjet[id].id).style.height=h+"px"
	document.getElementById(tableObjet[id].id).style.backgroundSize=document.getElementById(tableObjet[id].id).style.width+" "+document.getElementById(tableObjet[id].id).style.height
	document.getElementById(tableObjet[id].id).firstChild.setAttribute('height',h)
	tableObjet[id].bkgHeight=parseFloat(h)
}
function symbMGauche(id,ml) {
	var elem=document.getElementById(tableObjet[id].id).firstChild.firstChild
	tableObjet[id].margeG=parseFloat(ml)
	var transf='scale('+tableObjet[id].scaleX+' '+tableObjet[id].scaleY2+') translate('+tableObjet[id].margeG+' '+tableObjet[id].margeH+')  rotate('+tableObjet[id].rotate+' 0 0) '
	document.getElementById("objet"+id).firstChild.firstChild.setAttribute("transform",transf)
}
function symbBkgColor(id,color) {
	if(tableObjet[id].bkgOpacity){
		var opac=Math.round(tableObjet[id].bkgOpacity*255)
	}else{
		var opac=255
	}
	var ncolor=color+(opac.toString(16))  
	document.getElementById(tableObjet[id].id).style.backgroundColor=ncolor
	tableObjet[id].bkgColor=color
	tableObjet[id].bkgTrp=false
}  
function symbMHaut(id,ml) {
	var elem=document.getElementById(tableObjet[id].id).firstChild.firstChild
	tableObjet[id].margeH=parseFloat(ml)
	var transf='scale('+tableObjet[id].scaleX+' '+tableObjet[id].scaleY2+') translate('+tableObjet[id].margeG+' '+tableObjet[id].margeH+')  rotate('+tableObjet[id].rotate+' 0 0) '
	document.getElementById("objet"+id).firstChild.firstChild.setAttribute("transform",transf)
}
function objetBkgNColor(id,color) {
	if(tableObjet[id].bkgOpacity){
		var opac=Math.round(tableObjet[id].bkgOpacity*255)
	}else{
		var opac=255
	}
	var ncolor=color+(opac.toString(16))  
	document.getElementById(tableObjet[id].id).style.backgroundColor=ncolor
	tableObjet[id].bkgColor=color
	tableObjet[id].bkgTrp=false
}  
function objetBkgImg(id,img) {     
	document.getElementById(tableObjet[id].id).style.backgroundImage='url('+img+')'
	document.getElementById(tableObjet[id].id).style.backgroundSize=tableObjet[id].bkgWidth+" "+tableObjet[id].bkgheight
	tableObjet[id].bkgImg=img
}
function bkgGrpImg(id,img) {     
	document.getElementById(tableObjet[id].id).style.backgroundImage="url('"+img+"')"
	document.getElementById(tableObjet[id].id).style.backgroundSize=tableObjet[id].bkgWidth+" "+tableObjet[id].bkgHeight
}
function symbBkgImg(id,img) {     
	document.getElementById(tableObjet[id].id).style.backgroundImage='url('+img+')'
	document.getElementById(tableObjet[id].id).style.backgroundSize=document.getElementById(tableObjet[id].id).style.width+"px "+document.getElementById(tableObjet[id].id).style.height+"px"
	tableObjet[id].bkgImg=img
}
function objetBkgWidth(id,w) { 
	tableObjet[id].bkgWidth=parseFloat(w)    
	document.getElementById(tableObjet[id].id).style.width=tableObjet[id].bkgWidth+"px"
	document.getElementById(tableObjet[id].id).style.backgroundSize=document.getElementById(tableObjet[id].id).style.width+" "+document.getElementById(tableObjet[id].id).style.height
	if(tableObjet[id].type==23){
		document.getElementById(tableObjet[id].id).firstChild.style.width=w+"px"
	}else{
		document.getElementById(tableObjet[id].id).firstChild.setAttribute('width',tableObjet[id].bkgWidth)
	}
}
function objetBkgHeight(id,h) {
	tableObjet[id].bkgHeight=parseFloat(h)
	document.getElementById(tableObjet[id].id).style.height=tableObjet[id].bkgHeight+"px"
	document.getElementById(tableObjet[id].id).style.backgroundSize=document.getElementById(tableObjet[id].id).style.width+" "+document.getElementById(tableObjet[id].id).style.height
	if(tableObjet[id].type==23){
		console.log(document.getElementById(tableObjet[id].id))
		document.getElementById(tableObjet[id].id).firstChild.setAttribute('height',tableObjet[id].bkgHeight)
		//var bk=document.getElementById(tableObjet[id].id).firstChild.getAttribute('viewBox').split(" ")
		document.getElementById(tableObjet[id].id).firstChild.style.height=tableObjet[id].bkgHeight
		//document.getElementById(tableObjet[id].id).firstChild.setAttribute('viewBox',bk[0]+" "+bk[1]+" "+bk[2]+" "+h)
	}else{	
		document.getElementById(tableObjet[id].id).firstChild.setAttribute('height',tableObjet[id].bkgHeight)
	}
}
function grpBkgWidth(id,w) { 
	tableObjet[id].bkgWidth=parseFloat(w)    
	document.getElementById(tableObjet[id].id).style.width=tableObjet[id].bkgWidth+"px"
	document.getElementById(tableObjet[id].id).style.backgroundSize=document.getElementById(tableObjet[id].id).style.width+" "+document.getElementById(tableObjet[id].id).style.height
}
function grpBkgHeight(id,h) {
	tableObjet[id].bkgHeight=parseFloat(h)
	document.getElementById(tableObjet[id].id).style.height=tableObjet[id].bkgHeight+"px"
	document.getElementById(tableObjet[id].id).style.backgroundSize=document.getElementById(tableObjet[id].id).style.width+" "+document.getElementById(tableObjet[id].id).style.height
}


function objetBordureWidth(id,width) {     
	tableObjet[id].objBorderW=width
	switch(tableObjet[id].type) {
		case 18:
			for(let i=0;i<tableObjet[id].liste.length;i++){
				var nid=tableObjet[tableObjet[id].liste[i]].id
				document.getElementById(nid).firstChild.firstChild.setAttribute("stroke-width",width)
			}
			break
		case 19:
			for(let i=0;i<tableObjet[id].liste.length;i++){
				var nid=tableObjet[tableObjet[id].liste[i]].id
				document.getElementById(nid).firstChild.firstChild.setAttribute("stroke-width",width)
			}
			break
		case 20:
			for(let i=0;i<tableObjet[id].liste.length;i++){
				var nid=tableObjet[tableObjet[id].liste[i]].id
				document.getElementById(nid).firstChild.firstChild.setAttribute("stroke-width",width)
			}
			break
		case 22:
			for(let i=0;i<tableObjet[id].liste.length;i++){
				var nid=tableObjet[tableObjet[id].liste[i]].id
				document.getElementById(nid).firstChild.firstChild.setAttribute("stroke-width",width)
			}
			break
		default:
			document.getElementById("objet"+id).firstChild.firstChild.setAttribute('stroke-width',width)
	}
}
function objetBordureColor(id,color) {     
	tableObjet[id].objBorderC=color
	switch(tableObjet[id].type) {
		case 18:
			for(let i=0;i<tableObjet[id].liste.length;i++){
				var nid=tableObjet[tableObjet[id].liste[i]].id
				document.getElementById(nid).firstChild.firstChild.setAttribute("stroke",color)
			}
			break
		case 19:
			for(let i=0;i<tableObjet[id].liste.length;i++){
				var nid=tableObjet[tableObjet[id].liste[i]].id
				document.getElementById(nid).firstChild.firstChild.setAttribute("stroke",color)
			}
			break
		case 20:
			for(let i=0;i<tableObjet[id].liste.length;i++){
				var nid=tableObjet[tableObjet[id].liste[i]].id
				document.getElementById(nid).firstChild.firstChild.setAttribute("stroke",color)
			}
			break
		case 22:
			for(let i=0;i<tableObjet[id].liste.length;i++){
				var nid=tableObjet[tableObjet[id].liste[i]].id
				document.getElementById(nid).firstChild.firstChild.setAttribute("stroke",color)
			}
			break
		default:
			document.getElementById("objet"+id).firstChild.firstChild.setAttribute('stroke',color)
	}
}
function objetPlGauche(id,ml) {
	var elem=document.getElementById(tableObjet[id].id).firstChild.firstChild
	tableObjet[id].margeG=parseFloat(ml)
	switch(tableObjet[id].type) {
		case 7:
			elem.setAttribute('transform',"translate("+ml+" "+tableObjet[id].margeH+")")
			elem.nextSibling.setAttribute('transform',"translate("+ml+" "+tableObjet[id].margeH+")")
			break
		case 8:
			elem.setAttribute('transform',"translate("+ml+" "+tableObjet[id].margeH+")")
			elem.nextSibling.setAttribute('transform',"translate("+ml+" "+tableObjet[id].margeH+")")
			break
		case 23:
			document.getElementById("objet"+id).firstChild.style.transform="scale("+tableObjet[id].scaleX+","+tableObjet[id].scaleY+")  translate("+tableObjet[id].margeG+"px,"+tableObjet[id].margeH+"px) rotate("+tableObjet[id].rotate+"deg ) "
			break
		default:
			elem.setAttribute('transform',"scale("+tableObjet[id].scaleX+" "+tableObjet[id].scaleY+") translate("+ml+" "+tableObjet[id].margeH+")")
			break
	}
}
function objetPlHaut(id,mh) { 
	var elem=document.getElementById(tableObjet[id].id).firstChild.firstChild
	tableObjet[id].margeH=parseFloat(mh)
	switch(tableObjet[id].type) {
		case 7:
			elem.setAttribute('transform',"translate("+tableObjet[id].margeG+" "+mh+")")
			elem.nextSibling.setAttribute('transform',"translate("+tableObjet[id].margeG+" "+mh+")")
			break
		case 8:
			elem.setAttribute('transform',"translate("+tableObjet[id].margeG+" "+mh+")")
			elem.nextSibling.setAttribute('transform',"translate("+tableObjet[id].margeG+" "+mh+")")
			break
		case 23:
			document.getElementById("objet"+id).firstChild.style.transform="scale("+tableObjet[id].scaleX+","+tableObjet[id].scaleY+")  translate("+tableObjet[id].margeG+"px,"+tableObjet[id].margeH+"px) rotate("+tableObjet[id].rotate+"deg ) "
			break
		default:
			elem.setAttribute('transform',"scale("+tableObjet[id].scaleX+" "+tableObjet[id].scaleY+") translate("+tableObjet[id].margeG+" "+mh+")")
	}
}
function grpNom(id,ml) {
	var elem=document.getElementById(tableObjet[id].id)
	tableObjet[id].nom=ml
	elem.setAttribute("title",ml)
}
function grpPlGauche(id,ml) {
	var elem=document.getElementById(tableObjet[id].id)
	tableObjet[id].posX=tableObjet[id].posX+parseFloat(ml)
	elem.style.left=(parseFloat(elem.style.left)+parseFloat(ml))+"px"
}
function grpPlHaut(id,ml) {
	var elem=document.getElementById(tableObjet[id].id)
	tableObjet[id].posY=tableObjet[id].posY+parseFloat(ml)
	elem.style.top=(parseFloat(elem.style.top)+parseFloat(ml))+"px"
}
function getTranslateXY(element) {
    const style = window.getComputedStyle(element)
    const matrix = new DOMMatrixReadOnly(style.transform)
    return {
        translateX: matrix.e,
        translateY: matrix.f
    }
}
function getScaleXY(element) {
    const style = window.getComputedStyle(element)
    const matrix = new DOMMatrixReadOnly(style.transform)
    return {
        scaleX: matrix.a,
        scaleY: matrix.d
    }
}
function borderGaucheType(id,gtype) {     
	document.getElementById(tableObjet[id].id).style.borderLeftStyle=gtype
	tableObjet[id].borderGs=gtype
}
function borderGaucheColor(id,gcolor) {     
	document.getElementById(tableObjet[id].id).style.borderLeftColor=gcolor
	tableObjet[id].borderGc=gcolor
}
function borderGaucheWidth(id,gwidth) {     
	document.getElementById(tableObjet[id].id).style.borderLeftWidth=gwidth+"px"
	tableObjet[id].borderGw=parseFloat(gwidth)
}
function borderGaucheRadius(id,gradius) {     
	document.getElementById(tableObjet[id].id).style.borderTopLeftRadius=gradius
	tableObjet[id].borderGr=gradius
}
function borderHautType(id,gtype) {     
	document.getElementById(tableObjet[id].id).style.borderTopStyle=gtype
	tableObjet[id].borderHs=gtype
}
function borderHautColor(id,gcolor) {     
	document.getElementById(tableObjet[id].id).style.borderTopColor=gcolor
	tableObjet[id].borderHc=gcolor
}
function borderHautWidth(id,gwidth) {     
	document.getElementById(tableObjet[id].id).style.borderTopWidth=gwidth+"px"
	tableObjet[id].borderHw=parseFloat(gwidth)
}
function borderHautRadius(id,gradius) {     
	document.getElementById(tableObjet[id].id).style.borderTopRightRadius=gradius
	tableObjet[id].borderHr=gradius
}
function borderDroitType(id,gtype) {     
	document.getElementById(tableObjet[id].id).style.borderRightStyle=gtype
	tableObjet[id].borderDs=gtype
}
function borderDroitColor(id,gcolor) {     
	document.getElementById(tableObjet[id].id).style.borderRightColor=gcolor
	tableObjet[id].borderDc=gcolor
}
function borderDroitWidth(id,gwidth) {     
	document.getElementById(tableObjet[id].id).style.borderRightWidth=gwidth+"px"
	tableObjet[id].borderDw=parseFloat(gwidth)
}
function borderDroitRadius(id,gradius) {     
	document.getElementById(tableObjet[id].id).style.borderBottomRightRadius=gradius
	tableObjet[id].borderDr=gradius
}
function borderBasType(id,gtype) {     
	document.getElementById(tableObjet[id].id).style.borderBottomStyle=gtype
	tableObjet[id].borderBs=gtype
}
function borderBasColor(id,gcolor) {     
	document.getElementById(tableObjet[id].id).style.borderBottomColor=gcolor
	tableObjet[id].borderBc=gcolor
}
function borderBasWidth(id,gwidth) {     
	document.getElementById(tableObjet[id].id).style.borderBottomWidth=gwidth+"px"
	tableObjet[id].borderBw=parseFloat(gwidth)
}
function borderBasRadius(id,gradius) {     
	document.getElementById(tableObjet[id].id).style.borderBottomLeftRadius=gradius
	tableObjet[id].borderBr=gradius
}
function borderGrpGType(id,gtype) {     
	document.getElementById(tableObjet[id].id).style.borderLeftStyle=gtype
	tableObjet[id].borderGs=gtype
}
function borderGrpGColor(id,gcolor) {     
	document.getElementById(tableObjet[id].id).style.borderLeftColor=gcolor
	tableObjet[id].borderGc=gcolor
}
function borderGrpGWidth(id,gwidth) {     
	document.getElementById(tableObjet[id].id).style.borderLeftWidth=gwidth+"px"
	tableObjet[id].borderGw=parseFloat(gwidth)
}
function borderGrpGRadius(id,gradius) {     
	document.getElementById(tableObjet[id].id).style.borderTopLeftRadius=gradius
	tableObjet[id].borderGr=gradius
}
function borderGrpHType(id,gtype) {     
	document.getElementById(tableObjet[id].id).style.borderTopStyle=gtype
	tableObjet[id].borderHs=gtype
}
function borderGrpHColor(id,gcolor) {     
	document.getElementById(tableObjet[id].id).style.borderTopColor=gcolor
	tableObjet[id].borderHc=gcolor
}
function borderGrpHWidth(id,gwidth) {     
	document.getElementById(tableObjet[id].id).style.borderTopWidth=gwidth+"px"
	tableObjet[id].borderHw=parseFloat(gwidth)
}
function borderGrpHRadius(id,gradius) {     
	document.getElementById(tableObjet[id].id).style.borderTopRightRadius=gradius
	tableObjet[id].borderHr=gradius
}
function borderGrpDType(id,gtype) {     
	document.getElementById(tableObjet[id].id).style.borderRightStyle=gtype
	tableObjet[id].borderDs=gtype
}
function borderGrpDColor(id,gcolor) {     
	document.getElementById(tableObjet[id].id).style.borderRightColor=gcolor
	tableObjet[id].borderDc=gcolor
}
function borderGrpDWidth(id,gwidth) {     
	document.getElementById(tableObjet[id].id).style.borderRightWidth=gwidth+"px"
	tableObjet[id].borderDw=parseFloat(gwidth)
}
function borderGrpDRadius(id,gradius) {     
	document.getElementById(tableObjet[id].id).style.borderBottomRightRadius=gradius
	tableObjet[id].borderDr=gradius
}
function borderGrpBType(id,gtype) {     
	document.getElementById(tableObjet[id].id).style.borderBottomStyle=gtype
	tableObjet[id].borderBs=gtype
}
function borderGrpBColor(id,gcolor) {     
	document.getElementById(tableObjet[id].id).style.borderBottomColor=gcolor
	tableObjet[id].borderBc=gcolor
}
function borderGrpBWidth(id,gwidth) {     
	document.getElementById(tableObjet[id].id).style.borderBottomWidth=gwidth+"px"
	tableObjet[id].borderBw=parseFloat(gwidth)
}
function borderGrpBRadius(id,gradius) {     
	document.getElementById(tableObjet[id].id).style.borderBottomLeftRadius=gradius
	tableObjet[id].borderBr=gradius
}
function importProjet(txt){
var tableProjet=txt.split(',')
	paramProjet={
	name:tableProjet[0],
	start:tableProjet[1],
	end:tableProjet[2],
	comment:tableProjet[3],
	path:tableProjet[4],
	audioPath:tableProjet[5],
	imgPath:tableProjet[6],
	greffon3D:tableProjet[7],
	greffonC:parseInt(tableProjet[8]),
	regle:JSON.parse(tableProjet[9]),
	mesure:JSON.parse(tableProjet[10]),
	grille:JSON.parse(tableProjet[11]),
	width:parseFloat(tableProjet[12]),
	height:parseFloat(tableProjet[13]),
	zoom:parseFloat(tableProjet[14]),
	svgRegle:JSON.parse(tableProjet[15]),
	svgMesure:JSON.parse(tableProjet[16]),
	svgGrille:JSON.parse(tableProjet[17]),
	spaceSeconde:JSON.parse(tableProjet[18]),
	svgSeconde:JSON.parse(tableProjet[19]),
	}
	zoomInit(100)
	upDateWorkSpace(1)
	var txt=paramProjet.name+","+paramProjet.path+","+paramProjet.audioPath+","+paramProjet.imgPath+","+editor+","+daw+","+cmdDaw+","+pdfPage+","+pdfLandscape+","+pdfScale+","+pdfMgTop+","+pdfMgBot+","+pdfMgLeft+','+pdfMgRight+","+pdfBkg+","+pdfAssCmd+","+pdfAppCmd
	window.api.send("toMain", 'defExterne;'+btoa(txt))
}
function renameProjet(nname) {
	paramProjet.name=nname;
	var naudio=paramProjet.audioPath.split('/');
	paramProjet.audioPath='';
	paramProjet.imgPath='';
	for(i=0;i<naudio.length-3;i++){
		paramProjet.audioPath=paramProjet.audioPath+naudio[i]+'/';
		paramProjet.imgPath=paramProjet.imgPath+naudio[i]+'/';
	}
	paramProjet.audioPath=paramProjet.audioPath+paramProjet.name+"/Audios/"
	paramProjet.imgPath=paramProjet.imgPath+paramProjet.name+"/Images/";
	saveProjet("1");
	
}
function importConfigProjet(){
	path=paramProjet.path
	audioDirectory=paramProjet.audioPath
	imgDirectory=paramProjet.imgPath
	spat3D=paramProjet.greffon3D
	spat3dCanaux=paramProjet.greffonC
	if(paramProjet.regle==true){
		setTimeRegle=true
	}else{
		setTimeRegle=false
	}
	if(paramProjet.mesure==true){
		setSignRegle=true
	}else{
		setSignRegle=false
	}
	if(paramProjet.grille==true){
		setgrille=true
	}else{
		setgrille=false
	}
	winWidth=parseFloat(paramProjet.width)
	winHeight=parseFloat(paramProjet.height)
	zoomScale=parseFloat(paramProjet.zoom)
	if(paramProjet.svgRegle==true){
		vueSvgRegle=true
	}else{
		vueSvgRegle=false
	}
	if(paramProjet.svgMesure==true){
		vueSvgMesure=true
	}else{
		vueSvgMesure=false
	}
	if(paramProjet.svgGrille==true){
		vueSvgGrille=true
	}else{
		vueSvgGrille=false
	}
	if(paramProjet.spaceSeconde==true){
		spaceSeconde=true
	}else{
		spaceSeconde=false
	}
	if(paramProjet.svgSeconde==true){
		svgSeconde=true
	}else{
		svgSeconde=false
	}
}
function importSpace(txt){
var tableSpace=txt.split(',')
	paramSpace={
		lForwardX:parseFloat(tableSpace[0]),
		lForwardY:parseFloat(tableSpace[1]),
		lForwardZ:parseFloat(tableSpace[2]),
		lUpX:parseFloat(tableSpace[3]),
		lUpY:parseFloat(tableSpace[4]),
		lUpZ:parseFloat(tableSpace[5]),
		lPosX:parseFloat(tableSpace[6]),
		lPosY:parseFloat(tableSpace[7]),
		lPosZ:parseFloat(tableSpace[8]),
		PModel:tableSpace[9],
		DModel:tableSpace[10],
		refD:parseInt(tableSpace[11]),
		maxD:parseInt(tableSpace[12]),
		rolF:parseFloat(tableSpace[13]),
		coneIA:parseFloat(tableSpace[14]),
		coneOA:parseFloat(tableSpace[15]),
		coneOG:parseFloat(tableSpace[16]),
		orX:parseFloat(tableSpace[17]),
		orY:parseFloat(tableSpace[18]),
		orZ:parseFloat(tableSpace[19])
	}
}
function importConfigSpace(){
 listenerForwardX=paramSpace.lForwardX
 listenerForwardY=paramSpace.lForwardY
 listenerForwardZ=paramSpace.lForwardZ
 listenerUpX=paramSpace.lUpX
 listenerUpY=paramSpace.lUpY
 listenerUpZ=paramSpace.lUpZ
 listenerPositionX=paramSpace.lPosX
 listenerPositionY=paramSpace.lPosY
 listenerPositionZ=paramSpace.lPosZ
 pannerPanningModel = paramSpace.PModel
 pannerDistanceModel = paramSpace.DModel
 pannerRefDistance = paramSpace.refD
 pannerMaxDistance = paramSpace.maxD
 pannerRolloffFactor = paramSpace.rolF
 pannerConeInnerAngle = paramSpace.coneIA
 pannerConeOuterAngle = paramSpace.coneOA
 pannerConeOuterGain = paramSpace.coneOG
 pannerOrientationX=paramSpace.orX
 pannerOrientationY=paramSpace.orY
 pannerOrientationZ=paramSpace.orZ
}
function importInterface(txt){
var interf=txt.split(':')
 paletteBkg=interf[0]
 fontPalette=interf[1]
 fontPaletteSize=parseFloat(interf[2])
 separateurPalette=interf[3]
 fontSizeMenu=parseFloat(interf[4])
 bkgInfo=interf[5]
 fontInfoSize=parseFloat(interf[6])
 fontInfoColor=interf[7]
 regleBackground=interf[8]
 regleFontSize=parseFloat(interf[9])
 regleFontColor=interf[10]
 intervalBackground=interf[11]
 intervalFontSize=parseFloat(interf[12])
 fontIntervalColor=interf[13]
 workSpaceBkg=interf[14]
 spaceGrilleOpacity=parseFloat(interf[15])
 colorGrille=interf[16]
 suiveurBkg=interf[17]
 popupTitreBkg=interf[18]
 popupHeaderFontSize=parseFloat(interf[19])
 popupFontTitreColor=interf[20]
 popupFontColor=interf[21]
 popupBkgColor=interf[22]
 popupFontSize=parseFloat(interf[23])
 popupOngletFontColor=interf[24]
 popupFontOngletSize=parseFloat(interf[25])
 popupOngletBkg=interf[26]
 popupOngletActifBkg=interf[27]
 lang=interf[28]
 vueSvgBackground=interf[29]
 vueSvgFontSize=interf[30]
 vueSvgFontColor=interf[31]
}
function importPalette(txt){
	var interf=txt.split(',')
	paletteDisque=interf[0]
	paletteCarre=interf[1]
	paletteTriangle=interf[2]
	paletteEllipse=interf[3]
	paletteRectangle=interf[4]
	paletteTrianglelong=interf[5]
	paletteRondlong=interf[6]
	paletteCarrelong=interf[7]
	paletteCrescendo=interf[8]
	paletteLigne=interf[9]
	paletteGlissando=interf[10]
	paletteBlock=interf[11]
	paletteDecresc=interf[12]
	paletteDecrescb=interf[13]
	paletteCresc=interf[14]
	paletteCrescb=interf[15]
	paletteAgregat=interf[16]
	paletteArpege=interf[17]
	paletteMultilignes=interf[18]
	paletteNuage=interf[19]
	paletteTexture=interf[20]
	paletteImage=interf[21]
	paletteSymb=interf[22]
	paletteFleche=interf[23]
	paletteMarque1=interf[24]
	paletteMarque2=interf[25]
	paletteLecteur=interf[26]
	configPalette()
	for(let i=1;i<50;i++){
		document.getElementById("symb"+i).firstChild.firstChild.setAttribute("fill",paletteSymb)
	}
	
	document.getElementById("pcouleur").firstChild.firstChild.setAttribute('fill',paletteDisque)
	document.getElementById("toutEnBas").firstChild.firstChild.firstChild.nextSibling.setAttribute('fill',paletteFleche)
	document.getElementById("toutEnBas").firstChild.firstChild.firstChild.nextSibling.nextSibling.setAttribute('stroke',paletteMarque1)
	document.getElementById("toutEnBas").firstChild.firstChild.firstChild.nextSibling.nextSibling.nextSibling.setAttribute('stroke',paletteMarque1)
	document.getElementById("toutEnBas").firstChild.firstChild.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.setAttribute('stroke',paletteMarque1)
	document.getElementById("toutEnBas").firstChild.firstChild.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.setAttribute('stroke',paletteMarque1)
	document.getElementById("toutEnBas").firstChild.firstChild.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.setAttribute('stroke',paletteMarque2)
	document.getElementById("descendre").firstChild.firstChild.firstChild.setAttribute('stroke',paletteFleche)
	document.getElementById("descendre").firstChild.firstChild.firstChild.nextSibling.setAttribute('fill',paletteFleche)
	document.getElementById("descendre").firstChild.firstChild.firstChild.nextSibling.nextSibling.setAttribute('stroke',paletteMarque1)
	document.getElementById("descendre").firstChild.firstChild.firstChild.nextSibling.nextSibling.nextSibling.setAttribute('stroke',paletteMarque1)
	document.getElementById("descendre").firstChild.firstChild.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.setAttribute('stroke',paletteMarque2)
	document.getElementById("descendre").firstChild.firstChild.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.setAttribute('stroke',paletteMarque1)
	document.getElementById("descendre").firstChild.firstChild.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.setAttribute('stroke',paletteMarque1)
	document.getElementById("monter").firstChild.firstChild.firstChild.setAttribute('stroke',paletteFleche)
	document.getElementById("monter").firstChild.firstChild.firstChild.nextSibling.setAttribute('fill',paletteFleche)
	document.getElementById("monter").firstChild.firstChild.firstChild.nextSibling.nextSibling.setAttribute('stroke',paletteMarque1)
	document.getElementById("monter").firstChild.firstChild.firstChild.nextSibling.nextSibling.nextSibling.setAttribute('stroke',paletteMarque1)
	document.getElementById("monter").firstChild.firstChild.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.setAttribute('stroke',paletteMarque2)
	document.getElementById("monter").firstChild.firstChild.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.setAttribute('stroke',paletteMarque1)
	document.getElementById("monter").firstChild.firstChild.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.setAttribute('stroke',paletteMarque1)
	document.getElementById("toutEnHaut").firstChild.firstChild.firstChild.setAttribute('stroke',paletteFleche)
	document.getElementById("toutEnHaut").firstChild.firstChild.firstChild.nextSibling.setAttribute('fill',paletteFleche)
	document.getElementById("toutEnHaut").firstChild.firstChild.firstChild.nextSibling.nextSibling.setAttribute('stroke',paletteMarque2)
	document.getElementById("toutEnHaut").firstChild.firstChild.firstChild.nextSibling.nextSibling.nextSibling.setAttribute('stroke',paletteMarque1)
	document.getElementById("toutEnHaut").firstChild.firstChild.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.setAttribute('stroke',paletteMarque1)
	document.getElementById("toutEnHaut").firstChild.firstChild.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.setAttribute('stroke',paletteMarque1)
	document.getElementById("toutEnHaut").firstChild.firstChild.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.setAttribute('stroke',paletteMarque1)
	
	document.getElementById("pforme").firstChild.firstChild.firstChild.setAttribute('fill',paletteDisque)
	document.getElementById("pforme").firstChild.firstChild.firstChild.nextSibling.setAttribute('fill',paletteCarre)
	document.getElementById("pforme").firstChild.firstChild.firstChild.nextSibling.nextSibling.setAttribute('fill',paletteTriangle)
	
	document.getElementById("gauche").firstChild.firstChild.firstChild.setAttribute('stroke',paletteMarque2)
	document.getElementById("gauche").firstChild.firstChild.firstChild.nextSibling.setAttribute('stroke',paletteMarque1)
	document.getElementById("gauche").firstChild.firstChild.firstChild.nextSibling.nextSibling.setAttribute('stroke',paletteMarque1)
	document.getElementById("gauche").firstChild.firstChild.firstChild.nextSibling.nextSibling.nextSibling.setAttribute('stroke',paletteMarque1)
	document.getElementById("gauche").firstChild.firstChild.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.setAttribute('stroke',paletteMarque1)
	document.getElementById("gauche").firstChild.firstChild.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.setAttribute('stroke',paletteMarque1)
	document.getElementById("gauche").firstChild.firstChild.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.setAttribute('stroke',paletteMarque1)
	document.getElementById("haut").firstChild.firstChild.firstChild.setAttribute('stroke',paletteMarque2)
	document.getElementById("haut").firstChild.firstChild.firstChild.nextSibling.setAttribute('stroke',paletteMarque1)
	document.getElementById("haut").firstChild.firstChild.firstChild.nextSibling.nextSibling.setAttribute('stroke',paletteMarque1)
	document.getElementById("haut").firstChild.firstChild.firstChild.nextSibling.nextSibling.nextSibling.setAttribute('stroke',paletteMarque1)
	document.getElementById("haut").firstChild.firstChild.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.setAttribute('stroke',paletteMarque1)
	document.getElementById("haut").firstChild.firstChild.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.setAttribute('stroke',paletteMarque1)
	document.getElementById("haut").firstChild.firstChild.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.setAttribute('stroke',paletteMarque1)
	document.getElementById("droite").firstChild.firstChild.firstChild.setAttribute('stroke',paletteMarque2)
	document.getElementById("droite").firstChild.firstChild.firstChild.nextSibling.setAttribute('stroke',paletteMarque1)
	document.getElementById("droite").firstChild.firstChild.firstChild.nextSibling.nextSibling.setAttribute('stroke',paletteMarque1)
	document.getElementById("droite").firstChild.firstChild.firstChild.nextSibling.nextSibling.nextSibling.setAttribute('stroke',paletteMarque1)
	document.getElementById("droite").firstChild.firstChild.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.setAttribute('stroke',paletteMarque1)
	document.getElementById("droite").firstChild.firstChild.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.setAttribute('stroke',paletteMarque1)
	document.getElementById("droite").firstChild.firstChild.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.setAttribute('stroke',paletteMarque1)
	document.getElementById("bas").firstChild.firstChild.firstChild.setAttribute('stroke',paletteMarque2)
	document.getElementById("bas").firstChild.firstChild.firstChild.nextSibling.setAttribute('stroke',paletteMarque1)
	document.getElementById("bas").firstChild.firstChild.firstChild.nextSibling.nextSibling.setAttribute('stroke',paletteMarque1)
	document.getElementById("bas").firstChild.firstChild.firstChild.nextSibling.nextSibling.nextSibling.setAttribute('stroke',paletteMarque1)
	document.getElementById("bas").firstChild.firstChild.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.setAttribute('stroke',paletteMarque1)
	document.getElementById("bas").firstChild.firstChild.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.setAttribute('stroke',paletteMarque1)
	document.getElementById("bas").firstChild.firstChild.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.setAttribute('stroke',paletteMarque1)
	
	document.getElementById("play1").firstChild.firstChild.setAttribute("fill",paletteLecteur)
	document.getElementById("play1").firstChild.firstChild.nextSibling.setAttribute("fill",paletteLecteur)
	document.getElementById("play1").firstChild.firstChild.nextSibling.nextSibling.setAttribute("fill",paletteLecteur)
	document.getElementById("play2").firstChild.firstChild.setAttribute("fill",paletteLecteur)
	document.getElementById("play2").firstChild.firstChild.nextSibling.setAttribute("fill",paletteLecteur)
	document.getElementById("play3").firstChild.firstChild.setAttribute("fill",paletteLecteur)
	document.getElementById("play4").firstChild.firstChild.setAttribute("fill",paletteLecteur)
	document.getElementById("play4").firstChild.firstChild.nextSibling.setAttribute("fill",paletteLecteur)
	document.getElementById("play5").firstChild.firstChild.setAttribute("fill",paletteLecteur)
	document.getElementById("play5").firstChild.firstChild.nextSibling.setAttribute("fill",paletteLecteur)
	document.getElementById("play5").firstChild.firstChild.nextSibling.nextSibling.setAttribute("fill",paletteLecteur)
}
function setPalette(){
	
}
function importExterne(txt){
	var defc=atob(txt).split(',')
	editor=defc[0]
	daw=defc[1]
	cmdDaw=defc[2]
	pdfPage=parseInt(defc[3])
	pdfLandscape=parseFloat(defc[4])
	pdfScale=parseFloat(defc[5])
	pdfMgTop=parseFloat(defc[6])
	pdfMgBot=parseFloat(defc[7])
	pdfMgLeft=parseFloat(defc[8])
	pdfMgRight=parseFloat(defc[9])
	pdfBkg=parseInt(defc[10])
	pdfAssCmd=defc[11]
	pdfAppCmd=defc[12]
	editAudioCmd=defc[13]
	if(daw=='reaper'){
			document.getElementById("read3d").src="./images/png/reaper.png"
	}else{
			document.getElementById("read3d").src="./images/png/Ardour-icon.png"
	}
}
function spatialspXZ(id,pt,X,Z) {
	tableObjet[id].spX[pt]=parseFloat(X);
   tableObjet[id].spZ[pt]=parseFloat(Z);
}
function spatialspZY(id,pt,Z,Y) {
	tableObjet[id].spZ[pt]=parseFloat(Z);
   tableObjet[id].spY[pt]=parseFloat(Y);
}
function spatialspXY(id,pt,X,Y) {
	tableObjet[id].spX[pt]=parseFloat(X);
   tableObjet[id].spY[pt]=parseFloat(Y);
}
function spatialspT(id,pt,T) {
	tableObjet[id].spT[pt]=parseFloat(T);
}
function spatialspD(id,pt,D) {
	tableObjet[id].spD[pt]=parseFloat(D);
}
function createSpatialPoint(id,pt,t){
	tableObjet[id].spX[pt]=0
	tableObjet[id].spY[pt]=0
	tableObjet[id].spZ[pt]=0
	tableObjet[id].spD[pt]=1
	tableObjet[id].spT[pt]=parseFloat(t);
}
function openStudio() {
	if(typeof objActif !== typeof undefined  && objActif!==1048576){
		var id=objActif
		window.api.send("toMain", "openStudio;"+objActif+";"+tableObjet[id].spX+";"+tableObjet[id].spY+";"+tableObjet[id].spZ+";"+tableObjet[id].gain)
	}
}
function selectElement(id, valueToSelect) {    
    let element = document.getElementById(id);
    element.value = valueToSelect;
}

function defSelectListeFx(){
	var txt=""
	for(let j=0;j<7;j++){
		txt=txt+"<span style='position:absolute;top:"+(40+(28*j))+"px;left:10px;' ><select id='selecFx"+j+"' size='1' value='0' onchange='fxOnChange("+j+",value);'>"
		for(let i in listeFx){
			txt=txt+"<option value='"+listeFx[i].name+"'>"+listeFx[i].name+"</option>"
		}
		txt=txt+"</select></span>"
		txt=txt+"<span  style='position:absolute;top:"+(36+(28*j))+"px;left:145px;' ><img src='./images/png/clesFx.png' style='width=24px;'  onclick='fxParam("+j+");'></span>"
	}
	document.getElementById("formSelecFx").innerHTML=txt
}
function fxOnChange(id,filtre) {
	idFxParam=id
	tableObjet[objActif].tableFx[id]=listeFx[filtre].name;
	tableObjet[objActif].tableFxParam[idFxParam]=listeFx[filtre].defaut
}
/*
function fxParam(id) {
	idFxParam=id
	var content=listeFx[tableObjet[objActif].tableFx[id]].interface
	var wd=listeFx[tableObjet[objActif].tableFx[id]].width
	var wh=listeFx[tableObjet[objActif].tableFx[id]].height
	openPopup(tableObjet[objActif].tableFx[id],400,200,wd,wh,0,content)
	var nt=tableObjet[objActif].tableFx[id]
	console.log('nt',nt)
	document.getElementById('popup'+nt).style.backgroundColor='#a46345'
	var doc=document.getElementById('popupContent'+nt).firstChild.getElementsByTagName('div')
	document.getElementById('popupContent'+nt).firstChild.style.marginTop='10px'
	var greffon=tableObjet[objActif].tableFx[idFxParam]
	for(let i=0;i<doc.length;i++){
		if(doc[i].id.substring(0,5)=='butta'){
			dragElement(document.getElementById(doc[i].id))
			var tbscale=listeFx[greffon].scale.split(',')
			var tbpos=listeFx[greffon].position.split(',')
			document.getElementById(doc[i].id).firstChild.firstChild.setAttribute('transform','translate('+tbpos[i]+','+tbpos[i]+') scale('+tbscale[i]+')')
		}
		if(doc[i].id.substring(0,5)=='slide'){
			dragElement(document.getElementById(doc[i].id))
		}
	}
	var param=tableObjet[objActif].tableFxParam[idFxParam].split('/')
	var tbdefaut=listeFx[greffon].label.split(',')

	for(let i=0;i<param.length;i++){
		if(doc[i].id.substring(0,5)=='check' ){
			document.getElementById("inp"+tbdefaut[i]).value=param[i]
			fxParamModifCheck2("inp"+tbdefaut[i],"check"+tbdefaut[i])
		}
		if(doc[i].id.substring(0,5)=='radio' ){
			document.getElementById("inp"+tbdefaut[i]).value=param[i]
			fxParamModifRadio2("radio"+tbdefaut[i],param[i])
		}
		if(doc[i].id.substring(0,5)=='butta'){
			document.getElementById("inp"+tbdefaut[i]).value=param[i]
			fxParamModifBB("inp"+tbdefaut[i],"butta"+tbdefaut[i])
		}
		if(doc[i].id.substring(0,5)=='slide'){
			document.getElementById("inp"+tbdefaut[i]).value=param[i]
			fxParamModifSB("inp"+tbdefaut[i],"slider"+tbdefaut[i])
		}
	}
	//validFxParam(tableObjet[objActif].tableFx[id])
}
*/
function createFxPoint(e) {
	if(e.button==2){
	var dest=e.target.parentNode
	var txt="";
	var nbdiv=dest.getElementsByTagName('div').length
	var dupnode=document.createElement('div');
	var greffon=e.target.parentNode.parentNode.parentNode.parentNode.parentNode.id
	var tableLabel=listeFx[greffon].label.split(',')
	var index2=tableLabel.indexOf(e.target.parentNode.id)
	dupnode.setAttribute("id",'fx'+nbdiv+index2);
	dupnode.setAttribute("title",'fx'+nbdiv+index2+":");
	var posx=parseFloat(document.getElementById('fx'+(nbdiv-1)+index2).style.left)+4
	var st='position:absolute;top:30px;left:'+posx+'px;width:5px;height:5px;background-color:#f100fa;'
	dupnode.setAttribute("style",st);
	dest.appendChild(dupnode);
	dragElement(dupnode)
	updateFxAutomation(dupnode)
	}
}
function fxParam(id) {
	idFxParam=id
	var content=listeFx[tableObjet[objActif].tableFx[id]].interface
	var wd=listeFx[tableObjet[objActif].tableFx[id]].width
	var wh=listeFx[tableObjet[objActif].tableFx[id]].height
	openPopup(tableObjet[objActif].tableFx[id],400,200,wd,wh,0,content)
	var nt=tableObjet[objActif].tableFx[id]
	var greffon=tableObjet[objActif].tableFx[idFxParam]
	document.getElementById('popup'+nt).style.backgroundColor='#a46345'
	drawFxAutomation(greffon)
	
	var tbdefaut=listeFx[greffon].label.split(',')
	for(j=0;j<tbdefaut.length;j++){
		document.getElementById(tbdefaut[j]).addEventListener("mousedown", createFxPoint);
	}
}

function fxAnnulAddPlugin(){
	document.getElementById("listNewFx").style.display="none"
}
function fxValidAddPlugin(filtre){
	document.getElementById("listNewFx").style.display="none"
	//document.getElementById(filtre).style.display="none"
	//tableObjet[objActif].tableFx[i]=filtre
}
function openListeFx() {
	document.getElementById("listNewFx").style.display="block"
	document.getElementById("listNewFx").style.backgroundColor='#ffdea4'
	for(let j=0;j<7;j++){
		selectElement("selecFx"+j,tableObjet[objActif].tableFx[j] );
	}
}
/*
function defautFxParam() {
	var greffon=tableObjet[objActif].tableFx[idFxParam]
	var defaut=listeFx[tableObjet[objActif].tableFx[idFxParam]].defaut
	tableObjet[objActif].tableFxParam[idFxParam]=defaut;
	var nt=tableObjet[objActif].tableFx[idFxParam]
	var doc=document.getElementById('popupContent'+nt).firstChild.getElementsByTagName('div')
	var param=tableObjet[objActif].tableFxParam[idFxParam].split('/')
	var tbdefaut=listeFx[greffon].label.split(',')
	
	for(let i=0;i<param.length;i++){
		if(doc[i].id.substring(0,5)=='check' ){
			document.getElementById("inp"+tbdefaut[i]).value=param[i]
			fxParamModifCheck2("inp"+tbdefaut[i],"check"+tbdefaut[i])
		}
		if(doc[i].id.substring(0,5)=='radio' ){
			document.getElementById("inp"+tbdefaut[i]).value=param[i]
			fxParamModifRadio2("radio"+tbdefaut[i],param[i])
		}
		if(doc[i].id.substring(0,5)=='butta'){
			document.getElementById("inp"+tbdefaut[i]).value=param[i]
			fxParamModifBB("inp"+tbdefaut[i],"butta"+tbdefaut[i])
		}
		if(doc[i].id.substring(0,5)=='slide'){
			document.getElementById("inp"+tbdefaut[i]).value=param[i]
			fxParamModifSB("inp"+tbdefaut[i],"slider"+tbdefaut[i])
		}
	}
}
*/
function defautFxParam(NameGreffon) {
	var id=tableObjet[objActif].tableFx.indexOf(NameGreffon)
	var greffon=tableObjet[objActif].tableFx[id]
	var defaut=listeFx[tableObjet[objActif].tableFx[id]].defaut
	tableObjet[objActif].tableFxParam[id]=defaut;
	drawFxAutomation(NameGreffon)
}
function annulFxParam(title) {
	closePopup(title)
}
function validFxParam(greffon) {
	var tableLabel=listeFx[greffon].label.split(',')
	var npoints;
	var txt=""
	var rw;
	var nduree;
	var relative;
	for(i=0;i<tableLabel.length;i++){
		npoints=document.getElementById(tableLabel[i]).getElementsByTagName('div')
		for(j=0;j<npoints.length;j++){
			rw=tableObjet[objActif].fin-tableObjet[objActif].debut;
			nduree=tableObjet[objActif].duree/tableObjet[objActif].transposition
			relative=nduree*rw
			var tbmin=listeFx[greffon].min.split(",")
			var tbmax=listeFx[greffon].max.split(",")
			
			var vy=parseFloat(npoints[j].title.substring(5))
			var nbv=document.getElementById("Y"+npoints[j].parentNode.id).step.toString().split(".");
				if(nbv[1]){
					vy=vy.toFixed(nbv[1].length)
				}else{
					vy=parseInt(vy)
				}
			var vx=((parseFloat(npoints[j].style.left)/200)*relative).toFixed(2)
			txt=txt+vx+"?"+vy+"&"
		}
		txt = txt.substring(0, txt.length - 1);
		txt=txt+"/"
	}
	txt = txt.substring(0, txt.length - 1)
	var index=tableObjet[objActif].tableFx.indexOf(greffon)
	tableObjet[objActif].tableFxParam[index]=txt
	closePopup(greffon)
}
let selectPointFx=""
function fxParamModifPT(bloc) {
	var parentPoint=document.getElementById(selectPointFx).parentNode.id
	rw=tableObjet[objActif].fin-tableObjet[objActif].debut;
	nduree=tableObjet[objActif].duree/tableObjet[objActif].transposition
	relative=nduree*rw
	if(selectPointFx!="" && bloc==parentPoint){
		var vx=((parseFloat(document.getElementById("X"+bloc).value)*200)/relative).toFixed(2)
		document.getElementById(selectPointFx).style.left=vx+"px"
		updateFxAutomation(document.getElementById(selectPointFx))
	}
}
function fxParamModifPV(bloc,bmax,bmin) {
	var parentPoint=document.getElementById(selectPointFx).parentNode.id
	if(selectPointFx!="" && bloc==parentPoint){
		var vy=((document.getElementById("Y"+bloc).value-bmax)*60)/-(bmax-bmin)
		document.getElementById(selectPointFx).style.top=vy+"px"
		document.getElementById(selectPointFx).title=selectPointFx+":"+document.getElementById("Y"+bloc).value
		updateFxAutomation(document.getElementById(selectPointFx))
	}
}
function fxParamModif(ref1,ref2) {
	document.getElementById(ref2).value=document.getElementById(ref1).value
}
function fxParamModifCheck(ref1,ref2) {
	if(document.getElementById(ref2).firstChild.nextSibling.checked==true){
		document.getElementById(ref1).value=1
	}else{
		document.getElementById(ref1).value=0
	}
}
function fxParamModifCheck2(ref1,ref2) {
	if(document.getElementById(ref1).value=='1'){
		document.getElementById(ref2).firstChild.nextSibling.checked=true
	}else{
		document.getElementById(ref2).firstChild.nextSibling.checked=false
	}
}
function fxParamModifRadio(ref1,ref2) {
		document.getElementById(ref1).value=ref2
}
function fxParamModifRadio2(ref1,ref2) {
	var bt=document.getElementById(ref1).getElementsByTagName('input')
	bt[ref2].checked=true
}
function fxParamModifSB(ref1,ref2) {
	var doc=document.getElementById(ref1)
	var h=document.getElementById(ref2).firstChild.firstChild.getAttribute("height")
	if(parseFloat(doc.min)>0){
   	var mx=parseFloat(doc.max)-parseFloat(doc.min)
   	var h2=h-(h*(-parseFloat(doc.min)/mx))
   	var r=h2-((h/mx)*parseFloat(document.getElementById(ref1).value))
   }else{
   	var mx=parseFloat(doc.max)-parseFloat(doc.min)
   	var h2=h-(h*(-parseFloat(doc.min)/mx))
   	var r=h2-((h/mx)*parseFloat(document.getElementById(ref1).value))
   }
   
   if(r<0){
 		r=0
 	}
 	if(r>100){
 		r=100
 	}
 	var elmnt=document.getElementById(ref2)
 	elmnt.firstChild.firstChild.nextSibling.setAttribute("y",r+3)
 	elmnt.firstChild.firstChild.nextSibling.nextSibling.setAttribute("cy",r+10)
 	elmnt.firstChild.firstChild.nextSibling.nextSibling.nextSibling.setAttribute("y",r+14)
 	elmnt.firstChild.firstChild.nextSibling.nextSibling.nextSibling.setAttribute("height",100-r)
}
function fxParamModifBB(ref1,ref2) {
	var doc=document.getElementById(ref1)
   var mx=parseFloat(doc.max)-parseFloat(doc.min)
   var h=270
   var r=(h/mx)*(parseFloat(document.getElementById(ref1).value))
 	if(r<0){
 		r=0
 	}
 	if(r>270){
 		r=270
 	}
 	var doc=document.getElementById(ref1)
 	document.getElementById(ref2).firstChild.firstChild.firstChild.nextSibling.setAttribute('transform','rotate('+r+' 22 22)')
 	var cx=22
 	var cy=22
 	var rx=24
 	var ry=24
 	var t1=2.4
 	var Δ= r*(π/180)
 	var φ= 0
 	var arc=f_svg_ellipse_arc([cx,cy],[rx,ry], [t1, Δ], φ )
 	document.getElementById(ref2).firstChild.firstChild.firstChild.setAttribute('d',arc.getAttribute('d'))
}
//document.getElementById("zoomWaveForm").addEventListener('input',waveFormZoom);

function waveSvgForm(pos,zoom) {
	document.getElementById("canvas").style.display="block"
	var w=200*zoom
	//document.getElementById("canvas").firstChild.nextSibling.firstChild.setAttribute('width',w)
	var nbuf=defAudioObjet(objActif)
}
function waveFormZoom() {
	var z=parseFloat(document.getElementById("zoomWaveForm").value)
	waveSvgForm(0.5,z)
}
function saveWaveForm() {
	
	//document.getElementById("dfWave").firstChild.setAttribute("height",400)
	//document.getElementById("dfWave").firstChild.setAttribute("viewBox","0 0 600 400")
	var doc=document.getElementById("dfWave").innerHTML
	//console.log(document.getElementById("dfWave").firstChild,doc)
	doc=btoa(doc)
	window.api.send("toMain", "saveSvg;"+doc)
}
function closeWaveForm(){
	document.getElementById("canvas").style.display="none"
}
function waveFormH() {
	var z=parseFloat(document.getElementById("zHWaveForm").value)
	//var zx=parseFloat(document.getElementById("zoomWaveForm").value)
	//document.getElementById("canvas").firstChild.setAttribute("transform","scale(1 "+z+")")
	
	document.getElementById("dfWave").firstChild.firstChild.setAttribute("transform","translate(0 50) scale(1 "+(z)+")");
	//console.log("z",z,document.getElementById("canvas").firstChild.firstChild)
}
//document.getElementById("waveFormColor").addEventListener("input", updateFirst, false);
document.getElementById("waveFormColor").addEventListener("change",  waveFormColor, false);
function waveFormColor(e) { 
	document.getElementById("waveFormColor").value=e.target.value
	var wf=document.getElementById("dfWave").firstChild.firstChild
	wf.querySelectorAll("rect").forEach((p) => {
    p.setAttribute('fill',e.target.value)
  });
} 
function spectrogram(){
	exportAudioObjet(objActif)
	var objpath=paramProjet.audioPath+"exports/"+tableObjet[objActif].id+".wav"
	if(paramProjet.audioPath && tableObjet[objActif].file){
		window.api.send("toMain", "vueSpectrogram;"+objpath)
	}
}
function openRead3D() {
	if(grpSelect==1){
		exportSelect()
	}else{
		window.api.send("toMain", "read3D")
	}
}


var wtxt2 = "createObjet(45,1,1,5,'#ff0000');\
dbfObjet(objActif,0.2,0.6);\
muteObjet(objActif,0);\
gainObjet(objActif,1.4);\
detuneObjet(objActif,0);\
nameObjet(objActif,'test');\
reverseObjet(objActif,0);\
trackObjet(objActif,2);\
console.log(tableObjet[objActif].posX/(18*zoomScale));\
timePosObjet(objActif,14);\
convolObjet(objActif,0);\
envTypeObjet(objActif,1);\
envObjet(objActif,0,0.2,0.08,0.288,0.245,0.86,0.49,0.99,0.725,0.86,0.8,0.58,0.978,0.5);\
loadAudioTableBuffer(objActif,'/home/dominique/kandiskyscore/Projets/Projet1/Audios/kurt1-1s.wav');"
	
var wtxt3 = "createObjet(45,1,1,5,'red');\
	dbfObjet(objActif,0.4,0.9);\
	convolObjet(objActif,0);\
	reverseObjet(objActif,'false');\
	loadAudioTableBuffer(objActif,'/home/dominique/kandiskyscore/Projets/Projet1/Audios/kurt1-1s.wav');\
	var interface=`<table align='center' border='1' style='font-size:1em;margin-top:10px;' cellpadding='4' cellspacing='0' ><tbody><tr >\n\<td><div id='butto1' style='position:relative;top:0px;left:0px;width:100px;height:100px;border:1px solid black;'>`+ibutton2+`</div></td><td style='padding:10px;height:100px;'><span class='slider-wrapper' ><input id='sliderBPFQ' class='slider-wrapper' type='range' value='1' min='0.5' max='10' step='0.01'  /></span></td>\n\</tr></tbody></table>	\n\<div style='margin-top:20px;margin-left:80px;'><button onclick=defautFxParam('BPFOberheim')>Defaut</button> <button id='bvalid' >Valider</button></div>`;\
	document.getElementById('tableParam').innerHTML=interface;\
	var paramValid=new Function(`console.log('Valid',document.getElementById('sliderBPFQ').value)`);\
	document.getElementById('bvalid').addEventListener('click',paramValid);\
	dragElement(document.getElementById('butto1'));\
	document.getElementById('popupParamHeader').innerHTML='<b>Param</b>';\
	document.getElementById('popupParam').style.display='block';\
	createSymbole(44*18,376,23,'green');\
	cadreSymb(objActif,'solid',4,'0%','#ff0000');\
	bkgSymb(objActif,'ibkg','true',1,60,60,'#eeaaaa');\
	createGroupe('#0000ff','0,1');\
	console.log(tableObjet);"


function testInterpreteur(name){
	var xhttp = new XMLHttpRequest()
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var txt=xhttp.responseText
			var reponse=-1;
			var exp=/fs.writeFile/g
			let position = txt.search(exp);
			if(position!=-1){
				reponse=1
			}
			exp=/ipcRenderer/g
			position = txt.search(exp);
			if(position!=-1){
				reponse=1
			}
			exp=/window/g
			position = txt.search(exp);
			if(position!=-1){
				reponse=1
			}
			if(reponse==-1){
				var ntxt = txt.split('\n')
				var sp=""
				for(let i=0;i<ntxt.length-1;i++){
					sp=sp+ntxt[i]
				}
				var fct = new Function(sp);
				fct();
			}else{
				alert('Vous ne devez pas faire d\'appel direct au systeme de fichiers')
			}
		}
		
	}
	xhttp.open("GET", name, true)
	xhttp.send()

}
function audioEditor() {
	window.api.send("toMain", "audioEditor;"+tableObjet[objActif].file)
}