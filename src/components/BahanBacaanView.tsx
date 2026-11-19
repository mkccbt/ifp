import { useState } from 'react';
import { CheckCircle2, XCircle, BookOpen, Target, BarChart3 } from 'lucide-react';
import { Semester, SubjectId, SubjectInfo } from '../types';
import { LEARNING_OBJECTIVES, READING_MATERIALS } from '../data/mpiContent';
import { SpeakButton } from './SpeakButton';
import { soundFX } from '../utils/sound';

interface BahanBacaanViewProps {
  subjects: SubjectInfo[];
  initialSubjectId?: SubjectId;
  initialSemester?: Semester;
}

const OPTION_LABELS = ['A', 'B', 'C', 'D'] as const;

export function BahanBacaanView({
  subjects,
  initialSubjectId = 'matematika',
  initialSemester = 1,
}: BahanBacaanViewProps) {
  const [subjectId, setSubjectId] = useState<SubjectId>(initialSubjectId);
  const [semester, setSemester] = useState<Semester>(initialSemester);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const activeSubject = subjects.find((s) => s.id === subjectId) || subjects[0];

  const objectives = LEARNING_OBJECTIVES.filter(
    (tp) => tp.subjectId === subjectId && tp.semester === semester
  );

  const material =
    READING_MATERIALS.find((m) => m.subjectId === subjectId && m.semester === semester) ||
    READING_MATERIALS[0];

  const maxBarValue = Math.max(...material.chart.bars.map((b) => b.value), 1);

  const fullReadingSpeech = `${material.title}. ${material.paragraphs.join(' ')}`;
  const fullObjectiveSpeech = `Tujuan Pembelajaran ${activeSubject.name} Semester ${semester}. ${objectives
    .map((o, i) => `Nomor ${i + 1}: ${o.goal}`)
    .join(' ')}`;

  const handleSelectAnswer = (questionId: string, optionIdx: number, correctIdx: number) => {
    if (answers[questionId] !== undefined) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
    if (optionIdx === correctIdx) {
      soundFX.playCorrect();
    } else {
      soundFX.playWrong();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      {/* Header + Subject & Semester Selector */}
      <div className="flex flex-col gap-4 pb-6 border-b border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900">
              Bahan Bacaan Literasi &amp; Numerasi Kelas V
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Dilengkapi tujuan pembelajaran, tabel data, grafik, serta speaker suara untuk murid yang belum lancar membaca.
            </p>
          </div>

          <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-xl self-start">
            {([1, 2] as const).map((sem) => (
              <button
                key={sem}
                type="button"
                onClick={() => {
                  soundFX.playClick();
                  setSemester(sem);
                }}
                className={`ifp-touch-target px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                  semester === sem
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semester {sem} ({sem === 1 ? 'Ganjil' : 'Genap'})
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start">
          {subjects.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                soundFX.playClick();
                setSubjectId(s.id);
              }}
              className={`ifp-touch-target px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                subjectId === s.id
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {s.shortName}
            </button>
          ))}
        </div>
      </div>

      {/* Tujuan Pembelajaran (TP) Card */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <Target className="w-5 h-5 text-blue-700 shrink-0" aria-hidden="true" />
            <h2 className="font-display text-lg font-bold text-slate-900">
              Tujuan Pembelajaran · {activeSubject.name} (Semester {semester})
            </h2>
          </div>
          <SpeakButton
            speakId={`tp-${subjectId}-${semester}`}
            text={fullObjectiveSpeech}
            label="Dengarkan Tujuan"
          />
        </div>

        <ol className="space-y-2.5 text-sm sm:text-base text-slate-700">
          {objectives.map((tp, idx) => (
            <li key={tp.code} className="flex items-start gap-3">
              <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-md px-2 py-0.5 mt-0.5 shrink-0">
                {idx + 1}
              </span>
              <span className="leading-relaxed">{tp.goal}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Reading Passage */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700">
              <BookOpen className="w-4 h-4" aria-hidden="true" />
              <span>{material.focusLabel}</span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 mt-1.5">
              {material.title}
            </h2>
          </div>
          <SpeakButton
            speakId={`read-${material.id}`}
            text={fullReadingSpeech}
            label="Bacakan Teks"
          />
        </div>

        <div className="mt-5 space-y-4 text-base sm:text-lg text-slate-800 leading-relaxed max-w-4xl">
          {material.paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>

        {/* Numeracy: Table + SVG Bar Chart */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Data Table */}
          <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <h3 className="font-display text-sm sm:text-base font-bold text-slate-900">
                  {material.table.caption}
                </h3>
                <SpeakButton
                  speakId={`tbl-${material.id}`}
                  text={`${material.table.caption}. ${material.table.rows
                    .map((r) => r.join(', '))
                    .join('. ')}`}
                  label="Baca Tabel"
                  compact
                />
              </div>
              <div className="overflow-x-auto bg-white border border-slate-200 rounded-lg">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200">
                      {material.table.headers.map((h) => (
                        <th key={h} className="px-3.5 py-2.5 font-semibold text-slate-800 whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {material.table.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="border-b border-slate-100 last:border-b-0">
                        {row.map((cell, cIdx) => (
                          <td
                            key={cIdx}
                            className={`px-3.5 py-2.5 text-slate-700 tabular-nums ${
                              cIdx === 0 ? 'font-semibold text-slate-900' : ''
                            }`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* SVG Bar Chart */}
          <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="w-4 h-4 text-blue-700 shrink-0" aria-hidden="true" />
              <h3 className="font-display text-sm sm:text-base font-bold text-slate-900">
                {material.chart.title}
              </h3>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-4 flex-1 flex items-end justify-around gap-3 min-h-[210px]">
              {material.chart.bars.map((bar) => {
                const heightPct = Math.max(10, Math.round((bar.value / maxBarValue) * 100));
                return (
                  <div key={bar.label} className="flex-1 flex flex-col items-center h-44 justify-end">
                    <span className="font-mono text-xs font-bold text-slate-800 tabular-nums mb-1">
                      {bar.value}
                    </span>
                    <div
                      className="w-full max-w-[44px] rounded-t-md bg-blue-600 transition-all duration-300"
                      style={{ height: `${heightPct}%` }}
                      title={`${bar.label}: ${bar.value} ${material.chart.unit}`}
                    />
                    <span className="mt-2 text-xs font-medium text-slate-700 text-center leading-tight">
                      {bar.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Comprehension Questions */}
      <section className="space-y-4">
        <h2 className="font-display text-lg font-bold text-slate-900">
          Latihan Pemahaman Literasi &amp; Numerasi
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {material.questions.map((q, qIdx) => {
            const chosen = answers[q.id];
            const answered = chosen !== undefined;
            const fullQSpeech = `Pertanyaan ${qIdx + 1}: ${q.prompt}. Pilihan A: ${q.options[0]}. Pilihan B: ${q.options[1]}. Pilihan C: ${q.options[2]}. Pilihan D: ${q.options[3]}.`;

            return (
              <div
                key={q.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-xs font-semibold text-slate-500">
                      Soal Pemahaman #{qIdx + 1}
                    </span>
                    <SpeakButton
                      speakId={`rq-${q.id}`}
                      text={fullQSpeech}
                      label="Bacakan Soal"
                      compact
                    />
                  </div>
                  <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 mt-2">
                    {q.prompt}
                  </h3>

                  <div className="mt-4 space-y-2.5">
                    {q.options.map((opt, idx) => {
                      const isCorrect = idx === q.correctIndex;
                      const isSelected = chosen === idx;

                      let btnClass =
                        'bg-slate-50 border-slate-200 text-slate-800 hover:bg-blue-50 hover:border-blue-300';
                      if (answered) {
                        if (isCorrect) {
                          btnClass = 'bg-emerald-50 border-emerald-600 text-emerald-950 font-semibold';
                        } else if (isSelected) {
                          btnClass = 'bg-red-50 border-red-500 text-red-950';
                        } else {
                          btnClass = 'bg-slate-50 border-slate-200 text-slate-400 opacity-75';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={answered}
                          onClick={() => handleSelectAnswer(q.id, idx, q.correctIndex)}
                          className={`ifp-touch-target w-full px-4 py-3 rounded-xl border text-left text-sm sm:text-base flex items-center justify-between gap-3 transition-colors cursor-pointer ${btnClass}`}
                        >
                          <span>
                            <strong className="font-mono mr-2">{OPTION_LABELS[idx]}.</strong>
                            {opt}
                          </span>
                          {answered && isCorrect && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                          )}
                          {answered && isSelected && !isCorrect && (
                            <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {answered && (
                  <div className="mt-4 pt-4 border-t border-slate-200 text-sm text-slate-700 flex items-start justify-between gap-3">
                    <div>
                      <strong className="text-slate-900">
                        {chosen === q.correctIndex ? 'Tepat!' : 'Pembahasan:'}
                      </strong>{' '}
                      {q.explanation}
                    </div>
                    <SpeakButton
                      speakId={`rex-${q.id}`}
                      text={q.explanation}
                      label="Dengar"
                      compact
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
