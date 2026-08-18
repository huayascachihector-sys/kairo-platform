import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Plus, X, CheckCircle2, Trash2 } from 'lucide-react';

interface ClassSlot {
  id: string;
  subject: string;
  day: number;
  hour: number;
  duration: number;
  teacher: string;
  color: string;
}

const SUBJECTS = [
  { label: 'Matemáticas', light: 'bg-primary-100 text-primary-800 border-primary-200', dark: 'bg-primary-900/40 text-primary-200 border-primary-700' },
  { label: 'Física',       light: 'bg-cyan-100 text-cyan-800 border-cyan-200',         dark: 'bg-cyan-900/40 text-cyan-200 border-cyan-700' },
  { label: 'Química',      light: 'bg-emerald-100 text-emerald-800 border-emerald-200', dark: 'bg-emerald-900/40 text-emerald-200 border-emerald-700' },
  { label: 'Historia',     light: 'bg-amber-100 text-amber-800 border-amber-200',       dark: 'bg-amber-900/40 text-amber-200 border-amber-700' },
  { label: 'Comunicación', light: 'bg-violet-100 text-violet-800 border-violet-200',    dark: 'bg-violet-900/40 text-violet-200 border-violet-700' },
  { label: 'Inglés',       light: 'bg-rose-100 text-rose-800 border-rose-200',          dark: 'bg-rose-900/40 text-rose-200 border-rose-700' },
  { label: 'Biología',     light: 'bg-lime-100 text-lime-800 border-lime-200',          dark: 'bg-lime-900/40 text-lime-200 border-lime-700' },
  { label: 'Arte',         light: 'bg-pink-100 text-pink-800 border-pink-200',          dark: 'bg-pink-900/40 text-pink-200 border-pink-700' },
];

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const HOURS = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

