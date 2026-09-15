import { createFileRoute } from "@tanstack/react-router";
import App from "@/App";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Qué hace diferente a Kairo de otras plataformas educativas?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Kairo es una plataforma diseñada específicamente para estudiantes peruanos que combina IA personalizada, tutores especializados y contenido adaptado al currículo local con estándares internacionales. Funciona offline y es accesible desde cualquier dispositivo.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cómo funciona la IA personalizada?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "El motor de IA de Kairo analiza tu rendimiento en ejercicios, tu velocidad de aprendizaje, tus patrones de error y tus preferencias de estudio para crear un plan completamente personalizado que prioriza el contenido que más necesitas.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuánto cuesta KAIRO?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Nada. KAIRO es 100% gratuito para todos los estudiantes: cursos completos, IA personalizada, banco de preguntas, exámenes de admisión y gamificación. No se pide tarjeta ni hay suscripciones.",
      },
    },
    {
      "@type": "Question",
      name: "¿Funciona en zonas con internet limitado?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutamente. Kairo tiene un modo offline que permite descargar lecciones, ejercicios y materiales para estudiar sin conexión. Cuando se recupera la conexión, tu progreso se sincroniza automáticamente.",
      },
    },
    {
      "@type": "Question",
      name: "¿Los certificados son reconocidos?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí, nuestros certificados son reconocidos por empresas e instituciones educativas tanto en Perú como internacionalmente. Además contamos con alianzas con universidades para que tus créditos puedan ser validados en ciertos programas.",
      },
    },
    {
      "@type": "Question",
      name: "¿Por qué es gratis?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Porque creemos que la educación de calidad no debería depender del presupuesto. KAIRO existe para que cualquier estudiante peruano, esté donde esté, acceda a las mejores herramientas de aprendizaje sin barreras.",
      },
    },
    {
      "@type": "Question",
      name: "¿Habrá planes pagos en el futuro?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Por ahora no. Todo el contenido es y seguirá siendo gratuito. Si algún día se lanzan funciones adicionales, los primeros estudiantes serán los primeros en enterarse y siempre tendrán acceso a lo esencial sin costo.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué cursos incluye la plataforma de admisión a la universidad?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "KAIRO incluye cursos de secundaria y preuniversitarios: matemática, física, química, historia, comunicación e inglés, además de un banco de preguntas y simulacros de examen de admisión UNI y UNMSM.",
      },
    },
  ],
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KAIRO — Plataforma Educativa con Tutor IA para Estudiantes del Perú" },
      {
        name: "description",
        content:
          "KAIRO es la plataforma educativa peruana con tutor IA: cursos de secundaria, banco de preguntas, exámenes de admisión UNI y UNMSM, inglés y más. 100% gratis.",
      },
      { property: "og:title", content: "KAIRO — Plataforma Educativa con Tutor IA para Estudiantes del Perú" },
      {
        property: "og:description",
        content:
          "KAIRO es la plataforma educativa peruana con tutor IA: cursos de secundaria, banco de preguntas, exámenes de admisión UNI y UNMSM, inglés y más. 100% gratis.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://kairoedu.vercel.app/" },
      { property: "og:image", content: "https://kairoedu.vercel.app/logo.png" },
      { property: "og:site_name", content: "KAIRO" },
      { property: "og:locale", content: "es_PE" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "KAIRO — Plataforma Educativa con Tutor IA para Estudiantes del Perú" },
      {
        name: "twitter:description",
        content:
          "Plataforma educativa peruana con tutor IA: cursos de secundaria, banco de preguntas y exámenes de admisión UNI y UNMSM. 100% gratis.",
      },
      { name: "twitter:image", content: "https://kairoedu.vercel.app/logo.png" },
    ],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(faqJsonLd) }],
    links: [{ rel: "canonical", href: "https://kairoedu.vercel.app/" }],
  }),
  component: Index,
});

function Index() {
  return <App />;
}
