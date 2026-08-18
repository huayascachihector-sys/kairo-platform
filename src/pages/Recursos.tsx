import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, ArrowUpRight, Globe, GraduationCap,
  Calculator, Microscope, Code, Languages, FileText,
  Download, Star, ExternalLink, Search
} from 'lucide-react';

const categories = [
  { id: 'todos', label: 'Todos', icon: Globe },
  { id: 'matematicas', label: 'Matemáticas', icon: Calculator },
  { id: 'ciencias', label: 'Ciencias', icon: Microscope },
  { id: 'programacion', label: 'Programación', icon: Code },
  { id: 'idiomas', label: 'Idiomas', icon: Languages },
  { id: 'universidades', label: 'Universidades', icon: GraduationCap },
  { id: 'herramientas', label: 'Herramientas', icon: FileText },
  { id: 'becas', label: 'Becas', icon: Star },
];

interface Resource {
  title: string;
  description: string;
  url: string;
  category: string;
  type: 'Plataforma' | 'Curso' | 'Herramienta' | 'Portal' | 'Canal' | 'Beca';
  free: boolean;
  language: string;
  rating?: number;
  highlight?: boolean;
}

const resources: Resource[] = [
  // MATEMÁTICAS
  {
    title: 'Khan Academy',
    description: 'Miles de lecciones gratuitas de matemáticas con videos y ejercicios interactivos. Desde aritmética hasta cálculo multivariable.',
    url: 'https://es.khanacademy.org/math',
    category: 'matematicas',
    type: 'Plataforma',
    free: true,
    language: 'Español',
    rating: 5,
    highlight: true,
  },
  {
    title: 'Wolfram Alpha',
    description: 'Motor de conocimiento computacional. Resuelve ecuaciones, grafica funciones, calcula integrales y mucho más paso a paso.',
    url: 'https://www.wolframalpha.com/',
    category: 'matematicas',
    type: 'Herramienta',
    free: true,
    language: 'Inglés',
    rating: 5,
  },
  {
    title: 'GeoGebra',
    description: 'Software libre de geometría dinámica, álgebra y cálculo. Ideal para visualizar conceptos matemáticos de forma interactiva.',
    url: 'https://www.geogebra.org/',
    category: 'matematicas',
    type: 'Herramienta',
    free: true,
    language: 'Español',
    rating: 5,
  },
  {
    title: 'Desmos',
    description: 'Calculadora gráfica online potente y gratuita. Perfecta para explorar funciones, estadísticas y geometría.',
    url: 'https://www.desmos.com/calculator?lang=es',
    category: 'matematicas',
    type: 'Herramienta',
    free: true,
    language: 'Español',
    rating: 4,
  },
  {
    title: 'MIT OpenCourseWare - Matemáticas',
    description: 'Cursos completos de matemáticas del MIT con materiales, exámenes y soluciones. Álgebra lineal, cálculo, análisis real.',
    url: 'https://ocw.mit.edu/courses/mathematics/',
    category: 'matematicas',
    type: 'Curso',
    free: true,
    language: 'Inglés',
    rating: 5,
    highlight: true,
  },
  {
    title: 'Symbolab',
    description: 'Calculadora matemática avanzada con resolución paso a paso. Ideal para álgebra, cálculo, trigonometría y más.',
    url: 'https://es.symbolab.com/',
    category: 'matematicas',
    type: 'Herramienta',
    free: true,
    language: 'Español',
    rating: 4,
  },
  {
    title: 'Brilliant.org',
    description: 'Plataforma de aprendizaje activo con puzzles y problemas interactivos de matemáticas, ciencias y computación.',
    url: 'https://brilliant.org/',
    category: 'matematicas',
    type: 'Plataforma',
    free: false,
    language: 'Inglés',
    rating: 5,
  },
  {
    title: '3Blue1Brown (YouTube)',
    description: 'Canal de YouTube con las mejores visualizaciones de conceptos matemáticos. Álgebra lineal, cálculo, redes neuronales.',
    url: 'https://www.youtube.com/c/3blue1brown',
    category: 'matematicas',
    type: 'Canal',
    free: true,
    language: 'Inglés',
    rating: 5,
    highlight: true,
  },

  // CIENCIAS
  {
    title: 'Coursera - Física',
    description: 'Cursos de física de universidades top: mecánica clásica, electromagnetismo, física cuántica y relatividad.',
    url: 'https://www.coursera.org/browse/physical-science-and-engineering/physics-and-astronomy',
    category: 'ciencias',
    type: 'Plataforma',
    free: true,
    language: 'Español/Inglés',
    rating: 5,
  },
  {
    title: 'PhET Simulations',
    description: 'Simulaciones interactivas gratuitas de física, química, biología y ciencias de la tierra de la Universidad de Colorado.',
    url: 'https://phet.colorado.edu/es/',
    category: 'ciencias',
    type: 'Herramienta',
    free: true,
    language: 'Español',
    rating: 5,
    highlight: true,
  },
  {
    title: 'edX - Ciencias',
    description: 'Cursos de ciencias de Harvard, MIT y otras universidades de élite. Biología molecular, química orgánica, astrofísica.',
    url: 'https://www.edx.org/learn/science',
    category: 'ciencias',
    type: 'Plataforma',
    free: true,
    language: 'Español/Inglés',
    rating: 5,
  },
  {
    title: 'CK-12',
    description: 'Libros de texto gratuitos y adaptativos de ciencias con ejercicios interactivos, simulaciones y videos.',
    url: 'https://www.ck12.org/',
    category: 'ciencias',
    type: 'Plataforma',
    free: true,
    language: 'Inglés',
    rating: 4,
  },

  // PROGRAMACIÓN
  {
    title: 'freeCodeCamp',
    description: 'Plataforma gratuita para aprender desarrollo web, Python, JavaScript, ciencia de datos y más con certificaciones.',
    url: 'https://www.freecodecamp.org/espanol/',
    category: 'programacion',
    type: 'Plataforma',
    free: true,
    language: 'Español',
    rating: 5,
    highlight: true,
  },
  {
    title: 'CS50 de Harvard',
    description: 'El curso de introducción a ciencias de la computación más famoso del mundo, completamente gratuito.',
    url: 'https://cs50.harvard.edu/x/',
    category: 'programacion',
    type: 'Curso',
    free: true,
    language: 'Inglés (subtítulos ES)',
    rating: 5,
    highlight: true,
  },
  {
    title: 'Codecademy',
    description: 'Aprende Python, JavaScript, HTML/CSS, SQL y más con ejercicios interactivos en el navegador.',
    url: 'https://www.codecademy.com/',
    category: 'programacion',
    type: 'Plataforma',
    free: false,
    language: 'Inglés',
    rating: 4,
  },
  {
    title: 'The Odin Project',
    description: 'Currículo completo y gratuito de desarrollo web full-stack. Ruby, JavaScript, React, Node.js.',
    url: 'https://www.theodinproject.com/',
    category: 'programacion',
    type: 'Plataforma',
    free: true,
    language: 'Inglés',
    rating: 5,
  },
  {
    title: 'LeetCode',
    description: 'Practica problemas de programación y algoritmos. Preparación para entrevistas técnicas en empresas de tecnología.',
    url: 'https://leetcode.com/',
    category: 'programacion',
    type: 'Herramienta',
    free: true,
    language: 'Inglés',
    rating: 5,
  },

  // IDIOMAS
  {
    title: 'Duolingo',
    description: 'Aprende inglés, portugués, francés, alemán y más idiomas gratis con lecciones gamificadas y divertidas.',
    url: 'https://www.duolingo.com/',
    category: 'idiomas',
    type: 'Plataforma',
    free: true,
    language: 'Español',
    rating: 5,
  },
  {
    title: 'BBC Learning English',
    description: 'Recursos gratuitos de la BBC para mejorar tu inglés: gramática, vocabulario, pronunciación y noticias.',
    url: 'https://www.bbc.co.uk/learningenglish/',
    category: 'idiomas',
    type: 'Portal',
    free: true,
    language: 'Inglés',
    rating: 5,
    highlight: true,
  },
  {
    title: 'Deutsche Welle - Aprende Alemán',
    description: 'Cursos gratuitos de alemán desde nivel A1 hasta C1 con la calidad de la televisión pública alemana.',
    url: 'https://learngerman.dw.com/es/overview',
    category: 'idiomas',
    type: 'Plataforma',
    free: true,
    language: 'Español',
    rating: 5,
  },
  {
    title: 'Busuu',
    description: 'Aprende idiomas con hablantes nativos. Cursos estructurados con certificados oficiales McGraw-Hill.',
    url: 'https://www.busuu.com/',
    category: 'idiomas',
    type: 'Plataforma',
    free: false,
    language: 'Español',
    rating: 4,
  },

  // UNIVERSIDADES
  {
    title: 'MIT OpenCourseWare',
    description: 'Acceso gratuito a materiales de más de 2,500 cursos del MIT. Ingeniería, ciencias, humanidades y más.',
    url: 'https://ocw.mit.edu/',
    category: 'universidades',
    type: 'Portal',
    free: true,
    language: 'Inglés',
    rating: 5,
    highlight: true,
  },
  {
    title: 'Stanford Online',
    description: 'Cursos gratuitos y programas de Stanford University en inteligencia artificial, negocios, medicina y más.',
    url: 'https://online.stanford.edu/free-courses',
    category: 'universidades',
    type: 'Portal',
    free: true,
    language: 'Inglés',
    rating: 5,
  },
  {
    title: 'Yale Open Courses',
    description: 'Cursos completos de Yale University con videos de clases reales. Filosofía, historia, economía, psicología.',
    url: 'https://oyc.yale.edu/',
    category: 'universidades',
    type: 'Portal',
    free: true,
    language: 'Inglés',
    rating: 5,
  },
  {
    title: 'Harvard Online',
    description: 'Cursos gratuitos de Harvard en ciencias de la computación, salud, negocios, humanidades y ciencias de datos.',
    url: 'https://pll.harvard.edu/catalog/free',
    category: 'universidades',
    type: 'Portal',
    free: true,
    language: 'Inglés',
    rating: 5,
  },

  // HERRAMIENTAS
  {
    title: 'Notion',
    description: 'Herramienta todo-en-uno para organizar tus notas, tareas, proyectos y apuntes de clase. Gratis para estudiantes.',
    url: 'https://www.notion.so/students',
    category: 'herramientas',
    type: 'Herramienta',
    free: true,
    language: 'Español',
    rating: 5,
  },
  {
    title: 'Anki',
    description: 'Sistema de flashcards con repetición espaciada. Ideal para memorizar vocabulario, fórmulas, conceptos clave.',
    url: 'https://apps.ankiweb.net/',
    category: 'herramientas',
    type: 'Herramienta',
    free: true,
    language: 'Español',
    rating: 5,
    highlight: true,
  },
  {
    title: 'Canva',
    description: 'Diseña presentaciones, infografías, posters y material visual de forma fácil y profesional. Gratis para educación.',
    url: 'https://www.canva.com/education/',
    category: 'herramientas',
    type: 'Herramienta',
    free: true,
    language: 'Español',
    rating: 5,
  },
  {
    title: 'Overleaf',
    description: 'Editor LaTeX online colaborativo. Perfecto para escribir tesis, papers e informes técnicos con formato profesional.',
    url: 'https://www.overleaf.com/',
    category: 'herramientas',
    type: 'Herramienta',
    free: true,
    language: 'Inglés',
    rating: 4,
  },
  {
    title: 'Zotero',
    description: 'Gestor de referencias bibliográficas gratuito. Organiza tus fuentes y genera citas automáticamente en cualquier formato.',
    url: 'https://www.zotero.org/',
    category: 'herramientas',
    type: 'Herramienta',
    free: true,
    language: 'Español',
    rating: 4,
  },

  // BECAS
  {
    title: 'PRONABEC',
    description: 'Portal oficial de becas del gobierno peruano. Beca 18, Beca Generación del Bicentenario, Beca Presidente.',
    url: 'https://www.pronabec.gob.pe/',
    category: 'becas',
    type: 'Portal',
    free: true,
    language: 'Español',
    rating: 5,
    highlight: true,
  },
  {
    title: 'DAAD - Becas en Alemania',
    description: 'Servicio Alemán de Intercambio Académico. Becas completas para estudiar maestrías y doctorados en Alemania.',
    url: 'https://www.daad.de/es/',
    category: 'becas',
    type: 'Portal',
    free: true,
    language: 'Español',
    rating: 5,
    highlight: true,
  },
  {
    title: 'Chevening - Becas en Reino Unido',
    description: 'Becas completas del gobierno británico para estudiar maestrías de un año en cualquier universidad del Reino Unido.',
    url: 'https://www.chevening.org/',
    category: 'becas',
    type: 'Beca',
    free: true,
    language: 'Inglés',
    rating: 5,
  },
  {
    title: 'Fulbright Perú',
    description: 'Becas del gobierno de EEUU para estudiar maestrías y doctorados en las mejores universidades norteamericanas.',
    url: 'https://www.fulbright.pe/',
    category: 'becas',
    type: 'Beca',
    free: true,
    language: 'Español',
    rating: 5,
  },
  {
    title: 'Erasmus Mundus',
    description: 'Becas de la Unión Europea para programas de maestría en múltiples países europeos. Incluye matrícula, viáticos y seguro.',
    url: 'https://www.eacea.ec.europa.eu/scholarships/erasmus-mundus-catalogue_en',
    category: 'becas',
    type: 'Beca',
    free: true,
    language: 'Inglés',
    rating: 5,
  },
  {
    title: 'OAS Scholarships',
    description: 'Becas de la OEA para estudiar en universidades de América. Pregrado, maestría y cursos técnicos.',
    url: 'https://www.oas.org/en/scholarships/',
    category: 'becas',
    type: 'Beca',
    free: true,
    language: 'Español/Inglés',
    rating: 4,
  },
];

