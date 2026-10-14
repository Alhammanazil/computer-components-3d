import * as THREE from 'three';
import { prepareModel, disposeModel, fitDistance, makeEnv, makeLights } from './viewer.js';

let ctx = null;
const cache = new Map();
let chain = Promise.resolve();

function setup() {
  const size = 340;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1);
  renderer.setSize(size, size);
  renderer.toneMapping = THREE.NeutralToneMapping;
  const scene = new THREE.Scene();
  scene.environment = makeEnv(renderer);
  makeLights(scene);
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  return { renderer, scene, camera };
}

function render(id) {
  ctx ||= setup();
  const { renderer, scene, camera } = ctx;
  const m = prepareModel(id);
  scene.add(m.holder);
  camera.position.copy(m.view).multiplyScalar(fitDistance(1, 1.05));
  camera.lookAt(0, 0, 0);
  renderer.render(scene, camera);
  const url = renderer.domElement.toDataURL('image/png');
  scene.remove(m.holder);
  disposeModel(m);
  return url;
}

/** Gambar thumbnail (data URL) sebuah komponen. Dirender satu per satu agar UI tetap lancar. */
export function getThumb(id) {
  if (!cache.has(id)) {
    cache.set(id, chain.then(() => new Promise((resolve) => {
      setTimeout(() => resolve(render(id)), 0);
    })));
    chain = cache.get(id).catch(() => {});
  }
  return cache.get(id);
}
