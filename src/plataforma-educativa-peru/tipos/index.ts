export type NivelEducativo = 'Primaria' | 'Secundaria' | 'Bachillerato';

export interface CursoBase {
  id: string;
  nombre: string;
  descripcion: string;
  nivelEducativo: NivelEducativo;
  competencias: string[];
  duracionEstimada: string;
  modulos: ModuloCurso[];
  metodologia: MetodologiaNeuroeducativa;
}

export interface ModuloCurso {
  id: string;
  titulo: string;
  orden: number;
  lecciones: LeccionMicro[];
  evaluacionFinal: QuizActiveRecall[];
  spacedReviewSchedule: string[];
}

export interface LeccionMicro {
  id: string;
  titulo: string;
  explicacionFeynman: ExplicacionFeynman;
  conceptoTecnico: ConceptoTecnico;
  retoPractico: RetoPractico;
  quizActiveRecall: QuizActiveRecall[];
  palabrasClave: string[];
  duracionAproximada: number;
}

export interface ExplicacionFeynman {
  intuicionInicial: string;
  analogiaSimple: string;
  pasoAPasoIntuitivo: string[];
}

export interface ConceptoTecnico {
  definicionFormal: string;
  formulaMatematica?: string;
  ejemplos: string[];
  erroresComunes: string[];
  conexionAplicaciones: string[];
}

export interface RetoPractico {
  tipo: 'problema_resuelto' | 'ejercicio_contextualizado' | 'simulacion';
  enunciado: string;
  pistas: string[];
  solucionPasoAPaso: SolucionPaso[];
  verificacionActiveRecall: string;
}

export interface SolucionPaso {
  paso: number;
  descripcion: string;
  formulaUsada?: string;
  resultadoParcial?: string;
  errorComun?: string;
}

export interface QuizActiveRecall {
  pregunta: string;
  opciones?: string[];
  respuestaCorrecta: string;
  explicacion: string;
  tipoMemoria: 'factual' | 'procedural' | 'conceptual';
}

export interface MetodologiaNeuroeducativa {
  metodoFeynman: boolean;
  activeRecall: boolean;
  spacedRepetition: boolean;
  intuicionAntesFormula: boolean;
  estrategiasTransversales: string[];
}

export interface IAOrchestratorConfig {
  apiKey: string;
  model: string;
  temperatura: number;
}

export const METODOLOGIA_BASE: MetodologiaNeuroeducativa = {
  metodoFeynman: true,
  activeRecall: true,
  spacedRepetition: true,
  intuicionAntesFormula: true,
  estrategiasTransversales: [
    'Método de explicación ultra-simplificada (Feynman)',
    'Autoevaluación sin apoyo externo (Active Recall)',
    'Revisiones cortas y frecuentes',
    'Visualización de procesos antes de abstracciones',
    'Storytelling narrativo-causal en historia',
    'Vínculos emocionales con la información',
  ],
};