import * as THREE from 'three';
import {
  C, box, cyl, sphere, mat, tube, at, textPlate, part,
} from './helpers.js';

/*
 * Konektor (plug) + potongan kabel. Sumbu colokan = z: ujung konektor di +z,
 * kabel keluar ke -z. Ukuran tidak persis skala asli, tetapi bentuknya meniru aslinya.
 */

const HALF_PI = Math.PI / 2;
const METAL = { metalness: 0.9, roughness: 0.3 };
const GOLD = { metalness: 0.9, roughness: 0.25 };
const INK = 0x1b1d22;

const poly = (pts) => {
  const s = new THREE.Shape();
  pts.forEach(([x, y], i) => (i ? s.lineTo(x, y) : s.moveTo(x, y)));
  s.closePath();
  return s;
};

const extrude = (shape, depth, z0, color, o) => {
  const geo = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 12 });
  geo.translate(0, 0, z0);
  return new THREE.Mesh(geo, mat(color, o));
};

const size = (pts) => {
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  return [Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)];
};

/** Selubung logam berongga mengikuti bentuk `pts`, membentang dari z0 sejauh depth. */
function shell(pts, wall, depth, z0, color = C.silver) {
  const [w, h] = size(pts);
  const s = poly(pts);
  s.holes.push(poly(pts.map(([x, y]) => [x * (w - 2 * wall) / w, y * (h - 2 * wall) / h])));
  return extrude(s, depth, z0, color, METAL);
}

/** Balok padat berbentuk `pts` (isian plastik di dalam selubung). */
const fill = (pts, scale, depth, z0, color) =>
  extrude(poly(pts.map(([x, y]) => [x * scale[0], y * scale[1]])), depth, z0, color, { roughness: 0.6 });

/** Lingkaran lonjong (stadium) untuk USB-C. */
function stadium(w, h, n = 10) {
  const r = h / 2;
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const a = -HALF_PI + (Math.PI * i) / n;
    pts.push([w / 2 - r + r * Math.cos(a), r * Math.sin(a)]);
  }
  for (let i = 0; i <= n; i++) {
    const a = HALF_PI + (Math.PI * i) / n;
    pts.push([-(w / 2 - r) + r * Math.cos(a), r * Math.sin(a)]);
  }
  return pts;
}

/** Deretan n kontak emas melintang selebar `span`, di ketinggian y. */
function contacts(n, span, y, z, len, thick = 0.02, wide = 0.05) {
  const g = new THREE.Group();
  for (let i = 0; i < n; i++) {
    const x = n === 1 ? 0 : (i / (n - 1) - 0.5) * span;
    g.add(at(box(wide, thick, len, C.gold, { r: 0, ...GOLD }), x, y, z));
  }
  return g;
}

/** Bodi plastik (overmold) di belakang selubung. */
const body = (w, h, len, z, color = INK, r = 0.1) =>
  at(box(w, h, len, color, { r, roughness: 0.55 }), 0, 0, z);

/** Karet pelindung kabel (makin ke belakang makin kecil) dan kabelnya. */
function tail(z, w, h, color = INK, r = 0.1) {
  const g = new THREE.Group();
  g.add(at(cyl(Math.min(w, h) * 0.38, r * 1.15, 0.5, color, { roughness: 0.7 }), 0, 0, z - 0.25, HALF_PI));
  g.add(tube([[0, 0, z - 0.45], [0, 0, z - 0.9], [0.25, -0.05, z - 1.4], [0.7, -0.2, z - 1.8]], r, color, { roughness: 0.65 }));
  return g;
}

