import { Semester, SubjectId } from '../types';

export interface LearningObjective {
  subjectId: SubjectId;
  semester: Semester;
  code: string;
  goal: string;
}

export interface ReadingComprehensionQuestion {
  id: string;
  prompt: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
}

export interface ReadingMaterial {
  id: string;
  subjectId: SubjectId;
  semester: Semester;
  title: string;
  focusLabel: string;
  paragraphs: string[];
  table: {
    caption: string;
    headers: string[];
    rows: string[][];
  };
  chart: {
    title: string;
    unit: string;
    bars: Array<{ label: string; value: number }>;
  };
  questions: ReadingComprehensionQuestion[];
}

export const LEARNING_OBJECTIVES: LearningObjective[] = [
  // MATEMATIKA
  {
    subjectId: 'matematika',
    semester: 1,
    code: 'TP-MTK-1.1',
    goal: 'Membaca, menulis, menentukan nilai tempat bilangan cacah hingga 100.000, serta menentukan KPK dan FPB dalam masalah sehari-hari.',
  },
  {
    subjectId: 'matematika',
    semester: 1,
    code: 'TP-MTK-1.2',
    goal: 'Melakukan operasi penjumlahan dan pengurangan pecahan serta mengubah pecahan menjadi bentuk desimal.',
  },
  {
    subjectId: 'matematika',
    semester: 1,
    code: 'TP-MTK-1.3',
    goal: 'Menghitung keliling dan luas bangun datar (segitiga, persegi, persegi panjang, dan gabungannya).',
  },
  {
    subjectId: 'matematika',
    semester: 2,
    code: 'TP-MTK-2.1',
    goal: 'Mengukur besar sudut dan mengidentifikasi sifat-sifat bangun datar serta jumlah sudut pada segitiga.',
  },
  {
    subjectId: 'matematika',
    semester: 2,
    code: 'TP-MTK-2.2',
    goal: 'Menghitung volume bangun ruang kubus dan balok menggunakan satuan baku cm³ dan liter.',
  },
  {
    subjectId: 'matematika',
    semester: 2,
    code: 'TP-MTK-2.3',
    goal: 'Membaca, menafsirkan, dan menyajikan data dalam bentuk tabel frekuensi, piktogram, dan diagram batang.',
  },

  // IPAS
  {
    subjectId: 'ipas',
    semester: 1,
    code: 'TP-IPAS-1.1',
    goal: 'Menjelaskan sifat-sifat cahaya dan bunyi serta keterkaitannya dengan fungsi indra penglihatan dan pendengaran.',
  },
  {
    subjectId: 'ipas',
    semester: 1,
    code: 'TP-IPAS-1.2',
    goal: 'Menganalisis hubungan antarmakhluk hidup dalam ekosistem melalui rantai makanan dan simbiosis.',
  },
  {
    subjectId: 'ipas',
    semester: 1,
    code: 'TP-IPAS-1.3',
    goal: 'Mengidentifikasi sifat kemagnetan, perubahan energi listrik, dan pemanfaatan teknologi sederhana.',
  },
  {
    subjectId: 'ipas',
    semester: 2,
    code: 'TP-IPAS-2.1',
    goal: 'Mendeskripsikan organ serta cara kerja sistem pernapasan dan sistem pencernaan manusia.',
  },
  {
    subjectId: 'ipas',
    semester: 2,
    code: 'TP-IPAS-2.2',
    goal: 'Menelaah letak geografis Indonesia sebagai negara maritim dan agraris beserta kekayaan alamnya.',
  },
  {
    subjectId: 'ipas',
    semester: 2,
    code: 'TP-IPAS-2.3',
    goal: 'Menceritakan sejarah perjuangan kemerdekaan Indonesia dan upaya melestarikan warisan budaya daerah.',
  },

  // BAHASA INDONESIA
  {
    subjectId: 'bahasa_indonesia',
    semester: 1,
    code: 'TP-BIN-1.1',
    goal: 'Memahami kosakata kata sifat, sinonim, antonim, serta makna imbuhan pe- dalam kalimat.',
  },
  {
    subjectId: 'bahasa_indonesia',
    semester: 1,
    code: 'TP-BIN-1.2',
    goal: 'Membedakan majas (personifikasi, hiperbola, metafora) dan menuliskan kalimat langsung secara tepat.',
  },
  {
    subjectId: 'bahasa_indonesia',
    semester: 1,
    code: 'TP-BIN-1.3',
    goal: 'Menemukan ide pokok dan informasi penting dari teks narasi maupun bacaan informatif.',
  },
  {
    subjectId: 'bahasa_indonesia',
    semester: 2,
    code: 'TP-BIN-2.1',
    goal: 'Membedakan kalimat fakta dan opini serta menyunting kalimat tidak efektif menjadi kalimat efektif.',
  },
  {
    subjectId: 'bahasa_indonesia',
    semester: 2,
    code: 'TP-BIN-2.2',
    goal: 'Memahami struktur teks prosedur dan bagian-bagian surat pribadi.',
  },
  {
    subjectId: 'bahasa_indonesia',
    semester: 2,
    code: 'TP-BIN-2.3',
    goal: 'Menerapkan kaidah kata baku dan penggunaan huruf kapital sesuai EYD V.',
  },

  // PENDIDIKAN PANCASILA
  {
    subjectId: 'pancasila',
    semester: 1,
    code: 'TP-PP-1.1',
    goal: 'Menunjukkan perilaku yang sesuai dengan nilai-nilai sila pertama hingga kelima Pancasila di sekolah dan rumah.',
  },
  {
    subjectId: 'pancasila',
    semester: 1,
    code: 'TP-PP-1.2',
    goal: 'Membedakan macam-macam norma (kesopanan, kesusilaan, agama, hukum) beserta sanksinya.',
  },
  {
    subjectId: 'pancasila',
    semester: 2,
    code: 'TP-PP-2.1',
    goal: 'Menjelaskan keseimbangan antara hak dan kewajiban siswa serta menerapkan musyawarah mufakat.',
  },
  {
    subjectId: 'pancasila',
    semester: 2,
    code: 'TP-PP-2.2',
    goal: 'Menghargai keberagaman suku, budaya, dan agama sesuai semboyan Bhinneka Tunggal Ika.',
  },

  // SENI BUDAYA
  {
    subjectId: 'seni_budaya',
    semester: 1,
    code: 'TP-SB-1.1',
    goal: 'Mengenal unsur seni rupa, warna primer-sekunder, serta prinsip keseimbangan dan ritme.',
  },
  {
    subjectId: 'seni_budaya',
    semester: 1,
    code: 'TP-SB-1.2',
    goal: 'Mengidentifikasi teknik kerajinan anyaman dan makrame dari bahan alam atau buatan.',
  },
  {
    subjectId: 'seni_budaya',
    semester: 2,
    code: 'TP-SB-2.1',
    goal: 'Membedakan tangga nada mayor-minor serta alat musik melodis dan ritmis tradisional Indonesia.',
  },
  {
    subjectId: 'seni_budaya',
    semester: 2,
    code: 'TP-SB-2.2',
    goal: 'Mengenal jenis tari tradisional Nusantara beserta pola lantai dan properti tarinya.',
  },
];

