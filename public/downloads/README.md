# Descargas KAIRO (APK / EXE)

Esta carpeta se sirve estáticamente desde Vercel en `https://kairoedu.vercel.app/downloads/...`.
La interfaz del botón "Descargar App" (componente `src/components/InstallApp.tsx`) lee
`version.json` para mostrar versión, tamaño y fecha de cada binario.

## Estructura esperada

| Archivo                | Tamaño aprox. | Descripción                                  |
| ---------------------- | ------------- | -------------------------------------------- |
| `kairo.apk`            | ~3 MB         | App Android (wrapper TWA de la plataforma)   |
| `KAIRO-Setup.exe`      | ~90-120 MB    | Instalador Windows (Electron + NSIS)         |
| `version.json`         | —             | Metadatos mostrados en el modal de descarga  |

> ⚠️ Los binarios NO se suben a git. Generarlos y copiarlos aquí con las
> instrucciones de abajo, o usar GitHub Releases y actualizar `version.json`.

## Cómo regenerar el APK (Android — TWA)

1. La PWA debe estar publicada y con `manifest.json` + `sw.js` válidos
   (ya está: iconos `icon-192/512.png`, `icon-maskable-192/512.png`).
2. Entrar a **https://www.pwabuilder.com** → pegar `https://kairoedu.vercel.app`.
3. Validar la PWA y hacer clic en **Package for Android**.
4. Configurar: `com.studymind.kairo` (appId), versión, nombre "KAIRO",
   ícono (usar `icon-maskable-512.png`), y descargar el **APK firmado**.
5. Copiar el archivo aquí como `kairo.apk` y actualizar `version.json`.

Alternativa con CLI: `npm i -g @bubblewrap/cli` (requiere Java + Android SDK).

## Cómo regenerar el EXE (Windows — Electron)

En una máquina con Node.js ≥ 18 instalado:

```bash
npm install                 # instala electron + electron-builder
npm run build:exe           # genera release/KAIRO-Setup-1.0.0.exe
```

1. Copiar `release/KAIRO-Setup-*.exe` aquí como `KAIRO-Setup.exe`.
2. Actualizar `version.json` (versión, tamaño, fecha).

Configuración en `package.json` → sección `"build"` y entrada `electron/main.cjs`.

## Notas

- El EXE pesa más del límite de descarga en algunos navegadores móviles:
  siempre sirve enlazarlo desde el modal (Android ve el APK primero).
- Vercel permite archivos estáticos de hasta 100 MB; si el EXE excede ese
  límite, hostear el binario en GitHub Releases y apuntar `exe.url` ahí.