/* ------------------------------------------------------------------------ VGA */
export function vga() {
  const blue = 0x2f6fe4;
  const outline = [[-0.6, 0.21], [0.6, 0.21], [0.51, -0.21], [-0.51, -0.21]];
  const g = new THREE.Group();
  g.add(body(1.9, 0.62, 0.9, -0.3, blue, 0.12));
  g.add(at(box(1.75, 0.5, 0.06, C.silver, { r: 0.02, ...METAL }), 0, 0, 0.18));
  [-0.82, 0.82].forEach((x) => {
    g.add(at(cyl(0.065, 0.065, 0.6, C.silver, { seg: 16, ...METAL }), x, 0, 0.45, HALF_PI));
    g.add(at(cyl(0.11, 0.11, 0.25, blue, { seg: 20, roughness: 0.4 }), x, 0, 0.12, HALF_PI));
  });
  g.add(shell(outline, 0.04, 0.55, 0.18));
  g.add(fill(outline, [0.92, 0.88], 0.38, 0.18, 0x274eb0));
  [[0.12, 0], [0, 0.085], [-0.12, 0]].forEach(([y, off]) => {
    for (let i = 0; i < 5; i++) {
      g.add(at(cyl(0.022, 0.022, 0.2, C.gold, { seg: 10, ...GOLD }), (i - 2) * 0.17 + off, y, 0.6, HALF_PI));
    }
  });
  g.add(tail(-0.75, 1.9, 0.62, blue, 0.11));
  const parts = [
    part('Konektor D-sub 15 pin', 'Tiga baris pin berbentuk huruf D, jadi hanya bisa dicolok satu arah.', [0, 0.3, 0.7]),
    part('Pin sinyal', '15 pin membawa sinyal merah, hijau, dan biru (RGB) analog beserta pengatur sinkronisasi.', [0.25, 0.22, 0.72]),
    part('Baut pengunci', 'Dikencangkan dengan tangan agar konektor tidak lepas sendiri.', [0.9, 0.2, 0.35]),
    part('Rumah konektor', 'Biasanya berwarna biru, tempat kabel dijepit dan dilindungi.', [0, 0.4, -0.3]),
    part('Kabel', 'Kabel VGA yang berkualitas punya inti ferit (tabung kecil) untuk meredam gangguan.', [0.65, 0.2, -2.5]),
  ];
  return { group: g, parts, view: [0.9, 0.7, 1.1] };
}

/* ----------------------------------------------------------------------- HDMI */
export function hdmi() {
  const outline = [[-0.7, 0.225], [0.7, 0.225], [0.7, 0], [0.58, -0.225], [-0.58, -0.225], [-0.7, 0]];
  const g = new THREE.Group();
  g.add(shell(outline, 0.035, 0.8, 0.2, 0xd4af37));
  g.add(at(box(1.1, 0.07, 0.65, 0x2a2d35, { r: 0.01 }), 0, 0, 0.55));
  g.add(contacts(10, 1.1, 0.045, 0.75, 0.3, 0.016, 0.05));
  g.add(contacts(9, 1.0, -0.045, 0.75, 0.3, 0.016, 0.05));
  g.add(body(1.6, 0.62, 1.0, -0.3, INK, 0.1));
  g.add(at(box(1.25, 0.05, 0.5, C.metal, { r: 0.01, ...METAL }), 0, 0.31, -0.3));
  g.add(tail(-0.8, 1.6, 0.62, INK, 0.1));
  const parts = [
    part('Konektor Type A', 'Ukuran standar HDMI. Dua sudut bawahnya miring agar tidak terbalik.', [0, 0.32, 0.9]),
    part('19 kontak emas', 'Membawa gambar, suara, dan perintah antar-perangkat dalam satu kabel.', [0, 0.22, 0.95]),
    part('Selubung berlapis emas', 'Tahan karat sehingga sambungan tetap bersih meski sering dicolok.', [0.75, 0.1, 0.6]),
    part('Bodi konektor', 'Tempat kabel dan pelindung. Bodi yang tebal biasanya tahan tekukan.', [0, 0.4, -0.3]),
    part('Kabel', 'Satu kabel untuk gambar dan suara, dipakai TV, proyektor, konsol game, dan laptop.', [0.65, 0.25, -2.5]),
  ];
  return { group: g, parts, view: [0.9, 0.7, 1.1] };
}

/* ---------------------------------------------------------------- DisplayPort */
export function displayPort() {
  const outline = [[-0.75, 0.225], [0.57, 0.225], [0.75, 0.04], [0.75, -0.225], [-0.75, -0.225]];
  const g = new THREE.Group();
  g.add(shell(outline, 0.035, 0.8, 0.2, C.silver));
  g.add(at(box(1.2, 0.07, 0.65, 0x2a2d35, { r: 0.01 }), 0, 0, 0.55));
  g.add(contacts(10, 1.2, 0.045, 0.75, 0.3, 0.016, 0.05));
  g.add(contacts(10, 1.2, -0.045, 0.75, 0.3, 0.016, 0.05));
  g.add(body(1.7, 0.68, 1.0, -0.3, INK, 0.1));
  g.add(at(box(0.5, 0.06, 0.45, C.metal, { r: 0.02, ...METAL }), 0, 0.3, 0.2));
  g.add(at(box(0.35, 0.09, 0.6, 0x3a3f4b, { r: 0.03 }), 0, 0.37, -0.45));
  g.add(tail(-0.8, 1.7, 0.68, INK, 0.1));
  const parts = [
    part('Konektor DisplayPort', 'Satu sudut dipotong miring (asimetris) sehingga tidak bisa dicolok terbalik.', [0.7, 0.28, 0.9]),
    part('20 kontak', 'Membawa gambar dan suara digital. Mendukung beberapa monitor dalam satu kabel.', [0, 0.22, 0.95]),
    part('Pengunci', 'Kait kecil yang membuat kabel terkunci. Tekan tombol di atas untuk melepas.', [0, 0.38, 0.15]),
    part('Bodi konektor', 'Bagian yang dipegang saat memasang dan melepas kabel.', [0, 0.45, -0.45]),
    part('Kabel', 'Dipakai monitor gaming dan monitor profesional, mampu refresh rate sangat tinggi.', [0.65, 0.25, -2.5]),
  ];
  return { group: g, parts, view: [0.9, 0.7, 1.1] };
}

