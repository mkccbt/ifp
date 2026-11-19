import { useCallback, useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Volume2,
  VolumeX,
  RotateCcw,
} from 'lucide-react';
import { SortChallenge, SortItem, SubjectInfo } from '../types';
import { soundFX } from '../utils/sound';

interface SortirCepatGameProps {
  subject: SubjectInfo;
  challenge: SortChallenge;
  isMuted: boolean;
  onToggleMute: () => void;
  onExit: () => void;
}

interface SortFeedback {
  item: SortItem;
  isCorrect: boolean;
  chosen: 'left' | 'right';
}

export function SortirCepatGame({
  subject,
  challenge,
  isMuted,
  onToggleMute,
  onExit,
}: SortirCepatGameProps) {
  const [items, setItems] = useState<SortItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState<SortFeedback | null>(null);
  const [mistakes, setMistakes] = useState<SortItem[]>([]);
  const [phase, setPhase] = useState<'PLAYING' | 'FINISHED'>('PLAYING');

  const initGame = useCallback(() => {
    const shuffled = [...challenge.items].sort(() => Math.random() - 0.5);
    setItems(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setCorrectCount(0);
    setFeedback(null);
    setMistakes([]);
    setPhase('PLAYING');
  }, [challenge]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const currentItem = items[currentIndex];

  const handleSort = useCallback(
    (side: 'left' | 'right') => {
      if (!currentItem || feedback || phase !== 'PLAYING') return;
      const isCorrect = currentItem.category === side;
      if (isCorrect) {
        soundFX.playCorrect();
        setScore((s) => s + 100);
        setCorrectCount((c) => c + 1);
      } else {
        soundFX.playWrong();
        setMistakes((prev) => [...prev, currentItem]);
      }
      setFeedback({ item: currentItem, isCorrect, chosen: side });
    },
    [currentItem, feedback, phase]
  );

  const handleContinue = useCallback(() => {
    soundFX.playClick();
    setFeedback(null);
    if (currentIndex + 1 >= items.length) {
      soundFX.playWin();
      setPhase('FINISHED');
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }, [currentIndex, items.length]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (phase !== 'PLAYING') return;
      if (feedback) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleContinue();
        }
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleSort('left');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleSort('right');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [phase, feedback, handleSort, handleContinue]);

  if (items.length === 0) return null;

  if (phase === 'FINISHED') {
    const accuracy = Math.round((correctCount / items.length) * 100);
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-10">
        <div className="bg-white border border-slate-200 rounded-2xl p-8">
          <div className="text-center">
            <p className="text-sm font-medium text-slate-500">
              Sortir Cepat Selesai · {subject.name}
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              {challenge.title}
            </h2>

            <div className="grid grid-cols-3 gap-4 py-6 border-y border-slate-200 my-6">
              <div>
                <div className="text-xs font-medium text-slate-500">Skor Akhir</div>
                <div className="font-mono text-2xl sm:text-3xl font-bold text-blue-700 tabular-nums mt-1">
                  {score}
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-slate-500">Tepat</div>
                <div className="font-mono text-2xl sm:text-3xl font-bold text-emerald-700 tabular-nums mt-1">
                  {correctCount}/{items.length}
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-slate-500">Akurasi</div>
                <div className="font-mono text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums mt-1">
                  {accuracy}%
                </div>
              </div>
            </div>
          </div>

          {mistakes.length > 0 && (
            <div className="mb-6 bg-slate-50 border border-slate-200 rounded-xl p-5">
              <h3 className="font-display text-sm font-bold text-slate-900 mb-3">
                Catatan Evaluasi Guru ({mistakes.length} kartu perlu dibahas)
              </h3>
              <ul className="space-y-2.5 text-sm">
                {mistakes.map((m) => (
                  <li key={m.id} className="text-slate-700 leading-relaxed">
                    <span className="font-semibold text-slate-900">{m.label}</span> →{' '}
                    <span className="font-semibold text-blue-700">
                      {m.category === 'left'
                        ? challenge.leftCategory.title
                        : challenge.rightCategory.title}
                    </span>
                    . {m.reason}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                soundFX.playClick();
                initGame();
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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
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
            <span>Kembali</span>
          </button>
          <div>
            <div className="font-display text-base font-bold text-slate-900">
              {challenge.title}
            </div>
            <div className="text-xs text-slate-500">
              {subject.name} · Kartu {currentIndex + 1} dari {items.length}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="text-right">
            <div className="text-[11px] font-medium text-slate-500">Skor</div>
            <div className="font-mono text-xl font-bold text-blue-700 tabular-nums">{score}</div>
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
      </div>

      {/* Instruction */}
      <p className="text-center text-sm sm:text-base text-slate-600 mt-5">
        {challenge.instruction}
      </p>

      {/* Active Center Card */}
      <div className="mt-5 bg-white border border-slate-200 rounded-2xl p-8 text-center">
        <div className="text-xs font-medium text-slate-400 mb-2">
          Kartu Aktif #{currentIndex + 1}
        </div>
        <div
          className="font-display font-bold text-slate-900 leading-snug"
          style={{ fontSize: 'clamp(1.5rem, 2.8vw, 2.25rem)', textWrap: 'balance' }}
        >
          {currentItem.label}
        </div>
      </div>

      {/* Feedback Banner OR Two Giant Touch Sorting Baskets */}
      {feedback ? (
        <div
          className={`mt-6 rounded-2xl border p-6 flex flex-col sm:flex-row items-center justify-between gap-4 ${
            feedback.isCorrect
              ? 'bg-emerald-50 border-emerald-300'
              : 'bg-red-50 border-red-300'
          }`}
        >
          <div className="flex items-start gap-3">
            {feedback.isCorrect ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
            ) : (
              <XCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
            )}
            <div>
              <div className="font-display text-lg font-bold text-slate-900">
                {feedback.isCorrect ? 'Tepat Sekali!' : 'Belum Tepat'}
              </div>
              <p className="text-sm text-slate-700 mt-1">{feedback.item.reason}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleContinue}
            className="ifp-touch-target px-6 py-3.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 cursor-pointer whitespace-nowrap shrink-0"
          >
            {currentIndex + 1 >= items.length ? 'Lihat Ringkasan' : 'Kartu Berikutnya'}
          </button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <button
            type="button"
            onClick={() => handleSort('left')}
            className="ifp-touch-target min-h-[168px] p-6 rounded-2xl bg-amber-50/70 border-2 border-amber-300 hover:border-amber-500 hover:bg-amber-50 active:scale-[0.98] transition-all flex flex-col items-center justify-center text-center cursor-pointer"
          >
            <ArrowLeft className="w-7 h-7 text-amber-700 mb-2" aria-hidden="true" />
            <div className="font-display text-xl sm:text-2xl font-bold text-slate-900">
              {challenge.leftCategory.title}
            </div>
            <div className="text-sm text-slate-600 mt-1">{challenge.leftCategory.subtitle}</div>
          </button>

          <button
            type="button"
            onClick={() => handleSort('right')}
            className="ifp-touch-target min-h-[168px] p-6 rounded-2xl bg-blue-50/70 border-2 border-blue-300 hover:border-blue-600 hover:bg-blue-50 active:scale-[0.98] transition-all flex flex-col items-center justify-center text-center cursor-pointer"
          >
            <ArrowRight className="w-7 h-7 text-blue-700 mb-2" aria-hidden="true" />
            <div className="font-display text-xl sm:text-2xl font-bold text-slate-900">
              {challenge.rightCategory.title}
            </div>
            <div className="text-sm text-slate-600 mt-1">{challenge.rightCategory.subtitle}</div>
          </button>
        </div>
      )}
    </div>
  );
}