const typeColors: Record<string, string> = {
  Plataforma: 'bg-primary-100 text-primary-700',
  Curso: 'bg-violet-100 text-violet-700',
  Herramienta: 'bg-amber-100 text-amber-700',
  Portal: 'bg-cyan-100 text-cyan-700',
  Canal: 'bg-rose-100 text-rose-700',
  Beca: 'bg-emerald-100 text-emerald-700',
};

export default function Recursos() {
  const [activeCategory, setActiveCategory] = useState('todos');
  const [search, setSearch] = useState('');

  const filtered = resources.filter(r => {
    const matchesCat = activeCategory === 'todos' || r.category === activeCategory;
    const matchesSearch = search === '' ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 dark:from-transparent via-white dark:via-transparent to-primary-50/30 dark:to-transparent pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <a href="#" className="inline-flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mb-6 font-medium">
            <ArrowLeft className="w-4 h-4" /> Volver al inicio
          </a>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-surface-900 dark:text-white tracking-tight">
            Recursos <span className="text-gradient">Educativos</span>
          </h1>
          <p className="mt-4 text-lg text-surface-500 dark:text-surface-400 max-w-2xl mx-auto">
            Accede a las mejores plataformas, herramientas y oportunidades educativas del mundo.
            Todos verificados y seleccionados para estudiantes peruanos.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-xl mx-auto mb-8"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
            <input
              type="text"
              placeholder="Buscar recursos..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white dark:cyber-card-dark border border-surface-200 dark:border-surface-700 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/30 outline-none transition-all text-sm text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-surface-600"
            />
          </div>
        </motion.div>

        {/* Category tabs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-wrap gap-2 justify-center mb-10"
        >
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeCategory === cat.id
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                  : 'bg-white dark:cyber-card-dark text-surface-600 dark:text-surface-300 border border-surface-200 dark:border-surface-700 hover:border-primary-300 dark:hover:border-primary-600 hover:text-primary-600 dark:hover:text-primary-400'
              }`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Count */}
        <p className="text-sm text-surface-500 dark:text-surface-400 mb-6 text-center">
          <span className="font-semibold text-surface-700 dark:text-surface-200">{filtered.length}</span> recursos encontrados
        </p>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((res, i) => (
            <motion.a
              key={res.url}
              href={res.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * Math.min(i, 12) }}
              className={`group relative bg-white dark:cyber-card-dark rounded-2xl p-6 border card-hover ${
                res.highlight ? 'border-primary-200 dark:border-primary-700/50 shadow-md shadow-primary-500/5 dark:shadow-primary-900/20' : 'border-surface-100 dark:border-surface-800'
              }`}
            >
              {res.highlight && (
                <div className="absolute -top-2.5 right-4">
                  <span className="bg-gradient-to-r from-primary-600 to-accent-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                    <Star className="w-2.5 h-2.5 fill-white" /> Recomendado
                  </span>
                </div>
              )}

              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${typeColors[res.type]}`}>
                    {res.type}
                  </span>
                  {res.free ? (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                      Gratis
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400">
                      Premium
                    </span>
                  )}
                </div>
                <ExternalLink className="w-4 h-4 text-surface-300 dark:text-surface-600 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors" />
              </div>

              <h3 className="text-lg font-bold text-surface-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-2 flex items-center gap-2">
                {res.title}
                <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>

              <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed mb-4">
                {res.description}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-xs text-surface-400 dark:text-surface-500 flex items-center gap-1">
                  <Languages className="w-3 h-3" />
                  {res.language}
                </span>
                {res.rating && (
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: res.rating }).map((_, si) => (
                      <Star key={si} className="w-3 h-3 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                )}
              </div>
            </motion.a>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 bg-white dark:cyber-card-dark rounded-2xl border border-surface-100 ">
            <div className="mb-4 flex justify-center"><div className="w-16 h-16 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center"><Search className="w-8 h-8 text-surface-400" /></div></div>
            <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-2">No se encontraron recursos</h3>
            <p className="text-surface-500 dark:text-surface-400">Prueba con otra búsqueda o categoría.</p>
          </div>
        )}

        {/* External links banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-primary-600 to-accent-500 rounded-3xl p-8 md:p-12 text-white text-center"
        >
          <h2 className="text-2xl md:text-3xl font-extrabold mb-4">
            ¿Conoces un recurso que deberíamos incluir?
          </h2>
          <p className="text-primary-100 max-w-xl mx-auto mb-6">
            Estamos constantemente ampliando nuestra biblioteca de recursos.
            Si conoces una plataforma o herramienta educativa increíble, cuéntanos.
          </p>
          <a
            href="mailto:recursos@studymind.pe"
            className="inline-flex items-center gap-2 bg-white text-primary-700 font-bold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Sugerir un recurso
          </a>
        </motion.div>
      </div>
    </div>
  );
}
