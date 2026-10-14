export const INTRO = {
  title: 'Apa itu komponen komputer?',
  text:
    'Komponen komputer adalah bagian-bagian perangkat keras (hardware) yang saling bekerja sama membentuk sebuah komputer. ' +
    'Ada yang bertugas berpikir, ada yang menyimpan data, ada yang menerima perintah dari kita, dan ada yang menampilkan hasilnya.',
};

export const CATEGORIES = [
  { id: 'inti', name: 'Inti Komputer', icon: '🧠', color: '#ff7a59', blurb: 'Bagian dalam casing yang memproses dan menghubungkan semuanya.' },
  { id: 'simpan', name: 'Penyimpanan', icon: '💾', color: '#2ec4b6', blurb: 'Tempat data dan program disimpan.' },
  { id: 'input', name: 'Perangkat Input', icon: '⌨️', color: '#4d8bff', blurb: 'Alat untuk memasukkan perintah atau data ke komputer.' },
  { id: 'output', name: 'Perangkat Output', icon: '🖥️', color: '#a66cff', blurb: 'Alat untuk menampilkan hasil dari komputer.' },
];

/**
 * Urutan di sini = urutan halaman saat belajar (prev/next).
 * `what` = pengertian, `job` = fungsi, `like` = perumpamaan, `fact` = fakta menarik.
 */
