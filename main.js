import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bg') });

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(0); 
camera.position.setX(-5); 
camera.position.setY(0);

// Torus
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0xff6347 });
const torus = new THREE.Mesh(geometry, material);
scene.add(torus);

// Lights
const spotLight = new THREE.SpotLight(0xffffff, 1000);
spotLight.position.set(5, 5, 5);
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(spotLight, ambientLight);

// Helpers (Optional: Uncomment if needed)
// const lightHelper = new THREE.PointLightHelper(pointLight);
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(-9, 0, 0);

// Stars
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshBasicMaterial ({ color: 0xFFFFFF });
  const star = new THREE.Mesh(geometry, material);
  
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

// Background
const spaceTexture = new THREE.TextureLoader().load('space.jpg');
spaceTexture.colorSpace = THREE.SRGBColorSpace
scene.background = spaceTexture;

// Avatar
const migTexture = new THREE.TextureLoader().load('mig.jpg');
const mig = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshBasicMaterial({ map: migTexture }));
migTexture.colorSpace = THREE.SRGBColorSpace
scene.add(mig);

// Moon
const moonTexture = new THREE.TextureLoader().load('moon_texture.jpg');
const normalTexture = new THREE.TextureLoader().load('normal.jpg');
moonTexture.colorSpace = THREE.SRGBColorSpace
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshBasicMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);
moon.position.z = 37;
moon.position.setX(-10);
scene.add(moon);

// Scroll Animation
function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  // Rotate the moon and the mig box
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  mig.rotation.y += 0.01;
  mig.rotation.z += 0.01;

    // Adjust camera position with respect to scroll
    camera.position.z = 5 + t * -0.01; // Start at 5, adjust with scroll
    camera.position.x = 3 + t * -0.0002; // Move camera to the left and adjust with scroll
    camera.rotation.y = t * -0.0002; // Adjust rotation based on scroll
}

document.body.onscroll = moveCamera;
moveCamera();

// Animation Loop
function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  moon.rotation.x += 0.005;

  controls.update();
  renderer.render(scene, camera);
}

animate();
