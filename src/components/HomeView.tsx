import { useState } from 'react';
import {
  Calculator,
  FlaskConical,
  BookOpen,
  ShieldCheck,
  Languages,
  Palette,
  Volume2,
  VolumeX,
  Shuffle,
  SlidersHorizontal,
  Play,
} from 'lucide-react';
import { GameMode, SubjectId, SubjectInfo, TimerOption } from '../types';
import { soundFX } from '../utils/sound';

interface HomeViewProps {
  subjects: SubjectInfo[];
  questionCounts: Record<SubjectId, number>;
  defaultTimer: TimerOption;
  onChangeDefaultTimer: (timer: TimerOption) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  presetMode?: GameMode;
  onQuickPlay: (subjectId: SubjectId, mode: GameMode) => void;
  onOpenSetup: (subject: SubjectInfo, initialMode?: GameMode) => void;
  onRandomPlay: () => void;
}

const SUBJECT_ICONS: Record<SubjectId, typeof Calculator> = {
  matematika: Calculator,
  ipas: FlaskConical,
  bahasa_indonesia: BookOpen,
  pancasila: ShieldCheck,
  bahasa_inggris: Languages,
  seni_budaya: Palette,
};

export function HomeView({
  subjects,
  questionCounts,
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

  const modeHeading =
    presetMode === 'duel'
      ? 'Pilih Pelajaran untuk Duel 2 Tim (Layar Belah)'
      : presetMode === 'sortir'
        ? 'Pilih Pelajaran untuk Permainan Sortir Cepat'
        : 'Pilih Mata Pelajaran Kelas V';

  const modeSubheading =
    presetMode === 'duel'
      ? 'Dua siswa berdiri di sisi kiri dan kanan papan sentuh untuk adu cepat menjawab soal.'
      : presetMode === 'sortir'
        ? 'Siswa mengelompokkan kartu konsep ke dua keranjang kategori yang tepat secara interaktif.'
        : 'Sentuh Main Langsung untuk segera memulai kuis papan kelas, atau Atur Mode untuk duel dan sortir.';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-10">
      {/* Hero Section (Shown on main home view; skipped when in dedicated mode picker) */}
      {!presetMode && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <p className="text-xs sm:text-sm font-semibold text-blue-700">
                Kurikulum Merdeka · Kelas V Sekolah Dasar
              </p>
              <h1
                className="font-display font-extrabold text-slate-900 tracking-tight mt-2"
                style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', lineHeight: 1.15, textWrap: 'balance' }}
              >
                Belajar Sambil Bermain di Papan Interaktif Kelas V
              </h1>
              <p className="text-slate-600 text-base leading-relaxed mt-3 max-w-2xl">
                Dirancang khusus untuk guru kelas dan layar sentuh IFP. Tinggal pilih mata
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
                  6 Mata Pelajaran Kelas V Kurikulum Merdeka
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Subject Selection Grid */}
      <section aria-labelledby="subjects-heading">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-5">
          <div>
            <h2
              id="subjects-heading"
              className="font-display text-xl sm:text-2xl font-bold text-slate-900"
            >
              {modeHeading}
            </h2>
            <p className="text-sm text-slate-600 mt-1">{modeSubheading}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {subjects.map((subject) => {
            const Icon = SUBJECT_ICONS[subject.id];
            const totalQ = questionCounts[subject.id] || 0;
            const targetMode: GameMode = presetMode ?? 'kuis';

            return (
              <article
                key={subject.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-300 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
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
                  </div>

                  <h3 className="font-display text-lg font-bold text-slate-900 mt-4">
                    {subject.name}
                  </h3>

                  <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                    {subject.description}
                  </p>

                  <div className="mt-3 text-xs text-slate-500 font-medium">
                    <span>{subject.topics.length} Topik</span>
                    <span className="mx-1.5" aria-hidden="true">·</span>
                    <span className="tabular-nums">{totalQ} Soal</span>
                    <span className="mx-1.5" aria-hidden="true">·</span>
                    <span>Kuis, Duel & Sortir</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      soundFX.playClick();
                      onQuickPlay(subject.id, targetMode);
                    }}
                    className="ifp-touch-target flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
                  >
                    <Play className="w-4 h-4 fill-current" aria-hidden="true" />
                    <span>
                      {presetMode === 'duel'
                        ? 'Mulai Duel'
                        : presetMode === 'sortir'
                          ? 'Mulai Sortir'
                          : 'Main Langsung'}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      soundFX.playClick();
                      onOpenSetup(subject, targetMode);
                    }}
                    aria-label={`Atur mode dan topik ${subject.name}`}
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
                  Pilah kartu konsep ke dua kategori utama seperti Fakta vs Opini, Produsen vs
                  Konsumen, atau Hak vs Kewajiban.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
