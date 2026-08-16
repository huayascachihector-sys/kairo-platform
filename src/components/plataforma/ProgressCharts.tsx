import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp, Zap, Flame } from 'lucide-react';
import { getWeeklyData, getOverallStats, getTodayKey } from '../../lib/progressTracker';

export default function ProgressCharts() {
  const weeklyData = useMemo(() => getWeeklyData(), []);
  const stats = useMemo(() => getOverallStats(), []);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 shadow-sm p-4 text-center">
          <Flame className="w-5 h-5 text-orange-500 mx-auto mb-1" />
          <p className="text-xl font-bold text-surface-900 dark:text-white">{stats.currentStreak}</p>
          <p className="text-[10px] text-surface-400 font-medium">Días seguidos</p>
        </div>
        <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 shadow-sm p-4 text-center">
          <TrendingUp className="w-5 h-5 text-primary-500 mx-auto mb-1" />
          <p className="text-xl font-bold text-surface-900 dark:text-white">{stats.accuracy}%</p>
          <p className="text-[10px] text-surface-400 font-medium">Precisión total</p>
        </div>
        <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 shadow-sm p-4 text-center">
          <Zap className="w-5 h-5 text-amber-500 mx-auto mb-1" />
          <p className="text-xl font-bold text-surface-900 dark:text-white">{stats.totalAnswered}</p>
          <p className="text-[10px] text-surface-400 font-medium">Respondidas</p>
        </div>
      </div>

      <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 shadow-sm p-4">
        <h4 className="text-xs font-semibold text-surface-500 dark:text-surface-400 mb-3">Actividad esta semana</h4>
        {weeklyData.every(d => d.answered === 0) ? (
          <div className="text-center py-6 text-sm text-surface-400">
            <p>No hay actividad esta semana.</p>
            <p className="text-xs mt-1">¡Practica en el banco de preguntas para empezar!</p>
          </div>
        ) : (
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} barCategoryGap={6}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgb(226 232 240)" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid rgb(226 232 240)', fontSize: 12 }}
                  formatter={(value: number, name: string) => [value, name === 'answered' ? 'Respondidas' : 'Correctas']}
                />
                <Bar dataKey="answered" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={24} />
                <Bar dataKey="correct" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 shadow-sm p-4">
        <h4 className="text-xs font-semibold text-surface-500 dark:text-surface-400 mb-2">
          Repaso espaciado
        </h4>
        <p className="text-xs text-surface-400 dark:text-surface-500 leading-relaxed">
          Has revisado <strong className="text-surface-700 dark:text-surface-300">{stats.totalSrs}</strong> tarjetas en total
          con el sistema SM-2. Las tarjetas que domines aparecerán con menos frecuencia,
          mientras que las difíciles se programarán para repaso pronto.
        </p>
      </div>
    </div>
  );
}
