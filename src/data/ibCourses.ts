export interface IbCourseDef {
  id: string;
  name: string;
  icon: string;
  color: string;
  patterns: string[];
}

export const IB_COURSES: IbCourseDef[] = [
  {
    id: 'mathematics-analysis-and-approaches',
    name: 'Mathematics: Analysis & Approaches',
    icon: '∫',
    color: 'from-blue-500 to-blue-700',
    patterns: ['analysis and approaches', 'analysis', 'mathematics-aa', '50-dp'],
  },
  {
    id: 'mathematics-applications-and-interpretation',
    name: 'Mathematics: Applications & Interpretation',
    icon: '📊',
    color: 'from-sky-500 to-sky-700',
    patterns: ['applications and interpretation', 'applications', 'mathematics-ai', '51-dp'],
  },
  {
    id: 'physics',
    name: 'Physics',
    icon: '⚡',
    color: 'from-cyan-500 to-cyan-700',
    patterns: ['physics', 'fisica', '46-dp'],
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    icon: '⚗️',
    color: 'from-emerald-500 to-emerald-700',
    patterns: ['chemistry', 'quimica', '45-dp'],
  },
  {
    id: 'biology',
    name: 'Biology',
    icon: '🧬',
    color: 'from-green-500 to-green-700',
    patterns: ['biology', 'biologia', '43-dp'],
  },
  {
    id: 'history',
    name: 'History',
    icon: '🏛️',
    color: 'from-amber-500 to-amber-700',
    patterns: ['history', 'historia', '2-dp'],
  },
  {
    id: 'geography',
    name: 'Geography',
    icon: '🌍',
    color: 'from-teal-500 to-teal-700',
    patterns: ['geography', 'geografia', '1-dp'],
  },
  {
    id: 'economics',
    name: 'Economics',
    icon: '📈',
    color: 'from-purple-500 to-purple-700',
    patterns: ['economics', 'economia', '48-dp'],
  },
  {
    id: 'business-management',
    name: 'Business Management',
    icon: '💼',
    color: 'from-indigo-500 to-indigo-700',
    patterns: ['business', 'management', '47-dp'],
  },
  {
    id: 'psychology',
    name: 'Psychology',
    icon: '🧠',
    color: 'from-pink-500 to-pink-700',
    patterns: ['psychology', 'psicologia', '6-dp'],
  },
  {
    id: 'computer-science',
    name: 'Computer Science',
    icon: '💻',
    color: 'from-slate-500 to-slate-700',
    patterns: ['computer', '54-dp'],
  },
  {
    id: 'design-technology',
    name: 'Design Technology',
    icon: '🎨',
    color: 'from-orange-500 to-orange-700',
    patterns: ['design technology', 'design', '52-dp'],
  },
  {
    id: 'digital-society',
    name: 'Digital Society',
    icon: '🌐',
    color: 'from-violet-500 to-violet-700',
    patterns: ['digital society', 'digital', '53-dp'],
  },
  {
    id: 'environmental-systems-and-societies',
    name: 'Environmental Systems & Societies',
    icon: '🌱',
    color: 'from-lime-500 to-lime-700',
    patterns: ['environmental', 'ess', '49-dp'],
  },
  {
    id: 'sports-exercise-and-health-science',
    name: 'Sports, Exercise & Health Science',
    icon: '🏃',
    color: 'from-rose-500 to-rose-700',
    patterns: ['sports', 'exercise', '5-dp'],
  },
  {
    id: 'english',
    name: 'English',
    icon: '📝',
    color: 'from-rose-500 to-rose-700',
    patterns: ['english', 'ingles'],
  },
  {
    id: 'spanish',
    name: 'Spanish',
    icon: '🇪🇸',
    color: 'from-red-500 to-red-700',
    patterns: ['spanish', 'espanol', 'español', 'castellano'],
  },
  {
    id: 'further-mathematics',
    name: 'Further Mathematics',
    icon: '∞',
    color: 'from-blue-600 to-indigo-700',
    patterns: ['further mathematics', 'further'],
  },
  {
    id: 'mathematical-studies',
    name: 'Mathematical Studies',
    icon: '📐',
    color: 'from-blue-400 to-blue-600',
    patterns: ['mathematical studies', 'studies'],
  },
  {
    id: 'others',
    name: 'Otros',
    icon: '📚',
    color: 'from-surface-500 to-surface-700',
    patterns: [],
  },
];

export function detectCourse(folderName: string): IbCourseDef {
  const lower = folderName.toLowerCase();
  for (const course of IB_COURSES) {
    for (const p of course.patterns) {
      if (lower.includes(p)) return course;
    }
  }
  return IB_COURSES[IB_COURSES.length - 1];
}

export function slugToCourseName(slug: string): string {
  const clean = slug.replace(/^\d+-dp-/, '');
  const match = IB_COURSES.find(c => clean.includes(c.id.replace(/-/g, '')));
  if (match) return match.name;
  return clean.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}
