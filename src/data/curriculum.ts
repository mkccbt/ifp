import { QuizQuestion, SortChallenge, SubjectInfo } from '../types';
import { MATEMATIKA_QUESTIONS } from './questions/matematika';
import { IPAS_QUESTIONS } from './questions/ipas';
import { BAHASA_INDONESIA_QUESTIONS } from './questions/bahasaIndonesia';
import { PANCASILA_QUESTIONS } from './questions/pancasila';
import { SENI_BUDAYA_QUESTIONS } from './questions/seniBudaya';

export const SUBJECTS: SubjectInfo[] = [
  {
    id: 'matematika',
    name: 'Matematika',
    shortName: 'Matematika',
    description:
      'Bilangan cacah, KPK/FPB, pecahan, keliling & luas bangun datar, sudut, volume kubus/balok, serta pengolahan data.',
    topicsBySemester: {
      1: [
        'Bilangan Cacah & KPK/FPB',
        'Pecahan & Desimal',
        'Keliling & Luas Bangun Datar',
      ],
      2: [
        'Sudut & Sifat Bangun Datar',
        'Volume Kubus & Balok',
        'Pengolahan Data & Diagram',
      ],
    },
    accentColor: '#1D4ED8',
    softBg: '#EFF6FF',
    borderTint: '#BFDBFE',
    illustration: '/src/assets/images/subject_matematika_1795054377617.jpg',
  },
  {
    id: 'ipas',
    name: 'IPAS (Alam & Sosial)',
    shortName: 'IPAS',
    description:
      'Cahaya dan bunyi, ekosistem, magnet & listrik, organ pernapasan & pencernaan, serta geografi dan sejarah Indonesia.',
    topicsBySemester: {
      1: [
        'Cahaya, Bunyi & Indra',
        'Ekosistem & Rantai Makanan',
        'Magnet, Listrik & Teknologi',
      ],
      2: [
        'Pernapasan & Pencernaan Manusia',
        'Indonesia Kaya Raya',
        'Sejarah Perjuangan & Warisan Budaya',
      ],
    },
    accentColor: '#047857',
    softBg: '#ECFDF5',
    borderTint: '#A7F3D0',
    illustration: '/src/assets/images/subject_ipas_1795054376893.jpg',
  },
  {
    id: 'bahasa_indonesia',
    name: 'Bahasa Indonesia',
    shortName: 'B. Indonesia',
    description:
      'Kata sifat, sinonim-antonim, imbuhan, majas, ide pokok, kalimat fakta vs opini, teks prosedur, dan ejaan EYD V.',
    topicsBySemester: {
      1: [
        'Kata Sifat, Sinonim & Imbuhan',
        'Majas & Kalimat Langsung',
        'Teks Narasi & Ide Pokok',
      ],
      2: [
        'Fakta, Opini & Kalimat Efektif',
        'Teks Prosedur & Surat Pribadi',
        'Teks Eksplanasi & EYD V',
      ],
    },
    accentColor: '#B45309',
    softBg: '#FFFBEB',
    borderTint: '#FDE68A',
    illustration: '/src/assets/images/subject_literasi_budaya_1795054377644.jpg',
  },
  {
    id: 'pancasila',
    name: 'Pendidikan Pancasila',
    shortName: 'Pancasila',
    description:
      'Pengamalan nilai Pancasila, norma dan aturan di masyarakat, hak & kewajiban, musyawarah, serta Bhinneka Tunggal Ika.',
    topicsBySemester: {
      1: [
        'Nilai & Pengamalan Pancasila',
        'Norma & Aturan Masyarakat',
      ],
      2: [
        'Hak, Kewajiban & Musyawarah',
        'Bhinneka Tunggal Ika & NKRI',
      ],
    },
    accentColor: '#B91C1C',
    softBg: '#FEF2F2',
    borderTint: '#FECACA',
    illustration: '/src/assets/images/subject_literasi_budaya_1795054377644.jpg',
  },
  {
    id: 'seni_budaya',
    name: 'Seni Budaya',
    shortName: 'Seni Budaya',
    description:
      'Unsur & prinsip seni rupa, anyaman Nusantara, tangga nada dan alat musik daerah, serta tari dan pola lantai.',
    topicsBySemester: {
      1: [
        'Unsur & Prinsip Seni Rupa',
        'Seni Anyaman & Karya Daerah',
      ],
      2: [
        'Tangga Nada & Musik Daerah',
        'Tari Tradisional & Pola Lantai',
      ],
    },
    accentColor: '#6D28D9',
    softBg: '#F5F3FF',
    borderTint: '#DDD6FE',
    illustration: '/src/assets/images/subject_literasi_budaya_1795054377644.jpg',
  },
];

