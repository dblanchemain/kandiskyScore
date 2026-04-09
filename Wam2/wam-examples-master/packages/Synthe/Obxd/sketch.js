const audioContext = new AudioContext({sampleRate: 48000});
let synthInstance ;
let state;
const pluginInstances = [];

const recordingstream=audioContext.createMediaStreamDestination();
const recorder=new MediaRecorder(recordingstream.stream);	
let audioChunks = [];
console.log("record",audioContext.sampleRate)
let recorderEtat=0;
async function setup() {
  
  
  const hostGroupId = await setupWamHost();
  
  
  
  // Example with a web assembly instrument (Pro24 synth) WAM compiled from C-Major code)
  const wamURISynth = '../../obxd/index.js';
  synthInstance = await loadDynamicComponent(wamURISynth, hostGroupId);
  
  // Display the WAM GUI (optionnal, WAMs can be used without GUI)
  const synthDiv = await synthInstance.createGui();    
  showWam(synthDiv, 10,110, 1.0);
  
  // Change default parameter values
  // to check parameters'id uncomment these lines
  state = await synthInstance.audioNode.getState()
  console.log(state)
  window.state=state
  //console.log("Volume",state.parameters[67].value)
  
  // Change default preset, patchName is not a parameter !!!!! I have to use the state !!!
  

  // Second WAM: a MidiSequencer for generating notes, sort of step sequencer
 
  const wamMidiSequencer = "../../midiSequencer/src/index.js";
  const wamMidiSequencerInstance = await loadDynamicComponent(wamMidiSequencer, hostGroupId);
  const wamMidiSequencerDiv = await wamMidiSequencerInstance.createGui();    
  showWam(wamMidiSequencerDiv, 10, 10, 1.0,340, 100);
  
  const wamMidiKeyboard = "../../simpleMidiKeyboard/index.js";
  const wamMidiKeyboardInstance = await loadDynamicComponent(wamMidiKeyboard, hostGroupId);
  const wamMidiKeyboardDiv = await wamMidiKeyboardInstance.createGui();    
  showWam(wamMidiKeyboardDiv, 10, 460, 1.0,800, 120);
  wamMidiKeyboardInstance.audioNode.connectEvents(synthInstance.instanceId);
  synthInstance.audioNode.connect(audioContext.destination);
    
  // build the "MIDI graph" (connect the MidiSequencer to the synth)
  wamMidiSequencerInstance.audioNode.connectEvents(synthInstance.instanceId);
  console.log(synthInstance)
  console.log(wamMidiSequencerInstance)
  
  

}

async function setupWamHost() {
    // Init WamEnv, load SDK etc.
	const { default: initializeWamHost } = await import("https://www.webaudiomodules.com/sdk/2.0.0-alpha.6/src/initializeWamHost.js");
	const [hostGroupId] = await initializeWamHost(audioContext);
    
    // hostGroupId is useful to group several WAM plugins together....
    return hostGroupId;
}

async function loadDynamicComponent(wamURI, hostGroupId) {
  try {
    
  // Import WAM
	const { default: WAM } = await import(wamURI);
	// Create a new instance of the plugin, pass groupId
	const wamInstance = await WAM.createInstance(hostGroupId, audioContext);
    
    return wamInstance;
  } catch (error) {
    console.error('Erreur lors du chargement du Web Component :', error);
  }
}

function showWam(wamGUI, x, y, scale, width, height) { 
  // Create a container around the wam, so that we can rescale/position it easily
  // this is where you can add a menu bar, close button, etc.
  const container = document.createElement('div');
  container.style.position = 'absolute';

  container.style.overflow = 'auto'; 
  container.style.zIndex = '10';  // above canvas
  
  // Put the wam in the div
  container.appendChild(wamGUI);
    
  adjustPositionAndSize(container, x, y, scale);
   if(height !== undefined)
    container.style.height = height + "px";
  if(width !== undefined)
    container.style.width = width + "px";

  document.body.appendChild(container);
}