export const READING_MATERIALS: ReadingMaterial[] = [
  // MATEMATIKA — SEM 1
  {
    id: 'read-mtk-s1',
    subjectId: 'matematika',
    semester: 1,
    title: 'Panen Kebun Sekolah dan Pembagian Hasil Kelompok',
    focusLabel: 'Literasi Teks & Numerasi Pecahan / Perbandingan',
    paragraphs: [
      'Setiap hari Jumat, siswa Kelas V SD Nusantara merawat kebun sayur di halaman belakang sekolah. Pada panen bulan Oktober, empat kelompok siswa berhasil memetik bayam, kangkung, sawi, dan tomat ceri.',
      'Hasil panen tersebut dicatat dalam tabel oleh ketua kelas untuk dibagi rata ke kantin sehat dan orang tua siswa. Kelompok Melati memanen paling banyak, sedangkan kelompok Kenanga berencana menanam ulang bibit tomat pekan depan.',
    ],
    table: {
      caption: 'Tabel 1. Hasil Panen Kebun Kelas V Bulan Oktober',
      headers: ['Kelompok', 'Jenis Tanaman', 'Berat Panen (kg)', 'Bagian ke Kantin'],
      rows: [
        ['Kelompok Melati', 'Bayam Hijau', '12 kg', '1/2 bagian (6 kg)'],
        ['Kelompok Mawar', 'Kangkung', '8 kg', '1/4 bagian (2 kg)'],
        ['Kelompok Anggrek', 'Sawi Manis', '10 kg', '2/5 bagian (4 kg)'],
        ['Kelompok Kenanga', 'Tomat Ceri', '6 kg', '1/3 bagian (2 kg)'],
      ],
    },
    chart: {
      title: 'Grafik Berat Total Panen per Kelompok (kg)',
      unit: 'kg',
      bars: [
        { label: 'Melati', value: 12 },
        { label: 'Mawar', value: 8 },
        { label: 'Anggrek', value: 10 },
        { label: 'Kenanga', value: 6 },
      ],
    },
    questions: [
      {
        id: 'rmtk-s1-q1',
        prompt: 'Berdasarkan tabel dan grafik, berapa selisih berat panen kelompok tertinggi dan terendah?',
        options: ['4 kg', '6 kg', '8 kg', '12 kg'],
        correctIndex: 1,
        explanation: 'Tertinggi Kelompok Melati (12 kg) dan terendah Kelompok Kenanga (6 kg). Selisih = 12 - 6 = 6 kg.',
      },
      {
        id: 'rmtk-s1-q2',
        prompt: 'Berapa jumlah seluruh sayuran yang disalurkan keempat kelompok ke kantin sehat?',
        options: ['10 kg', '12 kg', '14 kg', '16 kg'],
        correctIndex: 2,
        explanation: 'Jumlah ke kantin = 6 + 2 + 4 + 2 = 14 kg.',
      },
    ],
  },

  // MATEMATIKA — SEM 2
  {
    id: 'read-mtk-s2',
    subjectId: 'matematika',
    semester: 2,
    title: 'Data Kunjungan Perpustakaan Sekolah Selama Sepekan',
    focusLabel: 'Literasi Data & Numerasi Diagram Batang',
    paragraphs: [
      'Ibu Pustakawan mencatat jumlah siswa Kelas V yang membaca buku di perpustakaan dari hari Senin hingga Jumat. Catatan ini digunakan untuk mengetahui hari paling ramai dan menambah rak buku bacaan baru.',
      'Pada hari Rabu, kunjungan meningkat tajam karena ada jadwal jam literasi pagi. Selain membaca buku cerita, beberapa siswa juga menggunakan pojok numerasi untuk berlatih bangun ruang.',
    ],
    table: {
      caption: 'Tabel 2. Rekap Pengunjung Perpustakaan Kelas V',
      headers: ['Hari', 'Siswa Laki-Laki', 'Siswa Perempuan', 'Total Pengunjung'],
      rows: [
        ['Senin', '12', '16', '28'],
        ['Selasa', '10', '14', '24'],
        ['Rabu', '15', '25', '40'],
        ['Kamis', '14', '16', '30'],
        ['Jumat', '8', '10', '18'],
      ],
    },
    chart: {
      title: 'Grafik Total Pengunjung Perpustakaan per Hari',
      unit: 'siswa',
      bars: [
        { label: 'Senin', value: 28 },
        { label: 'Selasa', value: 24 },
        { label: 'Rabu', value: 40 },
        { label: 'Kamis', value: 30 },
        { label: 'Jumat', value: 18 },
      ],
    },
    questions: [
      {
        id: 'rmtk-s2-q1',
        prompt: 'Berapakah rata-rata (mean) pengunjung perpustakaan per hari dari Senin sampai Jumat?',
        options: ['24 siswa', '28 siswa', '30 siswa', '32 siswa'],
        correctIndex: 1,
        explanation: 'Total pengunjung = 28 + 24 + 40 + 30 + 18 = 140 siswa. Rata-rata = 140 : 5 hari = 28 siswa.',
      },
      {
        id: 'rmtk-s2-q2',
        prompt: 'Pada hari apa selisih antara siswa perempuan dan laki-laki paling besar?',
        options: ['Senin (selisih 4)', 'Selasa (selisih 4)', 'Rabu (selisih 10)', 'Kamis (selisih 2)'],
        correctIndex: 2,
        explanation: 'Pada hari Rabu, siswa perempuan 25 dan laki-laki 15, sehingga selisihnya 25 - 15 = 10 siswa (paling besar).',
      },
    ],
  },

  // IPAS — SEM 1
  {
    id: 'read-ipas-s1',
    subjectId: 'ipas',
    semester: 1,
    title: 'Menjaga Keseimbangan Populasi di Ekosistem Sawah',
    focusLabel: 'Literasi Sains & Numerasi Populasi Ekosistem',
    paragraphs: [
      'Di sebuah desa agraris, petani mengamati jumlah makhluk hidup di petak sawah selama empat bulan. Padi menjadi produsen utama yang dimakan tikus dan belalang, sedangkan ular dan burung hantu berperan memangsa tikus.',
      'Ketika petani memburu ular secara berlebihan pada bulan Maret, populasi tikus langsung melonjak drastis karena predatornya berkurang. Akibatnya, hasil panen padi ikut terganggu hingga burung hantu kembali dilepasliarkan.',
    ],
    table: {
      caption: 'Tabel 3. Perkiraan Populasi Hewan di Petak Sawah',
      headers: ['Bulan', 'Tikus Sawah', 'Ular Sawah', 'Burung Hantu'],
      rows: [
        ['Januari', '20', '10', '6'],
        ['Februari', '24', '9', '6'],
        ['Maret (Ular diburu)', '58', '2', '4'],
        ['April (Burung hantu ditambah)', '22', '5', '12'],
      ],
    },
    chart: {
      title: 'Grafik Lonjakan Populasi Tikus Sawah (ekor)',
      unit: 'ekor',
      bars: [
        { label: 'Januari', value: 20 },
        { label: 'Februari', value: 24 },
        { label: 'Maret', value: 58 },
        { label: 'April', value: 22 },
      ],
    },
    questions: [
      {
        id: 'ripas-s1-q1',
        prompt: 'Mengapa populasi tikus melonjak menjadi 58 ekor pada bulan Maret?',
        options: [
          'Padi berhenti tumbuh di sawah',
          'Populasi ular sebagai pemangsa tikus turun drastis menjadi 2 ekor',
          'Burung hantu berkembang biak terlalu cepat',
          'Petani memberi pupuk tambahan',
        ],
        correctIndex: 1,
        explanation: 'Berkurangnya ular (konsumen pemakan tikus) menyebabkan tikus berkembang biak tak terkendali.',
      },
      {
        id: 'ripas-s1-q2',
        prompt: 'Berapa penurunan jumlah tikus dari bulan Maret ke bulan April setelah burung hantu ditambah?',
        options: ['26 ekor', '32 ekor', '36 ekor', '40 ekor'],
        correctIndex: 2,
        explanation: 'Penurunan = 58 - 22 = 36 ekor tikus.',
      },
    ],
  },

  // IPAS — SEM 2
  {
    id: 'read-ipas-s2',
    subjectId: 'ipas',
    semester: 2,
    title: 'Energi Udara dan Kecepatan Pernapasan Setelah Berolahraga',
    focusLabel: 'Literasi Tubuh Manusia & Numerasi Frekuensi Napas',
    paragraphs: [
      'Saat bernapas, udara masuk melalui hidung, melewati trakea, lalu menuju alveolus di dalam paru-paru untuk bertukar oksigen dan karbon dioksida. Saat tubuh beristirahat, kebutuhan oksigen lebih sedikit dibandingkan saat berlari.',
      'Dalam praktik IPAS Kelas V, empat siswa mengukur frekuensi napas (jumlah tarikan napas per menit) sebelum dan sesudah berlari mengelilingi lapangan sekolah selama 3 menit.',
    ],
    table: {
      caption: 'Tabel 4. Pengukuran Frekuensi Napas Siswa (kali per menit)',
      headers: ['Nama Siswa', 'Saat Duduk Santai', 'Setelah Lari 3 Menit', 'Kenaikan'],
      rows: [
        ['Bima', '18 kali/mnt', '34 kali/mnt', '+16 kali/mnt'],
        ['Siti', '20 kali/mnt', '38 kali/mnt', '+18 kali/mnt'],
        ['Edo', '16 kali/mnt', '32 kali/mnt', '+16 kali/mnt'],
        ['Lani', '19 kali/mnt', '35 kali/mnt', '+16 kali/mnt'],
      ],
    },
    chart: {
      title: 'Grafik Frekuensi Napas Setelah Lari 3 Menit (kali/menit)',
      unit: 'x/mnt',
      bars: [
        { label: 'Bima', value: 34 },
        { label: 'Siti', value: 38 },
        { label: 'Edo', value: 32 },
        { label: 'Lani', value: 35 },
      ],
    },
    questions: [
      {
        id: 'ripas-s2-q1',
        prompt: 'Mengapa frekuensi napas semua siswa meningkat setelah berlari?',
        options: [
          'Lambung membutuhkan lebih banyak air',
          'Otot membutuhkan lebih banyak oksigen untuk menghasilkan energi',
          'Paru-paru berhenti menyaring debu',
          'Alveolus mengecil saat bergerak',
        ],
        correctIndex: 1,
        explanation: 'Saat berolahraga, sel otot bekerja lebih keras sehingga tubuh bernapas lebih cepat untuk memasok oksigen.',
      },
      {
        id: 'ripas-s2-q2',
        prompt: 'Siapakah siswa yang mengalami kenaikan frekuensi napas paling tinggi menurut tabel?',
        options: ['Bima', 'Siti', 'Edo', 'Lani'],
        correctIndex: 1,
        explanation: 'Siti mengalami kenaikan +18 kali/menit (dari 20 menjadi 38), lebih tinggi dari siswa lain (+16).',
      },
    ],
  },

  // BAHASA INDONESIA — SEM 1
  {
    id: 'read-bind-s1',
    subjectId: 'bahasa_indonesia',
    semester: 1,
    title: 'Membaca Minat Baca Buku Cerita di Pojok Baca Kelas',
    focusLabel: 'Literasi Bacaan & Numerasi Peminjaman Buku',
    paragraphs: [
      'Pojok baca Kelas V menyediakan beragam buku mulai dari fabel, cerita rakyat Nusantara, biografi pahlawan, hingga komik sains. Setiap bulan, pustakawan cilik mencatat jenis buku yang paling sering dipinjam teman sekelas.',
      'Dari catatan tersebut, cerita rakyat dan komik sains paling diminati karena bahasanya hidup, penuh majas yang menarik, dan memiliki ilustrasi berwarna.',
    ],
    table: {
      caption: 'Tabel 5. Jumlah Peminjaman Buku Pojok Baca Bulan September',
      headers: ['Kategori Buku', 'Minggu 1', 'Minggu 2', 'Total'],
      rows: [
        ['Cerita Rakyat', '14', '18', '32'],
        ['Komik Sains', '16', '20', '36'],
        ['Fabel Nusantara', '10', '12', '22'],
        ['Biografi Pahlawan', '6', '8', '14'],
      ],
    },
    chart: {
      title: 'Grafik Total Peminjaman Buku per Kategori',
      unit: 'buku',
      bars: [
        { label: 'Cerita Rakyat', value: 32 },
        { label: 'Komik Sains', value: 36 },
        { label: 'Fabel', value: 22 },
        { label: 'Biografi', value: 14 },
      ],
    },
    questions: [
      {
        id: 'rbind-s1-q1',
        prompt: 'Apa ide pokok paragraf kedua pada bacaan di atas?',
        options: [
          'Biografi pahlawan tidak memiliki gambar',
          'Cerita rakyat dan komik sains paling diminati karena bahasanya hidup dan bergambar',
          'Pustakawan cilik bekerja setiap hari Minggu',
          'Semua buku di pojok baca harus dibeli siswa',
        ],
        correctIndex: 1,
        explanation: 'Kalimat utama paragraf kedua menjelaskan alasan cerita rakyat dan komik sains paling diminati.',
      },
      {
        id: 'rbind-s1-q2',
        prompt: 'Berapa jumlah total peminjaman buku kategori Fabel dan Biografi jika digabungkan?',
        options: ['32 buku', '36 buku', '38 buku', '46 buku'],
        correctIndex: 1,
        explanation: 'Fabel (22) + Biografi (14) = 36 buku.',
      },
    ],
  },

  // BAHASA INDONESIA — SEM 2
  {
    id: 'read-bind-s2',
    subjectId: 'bahasa_indonesia',
    semester: 2,
    title: 'Gerakan Mengurangi Sampah Plastik di Kantin Sekolah',
    focusLabel: 'Literasi Fakta-Opini & Numerasi Pengurangan Sampah',
    paragraphs: [
      'Sejak bulan Januari, SD Harapan Bangsa mewajibkan siswa membawa botol minum dan kotak bekal sendiri dari rumah. Kebijakan ini bertujuan mengurangi sampah plastik sekali pakai di lingkungan sekolah.',
      'Hasil penimbangan menunjukkan penurunan berat sampah plastik yang sangat nyata dari bulan ke bulan. Menurut kepala sekolah, kebiasaan baik ini sebaiknya terus dilanjutkan oleh seluruh warga sekolah.',
    ],
    table: {
      caption: 'Tabel 6. Berat Sampah Plastik Sekolah (Januari–April)',
      headers: ['Bulan', 'Berat Sampah Plastik (kg)', 'Keterangan Program'],
      rows: [
        ['Januari', '48 kg', 'Sosialisasi awal'],
        ['Februari', '32 kg', 'Mulai wajib bawa tumbler'],
        ['Maret', '20 kg', 'Kantin bebas sedotan plastik'],
        ['April', '12 kg', 'Evaluasi & lomba kelas bersih'],
      ],
    },
    chart: {
      title: 'Grafik Penurunan Sampah Plastik Sekolah (kg)',
      unit: 'kg',
      bars: [
        { label: 'Januari', value: 48 },
        { label: 'Februari', value: 32 },
        { label: 'Maret', value: 20 },
        { label: 'April', value: 12 },
      ],
    },
    questions: [
      {
        id: 'rbind-s2-q1',
        prompt: 'Manakah kalimat dari teks di atas yang merupakan FAKTA?',
        options: [
          'Kebijakan membawa tumbler adalah program paling menyenangkan.',
          'Kebiasaan baik ini sebaiknya terus dilanjutkan oleh warga sekolah.',
          'Pada bulan April berat sampah plastik tercatat sebesar 12 kg.',
          'Semua siswa pasti lebih suka membawa kotak bekal merah.',
        ],
        correctIndex: 2,
        explanation: 'Data hasil penimbangan 12 kg pada bulan April adalah fakta yang terukur dan objektif.',
      },
      {
        id: 'rbind-s2-q2',
        prompt: 'Berapa kilogram pengurangan sampah plastik dari bulan Januari ke bulan April?',
        options: ['24 kg', '28 kg', '36 kg', '40 kg'],
        correctIndex: 2,
        explanation: 'Pengurangan = 48 kg - 12 kg = 36 kg.',
      },
    ],
  },

  // PENDIDIKAN PANCASILA — SEM 1
  {
    id: 'read-ppkn-s1',
    subjectId: 'pancasila',
    semester: 1,
    title: 'Aksi Gotong Royong Kebersihan Kelas dan Lingkungan',
    focusLabel: 'Literasi Pancasila & Numerasi Partisipasi Siswa',
    paragraphs: [
      'Menjelang peringatan Hari Sumpah Pemuda, siswa Kelas V berdiskusi untuk mengadakan kerja bakti membersihkan taman sekolah. Setiap siswa memilih tugas sesuai kesepakatan bersama tanpa membeda-bedakan latar belakang teman.',
      'Kegiatan ini mencerminkan pengamalan sila ketiga Pancasila sekaligus membiasakan norma sopan santun dan tanggung jawab bersama di lingkungan sekolah.',
    ],
    table: {
      caption: 'Tabel 7. Pembagian Tugas Kerja Bakti Kelas V',
      headers: ['Regu Kerja', 'Jumlah Siswa', 'Area Tugas'],
      rows: [
        ['Regu Garuda', '8 siswa', 'Menyapu halaman depan'],
        ['Regu Banteng', '7 siswa', 'Merapikan taman bunga'],
        ['Regu Padi', '9 siswa', 'Membersihkan jendela & kelas'],
        ['Regu Kapas', '6 siswa', 'Memilah sampah organik & anorganik'],
      ],
    },
    chart: {
      title: 'Grafik Jumlah Anggota Tiap Regu Kerja Bakti',
      unit: 'siswa',
      bars: [
        { label: 'Garuda', value: 8 },
        { label: 'Banteng', value: 7 },
        { label: 'Padi', value: 9 },
        { label: 'Kapas', value: 6 },
      ],
    },
    questions: [
      {
        id: 'rppkn-s1-q1',
        prompt: 'Nilai Pancasila yang paling menonjol saat siswa bekerja bakti tanpa membeda-bedakan teman adalah sila ke- ...',
        options: ['Pertama', 'Kedua', 'Ketiga', 'Kelima'],
        correctIndex: 2,
        explanation: 'Kerja bakti dan gotong royong memperkuat persatuan Indonesia sesuai Sila ke-3.',
      },
      {
        id: 'rppkn-s1-q2',
        prompt: 'Berapa jumlah seluruh siswa Kelas V yang mengikuti kerja bakti berdasarkan tabel?',
        options: ['28 siswa', '30 siswa', '32 siswa', '34 siswa'],
        correctIndex: 1,
        explanation: 'Total siswa = 8 + 7 + 9 + 6 = 30 siswa.',
      },
    ],
  },

  // PENDIDIKAN PANCASILA — SEM 2
  {
    id: 'read-ppkn-s2',
    subjectId: 'pancasila',
    semester: 2,
    title: 'Musyawarah Pemilihan Tujuan Karya Wisata Kelas V',
    focusLabel: 'Literasi Musyawarah & Numerasi Suara Pemilihan',
    paragraphs: [
      'Pada awal semester genap, wali kelas mengajak siswa bermusyawarah untuk menentukan lokasi kunjungan belajar. Ada empat tempat wisata edukasi yang diusulkan melalui pemungutan suara secara tertib.',
      'Meskipun pilihan setiap siswa berbeda-beda, seluruh kelas sepakat menerima hasil terbanyak dengan lapang dada sesuai semangat Bhinneka Tunggal Ika dan sila keempat Pancasila.',
    ],
    table: {
      caption: 'Tabel 8. Hasil Pemungutan Suara Lokasi Kunjungan Belajar',
      headers: ['Lokasi Usulan', 'Jumlah Pemilih', 'Persentase'],
      rows: [
        ['Museum Geologi', '14 siswa', '40%'],
        ['Kebun Raya', '10 siswa', '29%'],
        ['Desa Wisata Batik', '7 siswa', '20%'],
        ['Planetarium', '4 siswa', '11%'],
      ],
    },
    chart: {
      title: 'Grafik Perolehan Suara Lokasi Kunjungan (siswa)',
      unit: 'suara',
      bars: [
        { label: 'Museum', value: 14 },
        { label: 'Kebun Raya', value: 10 },
        { label: 'Desa Batik', value: 7 },
        { label: 'Planetarium', value: 4 },
      ],
    },
    questions: [
      {
        id: 'rppkn-s2-q1',
        prompt: 'Jika jumlah pemilih seluruhnya ada 35 siswa, berapa selisih suara antara lokasi terbanyak dan paling sedikit?',
        options: ['7 suara', '10 suara', '11 suara', '14 suara'],
        correctIndex: 1,
        explanation: 'Terbanyak Museum Geologi (14) dikurangi paling sedikit Planetarium (4) = 10 suara.',
      },
      {
        id: 'rppkn-s2-q2',
        prompt: 'Bagaimana sikap siswa yang memilih Planetarium setelah Museum Geologi terpilih?',
        options: [
          'Meminta pemilihan diulang terus',
          'Menolak ikut kegiatan sekolah',
          'Menerima dan mendukung keputusan bersama dengan ikhlas',
          'Membuat jadwal sendiri di luar kelas',
        ],
        correctIndex: 2,
        explanation: 'Hasil musyawarah mufakat atau suara terbanyak wajib dihormati dan dilaksanakan bersama.',
      },
    ],
  },

  // SENI BUDAYA — SEM 1
  {
    id: 'read-sb-s1',
    subjectId: 'seni_budaya',
    semester: 1,
    title: 'Pameran Karya Anyaman dan Lukisan Warna Primer',
    focusLabel: 'Literasi Seni Rupa & Numerasi Karya Siswa',
    paragraphs: [
      'Di akhir semester ganjil, siswa Kelas V mengadakan pameran seni rupa di aula sekolah. Karya yang dipamerkan meliputi anyaman kertas motif sasag, lukisan warna primer-sekunder, dan gantungan makrame.',
      'Setiap pengunjung pameran memberikan stiker apresiasi pada papan pameran karya favorit mereka.',
    ],
    table: {
      caption: 'Tabel 9. Jumlah Karya & Stiker Apresiasi Pameran Seni Rupa',
      headers: ['Jenis Karya', 'Jumlah Karya', 'Stiker Apresiasi'],
      rows: [
        ['Anyaman Kertas', '12 karya', '36 stiker'],
        ['Lukisan Dekoratif', '10 karya', '42 stiker'],
        ['Makrame Gantungan', '8 karya', '24 stiker'],
      ],
    },
    chart: {
      title: 'Grafik Perolehan Stiker Apresiasi Pengunjung',
      unit: 'stiker',
      bars: [
        { label: 'Anyaman', value: 36 },
        { label: 'Lukisan', value: 42 },
        { label: 'Makrame', value: 24 },
      ],
    },
    questions: [
      {
        id: 'rsb-s1-q1',
        prompt: 'Berapa rata-rata stiker apresiasi yang diterima setiap karya Anyaman Kertas?',
        options: ['2 stiker', '3 stiker', '4 stiker', '6 stiker'],
        correctIndex: 1,
        explanation: '36 stiker dibagi 12 karya = 3 stiker per karya.',
      },
      {
        id: 'rsb-s1-q2',
        prompt: 'Teknik pembuatan karya Makrame pada tabel di atas dilakukan dengan cara ...',
        options: ['Menyimpul tali secara teratur', 'Menyilangkan bilah bambu', 'Mencetak tanah liat', 'Mengukir kayu'],
        correctIndex: 0,
        explanation: 'Makrame dibuat dengan teknik simpul tali yang rapi dan berpola.',
      },
    ],
  },

  // SENI BUDAYA — SEM 2
  {
    id: 'read-sb-s2',
    subjectId: 'seni_budaya',
    semester: 2,
    title: 'Pentas Musik Tradisional dan Tari Daerah Nusantara',
    focusLabel: 'Literasi Seni Pertunjukan & Numerasi Penampil',
    paragraphs: [
      'Untuk menyambut festival budaya sekolah, Kelas V menyiapkan pertunjukan kolaborasi alat musik melodis seperti angklung dan pianika yang dipadukan dengan alat musik ritmis kendang serta tifa.',
      'Selain musik, siswa juga menampilkan tari daerah dengan pola lantai lurus dan melingkar yang kompak.',
    ],
    table: {
      caption: 'Tabel 10. Daftar Penampil Pentas Budaya Kelas V',
      headers: ['Kelompok Pertunjukan', 'Jenis Alat / Tarian', 'Jumlah Penampil'],
      rows: [
        ['Tim Angklung', 'Alat Musik Melodis', '12 siswa'],
        ['Tim Perkusi Daerah', 'Alat Musik Ritmis (Kendang & Tifa)', '6 siswa'],
        ['Tim Tari Saman', 'Tari Tradisional Aceh', '8 siswa'],
        ['Tim Paduan Suara', 'Lagu Daerah Tangga Nada Mayor', '14 siswa'],
      ],
    },
    chart: {
      title: 'Grafik Jumlah Penampil Pentas Budaya (siswa)',
      unit: 'siswa',
      bars: [
        { label: 'Angklung', value: 12 },
        { label: 'Perkusi', value: 6 },
        { label: 'Tari Saman', value: 8 },
        { label: 'Paduan Suara', value: 14 },
      ],
    },
    questions: [
      {
        id: 'rsb-s2-q1',
        prompt: 'Manakah kelompok penampil yang menggunakan alat musik pengatur ketukan/irama (ritmis)?',
        options: ['Tim Angklung', 'Tim Perkusi Daerah', 'Tim Paduan Suara', 'Tim Tari Saman'],
        correctIndex: 1,
        explanation: 'Kendang dan Tifa pada Tim Perkusi Daerah adalah alat musik ritmis pengatur ketukan.',
      },
      {
        id: 'rsb-s2-q2',
        prompt: 'Berapa selisih jumlah penampil antara kelompok terbanyak dan kelompok paling sedikit?',
        options: ['6 siswa', '8 siswa', '10 siswa', '12 siswa'],
        correctIndex: 1,
        explanation: 'Terbanyak Paduan Suara (14) dikurangi paling sedikit Perkusi (6) = 8 siswa.',
      },
    ],
  },
];
