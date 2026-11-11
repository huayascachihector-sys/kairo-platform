# Cursos Premium IB — Carpeta de contenido

Aquí viven los cursos HTML generados con IA (Claude Premium) para el **IB Diploma Programme**.

## Materias disponibles

| Carpeta           | Materia              |
| ----------------- | -------------------- |
| `matematicas/`     | Mathematics AA / AI  |
| `fisica/`          | Physics              |
| `historia/`        | History              |
| `sociedad-digital/`| Digital Society       |

## Cómo agregar un curso

### Opción A: manual (2 pasos)

1. **Copia el HTML** del curso a la carpeta de su materia.
   Ejemplo: `public/cursos-premium/matematicas/funciones-cuadraticas.html`

2. **Agrega una entrada** al final de la lista `"courses"` en `manifest.json`:

```json
{
  "id": "matematicas-funciones-cuadraticas",
  "title": "Funciones Cuadráticas",
  "subject": "matematicas",
  "level": "SL",
  "file": "matematicas/funciones-cuadraticas.html",
  "description": "Descripción corta del curso.",
  "durationMin": 45,
  "order": 1
}
```

Campos:

- `id`: identificador único en minúsculas con guiones (se usa en la URL `#/cursos-premium/<id>`).
- `subject`: una de `matematicas`, `fisica`, `historia`, `sociedad-digital`.
- `level`: `SL` o `HL`.
- `file`: ruta relativa a esta carpeta.
- `durationMin`: duración estimada en minutos.
- `order`: posición de ordenamiento (menor = primero).

### Opción B: script automático (un curso)

```bash
npm run premium:add -- --subject matematicas --title "Funciones Cuadráticas" --file ./mi-curso.html --level SL
```

El script copia el HTML a la carpeta correcta y actualiza `manifest.json` automáticamente.

### Opción C: escaneo masivo (recomendado)

Si ya copiaste muchos HTMLs a las carpetas, regenera el manifest completo leyendo el `<title>` y la `<meta description>` de cada archivo:

```bash
npm run premium:scan            # regenera manifest.json
npm run premium:scan -- --dry   # solo muestra lo detectado, sin escribir
```

Detecta automáticamente materia (por carpeta), número de módulo (`Módulo 12`), nivel (`NM`/`SL` → SL, `NS`/`HL` → HL) y limpia sufijos como `· Física IB` o `(1)` del título. **Sobrescribe** los ajustes manuales del manifest (título, descripción, duración), así que edítalos después si hace falta.

## Notas

- Cada curso debe ser **un único HTML autocontenido** (CSS/JS inline, sin archivos externos).
- La app lee este manifest con `fetch("/cursos-premium/manifest.json")`; si falla, muestra un estado vacío con instrucciones.
- Los 4 HTMLs demo (`funciones-cuadraticas.html`, `cinematica-mru.html`, `guerra-fria.html`, `inteligencia-artificial.html`) se pueden borrar; luego ejecuta `npm run premium:scan` para actualizar el manifest.
- Se admiten subcarpetas (p. ej. `fisica/PRUEBA 1/…`); el escaneo es recursivo y las rutas con acentos/espacios se codifican correctamente.
