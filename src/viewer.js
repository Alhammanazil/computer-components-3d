import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { builders } from './models/index.js';

const FOV = 35;
const RADIUS = 1.5; // radius bola pembatas semua model setelah dinormalkan

/** Bangun model, pusatkan, dan skalakan agar semua komponen tampil sama besar. */
export function prepareModel(id) {
  const { group, parts, view } = builders[id]();
  const holder = new THREE.Group();
  holder.add(group);

  const sphere = new THREE.Box3().setFromObject(group).getBoundingSphere(new THREE.Sphere());
  group.position.sub(sphere.center);
  holder.scale.setScalar(RADIUS / sphere.radius);
  holder.updateMatrixWorld(true);

  const spinners = [];
  const pickables = [];
  group.traverse((o) => {
    if (o.userData.spin) spinners.push(o);
    if (o.isMesh && !o.isInstancedMesh && !o.userData.noOcclude) pickables.push(o);
  });

  const minY = new THREE.Box3().setFromObject(holder).min.y;
  return {
    holder, group, parts, spinners, pickables, minY,
    view: new THREE.Vector3(...(view || [1, 0.8, 1.1])).normalize(),
  };
}

export function disposeModel(m) {
  m.holder.traverse((o) => {
    if (!o.isMesh) return;
    o.geometry.dispose();
    [].concat(o.material).forEach((mt) => {
      mt.map?.dispose();
      mt.dispose();
    });
  });
}

/** Jarak kamera agar bola radius R muat penuh di layar (landscape maupun portrait). */
export function fitDistance(aspect, margin = 1.18) {
  const v = (FOV * Math.PI) / 180;
  const h = 2 * Math.atan(Math.tan(v / 2) * aspect);
  return (RADIUS * margin) / Math.sin(Math.min(v, h) / 2);
}

export function makeEnv(renderer) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const tex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();
  return tex;
}

export function makeLights(scene) {
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(3, 5, 4);
  const fill = new THREE.DirectionalLight(0xbfd8ff, 0.6);
  fill.position.set(-4, 2, -3);
  scene.add(key, fill);
}

function shadowBlob() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d');
  const gr = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, 'rgba(10,40,80,0.38)');
  gr.addColorStop(1, 'rgba(10,40,80,0)');
  ctx.fillStyle = gr;
  ctx.fillRect(0, 0, 128, 128);
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false }),
  );
  m.rotation.x = -Math.PI / 2;
  m.renderOrder = -1;
  return m;
}

export class Viewer {
  constructor() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.toneMapping = THREE.NeutralToneMapping;
    this.renderer.domElement.className = 'viewer-canvas';

    this.scene = new THREE.Scene();
    this.scene.environment = makeEnv(this.renderer);
    makeLights(this.scene);
    this.blob = shadowBlob();
    this.scene.add(this.blob);

    this.camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.enablePan = false;
    this.controls.autoRotateSpeed = 1.6;
    this.controls.addEventListener('start', () => {
      this.controls.autoRotate = false;
      clearTimeout(this._resume);
      this.host?.classList.add('dragging');
    });
    this.controls.addEventListener('end', () => {
      this.host?.classList.remove('dragging');
      clearTimeout(this._resume);
      this._resume = setTimeout(() => { this.controls.autoRotate = this.auto; }, 2500);
    });