export const COMPONENTS = [
  {
    id: 'motherboard', name: 'Motherboard', alt: 'Mainboard', cat: 'inti',
    what: 'Motherboard atau mainboard adalah papan sirkuit utama yang menjadi tulang punggung komputer. Semua komponen dipasang dan dihubungkan lewat papan ini.',
    job: 'Menjadi tempat memasang prosesor, RAM, kartu grafis, dan penyimpanan, serta mengalirkan data dan listrik di antara semuanya.',
    like: 'Seperti jalan raya di sebuah kota yang menghubungkan semua gedung.',
    fact: 'Di dalam lapisan papan ini ada ratusan jalur tembaga setipis rambut yang menjadi jalan data.',
  },
  {
    id: 'processor', name: 'Processor', alt: 'CPU', cat: 'inti',
    what: 'Processor (CPU, Central Processing Unit) adalah otak komputer. Ukurannya kecil, tetapi tugasnya paling banyak.',
    job: 'Menjalankan instruksi dari program dan melakukan perhitungan. Kecepatannya diukur dalam GHz.',
    like: 'Seperti otak manusia yang memikirkan dan memutuskan semua hal.',
    fact: 'CPU modern berisi miliaran transistor dalam ruang seluas kuku jari.',
  },
  {
    id: 'ram', name: 'RAM', alt: 'Random Access Memory', cat: 'inti',
    what: 'RAM adalah memori sementara tempat komputer menaruh data dan program yang sedang dipakai.',
    job: 'Memberi akses data yang sangat cepat ke prosesor. Saat komputer dimatikan, isi RAM hilang.',
    like: 'Seperti meja kerja: makin luas mejanya, makin banyak yang bisa dikerjakan bersamaan.',
    fact: 'Membuka banyak tab browser sekaligus akan memakan banyak RAM.',
  },
  {
    id: 'graphics-card', name: 'Graphics Card', alt: 'VGA / GPU', cat: 'inti',
    what: 'Graphics card (kartu grafis atau VGA) adalah kartu tambahan yang khusus mengolah gambar, video, dan grafik 3D.',
    job: 'Menggambar tampilan yang kita lihat di monitor, terutama untuk game, desain, dan video editing.',
    like: 'Seperti pelukis yang cepat dan khusus menggambar, sementara CPU mengerjakan hal lainnya.',
    fact: 'Chip GPU punya ribuan inti kecil, sehingga juga dipakai untuk melatih kecerdasan buatan (AI).',
  },
  {
    id: 'sound-card', name: 'Sound Card', alt: 'Kartu Suara', cat: 'inti',
    what: 'Sound card adalah kartu yang mengolah suara di komputer.',
    job: 'Mengubah data suara digital menjadi sinyal analog untuk speaker atau headset, dan sebaliknya untuk mikrofon.',
    like: 'Seperti penerjemah antara bahasa komputer (angka) dan bahasa telinga kita (suara).',
    fact: 'Kebanyakan komputer sekarang sudah punya sound card bawaan di motherboard (onboard).',
  },
  {
    id: 'network-card', name: 'Network Card', alt: 'LAN Card / NIC', cat: 'inti',
    what: 'Network card (NIC) adalah kartu yang menghubungkan komputer ke jaringan, baik lewat kabel LAN maupun Wi-Fi.',
    job: 'Mengirim dan menerima data dari komputer lain atau internet.',
    like: 'Seperti pintu dan kotak pos rumah: lewat sinilah surat (data) keluar masuk.',
    fact: 'Setiap kartu jaringan punya nomor unik di seluruh dunia yang disebut MAC address.',
  },
  {
    id: 'fan', name: 'Fan', alt: 'Kipas Pendingin', cat: 'inti',
    what: 'Fan adalah kipas yang mengalirkan udara untuk mendinginkan bagian komputer yang panas.',
    job: 'Menjaga suhu prosesor, kartu grafis, dan power supply agar tidak terlalu panas dan tetap bekerja stabil.',
    like: 'Seperti kipas angin yang menjaga kita tetap sejuk saat berlari.',
    fact: 'Jika terlalu panas, CPU akan memperlambat dirinya sendiri untuk melindungi diri.',
  },
  {
    id: 'psu', name: 'Power Supply', alt: 'PSU', cat: 'inti',
    what: 'Power Supply Unit (PSU) adalah komponen yang menyuplai listrik ke seluruh bagian komputer.',
    job: 'Mengubah listrik AC 220V dari stopkontak menjadi listrik DC bertegangan rendah (12V, 5V, 3,3V) yang aman bagi komponen.',
    like: 'Seperti jantung yang memompa darah (listrik) ke seluruh tubuh.',
    fact: 'Label "80 PLUS" menandakan PSU yang hemat listrik dengan efisiensi minimal 80%.',
  },
  {
    id: 'hard-drive', name: 'Hard Drive', alt: 'HDD', cat: 'simpan',
    what: 'Hard drive (HDD) adalah penyimpanan data yang memakai piringan magnetik yang berputar.',
    job: 'Menyimpan sistem operasi, program, dan file kita secara permanen, bahkan saat komputer mati.',
    like: 'Seperti lemari arsip besar: muat banyak, tetapi mencari berkas butuh waktu.',
    fact: 'Kepala baca HDD melayang beberapa nanometer di atas piringan tanpa menyentuhnya.',
  },
  {
    id: 'ssd', name: 'SSD', alt: 'Solid State Drive', cat: 'simpan',
    what: 'SSD adalah penyimpanan data memakai chip memori flash tanpa bagian yang bergerak.',
    job: 'Menyimpan data dengan kecepatan baca-tulis yang jauh lebih tinggi daripada HDD, sehingga komputer menyala dan membuka program lebih cepat.',
    like: 'Seperti lemari arsip dengan robot super cepat yang langsung tahu letak berkas.',
    fact: 'Karena tidak ada bagian berputar, SSD lebih senyap, hemat daya, dan tahan guncangan.',
  },
  {
    id: 'optical-drive', name: 'Optical Drive', alt: 'CD/DVD Drive', cat: 'simpan',
    what: 'Optical drive adalah perangkat yang membaca dan menulis cakram CD, DVD, atau Blu-ray menggunakan sinar laser.',
    job: 'Memutar cakram dan membacanya dengan laser untuk menginstal program, memutar film, atau membakar data.',
    like: 'Seperti pemutar piringan hitam, tetapi memakai cahaya, bukan jarum.',
    fact: 'Blu-ray memakai laser warna biru yang lebih halus, sehingga data bisa dipadatkan lebih banyak.',
  },
  {
    id: 'cd-dvd', name: 'CD / DVD', alt: 'Cakram Optik', cat: 'simpan',
    what: 'CD dan DVD adalah cakram plastik berlapis logam yang menyimpan data dalam bentuk lekukan mikroskopis.',
    job: 'Menyimpan musik, film, program, atau data. CD menampung sekitar 700 MB, sedangkan DVD sekitar 4,7 GB.',
    like: 'Seperti buku dengan tulisan braille yang dibaca memakai cahaya.',
    fact: 'Warna pelangi di permukaannya muncul karena jalur data sangat rapat sehingga memecah cahaya.',
  },
  {
    id: 'floppy', name: 'Floppy Disk', alt: 'Disket', cat: 'simpan',
    what: 'Floppy disk (disket) adalah media simpan portabel zaman dulu yang berisi piringan magnetik tipis di dalam casing plastik.',
    job: 'Memindahkan dan menyimpan data kecil. Disket 3,5 inci hanya menampung 1,44 MB.',
    like: 'Seperti flashdisk versi jadul yang kapasitasnya sangat kecil.',
    fact: 'Ikon "Save" di banyak aplikasi sampai sekarang masih berbentuk disket.',
  },
  {
    id: 'flash-drive', name: 'Flash Drive', alt: 'Flashdisk', cat: 'simpan',
    what: 'Flash drive (flashdisk) adalah penyimpanan kecil dan portabel yang dicolokkan ke port USB.',
    job: 'Memindahkan dan menyimpan file antar komputer dengan mudah.',
    like: 'Seperti tas kecil yang bisa dibawa kemana-mana berisi berkas-berkasmu.',
    fact: 'Tidak butuh baterai: data tetap aman di chip flash meski dicabut dari komputer.',
  },
  {
    id: 'keyboard', name: 'Keyboard', alt: 'Papan Ketik', cat: 'input',
    what: 'Keyboard adalah perangkat input berisi kumpulan tombol untuk memasukkan huruf, angka, dan perintah ke komputer.',
    job: 'Mengetik teks dan memberi perintah lewat kombinasi tombol, misalnya Ctrl + C untuk menyalin.',
    like: 'Seperti mesin tik modern yang bisa mengirim perintah.',
    fact: 'Susunan huruf QWERTY berasal dari mesin tik tahun 1870-an agar tuasnya tidak sering macet.',
  },
  {
    id: 'mouse', name: 'Mouse', alt: 'Tetikus', cat: 'input',
    what: 'Mouse adalah perangkat input penunjuk yang menggerakkan kursor di layar.',
    job: 'Menunjuk, memilih, menyeret, dan membuka sesuatu lewat klik dan gulir.',
    like: 'Seperti jari tangan yang bisa menunjuk apa pun di layar.',
    fact: 'Mouse pertama dibuat pada 1964 dan casingnya terbuat dari kayu.',
  },
  {
    id: 'webcam', name: 'Webcam', alt: 'Kamera Web', cat: 'input',
    what: 'Webcam adalah kamera kecil yang terhubung ke komputer untuk merekam video dan foto.',
    job: 'Digunakan untuk video call, rapat online, dan siaran langsung.',
    like: 'Seperti mata komputer yang bisa melihat kita.',
    fact: 'Webcam pertama (1991) dipakai untuk mengawasi teko kopi di sebuah laboratorium kampus.',
  },
  {
    id: 'joystick', name: 'Joystick', alt: 'Pengendali Game', cat: 'input',
    what: 'Joystick adalah perangkat input berupa tuas yang bisa digerakkan ke segala arah, biasanya untuk bermain game.',
    job: 'Mengendalikan arah gerak pesawat, mobil, atau karakter dalam game.',
    like: 'Seperti kemudi pesawat kecil di atas mejamu.',
    fact: 'Nama joystick sudah dipakai sejak awal penerbangan, jauh sebelum ada komputer.',
  },
  {
    id: 'microphone', name: 'Microphone', alt: 'Mikrofon', cat: 'input',
    what: 'Microphone adalah perangkat input yang menangkap suara dan mengubahnya menjadi sinyal listrik.',
    job: 'Merekam suara, bicara saat video call, bermain game online, atau memberi perintah suara.',
    like: 'Seperti telinga tambahan untuk komputer.',
    fact: 'Di dalam mikrofon ada membran sangat tipis yang bergetar mengikuti suaramu.',
  },
  {
    id: 'monitor', name: 'LCD Monitor', alt: 'Layar', cat: 'output',
    what: 'LCD monitor adalah perangkat output yang menampilkan gambar dan tulisan dari komputer pada layar datar.',
    job: 'Menampilkan hasil kerja komputer. Gambar tersusun dari jutaan titik kecil yang disebut piksel.',
    like: 'Seperti jendela tempat kita melihat dunia di dalam komputer.',
    fact: 'Layar Full HD (1920×1080) punya sekitar 2 juta piksel.',
  },
  {
    id: 'speaker', name: 'Speaker', alt: 'Pengeras Suara', cat: 'output',
    what: 'Speaker adalah perangkat output yang mengubah sinyal listrik menjadi suara yang bisa didengar.',
    job: 'Memutar musik, film, dan suara dari komputer. Woofer untuk nada rendah, tweeter untuk nada tinggi.',
    like: 'Seperti mulut komputer yang berbicara.',
    fact: 'Suara dihasilkan dari kerucut speaker yang bergetar ratusan hingga ribuan kali per detik.',
  },
  {
    id: 'headset', name: 'Headset', alt: 'Headphone + Mic', cat: 'output',
    what: 'Headset adalah gabungan headphone dan mikrofon yang dipakai di kepala.',
    job: 'Mendengarkan suara secara pribadi sambil berbicara lewat mikrofon, misalnya saat game atau rapat online.',
    like: 'Seperti speaker pribadi yang menempel di telinga.',
    fact: 'Headset dengan noise cancelling bisa meredam suara bising di sekitar.',
  },
  {
    id: 'printer', name: 'Printer', alt: 'Pencetak', cat: 'output',
    what: 'Printer adalah perangkat output yang mencetak teks atau gambar dari komputer ke atas kertas.',
    job: 'Mencetak dokumen, foto, dan tugas. Printer inkjet menyemprotkan tinta, printer laser memakai serbuk toner.',
    like: 'Seperti penulis yang menyalin layar menjadi tulisan di kertas.',
    fact: 'Tinta printer inkjet disemprotkan lewat lubang yang ukurannya lebih kecil dari rambut.',
  },
];

export const byId = Object.fromEntries(COMPONENTS.map((c) => [c.id, c]));
export const catOf = (c) => CATEGORIES.find((k) => k.id === c.cat);
