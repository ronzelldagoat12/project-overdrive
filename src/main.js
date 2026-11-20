
import * as THREE from 'three';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);
scene.fog = new THREE.Fog(0x87ceeb, 30, 150);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.getElementById('game').appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xffffff, 0x445566, 2));

const sunlight = new THREE.DirectionalLight(0xffffff, 2);
sunlight.position.set(20, 40, 20);
scene.add(sunlight);

// Island
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(200, 200),
  new THREE.MeshStandardMaterial({ color: 0x4b9148 })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Player
const player = new THREE.Group();
const body = new THREE.Mesh(
  new THREE.CapsuleGeometry(0.5, 1, 4, 8),
  new THREE.MeshStandardMaterial({ color: 0x1769aa })
);
body.position.y = 1;
player.add(body);
scene.add(player);

camera.position.set(0, 4, 8);
camera.lookAt(player.position);

// Movement
const keys = {};
window.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
window.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

function animate() {
  requestAnimationFrame(animate);

  if (keys.w) player.position.z -= 0.12;
  if (keys.s) player.position.z += 0.12;
  if (keys.a) player.position.x -= 0.12;
  if (keys.d) player.position.x += 0.12;

  camera.position.x = player.position.x;
  camera.position.z = player.position.z + 8;
  camera.lookAt(player.position.x, 1, player.position.z);

  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
