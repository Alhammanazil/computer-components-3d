import * as THREE from 'three';
import {
  C, box, cyl, torus, tube, at, group, textPlate, drawPlate, instanced, fanRotor, pcieCard, part,
} from './helpers.js';

/* ---------------------------------------------------------------- MOTHERBOARD */
export function motherboard() {
  const g = new THREE.Group();
  const T = 0.04; // permukaan atas PCB
  g.add(box(3, 0.08, 3, 0x1f2430, { r: 0.03, roughness: 0.5 }));

  // jalur sirkuit (hiasan)
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  g.add(at(drawPlate(2.9, 2.9, (ctx, w, h) => {
    ctx.strokeStyle = 'rgba(90,200,190,0.28)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 60; i++) {
      let x = rnd() * w;
      let y = rnd() * h;
      ctx.beginPath();
      ctx.moveTo(x, y);
      for (let k = 0; k < 3; k++) {
        if (rnd() > 0.5) x += (rnd() - 0.5) * 220; else y += (rnd() - 0.5) * 220;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }, { px: 180 }), 0, T + 0.001, 0, -Math.PI / 2));

  // lubang baut di sudut
  [[-1.38, -1.38], [1.38, -1.38], [-1.38, 1.38], [1.38, 1.38]].forEach(([x, z]) =>
    g.add(at(cyl(0.07, 0.07, 0.03, C.silver, { metalness: 0.9, roughness: 0.3 }), x, T + 0.015, z)));

  // soket CPU
  g.add(at(box(0.9, 0.07, 0.9, 0xbfc4cc, { metalness: 0.7, roughness: 0.35, r: 0.02 }), -0.05, T + 0.035, -0.35));
  g.add(at(drawPlate(0.7, 0.7, (ctx, w, h) => {
    ctx.fillStyle = '#2a2d34';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#d8b24a';
    for (let i = 4; i < 36; i++) {
      for (let j = 4; j < 36; j++) {
        ctx.beginPath();
        ctx.arc((i * w) / 40, (j * h) / 40, 2.2, 0, 7);
        ctx.fill();
      }
    }
  }, { px: 260 }), -0.05, T + 0.072, -0.35, -Math.PI / 2));

  // heatsink VRM (atas & kiri soket)
  const finned = (len, vertical) => {
    const f = new THREE.Group();
    f.add(box(vertical ? 0.3 : len, 0.14, vertical ? len : 0.3, 0x2b2f3a, { r: 0.02, metalness: 0.5 }));
    const n = 12;
    for (let i = 0; i < n; i++) {
      const k = -0.5 + (i + 0.5) / n;
      const fin = vertical
        ? box(0.26, 0.26, 0.03, 0x3b4150, { r: 0.005, metalness: 0.6, roughness: 0.35 })
        : box(0.03, 0.26, 0.26, 0x3b4150, { r: 0.005, metalness: 0.6, roughness: 0.35 });
      f.add(at(fin, vertical ? 0 : k * (len - 0.1), 0.2, vertical ? k * (len - 0.1) : 0));
    }
    return f;
  };
  g.add(at(finned(1.7, false), -0.05, T + 0.07, -1.2));
  g.add(at(finned(1.0, true), -0.8, T + 0.07, -0.35));

  // kapasitor
  for (let i = 0; i < 5; i++) {
    g.add(at(cyl(0.06, 0.06, 0.13, 0x20242c), -0.4 + i * 0.175, T + 0.065, -0.92));
    g.add(at(cyl(0.05, 0.05, 0.01, C.gold, { metalness: 0.8 }), -0.4 + i * 0.175, T + 0.132, -0.92));
  }

  // slot RAM
  [0.85, 1.1].forEach((x) => {
    g.add(at(box(0.14, 0.14, 2.0, 0xd33a3a, { r: 0.02, roughness: 0.4 }), x, T + 0.07, -0.3));
    g.add(at(box(0.04, 0.02, 1.8, 0x1a1a1a, { r: 0 }), x, T + 0.145, -0.3));
    [-1.3, 0.7].forEach((z) => g.add(at(box(0.2, 0.15, 0.08, 0x2a2a2a, { r: 0.01 }), x, T + 0.075, z)));
  });

  // slot PCIe
  g.add(at(box(1.9, 0.12, 0.18, 0x20242c, { r: 0.02 }), -0.15, T + 0.06, 0.8));
  g.add(at(box(1.9, 0.02, 0.06, 0xd9dde3, { r: 0, metalness: 0.7 }), -0.15, T + 0.125, 0.8));
  g.add(at(box(0.9, 0.1, 0.16, 0x20242c, { r: 0.02 }), -0.55, T + 0.05, 1.2));

  // plat M.2
  g.add(at(box(0.9, 0.03, 0.3, 0x7d8490, { r: 0.01, metalness: 0.8, roughness: 0.35 }), -0.2, T + 0.015, 0.42));

  // chipset + kipas kecil
  g.add(at(box(0.6, 0.14, 0.6, 0x9aa1ab, { r: 0.03, metalness: 0.8, roughness: 0.3 }), 0.45, T + 0.07, 1.2));
  g.add(at(fanRotor(0.26, 6, 0x2e3340), 0.45, T + 0.18, 1.2));

  // SATA
  for (let i = 0; i < 4; i++) {
    g.add(at(box(0.3, 0.12, 0.12, 0x15171c, { r: 0.01 }), 1.2, T + 0.06, 0.95 + i * 0.15));
  }

  // baterai CMOS
  g.add(at(cyl(0.17, 0.17, 0.06, C.silver, { metalness: 0.9, roughness: 0.25 }), -1.2, T + 0.03, 1.2));

  // konektor daya 24-pin & 8-pin
  g.add(at(box(0.2, 0.3, 1.0, 0xe8e1cf, { r: 0.015, roughness: 0.7 }), 1.38, T + 0.15, -0.3));
  g.add(at(box(0.45, 0.2, 0.2, 0xe8e1cf, { r: 0.015, roughness: 0.7 }), -1.15, T + 0.1, -1.38));

  // port belakang (I/O)
  [-1.2, -0.9].forEach((z) => [0.13, 0.39].forEach((y) =>
    g.add(at(box(0.5, 0.26, 0.28, 0x2f6fe0, { r: 0.015 }), -1.3, T + y, z))));
  g.add(at(box(0.5, 0.42, 0.4, 0xc3c8d0, { r: 0.015, metalness: 0.8, roughness: 0.35 }), -1.3, T + 0.21, -0.5));
  g.add(at(box(0.4, 0.22, 0.3, 0x20242c, { r: 0.015 }), -1.3, T + 0.11, -0.1));
  [[-0.08, 0x39c46b], [0, 0x3b82f6], [0.08, 0xf472b6]].forEach(([dz, c]) =>
    g.add(at(cyl(0.035, 0.035, 0.08, c), -1.52, T + 0.11, -0.1 + dz, 0, 0, Math.PI / 2)));
  g.add(at(box(0.45, 0.14, 0.3, 0x15171c, { r: 0.01 }), -1.3, T + 0.07, 0.25));

  const parts = [
    part('Soket CPU', 'Tempat memasang prosesor. Ada ribuan titik kontak kecil yang menghubungkan CPU ke papan.', [-0.05, 0.2, -0.35]),
    part('Slot RAM', 'Tempat memasang modul RAM. Dua slot berwarna merah ini bisa diisi dua keping RAM.', [0.85, 0.28, -0.3]),
    part('Slot PCIe', 'Slot panjang untuk kartu tambahan, terutama kartu grafis (VGA).', [-0.15, 0.25, 0.8]),
    part('Port belakang (I/O)', 'Kumpulan colokan: USB, LAN, audio, dan video untuk menyambung perangkat luar.', [-1.3, 0.66, -1.05]),
    part('Chipset + kipas', 'Pengatur lalu lintas data antar komponen. Panasnya didinginkan heatsink dan kipas kecil.', [0.45, 0.4, 1.2]),
    part('Konektor daya 24-pin', 'Colokan dari power supply yang mengalirkan listrik ke seluruh motherboard.', [1.38, 0.4, -0.3]),
    part('Heatsink VRM', 'Sirip logam pendingin untuk modul pengatur tegangan listrik CPU.', [-0.05, 0.55, -1.2]),
    part('Baterai CMOS', 'Baterai kancing kecil yang menjaga jam dan pengaturan BIOS saat komputer mati.', [-1.2, 0.2, 1.2]),
  ];
  return { group: g, parts, view: [0.55, 1.0, 0.95] };
}

/* ------------------------------------------------------------------ PROCESSOR */
export function processor() {
  const g = new THREE.Group();
  g.add(box(1.8, 0.07, 1.8, 0x2c7a5b, { r: 0.03, roughness: 0.5 }));
  g.add(at(box(1.15, 0.11, 1.15, 0xd5dae1, { r: 0.04, metalness: 0.9, roughness: 0.28 }), 0, 0.09, 0));
  g.add(at(textPlate('ZENITH', 0.95, 0.5, { fg: '#3b4a5f', sub: 'Core™ 7' }), 0, 0.147, 0, -Math.PI / 2));

  // komponen SMD di sekitar IHS
  [[-0.75, -0.5], [-0.75, 0.5], [0.75, -0.5], [0.75, 0.5], [-0.3, -0.78], [0.3, -0.78], [-0.3, 0.78], [0.3, 0.78]].forEach(([x, z]) =>
    g.add(at(box(0.1, 0.04, 0.06, 0x3a3328, { r: 0.005 }), x, 0.055, z)));
  // penanda segitiga
  g.add(at(new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.01, 3),
    new THREE.MeshStandardMaterial({ color: C.gold, metalness: 0.8, roughness: 0.3 })), -0.78, 0.04, 0.78));

  // titik kontak emas di sisi bawah
  const items = [];
  const n = 22;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (Math.abs(i - (n - 1) / 2) < 4.5 && Math.abs(j - (n - 1) / 2) < 4.5) continue;
      items.push({ p: [(i - (n - 1) / 2) * 0.072, -0.042, (j - (n - 1) / 2) * 0.072] });
    }
  }
  g.add(instanced(new THREE.CylinderGeometry(0.024, 0.024, 0.012, 10),
    new THREE.MeshStandardMaterial({ color: C.gold, metalness: 0.9, roughness: 0.25 }), items));

  const parts = [
    part('Heat spreader (IHS)', 'Tutup logam yang melindungi chip di dalamnya dan memindahkan panas ke pendingin.', [0, 0.25, 0.4]),
    part('Substrat (PCB)', 'Papan hijau tempat chip dan komponen kecil dipasang.', [0.8, 0.14, -0.78]),
    part('Penanda segitiga', 'Penanda arah supaya CPU dipasang dengan posisi yang benar.', [-0.78, 0.14, 0.78]),
    part('Titik kontak emas', 'Ada di sisi bawah. Titik-titik emas ini menyentuh soket motherboard untuk mengirim data.', [0.55, -0.15, 0.55]),
  ];
  return { group: g, parts, view: [0.7, 1.3, 0.9] };
}

