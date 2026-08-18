import { useState } from 'react';
import { cursosDisponibles, METODOLOGIA_BASE } from '@/plataforma-educativa-peru';
import { CursoBase } from '@/plataforma-educativa-peru/tipos';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Brain, Clock, Target, ChevronLeft, ChevronRight } from 'lucide-react';

interface LeccionDetalleProps {
  curso: CursoBase;
}

function LeccionDetalle({ curso }: LeccionDetalleProps) {
  const [moduloActual, setModuloActual] = useState(0);
  const [leccionActual, setLeccionActual] = useState(0);

  const modulo = curso.modulos[moduloActual];
  const leccion = modulo?.lecciones[leccionActual];

  if (!modulo || !leccion) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{modulo.titulo}</h2>
        <p className="text-gray-600">{modulo.spacedReviewSchedule.join(', ')}</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            {leccion.titulo}
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline">{leccion.duracionAproximada} min</Badge>
            <Badge variant="secondary">{leccion.palabrasClave.length} vocabulario</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">Intuición (Método Feynman)</h3>
            <p className="text-gray-700">{leccion.explicacionFeynman.intuicionInicial}</p>
            <p className="text-sm text-gray-500 mt-2">Analogía: {leccion.explicacionFeynman.analogiaSimple}</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Concepto Técnico</h3>
            <p className="text-gray-700">{leccion.conceptoTecnico.definicionFormal}</p>
            {leccion.conceptoTecnico.formulaMatematica && (
              <div className="bg-gray-100 p-3 rounded mt-2 font-mono">
                {leccion.conceptoTecnico.formulaMatematica}
              </div>
            )}
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Reto Práctico</h3>
            <p className="text-gray-700 mb-2">{leccion.retoPractico.enunciado}</p>
            <div className="space-y-2">
              <p className="text-sm"><strong>Pistas:</strong> {leccion.retoPractico.pistas.join(', ')}</p>
              {leccion.retoPractico.solucionPasoAPaso.map(paso => (
                <div key={paso.paso} className="bg-blue-50 p-3 rounded">
                  <span className="font-bold">Paso {paso.paso}:</span> {paso.descripcion}
                  {paso.resultadoParcial && <span className="text-blue-600"> → {paso.resultadoParcial}</span>}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Quiz Active Recall</h3>
            {leccion.quizActiveRecall.map((q, i) => (
              <QuizPregunta key={i} q={q} />
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => {
            if (leccionActual > 0) {
              setLeccionActual(leccionActual - 1);
            } else if (moduloActual > 0) {
              setModuloActual(moduloActual - 1);
              setLeccionActual(0);
            }
          }}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Anterior
        </Button>
        <Button
          onClick={() => {
            if (leccionActual < modulo.lecciones.length - 1) {
              setLeccionActual(leccionActual + 1);
            } else if (moduloActual < curso.modulos.length - 1) {
              setModuloActual(moduloActual + 1);
              setLeccionActual(0);
            }
          }}
        >
          Siguiente
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

function QuizPregunta({ q }: { q: { pregunta: string; opciones?: string[]; respuestaCorrecta: string; explicacion: string } }) {
  const [selected, setSelected] = useState<string | null>(null);
  const answered = selected !== null;
  const isCorrect = selected === q.respuestaCorrecta;

  return (
    <Card className="mt-3">
      <CardContent className="pt-4">
        <p className="font-medium mb-2">{q.pregunta}</p>
        {q.opciones && (
          <div className="space-y-1 mb-2">
            {q.opciones.map((opt) => {
              const isThis = selected === opt;
              const isAnswer = opt === q.respuestaCorrecta;
              const cls = !answered
                ? 'border-gray-300 hover:border-blue-500 hover:bg-blue-50 cursor-pointer'
                : isAnswer
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                  : isThis
                    ? 'border-red-500 bg-red-50 text-red-800'
                    : 'border-gray-200 text-gray-400';
              return (
                <Button
                  key={opt}
                  variant="outline"
                  size="sm"
                  disabled={answered}
                  onClick={() => setSelected(opt)}
                  className={`block w-full text-left ${cls}`}
                >
                  {opt}
                </Button>
              );
            })}
          </div>
        )}
        <details className="text-sm text-gray-600">
          <summary className="cursor-pointer">
            {answered
              ? isCorrect
                ? 'Respuesta correcta, ¡bien hecho!'
                : `Incorrecto. La respuesta correcta es: ${q.respuestaCorrecta}`
              : 'Ver respuesta y explicación'}
          </summary>
          <p className="mt-2">{q.explicacion}</p>
        </details>
      </CardContent>
    </Card>
  );
}

export default function NeuroPlatform() {
  const [cursoSeleccionado, setCursoSeleccionado] = useState<CursoBase | null>(null);

  if (cursoSeleccionado) {
    return (
      <div className="container mx-auto p-6">
        <Button
          variant="ghost"
          onClick={() => setCursoSeleccionado(null)}
          className="mb-4"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Volver a cursos
        </Button>
        <LeccionDetalle curso={cursoSeleccionado} />
    </div>
  );
}
  return (
    <div className="container mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Plataforma Educativa Neuro-Educativa</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Aprendizaje basado en neurociencia aplicada: Método Feynman, Active Recall
          y Repetición Espaciada para estudiantes peruanos.
        </p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6 flex items-center gap-4">
        <Brain className="w-6 h-6 text-blue-600" />
        <div>
          <p className="font-semibold">Metodología Base Aplicada</p>
          <p className="text-sm text-gray-600">
            {METODOLOGIA_BASE.estrategiasTransversales.join(' • ')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.values(cursosDisponibles).map((curso) => (
          <Card
            key={curso.id}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setCursoSeleccionado(curso)}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                {curso.nombre}
              </CardTitle>
              <Badge variant="secondary">{curso.nivelEducativo}</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">{curso.descripcion.substring(0, 100)}...</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {curso.duracionEstimada}
                </span>
                <span className="flex items-center gap-1">
                  <Target className="w-4 h-4" /> {curso.modulos.length} módulos
                </span>
              </div>
              <div className="mt-3">
                <p className="text-xs font-medium mb-1">Competencias:</p>
                <div className="flex flex-wrap gap-1">
                  {curso.competencias.slice(0, 3).map((c, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {c.substring(0, 20)}...
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
