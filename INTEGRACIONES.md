# Integraciones y lecciones de repos open source

Este documento recoge lo que se estudió en repos de educación (LMS) y cómo se traduce
a KAIRO sin copiar dependencias ajenas. KAIRO es una app **TanStack Start + React**
que se mantiene ligera: cada feature se implementa de forma nativa en React o mediante
un **servicio Python local** cuando el proceso es pesado (p. ej. generación de video).

---

## 1. Repos estudiados y su propósito

| Repo | Stack | ¿Se integra? | Motivo |
|---|---|---|---|
| Moodle | PHP + PostgreSQL | No | Stack pesado; solo referencia de features LMS |
| Open edX | Python + Django + Mongo | No | Motor XBlock excede el alcance; inspira la estructura de cursos |
| frappe/erpnext | Python + MariaDB | No | Orientado a gestion; inspira recursos y certificados |
| ShortGPT | Python (auto-edicion) | Si (patron) | Referencia para el editor de video automatico |
| video-creator | Python (clips/voz) | Si (patron) | Referencia para vozover y composicion |
| Apache Guacamole | Java | No | Acceso RDP/VNC; sin relacion con e-learning |

> Todos los repos se clonan en `agentedevideos/` como **codigo de referencia** (depth-1),
> sin instalar sus `requirements`. Lo reutilizable se extrajo a un servicio local propio.

## 2. Features de LMS -> decision en KAIRO

| Feature tipico | Implementacion en KAIRO | Estado |
|---|---|---|
| Roles (estudiante/docente/admin) | Roles locales en `store.ts` | Planificado |
| Matricula de cursos | Listado de asignaturas + pagina de curso | Existente |
| Foros / discusion | Chat interno por curso (reuso del chat IA) | Planificado |
| Certificados | Certificado PDF desde plantilla | Planificado |
| Progreso y % de curso | `progreso` por unidad en localStorage | Existente (parcial) |
| Recomendaciones personalizadas | Segun perfil del estudiante + aciertos | Planificado |

## 3. Servicio local: `agentedevideos\servicio_video\`

Microservicio FastAPI que genera video educativo en local.

- `POST /api/videos/generar` — crea la tarea y devuelve `job_id`
- `GET /api/videos/status/{job_id}` — progreso de la tarea
- `GET /api/videos/descargar/{job_id}` — descarga el video generado
- Pipeline: `guion.py` (script, OpenRouter opcional con fallback local) -> `edge-tts`
  (`es-PE-CamilaNeural`) -> `escena.py` (Pillow, 1080p) -> composicion con moviepy/ffmpeg.
- Arranque: `start.bat` del modulo. El frontend hace proxy via `src/routes/api/generar-video*.ts`.

## 4. Reglas de higiene

- Nunca se traspasa codigo pesado de los repos clonados a `src/lib`; solo se extraen
  patrones (edicion de video, voz, estructura de cursos).
- Los repos de referencia quedan con clon depth-1 y sin instalacion.
- Secretos (OPENROUTER_API_KEY) solo en `.env`; nunca en el codigo ni en el repo.