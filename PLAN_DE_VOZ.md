# PLAN DE VOZ — KAIRO Assistant

## Objetivo
Que el Asistente IA tenga voz (lee cada respuesta con un botón) y que el chat por voz
permita hablar "de frente" con la IA mediante dictado continuo y respuesta hablada.

## Estado: IMPLEMENTADO ✅

### Archivos nuevos
- **`src/lib/speech.ts`** — Motor de voz nativo (Web Speech API):
  - `cleanText(md)` → convierte markdown a texto plano hablable.
  - `speak(text, opts)` → síntesis de voz (TTS), elige mejor voz es/en, retorna función cancelar.
  - `SpeechRecognitionController` → dictado continuo con `onFinal`/`onInterim`.
  - Helpers: `isSpeechSynthesisSupported`, `isSpeechRecognitionSupported`, `createRecognition`, `getAvailableVoices`, `loadVoices`, `toBcp47`.

### Archivos modificados
- **`src/pages/plataforma/AsistenteIA.tsx`**
  - Botón **🔊 Leer** en cada respuesta de la IA.
  - Botón **🎤 Mic/torre** para dictar en español (es-ES), transcripción continua.
  - Respuesta auto-hablada cuando `voiceEnabled` está activo.
  - Chip fijo "🎙 Te escucho..." mientras graba.
- **`src/pages/plataforma/EnglishTutor.tsx`**
  - Botón **🔊 Listen** en cada mensaje del tutor (lee en inglés, en-US).
  - Botón **🎤 Mic** para dictar en inglés (en-US).
- **`src/lib/store.ts`** — ajustes de voz en `Settings`:
  - `voiceEnabled: boolean`
  - `voiceLang: 'es' | 'en'`
  - `voiceRate: number`
- **`src/pages/plataforma/Configuracion.tsx`** — sección "Voz y accesibilidad":
  - Toggle "Responder con voz".
  - Idioma de voz.
  - Slider de velocidad.
  - Detección de soporte del navegador.

## Alcance elegido (decisión del usuario)
- **Modo de conversación:** Transcripción automática continua (te la soltamos sin pulsar).
- **Botón de voz:** Asistente IA + English Tutor.

## Notas
- Usa la **Web Speech API nativa** → sin dependencias nuevas ni backend.
- Dictado requiere Chrome/Edge (Safari necesita `webkit`). La lectura TTS funciona casi en todos.
- Por política de autoplay, la voz solo se dispara tras interacción del usuario o tras una
  respuesta generada por una acción del usuario, por lo que es segura.

## Siguientes fases (no de voz)
- **Tutor socrático** (patrón martius-lab/ai-tutor) → preguntas → pistas → evalúa.
- **RAG sobre documentos**: responder basado en el contenido de PDFs/apuntes subidos.