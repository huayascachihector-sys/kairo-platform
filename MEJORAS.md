# KAIRO — Documento de Mejoras

## Visión General

Este documento detalla todas las mejoras necesarias para que KAIRO se convierta en el mejor recurso educativo del Perú, permitiendo a los estudiantes alcanzar su máximo potencial y llegar a cualquier universidad.

---

## 1. AMPLITUD DE CONTENIDO

### Problema
Solo 6 cursos (Matemáticas, Física, Química, Historia, Comunicación, Inglés). No hay contenido para primaria ni nivel avanzado universitario.

### Mejoras
- **Nuevos cursos:** Biología, Computación/Programación, Economía, Dibujo Técnico
- **Nivel primaria:** Cursos de refuerzo para 4to-6to grado (Mate, Comunicación, Ciencia)
- **Nivel avanzado:** Contenido universitario (Cálculo multivariable, Álgebra lineal, Termodinámica, Programación)
- **Contenido por grado:** Etiquetado por grado (1ro-5to de secundaria)

---

## 2. FORMATO DE ENSEÑANZA

### Problema
Solo texto markdown con opción múltiple. Monótono y poco interactivo.

### Mejoras
- **Video lessons** (integración con reproductor embebido)
- **Simulaciones interactivas** (ej: circuitos eléctricos, gráficas de funciones)
- **Ejercicios de arrastrar/soltar** y **relleno de espacios**
- **Laboratorios virtuales** para química y física
- **Diagramas interactivos** para anatomía, biología

---

## 3. ADAPTIVIDAD REAL

### Problema
La IA tiene patrones hardcodeados por keyword. No hay diagnóstico inicial ni rutas de aprendizaje personalizadas.

### Mejoras
- **Diagnóstico inicial:** Test de nivel (20 preguntas) para colocar al estudiante
- **Ruta adaptativa:** Ajustar dificultad según desempeño en ejercicios
- **Repetición espaciada (SRS):** Revisar conceptos difíciles con intervalos crecientes
- **Análisis de debilidades:** Detectar temas donde el estudiante falla más
- **Recomendaciones inteligentes:** Sugerir qué estudiar después basado en rendimiento

---

## 4. EXÁMENES PERUANOS

### Problema
Solo SAT y TOEFL. No hay prep para exámenes de admisión UNI/UNMSM.

### Mejoras
- **Banco de preguntas UNI:** 500+ preguntas de admisión reales (Mate, Física, Química, Aptitud)
- **Banco de preguntas UNMSM:** 500+ preguntas por área (A: Ciencias Salud, B: Ingenierías, C: Económicas, D: Humanidades)
- **Simulacros cronometrados:** Modo examen real con temporizador
- **Exámenes de años anteriores:** UNI 2020-2024, UNMSM 2019-2024
- **Reporte de desempeño por tema** después de cada simulacro

---

## 5. CONTENIDO PERUANO Y CULTURAL

### Problema
Falta contenido en quechua/aymara, contextualización a la realidad peruana.

### Mejoras
- **Contenido multilingüe:** Resúmenes en Quechua y Aymara para materias clave
- **Ejemplos peruanos:** Usar contexto peruano en problemas (economía peruana, geografía, historia)
- **Realidad nacional:** Problemas de probabilidad con contexto peruano, estadística con datos del INEI

---

## 6. ACCESIBILIDAD Y DISTRIBUCIÓN

### Problema
No funciona offline. No es PWA. No tiene app móvil.

### Mejoras
- **PWA (Progressive Web App):** manifest.json + service worker para instalación como app
- **Modo offline:** Cache de lecciones con Service Worker
- **Optimización para bajo ancho de banda:** Imágenes comprimidas, modo texto-only
- **Diseño mobile-first:** Responsive completo para celulares básicos
- **Descarga de contenido:** Permitir descargar lecciones para ver offline

---

## 7. APRENDIZAJE SOCIAL

### Problema
No hay foros, grupos de estudio, ni interacción entre estudiantes.

### Mejoras
- **Foros por curso y tema:** Discusiones moderadas
- **Grupos de estudio:** Crear/join grupos para prepararse juntos
- **Sistema de preguntas y respuestas entre pares**
- **Eventos en vivo:** Webinars semanales con profesores invitados
- **Leaderboards anónimas:** Comparativa de progreso con otros estudiantes

