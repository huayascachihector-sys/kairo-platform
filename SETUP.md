# SETUP — KAIRO Platform

> **Instrucciones para otra IA (u operador humano) que clone y ejecute KAIRO en un dispositivo nuevo.**
> Este documento es autorreferencial: sigue los pasos en orden y la aplicación
> debería funcionar sin problemas.

---

## 1. Requisitos previos

| Herramienta | Versión mínima | Comentario |
|-------------|----------------|------------|
| Node.js     | v20.x          | Se usó v24.18.0 en el entorno original; cualquier versión LTS >= 20 sirve. |
| npm         | 10.x           | npm 11.16.0 funciona. Alternativa: `bun` (hay `bunfig.toml` + `bun.lock`). |

```bash
node --version   # >= 20
npm --version    # >= 10
```

No se necesita instalación global de TypeScript, Vite ni ESLint; todo está en `devDependencies`.

---

## 2. Clonar el repositorio

```bash
git clone <URL-del-repositorio>
cd <nombre-del-directorio>
```

Verifica que `package.json`, `vite.config.ts`, `tsconfig.json`, `.env.example` y
`package-lock.json` existan tras clonar.

---

## 3. Instalar dependencias

### Opción npm (recomendado)

El proyecto tiene `package-lock.json`, así que usa `npm ci` para una instalación
reproducible y determinista:

```bash
npm ci
```

> Si `npm ci` falla por discrepancias en el lockfile, usa `npm install` como
> respaldo.

### Opción bun (alternativa)

```bash
bun install
```

`bunfig.toml` impone una política `minimumReleaseAge = 86400` (24 h) como
guardia de cadena de suministro; los paquetes `@lovable.dev/*` están excluidos
de esta guardia.

---

## 4. Configurar variables de entorno

Copia el archivo de ejemplo:

```bash
cp .env.example .env
```

Edita `.env` con los siguientes valores:

```env
# Obligatorio para que el tutor de IA funcione (chat Perú e Inglés).
# Si no se provee, las APIs devuelven un mensaje graceful 503.
OPENROUTER_API_KEY=tu_api_key_aqui

# URL del microservicio local de generación de videos (FastAPI).
# Es opcional; si no hay microservicio, el endpoint devuelve 502 graceful.
VIDEO_API_URL=http://localhost:8000

# Fuente de datos IB (opcional). Por defecto usa /data/ib-questions.
# En producción, apunta a un CDN o backend (el banco IB es ~3.3 GB).
# IB_DATA_SOURCE=https://cdn.yourdomain.com/ib-questions

# Modo de depuración.
DEBUG=false
```

- `OPENROUTER_API_KEY` — clave de OpenRouter. Las APIs `/api/chat` y
  `/api/chat-english` hacen `fetch` a `https://openrouter.ai/api/v1/chat/completions`.
  Sin esta clave, el chat muestra `⚠️ El servicio de IA no está configurado.` (HTTP 503)
  sin romper la app.
- `VIDEO_API_URL` — el endpoint `/api/generar-video` proxyea a este servicio.
  Sin él, devuelve HTTP 502 con un mensaje descriptivo.
- Las otras variables son opcionales; los valores por defecto son seguros para
  desarrollo local.

---

## 5. Ejecutar en desarrollo

```bash
npm run dev
```

Esto inicia **Vite** (el config de Vite proviene de
`@lovable.dev/vite-tanstack-config` y se extiende con `vite.config.ts`).

- La aplicación se sirve en **`http://localhost:{puerto}`** (el puerto lo asigna
  Vite automáticamente si el 5173 está ocupado; revisa la salida en consola).
- SSR está activado vía `src/server.ts` (envoltura de manejo de errores h3).
- Las rutas SSR son `/` (renderiza `App.tsx` como `ClientOnly`) y
  `/plataforma-neuro` (NeuroPlatform).
- API endpoints: `/api/chat`, `/api/chat-english`, `/api/extract-questions`,
  `/api/generar-video`, `/api/generar-video/{action}/{jobId}`.

### Rutas cliente (hash SPA dentro de App.tsx)

App.tsx implementa su propio enrutador hash: `#/matematicas`, `#/recursos`,
`#/cursos`, `#/blog`, `#/about`, `#/registro`, `#/onboarding`, `#/plataforma`,
`#/robot`. Estas son renderizadas vía `React.lazy` + `Suspense`.

---

## 6. Construir para producción

```bash
npm run build       # build de Vite (SSR + cliente)
npm run build:dev   # build en modo development (más rápido, con logs)
npm run preview     # servir el build localmente
```

El build de Vite usa **Nitro** con target Cloudflare por defecto (configurado
en `@lovable.dev/vite-tanstack-config`). La entrada del server es
`src/server.ts` (configurado en `vite.config.ts` → `tanstackStart.server`).

---

## 7. Verificación de tipos y linting

```bash
npx tsc --noEmit   # verifica tipos TypeScript (strict: true)
npm run lint       # ESLint + Prettier
```

El `tsconfig.json` incluye `src/**/*.ts`, `src/**/*.tsx`, `vite.config.ts`,
`eslint.config.js`. El alias `@/*` mapea a `./src/*`.

---

## 8. Datos excluidos del repositorio (gitignored)