export const DEFAULT_QUESTIONS: QuizQuestion[] = [
  ...MATEMATIKA_QUESTIONS,
  ...IPAS_QUESTIONS,
  ...BAHASA_INDONESIA_QUESTIONS,
  ...PANCASILA_QUESTIONS,
  ...SENI_BUDAYA_QUESTIONS,
];

export const SORT_CHALLENGES: SortChallenge[] = [
  // MATEMATIKA
  {
    id: 'sort-mtk-s1',
    subjectId: 'matematika',
    semester: 1,
    title: 'Sortir Nilai Pecahan & Desimal (Semester 1)',
    instruction: 'Sentuh keranjang kiri atau kanan untuk mengelompokkan bilangan dengan tepat!',
    leftCategory: { title: 'Kurang dari 1/2', subtitle: 'Nilai < 0,5' },
    rightCategory: { title: 'Lebih dari 1/2', subtitle: 'Nilai > 0,5' },
    items: [
      { id: 'sm1-1', label: '1/4', category: 'left', reason: '1/4 = 0,25 lebih kecil dari 0,5 (1/2).' },
      { id: 'sm1-2', label: '3/4', category: 'right', reason: '3/4 = 0,75 lebih besar dari 0,5 (1/2).' },
      { id: 'sm1-3', label: '0,35', category: 'left', reason: '0,35 lebih kecil daripada 0,50.' },
      { id: 'sm1-4', label: '4/5', category: 'right', reason: '4/5 = 0,80 lebih besar dari 0,50.' },
      { id: 'sm1-5', label: '2/6', category: 'left', reason: '2/6 = 1/3 ≈ 0,33 lebih kecil dari 1/2.' },
      { id: 'sm1-6', label: '5/8', category: 'right', reason: 'Setengah dari 8 adalah 4/8, jadi 5/8 lebih dari 1/2.' },
      { id: 'sm1-7', label: '0,48', category: 'left', reason: '0,48 kurang sedikit dari 0,50.' },
      { id: 'sm1-8', label: '0,62', category: 'right', reason: '0,62 lebih besar daripada 0,50.' },
    ],
  },
  {
    id: 'sort-mtk-s2',
    subjectId: 'matematika',
    semester: 2,
    title: 'Sortir Bangun Datar vs Bangun Ruang (Semester 2)',
    instruction: 'Kelompokkan bentuk geometri berikut ke Bangun Datar (2D) atau Bangun Ruang (3D)!',
    leftCategory: { title: 'Bangun Datar (2D)', subtitle: 'Memiliki luas & keliling' },
    rightCategory: { title: 'Bangun Ruang (3D)', subtitle: 'Memiliki volume / isi' },
    items: [
      { id: 'sm2-1', label: 'Segitiga Sama Sisi', category: 'left', reason: 'Segitiga adalah bangun datar dua dimensi.' },
      { id: 'sm2-2', label: 'Kubus', category: 'right', reason: 'Kubus memiliki panjang, lebar, tinggi sehingga punya volume.' },
      { id: 'sm2-3', label: 'Jajar Genjang', category: 'left', reason: 'Jajar genjang adalah bangun datar segi empat.' },
      { id: 'sm2-4', label: 'Balok', category: 'right', reason: 'Balok merupakan bangun ruang dengan 6 sisi persegi panjang.' },
      { id: 'sm2-5', label: 'Trapesium', category: 'left', reason: 'Trapesium adalah bangun datar 2 dimensi.' },
      { id: 'sm2-6', label: 'Tabung', category: 'right', reason: 'Tabung adalah bangun ruang yang memiliki isi/volume.' },
      { id: 'sm2-7', label: 'Belah Ketupat', category: 'left', reason: 'Belah ketupat hanya memiliki luas dan keliling.' },
      { id: 'sm2-8', label: 'Prisma Segitiga', category: 'right', reason: 'Prisma segitiga adalah bangun ruang bervolume.' },
    ],
  },

  // IPAS
  {
    id: 'sort-ipas-s1',
    subjectId: 'ipas',
    semester: 1,
    title: 'Sortir Produsen vs Konsumen Ekosistem (Semester 1)',
    instruction: 'Kelompokkan komponen berikut ke dalam Produsen atau Konsumen pada rantai makanan!',
    leftCategory: { title: 'Produsen', subtitle: 'Menghasilkan makanan sendiri (fotosintesis)' },
    rightCategory: { title: 'Konsumen', subtitle: 'Memakan makhluk hidup lain' },
    items: [
      { id: 'si1-1', label: 'Tanaman Padi', category: 'left', reason: 'Padi berfotosintesis menghasilkan makanan sendiri.' },
      { id: 'si1-2', label: 'Belalang', category: 'right', reason: 'Belalang memakan daun sehingga menjadi konsumen.' },
      { id: 'si1-3', label: 'Rumput Hijau', category: 'left', reason: 'Rumput hijau memiliki klorofil untuk fotosintesis.' },
      { id: 'si1-4', label: 'Katak Sawah', category: 'right', reason: 'Katak memangsa serangga sehingga berperan sebagai konsumen.' },
      { id: 'si1-5', label: 'Fitoplankton', category: 'left', reason: 'Fitoplankton adalah tumbuhan air mikroskopis produsen di laut.' },
      { id: 'si1-6', label: 'Burung Elang', category: 'right', reason: 'Elang adalah konsumen puncak pemakan daging.' },
      { id: 'si1-7', label: 'Pohon Jagung', category: 'left', reason: 'Pohon jagung membuat energi dari cahaya matahari.' },
      { id: 'si1-8', label: 'Ular Sawah', category: 'right', reason: 'Ular memakan tikus dan katak sebagai konsumen.' },
    ],
  },
  {
    id: 'sort-ipas-s2',
    subjectId: 'ipas',
    semester: 2,
    title: 'Sortir Organ Pernapasan vs Pencernaan (Semester 2)',
    instruction: 'Pilah organ tubuh manusia berikut sesuai sistem fungsinya!',
    leftCategory: { title: 'Organ Pernapasan', subtitle: 'Mengatur pertukaran oksigen & CO₂' },
    rightCategory: { title: 'Organ Pencernaan', subtitle: 'Mengolah makanan & menyerap sari' },
    items: [
      { id: 'si2-1', label: 'Trakea (Tenggorokan)', category: 'left', reason: 'Trakea menyalurkan udara menuju bronkus dan paru-paru.' },
      { id: 'si2-2', label: 'Lambung', category: 'right', reason: 'Lambung mencerna makanan dengan bantuan enzim dan HCl.' },
      { id: 'si2-3', label: 'Alveolus', category: 'left', reason: 'Alveolus di paru-paru adalah tempat pertukaran O₂ dan CO₂.' },
      { id: 'si2-4', label: 'Usus Halus', category: 'right', reason: 'Usus halus menyerap sari-sari makanan ke dalam darah.' },
      { id: 'si2-5', label: 'Bronkus', category: 'left', reason: 'Bronkus adalah cabang saluran udara menuju paru-paru kanan & kiri.' },
      { id: 'si2-6', label: 'Kerongkongan (Esofagus)', category: 'right', reason: 'Kerongkongan mendorong makanan ke lambung dengan gerak peristaltik.' },
      { id: 'si2-7', label: 'Rongga Hidung', category: 'left', reason: 'Hidung menyaring dan menghangatkan udara yang dihirup.' },
      { id: 'si2-8', label: 'Usus Besar', category: 'right', reason: 'Usus besar menyerap kembali air dari sisa pencernaan.' },
    ],
  },

  // BAHASA INDONESIA
  {
    id: 'sort-bind-s1',
    subjectId: 'bahasa_indonesia',
    semester: 1,
    title: 'Sortir Majas Personifikasi vs Hiperbola (Semester 1)',
    instruction: 'Tentukan apakah kalimat bermajas berikut termasuk Personifikasi atau Hiperbola!',
    leftCategory: { title: 'Majas Personifikasi', subtitle: 'Benda mati seolah berperilaku manusia' },
    rightCategory: { title: 'Majas Hiperbola', subtitle: 'Melebih-lebihkan kenyataan' },
    items: [
      { id: 'sb1-1', label: 'Ombak laut menari-nari di tepi pantai.', category: 'left', reason: 'Ombak (benda mati) digambarkan bisa menari seperti manusia.' },
      { id: 'sb1-2', label: 'Suaranya menggelegar membelah langit.', category: 'right', reason: 'Pernyataan melebih-lebihkan kerasnya suara.' },
      { id: 'sb1-3', label: 'Alarm pagi membangunkanku dengan ramah.', category: 'left', reason: 'Alarm diberi sifat ramah seperti manusia.' },
      { id: 'sb1-4', label: 'Air matanya mengalir menganak sungai.', category: 'right', reason: 'Tangisan dilebih-lebihkan seolah menjadi sungai.' },
      { id: 'sb1-5', label: 'Angin malam berbisik di balik jendela.', category: 'left', reason: 'Angin digambarkan dapat berbisik layaknya manusia.' },
      { id: 'sb1-6', label: 'Ia berlari secepat kilat menuju sekolah.', category: 'right', reason: 'Kecepatan lari dilebih-lebihkan hingga setara kilat.' },
      { id: 'sb1-7', label: 'Matahari tersenyum cerah menyambut pagi.', category: 'left', reason: 'Matahari digambarkan bisa tersenyum.' },
      { id: 'sb1-8', label: 'Tumpukan buku itu setinggi gunung.', category: 'right', reason: 'Jumlah buku dilebih-lebihkan setinggi gunung.' },
    ],
  },
  {
    id: 'sort-bind-s2',
    subjectId: 'bahasa_indonesia',
    semester: 2,
    title: 'Sortir Kalimat Fakta vs Opini (Semester 2)',
    instruction: 'Tentukan apakah kalimat pada kartu termasuk Fakta atau Opini!',
    leftCategory: { title: 'Kalimat Fakta', subtitle: 'Dapat dibuktikan nyata & objektif' },
    rightCategory: { title: 'Kalimat Opini', subtitle: 'Pendapat pribadi atau penilaian' },
    items: [
      { id: 'sb2-1', label: 'Matahari terbit dari arah timur.', category: 'left', reason: 'Kejadian alam yang pasti dan dapat diamati semua orang.' },
      { id: 'sb2-2', label: 'Bakso di kantin sekolah paling enak sedunia.', category: 'right', reason: 'Kata "paling enak" adalah selera/pendapat pribadi.' },
      { id: 'sb2-3', label: 'Air mendidih pada suhu 100°C di tekanan normal.', category: 'left', reason: 'Dapat diukur dan dibuktikan secara ilmiah.' },
      { id: 'sb2-4', label: 'Menurutku warna biru lebih bagus dari merah.', category: 'right', reason: 'Mengandung kata "menurutku" dan penilaian subjektif.' },
      { id: 'sb2-5', label: 'Kemerdekaan RI diproklamasikan tahun 1945.', category: 'left', reason: 'Peristiwa sejarah nyata yang tercatat resmi.' },
      { id: 'sb2-6', label: 'Liburan ke pegunungan terasa sangat membosankan.', category: 'right', reason: 'Perasaan "membosankan" berbeda-beda pada tiap orang.' },
      { id: 'sb2-7', label: 'Satu minggu terdiri atas 7 hari.', category: 'left', reason: 'Ketetapan kalender yang objektif.' },
      { id: 'sb2-8', label: 'Sebaiknya semua siswa membawa payung hari ini.', category: 'right', reason: 'Berupa saran atau anjuran yang belum tentu berlaku untuk semua.' },
    ],
  },

  // PENDIDIKAN PANCASILA
  {
    id: 'sort-ppkn-s1',
    subjectId: 'pancasila',
    semester: 1,
    title: 'Sortir Norma Kesopanan vs Norma Hukum (Semester 1)',
    instruction: 'Kelompokkan contoh perilaku berikut ke dalam Norma Kesopanan atau Norma Hukum!',
    leftCategory: { title: 'Norma Kesopanan', subtitle: 'Sanksi sosial berupa teguran/malu' },
    rightCategory: { title: 'Norma Hukum', subtitle: 'Aturan tertulis negara dengan sanksi tegas' },
    items: [
      { id: 'sp1-1', label: 'Mengucapkan permisi saat lewat depan guru', category: 'left', reason: 'Tata krama pergaulan merupakan norma kesopanan.' },
      { id: 'sp1-2', label: 'Memakai helm saat berkendara di jalan raya', category: 'right', reason: 'Diatur dalam Undang-Undang Lalu Lintas dengan sanksi tilang.' },
      { id: 'sp1-3', label: 'Menerima sesuatu dengan tangan kanan', category: 'left', reason: 'Kebiasaan santun di masyarakat termasuk norma kesopanan.' },
      { id: 'sp1-4', label: 'Membayar pajak tepat pada waktunya', category: 'right', reason: 'Kewajiban warga negara yang diatur oleh undang-undang.' },
      { id: 'sp1-5', label: 'Berbicara lembut kepada orang tua', category: 'left', reason: 'Sikap hormat dalam bertutur kata adalah norma kesopanan.' },
      { id: 'sp1-6', label: 'Dilarang mencuri atau merusak fasilitas umum', category: 'right', reason: 'Pelanggaran pidana memiliki sanksi hukum tegas.' },
    ],
  },
  {
    id: 'sort-ppkn-s2',
    subjectId: 'pancasila',
    semester: 2,
    title: 'Sortir Hak vs Kewajiban Siswa (Semester 2)',
    instruction: 'Pilah pernyataan berikut ke dalam Hak atau Kewajiban siswa di sekolah!',
    leftCategory: { title: 'Hak Siswa', subtitle: 'Sesuatu yang layak diterima siswa' },
    rightCategory: { title: 'Kewajiban Siswa', subtitle: 'Tanggung jawab yang harus dikerjakan' },
    items: [
      { id: 'sp2-1', label: 'Mendapat pelajaran dari guru', category: 'left', reason: 'Belajar dan mendapat pengajaran adalah hak siswa.' },
      { id: 'sp2-2', label: 'Melaksanakan piket kebersihan kelas', category: 'right', reason: 'Menjaga kebersihan kelas adalah tugas bersama siswa.' },
      { id: 'sp2-3', label: 'Meminjam buku di perpustakaan', category: 'left', reason: 'Menggunakan fasilitas sekolah adalah hak siswa.' },
      { id: 'sp2-4', label: 'Mengenakan seragam rapi sesuai jadwal', category: 'right', reason: 'Menaati aturan berpakaian adalah kewajiban siswa.' },
      { id: 'sp2-5', label: 'Mengemukakan pendapat saat diskusi', category: 'left', reason: 'Setiap siswa berhak menyampaikan pendapat dengan santun.' },
      { id: 'sp2-6', label: 'Menghormati guru dan menyayangi teman', category: 'right', reason: 'Bersikap hormat kepada warga sekolah adalah kewajiban.' },
      { id: 'sp2-7', label: 'Mendapat nilai rapor hasil belajar', category: 'left', reason: 'Siswa berhak mengetahui hasil evaluasi belajarnya.' },
      { id: 'sp2-8', label: 'Datang ke sekolah tepat waktu', category: 'right', reason: 'Disiplin waktu adalah kewajiban seluruh siswa.' },
    ],
  },

  // SENI BUDAYA
  {
    id: 'sort-sb-s1',
    subjectId: 'seni_budaya',
    semester: 1,
    title: 'Sortir Warna Primer vs Sekunder & Netral (Semester 1)',
    instruction: 'Pilah nama warna berikut ke kelompok Warna Primer atau Warna Sekunder & Netral!',
    leftCategory: { title: 'Warna Primer', subtitle: 'Warna dasar (tidak dari campuran)' },
    rightCategory: { title: 'Warna Sekunder / Netral', subtitle: 'Hasil campuran atau warna netral' },
    items: [
      { id: 'ss1-1', label: 'Merah', category: 'left', reason: 'Merah adalah salah satu dari 3 warna dasar primer.' },
      { id: 'ss1-2', label: 'Hijau', category: 'right', reason: 'Hijau adalah warna sekunder hasil campuran biru dan kuning.' },
      { id: 'ss1-3', label: 'Kuning', category: 'left', reason: 'Kuning merupakan warna primer dasar.' },
      { id: 'ss1-4', label: 'Jingga (Oranye)', category: 'right', reason: 'Jingga adalah warna sekunder campuran merah dan kuning.' },
      { id: 'ss1-5', label: 'Biru', category: 'left', reason: 'Biru adalah warna primer dasar.' },
      { id: 'ss1-6', label: 'Ungu', category: 'right', reason: 'Ungu adalah warna sekunder campuran merah dan biru.' },
      { id: 'ss1-7', label: 'Hitam & Putih', category: 'right', reason: 'Hitam dan putih termasuk warna netral.' },
    ],
  },
  {
    id: 'sort-sb-s2',
    subjectId: 'seni_budaya',
    semester: 2,
    title: 'Sortir Alat Musik Melodis vs Ritmis (Semester 2)',
    instruction: 'Pilah alat musik berikut ke dalam kategori Melodis (bernada) atau Ritmis (pengatur irama)!',
    leftCategory: { title: 'Alat Musik Melodis', subtitle: 'Memiliki tangga nada (do-re-mi)' },
    rightCategory: { title: 'Alat Musik Ritmis', subtitle: 'Tidak bernada, pengatur ketukan' },
    items: [
      { id: 'ss2-1', label: 'Angklung', category: 'left', reason: 'Angklung bernada diatonis maupun pentatonis.' },
      { id: 'ss2-2', label: 'Kendang', category: 'right', reason: 'Kendang mengatur tempo dan ketukan irama (ritmis).' },
      { id: 'ss2-3', label: 'Pianika', category: 'left', reason: 'Pianika memiliki bilah nada untuk memainkan melodi.' },
      { id: 'ss2-4', label: 'Tifa Papua', category: 'right', reason: 'Tifa adalah alat musik pukul pengatur ritme.' },
      { id: 'ss2-5', label: 'Sasando', category: 'left', reason: 'Sasando dari NTT adalah alat musik petik bernada.' },
      { id: 'ss2-6', label: 'Tamborin', category: 'right', reason: 'Tamborin menghasilkan bunyi gemerincing untuk ritme.' },
      { id: 'ss2-7', label: 'Seruling / Rekorder', category: 'left', reason: 'Rekorder dapat memainkan tangga nada melodi lagu.' },
      { id: 'ss2-8', label: 'Rebana / Marakas', category: 'right', reason: 'Rebana dan marakas mengiringi ketukan lagu.' },
    ],
  },
];