---

## 8. ANALÍTICA AVANZADA

### Problema
El dashboard solo muestra stats básicos (XP, lecciones). Sin análisis de debilidades.

### Mejoras
- **Mapa de conocimiento:** Visualización de temas dominados vs. débiles
- **Análisis de patrones de error:** Qué tipo de errores comete el estudiante
- **Recomendaciones personalized:** "Estudiar X porque has fallado 3 veces en Y"
- **Comparativa con meta:** "Necesitas mejorar 15% en mate para llegar a UNI"
- **Reporte semanal/trimestral:** Exportable en PDF

---

## 9. MODELO DE SOSTENIBILIDAD

### Problema
Gratis sin plan de monetización ni certificaciones.

### Mejoras
- **Freemium:** Plan gratuito (contenido básico) + Plan Pro (exámenes, IA avanzada, certificados)
- **Certificados de finalización:** Con valor para currículum
- **Becas KAIRO:** Programa para estudiantes de escasos recursos
- **Alianzas con universidades:** Contenido exclusivo de universidades asociadas

---

## 10. INFRAESTRUCTURA TÉCNICA

### Problema
Todo en localStorage, sin backend, sin tests, sin PWA.

### Mejoras
- **Backend real (Firebase/Supabase):** Para sincronización entre dispositivos y guardado persistente
- **Tests automatizados:** Vitest + React Testing Library
- **CI/CD:** GitHub Actions para deploy automático
- **Analytics:** Seguimiento de uso anónimo para mejorar contenido
- **Lighthouse score > 90:** Performance, accessibility, best practices

---

## 11. CALIDAD PEDAGÓGICA

### Problema
Solo opción múltiple. Falta ensayo, problemas reales, tips de examen.

### Mejoras
- **Ejercicios de respuesta abierta** con corrección IA
- **Problemas de la vida real** conectados al examen de admisión
- **Guías de redacción** para ensayos de admisión
- **Tips de examen:** Técnicas de tiempo, reducción de ansiedad, estrategias
- **Explicaciones más detalladas** con pasos intermedios

---

## 12. PILARES PARA UNIVERSIDAD

### Problema
Falta prep para ensayos, CV, entrevistas, becas, portafolio.

### Mejoras
- **Ensayos de admisión:** Banco de prompts + corrector IA para SAT, ACT, ensayos UNI/UNMSM
- **Preparación para entrevistas:** Tips por universidad, simulacros con IA
- **Builder de CV estudiantil:** Plantillas para currículum de candidato a universidad
- **Base de datos de becas:** Becas nacionales e internacionales con filtros
- **Portafolio de admisión:** Template para documentar proyectos y experiencias

---

## Priorización de Implementación

### Fase 1 (Inmediata — Alta Prioridad)
1. Agregar prep examen UNI y UNMSM con banco de preguntas
2. Agregar curso de Biología y Computación/Programación
3. Mejorar IA tutor con respuesta adaptativa
4. Agregar práctica de ensayos de admisión
5. Mejorar dashboard con análisis de debilidades
6. Agregar PWA (manifest + service worker)
7. Mejorar respuesta mobile/responsive

### Fase 2 (Medio Plazo)
8. Sistema de repetición espaciada (SRS)
9. Gamificación avanzada (leaderboards, más badges)
10. Guías de CV y entrevistas
11. Base de datos de becas
12. Video lessons (integración)
13. Modo offline con Service Worker

### Fase 3 (Largo Plazo)
14. Backend real (Firebase/Supabase)
15. Test automatizados
16. Modelo freemium + certificados
17. Red social / foros
18. Laboratorios virtuales
19. Contenido en Quechua/Aymara

---

## Métricas de Éxito

- **Cobertura de contenido:** +300% de cursos actuales
- **Usuarios activos mensuales:** Meta de 100,000 en 12 meses
- **Tasa de mejora académica:** % de estudiantes que mejoran notas tras 3 meses de uso
- **Lighthouse Score:** > 90 en todos los aspectos
- **Offline capability:** 80% del contenido utilizable sin internet