import * as THREE from 'three';
import {
  C, box, cyl, torus, at, spin, textPlate, part,
} from './helpers.js';

/** Cakram optik: lubang tengah, hub bening, sisi data berpelangi. */
export function discMesh(r = 1) {
  const g = new THREE.Group();
  const shape = new THREE.Shape();
  shape.absarc(0, 0, r, 0, Math.PI * 2, false);
  const hole = new THREE.Path();
  hole.absarc(0, 0, r * 0.14, 0, Math.PI * 2, true);
  shape.holes.push(hole);
  const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.025, bevelEnabled: false, curveSegments: 72 });
  geo.rotateX(-Math.PI / 2);
  geo.translate(0, -0.0125, 0);
  g.add(new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({
    color: 0xdfe6ee, metalness: 1, roughness: 0.18, iridescence: 1, iridescenceIOR: 1.7,
    iridescenceThicknessRange: [200, 800], envMapIntensity: 1.3,
  })));
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(r * 0.14, r * 0.3, 64),
    new THREE.MeshStandardMaterial({ color: 0xf5f7fa, transparent: true, opacity: 0.45, roughness: 0.2, side: THREE.DoubleSide }),
  );
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.015;
  ring.userData.noOcclude = true;
  g.add(ring);
  return g;
}

/* ------------------------------------------------------------------------ HDD */
export function hardDrive() {
  const g = new THREE.Group();
  g.add(box(1.6, 0.22, 2.2, 0x9ba2ad, { r: 0.06, metalness: 0.8, roughness: 0.35 }));
  g.add(at(box(1.46, 0.02, 2.06, 0x2e333b, { r: 0.02, roughness: 0.6 }), 0, 0.115, 0));

  const platter = at(cyl(0.72, 0.72, 0.03, 0xdfe4ea, { metalness: 1, roughness: 0.12, seg: 64 }), 0, 0.14, -0.1);
  spin(platter, 'y', 2.5);
  g.add(platter);
  g.add(at(cyl(0.22, 0.22, 0.06, 0x7d8490, { metalness: 0.9, roughness: 0.3 }), 0, 0.165, -0.1));
  g.add(at(cyl(0.07, 0.07, 0.07, 0x3a3f4b, { metalness: 0.9 }), 0, 0.2, -0.1));

  // lengan baca/tulis
  const arm = new THREE.Group();
  arm.position.set(0.62, 0.15, 0.8);
  arm.rotation.y = Math.atan2(-0.35, -0.9);
  arm.add(cyl(0.1, 0.1, 0.08, 0x3a3f4b, { metalness: 0.9, roughness: 0.3 }));
  arm.add(at(box(0.1, 0.025, 0.75, 0xc5cad2, { r: 0.01, metalness: 0.9, roughness: 0.3 }), 0, 0.02, 0.375));
  arm.add(at(box(0.09, 0.03, 0.14, 0x2a2e36, { r: 0.01 }), 0, 0.02, 0.78));
  arm.add(at(box(0.3, 0.06, 0.3, 0x2a2e36, { r: 0.02 }), 0, 0.03, -0.2));
  g.add(arm);

  // baut + konektor SATA
  [[-0.72, -1.0], [0.72, -1.0], [-0.72, 1.0], [0.72, 1.0]].forEach(([x, z]) =>
    g.add(at(cyl(0.05, 0.05, 0.03, C.silver, { metalness: 0.9, roughness: 0.3 }), x, 0.125, z)));
  g.add(at(box(1.2, 0.12, 0.25, C.black, { r: 0.015 }), 0, -0.02, -1.22));
  [-0.4, 0.4].forEach((x) => g.add(at(box(0.5, 0.02, 0.2, C.gold, { r: 0, metalness: 0.8 }), x, 0.045, -1.22)));

  const parts = [
    part('Platter (piringan)', 'Piringan logam berlapis magnet tempat data disimpan. Berputar ribuan kali per menit.', [-0.45, 0.28, -0.45]),
    part('Lengan baca/tulis', 'Lengan dengan kepala kecil yang melayang di atas piringan untuk membaca dan menulis data.', [0.35, 0.28, 0.1]),
    part('Spindle (poros)', 'Motor di tengah yang memutar piringan.', [0, 0.32, -0.1]),
    part('Konektor SATA', 'Colokan data dan daya untuk disambungkan ke motherboard dan power supply.', [0, 0.18, -1.45]),
    part('Rumah logam', 'Casing aluminium yang menjaga bagian dalam tetap bersih dari debu.', [-0.75, 0.2, 0.7]),
  ];
  return { group: g, parts, view: [0.6, 1.2, 0.9] };
}

