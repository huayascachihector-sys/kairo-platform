import { createFileRoute } from "@tanstack/react-router";
import NeuroPlatform from "@/components/plataforma/NeuroPlatform";

export const Route = createFileRoute("/plataforma-neuro")({
  head: () => ({
    meta: [
      { title: "NeuroEdu Perú - Aprendizaje con Neurociencia" },
      { name: "description", content: "Plataforma educativa peruana con metodología basada en neurociencia. 6 cursos con Método Feynman, Active Recall y Spaced Repetition." },
    ],
    links: [{ rel: "canonical", href: "https://kairoedu.vercel.app/plataforma-neuro" }],
  }),
  component: NeuroPlatformPage,
});

function NeuroPlatformPage() {
  return <NeuroPlatform />;
}