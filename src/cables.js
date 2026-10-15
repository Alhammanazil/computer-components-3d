export const CABLE_INTRO = {
  title: 'Kabel & Port: jalan penghubung antar perangkat',
  text:
    'Komponen komputer tidak bisa bekerja sendiri. Kabel dan portlah yang menghubungkan komputer ke monitor, jaringan, speaker, dan perangkat lain. ' +
    'Bentuk colokan dan versinya berbeda-beda, jadi mengenalinya akan sangat membantu saat memilih atau memperbaiki kabel.',
};

export const CABLE_GROUPS = [
  { id: 'video', name: 'Video', icon: '🖥️', color: '#a66cff', blurb: 'Mengirim gambar ke monitor, TV, dan proyektor.' },
  { id: 'usb', name: 'USB', icon: '🔌', color: '#4d8bff', blurb: 'Satu keluarga colokan untuk data dan daya.' },
  { id: 'jaringan', name: 'Jaringan', icon: '🌐', color: '#2ec4b6', blurb: 'Menghubungkan komputer ke LAN dan internet.' },
  { id: 'audio', name: 'Audio', icon: '🎧', color: '#ff7a59', blurb: 'Menyalurkan suara ke speaker dan headset.' },
];

/**
 * Tiap port: `lists` = daftar versi/jenis. Baris yang punya `variant` bisa diklik untuk
 * mengubah bentuk model 3D (dibaca oleh fungsi pembuat model).
 */
