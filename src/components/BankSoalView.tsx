import { useState, FormEvent } from 'react';
import { Plus, Trash2, Search } from 'lucide-react';
import { QuizQuestion, Semester, SemesterFilter, SubjectId, SubjectInfo } from '../types';
import { soundFX } from '../utils/sound';

interface BankSoalViewProps {
  subjects: SubjectInfo[];
  questions: QuizQuestion[];
  onAddQuestion: (q: QuizQuestion) => void;
  onDeleteCustomQuestion: (id: string) => void;
}

export function BankSoalView({
  subjects,
  questions,
  onAddQuestion,
  onDeleteCustomQuestion,
}: BankSoalViewProps) {
  const [filterSubject, setFilterSubject] = useState<SubjectId | 'ALL'>('ALL');
  const [filterSemester, setFilterSemester] = useState<SemesterFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Add form state
  const [subjectId, setSubjectId] = useState<SubjectId>('matematika');
  const [semester, setSemester] = useState<Semester>(1);
  const [topic, setTopic] = useState(subjects[0].topicsBySemester[1][0]);
  const [prompt, setPrompt] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctIndex, setCorrectIndex] = useState<0 | 1 | 2 | 3>(0);
  const [explanation, setExplanation] = useState('');

  const selectedSubjectInfo = subjects.find((s) => s.id === subjectId) || subjects[0];
  const formTopics = selectedSubjectInfo.topicsBySemester[semester];

  const handleSubjectChange = (newId: SubjectId) => {
    setSubjectId(newId);
    const info = subjects.find((s) => s.id === newId);
    if (info) {
      setTopic(info.topicsBySemester[semester][0]);
    }
  };

  const handleSemesterChange = (newSem: Semester) => {
    setSemester(newSem);
    setTopic(selectedSubjectInfo.topicsBySemester[newSem][0]);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || !optA.trim() || !optB.trim() || !optC.trim() || !optD.trim()) {
      return;
    }

    const newQ: QuizQuestion = {
      id: `custom-${Date.now()}`,
      subjectId,
      semester,
      topic: topic || formTopics[0],
      prompt: prompt.trim(),
      options: [optA.trim(), optB.trim(), optC.trim(), optD.trim()],
      correctIndex,
      explanation: explanation.trim() || 'Soal buatan guru kelas V.',
      isCustom: true,
    };

    soundFX.playCorrect();
    onAddQuestion(newQ);
    setPrompt('');
    setOptA('');
    setOptB('');
    setOptC('');
    setOptD('');
    setCorrectIndex(0);
    setExplanation('');
    setShowAddForm(false);
    setFilterSubject(subjectId);
    setFilterSemester(semester);
  };

  const filteredQuestions = questions.filter((q) => {
    const matchSubject = filterSubject === 'ALL' || q.subjectId === filterSubject;
    const matchSemester = filterSemester === 'ALL' || q.semester === filterSemester;
    const matchSearch =
      !searchQuery.trim() ||
      q.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.topic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSubject && matchSemester && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">
            Bank Soal Guru Kelas V
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Kelola daftar soal Semester 1 dan Semester 2 beserta kunci pembahasan, atau tambahkan soal baru.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            soundFX.playClick();
            setShowAddForm((v) => !v);
          }}
          className="ifp-touch-target inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 cursor-pointer whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>{showAddForm ? 'Tutup Form' : 'Tambah Soal Baru'}</span>
        </button>
      </div>

      {/* Add Custom Question Form */}
      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 bg-white border border-slate-200 rounded-2xl p-6 space-y-4"
        >
          <h2 className="font-display text-lg font-bold text-slate-900">
            Buat Soal Tambahan (Tersimpan di Perangkat)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="q-subject" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Mata Pelajaran
              </label>
              <select
                id="q-subject"
                value={subjectId}
                onChange={(e) => handleSubjectChange(e.target.value as SubjectId)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm bg-white"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="q-semester" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Semester
              </label>
              <select
                id="q-semester"
                value={semester}
                onChange={(e) => handleSemesterChange(Number(e.target.value) as Semester)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm bg-white"
              >
                <option value={1}>Semester 1 (Ganjil)</option>
                <option value={2}>Semester 2 (Genap)</option>
              </select>
            </div>
            <div>
              <label htmlFor="q-topic" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tema / Bab
              </label>
              <select
                id="q-topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm bg-white"
              >
                {formTopics.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="q-prompt" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Pertanyaan
            </label>
            <textarea
              id="q-prompt"
              required
              rows={2}
              placeholder="Contoh: Hasil dari 3/4 + 1/4 adalah ..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: 'Pilihan A', val: optA, set: setOptA, idx: 0 as const },
              { label: 'Pilihan B', val: optB, set: setOptB, idx: 1 as const },
              { label: 'Pilihan C', val: optC, set: setOptC, idx: 2 as const },
              { label: 'Pilihan D', val: optD, set: setOptD, idx: 3 as const },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">{item.label}</label>
                  <label className="inline-flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                    <input
                      type="radio"
                      name="correctIndex"
                      checked={correctIndex === item.idx}
                      onChange={() => setCorrectIndex(item.idx)}
                    />
                    <span>Kunci Benar</span>
                  </label>
                </div>
                <input
                  type="text"
                  required
                  value={item.val}
                  onChange={(e) => item.set(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>
            ))}
          </div>

          <div>
            <label htmlFor="q-explanation" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Pembahasan Singkat untuk Siswa
            </label>
            <input
              id="q-explanation"
              type="text"
              placeholder="Jelaskan langkah atau alasan jawaban benar..."
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 cursor-pointer"
            >
              Simpan Soal
            </button>
          </div>
        </form>
      )}

      {/* Filter Tabs + Semester Filter + Search */}
      <div className="mt-6 flex flex-col gap-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => {
                soundFX.playClick();
                setFilterSubject('ALL');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                filterSubject === 'ALL'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua Mapel ({questions.length})
            </button>
            {subjects.map((s) => {
              const count = questions.filter((q) => q.subjectId === s.id).length;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    setFilterSubject(s.id);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    filterSubject === s.id
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {s.shortName} ({count})
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
              {(
                [
                  { value: 'ALL', label: 'Semua Sem.' },
                  { value: 1, label: 'Sem. 1' },
                  { value: 2, label: 'Sem. 2' },
                ] as const
              ).map((sem) => (
                <button
                  key={String(sem.value)}
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    setFilterSemester(sem.value);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    filterSemester === sem.value
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {sem.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search
                className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
                aria-hidden="true"
              />
              <input
                type="search"
                placeholder="Cari pertanyaan atau tema..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Question List */}
      <div className="mt-5 space-y-3">
        {filteredQuestions.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-sm text-slate-500">
            Tidak ada soal yang cocok dengan filter pencarian.
          </div>
        ) : (
          filteredQuestions.map((q, index) => {
            const subj = subjects.find((s) => s.id === q.subjectId);
            return (
              <div
                key={q.id}
                className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="text-xs font-medium text-slate-500">
                    <span className="tabular-nums">#{index + 1}</span>
                    <span className="mx-1.5" aria-hidden="true">·</span>
                    <span className="text-slate-700 font-semibold">{subj?.shortName}</span>
                    <span className="mx-1.5" aria-hidden="true">·</span>
                    <span>Semester {q.semester}</span>
                    <span className="mx-1.5" aria-hidden="true">·</span>
                    <span>{q.topic}</span>
                    {q.isCustom && (
                      <>
                        <span className="mx-1.5" aria-hidden="true">·</span>
                        <span className="text-blue-700 font-semibold">Soal Guru</span>
                      </>
                    )}
                  </div>
                  <h3 className="font-display text-base font-bold text-slate-900 mt-1.5">
                    {q.prompt}
                  </h3>
                  <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-sm">
                    {q.options.map((opt, idx) => (
                      <div
                        key={idx}
                        className={
                          idx === q.correctIndex
                            ? 'text-emerald-800 font-semibold'
                            : 'text-slate-600'
                        }
                      >
                        {['A', 'B', 'C', 'D'][idx]}. {opt}
                        {idx === q.correctIndex ? ' (Benar)' : ''}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-2.5 leading-relaxed">
                    Pembahasan: {q.explanation}
                  </p>
                </div>

                {q.isCustom && (
                  <button
                    type="button"
                    onClick={() => {
                      soundFX.playClick();
                      onDeleteCustomQuestion(q.id);
                    }}
                    aria-label="Hapus soal buatan guru"
                    className="ifp-touch-target inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-red-200 text-red-700 text-xs font-semibold hover:bg-red-50 shrink-0 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Hapus</span>
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
