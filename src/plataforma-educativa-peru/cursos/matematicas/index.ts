import { CursoBase, QuizActiveRecall } from '../../tipos';

function leccion(
  id: string,
  titulo: string,
  duracion: number,
  intuicion: string,
  analogia: string,
  pasos: string[],
  definicion: string,
  formula: string | undefined,
  ejemplos: string[],
  errores: string[],
  aplicaciones: string[],
  retoEnunciado: string,
  retoTipo: 'problema_resuelto' | 'ejercicio_contextualizado' | 'simulacion',
  retoPistas: string[],
  retoSolucion: { paso: number; descripcion: string; formulaUsada?: string; resultadoParcial?: string }[],
  retoVerificacion: string,
  palabrasClave: string[],
  quiz: QuizActiveRecall[]
) {
  return {
    id,
    titulo,
    duracionAproximada: duracion,
    explicacionFeynman: {
      intuicionInicial: intuicion,
      analogiaSimple: analogia,
      pasoAPasoIntuitivo: pasos,
    },
    conceptoTecnico: {
      definicionFormal: definicion,
      formulaMatematica: formula,
      ejemplos,
      erroresComunes: errores,
      conexionAplicaciones: aplicaciones,
    },
    retoPractico: {
      tipo: retoTipo,
      enunciado: retoEnunciado,
      pistas: retoPistas,
      solucionPasoAPaso: retoSolucion,
      verificacionActiveRecall: retoVerificacion,
    },
    palabrasClave,
    quizActiveRecall: quiz,
  };
}

