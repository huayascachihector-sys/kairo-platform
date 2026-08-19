import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Download, Globe, Lock, Mail, Mic, Moon, Settings as SettingsIcon, Shield, Trash2, Volume2, AlertCircle } from 'lucide-react';
import { loadState, updateSettings, exportData, deleteAccount, requestNotificationPermission, scheduleSmartNotification } from '../../lib/store';
import { isSpeechSynthesisSupported, isSpeechRecognitionSupported } from '../../lib/speech';

interface Props {
  darkMode: boolean;
  onDarkModeChange: (v: boolean) => void;
  onStateChange: () => void;
}

const LANGUAGES = [
  { code: 'es', label: 'Español' },
  { code: 'en', label: 'English' },
  { code: 'qu', label: 'Runa Simi (Quechua)' },
] as const;

export default function Configuracion({ darkMode, onDarkModeChange, onStateChange }: Props) {
  const [state, setState] = useState(loadState);
  const s = state.settings;

  const patch = (p: Partial<typeof s>) => { updateSettings(p); setState(loadState()); onStateChange(); };

  const exportJSON = () => {
    const blob = new Blob([exportData()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'kairo-data.json'; a.click();
    URL.revokeObjectURL(url);
  };

  const removeAccount = () => {
    if (!confirm('¿Seguro? Se eliminarán todos tus datos localmente. Esta acción no se puede deshacer.')) return;
    deleteAccount();
    window.location.hash = '#';
    setTimeout(() => window.location.reload(), 100);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white flex items-center gap-2">
          <SettingsIcon className="w-7 h-7 text-primary-600" /> Configuración
        </h1>
        <p className="text-surface-500 text-sm mt-1">Personaliza tu experiencia en Kairo</p>
      </div>

      {/* Apariencia */}
      <Section title="Apariencia" icon={Moon}>
        <ToggleRow
          label="Modo oscuro"
          hint="Reduce el brillo para estudiar de noche"
          value={darkMode}
          onChange={onDarkModeChange}
        />
        <SelectRow
          icon={Globe}
          label="Idioma"
          hint="Idioma de la interfaz"
          value={s.language}
          onChange={(v) => patch({ language: v as any })}
          options={LANGUAGES.map((l) => ({ value: l.code, label: l.label }))}
        />
      </Section>

       {/* Notificaciones */}
       <Section title="Notificaciones" icon={Bell}>
         <ToggleRow
           label="Notificaciones push"
           hint="Recordatorios de estudio y logros"
           value={s.notifications}
           onChange={(v) => patch({ notifications: v })}
         />
         <div className="mt-3 flex gap-2">
           <button
             onClick={() => {
               requestNotificationPermission();
               scheduleSmartNotification();
             }}
             className="text-xs bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-3 py-2 rounded-xl font-semibold hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
           >
             🔔 Activar recordatorios
           </button>
           <button
             onClick={() => {
               const title = scheduleSmartNotification();
               if (title) alert(`Notificación de prueba: ${title}`);
             }}
             className="text-xs bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 px-3 py-2 rounded-xl font-semibold hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
           >
             📋 Probar notificación
           </button>
         </div>
         <ToggleRow
           label="Correos con novedades"
           hint="Recibe nuevos cursos y consejos por email"
           value={s.emailUpdates}
           onChange={(v) => patch({ emailUpdates: v })}
           icon={Mail}
         />
       </Section>

      {/* Voz y accesibilidad */}
      <Section title="Voz y accesibilidad" icon={Volume2}>
        <ToggleRow
          label="Responder con voz"
          hint="El asistente lee en voz alta las respuestas de la IA"
          value={s.voiceEnabled}
          onChange={(v) => patch({ voiceEnabled: v })}
          icon={Volume2}
        />
        <SelectRow
          icon={Mic}
          label="Idioma de voz"
          hint="Idioma que usa el asistente al hablar"
          value={s.voiceLang}
          onChange={(v) => patch({ voiceLang: v as any })}
          options={[
            { value: 'es', label: 'Español' },
            { value: 'en', label: 'English' },
          ]}
        />
        <div className="p-4 rounded-xl bg-surface-50 dark:bg-surface-800/60 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <Volume2 className="w-4 h-4 text-primary-600 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-surface-900 dark:text-white">Velocidad de voz</p>
                <p className="text-xs text-surface-500 dark:text-surface-400">{s.voiceRate}×</p>
              </div>
            </div>
            <input
              type="range"
              min={0.5}
              max={2}
              step={0.1}
              value={s.voiceRate}
              onChange={(e) => patch({ voiceRate: parseFloat(e.target.value) })}
              className="w-36"
            />
          </div>
          <div className="text-xs text-surface-500">
            {!isSpeechSynthesisSupported()
              ? '⚠️ Tu navegador no soporta síntesis de voz.'
              : isSpeechRecognitionSupported()
              ? '🎙️ Voz y dictado disponibles en Chrome/Edge.'
              : 'ⓘ Dictado por voz no disponible en este navegador; la lectura en voz alta sí lo está.'}
          </div>
        </div>
      </Section>

      {/* Privacidad */}
      <Section title="Privacidad y seguridad" icon={Shield}>
        <ToggleRow
          label="Perfil público"
          hint="Otros estudiantes podrán ver tu progreso"
          value={s.publicProfile}
          onChange={(v) => patch({ publicProfile: v })}
        />
        <div className="p-4 rounded-xl bg-surface-50 dark:bg-surface-800/60 flex items-start gap-3">
          <Lock className="w-4 h-4 text-primary-600 mt-0.5" />
          <div className="text-xs text-surface-600 dark:text-surface-300">
            Tus datos se guardan de forma local en tu navegador. No los compartimos con terceros.
          </div>
        </div>
      </Section>

      {/* Datos */}
      <Section title="Mis datos" icon={Download}>
        <button onClick={exportJSON}
          className="w-full flex items-center justify-between p-4 rounded-xl bg-surface-50 dark:bg-surface-800/60 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all group">
          <div className="flex items-center gap-3">
            <Download className="w-4 h-4 text-primary-600" />
            <div className="text-left">
              <p className="text-sm font-semibold text-surface-900 dark:text-white">Exportar mis datos</p>
              <p className="text-xs text-surface-500">Descarga tu progreso en formato JSON</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-primary-600 group-hover:underline">Descargar</span>
        </button>
        <button onClick={removeAccount}
          className="w-full flex items-center justify-between p-4 rounded-xl bg-red-50 hover:bg-red-100 transition-all">
          <div className="flex items-center gap-3">
            <Trash2 className="w-4 h-4 text-red-600" />
            <div className="text-left">
              <p className="text-sm font-semibold text-red-700">Eliminar cuenta</p>
              <p className="text-xs text-red-500">Borra todos tus datos permanentemente</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-red-600">Eliminar</span>
        </button>
      </Section>
    </div>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:cyber-card-dark rounded-2xl border border-surface-100 shadow-sm p-6 space-y-3">
      <h3 className="text-sm font-bold text-surface-900 dark:text-white flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-primary-600" /> {title}
      </h3>
      {children}
    </motion.div>
  );
}

function ToggleRow({ label, hint, value, onChange, icon: Icon }: {
  label: string; hint: string; value: boolean; onChange: (v: boolean) => void; icon?: any;
}) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50">
      <div className="flex items-start gap-3">
        {Icon && <Icon className="w-4 h-4 text-primary-600 mt-0.5" />}
        <div>
          <p className="text-sm font-semibold text-surface-900 dark:text-white">{label}</p>
          <p className="text-xs text-surface-500 dark:text-surface-400">{hint}</p>
        </div>
      </div>
      <button onClick={() => onChange(!value)}
        className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${value ? 'bg-primary-500' : 'bg-surface-300 dark:bg-surface-600'}`}>
        <motion.div animate={{ x: value ? 24 : 2 }} transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm" />
      </button>
    </div>
  );
}

function SelectRow({ label, hint, value, onChange, options, icon: Icon }: {
  label: string; hint: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[]; icon?: any;
}) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 gap-4">
      <div className="flex items-start gap-3 min-w-0">
        {Icon && <Icon className="w-4 h-4 text-primary-600 mt-0.5" />}
        <div className="min-w-0">
          <p className="text-sm font-semibold text-surface-900 dark:text-white">{label}</p>
          <p className="text-xs text-surface-500 dark:text-surface-400">{hint}</p>
        </div>
      </div>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="text-sm bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg px-3 py-2 outline-none focus:border-primary-400 text-surface-900 dark:text-white">
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}