    this.auto = true;
    this.pinsOn = true;
    this.model = null;
    this.pinEls = [];
    this.onPin = null;
    this.clock = new THREE.Clock();
    this.ray = new THREE.Raycaster();
    this._tmp = new THREE.Vector3();
    this._frame = this._frame.bind(this);
    this._ro = new ResizeObserver(() => this._resize());
    this._tick = 0;
  }

  mount(host, pinsHost) {
    this.host = host;
    this.pinsHost = pinsHost;
    host.prepend(this.renderer.domElement);
    this._ro.disconnect();
    this._ro.observe(host);
    this._resize();
    this.clock.getDelta();
    cancelAnimationFrame(this._raf);
    this._raf = requestAnimationFrame(this._frame);
  }

  unmount() {
    cancelAnimationFrame(this._raf);
    clearTimeout(this._resume);
    this._ro.disconnect();
    this.clear();
    this.renderer.domElement.remove();
    this.host = null;
    this.pinsHost = null;
  }

  clear() {
    if (this.model) {
      this.scene.remove(this.model.holder);
      disposeModel(this.model);
      this.model = null;
    }
    this.pinEls.forEach((e) => e.remove());
    this.pinEls = [];
  }

  /** Tampilkan model komponen. `pins`: tampilkan penanda bagian-bagian. */
  setModel(id, { pins = false } = {}) {
    this.clear();
    const m = prepareModel(id);
    this.model = m;
    this.scene.add(m.holder);
    this.blob.position.y = m.minY - 0.02;
    this.blob.scale.setScalar(RADIUS * 3);
    if (pins && this.pinsHost) {
      this.pinEls = m.parts.map((p, i) => {
        const b = document.createElement('button');
        b.className = 'pin';
        b.type = 'button';
        b.innerHTML = `<b>${i + 1}</b><span>${p.name}</span>`;
        b.addEventListener('click', () => this.onPin?.(i));
        this.pinsHost.appendChild(b);
        return b;
      });
    }
    this.pinsHost?.classList.toggle('off', !this.pinsOn);
    this.resetView();
  }

  resetView() {
    if (!this.model) return;
    const a = this._aspect();
    const d = fitDistance(a);
    this.camera.position.copy(this.model.view).multiplyScalar(d);
    this.controls.target.set(0, 0, 0);
    this.controls.minDistance = d * 0.45;
    this.controls.maxDistance = d * 2.2;
    this.controls.autoRotate = this.auto;
    this.controls.update();
  }

  setAutoRotate(on) {
    this.auto = on;
    this.controls.autoRotate = on;
  }

  setPinsVisible(on) {
    this.pinsOn = on;
    this.pinsHost?.classList.toggle('off', !on);
  }

  highlightPin(i) {
    this.pinEls.forEach((e, k) => e.classList.toggle('active', k === i));
  }

  _aspect() {
    const w = this.host?.clientWidth || 1;
    const h = this.host?.clientHeight || 1;
    return w / h;
  }

  _resize() {
    if (!this.host) return;
    const w = this.host.clientWidth;
    const h = this.host.clientHeight;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    if (this.model) {
      const d = fitDistance(w / h);
      this.controls.minDistance = d * 0.45;
      this.controls.maxDistance = d * 2.2;
    }
  }

  _frame() {
    this._raf = requestAnimationFrame(this._frame);
    const dt = Math.min(this.clock.getDelta(), 0.05);
    if (this.model) {
      this.model.spinners.forEach((o) => {
        o.rotation[o.userData.spin.axis] += o.userData.spin.speed * dt;
      });
    }
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    if (this.pinEls.length) this._updatePins();
  }

  _updatePins() {
    const w = this.host.clientWidth;
    const h = this.host.clientHeight;
    const checkOcclusion = (this._tick++ & 3) === 0;
    const camPos = this.camera.position;
    this.model.parts.forEach((p, i) => {
      const el = this.pinEls[i];
      const world = this.model.group.localToWorld(this._tmp.set(...p.pos));
      const ndc = world.clone().project(this.camera);
      el.style.transform = `translate(${((ndc.x + 1) / 2) * w}px, ${((1 - ndc.y) / 2) * h}px)`;
      if (checkOcclusion) {
        const dir = world.clone().sub(camPos);
        const dist = dir.length();
        this.ray.set(camPos, dir.normalize());
        this.ray.far = dist;
        const hit = this.ray.intersectObjects(this.model.pickables, false)[0];
        el.classList.toggle('behind', !!hit && hit.distance < dist - 0.12);
      }
    });
  }
}
