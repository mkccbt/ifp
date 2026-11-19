import { useState } from 'react';
import {
  Calculator,
  FlaskConical,
  BookOpen,
  ShieldCheck,
  Palette,
  Volume2,
  VolumeX,
  SlidersHorizontal,
  Play,
  Dices,
  ClipboardCheck,
  Target,
} from 'lucide-react';
import { GameMode, SemesterFilter, SubjectId, SubjectInfo, TimerOption } from '../types';
import { LEARNING_OBJECTIVES } from '../data/mpiContent';
import { SpeakButton } from './SpeakButton';
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
  onQuickPlay: (subjectId: SubjectId, mode: GameMode, topic?: string) => void;
  onOpenSetup: (subject: SubjectInfo, initialMode?: GameMode) => void;
  onOpenBacaan: (subjectId: SubjectId) => void;
  onOpenUlarTangga: (subjectId?: SubjectId) => void;
  onOpenAsesmen: () => void;
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
  onQuickPlay,
  onOpenSetup,
  onOpenBacaan,
  onOpenUlarTangga,
  onOpenAsesmen,
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-10">
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <p className="text-xs sm:text-sm font-semibold text-blue-700">
              Media Pembelajaran Interaktif (MPI) · Kelas V Sekolah Dasar
            </p>
            <h1
              className="font-display font-extrabold text-slate-900 tracking-tight mt-2"
              style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', lineHeight: 1.15, textWrap: 'balance' }}
            >
              Belajar Aktif dengan Bacaan, Game Ular Tangga, dan Asesmen IFP
            </h1>
            <p className="text-slate-600 text-base leading-relaxed mt-3 max-w-2xl">
              Lengkap dengan tujuan pembelajaran, bahan bacaan literasi &amp; numerasi (tabel serta
              grafik), speaker pembaca teks untuk siswa belum lancar membaca, dan game papan sentuh.
            </p>
          </div>

          {/* Quick Controls + Primary Action */}
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
                onOpenUlarTangga();
              }}
              className="ifp-touch-target inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              <Dices className="w-4 h-4" aria-hidden="true" />
              <span>Main Ular Tangga</span>
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

      {/* MPI 4-Pillar Quick Access Strip */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          type="button"
          onClick={() => {
            soundFX.playClick();
            onOpenBacaan('matematika');
          }}
          className="ifp-touch-target text-left bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-300 transition-colors cursor-pointer"
        >
          <Target className="w-5 h-5 text-blue-700 mb-2" aria-hidden="true" />
          <div className="font-display text-base font-bold text-slate-900">Tujuan Pembelajaran</div>
          <p className="text-xs text-slate-600 mt-1">
            Capaian belajar Semester 1 &amp; 2 per mata pelajaran lengkap dengan speaker suara.
          </p>
        </button>

        <button
          type="button"
          onClick={() => {
            soundFX.playClick();
            onOpenBacaan('matematika');
          }}
          className="ifp-touch-target text-left bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-300 transition-colors cursor-pointer"
        >
          <BookOpen className="w-5 h-5 text-emerald-700 mb-2" aria-hidden="true" />
          <div className="font-display text-base font-bold text-slate-900">Literasi &amp; Numerasi</div>
          <p className="text-xs text-slate-600 mt-1">
            Bahan bacaan, tabel data, grafik batang, dan latihan pemahaman ber-speaker.
          </p>
        </button>

        <button
          type="button"
          onClick={() => {
            soundFX.playClick();
            onOpenUlarTangga();
          }}
          className="ifp-touch-target text-left bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-300 transition-colors cursor-pointer"
        >
          <Dices className="w-5 h-5 text-amber-600 mb-2" aria-hidden="true" />
          <div className="font-display text-base font-bold text-slate-900">Game Ular Tangga</div>
          <p className="text-xs text-slate-600 mt-1">
            Papan 30 petak untuk 2–4 kelompok dengan lempar dadu dan soal interaktif.
          </p>
        </button>

        <button
          type="button"
          onClick={() => {
            soundFX.playClick();
            onOpenAsesmen();
          }}
          className="ifp-touch-target text-left bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-300 transition-colors cursor-pointer"
        >
          <ClipboardCheck className="w-5 h-5 text-red-700 mb-2" aria-hidden="true" />
          <div className="font-display text-base font-bold text-slate-900">Asesmen &amp; Rekap</div>
          <p className="text-xs text-slate-600 mt-1">
            Evaluasi formatif akhir sesi lengkap dengan skor 0–100, pembahasan, dan ekspor CSV.
          </p>
        </button>
      </section>

      {/* Subject & Semester Selection Section */}
      <section aria-labelledby="subjects-heading">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
          <div>
            <h2
              id="subjects-heading"
              className="font-display text-xl sm:text-2xl font-bold text-slate-900"
            >
              Pilih Mata Pelajaran &amp; Tema Kelas V
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Pilih Semester 1 atau Semester 2, baca tujuan pembelajaran, lalu mulai game atau bahan bacaan.
            </p>
          </div>

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

            const activeTopics =
              selectedSemester === 1
                ? subject.topicsBySemester[1]
                : selectedSemester === 2
                  ? subject.topicsBySemester[2]
                  : [...subject.topicsBySemester[1], ...subject.topicsBySemester[2]];

            const sampleObjective = LEARNING_OBJECTIVES.find(
              (tp) =>
                tp.subjectId === subject.id &&
                (selectedSemester === 'ALL' || tp.semester === selectedSemester)
            );

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

                  {sampleObjective && (
                    <div className="mt-2 bg-slate-50 border border-slate-200 rounded-xl p-3">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[11px] font-bold text-slate-700">
                          Tujuan Pembelajaran
                        </span>
                        <SpeakButton
                          speakId={`home-tp-${subject.id}`}
                          text={`Tujuan Pembelajaran ${subject.name}: ${sampleObjective.goal}`}
                          label="Dengar"
                          compact
                        />
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {sampleObjective.goal}
                      </p>
                    </div>
                  )}

                  {/* Interactive Theme Quick-Launch List */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="text-xs font-semibold text-slate-500 mb-2">
                      {selectedSemester === 'ALL'
                        ? 'Tema Semester 1 & 2:'
                        : `Tema Semester ${selectedSemester}:`}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {activeTopics.slice(0, 4).map((topic) => (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => {
                            soundFX.playClick();
                            onQuickPlay(subject.id, 'kuis', topic);
                          }}
                          className="ifp-touch-target w-full text-left px-3 py-2 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-blue-50 hover:border-blue-300 text-xs sm:text-sm font-medium text-slate-800 flex items-center justify-between gap-2 transition-colors cursor-pointer"
                        >
                          <span className="truncate">{topic}</span>
                          <Play className="w-3.5 h-3.5 text-blue-700 shrink-0" aria-hidden="true" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        soundFX.playClick();
                        onQuickPlay(subject.id, 'kuis', 'ALL');
                      }}
                      className="ifp-touch-target flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
                    >
                      <Play className="w-4 h-4 fill-current" aria-hidden="true" />
                      <span>Main Kuis</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        soundFX.playClick();
                        onOpenSetup(subject, 'ular_tangga');
                      }}
                      className="ifp-touch-target inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
                      <span>Mode Game</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      soundFX.playClick();
                      onOpenBacaan(subject.id);
                    }}
                    className="ifp-touch-target w-full inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-xs font-semibold hover:bg-slate-100 cursor-pointer whitespace-nowrap"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                    <span>Buka Bahan Bacaan &amp; Grafik</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Classroom IFP Game Modes Guide */}
      <section className="pt-4 border-t border-slate-200">
        <div className="mb-5">
          <h2 className="font-display text-xl font-bold text-slate-900">
            Pilihan Permainan Papan Sentuh (IFP)
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Tersedia Ular Tangga Edukasi, Kuis Klasikal, Duel 2 Tim, dan Sortir Cepat dengan speaker suara.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="aspect-4/3 bg-slate-100 overflow-hidden">
              <img
                src="/src/assets/images/subject_matematika_1795054377617.jpg"
                alt="Ilustrasi kuis papan klasikal dan numerasi kelas V"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-5">
              <div className="text-xs font-medium text-slate-500">Mode 01 · Papan Klasikal</div>
              <h3 className="font-display text-base font-bold text-slate-900 mt-1">
                Kuis &amp; Ular Tangga Edukasi
              </h3>
              <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                Lempar dadu pada papan 30 petak atau jawab kuis ber-diagram visual lengkap dengan
                tombol speaker pembaca soal.
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
                alt="Ilustrasi literasi dan budaya Nusantara untuk sortir cepat dan bacaan"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-5">
              <div className="text-xs font-medium text-slate-500">Mode 03 · Literasi &amp; Sortir</div>
              <h3 className="font-display text-base font-bold text-slate-900 mt-1">
                Sortir Cepat &amp; Asesmen
              </h3>
              <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                Pilah kartu konsep Semester 1–2 dan ukur pencapaian Tujuan Pembelajaran lewat
                modul Asesmen Kelas V.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
