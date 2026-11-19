import { Maximize2, Minimize2 } from 'lucide-react';
import { soundFX } from '../utils/sound';
import { ttsEngine } from '../utils/tts';

export type AppRoute =
  | 'home'
  | 'bahan_bacaan'
  | 'ular_tangga'
  | 'asesmen'
  | 'bank_soal'
  | 'playing';

interface TopBarProps {
  currentRoute: AppRoute;
  onNavigate: (route: Exclude<AppRoute, 'playing'>) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export function TopBar({
  currentRoute,
  onNavigate,
  isFullscreen,
  onToggleFullscreen,
}: TopBarProps) {
  const navItems: Array<{ id: Exclude<AppRoute, 'playing'>; label: string }> = [
    { id: 'home', label: 'Beranda' },
    { id: 'bahan_bacaan', label: 'Bahan Bacaan' },
    { id: 'ular_tangga', label: 'Ular Tangga' },
    { id: 'asesmen', label: 'Asesmen' },
    { id: 'bank_soal', label: 'Bank Soal' },
  ];

  const handleNav = (id: Exclude<AppRoute, 'playing'>) => {
    soundFX.playClick();
    ttsEngine.stop();
    onNavigate(id);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        <button
          type="button"
          onClick={() => handleNav('home')}
          className="font-display text-lg sm:text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:text-blue-700 transition-colors cursor-pointer"
        >
          PapanPintar V
        </button>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = currentRoute === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer border-b-2 ${
                  isActive
                    ? 'text-blue-700 border-blue-700 font-semibold'
                    : 'text-slate-600 border-transparent hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => {
              soundFX.playClick();
              onToggleFullscreen();
            }}
            className="ifp-touch-target inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-700 rounded-lg hover:bg-blue-800 active:scale-[0.98] transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Keluar Penuh</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Layar Penuh</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Compact touch nav strip on narrow viewports */}
      <nav className="flex md:hidden items-center gap-2 px-4 pb-2.5 overflow-x-auto text-xs font-medium">
        {navItems.map((item) => {
          const isActive = currentRoute === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNav(item.id)}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap shrink-0 transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
