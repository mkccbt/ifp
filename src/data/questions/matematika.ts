import { QuizQuestion } from '../../types';

function makeQuestion(
  id: string,
  semester: 1 | 2,
  topic: string,
  prompt: string,
  correct: string,
  distractors: [string, string, string],
  explanation: string,
  visual?: QuizQuestion['visual']
): QuizQuestion {
  // Deterministic rotation of correctIndex based on numeric hash of id so answers are well distributed A/B/C/D
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) % 997;
  }
  const correctIndex = (hash % 4) as 0 | 1 | 2 | 3;
  const options: [string, string, string, string] = ['', '', '', ''];
  let dIdx = 0;
  for (let i = 0; i < 4; i++) {
    if (i === correctIndex) {
      options[i] = correct;
    } else {
      options[i] = distractors[dIdx++];
    }
  }
  return {
    id,
    subjectId: 'matematika',
    semester,
    topic,
    prompt,
    options,
    correctIndex,
    explanation,
    ...(visual ? { visual } : {}),
  };
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
}

function lcm(a: number, b: number): number {
  return (a * b) / gcd(a, b);
}

function fmtId(n: number): string {
  return n.toLocaleString('id-ID');
}

// 1. Bilangan Cacah & KPK/FPB (Semester 1 - 30 soal)
function buildBilanganCacahQuestions(): QuizQuestion[] {
  const topic = 'Bilangan Cacah & KPK/FPB';
  const list: QuizQuestion[] = [];

  // 1-6: Nilai tempat bilangan hingga 100.000
  const placeItems = [
    { num: 87450, digit: 7, place: 'Ribuan', wrong: ['Puluh ribuan', 'Ratusan', 'Puluhan'], exp: 'Pada 87.450, angka 7 berada di posisi ribuan (7.000).' },
    { num: 64320, digit: 6, place: 'Puluh ribuan', wrong: ['Ribuan', 'Ratusan', 'Satuan'], exp: 'Pada 64.320, angka 6 bernilai 60.000 sehingga menempati puluh ribuan.' },
    { num: 45912, digit: 9, place: 'Ratusan', wrong: ['Ribuan', 'Puluhan', 'Satuan'], exp: 'Pada 45.912, angka 9 bernilai 900 sehingga menempati nilai tempat ratusan.' },
    { num: 92184, digit: 8, place: 'Puluhan', wrong: ['Ratusan', 'Ribuan', 'Satuan'], exp: 'Pada 92.184, angka 8 bernilai 80 sehingga menempati nilai tempat puluhan.' },
    { num: 53076, digit: 5, place: 'Puluh ribuan', wrong: ['Ribuan', 'Ratusan', 'Puluhan'], exp: 'Pada 53.076, angka 5 bernilai 50.000 atau puluh ribuan.' },
    { num: 78605, digit: 8, place: 'Ribuan', wrong: ['Puluh ribuan', 'Ratusan', 'Puluhan'], exp: 'Pada 78.605, angka 8 bernilai 8.000 sehingga menempati ribuan.' },
  ];
  placeItems.forEach((item, i) => {
    list.push(
      makeQuestion(
        `mtk-bc-${i + 1}`,
        1,
        topic,
        `Nilai tempat angka ${item.digit} pada bilangan ${fmtId(item.num)} adalah ...`,
        item.place,
        item.wrong as [string, string, string],
        item.exp
      )
    );
  });

  // 7-12: Penjumlahan & Pengurangan bilangan cacah
  const arithItems = [
    { a: 24500, b: 13250, op: '+' as const },
    { a: 48750, b: 21500, op: '-' as const },
    { a: 36400, b: 28600, op: '+' as const },
    { a: 75000, b: 32450, op: '-' as const },
    { a: 18900, b: 41100, op: '+' as const },
    { a: 90400, b: 45150, op: '-' as const },
  ];
  arithItems.forEach((item, i) => {
    const ans = item.op === '+' ? item.a + item.b : item.a - item.b;
    list.push(
      makeQuestion(
        `mtk-bc-${7 + i}`,
        1,
        topic,
        `Hasil dari ${fmtId(item.a)} ${item.op} ${fmtId(item.b)} adalah ...`,
        fmtId(ans),
        [fmtId(ans - 1000), fmtId(ans + 1500), fmtId(ans + 500)],
        `${fmtId(item.a)} ${item.op} ${fmtId(item.b)} = ${fmtId(ans)}.`
      )
    );
  });

  // 13-18: Perkalian & Pembagian dasar/kontekstual
  const mulDiv = [
    { prompt: 'Sebuah toko buku menjual 125 pak pensil. Setiap pak berisi 12 pensil. Jumlah seluruh pensil adalah ...', ans: '1.500 pensil', wrong: ['1.250 pensil', '1.400 pensil', '1.620 pensil'], exp: '125 × 12 = 1.500 pensil.' },
    { prompt: 'Panitia menyiapkan 840 kotak kue untuk dibagikan rata kepada 24 kelas. Setiap kelas menerima ...', ans: '35 kotak', wrong: ['30 kotak', '40 kotak', '42 kotak'], exp: '840 : 24 = 35 kotak per kelas.' },
    { prompt: 'Hasil dari 250 × 16 adalah ...', ans: '4.000', wrong: ['3.500', '4.250', '4.500'], exp: '250 × 16 = (250 × 4) × 4 = 1.000 × 4 = 4.000.' },
    { prompt: 'Hasil dari 1.440 : 12 adalah ...', ans: '120', wrong: ['102', '112', '140'], exp: '144 : 12 = 12, maka 1.440 : 12 = 120.' },
    { prompt: 'Harga 1 buku tulis Rp4.500. Jika Beni membeli 8 buku tulis, total yang harus dibayar adalah ...', ans: 'Rp36.000', wrong: ['Rp32.000', 'Rp34.500', 'Rp40.000'], exp: '4.500 × 8 = Rp36.000.' },
    { prompt: 'Ibu memiliki uang Rp85.000 lalu membeli tas sekolah seharga Rp57.500. Sisa uang Ibu adalah ...', ans: 'Rp27.500', wrong: ['Rp22.500', 'Rp28.500', 'Rp32.500'], exp: '85.000 - 57.500 = Rp27.500.' },
  ];
  mulDiv.forEach((m, i) => {
    list.push(makeQuestion(`mtk-bc-${13 + i}`, 1, topic, m.prompt, m.ans, m.wrong as [string, string, string], m.exp));
  });

  // 19-24: KPK
  const kpkPairs: Array<[number, number]> = [
    [12, 18],
    [8, 12],
    [6, 15],
    [10, 14],
    [9, 12],
    [15, 20],
  ];
  kpkPairs.forEach(([a, b], i) => {
    const val = lcm(a, b);
    list.push(
      makeQuestion(
        `mtk-bc-${19 + i}`,
        1,
        topic,
        `Kelipatan Persekutuan Terkecil (KPK) dari ${a} dan ${b} adalah ...`,
        String(val),
        [String(gcd(a, b)), String(val * 2), String(val - a > 0 ? val - a : val + b)],
        `Kelipatan persekutuan terkecil dari ${a} dan ${b} adalah ${val}.`
      )
    );
  });

  // 25-30: FPB & Soal Cerita KPK/FPB
  const fpbPairs: Array<[number, number]> = [
    [24, 36],
    [18, 27],
    [30, 45],
    [28, 42],
  ];
  fpbPairs.forEach(([a, b], i) => {
    const val = gcd(a, b);
    list.push(
      makeQuestion(
        `mtk-bc-${25 + i}`,
        1,
        topic,
        `Faktor Persekutuan Terbesar (FPB) dari ${a} dan ${b} adalah ...`,
        String(val),
        [String(Math.max(2, val - 2)), String(val * 2), String(lcm(a, b))],
        `Faktor pembagi terbesar yang sama-sama membagi ${a} dan ${b} adalah ${val}.`
      )
    );
  });

  list.push(
    makeQuestion(
      'mtk-bc-29',
      1,
      topic,
      'Lampu A berkedip setiap 4 detik dan lampu B setiap 6 detik. Jika berkedip bersamaan sekarang, kapan keduanya berkedip bersamaan lagi?',
      '12 detik lagi',
      ['10 detik lagi', '18 detik lagi', '24 detik lagi'],
      'Soal kejadian bersamaan memakai KPK. KPK dari 4 dan 6 adalah 12 detik.'
    ),
    makeQuestion(
      'mtk-bc-30',
      1,
      topic,
      'Ibu mempunyai 18 jeruk dan 24 apel yang akan dimasukkan ke dalam kantong plastik sama banyak. Jumlah kantong terbanyak adalah ...',
      '6 kantong',
      ['4 kantong', '8 kantong', '12 kantong'],
      'Pembagian sama banyak terbanyak menggunakan FPB. FPB(18, 24) = 6 kantong.'
    )
  );

  return list;
}

