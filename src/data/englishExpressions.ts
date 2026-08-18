// ─── Expresiones más usadas en inglés, alineadas por CEFR ────────────
// Basado en la frecuencia real de uso (Oxford Phrase List, corpus) y el
// principio de que el 25% de los phrasal verbs más frecuentes cubren >60%
// de las construcciones verbales reales.

export type ExpressionType = "idiom" | "phrasal-verb" | "collocation" | "expression";

export interface EnglishExpression {
  expression: string;
  meaning: string;
  example: string;
  type: ExpressionType;
}

export interface EnglishExpressionsByLevel {
  level: string;
  label: string;
  expressions: EnglishExpression[];
}

export const ENGLISH_EXPRESSIONS: EnglishExpressionsByLevel[] = [
  {
    level: "A1",
    label: "A1 — Primeras expresiones",
    expressions: [
      {
        expression: "Hello, how are you?",
        meaning: "Hola, ¿cómo estás?",
        example: "Hello, how are you? I'm fine, thanks.",
        type: "expression",
      },
      {
        expression: "Nice to meet you",
        meaning: "Encantado de conocerte",
        example: "Nice to meet you, Maria.",
        type: "expression",
      },
      {
        expression: "What time is it?",
        meaning: "¿Qué hora es?",
        example: "What time is it? — It's three o'clock.",
        type: "expression",
      },
      {
        expression: "How much is it?",
        meaning: "¿Cuánto cuesta?",
        example: "How much is it? — It's five dollars.",
        type: "expression",
      },
      {
        expression: "I don't know",
        meaning: "No sé",
        example: "I don't know the answer.",
        type: "expression",
      },
      {
        expression: "I would like...",
        meaning: "Me gustaría...",
        example: "I would like a coffee, please.",
        type: "expression",
      },
      {
        expression: "Thank you very much",
        meaning: "Muchas gracias",
        example: "Thank you very much for your help.",
        type: "expression",
      },
      {
        expression: "Can you help me?",
        meaning: "¿Puedes ayudarme?",
        example: "Can you help me with this?",
        type: "expression",
      },
      {
        expression: "What does... mean?",
        meaning: "¿Qué significa...?",
        example: 'What does "book" mean?',
        type: "expression",
      },
      {
        expression: "See you later",
        meaning: "Hasta luego",
        example: "See you later! Bye!",
        type: "expression",
      },
    ],
  },
  {
    level: "A2",
    label: "A2 — Sobrevivir en inglés",
    expressions: [
      {
        expression: "What do you do?",
        meaning: "¿A qué te dedicas? (profesión)",
        example: "What do you do? — I'm a student.",
        type: "expression",
      },
      {
        expression: "Could you repeat that, please?",
        meaning: "¿Podrías repetir eso?",
        example: "Could you repeat that, please? I didn't hear you.",
        type: "expression",
      },
      {
        expression: "I'm sorry, I don't understand",
        meaning: "Lo siento, no entiendo",
        example: "I'm sorry, I don't understand. Can you speak slowly?",
        type: "expression",
      },
      {
        expression: "I'm looking for...",
        meaning: "Estoy buscando...",
        example: "I'm looking for the station.",
        type: "expression",
      },
      {
        expression: "take a bus",
        meaning: "tomar un bus",
        example: "I take a bus to school every day.",
        type: "collocation",
      },
      {
        expression: "get up",
        meaning: "levantarse",
        example: "I get up at 7 o'clock.",
        type: "phrasal-verb",
      },
      {
        expression: "wake up",
        meaning: "despertarse",
        example: "She wakes up early.",
        type: "phrasal-verb",
      },
      {
        expression: "It doesn't matter",
        meaning: "No importa",
        example: "It doesn't matter. We can do it later.",
        type: "expression",
      },
      {
        expression: "What's wrong?",
        meaning: "¿Qué pasa? / ¿Qué te pasa?",
        example: "What's wrong? You look sad.",
        type: "expression",
      },
      {
        expression: "have breakfast/lunch/dinner",
        meaning: "desayunar/almorzar/cenar",
        example: "We have dinner at 8 pm.",
        type: "collocation",
      },
    ],
  },
  {
    level: "B1",
    label: "B1 — Sonar natural (phrasal verbs esenciales)",
    expressions: [
      {
        expression: "give up",
        meaning: "rendirse / dejar de hacer algo",
        example: "Don't give up! You can do it.",
        type: "phrasal-verb",
      },
      {
        expression: "look forward to",
        meaning: "esperar con ilusión",
        example: "I look forward to seeing you.",
        type: "phrasal-verb",
      },
      {
        expression: "run out of",
        meaning: "quedarse sin algo",
        example: "We ran out of milk.",
        type: "phrasal-verb",
      },
      {
        expression: "put off",
        meaning: "posponer / aplazar",
        example: "Don't put off your homework.",
        type: "phrasal-verb",
      },
      {
        expression: "take up",
        meaning: "empezar un hobby",
        example: "She took up painting last year.",
        type: "phrasal-verb",
      },
      {
        expression: "call off",
        meaning: "cancelar",
        example: "They called off the meeting.",
        type: "phrasal-verb",
      },
      {
        expression: "figure out",
        meaning: "entender / resolver",
        example: "Can you figure out this problem?",
        type: "phrasal-verb",
      },
      {
        expression: "come across",
        meaning: "encontrarse con algo por casualidad",
        example: "I came across an old friend.",
        type: "phrasal-verb",
      },
      {
        expression: "make a decision",
        meaning: "tomar una decisión",
        example: "You need to make a decision today.",
        type: "collocation",
      },
      {
        expression: "in my opinion",
        meaning: "en mi opinión",
        example: "In my opinion, this movie is great.",
        type: "expression",
      },
    ],
  },
  {
    level: "B2",
    label: "B2 — Colocaciones y matices",
    expressions: [
      {
        expression: "heavy rain",
        meaning: 'lluvia intensa (no "strong rain")',
        example: "We got caught in heavy rain.",
        type: "collocation",
      },
      {
        expression: "make a mistake",
        meaning: "cometer un error",
        example: "Everyone makes mistakes.",
        type: "collocation",
      },
      {
        expression: "do homework",
        meaning: "hacer la tarea",
        example: "I have to do my homework.",
        type: "collocation",
      },
      {
        expression: "take a photo",
        meaning: "tomar una foto",
        example: "Can you take a photo of us?",
        type: "collocation",
      },
      {
        expression: "break down",
        meaning: "averiarse / descomponerse",
        example: "My car broke down on the highway.",
        type: "phrasal-verb",
      },
      {
        expression: "put up with",
        meaning: "tolerar / aguantar",
        example: "I can't put up with the noise.",
        type: "phrasal-verb",
      },
      {
        expression: "bring up",
        meaning: "criar / mencionar un tema",
        example: "She brought up an interesting point.",
        type: "phrasal-verb",
      },
      {
        expression: "as far as I know",
        meaning: "hasta donde sé",
        example: "As far as I know, the shop is still open.",
        type: "expression",
      },
      {
        expression: "It's up to you",
        meaning: "Depende de ti / tú decides",
        example: "Where should we eat? It's up to you.",
        type: "expression",
      },
      {
        expression: "take into account",
        meaning: "tomar en cuenta",
        example: "We must take the cost into account.",
        type: "collocation",
      },
    ],
  },
  {
    level: "C1",
    label: "C1 — Expresiones avanzadas y académicas",
    expressions: [
      {
        expression: "in the long run",
        meaning: "a largo plazo",
        example: "Studying pays off in the long run.",
        type: "expression",
      },
      {
        expression: "on the other hand",
        meaning: "por otro lado (contrastar)",
        example: "It's expensive; on the other hand, it's very good.",
        type: "expression",
      },
      {
        expression: "to some extent",
        meaning: "hasta cierto punto",
        example: "To some extent, I agree with you.",
        type: "expression",
      },
      {
        expression: "bear in mind",
        meaning: "tener en cuenta",
        example: "Bear in mind that prices may change.",
        type: "expression",
      },
      {
        expression: "a wide range of",
        meaning: "una amplia gama de",
        example: "The course covers a wide range of topics.",
        type: "collocation",
      },
      {
        expression: "key point",
        meaning: "punto clave",
        example: "The key point is to practice daily.",
        type: "collocation",
      },
      {
        expression: "draw a conclusion",
        meaning: "sacar una conclusión",
        example: "We can draw a conclusion from the data.",
        type: "collocation",
      },
      {
        expression: "play a role in",
        meaning: "jugar un papel en",
        example: "Technology plays a key role in education.",
        type: "collocation",
      },
      {
        expression: "to a certain degree",
        meaning: "en cierto grado",
        example: "To a certain degree, he is right.",
        type: "expression",
      },
      {
        expression: "put it into practice",
        meaning: "ponerlo en práctica",
        example: "Now put what you learned into practice.",
        type: "collocation",
      },
    ],
  },
  {
    level: "C2",
    label: "C2 — Matices de significado e idiomas",
    expressions: [
      {
        expression: "on the verge of",
        meaning: "al borde de",
        example: "The company is on the verge of collapse.",
        type: "expression",
      },
      {
        expression: "by and large",
        meaning: "en general / en su mayoría",
        example: "By and large, the project was a success.",
        type: "expression",
      },
      {
        expression: "at the expense of",
        meaning: "a costa de",
        example: "He advanced at the expense of his health.",
        type: "expression",
      },
      {
        expression: "under the circumstances",
        meaning: "dadas las circunstancias",
        example: "Under the circumstances, we cancelled the trip.",
        type: "expression",
      },
      {
        expression: "in the grand scheme of things",
        meaning: "en el gran esquema de las cosas",
        example: "In the grand scheme of things, this is minor.",
        type: "idiom",
      },
      {
        expression: "a blessing in disguise",
        meaning: "una bendición disfrazada",
        example: "Losing that job was a blessing in disguise.",
        type: "idiom",
      },
      {
        expression: "to say the least",
        meaning: "por decir lo menos",
        example: "The results were surprising, to say the least.",
        type: "expression",
      },
      {
        expression: "goes without saying",
        meaning: "ni que decir tiene",
        example: "It goes without saying that safety comes first.",
        type: "expression",
      },
      {
        expression: "strike a balance between",
        meaning: "encontrar un equilibrio entre",
        example: "We must strike a balance between work and life.",
        type: "collocation",
      },
      {
        expression: "be at odds with",
        meaning: "estar en desacuerdo con / en conflicto con",
        example: "His actions are at odds with his words.",
        type: "expression",
      },
    ],
  },
];

export function getExpressionsByLevel(level: string): EnglishExpression[] {
  return ENGLISH_EXPRESSIONS.find((l) => l.level === level)?.expressions || [];
}

export function getExpressionTypes(): ExpressionType[] {
  return ["idiom", "phrasal-verb", "collocation", "expression"];
}