export const MatematicasCurso: CursoBase = {
  id: 'matematicas-neuro',
  nombre: 'Matemáticas Visual: Álgebra, Geometría y Cálculo Intuitivo',
  descripcion: 'Curso de Matemáticas desde álgebra hasta cálculo diferencial, priorizando intuición y visualización antes de la abstracción formal.',
  nivelEducativo: 'Secundaria',
  competencias: [
    'Resolver ecuaciones lineales y cuadráticas con intución',
    'Visualizar relaciones geométricas y aplicar teoremas',
    'Comprender el concepto de límite y derivada de forma intuitiva',
    'Aplicar matemática a problemas cotidianos y científicos',
    'Desarrollar razonamiento lógico-matemático',
  ],
  duracionEstimada: '15 meses',
  metodologia: {
    metodoFeynman: true,
    activeRecall: true,
    spacedRepetition: true,
    intuicionAntesFormula: true,
    estrategiasTransversales: [
      'Visualizar problemas con diagramas y analogías',
      'Predecir resultados antes de calcular',
      'Verificar respuestas con métodos alternativos',
      'Conectar con aplicaciones reales',
      'Autoevaluar con preguntas de retorno activo',
    ],
  },
  modulos: [
    {
      id: 'algebra',
      titulo: 'Álgebra: El Lenguaje de los Patrones',
      orden: 1,
      spacedReviewSchedule: ['día 1', 'día 3', 'día 7', 'día 21'],
      lecciones: [
        leccion(
          'ecuaciones-lineales',
          'Ecuaciones Lineales: La Balanza Perfecta',
          25,
          'Una ecuación es como una balanza: ambos lados deben pesar lo mismo. Si quitas un peso de un lado, debes quitarlo del otro.',
          'Imagina una balanza de mercado: si 2 manzanas + 3 naranjas pesan lo mismo que 1 manzana + 8 naranjas, puedes deducir el peso individual.',
          [
            'La ecuación ax + b = c busca el valor de x',
            'Lo que haces a un lado, debes hacerlo al otro',
            'Usa operaciones inversas: suma↔resta, multiplica↔divide',
            'Verifica la solución reemplazando en la ecuación original'
          ],
          'Una ecuación lineal es una igualdad con una variable de grado 1. La solución es el valor que satisface la igualdad.',
          'x = (c - b) / a',
          [
            '2x + 5 = 13 → x = 4 (verifica: 2(4)+5 = 13)',
            '3x - 7 = 2x + 5 → x = 12',
            '-4x + 8 = 0 → x = 2'
          ],
          [
            'Olvidar cambiar el signo al mover términos',
            'No aplicar la misma operación a ambos lados',
            'Errores con signos negativos en la división'
          ],
          [
            'Cálculo de precios con descuentos',
            'Distribución de inversiones',
            'Velocidad y tiempo en viajes'
          ],
          'Un taxi cobra S/10 de bandera y S/2 por km. Si pagaste S/32, ¿cuántos km viajaste?',
          'ejercicio_contextualizado',
          ['Plantea: 10 + 2x = 32', 'Resta 10: 2x = 22', 'Divide: x = 11'],
          [
            { paso: 1, descripcion: 'Planteo: 10 + 2x = 32', formulaUsada: 'Ecuación lineal' },
            { paso: 2, descripcion: 'Resta 10 a ambos lados: 2x = 22', resultadoParcial: 'Aísla el término con x' },
            { paso: 3, descripcion: 'Divide entre 2: x = 11', resultadoParcial: '11 km recorriste' }
          ],
          '¿Cómo verificas que x = 11 es correcto?',
          ['ecuación lineal', 'variable', 'operaciones inversas', 'verificación', 'problema'],
          [
            { pregunta: '¿Qué significa resolver una ecuación?', respuestaCorrecta: 'Encontrar el valor de la variable que satisface la igualdad', explicacion: 'La solución hace que ambos lados sean iguales.', tipoMemoria: 'conceptual' },
            { pregunta: 'Resuelve: 5x + 3 = 2x + 18', respuestaCorrecta: 'x = 5', explicacion: '5x - 2x = 18 - 3 → 3x = 15 → x = 5', tipoMemoria: 'procedural' },
            { pregunta: '¿Qué operación haces para despejar x en 3x = 15?', respuestaCorrecta: 'Divides entre 3', explicacion: 'La operación inversa de multiplicar es dividir.', tipoMemoria: 'factual' },
          ]
        ),
        leccion(
          'ecuaciones-cuadraticas',
          'Ecuaciones Cuadráticas: El Salto Parabólico',
          32,
          'Una ecuación cuadrática describe el salto de un balón: sube, llega a la cima y baja siguiendo una "U" (parábola).',
          'Imagina lanzar una pelota: su altura sigue una parábola. La altura máxima es el vértice, y toca el suelo en las raíces.',
          [
            'Forma general: ax² + bx + c = 0',
            'Las raíces son donde la parábola cruza el eje X',
            'Tres métodos: factorización, fórmula cuadrática, completando cuadrado',
            'El discriminante (b² - 4ac) dice cuántas soluciones hay'
          ],
          'Una ecuación cuadrática es una ecuación de grado 2. Sus soluciones (raíces) pueden ser 0, 1 o 2 valores reales.',
          'x = (-b ± √(b² - 4ac)) / (2a)',
          [
            'x² - 5x + 6 = 0 → (x-2)(x-3) = 0 → x = 2, 3',
            'x² - 4 = 0 → x = ±2',
            '2x² + 4x + 2 = 0 → x² + 2x + 1 = 0 → (x+1)² = 0 → x = -1 (doble)'
          ],
          [
            'Olvidar el signo ± en la fórmula cuadrática',
            'No verificar las soluciones en la ecuación original',
            'Error al factorizar trinomios'
          ],
          [
            'Movimiento parabólico en física',
            'Optimización de áreas en construcción',
            'Precios máximos en economía'
          ],
          'Un fabricante vende x unidades. Sus ingresos son R(x) = -2x² + 100x. ¿Cuántas unidades debe vender para maximizar ingresos?',
          'problema_resuelto',
          ['La parábola abre hacia abajo (a < 0), el vértice da el máximo', 'x_vértice = -b/(2a)', 'Sustituye en R(x)'],
          [
            { paso: 1, descripcion: 'Identifica a = -2, b = 100', formulaUsada: 'x_vértice = -b/(2a)' },
            { paso: 2, descripcion: 'x_vértice = -100/(2×(-2)) = -100/-4 = 25', resultadoParcial: '25 unidades' },
            { paso: 3, descripcion: 'R(25) = -2(625) + 100(25) = -1250 + 2500 = 1250', resultadoParcial: 'Ingresos máximos = S/1250' }
          ],
          '¿Qué forma tiene la parábola si a > 0?',
          ['ecuación cuadrática', 'parábola', 'vértice', 'raíces', 'discriminante'],
          [
            { pregunta: '¿Cuántas soluciones tiene x² + 4 = 0?', respuestaCorrecta: 'Ninguna (o dos complejas)', explicacion: 'Discriminante = 0² - 4(1)(4) = -16 < 0, no hay raíces reales.', tipoMemoria: 'conceptual' },
            { pregunta: '¿Cuál es el discriminante de x² - 6x + 9 = 0?', respuestaCorrecta: '0', explicacion: 'b²-4ac = 36 - 36 = 0, una solución doble.', tipoMemoria: 'procedural' },
            { pregunta: 'Resuelve: x² - 7x + 12 = 0', respuestaCorrecta: 'x = 3 y x = 4', explicacion: 'Factoriza: (x-3)(x-4) = 0', tipoMemoria: 'procedural' },
          ]
        ),
        leccion(
          'sistemas-ecuaciones',
          'Sistemas de Ecuaciones: El Encuentro de Caminos',
          28,
          'Un sistema es como dos caminos: quieres saber dónde se cruzan. La solución es el punto donde ambas ecuaciones coinciden.',
          'Imagina dos personas caminando: una dice "estoy 2 km adelante", la otra "estoy 3 km atrás". ¿Dónde se encuentran?',
          [
            'Un sistema tiene 2+ ecuaciones con las mismas variables',
            'Método de sustitución: despeja una variable e igualas',
            'Método de eliminación: sumas/restaras ecuaciones para cancelar variables',
            'La solución es un par ordenada (x, y) que satisface ambas ecuaciones'
          ],
          'Un sistema de ecuaciones lineales es un conjunto de ecuaciones que comparten variables. La solución es el punto de intersección.',
          'x = (c₁b₂ - c₂b₁) / (a₁b₂ - a₂b₁)',
          [
            '{ 2x + y = 7 ; x - y = 2 → x = 3, y = 1 (intersección en (3,1))',
            '{ x + y = 5 ; 2x + 2y = 12 → sin solución (rectas paralelas)',
            '{ x + y = 4 ; 2x + 2y = 8 → infinitas soluciones (misma recta)'
          ],
          [
            'Confundir sustitución con eliminación',
            'Olvidar verificar la solución en ambas ecuaciones',
            'No reconocer sistemas sin solución o con infinitas'
          ],
          [
            'Optimización de recursos en empresas',
            'Punto de equilibrio en economía',
            'Mezclas químicas con proporciones'
          ],
          'Una cafetería vende café ($2) y té ($1.50). Vendieron 50 bebidas y recaudaron $85. ¿Cuántos cafés y tés vendieron?',
          'problema_resuelto',
          ['Plantea: x + y = 50 y 2x + 1.5y = 85', 'Sustituye y = 50 - x en la segunda', 'Resuelve para x'],
          [
            { paso: 1, descripcion: 'Plantea el sistema: x + y = 50; 2x + 1.5y = 85', formulaUsada: 'Sistema lineal' },
            { paso: 2, descripcion: 'De la primera: y = 50 - x', resultadoParcial: 'Sustitución' },
            { paso: 3, descripcion: '2x + 1.5(50-x) = 85 → 2x + 75 - 1.5x = 85 → 0.5x = 10 → x = 20', resultadoParcial: '20 cafés' },
            { paso: 4, descripcion: 'y = 50 - 20 = 30', resultadoParcial: '30 tés' }
          ],
          '¿Qué tipo de sistema es { x + y = 3 ; 2x + 2y = 7 }?',
          ['sistema', 'sustitución', 'eliminación', 'solución', 'intersección'],
          [
            { pregunta: '¿Qué forma tiene un sistema compatible indeterminado?', respuestaCorrecta: 'Las ecuaciones son la misma recta', explicacion: 'Tienen infinitas soluciones en común.', tipoMemoria: 'conceptual' },
            { pregunta: 'Resuelve: { 3x + 2y = 12 ; x - y = 2 }', respuestaCorrecta: 'x = 4, y = 2', explicacion: 'Sustitución: x = y+2 → 3(y+2)+2y=12 → y=2, x=4', tipoMemoria: 'procedural' },
            { pregunta: '¿Qué método usarías si un coeficiente es 1?', respuestaCorrecta: 'Sustitución', explicacion: 'Si un coeficiente es 1, es fácil despejar esa variable.', tipoMemoria: 'factual' },
          ]
        ),
        leccion(
          'funciones-lineales',
          'Funciones Lineales: La Regla de Tres Pensada',
          22,
          'Una función es una máquina: metes un número y te devuelve otro siguiendo una regla. Como una regla de tres pero con infinitos pares posibles.',
          'Imagina una máquina de café: metes una moneda, te da un café. La entrada (moneda) siempre produce la misma salida (café).',
          [
            'Una función relaciona cada entrada con exactamente una salida',
            'f(x) = mx + b es una función lineal (recta)',
            'm es la pendiente: sube/descende x unidades, y sube/baja m unidades',
            'b es la ordenada al origen: el punto donde corta el eje Y'
          ],
          'Una función f: X → Y asigna a cada elemento de X exactamente un elemento de Y. f(x) = mx + b es lineal.',
          'f(x) = mx + b',
          [
            'f(x) = 2x + 3: si x=1, f(1)=5; si x=-1, f(-1)=1',
            'Pendiente = 3/2: por cada 2 unidades a la derecha, sube 3',
            'Si f(0) = 5, la recta corta el eje Y en (0, 5)'
          ],
          [
            'Confundir función con ecuación general',
            'No usar notación f(x) correctamente',
            'Error al interpretar la pendiente negativa'
          ],
          [
            'Ingresos en función de unidades vendidas',
            'Distancia en función del tiempo',
            'Costos fijos y variables'
          ],
          'Una empresa cobra $500 fijo más $20 por producto vendido. Escribe la función y calcula el costo si vendes 30 productos.',
          'ejercicio_contextualizado',
          ['La función es C(x) = 500 + 20x', 'Sustituye x = 30', 'Calcula el resultado'],
          [
            { paso: 1, descripcion: 'Función: C(x) = 500 + 20x', formulaUsada: 'f(x) = mx + b' },
            { paso: 2, descripcion: 'C(30) = 500 + 20(30) = 500 + 600', resultadoParcial: 'C(30) = 1100' },
            { paso: 3, descripcion: 'Verifica: $500 fijo + $600 por 30 productos', resultadoParcial: '$1100 total' }
          ],
          '¿Qué pendiente tiene una función decrecreiente?',
          ['función', 'pendiente', 'intersección', 'dominio', 'imagen'],
          [
            { pregunta: 'Si f(x) = 3x - 2, ¿cuál es f(-1)?', respuestaCorrecta: '-5', explicacion: 'f(-1) = 3(-1) - 2 = -3 - 2 = -5', tipoMemoria: 'procedural' },
            { pregunta: 'En f(x) = 2x + 5, ¿qué número es la pendiente?', respuestaCorrecta: '2', explicacion: 'En f(x) = mx + b, m es la pendiente.', tipoMemoria: 'factual' },
            { pregunta: '¿Qué relación tiene la pendiente con el crecimiento?', respuestaCorrecta: 'Pendiente positiva crece, negativa decrece', explicacion: 'La pendiente indica el cambio de y respecto a x.', tipoMemoria: 'conceptual' },
          ]
        ),
        leccion(
          'polinomios-operaciones',
          'Polinomios: La Suma de Monstruos Algebraicos',
          26,
          'Un polinomio es como una colección de monstruos: cada uno (término) tiene un tipo (grado) y tamaño (coeficiente). Los puedes agrupar, multiplicar o dividir.',
          'Imagina criaturas de montaña rusa: cada vagon es un término (3x², -2x, 5). La suma conecta vagones; la multiplicación los cruzan todos.',
          [
            'Un polinomio suma términos con variables elevadas a enteros positivos',
            'Grado: el mayor exponente',
            'Suma: junta términos semejantes (misma variable y exponente)',
            'Multiplicación: distribuye cada término del primero con cada uno del segundo'
          ],
          'Un polinomio es una expresión algebraica que suma monomios. Su grado es el término de mayor exponente.',
          '(a + b)(c + d) = ac + ad + bc + bd',
          [
            '(2x² + 3x - 1) + (x² - 2x + 4) = 3x² + x + 3',
            '(x + 3)(x - 2) = x² - 2x + 3x - 6 = x² + x - 6',
            '(x + 1)² = (x + 1)(x + 1) = x² + 2x + 1'
          ],
          [
            'Confundir exponentes al multiplicar',
            'Olvidar distribuir en productos',
            'No identificar términos semejantes'
          ],
          [
            'Área de figuras compuestas',
            'Ingresos totales con múltiples productos',
            'Movimientos acelerados en física'
          ],
          'Suma (3x² - 2x + 5) y (2x² + 4x - 3). Luego multiplica el resultado por (x - 1).',
          'problema_resuelto',
          ['Suma términos semejantes: 3x²+2x², -2x+4x, 5-3', 'Distribuye (x-1) al resultado', 'Simplifica'],
          [
            { paso: 1, descripcion: 'Suma: 3x² + 2x² = 5x²; -2x + 4x = 2x; 5 - 3 = 2', formulaUsada: '3x² + 2x + 2' },
            { paso: 2, descripcion: '(5x² + 2x + 2)(x - 1) = 5x³ - 5x² + 2x² - 2x + 2x - 2', resultadoParcial: 'Distribución' },
            { paso: 3, descripcion: 'Simplifica: 5x³ - 3x² + 0x - 2 = 5x³ - 3x² - 2', resultadoParcial: 'Polinomio de grado 3' }
          ],
          '¿Qué grado tiene 2x³ - 5x + 1?',
          ['polinomio', 'grado', 'término semejano', 'distribución', 'factor'],
          [
            { pregunta: '¿Cuál es el grado de 3x⁴ - 2x² + x - 5?', respuestaCorrecta: '4', explicacion: 'El mayor exponente es 4.', tipoMemoria: 'factual' },
            { pregunta: '¿Qué obtienes al multiplicar (x+2)(x-2)?', respuestaCorrecta: 'x² - 4', explicacion: '(a+b)(a-b) = a² - b² = x² - 4', tipoMemoria: 'procedural' },
            { pregunta: '¿Qué son términos semejantes?', respuestaCorrecta: 'Términos con la misma variable y exponente', explicacion: '3x² y -5x² son semejantes.', tipoMemoria: 'factual' },
          ]
        ),
      ],
      evaluacionFinal: [
        {
          pregunta: 'Resuelve: 3(x - 2) = 2x + 5',
          respuestaCorrecta: 'x = 11',
          explicacion: '3x - 6 = 2x + 5 → x = 11. Verifica: 3(9) = 2(11) + 5 → 27 = 27 ✓.',
          tipoMemoria: 'procedural',
        },
        {
          pregunta: '¿Cuál es el discriminante de x² - 4x + 5 = 0?',
          respuestaCorrecta: '-4',
          explicacion: 'b² - 4ac = 16 - 20 = -4. No tiene soluciones reales.',
          tipoMemoria: 'procedural',
        },
        {
          pregunta: 'Si f(x) = -3x + 2, ¿qué pendiente tiene?',
          respuestaCorrecta: '-3 (función decrecreciente)',
          explicacion: 'm = -3 < 0, por lo tanto decrece.',
          tipoMemoria: 'conceptual',
        },
      ],
    },
    {
      id: 'geometria',
      titulo: 'Geometría: Formas y Figuras en Dimensión',
      orden: 2,
      spacedReviewSchedule: ['día 2', 'día 5', 'día 12', 'día 25'],
      lecciones: [
        leccion(
          'triangulos-pitagoras',
          'Triángulos y Teorema de Pitágoras: La Relación Mágica',
          24,
          'Todo triángulo rectángulo guarda un secreto: la hipotenusa al cuadrado siempre es igual a la suma de los catetos al cuadrado.',
          'Imagina una escalera apoyada en una pared: la distancia de la base a la pared (cateto a), la altura en la pared (cateto b), y la escalera (hipotenusa c). Relacionadas por a² + b² = c².',
          [
            'En un triángulo rectángulo, catetos a y b, hipotenusa c (lado opuesto al ángulo recto)',
            'El teorema dice: a² + b² = c²',
            'Solo funciona en triángulos rectángulos',
            'Se puede usar para hallar distancias indirectas'
          ],
          'En un triángulo rectángulo, el cuadrado de la hipotenusa es igual a la suma de los cuadrados de los catetos.',
          'c² = a² + b²',
          [
            'Catetos 3 y 4 → c = √(9+16) = √25 = 5',
            'Hipotenusa 13 y cateto 5 → b = √(169-25) = √144 = 12',
            'Distancia entre (0,0) y (3,4) = √(9+16) = 5'
          ],
          [
            'Aplicar a triángulos que no son rectángulos',
            'Confundir cuál es la hipotenusa',
            'Olvidar la raíz cuadrada al final'
          ],
          [
            'Altura de edificios sin escalarlos',
            'Distancia entre dos puntos',
            'Diseño de estructuras y escaleras'
          ],
          'Un cable de 10 m conecta la cima de un árbol a una ancla en tierra. La altura del árbol es 6 m. ¿Qué distancia hay desde la base del árbol a la ancla?',
          'problema_resuelto',
          ['El cable es la hipotenusa c = 10', 'La altura es un cateto a = 6', 'Busca el otro cateto b'],
          [
            { paso: 1, descripcion: 'Identifica: c = 10 (cable), a = 6 (altura), busca b', formulaUsada: 'a² + b² = c²' },
            { paso: 2, descripcion: '6² + b² = 10² → 36 + b² = 100', resultadoParcial: 'b² = 64' },
            { paso: 3, descripcion: 'b = √64 = 8', resultadoParcial: '8 metros de distancia' }
          ],
          '¿Cómo se llama el lado más largo en un triángulo rectángulo?',
          ['triángulo rectángulo', 'hipotenusa', 'cateto', 'pitágoricas', 'distancia'],
          [
            { pregunta: '¿Qué dice el teorema de Pitágoras?', respuestaCorrecta: 'a² + b² = c²', explicacion: 'La hipotenusa al cuadrado es la suma de los catetos al cuadrado.', tipoMemoria: 'factual' },
            { pregunta: 'Si catetos miden 5 y 12, ¿cuál es la hipotenusa?', respuestaCorrecta: '13', explicacion: '√(25 + 144) = √169 = 13', tipoMemoria: 'procedural' },
            { pregunta: '¿Se puede aplicar Pitágoras a un triángulo equilátero?', respuestaCorrecta: 'No, no es triángulo rectángulo', explicacion: 'Pitágoras solo aplica a triángulos rectángulos.', tipoMemoria: 'conceptual' },
          ]
        ),
        leccion(
          'circunferencia-area',
          'Círculo y Áreas: La Regla del Pastel',
          21,
          'Un círculo es como un pastel redondo: el radio mide desde el centro hasta el borde. El área es toda la superficie del pastel.',
          'Imagina un pastel: el radio es un cuchillo desde el centro hasta el borde. Si cortas todos los pedazos, el área total es π·r².',
          [
            'Radio (r): distancia del centro al borde',
            'Diámetro (d): 2 veces el radio, atraviesa el centro',
            'Circunferencia (perímetro): C = πd = 2πr',
            'Área: A = πr²'
          ],
          'La circunferencia es la distancia alrededor del círculo. El área es la superficie encerrada. Relación π ≈ 3.14159.',
          'A = π × r²',
          [
            'Radio 5 → área = 25π ≈ 78.5; circunf. = 10π ≈ 31.4',
            'Diámetro 10 → radio = 5; área = 25π',
            'Área 100π → radio = 10; diámetro = 20'
          ],
          [
            'Confundir radio y diámetro',
            'Olvidar elevar al cuadrado el radio',
            'Usar π = 3.14 en lugar de dejar π'
          ],
          [
            'Calcular área de terrenos redondos',
            'Tamaño de ruedas y engranajes',
            'Diseño de parques y jardines'
          ],
          'Una rueda tiene radio de 35 cm. ¿Cuál es su circunferencia? Si hace 100 revoluciones, ¿qué distancia recorre?',
          'ejercicio_contextualizado',
          ['Circunferencia C = 2πr = 2π(35)', 'Distancia = 100 × C'],
          [
            { paso: 1, descripcion: 'C = 2π × 35 = 70π cm', formulaUsada: 'C = 2πr' },
            { paso: 2, descripcion: 'Distancia = 100 × 70π = 7000π cm', resultadoParcial: '≈ 21,991 cm' },
            { paso: 3, descripcion: 'Convierte a metros: 7000π / 100 ≈ 219.9 m', resultadoParcial: '≈ 220 metros' }
          ],
          '¿Qué relación tiene el diámetro con el radio?',
          ['círculo', 'radio', 'diámetro', 'área', 'circunferencia'],
          [
            { pregunta: '¿Qué fórmula usa el radio al cuadrado?', respuestaCorrecta: 'Área del círculo (A = πr²)', explicacion: 'El área es π multiplicado por el radio al cuadrado.', tipoMemoria: 'factual' },
            { pregunta: 'Si el radio es 7, ¿cuál es la circunferencia?', respuestaCorrecta: '14π', explicacion: 'C = 2πr = 2π(7) = 14π', tipoMemoria: 'procedural' },
            { pregunta: '¿Qué es π en un círculo?', respuestaCorrecta: 'La razón entre circunferencia y diámetro', explicacion: 'π = C/d ≈ 3.14159', tipoMemoria: 'factual' },
          ]
        ),
        leccion(
          'areas-superficies',
          'Áreas y Volúmenes: Pintando y Llenando Figuras',
          27,
          'El área es lo que pesa una lata de pintura: superficie que cubres. El volumen es lo que llena una botella: espacio que ocupa.',
          'Imagina una caja de zapatos: la pintura cubre las caras (área) y el agua dentro llena el interior (volumen).',
          [
            'Área: espacio 2D (superficie)',
            'Volumen: espacio 3D (capacidad)',
            'Rectángulo: A = base × altura',
            'Cubo: V = lado³; Prisma: V = área_base × altura'
          ],
          'El área mide la superficie de una figura 2D. El volumen mide el espacio que ocupa una figura 3D.',
          'A_rectáng = b × h ; V_cubo = a³',
          [
            'Rectángulo 4×6 → área = 24 unidades²',
            'Cubo de lado 3 → volumen = 27 unidades³',
            'Cilindro r=2, h=5 → V = π × 4 × 5 = 20π'
          ],
          [
            'Confundir área con perímetro',
            'Unidades al cuadrado vs al cubo',
            'Olvidar elevar al cuadrado/cubo'
          ],
          [
            'Cálculo de materiales para construcción',
            'Embalaje y envases',
            'Diseño de contenedores'
          ],
          'Una caja de cartón mide 30 cm × 20 cm × 15 cm. ¿Cuánta pintura necesitas para cubrirle todas las caras (asumiendo 1 ml por 100 cm²)?',
          'ejercicio_contextualizado',
          ['Calcula área total de la caja', 'Convierte a pintura necesaria'],
          [
            { paso: 1, descripcion: 'Área = 2(ab + ac + bc) = 2(600 + 450 + 300)', formulaUsada: 'A = 2(ab+ac+bc)' },
            { paso: 2, descripcion: '2(1350) = 2700 cm²', resultadoParcial: 'Área total = 2700 cm²' },
            { paso: 3, descripcion: 'Pintura = 2700 / 100 = 27 ml', resultadoParcial: '27 ml de pintura' }
          ],
          '¿Qué unidad usarías para medir el volumen de una botella de agua?',
          ['área', 'volumen', 'superficie', 'capacidad', 'cubo'],
          [
            { pregunta: '¿Qué figura mide con cm²?', respuestaCorrecta: 'Área (2 dimensiones)', explicacion: 'El área es superficie, se mide en unidades al cuadrado.', tipoMemoria: 'factual' },
            { pregunta: '¿Cuál es el volumen de un cubo de lado 4?', respuestaCorrecta: '64', explicacion: 'V = 4³ = 64 unidades³', tipoMemoria: 'procedural' },
            { pregunta: '¿Qué diferencia hay entre área y volumen?', respuestaCorrecta: 'Área es 2D, volumen es 3D', explicacion: 'Área mide superficie plana, volumen mide espacio ocupado.', tipoMemoria: 'conceptual' },
          ]
        ),
        leccion(
          'transformaciones-geometricas',
          'Transformaciones: Mover, Girar y Escalar Figuras',
          23,
          'Las transformaciones son como instrucciones de baile: trasladar (caminar), rotar (girar), reflejar (hacer espejo) y escalar (acercar).',
          'Imagina un avatar en un videojuego: puedes moverlo (trasiación), girarlo (rotación), reflejarlo (espejo) o agrandarlo (escala).',
          [
            'Traslación: mover sin rotar (suma de coordenadas)',
            'Rotación: girar alrededor de un punto',
            'Reflexión: espejo sobre una línea',
            'Escalado: multiplicar coordenadas por un factor'
          ],
          'Una transformación geométrica cambia la posición, orientación o tamaño de una figura preservando propiedades.',
          'Traslación: (x,y) → (x+a, y+b)',
          [
            'Triángulo (1,2),(3,4),(5,1) trasladado +2 en X: (3,2),(5,4),(7,1)',
            'Reflejo de (2,3) sobre eje Y: (-2,3)',
            'Escalar (1,1) por 3: (3,3)'
          ],
          [
            'Confundir traslación con rotación',
            'No aplicar correctamente coordenadas negativas',
            'Olvidar el centro de rotación'
          ],
          [
            'Gráficos en videojuegos',
            'Diseño de patrones textiles',
            'Animación 3D y gráficos por computadora'
          ],
          'Una figura tiene vértices en (1,1), (3,1), (3,3), (1,3). Aplica traslación de (-2, +1) y luego reflejo sobre el eje X. ¿Dónde quedan los vértices?',
          'ejercicio_contextualizado',
          ['Suma (-2,+1) a cada vértice', 'Invierte la coordenada Y para reflejo'],
          [
            { paso: 1, descripcion: 'Traslación: (1,1)→(-1,2), (3,1)→(1,2), (3,3)→(1,4), (1,3)→(-1,4)', formulaUsada: '(x,y)→(x-2,y+1)' },
            { paso: 2, descripcion: 'Reflejo X: (x,y)→(x,-y)', resultadoParcial: '(-1,-2), (1,-2), (1,-4), (-1,-4)' },
            { paso: 3, descripcion: 'Verifica: la figura se movió izquierda, subió, y se reflejó', resultadoParcial: 'Transformación doble completada' }
          ],
          '¿Qué transformación conserva tamaño y forma?',
          ['transformación', 'traslación', 'rotación', 'reflexión', 'escala'],
          [
            { pregunta: '¿Qué hace una traslación?', respuestaCorrecta: 'Mueve la figura sin cambiar tamaño ni forma', explicacion: 'La traslación es un desplazamiento.', tipoMemoria: 'factual' },
            { pregunta: 'Refleja (3, -2) sobre el eje Y', respuestaCorrecta: '(-3, -2)', explicacion: 'El eje Y cambia el signo de X: (3,-2)→(-3,-2)', tipoMemoria: 'procedural' },
            { pregunta: '¿Cuál transformación cambia el tamaño?', respuestaCorrecta: 'Escalado', explicacion: 'Multiplica coordenadas por un factor.', tipoMemoria: 'factual' },
          ]
        ),
        leccion(
          'trigonometria-basica',
          'Trigonometría Básica: Las Razones de los Triángulos',
          28,
          'La trigonometría mide triángulos con razones: seno, coseno y tangente. Son como reglas de tres que relacionan ángulos y lados.',
          'Imagina medir la altura de un árbol sin subir: desde el suelo, mides el ángulo de elevación. Con trigonometría, la altura surge de una razón.',
          [
            'Seno = opuesto / hipotenusa',
            'Coseno = adyacente / hipotenusa',
            'Tangente = opuesto / adyacente',
            'Recuerda: SOH-CAH-TOA'
          ],
          'Las razones trigonométricas relacionan los lados y ángulos de un triángulo rectángulo. sen(θ) = op/hipo, cos(θ) = ady/hipo, tg(θ) = op/ady.',
          'SOH-CAH-TOA',
          [
            'Ángulo 30°: sen = 0.5, cos ≈ 0.866, tg ≈ 0.577',
            'Ángulo 45°: sen = cos ≈ 0.707, tg = 1',
            'Ángulo 60°: sen ≈ 0.866, cos = 0.5, tg ≈ 1.732'
          ],
          [
            'Usar ángulos agudos en lugar de radianes',
            'Confundir opuesto con adyacente',
            'No usar la calculadora en modo correcto'
          ],
          [
            'Altura de edificios y montañas',
            'Distancia en navegación',
            'Física: componentes de fuerzas'
          ],
          'Desde un punto, el ángulo de elevación al techo de un edificio es 45°. Si estás a 20 m del edificio, ¿cuál es su altura?',
          'ejercicio_contextualizado',
          ['Usa tangente: tg(45°) = altura / distancia', 'tg(45°) = 1, distancia = 20'],
          [
            { paso: 1, descripcion: 'tg(45°) = altura / 20', formulaUsada: 'tg(θ) = opuesto/adyacente' },
            { paso: 2, descripcion: '1 = altura / 20', resultadoParcial: 'tg(45°) = 1' },
            { paso: 3, descripcion: 'altura = 20 × 1 = 20 m', resultadoParcial: 'Altura = 20 metros' }
          ],
          '¿Qué función trigonométrica es 0 cuando el ángulo es 0°?',
          ['seno', 'coseno', 'tangente', 'trigonometría', 'ángulo'],
          [
            { pregunta: '¿Qué significa SOH en trigonometría?', respuestaCorrecta: 'Seno = Opuesto / Hipotenusa', explicacion: 'SOH-CAH-TOA es la regla mnemotécnica.', tipoMemoria: 'factual' },
            { pregunta: 'Si hipotenusa = 10 y cateto opuesto = 6, ¿cuál es el seno?', respuestaCorrecta: '0.6', explicacion: 'sen = 6/10 = 0.6', tipoMemoria: 'procedural' },
            { pregunta: '¿Qué razón trigonométrica se indefine en 90°?', respuestaCorrecta: 'Tangente', explicacion: 'tg(90°) = sen/cos = 1/0 → infinito.', tipoMemoria: 'factual' },
          ]
        ),
      ],
      evaluacionFinal: [
        {
          pregunta: 'En un triángulo rectángulo, los catetos midan 8 y 15. ¿Cuál es la hipotenusa?',
          respuestaCorrecta: '17',
          explicacion: 'c = √(64 + 225) = √289 = 17',
          tipoMemoria: 'procedural',
        },
        {
          pregunta: '¿Qué área tiene un círculo de radio 6?',
          respuestaCorrecta: '36π',
          explicacion: 'A = πr² = π(6)² = 36π',
          tipoMemoria: 'procedural',
        },
        {
          pregunta: '¿Qué relación define el coseno?',
          respuestaCorrecta: 'Cateto adyacente / hipotenusa',
          explicacion: 'CAH: Coseno = Adyacente / Hipotenusa.',
          tipoMemoria: 'factual',
        },
      ],
    },
    {
      id: 'calculo',
      titulo: 'Cálculo: El Arte del Cambio Intuitivo',
      orden: 3,
      spacedReviewSchedule: ['día 3', 'día 7', 'día 15', 'día 30'],
      lecciones: [
        leccion(
          'limites',
          'Límites: Acercándose al Destino',
          26,
          'Un límite es como acercarte a una puerta sin tocarla: observas qué valor se acerca la función. No importa lo que pase exactamente en la puerta.',
          'Imagina acercarte a un semáforo: cuando estás a 10 m, ves rojo; a 5 m, rojo; a 1 m, todavía rojo. El límite es: acercándote, se vuelve verde. No importa si al tocarlo ya es verde.',
          [
            'El límite pregunta: ¿qué valor se acerca f(x) cuando x se acerca a a?',
            'lim(x→a) f(x) = L',
            'No importa el valor exacto en x = a, importa lo que sucede cerca',
            'Si hay 0/0, factoriza y simplifica'
          ],
          'El límite de una función f(x) cuando x tiende a a es el valor L al que f(x) se acerca. Si la función es continua, basta sustituir.',
          'lim(x→a) f(x) = L',
          [
            'lim(x→2) (x² + 1) = 4 + 1 = 5 (sustitución directa)',
            'lim(x→3) (x² - 9)/(x - 3) = lim(x→3) (x+3) = 6 (factoriza)',
            'lim(x→∞) 1/x = 0 (crece el denominador)'
          ],
          [
            'Creer que el límite es el valor en el punto',
            'No factorizar correctamente en 0/0',
            'Confundir límite finito con infinito'
          ],
          [
            'Velocidad instantánea en física',
            'Tasa de crecimiento poblacional',
            'Análisis de algoritmos en computación'
          ],
          'Calcula lim(x→4) (x² - 16) / (x - 4)',
          'problema_resuelto',
          ['Sustituye x = 4 → 0/0, entonces factoriza', '(x² - 16) = (x-4)(x+4)', 'Simplifica (x-4)'],
          [
            { paso: 1, descripcion: 'Sustitución directa: (16 - 16)/(4-4) = 0/0 → indeterminado', formulaUsada: '0/0 requiere factorización' },
            { paso: 2, descripcion: 'Factoriza: x² - 16 = (x-4)(x+4)', resultadoParcial: '(x-4)(x+4)/(x-4)' },
            { paso: 3, descripcion: 'Simplifica: (x+4)', resultadoParcial: 'lim(x→4) (x+4)' },
            { paso: 4, descripcion: 'Sustituye: 4 + 4 = 8', resultadoParcial: 'Límite = 8' }
          ],
          '¿Qué ocurre con lim(x→0) 1/x?',
          ['límite', 'indeterminado', 'continuidad', 'factorización', 'asíntota'],
          [
            { pregunta: '¿Qué significa 0/0 al calcular un límite?', respuestaCorrecta: 'Indeterminado, requiere factorización', explicacion: 'No significa que no exista; hay que simplificar.', tipoMemoria: 'factual' },
            { pregunta: 'Calcula lim(x→1) (x³ - 1)/(x - 1)', respuestaCorrecta: '3', explicacion: 'Factoriza: (x-1)(x²+x+1)/(x-1) = x²+x+1 → 1+1+1 = 3', tipoMemoria: 'procedural' },
            { pregunta: '¿Qué relación tiene el límite con la continuidad?', respuestaCorrecta: 'Si el límite existe y coincide con f(a), la función es continua', explicacion: 'La continuidad requiere: límite existe, f(a) existe, y coinciden.', tipoMemoria: 'conceptual' },
          ]
        ),
        leccion(
          'derivada-definicion',
          'Derivada: La Velocidad de Cambio Instantánea',
          30,
          'La derivada mide qué tan rápido cambia algo en un momento exacto. Es como el velocímetro de un auto: no te dice distancia total, sino qué rápido vas AHORA.',
          'Imagina un corredor: en promedio va 10 km/h, pero en el km 3 va 12 km/h. La derivada es esa velocidad "instantánea" en cada momento.',
          [
            'La derivada es la pendiente de la tangente en un punto',
            'f\'(x) = lim(h→0) [f(x+h) - f(x)] / h',
            'Mide la tasa de cambio instantánea',
            'Si la derivada es positiva, la función crece; si negativa, decrece'
          ],
          'La derivada de f(x) en x₀ es el límite de la razón de cambio: f\'(x₀) = lim(h→0) [f(x₀+h) - f(x₀)] / h.',
          "f'(x) = lim(h→0) [f(x+h) - f(x)] / h",
          [
            'f(x) = x² → f\'(x) = 2x (pendiente varía con x)',
            'f(x) = 3x + 2 → f\'(x) = 3 (pendiente constante)',
            'f(x) = x³ → f\'(x) = 3x²'
          ],
          [
            'Confundir derivada con integral',
            'Olvidar que es un límite',
            'No interpretar el significado físico'
          ],
          [
            'Velocidad y aceleración en física',
            'Marginales en economía',
            'Gradientes en optimización'
          ],
          'Calcula la derivada de f(x) = x² + 3x usando la definición de límite.',
          'problema_resuelto',
          ['Usa f\'(x) = lim[h→0] (f(x+h) - f(x))/h', 'Desarrolla (x+h)²'],
          [
            { paso: 1, descripcion: 'f(x+h) = (x+h)² + 3(x+h) = x² + 2xh + h² + 3x + 3h', formulaUsada: 'Sustitución f(x+h)' },
            { paso: 2, descripcion: 'f(x+h) - f(x) = 2xh + h² + 3h', resultadoParcial: 'Cancela x² y 3x' },
            { paso: 3, descripcion: '[2xh + h² + 3h]/h = 2x + h + 3', resultadoParcial: 'Divide todo entre h' },
            { paso: 4, descripcion: 'lim(h→0) (2x + h + 3) = 2x + 3', resultadoParcial: "f'(x) = 2x + 3" }
          ],
          '¿Qué representa geométricamente la derivada?',
          ['derivada', 'pendiente', 'limite', 'tasa de cambio', 'tangente'],
          [
            { pregunta: '¿Qué regla aplicas para derivar xⁿ?', respuestaCorrecta: 'Regla de la potencia: n·x^(n-1)', explicacion: 'd/dx(xⁿ) = nx^(n-1)', tipoMemoria: 'factual' },
            { pregunta: 'Si f(x) = 5x³, ¿cuál es f\'(x)?', respuestaCorrecta: '15x²', explicacion: 'f\'(x) = 5·3x² = 15x²', tipoMemoria: 'procedural' },
            { pregunta: '¿Qué significa f\'(x) = 0?', respuestaCorrecta: 'Máximo o mínimo (punto crítico)', explicacion: 'Pendiente cero = punto estacionario.', tipoMemoria: 'conceptual' },
          ]
        ),
        leccion(
          'reglas-derivacion',
          'Reglas de Derivación: El Atajo Matemático',
          25,
          'Derivar es como desarmar una máquina: cada pieza tiene su propia regla. Con reglas simples, puedes derivar cualquier combinación.',
          'Imagina instrucciones de cocina: derivar una suma = deriva cada parte por separado. Derivar un producto = usa el producto.',
          [
            'Regla de la potencia: (xⁿ)\' = nx^(n-1)',
            'Regla de la suma: (f + g)\' = f\' + g\'',
            'Regla del producto: (fg)\' = f\'g + fg\'',
            'Regla de la cadena: deriva el exterior × interior'
          ],
          'Las reglas de derivación permiten derivar funciones compuestas sin usar la definición de límite cada vez.',
          "d/dx[x^n] = nx^{n-1}",
          [
            'f(x) = x³ + 2x² → f\'(x) = 3x² + 4x',
            'f(x) = x²·sen(x) → f\'(x) = 2x·sen(x) + x²·cos(x)',
            'f(x) = (3x + 1)⁵ → f\'(x) = 5(3x+1)⁴·3 = 15(3x+1)⁴'
          ],
          [
            'Olvidar la regla de la cadena',
            'No derivar cada término de una suma',
            'Confundir producto con cadena'
          ],
          [
            'Economía: margen de beneficio',
            'Física: aceleración como derivada de velocidad',
            'Ingeniería: tasas de cambio'
          ],
          'Deriva f(x) = (2x³ - 5x²)(x + 1) usando la regla del producto.',
          'problema_resuelto',
          ['Identifica u = 2x³ - 5x², v = x + 1', 'Calcula u\' y v\'', 'Aplica (uv)\' = u\'v + uv\''],
          [
            { paso: 1, descripcion: 'u = 2x³ - 5x² → u\' = 6x² - 10x', formulaUsada: 'Regla de potencia' },
            { paso: 2, descripcion: 'v = x + 1 → v\' = 1', resultadoParcial: 'Derivada lineal' },
            { paso: 3, descripcion: "(uv)' = (6x² - 10x)(x+1) + (2x³ - 5x²)(1)", formulaUsada: 'Regla del producto' },
            { paso: 4, descripcion: 'Expandiendo: 6x³ + 6x² - 10x² - 10x + 2x³ - 5x² = 8x³ - 9x² - 10x', resultadoParcial: 'f\'(x) = 8x³ - 9x² - 10x' }
          ],
          '¿Qué regla usarías para derivar sen(x²)?',
          ['derivada', 'regla', 'producto', 'cadena', 'potencia'],
          [
            { pregunta: '¿Cuál es la derivada de x⁵?', respuestaCorrecta: '5x⁴', explicacion: 'Regla de potencia: 5x^(5-1) = 5x⁴', tipoMemoria: 'procedural' },
            { pregunta: 'Si f(x) = x² + 3x - 5, ¿cuál es f\'(x)?', respuestaCorrecta: '2x + 3', explicacion: 'Deriva término a término.', tipoMemoria: 'procedural' },
            { pregunta: '¿Qué regla usas para (f(g(x)))\'?', respuestaCorrecta: 'Regla de la cadena', explicacion: '(f∘g)\' = f\'·g\' (derivada exterior × interior)', tipoMemoria: 'factual' },
          ]
        ),
        leccion(
          'aplicaciones-derivada',
          'Aplicaciones: Máximos, Mínimos y Optimización',
          24,
          'La derivada encuentra picos y valles: donde f\'(x) = 0, puedes estar en la cima de una montaña o en el fondo de un valle.',
          'Imagina subir una montaña: al final, la pendiente se aplana (f\' = 0) en la cima. Ese punto es un máximo.',
          [
            'Si f\'(x) = 0 y cambia de + a -, es un máximo',
            'Si f\'(x) = 0 y cambia de - a +, es un mínimo',
            'La optimización busca el máximo/minimo de una función',
            'La segunda derivada confirma concavidad: f\'\'(x) > 0 crece, < 0 decrece'
          ],
          'Los puntos críticos ocurren cuando f\'(x) = 0 o no existe. Se clasifican mediante la segunda derivada o el cambio de signo.',
          "f'(x) = 0",
          [
            'f(x) = -x² + 4x: f\'(x) = -2x + 4 = 0 → x = 2 (máximo)',
            'f(x) = x³ - 3x: f\'(x) = 3x² - 3 = 0 → x = ±1 (máx y mín)',
            'Área máxima de rectángulo con perímetro fijo'
          ],
          [
            'Olvidar verificar con segunda derivada',
            'No considerar dominio del problema',
            'Confundir puntos críticos con optimización'
          ],
          [
            'Maximizar beneficios en empresas',
            'Diseño óptimo de estructuras',
            'Física: trayectoria de proyectiles'
          ],
          'Un rectángulo tiene perímetro 20. ¿Cuáles son sus dimensiones para que el área sea máxima?',
          'problema_resuelto',
          ['Expresa área en función de un lado', 'Deriva e iguala a cero', 'Verifica que es máximo'],
          [
            { paso: 1, descripcion: 'P = 2x + 2y = 20 → y = 10 - x', formulaUsada: 'Relación de perímetro' },
            { paso: 2, descripcion: 'Área A = x·y = x(10-x) = 10x - x²', resultadoParcial: 'A = 10x - x²' },
            { paso: 3, descripcion: 'A\'(x) = 10 - 2x = 0 → x = 5', formulaUsada: 'f\'(x) = 0' },
            { paso: 4, descripcion: 'y = 10 - 5 = 5; A\'\'(x) = -2 < 0 → máximo', resultadoParcial: 'Cuadrado 5×5, área máxima = 25' }
          ],
          '¿Qué relación tiene f\'(x) = 0 con la recta horizontal?',
          ['optimización', 'máximo', 'mínimo', 'derivada', 'segunda'],
          [
            { pregunta: 'Si f\'(a) = 0 y f\'\'(a) > 0, ¿qué tipo de punto es?', respuestaCorrecta: 'Mínimo local', explicacion: 'Segunda derivada positiva confirma mínimo.', tipoMemoria: 'conceptual' },
            { pregunta: 'Para maximizar x(12-x), ¿qué valor de x usas?', respuestaCorrecta: 'x = 6', explicacion: 'f\'(x) = 12 - 2x = 0 → x = 6', tipoMemoria: 'procedural' },
            { pregunta: '¿Cómo se llama el punto donde f\'(x) = 0?', respuestaCorrecta: 'Punto crítico', explicacion: 'Son candidatos a máximos o mínimos.', tipoMemoria: 'factual' },
          ]
        ),
        leccion(
          'integral-concepto',
          'Integral: El Área Debajo de la Curva',
          27,
          'La integral suma infinitos pedazitos: el área debajo de una curva. Es como medir el terreno irregular con reglas infinitesimales.',
          'Imagina medir un lago irregular: divides en columnas finas, sumas todas las áreas. La integral es el límite cuando las columnas son infinitamente delgadas.',
          [
            'La integral suma áreas bajo la curva',
            'Integral definida: ∫[a,b] f(x)dx = área entre f(x) y el eje X',
            'Integral indefinida: la función cuya derivada es f(x)',
            'Fundoamental: ∫ f(x)dx = F(x) + C, si F\'(x) = f(x)'
          ],
          'La integral indefinida de f(x) es una familia de funciones F(x) cuya derivada es f(x). La integral definida da el área acumulada.',
          '∫ x^n dx = x^(n+1)/(n+1) + C',
          [
            '∫ 2x dx = x² + C (porque d/dx(x²) = 2x)',
            '∫[0,2] x² dx = [x³/3]₀² = 8/3 ≈ 2.67',
            'Área de x² entre 0 y 1: ∫₀¹ x² dx = 1/3'
          ],
          [
            'Confundir integral con derivada',
            'Olvidar la constante C en integrales indefinidas',
            'Error en límites de integración'
          ],
          [
            'Área de terrenos irregulares',
            'Trabajo en física (fuerza × distancia)',
            'Beneficio acumulado en economía'
          ],
          'Calcula la integral ∫ (3x² + 4x) dx y evalúa ∫[1,3] (3x² + 4x) dx.',
          'problema_resuelto',
          ['Integra término a término', 'Usa la regla de potencia', 'Evalúando entre límites'],
          [
            { paso: 1, descripcion: '∫ 3x² dx = x³; ∫ 4x dx = 2x²', formulaUsada: '∫ x^n dx = x^(n+1)/(n+1)' },
            { paso: 2, descripcion: 'Integral indefinida: x³ + 2x² + C', resultadoParcial: 'Familia de antiderivadas' },
            { paso: 3, descripcion: '∫[1,3] (3x² + 4x)dx = [x³ + 2x²]₁³', resultadoParcial: 'Evalúación de límites' },
            { paso: 4, descripcion: '(27 + 18) - (1 + 2) = 45 - 3 = 42', resultadoParcial: 'Área = 42 unidades²' }
          ],
          '¿Qué relación tiene la integral con la derivada?',
          ['integral', 'área', 'antiderivada', 'constante', 'límites'],
          [
            { pregunta: '¿Qué significa la C en ∫ f(x)dx = F(x) + C?', respuestaCorrecta: 'Constante de integración', explicacion: 'Representa toda la familia de antiderivadas.', tipoMemoria: 'factual' },
            { pregunta: '¿Cuál es ∫ 6x dx?', respuestaCorrecta: '3x² + C', explicacion: '∫ 6x dx = 6x²/2 = 3x² + C', tipoMemoria: 'procedural' },
            { pregunta: '¿Qué conexión une derivada e integral?', respuestaCorrecta: 'Son operaciones inversas', explicacion: 'La derivada de la integral (y viceversa) da la función original.', tipoMemoria: 'conceptual' },
          ]
        ),
      ],
      evaluacionFinal: [
        {
          pregunta: 'Calcula la derivada de f(x) = 4x³ - 5x² + 2x - 7',
          respuestaCorrecta: 'f\'(x) = 12x² - 10x + 2',
          explicacion: 'Deriva término a término: 12x² - 10x + 2',
          tipoMemoria: 'procedural',
        },
        {
          pregunta: '¿Qué representa ∫[a,b] f(x)dx geometricamente?',
          respuestaCorrecta: 'Área bajo la curva de f(x) entre a y b',
          explicacion: 'La integral definida suma áreas infinitesimales.',
          tipoMemoria: 'conceptual',
        },
        {
          pregunta: 'Si f\'(2) = 0 y f\'\'(2) > 0, ¿qué hay en x = 2?',
          respuestaCorrecta: 'Un mínimo local',
          explicacion: 'f\' = 0 y f\'\' > 0 confirma un punto mínimo.',
          tipoMemoria: 'conceptual',
        },
      ],
    },
  ],
};