// 2. Pecahan & Desimal (Semester 1 - 30 soal)
function buildPecahanDesimalQuestions(): QuizQuestion[] {
  const topic = 'Pecahan & Desimal';
  const list: QuizQuestion[] = [];

  // 1-8: Penjumlahan & pengurangan pecahan
  const fracOps = [
    { prompt: 'Hasil penjumlahan 2/5 + 1/2 adalah ...', ans: '9/10', w: ['3/7', '7/10', '3/10'], exp: '2/5 + 1/2 = 4/10 + 5/10 = 9/10.', vis: { kind: 'fraction_bar' as const, numerator: 4, denominator: 10, label: '2/5 = 4/10' } },
    { prompt: 'Hasil penjumlahan 1/3 + 1/6 adalah ...', ans: '1/2', w: ['2/9', '1/3', '5/6'], exp: '1/3 = 2/6, sehingga 2/6 + 1/6 = 3/6 = 1/2.' },
    { prompt: 'Hasil penjumlahan 3/4 + 1/8 adalah ...', ans: '7/8', w: ['4/12', '5/8', '1/2'], exp: '3/4 = 6/8, jadi 6/8 + 1/8 = 7/8.' },
    { prompt: 'Hasil pengurangan 5/6 - 1/3 adalah ...', ans: '1/2', w: ['4/3', '1/6', '2/3'], exp: '1/3 = 2/6, maka 5/6 - 2/6 = 3/6 = 1/2.' },
    { prompt: 'Hasil pengurangan 4/5 - 1/2 adalah ...', ans: '3/10', w: ['3/3', '1/5', '7/10'], exp: '4/5 = 8/10 dan 1/2 = 5/10, sehingga 8/10 - 5/10 = 3/10.' },
    { prompt: 'Hasil penjumlahan 1/4 + 2/3 adalah ...', ans: '11/12', w: ['3/7', '7/12', '5/12'], exp: 'Samakan penyebut menjadi 12: 3/12 + 8/12 = 11/12.' },
    { prompt: 'Hasil pengurangan 7/8 - 1/4 adalah ...', ans: '5/8', w: ['6/4', '3/8', '1/2'], exp: '1/4 = 2/8, maka 7/8 - 2/8 = 5/8.' },
    { prompt: 'Hasil penjumlahan 2/3 + 1/4 adalah ...', ans: '11/12', w: ['3/7', '9/12', '5/7'], exp: '2/3 = 8/12 dan 1/4 = 3/12, jumlahnya 11/12.' },
  ];
  fracOps.forEach((f, i) => {
    list.push(makeQuestion(`mtk-pd-${i + 1}`, 1, topic, f.prompt, f.ans, f.w as [string, string, string], f.exp, f.vis));
  });

  // 9-14: Pecahan ke desimal
  const toDec = [
    { frac: '3/4', dec: '0,75', w: ['0,25', '0,50', '0,80'], exp: '3/4 = 75/100 = 0,75.', vis: { kind: 'fraction_bar' as const, numerator: 3, denominator: 4, label: '3/4' } },
    { frac: '1/2', dec: '0,5', w: ['0,2', '0,25', '0,75'], exp: '1/2 = 5/10 = 0,5.' },
    { frac: '1/4', dec: '0,25', w: ['0,14', '0,4', '0,5'], exp: '1/4 = 25/100 = 0,25.' },
    { frac: '2/5', dec: '0,4', w: ['0,2', '0,25', '0,5'], exp: '2/5 = 4/10 = 0,4.' },
    { frac: '3/5', dec: '0,6', w: ['0,3', '0,35', '0,8'], exp: '3/5 = 6/10 = 0,6.' },
    { frac: '4/5', dec: '0,8', w: ['0,4', '0,45', '0,75'], exp: '4/5 = 8/10 = 0,8.' },
  ];
  toDec.forEach((d, i) => {
    list.push(
      makeQuestion(
        `mtk-pd-${9 + i}`,
        1,
        topic,
        `Bentuk desimal dari pecahan ${d.frac} adalah ...`,
        d.dec,
        d.w as [string, string, string],
        d.exp,
        d.vis
      )
    );
  });

  // 15-20: Menyederhanakan pecahan & pecahan senilai
  const simplify = [
    { prompt: 'Bentuk pecahan paling sederhana dari 6/8 adalah ...', ans: '3/4', w: ['2/4', '2/3', '4/5'], exp: 'Bagi pembilang dan penyebut dengan FPB(6,8) = 2 → 3/4.' },
    { prompt: 'Bentuk paling sederhana dari 12/16 adalah ...', ans: '3/4', w: ['6/8', '2/3', '4/6'], exp: 'Bagi 12 dan 16 dengan 4, hasilnya 3/4.' },
    { prompt: 'Bentuk paling sederhana dari 10/15 adalah ...', ans: '2/3', w: ['1/3', '3/5', '5/6'], exp: 'Bagi 10 dan 15 dengan FPB = 5, diperoleh 2/3.' },
    { prompt: 'Pecahan yang senilai dengan 2/3 adalah ...', ans: '8/12', w: ['4/9', '6/10', '5/6'], exp: '2/3 dikalikan 4/4 menjadi 8/12.' },
    { prompt: 'Pecahan yang senilai dengan 3/5 adalah ...', ans: '9/15', w: ['6/15', '9/10', '12/15'], exp: '3/5 dikalikan 3/3 menghasilkan 9/15.' },
    { prompt: 'Bentuk paling sederhana dari 15/25 adalah ...', ans: '3/5', w: ['2/5', '5/8', '4/5'], exp: 'Bagi 15 dan 25 dengan 5, hasilnya 3/5.' },
  ];
  simplify.forEach((s, i) => {
    list.push(makeQuestion(`mtk-pd-${15 + i}`, 1, topic, s.prompt, s.ans, s.w as [string, string, string], s.exp));
  });

  // 21-25: Operasi desimal & soal cerita
  const decOps = [
    { prompt: 'Ibu membeli 2,5 kg gula dan memakai 1,25 kg untuk membuat kue. Sisa gula Ibu adalah ...', ans: '1,25 kg', w: ['1,35 kg', '1,75 kg', '0,75 kg'], exp: '2,50 - 1,25 = 1,25 kg.' },
    { prompt: 'Hasil penjumlahan 3,45 + 1,25 adalah ...', ans: '4,70', w: ['4,60', '4,80', '5,70'], exp: '3,45 + 1,25 = 4,70.' },
    { prompt: 'Hasil pengurangan 6,8 - 2,35 adalah ...', ans: '4,45', w: ['4,55', '4,35', '3,45'], exp: '6,80 - 2,35 = 4,45.' },
    { prompt: 'Sebatang tali panjangnya 4,5 meter dipotong 1,8 meter. Sisa panjang tali adalah ...', ans: '2,7 meter', w: ['2,3 meter', '3,7 meter', '2,9 meter'], exp: '4,5 - 1,8 = 2,7 meter.' },
    { prompt: 'Andi memiliki 0,75 liter susu dan menambah lagi 0,5 liter. Jumlah susu Andi sekarang adalah ...', ans: '1,25 liter', w: ['0,80 liter', '1,05 liter', '1,50 liter'], exp: '0,75 + 0,50 = 1,25 liter.' },
  ];
  decOps.forEach((d, i) => {
    list.push(makeQuestion(`mtk-pd-${21 + i}`, 1, topic, d.prompt, d.ans, d.w as [string, string, string], d.exp));
  });

  // 26-30: Membandingkan & mengurutkan pecahan/persen
  const compare = [
    { prompt: 'Tanda perbandingan yang tepat untuk 2/3 ... 3/5 adalah ...', ans: '>', w: ['<', '=', '≤'], exp: '2/3 = 10/15 dan 3/5 = 9/15. Karena 10/15 > 9/15, maka 2/3 > 3/5.' },
    { prompt: 'Bentuk persen dari pecahan 3/4 adalah ...', ans: '75%', w: ['25%', '50%', '80%'], exp: '3/4 × 100% = 75%.' },
    { prompt: 'Bentuk pecahan biasa paling sederhana dari 40% adalah ...', ans: '2/5', w: ['1/4', '3/5', '4/5'], exp: '40% = 40/100 = 2/5.' },
    { prompt: 'Manakah bilangan yang nilainya paling besar?', ans: '0,8', w: ['3/4', '65%', '1/2'], exp: '0,8 = 0,80; 3/4 = 0,75; 65% = 0,65; 1/2 = 0,50. Terbesar adalah 0,8.' },
    { prompt: 'Urutan bilangan dari yang terkecil ke terbesar adalah ...', ans: '1/4 ; 0,5 ; 75%', w: ['0,5 ; 1/4 ; 75%', '75% ; 0,5 ; 1/4', '1/4 ; 75% ; 0,5'], exp: '1/4 (0,25) < 0,5 (0,50) < 75% (0,75).' },
  ];
  compare.forEach((c, i) => {
    list.push(makeQuestion(`mtk-pd-${26 + i}`, 1, topic, c.prompt, c.ans, c.w as [string, string, string], c.exp));
  });

  return list;
}

