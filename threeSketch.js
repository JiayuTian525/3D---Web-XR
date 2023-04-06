import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ImprovedNoise } from 'three/addons/math/ImprovedNoise.js';


let scene, camera, renderer, controls;
let stats, clock; // helpers
let light, pointLight;
let cubes = [];
let centerPoint;
let Noise;

const particleCount = 3000;
const particles = new THREE.BufferGeometry();
const particlePositions = new Float32Array(particleCount * 3);

init();
animate();

function init() {

    Noise = new ImprovedNoise();

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.getElementById("sketch-container").appendChild( renderer.domElement );

    //camera interaction controls
    controls = new OrbitControls( camera, renderer.domElement );

    //controls.update() must be called after any manual changes to the camera's transform
    camera.position.set( 8, 13, 20 ); //always looks at center
    controls.update();

    //set up our scene
    light = new THREE.AmbientLight( 0xfffafe ); // soft white light
    scene.add( light );
    pointLight = new THREE.PointLight( 0xfffafe, 1, 100 );
    pointLight.position.set( 10, 10, 10 );
    scene.add( pointLight );
    

    centerPoint = new THREE.Vector3( 0, 0, 0 );
   
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshNormalMaterial();
    
    //create cubes
    for (let x = -8; x <= 8; x += 1) {
        for (let z = -8; z <= 8; z += 1) {

            const cube = new THREE.Mesh( geometry, material ); 

            cube.position.x = x;
            cube.position.y = 0;
            cube.position.z = z;
            
            scene.add(cube);

            cubes.push(cube);
        }
    }

    //help us animate
    clock = new THREE.Clock();

    //For frame rate
    stats = Stats()
    stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom)
    

    //https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
    //https://www.w3schools.com/js/js_htmldom_eventlistener.asp
    //https://www.w3schools.com/js/js_htmldom_events.asp
    window.addEventListener('resize', onWindowResize );

}


function animate() {
    renderer.setAnimationLoop( render );
}

function render(){
    stats.begin();

    for (let i = 0; i < cubes.length; i++) {
        let cube = cubes[i];
        // let distance = cube.position.distanceTo(centerPoint);
        // let sine = Math.sin(distance + clock.getElapsedTime()*5);//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math
        // let height = THREE.MathUtils.mapLinear(sine,-1,1,1,5);//https://threejs.org/docs/?q=Math#api/en/math/MathUtils
        // cube.scale.y = height;
        let n = Noise.noise(cube.position.x*0.1, cube.position.y*0.1, (cube.position.z + clock.getElapsedTime())*0.5);
        cube.scale.y = 1 + n*10;
    }

	stats.end();

//particle system
for (let i = 0; i < particleCount; i++) {
    particlePositions[i * 3] = Math.random() * 200 - 100;
    particlePositions[i * 3 + 1] = Math.random() * 200 - 100;
    particlePositions[i * 3 + 2] = Math.random() * 200 - 100;
}

particles.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
const particleMaterial = new THREE.PointsMaterial({ color: 0xffffff });
const particleSystem = new THREE.Points(particles, particleMaterial);

scene.add(particleSystem);
   
    // required if controls.enableDamping or controls.autoRotate are set to true
	//controls.update();

    renderer.render( scene, camera );
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

}

