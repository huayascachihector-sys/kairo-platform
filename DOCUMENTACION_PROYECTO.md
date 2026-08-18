# KAIRO — Documentación Completa del Proyecto

## 1. Visión y Audiencia

**KAIRO** es una plataforma educativa integral que combina:
- **KAIRO Perú**: Cursos para secundaria con enfoque en exámenes de admisión UNI, UNMSM y otras universidades peruanas.
- **NeuroFluent Play** (Curso de Inglés para Niños): Metodología NeuroEducación con celebración del error, SRS y contextos gamificados.
- **Robot Kipu**: Página de venta para hardware de IA educativa.
- **Plataforma Integrada**: Dashboard con progreso, lecciones, práctica, IA tutor, simulacros, flashcards, SRS.

**Audiencia primaria**: Estudiantes de secundaria en Perú que buscan ingreso universitario (UNI, UNMSM) y/o preparación de exámenes internacionales (IB, SAT, TOEFL).

---

## 2. Inventario Técnico

### 2.1 Estructura de archivos (fuente)

| Carpeta | Archivos | Descripción |
|---------|----------|---------------|
| `src/pages/` | 13 | Páginas principales: Landing, MathPractice, Recursos, Cursos, Blog, About, Registro, OnboardingIA, Plataforma, Robot, Pago |
| `src/pages/plataforma/` | 26 | Subpáginas SPA del dashboard (Dashboard, MisCursos, PlanEstudio, AsistenteIA, BancoPreguntas, Exams, etc.) |
| `src/components/` | 20 | Componentes landing: Hero, Features, Testimoniales, CTA, etc. |
| `src/components/courses/` | 21 | Componentes para reproductor de lecciones y ejercicios |
| `src/components/plataforma/` | 12 | Widgets del dashboard (GameBar, ProgressCharts, ReviewPanel, etc.) |
| `src/components/ui/` | 54 | Instancia shadcn/ui (button, card, dialog, etc.) |
| `src/lib/` | 28 | Lógica de negocio: store, aiEngine, srsEngine, gamification, pedagogy, questionExtractor, speech, pdfExport |
| `src/routes/` (TanStack) | 3 + API | `index.tsx`, `plataforma-neuro.tsx`, `__root.tsx`, API endpoints |
| `src/data/` | 5 | Datos estáticos: questionBank, mathQuestions, englishExpressions, ibCourses |

### 2.2 Rutas y navegación

**Sistema dual**:
1. **TanStack Router (SSR)** → `/plataforma-neuro` (NeuroPlatform)
2. **Hash SPA (CSR)** → `#/matematicas`, `#/plataforma`, `#/blog`, etc. (renderizado por `App.tsx`)

**Mapa de rutas principales**:
```
[SSR] / ──► ClientOnly <App />  (hash SPA)
[SSR] /plataforma-neuro ──► NeuroPlatform
[SSR] /api/chat, /api/chat-english, /api/extract-questions, /api/generar-video
```

### 2.3 Registro de componentes

#### Páginas principales (`src/pages/*.tsx`)
| Archivo | Tamaño | Propósito |
|---------|--------|-----------|
| Landing.tsx | 4.3 KB | Componente modular: Hero → SocialProof → Features → Testimoniales → Pricing → FAQ → CTA |
| MathPractice.tsx | 28 KB | Quiz interactivo con categorías y cálculo de resultados |
| Recursos.tsx | 22 KB | Catálogo de recursos externos (plataformas, cursos, becas) |
| Cursos.tsx | 13 KB | Listado de cursos (matemáticas, física, química, historia, comunicación, inglés) |
| Plataforma.tsx | 15 KB | Shell del SPA: sidebar + 26 subvistas + state manager |

#### Subpáginas del dashboard (`src/pages/plataforma/`)
| Archivo | Tamaño | Propósito |
|---------|--------|-----------|
| Dashboard.tsx | 24 KB | Progreso, estadísticas semanales, recomendaciones |
| PlanEstudio.tsx | 47 KB | Generador de planes de estudio con IA |
| AsistenteIA.tsx | 22 KB | Chat IA con soporte de voz y archivos |
| BancoPreguntas.tsx | 27 KB | Navegador de preguntas por materia |
| EnglishTutor.tsx | 36 KB | Coach de conversación con corrección CEFR |
| ExamenesInternacionales.tsx | 5.7 KB | Contenedor SAT/TOEFL |
| ... y 20 subpáginas restantes |

### 2.4 Bases de datos estáticas

| Archivo | Tamaño | Uso |
|---------|--------|-----|
| `src/lib/courseData.ts` | 174 KB | Curriculum "Kairo" con lecciones markdown + ejercicios |
| `src/lib/store.ts` | 54 KB | Estado global (progreso, XP, quests, notificaciones) |
| `src/lib/aiEngine.ts` | 55 KB | Motor de tutoring IA (diagnostic, hints, scoring) |
| `src/lib/admisionData.ts` | 16 KB | Banco preguntas UNI actualizado a 2024 |
| `src/lib/examData.ts` | 11 KB | Preguntas SAT y TOEFL |
| `src/lib/careerData.ts` | 12 KB | Test RIASEC + recomendaciones |
| `src/lib/speech.ts` | 7.2 KB | Web Speech API (TTS + dictation) |

### 2.5 Endpoints API (TanStack Server)

