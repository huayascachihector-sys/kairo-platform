import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Star, ExternalLink, GraduationCap, DollarSign, Globe, Filter, BookOpen, Sparkles } from 'lucide-react';

interface Scholarship {
  id: string;
  title: string;
  organization: string;
  country: string;
  amount: string;
  level: 'Pregrado' | 'Maestría' | 'Doctorado' | 'Todos';
  deadline: string;
  description: string;
  requirements: string[];
  url: string;
  highlight: boolean;
}

const scholarships: Scholarship[] = [
  {
    id: 'pronabec',
    title: 'Beca 18 — Pronabec',
    organization: 'Gobierno del Perú',
    country: 'Perú',
    amount: 'Cobertura total',
    level: 'Pregrado',
    deadline: 'Variables según convocatoria',
    description: 'Beca integral para estudiantes de escasos recursos económicos que deseen estudiar en universidades públicas del Perú.',
    requirements: ['Egresado de secundaria', 'DNI vigente', 'Ingreso económico menor al puntaje de referencia', 'Rendir examen de admisión', 'No tener otra beca vigente'],
    url: 'https://www.pronabec.gob.pe/',
    highlight: true,
  },
  {
    id: 'daad',
    title: 'DAAD Scholarships',
    organization: 'DAAD (Alemania)',
    country: 'Alemania',
    amount: 'Beca completa (matrícula + manutención)',
    level: 'Maestría',
    deadline: 'Octubre (convocatoria anual)',
    description: 'Becas completas del Servicio Alemán de Intercambio Académico para estudios de maestría en universidades alemanas.',
    requirements: ['Título universitario', 'Dominio de alemán o inglés', 'Experiencia profesional', 'Carta de motivación'],
    url: 'https://www.daad.de/es/',
    highlight: true,
  },
  {
    id: 'fulbright',
    title: 'Fulbright Perú',
    organization: 'Gobierno de EE.UU.',
    country: 'Estados Unidos',
    amount: 'Beca completa',
    level: 'Maestría',
    deadline: 'Febrero anual',
    description: 'Becas del gobierno de Estados Unidos para que peruanos estudien maestrías en las mejores universidades norteamericanas.',
    requirements: ['Título de bachiller', 'Examen TOEFL o IELTS', 'Cartas de recomendación', 'Ensayo personal', 'Promedio académico'],
    url: 'https://www.fulbright.pe/',
    highlight: true,
  },
  {
    id: 'chevening',
    title: 'Chevening Scholarships',
    organization: 'Gobierno del Reino Unido',
    country: 'Reino Unido',
    amount: 'Beca completa',
    level: 'Maestría',
    deadline: 'Noviembre',
    description: 'Becas del gobierno británico para maestrías de un año en cualquier universidad del Reino Unido.',
    requirements: ['Título universitario', '2 años de experiencia laboral', 'IELTS 6.5+', 'Carta de motivación'],
    url: 'https://www.chevening.org/',
    highlight: false,
  },
  {
    id: 'erasmus',
    title: 'Erasmus Mundus',
    organization: 'Unión Europea',
    country: 'Europa',
    amount: 'Beca completa (matrícula + viáticos + seguro)',
    level: 'Maestría',
    deadline: 'Enero (convocatoria anual)',
    description: 'Becas de la UE para programas de maestría internacionales en múltiples países europeos.',
    requirements: ['Título universitario', 'Dominio de inglés (B2+)', 'Carta de motivación', 'No residir en UE'],
    url: 'https://www.eacea.ec.europa.eu/scholarships/erasmus-mundus-catalogue_en',
    highlight: true,
  },
  {
    id: 'oas',
    title: 'Becas OAS',
    organization: 'Organización de Estados Americanos',
    country: 'América',
    amount: 'Variables según programa',
    level: 'Todos',
    deadline: 'Variable',
    description: 'Becas de la OEA para estudiar en universidades miembros. Incluyen pregrado, maestría y cursos técnicos.',
    requirements: ['Ciudadanía de país miembro', 'Título académico según nivel', 'Dominio de idiomas', 'Cartas de recomendación'],
    url: 'https://www.oas.org/en/scholarships/',
    highlight: false,
  },
  {
    id: 'beca18',
    title: 'Beca Bicentenario',
    organization: 'Minedu Perú',
    country: 'Perú',
    amount: 'Cobertura total + asignación',
    level: 'Pregrado',
    deadline: 'Marzo - abril',
    description: 'Beca del Ministerio de Educación del Perú para estudiantes con alto rendimiento académico y escasos recursos.',
    requirements: ['Egresado de secundaria pública', 'Promio de 14+ en ICFES', 'Ingreso a universidad pública', 'No ser becario vigente'],
    url: 'https://www.sabe.unmsm.edu.pe/',
    highlight: true,
  },
  {
    id: 'bancolombia',
    title: 'Becas Bancolombia - Alianza Educativa',
    organization: 'Bancolombia / Fundación',
    country: 'Colombia',
    amount: 'Hasta 75% de matrícula',
    level: 'Pregrado',
    deadline: 'Marzo - junio',
    description: 'Becas parciales para estudiantes de bajos recursos que deseen estudiar en universidades colombianas aliadas.',
    requirements: ['Bachiller egresado de colegio público', 'Ingreso familiar menor a cierto umbral', 'Examen de admisión', 'Entrevista'],
    url: 'https://www.bancolombia.com/',
    highlight: false,
  },
];

