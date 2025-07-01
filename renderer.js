// expression [a-zA-Z "'\.\+\(\)]*=

var mainwinWidth=1510
var mainwinheight=894

const tableLang=[]


importLang('./Local/'+lang+'/lang-'+lang+".txt")
defInterface()
symbCreate()
upDateWorkSpace(1)

defautProjet()
defautSpace()

dragElement(document.getElementById("listNewFx"));
dragElement(document.getElementById("popupParamFx"));

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
console.log("jsgreffons",listeFx)

for (var i in listeFx){
	if(listeFx[i].greffon){
	loadScript("./greffons/"+listeFx[i].greffon+".js")
	.then( data  => {
        console.log("Script loaded successfully", data);
    })
    .catch( err => {
        console.error(err);
    });
    }
    console.log("jsgreffons","./greffons/"+listeFx[i].greffon+".js")
}

window.api.receive("fromMain", (data) => {
	var nsize=data
	var cmd=data.split(";")
	switch(cmd[0]){
			case 'audioImport':
				console.log(`Received ${data} from renderer process`);
				loadSoundTableBuffer(cmd[1],cmd[2],parseInt(cmd[3]))
				break
			case 'audioPreDefImport':
				console.log(`Received ${data} from renderer process`);
				loadPreDefSound(cmd[1],cmd[2])
				break
			case 'audioMute':
				console.log(`Received ${data} from renderer process`);
				audioMute(cmd[1],cmd[2])
				break
			case 'preDefMute':
				console.log(`mute ${data} from renderer process`);
				preDefMute(cmd[1],cmd[2])
				break
			case 'audioGain':
				console.log(`Received ${data} from renderer process`);
				audioGain(cmd[1],cmd[2])
				break
			case 'defReverse':
				defReverse(cmd[1],cmd[2])
				break
			case 'preDefGain':
				console.log(`Received ${data} from renderer process`);
				preDefGain(cmd[1],cmd[2])
				break
			case 'audioEnvType':
				console.log(`Received ${data} from renderer process`);
				audioEnvType(cmd[1],cmd[2])
				break
			case 'preDefEnvType':
				console.log(`Received ${data} from renderer process`);
				preDefEnvType(cmd[1],cmd[2])
				break
			case 'audioFlagTranspo':
				console.log(`Received ${data} from renderer process`);
				audioFlagTranspo(cmd[1],cmd[2])
				break
			case 'preDefFlagTranspo':
				preDefFlagTranspo(cmd[1],cmd[2])
				break
			case 'audioDetune':
				console.log(`Received ${data} from renderer process`);
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
				console.log(`Received ${data} from renderer process`);
				audioNom(cmd[1],cmd[2])
				break
			case 'preDefNom':
				console.log(`Received ${data} from renderer process`);
				preDefNom(cmd[1],cmd[2])
				break
			case 'preDefColor':
				preDefColor(cmd[1],cmd[2])
				break
			case 'audioPiste':
				console.log(`Received ${data} from renderer process`);
				audioPiste(cmd[1],cmd[2])
				break
			case 'preDefPiste':
				console.log(`Received ${data} from renderer process`);
				preDefPiste(cmd[1],cmd[2])
				break
			case 'audioConvolver':
				console.log(`Received ${data} from renderer process`);
				audioConvolver(cmd[1],cmd[2])
				break
			case 'preDefConvolver':
				console.log(`Received ${data} from renderer process`);
				preDefConvolver(cmd[1],cmd[2])
				break
			case 'audioEnv':
				console.log(`Received ${data} from renderer process`);
				audioEnv(cmd[1],cmd[2],cmd[3],cmd[4])
				break
			case 'audioEnv2':
				console.log(`Received ${data} from renderer process`);
				audioEnv2(cmd[1],cmd[2],cmd[3],cmd[4])
				break
			case 'preDefEnv':
				preDefEnv(cmd[1],cmd[2],cmd[3],cmd[4])
				break
			case 'tempoAudio':
				tempoAudio()
				break
			case 'objetRayon':
				console.log(`Received ${data} from renderer process`);
				objetRayon(cmd[1],cmd[2])
				break
			case 'objetScaleGrpXY':
				console.log(`objetScaleX ${data} from renderer process`);
				objScaleGrpXY(cmd[1],cmd[2])
				break
			case 'objetScaleXY':
				console.log(`objetScaleX ${data} from renderer process`);
				objScaleXY(cmd[1],cmd[2])
				break
			case 'objetScaleX':
				console.log(`objetScaleX ${data} from renderer process`);
				objScaleX(cmd[1],cmd[2])
				break
			case 'objetScaleY':
				console.log(`objetScaleY ${data} from renderer process`);
				objScaleY(cmd[1],cmd[2])
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
				objetColor(cmd[1],cmd[2])
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
			case 'bkgColor':
				objetBkgColor(cmd[1],cmd[2])
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
				console.log(`bkgWidth`,cmd[1],cmd[2])
				objetBkgWidth(cmd[1],cmd[2])
				break
			case 'bkgHeight':
				console.log(`bkgWidth`,cmd[1],cmd[2])
				objetBkgHeight(cmd[1],cmd[2])
				break
			case 'bkgGrpWidth':
				grpBkgWidth(cmd[1],cmd[2])
				break
			case 'bkgGrpHeight':
				grpBkgHeight(cmd[1],cmd[2])
				break
			case 'symbBkgWidth':
				console.log(`bkgWidth`,cmd[1],cmd[2])
				symbBkgWidth(cmd[1],cmd[2])
				break
			case 'symbBkgHeight':
				console.log(`bkgHeight`,cmd[1],cmd[2])
				symbBkgHeight(cmd[1],cmd[2])
				break
			case 'symbMGauche':
				console.log(`bkgWidth`,cmd[1],cmd[2])
				symbMGauche(cmd[1],cmd[2])
				break
			case 'symbMHaut':
				console.log(`bkgWidth`,cmd[1],cmd[2])
				symbMHaut(cmd[1],cmd[2])
				break
			case 'defBordureWidth':
				objetBordureWidth(cmd[1],cmd[2])
				break
			case 'defBordureColor':
				objetBordureColor(cmd[1],cmd[2])
				console.log(`Received ${data} from renderer process`);
				break
			case 'defGraphParam':
				objetToGraphParams(cmd[1])
				var txt=objetGrapĥToString(cmd[1])
				var ntxt="defWinGraphObj;"+cmd[1]+";"+lang+";"+txt+";"+tableObjet[cmd[1]].type
				console.log(`defGraphParam`,ntxt);							
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
				console.log(cmd[1])
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
				console.log("tableObjet annul",tableObjet[cmd[1]])
				break
			case 'validModifObj':
				//objetStringDefParams(cmd[1],cmd[2])
				break
			case 'renduObjet':
				readSimpleAudioA(1)
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
			case 'exportSpace':
				importSpace(cmd[1])
				importConfigSpace()
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
				vueGrpSvg()
				break
			case 'renduPartSvg':
				vuePartSvg()
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
				exportPart()
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
				console.log(`dureeRelle ${data} from renderer process`);
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
			default :			
				console.log(`Received ${data} from renderer process`);
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

function newProject() {
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
	exportConfig()
}
function selectBkgObj(e){
	if (e.button==0){
		if(e.target.id=='space'){
			console.log("bouton gauche space",e.target.id,e.x,e.y)	// si click gauche sur l'espace de travail
			if(nselector==1){
				nselector=0
				document.getElementById("selector").style.display="none";
			}
		}
		if(e.target.parentNode.id=='regle'){
			console.log("bouton gauche regle",e.target.id,e.x,e.y)	// si click gauche sur l'espace de travail
			document.getElementById("barVerticale").style.left=(e.x-206+scrollDemo.scrollLeft)+"px"
			defMoveLecture(1)
		} 
		if (e.target.parentNode.parentNode.id.substring(0,5)=="objet"){	
     		selectObj=e.target.parentNode.parentNode.id;
   		objActif=parseInt(selectObj.substring(5));
     	  console.log("bouton gauche objet id",e.target.parentNode.parentNode.id,e.x,e.y)										
	     //window.api.send("toMain", "openObjetParam");
	     
     	}
     	if (e.target.parentNode.parentNode.id.substring(0,3)=="grp"){	
     		selectObj=e.target.parentNode.parentNode.id;
   		objActif=parseInt(selectObj.substring(3));
     	  console.log("bouton gauche groupe id",e.target.parentNode.parentNode.id,e.x,e.y)										
	     //window.api.send("toMain", "openObjetParam");
	     
     	}
     	if(inclusionEtat==1 && tableObjet[objActif].class==4){
   	console.log("obj inclusion",inclusionEtat,e.target);
   		selectObj=e.target.id;
   		objActif=parseInt(selectObj.substring(3));
			inclusionRet();
		}
   }else if(e.button==2){
      console.log("bouton droit objet id",e.target.id,e.target)

		if (e.target.id=="space"){												// si click droit sur l'espace de travail => popup menu   	
   		console.log("bouton droit space",e.target.id,e.x,e.y)
	     window.api.contextmenu("showmenu","")
     	}
     	if (e.target.id.substring(0,5)=="objet"){
     		console.log("bouton droit objet id1",e.target.id,tableObjet,e.x,e.y)
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
     	 		var ntxt="openObjetParam;"+id+";"+lang+";"+objetParamsToString(objActif)+";0;"+tableObjet[objActif].class
     	 	}else{
     	 		var ntxt="openObjetParam;"+id+";"+lang+";"+objetParamsToString(objActif)+";"+tableBuffer[tableObjet[objActif].bufferId].buffer.numberOfChannels+";"+tableObjet[objActif].class
     	 	}	
	      window.api.send("toMain", ntxt );
     	}
     	if (e.target.parentNode.id.substring(0,5)=="objet"){
     		console.log("bouton droit objet id2",e.target.parentNode.id,tableObjet,e.x,e.y)
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
	      	console.log(selectObj,tableObjet[objActif])
	      	if(tableObjet[objActif].class==1){
		      	if(tableObjet[objActif].file=="" || tableObjet[objActif].file==undefined){
		     	 		var ntxt="openObjetParam;"+id+";"+lang+";"+objetParamsToString(objActif)+";0;"+tableObjet[objActif].class
		     	 	}else{
		     	 		var ntxt="openObjetParam;"+id+";"+lang+";"+objetParamsToString(objActif)+";"+tableBuffer[tableObjet[objActif].bufferId].buffer.numberOfChannels+";"+tableObjet[objActif].class
		     	 	}
	     	 	}
	     	 	if(tableObjet[objActif].class==3){
		     	 	var ntxt="openSymbParam;"+id+";"+lang+";"+objetGrapĥToString(objActif)+";"+tableObjet[objActif].type
	     	 	}
		      window.api.send("toMain", ntxt );
		      
	   	}
     	}
     	if (e.target.parentNode.parentNode.id.substring(0,5)=="objet"){
     		console.log("bouton droit objet id3",e.target.parentNode.parentNode.id,tableObjet,e.x,e.y)
     		/*
     		if(selectObj && selectObj!=e.target.parentNode.parentNode.id){
     			selectObj=e.target.parentNode.parentNode.id;
   			objActif=parseInt(selectObj.substring(5));
   			if(tableObjet[objActif].class==1){
   				window.api.send("toMain", 'objParamClose')
   			}
     	   }
     	   */
     	   let id=e.target.parentNode.parentNode.id.substring(5)
     	   if(id==objActif){
	     	 	objetSaveParams(id)
	     	 	nselector=0
	      	grpSelect=0
	      	if(tableObjet[objActif].file=="" || tableObjet[objActif].file==undefined){
	     	 		var ntxt="openObjetParam;"+id+";"+lang+";"+objetParamsToString(objActif)+";0;"+tableObjet[objActif].class
	     	 	}else{
	     	 		var ntxt="openObjetParam;"+id+";"+lang+";"+objetParamsToString(objActif)+";"+tableBuffer[tableObjet[objActif].bufferId].buffer.numberOfChannels+";"+tableObjet[objActif].class
	     	 	}
	     	 	console.log("objActif1",tableObjet[objActif].id)
	     	 	window.api.send("toMain", 'objGraphValid')	
		      window.api.send("toMain", ntxt );
	      }else{
	      	window.api.send("toMain", 'objParamChange')
	      	objActif=id
	      	objetSaveParams(id)
	     	 	nselector=0
	      	grpSelect=0
	      	if(tableObjet[objActif].file=="" || tableObjet[objActif].file==undefined){
	     	 		var ntxt="openObjetParam;"+id+";"+lang+";"+objetParamsToString(objActif)+";0;"+tableObjet[objActif].class
	     	 	}else{
	     	 		var ntxt="openObjetParam;"+id+";"+lang+";"+objetParamsToString(objActif)+";"+tableBuffer[tableObjet[objActif].bufferId].buffer.numberOfChannels+";"+tableObjet[objActif].class
	     	 	}	
	     	 	console.log("objActif2",tableObjet[objActif].id)
		      window.api.send("toMain", ntxt );
	      }
     	}
     	if (e.target.parentNode.parentNode.parentNode.id.substring(0,5)=="objet"){
     		console.log("bouton droit objet id4",e.target.parentNode.parentNode.parentNode.id,tableObjet,e.x,e.y)
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
	     	 		var ntxt="openObjetParam;"+id+";"+objetGrapĥToString(objActif)+";"+tableObjet[objActif].type+";"+tableObjet[objActif].class
	     	 	}else{
	     	 		var ntxt="openObjetParam;"+id+";"+objetGrapĥToString(objActif)+";"+tableObjet[objActif].type+";"+tableObjet[objActif].class
	     	 	}
	     	 }
     	 	if(tableObjet[objActif].class==3){
		     	 	var ntxt="openSymbParam;"+id+";"+lang+";"+objetGrapĥToString(objActif)+";"+tableObjet[objActif].type
	     	}
     	 	console.log("openObjetParam",ntxt,tableObjet[objActif].class)						
	      window.api.send("toMain", ntxt );
     	}
     	if(e.target.id.substring(0,3)=="grp"){
     		selectObj=e.target.id;
   		objActif=parseInt(selectObj.substring(3));
   		console.log("type grp",tableObjet[objActif])
   		if(tableObjet[objActif].class==4){
   			objetSaveParams(objActif)
   			var ntxt="openGrpParam;"+objActif+";"+lang+";"+grpGrapĥToString(objActif)
   			console.log("type grp ntxt",ntxt)					
		      window.api.send("toMain", ntxt );
   		}
			if(tableObjet[objActif].class==2){
   			objetSaveParams(objActif)
   			var ntxt="openPreDef;"+objActif+";"+lang+";"+preDefToString(objActif)
   			console.log("type grp ntxt",ntxt)					
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
function exportConfig() {

var txt=paramProjet.name+","+paramProjet.start+","+paramProjet.end+","+paramProjet.comment+","+paramProjet.path+","+paramProjet.audioPath+","+paramProjet.imgPath+","+paramProjet.greffon3D+","+paramProjet.greffonC+","+paramProjet.regle+","+paramProjet.mesure+","+paramProjet.grille+","+paramProjet.width+","+paramProjet.height+","+paramProjet.zoom+","+paramProjet.svgRegle+","+paramProjet.svgMesure+","+paramProjet.svgGrille+","+paramProjet.spaceSeconde+","+paramProjet.svgSeconde

var txt2=paramSpace.lForwardX+","+paramSpace.lForwardY+","+paramSpace.lForwardZ+","+paramSpace.lUpX+","+paramSpace.lUpY+","+paramSpace.lUpZ+","+paramSpace.lPosX+","+paramSpace.lPosY+","+paramSpace.lPosZ+","+paramSpace.PModel+","+paramSpace.DModel+","+paramSpace.refD+","+paramSpace.maxD+","+paramSpace.rolF+","+paramSpace.coneIA+","+paramSpace.coneOA+","+paramSpace.coneOG+","+paramSpace.orX+","+paramSpace.orY+","+paramSpace.orZ
var txt3=paletteBkg+":"+fontPalette+":"+ fontPaletteSize+":"+ separateurPalette+":0:"+ bkgInfo+":"+ fontInfoSize+":"+ fontInfoColor+":"+ regleBackground+":"+ regleFontSize+":"+ regleFontColor+":"+ intervalBackground+":"+ intervalFontSize+":"+ fontIntervalColor+":"+ workSpaceBkg+":"+ spaceGrilleOpacity+":"+ colorGrille+":"+ suiveurBkg+":"+ popupTitreBkg+":"+ popupHeaderFontSize+":"+ popupFontTitreColor+":"+ popupFontColor+":"+ popupBkgColor+":"+ popupFontSize+":"+ popupOngletFontColor+":"+ popupFontOngletSize+":"+ popupOngletBkg+":"+popupOngletActifBkg+":"+lang+":"+ vueSvgBackground+":"+vueSvgFontSize+":"+vueSvgFontColor
var txt4=paletteDisque+","+paletteCarre+","+paletteTriangle+","+paletteEllipse+","+paletteRectangle+","+paletteTrianglelong+","+paletteRondlong+","+paletteCarrelong+","+paletteCrescendo+","+paletteLigne+","+paletteGlissando+","+paletteBlock+","+paletteDecresc+","+paletteDecrescb+","+paletteCresc+","+paletteCrescb+","+paletteAgregat+","+paletteArpege+","+paletteMultilignes+","+paletteNuage+","+paletteTexture+","+paletteImage+","+paletteSymb+","+paletteFleche+","+paletteMarque1+","+paletteMarque2+","+paletteLecteur

console.log(txt3)
window.api.send("toMain", 'configProjet;'+lang+";"+txt+";"+txt2+";"+txt3+";"+txt4)
}
function objetParamsToString(id) {
	var txt=tableObjet[id].basePosY+":"+tableObjet[id].bkgColor+":"+tableObjet[id].bkgHeight+":"+tableObjet[id].bkgImg+":"+tableObjet[id].bkgOpacity+":"+tableObjet[id].bkgTrp+":"+tableObjet[id].bkgWidth+":"+tableObjet[id].borderBc+":"+tableObjet[id].borderBr+":"+tableObjet[id].borderBs+":"+tableObjet[id].borderBw+":"+tableObjet[id].borderDc+":"+tableObjet[id].borderDr+":"+tableObjet[id].borderDs+":"+tableObjet[id].borderDw+":"+tableObjet[id].borderGc+":"+tableObjet[id].borderGr+":"+tableObjet[id].borderGs+":"+tableObjet[id].borderGw+":"+tableObjet[id].borderHc+":"+tableObjet[id].borderHr+":"+tableObjet[id].borderHs+":"+tableObjet[id].borderHw+":"+tableObjet[id].buffer+":"+tableObjet[id].class+":"+tableObjet[id].convolver+":"+tableObjet[id].cx+":"+tableObjet[id].cy+":"+tableObjet[id].debut+":"+tableObjet[id].detune+":"+tableObjet[id].duree+":"+tableObjet[id].envType+":"+tableObjet[id].envX+":"+tableObjet[id].envY+":"+tableObjet[id].etat+":"+tableObjet[id].file+":"+tableObjet[id].fin+":"+tableObjet[id].flagTranspo+":"+tableObjet[id].gain+":"+tableObjet[id].height+":"+tableObjet[id].id+":"+tableObjet[id].img+":"+tableObjet[id].margeG+":"+tableObjet[id].margeH+":"+tableObjet[id].mute+":"+tableObjet[id].nom+":"+tableObjet[id].objBorderC+":"+tableObjet[id].objBorderW+":"+tableObjet[id].objColor+":"+tableObjet[id].objOpacity+":"+tableObjet[id].piste+":"+tableObjet[id].posX+":"+tableObjet[id].posY+":"+tableObjet[id].r+":"+tableObjet[id].radius+":"+tableObjet[id].scaleX+":"+tableObjet[id].scaleY+":"+tableObjet[id].spD+":"+tableObjet[id].spT+":"+tableObjet[id].spX+":"+tableObjet[id].spY+":"+tableObjet[id].spZ+":"+tableObjet[id].tableFx+":"+tableObjet[id].tableFxParam+":"+tableObjet[id].transposition+":"+tableObjet[id].type+":"+tableObjet[id].vueDuree+":"+tableObjet[id].x1+":"+tableObjet[id].x2+":"+tableObjet[id].y1+":"+tableObjet[id].y2+":"+tableObjet[id].width+":"+tableObjet[id].reverse
	console.log("objetParamsToString",txt)	
	return txt
}
function preDefToString(id) {
	var txt=tableObjet[id].basePosY+":"+tableObjet[id].bkgColor+":"+tableObjet[id].bkgHeight+":"+tableObjet[id].bkgImg+":"+tableObjet[id].bkgOpacity+":"+tableObjet[id].bkgTrp+":"+tableObjet[id].bkgWidth+":"+tableObjet[id].borderBc+":"+tableObjet[id].borderBr+":"+tableObjet[id].borderBs+":"+tableObjet[id].borderBw+":"+tableObjet[id].borderDc+":"+tableObjet[id].borderDr+":"+tableObjet[id].borderDs+":"+tableObjet[id].borderDw+":"+tableObjet[id].borderGc+":"+tableObjet[id].borderGr+":"+tableObjet[id].borderGs+":"+tableObjet[id].borderGw+":"+tableObjet[id].borderHc+":"+tableObjet[id].borderHr+":"+tableObjet[id].borderHs+":"+tableObjet[id].borderHw+":"+tableObjet[id].buffer+":"+tableObjet[id].class+":"+tableObjet[id].convolver+":"+tableObjet[id].cx+":"+tableObjet[id].cy+":"+tableObjet[id].debut+":"+tableObjet[id].detune+":"+tableObjet[id].duree+":"+tableObjet[id].envType+":"+tableObjet[id].envX+":"+tableObjet[id].envY+":"+tableObjet[id].etat+":"+tableObjet[id].file+":"+tableObjet[id].fin+":"+tableObjet[id].flagTranspo+":"+tableObjet[id].gain+":"+tableObjet[id].height+":"+tableObjet[id].id+":"+tableObjet[id].img+":"+tableObjet[id].liste+":"+tableObjet[id].margeG+":"+tableObjet[id].margeH+":"+tableObjet[id].mute+":"+tableObjet[id].nom+":"+tableObjet[id].objBorderC+":"+tableObjet[id].objBorderW+":"+tableObjet[id].objColor+":"+tableObjet[id].objOpacity+":"+tableObjet[id].piste+":"+tableObjet[id].posX+":"+tableObjet[id].posY+":"+tableObjet[id].r+":"+tableObjet[id].radius+":"+tableObjet[id].scaleX+":"+tableObjet[id].scaleY+":"+tableObjet[id].spD+":"+tableObjet[id].spT+":"+tableObjet[id].spX+":"+tableObjet[id].spY+":"+tableObjet[id].spZ+":"+tableObjet[id].tableFx+":"+tableObjet[id].tableFxParam+":"+tableObjet[id].transposition+":"+tableObjet[id].type+":"+tableObjet[id].vueDuree+":"+tableObjet[id].x1+":"+tableObjet[id].x2+":"+tableObjet[id].y1+":"+tableObjet[id].y2+":"+tableObjet[id].width
	console.log("objetParamsToString",txt)	
	return txt
}
function objetGrapĥToString(id) {
	var txt=tableObjet[id].bkgColor+":"+tableObjet[id].bkgHeight+":"+tableObjet[id].bkgImg+":"+tableObjet[id].bkgOpacity+":"+tableObjet[id].bkgTrp+":"+tableObjet[id].bkgWidth+":"+tableObjet[id].borderBc+":"+tableObjet[id].borderBr+":"+tableObjet[id].borderBs+":"+tableObjet[id].borderBw+":"+tableObjet[id].borderDc+":"+tableObjet[id].borderDr+":"+tableObjet[id].borderDs+":"+tableObjet[id].borderDw+":"+tableObjet[id].borderGc+":"+tableObjet[id].borderGr+":"+tableObjet[id].borderGs+":"+tableObjet[id].borderGw+":"+tableObjet[id].borderHc+":"+tableObjet[id].borderHr+":"+tableObjet[id].borderHs+":"+tableObjet[id].borderHw+":"+tableObjet[id].cx+":"+tableObjet[id].cy+":"+tableObjet[id].height+":"+tableObjet[id].margeG+":"+tableObjet[id].margeH+":"+tableObjet[id].objBorderC+":"+tableObjet[id].objBorderW+":"+tableObjet[id].objColor+":"+tableObjet[id].objOpacity+":"+tableObjet[id].r+":"+tableObjet[id].rotate+":"+tableObjet[id].scaleX+":"+tableObjet[id].scaleY+":"+tableObjet[id].width
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
	console.log("objetStringToParams",tableObjet[id])	
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
	console.log('saveObjet',saveObjet)
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
		if(objGraph.bkgTrp==false){
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
	
	console.log('objetRestorGraph(id)',id,tableObjet[id])
}
let screenLog = document.getElementById('screen-log');
function logKey(e) {
	var ratioT=(720/12960);
	if(e.clientX>204 && e.clientY>40){
	var posX=e.clientX-204+scrollDemo.scrollLeft
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
	}
	if(e.clientX>204 && e.clientY>94){
  screenLog.innerText = `
    Screen X/Y: ${e.screenX}, ${e.screenY}
    WorkSpace X/Y: ${Math.floor(e.clientX-204+scrollDemo.scrollLeft)}, ${Math.floor(e.clientY-94+scrollDemo.scrollTop)}`;
    Slider : document.getElementById("work").scrollLeft;
    }
}
document.addEventListener('mousemove', logKey);
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
	console.log(document.getElementById("svgVue"))
	var doc=document.getElementById("svgVue").innerHTML
	doc=uena(doc)
	window.api.send("toMain", "spaceToSvg;"+doc)
}
function uena(chn) {
  return window.btoa(unescape(encodeURIComponent(chn)));
}

function loadSoundTableBuffer(id,url,num) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    request.onload = function() {
    contextAudio.decodeAudioData(request.response, function(buffer) {
        console.log(buffer.length,"duration=",buffer.duration," nbc",buffer.numberOfChannels,buffer);
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
        console.log("defnom",tableObjet[id].file)
       var hasKey = -1;
       var hasKey =tableBuffer.findIndex(elem => elem.name === pathnom[pathnom.length-1]);
		 console.log(hasKey);
		 if(hasKey>-1){
		 	console.log("le fichier existe déjà",hasKey,tableBuffer);
		 	if(num==1){
		 		tableObjet[id].bufferId=hasKey;
		 	}else{
		 		tableObjet[id].bufferId2=hasKey;
		 	}
        }else{
         tableBuffer.push({name:pathnom[pathnom.length-1],buffer:buffer});
         if(num==1){
        		 tableObjet[id].bufferId=tableBuffer.length-1;
        	}else{
        		 tableObjet[id].bufferId2=tableBuffer.length-1;
        	}
         								
        }
        console.log("table",tableBuffer,hasKey,tableObjet[id].bufferId);
        window.api.send("toMain", "fileAudioParam;"+id+";"+tableObjet[id].duree+";"+buffer.numberOfChannels )
        console.log("tableBuffer",tableBuffer,tableObjet)
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
        console.log(buffer.length,"duration=",buffer.duration," nbc",buffer.numberOfChannels,buffer);
        tableObjet[id].duree = buffer.duration;
        tableObjet[id].fin=1;
        tableObjet[id].debut=0;
        var pathnom=url.split('/')
        tableObjet[id].file=pathnom[pathnom.length-1]
        console.log("defnom",tableObjet[id].file)
       var hasKey = -1;
       var hasKey =tableBuffer.findIndex(elem => elem.name === tableObjet[id].file);
		 console.log(hasKey);
		 if(hasKey>-1){
		 	console.log("le fichier existe déjà",hasKey,tableBuffer);
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
	        console.log("objet",ls.id);
        }
        console.log("table",tableBuffer,hasKey,tableObjet[id].bufferId);
        window.api.send("toMain", "fileAudioPreDef;"+id+";"+tableObjet[id].duree+";"+buffer.numberOfChannels )
        console.log("tableBuffer",tableBuffer,tableObjet)
    });
    }
    request.send();
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
	console.log(tableObjet[id])
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
	tableObjet[id].nom=m
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
function audioEnv2(id,ev,x,y) {  
	console.log("x y", x,y)
	tableObjet[id].envmX[ev]=parseFloat(x)
	tableObjet[id].envmY[ev]=parseFloat(y)
}
function preDefEnv(id,ev,x,y) {  
	for(let i=0;i<tableObjet[id].liste.length;i++){
  	  var ls=tableObjet[tableObjet[id].liste[i]]
     ls.envX[ev]=parseFloat(x)
	  ls.envY[ev]=parseFloat(y)
   }
	tableObjet[id].envX[ev]=parseFloat(x)
	tableObjet[id].envY[ev]=parseFloat(y)
		console.log("table",tableObjet);
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
		objScaleXY(tableObjet[id].liste[i],scaleX)
	}
}
function objScaleXY(id,scaleX) { 
	tableObjet[id].scaleX=parseFloat(scaleX)
	tableObjet[id].scaleY=parseFloat(scaleX)
	tableObjet[id].bkgHeight=(tableObjet[id].bkgHeight*parseFloat(scaleX)).toFixed(2)
	tableObjet[id].bkgWidth=(tableObjet[id].bkgWidth*parseFloat(scaleX)).toFixed(2)
	switch(tableObjet[id].type) {
		case 7:
			document.getElementById("objet"+id).firstChild.firstChild.nextSibling.setAttribute("transform","scale("+scaleX+" "+tableObjet[id].scaleY+") translate("+tableObjet[id].margeG+" "+tableObjet[id].margeH+")")
			break
		case 8:
			document.getElementById("objet"+id).firstChild.firstChild.nextSibling.setAttribute("transform","scale("+scaleX+" "+tableObjet[id].scaleY+") translate("+tableObjet[id].margeG+" "+tableObjet[id].margeH+")")
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
				console.log("obj",document.getElementById(nid).firstChild.firstChild)
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
			document.getElementById(tableObjet[id].id).style.transform="scale("+scaleX+" "+scaleX+")"
			document.getElementById(tableObjet[id].id).firstChild.setAttribute("width",20*scaleX)
			document.getElementById(tableObjet[id].id).firstChild.setAttribute("height",20*scaleX)
			document.getElementById("objet"+id).firstChild.firstChild.setAttribute("transform","scale("+scaleX+" "+scaleX+") translate("+tableObjet[id].margeG+" "+tableObjet[id].margeH+")")
	}
}
function objScaleX(id,scaleX) { 	
	tableObjet[id].scaleX=parseFloat(scaleX)
	switch(tableObjet[id].type) {
		case 7:
			document.getElementById("objet"+id).firstChild.firstChild.nextSibling.style.width=(20*tableObjet[id].scaleX)+"px"
			break
		case 8:
			document.getElementById("objet"+id).firstChild.firstChild.nextSibling.style.width=(20*tableObjet[id].scaleX)+"px"
			break
		case 11:
			document.getElementById("objet"+id).firstChild.firstChild.setAttribute("stroke-width",scaleX)
			break
		case 23:
			document.getElementById("objet"+id).firstChild.style.width=(tableObjet[id].width*tableObjet[id].scaleX)+"px"
			break
		default:
			var transf="scale("+tableObjet[id].scaleX+" "+tableObjet[id].scaleY+") translate("+tableObjet[id].margeG+" "+tableObjet[id].margeH+") rotate("+tableObjet[id].rotate+" 0 0) "		
			document.getElementById("objet"+id).firstChild.firstChild.setAttribute("transform",transf)
	}
}
function objScaleY(id,scaleY) { 
	tableObjet[id].scaleY=parseFloat(scaleY)
	switch(tableObjet[id].type) {
		case 7:
			document.getElementById("objet"+id).firstChild.firstChild.setAttribute("r",10*scaleY)
			break
		case 8:
			var dm=20*scaleY
			document.getElementById("objet"+id).firstChild.firstChild.setAttribute("width",dm)
			document.getElementById("objet"+id).firstChild.firstChild.setAttribute("height",dm)
			dm=(dm/2)-5
			document.getElementById("objet"+id).firstChild.firstChild.nextSibling.setAttribute("y",dm)
			break
		case 23:
			document.getElementById("objet"+id).firstChild.style.height=(tableObjet[id].height*tableObjet[id].scaleY)+"px"
			break
		default:
			var transf="scale("+tableObjet[id].scaleX+" "+tableObjet[id].scaleY+") translate("+tableObjet[id].margeG+" "+tableObjet[id].margeH+") rotate("+tableObjet[id].rotate+" 0 0) "
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
	console.log('opac',opac)
}
function bkgGrpOpacity(id,opac) {
	var nopac=Math.round(parseFloat(opac)*255)
	var color=tableObjet[id].bkgColor+ (nopac.toString(16))
	document.getElementById(tableObjet[id].id).style.backgroundColor=color
	tableObjet[id].bkgOpacity=parseFloat(opac)
}
function bkgTransparent(id) {  
	document.getElementById(tableObjet[id].id).style.backgroundColor='transparent'
	tableObjet[id].bkgTrp='true'
} 
function bkgGrpTransparent(id) {  
	document.getElementById(tableObjet[id].id).style.backgroundColor='transparent'
	tableObjet[id].bkgTrp=true
		console.log('transparent',id)
} 
function objetColor(id,color) {  
	
	tableObjet[id].objColor=color
	switch(tableObjet[id].type) {
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

	console.log("objet"+id," ",transf," ",document.getElementById("objet"+id))
	console.log("rotate",rotate,tableObjet[id].scaleX,tableObjet[id].scaleY)
}
function symbRotate(id,rotate) {  
	tableObjet[id].rotate=parseInt(rotate) 
	var transf="scale("+tableObjet[id].scaleX+" "+tableObjet[id].scaleY+") translate("+tableObjet[id].margeG+" "+tableObjet[id].margeH+") rotate("+rotate+" 0 0) "
	
	document.getElementById("objet"+id).firstChild.firstChild.setAttribute("transform",transf)
	console.log("objet"+id," ",transf," ",document.getElementById("objet"+id))
}
function symbColor(id,color) {  
	tableObjet[id].objColor=color 
	document.getElementById("objet"+id).firstChild.firstChild.setAttribute("stroke",color)
	document.getElementById("objet"+id).firstChild.firstChild.setAttribute("fill",color)
	
	console.log("objet"+id+" ",document.getElementById("objet"+id),document.getElementById("objet"+id).firstChild.firstChild.firstChild.nextSibling)
}
function grpBkgColor(id,color) {  
	tableObjet[id].bkgColor=color 
	tableObjet[id].bkgTrp=false
	document.getElementById("grp"+id).style.backgroundColor=color
}
function symbWidth(id,width) {  
	tableObjet[id].scaleX=width
	var transf="rotate("+tableObjet[id].rotate+") scale("+tableObjet[id].scaleX+" "+tableObjet[id].scaleY+") translate("+tableObjet[id].margeG+" "+tableObjet[id].margeH+")"
	document.getElementById("objet"+id).firstChild.firstChild.setAttribute("transform",transf)
	console.log("objet"+id+" ",document.getElementById("objet"+id))
}
function symbHeight(id,height) {  
	tableObjet[id].scaleY=height
	var transf="rotate("+tableObjet[id].rotate+") scale("+tableObjet[id].scaleX+" "+tableObjet[id].scaleY+") translate("+tableObjet[id].margeG+" "+tableObjet[id].margeH+")"
	document.getElementById("objet"+id).firstChild.firstChild.setAttribute("transform",transf)
	console.log("objet"+id+" ",document.getElementById("objet"+id))
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
	var transf="scale("+tableObjet[id].scaleX+" "+tableObjet[id].scaleY+") translate("+tableObjet[id].margeG+" "+tableObjet[id].margeH+") rotate("+tableObjet[id].rotate+" 0 0) "
	document.getElementById("objet"+id).firstChild.firstChild.setAttribute("transform",transf)
}
function symbBkgColor(id,color) {
	if(tableObjet[id].bkgOpacity){
		var opac=Math.round(tableObjet[id].bkgOpacity*255)
	}else{
		var opac=255
	}
	var ncolor=color+(opac.toString(16))  
	console.log("bkgcolor",ncolor)
	document.getElementById(tableObjet[id].id).style.backgroundColor=ncolor
	tableObjet[id].bkgColor=color
	tableObjet[id].bkgTrp=false
}  
function symbMHaut(id,ml) {
	var elem=document.getElementById(tableObjet[id].id).firstChild.firstChild
	tableObjet[id].margeH=parseFloat(ml)
	var transf="scale("+tableObjet[id].scaleX+" "+tableObjet[id].scaleY+")  translate("+tableObjet[id].margeG+" "+tableObjet[id].margeH+") rotate("+tableObjet[id].rotate+" 0 0) "
	document.getElementById("objet"+id).firstChild.firstChild.setAttribute("transform",transf)
}
function objetBkgColor(id,color) {
	if(tableObjet[id].bkgOpacity){
		var opac=Math.round(tableObjet[id].bkgOpacity*255)
	}else{
		var opac=255
	}
	var ncolor=color+(opac.toString(16))  
	console.log("bkgcolor",ncolor)
	document.getElementById(tableObjet[id].id).style.backgroundColor=ncolor
	tableObjet[id].bkgColor=color
	tableObjet[id].bkgTrp=false
	console.log("div obj",document.getElementById("objet"+id))
}  
function objetBkgImg(id,img) {     
	document.getElementById(tableObjet[id].id).style.backgroundImage='url('+img+')'
	document.getElementById(tableObjet[id].id).style.backgroundSize=tableObjet[id].bkgWidth+" "+tableObjet[id].bkgheight
	tableObjet[id].bkgImg=img
}
function bkgGrpImg(id,img) {     
	document.getElementById(tableObjet[id].id).style.backgroundImage="url('"+img+"')"
	document.getElementById(tableObjet[id].id).style.backgroundSize=document.getElementById(tableObjet[id].id).style.width+" "+document.getElementById(tableObjet[id].id).style.height
	tableObjet[id].bkgImg=img
}
function symbBkgImg(id,img) {     
	document.getElementById(tableObjet[id].id).style.backgroundImage='url('+img+')'
	document.getElementById(tableObjet[id].id).style.backgroundSize=document.getElementById(tableObjet[id].id).style.width+" "+document.getElementById(tableObjet[id].id).style.height
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
	console.log("objet","objet"+id)
}
function objetBkgHeight(id,h) {
	tableObjet[id].bkgHeight=parseFloat(h)
	document.getElementById(tableObjet[id].id).style.height=tableObjet[id].bkgHeight+"px"
	document.getElementById(tableObjet[id].id).style.backgroundSize=document.getElementById(tableObjet[id].id).style.width+" "+document.getElementById(tableObjet[id].id).style.height
	if(tableObjet[id].type==23){
		document.getElementById(tableObjet[id].id).firstChild.style.height=h+"px"
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
	console.log("border",tableObjet[id])
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
	console.log("border",tableObjet[id])
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
	console.log("border",tableObjet[id])
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
	console.log("border",tableObjet[id])
}
function borderGrpHRadius(id,gradius) {     
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
	console.log("border",tableObjet[id])
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
	console.log("importprojet",paramProjet)
	zoomInit(100)
	upDateWorkSpace(1)
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
	console.log("projet config",audioDirectory,"\n",imgDirectory,"\n",setTimeRegle,"\n",setSignRegle,"\n",vueSvgRegle,paramProjet)
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
 console.log("space config",pannerPanningModel,"\n",pannerDistanceModel,"\n",listenerForwardZ,"\n",pannerOrientationX)
}
function importInterface(txt){
var interf=txt.split(':')
console.log(interf)
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
	console.log(interf)
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
	console.log("spd",tableObjet[id])
}
function createSpatialPoint(id,pt,t){
	tableObjet[id].spX[pt]=0
	tableObjet[id].spY[pt]=0
	tableObjet[id].spZ[pt]=0
	tableObjet[id].spD[pt]=1
	tableObjet[id].spT[pt]=parseFloat(t);
}
function openStudio() {
	var id=objActif
	window.api.send("toMain", "openStudio;"+objActif+";"+tableObjet[id].spX+";"+tableObjet[id].spY+";"+tableObjet[id].spZ+";"+tableObjet[id].gain)
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
	console.log(document.getElementById("formSelecFx"))
}
function fxOnChange(id,filtre) {
	idFxParam=id
	tableObjet[objActif].tableFx[id]=listeFx[filtre].name;
	tableObjet[objActif].tableFxParam[idFxParam]=listeFx[filtre].defaut
	console.log("fx",id,filtre,tableObjet[objActif])
}
function fxParam(id) {
	console.log("fx",id,tableObjet[objActif].tableFxParam)
	idFxParam=id
	document.getElementById("tableParamFx").innerHTML=listeFx[tableObjet[objActif].tableFx[id]].interface
	document.getElementById("popupParamFxHeader").innerHTML="<b>Paramètres "+tableObjet[objActif].tableFx[id]+"</b>"
	console.log(document.getElementById("tableParamFx"))
	
	var greffon=tableObjet[objActif].tableFx[idFxParam]
	var param=tableObjet[objActif].tableFxParam[idFxParam].split('/')
	var tbdefaut=listeFx[greffon].paramname.split(',')
	console.log(tableObjet[objActif],greffon,param,tbdefaut,tbdefaut.length)
	for(let i=0;i<param.length;i++){
		document.getElementById("inp"+tbdefaut[i]).value=param[i]
		document.getElementById("slider"+tbdefaut[i]).value=param[i]
	}
	document.getElementById("popupParamFx").style.width=listeFx[greffon].width+'px'
	document.getElementById("popupParamFx").style.display="block"
}

function fxAnnulAddPlugin(){
	document.getElementById("listNewFx").style.display="none"
}
function fxValidAddPlugin(filtre){
	document.getElementById("listNewFx").style.display="none"
	//tableObjet[objActif].tableFx[i]=filtre
}
function openListeFx() {
	document.getElementById("listNewFx").style.display="block"
	for(let j=0;j<7;j++){
		selectElement("selecFx"+j,tableObjet[objActif].tableFx[j] );
	}
}
function defautFxParam(filtre) {
	var greffon=tableObjet[objActif].tableFx[idFxParam]
	var defaut=listeFx[tableObjet[objActif].tableFx[idFxParam]].defaut
	tableObjet[objActif].tableFxParam[idFxParam]=defaut;
	var vdefaut=defaut.split('/')
	var tbdefaut=listeFx[tableObjet[objActif].tableFx[idFxParam]].paramname.split(',')
	for(let i=0;i<tbdefaut.length;i++){
		document.getElementById("inp"+tbdefaut[i]).value=vdefaut[i]
		document.getElementById("slider"+tbdefaut[i]).value=vdefaut[i]
	}
}
function annulFxParam() {
	document.getElementById("popupParamFx").style.display="none"
}
function validFxParam(filtre) {
	console.log('valid',idFxParam,filtre,tableObjet[objActif].tableFxParam[idFxParam])
	var pname=listeFx[tableObjet[objActif].tableFx[idFxParam]].paramname.split(",")
	let param=""
	for(let i=0;i<pname.length;i++){
		param=param+document.getElementById("inp"+pname[i]).value+'/';
	}
	param = param.substring(0, param.length - 1)
	tableObjet[objActif].tableFxParam[idFxParam]=param;
	console.log(tableObjet[objActif])
}
function fxParamModif(ref1,ref2) {
	document.getElementById(ref2).value=document.getElementById(ref1).value
}
document.getElementById("zoomWaveForm").addEventListener('input',waveFormZoom);

function waveSvgForm(pos,zoom) {
	document.getElementById("canvas").style.display="block"
	console.log(tableBuffer[tableObjet[objActif].bufferId].name,pos,zoom)
	var w=200*zoom
	
	document.getElementById("canvas").firstChild.nextSibling.firstChild.setAttribute('width',w)
	//document.getElementById("canvas").firstChild.nextSibling.style.height="200px"
	drawSvgWaveform(tableBuffer[tableObjet[objActif].bufferId].buffer, document.getElementById("canvas").firstChild.nextSibling.firstChild, pos,zoom)
}
function waveFormZoom() {
	var z=parseFloat(document.getElementById("zoomWaveForm").value)
	waveSvgForm(0.5,z)
}
function saveWaveForm() {
	var doc=document.getElementById("canvas").firstChild.nextSibling.innerHTML
	doc=btoa(doc)
	window.api.send("toMain", "saveSvg;"+doc)
}
function closeWaveForm(){
	document.getElementById("canvas").style.display="none"
}
function waveFormH() {
	var z=parseFloat(document.getElementById("zHWaveForm").value)
	var zx=parseFloat(document.getElementById("zoomWaveForm").value)
	document.getElementById("canvas").firstChild.nextSibling.firstChild.setAttribute("transform","scale(1 "+z+")")
}
//document.getElementById("waveFormColor").addEventListener("input", updateFirst, false);
document.getElementById("waveFormColor").addEventListener("change",  waveFormColor, false);
function waveFormColor(e) { 
	document.getElementById("waveFormColor").value=e.target.value
	var wf=document.getElementById("canvas").firstChild.nextSibling.firstChild
	wf.querySelectorAll("rect").forEach((p) => {
    p.setAttribute('fill',e.target.value)
  });
} 