| Endpoint | Método | Propósito |
|----------|--------|-----------|
| `/api/chat` | POST | Tutor IA Perú (llamada a OpenRouter) |
| `/api/chat-english` | POST | English Coach (CEFR levels) |
| `/api/extract-questions` | POST | Extractir preguntas de PDF/ZIP |
| `/api/generar-video` | POST | Proxy hacia microservicio FastAPI local |

---

## 3. Metodología Pedagógica

KAIRO implementa tres pilares:

### 3.1 Método Feynman
Explicación en capas: intuición → analogía → ejemplo → fórmula → aplicación.

### 3.2 Active Recall (Recuperación activa)
- Mini-quizzes al final de cada lección
- Preguntas flashcards con distracción
- Autoevaluación inmediata

### 3.3 Spaced Repetition (Repetición espaciada)
- SRSR/FSRS para flashcards y conceptos críticos
- Programación de revisiones basada en rendimiento
- Back-off exponencial + review intervals

### 3.4 Gamificación
- Sistema de puntos, misiones, misiones de recompensa
- "Celebración del error": feedback positivo al equivocarse
- Mascotas, streaks, ligas, insignias
- XP por grabación, asistencia, práctica

### 3.5 Gamificación visual para inglés (NeuroFluent Play)
- Triángulo de retención: Emoción + Contexto + SRS
- 5 contextos: Fantasy, Chef, Gamer, Superheroes, Everyday
- Hoja de ruta CEP A1 → C2 (3 y 3 años)

---

## 4. Benchmark: RevisionDojo (referencia)

| Feature | KAIRO (actual) | Meta | Estado |
|---------|----------------|------|--------|
| Question Bank (IB) | ✅ 3.3 GB JSON en public | CDN + backend | Mejorar |
| Past Papers | ❌ | ✅ | Fase 2 |
| Predicted Papers | ❌ | ✅ | Fase 2 |
| Exam Builder | ❌ | ✅ | Fase 2 |
| Study Notes | ❌ | ✅ | Fase 3 |
| Cheatsheets | ❌ | ✅ | Fase 3 |
| Interactive Lessons | Parcial | Completo | Fase 3 |
| Flashcards | ✅ (IB, SRS) | Mejorar UX | Fase 1 |
| AI Tutor (Jojo) | ✅ AsistenteIA | Mejorar | Fase 2 |
| AI Grading | ❌ (solo IA básica) | Rúbricas + feedback | Fase 2 |
| Study Planner | ✅ | Automatizar | Fase 2 |
| Analytics | ✅ (XP, lecciones) | Mapa de conocimiento + patrones | Fase 3 |
| Streaks/XP/Leagues | ✅ | Añadir clasificación | Fase 2 |
| Pomodoro Timer | ✅ integrado | Mejorar | Fase 2 |
| Quiz me | ❌ | ✅ | Fase 2 |

---

## 5. Roadmap de Mejora

| Fase | Duración | Objetivo | Entregables |
|------|----------|----------|-------------|
| **0 (Higiene)** | 1-2 días | Limpieza técnica | Unificar `cn()`, remover duplicados CSS, .gitignore, mover `herramientas/`, preparar IB data para CDN |
| **1 (Rendimiento)** | 1-2 semanas | Velocidad & arquitectura | Lazy-load rutas, service worker bump, fallback carga, documentar migración routing TanStack |
| **2 (Features)** | 2-4 semanas | Experiencia estudiante | Exam Builder, past papers UNI/UNMSM, AI essay grader, study planner avanzado, streaks/leagues |
| **3 (Backend)** | 2-3 semanas | Persistencia | Auth real (Supabase/Firebase), sync multi-dispositivo, almacenamiento progreso |
| **4 (Testing)** | 1 semana | Calidad | Vitest + RTL, CI (GitHub Actions), Lighthouse CI |
| **5 (Escala)** | 2-4 semanas | Expansión | PWA offline completo, foros, contenido quechua/aymara, modo bajo ancho de banda |

---

## 6. Métricas de Éxito

- **Lighthouse Score**: >90 (Performance, Accessibility, Best Practices, SEO)
- **First Contentful Paint**: < 1.5 s (landing)
- **Time to Interactive**: < 3 s (warm cache)
- **Test coverage**: > 80%
- **User retention**: 40% en 30 días
- **Precisión de repaso SRS**: > 90% en revisión a los 7 días

---

## 7. Próximos pasos inmediatos (Fase 0 + 1)

1. Unificar carpeta `utils/cn.ts` → `lib/utils.ts`
2. Corregir doble import Tailwind en `styles.css`
3. Mover `herramientas/`, `generador_videos/`, `agentedevideos/` a una ubicación separada (fuera del árbol src)
4. Preparar migración del banco IB:
   - Mantener archivo `courses.json` y `index.json` como stubs API
   - Apuntar `fetch('/data/...')` a URL CDN
   - Crear `.env.example` con `IB_DATA_SOURCE=https://cdn.kairo.io/ib-questions`
5. Lazy-load rutas pesadas en `App.tsx` con `React.lazy`
6. Bump service worker `kairo-v2`, deshabilitar en dev
7. Verificar con `npx tsc --noEmit` y tests manuales

---

## 8. Referencias

- **RevisionDojo**: https://www.revisiondojo.com — referencia para features de examen IB, past papers, AI grading, study planner
- **OpenTutor**: https://github.com/opentechbooks/OpenTutor — pedagogía y motor de tutorización
- **OpenTutor**: https://github.com/opentechbooks/OpenTutor — motor de generación de preguntas para IB