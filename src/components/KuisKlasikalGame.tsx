import { useEffect, useState, useCallback } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Pause,
  Play,
  Volume2,
  VolumeX,
  RotateCcw,
  Users,
  Sparkles,
  Lightbulb,
} from 'lucide-react';
import { QuizQuestion, SessionConfig, SubjectInfo } from '../types';
import { QuestionVisual } from './QuestionVisual';
import { SpeakButton } from './SpeakButton';
import { soundFX } from '../utils/sound';
import { ttsEngine } from '../utils/tts';

interface KuisKlasikalGameProps {
  subject: SubjectInfo;
  config: SessionConfig;
  questions: QuizQuestion[];
  isMuted: boolean;
  onToggleMute: () => void;
  onExit: () => void;
  onSwitchToDuel: () => void;
}

const OPTION_LABELS = ['A', 'B', 'C', 'D'] as const;

export function KuisKlasikalGame({
  subject,
  config,
  questions,
  isMuted,
  onToggleMute,
  onExit,
  onSwitchToDuel,
}: KuisKlasikalGameProps) {
  const [deck, setDeck] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isTimeout, setIsTimeout] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number>(config.timerSeconds);
  const [isPaused, setIsPaused] = useState(false);
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
  const [fiftyFiftyUsed, setFiftyFiftyUsed] = useState(false);
  const [gamePhase, setGamePhase] = useState<'PLAYING' | 'FINISHED'>('PLAYING');

  const initRound = useCallback(() => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5).slice(0, config.questionCount);
    setDeck(shuffled);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsTimeout(false);
    setScore(0);
    setCorrectCount(0);
    setStreak(0);
    setBestStreak(0);
    setTimeLeft(config.timerSeconds);
    setIsPaused(false);
    setEliminatedOptions([]);
    setFiftyFiftyUsed(false);
    setGamePhase('PLAYING');
  }, [questions, config.questionCount, config.timerSeconds]);

  useEffect(() => {
    initRound();
  }, [initRound]);

  const currentQuestion = deck[currentIndex];
  const hasAnswered = selectedOption !== null || isTimeout;

  // Countdown timer
  useEffect(() => {
    if (
      gamePhase !== 'PLAYING' ||
      config.timerSeconds === 0 ||
      hasAnswered ||
      isPaused ||
      !currentQuestion
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          soundFX.playWrong();
          setIsTimeout(true);
          setStreak(0);
          return 0;
        }
        if (prev <= 6) {
          soundFX.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [gamePhase, config.timerSeconds, hasAnswered, isPaused, currentQuestion]);

  const handleSelectOption = (idx: number) => {
    if (hasAnswered || eliminatedOptions.includes(idx) || !currentQuestion) return;
    setSelectedOption(idx);

    if (idx === currentQuestion.correctIndex) {
      soundFX.playCorrect();
      const timeBonus = config.timerSeconds > 0 ? Math.round((timeLeft / config.timerSeconds) * 40) : 20;
      const newStreak = streak + 1;
      setScore((prev) => prev + 100 + timeBonus);
      setCorrectCount((prev) => prev + 1);
      setStreak(newStreak);
      setBestStreak((prev) => Math.max(prev, newStreak));
    } else {
      soundFX.playWrong();
      setStreak(0);
    }
  };

  const handleUseFiftyFifty = () => {
    if (fiftyFiftyUsed || hasAnswered || !currentQuestion) return;
    soundFX.playClick();
    const wrongIndices = [0, 1, 2, 3].filter((i) => i !== currentQuestion.correctIndex);
    const toEliminate = wrongIndices.sort(() => Math.random() - 0.5).slice(0, 2);
    setEliminatedOptions(toEliminate);
    setFiftyFiftyUsed(true);
  };

  const handleNext = () => {
    soundFX.playClick();
    if (currentIndex + 1 >= deck.length) {
      soundFX.playWin();
      setGamePhase('FINISHED');
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsTimeout(false);
      setTimeLeft(config.timerSeconds);
      setEliminatedOptions([]);
    }
  };

  if (deck.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="font-display text-xl font-bold text-slate-900">Belum ada soal pada topik ini</h2>
        <p className="text-slate-600 mt-2">Silakan pilih topik lain atau tambahkan soal di Bank Soal.</p>
        <button
          type="button"
          onClick={onExit}
          className="mt-6 px-5 py-2.5 rounded-lg bg-blue-700 text-white text-sm font-semibold cursor-pointer"
        >
          Kembali ke Pilihan Pelajaran
        </button>
      </div>
    );
  }

  if (gamePhase === 'FINISHED') {
    const accuracy = Math.round((correctCount / deck.length) * 100);
    const stars = accuracy >= 80 ? 3 : accuracy >= 50 ? 2 : 1;

    return (
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <p className="text-sm font-medium text-slate-500">
            Sesi Selesai · {subject.name}
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
            {accuracy >= 80
              ? 'Luar Biasa! Kelas Sangat Kompak!'
              : accuracy >= 50
                ? 'Kerja Bagus! Terus Berlatih!'
                : 'Semangat Belajar Bersama!'}
          </h2>

          <div className="flex items-center justify-center gap-2 my-6" aria-label={`Perolehan ${stars} dari 3 bintang`}>
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                  s <= stars
                    ? 'bg-amber-50 border-amber-300 text-amber-500'
                    : 'bg-slate-50 border-slate-200 text-slate-300'
                }`}
              >
                <Sparkles className="w-6 h-6" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 py-6 border-y border-slate-200 my-6">
            <div>
              <div className="text-xs font-medium text-slate-500">Total Skor</div>
              <div className="font-mono text-2xl sm:text-3xl font-bold text-blue-700 tabular-nums mt-1">
                {score}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">Jawaban Benar</div>
              <div className="font-mono text-2xl sm:text-3xl font-bold text-emerald-700 tabular-nums mt-1">
                {correctCount}/{deck.length}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">Beruntun Terbaik</div>
              <div className="font-mono text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums mt-1">
                {bestStreak}x
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                soundFX.playClick();
                initRound();
              }}
              className="ifp-touch-target inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              <span>Main Lagi</span>
            </button>
            <button
              type="button"
              onClick={() => {
                soundFX.playClick();
                onSwitchToDuel();
              }}
              className="ifp-touch-target inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm font-semibold hover:bg-slate-50 cursor-pointer whitespace-nowrap"
            >
              <Users className="w-4 h-4" aria-hidden="true" />
              <span>Coba Mode Duel 2 Tim</span>
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

  const timerPercentage =
    config.timerSeconds > 0 ? Math.max(0, (timeLeft / config.timerSeconds) * 100) : 100;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 sm:py-6">
      {/* Compact Game HUD */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              soundFX.playClick();
              onExit();
            }}
            className="ifp-touch-target inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer whitespace-nowrap"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Selesai</span>
          </button>
          <div>
            <div className="font-display text-base font-bold text-slate-900 leading-tight">
              {subject.name}
            </div>
            <div className="text-xs text-slate-500">
              {currentQuestion.topic} · Soal {currentIndex + 1} dari {deck.length}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <div className="text-right">
            <div className="text-[11px] font-medium text-slate-500">Skor Kelas</div>
            <div className="font-mono text-lg sm:text-xl font-bold text-blue-700 tabular-nums">
              {score}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] font-medium text-slate-500">Beruntun</div>
            <div className="font-mono text-lg sm:text-xl font-bold text-slate-900 tabular-nums">
              {streak}x
            </div>
          </div>

          <div className="flex items-center gap-2">
            {config.timerSeconds > 0 && !hasAnswered && (
              <button
                type="button"
                onClick={() => {
                  soundFX.playClick();
                  setIsPaused((p) => !p);
                }}
                aria-label={isPaused ? 'Lanjutkan waktu' : 'Jeda waktu untuk diskusi'}
                className="ifp-touch-target inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer whitespace-nowrap"
              >
                {isPaused ? <Play className="w-4 h-4 text-blue-700" /> : <Pause className="w-4 h-4" />}
                <span>{isPaused ? 'Lanjut' : 'Jeda'}</span>
              </button>
            )}
            <button
              type="button"
              onClick={onToggleMute}
              aria-label={isMuted ? 'Nyalakan suara' : 'Matikan suara'}
              className="ifp-touch-target w-10 h-10 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Progress & Timer bar */}
      <div className="mt-4 flex items-center gap-4">
        <div className="flex-1 h-2.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              config.timerSeconds > 0 && timeLeft <= 5 ? 'bg-red-600' : 'bg-blue-700'
            }`}
            style={{
              width: `${
                config.timerSeconds > 0
                  ? timerPercentage
                  : ((currentIndex + (hasAnswered ? 1 : 0)) / deck.length) * 100
              }%`,
            }}
          />
        </div>
        {config.timerSeconds > 0 ? (
          <div
            className={`font-mono text-sm font-bold tabular-nums min-w-[4.5rem] text-right ${
              timeLeft <= 5 ? 'text-red-700' : 'text-slate-700'
            }`}
          >
            {isPaused ? 'Dijeda' : `${timeLeft} dtk`}
          </div>
        ) : (
          <div className="font-mono text-xs font-medium text-slate-500 tabular-nums">
            Tanpa Timer
          </div>
        )}
      </div>

      {/* Main Question Stage */}
      <div className="mt-5 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row items-stretch gap-6">
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <span className="text-xs font-semibold text-blue-700">
                Pertanyaan {currentIndex + 1} · {currentQuestion.topic}
              </span>
              <div className="flex items-center gap-2">
                <SpeakButton
                  speakId={`kuis-${currentQuestion.id}`}
                  text={`${currentQuestion.prompt}. Pilihan A: ${currentQuestion.options[0]}. Pilihan B: ${currentQuestion.options[1]}. Pilihan C: ${currentQuestion.options[2]}. Pilihan D: ${currentQuestion.options[3]}.`}
                  label="Bacakan Soal"
                  compact
                />
                {!fiftyFiftyUsed && !hasAnswered && (
                  <button
                    type="button"
                    onClick={handleUseFiftyFifty}
                    className="ifp-touch-target inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer whitespace-nowrap"
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
                    <span>Bantuan 50:50</span>
                  </button>
                )}
              </div>
            </div>

            <h2
              className="font-display font-bold text-slate-900 leading-snug"
              style={{ fontSize: 'clamp(1.3rem, 2.2vw, 1.85rem)', textWrap: 'balance' }}
            >
              {currentQuestion.prompt}
            </h2>
          </div>

          {currentQuestion.visual && (
            <div className="lg:w-72 shrink-0 flex items-center justify-center">
              <QuestionVisual visual={currentQuestion.visual} />
            </div>
          )}
        </div>

        {/* Giant IFP Touch Answer Tiles */}
        <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {currentQuestion.options.map((opt, idx) => {
            const isEliminated = eliminatedOptions.includes(idx);
            const isCorrectOption = idx === currentQuestion.correctIndex;
            const isSelected = selectedOption === idx;

            let cardStyle =
              'bg-slate-50 border-slate-200 text-slate-900 hover:bg-blue-50/70 hover:border-blue-400';
            let badgeStyle = 'bg-white border-slate-300 text-slate-700';

            if (isEliminated) {
              cardStyle = 'bg-slate-50 border-slate-100 text-slate-300 opacity-45 cursor-not-allowed';
              badgeStyle = 'bg-slate-100 border-slate-200 text-slate-300';
            } else if (hasAnswered) {
              if (isCorrectOption) {
                cardStyle = 'bg-emerald-50 border-emerald-600 text-emerald-950 ring-1 ring-emerald-600';
                badgeStyle = 'bg-emerald-700 border-emerald-700 text-white';
              } else if (isSelected) {
                cardStyle = 'bg-red-50 border-red-500 text-red-950';
                badgeStyle = 'bg-red-600 border-red-600 text-white';
              } else {
                cardStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-70';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={hasAnswered || isEliminated}
                onClick={() => handleSelectOption(idx)}
                className={`ifp-touch-target min-h-[80px] p-4 sm:p-5 rounded-xl border text-left flex items-center gap-4 transition-all duration-150 active:scale-[0.99] cursor-pointer ${cardStyle}`}
              >
                <span
                  className={`w-10 h-10 rounded-lg border font-mono text-base font-bold flex items-center justify-center shrink-0 ${badgeStyle}`}
                >
                  {OPTION_LABELS[idx]}
                </span>
                <span className="text-base sm:text-lg font-semibold leading-snug flex-1">{opt}</span>
                {hasAnswered && isCorrectOption && (
                  <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0" aria-label="Benar" />
                )}
                {hasAnswered && isSelected && !isCorrectOption && (
                  <XCircle className="w-6 h-6 text-red-600 shrink-0" aria-label="Salah" />
                )}
              </button>
            );
          })}
        </div>

        {/* Immediate Teacher Explanation Panel */}
        {hasAnswered && (
          <div className="mt-6 pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              {selectedOption === currentQuestion.correctIndex ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
              )}
              <div>
                <div className="font-display text-base font-bold text-slate-900">
                  {selectedOption === currentQuestion.correctIndex
                    ? 'Jawaban Benar!'
                    : isTimeout
                      ? `Waktu Habis — Jawaban yang benar adalah ${OPTION_LABELS[currentQuestion.correctIndex]}`
                      : `Kurang Tepat — Jawaban yang benar adalah ${OPTION_LABELS[currentQuestion.correctIndex]}`}
                </div>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  {currentQuestion.explanation}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="ifp-touch-target px-6 py-3.5 rounded-xl bg-blue-700 text-white text-sm sm:text-base font-semibold hover:bg-blue-800 active:scale-[0.98] transition-all shrink-0 cursor-pointer whitespace-nowrap"
            >
              {currentIndex + 1 >= deck.length ? 'Lihat Hasil Akhir' : 'Soal Berikutnya'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
