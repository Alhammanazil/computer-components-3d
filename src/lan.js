/** Warna kawat. `stripe` = kawat bergaris putih. */
export const WIRES = {
  'ow': { name: 'Oranye-putih', c: '#ff8a1a', stripe: true },
  'o': { name: 'Oranye', c: '#ff8a1a' },
  'gw': { name: 'Hijau-putih', c: '#2faa4a', stripe: true },
  'g': { name: 'Hijau', c: '#2faa4a' },
  'b': { name: 'Biru', c: '#2b5fd6' },
  'bw': { name: 'Biru-putih', c: '#2b5fd6', stripe: true },
  'brw': { name: 'Cokelat-putih', c: '#7a4a28', stripe: true },
  'br': { name: 'Cokelat', c: '#7a4a28' },
};

/** Urutan kawat pin 1 sampai 8, dilihat dari depan konektor dengan kait di bawah. */
export const STANDARDS = {
  t568a: { name: 'T568A', order: ['gw', 'g', 'ow', 'b', 'bw', 'o', 'brw', 'br'] },
  t568b: { name: 'T568B', order: ['ow', 'o', 'gw', 'b', 'bw', 'g', 'brw', 'br'] },
};

/** Fungsi tiap pin pada Ethernet 10/100 Mbps. Gigabit memakai kesemua 8 kawat. */
export const PIN_ROLE = ['TX+', 'TX−', 'RX+', '—', '—', 'RX−', '—', '—'];

export const LAN_CASES = [
  { n: 'Straight-through', ends: 'T568B ↔ T568B', use: 'Menyambung perangkat yang berbeda jenis: PC ke switch, switch ke router, laptop ke modem.' },
  { n: 'Crossover', ends: 'T568A ↔ T568B', use: 'Menyambung perangkat sejenis secara langsung: PC ke PC, atau switch ke switch pada perangkat lama.' },
];

export const LAN_TIPS = [
  'Panjang maksimal satu segmen kabel LAN adalah 100 meter.',
  'Kebanyakan perangkat modern punya Auto MDI-X, sehingga kabel straight pun bisa dipakai untuk menyambung PC ke PC.',
  'Pilih satu standar saja (T568B paling umum) agar semua kabel di kantormu seragam.',
  'Setelah dicrimping, selalu tes kabel dengan LAN tester sebelum dipasang.',
];
