import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Clock, Users, Star, BookOpen,
  Play, BarChart3, CheckCircle2, Sparkles, FunctionSquare, Grid3x3, Rocket,
  FlaskConical, Code2, Globe, Microscope
} from 'lucide-react';

const subjectIcons: Record<string, any> = {
  matematicas: FunctionSquare,
  algebra: Grid3x3,
  fisica: Rocket,
  quimica: FlaskConical,
  programacion: Code2,
  estadistica: BarChart3,
  idiomas: Globe,
  ecuaciones: Microscope,
};

const courses = [
  {
    id: 1,
    title: 'Cálculo Diferencial e Integral',
    description: 'Domina límites, derivadas e integrales con cientos de ejercicios resueltos. Desde lo básico hasta aplicaciones avanzadas.',
    instructor: 'Prof. Dr. García, TU München',
    duration: '48 horas',
    lessons: 64,
    students: 8420,
    rating: 4.9,
    reviews: 1240,
    level: 'Intermedio',
    category: 'Matemáticas',
    gradient: 'from-primary-500 to-primary-700',
    topics: ['Límites y continuidad', 'Derivadas', 'Integrales definidas', 'Aplicaciones', 'Series'],
    icon: 'matematicas',
  },
  {
    id: 2,
    title: 'Álgebra Lineal Aplicada',
    description: 'Matrices, vectores, espacios vectoriales, transformaciones lineales y aplicaciones en ingeniería y data science.',
    instructor: 'Prof. Dra. Müller, ETH Zürich',
    duration: '36 horas',
    lessons: 48,
    students: 5630,
    rating: 4.8,
    reviews: 890,
    level: 'Intermedio',
    category: 'Matemáticas',
    gradient: 'from-violet-500 to-violet-700',
    topics: ['Matrices', 'Vectores', 'Espacios vectoriales', 'Valores propios', 'Aplicaciones'],
    icon: 'algebra',
  },
  {
    id: 3,
    title: 'Física: Mecánica Clásica',
    description: 'Las leyes de Newton, energía, momento, rotación y oscilaciones con enfoque en resolución de problemas.',
    instructor: 'Prof. Laurent, Sorbonne',
    duration: '42 horas',
    lessons: 56,
    students: 6180,
    rating: 4.9,
    reviews: 1050,
    level: 'Básico - Intermedio',
    category: 'Física',
    gradient: 'from-cyan-500 to-cyan-700',
    topics: ['Cinemática', 'Dinámica', 'Energía', 'Momento', 'Rotación'],
    icon: 'fisica',
  },
  {
    id: 4,
    title: 'Química General Universitaria',
    description: 'Estructura atómica, enlaces, estequiometría, termodinámica y cinética química con laboratorios virtuales.',
    instructor: 'Prof. Dra. Santos, Oxford',
    duration: '38 horas',
    lessons: 52,
    students: 4950,
    rating: 4.7,
    reviews: 720,
    level: 'Básico',
    category: 'Química',
    gradient: 'from-emerald-500 to-emerald-700',
    topics: ['Estructura atómica', 'Enlace químico', 'Estequiometría', 'Termodinámica', 'Cinética'],
    icon: 'quimica',
  },
  {
    id: 5,
    title: 'Programación con Python',
    description: 'Desde cero hasta programación orientada a objetos. Incluye proyectos reales, data science y automatización.',
    instructor: 'Ing. Rodriguez, ex-Google',
    duration: '52 horas',
    lessons: 72,
    students: 12350,
    rating: 4.9,
    reviews: 2100,
    level: 'Básico',
    category: 'Programación',
    gradient: 'from-amber-500 to-amber-700',
    topics: ['Fundamentos', 'Estructuras de datos', 'POO', 'Librerías', 'Proyectos'],
    icon: 'programacion',
  },
  {
    id: 6,
    title: 'Estadística y Probabilidad',
    description: 'Distribuciones, inferencia estadística, regresión, pruebas de hipótesis con R y Python.',
    instructor: 'Prof. Dr. Chen, Cambridge',
    duration: '40 horas',
    lessons: 54,
    students: 5240,
    rating: 4.8,
    reviews: 860,
    level: 'Intermedio',
    category: 'Matemáticas',
    gradient: 'from-rose-500 to-rose-700',
    topics: ['Probabilidad', 'Distribuciones', 'Inferencia', 'Regresión', 'Pruebas de hipótesis'],
    icon: 'estadistica',
  },
  {
    id: 7,
    title: 'Inglés Académico B2-C1',
    description: 'Prepárate para IELTS/TOEFL. Academic writing, lectura comprensiva, listening y speaking profesional.',
    instructor: 'Prof. Williams, British Council',
    duration: '60 horas',
    lessons: 80,
    students: 9870,
    rating: 4.8,
    reviews: 1560,
    level: 'Intermedio - Avanzado',
    category: 'Idiomas',
    gradient: 'from-indigo-500 to-indigo-700',
    topics: ['Reading', 'Writing', 'Listening', 'Speaking', 'Grammar'],
    icon: 'idiomas',
  },
  {
    id: 8,
    title: 'Ecuaciones Diferenciales',
    description: 'EDOs de primer y segundo orden, sistemas, transformada de Laplace, ecuaciones en derivadas parciales y series.',
    instructor: 'Prof. Dr. Petrov, Moscow State',
    duration: '44 horas',
    lessons: 58,
    students: 3680,
    rating: 4.7,
    reviews: 540,
    level: 'Avanzado',
    category: 'Matemáticas',
    gradient: 'from-teal-500 to-teal-700',
    topics: ['EDO 1er orden', 'EDO 2do orden', 'Sistemas', 'Laplace', 'EDP'],
    icon: 'ecuaciones',
  },
];

