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

**Setup rápido en nuevo dispositivo:** Lee `SETUP.md` para instrucciones completas.

## 📦 Tecnologías

- **TypeScript**: Tipado estricto en todas las estructuras
- **OpenAI API**: Corrección fonética (Whisper), coaching conversacional (GPT-4o-mini)
- **TanStack**: Framework React existente con Vite
- **Tailwind CSS**: Estilos consistentes

## 🎯 Próximos Pasos

1. Integrar frontend con componentes React
2. Conectar APIs de OpenAI con variables de entorno (`OPENROUTER_API_KEY` en `.env`)
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
