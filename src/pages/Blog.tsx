import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, Clock, User, Tag, Sparkles } from 'lucide-react';

const posts = [
  {
    title: 'Cómo Kairo está cerrando la brecha educativa en el Perú',
    excerpt: 'Analizamos datos de más de 25,000 estudiantes para entender el impacto real de la educación digital en comunidades rurales y urbanas del Perú.',
    category: 'Impacto',
    author: 'Equipo Kairo',
    date: '15 Ene 2026',
    readTime: '8 min',
    gradient: 'from-primary-500 to-accent-500',
    featured: true,
  },
  {
    title: '10 técnicas de estudio respaldadas por neurociencia',
    excerpt: 'La ciencia detrás del aprendizaje efectivo: repetición espaciada, interleaving, práctica de recuperación y más.',
    category: 'Estudio',
    author: 'Dra. María Torres',
    date: '10 Ene 2026',
    readTime: '6 min',
    gradient: 'from-emerald-500 to-teal-500',
    featured: false,
  },
  {
    title: 'Guía completa de becas internacionales para peruanos 2026',
    excerpt: 'Todo lo que necesitas saber para aplicar a Chevening, DAAD, Fulbright, Erasmus Mundus y más.',
    category: 'Becas',
    author: 'Carlos Mendoza',
    date: '5 Ene 2026',
    readTime: '12 min',
    gradient: 'from-amber-500 to-orange-500',
    featured: false,
  },
  {
    title: 'Inteligencia Artificial en la educación: presente y futuro',
    excerpt: 'Cómo la IA personalizada está revolucionando la forma en que aprendemos y qué esperar en los próximos años.',
    category: 'Tecnología',
    author: 'Ing. Roberto Flores',
    date: '28 Dic 2025',
    readTime: '7 min',
    gradient: 'from-violet-500 to-purple-500',
    featured: false,
  },
  {
    title: 'De Cusco a Oxford: la historia de Carlos Quispe',
    excerpt: 'Un estudiante de zona rural que usó Kairo para prepararse y obtener una beca completa en una de las mejores universidades del mundo.',
    category: 'Historias',
    author: 'Ana García',
    date: '20 Dic 2025',
    readTime: '5 min',
    gradient: 'from-rose-500 to-pink-500',
    featured: false,
  },
  {
    title: 'Las 5 carreras más demandadas del 2026 en Perú y el mundo',
    excerpt: 'Análisis del mercado laboral actual y las habilidades que necesitarás para destacar profesionalmente.',
    category: 'Carrera',
    author: 'Equipo Kairo',
    date: '15 Dic 2025',
    readTime: '9 min',
    gradient: 'from-cyan-500 to-blue-500',
    featured: false,
  },
];

export default function Blog() {
  const featured = posts.find(p => p.featured);
  const regular = posts.filter(p => !p.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-white to-primary-50/20 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <a href="#" className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 mb-6 font-medium">
            <ArrowLeft className="w-4 h-4" /> Volver al inicio
          </a>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-surface-900 tracking-tight">
            Blog <span className="text-gradient">Kairo</span>
          </h1>
          <p className="mt-4 text-lg text-surface-500 max-w-2xl mx-auto">
            Artículos, guías y recursos para potenciar tu aprendizaje y abrir nuevas oportunidades.
          </p>
        </motion.div>

        {/* Featured post */}
        {featured && (
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12 group cursor-pointer"
          >
            <div className={`bg-gradient-to-r ${featured.gradient} rounded-3xl p-8 md:p-12 text-white relative overflow-hidden`}>
              <div className="absolute inset-0 bg-black/10" />
              <div className="relative">
                <span className="text-xs font-bold bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  <Sparkles className="w-3 h-3 inline" /> Artículo Destacado
                </span>
                <h2 className="text-2xl md:text-4xl font-extrabold mt-4 max-w-2xl leading-tight group-hover:underline decoration-2 underline-offset-4">
                  {featured.title}
                </h2>
                <p className="text-white/80 mt-3 max-w-xl text-base md:text-lg leading-relaxed">
                  {featured.excerpt}
                </p>
                <div className="flex items-center gap-4 mt-6 text-sm text-white/70">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> {featured.author}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> {featured.readTime}
                  </span>
                  <span>{featured.date}</span>
                </div>
              </div>
            </div>
          </motion.article>
        )}

        {/* Post grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regular.map((post, i) => (
            <motion.article
              key={post.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="bg-white rounded-2xl border border-surface-100 overflow-hidden card-hover group cursor-pointer"
            >
              <div className={`h-2 bg-gradient-to-r ${post.gradient}`} />
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Tag className="w-3 h-3" /> {post.category}
                  </span>
                  <span className="text-xs text-surface-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {post.readTime}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-surface-900 leading-snug group-hover:text-primary-600 transition-colors mb-2 flex items-start gap-1">
                  {post.title}
                  <ArrowUpRight className="w-4 h-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
                </h3>
                <p className="text-sm text-surface-500 leading-relaxed mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-2 text-xs text-surface-400 pt-4 border-t border-surface-100">
                  <User className="w-3 h-3" />
                  <span>{post.author}</span>
                  <span className="text-surface-200">·</span>
                  <span>{post.date}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
