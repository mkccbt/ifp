import { useEffect, useState, useCallback } from 'react';
import {
  ArrowLeft,
  Trophy,
  Volume2,
  VolumeX,
  RotateCcw,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { QuizQuestion, SessionConfig, SubjectInfo } from '../types';
import { QuestionVisual } from './QuestionVisual';
import { soundFX } from '../utils/sound';

interface DuelPapanGameProps {
  subject: SubjectInfo;
  config: SessionConfig;
  questions: QuizQuestion[];
  isMuted: boolean;
  onToggleMute: () => void;
  onExit: () => void;
}

const OPTION_LABELS = ['A', 'B', 'C', 'D'] as const;

export function DuelPapanGame({
  subject,
  config,
  questions,
  isMuted,
  onToggleMute,
  onExit,
}: DuelPapanGameProps) {
  const [deck, setDeck] = useState<QuizQuestion[]>([]);
  const [roundIndex, setRoundIndex] = useState(0);
  const [redScore, setRedScore] = useState(0);
  const [blueScore, setBlueScore] = useState(0);
  const [roundWinner, setRoundWinner] = useState<'red' | 'blue' | 'none' | null>(null);
  const [redCooldown, setRedCooldown] = useState(false);
  const [blueCooldown, setBlueCooldown] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(config.timerSeconds);
  const [gamePhase, setGamePhase] = useState<'PLAYING' | 'FINISHED'>('PLAYING');

  const initDuel = useCallback(() => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5).slice(0, config.questionCount);
    setDeck(shuffled);
    setRoundIndex(0);
    setRedScore(0);
    setBlueScore(0);
    setRoundWinner(null);
    setRedCooldown(false);
    setBlueCooldown(false);
    setTimeLeft(config.timerSeconds);
    setGamePhase('PLAYING');
  }, [questions, config.questionCount, config.timerSeconds]);

  useEffect(() => {
    initDuel();
  }, [initDuel]);

  const currentQuestion = deck[roundIndex];

  useEffect(() => {
    if (
      gamePhase !== 'PLAYING' ||
      config.timerSeconds === 0 ||
      roundWinner !== null ||
      !currentQuestion
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          soundFX.playWrong();
          setRoundWinner('none');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [gamePhase, config.timerSeconds, roundWinner, currentQuestion]);

  const handleTeamTap = (team: 'red' | 'blue', optionIdx: number) => {
    if (roundWinner !== null || !currentQuestion) return;
    if (team === 'red' && redCooldown) return;
    if (team === 'blue' && blueCooldown) return;

    if (optionIdx === currentQuestion.correctIndex) {
      soundFX.playCorrect();
      setRoundWinner(team);
      if (team === 'red') {
        setRedScore((s) => s + 100);
      } else {
        setBlueScore((s) => s + 100);
      }
    } else {
      soundFX.playWrong();
      if (team === 'red') {
        setRedCooldown(true);
        window.setTimeout(() => setRedCooldown(false), 1500);
      } else {
        setBlueCooldown(true);
        window.setTimeout(() => setBlueCooldown(false), 1500);
      }
    }
  };

  const handleNextRound = () => {
    soundFX.playClick();
    if (roundIndex + 1 >= deck.length) {
      soundFX.playWin();
      setGamePhase('FINISHED');
    } else {
      setRoundIndex((i) => i + 1);
      setRoundWinner(null);
      setRedCooldown(false);
      setBlueCooldown(false);
      setTimeLeft(config.timerSeconds);
    }
  };

  if (deck.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="font-display text-xl font-bold text-slate-900">Soal belum tersedia untuk topik ini</h2>
        <button
          type="button"
          onClick={onExit}
          className="mt-6 px-5 py-2.5 rounded-lg bg-blue-700 text-white text-sm font-semibold cursor-pointer"
        >
          Kembali
        </button>
      </div>
    );
  }

  if (gamePhase === 'FINISHED') {
    const winnerText =
      redScore > blueScore
        ? `${config.teamRedName} Menang!`
        : blueScore > redScore
          ? `${config.teamBlueName} Menang!`
          : 'Pertandingan Seri!';

    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <Trophy className="w-12 h-12 text-amber-500 mx-auto mb-3" aria-hidden="true" />
          <p className="text-sm font-medium text-slate-500">
            Hasil Duel Papan Sentuh · {subject.name}
          </p>
          <h2 className="font-display text-3xl font-bold text-slate-900 mt-1">{winnerText}</h2>

          <div className="grid grid-cols-2 gap-6 my-8">
            <div className="p-6 rounded-xl bg-red-50 border border-red-200">
              <div className="text-sm font-semibold text-red-800">{config.teamRedName}</div>
              <div className="font-mono text-4xl font-bold text-red-700 tabular-nums mt-2">
                {redScore}
              </div>
            </div>
            <div className="p-6 rounded-xl bg-blue-50 border border-blue-200">
              <div className="text-sm font-semibold text-blue-800">{config.teamBlueName}</div>
              <div className="font-mono text-4xl font-bold text-blue-700 tabular-nums mt-2">
                {blueScore}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                soundFX.playClick();
                initDuel();
              }}
              className="ifp-touch-target inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              <span>Duel Ulang</span>
            </button>
            <button
              type="button"
              onClick={() => {
                soundFX.playClick();
                onExit();
              }}
              className="ifp-touch-target inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 cursor-pointer whitespace-nowrap"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>Pilih Pelajaran Lain</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalDuelScore = redScore + blueScore;
  const redRatio = totalDuelScore === 0 ? 50 : Math.round((redScore / totalDuelScore) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
      {/* Top Duel Scoreboard */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <button
          type="button"
          onClick={() => {
            soundFX.playClick();
            onExit();
          }}
          className="ifp-touch-target inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer whitespace-nowrap"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Keluar Duel</span>
        </button>

        {/* Tug-of-war score bar */}
        <div className="flex-1 max-w-xl flex items-center gap-3">
          <div className="text-right min-w-[5.5rem]">
            <div className="text-xs font-semibold text-red-700 truncate">{config.teamRedName}</div>
            <div className="font-mono text-xl font-bold text-red-700 tabular-nums">{redScore}</div>
          </div>

          <div className="flex-1">
            <div className="h-3.5 bg-blue-600 rounded-full overflow-hidden flex border border-slate-200">
              <div
                className="h-full bg-red-600 transition-all duration-300"
                style={{ width: `${redRatio}%` }}
              />
            </div>
            <div className="text-center text-[11px] font-medium text-slate-500 mt-1 tabular-nums">
              Ronde {roundIndex + 1} / {deck.length}
              {config.timerSeconds > 0 && roundWinner === null ? ` · ${timeLeft} dtk` : ''}
            </div>
          </div>

          <div className="text-left min-w-[5.5rem]">
            <div className="text-xs font-semibold text-blue-700 truncate">{config.teamBlueName}</div>
            <div className="font-mono text-xl font-bold text-blue-700 tabular-nums">{blueScore}</div>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleMute}
          aria-label={isMuted ? 'Nyalakan suara' : 'Matikan suara'}
          className="ifp-touch-target w-10 h-10 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-700 hover:bg-slate-50 cursor-pointer"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Shared Question Prompt Banner */}
      <div className="mt-4 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1 text-center md:text-left">
            <div className="text-xs font-semibold text-slate-500 mb-1">
              {subject.name} · {currentQuestion.topic}
            </div>
            <h2
              className="font-display font-bold text-slate-900 leading-snug"
              style={{ fontSize: 'clamp(1.15rem, 2vw, 1.6rem)', textWrap: 'balance' }}
            >
              {currentQuestion.prompt}
            </h2>
          </div>
          {currentQuestion.visual && (
            <div className="shrink-0">
              <QuestionVisual visual={currentQuestion.visual} compact />
            </div>
          )}
        </div>

        {roundWinner !== null && (
          <div className="mt-4 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" aria-hidden="true" />
              <div className="text-sm text-slate-700">
                <span className="font-bold text-slate-900">
                  {roundWinner === 'red'
                    ? `${config.teamRedName} lebih cepat (+100)!`
                    : roundWinner === 'blue'
                      ? `${config.teamBlueName} lebih cepat (+100)!`
                      : 'Waktu habis!'}
                </span>{' '}
                Jawaban benar: <strong>{currentQuestion.options[currentQuestion.correctIndex]}</strong>.{' '}
                {currentQuestion.explanation}
              </div>
            </div>
            <button
              type="button"
              onClick={handleNextRound}
              className="ifp-touch-target px-6 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 cursor-pointer whitespace-nowrap shrink-0"
            >
              {roundIndex + 1 >= deck.length ? 'Lihat Pemenang' : 'Ronde Berikutnya'}
            </button>
          </div>
        )}
      </div>

      {/* Split-Screen Touch Zones for 2 Students at the IFP */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* LEFT: RED TEAM */}
        <div className="relative bg-red-50/50 border border-red-200 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-base font-bold text-red-900">{config.teamRedName}</h3>
            {redCooldown && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700">
                <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                Tunggu 1,5 dtk...
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 gap-3">
            {currentQuestion.options.map((opt, idx) => {
              const isCorrect = idx === currentQuestion.correctIndex;
              const locked = roundWinner !== null || redCooldown;
              return (
                <button
                  key={idx}
                  type="button"
                  disabled={locked}
                  onClick={() => handleTeamTap('red', idx)}
                  className={`ifp-touch-target min-h-[68px] px-4 py-3 rounded-xl border text-left flex items-center gap-3 transition-all active:scale-[0.98] cursor-pointer ${
                    roundWinner !== null && isCorrect
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold'
                      : redCooldown
                        ? 'bg-white/60 border-red-100 text-slate-400 cursor-not-allowed'
                        : 'bg-white border-red-200 text-slate-900 hover:border-red-500 hover:bg-red-50'
                  }`}
                >
                  <span className="w-9 h-9 rounded-lg bg-red-600 text-white font-mono text-sm font-bold flex items-center justify-center shrink-0">
                    {OPTION_LABELS[idx]}
                  </span>
                  <span className="text-sm sm:text-base font-semibold leading-snug">{opt}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT: BLUE TEAM */}
        <div className="relative bg-blue-50/50 border border-blue-200 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-base font-bold text-blue-900">{config.teamBlueName}</h3>
            {blueCooldown && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700">
                <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                Tunggu 1,5 dtk...
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 gap-3">
            {currentQuestion.options.map((opt, idx) => {
              const isCorrect = idx === currentQuestion.correctIndex;
              const locked = roundWinner !== null || blueCooldown;
              return (
                <button
                  key={idx}
                  type="button"
                  disabled={locked}
                  onClick={() => handleTeamTap('blue', idx)}
                  className={`ifp-touch-target min-h-[68px] px-4 py-3 rounded-xl border text-left flex items-center gap-3 transition-all active:scale-[0.98] cursor-pointer ${
                    roundWinner !== null && isCorrect
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold'
                      : blueCooldown
                        ? 'bg-white/60 border-blue-100 text-slate-400 cursor-not-allowed'
                        : 'bg-white border-blue-200 text-slate-900 hover:border-blue-500 hover:bg-blue-50'
                  }`}
                >
                  <span className="w-9 h-9 rounded-lg bg-blue-700 text-white font-mono text-sm font-bold flex items-center justify-center shrink-0">
                    {OPTION_LABELS[idx]}
                  </span>
                  <span className="text-sm sm:text-base font-semibold leading-snug">{opt}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