/* ------------------------------------------------------------------------ RAM */
export function ram() {
  const g = new THREE.Group();
  g.add(box(3.2, 0.85, 0.06, 0x2a8a5e, { r: 0.02, roughness: 0.45 }));

  [1, -1].forEach((side) => {
    [-1.2, -0.6, 0.0, 0.6].forEach((x) => {
      g.add(at(box(0.46, 0.34, 0.03, 0x15171c, { r: 0.01, roughness: 0.35 }), x, 0.12, side * 0.05));
    });
  });
  g.add(at(textPlate('RAM', 0.75, 0.5, { bg: '#f4f6f9', fg: '#1d3557', sub: 'DDR4 16GB' }), 1.15, 0.12, 0.032));

  // kontak emas (kecuali di takik)
  const items = [];
  for (let i = 0; i < 60; i++) {
    const x = -1.5 + i * 0.051;
    if (Math.abs(x - 0.35) < 0.07) continue;
    items.push({ p: [x, -0.405, 0.033] }, { p: [x, -0.405, -0.033] });
  }
  g.add(instanced(new THREE.BoxGeometry(0.04, 0.17, 0.008),
    new THREE.MeshStandardMaterial({ color: C.gold, metalness: 0.9, roughness: 0.25 }), items));

  const parts = [
    part('Chip memori', 'Chip hitam tempat data disimpan sementara. Semakin banyak chip, semakin besar kapasitasnya.', [-0.6, 0.12, 0.1]),
    part('Kontak emas', 'Deretan kontak yang masuk ke slot RAM. Emas dipakai karena tahan karat.', [-0.9, -0.42, 0.08]),
    part('Takik (notch)', 'Celah kecil agar RAM tidak terpasang terbalik atau salah jenis.', [0.35, -0.5, 0.0]),
    part('Label spesifikasi', 'Stiker berisi tipe (DDR4) dan kapasitas (16GB) memori.', [1.15, 0.12, 0.1]),
  ];
  return { group: g, parts, view: [0.35, 0.3, 1] };
}

