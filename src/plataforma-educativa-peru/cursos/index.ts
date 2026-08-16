import { CursoBase } from '../tipos';

import { MatematicasCurso } from './matematicas/index.ts';
import { FisicaCurso } from './fisica/index.ts';
import { QuimicaCurso } from './quimica/index.ts';
import { HistoriaCurso } from './historia/index.ts';
import { ComunicacionCurso } from './comunicacion/index.ts';
import { InglesCurso } from './ingles/index.ts';
import { BiologiaCurso } from './biologia/index.ts';
import { ComputacionCurso } from './computacion/index.ts';

export { MatematicasCurso, FisicaCurso, QuimicaCurso, HistoriaCurso, ComunicacionCurso, InglesCurso, BiologiaCurso, ComputacionCurso };

export const cursosDisponibles: Record<string, CursoBase> = {
  matematicas: MatematicasCurso,
  fisica: FisicaCurso,
  quimica: QuimicaCurso,
  historia: HistoriaCurso,
  comunicacion: ComunicacionCurso,
  ingles: InglesCurso,
  biologia: BiologiaCurso,
  computacion: ComputacionCurso,
};