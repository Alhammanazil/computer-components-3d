import * as THREE from 'three';
import {
  C, box, cyl, sphere, torus, tube, at, textPlate, drawPlate, canvasTex, instanced, mat, part, toRoot,
} from './helpers.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

/* --------------------------------------------------------------------- MONITOR */
export function monitor() {
  const g = new THREE.Group();
  g.add(at(box(1.7, 0.07, 1.0, 0x2a2e36, { r: 0.03 }), 0, 0.035, 0.1));
  g.add(at(box(0.35, 1.1, 0.12, 0x2a2e36, { r: 0.03 }), 0, 0.62, -0.05));
  g.add(at(box(3.9, 2.25, 0.14, 0x14161b, { r: 0.06 }), 0, 1.9, 0));
  g.add(at(box(3.4, 1.9, 0.12, 0x1b1e24, { r: 0.05 }), 0, 1.9, -0.1));

  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(3.72, 2.08),
    new THREE.MeshBasicMaterial({
      toneMapped: false,
      map: canvasTex(1024, 573, (ctx, w, h) => {
        const bg = ctx.createLinearGradient(0, 0, w, h);
        bg.addColorStop(0, '#1b6fd6');
        bg.addColorStop(1, '#7b3fe4');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, w, h);
        // jendela
        ctx.fillStyle = 'rgba(255,255,255,0.95)';
        ctx.beginPath();
        ctx.roundRect(w * 0.22, h * 0.14, w * 0.56, h * 0.62, 14);
        ctx.fill();
        ctx.fillStyle = '#e9edf5';
        ctx.fillRect(w * 0.22, h * 0.14, w * 0.56, h * 0.09);
        ['#ff5f57', '#febc2e', '#28c840'].forEach((c, i) => {
          ctx.fillStyle = c;
          ctx.beginPath();
          ctx.arc(w * 0.24 + i * 24, h * 0.185, 7, 0, 7);
          ctx.fill();
        });
        ctx.fillStyle = '#c9d6ee';
        for (let i = 0; i < 5; i++) ctx.fillRect(w * 0.25, h * (0.3 + i * 0.09), w * (0.4 - (i % 3) * 0.06), 16);
        // ikon desktop
        ['#ffd166', '#06d6a0', '#ef476f'].forEach((c, i) => {
          ctx.fillStyle = c;
          ctx.beginPath();
          ctx.roundRect(w * 0.04, h * (0.08 + i * 0.16), 54, 54, 10);
          ctx.fill();
        });
        // taskbar
        ctx.fillStyle = 'rgba(15,20,40,0.85)';
        ctx.fillRect(0, h * 0.92, w, h * 0.08);
        ctx.fillStyle = '#4dabf7';
        ctx.fillRect(w * 0.47, h * 0.935, 30, 30);
      }),
    }),
  );
  screen.position.set(0, 1.9, 0.072);
  screen.userData.noOcclude = true;
  g.add(screen);
  g.add(at(cyl(0.035, 0.035, 0.02, 0x39c46b, { emissive: 0x39c46b, emissiveIntensity: 0.9 }), 1.7, 0.82, 0.075, Math.PI / 2));
  g.add(at(box(0.16, 0.03, 0.02, 0x3a3f4b, { r: 0.01 }), 1.45, 0.82, 0.075));

  const parts = [
    part('Layar (panel LCD)', 'Tersusun dari jutaan piksel kecil yang menyala membentuk gambar.', [0, 1.9, 0.2]),
    part('Bezel', 'Bingkai hitam yang mengelilingi layar.', [-1.0, 0.82, 0.12]),
    part('Penyangga (neck)', 'Tiang yang menahan layar dan sering bisa diatur tinggi-rendahnya.', [0, 0.6, 0.12]),
    part('Alas (base)', 'Dasar yang menjaga monitor tetap seimbang di atas meja.', [0, 0.15, 0.55]),
    part('Tombol & lampu power', 'Untuk menyalakan monitor. Lampu hijau berarti monitor aktif.', [1.6, 0.9, 0.12]),
  ];
  return { group: g, parts, view: [0.45, 0.2, 1.0] };
}