/* ---------------------------------------------------------------------- USB-A */
export function usbA(variant) {
  const usb3 = variant === 'usb3';
  const outline = [[-0.6, 0.25], [0.6, 0.25], [0.6, -0.25], [-0.6, -0.25]];
  const g = new THREE.Group();
  g.add(shell(outline, 0.035, 0.9, 0.1, C.silver));
  g.add(at(box(1.12, 0.17, 0.7, usb3 ? 0x1e63e0 : 0x23262e, { r: 0.01, roughness: 0.5 }), 0, -0.12, 0.45));
  g.add(contacts(4, 0.9, -0.025, 0.62, 0.34, 0.015, 0.09));
  if (usb3) g.add(contacts(5, 0.8, -0.025, 0.33, 0.12, 0.015, 0.07));
  g.add(body(1.5, 0.78, 1.0, -0.45, usb3 ? 0x1e63e0 : INK, 0.1));
  g.add(at(box(1.0, 0.04, 0.5, 0xffffff, { r: 0.01, roughness: 0.4 }), 0, 0.395, -0.45));
  g.add(tail(-0.95, 1.5, 0.78, INK, 0.1));
  const parts = [
    part('Konektor Type-A', 'Persegi panjang pipih. Hanya bisa dicolok satu arah, sering salah dicoba dua kali.', [0, 0.32, 0.9]),
    part(usb3 ? 'Plastik biru + 9 kontak' : 'Plastik hitam + 4 kontak', usb3
      ? 'Warna biru menandai USB 3.0 ke atas. Ada 5 kontak tambahan untuk kecepatan tinggi.'
      : 'Empat kontak untuk daya (5V), data (D+ dan D-), dan ground. Itulah USB 2.0.', [0, 0.18, 0.55]),
    part('Selubung logam', 'Melindungi kontak dan menahan colokan tetap pada tempatnya.', [0.65, 0.1, 0.5]),
    part('Bodi konektor', 'Tempat memegang colokan. Warnanya sering dipakai sebagai petunjuk versi.', [0, 0.45, -0.45]),
    part('Kabel', 'Dipakai untuk mouse, keyboard, flash drive, printer, dan banyak lagi.', [0.65, 0.25, -2.7]),
  ];
  return { group: g, parts, view: [0.9, 0.7, 1.1] };
}

/* ---------------------------------------------------------------------- USB-B */
export function usbB() {
  const outline = [[-0.5, 0.3], [-0.32, 0.5], [0.32, 0.5], [0.5, 0.3], [0.5, -0.5], [-0.5, -0.5]];
  const g = new THREE.Group();
  g.add(shell(outline, 0.04, 0.85, 0.15, C.silver));
  g.add(fill(outline, [0.78, 0.78], 0.4, 0.15, 0x25272d));
  [-0.36, -0.12, 0.12, 0.36].forEach((x) => g.add(at(box(0.1, 0.1, 0.18, C.gold, { r: 0, ...GOLD }), x, -0.2, 0.58)));
  g.add(body(1.3, 1.3, 1.0, -0.4, INK, 0.14));
  g.add(at(box(0.7, 0.04, 0.5, 0xffffff, { r: 0.01, roughness: 0.4 }), 0, 0.652, -0.4));
  g.add(tail(-0.9, 1.3, 1.3, INK, 0.12));
  const parts = [
    part('Konektor Type-B', 'Bentuk hampir persegi dengan dua sudut atas dipotong. Disebut colokan printer.', [0, 0.55, 0.85]),
    part('4 kontak', 'Daya, data, dan ground, sama seperti USB-A pada USB 2.0.', [0.15, -0.2, 0.7]),
    part('Selubung logam', 'Memastikan colokan masuk pas dan sambungannya kuat.', [0.55, 0, 0.5]),
    part('Bodi konektor', 'Bodi besar agar mudah dicolok pada perangkat yang tidak sering dipindah.', [0, 0.68, -0.4]),
    part('Kabel', 'Dipakai pada printer, scanner, dan perangkat besar yang colokannya jarang dilepas.', [0.65, 0.3, -2.7]),
  ];
  return { group: g, parts, view: [0.9, 0.7, 1.1] };
}

