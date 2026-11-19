import { useState } from 'react';
import {
  Calculator,
  FlaskConical,
  BookOpen,
  ShieldCheck,
  Palette,
  Volume2,
  VolumeX,
  Shuffle,
  SlidersHorizontal,
  Play,
} from 'lucide-react';
import { GameMode, SemesterFilter, SubjectId, SubjectInfo, TimerOption } from '../types';
import { soundFX } from '../utils/sound';

interface HomeViewProps {
  subjects: SubjectInfo[];
  selectedSemester: SemesterFilter;
  onChangeSemester: (semester: SemesterFilter) => void;
  questionCountsBySubject: Record<SubjectId, number>;
  defaultTimer: TimerOption;
  onChangeDefaultTimer: (timer: TimerOption) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  presetMode?: GameMode;
  onQuickPlay: (subjectId: SubjectId, mode: GameMode, topic?: string) => void;
  onOpenSetup: (subject: SubjectInfo, initialMode?: GameMode) => void;
  onRandomPlay: () => void;
}

const SUBJECT_ICONS: Record<SubjectId, typeof Calculator> = {
  matematika: Calculator,
  ipas: FlaskConical,
  bahasa_indonesia: BookOpen,
  pancasila: ShieldCheck,
  seni_budaya: Palette,
};

