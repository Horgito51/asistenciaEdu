# AsistenciaEdu

Sistema de control escolar para docentes. Asistencia diaria, notas por actividad y reportes de incidentes.

## Demo
👉 `https://github.com/Horgito51/asistenciaEdu.git`

## Qué hace
- Marcar asistencia diaria y enviarla a Inspección
- Registrar notas por materia y actividad
- Ver el perfil completo de cada estudiante con su boletín
- Crear reportes de incidentes y notificar por Telegram (gratis) o WhatsApp (premium)

## Archivos
```
index.html        → app principal
assets/style.css  → estilos
assets/app.js     → lógica
assets/logo.svg   → ícono
```

## Deploy en GitHub Pages

1. Crea un repositorio en GitHub
2. Sube todos los archivos
3. Ve a **Settings → Pages → Source → GitHub Actions**
4. Listo, en 1-2 minutos está en vivo

## Antes de subir

En `assets/app.js` reemplaza la URL del formulario de registro:

```js
const GOOGLE_FORM_URL = 'https://forms.gle/TU_FORM_ID_AQUI';
```

## Stack

HTML + CSS + JavaScript puro. Sin frameworks, sin dependencias.