/* ---------------------------------------------------------------------- USB-C */
export function usbC() {
  const outline = stadium(1.4, 0.46);
  const g = new THREE.Group();
  g.add(shell(outline, 0.035, 0.8, 0.2, C.silver));
  g.add(at(box(1.1, 0.07, 0.7, 0x2a2d35, { r: 0.01 }), 0, 0, 0.55));
  g.add(contacts(12, 1.0, 0.04, 0.8, 0.2, 0.012, 0.045));
  g.add(contacts(12, 1.0, -0.04, 0.8, 0.2, 0.012, 0.045));
  g.add(body(1.75, 0.72, 1.0, -0.3, 0xd6dae0, 0.18));
  g.add(at(textPlate('USB-C', 0.95, 0.32, { fg: '#222' }), 0, 0.363, -0.3, -HALF_PI));
  g.add(tail(-0.8, 1.75, 0.72, 0x2a2d35, 0.1));
  const parts = [
    part('Konektor Type-C', 'Berbentuk lonjong dan simetris, jadi bisa dicolok dari sisi mana saja.', [0, 0.3, 0.9]),
    part('24 pin dua sisi', 'Kontak di atas dan bawah kembar, itulah sebabnya tidak ada sisi yang salah.', [0, 0.1, 0.98]),
    part('Lidah tengah', 'Pelat tipis di tengah yang menopang kontak-kontaknya.', [0, 0.1, 0.5]),
    part('Bodi konektor', 'Chip kecil di dalamnya bisa mengatur daya dan mode (data, video, charger).', [0, 0.4, -0.3]),
    part('Kabel', 'Satu kabel untuk data, video, dan pengisian daya laptop sampai 240W.', [0.65, 0.25, -2.5]),
  ];
  return { group: g, parts, view: [0.9, 0.7, 1.1] };
}

/* ------------------------------------------------------------------ Micro-USB */
export function microUsb() {
  const outline = [[-0.5, 0.18], [0.5, 0.18], [0.5, -0.03], [0.33, -0.18], [-0.33, -0.18], [-0.5, -0.03]];
  const g = new THREE.Group();
  g.add(shell(outline, 0.03, 0.7, 0.25, C.silver));
  g.add(at(box(0.8, 0.06, 0.5, 0x2a2d35, { r: 0.01 }), 0, 0, 0.6));
  g.add(contacts(5, 0.62, 0.035, 0.75, 0.2, 0.012, 0.06));
  g.add(body(1.3, 0.62, 0.8, -0.15, INK, 0.1));
  g.add(tail(-0.55, 1.3, 0.62, INK, 0.08));
  const parts = [
    part('Konektor Micro-B', 'Kecil dan pipih dengan dua sudut bawah dimiringkan agar tidak terbalik.', [0, 0.25, 0.9]),
    part('5 pin', 'Daya, data (D+ dan D-), ground, dan satu pin ID untuk fungsi OTG.', [0, 0.14, 0.95]),
    part('Selubung logam', 'Menjaga konektor tetap kuat, tetapi sering aus karena terlalu sering dicolok.', [0.55, 0, 0.5]),
    part('Bodi konektor', 'Bodi plastik yang menopang kabel tipis.', [0, 0.35, -0.15]),
    part('Kabel', 'Dulu standar pengisi daya ponsel Android dan banyak gadget kecil.', [0.5, 0.2, -2.0]),
  ];
  return { group: g, parts, view: [0.9, 0.7, 1.1] };
}

/* ----------------------------------------------------------------------- RJ45 */
const T568A = [0xb7e6bf, 0x2faa4a, 0xffd1a0, 0x2b5fd6, 0xb5cdf5, 0xff8a1a, 0xcfae94, 0x6b3f21];
const T568B = [0xffd1a0, 0xff8a1a, 0xb7e6bf, 0x2b5fd6, 0xb5cdf5, 0x2faa4a, 0xcfae94, 0x6b3f21];

