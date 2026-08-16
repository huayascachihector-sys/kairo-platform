import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';
import type { SRSAction } from '../../lib/srsEngine';

const BUTTONS: { key: SRSAction; label: string; desc: string; shortcut: string; tooltip: string; color: string }[] = [
  { key: 'again', label: 'Otra vez', desc: 'No lo sabía', shortcut: '1',
    tooltip: 'No recordabas la respuesta. Volverá a aparecer en minutos.',
    color: 'border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300' },
  { key: 'hard', label: 'Difícil', desc: 'Me costó', shortcut: '2',
    tooltip: 'Te fue difícil. Aparecerá en ~30 minutos.',
    color: 'border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/30 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-700 dark:text-amber-300' },
  { key: 'good', label: 'Bien', desc: 'Lo sabía', shortcut: '3',
    tooltip: 'Respondiste bien. Aparecerá mañana.',
    color: 'border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300' },
  { key: 'easy', label: 'Fácil', desc: 'Muy fácil', shortcut: '4',
    tooltip: 'Fue muy fácil. Aparecerá en 3 días.',
    color: 'border-blue-300 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300' },
];

export default function SRSRating({ onRate }: { onRate: (action: SRSAction) => void }) {
  return (
    <div className="space-y-3">
      <p className="text-[11px] font-semibold text-surface-400 dark:text-surface-500 text-center uppercase tracking-wider">
        ¿Qué tan bien lo sabías?
      </p>
      <div className="grid grid-cols-4 gap-2">
        {BUTTONS.map(btn => (
          <Tooltip key={btn.key}>
            <TooltipTrigger asChild>
              <button
                onClick={() => onRate(btn.key)}
                className={`flex flex-col items-center gap-0.5 p-3 rounded-xl border-2 transition-all ${btn.color}`}
              >
                <span className="text-sm font-bold">{btn.label}</span>
                <span className="text-[10px] opacity-70">{btn.desc}</span>
                <kbd className="text-[9px] opacity-50 mt-0.5 font-mono">{btn.shortcut}</kbd>
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-48 text-center">
              <p>{btn.tooltip}</p>
              <p className="opacity-70 mt-0.5">Tecla: {btn.shortcut}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
      <p className="text-[10px] text-surface-400 dark:text-surface-500 text-center">
        Ajusta cada cuándo repasar esta pregunta
      </p>
    </div>
  );
}