const DEFAULT_SCHEDULE: ClassSlot[] = [
  { id: '1', subject: 'Matemáticas', day: 0, hour: 8,  duration: 2, teacher: 'Prof. García', color: 'bg-primary-100 text-primary-800 border-primary-200' },
  { id: '2', subject: 'Física',       day: 0, hour: 15, duration: 1, teacher: 'Prof. Torres', color: 'bg-cyan-100 text-cyan-800 border-cyan-200' },
  { id: '3', subject: 'Química',      day: 1, hour: 10, duration: 2, teacher: 'Prof. Lima',   color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  { id: '4', subject: 'Inglés',       day: 1, hour: 16, duration: 1, teacher: 'Prof. Smith',  color: 'bg-rose-100 text-rose-800 border-rose-200' },
  { id: '5', subject: 'Historia',     day: 2, hour: 9,  duration: 2, teacher: 'Prof. Vargas', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  { id: '6', subject: 'Comunicación', day: 3, hour: 11, duration: 2, teacher: 'Prof. Ríos',   color: 'bg-violet-100 text-violet-800 border-violet-200' },
  { id: '7', subject: 'Matemáticas',  day: 3, hour: 16, duration: 1, teacher: 'Prof. García', color: 'bg-primary-100 text-primary-800 border-primary-200' },
  { id: '8', subject: 'Física',       day: 4, hour: 8,  duration: 2, teacher: 'Prof. Torres', color: 'bg-cyan-100 text-cyan-800 border-cyan-200' },
  { id: '9', subject: 'Inglés',       day: 5, hour: 10, duration: 1, teacher: 'Prof. Smith',  color: 'bg-rose-100 text-rose-800 border-rose-200' },
];

function loadSchedule(): ClassSlot[] {
  try {
    const raw = localStorage.getItem('sm_schedule');
    return raw ? JSON.parse(raw) : DEFAULT_SCHEDULE;
  } catch { return DEFAULT_SCHEDULE; }
}
function saveSchedule(s: ClassSlot[]) {
  localStorage.setItem('sm_schedule', JSON.stringify(s));
}

export default function Horario() {
  const [schedule, setSchedule] = useState<ClassSlot[]>(loadSchedule);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ subject: 0, day: 0, hour: 8, duration: 1, teacher: '' });
  const todayIdx = (new Date().getDay() + 6) % 7; // Monday = 0

  const addClass = () => {
    const sub = SUBJECTS[form.subject];
    const slot: ClassSlot = {
      id: Date.now().toString(),
      subject: sub.label,
      day: form.day,
      hour: form.hour,
      duration: form.duration,
      teacher: form.teacher.trim() || 'Sin profesor',
      color: sub.light,
    };
    const updated = [...schedule, slot];
    setSchedule(updated);
    saveSchedule(updated);
    setShowAdd(false);
    setForm({ subject: 0, day: 0, hour: 8, duration: 1, teacher: '' });
  };

  const removeSlot = (id: string) => {
    const updated = schedule.filter((s) => s.id !== id);
    setSchedule(updated);
    saveSchedule(updated);
  };

  const clearAll = () => {
    setSchedule([]);
    saveSchedule([]);
  };

  const resetDefault = () => {
    setSchedule(DEFAULT_SCHEDULE);
    saveSchedule(DEFAULT_SCHEDULE);
  };

  // Today's classes
  const todayClasses = schedule
    .filter((s) => s.day === todayIdx)
    .sort((a, b) => a.hour - b.hour);

  // Weekly total per subject
  const subjectHours: Record<string, number> = {};
  schedule.forEach((s) => { subjectHours[s.subject] = (subjectHours[s.subject] || 0) + s.duration; });

  // ── Weekly grid: CSS grid with proper row-spanning ──────────────────────────
  const CELL_H = 36; // px per hour slot
  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '52px repeat(7, 1fr)',
    gridTemplateRows: `36px ${HOURS.map(() => `${CELL_H}px`).join(' ')}`,
    gap: '2px',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Mi Horario</h1>
          <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">
            {DAYS[todayIdx]} — {new Date().toLocaleDateString('es-PE', { day: 'numeric', month: 'long' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={resetDefault}
            className="text-xs text-surface-400 dark:text-surface-500 hover:text-surface-600 dark:hover:text-surface-300 px-3 py-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          >
            Restablecer
          </button>
          <button
            onClick={() => setShowAdd(true)}
            className="btn-primary text-sm !py-2.5 !px-5 flex items-center gap-2"
          >
            <span className="flex items-center gap-2"><Plus className="w-4 h-4" /> Agregar clase</span>
          </button>
        </div>
      </div>

      {/* Today's schedule */}
      <div className="bg-white dark:cyber-card-dark rounded-2xl border border-surface-100 shadow-sm p-6">
        <h2 className="font-bold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary-600" /> Hoy — {DAYS[todayIdx]}
        </h2>
        {todayClasses.length === 0 ? (
          <p className="text-surface-400 text-sm py-4 text-center">No tienes clases programadas para hoy 🎉</p>
        ) : (
          <div className="space-y-3">
            {todayClasses.map((cls) => {
              const now = new Date().getHours();
              const isNow = now >= cls.hour && now < cls.hour + cls.duration;
              const isPast = now >= cls.hour + cls.duration;
              return (
                <motion.div
                  key={cls.id}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  className={`flex items-center gap-4 p-4 rounded-xl border ${cls.color} ${isNow ? 'ring-2 ring-primary-400' : ''}`}
                >
                  <div className="text-center min-w-[60px]">
                    <p className="text-sm font-bold">{cls.hour}:00</p>
                    <p className="text-xs opacity-70">{cls.duration}h</p>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm">{cls.subject}</p>
                    <p className="text-xs opacity-70">{cls.teacher}</p>
                  </div>
                  {isNow && (
                    <span className="text-xs font-bold px-2 py-1 bg-primary-600 text-white rounded-full animate-pulse">En curso</span>
                  )}
                  {isPast && <CheckCircle2 className="w-5 h-5 opacity-50" />}
                  <button onClick={() => removeSlot(cls.id)}
                    className="p-1 hover:bg-black/10 rounded-lg transition-colors opacity-50 hover:opacity-100">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Weekly grid */}
      <div className="bg-white dark:cyber-card-dark rounded-2xl border border-surface-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-surface-900 dark:text-white">Vista Semanal</h2>
          {schedule.length > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 text-xs text-rose-500 hover:text-rose-600 px-2 py-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Limpiar todo
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[700px]" style={gridStyle}>
            {/* Corner */}
            <div style={{ gridRow: 1, gridColumn: 1 }} />

            {/* Day headers */}
            {DAYS.map((d, i) => (
              <div
                key={d}
                style={{ gridRow: 1, gridColumn: i + 2 }}
                className={`text-xs font-bold text-center py-1 px-1 rounded-lg flex items-center justify-center ${
                  i === todayIdx
                    ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300'
                    : 'text-surface-500 dark:text-surface-400'
                }`}
              >
                {d.slice(0, 3)}
              </div>
            ))}

            {/* Hour labels */}
            {HOURS.map((h, ri) => (
              <div
                key={h}
                style={{ gridRow: ri + 2, gridColumn: 1 }}
                className="text-[10px] text-surface-400 dark:text-surface-600 text-right pr-2 pt-1 leading-none"
              >
                {h}:00
              </div>
            ))}

            {/* Background cells */}
            {HOURS.map((_, ri) =>
              [0, 1, 2, 3, 4, 5, 6].map((d) => (
                <div
                  key={`bg-${ri}-${d}`}
                  style={{ gridRow: ri + 2, gridColumn: d + 2 }}
                  className={`rounded-md ${
                    d === todayIdx
                      ? 'bg-primary-50/60 dark:bg-primary-900/10'
                      : 'bg-surface-50 dark:bg-surface-800/50'
                  }`}
                />
              ))
            )}

            {/* Class blocks — rendered on top with z-index */}
            {schedule.map((cls) => {
              const rowStart = HOURS.indexOf(cls.hour);
              if (rowStart < 0) return null; // hour not in displayed range
              const rowSpan = Math.min(cls.duration, HOURS.length - rowStart);
              return (
                <div
                  key={cls.id}
                  style={{
                    gridRow: `${rowStart + 2} / span ${rowSpan}`,
                    gridColumn: cls.day + 2,
                    zIndex: 10,
                  }}
                  className={`${cls.color} border rounded-md p-1.5 text-[10px] font-semibold leading-tight overflow-hidden cursor-pointer group relative`}
                  title={`${cls.subject} — ${cls.teacher}`}
                >
                  <span className="block truncate">{cls.subject.slice(0, 5)}</span>
                  {rowSpan > 1 && (
                    <span className="block truncate opacity-70 text-[9px]">{cls.teacher.slice(0, 12)}</span>
                  )}
                  <button
                    onClick={() => removeSlot(cls.id)}
                    className="absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 hover:bg-black/20 rounded p-0.5"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Subject hours summary */}
      {Object.keys(subjectHours).length > 0 && (
        <div className="bg-white dark:cyber-card-dark rounded-2xl border border-surface-100 shadow-sm p-6">
          <h2 className="font-bold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary-600" /> Horas por materia (esta semana)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(subjectHours).map(([sub, hrs]) => {
              const subData = SUBJECTS.find((s) => s.label === sub);
              return (
                <div key={sub} className={`p-4 rounded-xl border ${subData ? subData.light : 'bg-surface-50 text-surface-600 border-surface-200'} ${subData?.dark || 'dark:bg-surface-800/60 dark:text-surface-300 dark:border-surface-700'}`}>
                  <p className="font-bold text-sm">{sub}</p>
                  <p className="text-2xl font-bold mt-1">{hrs}h</p>
                  <p className="text-xs opacity-70">por semana</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add class modal */}
      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:cyber-card-dark rounded-2xl shadow-2xl p-6 w-full max-w-md border border-surface-100 "
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-surface-900 dark:text-white text-lg">Agregar clase</h3>
                <button onClick={() => setShowAdd(false)}>
                  <X className="w-5 h-5 text-surface-400" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2 block">Materia</label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: Number(e.target.value) })}
                    className="w-full border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-800 dark:text-surface-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-400"
                  >
                    {SUBJECTS.map((s, i) => <option key={i} value={i}>{s.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2 block">
                    Nombre del profesor <span className="font-normal text-surface-400">(opcional)</span>
                  </label>
                  <input
                    value={form.teacher}
                    onChange={(e) => setForm({ ...form, teacher: e.target.value })}
                    placeholder="Ej: Prof. García"
                    className="w-full border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-800 dark:text-surface-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-400 placeholder:text-surface-400"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2 block">Día</label>
                    <select
                      value={form.day}
                      onChange={(e) => setForm({ ...form, day: Number(e.target.value) })}
                      className="w-full border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-800 dark:text-surface-200 rounded-xl px-3 py-3 text-sm outline-none focus:border-primary-400"
                    >
                      {DAYS.map((d, i) => <option key={i} value={i}>{d.slice(0, 3)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2 block">Hora</label>
                    <select
                      value={form.hour}
                      onChange={(e) => setForm({ ...form, hour: Number(e.target.value) })}
                      className="w-full border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-800 dark:text-surface-200 rounded-xl px-3 py-3 text-sm outline-none focus:border-primary-400"
                    >
                      {HOURS.map((h) => <option key={h} value={h}>{h}:00</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2 block">Duración</label>
                    <select
                      value={form.duration}
                      onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
                      className="w-full border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-800 dark:text-surface-200 rounded-xl px-3 py-3 text-sm outline-none focus:border-primary-400"
                    >
                      {[1, 2, 3, 4].map((h) => <option key={h} value={h}>{h}h</option>)}
                    </select>
                  </div>
                </div>

                {/* Preview chip */}
                <div className={`flex items-center gap-3 p-3 rounded-xl border ${SUBJECTS[form.subject].light}`}>
                  <div className="w-3 h-3 rounded-full bg-current opacity-60 flex-shrink-0" />
                  <span className="text-sm font-semibold">{SUBJECTS[form.subject].label}</span>
                  <span className="text-xs opacity-70 ml-auto">{DAYS[form.day].slice(0,3)} {form.hour}:00 · {form.duration}h</span>
                </div>

                <button
                  onClick={addClass}
                  className="btn-primary w-full justify-center text-sm !py-3.5 mt-2"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" /> Agregar clase
                  </span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