/* ------------------------------------------------------------------------ SSD */
export function ssd() {
  const g = new THREE.Group();
  g.add(box(1.45, 0.16, 2.0, 0x2b2f38, { r: 0.07, metalness: 0.7, roughness: 0.4 }));
  g.add(at(box(1.45, 0.17, 0.12, C.orange, { r: 0.02, roughness: 0.4 }), 0, 0, 0.88));
  g.add(at(textPlate('SSD', 1.1, 0.6, { fg: '#f2f4f7', sub: '512 GB · SATA' }), 0, 0.082, -0.1, -Math.PI / 2));
  g.add(at(box(1.1, 0.1, 0.2, C.black, { r: 0.015 }), 0, -0.02, -1.1));
  [-0.4, 0.4].forEach((x) => g.add(at(box(0.5, 0.02, 0.18, C.gold, { r: 0, metalness: 0.8 }), x, 0.035, -1.1)));
  [[-0.62, -0.88], [0.62, -0.88], [-0.62, 0.88], [0.62, 0.88]].forEach(([x, z]) =>
    g.add(at(cyl(0.035, 0.035, 0.02, C.silver, { metalness: 0.9 }), x, 0.085, z)));
  const parts = [
    part('Casing logam', 'Rumah logam yang melindungi chip memori flash di dalamnya. Tidak ada bagian yang bergerak.', [-0.5, 0.18, 0.5]),
    part('Label kapasitas', 'Menunjukkan kapasitas dan jenis koneksi (SATA).', [0, 0.18, -0.1]),
    part('Konektor SATA', 'Colokan data dan daya, sama seperti pada HDD.', [0, 0.1, -1.3]),
  ];
  return { group: g, parts, view: [0.7, 1.0, 0.9] };
}

/* -------------------------------------------------------------- OPTICAL DRIVE */
export function opticalDrive() {
  const g = new THREE.Group();
  g.add(box(2.1, 0.5, 3.0, 0xb8bec7, { r: 0.04, metalness: 0.8, roughness: 0.35 }));
  g.add(at(box(2.1, 0.5, 0.08, 0x2a2e36, { r: 0.02 }), 0, 0, 1.54));
  g.add(at(box(1.9, 0.05, 1.7, 0x1a1c21, { r: 0.015 }), 0, -0.05, 2.3));
  g.add(at(cyl(0.82, 0.82, 0.012, 0x2a2e36, { seg: 64 }), 0, -0.02, 2.3));
  const disc = at(discMesh(0.75), 0, 0.03, 2.3);
  spin(disc, 'y', 0.9);
  g.add(disc);
  g.add(at(cyl(0.12, 0.12, 0.05, 0x7d8490, { metalness: 0.9 }), 0, 0.035, 2.3));
  g.add(at(box(0.28, 0.1, 0.05, 0xd9dde3, { r: 0.01 }), 0.75, -0.12, 1.6));
  g.add(at(cyl(0.03, 0.03, 0.03, 0x39c46b, { emissive: 0x39c46b, emissiveIntensity: 0.8 }), 0.35, -0.12, 1.59, Math.PI / 2));
  g.add(at(textPlate('DVD-RW', 1.2, 0.5, { fg: '#2a2e36', bg: '#e9edf2', sub: '16X · SATA' }), -0.4, 0.252, -0.4, -Math.PI / 2));
  const parts = [
    part('Baki (tray)', 'Baki yang keluar-masuk untuk menaruh cakram CD/DVD.', [0.9, 0.2, 2.9]),
    part('Cakram (disc)', 'Cakram berputar cepat sambil dibaca oleh sinar laser.', [0, 0.25, 2.3]),
    part('Tombol eject', 'Ditekan untuk membuka atau menutup baki.', [0.75, -0.02, 1.7]),
    part('Lampu indikator', 'Menyala atau berkedip saat drive sedang membaca data.', [0.35, 0.05, 1.7]),
  ];
  return { group: g, parts, view: [0.8, 0.9, 1.0] };
}