/* ------------------------------------------------------------------ GRAPHICS CARD */
export function graphicsCard() {
  const g = new THREE.Group();
  g.add(pcieCard({ len: 3.6, depth: 1.3, pcb: 0x1b1e24, bracketH: 0.6 }));
  g.add(at(box(3.3, 0.5, 1.25, 0x23262e, { r: 0.06, metalness: 0.3, roughness: 0.4 }), 0.05, 0.28, 0));
  g.add(at(box(3.31, 0.03, 0.05, C.orange, { r: 0, roughness: 0.3 }), 0.05, 0.3, 0.63));
  [-0.85, 0.95].forEach((x) => {
    g.add(at(cyl(0.52, 0.52, 0.03, 0x15171c, { seg: 48 }), x, 0.535, 0));
    g.add(at(torus(0.5, 0.03, 0x3a3f4b, { metalness: 0.4 }), x, 0.55, 0, Math.PI / 2));
    g.add(at(fanRotor(0.47, 9, 0x2e3340), x, 0.57, 0));
  });
  g.add(at(box(0.5, 0.18, 0.3, 0x15171c, { r: 0.02 }), 1.4, 0.62, -0.45));
  [-0.4, 0, 0.4].forEach((z, i) =>
    g.add(at(box(0.1, 0.13, 0.28, i === 1 ? 0x15171c : 0x2a2e36, { r: 0.01 }), -1.9, 0.12, z)));
  const parts = [
    part('Kipas pendingin', 'GPU sangat panas saat bekerja, jadi kipas menghembuskan udara ke heatsink di bawahnya.', [-0.85, 0.72, 0]),
    part('Pelindung & heatsink', 'Cangkang yang menutupi chip GPU, memori video, dan pipa panas.', [0.05, 0.62, 0.45]),
    part('Konektor PCIe', 'Kontak emas yang dimasukkan ke slot PCIe pada motherboard.', [0.2, 0.0, 0.9]),
    part('Port monitor', 'Colokan untuk menyambungkan monitor (HDMI / DisplayPort).', [-2.0, 0.3, 0]),
    part('Konektor daya', 'Kartu grafis butuh listrik tambahan langsung dari power supply.', [1.4, 0.8, -0.45]),
  ];
  return { group: g, parts, view: [0.5, 0.9, 1.1] };
}

