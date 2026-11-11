<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

# AGENTS.md - Plataforma Educativa Neuro-Educativa

## 🏗️ Arquitectura del Proyecto

```
src/
├── curso-ingles-neuro/          # Curso de Inglés para Niños (NeuroFluent Play)
│   ├── metodologia.ts
│   ├── modulos/                  # A1-A2 con sesiones de 20 min
│   ├── ia-coach/                 # Whisper + GPT para corrección
│   ├── sistema-puntos/           # Gamificación con celebración del error
│   ├── contextos/                # Cajas de interés (Fantasy, Chef, Gamer)
│   └── index.ts
│
└── plataforma-educativa-peru/    # Plataforma para Secundaria
    ├── tipos/index.ts            # Interfaces base, metodología
    ├── cursos/
    │   ├── matematicas/          # Álgebra, Geometría, Cálculo
    │   ├── fisica/               # Cinemática, Dinámica, Termo
    │   ├── quimica/              # Átomos, Enlaces, Estequiometría
    │   ├── historia/             # Ancestral, Colonial, Independencia
    │   ├── comunicacion/         # Lectura, Redacción, Literatura
    │   └── ingles/               # Daily, Business, Entertainment
    ├── ia/coordinator.ts         # Integración con Whisper + GPT-4
    ├── guides/prompts-guides.ts  # Guías de prompts para imágenes/expansión
    └── index.ts                  # Entry point principal
```

## 🧠 Metodologías Implementadas

1. **Método Feynman**: Explicación ultra-simplificada antes de formalidad
2. **Active Recall**: Quiz interactivo al final de cada lección
3. **Spaced Repetition**: Cronogramas de revisión espaciada
4. **Intuición antes de Fórmula**: Visualización antes de abstracción

## 🛠️ Scripts Disponibles

- `npm run dev` — Vite dev server (SSR)
- `npm run build` — Build de producción (Nitro/Cloudflare)
- `npm run preview` — Servir build localmente
- `npm run lint` — ESLint + Prettier
- `npx tsx demo-neuro.ts` — Demo del curso de inglés
- `npx tsx demo-plataforma.ts` — Demo de los 6 cursos
- `npx tsc --noEmit` — Verificación de tipos
- `npm run premium:add` — Copia un HTML de curso IB y lo registra en el manifest (ver Fase 3)

**Setup rápido en nuevo dispositivo:** Lee `SETUP.md` para instrucciones completas.

## 📦 Tecnologías

- **TypeScript**: Tipado estricto en todas las estructuras
- **OpenAI API**: Corrección fonética (Whisper), coaching conversacional (GPT-4o-mini)
- **TanStack**: Framework React existente con Vite
- **Tailwind CSS**: Estilos consistentes

## 🎯 Próximos Pasos

1. Integrar frontend con componentes React
2. Conectar las APIs de IA con variables de entorno (`GEMINI_API_KEY` en `.env`, modelo `gemini-3.6-flash`)
3. Expandir contenido hasta nivel C2
4. Crear componentes de UI para visualizaciones interactivas

Set up en nuevo dispositivo: lee `SETUP.md`.

### Fase 1 — Higiene técnica (completada)
- ✅ Unificar `cn()` → único en `@/lib/utils`
- ✅ Corregir doble import de Tailwind en `index.css`
- ✅ Lazy-loading de rutas SPA (hash router en `App.tsx`)

### Fase 2 — Exámenes UNI/UNMSM (implementada)
- ✅ Banco de preguntas UNI (44 preguntas: Matemática, Física, Química, Aptitud, Comunicación)
- ✅ Banco de preguntas UNMSM (22 preguntas: Verbal, Matemática, Ciencias, Sociales)
- ✅ `UniView.tsx` y `UnmsmView.tsx` con `QuizRunner` (práctica + simulacro cronometrado)
- ✅ Integrados en `ExamenesInternacionales.tsx` → renombrado a "Exámenes de Admisión"
- ✅ Reporte de desempeño via `ScoreChart` y `getExamSummary` (store.ts)
- ✅ Eliminado código muerto: `UNI_QUESTIONS` antiguo (explicaciones confusas) reemplazado por `UNI_SECTIONS` en `examData.ts`

### Fase 3 — Cursos Premium IB (implementada)
Catálogo premium de cursos IB en HTML autocontenidos (generados con IA, ej. Claude), servidos estáticamente y listados vía manifest.

- **Contenido**: `public/cursos-premium/{matematicas,fisica,historia,sociedad-digital}/*.html` + `manifest.json` (instrucciones en `public/cursos-premium/README.md`).
- **Agregar curso**: copiar el HTML a la carpeta de su materia y agregar la entrada a `manifest.json`, o usar `npm run premium:add -- --subject matematicas --title "..." --file ./curso.html [--level SL|HL]`. Para registrar en bloque todos los HTMLs ya copiados, `npm run premium:scan` regenera el manifest leyendo el `<title>`/`<meta description>` de cada archivo.
- **Datos**: `src/data/premiumCourses.ts` (tipos + `loadPremiumCourses()` con fetch del manifest y fallback silencioso).
- **Estado**: `src/lib/premium.ts` (localStorage) — activación libre "modo demo" + progreso por curso; hook `usePremium()` en `src/hooks/usePremium.ts`; tests en `src/lib/premium.test.ts`.
- **UI**: sección en la página pública `#/cursos` (`src/components/cursos/CursosPremiumSection.tsx` + `PremiumActivationModal.tsx`) y visor en ruta `#/cursos-premium/<id>` (`src/pages/CursoPremiumViewer.tsx`, iframe sandbox `allow-scripts allow-forms allow-popups allow-modals` — sin `same-origin` a propósito).
- **Certificados**: `src/lib/premiumCertificate.ts` (HTML imprimible → Guardar como PDF, patrón de `pdfExport.ts`).
- **IA premium**: usuarios premium usan `GEMINI_PREMIUM_MODEL` (default `gemini-3.6-pro`): flag `premium` en `/api/chat` y `/api/chat-english`, enviado desde `aiEngine.ts` y `englishEngine.ts`.
- **Integración IB**: botones al banco de preguntas y flashcards desde el visor; patrones `sociedad digital` agregados a `digital-society` en `src/data/ibCourses.ts`.
