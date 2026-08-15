import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import App from "@/App";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KAIRO — Aprende. Entiende. Crece." },
      { name: "description", content: "KAIRO: Plataforma educativa integral con IA para aprender, entender y crecer." },
      { property: "og:title", content: "KAIRO — Aprende. Entiende. Crece." },
      { property: "og:description", content: "KAIRO: Plataforma educativa integral con IA para aprender, entender y crecer." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <ClientOnly fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 to-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
      </div>
    }>
      <App />
    </ClientOnly>
  );
}