/* ------------------------------------------------------------------- SOUND CARD */
export function soundCard() {
  const g = new THREE.Group();
  g.add(pcieCard({ len: 2.4, depth: 1.1, pcb: 0x1c2230 }));
  g.add(at(box(0.55, 0.07, 0.55, C.black, { r: 0.01 }), 0.3, 0.065, 0.05));
  g.add(at(textPlate('AUDIO', 0.45, 0.2, { fg: '#e5e7eb' }), 0.3, 0.101, 0.05, -Math.PI / 2));
  g.add(at(box(0.85, 0.12, 0.5, 0xb7bcc5, { r: 0.015, metalness: 0.9, roughness: 0.3 }), -0.5, 0.09, -0.15));
  [[0.9, -0.3], [0.9, 0.0], [0.65, -0.35], [-0.2, 0.28], [-0.45, 0.3]].forEach(([x, z], i) => {
    g.add(at(cyl(0.085, 0.085, 0.2, i < 3 ? 0x2a6fd8 : 0x2f3a58), x, 0.13, z));
    g.add(at(cyl(0.07, 0.07, 0.01, C.gold, { metalness: 0.8 }), x, 0.232, z));
  });
  for (let i = 0; i < 8; i++) g.add(at(box(0.06, 0.1, 0.06, C.black, { r: 0.005 }), 0.2 + i * 0.08, 0.08, 0.45));
  [[-0.3, 0x39c46b], [0, 0x3b82f6], [0.3, 0xf472b6]].forEach(([z, c]) =>
    g.add(at(cyl(0.1, 0.1, 0.34, c), -1.38, 0.16, z, 0, 0, Math.PI / 2)));
  const parts = [
    part('Chip audio', 'Otak kartu suara: mengubah data digital menjadi sinyal suara dan sebaliknya.', [0.3, 0.2, 0.05]),
    part('Jack audio', 'Colokan hijau (speaker), biru (line-in), dan pink (mikrofon).', [-1.6, 0.35, 0]),
    part('Kapasitor audio', 'Menyaring listrik agar suara jernih dan tidak berdesis.', [0.9, 0.35, -0.15]),
    part('Konektor PCIe', 'Dipasang ke slot PCIe pada motherboard.', [0.2, 0.0, 0.85]),
  ];
  return { group: g, parts, view: [0.8, 0.9, 1.0] };
}