function adjustPositionAndSize(wamContainer, x, y, scale) {
  // rescale without changing the top left coordinates
  wamContainer.style.transformOrigin = '0 0';
  wamContainer.style.top = y + "px";  
  wamContainer.style.left = x + "px";
  wamContainer.style.transform += ` scale(${scale})`; 
}
setup()
async function pluginSelect(defPlugin){
		
				let dest=document.getElementById("plugin-guis")
				var dupnode=document.createElement('div');
				dupnode.setAttribute("id","gui-"+guiMountPoints.length);
				//guiMountPoints[guiMountPoints.length]="gui-"+guiMountPoints.length;
				ref++;
				wamURIs[wamURIs.length]=pluginsPath[defPlugin]
				dest.appendChild(dupnode);
				guiMountPoints.push(dupnode);
				dupnode.addEventListener('click',selectModule)
				insertWam(pluginsPath[defPlugin])
				console.log('selected',guiMountPoints,wamURIs);
			}
			document.getElementById("pet-select").addEventListener('click'
			, function () {
			pluginSelect(this.value)
			console.log('selectedIndex => '+this.value);
		})
		document.getElementById("save2Button").addEventListener('click'
			, function () {
				if (recorderEtat==0) {
					setupRecorder();
				}else {
					stopRecorder();
				}
			})
function selectModule() {
	console.log(this.id)
}
async function insertWam(i){
	const { default: initializeWamHost } = await import("../../sdk/src/initializeWamHost.js");
	const [hostGroupId] = await initializeWamHost(audioContext);
	const { default: pluginFactory } = await import(i);
   const instance = await pluginFactory.createInstance(hostGroupId, audioContext);
   pluginInstances.push(instance);
    audioNodes[pluginInstances.length-1] = pluginInstances[pluginInstances.length-1].audioNode;
   const gui = await instance.createGui();
   if(pluginInstances.length==1){
   
   guiMountPoints[0].appendChild(gui);
  
   //sourceNode.disconnect(audioContext.destination);
   synthInstance.audioNode.connect(audioNodes[0]);
    console.log('selectedIndex => ',guiMountPoints,pluginInstances,audioNodes);
   audioNodes[0].connect(audioContext.destination);
  
   }else{
   guiMountPoints[guiMountPoints.length-1].appendChild(gui);
  
   audioNodes[wamURIs.length-2].disconnect(audioContext.destination);
   audioNodes[wamURIs.length-2].connect(audioNodes[wamURIs.length-1]);
   audioNodes[wamURIs.length-1].connect(audioContext.destination);
   
   }
}
async function setupRecorder(){
	audioChunks=[]
	if(wamURIs.length==0){
		synthInstance.audioNode.connect(recordingstream); 
	}else {
		audioNodes[wamURIs.length-1].connect(recordingstream);
	}
	recorder.start();
	document.getElementById("save2Button").firstChild.src="/home/dominique/Electron/kandiskyscore-dev/images/png/gtk-media-record.png"
	recorderEtat=1;
	recorder.onstop = async () => {
  console.log("length", audioChunks.length);

  const blob = new Blob(audioChunks, { type: 'audio/webm' });

  const aBuffer = await blob.arrayBuffer();
  const bBuffer = await audioContext.decodeAudioData(aBuffer);

  const rwav = convertAudioBufferToBlob(bBuffer); // bBuffer est un AudioBuffer
  document.getElementById("renduWav").src=URL.createObjectURL(rwav);
  document.getElementById("renduWav").style.display="block";

};

 recorder.ondataavailable = event => {
     audioChunks.push(event.data);
 };

    
}


function stopRecorder() {
    recorder.stop();
    console.log("Recorder stopped");
   document.getElementById("save2Button").firstChild.src="/home/dominique/Electron/kandiskyscore-dev/images/png/stop2.png"
   recorderEtat=0;
}