// 3. Keliling & Luas Bangun Datar (Semester 1 - 30 soal)
function buildKelilingLuasQuestions(): QuizQuestion[] {
  const topic = 'Keliling & Luas Bangun Datar';
  const list: QuizQuestion[] = [];

  // 1-6: Persegi (keliling & luas)
  [6, 9, 12].forEach((s, i) => {
    const k = 4 * s;
    const l = s * s;
    list.push(
      makeQuestion(
        `mtk-kl-${i * 2 + 1}`,
        1,
        topic,
        `Sebuah persegi memiliki panjang sisi ${s} cm. Keliling persegi tersebut adalah ...`,
        `${k} cm`,
        [`${k - 4} cm`, `${l} cm`, `${s * 2} cm`],
        `Keliling persegi = 4 × sisi = 4 × ${s} = ${k} cm.`
      ),
      makeQuestion(
        `mtk-kl-${i * 2 + 2}`,
        1,
        topic,
        `Luas persegi dengan panjang sisi ${s} cm adalah ...`,
        `${l} cm²`,
        [`${k} cm²`, `${l + 10} cm²`, `${s * 2} cm²`],
        `Luas persegi = sisi × sisi = ${s} × ${s} = ${l} cm².`
      )
    );
  });

  // 7-14: Persegi panjang (keliling & luas)
  const rects: Array<[number, number]> = [
    [10, 6],
    [14, 8],
    [15, 7],
    [12, 9],
  ];
  rects.forEach(([p, l], i) => {
    const kel = 2 * (p + l);
    const luas = p * l;
    list.push(
      makeQuestion(
        `mtk-kl-${7 + i * 2}`,
        1,
        topic,
        `Keliling persegi panjang dengan panjang ${p} cm dan lebar ${l} cm adalah ...`,
        `${kel} cm`,
        [`${p + l} cm`, `${luas} cm`, `${kel + 4} cm`],
        `Keliling = 2 × (${p} + ${l}) = 2 × ${p + l} = ${kel} cm.`
      ),
      makeQuestion(
        `mtk-kl-${8 + i * 2}`,
        1,
        topic,
        `Sebuah taman berbentuk persegi panjang berukuran ${p} m × ${l} m. Luas taman adalah ...`,
        `${luas} m²`,
        [`${kel} m²`, `${luas - 10} m²`, `${luas + 12} m²`],
        `Luas = panjang × lebar = ${p} × ${l} = ${luas} m².`
      )
    );
  });

  // 15-22: Segitiga (luas & keliling)
  const tris: Array<[number, number]> = [
    [12, 7],
    [10, 8],
    [16, 9],
    [14, 6],
  ];
  tris.forEach(([a, t], i) => {
    const luas = (a * t) / 2;
    list.push(
      makeQuestion(
        `mtk-kl-${15 + i}`,
        1,
        topic,
        `Sebuah segitiga mempunyai alas ${a} cm dan tinggi ${t} cm. Luas segitiga tersebut adalah ...`,
        `${luas} cm²`,
        [`${a * t} cm²`, `${a + t} cm²`, `${luas + 8} cm²`],
        `Luas segitiga = 1/2 × alas × tinggi = 1/2 × ${a} × ${t} = ${luas} cm².`,
        { kind: 'triangle', base: a, height: t, unit: 'cm' }
      )
    );
  });

  const triPerim: Array<[number, number, number]> = [
    [7, 8, 10],
    [9, 9, 9],
    [12, 10, 8],
    [6, 8, 10],
  ];
  triPerim.forEach(([a, b, c], i) => {
    const k = a + b + c;
    list.push(
      makeQuestion(
        `mtk-kl-${19 + i}`,
        1,
        topic,
        `Keliling segitiga yang panjang ketiga sisinya ${a} cm, ${b} cm, dan ${c} cm adalah ...`,
        `${k} cm`,
        [`${k - 3} cm`, `${k + 4} cm`, `${a * b} cm`],
        `Keliling segitiga = jumlah seluruh sisi = ${a} + ${b} + ${c} = ${k} cm.`
      )
    );
  });

  // 23-30: Jajar genjang, belah ketupat, layang-layang, trapesium & soal balik
  const extraGeo = [
    { prompt: 'Jajar genjang memiliki alas 12 cm dan tinggi 8 cm. Luasnya adalah ...', ans: '96 cm²', w: ['48 cm²', '40 cm²', '80 cm²'], exp: 'Luas jajar genjang = alas × tinggi = 12 × 8 = 96 cm².' },
    { prompt: 'Belah ketupat memiliki diagonal 10 cm dan 14 cm. Luas belah ketupat tersebut adalah ...', ans: '70 cm²', w: ['140 cm²', '24 cm²', '48 cm²'], exp: 'Luas belah ketupat = 1/2 × d1 × d2 = 1/2 × 10 × 14 = 70 cm².' },
    { prompt: 'Layang-layang mempunyai diagonal 16 cm dan 9 cm. Luas layang-layang adalah ...', ans: '72 cm²', w: ['144 cm²', '50 cm²', '64 cm²'], exp: 'Luas layang-layang = 1/2 × 16 × 9 = 72 cm².' },
    { prompt: 'Trapesium mempunyai sisi sejajar 8 cm dan 12 cm serta tinggi 6 cm. Luas trapesium adalah ...', ans: '60 cm²', w: ['120 cm²', '48 cm²', '80 cm²'], exp: 'Luas trapesium = 1/2 × (8 + 12) × 6 = 1/2 × 20 × 6 = 60 cm².' },
    { prompt: 'Keliling sebuah persegi adalah 64 cm. Panjang sisi persegi tersebut adalah ...', ans: '16 cm', w: ['8 cm', '12 cm', '32 cm'], exp: 'Sisi persegi = Keliling : 4 = 64 : 4 = 16 cm.' },
    { prompt: 'Luas sebuah persegi panjang adalah 90 cm² dan panjangnya 15 cm. Lebarnya adalah ...', ans: '6 cm', w: ['5 cm', '8 cm', '10 cm'], exp: 'Lebar = Luas : panjang = 90 : 15 = 6 cm.' },
    { prompt: 'Sebuah kolam berbentuk persegi memiliki luas 81 m². Panjang sisi kolam adalah ...', ans: '9 m', w: ['7 m', '8 m', '11 m'], exp: '√81 = 9, karena 9 × 9 = 81 m².' },
    { prompt: 'Keliling segitiga sama sisi adalah 45 cm. Panjang setiap sisi segitiga tersebut adalah ...', ans: '15 cm', w: ['9 cm', '12 cm', '18 cm'], exp: 'Ketiga sisi sama panjang, maka sisi = 45 : 3 = 15 cm.' },
  ];
  extraGeo.forEach((g, i) => {
    list.push(makeQuestion(`mtk-kl-${23 + i}`, 1, topic, g.prompt, g.ans, g.w as [string, string, string], g.exp));
  });

  return list;
}

