import { createFileRoute } from "@tanstack/react-router";

const VIDEO_BASE = process.env.VIDEO_API_URL || "http://localhost:8000";

export const Route = createFileRoute("/api/generar-video")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json().catch(() => ({}));

        if (!body || typeof body.tema !== "string" || body.tema.trim().length < 2) {
          return Response.json({ error: "Se requiere un tema válido" }, { status: 400 });
        }

        try {
          const res = await fetch(`${VIDEO_BASE}/api/videos/generar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
          const data = await res.json().catch(() => ({}));
          return Response.json(data, { status: res.status });
        } catch (err) {
          console.error("[api/generar-video] servicio no disponible", err);
          return Response.json(
            {
              error:
                "El servicio de generación de videos no está disponible. Asegúrate de que la app local esté encendida.",
            },
            { status: 502 },
          );
        }
      },
    },
  },
});
