import { BookOpen, Heart, ArrowUpRight, Home, Calculator, Library, Newspaper, Info, MapPin, Flame, Globe, Download } from 'lucide-react';

const footerLinks = {
  Plataforma: [
    { label: 'Cursos', href: '#/cursos' },
    { label: 'Matemáticas', href: '#/matematicas' },
    { label: 'Recursos', href: '#/recursos' },
    { label: 'Precios', href: '#precios' },
    { label: 'Blog', href: '#/blog' },
    { label: 'Descargar App', href: '#descargar-app', icon: Download },
  ],
  'Recursos Externos': [
    { label: 'Khan Academy', href: 'https://es.khanacademy.org/', external: true },
    { label: 'MIT OpenCourseWare', href: 'https://ocw.mit.edu/', external: true },
    { label: 'Wolfram Alpha', href: 'https://www.wolframalpha.com/', external: true },
    { label: 'GeoGebra', href: 'https://www.geogebra.org/', external: true },
    { label: 'PRONABEC', href: 'https://www.pronabec.gob.pe/', external: true },
  ],
  Empresa: [
    { label: 'Sobre Nosotros', href: '#/about' },
    { label: 'Equipo', href: '#/about' },
    { label: 'Carreras', href: '#/about', badge: 'Hiring' },
    { label: 'Contacto', href: 'mailto:hola@kairo.pe', external: true },
    { label: 'Prensa', href: '#/about' },
  ],
  'Becas y Oportunidades': [
    { label: 'PRONABEC Perú', href: 'https://www.pronabec.gob.pe/', external: true },
    { label: 'DAAD Alemania', href: 'https://www.daad.de/es/', external: true },
    { label: 'Chevening UK', href: 'https://www.chevening.org/', external: true },
    { label: 'Fulbright Perú', href: 'https://www.fulbright.pe/', external: true },
  ],
};

const socialLinks = [
  { label: 'Twitter', href: 'https://twitter.com', icon: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" /></svg> },
  { label: 'Instagram', href: 'https://instagram.com', icon: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg> },
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg> },
  { label: 'YouTube', href: 'https://youtube.com', icon: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" /><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" /></svg> },
  { label: 'TikTok', href: 'https://tiktok.com', icon: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></svg> },
];

export default function Footer() {
  return (
    <footer className="bg-surface-950 text-white relative overflow-hidden">
      {/* Top gradient border */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Quick nav */}
        <div className="py-8 border-b border-white/5">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { label: 'Inicio', href: '#', icon: Home },
              { label: 'Cursos', href: '#/cursos', icon: BookOpen },
              { label: 'Matemáticas', href: '#/matematicas', icon: Calculator },
              { label: 'Recursos', href: '#/recursos', icon: Library },
              { label: 'Blog', href: '#/blog', icon: Newspaper },
              { label: 'Descargar App', href: '#descargar-app', icon: Download },
              { label: 'Nosotros', href: '#/about', icon: Info },
            ].map(link => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-lg text-sm font-medium text-surface-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2"
              >
                <link.icon className="w-4 h-4 text-cyan-400" />
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Main Footer */}
        <div className="py-16 md:py-20 grid grid-cols-2 md:grid-cols-6 gap-8 md:gap-6">
          {/* Brand */}
          <div className="col-span-2">
            <a href="#" className="flex items-center gap-2.5 mb-5">
              <img
                src="/logo-dark.png"
                alt="KAIRO - Aprende. Entiende. Crece."
                className="h-12 w-auto object-contain"
              />
            </a>
            <p className="text-sm text-surface-400 leading-relaxed max-w-xs mb-6">
              Democratizando la educación de clase mundial para cada estudiante peruano, 
              sin importar su ubicación o recursos.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 flex items-center justify-center text-sm transition-all duration-300 hover:-translate-y-0.5"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-bold text-white mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      {...('external' in link && link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="text-sm text-surface-400 hover:text-white transition-colors flex items-center gap-1.5 group"
                    >
                      {'icon' in link && link.icon && <link.icon className="w-3.5 h-3.5 text-cyan-400" />}
                      {link.label}
                      {'badge' in link && link.badge && (
                        <span className="text-[10px] font-bold bg-primary-500/20 text-primary-300 px-1.5 py-0.5 rounded-full inline-flex items-center gap-1">
                          <Flame className="w-2.5 h-2.5" /> {link.badge}
                        </span>
                      )}
                      {'external' in link && link.external && (
                        <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-surface-500">
            © {new Date().getFullYear()} Kairo. Todos los derechos reservados. Hecho con{' '}
            <Heart className="w-3 h-3 inline text-red-400 fill-red-400" /> en <Globe className="w-3 h-3 inline text-cyan-400" /> Perú
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-surface-500 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Todos los sistemas operativos
            </span>
            <span className="text-xs text-surface-600">|</span>
            <span className="text-xs text-surface-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> Lima, Perú</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
