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

export const HistoriaCurso: CursoBase = {
  id: 'historia-neuro',
  nombre: 'Historia Viva: Personajes que Cambiaron el Mundo',
  descripcion: 'Curso de Historia del Perú y Universal usando narrativa causa-efecto y storytelling con vínculos emocionales.',
  nivelEducativo: 'Secundaria',
  competencias: [
    'Analizar causa-efecto en eventos históricos',
    'Construir narrativas históricas coherentes',
    'Relacionar sucesos pasados con realidad actual',
    'Desarrollar pensamiento crítico frente a fuentes históricas',
    'Identificar aportaciones culturales del Perú y mundo',
  ],
  duracionEstimada: '10 meses',
  metodologia: {
    metodoFeynman: true,
    activeRecall: true,
    spacedRepetition: true,
    intuicionAntesFormula: true,
    estrategiasTransversales: [
      'Líneas temporales dinámicas interactivas',
      'Vínculos emocionales con fechas históricas',
      'Storytelling narrativo-causal',
      'Personajes con descripciones visuales detalladas',
      'Conexión con vivencias personales del estudiante',
    ],
  },
  modulos: [
    {
      id: 'precolombito-peru',
      titulo: 'Perú Ancestral: Civilizaciones que Dejaron su Huella',
      orden: 1,
      spacedReviewSchedule: ['día 1', 'día 3', 'día 7', 'día 18'],
      lecciones: [
        leccion(
          'civilizaciones-moche',
          'Civilización Moche: La Cultura de los Dioses de Barro',
          24,
          'Imagina una cultura que tallaba dioses en barro y construía pirámides con decoraciones de guerreros. Eran los Moche: maestros de la cerámica en la costa peruana.',
          'Los Moche eran como artesanos de un museo viviente: cada vasija contaba una historia, cada pintura mostraba un dios o una batalla.',
          [
            'Los Moche vivieron en la costa norte del Perú (0-800 d.C.)',
            'Son famosos por su cerámica detallada y pinturas murales',
            'Construyeron pirámides como Huaca del Sol y Huaca de la Luna',
            'Tenían un sistema de irrigación y agricultura avanzada',
            'Su religión centralizaba el poder en sacerdotes-dios'
          ],
          'La civilización Moche fue una cultura andina avanzada que se desarrolló en la costa norte del Perú entre los años 100 y 800 d.C., conocida por su arte, arquitectura y sistemas de irrigación.',
          'n/a (cultura precolombina)',
          [
            'Huaca del Sol en Máncora: pirámide de 20millones de bloques',
            'Huaca de la Luna: decoraciones de guerreros arcoíris',
            'Cultura Rají: vecina y competidora en la costa norte'
          ],
          [
            'Confundir con los Chimú o los Nazca',
            'Creer que desaparecieron sin influencia en culturas posteriores',
            'Olvidar su aporte artístico y tecnológico'
          ],
          [
            'Arte y cerámica como inspiración en diseño moderno',
            'Ingeniería de irrigación para agricultura sostenible',
            'Arqueología peruana como patrimonio cultural'
          ],
          '¿Qué diferencia hay entre la Huaca del Sol y la Huaca de la Luna del culture Moche?',
          'ejercicio_contextualizado',
          ['Investiga la ubicación y función de ambas', 'Considera la decoración y tamaño', 'Relaciona con el rol social'],
          [
            { paso: 1, descripcion: 'La Huaca del Sol era el templo principal, símbolo del poder real', resultadoParcial: 'Construcción masiva, enterrado en tierra' },
            { paso: 2, descripcion: 'La Huaca de la Luna conserva murales con guerreros arcoíris', resultadoParcial: 'Decoración artística representativa' },
            { paso: 3, descripcion: 'Ambas reflejan una teocracia donde el líder unía política y religión', resultadoParcial: 'Cultura teocrática con arte como propaganda' }
          ],
          '¿Qué diosa Moche representaba la guerra y la fertilidad?',
          ['moche', 'huaca', 'cerámica', 'teocracia', 'arquitectura'],
          [
            { pregunta: '¿En qué zona del Perú floreció la cultura Moche?', respuestaCorrecta: 'Costa norte', explicacion: 'Moche se desarrolló en la costa norte del Perú.', tipoMemoria: 'factual' },
            { pregunta: '¿Cuál es su obra arquitectónica más conocida?', respuestaCorrecta: 'Huaca del Sol y Huaca de la Luna', explicacion: 'Ambas son pirámides construidas por los Moche.', tipoMemoria: 'factual' },
            { pregunta: '¿Qué caracteriza su cerámica?', respuestaCorrecta: 'Detallada y con temáticas mitológicas', explicacion: 'Las vasijas Moche retratan dioses, batallas y rituales.', tipoMemoria: 'conceptual' },
          ]
        ),
        leccion(
          'civilizacion-nazca',
          'Civilización Nazca: Las Líneas que Hablan al Cielo',
          22,
          'Imagina una cultura que dibujaba líneas gigantes en el desierto que solo se ven desde el cielo. ¿Por qué? Nadie lo sabe con certeza.',
          'Los Nazca eran como artistas que trazaban en la arena con intención misteriosa: sus líneas gigantes pueden ser mapas estelares o invocaciones a dioses de agua.',
          [
            'Nazca floreció en la costa sur del Perú (200-600 d.C.)',
            'Famosos por las Líneas de Nazca, gigantografismos en el desierto',
            'Desarrollaron textiles de alta calidad y sistemas de irrigación (puquios)',
            'Usaron guijarros y tejidos como ofrendas ceremoniales',
            'Su religión estaba orientada a la fertilidad y la lluvia'
          ],
          'La cultura Nazca fue una civilización andina que desarrolló en la costa sur del Perú entre 100 y 600 d.C., famosa por las Líneas de Nazca y su avanzado trabajo textil.',
          'n/a',
          [
            'Líneas de Nazca: trazos de hasta 1 km en el desierto',
            'Telar de cintura: técnica textil avanzada',
            'Puquios: sistemas de abastecimiento de agua subterránea'
          ],
          [
            'Creer que las líneas son solo arte decorativo',
            'No reconocer la sofisticación técnica de sus sistemas de agua',
            'Confundir con la cultura Paracas'
          ],
          [
            'Arqueología comparada con otras culturas desérticas',
            'Ingeniería de recursos hídricos en zonas áridas',
            'Antropología del arte y símbolos'
          ],
          '¿Por qué las líneas de Nazca se diseñaron para ser vistas desde alto?',
          'problema_resuelto',
          ['Considera el terreno plano del desierto', 'Piensa en la perspectiva visual', 'Relaciona con ceremonias'],
          [
            { paso: 1, descripcion: 'El desierto de Nazca es amplio y plano, ideal para líneas visibles', resultadoParcial: 'Geografía favorable' },
            { paso: 2, descripcion: 'Desde casas elevadas, las líneas se alinean con patrones estelares', resultadoParcial: 'Relación posible con astronomía' },
            { paso: 3, descripcion: 'Pueden ser caminos ceremoniales o invocaciones a deidades de agua', resultadoParcial: 'Función religiosa central' }
          ],
          '¿Cuál es el color predominante en la cerámica Nazca?',
          ['nazca', 'líneas', 'textil', 'puquio', 'astronomía'],
          [
            { pregunta: '¿Dónde se encuentran las Líneas de Nazca?', respuestaCorrecta: 'En el desierto de Nazca, sur del Perú', explicacion: 'Se localizan en la región Ica.', tipoMemoria: 'factual' },
            { pregunta: '¿Cuántas líneas y geoglifos hay aproximadamente?', respuestaCorrecta: 'Más de 3000', explicacion: 'Se han identificado sobre 3000 diseños.', tipoMemoria: 'factual' },
            { pregunta: '¿Qué tejido usaban los Nazca para tejer?', respuestaCorrecta: 'Telar de cintura', explicacion: 'El telar de cintura permitía textilería detallada.', tipoMemoria: 'factual' },
          ]
        ),
        leccion(
          'civilizacion-inca',
          'Civilización Inca: El Tawantinsuyo sin Escribir',
          28,
          'Imagina un imperio sin letras, sin ruedas, sin metal para herramientas. Sin embargo, construyó ciudades en las montañas y caminos que conectaban un continente.',
          'Los Incas eran como un gigantesco organizador de eventos: sin papel, usaban cuerdas (quipus) para registrar impuestos, y sin mapas, conocían cada camino de sus 40,000 km.',
          [
            'Imperio Inca: Tawantinsuyo (1438-1532 d.C.)',
            'Capital: Cusco, división en cuatro partes (suyus)',
            'Ingeniería: acueductos, terrazas, caminos (Qhapaq Ñan)',
            'Sistema de quipus para registro contable',
            'Agricultura: maíz, frijol, papa en terrazas'
          ],
          'El Imperio Inca fue el estado más extenso de América precolombina, gobernado por un Sapa Inca considerado hijo del Sol, con una organización territorial y administrativa sin escritura.',
          'A = 2πr² + 2πrh (volumen del sólido de revolución de las terrazas)',
          [
            'Machu Picchu: ciudad inca a 2430 msnm',
            'Moray: terrazas circulares experimentales',
            'Maras: salineras de evaporación en bloque'
          ],
          [
            'Confundir con culturas anteriores (Wari, Tiwanaku)',
            'Creer que no tenían escritura (el quipu era su escritura)',
            'No reconocer la complejidad de su ingeniería'
          ],
          [
            'Ingeniería de montaña inspira arquitectura moderna',
            'Agroecología ancestral revive prácticas sostenibles',
            'Turismo comunitario en sitios arqueológicos'
          ],
          '¿Cómo funcionaba el sistema de distribución de maíz en el Tawantinsuyo?',
          'ejercicio_contextualizado',
          ['Considera el sistema de redes de caminos', 'Piensa en los almacenes (qollqas)', 'Relaciona con la organización social'],
          [
            { paso: 1, descripcion: 'El maíz se cultivaba en terrazas (andenes)', formulaUsada: 'Aprovechamiento de microclimas' },
            { paso: 2, descripcion: 'Se almacenaba en qollqas (almacenes colgados en cuevas)', resultadoParcial: 'Conservación en frío y seco' },
            { paso: 3, descripcion: 'Se distribuía a través de caminos a pueblos y centros administrativos', resultadoParcial: 'Sistema de acopio estatal' }
          ],
          '¿Qué significa Tawantinsuyo?',
          ['inca', 'cusco', 'quipu', 'teocallis', 'kuraka'],
          [
            { pregunta: '¿Qué civilización construyó Machu Picchu?', respuestaCorrecta: 'Los Incas', explicacion: 'Fue construida durante el apogeo del Imperio Inca.', tipoMemoria: 'factual' },
            { pregunta: '¿Qué sistema usaban los Incas para registrar información?', respuestaCorrecta: 'Quipu', explicacion: 'Cuerdas con nudos para contar y registrar.', tipoMemoria: 'factual' },
            { pregunta: '¿Cuántos suyus tenía el Tawantinsuyo?', respuestaCorrecta: 'Cuatro', explicacion: 'Chinchaysuyu, Antisuyu, Kuntisuyu, Qullasuyu.', tipoMemoria: 'factual' },
          ]
        ),
        leccion(
          'civilizacion-wari-tiahuanaco',
          'Wari y Tiwanaku: Las Raíces del Imperio Inca',
          20,
          'Imagina culturas que ya construían ciudades de piedra y sistemas de irrigación antes que los Incas. Eran los Wari y Tiwanaku: las bases del Tawantinsuyo.',
          'Wari y Tiwanaku eran como los arquitectos que construyeron el cimiento: enseñaron a los Incas cómo organizar espacios y extender imperios.',
          [
            'Wari (600-1100 d.C.): capital en Ayacucho, primer imperio andino',
            'Tiwanaku (400-1000 d.C.): cerca de La Paz, maestros de la piedra',
            'Ambos introdujeron la arquitectura monumental y el cultivo de papas',
            'Wari: urbanismo planificado; Tiwanaku: talla de piedra precisa',
            'Influenciaron directamente a los Incas en organización territorial'
          ],
          'Las culturas Wari y Tiwanaku fueron civilizaciones andinas precolombinas que desarrollaron arquitectura monumental, urbanismo y sistemas agrícolas que influyeron en períodos posteriores.',
          'n/a',
          [
            'Wari: planificación urbana en Hatunmuru',
            'Tiwanaku: Ponce monolith, Kalasasaya',
            'Ambas: difusión de cultivos y cerámica'
          ],
          [
            'Creer que los Incas inventaron todo de cero',
            'No reconocer la diferencia entre ambas culturas',
            'Confundir con las culturas costeras'
          ],
          [
            'Urbanismo andino en planificación moderna',
            'Arqueología andina en investigaciones internacionales',
            'Patrimonio cultural en turismo sostenible'
          ],
          '¿Qué diferencia hay entre el urbanismo Wari y el Tiwanaku?',
          'ejercicio_contextualizado',
          ['Investiga la organización territorial', 'Considera la arquitectura', 'Relaciona con el poder estatal'],
          [
            { paso: 1, descripcion: 'Wari: ciudades planificadas con edificios públicos y viviendas', formulaUsada: 'Urbanismo estatal' },
            { paso: 2, descripcion: 'Tiwanaku: centro ceremonial con pirámides talladas en piedra', resultadoParcial: 'Cultura religiosa centralizada' },
            { paso: 3, descripcion: 'Ambas expandieron su cultura sin conquista territorial directa', resultadoParcial: 'Difusión cultural vs conquista' }
          ],
          '¿Qué cultura construyó el templo Ponce?',
          ['wari', 'tiwanaku', 'inca', 'paracas', 'nazca'],
          [
            { pregunta: '¿Dónde se encontraba la capital del Imperio Wari?', respuestaCorrecta: 'Ayacucho', explicacion: 'La capital era el área de Hatunmuru en Ayacucho.', tipoMemoria: 'factual' },
            { pregunta: '¿Qué caracteriza la arquitectura de Tiwanaku?', respuestaCorrecta: 'Talla precisa de piedra sin mortero', explicacion: 'Los bloques encajan perfectamente.', tipoMemoria: 'factual' },
            { pregunta: '¿Cuál fue el aporte principal de Wari?', respuestaCorrecta: 'Urbanismo planificado', explicacion: 'Organización territorial y urbana.', tipoMemoria: 'conceptual' },
          ]
        ),
        leccion(
          'civilizaciones-costa-peru',
          'Costa Peruvia: Paracas, Nazca y Moche en el Desierto',
          25,
          'Imagina culturas que vivían en medio del desierto más árido del mundo. Cómo lograban cultivar y construir en esas condiciones. Eran maestros de la ingeniería de agua.',
          'Las culturas costeras son como ingenieros del desierto: canalizaban ríos subterráneos y construían Templos que resistían el viento y la sal.',
          [
            'Paracas (800-100 a.C.): primeros en usar textiler avanzado',
            'Nazca (200-600 d.C.): líneas y textiles',
            'Moche (100-800 d.C.): pirámides y cerámica',
            'Chimú (900-1470 d.C.): capitales costeras con almacenamiento',
            'Todos desarrollaron técnicas de extracción de agua en deserto'
          ],
          'Las civilizaciones costeras del Perú (Paracas, Nazca, Moche, Chimú) desarrollaron culturas avanzadas en el desierto, destacando por su arte, arquitectura y sistemas de irrigación.',
          'n/a',
          [
            'Paracas: textiles con 150 colores diferentes',
            'Nazca: puquios para abastecimiento de agua',
            'Moche: Huaca del Sol, casi 70 millones de tejas',
            'Chimú: Chan Chan, ciudad de adobe más grande del mundo'
          ],
          [
            'Confundir culturas de distintas épocas',
            'Creer que el desierto era imposible de habitar',
            'No reconocer innovaciones tecnológicas'
          ],
          [
            'Arquitectura en zonas áridas',
            'Conservación de textiles como patrimonio',
            'Recuperación de sistemas de riego ancestrales'
          ],
          '¿Por qué las culturas costeras desarrollaron textiler tan avanzado?',
          'ejercicio_contextualizado',
          ['Considera el entorno natural del desierto', 'Piensa en la función comunicacional', 'Relaciona con el poder social'],
          [
            { paso: 1, descripcion: 'El desierto carecía de vegetación, pero las algodeneras eran escasas', formulaUsada: 'Textiler como comunicación' },
            { paso: 2, descripcion: 'Los textiles servían como mensajeros, con símbolos de rango y poder', resultadoParcial: 'Identidad visual sin escritura' },
            { paso: 3, descripcion: 'La complejidad técnica reflejaba organización social estatal', resultadoParcial: 'Arte como herramienta política' }
          ],
          '¿Cuál fue la ciudad capital del Chimú?',
          ['paracas', 'nazca', 'moche', 'chimú', 'chan chan'],
          [
            { pregunta: '¿Qué cultura construyó Paracas en la costa sur del Perú?', respuestaCorrecta: 'Paracas', explicacion: 'Paracas se desarrolló del 800 al 100 a.C.', tipoMemoria: 'factual' },
            { pregunta: '¿Por qué los textiles Paracas eran famosos?', respuestaCorrecta: 'Por su colorido y técnica de urdimbre', explicacion: 'Usaban más de 150 colores.', tipoMemoria: 'factual' },
            { pregunta: '¿Cuál era la capital del Chimú?', respuestaCorrecta: 'Chan Chan', explicacion: 'Chan Chan era una ciudad de adobe.', tipoMemoria: 'factual' },
          ]
        ),
      ],
      evaluacionFinal: [
        { pregunta: '¿Cuál civilización precolombina construyó Machu Picchu?', respuestaCorrecta: 'Los Incas', explicacion: 'Fue construida en el siglo XV durante el apogeo del Tawantinsuyo.', tipoMemoria: 'factual' },
        { pregunta: '¿Qué sistema de registro usaban los Incas sin escritura?', respuestaCorrecta: 'Quipu', explicacion: 'Cuerdas con nudos para registrar información contable.', tipoMemoria: 'factual' },
        { pregunta: '¿En qué costa se desarrolló la cultura Moche?', respuestaCorrecta: 'Costa norte del Perú', explicacion: 'Se asentaron en departamentos como Lambayeque y La Libertad.', tipoMemoria: 'factual' },
        { pregunta: '¿Qué diferencia hay entre Wari y Tiwanaku?', respuestaCorrecta: 'Wari: urbanismo planificado; Tiwanaku: talla de piedra precisa', explicacion: 'Wari fue un imperio, Tiwanaku fue una cultura religiosa.', tipoMemoria: 'conceptual' },
        { pregunta: '¿Qué función tenían las líneas de Nazca?', respuestaCorrecta: 'Posiblemente ceremoniales o astronáuticas', explicacion: 'Su función exacta es objeto de debate científico.', tipoMemoria: 'conceptual' },
      ],
    },
    {
      id: 'colonial-peru',
      titulo: 'Perú Colonial: Choque de dos Mundos',
      orden: 2,
      spacedReviewSchedule: ['día 2', 'día 5', 'día 11', 'día 24'],
      lecciones: [
        leccion(
          'conquista-espanola',
          'La Conquista del Perú: El Precio del Oro',
          30,
          'Imagina un pequeño ejército español llegando a un imperio colosal. El oro no es la única herramienta: la traición, la enfermedad y el miedo también conquistan.',
          'La conquista fue como una tormenta: primero trajeron promesas de riquezas, luego destruyeron templos y cambiaron creencias. Pero también sembraron nuevas ideas.',
          [
            '1532: Pizarro llega con 180 hombres a Perú',
            'Secuestran al Inca Atahualpa en Cajamarca (1532)',
            'La gripe mata a miles de indígenas antes de la batalla',
            'Se cae el Imperio Inca con ayuda de alianzas locales',
            'Se impone el dominio colonial español'
          ],
          'La conquista del Perú (1532-1572) fue el proceso por el cual los conquistadores españoles, liderados por Francisco Pizarro, sometieron el Imperio Inca mediante alianzas, traición y superioridad tecnológica.',
          'n/a',
          [
            'Batalla de Cajamarca: Atahualpa capturado en 1532',
            'Muerte de Atahualpa: envenenado en 1533',
            'Batalla de Las Salinas: consolidación de Pizarro (1538)'
          ],
          [
            'Creer que fue solo una batalla militar',
            'Ignorar el papel de enfermedades europeas',
            'No reconocer la participación de pueblos aliados (chanka, cañari)'
          ],
          [
            'Historia colonial en identidad cultural peruana',
            'Análisis de poder y resistencia',
            'Patrimonio cultural como memoria histórica'
          ],
          '¿Fueron suficientes 180 hombres para conquistar un imperio de millones?',
          'problema_resuelto',
          ['Considera los factores estructurales del Imperio', 'Analiza la fragmentación interna', 'Relaciona con enfermedades y alianzas'],
          [
            { paso: 1, descripcion: 'El Imperio Inca atravesaba una guerra civil (Huáscar vs Atahualpa)', resultadoParcial: 'Debilidad interna' },
            { paso: 2, descripcion: 'La gripe española mató a la mitad de la población antes de la batalla', resultadoParcial: 'Colapso demográfico' },
            { paso: 3, descripcion: 'Pizarro alió a pueblos oprimidos por los Incas (chanka, cañari)', resultadoParcial: 'Aliados superiores en tecnología' }
          ],
          '¿Cuál fue el nombre del Inca capturado en Cajamarca?',
          ['conquista', 'pizarra', 'cajamarca', 'atahualpa', 'cuzco'],
          [
            { pregunta: '¿En qué año llegó Pizarro a Perú?', respuestaCorrecta: '1532', explicacion: 'La conquista comenzó en 1532.', tipoMemoria: 'factual' },
            { pregunta: '¿Cómo se llamó la batalla de Cajamarca?', respuestaCorrecta: 'Toma de Cajamarca', explicacion: 'Atahualpa fue capturado en Cajamarca.', tipoMemoria: 'factual' },
            { pregunta: '¿Qué factor no es inmediato en la conquista?', respuestaCorrecta: 'La tecnología de armas', explicacion: 'Armas, enfermedades y alianzas fueron clave.', tipoMemoria: 'conceptual' },
          ]
        ),
        leccion(
          'colonizacion-sistema-esclavitud',
          'Colonización y Sistema de Encomiendas:',
          25,
          'Imagina un sistema donde unos pocos españoles reciben tierras y el derecho a extraer trabajo forzado de indígenas. Ese era el repartimiento y latero encomiendas.',
          'La colonia fue como una fábrica de riquezas: los colonos operaban maquinaria (encomiendas), y los indígenas eran la fuerza motriz sin salario.',
          [
            'Encomienda: derecho a recoger tributos y trabajo de indígenas',
            'Repartimiento: sistema de trabajo forzado rotativo',
            'Reducción: asentamiento forzado para facilitar el control',
            'Mita: trabajo forzado en minas, heredada de los Incas',
            'Nueva Corona de Perú: adminstración colonial'
          ],
          'La colonización peruana instauró sistemas de trabajo forzado (encomienda, mita) y reducciones para controlar la población indígena bajo el Virreinato del Perú.',
          'n/a',
          [
            'Encomienda de los Incas: Atahualpa a regalería Pizarra',
            'Mita de Potosí: miles de indígenas en minas de plata',
            'Reducciones jesuítas: Chiquitanía y Moxos'
          ],
          [
            'Creer que la esclavitud africana fue la única forma de trabajo forzado',
            'No distinguir encomienda de mita',
            'Olvidar resistencias indígenas'
          ],
          [
            'Legislación colonial y derechos indígenas',
            'Economía de dependencia en América Latina',
            'Movimientos sociales contemporáneos'
          ],
          '¿Cuál era la diferencia entre encomienda y mita?',
          'problema_resuelto',
          ['Investiga ambos sistemas de trabajo', 'Considera la geografía', 'Relaciona con el poder colonial'],
          [
            { paso: 1, descripcion: 'Encomienda: derecho a tributos y trabajo de comunidades', formulaUsada: 'Sistema de reparto' },
            { paso: 2, descripcion: 'Mita: trabajo forzado específicamente en minas', resultadoParcial: 'Migración forzada de ayllos' },
            { paso: 3, descripcion: 'La mita era heredada de los Incas pero usada por españoles', resultadoParcial: 'Apropiación de sistemas' }
          ],
          '¿Qué leyó Bolívar sobre la esclavitud?',
          ['encomienda', 'repartimiento', 'mita', 'esclavitud', 'reducción'],
          [
            { pregunta: '¿Qué sistema otorgaba el derecho a recoger tributos de indígenas?', respuestaCorrecta: 'Encomienda', explicacion: 'La encomienda era un derecho de apropiación.', tipoMemoria: 'factual' },
            { pregunta: '¿Para qué se usaba la mita colonial?', respuestaCorrecta: 'Para trabajo forzado en minas', explicacion: 'Especialmente en Potosí.', tipoMemoria: 'factual' },
            { pregunta: '¿Qué intentaba controlar con las reducciones?', respuestaCorrecta: 'La concentración de población indígena', explicacion: 'Facilitaba el control y la conversión.', tipoMemoria: 'conceptual' },
          ]
        ),
        leccion(
          'virreinato-borbones',
          'Virreinato del Perú: El Poder en la Distancia',
          22,
          'Imagina gobernar un Imperio desde una ciudad lejana (Madrid) con comunicaciones que tardan meses. Las decisiones llegan lentas, pero la ambición no espera.',
          'El Virreinato era como un juego de tronos: el rey mandaba desde Madrid, el virrey representaba al rey, y miles de vasallos disputaban poder en las minas y mercados.',
          [
            'El Virreinato del Perú (1542-1824) era el principal territorio colonial español',
            'Capital: Lima, sede del poder colonial',
            'Virrey: representante del rey, con poder absoluto',
            'Sistema de audiencias y corregimientos locales',
            'Reyerta de poderes entre realeros y criollos'
          ],
          'El Virreinato del Perú fue la unidad administrativa colonial que gobernó gran parte de Sudamérica desde Lima, bajo la autoridad del rey de España y su virrey local.',
          'n/a',
          [
            'Las Jornadas de 1821: grito de independencia en Lima',
            'Crisis del 1808 y consecuencias en el Perú',
            'Reinado de las reformas borbónicas y resistencia criolla'
          ],
          [
            'Creer que el virrey era el rey',
            'No distinguir realeros de criollos',
            'Olvidar la importancia de Lima como capital'
          ],
          [
            'Administración colonial en derecho público',
            'Desigualdad social en historia comparada',
            'Independencia como proceso regional'
          ],
          '¿Qué crisis desencadenó la independencia del Perú?',
          'ejercicio_contextualizado',
          ['Considera la crisis del 1808 en España', 'Piensa en las ideas ilustradas', 'Relaciona con el papel de los realistas'],
          [
            { paso: 1, descripcion: 'La muerte de Fernando VII en 1808 creó una crisis de legitimidad', formulaUsada: 'Vacío de poder' },
            { paso: 2, descripcion: 'La Guerra de la Independencia en España dividió lealtades coloniales', resultadoParcial: 'Hijos de razonamiento' },
            { paso: 3, descripcion: 'Los criollos aprovecharon para exigir autonomía', resultadoParcial: 'Grito de 1821 en Lima' }
          ],
          '¿Cuál era la capital del Virreinato del Perú?',
          ['virreinato', 'virrey', 'lima', 'corregimiento', 'audiencia'],
          [
            { pregunta: '¿Qué ciudad era la capital del Virreinato del Perú?', respuestaCorrecta: 'Lima', explicacion: 'Lima fue la capital colonial desde 1535.', tipoMemoria: 'factual' },
            { pregunta: '¿Qué representaba el virrey en el Imperio?', respuestaCorrecta: 'Al rey de España', explicacion: 'El virrey era el delegado real.', tipoMemoria: 'factual' },
            { pregunta: '¿Por qué surgió resistencia a los reyes borbones?', respuestaCorrecta: 'Reformas centralizadoras amenazaban intereses criollos', explicacion: 'Las reformas limitaban poder local.', tipoMemoria: 'conceptual' },
          ]
        ),
        leccion(
          'resistencias-indigenas',
          'Resistencias Indígenas: Las Voces del Despertar',
          26,
          'Imagina comunidades enteras que rechazaron el yugo colonial y lideraron levantamientos. No fue solo los criollos: fueron los pueblos originarios quienes resistieron.',
          'Las resistencias indígenas eran como llamas bajo la arena: cada rebelión era empujada por una cultura profunda que no se apagaba con órdenes coloniales.',
          [
            'Túpac Amaru II (1780-1783): revolución en Tinta, Cusco',
            'Juan Santos Atahua (1744-1746): resistencia amazónica',
            'La quechua Rosa (1763): rebelión en Cajamarca',
            'Micaela Bastidas: líder criolla en la independencia',
            'Todos mostraron que la resistencia era colectiva'
          ],
          'Las resistencias indígenas durante la colonia fueron levantamientos liderados por líderes originarios que rechazaron el dominio colonial y defendían derechos ancestrales.',
          'n/a',
          [
            'Túpac Amaru II: captura y ejecución en Cusco',
            'Camila Oroscuta: líder cusqueña que murió en 1780',
            'La Rebelión de Abajeños en Ayacucho'
          ],
          [
            'Creer que solo los criollos lucharon por la independencia',
            'No reconocer el liderazgo mujer en resistencias',
            'Confundir a Túpac Amaru II con el Inca Túpac Amaru'
          ],
          [
            'Historia de género en luchas sociales',
            'Reclamos territoriales en derecho indígena',
            'Movimiento campesino en el Perú rural'
          ],
          '¿Por qué Túpac Amaru II es más conocido que otros líderes de resistencia?',
          'problema_resuelto',
          ['Investiga el contexto de su rebelión', 'Considera la propaganda colonial', 'Relaciona con el nombre simbólico'],
          [
            { paso: 1, descripcion: 'Túpac Amaru II lideró una revuelta masiva en 1780', formulaUsada: 'Mayor alcance geográfico' },
            { paso: 2, descripcion: 'Usó el nombre de Túpac Amaru, el último Inca, como símbolo de resistencia', resultadoParcial: 'Revindicación ancestral' },
            { paso: 3, descripcion: 'Los realistas lo retrataron como un bandido, pero su legado perdura', resultadoParcial: 'Historia según vencedores' }
          ],
          '¿Qué significa "reclamo de mita"?',
          ['tupac amaru', 'resistencia', 'mita', 'indígena', 'rebelión'],
          [
            { pregunta: '¿Cuándo ocurrió la rebelión de Túpac Amaru II?', respuestaCorrecta: '1780', explicacion: 'Las ejecuciones fueron en 1781.', tipoMemoria: 'factual' },
            { pregunta: '¿Qué líder amazónico resistió en 1744?', respuestaCorrecta: 'Juan Santos Atahua', explicacion: 'Líder de la etnia ashán.', tipoMemoria: 'factual' },
            { pregunta: '¿Cuál fue la causa principal de las resistencias?', respuestaCorrecta: 'Trabajo forzado y encomiendas abusivas', explicacion: 'Abusos del sistema colonial.', tipoMemoria: 'conceptual' },
          ]
        ),
        leccion(
          'economia-colonial',
          'Economía Colonial: El Saqueo Organizado',
          23,
          'Imagina un sistema donde la riqueza del Perú (plata de Potosí) se envía a Europa mientras el Perú paga impuestos. Era el trueque desigual de la colonia.',
          'La economía colonial era como una tubería: toda la plata fluía hacia Europa y muy poco regresaba. El Perú exportaba prima materia y pagaba todo.',
          [
            'Plata de Potosí: motor de la economía colonial',
            'Encomiendas y minas como foco productivo',
            'Sistema de flotas y contrabando',
            'Moneda de plata: Peso y media de plata',
            'Economía de exportación en cadena colonial'
          ],
          'La economía colonial española en el Perú se basó en minería (especialmente plata de Potosí) y agricultura, exportando prima materia a Europa bajo el sistema de flota.',
          'n/a',
          [
            'Potosí: 60,000 mineros en su apogeo',
            'Lima: comercio de ultramar y contrabando',
            'Cajamarca: producción agrícola con encomiendas'
          ],
          [
            'Creer que la colonia era solo minería',
            'No reconocer el contrabando como resistencia económica',
            'Olvidar la dependencia estructural'
          ],
          [
            'Historia económica comparada',
            'Análisis de dependency theory',
            'Economía informal y contrabando'
          ],
          '¿Cómo se mantuvo la economía colonial a pesar del contrabando?',
          'ejercicio_contextualizado',
          ['Analiza el sistema de flotas', 'Considera intereses de poder', 'Relaciona con resistencia local'],
          [
            { paso: 1, descripcion: 'Las flotas garantizaban el envío anual de plata', formulaUsada: 'Gasto en defensa' },
            { paso: 2, descripcion: 'El contrabando satisfacía demandas locales de bienes', resultadoParcial: 'Mercado paralelo' },
            { paso: 3, descripcion: 'La corona toleraba parcialmente el contrabando para evitar resistencia', resultadoParcial: 'Negociación tácita' }
          ],
          '¿Qué metal se extraía en Potosí?',
          ['plata', 'oro', 'cobre', 'estaño', 'mercurio'],
          [
            { pregunta: '¿Cuál fue el mineral más importante en la economía colonial?', respuestaCorrecta: 'Plata de Potosí', explicacion: 'La plata de Potosí impulsó la economía colonial.', tipoMemoria: 'factual' },
            { pregunta: '¿Qué ciudad era el centro minero del Perú colonial?', respuestaCorrecta: 'Potosí', explicacion: 'Potosí era en el actual Bolivia, clave colonial.', tipoMemoria: 'factual' },
            { pregunta: '¿Cómo afectó la economía colonial al Perú?', respuestaCorrecta: 'Exportación de prima materia sin desarrollo local', explicacion: 'Economía de especialización colonial.', tipoMemoria: 'conceptual' },
          ]
        ),
      ],
      evaluacionFinal: [
        { pregunta: '¿Cuál fue la causa inmediata de la conquista del Perú?', respuestaCorrecta: 'La captura de Atahualpa en Cajamarca', explicacion: 'Pizarro secuestró al Inca en 1532.', tipoMemoria: 'factual' },
        { pregunta: '¿Qué sistema de trabajo forzado reemplazó a la esclavitud indígena?', respuestaCorrecta: 'La encomienda y la mita', explicacion: 'Sistemas de labor forzada colonial.', tipoMemoria: 'factual' },
        { pregunta: '¿Qué crisis desencadenó el proceso de independencia?', respuestaCorrecta: 'La crisis de legitimidad al morir Fernando VII', explicacion: 'Crisis del 1808 en España.', tipoMemoria: 'conceptual' },
        { pregunta: '¿Qué metal se extraía en Potosí?', respuestaCorrecta: 'Plata', explicacion: 'La plata impulsó la economía colonial.', tipoMemoria: 'factual' },
        { pregunta: '¿Por qué Túpac Amaru II usó ese nombre?', respuestaCorrecta: 'Para simbolizar resistencia indígena', explicacion: 'Evocaba al último Inca.', tipoMemoria: 'conceptual' },
      ],
    },
    {
      id: 'independencia-peru',
      titulo: 'Perú Libre: La Llama de la Independencia',
      orden: 3,
      spacedReviewSchedule: ['día 3', 'día 7', 'día 16', 'día 30'],
      lecciones: [
        leccion(
          'grito-independencia',
          'El Grito de Libertad: Cuando el Pueblo Decidió Hablar',
          30,
          'Imagina un pueblo cansado de pagar impuestos a una corona que ni ve. Empieza con murmullos, luego gritos, y finalmente una guerra que dura 10 años.',
          'La independencia fue como una canción colectiva: empezó con un susurro (el Perú), creció en voz alta (la idea ilustrada) y finalmente fue un himno (el grito del 28 de julio).',
          [
            '1820: San Martín desembarca en Paracas con 2000 soldados',
            '1821: Se proclama la independencia el 28 de julio',
            '1824: Batalla de Ayacucho sella la independencia definitiva',
            '1829: Santa Cruz promueve la unión de repúblicas sudamericanas',
            'La independencia fue un proceso de 10 años con múltiples actores'
          ],
          'La independencia del Perú fue un proceso revolucionario (1820-1824) que concluyó con la separación del Virreinato del Perú respecto a España, culminado con la Batalla de Ayacucho en 1824.',
          'n/a',
          [
            'Declaración de independencia en el convento de San León (1821)',
            'Batalla de Ayacucho (1824) como conflicto decisivo',
            'Participación de criollos, mestizos y soldados hijos de libertadores'
          ],
          [
            'Creer que fue solo una batalla',
            'Ignorar la participación de mujeres (ej. Micaela Bastidas)',
            'No reconocer influencias de otras revoluciones (Francia, EE.UU.)'
          ],
          [
            'Día de la Firma de la Independencia como efeméride nacional',
            'Moneda nacional: Sol, símbolo de libertad económica',
            'Arquitectura neoclásica como herencia republicana'
          ],
          '¿Qué significa celebrar el 28 de julio si hoy es 5 de agosto?',
          'ejercicio_contextualizado',
          ['Reflexiona sobre el significado simbólico', 'Considera cómo recordar el pasado fortalece la identidad', 'Piensa en cómo la historia conecta con el presente'],
          [
            { paso: 1, descripcion: 'La fecha recuerda un logro colectivo de libertad', resultadoParcial: 'Identidad nacional fundada en valores democráticos' },
            { paso: 2, descripcion: 'Permite aprender de errores históricos', resultadoParcial: 'Construcción ciudadana informada' },
            { paso: 3, descripcion: 'Celebra el sacrificio de quienes lucharon', resultadoParcial: 'Memoria viva como parte del patrimonio cultural' }
          ],
          '¿Cómo influyó la independencia en las lenguas originarias del Perú?',
          ['independencia', 'san martín', 'ayacucho', 'grito de libertad', 'monja de la'],
          [
            { pregunta: '¿Qué día se celebró la independencia del Perú?', respuestaCorrecta: '28 de julio de 1821', explicacion: 'San Martín declaró la independencia tras el desembarco de Paracas.', tipoMemoria: 'factual' },
            { pregunta: '¿Cuál fue la batalla decisiva de la guerra de independencia?', respuestaCorrecta: 'Batalla de Ayacucho', explicacion: 'En 1824, las fuerzas de los próceres derrotaron al ejército realista.', tipoMemoria: 'factual' },
            { pregunta: '¿Quién lideró el desembarco de Paracas?', respuestaCorrecta: 'José de San Martín', explicacion: 'San Martín lideró el ejército libertador desde Argentina.', tipoMemoria: 'factual' },
          ]
        ),
        leccion(
          'batalla-ayacucho',
          'Batalla de Ayacucho: El Final de una Época',
          27,
          'Imagina la última batalla que decide el destino de un imperio entero. En una meseta de Apurímac, 19,000 soldados se enfrentan por la libertad del continente.',
          'La Batalla de Ayacucho fue como un cierre de puerta: tras 10 años de guerra, el ejército realista recibió la noticia definitiva de que la colonia no volvería.',
          [
            '1824: 19.000 soldados en Ayacucho (12.000 realistas, 7.000 patriotas)',
            'Granaderos a Cabo: la carga que cambió el rumbo',
            'Vicente Belón da la orden de carga sin retorno',
            'La rendición fue formal el 10 de diciembre de 1824',
            'Mariscal Antonio José de Sucre fue el comandante general'
          ],
          'La Batalla de Ayacucho (9 de diciembre de 1824) fue el conflicto militar decisivo que puso fin al Imperio español en América, librado cerca de Ayacucho por las fuerzas patriotas lideradas por Antonio José de Sucre.',
          'n/a',
          [
            'Sucre: "¡Viva la libertad! ¡Morir es vencer!"',
            'La bandera de Ayacucho como símbolo continental',
            'La rendición en el templo de San Francisco de Ayacucho'
          ],
          [
            'Creer que fue una batalla sin significado continental',
            'No reconocer la participación de tropas de distintos países',
            'Olvidar los costos humanos'
          ],
          [
            'Identidad sudamericana en historia comparada',
            'Estudios de paz y conflictos',
            'Memoria histórica de los pueblos andinos'
          ],
          '¿Por qué Ayacucho fue la "última batalla" del Imperio español?',
          'problema_resuelto',
          ['Investiga la ubicación geográfica', 'Considera las fuerzas involucradas', 'Relaciona con la independencia de otros países'],
          [
            { paso: 1, descripcion: 'Ayacucho era un punto estratégico en el centro del Virreinato', formulaUsada: 'Geografía defensiva' },
            { paso: 2, descripcion: 'La derrota realista en Ayacucho fue irreversible', resultadoParcial: 'No había refuerzos posibles' },
            { paso: 3, descripcion: 'Aprobando, otros países sudamericanos también lograron independencia', resultadoParcial: 'Fin del imperio colonial continental' }
          ],
          '¿Qué frase gritó Sucre tras la batalla?',
          ['ayacucho', 'sucre', 'belón', 'independencia', 'libertad'],
          [
            { pregunta: '¿Cuándo se libró la Batalla de Ayacucho?', respuestaCorrecta: '1824', explicacion: '9 de diciembre de 1824.', tipoMemoria: 'factual' },
            { pregunta: '¿Quién comandó las fuerzas patriotas?', respuestaCorrecta: 'Antonio José de Sucre', explicacion: 'Mariscal de Ayacucho, comandante general.', tipoMemoria: 'factual' },
            { pregunta: '¿Qué carga decisiva marcó la batalla?', respuestaCorrecta: 'Carga de los Granaderos a Cabo', explicacion: 'La carga sin retorno decidió el resultado.', tipoMemoria: 'factual' },
          ]
        ),
        leccion(
          'principes-libertadores',
          'Los Príncipes Libertadores: Mujeres de la Historia',
          21,
          'Imagina mujeres que tejían banderas y escribían cartas mientras los hombres luchaban. Eran espías, organizadoras y símbolos de la lucha por la libertad.',
          'Las mujeres libertadoras eran como conductoras de la memoria: ocultaban documentos, reunían fondos y mantenían viva la llama de la independencia.',
          [
            'Micaela Bastidas: líder en Túpac Amaru II y esposa de Tupac Amaru',
            'Manuelita Sáenz: espía y amante de Sucre',
            'Policarpa Jiménez: heroína en pastelitos con banderas',
            'María Yáñez: criolla que financió la causa',
            'Todas demostraron que la historia la escriben también las mujeres'
          ],
          'Las mujeres en la independencia del Perú desempeñaron roles de liderazgo, espionaje y apoyo logístico, destacando figuras como Micaela Bastidas, Manuelita Sáenz y Policarpa Jiménez.',
          'n/a',
          [
            'Micaela Bastidas: ejecutada en 1781, mártir del Perú',
            'Manuelita Sáenz: salvó la vida de Sucre en Ayacucho',
            'Policarpa Jiménez: heroína de Pastaza'
          ],
          [
            'Creer que solo los hombres lideraron la independencia',
            'No reconocer el trabajo de espías femeninas',
            'Olvidar la ejecución de Micaela Bastidas'
          ],
          [
            'Historia de género en movimientos de liberación',
            'Mujeres en la milicia y ejército nacional',
            'Memoria histórica de figuras femeninas'
          ],
          '¿Por qué Micaela Bastidas es más recordada en la historia que otros líderes?',
          'problema_resuelto',
          ['Investiga su rol en Túpac Amaru', 'Considera la propaganda', 'Relaciona con su ejecución'],
          [
            { paso: 1, descripcion: 'Micaela lideró la organización del movimiento de 1780', formulaUsada: 'Coordinadora política' },
            { paso: 2, descripcion: 'Su ejecución fue un símbolo de resistencia colonial', resultadoParcial: 'Mártir nacional' },
            { paso: 3, descripcion: 'La historia la recuerda como la madre del proceso independentista', resultadoParcial: 'Figura emblemática' }
          ],
          '¿Qué rol desempeñaban las mujeres en la independencia?',
          ['mujeres', 'libertad', 'micaela', 'espía', 'resistencia'],
          [
            { pregunta: '¿Quién lideró la rebelión de Túpac Amaru II junto con el cacique?', respuestaCorrecta: 'Micaela Bastidas', explicacion: 'Era su esposa y líder política.', tipoMemoria: 'factual' },
            { pregunta: '¿Qué función tenía Manuelita Sáenz en Ayacucho?', respuestaCorrecta: 'Espía y salvó la vida de Sucre', explicacion: 'Alertó del ataque del ejército realista.', tipoMemoria: 'factual' },
            { pregunta: '¿Por qué son importantes las mujeres en la independencia?', respuestaCorrecta: 'Lidiaron, espiaeron y financiaron el movimiento', explicacion: 'Múltiples roles en la lucha.', tipoMemoria: 'conceptual' },
          ]
        ),
        leccion(
          'republica-primera',
          'La Primera República: Soñando con la Libertad',
          24,
          'Imagina un país recién libre escribiendo su primera constitución. Soñaban con justicia, pero también se enfrentaban a caos y divisiones entre poderes.',
          'La primera república fue como un bebé patriota: necesitaba cuidado, reglas claras y un equilibrio entre poderes ejecutivo, legislativo y judicial.',
          [
            '1824-1830: consolidación del gobierno republicano',
            'Inca Garcilaso de la Vega y la primera Constitución (1823)',
            'Divisiones entre congresistas y ejecutivo',
            'Guerra con el Perú de Colo: conflicto con Bolívar',
            'La muerte de San Martín (1850) simboliza el cierre de una era'
          ],
          'La Primera República Peruana (1824-1830) fue el período inicial de la nación independiente, marcado por la consolidación de instituciones republicanas y divisiones políticas.',
          'n/a',
          [
            'Constitución de 1823: federalismo y centralismo',
            'Supremo Cuerpo de Congresuales y su confrontación con la presidencia',
            'Guerra con el Perú de Colo: crisis de 1828'
          ],
          [
            'Creer que la independencia significó paz inmediata',
            'No reconocer las tensiones entre líderes independentistas',
            'Olvidar la importancia de las primeras instituciones'
          ],
          [
            'Historia constitucional comparada',
            'Construcción de la identidad republicana',
            'División entre federalismo y centralismo'
          ],
          '¿Qué problema enfrentó la primera república con su constitución?',
          'ejercicio_contextualizado',
          ['Considera el equilibrio de poderes', 'Analiza las divisiones partidistas', 'Relaciona con crisis internacionales'],
          [
            { paso: 1, descripcion: 'El gobierno federalista chocaba con el centralismo', formulaUsada: 'Crisis de poder' },
            { paso: 2, descripcion: 'La guerra con Colo generó presión internacional', resultadoParcial: 'Unidad nacional demandada' },
            { paso: 3, descripcion: 'San Martín se retiró, creando un vacío de liderazgo', resultadoParcial: 'Inestabilidad institucional' }
          ],
          '¿Qué significa "Supremo Cuerpo de Congresuales"?',
          ['republica', 'constitución', 'congressional', 'federalismo', 'centralismo'],
          [
            { pregunta: '¿Qué fechas se proclama la independencia del Perú?', respuestaCorrecta: '28 de julio de 1821', explicacion: 'San Martín declaró la independencia.', tipoMemoria: 'factual' },
            { pregunta: '¿Cuál fue el primer conflicto internacional de la república?', respuestaCorrecta: 'Guerra con el Perú de Colo', explicacion: 'Crisis de 1828 con Bolívar.', tipoMemoria: 'factual' },
            { pregunta: '¿Qué problema enfrentó la primera república?', respuestaCorrecta: 'Divisiones entre poderes y crisis institucionales', explicacion: 'Luchas entre congresistas y ejecutivo.', tipoMemoria: 'conceptual' },
          ]
        ),
        leccion(
          'proyectos-libertadores',
          'Proyectos Libertadores: Visiones de un Perú Nuevo',
          20,
          'Imagina líderes que sueñan con un Perú distinto: algunos quieren federalismo, otros centralismo. Cada proyecto es una visión de futuro para la nación.',
          'Los proyectos libertadores eran como mapas de ruta alternativos: San Martín veía una monarquía constitucional, Bolívar un gobierno central fuerte, y otros un estado federal.',
          [
            'Proyecto de Monarquía Constitucional (San Martín): monarca europeo',
            'Proyecto Federal (Bolívar y Santander): confederación de estados',
            'Proyecto Centralista (restauración borbónica): poder fuerte en Lima',
            'Tensión entre visión conservative y revolucionaria',
            'La muerte de San Martín abrió el debate sin él'
          ],
          'Durante la independencia y posindependencia del Perú, los líderes propusieron distintos proyectos de organización política: monarquía constitucional, federalismo y centralismo.',
          'n/a',
          [
            'Monarquía de las Nacionaes Unidas: proyecto de Agustín de Iturbide',
            'Federalismo de Bolívar: inspirado en EE.UU. y la federación argentina',
            'Centralismo del periódico El Progreso (Lima)'
          ],
          [
            'Creer que Bolívar fue el único visionario',
            'No distinguir entre proyecto y ideología',
            'Olvidar la participación de San Martín'
          ],
          [
            'Historia política comparada',
            'Ideología y proyecto de nación',
            'Debates constitucionales en América Latina'
          ],
          '¿Por qué San Martín propuso una monarquía constitucional en lugar de una república?',
          'ejercicio_contextualizado',
          ['Considera el contexto de inestabilidad postindependencia', 'Piensa en la idea de orden', 'Relaciona con experiencias europeas'],
          [
            { paso: 1, descripcion: 'San Martín creía que una república requería madurez cívica', formulaUsada: 'Visión pragmática' },
            { paso: 2, descripcion: 'Una monarquía constitucional garantizaría estabilidad', resultadoParcial: 'Orden y progreso' },
            { paso: 3, descripcion: 'La idea fue rechazada por republicanos como Bolívar', resultadoParcial: 'Debate sin resolver' }
          ],
          '¿Qué proyecto defendía Bolívar?',
          ['monarquía', 'federalismo', 'centralismo', 'república', 'proyecto'],
          [
            { pregunta: '¿Qué proyecto propuso San Martín para el Perú?', respuestaCorrecta: 'Monarquía constitucional', explicacion: 'Creía en estabilidad con monarca europeo.', tipoMemoria: 'factual' },
            { pregunta: '¿Quién defendía el federalismo?', respuestaCorrecta: 'Bolívar y Santander', explicacion: 'Los libertadores federales buscaban confederaciones.', tipoMemoria: 'factual' },
            { pregunta: '¿Por qué hubo tensión entre los proyectos?', respuestaCorrecta: 'Visiones distintas de organización política', explicacion: 'Cada líder tenía un sueño para la nación.', tipoMemoria: 'conceptual' },
          ]
        ),
      ],
      evaluacionFinal: [
        { pregunta: '¿Cuándo se celebró la Batalla de Ayacucho?', respuestaCorrecta: '9 de diciembre de 1824', explicacion: 'Batalla decisiva que puso fin a la colonia.', tipoMemoria: 'factual' },
        { pregunta: '¿Quién fue el comandante de la Batalla de Ayacucho?', respuestaCorrecta: 'Antonio José de Sucre', explicacion: 'Mariscal de Ayacucho, líder patria.', tipoMemoria: 'factual' },
        { pregunta: '¿Qué problema enfrentó la Primera República?', respuestaCorrecta: 'Divisiones entre poderes y crisis institucionales', explicacion: 'Luchas entre congresistas y ejecutivo.', tipoMemoria: 'conceptual' },
        { pregunta: '¿Cuál fue el primer conflicto internacional de la república?', respuestaCorrecta: 'Guerra con el Perú de Colo', explicacion: 'Crisis de 1828 con Bolívar.', tipoMemoria: 'factual' },
        { pregunta: '¿Por qué San Martín propuso una monarquía constitucional?', respuestaCorrecta: 'Creía que una república requería madurez cívica', explicacion: 'Visión pragmática de estabilidad.', tipoMemoria: 'conceptual' },
      ],
    },
  ],
};
