import { useState } from 'react';
import { X, Users, Layers, MonitorPlay, Clock } from 'lucide-react';
import { GameMode, QuizQuestion, SemesterFilter, SessionConfig, SubjectInfo, TimerOption } from '../types';
import { soundFX } from '../utils/sound';

interface SubjectSetupModalProps {
  subject: SubjectInfo;
  initialMode?: GameMode;
  initialSemester?: SemesterFilter;
  defaultTimer: TimerOption;
  subjectQuestions: QuizQuestion[];
  onClose: () => void;
  onStart: (config: SessionConfig) => void;
}

export function SubjectSetupModal({
  subject,
  initialMode = 'kuis',
  initialSemester = 'ALL',
  defaultTimer,
  subjectQuestions,
  onClose,
  onStart,
}: SubjectSetupModalProps) {
  const [semester, setSemester] = useState<SemesterFilter>(initialSemester);
  const [selectedTopic, setSelectedTopic] = useState<string>('ALL');
  const [mode, setMode] = useState<GameMode>(initialMode);
  const [timerSeconds, setTimerSeconds] = useState<TimerOption>(defaultTimer);
  const [teamRedName, setTeamRedName] = useState('Tim Merah');
  const [teamBlueName, setTeamBlueName] = useState('Tim Biru');

  const modes: Array<{
    id: GameMode;
    title: string;
    desc: string;
    icon: typeof MonitorPlay;
  }> = [
    {
      id: 'kuis',
      title: 'Kuis Papan Klasikal',
      desc: 'Seluruh kelas menjawab bersama atau bergiliran maju dengan pembahasan guru.',
      icon: MonitorPlay,
    },
    {
      id: 'duel',
      title: 'Duel 2 Tim (Layar Belah)',
      desc: 'Dua siswa berdiri di kiri & kanan papan sentuh untuk adu cepat menjawab.',
      icon: Users,
    },
    {
      id: 'sortir',
      title: 'Sortir Cepat Sentuh',
      desc: 'Pilah kartu materi ke dua keranjang kategori yang tepat secara bergantian.',
      icon: Layers,
    },
  ];

  const semesterOptions: Array<{ value: SemesterFilter; label: string }> = [
    { value: 'ALL', label: 'Semua Semester' },
    { value: 1, label: 'Semester 1 (Ganjil)' },
    { value: 2, label: 'Semester 2 (Genap)' },
  ];

  const timerOptions: Array<{ value: TimerOption; label: string }> = [
    { value: 0, label: 'Tanpa Timer' },
    { value: 20, label: '20 Detik' },
    { value: 30, label: '30 Detik' },
    { value: 45, label: '45 Detik' },
  ];

  const filteredBySemester = subjectQuestions.filter(
    (q) => semester === 'ALL' || q.semester === semester
  );

  const availableTopics =
    semester === 1
      ? subject.topicsBySemester[1]
      : semester === 2
        ? subject.topicsBySemester[2]
        : [...subject.topicsBySemester[1], ...subject.topicsBySemester[2]];

  const handleSemesterChange = (nextSemester: SemesterFilter) => {
    soundFX.playClick();
    setSemester(nextSemester);
    setSelectedTopic('ALL');
  };

  const handleLaunch = () => {
    soundFX.playClick();
    onStart({
      subjectId: subject.id,
      semester,
      topic: mode === 'sortir' ? 'ALL' : selectedTopic,
      mode,
      timerSeconds,
      teamRedName: teamRedName.trim() || 'Tim Merah',
      teamBlueName: teamBlueName.trim() || 'Tim Biru',
      questionCount: 10,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="setup-modal-title"
    >
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl overflow-hidden shadow-xl">
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-slate-500">
              Pengaturan Permainan · Kelas V SD
            </p>
            <h2 id="setup-modal-title" className="font-display text-xl font-bold text-slate-900 mt-0.5">
              {subject.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              soundFX.playClick();
              onClose();
            }}
            aria-label="Tutup pengaturan"
            className="ifp-touch-target w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Mode selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-3">
              1. Pilih Mode Permainan IFP
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {modes.map((m) => {
                const Icon = m.icon;
                const active = mode === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      soundFX.playClick();
                      setMode(m.id);
                    }}
                    className={`ifp-touch-target text-left p-4 rounded-xl border transition-all cursor-pointer ${
                      active
                        ? 'bg-blue-50 border-blue-600 ring-1 ring-blue-600'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 mb-2 ${active ? 'text-blue-700' : 'text-slate-500'}`}
                      aria-hidden="true"
                    />
                    <div className="font-display text-sm font-bold text-slate-900">{m.title}</div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{m.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Semester selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2.5">
              2. Pilih Semester
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl">
              {semesterOptions.map((opt) => (
                <button
                  key={String(opt.value)}
                  type="button"
                  onClick={() => handleSemesterChange(opt.value)}
                  className={`ifp-touch-target py-2 px-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                    semester === opt.value
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Topic selection (for Kuis and Duel) */}
          {mode !== 'sortir' && (
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2.5">
                3. Pilih Tema / Bab Materi
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    setSelectedTopic('ALL');
                  }}
                  className={`ifp-touch-target px-4 py-2 rounded-lg text-sm font-medium border transition-colors whitespace-nowrap cursor-pointer ${
                    selectedTopic === 'ALL'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Semua Tema ({filteredBySemester.length} Soal)
                </button>
                {availableTopics.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => {
                      soundFX.playClick();
                      setSelectedTopic(topic);
                    }}
                    className={`ifp-touch-target px-4 py-2 rounded-lg text-sm font-medium border transition-colors whitespace-nowrap cursor-pointer ${
                      selectedTopic === topic
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Timer control */}
          {mode !== 'sortir' && (
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-800 mb-2.5">
                <Clock className="w-4 h-4 text-slate-500" aria-hidden="true" />
                <span>4. Pengaturan Waktu Per Soal</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1 bg-slate-100 rounded-xl">
                {timerOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      soundFX.playClick();
                      setTimerSeconds(opt.value);
                    }}
                    className={`ifp-touch-target py-2 px-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                      timerSeconds === opt.value
                        ? 'bg-white text-slate-900 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom Team Names for Duel Mode */}
          {mode === 'duel' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
              <div>
                <label htmlFor="team-red-input" className="block text-xs font-semibold text-red-700 mb-1.5">
                  Nama Tim Kiri
                </label>
                <input
                  id="team-red-input"
                  type="text"
                  maxLength={20}
                  value={teamRedName}
                  onChange={(e) => setTeamRedName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:border-red-600"
                />
              </div>
              <div>
                <label htmlFor="team-blue-input" className="block text-xs font-semibold text-blue-700 mb-1.5">
                  Nama Tim Kanan
                </label>
                <input
                  id="team-blue-input"
                  type="text"
                  maxLength={20}
                  value={teamBlueName}
                  onChange={(e) => setTeamBlueName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              soundFX.playClick();
              onClose();
            }}
            className="ifp-touch-target px-5 py-2.5 rounded-lg text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 cursor-pointer whitespace-nowrap"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleLaunch}
            className="ifp-touch-target px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
          >
            Mulai Permainan
          </button>
        </div>
      </div>
    </div>
  );
}
