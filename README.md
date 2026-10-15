# Komponenku

Website belajar komponen komputer dengan model 3D interaktif (putar 360°, zoom) dan kuis **Tebak Komponen**.

**Live:** https://komponenku.vercel.app

## Fitur

- **Kenali Komponen**: 23 komponen (motherboard, processor, RAM, graphics card, sound card, network card, fan, power supply, hard drive, SSD, optical drive, CD/DVD, floppy disk, flash drive, keyboard, mouse, webcam, joystick, microphone, LCD monitor, speaker, headset, printer), dikelompokkan dalam 4 kategori.
  - Model 3D yang bisa diseret untuk diputar 360° dan di-zoom, dengan rotasi otomatis.
  - Penanda bernomor pada bagian-bagian penting tiap komponen.
  - Penjelasan: pengertian, fungsi, perumpamaan, dan fakta menarik.
  - Navigasi sebelumnya/berikutnya (juga lewat tombol panah keyboard).
- **Kabel & Port**: 9 konektor 3D (VGA, HDMI, DisplayPort, USB Type-A/B/C, Micro-USB, RJ45, jack audio 3,5 mm), dikelompokkan dalam Video, USB, Jaringan, dan Audio.
  - Tiap konektor punya daftar versi dan jenis (misalnya HDMI 1.4 sampai 2.1, USB 2.0 sampai USB4, kategori kabel LAN Cat5 sampai Cat8). Pada USB Type-A, klik versi untuk melihat perbedaan bentuk konektornya.
  - Halaman **Praktik kabel LAN** (`#/kabel/lan`): urutan warna T568A/T568B pada model RJ45 3D dan simulator straight vs crossover.
- **Tebak Komponen**: pilih jumlah soal dan kategori (termasuk Kabel & Port), tebak nama dari model 3D, dengan petunjuk 50:50, poin, streak, ringkasan hasil, dan rekor tersimpan di browser.

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
  cables.js          teks edukasi kabel & port (versi, jenis)
  lan.js             data urutan kawat T568A/T568B
  models/            pembuat model 3D (core, storage, peripherals, ports)
  viewer.js          scene, kamera, kontrol, penanda bagian
  thumbs.js          thumbnail untuk daftar
  views/             beranda, belajar, kabel & port, kabel LAN, kuis
```

Menambah konektor: buat fungsi model di `src/models/ports.js`, daftarkan di `src/models/index.js` (id diawali `port-`), lalu tambahkan teksnya di `src/cables.js`.

Menambah komponen: buat fungsi model di `src/models/`, daftarkan di `src/models/index.js`, lalu tambahkan teksnya di `src/data.js`.
