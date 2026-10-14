import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

export const C = {
  silver: 0xc9ced6,
  metal: 0x9aa1ab,
  dark: 0x23262e,
  black: 0x15171c,
  gold: 0xe3b341,
  red: 0xd8333a,
  blue: 0x2f6fe4,
  green: 0x1f7a55,
  white: 0xf2f4f7,
  orange: 0xff9f1c,
};

export function mat(color, o = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0.08, ...o });
}

/** Kotak dengan sudut membulat. Opsi `r` = radius sudut, sisanya masuk ke material. */
export function box(w, h, d, color, o = {}) {
  const { r = 0.03, ...mo } = o;
  const rr = Math.min(r, w / 2, h / 2, d / 2) * 0.95;
  const geo = rr > 0.004 ? new RoundedBoxGeometry(w, h, d, 3, rr) : new THREE.BoxGeometry(w, h, d);
  return new THREE.Mesh(geo, mat(color, mo));
}

export function cyl(rt, rb, h, color, o = {}) {
  const { seg = 40, ...mo } = o;
  return new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat(color, mo));
}

export function sphere(r, color, o = {}) {
  const { seg = 32, sx = 1, sy = 1, sz = 1, ...mo } = o;
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, seg, seg / 2), mat(color, mo));
  m.scale.set(sx, sy, sz);
  return m;
}

export function torus(r, tube, color, o = {}) {
  const { arc = Math.PI * 2, ...mo } = o;
  return new THREE.Mesh(new THREE.TorusGeometry(r, tube, 16, 64, arc), mat(color, mo));
}

export function tube(points, radius, color, o = {}) {
  const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
  return new THREE.Mesh(new THREE.TubeGeometry(curve, 64, radius, 10, false), mat(color, o));
}

/** Set posisi (+ rotasi opsional) lalu kembalikan objeknya. */
export function at(obj, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) {
  obj.position.set(x, y, z);
  obj.rotation.set(rx, ry, rz);
  return obj;
}

export function group(...kids) {
  const g = new THREE.Group();
  kids.forEach((k) => k && g.add(k));
  return g;
}

/** Tandai objek agar berputar terus (dibaca oleh viewer). */
export function spin(obj, axis = 'y', speed = 1) {
  obj.userData.spin = { axis, speed };
  return obj;
}

/** Posisi titik `v` milik `obj` dalam koordinat induknya. */
export function toRoot(obj, v) {
  obj.updateMatrix();
  return new THREE.Vector3(...v).applyMatrix4(obj.matrix).toArray();
}

export const part = (name, desc, pos) => ({ name, desc, pos });

export function canvasTex(w, h, draw) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

const FONT = '"Segoe UI", system-ui, Arial, sans-serif';

/** Bidang datar bertulisan (stiker/label). Menghadap +z; putar -PI/2 pada x agar menghadap atas. */
export function textPlate(text, w, h, { bg = null, fg = '#fff', sub = null, subFg, weight = 800 } = {}) {
  const px = 220;
  const cw = Math.max(64, Math.round(w * px));
  const ch = Math.max(64, Math.round(h * px));
  const tex = canvasTex(cw, ch, (ctx) => {
    if (bg) {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, cw, ch);
    }
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const fit = (str, size, wt) => {
      ctx.font = `${wt} ${size}px ${FONT}`;
      while (ctx.measureText(str).width > cw * 0.9 && size > 8) {
        size -= 3;
        ctx.font = `${wt} ${size}px ${FONT}`;
      }
    };
    ctx.fillStyle = fg;
    fit(text, ch * (sub ? 0.42 : 0.6), weight);
    ctx.fillText(text, cw / 2, sub ? ch * 0.36 : ch / 2);
    if (sub) {
      ctx.fillStyle = subFg || fg;
      fit(sub, ch * 0.24, 600);
      ctx.fillText(sub, cw / 2, ch * 0.74);
    }
  });
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false }),
  );
  m.userData.noOcclude = true;
  return m;
}

/** Bidang bergambar canvas bebas. */
export function drawPlate(w, h, draw, { px = 200, basic = true } = {}) {
  const tex = canvasTex(Math.round(w * px), Math.round(h * px), draw);
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    basic
      ? new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false })
      : new THREE.MeshStandardMaterial({ map: tex, transparent: true, roughness: 0.6 }),
  );
  m.userData.noOcclude = true;
  return m;
}

/** InstancedMesh dari daftar {p:[x,y,z], s:[sx,sy,sz], c:warna}. */
export function instanced(geo, material, items) {
  const im = new THREE.InstancedMesh(geo, material, items.length);
  const d = new THREE.Object3D();
  const col = new THREE.Color();
  items.forEach((it, i) => {
    d.position.set(...it.p);
    d.scale.set(...(it.s || [1, 1, 1]));
    d.updateMatrix();
    im.setMatrixAt(i, d.matrix);
    if (it.c !== undefined) im.setColorAt(i, col.set(it.c));
  });
  im.userData.noOcclude = true;
  return im;
}

/** Kipas (rotor) berbilah, sumbu putar = y. */
export function fanRotor(r = 0.7, n = 7, color = 0x2e3340, accent = C.orange) {
  const g = new THREE.Group();
  g.add(cyl(r * 0.28, r * 0.28, 0.14, color, { seg: 32, metalness: 0.3 }));
  g.add(at(cyl(r * 0.18, r * 0.18, 0.02, accent, { seg: 32 }), 0, 0.075, 0));
  for (let i = 0; i < n; i++) {
    const p = new THREE.Group();
    p.rotation.y = (i * Math.PI * 2) / n;
    const len = r * 0.74;
    const b = box(len, 0.02, r * 0.38, color, { r: 0.008, roughness: 0.4 });
    b.position.x = r * 0.26 + len / 2;
    b.rotation.x = 0.5;
    p.add(b);
    g.add(p);
  }
  return spin(g, 'y', 10);
}

/**
 * Kartu PCIe (rata di bidang xz, panjang di sumbu x, braket di ujung -x,
 * konektor emas di sisi +z). Permukaan atas PCB ada di y = 0.03.
 */
export function pcieCard({ len = 2.6, depth = 1.1, pcb = C.green, bracketH = 0.5 } = {}) {
  const g = new THREE.Group();
  g.add(box(len, 0.06, depth, pcb, { r: 0.02, roughness: 0.45 }));
  const tabLen = len * 0.72;
  const tx = len * 0.06;
  g.add(at(box(tabLen, 0.06, 0.2, pcb, { r: 0 }), tx, 0, depth / 2 + 0.1));
  const a = tabLen * 0.6;
  const b = tabLen * 0.34;
  const x0 = tx - tabLen / 2;
  [0.034, -0.034].forEach((y) => {
    g.add(at(box(a, 0.012, 0.17, C.gold, { r: 0, metalness: 0.9, roughness: 0.25 }), x0 + a / 2, y, depth / 2 + 0.1));
    g.add(at(box(b, 0.012, 0.17, C.gold, { r: 0, metalness: 0.9, roughness: 0.25 }), x0 + tabLen - b / 2, y, depth / 2 + 0.1));
  });
  g.add(at(box(0.05, bracketH, depth + 0.35, 0xc5cad2, { r: 0.01, metalness: 0.9, roughness: 0.3 }), -len / 2 - 0.03, bracketH / 2 - 0.05, 0.1));
  return g;
}