// 4. Sudut & Sifat Bangun Datar (Semester 2 - 30 soal)
function buildSudutSifatQuestions(): QuizQuestion[] {
  const topic = 'Sudut & Sifat Bangun Datar';
  const list: QuizQuestion[] = [];

  const angleQ = [
    { prompt: 'Sudut yang besarnya tepat 90° disebut sudut ...', ans: 'Siku-siku', w: ['Lancip', 'Tumpul', 'Lurus'], exp: 'Sudut 90° disebut sudut siku-siku.', vis: { kind: 'angle' as const, degrees: 90, label: '90°' } },
    { prompt: 'Sudut yang besarnya kurang dari 90° (misalnya 45° atau 60°) disebut sudut ...', ans: 'Lancip', w: ['Siku-siku', 'Tumpul', 'Refleks'], exp: 'Sudut antara 0° dan 90° disebut sudut lancip.' },
    { prompt: 'Sudut yang besarnya antara 90° dan 180° (misalnya 125°) disebut sudut ...', ans: 'Tumpul', w: ['Lancip', 'Siku-siku', 'Penuh'], exp: 'Sudut lebih dari 90° dan kurang dari 180° adalah sudut tumpul.' },
    { prompt: 'Besar sudut lurus adalah ...', ans: '180°', w: ['90°', '270°', '360°'], exp: 'Sudut lurus membentuk garis lurus dengan besar 180°.' },
    { prompt: 'Satu putaran penuh lingkaran memiliki besar sudut ...', ans: '360°', w: ['90°', '180°', '270°'], exp: 'Satu putaran penuh besarnya 360°.' },
    { prompt: 'Alat baku yang digunakan untuk mengukur besar sudut dalam satuan derajat adalah ...', ans: 'Busur derajat', w: ['Jangka', 'Penggaris segitiga', 'Meteran gulung'], exp: 'Busur derajat digunakan untuk mengukur dan menggambar sudut.' },
    { prompt: 'Pada pukul 03.00 tepat, jarum pendek dan jarum panjang jam membentuk sudut ...', ans: '90° (siku-siku)', w: ['45° (lancip)', '120° (tumpul)', '180° (lurus)'], exp: 'Pukul 03.00 berjarak 3 angka jam = 3 × 30° = 90° (siku-siku).' },
    { prompt: 'Pada pukul 06.00 tepat, kedua jarum jam membentuk sudut ...', ans: '180° (lurus)', w: ['90° (siku-siku)', '120° (tumpul)', '360° (penuh)'], exp: 'Pukul 06.00 berjarak 6 angka jam = 6 × 30° = 180° (sudut lurus).' },
    { prompt: 'Pada pukul 02.00 tepat, sudut terkecil antara jarum jam dan jarum menit adalah ...', ans: '60°', w: ['30°', '90°', '120°'], exp: 'Setiap 1 angka jam bernilai 30°. Pukul 02.00 = 2 × 30° = 60°.' },
    { prompt: 'Pada pukul 04.00 tepat, sudut terkecil yang terbentuk oleh kedua jarum jam adalah ...', ans: '120°', w: ['90°', '100°', '150°'], exp: '4 × 30° = 120° (sudut tumpul).' },
    { prompt: 'Jumlah besar ketiga sudut dalam sebuah segitiga selalu sama dengan ...', ans: '180°', w: ['90°', '270°', '360°'], exp: 'Jumlah ketiga sudut pada setiap segitiga adalah 180°.' },
    { prompt: 'Besar masing-masing sudut pada segitiga sama sisi adalah ...', ans: '60°', w: ['45°', '90°', '120°'], exp: '180° : 3 sudut sama besar = 60°.' },
    { prompt: 'Sebuah segitiga memiliki dua sudut 50° dan 70°. Besar sudut ketiganya adalah ...', ans: '60°', w: ['50°', '70°', '80°'], exp: '180° - (50° + 70°) = 180° - 120° = 60°.' },
    { prompt: 'Sebuah segitiga siku-siku memiliki salah satu sudut lancip 35°. Sudut lancip lainnya adalah ...', ans: '55°', w: ['45°', '65°', '90°'], exp: '180° - 90° - 35° = 55°.' },
    { prompt: 'Segitiga sama kaki memiliki sudut puncak 40°. Besar masing-masing sudut alasnya adalah ...', ans: '70°', w: ['50°', '60°', '80°'], exp: '(180° - 40°) : 2 = 140° : 2 = 70°.' },
    { prompt: 'Jumlah keempat sudut pada bangun segi empat (persegi, persegi panjang, trapesium) adalah ...', ans: '360°', w: ['180°', '240°', '270°'], exp: 'Setiap bangun segi empat memiliki jumlah sudut dalam 360°.' },
    { prompt: 'Bangun datar yang memiliki 4 sisi sama panjang dan 4 sudut siku-siku adalah ...', ans: 'Persegi', w: ['Belah ketupat', 'Persegi panjang', 'Jajar genjang'], exp: 'Persegi memiliki 4 sisi sama panjang dan 4 sudut 90°.' },
    { prompt: 'Bangun datar yang memiliki 4 sisi sama panjang tetapi sudut-sudutnya tidak harus siku-siku adalah ...', ans: 'Belah ketupat', w: ['Persegi panjang', 'Trapesium', 'Segitiga sama sisi'], exp: 'Belah ketupat memiliki 4 sisi sama panjang dan sudut berhadapan sama besar.' },
    { prompt: 'Bangun datar segi empat yang tepat memiliki sepasang sisi sejajar disebut ...', ans: 'Trapesium', w: ['Jajar genjang', 'Layang-layang', 'Belah ketupat'], exp: 'Ciri khas trapesium adalah memiliki tepat satu pasang sisi sejajar.' },
    { prompt: 'Banyak sumbu simetri lipat pada bangun persegi adalah ...', ans: '4', w: ['2', '3', '8'], exp: 'Persegi dapat dilipat simetris melalui 2 garis tengah dan 2 diagonal (4 sumbu simetri).' },
    { prompt: 'Banyak sumbu simetri lipat pada persegi panjang (bukan persegi) adalah ...', ans: '2', w: ['1', '4', '0'], exp: 'Persegi panjang memiliki 2 sumbu simetri (lipatan vertikal dan horizontal).' },
    { prompt: 'Banyak sumbu simetri pada segitiga sama sisi adalah ...', ans: '3', w: ['1', '2', '6'], exp: 'Segitiga sama sisi mempunyai 3 sumbu simetri.' },
    { prompt: 'Banyak sumbu simetri pada segitiga sama kaki adalah ...', ans: '1', w: ['2', '3', '0'], exp: 'Segitiga sama kaki hanya memiliki 1 sumbu simetri dari sudut puncak ke alas.' },
    { prompt: 'Bangun jajar genjang memiliki dua pasang sisi sejajar yang ...', ans: 'Sama panjang', w: ['Tegak lurus', 'Berbeda panjang', 'Membentuk sudut 90°'], exp: 'Sisi yang berhadapan pada jajar genjang selalu sejajar dan sama panjang.' },
    { prompt: 'Diagonal-diagonal pada bangun layang-layang selalu berpotongan ...', ans: 'Tegak lurus (90°)', w: ['Sejajar', 'Membentuk sudut 45°', 'Tidak berpotongan'], exp: 'Kedua diagonal layang-layang berpotongan tegak lurus membentuk sudut 90°.' },
    { prompt: 'Bangun datar yang tidak memiliki titik sudut sama sekali adalah ...', ans: 'Lingkaran', w: ['Segitiga', 'Trapesium', 'Layang-layang'], exp: 'Lingkaran tersusun dari kurva tertutup tanpa titik sudut.' },
    { prompt: 'Sudut sebesar 135° termasuk jenis sudut ...', ans: 'Tumpul', w: ['Lancip', 'Siku-siku', 'Lurus'], exp: '135° berada di antara 90° dan 180°, sehingga termasuk sudut tumpul.' },
    { prompt: 'Sudut sebesar 75° termasuk jenis sudut ...', ans: 'Lancip', w: ['Siku-siku', 'Tumpul', 'Lurus'], exp: '75° lebih kecil daripada 90°, sehingga termasuk sudut lancip.' },
    { prompt: 'Sudut berpelurus memiliki jumlah besar sudut 180°. Jika sudut A = 110°, besar pelurusnya adalah ...', ans: '70°', w: ['60°', '80°', '90°'], exp: '180° - 110° = 70°.' },
    { prompt: 'Sudut berpenyiku memiliki jumlah 90°. Jika sudut P = 32°, besar penyikunya adalah ...', ans: '58°', w: ['48°', '68°', '148°'], exp: '90° - 32° = 58°.' },
  ];

  angleQ.forEach((q, i) => {
    list.push(makeQuestion(`mtk-ss-${i + 1}`, 2, topic, q.prompt, q.ans, q.w as [string, string, string], q.exp, q.vis));
  });

  return list;
}

