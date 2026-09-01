import { Zap, Gem, Bell, Sparkles } from "lucide-react";

interface RevisionDojoTopBarProps {
  onNavigate: (view: string) => void;
  userName?: string;
  xp?: number;
  gems?: number;
  streak?: number;
  avatar?: string;
}

export function RevisionDojoTopBar({
  onNavigate,
  userName = "Estudiante",
  xp = 0,
  gems = 0,
  streak = 0,
  avatar,
}: RevisionDojoTopBarProps) {
  return (
    <div className="bg-[#0F0F11] border-b border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between text-sm">
      {/* Left: Logo + Search */}
      <div className="flex items-center gap-4">
        <div 
          onClick={() => onNavigate("dashboard")}
          className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition"
        >
          <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm">
            <span className="font-black text-[#0F0F11] text-lg tracking-tighter">K</span>
          </div>
          <div>
            <span className="font-bold text-white text-lg tracking-tight">KAIRO</span>
          </div>
        </div>

        <div className="hidden md:block w-72">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar lecciones, preguntas o temas..."
              className="w-full bg-white/5 text-white placeholder:text-white/40 text-xs sm:text-sm border border-white/10 rounded-2xl px-4 py-2 pl-10 focus:outline-none focus:border-white/30 transition"
            />
            <div className="absolute left-4 top-2.5 text-white/40">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Center: Free access badge */}
      <div className="hidden lg:flex items-center gap-2">
        <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-3.5 py-1.5 rounded-2xl text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Acceso Total Gratuito</span>
        </div>
      </div>

      {/* Right: Stats + Avatar */}
      <div className="flex items-center gap-2">
        {/* Streak */}
        <button 
          onClick={() => onNavigate("logros")}
          title="Tu racha de días"
          className="flex items-center gap-1.5 px-3 py-1 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-orange-400 transition"
        >
          <span className="text-base sm:text-lg">🔥</span>
          <span className="font-bold text-xs sm:text-sm text-white">{streak}</span>
        </button>

        {/* XP */}
        <button 
          onClick={() => onNavigate("logros")}
          title="Tus puntos de experiencia"
          className="flex items-center gap-1.5 px-3 py-1 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-violet-400 transition"
        >
          <Zap className="w-4 h-4" />
          <span className="font-bold text-xs sm:text-sm text-white">{xp}</span>
          <span className="text-[10px] text-white/40">XP</span>
        </button>

        {/* Gems */}
        <button 
          onClick={() => onNavigate("tienda")}
          title="Gemas ganadas al estudiar"
          className="flex items-center gap-1.5 px-3 py-1 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-cyan-400 transition"
        >
          <Gem className="w-4 h-4" />
          <span className="font-bold text-xs sm:text-sm text-white">{gems}</span>
        </button>

        {/* Notifications */}
        <button 
          onClick={() => onNavigate("notif")}
          title="Notificaciones"
          className="p-2 rounded-2xl hover:bg-white/10 text-white/70 hover:text-white transition relative"
        >
          <Bell className="w-4 h-4" />
        </button>

        {/* Avatar */}
        <button 
          onClick={() => onNavigate("perfil")}
          className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-2xl hover:bg-white/10 transition"
        >
          <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold overflow-hidden ring-1 ring-white/20">
            {avatar ? (
              <img src={avatar} className="object-cover w-full h-full" alt="avatar" />
            ) : (
              userName ? userName[0].toUpperCase() : "E"
            )}
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-semibold text-white leading-none">{(userName || "Estudiante").split(" ")[0]}</div>
          </div>
        </button>
      </div>
    </div>
  );
}
