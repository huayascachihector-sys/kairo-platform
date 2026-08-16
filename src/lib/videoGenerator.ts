export interface VideoJob {
  job_id: string;
  status: "processing" | "done" | "error";
  stage: string;
  percent: number;
  error?: string | null;
  video_path?: string | null;
  tema?: string;
}

export interface GenerateVideoPayload {
  tema: string;
  nivel: "primaria" | "secundaria";
  duracion: number;
  estilo?: "educativo" | "resumen" | "historia";
}

export async function createVideoJob(payload: GenerateVideoPayload): Promise<VideoJob> {
  const res = await fetch("/api/generar-video", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      (data as { error?: string }).error || "No se pudo iniciar la generación del video.",
    );
  }
  return data as VideoJob;
}

export async function getVideoStatus(jobId: string): Promise<VideoJob> {
  const res = await fetch(`/api/generar-video/status/${jobId}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      (data as { error?: string }).error || "No se pudo consultar el estado del video.",
    );
  }
  return data as VideoJob;
}

export function getVideoDownloadUrl(jobId: string): string {
  return `/api/generar-video/download/${jobId}`;
}

export const VIDEO_STAGE_LABELS: Record<string, string> = {
  iniciando: "Iniciando...",
  generando_guion: "Generando guion educativo",
  voz: "Generando narración de voz (Edge TTS)",
  animaciones: "Renderizando animaciones y fórmulas",
  composicion: "Componiendo el video final (ffmpeg)",
  listo: "¡Video listo!",
  error: "Ocurrió un error",
};