export const PORTS = [
  {
    id: 'port-vga', name: 'VGA', alt: 'D-sub 15 pin', group: 'video', tags: ['Analog', 'Tanpa suara'],
    what: 'VGA (Video Graphics Array) adalah port video analog berbentuk huruf D dengan 15 pin dalam tiga baris, biasanya berwarna biru.',
    job: 'Mengirim gambar dari komputer ke monitor atau proyektor. Hanya membawa gambar, tidak membawa suara.',
    like: 'Seperti selang air tipis: tetap mengalir, tetapi makin panjang kabelnya, gambar makin buram.',
    fact: 'VGA lahir tahun 1987 dan masih sering ditemui pada proyektor dan monitor kantor lama.',
    lists: [
      {
        title: 'Standar resolusi', hint: 'VGA adalah nama standar, jadi "versi"-nya berupa resolusi',
        rows: [
          { n: 'VGA', spec: '640×480', note: 'Standar awal dari IBM.' },
          { n: 'SVGA', spec: '800×600', note: 'Super VGA, umum di tahun 1990-an.' },
          { n: 'XGA', spec: '1024×768', note: 'Resolusi proyektor kantor yang paling umum.' },
          { n: 'UXGA', spec: '1600×1200', note: 'Ultra XGA, untuk monitor CRT besar.' },
          { n: 'Full HD', spec: '1920×1080', note: 'Masih bisa, tetapi sinyal analog lebih mudah buram dan berbayang.' },
        ],
      },
    ],
  },
  {
    id: 'port-hdmi', name: 'HDMI', alt: 'High-Definition Multimedia Interface', group: 'video', tags: ['Digital', 'Gambar + suara'],
    what: 'HDMI adalah port digital yang membawa gambar dan suara sekaligus dalam satu kabel. Sekarang paling umum di TV, monitor, proyektor, dan konsol game.',
    job: 'Menyambungkan laptop, PC, atau konsol ke layar. Sinyal digital membuat gambarnya tetap tajam.',
    like: 'Seperti truk pengangkut yang membawa gambar dan suara dalam satu perjalanan.',
    fact: 'Kabel HDMI lama bisa tetap dipakai pada perangkat baru, tetapi fiturnya mengikuti versi yang paling rendah.',
    lists: [
      {
        title: 'Versi HDMI', hint: 'Bentuk konektor sama, kemampuannya berbeda',
        rows: [
          { n: 'HDMI 1.0', spec: '4,95 Gbps', note: '2002. Full HD (1080p) 60 Hz, pertama kali diluncurkan.' },
          { n: 'HDMI 1.4', spec: '10,2 Gbps', note: '2009. 4K 30 Hz, mendukung ARC dan jaringan Ethernet lewat HDMI.' },
          { n: 'HDMI 2.0', spec: '18 Gbps', note: '2013. 4K 60 Hz dan HDR.' },
          { n: 'HDMI 2.1', spec: '48 Gbps', note: '2017. 4K 120 Hz dan 8K 60 Hz, cocok untuk game konsol terbaru.' },
        ],
      },
      {
        title: 'Ukuran konektor', hint: 'Dari terbesar ke terkecil',
        rows: [
          { n: 'Type A', spec: 'Standar', note: 'Yang paling umum di TV, monitor, dan laptop.' },
          { n: 'Type C', spec: 'Mini HDMI', note: 'Dipakai pada kamera dan tablet.' },
          { n: 'Type D', spec: 'Micro HDMI', note: 'Dipakai pada kamera aksi dan Raspberry Pi 4.' },
        ],
      },
    ],
  },
  {
    id: 'port-displayport', name: 'DisplayPort', alt: 'DP', group: 'video', tags: ['Digital', 'Gambar + suara'],
    what: 'DisplayPort adalah port video digital yang populer di monitor gaming dan monitor profesional. Kecepatannya tinggi dan bisa menyambung beberapa monitor.',
    job: 'Mengirim gambar dan suara beresolusi tinggi ke monitor, termasuk refresh rate sangat tinggi.',
    like: 'Seperti jalan tol khusus: ramai kendaraan pun tetap lancar.',
    fact: 'Konektornya punya kait pengunci, sehingga tidak mudah lepas seperti HDMI.',
    lists: [
      {
        title: 'Versi DisplayPort', hint: 'Bentuk konektor sama, kemampuannya berbeda',
        rows: [
          { n: 'DP 1.1', spec: '10,8 Gbps', note: '2007. Full HD hingga 1440p.' },
          { n: 'DP 1.2', spec: '21,6 Gbps', note: '2010. 4K 60 Hz dan beberapa monitor lewat satu kabel (MST).' },
          { n: 'DP 1.4', spec: '32,4 Gbps', note: '2016. 8K 60 Hz dengan kompresi DSC, mendukung HDR.' },
          { n: 'DP 2.0 / 2.1', spec: '80 Gbps', note: '2019 dan 2022. 8K dan 16K dengan DSC, refresh rate sangat tinggi.' },
        ],
      },
      {
        title: 'Ukuran konektor', hint: '',
        rows: [
          { n: 'DisplayPort', spec: 'Standar', note: 'Ukuran penuh, ada kait pengunci.' },
          { n: 'Mini DisplayPort', spec: 'Mini', note: 'Lebih kecil, dipakai pada Mac dan laptop tipis lama.' },
        ],
      },
    ],
  },
  {
    id: 'port-usb-a', name: 'USB Type-A', alt: 'USB standar', group: 'usb', tags: ['Data + daya', 'Satu arah'],
    what: 'USB Type-A adalah colokan USB persegi panjang pipih yang paling dikenal. Ada di hampir semua komputer, charger, dan flash drive.',
    job: 'Menghubungkan mouse, keyboard, flash drive, printer, dan banyak perangkat lain, sekaligus memberi daya.',
    like: 'Seperti colokan yang hanya mau masuk satu arah, makanya sering salah coba dua kali.',
    fact: 'Warna plastik di dalam konektor sering menunjukkan versi: hitam atau putih untuk USB 2.0, biru untuk USB 3.0.',
    lists: [
      {
        title: 'Versi USB', hint: 'Klik baris untuk melihat bentuk konektornya',
        rows: [
          { n: 'USB 1.1', spec: '12 Mbps', note: '1998. Untuk mouse dan keyboard. Plastik putih atau hitam.', variant: 'usb2' },
          { n: 'USB 2.0', spec: '480 Mbps', note: '2000. Paling umum. Plastik hitam atau putih.', variant: 'usb2' },
          { n: 'USB 3.0 / 3.2 Gen 1', spec: '5 Gbps', note: '2008. Plastik biru. Perlu port USB 3 agar cepat.', variant: 'usb3' },
          { n: 'USB 3.1 / 3.2 Gen 2', spec: '10 Gbps', note: '2013. Biasanya biru kehijauan (teal), sering dipakai SSD eksternal.', variant: 'usb3' },
        ],
      },
    ],
  },
  {
    id: 'port-usb-b', name: 'USB Type-B', alt: 'USB printer', group: 'usb', tags: ['Data + daya', 'Satu arah'],
    what: 'USB Type-B adalah colokan USB berbentuk hampir persegi dengan dua sudut atas dipotong. Dulu dikenal sebagai colokan printer.',
    job: 'Dipakai pada perangkat besar yang jarang dipindah: printer, scanner, dan hard drive eksternal.',
    like: 'Seperti ujung kabel yang "diam" di perangkat, sementara ujung satunya (Type-A) ke komputer.',
    fact: 'Kabel printer biasanya punya dua ujung berbeda: Type-A untuk komputer dan Type-B untuk printer.',
    lists: [
      {
        title: 'Versi dan jenis', hint: '',
        rows: [
          { n: 'USB 2.0 Type-B', spec: '480 Mbps', note: 'Printer, scanner, dan perangkat audio.' },
          { n: 'USB 3.0 Type-B', spec: '5 Gbps', note: 'Lebih lebar dengan bagian tambahan di atas. Dipakai scanner dan hard drive eksternal.' },
          { n: 'Mini USB (Mini-B)', spec: '480 Mbps', note: 'Lebih kecil, dipakai kamera digital dan MP3 player lama.' },
        ],
      },
    ],
  },
  {
    id: 'port-usb-c', name: 'USB Type-C', alt: 'USB-C', group: 'usb', tags: ['Data + daya + video', 'Bolak-balik'],
    what: 'USB Type-C adalah colokan USB modern yang berbentuk lonjong, simetris, dan bisa dicolok dari sisi mana saja.',
    job: 'Satu kabel untuk data, video, dan mengisi daya, dari ponsel hingga laptop.',
    like: 'Seperti kunci bolak-balik yang tidak pernah salah arah.',
    fact: 'Bentuk Type-C sama, tetapi kemampuannya bisa sangat berbeda. Kabel charger biasa belum tentu cepat untuk data.',
    lists: [
      {
        title: 'Kecepatan data', hint: 'Bentuk sama, kemampuan berbeda',
        rows: [
          { n: 'USB 2.0', spec: '480 Mbps', note: 'Umum pada kabel charger ponsel.' },
          { n: 'USB 3.2 Gen 1', spec: '5 Gbps', note: 'Sebelumnya disebut USB 3.0.' },
          { n: 'USB 3.2 Gen 2', spec: '10 Gbps', note: 'Sebelumnya USB 3.1.' },
          { n: 'USB 3.2 Gen 2×2', spec: '20 Gbps', note: 'Memakai dua jalur sekaligus, hanya lewat Type-C.' },
          { n: 'USB4', spec: '40 Gbps', note: '2019. Setara Thunderbolt 3, mendukung video dan beberapa perangkat.' },
          { n: 'USB4 v2.0', spec: '80 Gbps', note: '2022. Generasi terbaru.' },
        ],
      },
      {
        title: 'Daya (USB Power Delivery)', hint: 'Untuk mengisi daya',
        rows: [
          { n: 'Standar', spec: '15 W', note: '5 V 3 A, cukup untuk ponsel.' },
          { n: 'PD 3.0', spec: 'hingga 100 W', note: '20 V 5 A, untuk laptop dan tablet.' },
          { n: 'PD 3.1 (EPR)', spec: 'hingga 240 W', note: '48 V 5 A, untuk laptop gaming dan monitor.' },
        ],
      },
      {
        title: 'Kabel yang berbentuk Type-C', hint: 'Sama bentuk, beda fungsi',
        rows: [
          { n: 'Thunderbolt 3 / 4', spec: '40 Gbps', note: 'Data, video, dan daya. Diberi simbol petir.' },
          { n: 'Thunderbolt 5', spec: '80 Gbps', note: 'Bisa naik hingga 120 Gbps.' },
        ],
      },
    ],
  },
  {
    id: 'port-micro-usb', name: 'Micro-USB', alt: 'Micro-B', group: 'usb', tags: ['Data + daya', 'Satu arah'],
    what: 'Micro-USB adalah colokan USB kecil dan pipih yang dulu menjadi standar pengisi daya ponsel Android.',
    job: 'Mengisi daya dan memindahkan data pada gadget kecil seperti ponsel, power bank, dan kamera.',
    like: 'Seperti versi mini dari colokan printer: kecil, tetapi sering aus.',
    fact: 'Sekarang banyak yang digantikan USB Type-C, tetapi masih ada di perangkat lama.',
    lists: [
      {
        title: 'Versi dan jenis', hint: '',
        rows: [
          { n: 'Micro-B (USB 2.0)', spec: '480 Mbps', note: 'Paling umum di ponsel, power bank, dan speaker kecil.' },
          { n: 'Micro-B (USB 3.0)', spec: '5 Gbps', note: 'Lebih lebar karena ada bagian tambahan. Dipakai hard drive eksternal dan beberapa ponsel.' },
        ],
      },
    ],
  },
  {
    id: 'port-rj45', name: 'RJ45', alt: 'Ethernet / LAN', group: 'jaringan', tags: ['Jaringan', 'Kabel LAN'],
    what: 'RJ45 adalah colokan kabel jaringan (LAN) dengan 8 kontak. Nama resminya 8P8C, yaitu 8 posisi dan 8 kontak.',
    job: 'Menghubungkan komputer ke router, switch, atau modem agar bisa terhubung ke jaringan.',
    like: 'Seperti pintu rumah yang dipakai data untuk keluar masuk jaringan.',
    fact: 'Panjang kabel LAN maksimal 100 meter. Lebih dari itu butuh switch atau repeater.',
    link: { href: '#/kabel/lan', label: '🌐 Praktik kabel LAN: straight & crossover' },
    lists: [
      {
        title: 'Kategori kabel (Cat)', hint: 'Makin besar angkanya, makin cepat',
        rows: [
          { n: 'Cat 5', spec: '100 Mbps', note: 'Frekuensi 100 MHz. Sudah jarang dipakai.' },
          { n: 'Cat 5e', spec: '1 Gbps', note: '100 MHz. Standar rumah dan kantor.' },
          { n: 'Cat 6', spec: '1 Gbps (10 Gbps ≤ 55 m)', note: '250 MHz. Lebih tahan gangguan.' },
          { n: 'Cat 6a', spec: '10 Gbps', note: '500 MHz, hingga 100 m. Untuk server dan kantor.' },
          { n: 'Cat 7', spec: '10 Gbps', note: '600 MHz, berpelindung penuh.' },
          { n: 'Cat 8', spec: '25 / 40 Gbps', note: '2000 MHz, maksimal 30 m. Untuk data center.' },
        ],
      },
      {
        title: 'Urutan warna kawat', hint: 'Dilihat dari ujung konektor, kait di bawah',
        rows: [
          { n: 'T568B', spec: 'Paling umum', note: 'Oranye-putih, oranye, hijau-putih, biru, biru-putih, hijau, cokelat-putih, cokelat.' },
          { n: 'T568A', spec: 'Alternatif', note: 'Hijau-putih, hijau, oranye-putih, biru, biru-putih, oranye, cokelat-putih, cokelat.' },
          { n: 'Straight', spec: 'Sama di kedua ujung', note: 'Untuk menghubungkan perangkat berbeda, misalnya PC ke switch.' },
          { n: 'Cross', spec: 'T568A di satu ujung, T568B di ujung lain', note: 'Untuk menghubungkan perangkat sejenis secara langsung, misalnya PC ke PC.' },
        ],
      },
    ],
  },
  {
    id: 'port-audio', name: 'Jack Audio 3,5 mm', alt: 'Headphone jack', group: 'audio', tags: ['Analog', 'Suara'],
    what: 'Jack audio 3,5 mm adalah colokan bulat kecil untuk menyalurkan suara analog ke headphone, speaker, atau mikrofon.',
    job: 'Menyambungkan headset, speaker, dan mikrofon ke komputer atau ponsel.',
    like: 'Seperti telinga dan mulut yang disambungkan ke komputer lewat satu colokan kecil.',
    fact: 'Jumlah cincin hitam di colokan menunjukkan jenisnya: dua untuk TRS (stereo), tiga untuk TRRS (headset dengan mikrofon).',
    lists: [
      {
        title: 'Jenis plug', hint: 'Dilihat dari jumlah cincin hitam',
        rows: [
          { n: 'TS', spec: '2 kontak', note: 'Mono. Dipakai gitar listrik dan mikrofon sederhana.' },
          { n: 'TRS', spec: '3 kontak', note: 'Stereo: kiri, kanan, ground. Dipakai headphone.' },
          { n: 'TRRS', spec: '4 kontak', note: 'Stereo + mikrofon. Dipakai headset ponsel dan laptop.' },
        ],
      },
      {
        title: 'Warna port di PC', hint: 'Standar PC99',
        rows: [
          { n: 'Hijau', spec: 'Output', note: 'Speaker atau headphone.' },
          { n: 'Merah muda', spec: 'Input', note: 'Mikrofon.' },
          { n: 'Biru muda', spec: 'Line in', note: 'Sumber suara lain, misalnya kaset atau gitar.' },
        ],
      },
      {
        title: 'Ukuran plug', hint: '',
        rows: [
          { n: '3,5 mm', spec: 'Standar', note: 'Headphone, speaker, dan ponsel.' },
          { n: '2,5 mm', spec: 'Kecil', note: 'Headset ponsel lama.' },
          { n: '6,35 mm', spec: 'Besar', note: 'Studio, gitar, dan amplifier.' },
        ],
      },
    ],
  },
];

export const portById = Object.fromEntries(PORTS.map((p) => [p.id, p]));
export const groupOf = (p) => CABLE_GROUPS.find((g) => g.id === p.group);
