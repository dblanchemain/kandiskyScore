const THREE = await import('https://cdn.skypack.dev/three@0.130.0');
const { OrbitControls } = await import('https://cdn.skypack.dev/three@0.130.0/examples/jsm/controls/OrbitControls.js');

let width = 864;
let height = 664;

export function upDate3D(){
	width=window.innerWidth;
	height=window.innerHeight;
	return width;
}
window.addEventListener("resize", upDate3D);
window.addEventListener( 'resize',onWindowResize, false );

function moveDObjActif(){
	if(drawEtat==1){
		const lineMaterial = new THREE.LineBasicMaterial({
		color: 0xffff00
		});
		if(line){
			scene.remove(line);
		}
		const points = [];
		for(let i=0;i<tableSpeakers.length;i++){
		sph[i].position.set (tableSpeakers[i].posX*3,tableSpeakers[i].posY*2,-tableSpeakers[i].posZ*3 );
		points.push( new THREE.Vector3(tableSpeakers[i].posX*3, tableSpeakers[i].posY*2, -tableSpeakers[i].posZ*3  ) );
		}
		/*
		const lineGeometry = new THREE.BufferGeometry().setFromPoints( points );
	   line = new THREE.Line( lineGeometry, lineMaterial );
	   scene.add( line );
	   */
	   drawEtat=0
	   
   }
   
}
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x001b42);

var sph=[];
var line;
  
const loader = new THREE.CubeTextureLoader();
loader.setPath( './images/png/' );

var planTexture = new THREE.TextureLoader().load("./images/png/grille3b.png");

const material = new THREE.MeshBasicMaterial({
 color: 0xffffff,
 //envMap: textureCube
  });
  
var camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,
1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
 const controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener("change", () => renderer.render(scene, camera));
document.body.appendChild(renderer.domElement);

camera.position.z=5;

function draw3dObj(){
	//let obj=window.opener.retObjActif();
	for(var i=0;i<tableSpeakers.length;i++){
	
	var sphGeo= new THREE.SphereGeometry(0.1,20,20);
	var sphMat = new THREE.MeshBasicMaterial( {color: 0x1fc535} );
	sph[i] = new THREE.Mesh(sphGeo,sphMat);
	sph[i].position.set (tableSpeakers[i].posX*3,tableSpeakers[i].posY*2,-tableSpeakers[i].posZ*3 );
	scene.add(sph[i]);
	
	}
}


const box = new THREE.Box3();
box.setFromCenterAndSize( new THREE.Vector3( 0,0,0 ), new THREE.Vector3( 6, 4, 6 ) );
const helper = new THREE.Box3Helper(box, material);
scene.add(helper);

const planGeometry = new THREE.PlaneGeometry( 6, 4 );
const planMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00, map: planTexture} );
const plane = new THREE.Mesh( planGeometry, planMaterial );
plane.position.set ( 0,0,-3 );
scene.add( plane );


const planGeometry2 = new THREE.PlaneGeometry( 6, 6);
const planMaterial2 = new THREE.MeshBasicMaterial( {color: 0x488df5, map: planTexture} );
const plane2 = new THREE.Mesh( planGeometry2, planMaterial2 );
plane2.position.set ( 0,-2,0 );
rotateObject(plane2, 270, 0, 0);
scene.add( plane2 );
const planGeometry3 = new THREE.PlaneGeometry( 6, 4);
const planMaterial3 = new THREE.MeshBasicMaterial( {color: 0xff0000, map: planTexture} );
const plane3 = new THREE.Mesh( planGeometry3, planMaterial3 );
plane3.position.set ( 3,0,0 );
rotateObject(plane3, 0, 270, 0);
scene.add( plane3 );
function rotateObject(object, degreeX=0, degreeY=0, degreeZ=0) {
   object.rotateX(THREE.Math.degToRad(degreeX));
   object.rotateY(THREE.Math.degToRad(degreeY));
   object.rotateZ(THREE.Math.degToRad(degreeZ));
}
function render() {
requestAnimationFrame(render);
renderer.render(scene, camera);
}
render()

export function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}



if(drawEtat==1){
	draw3dObj()
}
var timer=""
function foo() {
	var delay=50;
	moveDObjActif()
   timer=setTimeout(foo, delay);
   
}

foo()