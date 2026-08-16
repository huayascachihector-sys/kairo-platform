import { motion } from 'framer-motion';
import { Trophy, Lock, Zap, Star, TrendingUp } from 'lucide-react';
import { StoreState, ACHIEVEMENTS, getUnlockedAchievements } from '../../lib/store';

interface Props {
 state: StoreState;
}

const cardCls = "relative bg-white dark:bg-white/5 rounded-2xl border border-surface-100 dark:border-white/10 overflow-hidden group transition-all duration-300";
const dotBg = { backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' };
const hv = { y: -4, boxShadow: '0 12px 40px rgba(99,102,241,0.15)' };

export default function Logros({ state }: Props) {
  const unlocked = getUnlockedAchievements(state);
  const totalXPFromAchievements = ACHIEVEMENTS
   .filter((a) => unlocked.includes(a.id))
   .reduce((acc, a) => acc + a.xpReward, 0);

 const stats = [
  { label: 'Logros desbloqueados', value: `${unlocked.length}/${ACHIEVEMENTS.length}`, icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/30' },
  { label: 'XP de logros', value: `${totalXPFromAchievements} XP`, icon: Zap, color: 'text-primary-600', bg: 'bg-primary-50 dark:bg-primary-900/30' },
  { label: 'XP total', value: `${state.xp} XP`, icon: Star, color: 'text-violet-600', bg: 'bg-violet-50 dark:bg-violet-900/30' },
  { label: 'Racha actual', value: `${state.streak} días`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/30' },
 ];

 return (
  <div className="space-y-6">
   <div>
    <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Mis Logros</h1>
    <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">
     {unlocked.length === 0
      ? 'Completa lecciones para desbloquear logros'
      : `Has desbloqueado ${unlocked.length} de ${ACHIEVEMENTS.length} logros`}
    </p>
   </div>

   {/* Stats */}
   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {stats.map(({ label, value, icon: Icon, color, bg }, i) => (
     <motion.div key={label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.07 }} whileHover={hv} className={cardCls}>
      <div className="absolute inset-0 opacity-[0.03]" style={dotBg} />
      <div className="relative p-5 text-center">
       <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mx-auto mb-3`}>
        <Icon className={`w-5 h-5 ${color}`} />
       </div>
       <p className="text-xl font-bold text-surface-900 dark:text-white">{value}</p>
       <p className="text-xs text-surface-400 dark:text-surface-500 mt-1">{label}</p>
      </div>
     </motion.div>
    ))}
   </div>

   {/* XP progress bar */}
   <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} whileHover={hv} className={cardCls}>
    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-accent-400 to-amber-400" />
    <div className="absolute inset-0 opacity-[0.03]" style={dotBg} />
    <div className="relative p-6">
     <div className="flex items-center justify-between mb-3">
      <h3 className="font-bold text-surface-900 dark:text-white">Nivel de XP</h3>
      <span className="text-sm font-semibold text-primary-600">{state.xp} XP</span>
     </div>
     {(() => {
      const levels = [0, 100, 250, 500, 1000, 2000, 5000];
      const currentLevel = levels.findIndex((l) => state.xp < l) - 1;
      const level = Math.max(0, currentLevel);
      const nextLevel = levels[level + 1] ?? 9999;
      const prevLevel = levels[level] ?? 0;
      const pct = Math.min(100, ((state.xp - prevLevel) / (nextLevel - prevLevel)) * 100);
      const levelNames = ['Principiante', 'Básico', 'Intermedio', 'Avanzado', 'Experto', 'Maestro', 'Leyenda'];

      return (
       <>
        <div className="flex items-center justify-between text-xs text-surface-400 dark:text-surface-500 mb-2">
         <span>Nivel {level + 1}: {levelNames[level]}</span>
         <span>{state.xp < 5000 ? `${nextLevel - state.xp} XP para el siguiente nivel` : '¡Nivel máximo!'}</span>
        </div>
        <div className="w-full h-3 bg-surface-100 dark:bg-white/10 rounded-full overflow-hidden">
         <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500 relative overflow-hidden"
         >
          <div className="absolute inset-0 shimmer" />
         </motion.div>
        </div>
       </>
      );
     })()}
    </div>
   </motion.div>

   {/* Achievements grid */}
   <div>
    <h2 className="font-bold text-surface-900 dark:text-white mb-4">Todos los logros</h2>
    <div className="grid md:grid-cols-2 gap-4">
     {ACHIEVEMENTS.map((achievement, i) => {
      const isUnlocked = unlocked.includes(achievement.id);
      return (
       <motion.div
        key={achievement.id}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.06 }}
        whileHover={isUnlocked ? hv : {}}
        className={`relative rounded-2xl border overflow-hidden group transition-all duration-300 ${
         isUnlocked
          ? 'bg-white dark:bg-white/5 border-surface-100 dark:border-white/10'
          : 'bg-surface-50 dark:bg-surface-800/30 border-surface-100 dark:border-border-white/5 opacity-50'
        }`}
       >
        {isUnlocked && <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400" />}
        <div className="absolute inset-0 opacity-[0.03]" style={dotBg} />
        <div className="relative flex items-center gap-4 p-5">
         <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
          isUnlocked ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-sm' : 'bg-surface-100 dark:bg-surface-800'
         }`}>
          {isUnlocked ? <Trophy className="w-7 h-7 text-white" /> : <Lock className="w-6 h-6 text-surface-400 dark:text-surface-500" />}
         </div>
         <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
           <h3 className={`font-bold text-sm ${isUnlocked ? 'text-surface-900 dark:text-white' : 'text-surface-400 dark:text-surface-500'}`}>
            {achievement.title}
           </h3>
           {isUnlocked && (
            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 rounded-full">
             ✓ Desbloqueado
            </span>
           )}
          </div>
          <p className={`text-xs ${isUnlocked ? 'text-surface-500 dark:text-surface-400' : 'text-surface-400 dark:text-surface-500'}`}>
           {achievement.description}
          </p>
          <p className={`text-xs font-semibold mt-1 ${isUnlocked ? 'text-primary-600' : 'text-surface-400 dark:text-surface-500'}`}>
           +{achievement.xpReward} XP
          </p>
         </div>
        </div>
       </motion.div>
      );
     })}
    </div>
   </div>

   {unlocked.length === 0 && (
    <div className="text-center py-6">
     <div className="mb-3 flex justify-center"><div className="w-16 h-16 rounded-2xl bg-surface-100 dark:bg-white/5 flex items-center justify-center"><Trophy className="w-8 h-8 text-surface-400" /></div></div>
     <p className="text-surface-600 dark:text-surface-300 font-semibold">¡Empieza a estudiar para desbloquear logros!</p>
     <p className="text-surface-400 dark:text-surface-500 text-sm mt-1">Completa lecciones, mantén tu racha y gana XP</p>
    </div>
   )}
  </div>
 );
}
