import { useMemo, useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  ClipboardCheck,
  Download,
  RotateCcw,
  Play,
} from 'lucide-react';
import { QuizQuestion, SemesterFilter, SubjectId, SubjectInfo } from '../types';
import { LEARNING_OBJECTIVES } from '../data/mpiContent';
import { SpeakButton } from './SpeakButton';
import { QuestionVisual } from './QuestionVisual';
import { soundFX } from '../utils/sound';
import { ttsEngine } from '../utils/tts';

interface AsesmenViewProps {
  subjects: SubjectInfo[];
  allQuestions: QuizQuestion[];
}

const OPTION_LABELS = ['A', 'B', 'C', 'D'] as const;

export function AsesmenView({ subjects, allQuestions }: AsesmenViewProps) {
  const [phase, setPhase] = useState<'SETUP' | 'ACTIVE' | 'RESULT'>('SETUP');
  const [studentName, setStudentName] = useState('');
  const [subjectId, setSubjectId] = useState<SubjectId>('matematika');
  const [semester, setSemester] = useState<SemesterFilter>(1);
  const [assessmentDeck, setAssessmentDeck] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});

  const activeSubject = subjects.find((s) => s.id === subjectId) || subjects[0];

  const availablePool = useMemo(() => {
    return allQuestions.filter(
      (q) => q.subjectId === subjectId && (semester === 'ALL' || q.semester === semester)
    );
  }, [allQuestions, subjectId, semester]);

  const startAssessment = () => {
    soundFX.playClick();
    const deck = [...availablePool].sort(() => Math.random() - 0.5).slice(0, 10);
    setAssessmentDeck(deck);
    setCurrentIdx(0);
    setSelectedAnswers({});
    setPhase('ACTIVE');
  };

  const handleChooseOption = (questionId: string, idx: number) => {
    soundFX.playClick();
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: idx }));
  };

  const handleFinish = () => {
    ttsEngine.stop();
    soundFX.playWin();
    setPhase('RESULT');
  };

  const handleDownloadCSV = () => {
    const correctTotal = assessmentDeck.filter(
      (q) => selectedAnswers[q.id] === q.correctIndex
    ).length;
    const score = Math.round((correctTotal / Math.max(1, assessmentDeck.length)) * 100);
    const label = studentName.trim() || 'Siswa Kelas V';

    const rows = [
      ['Nama Siswa/Kelas', 'Mata Pelajaran', 'Semester', 'Jumlah Soal', 'Benar', 'Nilai Akhir'],
      [
        label,
        activeSubject.name,
        semester === 'ALL' ? 'Semester 1 & 2' : `Semester ${semester}`,
        String(assessmentDeck.length),
        String(correctTotal),
        String(score),
      ],
      [],
      ['No', 'Topik', 'Pertanyaan', 'Jawaban Dipilih', 'Kunci Benar', 'Status'],
      ...assessmentDeck.map((q, i) => {
        const chosen = selectedAnswers[q.id];
        const status = chosen === q.correctIndex ? 'Benar' : 'Salah';
        return [
          String(i + 1),
          q.topic,
          `"${q.prompt.replace(/"/g, '""')}"`,
          chosen !== undefined ? `"${q.options[chosen].replace(/"/g, '""')}"` : 'Tidak Dijawab',
          `"${q.options[q.correctIndex].replace(/"/g, '""')}"`,
          status,
        ];
      }),
    ];

    const csvContent = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `asesmen-${subjectId}-sem-${semester}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (phase === 'SETUP') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700">
              <ClipboardCheck className="w-4 h-4" aria-hidden="true" />
              <span>Evaluasi Hasil Belajar · Kurikulum Merdeka</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Asesmen Kelas V SD
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              Uji pemahaman siswa per mata pelajaran dan semester. Setiap soal dilengkapi tombol
              speaker untuk membantu siswa yang belum lancar membaca, serta rekap nilai otomatis.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-3 border-t border-slate-200">
            <div>
              <label htmlFor="asesmen-name" className="block text-sm font-semibold text-slate-800 mb-1.5">
                Nama Siswa atau Kelompok (Opsional)
              </label>
              <input
                id="asesmen-name"
                type="text"
                placeholder="Contoh: Kelas V-A / Budi Santoso"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                Pilih Semester
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
                {(
                  [
                    { val: 1, label: 'Semester 1' },
                    { val: 2, label: 'Semester 2' },
                    { val: 'ALL', label: 'Semua' },
                  ] as const
                ).map((item) => (
                  <button
                    key={String(item.val)}
                    type="button"
                    onClick={() => {
                      soundFX.playClick();
                      setSemester(item.val);
                    }}
                    className={`ifp-touch-target py-2 px-3 rounded-lg text-xs sm:text-sm font-medium cursor-pointer ${
                      semester === item.val
                        ? 'bg-white text-slate-900 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200">
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              Pilih Mata Pelajaran
            </label>
            <div className="flex flex-wrap gap-2">
              {subjects.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    setSubjectId(s.id);
                  }}
                  className={`ifp-touch-target px-4 py-2.5 rounded-xl text-sm font-medium border cursor-pointer ${
                    subjectId === s.id
                      ? 'bg-blue-700 text-white border-blue-700'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-sm text-slate-600">
              Tersedia <strong className="tabular-nums text-slate-900">{availablePool.length} soal</strong>{' '}
              untuk {activeSubject.name}{' '}
              {semester === 'ALL' ? 'Semester 1 & 2' : `Semester ${semester}`}.
            </div>
            <button
              type="button"
              onClick={startAssessment}
              className="ifp-touch-target inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-700 text-white text-sm sm:text-base font-semibold hover:bg-blue-800 cursor-pointer whitespace-nowrap"
            >
              <Play className="w-4 h-4 fill-current" aria-hidden="true" />
              <span>Mulai Asesmen</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'RESULT') {
    const correctCount = assessmentDeck.filter(
      (q) => selectedAnswers[q.id] === q.correctIndex
    ).length;
    const score = Math.round((correctCount / Math.max(1, assessmentDeck.length)) * 100);
    const predikat =
      score >= 85
        ? 'Sangat Baik (Tuntas)'
        : score >= 70
          ? 'Baik (Tuntas)'
          : score >= 55
            ? 'Cukup (Perlu Pengayaan)'
            : 'Perlu Bimbingan';

    const relatedTP = LEARNING_OBJECTIVES.filter(
      (tp) => tp.subjectId === subjectId && (semester === 'ALL' || tp.semester === semester)
    );

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <p className="text-sm font-medium text-slate-500">
            Laporan Hasil Asesmen · {studentName.trim() || 'Kelas V'} · {activeSubject.name}
          </p>
          <div className="font-mono text-5xl font-bold text-blue-700 tabular-nums mt-3">
            {score}
          </div>
          <div className="font-display text-xl font-bold text-slate-900 mt-1">{predikat}</div>
          <p className="text-sm text-slate-600 mt-2 tabular-nums">
            Menjawab benar {correctCount} dari {assessmentDeck.length} soal
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleDownloadCSV}
              className="ifp-touch-target inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 cursor-pointer"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              <span>Unduh Rekap CSV</span>
            </button>
            <button
              type="button"
              onClick={startAssessment}
              className="ifp-touch-target inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              <span>Ulangi Asesmen</span>
            </button>
            <button
              type="button"
              onClick={() => setPhase('SETUP')}
              className="ifp-touch-target px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 cursor-pointer"
            >
              Pilih Mapel Lain
            </button>
          </div>
        </div>

        {/* Learning Objectives Reference */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="font-display text-base font-bold text-slate-900 mb-3">
            Tujuan Pembelajaran yang Diujikan
          </h2>
          <ul className="space-y-2 text-sm text-slate-700">
            {relatedTP.map((tp) => (
              <li key={tp.code}>
                <strong className="font-mono text-xs text-blue-700 mr-2">{tp.code}</strong>
                {tp.goal}
              </li>
            ))}
          </ul>
        </div>

        {/* Detailed Question Review */}
        <div className="space-y-3">
          <h2 className="font-display text-lg font-bold text-slate-900">
            Kunci Jawaban &amp; Pembahasan
          </h2>
          {assessmentDeck.map((q, idx) => {
            const chosen = selectedAnswers[q.id];
            const isCorrect = chosen === q.correctIndex;
            return (
              <div
                key={q.id}
                className="bg-white border border-slate-200 rounded-xl p-5 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-slate-500">
                    Soal {idx + 1} · {q.topic}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-bold ${
                      isCorrect ? 'text-emerald-700' : 'text-red-600'
                    }`}
                  >
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" /> Benar
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4" /> Belum Tepat
                      </>
                    )}
                  </span>
                </div>
                <div className="font-display font-bold text-slate-900">{q.prompt}</div>
                <div className="text-sm text-slate-700">
                  Jawaban dipilih:{' '}
                  <strong>
                    {chosen !== undefined ? q.options[chosen] : 'Tidak dijawab'}
                  </strong>{' '}
                  · Kunci benar: <strong className="text-emerald-800">{q.options[q.correctIndex]}</strong>
                </div>
                <p className="text-xs text-slate-600">{q.explanation}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ACTIVE ASSESSMENT
  const currentQuestion = assessmentDeck[currentIdx];
  const answeredCount = Object.keys(selectedAnswers).length;
  const fullSpeech = `Soal nomor ${currentIdx + 1}: ${currentQuestion.prompt}. Pilihan A: ${currentQuestion.options[0]}. Pilihan B: ${currentQuestion.options[1]}. Pilihan C: ${currentQuestion.options[2]}. Pilihan D: ${currentQuestion.options[3]}.`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="font-display text-lg font-bold text-slate-900">
            Asesmen {activeSubject.name}
            {semester !== 'ALL' ? ` · Semester ${semester}` : ''}
          </h1>
          <div className="text-xs text-slate-500 tabular-nums">
            Terjawab {answeredCount} dari {assessmentDeck.length} soal
          </div>
        </div>

        <button
          type="button"
          onClick={handleFinish}
          className="ifp-touch-target px-5 py-2.5 rounded-xl bg-emerald-700 text-white text-sm font-semibold hover:bg-emerald-800 cursor-pointer whitespace-nowrap"
        >
          Selesai &amp; Lihat Nilai
        </button>
      </div>

      {/* Question Number Navigator */}
      <div className="flex flex-wrap gap-2">
        {assessmentDeck.map((q, idx) => {
          const isCurrent = idx === currentIdx;
          const isDone = selectedAnswers[q.id] !== undefined;
          return (
            <button
              key={q.id}
              type="button"
              onClick={() => {
                soundFX.playClick();
                ttsEngine.stop();
                setCurrentIdx(idx);
              }}
              className={`ifp-touch-target w-10 h-10 rounded-lg font-mono text-sm font-bold border cursor-pointer transition-colors ${
                isCurrent
                  ? 'bg-blue-700 text-white border-blue-700'
                  : isDone
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Question Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-blue-700">
              Soal {currentIdx + 1} · {currentQuestion.topic}
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 mt-1.5 leading-snug">
              {currentQuestion.prompt}
            </h2>
          </div>
          <SpeakButton
            speakId={`asesmen-q-${currentQuestion.id}`}
            text={fullSpeech}
            label="Bacakan Soal"
          />
        </div>

        {currentQuestion.visual && <QuestionVisual visual={currentQuestion.visual} />}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {currentQuestion.options.map((opt, idx) => {
            const isSelected = selectedAnswers[currentQuestion.id] === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleChooseOption(currentQuestion.id, idx)}
                className={`ifp-touch-target min-h-[72px] p-4 rounded-xl border text-left flex items-center gap-3.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50 border-blue-700 ring-1 ring-blue-700 text-blue-950 font-semibold'
                    : 'bg-slate-50 border-slate-200 text-slate-900 hover:bg-blue-50/50 hover:border-blue-300'
                }`}
              >
                <span
                  className={`w-9 h-9 rounded-lg border font-mono text-sm font-bold flex items-center justify-center shrink-0 ${
                    isSelected
                      ? 'bg-blue-700 border-blue-700 text-white'
                      : 'bg-white border-slate-300 text-slate-700'
                  }`}
                >
                  {OPTION_LABELS[idx]}
                </span>
                <span className="text-base font-medium leading-snug">{opt}</span>
              </button>
            );
          })}
        </div>

        <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={currentIdx === 0}
            onClick={() => {
              soundFX.playClick();
              ttsEngine.stop();
              setCurrentIdx((i) => Math.max(0, i - 1));
            }}
            className="ifp-touch-target px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 disabled:opacity-40 cursor-pointer"
          >
            Sebelumnya
          </button>

          {currentIdx + 1 < assessmentDeck.length ? (
            <button
              type="button"
              onClick={() => {
                soundFX.playClick();
                ttsEngine.stop();
                setCurrentIdx((i) => i + 1);
              }}
              className="ifp-touch-target px-6 py-2.5 rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 cursor-pointer"
            >
              Soal Berikutnya
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="ifp-touch-target px-6 py-2.5 rounded-xl bg-emerald-700 text-white text-sm font-semibold hover:bg-emerald-800 cursor-pointer"
            >
              Kumpulkan Jawaban
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