// 5. Volume Kubus & Balok (Semester 2 - 30 soal)
function buildVolumeQuestions(): QuizQuestion[] {
  const topic = 'Volume Kubus & Balok';
  const list: QuizQuestion[] = [];

  // 1-8: Volume kubus
  [3, 4, 5, 6, 7, 8, 9, 10].forEach((s, i) => {
    const vol = s * s * s;
    list.push(
      makeQuestion(
        `mtk-vl-${i + 1}`,
        2,
        topic,
        `Sebuah kubus memiliki panjang rusuk ${s} cm. Berapakah volume kubus tersebut?`,
        `${fmtId(vol)} cm³`,
        [`${fmtId(s * s)} cm³`, `${fmtId(s * s + 12)} cm³`, `${fmtId(vol + 25)} cm³`],
        `Volume kubus = s × s × s = ${s} × ${s} × ${s} = ${fmtId(vol)} cm³.`,
        i === 2 ? { kind: 'cube', side: 5, unit: 'cm' } : undefined
      )
    );
  });

  // 9-16: Volume balok
  const cuboids: Array<[number, number, number]> = [
    [8, 4, 3],
    [10, 5, 4],
    [12, 6, 5],
    [9, 5, 4],
    [15, 6, 4],
    [10, 8, 6],
    [14, 5, 3],
    [11, 6, 5],
  ];
  cuboids.forEach(([p, l, t], i) => {
    const vol = p * l * t;
    list.push(
      makeQuestion(
        `mtk-vl-${9 + i}`,
        2,
        topic,
        `Hitunglah volume balok dengan panjang ${p} cm, lebar ${l} cm, dan tinggi ${t} cm!`,
        `${vol} cm³`,
        [`${p * l} cm³`, `${2 * (p + l + t)} cm³`, `${vol + 24} cm³`],
        `Volume balok = p × l × t = ${p} × ${l} × ${t} = ${vol} cm³.`,
        i === 0 ? { kind: 'cuboid', length: 8, width: 4, height: 3, unit: 'cm' } : undefined
      )
    );
  });

  // 17-22: Mencari rusuk kubus dari volume & sisi balok dari volume
  const reverseItems = [
    { prompt: 'Volume sebuah kubus adalah 64 cm³. Panjang rusuk kubus tersebut adalah ...', ans: '4 cm', w: ['6 cm', '8 cm', '16 cm'], exp: '∛64 = 4 cm, karena 4 × 4 × 4 = 64.' },
    { prompt: 'Volume sebuah kubus adalah 216 cm³. Panjang rusuknya adalah ...', ans: '6 cm', w: ['4 cm', '8 cm', '9 cm'], exp: '∛216 = 6 cm, karena 6 × 6 × 6 = 216.' },
    { prompt: 'Sebuah kubus memiliki volume 1.000 cm³. Panjang rusuk kubus adalah ...', ans: '10 cm', w: ['100 cm', '20 cm', '25 cm'], exp: '∛1.000 = 10 cm.' },
    { prompt: 'Volume sebuah balok 240 cm³ dengan panjang 10 cm dan lebar 6 cm. Tinggi balok adalah ...', ans: '4 cm', w: ['6 cm', '8 cm', '12 cm'], exp: 'Tinggi = Volume : (p × l) = 240 : (10 × 6) = 240 : 60 = 4 cm.' },
    { prompt: 'Sebuah akuarium balok bervolume 360 cm³ memiliki lebar 5 cm dan tinggi 6 cm. Panjang akuarium adalah ...', ans: '12 cm', w: ['9 cm', '10 cm', '15 cm'], exp: 'Panjang = 360 : (5 × 6) = 360 : 30 = 12 cm.' },
    { prompt: 'Volume balok 420 cm³, panjang 12 cm, tinggi 5 cm. Lebar balok tersebut adalah ...', ans: '7 cm', w: ['6 cm', '8 cm', '9 cm'], exp: 'Lebar = 420 : (12 × 5) = 420 : 60 = 7 cm.' },
  ];
  reverseItems.forEach((r, i) => {
    list.push(makeQuestion(`mtk-vl-${17 + i}`, 2, topic, r.prompt, r.ans, r.w as [string, string, string], r.exp));
  });

  // 23-30: Sifat unsur kubus/balok & konversi liter / dm³
  const propsItems = [
    { prompt: 'Banyak rusuk pada bangun ruang kubus dan balok masing-masing adalah ...', ans: '12 rusuk', w: ['6 rusuk', '8 rusuk', '10 rusuk'], exp: 'Kubus dan balok memiliki 12 rusuk, 6 sisi, dan 8 titik sudut.' },
    { prompt: 'Banyak sisi pada bangun ruang kubus adalah ...', ans: '6 sisi berbentuk persegi', w: ['4 sisi persegi', '8 sisi persegi', '12 sisi persegi'], exp: 'Kubus tersusun dari 6 buah sisi persegi yang kongruen.' },
    { prompt: 'Banyak titik sudut pada sebuah balok adalah ...', ans: '8 titik sudut', w: ['6 titik sudut', '10 titik sudut', '12 titik sudut'], exp: 'Balok memiliki 8 titik sudut.' },
    { prompt: 'Satuan volume 1 liter sama nilainya dengan ...', ans: '1 dm³', w: ['1 cm³', '1 m³', '100 cm³'], exp: '1 liter = 1 dm³ = 1.000 cm³.' },
    { prompt: 'Sebuah bak mandi kubus memiliki rusuk 10 dm. Jika diisi penuh, air yang ditampung sebanyak ...', ans: '1.000 liter', w: ['100 liter', '300 liter', '10.000 liter'], exp: 'Volume = 10 × 10 × 10 = 1.000 dm³ = 1.000 liter.' },
    { prompt: 'Bak air berukuran 50 cm × 40 cm × 30 cm diisi penuh air. Volume airnya dalam liter adalah ...', ans: '60 liter', w: ['6 liter', '600 liter', '6.000 liter'], exp: 'Volume = 60.000 cm³ = 60 dm³ = 60 liter.' },
    { prompt: 'Jumlah panjang seluruh rusuk sebuah kubus yang panjang rusuknya 7 cm adalah ...', ans: '84 cm', w: ['42 cm', '49 cm', '56 cm'], exp: 'Kubus memiliki 12 rusuk sama panjang: 12 × 7 = 84 cm.' },
    { prompt: 'Luas permukaan kubus dengan panjang rusuk 5 cm adalah ...', ans: '150 cm²', w: ['125 cm²', '100 cm²', '25 cm²'], exp: 'Luas permukaan kubus = 6 × s × s = 6 × 25 = 150 cm².' },
  ];
  propsItems.forEach((p, i) => {
    list.push(makeQuestion(`mtk-vl-${23 + i}`, 2, topic, p.prompt, p.ans, p.w as [string, string, string], p.exp));
  });

  return list;
}