export function rj45(variant) {
  const order = variant === 't568a' ? T568A : T568B;
  const g = new THREE.Group();
  g.add(at(box(1.1, 0.85, 1.3, 0xdfeaf2, { r: 0.05, transparent: true, opacity: 0.4, roughness: 0.15 }), 0, 0, 0));
  g.add(contacts(8, 0.84, 0.435, 0.35, 0.4, 0.02, 0.07));
  order.forEach((c, i) => {
    g.add(at(cyl(0.04, 0.04, 1.4, c, { seg: 10, roughness: 0.5 }), (i - 3.5) * 0.12, 0.05, -0.05, HALF_PI));
  });
  g.add(at(box(0.55, 0.05, 0.9, 0xdfeaf2, { r: 0.01, transparent: true, opacity: 0.6, roughness: 0.15 }), 0, -0.52, 0.05, 0.12));
  g.add(at(box(0.55, 0.14, 0.05, 0xdfeaf2, { r: 0.01, transparent: true, opacity: 0.6, roughness: 0.15 }), 0, -0.45, 0.5));
  g.add(at(cyl(0.34, 0.26, 0.5, 0xdfeaf2, { seg: 28, transparent: true, opacity: 0.55, roughness: 0.2 }), 0, 0, -0.9, HALF_PI));
  g.add(tube([[0, 0, -1.0], [0, 0, -1.4], [0.25, -0.05, -1.9], [0.7, -0.2, -2.3]], 0.2, 0x3a6fd8, { roughness: 0.6 }));
  const parts = [
    part('Kontak emas (8P8C)', 'Delapan kontak untuk delapan kawat. Karena itu konektor ini disebut 8P8C.', [0, 0.47, 0.5]),
    part('Delapan kawat', 'Empat pasang kawat yang dipilin, warnanya mengikuti standar T568A atau T568B.', [0, 0.1, -0.3]),
    part('Tab pengunci', 'Kait plastik yang berbunyi "klik" saat dicolok. Tekan untuk melepasnya.', [0, -0.62, 0.1]),
    part('Bodi transparan', 'Bening agar urutan warna kawat terlihat jelas saat dicek.', [0.55, 0.1, 0.3]),
    part('Jaket kabel', 'Selubung luar yang menyatukan keempat pasang kawat.', [0.4, -0.15, -2.1]),
  ];
  return { group: g, parts, view: [0.9, 0.9, 1.1] };
}

/* ------------------------------------------------------------- Jack audio 3,5 mm */
export function audioJack() {
  const g = new THREE.Group();
  const R = 0.15;
  const ring = (len, z, c = C.silver) => at(cyl(R, R, len, c, { seg: 28, ...METAL }), 0, 0, z, HALF_PI);
  const dark = (z) => at(cyl(R, R, 0.06, 0x15171c, { seg: 28, roughness: 0.6 }), 0, 0, z, HALF_PI);
  g.add(at(sphere(R, C.silver, { seg: 28, sz: 0.9, ...METAL }), 0, 0, 1.27));
  g.add(ring(0.3, 1.12), dark(0.94), ring(0.22, 0.8), dark(0.66), ring(0.22, 0.52), dark(0.38), ring(0.3, 0.2));
  g.add(at(cyl(0.3, 0.3, 0.9, 0x2ea76a, { seg: 32, roughness: 0.45 }), 0, 0, -0.3, HALF_PI));
  [-0.5, -0.3, -0.1].forEach((z) => g.add(at(cyl(0.315, 0.315, 0.04, 0x1f7f50, { seg: 32 }), 0, 0, z, HALF_PI)));
  g.add(at(cyl(0.17, 0.3, 0.45, 0x1f7f50, { seg: 28, roughness: 0.6 }), 0, 0, -0.97, HALF_PI));
  g.add(tube([[0, 0, -1.15], [0, 0, -1.6], [0.25, -0.05, -2.1], [0.7, -0.2, -2.5]], 0.07, 0x1f7f50, { roughness: 0.65 }));
  const parts = [
    part('Ujung (Tip)', 'Pembawa sinyal suara kiri.', [0, 0.2, 1.3]),
    part('Cincin (Ring)', 'Pada plug TRS/TRRS, cincin membawa suara kanan dan mikrofon.', [0, 0.17, 0.75]),
    part('Sleeve', 'Bagian paling belakang, dipakai sebagai ground (0 V).', [0, 0.17, 0.2]),
    part('Cincin isolator hitam', 'Memisahkan tiap kontak agar sinyalnya tidak bercampur.', [0, 0.17, 0.66]),
    part('Bodi dan kabel', 'Dipakai headphone, speaker, dan mikrofon. Warna bodi biasanya sama dengan warna port.', [0, 0.35, -0.3]),
  ];
  return { group: g, parts, view: [0.9, 0.7, 1.1] };
}
