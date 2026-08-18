# 📼 Guía de videos de lección (KAIRO)

Cada **lección** reproduce su propio video en la **Fase 1 (Teoría)** de su módulo.
Los videos se generan **localmente** (100% sin API keys) y se sirven de forma
estática desde `public/videos/` en Vite, sin depender del backend Python.

> ✅ **Estado actual: los 79 videos están generados** (narración Edge TTS en
> español + diapositivas animadas con efecto Ken Burns). Los antiguos placeholders
> estáticos de 6 s fueron reemplazados.

## Cómo se generan

El pipeline convierte el markdown de cada lección en un video narrado:

1. `generador_videos/gen_videos.mjs` — lee `src/lib/courseData.ts`, parsea el
   `content` markdown de cada lección en diapositivas (intro, secciones, resumen)
   y genera la **narración en español** por diapositiva.
2. `generador_videos/build_video.py` — sintetiza la voz con **Edge TTS**
   (`es-PE-CamilaNeural`), renderiza cada diapositiva con Pillow (colores por
   curso) y aplica **Ken Burns** (zoom) con ffmpeg, componiendo el MP4 final con
   audio.

```bash
node generador_videos/gen_videos.mjs --lesson=mat-1-1  # una lección
node generador_videos/gen_videos.mjs --course=quimica  # todo un curso
node generador_videos/gen_videos.mjs --all             # todas las lecciones
```

- Colores de fondo por curso en `COURSE_COLORS` (build_video.py).
- Salida: `public/videos/<curso>/<lessonId>.mp4` (1920×1080, h264 + aac).

## Convención de rutas

```
public/videos/<curso>/<lessonId>.mp4
```

- `courseId` y `lessonId` se limpian de caracteres no alfanuméricos (`-`, `a`-`z`, `0`-`9`).
- En la Fase 1 el `VideoPlayer` de cada lección usa `lesson.videoUrl` si está poblado;
  si no, deriva automáticamente la ruta `/videos/<curso>/<lessonId>.mp4`.

---

## 📋 Lista exacta de archivos esperados (79)

### Matemáticas — `videos/matematicas/`
| Lección | Archivo |
|---|---|
| mat-1-1 · Expresiones Algebraicas | `videos/matematicas/mat-1-1.mp4` |
| mat-1-2 · Ecuaciones Lineales | `videos/matematicas/mat-1-2.mp4` |
| mat-1-3 · Sistemas de Ecuaciones | `videos/matematicas/mat-1-3.mp4` |
| mat-2-1 · Triángulos y ángulos | `videos/matematicas/mat-2-1.mp4` |
| mat-2-2 · Circunferencia y área | `videos/matematicas/mat-2-2.mp4` |
| mat-3-1 · Límites y Continuidad | `videos/matematicas/mat-3-1.mp4` |
| mat-4-1 · Razones Trigonométricas | `videos/matematicas/mat-4-1.mp4` |
| mat-4-2 · Ley de Senos y Cosenos | `videos/matematicas/mat-4-2.mp4` |
| mat-4-3 · Identidades Trigonométricas | `videos/matematicas/mat-4-3.mp4` |
| mat-5-1 · Ecuación de la Recta | `videos/matematicas/mat-5-1.mp4` |
| mat-5-2 · Circunferencia y Parábola | `videos/matematicas/mat-5-2.mp4` |
| mat-5-3 · Secciones Cónicas | `videos/matematicas/mat-5-3.mp4` |

### Física — `videos/fisica/`
| Lección | Archivo |
|---|---|
| fis-1-1 · MRU | `videos/fisica/fis-1-1.mp4` |
| fis-1-2 · MRUA y Caída Libre | `videos/fisica/fis-1-2.mp4` |
| fis-2-1 · Leyes de Newton | `videos/fisica/fis-2-1.mp4` |
| fis-3-1 · Leyes de Newton | `videos/fisica/fis-3-1.mp4` |
| fis-3-2 · Fricción y Plano Inclinado | `videos/fisica/fis-3-2.mp4` |
| fis-3-3 · Tensión y Poleas | `videos/fisica/fis-3-3.mp4` |
| fis-4-1 · Trabajo y Energía Cinética | `videos/fisica/fis-4-1.mp4` |
| fis-4-2 · Energía Potencial y Conservación | `videos/fisica/fis-4-2.mp4` |
| fis-4-3 · Potencia y Rendimiento | `videos/fisica/fis-4-3.mp4` |

### Química — `videos/quimica/`
| Lección | Archivo |
|---|---|
| qui-1-1 · El Átomo y sus Partículas | `videos/quimica/qui-1-1.mp4` |
| qui-1-2 · Tabla Periódica | `videos/quimica/qui-1-2.mp4` |
| qui-1-3 · Enlace Químico | `videos/quimica/qui-1-3.mp4` |
| qui-2-1 · La Mole y Masa Molar | `videos/quimica/qui-2-1.mp4` |
| qui-3-1 · Enlace Iónico | `videos/quimica/qui-3-1.mp4` |
| qui-3-2 · Enlace Covalente | `videos/quimica/qui-3-2.mp4` |
| qui-3-3 · Enlace Metálico | `videos/quimica/qui-3-3.mp4` |
| qui-4-1 · Tipos de Reacciones | `videos/quimica/qui-4-1.mp4` |
| qui-4-2 · Balanceo de Ecuaciones | `videos/quimica/qui-4-2.mp4` |
| qui-4-3 · Estequiometría | `videos/quimica/qui-4-3.mp4` |