// 6. Pengolahan Data & Diagram (Semester 2 - 30 soal)
function buildPengolahanDataQuestions(): QuizQuestion[] {
  const topic = 'Pengolahan Data & Diagram';
  const list: QuizQuestion[] = [];

  const dataQuestions = [
    { prompt: 'Pada piktogram, 1 gambar buku mewakili 5 siswa. Jika ada 6 gambar buku untuk hari Senin, jumlah siswa yang meminjam buku adalah ...', ans: '30 siswa', w: ['11 siswa', '25 siswa', '35 siswa'], exp: '6 gambar × 5 siswa = 30 siswa.' },
    { prompt: 'Data nilai ulangan Rani adalah: 80, 90, 80, 70, 80. Nilai yang paling sering muncul (modus) adalah ...', ans: '80', w: ['70', '85', '90'], exp: 'Nilai 80 muncul paling banyak (3 kali).' },
    { prompt: 'Rata-rata (mean) dari data nilai: 70, 80, 90, 80 adalah ...', ans: '80', w: ['75', '82', '85'], exp: '(70 + 80 + 90 + 80) : 4 = 320 : 4 = 80.' },
    { prompt: 'Nilai tengah (median) dari data terurut: 60, 70, 75, 85, 90 adalah ...', ans: '75', w: ['70', '80', '85'], exp: 'Data ganjil (5 data) yang sudah terurut, nilai tengahnya data ke-3 yaitu 75.' },
    { prompt: 'Selisih antara nilai tertinggi dan nilai terendah pada data: 65, 70, 85, 95, 75 adalah ...', ans: '30', w: ['20', '25', '35'], exp: 'Tertinggi 95 - terendah 65 = 30.' },
    { prompt: 'Dalam piktogram hasil panen, 1 gambar karung mewakili 10 kg beras. Untuk menggambar hasil 45 kg diperlukan ...', ans: '4 gambar utuh dan 1 setengah gambar', w: ['4 gambar utuh', '5 gambar utuh', '45 gambar'], exp: '4 × 10 kg = 40 kg, ditambah setengah gambar (5 kg) = 45 kg.' },
    { prompt: 'Tinggi badan 5 siswa (cm): 138, 142, 140, 145, 135. Rata-rata tinggi badan mereka adalah ...', ans: '140 cm', w: ['138 cm', '141 cm', '142 cm'], exp: '(138 + 142 + 140 + 145 + 135) : 5 = 700 : 5 = 140 cm.' },
    { prompt: 'Data hobi 20 siswa: Membaca 6, Olahraga 8, Menggambar 4, Musik 2. Hobi yang paling diminati adalah ...', ans: 'Olahraga', w: ['Membaca', 'Menggambar', 'Musik'], exp: 'Olahraga dipilih oleh 8 siswa (jumlah terbanyak).' },
    { prompt: 'Dari 30 siswa Kelas V, sebanyak 12 siswa berangkat naik sepeda, 8 naik motor, dan sisanya jalan kaki. Jumlah yang jalan kaki adalah ...', ans: '10 siswa', w: ['8 siswa', '12 siswa', '14 siswa'], exp: '30 - (12 + 8) = 30 - 20 = 10 siswa.' },
    { prompt: 'Diagram yang menyajikan data menggunakan batang persegi panjang tegak atau mendatar disebut ...', ans: 'Diagram batang', w: ['Diagram lingkaran', 'Piktogram', 'Tabel turus'], exp: 'Diagram batang menggunakan tinggi/panjang batang untuk menunjukkan frekuensi data.' },
    { prompt: 'Diagram yang menyajikan data menggunakan simbol gambar yang mewakili jumlah tertentu disebut ...', ans: 'Piktogram (diagram gambar)', w: ['Diagram garis', 'Diagram batang', 'Histogram'], exp: 'Piktogram mewakili jumlah data dengan ikon gambar.' },
    { prompt: 'Pada tabel frekuensi, 1 ikat turus yang dicoret miring (|||| dengan coret) bernilai ...', ans: '5', w: ['4', '6', '10'], exp: 'Satu kelompok turus lengkap berjumlah 5.' },
    { prompt: 'Jika 1 ikat turus bernilai 5, maka 3 ikat penuh ditambah 2 garis tunggal menunjukkan jumlah ...', ans: '17', w: ['13', '15', '20'], exp: '(3 × 5) + 2 = 17.' },
    { prompt: 'Data ukuran sepatu siswa: 35, 36, 36, 37, 36, 38, 37. Modus ukuran sepatu adalah ...', ans: '36', w: ['35', '37', '38'], exp: 'Ukuran 36 muncul 3 kali (paling sering).' },
    { prompt: 'Data berat badan (kg): 32, 34, 30, 36, 38. Median data tersebut adalah ...', ans: '34 kg', w: ['30 kg', '32 kg', '36 kg'], exp: 'Urutkan dulu: 30, 32, 34, 36, 38. Nilai tengahnya 34 kg.' },
    { prompt: 'Rata-rata nilai ulangan Budi dari 4 kali tes adalah 85. Jumlah seluruh nilai Budi adalah ...', ans: '340', w: ['320', '330', '360'], exp: 'Jumlah nilai = rata-rata × banyak tes = 85 × 4 = 340.' },
    { prompt: 'Data pengunjung kantin Senin–Kamis: Senin 40, Selasa 35, Rabu 50, Kamis 45. Rata-rata pengunjung per hari adalah ...', ans: '42,5 orang', w: ['40 orang', '45 orang', '47,5 orang'], exp: '(40 + 35 + 50 + 45) : 4 = 170 : 4 = 42,5.' },
    { prompt: 'Suhu udara tercatat: 26°C, 28°C, 30°C, 29°C, 27°C. Suhu tertinggi dan terendah berturut-turut adalah ...', ans: '30°C dan 26°C', w: ['29°C dan 27°C', '30°C dan 27°C', '28°C dan 26°C'], exp: 'Tertinggi 30°C dan terendah 26°C.' },
    { prompt: 'Dalam diagram batang, sumbu mendatar biasanya menunjukkan ...', ans: 'Kategori / jenis data', w: ['Judul diagram', 'Total semua data', 'Rata-rata nilai'], exp: 'Sumbu mendatar (X) memuat kategori/waktu, sedangkan sumbu tegak (Y) memuat frekuensi.' },
    { prompt: 'Jika 1 gambar bintang mewakili 4 poin, maka poin 24 digambarkan dengan ...', ans: '6 bintang', w: ['4 bintang', '5 bintang', '8 bintang'], exp: '24 : 4 = 6 gambar bintang.' },
    { prompt: 'Siswa yang mendapat nilai di atas 75 dari daftar nilai: 70, 75, 80, 85, 90, 65, 80 berjumlah ...', ans: '4 siswa', w: ['3 siswa', '5 siswa', '6 siswa'], exp: 'Nilai di atas 75 adalah 80, 85, 90, dan 80 (4 siswa). Nilai 75 tidak termasuk di atas 75.' },
    { prompt: 'Banyak siswa yang memperoleh nilai kurang dari 80 dari data: 60, 70, 75, 80, 85, 90 adalah ...', ans: '3 siswa', w: ['2 siswa', '4 siswa', '5 siswa'], exp: 'Nilai kurang dari 80 adalah 60, 70, dan 75 (3 siswa).' },
    { prompt: 'Untuk melihat perubahan suhu tubuh pasien dari pagi hingga malam paling cocok menggunakan ...', ans: 'Diagram garis', w: ['Piktogram', 'Tabel turus', 'Diagram Venn'], exp: 'Diagram garis cocok menunjukkan perkembangan atau tren data dari waktu ke waktu.' },
    { prompt: 'Data jumlah tabungan (ribuan): 10, 15, 20, 25, 30. Rata-rata tabungan tersebut adalah ...', ans: '20 ribu', w: ['15 ribu', '22 ribu', '25 ribu'], exp: '(10 + 15 + 20 + 25 + 30) : 5 = 100 : 5 = 20 ribu.' },
    { prompt: 'Diketahui data: 4, 6, 8, 8, 10, 12. Median dari 6 data genap tersebut adalah ...', ans: '8', w: ['6', '9', '10'], exp: 'Data tengah ke-3 dan ke-4 adalah 8 dan 8, sehingga (8 + 8) : 2 = 8.' },
    { prompt: 'Diketahui data terurut: 5, 7, 8, 10, 12, 14. Median dari data tersebut adalah ...', ans: '9', w: ['8', '10', '9,5'], exp: 'Rata-rata dua nilai tengah (8 dan 10): (8 + 10) : 2 = 9.' },
    { prompt: 'Penjualan buku hari Senin 15 buah dan Selasa 27 buah. Kenaikan penjualan pada hari Selasa adalah ...', ans: '12 buah', w: ['10 buah', '15 buah', '42 buah'], exp: 'Kenaikan = 27 - 15 = 12 buah.' },
    { prompt: 'Jumlah seluruh siswa kelas V jika terdapat 16 siswa laki-laki dan 18 siswa perempuan adalah ...', ans: '34 siswa', w: ['32 siswa', '33 siswa', '36 siswa'], exp: '16 + 18 = 34 siswa.' },
    { prompt: 'Cara mengumpulkan data dengan mengajukan daftar pertanyaan tertulis kepada banyak orang disebut ...', ans: 'Angket / kuesioner', w: ['Pengukuran langsung', 'Pencatatan suhu', 'Timbangan'], exp: 'Kuesioner atau angket dipakai untuk mengumpulkan jawaban dari responden.' },
    { prompt: 'Cara mengumpulkan data berat badan teman sekelas secara akurat paling tepat dilakukan dengan ...', ans: 'Mengukur langsung dengan timbangan', w: ['Menebak dari foto', 'Mengira-ngira tinggi badan', 'Membaca buku paket'], exp: 'Pengukuran langsung dengan timbangan menghasilkan data berat badan yang akurat.' },
  ];

  dataQuestions.forEach((q, i) => {
    list.push(makeQuestion(`mtk-pd2-${i + 1}`, 2, topic, q.prompt, q.ans, q.w as [string, string, string], q.exp));
  });

  return list;
}

export const MATEMATIKA_QUESTIONS: QuizQuestion[] = [
  ...buildBilanganCacahQuestions(),
  ...buildPecahanDesimalQuestions(),
  ...buildKelilingLuasQuestions(),
  ...buildSudutSifatQuestions(),
  ...buildVolumeQuestions(),
  ...buildPengolahanDataQuestions(),
];
