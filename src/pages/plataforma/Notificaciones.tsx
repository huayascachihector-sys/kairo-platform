import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCheck, Sparkles, BookOpen, Calendar, Megaphone, ClipboardList } from 'lucide-react';
import { loadState, markNotificationRead, markAllNotificationsRead, Notification } from '../../lib/store';

interface Props {
 onStateChange: () => void;
}

const TYPE_META: Record<Notification['type'], { icon: any; color: string; label: string }> = {
 tarea:    { icon: ClipboardList, color: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700',  label: 'Tarea' },
 recordatorio: { icon: Calendar,   color: 'bg-blue-100 text-blue-700',   label: 'Recordatorio' },
 ia:      { icon: Sparkles,   color: 'bg-primary-100 dark:bg-primary-900/40 text-primary-700', label: 'Mensaje IA' },
 curso:    { icon: BookOpen,   color: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700', label: 'Curso' },
 anuncio:   { icon: Megaphone,   color: 'bg-purple-100 text-purple-700', label: 'Anuncio' },
};

const FILTERS: { id: 'all' | Notification['type']; label: string }[] = [
 { id: 'all', label: 'Todas' },
 { id: 'tarea', label: 'Tareas' },
 { id: 'recordatorio', label: 'Recordatorios' },
 { id: 'ia', label: 'Mensajes IA' },
 { id: 'curso', label: 'Cursos' },
 { id: 'anuncio', label: 'Anuncios' },
];

function timeAgo(iso: string) {
 const diff = Date.now() - new Date(iso).getTime();
 const mins = Math.floor(diff / 60000);
 if (mins < 1) return 'ahora';
 if (mins < 60) return `hace ${mins} min`;
 const hrs = Math.floor(mins / 60);
 if (hrs < 24) return `hace ${hrs} h`;
 return `hace ${Math.floor(hrs / 24)} d`;
}

export default function Notificaciones({ onStateChange }: Props) {
 const [state, setState] = useState(loadState);
 const [filter, setFilter] = useState<'all' | Notification['type']>('all');

 const refresh = () => { setState(loadState()); onStateChange(); };

 const items = filter === 'all' ? state.notifications : state.notifications.filter((n) => n.type === filter);
 const unread = state.notifications.filter((n) => !n.read).length;

 return (
  <div className="space-y-6 max-w-3xl">
   <div className="flex items-start justify-between gap-3 flex-wrap">
    <div>
     <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white flex items-center gap-2">
      <Bell className="w-7 h-7 text-primary-600" /> Notificaciones
     </h1>
     <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">
      {unread > 0 ? `Tienes ${unread} sin leer` : 'Estás al día'}
     </p>
    </div>
    {unread > 0 && (
     <button onClick={() => { markAllNotificationsRead(); refresh(); }}
      className="text-xs font-semibold text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30  px-3 py-2 rounded-lg flex items-center gap-1.5">
      <CheckCheck className="w-4 h-4" /> Marcar todo como leído
     </button>
    )}
   </div>

   <div className="flex gap-2 flex-wrap">
    {FILTERS.map((f) => (
     <button key={f.id} onClick={() => setFilter(f.id)}
      className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
       filter === f.id
        ? 'bg-primary-600 text-white border-primary-600'
        : 'bg-white dark:bg-surface-900 text-surface-600 dark:text-surface-300 border-surface-200 dark:border-surface-700 hover:border-primary-300'
      }`}>
      {f.label}
     </button>
    ))}
   </div>

   <div className="space-y-2">
    <AnimatePresence>
     {items.length === 0 ? (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
       className="bg-white dark:bg-surface-900 rounded-2xl border border-dashed border-surface-200 dark:border-surface-700 p-12 text-center">
       <Bell className="w-10 h-10 text-surface-300 dark:text-surface-600 mx-auto mb-3" />
       <p className="text-sm text-surface-500 dark:text-surface-400">No hay notificaciones aquí.</p>
      </motion.div>
     ) : (
      items.map((n) => {
       const meta = TYPE_META[n.type];
       const Icon = meta.icon;
       return (
        <motion.button key={n.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
         onClick={() => { markNotificationRead(n.id); refresh(); }}
         className={`w-full text-left bg-white dark:bg-surface-900 rounded-2xl border p-4 flex gap-3 hover:border-primary-200 transition-all ${
          n.read ? 'border-surface-100 dark:border-surface-800' : 'border-primary-200 shadow-sm'
         }`}>
         <div className={`w-10 h-10 rounded-xl ${meta.color} flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-5 h-5" />
         </div>
         <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
           <p className="text-sm font-semibold text-surface-900 dark:text-white truncate">{n.title}</p>
           {!n.read && <span className="w-2 h-2 rounded-full bg-primary-50 dark:bg-primary-900/30 flex-shrink-0" />}
          </div>
          <p className="text-xs text-surface-600 dark:text-surface-300 line-clamp-2">{n.body}</p>
          <p className="text-[11px] text-surface-400 dark:text-surface-500 mt-1.5">{timeAgo(n.createdAt)} · {meta.label}</p>
         </div>
        </motion.button>
       );
      })
     )}
    </AnimatePresence>
   </div>
  </div>
 );
}