/* -------------------------------------------------------------------- KEYBOARD */
const ROWS = [
  [['Esc', 1], ...['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'].map((k) => [k, 1]), ['Del', 1], ['Ins', 1]],
  [...'` 1 2 3 4 5 6 7 8 9 0 - ='.split(' ').map((k) => [k, 1]), ['Bksp', 2]],
  [['Tab', 1.5], ...'Q W E R T Y U I O P [ ]'.split(' ').map((k) => [k, 1]), ['\\', 1.5]],
  [['Caps', 1.75], ...'A S D F G H J K L ; \''.split(' ').map((k) => [k, 1]), ['Enter', 2.25]],
  [['Shift', 2.25], ...'Z X C V B N M , . /'.split(' ').map((k) => [k, 1]), ['Shift', 2.75]],
  [['Ctrl', 1.25], ['Win', 1.25], ['Alt', 1.25], ['', 6.25], ['Alt', 1.25], ['Fn', 1.25], ['Menu', 1.25], ['Ctrl', 1.25]],
];

export function keyboard() {
  const g = new THREE.Group();
  const U = 0.275;
  const rowZ = [-0.62, -0.295, -0.03, 0.235, 0.5, 0.765];
  g.add(at(box(4.4, 0.14, 1.7, 0x2b2f38, { r: 0.07, roughness: 0.5 }), 0, 0, 0.075));

  const items = [];
  const keyAt = {};
  const labels = [];
  ROWS.forEach((row, ri) => {
    let x = -7.5 * U;
    row.forEach(([label, w]) => {
      const cx = x + (w * U) / 2;
      const isAlpha = label.length === 1 && /[A-Z0-9`\-=[\];',./\\]/.test(label);
      const color = label === 'Enter' ? 0xff9f1c : label === 'Esc' ? 0xd8333a : isAlpha ? 0x4a5160 : 0x2f3440;
      items.push({ p: [cx, 0.12, rowZ[ri]], s: [w * U - 0.035, 0.1, U - 0.035], c: color });
      labels.push([label, cx, rowZ[ri]]);
      keyAt[label || 'Space'] = [cx, rowZ[ri]];
      x += w * U;
    });
  });
  g.add(instanced(new RoundedBoxGeometry(1, 1, 1, 2, 0.14),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.55 }), items));

  // legenda huruf di atas tombol
  const px = 240;
  const W = 4.2;
  const D = 1.66;
  const legend = drawPlate(W, D, (ctx) => {
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#eef2f7';
    labels.forEach(([t, x, z]) => {
      ctx.font = `700 ${t.length > 2 ? 30 : 42}px "Segoe UI", Arial, sans-serif`;
      ctx.fillText(t, (x + W / 2) * px, (z - (0.075 - D / 2)) * px);
    });
  }, { px });
  g.add(at(legend, 0, 0.172, 0.075, -Math.PI / 2));

  g.add(tube([[0, 0.05, -0.8], [0, 0.0, -1.2], [0.5, -0.05, -1.6], [0.2, -0.05, -2.1]], 0.04, C.black));

  g.rotation.x = 0.07;
  const p = (label, dy = 0.32) => [keyAt[label][0], dy, keyAt[label][1]];
  const parts = [
    part('Tombol huruf', 'Area utama untuk mengetik huruf A–Z, angka, dan tanda baca.', p('G')),
    part('Tombol fungsi (F1–F12)', 'Baris atas dengan fungsi khusus. Contoh: F5 untuk menyegarkan halaman.', p('F6')),
    part('Spacebar', 'Tombol terpanjang untuk memberi spasi antar kata.', p('Space')),
    part('Enter', 'Untuk mengonfirmasi perintah atau pindah ke baris baru.', p('Enter')),
    part('Shift', 'Ditahan untuk mengetik huruf kapital dan simbol atas.', p('Shift')),
    part('Kabel USB', 'Menghubungkan keyboard ke komputer (keyboard nirkabel tidak memakainya).', [0.35, 0.05, -1.7]),
  ];
  return { group: g, parts, view: [0.3, 0.9, 0.7] };
}

/* ----------------------------------------------------------------------- MOUSE */
export function mouse() {
  const g = new THREE.Group();
  const S = [0.75, 0.45, 1.2];
  const body = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2), mat(0x2b2f38, { roughness: 0.4 }));
  body.scale.set(S[0] * 0.985, S[1] * 0.985, S[2] * 0.985);
  g.add(body);
  const btn = (phiStart) => {
    const m = new THREE.Mesh(
      new THREE.SphereGeometry(1, 48, 24, phiStart, Math.PI / 2 - 0.03, 0, 1.2),
      mat(0x3b4150, { roughness: 0.35, side: THREE.DoubleSide }),
    );
    m.scale.set(...S);
    return m;
  };
  g.add(btn(0));
  g.add(btn(Math.PI / 2 + 0.03));
  const base = cyl(1, 1, 0.03, 0x15171c, { seg: 64 });
  base.scale.set(S[0], 1, S[2]);
  base.position.y = -0.015;
  g.add(base);
  g.add(at(cyl(0.09, 0.09, 0.1, C.orange, { seg: 24 }), 0, 0.4, 0.55, 0, 0, Math.PI / 2));
  g.add(at(box(0.1, 0.03, 0.12, 0xd9dde3, { r: 0.01 }), 0, 0.45, 0.2));
  [0.3, 0.05].forEach((z) => g.add(at(box(0.05, 0.07, 0.22, 0x5a6275, { r: 0.015 }), -0.64 + (z < 0.1 ? 0.04 : 0), 0.2, z + 0.15)));
  g.add(at(cyl(0.08, 0.08, 0.01, 0xff3b3b, { emissive: 0xff3b3b, emissiveIntensity: 1 }), 0, -0.035, 0.1));
  g.add(tube([[0, 0.1, 1.15], [0, 0.08, 1.6], [0.4, 0.04, 2.0], [0.2, 0.04, 2.6]], 0.03, C.black));

  const parts = [
    part('Tombol kiri', 'Klik kiri untuk memilih, membuka file, atau menekan tombol di layar.', [-0.3, 0.5, 0.6]),
    part('Tombol kanan', 'Klik kanan untuk membuka menu pilihan tambahan.', [0.3, 0.5, 0.6]),
    part('Roda gulir (scroll)', 'Diputar untuk menggulir halaman ke atas atau ke bawah.', [0, 0.58, 0.55]),
    part('Sensor optik', 'Ada di bawah. Sensor cahaya membaca gerakan mouse di permukaan meja.', [0, -0.2, 0.1]),
    part('Kabel USB', 'Menyambungkan mouse ke komputer.', [0.4, 0.15, 2.0]),
  ];
  return { group: g, parts, view: [0.8, 0.9, 1.1] };
}

/* --------------------------------------------------------------------- SPEAKER */
function speakerUnit() {
  const u = new THREE.Group();
  u.add(at(box(1.4, 2.4, 1.3, 0x1f2229, { r: 0.09, roughness: 0.55 }), 0, 1.2, 0));
  u.add(at(box(1.2, 2.2, 0.04, 0x15171c, { r: 0.02 }), 0, 1.2, 0.66));
  const driver = (y, R, dust) => {
    u.add(at(torus(R, R * 0.14, 0x0e0f12, { roughness: 0.8 }), 0, y, 0.69));
    const cone = new THREE.Mesh(new THREE.CylinderGeometry(R, R * 0.3, R * 0.4, 40, 1, true), mat(0x2a2e36, { side: THREE.DoubleSide, roughness: 0.6 }));
    u.add(at(cone, 0, y, 0.62, Math.PI / 2));
    u.add(at(sphere(dust, dust > 0.1 ? 0x3a3f4b : 0xb7bcc5, { metalness: dust > 0.1 ? 0.2 : 0.9, roughness: 0.3 }), 0, y, 0.66, 0, 0, 0));
  };
  driver(0.85, 0.42, 0.12);
  driver(1.75, 0.19, 0.12);
  u.add(at(torus(0.14, 0.03, 0x3a3f4b), 0, 0.28, 0.7));
  u.add(at(cyl(0.13, 0.13, 0.04, C.black, { seg: 32 }), 0, 0.28, 0.67, Math.PI / 2));
  u.add(at(cyl(0.09, 0.09, 0.06, 0xb7bcc5, { metalness: 0.9, roughness: 0.3 }), -0.4, 2.12, 0.68, Math.PI / 2));
  u.add(at(cyl(0.035, 0.035, 0.03, 0x39d0ff, { emissive: 0x39d0ff, emissiveIntensity: 1 }), 0.4, 2.12, 0.68, Math.PI / 2));
  return u;
}

export function speaker() {
  const g = new THREE.Group();
  const left = at(speakerUnit(), -1.1, 0, 0, 0, 0.25, 0);
  const right = at(speakerUnit(), 1.1, 0, 0, 0, -0.25, 0);
  g.add(left, right);
  const parts = [
    part('Woofer', 'Pengeras suara besar untuk nada rendah (bass). Kerucutnya bergetar menggerakkan udara.', toRoot(left, [0, 0.85, 0.85])),
    part('Tweeter', 'Pengeras suara kecil untuk nada tinggi seperti suara vokal dan denting.', toRoot(left, [0, 1.75, 0.85])),
    part('Lubang bass port', 'Membantu suara bass terdengar lebih dalam dan bertenaga.', toRoot(left, [0, 0.28, 0.9])),
    part('Kenop volume', 'Diputar untuk mengatur keras-pelannya suara.', toRoot(left, [-0.4, 2.12, 0.85])),
    part('Kabinet', 'Kotak penyangga yang menahan getaran dan membentuk kualitas suara.', toRoot(right, [0.55, 1.2, 0.5])),
  ];
  return { group: g, parts, view: [0.3, 0.3, 1.0] };
}

/* --------------------------------------------------------------------- HEADSET */
export function headset() {
  const g = new THREE.Group();
  g.add(torus(1.15, 0.065, 0x2a2e36, { arc: Math.PI, metalness: 0.4, roughness: 0.4 }));
  g.add(at(torus(1.08, 0.1, C.orange, { arc: 1.1, roughness: 0.6 }), 0, 0, 0, 0, 0, Math.PI / 2 - 0.55));
  [-1, 1].forEach((s) => {
    g.add(at(cyl(0.5, 0.5, 0.38, 0x20242c, { seg: 48, roughness: 0.5 }), s * 1.2, 0, 0, 0, 0, Math.PI / 2));
    g.add(at(cyl(0.38, 0.38, 0.02, C.orange, { seg: 48 }), s * 1.4, 0, 0, 0, 0, Math.PI / 2));
    g.add(at(torus(0.42, 0.12, 0x3a3f4b, { roughness: 0.9 }), s * 0.98, 0, 0, 0, Math.PI / 2, 0));
    g.add(at(box(0.1, 0.35, 0.12, 0x2a2e36, { r: 0.03 }), s * 1.2, 0.35, 0));
  });
  g.add(tube([[-1.42, -0.1, 0.1], [-1.1, -0.6, 0.7], [-0.6, -0.95, 1.1], [-0.25, -1.0, 1.2]], 0.045, 0x2a2e36, { metalness: 0.3 }));
  g.add(at(cyl(0.1, 0.1, 0.26, 0x15171c, { seg: 24 }), -0.15, -1.0, 1.2, 0, 0, Math.PI / 2));
  g.add(at(sphere(0.08, C.orange), -0.03, -1.0, 1.2));
  const parts = [
    part('Headband', 'Pita kepala yang menahan headset dan bantalan atasnya membuat nyaman.', [0, 1.4, 0]),
    part('Earcup (speaker)', 'Di dalamnya ada speaker kecil yang menghasilkan suara.', [-1.5, 0.1, 0]),
    part('Bantalan telinga', 'Busa empuk yang menutup telinga dan meredam suara luar.', [1.0, 0.5, 0.1]),
    part('Mikrofon', 'Menangkap suara kita saat bermain game atau video call.', [-0.2, -0.85, 1.2]),
  ];
  return { group: g, parts, view: [0.4, 0.15, 1.0] };
}

/* ---------------------------------------------------------------------- WEBCAM */
export function webcam() {
  const g = new THREE.Group();
  g.add(at(cyl(0.6, 0.65, 0.1, 0x2a2e36, { seg: 48 }), 0, 0.05, 0));
  g.add(at(cyl(0.1, 0.1, 0.4, 0x3a3f4b), 0, 0.3, 0));
  g.add(sphere(0.15, 0x3a3f4b, { metalness: 0.4 }).translateY(0.55));
  g.add(at(box(1.5, 0.8, 0.5, 0x1b1e24, { r: 0.14 }), 0, 0.95, 0));
  g.add(at(cyl(0.3, 0.3, 0.08, 0xb7bcc5, { seg: 48, metalness: 0.9, roughness: 0.25 }), 0, 0.95, 0.27, Math.PI / 2));
  g.add(at(new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.09, 48),
    new THREE.MeshPhysicalMaterial({ color: 0x0a1830, metalness: 0.4, roughness: 0.05, clearcoat: 1 })), 0, 0.95, 0.275, Math.PI / 2));
  g.add(at(sphere(0.05, 0xffffff, { emissive: 0xffffff, emissiveIntensity: 0.2 }), -0.07, 1.02, 0.325));
  g.add(at(cyl(0.04, 0.04, 0.02, 0x39c46b, { emissive: 0x39c46b, emissiveIntensity: 1 }), 0.55, 1.2, 0.255, Math.PI / 2));
  [-0.6, -0.5].forEach((x) => g.add(at(cyl(0.03, 0.03, 0.02, C.black), x, 1.2, 0.255, Math.PI / 2)));
  g.add(tube([[0, 0.1, -0.5], [0, 0.05, -1.0], [0.5, 0.03, -1.5]], 0.035, C.black));
  const parts = [
    part('Lensa', 'Menangkap cahaya lalu diubah menjadi gambar video oleh sensor di belakangnya.', [0, 0.95, 0.42]),
    part('Lampu LED', 'Menyala saat kamera sedang aktif merekam.', [0.55, 1.2, 0.33]),
    part('Mikrofon', 'Lubang kecil untuk menangkap suara saat video call.', [-0.55, 1.2, 0.33]),
    part('Penyangga', 'Tiang dan alas agar webcam bisa diarahkan dan berdiri stabil.', [0, 0.3, 0.15]),
  ];
  return { group: g, parts, view: [0.7, 0.3, 1.0] };
}

/* ---------------------------------------------------------------------- PRINTER */
export function printer() {
  const g = new THREE.Group();
  g.add(at(box(3.4, 1.0, 2.3, 0xe7eaef, { r: 0.12, roughness: 0.5 }), 0, 0.5, 0));
  g.add(at(box(2.9, 0.06, 1.3, 0xcfd4db, { r: 0.02 }), -0.1, 1.03, -0.2));
  g.add(at(box(2.7, 0.02, 1.1, 0x1e2c45, { r: 0, metalness: 0.5, roughness: 0.1 }), -0.1, 1.07, -0.2));
  g.add(at(box(2.4, 0.2, 0.05, C.black, { r: 0.01 }), 0, 0.45, 1.16));
  g.add(at(box(2.6, 0.05, 1.3, 0xcfd4db, { r: 0.015 }), 0, 0.22, 1.7));
  g.add(at(box(2.0, 0.012, 1.45, 0xffffff, { r: 0 }), 0, 0.26, 1.45));
  g.add(at(drawPlate(1.8, 1.0, (ctx, w, h) => {
    ctx.fillStyle = '#9aa4b2';
    for (let i = 0; i < 9; i++) ctx.fillRect(w * 0.08, h * (0.12 + i * 0.09), w * (0.84 - (i % 3) * 0.2), 7);
  }, { px: 120 }), 0, 0.2665, 1.9, -Math.PI / 2));
  g.add(at(box(2.2, 0.03, 1.5, 0xffffff, { r: 0 }), 0, 1.45, -1.0, -0.95, 0, 0));
  g.add(at(box(2.3, 0.04, 0.12, 0xcfd4db, { r: 0.01 }), 0, 1.1, -1.4));
  g.add(at(box(1.0, 0.1, 0.45, 0x2b2f38, { r: 0.03 }), 1.0, 1.03, 0.85, -0.2));
  g.add(at(box(0.45, 0.02, 0.2, 0x39d0ff, { r: 0, emissive: 0x39d0ff, emissiveIntensity: 0.7 }), 0.85, 1.088, 0.82, -0.2));
  [0.0, 0.14, 0.28].forEach((dx) => g.add(at(cyl(0.04, 0.04, 0.02, 0xd9dde3), 1.15 + dx * 0.9, 1.095, 0.9, -0.2)));
  g.add(at(cyl(0.035, 0.035, 0.02, 0x39c46b, { emissive: 0x39c46b, emissiveIntensity: 1 }), 1.5, 0.8, 1.16, Math.PI / 2));
  const parts = [
    part('Baki kertas masuk', 'Tempat menumpuk kertas kosong sebelum dicetak.', [0, 1.65, -1.2]),
    part('Baki keluaran', 'Kertas hasil cetak keluar dan menumpuk di sini.', [0, 0.4, 2.2]),
    part('Panel kontrol', 'Layar dan tombol untuk memilih menu, menyalin, atau membatalkan cetakan.', [1.0, 1.25, 0.85]),
    part('Kaca scanner', 'Dokumen diletakkan di sini untuk di-scan atau difotokopi.', [-0.3, 1.2, -0.1]),
  ];
  return { group: g, parts, view: [0.7, 0.6, 1.0] };
}

/* -------------------------------------------------------------------- JOYSTICK */
export function joystick() {
  const g = new THREE.Group();
  g.add(at(box(1.9, 0.22, 2.1, 0x23262e, { r: 0.1 }), 0, 0.11, 0));
  g.add(at(box(1.7, 0.02, 1.9, 0x2f3440, { r: 0.05 }), 0, 0.225, 0));
  [[-0.5, 0xd8333a], [0, 0x2f6fe4], [0.5, 0xf2c94c]].forEach(([x, c]) =>
    g.add(at(cyl(0.1, 0.1, 0.05, c), x, 0.25, 0.8)));
  // tuas throttle
  g.add(at(box(0.2, 0.04, 0.9, C.black, { r: 0.01 }), -0.7, 0.24, -0.1));
  g.add(at(box(0.28, 0.4, 0.2, 0x3a3f4b, { r: 0.04 }), -0.7, 0.42, -0.3, -0.3, 0, 0));

  const stick = new THREE.Group();
  stick.position.set(0.1, 0.22, 0);
  stick.rotation.set(-0.12, 0, -0.08);
  stick.add(at(cyl(0.12, 0.32, 0.35, 0x15171c, { seg: 32 }), 0, 0.17, 0));
  stick.add(at(cyl(0.1, 0.1, 0.5, 0x7d8490, { metalness: 0.9, roughness: 0.3 }), 0, 0.55, 0));
  stick.add(at(new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 0.75, 8, 24), mat(0x2b2f38, { roughness: 0.5 })), 0, 1.25, 0));
  stick.add(at(box(0.09, 0.3, 0.14, C.orange, { r: 0.03 }), 0, 1.25, 0.24));
  stick.add(at(cyl(0.075, 0.075, 0.05, 0xd8333a, { seg: 24 }), 0, 1.84, 0));
  stick.add(at(cyl(0.06, 0.06, 0.04, 0xd9dde3, { seg: 24 }), 0.1, 1.7, 0.1, 0.5));
  g.add(stick);
  const parts = [
    part('Tuas kendali', 'Digerakkan ke segala arah untuk mengarahkan pesawat atau karakter dalam game.', toRoot(stick, [0, 0.6, 0.15])),
    part('Tombol atas', 'Tombol tembak atau aksi cepat yang ditekan dengan ibu jari.', toRoot(stick, [0, 1.95, 0])),
    part('Pemicu (trigger)', 'Ditekan dengan jari telunjuk, biasanya untuk menembak.', toRoot(stick, [0, 1.25, 0.4])),
    part('Tuas throttle', 'Mengatur tenaga mesin pada game simulasi penerbangan.', [-0.7, 0.75, -0.3]),
    part('Alas', 'Dasar yang berat agar joystick tidak bergeser saat dimainkan.', [0.7, 0.3, 0.9]),
  ];
  return { group: g, parts, view: [0.9, 0.5, 1.0] };
}

/* ------------------------------------------------------------------ MICROPHONE */
export function microphone() {
  const g = new THREE.Group();
  const mesh = canvasTex(256, 256, (ctx, w, h) => {
    ctx.fillStyle = '#2a2e36';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = '#a7aeb9';
    ctx.lineWidth = 6;
    for (let i = -h; i < w + h; i += 32) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + h, h);
      ctx.moveTo(i + h, 0);
      ctx.lineTo(i, h);
      ctx.stroke();
    }
  });
  mesh.wrapS = THREE.RepeatWrapping;
  mesh.wrapT = THREE.RepeatWrapping;
  const grille = (geo, rx, ry) => {
    const t = mesh.clone();
    t.repeat.set(rx, ry);
    t.needsUpdate = true;
    return new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: t, metalness: 0.6, roughness: 0.4 }));
  };
  g.add(at(cyl(0.8, 0.85, 0.12, 0x2a2e36, { seg: 48 }), 0, 0.06, 0));
  g.add(at(cyl(0.08, 0.08, 1.3, 0x3a3f4b, { metalness: 0.7 }), 0, 0.76, 0));
  g.add(at(box(1.0, 0.1, 0.16, 0x3a3f4b, { r: 0.03 }), 0, 1.4, 0));
  g.add(at(grille(new THREE.CylinderGeometry(0.34, 0.34, 1.0, 40, 1, true), 4, 3), 0, 1.95, 0));
  g.add(at(grille(new THREE.SphereGeometry(0.34, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2), 4, 1.5), 0, 2.45, 0));
  g.add(at(cyl(0.35, 0.35, 0.14, C.orange, { seg: 40 }), 0, 1.5, 0));
  g.add(at(cyl(0.35, 0.35, 0.1, 0x15171c, { seg: 40 }), 0, 2.46, 0));
  g.add(at(box(0.05, 1.0, 0.1, 0x3a3f4b, { r: 0.02 }), -0.55, 1.95, 0));
  g.add(at(box(0.05, 1.0, 0.1, 0x3a3f4b, { r: 0.02 }), 0.55, 1.95, 0));
  g.add(at(cyl(0.06, 0.06, 0.06, 0xd9dde3, { seg: 24 }), -0.55, 1.95, 0, 0, 0, Math.PI / 2));
  const parts = [
    part('Kepala mikrofon (grill)', 'Jaring pelindung agar kapsul di dalamnya aman dari debu dan semburan napas.', [0, 2.6, 0.45]),
    part('Kapsul', 'Di dalam badan mikrofon ada membran tipis yang bergetar saat terkena suara.', [0, 1.95, 0.45]),
    part('Penyangga', 'Tiang penyangga agar mikrofon berdiri tegak di atas meja.', [0, 0.8, 0.1]),
    part('Alas', 'Dasar berat yang menjaga mikrofon stabil.', [0, 0.15, 0.9]),
  ];
  return { group: g, parts, view: [0.7, 0.35, 1.0] };
}

