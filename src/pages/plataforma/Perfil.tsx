import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, School, GraduationCap, MapPin, Target, Camera, Save, Lock, Check, Flame, Brain, Rocket, Star, Sparkles, Zap, BookOpen, Microscope, Ruler, Palette, Code2 } from 'lucide-react';
import { loadState, updateUser, changePassword, hasPassword } from '../../lib/store';

interface Props {
 onStateChange: () => void;
}

const AVATAR_OPTIONS = [
  { icon: GraduationCap, gradient: 'from-primary-500 to-accent-500' },
  { icon: Brain, gradient: 'from-violet-500 to-purple-600' },
  { icon: Rocket, gradient: 'from-cyan-500 to-blue-600' },
  { icon: Star, gradient: 'from-amber-400 to-orange-500' },
  { icon: Sparkles, gradient: 'from-pink-500 to-rose-500' },
  { icon: Zap, gradient: 'from-yellow-400 to-amber-500' },
  { icon: BookOpen, gradient: 'from-emerald-500 to-teal-600' },
  { icon: Microscope, gradient: 'from-indigo-500 to-primary-600' },
  { icon: Ruler, gradient: 'from-teal-400 to-cyan-500' },
  { icon: Palette, gradient: 'from-fuchsia-500 to-pink-500' },
  { icon: Code2, gradient: 'from-sky-500 to-indigo-600' },
  { icon: User, gradient: 'from-surface-500 to-surface-700' },
];

