# KomputerKu 3D

Website belajar komponen komputer dengan model 3D interaktif (putar 360°, zoom) dan kuis **Tebak Komponen**.

## Fitur

- **Belajar Komputer**: 23 komponen (motherboard, processor, RAM, graphics card, sound card, network card, fan, power supply, hard drive, SSD, optical drive, CD/DVD, floppy disk, flash drive, keyboard, mouse, webcam, joystick, microphone, LCD monitor, speaker, headset, printer), dikelompokkan dalam 4 kategori.
  - Model 3D yang bisa diseret untuk diputar 360° dan di-zoom, dengan rotasi otomatis.
  - Penanda bernomor pada bagian-bagian penting tiap komponen.
  - Penjelasan: pengertian, fungsi, perumpamaan, dan fakta menarik.
  - Navigasi sebelumnya/berikutnya (juga lewat tombol panah keyboard).
- **Tebak Komponen**: pilih jumlah soal dan kategori, tebak nama dari model 3D, dengan petunjuk 50:50, poin, streak, ringkasan hasil, dan rekor tersimpan di browser.

## Menjalankan

```bash
npm install
npm run dev      # mode pengembangan
npm run build    # hasil build di dist/
npm run preview  # coba hasil build
```

## Teknologi

[Three.js](https://threejs.org/) + [Vite](https://vite.dev/), JavaScript biasa tanpa framework.
Semua model 3D dibuat lewat kode (procedural) di `src/models/`, jadi tidak ada file aset 3D.

## Struktur

```
src/
  data.js            teks edukasi & kategori
  models/            pembuat model 3D (core, storage, peripherals)
  viewer.js          scene, kamera, kontrol, penanda bagian
  thumbs.js          thumbnail untuk daftar
  views/             beranda, belajar, kuis
```

Menambah komponen: buat fungsi model di `src/models/`, daftarkan di `src/models/index.js`, lalu tambahkan teksnya di `src/data.js`.
