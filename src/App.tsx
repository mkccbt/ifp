/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useMemo, useState } from 'react';
import { DEFAULT_QUESTIONS, SORT_CHALLENGES, SUBJECTS } from './data/curriculum';
import { GameMode, QuizQuestion, SessionConfig, SubjectId, SubjectInfo, TimerOption } from './types';
import { TopBar, AppRoute } from './components/TopBar';
import { HomeView } from './components/HomeView';
import { SubjectSetupModal } from './components/SubjectSetupModal';
import { KuisKlasikalGame } from './components/KuisKlasikalGame';
import { DuelPapanGame } from './components/DuelPapanGame';
import { SortirCepatGame } from './components/SortirCepatGame';
import { BankSoalView } from './components/BankSoalView';
import { soundFX } from './utils/sound';

const CUSTOM_QUESTIONS_STORAGE_KEY = 'papanpintar_v_custom_questions_v1';

export default function App() {
  const [route, setRoute] = useState<AppRoute>('home');
  const [defaultTimer, setDefaultTimer] = useState<TimerOption>(30);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [customQuestions, setCustomQuestions] = useState<QuizQuestion[]>(() => {
    try {
      const saved = window.localStorage.getItem(CUSTOM_QUESTIONS_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as QuizQuestion[]) : [];
    } catch {
      return [];
    }
  });

  const [setupModalState, setSetupModalState] = useState<{
    subject: SubjectInfo;
    initialMode: GameMode;
  } | null>(null);

  const [activeSession, setActiveSession] = useState<SessionConfig | null>(null);

  const allQuestions = useMemo(
    () => [...DEFAULT_QUESTIONS, ...customQuestions],
    [customQuestions]
  );

  const questionCounts = useMemo(() => {
    const counts: Record<SubjectId, number> = {
      matematika: 0,
      ipas: 0,
      bahasa_indonesia: 0,
      pancasila: 0,
      bahasa_inggris: 0,
      seni_budaya: 0,
    };
    allQuestions.forEach((q) => {
      counts[q.subjectId] = (counts[q.subjectId] || 0) + 1;
    });
    return counts;
  }, [allQuestions]);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundFX.setMuted(nextMuted);
    if (!nextMuted) {
      soundFX.playClick();
    }
  };

  const handleAddCustomQuestion = (q: QuizQuestion) => {
    const next = [q, ...customQuestions];
    setCustomQuestions(next);
    try {
      window.localStorage.setItem(CUSTOM_QUESTIONS_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore storage quota errors
    }
  };

  const handleDeleteCustomQuestion = (id: string) => {
    const next = customQuestions.filter((q) => q.id !== id);
    setCustomQuestions(next);
    try {
      window.localStorage.setItem(CUSTOM_QUESTIONS_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore storage quota errors
    }
  };

  const startSession = (config: SessionConfig) => {
    setSetupModalState(null);
    setActiveSession(config);
    setRoute('playing');
  };

  const handleQuickPlay = (subjectId: SubjectId, mode: GameMode) => {
    startSession({
      subjectId,
      topic: 'ALL',
      mode,
      timerSeconds: defaultTimer,
      teamRedName: 'Tim Merah',
      teamBlueName: 'Tim Biru',
      questionCount: 10,
    });
  };

  const handleRandomPlay = () => {
    const randomSubject = SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)];
    handleQuickPlay(randomSubject.id, 'kuis');
  };

  const activeSubject = activeSession
    ? SUBJECTS.find((s) => s.id === activeSession.subjectId) || SUBJECTS[0]
    : null;

  const sessionQuestions = useMemo(() => {
    if (!activeSession) return [];
    return allQuestions.filter((q) => {
      if (q.subjectId !== activeSession.subjectId) return false;
      if (activeSession.topic !== 'ALL' && q.topic !== activeSession.topic) return false;
      return true;
    });
  }, [activeSession, allQuestions]);

  const sessionSortChallenge = useMemo(() => {
    if (!activeSession) return null;
    return (
      SORT_CHALLENGES.find((c) => c.subjectId === activeSession.subjectId) || SORT_CHALLENGES[0]
    );
  }, [activeSession]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <TopBar
        currentRoute={route}
        onNavigate={(nextRoute) => {
          setActiveSession(null);
          setRoute(nextRoute);
        }}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
      />

      <main className="flex-1">
        {route === 'home' && (
          <HomeView
            subjects={SUBJECTS}
            questionCounts={questionCounts}
            defaultTimer={defaultTimer}
            onChangeDefaultTimer={setDefaultTimer}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            onQuickPlay={handleQuickPlay}
            onOpenSetup={(subject, mode) =>
              setSetupModalState({ subject, initialMode: mode || 'kuis' })
            }
            onRandomPlay={handleRandomPlay}
          />
        )}

        {route === 'duel_picker' && (
          <HomeView
            subjects={SUBJECTS}
            questionCounts={questionCounts}
            defaultTimer={defaultTimer}
            onChangeDefaultTimer={setDefaultTimer}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            presetMode="duel"
            onQuickPlay={handleQuickPlay}
            onOpenSetup={(subject) => setSetupModalState({ subject, initialMode: 'duel' })}
            onRandomPlay={handleRandomPlay}
          />
        )}

        {route === 'sortir_picker' && (
          <HomeView
            subjects={SUBJECTS}
            questionCounts={questionCounts}
            defaultTimer={defaultTimer}
            onChangeDefaultTimer={setDefaultTimer}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            presetMode="sortir"
            onQuickPlay={handleQuickPlay}
            onOpenSetup={(subject) => setSetupModalState({ subject, initialMode: 'sortir' })}
            onRandomPlay={handleRandomPlay}
          />
        )}

        {route === 'bank_soal' && (
          <BankSoalView
            subjects={SUBJECTS}
            questions={allQuestions}
            onAddQuestion={handleAddCustomQuestion}
            onDeleteCustomQuestion={handleDeleteCustomQuestion}
          />
        )}

        {route === 'playing' && activeSession && activeSubject && (
          <>
            {activeSession.mode === 'kuis' && (
              <KuisKlasikalGame
                subject={activeSubject}
                config={activeSession}
                questions={sessionQuestions}
                isMuted={isMuted}
                onToggleMute={handleToggleMute}
                onExit={() => {
                  setActiveSession(null);
                  setRoute('home');
                }}
                onSwitchToDuel={() => {
                  setActiveSession({
                    ...activeSession,
                    mode: 'duel',
                  });
                }}
              />
            )}

            {activeSession.mode === 'duel' && (
              <DuelPapanGame
                subject={activeSubject}
                config={activeSession}
                questions={sessionQuestions}
                isMuted={isMuted}
                onToggleMute={handleToggleMute}
                onExit={() => {
                  setActiveSession(null);
                  setRoute('home');
                }}
              />
            )}

            {activeSession.mode === 'sortir' && sessionSortChallenge && (
              <SortirCepatGame
                subject={activeSubject}
                challenge={sessionSortChallenge}
                isMuted={isMuted}
                onToggleMute={handleToggleMute}
                onExit={() => {
                  setActiveSession(null);
                  setRoute('home');
                }}
              />
            )}
          </>
        )}
      </main>

      {route !== 'playing' && (
        <footer className="border-t border-slate-200 bg-white mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
            <span>PapanPintar Kelas V · Media Belajar Interaktif Papan Sentuh (IFP)</span>
            <span>6 Mata Pelajaran SD · Kurikulum Merdeka</span>
          </div>
        </footer>
      )}

      {setupModalState && (
        <SubjectSetupModal
          subject={setupModalState.subject}
          initialMode={setupModalState.initialMode}
          defaultTimer={defaultTimer}
          questionCountAvailable={questionCounts[setupModalState.subject.id]}
          onClose={() => setSetupModalState(null)}
          onStart={startSession}
        />
      )}
    </div>
  );
}