export function HomeView({
  subjects,
  selectedSemester,
  onChangeSemester,
  questionCountsBySubject,
  defaultTimer,
  onChangeDefaultTimer,
  isMuted,
  onToggleMute,
  presetMode,
  onQuickPlay,
  onOpenSetup,
  onRandomPlay,
}: HomeViewProps) {
  const [heroImgFailed, setHeroImgFailed] = useState(false);

  const timerOptions: Array<{ value: TimerOption; label: string }> = [
    { value: 0, label: 'Tanpa Timer' },
    { value: 20, label: '20 dtk' },
    { value: 30, label: '30 dtk' },
    { value: 45, label: '45 dtk' },
  ];

  const semesterOptions: Array<{ value: SemesterFilter; label: string }> = [
    { value: 'ALL', label: 'Semua Semester' },
    { value: 1, label: 'Semester 1 (Ganjil)' },
    { value: 2, label: 'Semester 2 (Genap)' },
  ];

  const modeHeading =
    presetMode === 'duel'
      ? 'Pilih Pelajaran & Tema Duel 2 Tim'
      : presetMode === 'sortir'
        ? 'Pilih Pelajaran & Tema Sortir Cepat'
        : 'Pilih Mata Pelajaran & Tema Kelas V';

  const modeSubheading =
    presetMode === 'duel'
      ? 'Pilih semester lalu sentuh pelajaran atau tema yang ingin ditandingkan di layar belah.'
      : presetMode === 'sortir'
        ? 'Pilih semester untuk memainkan sortir kartu konsep yang sesuai dengan materi kelas.'
        : 'Pilih Semester 1 atau Semester 2, lalu sentuh tema pelajaran untuk langsung bermain.';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-10">
      {/* Hero Section (Shown on main home view; skipped when in dedicated mode picker) */}
      {!presetMode && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <p className="text-xs sm:text-sm font-semibold text-blue-700">
                Kurikulum Merdeka · Kelas V SD · Semester 1 &amp; 2
              </p>
              <h1
                className="font-display font-extrabold text-slate-900 tracking-tight mt-2"
                style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', lineHeight: 1.15, textWrap: 'balance' }}
              >
                Belajar Sambil Bermain di Papan Interaktif Kelas V
              </h1>
              <p className="text-slate-600 text-base leading-relaxed mt-3 max-w-2xl">
                Dirancang khusus untuk guru kelas dan layar sentuh IFP. Pilih semester dan tema
                pelajaran, lalu ajak siswa bermain kuis klasikal, duel dua tim, atau sortir materi.
              </p>
            </div>

            {/* Workspace Quick Controls + Primary CTA */}
            <div className="mt-6 pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                  {timerOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        soundFX.playClick();
                        onChangeDefaultTimer(opt.value);
                      }}
                      className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        defaultTimer === opt.value
                          ? 'bg-white text-slate-900 shadow-xs font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={onToggleMute}
                  className="ifp-touch-target inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer whitespace-nowrap shrink-0"
                >
                  {isMuted ? (
                    <>
                      <VolumeX className="w-4 h-4 text-slate-500" aria-hidden="true" />
                      <span>Suara Mati</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-blue-700" aria-hidden="true" />
                      <span>Suara Aktif</span>
                    </>
                  )}
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundFX.playClick();
                  onRandomPlay();
                }}
                className="ifp-touch-target inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap shrink-0"
              >
                <Shuffle className="w-4 h-4" aria-hidden="true" />
                <span>Mulai Kuis Acak</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 min-h-[240px]">
            {!heroImgFailed ? (
              <img
                src="/src/assets/images/hero_ifp_classroom_1795054378035.jpg"
                alt="Suasana guru mengajar siswa Kelas V menggunakan papan tulis interaktif IFP"
                referrerPolicy="no-referrer"
                onError={() => setHeroImgFailed(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-50 via-slate-50 to-emerald-50 flex flex-col items-center justify-center p-8 text-center">
                <BookOpen className="w-12 h-12 text-blue-700 mb-3" aria-hidden="true" />
                <div className="font-display text-lg font-bold text-slate-900">
                  Siap Digunakan di Papan Sentuh
                </div>
                <p className="text-sm text-slate-600 mt-1">
                  5 Mata Pelajaran Kelas V · Semester 1 &amp; 2
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Subject & Semester Selection Section */}
      <section aria-labelledby="subjects-heading">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
          <div>
            <h2
              id="subjects-heading"
              className="font-display text-xl sm:text-2xl font-bold text-slate-900"
            >
              {modeHeading}
            </h2>
            <p className="text-sm text-slate-600 mt-1">{modeSubheading}</p>
          </div>

          {/* Interactive Semester Segmented Control */}
          <div
            className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-xl self-start lg:self-auto"
            role="group"
            aria-label="Filter Semester"
          >
            {semesterOptions.map((opt) => (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => {
                  soundFX.playClick();
                  onChangeSemester(opt.value);
                }}
                className={`ifp-touch-target px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedSemester === opt.value
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {subjects.map((subject) => {
            const Icon = SUBJECT_ICONS[subject.id];
            const totalQ = questionCountsBySubject[subject.id] || 0;
            const targetMode: GameMode = presetMode ?? 'kuis';

            const activeTopics =
              selectedSemester === 1
                ? subject.topicsBySemester[1]
                : selectedSemester === 2
                  ? subject.topicsBySemester[2]
                  : [...subject.topicsBySemester[1], ...subject.topicsBySemester[2]];

            return (
              <article
                key={subject.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-300 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border"
                      style={{
                        backgroundColor: subject.softBg,
                        borderColor: subject.borderTint,
                        color: subject.accentColor,
                      }}
                    >
                      <Icon className="w-6 h-6" aria-hidden="true" />
                    </div>

                    <div className="text-xs text-slate-500 font-medium text-right">
                      <span>
                        {selectedSemester === 'ALL'
                          ? 'Sem. 1 & 2'
                          : `Semester ${selectedSemester}`}
                      </span>
                      <span className="mx-1.5" aria-hidden="true">·</span>
                      <span className="tabular-nums">{totalQ} Soal</span>
                    </div>
                  </div>

                  <h3 className="font-display text-lg font-bold text-slate-900 mt-4">
                    {subject.name}
                  </h3>

                  <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                    {subject.description}
                  </p>

                  {/* Interactive Theme Quick-Launch List */}
                  {presetMode !== 'sortir' ? (
                    <div className="mt-4 pt-3.5 border-t border-slate-100">
                      <div className="text-xs font-semibold text-slate-500 mb-2">
                        {selectedSemester === 'ALL'
                          ? 'Tema Semester 1 & 2 (sentuh untuk mulai):'
                          : `Tema Semester ${selectedSemester} (sentuh untuk mulai):`}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {activeTopics.map((topic) => (
                          <button
                            key={topic}
                            type="button"
                            onClick={() => {
                              soundFX.playClick();
                              onQuickPlay(subject.id, targetMode, topic);
                            }}
                            className="ifp-touch-target w-full text-left px-3 py-2 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-blue-50 hover:border-blue-300 text-xs sm:text-sm font-medium text-slate-800 flex items-center justify-between gap-2 transition-colors cursor-pointer"
                          >
                            <span className="truncate">{topic}</span>
                            <Play className="w-3.5 h-3.5 text-blue-700 shrink-0" aria-hidden="true" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 pt-3.5 border-t border-slate-100 text-xs text-slate-500">
                      <span>
                        {selectedSemester === 2
                          ? `Tema Sortir: ${subject.topicsBySemester[2][0]}`
                          : selectedSemester === 1
                            ? `Tema Sortir: ${subject.topicsBySemester[1][0]}`
                            : 'Tersedia tantangan sortir Semester 1 & 2'}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      soundFX.playClick();
                      onQuickPlay(subject.id, targetMode, 'ALL');
                    }}
                    className="ifp-touch-target flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
                  >
                    <Play className="w-4 h-4 fill-current" aria-hidden="true" />
                    <span>
                      {presetMode === 'duel'
                        ? 'Duel Semua Tema'
                        : presetMode === 'sortir'
                          ? 'Mulai Sortir'
                          : 'Main Semua Tema'}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      soundFX.playClick();
                      onOpenSetup(subject, targetMode);
                    }}
                    aria-label={`Atur mode dan tema ${subject.name}`}
                    className="ifp-touch-target inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
                    <span>Atur</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Classroom IFP Game Modes Guide */}
      {!presetMode && (
        <section className="pt-4 border-t border-slate-200">
          <div className="mb-5">
            <h2 className="font-display text-xl font-bold text-slate-900">
              Tiga Mode Permainan Layar Sentuh IFP
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Sesuaikan format permainan dengan dinamika belajar siswa di kelas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              <div className="aspect-4/3 bg-slate-100 overflow-hidden">
                <img
                  src="/src/assets/images/subject_matematika_1795054377617.jpg"
                  alt="Ilustrasi kuis papan klasikal dengan alat peraga matematika"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5">
                <div className="text-xs font-medium text-slate-500">Mode 01 · Klasikal</div>
                <h3 className="font-display text-base font-bold text-slate-900 mt-1">
                  Kuis Papan Klasikal
                </h3>
                <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                  Siswa bergantian mengetuk jawaban di papan IFP lengkap dengan diagram visual,
                  bantuan 50:50, jeda waktu, dan pembahasan guru.
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              <div className="aspect-4/3 bg-slate-100 overflow-hidden">
                <img
                  src="/src/assets/images/subject_ipas_1795054376893.jpg"
                  alt="Ilustrasi materi IPAS untuk duel dua tim di layar belah"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5">
                <div className="text-xs font-medium text-slate-500">Mode 02 · Kompetitif</div>
                <h3 className="font-display text-base font-bold text-slate-900 mt-1">
                  Duel 2 Tim (Layar Belah)
                </h3>
                <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                  Layar papan terbelah untuk Tim Merah dan Tim Biru. Siswa adu cepat menyentuh
                  jawaban benar untuk menarik garis skor timnya.
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              <div className="aspect-4/3 bg-slate-100 overflow-hidden">
                <img
                  src="/src/assets/images/subject_literasi_budaya_1795054377644.jpg"
                  alt="Ilustrasi literasi dan budaya Nusantara untuk permainan sortir cepat"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5">
                <div className="text-xs font-medium text-slate-500">Mode 03 · Kategorisasi</div>
                <h3 className="font-display text-base font-bold text-slate-900 mt-1">
                  Sortir Cepat Sentuh
                </h3>
                <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                  Pilah kartu konsep Semester 1 dan Semester 2 seperti Majas, Fakta vs Opini,
                  Produsen vs Konsumen, atau Hak vs Kewajiban.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
