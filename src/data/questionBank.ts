export interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface SubjectBank {
  id: string;
  label: string;
  icon: string;
  color: string;
  primaria: Question[];
  secundaria: Question[];
}

export const BANK: SubjectBank[] = [
  {
    id: 'matematicas',
    label: 'Matemáticas',
    icon: '∫',
    color: 'from-primary-500 to-primary-700',
    primaria: [
      { question: '¿Cuánto es 45 + 37?', options: ['72', '82', '73', '92'], correct: 1, explanation: '45 + 37: 5+7=12, escribo 2 y llevo 1; 4+3+1=8 → resultado 82' },
      { question: '¿Cuánto es 9 × 7?', options: ['54', '56', '63', '72'], correct: 2, explanation: '9 × 7 = 63. Puedes recordarlo: 7×9 = 63' },
      { question: '¿Cuánto es 144 ÷ 12?', options: ['10', '11', '12', '13'], correct: 2, explanation: '144 ÷ 12 = 12, porque 12 × 12 = 144' },
      { question: '¿Qué fracción representa la mitad de 1?', options: ['1/3', '2/4', '1/4', '3/4'], correct: 1, explanation: '2/4 = 1/2, que es exactamente la mitad. 1/2 y 2/4 son fracciones equivalentes.' },
      { question: '¿Cuántos lados tiene un hexágono?', options: ['5', '6', '7', '8'], correct: 1, explanation: 'Un hexágono tiene 6 lados. "Hexa" en griego significa seis.' },
      { question: '¿Cuánto es 25% de 80?', options: ['15', '20', '25', '30'], correct: 1, explanation: '25% = 1/4. Entonces 80 ÷ 4 = 20' },
      { question: 'Si tengo 3 docenas de huevos, ¿cuántos huevos tengo?', options: ['24', '30', '36', '48'], correct: 2, explanation: 'Una docena = 12. Entonces 3 × 12 = 36 huevos.' },
      { question: '¿Qué número es el siguiente en la serie: 2, 4, 8, 16, ___?', options: ['24', '18', '32', '20'], correct: 2, explanation: 'La serie se multiplica por 2: 2×2=4, 4×2=8, 8×2=16, 16×2=32' },
      { question: 'Un rectángulo mide 8 cm de largo y 5 cm de ancho. ¿Cuál es su perímetro?', options: ['40 cm', '26 cm', '13 cm', '30 cm'], correct: 1, explanation: 'Perímetro = 2×(largo + ancho) = 2×(8+5) = 2×13 = 26 cm' },
      { question: '¿Cuánto es 3² + 4²?', options: ['49', '25', '14', '7'], correct: 1, explanation: '3² = 9 y 4² = 16. Entonces 9 + 16 = 25' },
    ],
    secundaria: [
      { question: 'Resuelve: 3x - 7 = 2x + 5', options: ['x = 12', 'x = 2', 'x = -2', 'x = 7'], correct: 0, explanation: '3x - 2x = 5 + 7 → x = 12. Verificación: 3(12)-7 = 29 y 2(12)+5 = 29 ✓' },
      { question: '¿Cuál es el resultado de (2x + 3)²?', options: ['4x² + 9', '4x² + 12x + 9', '4x² + 6x + 9', '2x² + 12x + 9'], correct: 1, explanation: 'Usando (a+b)² = a² + 2ab + b²: (2x)² + 2(2x)(3) + 3² = 4x² + 12x + 9' },
      { question: '¿Cuánto es lim(x→3) (x² - 9)/(x - 3)?', options: ['0', '3', '6', 'No existe'], correct: 2, explanation: 'Factorizando: (x+3)(x-3)/(x-3) = x+3. Cuando x→3: 3+3 = 6' },
      { question: 'En el sistema { x + y = 8 ; x - y = 2 }, ¿cuánto vale x?', options: ['3', '4', '5', '6'], correct: 2, explanation: 'Sumando las ecuaciones: 2x = 10 → x = 5. Luego y = 3.' },
      { question: '¿Cuál es la derivada de f(x) = 4x³ - 2x?', options: ['12x² - 2', '4x² - 2', '12x - 2', '4x³ - 2'], correct: 0, explanation: 'Aplicando regla de la potencia: d/dx(4x³) = 12x², d/dx(-2x) = -2 → f\'(x) = 12x² - 2' },
      { question: '¿Cuánto mide la hipotenusa de un triángulo rectángulo con catetos 7 y 24?', options: ['25', '26', '31', '√527'], correct: 0, explanation: '7² + 24² = 49 + 576 = 625 = 25². La hipotenusa mide 25.' },
      { question: 'Simplifica: (x² - 4) / (x + 2)', options: ['x + 2', 'x - 2', 'x² - 2', 'x'], correct: 1, explanation: 'x² - 4 = (x+2)(x-2). Dividiendo entre (x+2): resultado x - 2' },
      { question: '¿Cuánto es log₂(32)?', options: ['4', '5', '6', '16'], correct: 1, explanation: '2⁵ = 32, entonces log₂(32) = 5' },
      { question: 'Una circunferencia tiene área 36π cm². ¿Cuánto mide su radio?', options: ['4 cm', '6 cm', '9 cm', '12 cm'], correct: 1, explanation: 'A = πr² → 36π = πr² → r² = 36 → r = 6 cm' },
      { question: 'Si f(x) = x² - 3x + 2, ¿cuáles son sus raíces?', options: ['x=1 y x=2', 'x=-1 y x=-2', 'x=1 y x=-2', 'x=-1 y x=2'], correct: 0, explanation: 'Factorizando: (x-1)(x-2)=0 → x=1 ó x=2' },
    ],
  },
  {
    id: 'fisica', label: 'Física', icon: '⚡', color: 'from-cyan-500 to-cyan-700',
    primaria: [
      { question: '¿Qué es la gravedad?', options: ['Una fuerza que repele los objetos', 'La fuerza que atrae los objetos hacia la Tierra', 'Un tipo de energía', 'El movimiento del viento'], correct: 1, explanation: 'La gravedad es la fuerza de atracción que ejerce la Tierra sobre todos los objetos, jalándolos hacia abajo.' },
      { question: 'Si un auto viaja a 60 km/h durante 2 horas, ¿qué distancia recorre?', options: ['30 km', '62 km', '120 km', '180 km'], correct: 2, explanation: 'Distancia = velocidad × tiempo = 60 km/h × 2 h = 120 km' },
      { question: '¿Cuál es la unidad de medida de la fuerza?', options: ['Metro', 'Kilogramo', 'Newton', 'Julio'], correct: 2, explanation: 'La fuerza se mide en Newtons (N), en honor al científico Isaac Newton.' },
      { question: '¿Qué tipo de energía tiene una pelota en movimiento?', options: ['Energía potencial', 'Energía cinética', 'Energía química', 'Energía eléctrica'], correct: 1, explanation: 'La energía cinética es la energía asociada al movimiento. Cualquier objeto en movimiento la tiene.' },
      { question: '¿Qué pasa con el agua cuando se enfría por debajo de 0°C?', options: ['Se evapora', 'Se congela y se convierte en hielo', 'Se vuelve vapor', 'No cambia'], correct: 1, explanation: 'A 0°C o menos, el agua se congela y pasa al estado sólido (hielo). Es un cambio de estado físico.' },
      { question: '¿Cuál de estos objetos es un buen conductor eléctrico?', options: ['Madera', 'Plástico', 'Cobre', 'Goma'], correct: 2, explanation: 'El cobre es un excelente conductor eléctrico, por eso se usa en cables eléctricos.' },
      { question: '¿Cuántos estados de la materia conoces principalmente?', options: ['2', '3', '4', '5'], correct: 1, explanation: 'Los 3 estados principales son: sólido, líquido y gaseoso. (El plasma es el 4º pero se estudia después)' },
      { question: 'Si sueltas una pluma y una piedra al mismo tiempo desde la misma altura en el vacío (sin aire), ¿qué ocurre?', options: ['La piedra cae primero', 'La pluma cae primero', 'Caen al mismo tiempo', 'Ninguna cae'], correct: 2, explanation: 'Sin resistencia del aire, todos los objetos caen con la misma aceleración gravitacional (g = 9.8 m/s²). ¡Lo demostró Galileo!' },
      { question: '¿Qué es el sonido?', options: ['Un tipo de luz', 'Una vibración que viaja por el aire', 'Una forma de electricidad', 'Un tipo de calor'], correct: 1, explanation: 'El sonido es una vibración (onda mecánica) que necesita un medio (aire, agua, sólidos) para viajar.' },
      { question: '¿Cuál es la velocidad aproximada de la luz?', options: ['300 km/s', '300,000 km/s', '3,000 km/s', '30 km/s'], correct: 1, explanation: 'La velocidad de la luz es aproximadamente 300,000 km/s (3×10⁸ m/s), la velocidad más alta del universo.' },
    ],
    secundaria: [
      { question: 'Un auto parte del reposo con a = 4 m/s². ¿Qué velocidad tiene a los 5 s?', options: ['9 m/s', '20 m/s', '25 m/s', '45 m/s'], correct: 1, explanation: 'v = v₀ + at = 0 + 4×5 = 20 m/s' },
      { question: '¿Cuál es la fuerza sobre un objeto de 15 kg con aceleración 6 m/s²?', options: ['21 N', '2.5 N', '90 N', '9 N'], correct: 2, explanation: 'F = m × a = 15 × 6 = 90 N (Segunda ley de Newton)' },
      { question: 'Una piedra cae libremente desde 80 m. ¿Cuánto tarda en llegar? (g=10)', options: ['4 s', '8 s', '16 s', '40 s'], correct: 0, explanation: 'h = ½gt² → 80 = ½(10)t² → t² = 16 → t = 4 s' },
      { question: 'Un resorte tiene constante k = 200 N/m. ¿Cuánto se estira con 50 N?', options: ['0.10 m', '0.25 m', '0.50 m', '4 m'], correct: 1, explanation: 'Ley de Hooke: F = k·x → x = F/k = 50/200 = 0.25 m' },
      { question: '¿Cuál es la energía cinética de un objeto de 2 kg a 6 m/s?', options: ['12 J', '24 J', '36 J', '72 J'], correct: 2, explanation: 'Ec = ½mv² = ½(2)(6²) = ½(2)(36) = 36 J' },
      { question: '¿Qué ley de Newton explica que sin fuerza neta, un objeto en movimiento sigue moviéndose?', options: ['1ª Ley (Inercia)', '2ª Ley (F=ma)', '3ª Ley (Acción-Reacción)', 'Ley de Gravitación Universal'], correct: 0, explanation: 'La 1ª Ley de Newton (principio de inercia): un objeto mantiene su estado de reposo o movimiento uniforme si la fuerza neta es cero.' },
      { question: 'Un objeto de 500 g está a 10 m de altura. ¿Cuál es su energía potencial? (g=10)', options: ['5 J', '50 J', '500 J', '5000 J'], correct: 1, explanation: 'Ep = mgh = 0.5 kg × 10 m/s² × 10 m = 50 J' },
      { question: 'Una onda tiene frecuencia 440 Hz y velocidad 340 m/s. ¿Cuál es su longitud de onda?', options: ['≈ 0.77 m', '≈ 1.29 m', '≈ 7.7 m', '≈ 780 m'], correct: 0, explanation: 'v = f·λ → λ = v/f = 340/440 ≈ 0.77 m' },
      { question: 'Si duplicas la velocidad de un objeto, ¿cómo cambia su energía cinética?', options: ['Se duplica', 'Se triplica', 'Se cuadruplica', 'Se multiplica por 8'], correct: 2, explanation: 'Ec = ½mv². Si v→2v: Ec\' = ½m(2v)² = 4(½mv²). La Ec se cuadruplica.' },
      { question: 'Calcula la presión de 200 N sobre una superficie de 0.5 m².', options: ['100 Pa', '400 Pa', '100 N', '0.0025 Pa'], correct: 1, explanation: 'P = F/A = 200/0.5 = 400 Pa (Pascales)' },
    ],
  },
  {
    id: 'quimica', label: 'Química', icon: '⚗️', color: 'from-emerald-500 to-emerald-700',
    primaria: [
      { question: '¿Qué es una mezcla?', options: ['Una sustancia pura', 'La unión de dos o más sustancias que se pueden separar', 'Un nuevo elemento', 'Agua con sal que no se puede separar'], correct: 1, explanation: 'Una mezcla combina dos o más sustancias que conservan sus propiedades y se pueden separar por métodos físicos (filtración, destilación, etc.).' },
      { question: '¿Cuál es la fórmula química del agua?', options: ['HO', 'H₂O', 'OH₂', 'H₂O₂'], correct: 1, explanation: 'El agua está formada por 2 átomos de Hidrógeno (H₂) y 1 átomo de Oxígeno (O): H₂O' },
      { question: '¿Cómo se llama el proceso por el que el agua pasa de líquido a gas?', options: ['Condensación', 'Fusión', 'Evaporación', 'Solidificación'], correct: 2, explanation: 'La evaporación (o vaporización) es el cambio de estado del agua de líquido a gas (vapor de agua).' },
      { question: '¿Cuál de estas es una sustancia pura?', options: ['Aire', 'Agua de mar', 'Leche', 'Agua destilada'], correct: 3, explanation: 'El agua destilada (H₂O pura) es una sustancia pura. El aire, el agua de mar y la leche son mezclas.' },
      { question: '¿Qué símbolo representa al Oxígeno en la tabla periódica?', options: ['Ox', 'O', 'Og', 'On'], correct: 1, explanation: 'El Oxígeno se representa con la letra O. Número atómico 8, es esencial para la respiración.' },
      { question: '¿Qué le pasa al azúcar cuando la disuelves en agua?', options: ['Desaparece para siempre', 'Se separa fácilmente', 'Se disuelve formando una solución', 'Se convierte en sal'], correct: 2, explanation: 'El azúcar se disuelve en el agua formando una solución (mezcla homogénea). El azúcar sigue ahí, pero no se ve.' },
      { question: '¿Qué es un átomo?', options: ['La partícula más pequeña de la materia que conserva las propiedades de un elemento', 'Una molécula de agua', 'Un tipo de metal', 'Una sustancia líquida'], correct: 0, explanation: 'El átomo es la unidad básica de la materia. Cada elemento (como el Hierro, el Oxígeno) está formado por sus propios átomos.' },
      { question: '¿Cuál es el gas que los humanos necesitamos para respirar?', options: ['Dióxido de carbono (CO₂)', 'Nitrógeno (N₂)', 'Oxígeno (O₂)', 'Hidrógeno (H₂)'], correct: 2, explanation: 'Respiramos Oxígeno (O₂) para que nuestras células produzcan energía. Exhalamos Dióxido de Carbono (CO₂).' },
      { question: 'Si mezclas vinagre (ácido) y bicarbonato de sodio (base), ¿qué observas?', options: ['Nada', 'Se forma hielo', 'Burbujas de gas (reacción química)', 'Se vuelve más salado'], correct: 2, explanation: 'Es una reacción ácido-base que produce CO₂ (burbujas), agua y acetato de sodio. Es una reacción química.' },
      { question: '¿Cuántos átomos de hidrógeno tiene una molécula de agua (H₂O)?', options: ['1', '2', '3', '4'], correct: 1, explanation: 'En H₂O, el subíndice 2 indica que hay 2 átomos de Hidrógeno y 1 átomo de Oxígeno.' },
    ],
    secundaria: [
      { question: 'Un átomo tiene Z=17 y A=35. ¿Cuántos neutrones tiene?', options: ['17', '18', '35', '52'], correct: 1, explanation: 'N = A - Z = 35 - 17 = 18 neutrones' },
      { question: '¿Cuántos moles hay en 36 g de H₂O? (M=18 g/mol)', options: ['1 mol', '2 mol', '0.5 mol', '18 mol'], correct: 1, explanation: 'n = m/M = 36/18 = 2 moles' },
      { question: '¿Qué tipo de enlace forman Na y Cl?', options: ['Covalente polar', 'Iónico', 'Metálico', 'Covalente apolar'], correct: 1, explanation: 'Na (metal) cede 1 electrón a Cl (no metal). Transferencia de electrones → enlace iónico → NaCl' },
      { question: 'Balancea: H₂ + O₂ → H₂O. ¿Cuál es la ecuación balanceada?', options: ['H₂ + O₂ → H₂O', '2H₂ + O₂ → 2H₂O', 'H₂ + 2O₂ → 2H₂O', '4H₂ + O₂ → 2H₂O'], correct: 1, explanation: '2H₂ + O₂ → 2H₂O. Izquierda: 4H + 2O. Derecha: 4H + 2O. ¡Balanceado!' },
      { question: '¿Cuál es el grupo de los halógenos en la tabla periódica?', options: ['Grupo 1', 'Grupo 2', 'Grupo 17', 'Grupo 18'], correct: 2, explanation: 'Los halógenos (F, Cl, Br, I, At) están en el Grupo 17. Son muy reactivos y forman sales con metales.' },
      { question: 'El pH de una solución ácida es:', options: ['Mayor a 7', 'Igual a 7', 'Menor a 7', 'Siempre 0'], correct: 2, explanation: 'pH < 7 → ácido, pH = 7 → neutro, pH > 7 → básico/alcalino. El HCl tiene pH ≈ 1.' },
      { question: '¿Cuántas moléculas hay en 1 mol de CO₂?', options: ['6.022×10²³', '3.011×10²³', '1.204×10²⁴', '44'], correct: 0, explanation: '1 mol de cualquier sustancia contiene 6.022×10²³ partículas (Número de Avogadro).' },
      { question: 'En la reacción de oxidación, un átomo:', options: ['Gana electrones', 'Pierde electrones', 'Gana protones', 'Pierde neutrones'], correct: 1, explanation: 'OXIDACIÓN = Pérdida de electrones. REDUCCIÓN = Ganancia de electrones. Regla OIL-RIG.' },
      { question: '¿Cuál es la masa molar del NaCl? (Na=23, Cl=35.5)', options: ['58.5 g/mol', '23 g/mol', '35.5 g/mol', '45 g/mol'], correct: 0, explanation: 'M(NaCl) = M(Na) + M(Cl) = 23 + 35.5 = 58.5 g/mol' },
      { question: '¿Qué propiedad periódica aumenta de izquierda a derecha en un período?', options: ['Radio atómico', 'Carácter metálico', 'Electronegatividad', 'Número de capas'], correct: 2, explanation: 'La electronegatividad aumenta de izquierda a derecha (↑ atracción de electrones). El Flúor es el más electronegativo.' },
    ],
  },
  {
    id: 'historia', label: 'Historia', icon: '🏛️', color: 'from-amber-500 to-amber-700',
    primaria: [
      { question: '¿Quiénes fueron los Incas?', options: ['Un pueblo de Europa', 'Una civilización poderosa de América del Sur', 'Un grupo de piratas', 'Los primeros habitantes de México'], correct: 1, explanation: 'Los Incas formaron el Tawantinsuyu, el Imperio más grande de América precolombina, con capital en Cusco, Perú.' },
      { question: '¿En qué año se declaró la Independencia del Perú?', options: ['1492', '1776', '1821', '1900'], correct: 2, explanation: 'José de San Martín proclamó la Independencia del Perú el 28 de julio de 1821 en Lima.' },
      { question: '¿Qué civilización construyó Machu Picchu?', options: ['Los Aztecas', 'Los Mayas', 'Los Incas', 'Los Romanos'], correct: 2, explanation: 'Machu Picchu fue construida por los Incas alrededor del siglo XV. Está ubicada en Cusco, Perú.' },
      { question: '¿Quién llegó a América en 1492?', options: ['Francisco Pizarro', 'Cristóbal Colón', 'Hernán Cortés', 'Simón Bolívar'], correct: 1, explanation: 'Cristóbal Colón llegó a América el 12 de octubre de 1492, creyendo que había llegado a las Indias.' },
      { question: '¿Cuál era la capital del Imperio Inca?', options: ['Lima', 'Cusco', 'Arequipa', 'Chan Chan'], correct: 1, explanation: 'Cusco ("ombligo del mundo" en quechua) fue la capital y centro político, religioso y cultural del Tawantinsuyu.' },
      { question: '¿Cómo se llamaba el gobernante máximo del Imperio Inca?', options: ['Faraón', 'Emperador', 'Sapa Inca', 'Cacique'], correct: 2, explanation: 'El Sapa Inca era el gobernante supremo, considerado hijo del Sol (Inti). El más famoso fue Pachacútec.' },
      { question: '¿Qué país colonizó el Perú durante casi 300 años?', options: ['Portugal', 'Francia', 'España', 'Inglaterra'], correct: 2, explanation: 'España colonizó el Perú desde 1532 (Conquista) hasta 1821 (Independencia), estableciendo el Virreinato del Perú.' },
      { question: '¿Quién conquistó el Imperio Inca?', options: ['Hernán Cortés', 'Francisco Pizarro', 'Cristóbal Colón', 'Simón Bolívar'], correct: 1, explanation: 'Francisco Pizarro llegó al Perú en 1532 y capturó al Sapa Inca Atahualpa en Cajamarca, iniciando la conquista.' },
      { question: '¿Qué son las Líneas de Nazca?', options: ['Pirámides mayas', 'Geoglifos gigantes en la costa peruana', 'Templos incas', 'Canales de riego aztecas'], correct: 1, explanation: 'Las Líneas de Nazca son enormes figuras y líneas dibujadas en el desierto del sur del Perú por la cultura Nazca, solo visibles desde el aire.' },
      { question: '¿En qué continente se desarrolló la civilización del Antiguo Egipto?', options: ['Asia', 'Europa', 'América', 'África'], correct: 3, explanation: 'El Antiguo Egipto se desarrolló en el nordeste de África, a orillas del río Nilo.' },
    ],
    secundaria: [
      { question: '¿En qué año se produjo la Batalla de Ayacucho?', options: ['1820', '1821', '1824', '1826'], correct: 2, explanation: 'La Batalla de Ayacucho (9 de diciembre de 1824) fue el último gran enfrentamiento de las guerras de independencia hispanoamericanas.' },
      { question: '¿Cuál cultura preincaica es conocida por sus textiles y trepanaciones craneanas?', options: ['Nazca', 'Chavín', 'Paracas', 'Mochica'], correct: 2, explanation: 'La cultura Paracas (costa sur del Perú) destacó por sus extraordinarios textiles multicolores y por realizar trepanaciones craneanas con fines médicos.' },
      { question: '¿Qué sistema de trabajo forzado usaron los españoles en el Virreinato?', options: ['Encomienda', 'Mita', 'Yanacona', 'Obraje'], correct: 1, explanation: 'La Mita era el trabajo forzado de los indígenas, principalmente en minas como Potosí. Fue la base económica del Virreinato.' },
      { question: '¿Quién lideró la Batalla de Ayacucho?', options: ['José de San Martín', 'Simón Bolívar', 'Antonio José de Sucre', 'Ramón Castilla'], correct: 2, explanation: 'El Mariscal Antonio José de Sucre lideró las fuerzas patriotas en Ayacucho, mientras Bolívar permanecía en Lima.' },
      { question: '¿Qué cultura preincaica construyó Chan Chan, la mayor ciudad de adobe del mundo?', options: ['Wari', 'Tiahuanaco', 'Chimú', 'Mochica'], correct: 2, explanation: 'La cultura Chimú tuvo su capital en Chan Chan, en la costa norte del Perú, cerca del actual Trujillo.' },
      { question: '¿Cómo se llama el período histórico peruano antes de la llegada de los españoles?', options: ['Colonial', 'Prehispánico', 'Republicano', 'Moderno'], correct: 1, explanation: 'El período prehispánico comprende toda la historia del Perú antes de la llegada de los españoles en 1532.' },
      { question: '¿Qué fue el Grito de Independencia del Perú?', options: ['Una batalla', 'La proclamación de la independencia el 28 de julio de 1821', 'Una ley colonial', 'Una rebelión indígena'], correct: 1, explanation: 'El 28 de julio de 1821, el General José de San Martín proclamó la Independencia del Perú en Lima, siendo su primer día como nación libre.' },
      { question: '¿Cuál fue la cultura que representó el primer horizonte cultural andino?', options: ['Wari', 'Chavín', 'Tiahuanaco', 'Inca'], correct: 1, explanation: 'Chavín de Huántar (900-200 a.C.) representa el Horizonte Temprano, la primera gran cultura pan-andina con influencia desde la costa hasta la selva.' },
      { question: '¿En qué siglo llegó Francisco Pizarro al Perú?', options: ['Siglo XIV', 'Siglo XV', 'Siglo XVI', 'Siglo XVII'], correct: 2, explanation: 'Pizarro llegó al Perú en 1532, que corresponde al siglo XVI (los siglos se cuentan del 1 al 100, del 101 al 200, etc.).' },
      { question: '¿Qué papel tuvo Simón Bolívar en la independencia peruana?', options: ['Fue el primer presidente', 'Apoyó militarmente y liberó el norte del Perú', 'Firmó la independencia en Lima', 'Derrotó a los incas'], correct: 1, explanation: 'Bolívar llegó al Perú en 1823, organizó el ejército libertador y con Sucre venció a los realistas en Junín y Ayacucho (1824).' },
    ],
  },
  {
    id: 'comunicacion', label: 'Comunicación', icon: '📚', color: 'from-violet-500 to-violet-700',
    primaria: [
      { question: '¿Qué es un sustantivo?', options: ['Una acción o estado', 'Una palabra que nombra personas, animales, cosas o lugares', 'Una palabra que modifica al verbo', 'Una conjunción'], correct: 1, explanation: 'El sustantivo es la clase de palabras que nombra seres, objetos, lugares y conceptos. Ej: perro, Lima, amor, mesa.' },
      { question: '¿Cuál de estas palabras es un adjetivo?', options: ['correr', 'rápidamente', 'veloz', 'el'], correct: 2, explanation: '"Veloz" es un adjetivo porque describe una cualidad (cómo es algo). Modifica a un sustantivo: "el auto veloz".' },
      { question: '¿Qué tiene que tener toda oración para ser completa?', options: ['Solo un sujeto', 'Solo un predicado', 'Un sujeto y un predicado', 'Un adjetivo y un sustantivo'], correct: 2, explanation: 'Una oración completa tiene sujeto (quién realiza la acción) y predicado (qué hace o cómo es el sujeto).' },
      { question: '¿Qué tipo de texto es una receta de cocina?', options: ['Narrativo', 'Descriptivo', 'Instructivo', 'Argumentativo'], correct: 2, explanation: 'Una receta es un texto instructivo porque da instrucciones paso a paso para realizar algo (en este caso, preparar un plato).' },
      { question: 'En la oración "El gato negro duerme", ¿cuál es el sujeto?', options: ['El gato', 'El gato negro', 'duerme', 'negro duerme'], correct: 1, explanation: '"El gato negro" es el sujeto completo (núcleo: gato + modificadores: el, negro). "Duerme" es el predicado.' },
      { question: '¿Qué es una metáfora?', options: ['Una exageración', 'Una comparación usando "como" o "cual"', 'Decir que algo es otra cosa sin usar "como"', 'Una pregunta retórica'], correct: 2, explanation: 'La metáfora dice que algo ES otra cosa: "Tus ojos son luceros" (no usa "como"). Si usara "como" sería un símil.' },
      { question: '¿Cuál de estas palabras está mal escrita?', options: ['Vaca', 'Haver', 'Haber', 'Saber'], correct: 1, explanation: '"Haver" no existe en español. Lo correcto es "haber" (con h y b). Ej: "Debe haber un error".' },
      { question: '¿Qué es la tilde o acento ortográfico?', options: ['Un signo de puntuación', 'La marca (´) que indica la sílaba tónica de algunas palabras', 'Una letra especial', 'El punto final de una oración'], correct: 1, explanation: 'La tilde (´) es la marca gráfica que indica la sílaba más fuerte (tónica) en palabras que lo requieren según las reglas de acentuación.' },
      { question: 'Lee: "Era una noche fría y oscura; las estrellas brillaban como diamantes." ¿Qué tipo de texto es?', options: ['Descriptivo', 'Argumentativo', 'Instructivo', 'Expositivo'], correct: 0, explanation: 'Es un texto descriptivo porque pinta con palabras cómo es una escena (fría, oscura, estrellas brillando).' },
      { question: '¿Cuántas sílabas tiene la palabra "mariposa"?', options: ['3', '4', '5', '6'], correct: 1, explanation: 'ma-ri-po-sa = 4 sílabas. Cada sílaba se forma alrededor de una vocal.' },
    ],
    secundaria: [
      { question: '¿Qué figura literaria representa la siguiente frase: "El tiempo es oro"?', options: ['Hipérbole', 'Metáfora', 'Símil', 'Personificación'], correct: 1, explanation: '"El tiempo es oro" es una metáfora: se afirma que el tiempo ES oro (sin "como"). Si dijera "como oro" sería un símil.' },
      { question: '¿Cuál es la idea principal de un texto?', options: ['La primera oración siempre', 'La oración más larga', 'La idea central que sustenta todo el texto', 'El título del texto'], correct: 2, explanation: 'La idea principal es el mensaje central del texto, en torno al cual se organiza el resto de la información.' },
      { question: '¿Qué es un texto argumentativo?', options: ['El que cuenta una historia', 'El que da instrucciones', 'El que defiende una postura con razones y evidencias', 'El que describe lugares'], correct: 2, explanation: 'El texto argumentativo busca convencer al lector de una tesis usando argumentos, datos y ejemplos.' },
      { question: '¿Qué tipo de narrador usa la 1ª persona gramatical?', options: ['Narrador omnisciente', 'Narrador protagonista', 'Narrador testigo en 3ª persona', 'Narrador objetivo'], correct: 1, explanation: 'El narrador protagonista (1ª persona) usa "yo" y es el personaje principal que narra su propia historia.' },
      { question: '"Sus ojos eran dos luceros brillantes." ¿Qué figura literaria es?', options: ['Hipérbole', 'Anáfora', 'Metáfora', 'Ironía'], correct: 2, explanation: 'Es una metáfora: los ojos son identificados con luceros (sin usar "como"). La comparación directa sin nexo.' },
      { question: '¿Qué es la coherencia en un texto?', options: ['El uso correcto de tildes', 'La unidad temática y lógica entre las ideas del texto', 'La variedad de vocabulario', 'El uso de conectores'], correct: 1, explanation: 'La coherencia es la propiedad del texto que hace que todas sus partes estén relacionadas y tengan sentido como un todo.' },
      { question: '¿Cuál es la estructura básica de un párrafo argumentativo?', options: ['Introducción - Nudo - Desenlace', 'Tesis - Argumentos - Conclusión', 'Título - Cuerpo - Notas', 'Planteo - Desarrollo - Cierre emocional'], correct: 1, explanation: 'Un párrafo argumentativo tiene: Tesis (idea a defender), Argumentos (razones y evidencias) y Conclusión (cierre reforzando la tesis).' },
      { question: '¿Qué significa la inferencia en comprensión lectora?', options: ['Copiar información del texto', 'Deducir información no explícita a partir de pistas del texto', 'Resumir el texto', 'Identificar las palabras desconocidas'], correct: 1, explanation: 'Inferir es ir más allá de lo escrito: usar pistas del texto y el conocimiento previo para deducir información implícita.' },
      { question: '¿Qué recurso usa la frase: "Mil veces te he pedido que llegues a tiempo"?', options: ['Metáfora', 'Anáfora', 'Hipérbole', 'Símil'], correct: 2, explanation: 'Es una hipérbole: exageración intencional ("mil veces") para enfatizar una idea o emoción.' },
      { question: '¿Cuál es la diferencia entre lengua y habla según Saussure?', options: ['Son lo mismo', 'Lengua es el sistema compartido; habla es el uso individual', 'Habla es el conjunto de reglas; lengua es la conversación', 'Ninguna es correcta'], correct: 1, explanation: 'Saussure distingue: Lengua (sistema colectivo de signos compartido por una comunidad) y Habla (uso individual y concreto de ese sistema).' },
    ],
  },
  {
    id: 'ingles', label: 'Inglés', icon: '🇬🇧', color: 'from-rose-500 to-rose-700',
    primaria: [
      { question: '¿Cómo se dice "Hola, ¿cómo estás?" en inglés?', options: ['Good night, how are you?', 'Hello, how are you?', 'Goodbye, how are you?', 'Good morning, where are you?'], correct: 1, explanation: '"Hello, how are you?" es el saludo básico en inglés. También puedes usar "Hi" (informal) en lugar de "Hello".' },
      { question: '¿Cuántos días de la semana hay en inglés?', options: ['5', '6', '7', '8'], correct: 2, explanation: 'Hay 7 días: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday.' },
      { question: '¿Cómo se dice "manzana" en inglés?', options: ['Orange', 'Banana', 'Apple', 'Grape'], correct: 2, explanation: '"Apple" significa manzana en inglés. Orange=naranja, Banana=plátano, Grape=uva.' },
      { question: 'Completa: "I ___ a student." (Yo soy estudiante)', options: ['is', 'are', 'am', 'be'], correct: 2, explanation: 'Con el pronombre "I" (yo), el verbo "to be" es "am". I am a student = Yo soy un estudiante.' },
      { question: '¿Qué significa "What time is it?"', options: ['¿Dónde estás?', '¿Qué hora es?', '¿Cuál es tu nombre?', '¿Cuántos años tienes?'], correct: 1, explanation: '"What time is it?" = ¿Qué hora es? Puedes responder: "It is 3 o\'clock" (Son las 3).' },
      { question: '¿Cuál es el plural de "child"?', options: ['Childs', 'Childes', 'Children', 'Childre'], correct: 2, explanation: '"Children" es el plural irregular de "child" (niño). En inglés hay muchos plurales irregulares.' },
      { question: '¿Cómo se dice el número "15" en inglés?', options: ['Fifty', 'Fourteen', 'Fifteen', 'Thirthy'], correct: 2, explanation: '15 = Fifteen. 14=Fourteen, 50=Fifty, 30=Thirty. Los números del 13 al 19 terminan en "-teen".' },
      { question: 'Elige la oración correcta en presente simple:', options: ['She play tennis', 'She plays tennis', 'She playing tennis', 'She is play tennis'], correct: 1, explanation: 'Con he/she/it en presente simple, el verbo lleva "-s": She plays. "I play" pero "She plays".' },
      { question: '¿Qué significa "My name is Carlos"?', options: ['Soy Carlos', 'Mi nombre es Carlos', 'Me llamo Carlos', 'Todas son correctas'], correct: 3, explanation: '"My name is Carlos" puede traducirse de varias formas: "Mi nombre es Carlos", "Me llamo Carlos" o "Soy Carlos". Todas son equivalentes.' },
      { question: '¿Cuáles son los colores del arco iris en inglés?', options: ['Red, Orange, Yellow, Green, Blue, Indigo, Violet', 'Red, Pink, Blue, Green, Brown, White, Black', 'Yellow, Blue, Green, Red, Purple, White, Gray', 'Orange, Red, Blue, Green, Purple, Pink, Brown'], correct: 0, explanation: 'Los 7 colores del arco iris: Red(rojo), Orange(naranja), Yellow(amarillo), Green(verde), Blue(azul), Indigo(índigo), Violet(violeta).' },
    ],
    secundaria: [
      { question: 'Which sentence uses the Present Perfect correctly?', options: ['I have went to Paris', 'I have go to Paris', 'I have been to Paris', 'I was go to Paris'], correct: 2, explanation: '"I have been to Paris" is correct. Present Perfect = have/has + past participle. "Been" is the past participle of "be/go" (for places).' },
      { question: 'Choose the correct conditional (Type 2): "If I ___ rich, I ___ travel the world."', options: ['am / will', 'were / would', 'am / would', 'was / will'], correct: 1, explanation: 'Type 2 conditional (hypothetical): If + past simple (were) + would + infinitive. "If I were rich, I would travel the world."' },
      { question: 'What is the passive voice of "The chef cooks the meal"?', options: ['The meal is cooked by the chef', 'The meal was cooked by the chef', 'The meal cooks by the chef', 'The chef was cooked the meal'], correct: 0, explanation: 'Passive voice (present): subject + am/is/are + past participle + by + agent. "The meal is cooked by the chef."' },
      { question: 'What does the phrasal verb "give up" mean?', options: ['Dar un regalo', 'Rendirse / abandonar', 'Subir algo', 'Dar la bienvenida'], correct: 1, explanation: '"Give up" significa rendirse o abandonar algo. "Don\'t give up!" = ¡No te rindas!' },
      { question: 'Choose the correct reported speech: She said "I am tired." → She said that she ___.', options: ['is tired', 'was tired', 'were tired', 'has been tired'], correct: 1, explanation: 'In reported speech, present "am" shifts back to past "was". She said that she was tired.' },
      { question: '¿Qué significa la expresión "The more you practice, the better you get"?', options: ['Practicar poco es suficiente', 'Cuanto más practicas, mejor te vuelves', 'La práctica es difícil', 'Mejor practicar solo'], correct: 1, explanation: 'Esta estructura "the more... the better" expresa proporcionalidad: "Cuanto más practicas, mejor te vuelves".' },
      { question: 'Which word is an adverb of frequency?', options: ['Quick', 'Always', 'Beautifully', 'Tall'], correct: 1, explanation: '"Always" is an adverb of frequency (100%). Others: usually (80%), often (60%), sometimes (40%), rarely (10%), never (0%).' },
      { question: 'Choose the correct sentence with "used to":', options: ['I use to play football', 'I used to played football', 'I used to play football', 'I am used to play football'], correct: 2, explanation: '"Used to + infinitive" expresses past habits: "I used to play football" (Yo solía jugar fútbol - ya no lo hago).' },
      { question: 'What is the difference between "its" and "it\'s"?', options: ['No hay diferencia', '"Its" es posesivo; "it\'s" = it is/it has', '"It\'s" es posesivo; "its" = it is', 'Ambas son contracciones'], correct: 1, explanation: '"Its" = posesivo (its color = su color). "It\'s" = contracción de "it is" o "it has" (It\'s raining = Está lloviendo).' },
      { question: 'Identify the gerund in: "Swimming is good for your health."', options: ['is', 'good', 'Swimming', 'health'], correct: 2, explanation: '"Swimming" is a gerund (verb + -ing used as a noun, as the subject). "Swimming is good" = Nadar es bueno.' },
    ],
  },
];
