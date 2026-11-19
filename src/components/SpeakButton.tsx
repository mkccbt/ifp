import { useEffect, useState } from 'react';
import { Volume2, Square } from 'lucide-react';
import { ttsEngine } from '../utils/tts';

interface SpeakButtonProps {
  speakId: string;
  text: string;
  label?: string;
  compact?: boolean;
  className?: string;
}

export function SpeakButton({
  speakId,
  text,
  label = 'Dengarkan',
  compact = false,
  className = '',
}: SpeakButtonProps) {
  const [activeId, setActiveId] = useState<string | null>(() => ttsEngine.getActiveId());

  useEffect(() => {
    return ttsEngine.subscribe(setActiveId);
  }, []);

  if (!ttsEngine.isSupported()) {
    return null;
  }

  const isPlaying = activeId === speakId;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        ttsEngine.speak(speakId, text);
      }}
      aria-label={isPlaying ? 'Hentikan suara pembaca' : `${label} dengan suara`}
      title={isPlaying ? 'Hentikan pembacaan' : 'Bacakan teks dengan suara'}
      className={`ifp-touch-target inline-flex items-center justify-center gap-1.5 rounded-lg border font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
        compact ? 'px-2.5 py-1.5 text-xs' : 'px-3.5 py-2 text-xs sm:text-sm'
      } ${
        isPlaying
          ? 'bg-amber-50 border-amber-400 text-amber-900'
          : 'bg-white border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-800'
      } ${className}`}
    >
      {isPlaying ? (
        <>
          <Square className="w-3.5 h-3.5 fill-current text-amber-700" aria-hidden="true" />
          <span>Berhenti</span>
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4 text-blue-700" aria-hidden="true" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
