import { VisualDiagramType } from '../types';

interface QuestionVisualProps {
  visual: VisualDiagramType;
  compact?: boolean;
}

export function QuestionVisual({ visual, compact = false }: QuestionVisualProps) {
  const containerClass = compact
    ? 'bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-center'
    : 'bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col items-center justify-center';

  if (visual.kind === 'fraction_bar') {
    const blocks = Array.from({ length: visual.denominator }, (_, i) => i < visual.numerator);
    return (
      <div className={containerClass}>
        <div className="w-full max-w-sm">
          <div className="flex gap-1 h-10 w-full rounded-lg overflow-hidden border border-slate-300 bg-white p-1">
            {blocks.map((filled, idx) => (
              <div
                key={idx}
                className={`flex-1 rounded-sm transition-colors ${
                  filled ? 'bg-blue-600' : 'bg-slate-100'
                }`}
              />
            ))}
          </div>
          {visual.label && (
            <p className="mt-2 text-center font-mono text-xs font-medium text-slate-600 tabular-nums">
              {visual.label}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (visual.kind === 'cube') {
    return (
      <div className={containerClass}>
        <svg
          viewBox="0 0 180 140"
          className={compact ? 'w-32 h-24' : 'w-44 h-32'}
          role="img"
          aria-label={`Kubus dengan rusuk ${visual.side} ${visual.unit}`}
        >
          <polygon points="45,45 105,45 105,105 45,105" fill="#DBEAFE" stroke="#1D4ED8" strokeWidth="2.5" />
          <polygon points="45,45 75,20 135,20 105,45" fill="#EFF6FF" stroke="#1D4ED8" strokeWidth="2.5" />
          <polygon points="105,45 135,20 135,80 105,105" fill="#BFDBFE" stroke="#1D4ED8" strokeWidth="2.5" />
          <text x="75" y="124" textAnchor="middle" className="fill-slate-800 text-xs font-mono font-bold">
            s = {visual.side} {visual.unit}
          </text>
        </svg>
      </div>
    );
  }

  if (visual.kind === 'cuboid') {
    return (
      <div className={containerClass}>
        <svg
          viewBox="0 0 220 145"
          className={compact ? 'w-36 h-24' : 'w-48 h-32'}
          role="img"
          aria-label={`Balok p=${visual.length}, l=${visual.width}, t=${visual.height}`}
        >
          <polygon points="30,50 130,50 130,105 30,105" fill="#DBEAFE" stroke="#1D4ED8" strokeWidth="2.5" />
          <polygon points="30,50 65,25 165,25 130,50" fill="#EFF6FF" stroke="#1D4ED8" strokeWidth="2.5" />
          <polygon points="130,50 165,25 165,80 130,105" fill="#BFDBFE" stroke="#1D4ED8" strokeWidth="2.5" />
          <text x="80" y="124" textAnchor="middle" className="fill-slate-800 text-xs font-mono font-bold">
            p = {visual.length} {visual.unit}
          </text>
          <text x="168" y="98" textAnchor="start" className="fill-slate-700 text-xs font-mono font-semibold">
            l = {visual.width}
          </text>
          <text x="172" y="55" textAnchor="start" className="fill-slate-700 text-xs font-mono font-semibold">
            t = {visual.height}
          </text>
        </svg>
      </div>
    );
  }

  if (visual.kind === 'triangle') {
    return (
      <div className={containerClass}>
        <svg
          viewBox="0 0 200 135"
          className={compact ? 'w-36 h-24' : 'w-48 h-32'}
          role="img"
          aria-label={`Segitiga alas ${visual.base} ${visual.unit} dan tinggi ${visual.height} ${visual.unit}`}
        >
          <polygon points="35,100 165,100 100,22" fill="#DBEAFE" stroke="#1D4ED8" strokeWidth="2.5" />
          <line x1="100" y1="22" x2="100" y2="100" stroke="#DC2626" strokeWidth="2" strokeDasharray="4 3" />
          <text x="100" y="120" textAnchor="middle" className="fill-slate-800 text-xs font-mono font-bold">
            alas = {visual.base} {visual.unit}
          </text>
          <text x="108" y="68" textAnchor="start" className="fill-red-700 text-xs font-mono font-bold">
            t = {visual.height} {visual.unit}
          </text>
        </svg>
      </div>
    );
  }

  if (visual.kind === 'angle') {
    return (
      <div className={containerClass}>
        <svg viewBox="0 0 140 120" className={compact ? 'w-28 h-24' : 'w-36 h-28'} role="img" aria-label="Sudut siku-siku 90 derajat">
          <line x1="35" y1="95" x2="115" y2="95" stroke="#1D4ED8" strokeWidth="3" strokeLinecap="round" />
          <line x1="35" y1="95" x2="35" y2="20" stroke="#1D4ED8" strokeWidth="3" strokeLinecap="round" />
          <rect x="35" y="75" width="20" height="20" fill="none" stroke="#DC2626" strokeWidth="2" />
          <text x="68" y="65" className="fill-slate-800 text-sm font-mono font-bold">
            {visual.label}
          </text>
        </svg>
      </div>
    );
  }

  if (visual.kind === 'food_chain') {
    return (
      <div className={containerClass}>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {visual.steps.map((step, idx) => (
            <div key={step} className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-lg bg-white border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-semibold">
                {step}
              </div>
              {idx < visual.steps.length - 1 && (
                <span className="text-emerald-700 font-bold text-base" aria-hidden="true">
                  →
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (visual.kind === 'prism_light') {
    return (
      <div className={containerClass}>
        <svg viewBox="0 0 220 110" className={compact ? 'w-40 h-20' : 'w-52 h-24'} role="img" aria-label="Dispersi cahaya pada prisma">
          <line x1="10" y1="62" x2="82" y2="52" stroke="#64748B" strokeWidth="3" />
          <polygon points="105,18 68,90 142,90" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2.5" />
          <line x1="122" y1="48" x2="205" y2="34" stroke="#EF4444" strokeWidth="2.5" />
          <line x1="124" y1="53" x2="205" y2="48" stroke="#F59E0B" strokeWidth="2.5" />
          <line x1="126" y1="58" x2="205" y2="62" stroke="#10B981" strokeWidth="2.5" />
          <line x1="128" y1="63" x2="205" y2="76" stroke="#3B82F6" strokeWidth="2.5" />
          <line x1="130" y1="68" x2="205" y2="90" stroke="#7C3AED" strokeWidth="2.5" />
        </svg>
      </div>
    );
  }

  if (visual.kind === 'compass_rose') {
    return (
      <div className={containerClass}>
        <svg viewBox="0 0 120 120" className={compact ? 'w-20 h-20' : 'w-28 h-28'} role="img" aria-label="Arah mata angin">
          <circle cx="60" cy="60" r="42" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
          <polygon points="60,22 68,60 60,54 52,60" fill="#DC2626" />
          <polygon points="60,98 68,60 60,66 52,60" fill="#1E293B" />
          <text x="60" y="15" textAnchor="middle" className="fill-slate-800 text-[10px] font-bold">U</text>
          <text x="60" y="114" textAnchor="middle" className="fill-slate-800 text-[10px] font-bold">S</text>
          <text x="10" y="64" textAnchor="middle" className="fill-slate-800 text-[10px] font-bold">B</text>
          <text x="110" y="64" textAnchor="middle" className="fill-slate-800 text-[10px] font-bold">T</text>
        </svg>
      </div>
    );
  }

  return null;
}