/* ----------------------------------------------------------------- NETWORK CARD */
export function networkCard() {
  const g = new THREE.Group();
  g.add(pcieCard({ len: 2.2, depth: 1.0, pcb: 0x1f7a55 }));
  g.add(at(box(0.6, 0.42, 0.52, 0xc3c8d0, { r: 0.015, metalness: 0.9, roughness: 0.35 }), -0.9, 0.24, 0.05));
  g.add(at(box(0.04, 0.22, 0.36, C.black, { r: 0.005 }), -1.2, 0.22, 0.05));
  [-0.12, 0.2].forEach((dz, i) => {
    const c = i ? 0xff9f1c : 0x39c46b;
    g.add(at(box(0.03, 0.05, 0.07, c, { r: 0.005, emissive: c, emissiveIntensity: 0.6 }), -1.205, 0.4, 0.05 + dz * 0.8));
  });
  g.add(at(box(0.55, 0.08, 0.55, C.black, { r: 0.01 }), 0.15, 0.07, -0.05));
  g.add(at(textPlate('LAN', 0.4, 0.18, { fg: '#e5e7eb' }), 0.15, 0.112, -0.05, -Math.PI / 2));
  g.add(at(box(0.35, 0.06, 0.35, 0x9aa1ab, { r: 0.01, metalness: 0.8 }), 0.78, 0.06, -0.25));
  for (let i = 0; i < 5; i++) g.add(at(box(0.1, 0.05, 0.06, 0x3a3328, { r: 0.005 }), 0.5 + i * 0.12, 0.055, 0.35));
  const parts = [
    part('Port RJ45', 'Lubang untuk kabel LAN (Ethernet) menuju router atau switch.', [-1.35, 0.3, 0.05]),
    part('Lampu LED', 'Menyala/berkedip saat kabel terhubung dan data sedang dikirim.', [-1.32, 0.55, 0.05]),
    part('Chip pengendali', 'Mengatur pengiriman dan penerimaan data jaringan.', [0.15, 0.22, -0.05]),
    part('Konektor PCIe', 'Dipasang ke slot PCIe pada motherboard.', [0.2, 0.0, 0.8]),
  ];
  return { group: g, parts, view: [0.9, 0.9, 1.0] };
}

