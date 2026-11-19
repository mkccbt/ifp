import { useEffect, useMemo, useState } from 'react';
import {
  Dices,
  RotateCcw,
  Trophy,
  Volume2,
  VolumeX,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  XCircle,
  Play,
} from 'lucide-react';
import { QuizQuestion, SemesterFilter, SubjectId, SubjectInfo } from '../types';
import { SpeakButton } from './SpeakButton';
import { QuestionVisual } from './QuestionVisual';
import { soundFX } from '../utils/sound';
import { ttsEngine } from '../utils/tts';

interface UlarTanggaGameProps {
  subjects: SubjectInfo[];
  allQuestions: QuizQuestion[];
  initialSubjectId?: SubjectId;
  initialSemester?: SemesterFilter;
  isMuted: boolean;
  onToggleMute: () => void;
}

interface PlayerState {
  id: number;
  name: string;
  color: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  position: number; // 1 to 30
  score: number;
  correctCount: number;
}

const TEAM_PRESETS = [
  {
    id: 0,
    name: 'Tim Merah',
    color: '#DC2626',
    bgClass: 'bg-red-600',
    borderClass: 'border-red-300',
    textClass: 'text-red-700',
  },
  {
    id: 1,
    name: 'Tim Biru',
    color: '#1D4ED8',
    bgClass: 'bg-blue-700',
    borderClass: 'border-blue-300',
    textClass: 'text-blue-700',
  },
  {
    id: 2,
    name: 'Tim Hijau',
    color: '#047857',
    bgClass: 'bg-emerald-700',
    borderClass: 'border-emerald-300',
    textClass: 'text-emerald-700',
  },
  {
    id: 3,
    name: 'Tim Kuning',
    color: '#D97706',
    bgClass: 'bg-amber-600',
    borderClass: 'border-amber-300',
    textClass: 'text-amber-700',
  },
];

// 30-tile board (6 cols x 5 rows)
const LADDERS: Record<number, number> = {
  4: 14,
  9: 21,
  17: 28,
};

const SNAKES: Record<number, number> = {
  16: 6,
  23: 11,
  29: 19,
};

const OPTION_LABELS = ['A', 'B', 'C', 'D'] as const;

// Convert tile 1..30 to SVG center coordinates in viewBox 0..600 x 0..500
function getTileCenter(tile: number): { x: number; y: number } {
  const zeroBased = Math.max(0, Math.min(29, tile - 1));
  const rowFromBottom = Math.floor(zeroBased / 6);
  const colInRow = zeroBased % 6;
  const col = rowFromBottom % 2 === 0 ? colInRow : 5 - colInRow;
  const rowFromTop = 4 - rowFromBottom;
  return {
    x: col * 100 + 50,
    y: rowFromTop * 100 + 50,
  };
}

// Generate grid rows from top (rowFromTop 0..4) to bottom
function buildBoardGrid(): number[] {
  const tiles: number[] = [];
  for (let rowFromTop = 0; rowFromTop < 5; rowFromTop++) {
    const rowFromBottom = 4 - rowFromTop;
    for (let col = 0; col < 6; col++) {
      const colInRow = rowFromBottom % 2 === 0 ? col : 5 - col;
      tiles.push(rowFromBottom * 6 + colInRow + 1);
    }
  }
  return tiles;
}

const BOARD_TILES = buildBoardGrid();