const levelFilters = ['Todos', 'Pregrado', 'Maestría', 'Doctorado'];

const cardCls = "relative bg-white dark:bg-white/5 rounded-2xl border border-surface-100 dark:border-white/10 overflow-hidden group transition-all duration-300";
const dotBg = { backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' };
const hv = { y: -4, boxShadow: '0 12px 40px rgba(99,102,241,0.15)' };

export default function Becas() {
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('Todos');

  const filtered = scholarships.filter((s) => {
    const matchesSearch = search === '' ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.organization.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = levelFilter === 'Todos' || s.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-surface-900 flex items-center gap-2">
          <GraduationCap className="w-7 h-7 text-primary-600" /> Becas y Financiamiento
        </h1>
        <p className="text-surface-500 text-sm mt-1">
          Encuentra becas para universidades en Perú y el exterior. Todas verificadas y actualizadas.
        </p>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
          <input
            type="text"
            placeholder="Buscar beca por nombre, universidad o país..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-surface-200 bg-surface-50 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none text-sm"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {levelFilters.map((f) => (
            <button key={f} onClick={() => setLevelFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                levelFilter === f ? 'bg-primary-600 text-white' : 'bg-white dark:bg-white/5 text-surface-600 dark:text-surface-300 border border-surface-200 dark:border-white/20 hover:border-primary-300 dark:hover:border-primary-600'
              }`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <p className="text-sm text-surface-500">
        <span className="font-semibold text-surface-700">{filtered.length}</span> becas encontradas
      </p>

      <div className="grid md:grid-cols-2 gap-5">
        {filtered.map((sch, i) => (
          <motion.a
            key={sch.id}
            href={sch.url}
            target="_blank"
            rel="noopener noreferrer"
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.06 }}
             whileHover={hv}
             className={cardCls}>
             {sch.highlight && (
               <>
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-accent-400" />
                <div className="absolute -top-2.5 right-4">
                   <span className="bg-gradient-to-r from-primary-600 to-accent-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                     <Star className="w-2.5 h-2.5 fill-white" /> Recomendada
                   </span>
                </div>
               </>
             )}
             <div className="absolute inset-0 opacity-[0.03]" style={dotBg} />
             <div className="relative">

            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-primary-100 text-primary-700">
                  {sch.level}
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                  <DollarSign className="w-3 h-3 inline" /> {sch.amount === 'Cobertura total' ? 'Beca completa' : sch.amount}
                </span>
              </div>
              <ExternalLink className="w-4 h-4 text-surface-300 group-hover:text-primary-500 transition-colors" />
            </div>

            <h3 className="text-base font-bold text-surface-900 dark:text-white mb-1">{sch.title}</h3>
            <p className="text-xs text-surface-500 mb-2">{sch.organization} · {sch.country} · {sch.deadline}</p>
            <p className="text-sm text-surface-600 leading-relaxed mb-4">{sch.description}</p>

            <div className="space-y-1">
              {sch.requirements.map((r) => (
                <div key={r} className="flex items-center gap-2 text-xs text-surface-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-400" /> {r}
                </div>
              ))}
            </div>
           </div>
           </motion.a>
         ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="mb-4 flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-surface-100 dark:bg-white/5 flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-surface-400" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-2">No se encontraron becas</h3>
          <p className="text-surface-500">Prueba con otro filtro o búsqueda.</p>
        </div>
      )}

      {/* CTA */}
       <div className="relative bg-gradient-to-r from-primary-600 to-accent-500 rounded-3xl p-8 md:p-12 text-white text-center overflow-hidden">
         <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
         <div className="relative">
          <h2 className="text-2xl font-extrabold mb-3">¿Necesitas ayuda con tu postulación?</h2>
          <p className="text-primary-100 max-w-lg mx-auto mb-6">
            KAIRO te prepara para escribir ensayos de admisión, practicar entrevistas y cumplir con los requisitos de cada beca.
          </p>
          <a href="#/plataforma" className="inline-flex items-center gap-2 bg-white text-primary-700 font-bold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors">
            <BookOpen className="w-4 h-4" /> Ir al Plan de Estudio
          </a>
         </div>
       </div>
    </div>
  );
}