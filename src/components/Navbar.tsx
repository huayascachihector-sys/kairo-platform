import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles, Calculator, Library, Newspaper, Info, ChevronDown, UserCheck, Sun, Moon, Home, BookOpen, Cpu } from 'lucide-react';
import { loadState } from '../lib/store';

const navLinks = [
  {
    label: 'Plataforma',
    href: '#beneficios',
    isAnchor: true,
    children: [
      { label: 'Beneficios', href: '#beneficios', isAnchor: true },
      { label: 'Plataforma', href: '#plataforma', isAnchor: true },
      { label: 'Testimonios', href: '#testimonios', isAnchor: true },
      { label: 'Precios', href: '#precios', isAnchor: true },
      { label: 'FAQ', href: '#faq', isAnchor: true },
    ],
  },
  { label: 'Cursos', href: '#/cursos', icon: Library },
  { label: 'Matemáticas', href: '#/matematicas', icon: Calculator },
  { label: 'Recursos', href: '#/recursos', icon: Library },
  { label: 'Blog', href: '#/blog', icon: Newspaper },
  { label: 'Robot Kipu', href: '#/robot', icon: Info },
  { label: 'Nosotros', href: '#/about', icon: Info },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    try { return localStorage.getItem('sm_darkmode') === '1'; } catch { return false; }
  });
  const [user, setUser] = useState(() => loadState().user);

  useEffect(() => {
    const handleSync = () => setUser(loadState().user);
    window.addEventListener('hashchange', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('hashchange', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileOpen]);

  const handleNavClick = () => {
    setMobileOpen(false);
    setDropdownOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'glass-dark shadow-lg shadow-cyan-500/5 border-b border-cyan-500/10'
            : 'bg-slate-950/80 backdrop-blur-xl border-b border-white/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <a href="#" onClick={handleNavClick} className="flex items-center gap-2.5 group py-1">
              <img
                src="/logo-light.png"
                alt="KAIRO - Aprende. Entiende. Crece."
                className="h-10 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </a>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-0.5">
              {navLinks.map((link) => {
                if ('children' in link && link.children) {
                  return (
                    <div
                      key={link.label}
                      className="relative"
                      onMouseEnter={() => setDropdownOpen(true)}
                      onMouseLeave={() => setDropdownOpen(false)}
                    >
                      <button className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-cyan-400 rounded-lg hover:bg-cyan-500/10 transition-all duration-300 flex items-center gap-1">
                        {link.label}
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {dropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.15 }}
                            className="absolute left-0 top-full mt-1 bg-slate-900 rounded-xl shadow-xl border border-cyan-500/20 py-2 min-w-[180px] z-50 backdrop-blur-xl"
                          >
                            {link.children.map((child) => (
                              <a
                                key={child.label}
                                href={child.href}
                                onClick={handleNavClick}
                                className="block px-4 py-2.5 text-sm text-slate-300 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"
                              >
                                {child.label}
                              </a>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={handleNavClick}
                    className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-cyan-400 rounded-lg hover:bg-cyan-500/10 transition-all duration-300"
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <button onClick={() => {
                const next = !darkMode;
                setDarkMode(next);
                try { localStorage.setItem('sm_darkmode', next ? '1' : '0'); } catch {}
              }}
              className="p-2.5 rounded-xl bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 text-surface-500 dark:text-surface-400 transition-colors"
              title="Toggle dark mode">
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              {user ? (
                <a
                  href="#/plataforma"
                  className="btn-primary text-sm !py-2.5 !px-5 flex items-center gap-2 shadow-lg shadow-primary-500/20"
                >
                  <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                    {user.avatar && user.avatar.length <= 4 ? user.avatar : user.name.charAt(0).toUpperCase()}
                  </span>
                  <span>Mi Panel ({user.name.split(' ')[0]})</span>
                </a>
              ) : (
                <>
                  <a
                    href="#/registro"
                    className="text-sm font-medium text-slate-400 hover:text-cyan-400 transition-colors px-4 py-2"
                  >
                    Iniciar Sesión
                  </a>
                  <a
                    href="#/registro"
                    className="btn-primary text-sm !py-2.5 !px-5 flex items-center gap-2"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Registrarse Gratis
                    </span>
                  </a>
                </>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-slate-950 border-l border-cyan-500/20 shadow-2xl overflow-y-auto"
            >
              <div className="p-6 pt-20">
                {/* Main page links */}
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-4">Páginas</p>
                <div className="space-y-0.5 mb-6">
                  {[
                    { label: 'Inicio', href: '#', icon: Home },
                    { label: 'Cursos', href: '#/cursos', icon: BookOpen },
                    { label: 'Matemáticas', href: '#/matematicas', icon: Calculator },
                    { label: 'Recursos', href: '#/recursos', icon: Library },
                    { label: 'Blog', href: '#/blog', icon: Newspaper },
                    { label: 'Robot Kipu', href: '#/robot', icon: Cpu },
                    { label: 'Nosotros', href: '#/about', icon: Info },
                  ].map((link, i) => (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.04 }}
                      onClick={handleNavClick}
                      className="block px-4 py-3 text-base font-medium text-slate-300 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-xl transition-all flex items-center gap-3"
                    >
                      <link.icon className="w-5 h-5 text-cyan-400" />
                      {link.label}
                    </motion.a>
                  ))}
                </div>

                {/* Section links */}
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-4">Secciones</p>
                <div className="space-y-0.5 mb-8">
                  {[
                    { label: 'Beneficios', href: '#beneficios' },
                    { label: 'Plataforma', href: '#plataforma' },
                    { label: 'Testimonios', href: '#testimonios' },
                    { label: 'Precios', href: '#precios' },
                    { label: 'FAQ', href: '#faq' },
                  ].map((link, i) => (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.04 }}
                      onClick={handleNavClick}
                      className="block px-4 py-2.5 text-sm text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-xl transition-all"
                    >
                      {link.label}
                    </motion.a>
                  ))}
                </div>

                 <div className="space-y-3">
                   <button onClick={() => {
                     const next = !darkMode;
                     setDarkMode(next);
                     try { localStorage.setItem('sm_darkmode', next ? '1' : '0'); } catch {}
                   }}
                   className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white transition-colors text-sm font-medium">
                     {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                     {darkMode ? 'Modo Claro' : 'Modo Oscuro'}
                   </button>
                   <a
                     href="#/matematicas"
                     onClick={handleNavClick}
                     className="btn-primary block text-center text-base"
                   >
                    <span className="flex items-center justify-center gap-2">
                      <Calculator className="w-5 h-5" />
                      Practicar Matemáticas
                    </span>
                  </a>
                  <a
                    href="#/registro"
                    onClick={handleNavClick}
                    className="btn-secondary block text-center text-base"
                  >
                    Iniciar Sesión
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