/* ------------------------------------------------------------------------ FAN */
export function fan() {
  const g = new THREE.Group();
  g.add(at(box(1.8, 0.32, 0.18, 0x2a2e36, { r: 0.04 }), 0, 0, 0.81));
  g.add(at(box(1.8, 0.32, 0.18, 0x2a2e36, { r: 0.04 }), 0, 0, -0.81));
  g.add(at(box(0.18, 0.32, 1.5, 0x2a2e36, { r: 0.04 }), 0.81, 0, 0));
  g.add(at(box(0.18, 0.32, 1.5, 0x2a2e36, { r: 0.04 }), -0.81, 0, 0));
  g.add(at(torus(0.78, 0.04, 0x1d2027, { metalness: 0.2 }), 0, 0, 0, Math.PI / 2));
  [[-0.72, -0.72], [0.72, -0.72], [-0.72, 0.72], [0.72, 0.72]].forEach(([x, z]) =>
    g.add(at(cyl(0.06, 0.06, 0.34, 0x0e0f12), x, 0, z)));
  g.add(fanRotor(0.74, 7, 0x3a3f4b));
  g.add(tube([[0.9, -0.05, 0.75], [1.3, -0.1, 0.9], [1.6, -0.1, 1.4], [1.6, -0.1, 1.9]], 0.035, C.black));
  g.add(at(box(0.2, 0.12, 0.3, C.white, { r: 0.015 }), 1.6, -0.1, 2.0));
  const parts = [
    part('Bilah kipas', 'Bilah miring yang berputar mendorong udara melewati heatsink.', [0.45, 0.25, 0.2]),
    part('Motor (hub)', 'Motor listrik di tengah yang memutar bilah.', [0, 0.25, 0]),
    part('Rangka', 'Bingkai persegi dengan lubang baut di keempat sudut untuk dipasang ke casing.', [0, 0.27, 0.85]),
    part('Kabel & konektor', 'Menyambung kipas ke motherboard untuk listrik dan pengaturan kecepatan.', [1.6, 0.1, 1.7]),
  ];
  return { group: g, parts, view: [0.6, 1.1, 0.8] };
}

/* ------------------------------------------------------------------------ PSU */
export function powerSupply() {
  const g = new THREE.Group();
  g.add(at(box(2.4, 1.15, 1.7, 0x2a2e36, { r: 0.06, metalness: 0.4, roughness: 0.5 }), 0, 0.575, 0));
  g.add(at(cyl(0.8, 0.8, 0.01, C.black, { seg: 48 }), 0.45, 1.153, 0));
  g.add(at(fanRotor(0.7, 7, 0x3a3f4b), 0.45, 1.08, 0));
  [0.35, 0.58, 0.8].forEach((r) => g.add(at(torus(r, 0.016, 0xb7bcc5, { metalness: 0.9, roughness: 0.3 }), 0.45, 1.16, 0, Math.PI / 2)));
  for (let i = 0; i < 3; i++) {
    const bar = at(box(0.02, 0.012, 1.6, 0xb7bcc5, { r: 0, metalness: 0.9 }), 0, 0, 0);
    const holder = group(bar);
    holder.position.set(0.45, 1.16, 0);
    holder.rotation.y = (i * Math.PI) / 3;
    g.add(holder);
  }
  g.add(at(textPlate('650W', 0.8, 1.2, { bg: '#ffffff', fg: '#1d3557', sub: 'POWER SUPPLY' }), -0.75, 1.155, 0, -Math.PI / 2));
  g.add(at(box(0.1, 0.3, 0.5, C.black, { r: 0.01 }), 1.22, 0.4, 0.4));
  g.add(at(box(0.07, 0.2, 0.15, 0xd8333a, { r: 0.01 }), 1.21, 0.4, -0.3));
  [[0.8, 0x15171c, 0.25], [0.55, 0xf2c94c, -0.05], [0.3, 0xd8333a, -0.3]].forEach(([y, c, z]) => {
    g.add(tube([[-1.2, y, z], [-1.7, y, z + 0.1], [-2.2, y - 0.3, z + 0.5], [-2.5, y - 0.45, z + 0.25]], 0.05, c, { roughness: 0.8 }));
    g.add(at(box(0.3, 0.14, 0.25, 0xe8e1cf, { r: 0.015 }), -2.55, y - 0.47, z + 0.2, 0, 0.4, 0));
  });
  const parts = [
    part('Kipas pendingin', 'Membuang panas hasil konversi listrik keluar dari power supply.', [0.45, 1.3, 0]),
    part('Kabel daya', 'Kabel dengan konektor berbeda untuk motherboard, kartu grafis, dan drive.', [-2.0, 0.45, 0.5]),
    part('Soket AC', 'Colokan kabel listrik dari stopkontak (220V).', [1.4, 0.4, 0.4]),
    part('Saklar', 'Saklar utama untuk menghidupkan dan mematikan aliran listrik.', [1.4, 0.55, -0.3]),
    part('Label daya', 'Menunjukkan kemampuan daya, misalnya 650 Watt.', [-0.75, 1.3, 0]),
  ];
  return { group: g, parts, view: [0.8, 0.7, 1.0] };
}
