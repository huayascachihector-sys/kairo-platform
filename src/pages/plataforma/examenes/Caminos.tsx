import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, ChevronRight, Circle, ClipboardList, CalendarDays, FileText, Route as RouteIcon } from 'lucide-react';
import { UNIVERSITY_PATHS, getUniversityPath } from '../../../lib/admisionData';
import { getAdmissionProgress, toggleAdmissionTask, type StoreState } from '../../../lib/store';

interface Props {
  state: StoreState;
  onStateChange: () => void;
  onOpenChange?: (open: boolean) => void;
}

export default function Caminos({ state, onStateChange, onOpenChange }: Props) {
  const [open, setOpen] = useState<string | null>(null);
  const setOpenPath = (id: string | null) => {
    setOpen(id);
    onOpenChange?.(id !== null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const uni = open ? getUniversityPath(open) : undefined;

  if (uni) {
    const done = state.admissionChecklist[uni.id] || [];
    const { pct } = getAdmissionProgress(state, uni.id, uni.checklist.length);

    return (
      <div className="space-y-6">
        <button onClick={() => setOpenPath(null)}
          className="flex items-center gap-1.5 text-sm font-semibold text-surface-500 hover:text-surface-800 dark:hover:text-surface-200">
          <ArrowLeft className="w-4 h-4" /> Volver a Caminos
        </button>

        <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 shadow-sm p-6 md:p-8">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${uni.color} flex items-center justify-center text-3xl mb-4 shadow-md`}>
            {uni.icon}
          </div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">{uni.short}</h1>
          <p className="text-xs text-surface-400 mb-2">{uni.name} · {uni.country}</p>
          <p className="text-surface-500 text-sm leading-relaxed mb-6">{uni.summary}</p>

          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs text-surface-500">{done.length} de {uni.checklist.length} pasos completados</span>
            <span className="text-xs font-bold text-surface-700 dark:text-surface-300">{pct}%</span>
          </div>
          <div className="w-full h-2 bg-surface-100 dark:bg-surface-800 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6 }}
              className={`h-full rounded-full bg-gradient-to-r ${uni.color}`} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 shadow-sm p-6">
            <h3 className="text-sm font-bold text-surface-900 dark:text-white flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-primary-500" /> Requisitos de admisión
            </h3>
            <ul className="space-y-2">
              {uni.requisitos.map((r) => (
                <li key={r} className="flex gap-2 text-sm text-surface-500 leading-relaxed">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-400 flex-shrink-0" /> {r}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 shadow-sm p-6">
            <h3 className="text-sm font-bold text-surface-900 dark:text-white flex items-center gap-2 mb-3">
              <ClipboardList className="w-4 h-4 text-accent-500" /> Exámenes que exige
            </h3>
            <div className="space-y-3">
              {uni.examenes.map((e) => (
                <div key={e.name} className="rounded-xl border border-surface-100 dark:border-surface-800 p-3">
                  <p className="text-sm font-semibold text-surface-900 dark:text-white">{e.name}</p>
                  <p className="text-xs text-surface-500 leading-relaxed mt-0.5">{e.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 shadow-sm p-6">
            <h3 className="text-sm font-bold text-surface-900 dark:text-white flex items-center gap-2 mb-3">
              <CalendarDays className="w-4 h-4 text-primary-500" /> Fechas límite de postulación
            </h3>
            <div className="space-y-2">
              {uni.fechas.map((f) => (
                <div key={f.label} className="flex items-start justify-between gap-3 text-sm">
                  <span className="text-surface-500 leading-relaxed">{f.label}</span>
                  <span className="text-xs font-semibold text-surface-700 dark:text-surface-300 whitespace-nowrap">{f.date}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-surface-400 mt-3 leading-relaxed">
              Fechas referenciales del ciclo habitual. Confirma siempre el cronograma oficial del año en curso.
            </p>
          </div>

          <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 shadow-sm p-6">
            <h3 className="text-sm font-bold text-surface-900 dark:text-white flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Tu checklist para {uni.short}
            </h3>
            <div className="space-y-2">
              {uni.checklist.map((t) => {
                const isDone = done.includes(t.id);
                return (
                  <button key={t.id}
                    onClick={() => { toggleAdmissionTask(uni.id, t.id); onStateChange(); }}
                    className={`w-full flex items-start gap-2.5 text-left px-3 py-2.5 rounded-xl border transition-all ${
                      isDone
                        ? 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/20'
                        : 'border-surface-100 dark:border-surface-800 hover:border-primary-300 hover:bg-primary-50/50 dark:hover:bg-primary-900/20'
                    }`}>
                    {isDone
                      ? <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      : <Circle className="w-4 h-4 text-surface-300 dark:text-surface-600 flex-shrink-0 mt-0.5" />}
                    <span className={`text-sm leading-relaxed ${
                      isDone ? 'text-surface-400 line-through' : 'text-surface-700 dark:text-surface-300'
                    }`}>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-sm font-bold text-surface-900 dark:text-white flex items-center gap-2 mb-1">
        <RouteIcon className="w-4 h-4 text-primary-500" /> Caminos
      </h2>
      <p className="text-xs text-surface-500 mb-4">
        Rutas de admisión personalizadas por universidad: requisitos, exámenes, fechas y tu propia checklist de avance.
      </p>

      <div className="grid md:grid-cols-2 gap-5">
        {UNIVERSITY_PATHS.map((u, i) => {
          const { done, total, pct } = getAdmissionProgress(state, u.id, u.checklist.length);
          return (
            <motion.button key={u.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(0,0,0,0.08)' }}
              onClick={() => setOpenPath(u.id)}
              className="text-left bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 shadow-sm p-6 transition-all">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${u.color} flex items-center justify-center text-2xl mb-4 shadow-md`}>
                {u.icon}
              </div>
              <h3 className="text-base font-bold text-surface-900 dark:text-white mb-0.5">{u.short}</h3>
              <p className="text-[11px] text-surface-400 mb-2">{u.name} · {u.country}</p>
              <p className="text-xs text-surface-500 mb-4 leading-relaxed">{u.summary}</p>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-surface-500">{done} de {total} pasos</span>
                  <span className="text-xs font-bold text-surface-700 dark:text-surface-300">{pct}%</span>
                </div>
                <div className="w-full h-2 bg-surface-100 dark:bg-surface-800 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                    transition={{ delay: 0.2 + i * 0.05, duration: 0.6 }}
                    className={`h-full rounded-full bg-gradient-to-r ${u.color}`} />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-surface-400">{u.examenes.length} exámenes exigidos</span>
                <span className="flex items-center gap-1 text-xs font-semibold text-primary-600 dark:text-primary-400">
                  {pct === 100 ? (<><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Listo</>)
                    : pct > 0 ? (<>Continuar <ChevronRight className="w-3.5 h-3.5" /></>)
                    : (<>Ver camino <ChevronRight className="w-3.5 h-3.5" /></>)}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