const categoryFilters = ['Todos', 'Matemáticas', 'Física', 'Química', 'Programación', 'Idiomas'];

const cardCls = "relative bg-white dark:bg-white/5 rounded-2xl border border-surface-100 dark:border-white/10 dark:hover:border-cyan-400/50 overflow-hidden group transition-all duration-300";
const dotBg = { backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' };
const hv = { y: -4, boxShadow: '0 12px 40px rgba(99,102,241,0.15)' };

export default function Cursos() {
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [expandedCourse, setExpandedCourse] = useState<number | null>(null);

  const filtered = activeFilter === 'Todos'
    ? courses
    : courses.filter(c => c.category === activeFilter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 dark:from-transparent via-white dark:via-transparent to-accent-50/30 dark:to-transparent pt-24 pb-16">
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
            Nuestros <span className="text-gradient">Cursos</span>
          </h1>
          <p className="mt-4 text-lg text-surface-500 dark:text-surface-400 max-w-2xl mx-auto">
            Cursos diseñados por profesores de las mejores universidades del mundo,
            adaptados para el éxito de cada estudiante peruano.
          </p>
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-surface-600 dark:text-surface-400">
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-primary-500" />
              <span className="font-semibold">{courses.length}</span> cursos
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-500" />
              <span className="font-semibold">+{(courses.reduce((a, c) => a + c.students, 0) / 1000).toFixed(0)}K</span> estudiantes
            </span>
            <span className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-500" />
              <span className="font-semibold">4.8</span> promedio
            </span>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 justify-center mb-10"
        >
          {categoryFilters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeFilter === f
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                  : 'bg-white dark:bg-white/5 text-surface-600 dark:text-surface-300 border border-surface-200 dark:border-white/20 hover:border-primary-300 dark:hover:border-primary-600 hover:text-primary-600 dark:hover:text-primary-400'
              }`}
            >
              {f}
            </button>
          ))}
        </motion.div>

        {/* Course grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              whileHover={hv}
              className={cardCls}
            >
              <div className="absolute inset-0 opacity-[0.03]" style={dotBg} />
              <div className="relative">
              {/* Course header */}
                <div className={`bg-gradient-to-r ${course.gradient} p-6 text-white relative overflow-hidden`}>
                <div className="absolute top-4 right-4 opacity-15">
                  {React.createElement(subjectIcons[course.icon] || BookOpen, { className: 'w-16 h-16' })}
                </div>
                <span className="text-xs font-bold bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full">
                  {course.category}
                </span>
                <h3 className="text-xl font-extrabold mt-3 pr-12">{course.title}</h3>
                <p className="text-sm text-white/80 mt-1">{course.instructor}</p>
              </div>

              {/* Body */}
              <div className="p-6">
                <p className="text-sm text-surface-600 dark:text-surface-300 leading-relaxed mb-4">
                  {course.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-3 mb-4">
                  <div className="text-center">
                    <Clock className="w-4 h-4 text-surface-400 mx-auto mb-1" />
                    <span className="text-xs text-surface-600 dark:text-surface-300 font-medium">{course.duration}</span>
                  </div>
                  <div className="text-center">
                    <Play className="w-4 h-4 text-surface-400 mx-auto mb-1" />
                    <span className="text-xs text-surface-600 dark:text-surface-300 font-medium">{course.lessons} lecciones</span>
                  </div>
                  <div className="text-center">
                    <Users className="w-4 h-4 text-surface-400 mx-auto mb-1" />
                    <span className="text-xs text-surface-600 dark:text-surface-300 font-medium">{course.students.toLocaleString()}</span>
                  </div>
                  <div className="text-center">
                    <BarChart3 className="w-4 h-4 text-surface-400 mx-auto mb-1" />
                    <span className="text-xs text-surface-600 dark:text-surface-300 font-medium">{course.level}</span>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, si) => (
                      <Star key={si} className={`w-3.5 h-3.5 ${
                        si < Math.floor(course.rating) ? 'text-amber-400 fill-amber-400' : 'text-surface-200 dark:text-surface-700'
                      }`} />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-surface-700 dark:text-white">{course.rating}</span>
                  <span className="text-xs text-surface-400">({course.reviews.toLocaleString()} reseñas)</span>
                </div>

                {/* Topics */}
                <button
                  onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}
                  className="text-sm text-primary-600 font-medium hover:text-primary-700 transition-colors flex items-center gap-1 mb-4"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {expandedCourse === course.id ? 'Ocultar temario' : 'Ver temario'}
                </button>

                {expandedCourse === course.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mb-4 space-y-1.5"
                  >
                    {course.topics.map(topic => (
                      <div key={topic} className="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        {topic}
                      </div>
                    ))}
                  </motion.div>
                )}

                {/* CTA */}
                <button className="w-full btn-primary text-sm !py-3 flex items-center justify-center gap-2">
                  <span className="flex items-center gap-2">
                    Inscribirme Gratis
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </button>
              </div>
            </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