/* -------------------------------------------------------------------- CD / DVD */
export function cdDvd() {
  const g = new THREE.Group();
  const d = discMesh(1.3);
  spin(d, 'y', 0.6);
  g.add(d);
  const parts = [
    part('Lubang tengah', 'Tempat poros motor drive menjepit cakram agar berputar stabil.', [0, 0.12, 0]),
    part('Hub bening', 'Area transparan di tengah untuk pegangan; tidak berisi data.', [0.3, 0.12, 0.2]),
    part('Sisi data', 'Berisi jalur pit mikroskopis yang dibaca laser. Warna pelangi berasal dari pantulan cahaya.', [0.85, 0.12, 0.55]),
  ];
  return { group: g, parts, view: [0.4, 1.1, 0.9] };
}

/* ----------------------------------------------------------------- FLOPPY DISK */
export function floppyDisk() {
  const g = new THREE.Group();
  g.add(box(2.4, 0.09, 2.5, 0x2c4f9e, { r: 0.04, roughness: 0.5 }));
  g.add(at(box(0.85, 0.1, 0.8, 0xc9ced6, { r: 0.015, metalness: 0.9, roughness: 0.3 }), 0.3, 0, -0.82));
  g.add(at(box(0.28, 0.105, 0.5, C.black, { r: 0.01 }), 0.45, 0, -0.82));
  g.add(at(textPlate('MY FILES', 1.8, 0.95, { bg: '#f6f7fa', fg: '#1d3557', sub: '3.5" · 1.44 MB' }), 0, 0.046, 0.65, -Math.PI / 2));
  g.add(at(box(0.18, 0.095, 0.18, 0x111111, { r: 0.01 }), 1.0, 0, 1.0));
  g.add(at(box(0.12, 0.1, 0.1, C.orange, { r: 0.01 }), 1.0, 0, 1.03));
  g.add(at(cyl(0.3, 0.3, 0.095, 0xb7bcc5, { metalness: 0.9, roughness: 0.3 }), 0, 0, -0.1));
  const parts = [
    part('Shutter logam', 'Penutup geser yang melindungi piringan magnet. Terbuka otomatis saat dimasukkan ke drive.', [0.3, 0.14, -0.82]),
    part('Label', 'Tempat menulis nama atau isi disket.', [0, 0.14, 0.65]),
    part('Tab proteksi tulis', 'Digeser agar data tidak bisa terhapus atau tertimpa.', [1.0, 0.14, 1.0]),
    part('Hub logam', 'Ada di sisi bawah. Dijepit motor drive untuk memutar piringan di dalamnya.', [0, -0.16, -0.1]),
  ];
  return { group: g, parts, view: [0.4, 1.1, 0.7] };
}

/* ----------------------------------------------------------------- FLASH DRIVE */
export function flashDrive() {
  const g = new THREE.Group();
  g.add(at(box(0.75, 0.26, 1.6, 0x2a6fe0, { r: 0.1, roughness: 0.35 }), 0, 0, 0.3));
  g.add(at(box(0.7, 0.2, 0.9, 0xcfd4db, { r: 0.02, metalness: 0.95, roughness: 0.25 }), 0, 0, -0.9));
  g.add(at(box(0.6, 0.12, 0.02, 0x0e0f12, { r: 0 }), 0, 0, -1.355));
  [-0.18, -0.06, 0.06, 0.18].forEach((x) => g.add(at(box(0.05, 0.03, 0.015, C.gold, { r: 0, metalness: 0.9 }), x, -0.02, -1.36)));
  g.add(at(textPlate('32GB', 0.55, 0.3, { fg: '#ffffff' }), 0, 0.131, 0.35, -Math.PI / 2));
  g.add(at(cyl(0.045, 0.045, 0.02, 0xffffff, { emissive: 0xaad4ff, emissiveIntensity: 0.9 }), 0, 0.135, 0.85));
  g.add(at(torus(0.15, 0.035, 0xcfd4db, { metalness: 0.9, roughness: 0.3 }), 0, 0, 1.28, Math.PI / 2));
  const parts = [
    part('Konektor USB', 'Bagian logam yang dicolokkan ke port USB komputer.', [0, 0.28, -1.15]),
    part('Bodi plastik', 'Di dalamnya ada chip memori flash dan chip pengendali kecil.', [0, 0.28, 0.35]),
    part('Lampu LED', 'Berkedip saat data sedang dibaca atau ditulis.', [0, 0.28, 0.85]),
    part('Lubang tali', 'Tempat memasang gantungan kunci atau tali agar tidak hilang.', [0, 0.28, 1.45]),
  ];
  return { group: g, parts, view: [0.9, 1.0, 0.8] };
}

