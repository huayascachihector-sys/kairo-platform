import { BookOpen, Calculator, FlaskConical, Languages } from "lucide-react";
// wouter removed

const courses = [
  {
    icon: Calculator,
    color: "text-blue-500",
    bg: "bg-blue-50",
    title: "Matemáticas",
    lessons: "120+ lecciones",
    description: "Desde aritmética básica hasta cálculo avanzado para ingreso universitario.",
  },
  {
    icon: FlaskConical,
    color: "text-cyan-500",
    bg: "bg-cyan-50",
    title: "Ciencias",
    lessons: "85+ lecciones",
    description: "Física, química y biología explicadas de forma práctica y visual.",
  },
  {
    icon: Languages,
    color: "text-indigo-500",
    bg: "bg-indigo-50",
    title: "Lenguaje",
    lessons: "95+ lecciones",
    description: "Comprensión lectora, gramática y redacción para exámenes de admisión.",
  },
];

export function Courses() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Explora nuestros cursos</h2>
            <p className="text-lg text-slate-600">
              Diseñados por expertos para garantizar tu éxito académico.
            </p>
          </div>
          <a 
            href="#" 
            className="inline-flex items-center justify-center rounded-full bg-white border border-slate-200 px-6 py-3 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            Ver todos los cursos
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {courses.map((course, i) => (
            <div key={i} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-lg flex flex-col">
              <div className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl ${course.bg} ${course.color}`}>
                <course.icon className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-slate-900">{course.title}</h3>
              <p className="mb-6 text-sm font-medium text-slate-500">{course.lessons}</p>
              <p className="mb-8 text-slate-600 leading-relaxed flex-grow">{course.description}</p>
              <a 
                href="#" 
                className="inline-flex items-center font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Explorar curso <BookOpen className="ml-2 h-4 w-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