export function UlarTanggaGame({
  subjects,
  allQuestions,
  initialSubjectId = 'matematika',
  initialSemester = 'ALL',
  isMuted,
  onToggleMute,
}: UlarTanggaGameProps) {
  const [phase, setPhase] = useState<'SETUP' | 'PLAYING' | 'FINISHED'>('SETUP');
  const [subjectId, setSubjectId] = useState<SubjectId>(initialSubjectId);
  const [semester, setSemester] = useState<SemesterFilter>(initialSemester);
  const [teamCount, setTeamCount] = useState<2 | 3 | 4>(2);
  const [teamNames, setTeamNames] = useState<string[]>([
    'Tim Merah',
    'Tim Biru',
    'Tim Hijau',
    'Tim Kuning',
  ]);
  const [autoSpeak, setAutoSpeak] = useState<boolean>(true);

  const [players, setPlayers] = useState<PlayerState[]>([]);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [diceValue, setDiceValue] = useState<number>(1);
  const [isRolling, setIsRolling] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Sentuh Lempar Dadu untuk memulai!');

  const [activeChallenge, setActiveChallenge] = useState<{
    question: QuizQuestion;
    tile: number;
    specialType: 'ladder' | 'snake' | 'normal';
    targetTile: number;
    answeredIndex: number | null;
  } | null>(null);

  const [winner, setWinner] = useState<PlayerState | null>(null);

  const filteredQuestions = useMemo(() => {
    const pool = allQuestions.filter(
      (q) => q.subjectId === subjectId && (semester === 'ALL' || q.semester === semester)
    );
    return pool.length > 0 ? pool : allQuestions;
  }, [allQuestions, subjectId, semester]);

  const activeSubject = subjects.find((s) => s.id === subjectId) || subjects[0];

  const startGame = () => {
    soundFX.playClick();
    const initialPlayers: PlayerState[] = TEAM_PRESETS.slice(0, teamCount).map((preset, idx) => ({
      ...preset,
      name: teamNames[idx]?.trim() || preset.name,
      position: 1,
      score: 0,
      correctCount: 0,
    }));
    setPlayers(initialPlayers);
    setCurrentTurn(0);
    setDiceValue(1);
    setIsRolling(false);
    setWinner(null);
    setActiveChallenge(null);
    setStatusMessage(`Giliran ${initialPlayers[0].name} melempar dadu.`);
    setPhase('PLAYING');
  };

  // Auto-read question aloud when activeChallenge opens (helps students who can't read)
  useEffect(() => {
    if (activeChallenge && activeChallenge.answeredIndex === null && autoSpeak) {
      const q = activeChallenge.question;
      const text = `${q.prompt}. Pilihan A: ${q.options[0]}. Pilihan B: ${q.options[1]}. Pilihan C: ${q.options[2]}. Pilihan D: ${q.options[3]}.`;
      ttsEngine.speak(`ut-q-${q.id}`, text);
    }
    return () => {
      ttsEngine.stop();
    };
  }, [activeChallenge?.question.id, autoSpeak]);

  const handleRollDice = () => {
    if (isRolling || activeChallenge || phase !== 'PLAYING') return;
    soundFX.playClick();
    setIsRolling(true);

    let ticks = 0;
    const rollInterval = window.setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      ticks++;
      if (ticks >= 8) {
        window.clearInterval(rollInterval);
        const finalRoll = Math.floor(Math.random() * 6) + 1;
        setDiceValue(finalRoll);
        setIsRolling(false);

        const activePlayer = players[currentTurn];
        const nextTile = Math.min(30, activePlayer.position + finalRoll);

        // Move pawn to landed tile first
        setPlayers((prev) =>
          prev.map((p, idx) => (idx === currentTurn ? { ...p, position: nextTile } : p))
        );

        const ladderTo = LADDERS[nextTile];
        const snakeTo = SNAKES[nextTile];
        const specialType: 'ladder' | 'snake' | 'normal' = ladderTo
          ? 'ladder'
          : snakeTo
            ? 'snake'
            : 'normal';
        const targetTile = ladderTo || snakeTo || nextTile;

        if (specialType === 'ladder') {
          setStatusMessage(
            `${activePlayer.name} mendapat dadu ${finalRoll} → Petak ${nextTile} (Tangga ke ${targetTile})! Jawab benar untuk naik!`
          );
        } else if (specialType === 'snake') {
          setStatusMessage(
            `${activePlayer.name} mendapat dadu ${finalRoll} → Petak ${nextTile} (Kepala Ular!). Jawab benar agar tidak turun ke ${targetTile}!`
          );
        } else {
          setStatusMessage(
            `${activePlayer.name} mendapat dadu ${finalRoll} → Petak ${nextTile}. Jawab tantangan berikut!`
          );
        }

        const randomQ =
          filteredQuestions[Math.floor(Math.random() * filteredQuestions.length)];

        setActiveChallenge({
          question: randomQ,
          tile: nextTile,
          specialType,
          targetTile,
          answeredIndex: null,
        });
      }
    }, 80);
  };

  const handleAnswerChallenge = (optionIdx: number) => {
    if (!activeChallenge || activeChallenge.answeredIndex !== null) return;
    ttsEngine.stop();

    const isCorrect = optionIdx === activeChallenge.question.correctIndex;
    if (isCorrect) {
      soundFX.playCorrect();
    } else {
      soundFX.playWrong();
    }

    setActiveChallenge((prev) => (prev ? { ...prev, answeredIndex: optionIdx } : null));

    const currentPlayer = players[currentTurn];
    let finalPos = activeChallenge.tile;
    let pointsAdded = 0;

    if (isCorrect) {
      pointsAdded = 100;
      if (activeChallenge.specialType === 'ladder') {
        finalPos = activeChallenge.targetTile;
      }
    } else {
      if (activeChallenge.specialType === 'snake') {
        finalPos = activeChallenge.targetTile;
      } else if (activeChallenge.specialType === 'normal') {
        finalPos = Math.max(1, activeChallenge.tile - 1);
      }
    }

    setPlayers((prev) =>
      prev.map((p, idx) =>
        idx === currentTurn
          ? {
              ...p,
              position: finalPos,
              score: p.score + pointsAdded,
              correctCount: p.correctCount + (isCorrect ? 1 : 0),
            }
          : p
      )
    );

    if (isCorrect) {
      if (activeChallenge.specialType === 'ladder') {
        setStatusMessage(
          `Benar! ${currentPlayer.name} naik tangga ke Petak ${finalPos} (+100 poin)!`
        );
      } else if (activeChallenge.specialType === 'snake') {
        setStatusMessage(
          `Benar! ${currentPlayer.name} selamat dari ular dan bertahan di Petak ${finalPos} (+100 poin)!`
        );
      } else {
        setStatusMessage(`Benar! ${currentPlayer.name} bertahan di Petak ${finalPos} (+100 poin).`);
      }
    } else {
      if (activeChallenge.specialType === 'snake') {
        setStatusMessage(
          `Kurang tepat! ${currentPlayer.name} meluncur turun ular ke Petak ${finalPos}.`
        );
      } else if (activeChallenge.specialType === 'normal') {
        setStatusMessage(
          `Kurang tepat! ${currentPlayer.name} mundur 1 langkah ke Petak ${finalPos}.`
        );
      } else {
        setStatusMessage(`Kurang tepat! ${currentPlayer.name} gagal naik tangga, tetap di Petak ${finalPos}.`);
      }
    }
  };

  const handleCloseChallengeAndAdvance = () => {
    soundFX.playClick();
    ttsEngine.stop();
    const updatedPlayer = players[currentTurn];
    setActiveChallenge(null);

    if (updatedPlayer && updatedPlayer.position >= 30) {
      soundFX.playWin();
      setWinner(updatedPlayer);
      setPhase('FINISHED');
      return;
    }

    const nextTurn = (currentTurn + 1) % players.length;
    setCurrentTurn(nextTurn);
    setStatusMessage(`Giliran ${players[nextTurn].name} melempar dadu!`);
  };

  // SETUP SCREEN
  if (phase === 'SETUP') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
          <div>
            <p className="text-xs font-semibold text-blue-700">
              Permainan Papan Sentuh IFP · Kelas V SD
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Ular Tangga Edukasi Kelas V
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
              Siswa bergiliran melempar dadu untuk maju menuju Petak 30. Menjawab benar di dasar
              tangga membuat kelompok naik tangga, sementara menjawab benar di kepala ular melindungi
              kelompok agar tidak meluncur turun.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-slate-200">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                1. Pilih Mata Pelajaran
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
                    className={`ifp-touch-target px-3.5 py-2 rounded-lg text-sm font-medium border transition-colors cursor-pointer ${
                      subjectId === s.id
                        ? 'bg-blue-700 text-white border-blue-700'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {s.shortName}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                2. Pilih Semester
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
                {(
                  [
                    { val: 'ALL', label: 'Semua' },
                    { val: 1, label: 'Sem. 1' },
                    { val: 2, label: 'Sem. 2' },
                  ] as const
                ).map((item) => (
                  <button
                    key={String(item.val)}
                    type="button"
                    onClick={() => {
                      soundFX.playClick();
                      setSemester(item.val);
                    }}
                    className={`ifp-touch-target py-2 px-3 rounded-lg text-sm font-medium transition-all cursor-pointer ${
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
              3. Jumlah Kelompok Bermain &amp; Nama Tim
            </label>
            <div className="inline-flex gap-1.5 p-1 bg-slate-100 rounded-xl mb-4">
              {([2, 3, 4] as const).map((cnt) => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    setTeamCount(cnt);
                  }}
                  className={`ifp-touch-target px-4 py-2 rounded-lg text-sm font-medium cursor-pointer ${
                    teamCount === cnt
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cnt} Kelompok
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {TEAM_PRESETS.slice(0, teamCount).map((preset, idx) => (
                <div key={preset.id}>
                  <label className={`block text-xs font-semibold mb-1 ${preset.textClass}`}>
                    Kelompok {idx + 1}
                  </label>
                  <input
                    type="text"
                    maxLength={18}
                    value={teamNames[idx]}
                    onChange={(e) => {
                      const next = [...teamNames];
                      next[idx] = e.target.value;
                      setTeamNames(next);
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-medium"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <label className="inline-flex items-center gap-2.5 text-sm font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={autoSpeak}
                onChange={(e) => setAutoSpeak(e.target.checked)}
                className="w-4 h-4 accent-blue-700"
              />
              <span>Aktifkan Speaker Otomatis saat soal muncul (membantu murid belum lancar baca)</span>
            </label>

            <button
              type="button"
              onClick={startGame}
              className="ifp-touch-target inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-700 text-white text-sm sm:text-base font-semibold hover:bg-blue-800 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Play className="w-4 h-4 fill-current" aria-hidden="true" />
              <span>Mulai Papan Ular Tangga</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // FINISHED SCREEN
  if (phase === 'FINISHED' && winner) {
    const sorted = [...players].sort((a, b) => b.position - a.position || b.score - a.score);
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <Trophy className="w-12 h-12 text-amber-500 mx-auto mb-3" aria-hidden="true" />
          <p className="text-sm font-medium text-slate-500">
            Ular Tangga Edukasi Selesai · {activeSubject.name}
          </p>
          <h2 className="font-display text-3xl font-bold text-slate-900 mt-1">
            Selamat, {winner.name} Mencapai Garis Finish!
          </h2>

          <div className="mt-6 space-y-3 text-left">
            {sorted.map((p, rank) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-slate-500 w-6">#{rank + 1}</span>
                  <span
                    className={`w-4 h-4 rounded-full ${p.bgClass}`}
                    aria-hidden="true"
                  />
                  <span className="font-display font-bold text-slate-900">{p.name}</span>
                </div>
                <div className="font-mono text-sm font-semibold text-slate-700 tabular-nums">
                  Petak {p.position} · {p.score} Poin · {p.correctCount} Benar
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={startGame}
              className="ifp-touch-target inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              <span>Main Ulang</span>
            </button>
            <button
              type="button"
              onClick={() => setPhase('SETUP')}
              className="ifp-touch-target px-5 py-3 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 cursor-pointer"
            >
              Ubah Pengaturan
            </button>
          </div>
        </div>
      </div>
    );
  }

  const activePlayer = players[currentTurn];

  // PLAYING SCREEN (2-Zone Sandbox: Board Left + Dice & Scoreboard Right)
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="font-display text-lg sm:text-xl font-bold text-slate-900">
            Ular Tangga · {activeSubject.name}
            {semester !== 'ALL' ? ` (Semester ${semester})` : ''}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">{statusMessage}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              soundFX.playClick();
              setAutoSpeak((v) => !v);
            }}
            className={`ifp-touch-target px-3 py-2 rounded-lg border text-xs font-semibold cursor-pointer whitespace-nowrap ${
              autoSpeak
                ? 'bg-blue-50 border-blue-300 text-blue-800'
                : 'bg-white border-slate-200 text-slate-600'
            }`}
          >
            {autoSpeak ? 'Speaker Soal: Aktif' : 'Speaker Soal: Manual'}
          </button>

          <button
            type="button"
            onClick={onToggleMute}
            aria-label={isMuted ? 'Nyalakan efek suara' : 'Matikan efek suara'}
            className="ifp-touch-target w-10 h-10 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => {
              ttsEngine.stop();
              setPhase('SETUP');
            }}
            className="ifp-touch-target px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer whitespace-nowrap"
          >
            Atur Ulang
          </button>
        </div>
      </div>

      {/* Main 2-Zone Board + Control Deck */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT ZONE: 6x5 SNAKES & LADDERS BOARD */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-3 sm:p-4">
          <div className="relative w-full aspect-6/5 rounded-xl overflow-hidden border border-slate-300 bg-amber-50/40">
            {/* Grid Tiles */}
            <div className="grid grid-cols-6 grid-rows-5 w-full h-full">
              {BOARD_TILES.map((tileNum) => {
                const isLadderBase = Boolean(LADDERS[tileNum]);
                const isSnakeHead = Boolean(SNAKES[tileNum]);
                const isStart = tileNum === 1;
                const isFinish = tileNum === 30;
                const playersHere = players.filter((p) => p.position === tileNum);

                let tileBg =
                  tileNum % 2 === 0 ? 'bg-white/95' : 'bg-amber-50/80';
                if (isStart) tileBg = 'bg-blue-50';
                if (isFinish) tileBg = 'bg-amber-100';
                if (isLadderBase) tileBg = 'bg-emerald-50/90';
                if (isSnakeHead) tileBg = 'bg-red-50/90';

                return (
                  <div
                    key={tileNum}
                    className={`relative border border-slate-200/90 p-1 sm:p-1.5 flex flex-col justify-between ${tileBg}`}
                  >
                    <div className="flex items-center justify-between gap-1 z-10">
                      <span className="font-mono text-xs sm:text-sm font-bold text-slate-800 tabular-nums">
                        {tileNum}
                      </span>
                      {isLadderBase && (
                        <ArrowUpRight className="w-3.5 h-3.5 text-emerald-700 shrink-0" aria-hidden="true" />
                      )}
                      {isSnakeHead && (
                        <ArrowDownRight className="w-3.5 h-3.5 text-red-600 shrink-0" aria-hidden="true" />
                      )}
                    </div>

                    {(isStart || isFinish) && (
                      <span className="text-[10px] font-bold text-slate-700 uppercase tracking-tight z-10">
                        {isStart ? 'Mulai' : 'Finish'}
                      </span>
                    )}

                    {/* Player Pawns */}
                    {playersHere.length > 0 && (
                      <div className="flex flex-wrap items-center justify-center gap-1 z-20 mt-auto pb-0.5">
                        {playersHere.map((p) => (
                          <span
                            key={p.id}
                            title={p.name}
                            className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-[10px] font-bold text-white ${p.bgClass}`}
                          >
                            {p.id + 1}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* SVG Overlay for Ladders & Snakes */}
            <svg
              viewBox="0 0 600 500"
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
              aria-hidden="true"
            >
              {/* Ladders */}
              {Object.entries(LADDERS).map(([fromStr, toNum]) => {
                const start = getTileCenter(Number(fromStr));
                const end = getTileCenter(toNum);
                const dx = end.x - start.x;
                const dy = end.y - start.y;
                const len = Math.hypot(dx, dy) || 1;
                const nx = (-dy / len) * 9;
                const ny = (dx / len) * 9;
                const rungs = 6;

                return (
                  <g key={`ladder-${fromStr}`} opacity="0.82">
                    <line
                      x1={start.x + nx}
                      y1={start.y + ny}
                      x2={end.x + nx}
                      y2={end.y + ny}
                      stroke="#047857"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    <line
                      x1={start.x - nx}
                      y1={start.y - ny}
                      x2={end.x - nx}
                      y2={end.y - ny}
                      stroke="#047857"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    {Array.from({ length: rungs }, (_, idx) => {
                      const t = (idx + 1) / (rungs + 1);
                      const rx = start.x + dx * t;
                      const ry = start.y + dy * t;
                      return (
                        <line
                          key={idx}
                          x1={rx + nx}
                          y1={ry + ny}
                          x2={rx - nx}
                          y2={ry - ny}
                          stroke="#059669"
                          strokeWidth="3"
                        />
                      );
                    })}
                  </g>
                );
              })}

              {/* Snakes */}
              {Object.entries(SNAKES).map(([fromStr, toNum]) => {
                const head = getTileCenter(Number(fromStr));
                const tail = getTileCenter(toNum);
                const midX = (head.x + tail.x) / 2;
                const midY = (head.y + tail.y) / 2;
                const ctrl1X = midX + 35;
                const ctrl1Y = (head.y + midY) / 2;
                const ctrl2X = midX - 35;
                const ctrl2Y = (midY + tail.y) / 2;

                return (
                  <g key={`snake-${fromStr}`} opacity="0.8">
                    <path
                      d={`M ${head.x} ${head.y} Q ${ctrl1X} ${ctrl1Y}, ${midX} ${midY} T ${tail.x} ${tail.y}`}
                      fill="none"
                      stroke="#DC2626"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                    <path
                      d={`M ${head.x} ${head.y} Q ${ctrl1X} ${ctrl1Y}, ${midX} ${midY} T ${tail.x} ${tail.y}`}
                      fill="none"
                      stroke="#FCA5A5"
                      strokeWidth="2.5"
                      strokeDasharray="6 6"
                      strokeLinecap="round"
                    />
                    <circle cx={head.x} cy={head.y} r="9" fill="#B91C1C" />
                    <circle cx={head.x - 3} cy={head.y - 2} r="1.8" fill="#FFFFFF" />
                    <circle cx={head.x + 3} cy={head.y - 2} r="1.8" fill="#FFFFFF" />
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
            <span>Tangga Naik: Petak 4→14, 9→21, 17→28</span>
            <span>Ular Turun: Petak 16→6, 23→11, 29→19</span>
          </div>
        </div>

        {/* RIGHT ZONE: DICE CONTROLLER & SCOREBOARD */}
        <div className="lg:col-span-4 space-y-4">
          {/* Active Turn & Dice Roller */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center">
            <div className="text-xs font-semibold text-slate-500">Giliran Kelompok</div>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className={`w-3.5 h-3.5 rounded-full ${activePlayer.bgClass}`} />
              <span className="font-display text-xl font-bold text-slate-900">
                {activePlayer.name}
              </span>
            </div>

            {/* Visual Dice */}
            <div className="my-5 flex items-center justify-center">
              <div
                className={`w-20 h-20 rounded-2xl border-2 border-slate-300 bg-slate-50 flex items-center justify-center font-mono text-3xl font-bold text-slate-900 tabular-nums transition-transform ${
                  isRolling ? 'scale-110 rotate-6 border-blue-500' : ''
                }`}
                aria-live="polite"
              >
                {diceValue}
              </div>
            </div>

            <button
              type="button"
              disabled={isRolling || Boolean(activeChallenge)}
              onClick={handleRollDice}
              className="ifp-touch-target w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-blue-700 text-white text-base font-bold hover:bg-blue-800 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <Dices className="w-5 h-5" aria-hidden="true" />
              <span>{isRolling ? 'Mengocok Dadu...' : 'Lempar Dadu'}</span>
            </button>
          </div>

          {/* Scoreboard */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
            <h2 className="font-display text-sm font-bold text-slate-900">
              Posisi &amp; Skor Kelompok
            </h2>
            {players.map((p, idx) => {
              const isTurn = idx === currentTurn;
              return (
                <div
                  key={p.id}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                    isTurn ? 'bg-blue-50/70 border-blue-300' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`w-6 h-6 rounded-full text-xs font-bold text-white flex items-center justify-center shrink-0 ${p.bgClass}`}
                    >
                      {p.id + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-slate-900 truncate">{p.name}</div>
                      <div className="text-xs text-slate-500 tabular-nums">
                        Petak {p.position}/30
                      </div>
                    </div>
                  </div>
                  <div className="font-mono text-base font-bold text-slate-900 tabular-nums shrink-0">
                    {p.score}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* TILE CHALLENGE MODAL */}
      {activeChallenge && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/55 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl overflow-hidden shadow-xl">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-3 bg-slate-50">
              <div>
                <div className="text-xs font-semibold text-blue-700">
                  {activePlayer.name} · Petak {activeChallenge.tile}
                  {activeChallenge.specialType === 'ladder' &&
                    ` · Kesempatan Naik Tangga ke ${activeChallenge.targetTile}`}
                  {activeChallenge.specialType === 'snake' &&
                    ` · Awas Ular ke ${activeChallenge.targetTile}!`}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {activeChallenge.question.topic}
                </div>
              </div>

              <SpeakButton
                speakId={`ut-modal-${activeChallenge.question.id}`}
                text={`${activeChallenge.question.prompt}. Pilihan A: ${activeChallenge.question.options[0]}. Pilihan B: ${activeChallenge.question.options[1]}. Pilihan C: ${activeChallenge.question.options[2]}. Pilihan D: ${activeChallenge.question.options[3]}.`}
                label="Bacakan Soal"
                compact
              />
            </div>

            <div className="p-6 space-y-5 max-h-[78vh] overflow-y-auto">
              <h2 className="font-display text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                {activeChallenge.question.prompt}
              </h2>

              {activeChallenge.question.visual && (
                <QuestionVisual visual={activeChallenge.question.visual} compact />
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeChallenge.question.options.map((opt, idx) => {
                  const answered = activeChallenge.answeredIndex !== null;
                  const isCorrect = idx === activeChallenge.question.correctIndex;
                  const isChosen = idx === activeChallenge.answeredIndex;

                  let style =
                    'bg-slate-50 border-slate-200 text-slate-900 hover:bg-blue-50 hover:border-blue-400';
                  if (answered) {
                    if (isCorrect) {
                      style = 'bg-emerald-50 border-emerald-600 text-emerald-950 font-semibold';
                    } else if (isChosen) {
                      style = 'bg-red-50 border-red-500 text-red-950';
                    } else {
                      style = 'bg-slate-50 border-slate-200 text-slate-400 opacity-70';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={answered}
                      onClick={() => handleAnswerChallenge(idx)}
                      className={`ifp-touch-target min-h-[68px] p-4 rounded-xl border text-left flex items-center justify-between gap-3 transition-colors cursor-pointer ${style}`}
                    >
                      <span className="text-sm sm:text-base font-medium">
                        <strong className="font-mono mr-2">{OPTION_LABELS[idx]}.</strong>
                        {opt}
                      </span>
                      {answered && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                      )}
                      {answered && isChosen && !isCorrect && (
                        <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {activeChallenge.answeredIndex !== null && (
                <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-sm text-slate-700">
                    <strong className="text-slate-900">Pembahasan:</strong>{' '}
                    {activeChallenge.question.explanation}
                  </div>
                  <button
                    type="button"
                    onClick={handleCloseChallengeAndAdvance}
                    className="ifp-touch-target px-6 py-3 rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Lanjutkan Permainan
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