Los siguientes directorios pesados **no están en el repositorio** y están en
`.gitignore`:

| Ruta | Tamaño aproximado | Notas |
|------|--------------------|-------|
| `public/data/ib-questions/` | ~3.3 GB | Banco de preguntas IB. La app hace `fetch('/data/ib-questions/...')` con fallback graceful si falta. |
| `public/data/question-bank/` | — | Banco de preguntas local. |
| `public/videos/` | — | Videos generados. |
| `public/avatars/` | — | Avatares de estudiantes. |
| `herramientas/`, `agentedevideos/`, `generador_videos/` | — | Herramientas de generación de videos (repos externos, no parte del árbol src). |
| `.env` | — | Nunca está en el repo; usa `.env.example`. |
| `.output/`, `.tanstack/`, `.nitro/` | — | Artefactos de build. |

> La aplicación **funciona sin estos datos**. Los componentes que intentan
> cargar contenido faltante usan try/catch y fallbacks UI.

---

## 9. Resumen de archivos clave

| Archivo | Propósito |
|---------|-----------|
| `package.json` | Dependencias y scripts. |
| `vite.config.ts` | Configuración Vite; delega a `@lovable.dev/vite-tanstack-config`. |
| `tsconfig.json` | Tipado estricto, alias `@/*`. |
| `eslint.config.js` | ESLint con TypeScript, React Hooks, Prettier. |
| `.prettierrc` | Formateo: 100 cols, semi, double quotes, trailing comma. |
| `bunfig.toml` | Configuración bun (instalación). |
| `components.json` | shadcn/ui (estilo New York, Tailwind, alias `@/components`). |
| `src/server.ts` | Entry SSR de Nitro/Vite; wrapper de errores. |
| `src/start.ts` | Instancia TanStack Start con middleware de errores. |
| `src/App.tsx` | Hash SPA router (13 rutas, lazy loading). |
| `src/routes/index.tsx` | Ruta SSR `/` → App.tsx (ClientOnly). |
| `src/routes/plataforma-neuro.tsx` | Ruta SSR `/plataforma-neuro`. |
| `src/routes/__root.tsx` | Root route con QueryClient, SEO meta, error/404. |
| `src/routes/api/*.ts` | 4 endpoints API (chat, chat-english, extract-questions, generar-video). |
| `.env.example` | Template de variables de entorno. |
| `AGENTS.md` | Documentación de arquitectura (metodologías, roadmap). |
| `DOCUMENTACION_PROYECTO.md` | Documentación completa del proyecto KAIRO. |

---

## 10. Solución de problemas comunes

| Problema | Causa probable | Solución |
|----------|----------------|----------|
| `error:0308010E:digital envelope` | Node.js >= 17 con OpenSSL | `export NODE_OPTIONS=--openssl-legacy-provider` (solo si usas herramientas vieja). |
| Port 5173 already in use | Otra instancia corriendo | Vite autoasigna el siguiente puerto disponible; revisa la consola. |
| `OPENROUTER_API_KEY not set` | `.env` no copiado | `cp .env.example .env` y agrega la clave. |
| Chat devuelve 503 | `OPENROUTER_API_KEY` ausente o inválida | Verifica `.env` y la clave en OpenRouter. |
| `Cannot find module '@/...'` | Instalación incompleta o tsconfig | Ejecuta `npm ci` de nuevo. |
| Tipos fallan (`tsc --noEmit`) | Lockfile desincronizado | `rm -rf node_modules package-lock.json && npm install`. |

---

## 11. Pasos rápidos (checklist de 5 minutos)

```bash
git clone <repo>
cd <repo>
npm ci
cp .env.example .env
# Edit .env → agrega OPENROUTER_API_KEY (o déjalo vacío; funciona sin IA)
npm run dev
```

Navega a `http://localhost:5173` (o el puerto que Vite asigne). ¡Listo!

---

## 12. Subir a GitHub (primera vez)

Si el repositorio local no tiene remote configurado:

```bash
# 1. Conectar tu repo de GitHub (reemplaza TU-USUARIO)
git remote add origin https://github.com/TU-USUARIO/kairo-platform.git

# 2. Renombrar rama master → main
git branch -M main

# 3. Commitear todos los archivos
git add -A
git commit -m "Initial commit: KAIRO platform"

# 4. Primer push y tracking de rama
git push -u origin main
```

**Después de este primer push**, cada cambio futuro es:
```bash
git add -A
git commit -m "descripción del cambio"
git push
```

### Notas importantes
- `.gitignore` excluye: `.env`, `public/data/ib-questions/`, `public/videos/`, `public/avatars/`, `node_modules/`, `.output/`
- El archivo `.env` **nunca** se sube al repo. Cada despliegue debe configurar `OPENROUTER_API_KEY`.

### Despliegue público (recomendado: Vercel)

1. Crea cuenta en [vercel.com](https://vercel.com) con OAuth de GitHub
2. Haz clic en "New Project" → importa tu repo `kairo-platform`
3. En Settings → Environment Variables, añade:
   - `OPENROUTER_API_KEY` = tu clave (o déjalo vacío)
   - `VIDEO_API_URL` = `http://localhost:8000` (opcional)
4. Haz clic en "Deploy" → obtienes una URL pública automática