### Historia — `videos/historia/`
| Lección | Archivo |
|---|---|
| his-1-1 · Culturas Preincaicas | `videos/historia/his-1-1.mp4` |
| his-1-2 · El Imperio Inca | `videos/historia/his-1-2.mp4` |
| his-1-3 · Conquista y Virreinato | `videos/historia/his-1-3.mp4` |
| his-2-1 · Independencia del Perú | `videos/historia/his-2-1.mp4` |

### Comunicación — `videos/comunicacion/`
> Este curso combina módulos `com-*` y `his-*` según los datos.
| Lección | Archivo |
|---|---|
| com-1-1 · Tipos de Texto y Estructura | `videos/comunicacion/com-1-1.mp4` |
| com-1-2 · Idea Principal e Inferencias | `videos/comunicacion/com-1-2.mp4` |
| com-2-1 · El Párrafo y sus Partes | `videos/comunicacion/com-2-1.mp4` |
| his-3-1 · Inicios de la República | `videos/comunicacion/his-3-1.mp4` |
| his-3-2 · El Oncenio de Leguía | `videos/comunicacion/his-3-2.mp4` |
| his-3-3 · La Guerra con Ecuador 1941 | `videos/comunicacion/his-3-3.mp4` |
| his-4-1 · Gobierno de Velasco | `videos/comunicacion/his-4-1.mp4` |
| his-4-2 · Conflicto Armado Interno | `videos/comunicacion/his-4-2.mp4` |
| his-4-3 · Perú en el Siglo XXI | `videos/comunicacion/his-4-3.mp4` |
| com-3-1 · Estructura del Párrafo | `videos/comunicacion/com-3-1.mp4` |
| com-3-2 · Tipos de Ensayo | `videos/comunicacion/com-3-2.mp4` |
| com-3-3 · Citación y Referencias | `videos/comunicacion/com-3-3.mp4` |
| com-4-1 · Literatura Prehispánica | `videos/comunicacion/com-4-1.mp4` |
| com-4-2 · Literatura Republicana | `videos/comunicacion/com-4-2.mp4` |
| com-4-3 · Boom Latinoamericano | `videos/comunicacion/com-4-3.mp4` |

### Inglés — `videos/ingles/`
| Lección | Archivo |
|---|---|
| ing-1-1 · Present Tenses | `videos/ingles/ing-1-1.mp4` |
| ing-1-2 · Past Tenses | `videos/ingles/ing-1-2.mp4` |
| ing-1-3 · Conditionals | `videos/ingles/ing-1-3.mp4` |
| ing-2-1 · Phrasal Verbs | `videos/ingles/ing-2-1.mp4` |
| ing-3-1 · Future Tenses | `videos/ingles/ing-3-1.mp4` |
| ing-3-2 · First Conditional | `videos/ingles/ing-3-2.mp4` |
| ing-3-3 · Second Conditional | `videos/ingles/ing-3-3.mp4` |
| ing-4-1 · Work & Business | `videos/ingles/ing-4-1.mp4` |
| ing-4-2 · Travel & Tourism | `videos/ingles/ing-4-2.mp4` |
| ing-4-3 · Technology & Internet | `videos/ingles/ing-4-3.mp4` |

### Biología — `videos/biologia/`
| Lección | Archivo |
|---|---|
| bio-1-1 · La Célula | `videos/biologia/bio-1-1.mp4` |
| bio-1-2 · DNA, ARN y Síntesis | `videos/biologia/bio-1-2.mp4` |
| bio-2-1 · Mendel y Herencia | `videos/biologia/bio-2-1.mp4` |
| bio-2-2 · Herencia ligada al sexo | `videos/biologia/bio-2-2.mp4` |
| bio-3-1 · Leyes de Mendel | `videos/biologia/bio-3-1.mp4` |
| bio-3-2 · ADN y ARN | `videos/biologia/bio-3-2.mp4` |
| bio-3-3 · Ingeniería Genética | `videos/biologia/bio-3-3.mp4` |
| bio-4-1 · Ecosistemas y Cadenas Tróficas | `videos/biologia/bio-4-1.mp4` |
| bio-4-2 · Ciclos Biogeoquímicos | `videos/biologia/bio-4-2.mp4` |
| bio-4-3 · Cambio Climático | `videos/biologia/bio-4-3.mp4` |

### Computación — `videos/computacion/`
| Lección | Archivo |
|---|---|
| comp-1-1 · Qué es un algoritmo | `videos/computacion/comp-1-1.mp4` |
| comp-1-2 · Introducción a Python | `videos/computacion/comp-1-2.mp4` |
| comp-2-1 · Listas, Tuplas y Diccionarios | `videos/computacion/comp-2-1.mp4` |
| comp-3-1 · HTML y CSS Avanzado | `videos/computacion/comp-3-1.mp4` |
| comp-3-2 · JavaScript y DOM | `videos/computacion/comp-3-2.mp4` |
| comp-3-3 · React y Componentes | `videos/computacion/comp-3-3.mp4` |
| comp-4-1 · Python para Datos | `videos/computacion/comp-4-1.mp4` |
| comp-4-2 · Visualización de Datos | `videos/computacion/comp-4-2.mp4` |
| comp-4-3 · Machine Learning Básico | `videos/computacion/comp-4-3.mp4` |

---

## ✏️ Cómo sobrescribir una ruta (por lección)

Si una lección no usa la convención anterior, define `videoUrl` en su objeto en
`src/lib/courseData.ts`:

```ts
{
  id: 'mat-1-1',
  title: 'Expresiones Algebraicas',
  videoUrl: '/videos/matematicas/mat-1-1.mp4', // ruta explícita
  content: `## ...`,
  exercises: [ /* ... */ ],
}
```

Si se omite `videoUrl`, la Fase 1 usa automáticamente `/videos/<curso>/<lessonId>.mp4`.