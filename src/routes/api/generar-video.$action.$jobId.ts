import { createFileRoute } from "@tanstack/react-router";

const VIDEO_BASE = process.env.VIDEO_API_URL || "http://localhost:8000";

export const Route = createFileRoute("/api/generar-video/$action/$jobId")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const segments = url.pathname.split("/").filter(Boolean);
        const action = segments[segments.length - 2];
        const jobId = segments[segments.length - 1];

        try {
          if (action === "status") {
            const res = await fetch(`${VIDEO_BASE}/api/videos/status/${jobId}`);
            return new Response(res.body, {
              status: res.status,
              headers: { "Content-Type": "application/json" },
            });
          }

          if (action === "download") {
            const res = await fetch(`${VIDEO_BASE}/api/videos/descargar/${jobId}`);
            if (!res.ok) {
              const text = await res.text();
              return Response.json({ error: text }, { status: res.status });
            }
            return new Response(res.body, {
              status: res.status,
              headers: {
                "Content-Type": res.headers.get("Content-Type") || "video/mp4",
                "Content-Disposition": res.headers.get("Content-Disposition") || "attachment",
              },
            });
          }

          return Response.json({ error: "Acción desconocida" }, { status: 400 });
        } catch (err) {
          console.error("[api/generar-video] error", err);
          return Response.json(
            { error: "No se pudo conectar con el generador de videos local." },
            { status: 502 },
          );
        }
      },
    },
  },
});