export default function Perfil({ onStateChange }: Props) {
 const [state, setState] = useState(loadState);
 const [form, setForm] = useState({
  name:  state.user?.name  || '',
  email:  state.user?.email  || '',
  colegio: state.user?.colegio || '',
  grado:  state.user?.grado  || '',
  pais:  state.user?.pais  || 'Perú',
  metas:  state.user?.metas  || '',
   avatar: state.user?.avatar || '0',
 });
 const [saved, setSaved] = useState(false);
 const [showPwd, setShowPwd] = useState(false);
 const [pwd, setPwd] = useState({ current: '', next: '', confirm: '' });
 const [pwdMsg, setPwdMsg] = useState('');
 const fileRef = useRef<HTMLInputElement>(null);

 const save = () => {
  updateUser(form);
  setState(loadState());
  onStateChange();
  setSaved(true);
  setTimeout(() => setSaved(false), 2000);
 };

const changePwd = () => {
  if (pwd.next.length < 8) return setPwdMsg('La nueva contraseña debe tener al menos 8 caracteres');
  if (pwd.next !== pwd.confirm) return setPwdMsg('Las contraseñas no coinciden');
  const ok = changePassword(pwd.current, pwd.next);
  if (!ok) return setPwdMsg('Contraseña actual incorrecta');
  setPwdMsg('Contraseña actualizada correctamente');
  setPwd({ current: '', next: '', confirm: '' });
  setTimeout(() => { setShowPwd(false); setPwdMsg(''); }, 1500);
 };

 const uploadPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
  const f = e.target.files?.[0];
  if (!f) return;
  const r = new FileReader();
  r.onload = () => setForm({ ...form, avatar: r.result as string });
  r.readAsDataURL(f);
 };

  const isIconAvatar = form.avatar.length <= 2 && !isNaN(Number(form.avatar));
  const avatarOption = isIconAvatar ? AVATAR_OPTIONS[Number(form.avatar)] : null;
  const isUploadedPhoto = form.avatar.startsWith('data:') || form.avatar.startsWith('http');
  const initials = (form.name || 'E').charAt(0).toUpperCase();

  const cardClasses = "relative bg-white dark:bg-white/5 rounded-2xl border border-surface-100 dark:border-white/10 overflow-hidden group";
  const hoverEffect = { y: -4, boxShadow: '0 12px 40px rgba(99,102,241,0.15)' };

  return (
   <div className="space-y-6 max-w-4xl">
    <div>
     <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white flex items-center gap-2">
      <User className="w-7 h-7 text-primary-600" /> Mi Perfil
     </h1>
     <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">Personaliza tu información y metas académicas</p>
    </div>

    {/* Header card */}
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={hoverEffect} transition={{ duration: 0.4 }}
     className={cardClasses}>
     <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-accent-400 to-amber-400" />
     <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px'}} />
     <div className="relative p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
      <div className="relative">
       <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${avatarOption?.gradient || 'from-primary-400 to-accent-500'} flex items-center justify-center text-white text-4xl font-bold overflow-hidden shadow-lg shadow-primary-200/40`}>
        {isUploadedPhoto
         ? <img src={form.avatar} alt="avatar" className="w-full h-full object-cover" />
         : avatarOption
          ? <avatarOption.icon className="w-10 h-10" />
          : <span className="text-2xl font-bold">{initials}</span>}
       </div>
       <button onClick={() => fileRef.current?.click()}
        className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow-md flex items-center justify-center text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-all">
        <Camera className="w-4 h-4" />
       </button>
       <input ref={fileRef} type="file" accept="image/*" onChange={uploadPhoto} className="hidden" />
      </div>
      <div className="flex-1 text-center sm:text-left">
       <h2 className="text-xl font-bold text-surface-900 dark:text-white">{form.name || 'Estudiante'}</h2>
       <p className="text-sm text-surface-500 dark:text-surface-400">{form.email || 'sin correo'}</p>
       <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
        <span className="text-xs font-semibold bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full">{state.xp} XP</span>
        <span className="text-xs font-semibold bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-3 py-1 rounded-full inline-flex items-center gap-1"><Flame className="w-3.5 h-3.5" /> {state.streak} días</span>
        {form.grado && <span className="text-xs font-semibold bg-surface-100 dark:bg-white/10 text-surface-700 dark:text-surface-300 px-3 py-1 rounded-full">{form.grado}</span>}
       </div>
       <div className="flex flex-wrap gap-1.5 mt-4">
         <p className="text-xs text-surface-400 dark:text-surface-500 w-full mb-1">Elige un avatar:</p>
         {AVATAR_OPTIONS.map((opt, i) => (
          <motion.button key={i} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }} onClick={() => setForm({ ...form, avatar: String(i) })}
           className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
            form.avatar === String(i) ? 'ring-2 ring-primary-400 ring-offset-2 dark:ring-offset-surface-900 scale-110' : 'bg-surface-50 dark:bg-white/10 hover:bg-surface-100 dark:hover:bg-white/20'
           }`}>
           <div className={`w-8 h-8 rounded-md bg-gradient-to-br ${opt.gradient} flex items-center justify-center`}>
            <opt.icon className="w-4 h-4 text-white" />
           </div>
          </motion.button>
         ))}
        </div>
      </div>
     </div>
    </motion.div>

    {/* Form */}
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} whileHover={hoverEffect}
     className={cardClasses}>
     <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-violet-400 to-indigo-400" />
     <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px'}} />
     <div className="relative p-6 space-y-5">
      <h3 className="text-sm font-bold text-surface-900 dark:text-white flex items-center gap-2"><User className="w-4 h-4 text-primary-500" /> Información personal</h3>
      <div className="grid md:grid-cols-2 gap-4">
       <Field icon={User}  label="Nombre completo" value={form.name}  onChange={(v) => setForm({ ...form, name: v })} />
       <Field icon={Mail}  label="Correo"     value={form.email}  onChange={(v) => setForm({ ...form, email: v })} type="email" />
       <Field icon={School} label="Colegio"     value={form.colegio} onChange={(v) => setForm({ ...form, colegio: v })} placeholder="Ej. COAR Lima" />
       <Field icon={GraduationCap} label="Grado"  value={form.grado}  onChange={(v) => setForm({ ...form, grado: v })} placeholder="Ej. 5to secundaria" />
       <Field icon={MapPin} label="País"      value={form.pais}  onChange={(v) => setForm({ ...form, pais: v })} />
      </div>
      <div>
       <label className="text-xs font-semibold text-surface-600 dark:text-surface-300 mb-2 flex items-center gap-1.5">
        <Target className="w-3.5 h-3.5 text-primary-500" /> Metas académicas
       </label>
       <textarea value={form.metas} onChange={(e) => setForm({ ...form, metas: e.target.value })}
        rows={3} placeholder="Ej. Ingresar a la UNI, dominar cálculo, aprender inglés fluido…"
        className="w-full bg-surface-50 dark:bg-white/5 border border-surface-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 resize-none transition-all" />
      </div>
      <div className="flex flex-wrap gap-3 pt-2">
       <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={save} className="btn-primary text-sm !py-3 !px-6 flex items-center gap-2 shadow-lg shadow-primary-500/20">
        {saved ? <><Check className="w-4 h-4" /> Guardado</> : <><Save className="w-4 h-4" /> Guardar cambios</>}
       </motion.button>
       <button onClick={() => setShowPwd(!showPwd)}
        className="text-sm font-semibold text-surface-600 dark:text-surface-300 hover:text-primary-600 dark:hover:text-primary-400 px-4 py-3 rounded-xl border border-surface-200 dark:border-white/10 hover:border-primary-300 dark:hover:border-primary-600 flex items-center gap-2 transition-all">
        <Lock className="w-4 h-4" /> Cambiar contraseña
       </button>
      </div>

      {showPwd && (
       <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
        className="border-t border-surface-100 dark:border-white/10 pt-5 space-y-3">
        <input type="password" placeholder={hasPassword(state.user?.email || '') ? 'Contraseña actual' : 'Aún no tienes contraseña (déjalo vacío)'} value={pwd.current}
         onChange={(e) => setPwd({ ...pwd, current: e.target.value })}
         className="w-full bg-surface-50 dark:bg-white/5 border border-surface-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-400 transition-all" />
        <input type="password" placeholder="Nueva contraseña" value={pwd.next}
         onChange={(e) => setPwd({ ...pwd, next: e.target.value })}
         className="w-full bg-surface-50 dark:bg-white/5 border border-surface-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-400 transition-all" />
        <input type="password" placeholder="Confirmar nueva contraseña" value={pwd.confirm}
         onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })}
         className="w-full bg-surface-50 dark:bg-white/5 border border-surface-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-400 transition-all" />
        {pwdMsg && <p className="text-xs text-surface-600 dark:text-surface-300">{pwdMsg}</p>}
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={changePwd} className="btn-primary text-sm !py-2.5 !px-5">Actualizar</motion.button>
       </motion.div>
      )}
     </div>
    </motion.div>
   </div>
  );
}

function Field({ icon: Icon, label, value, onChange, type = 'text', placeholder }: {
 icon: any; label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
 return (
  <div>
   <label className="text-xs font-semibold text-surface-600 dark:text-surface-300 mb-2 flex items-center gap-1.5">
    <Icon className="w-3.5 h-3.5 text-primary-500" /> {label}
   </label>
   <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
    className="w-full border border-surface-200 dark:border-surface-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100" />
  </div>
 );
}
