# protocolo_de_abordaje_tea

Aplicación web interactiva que reproduce el protocolo de abordaje de los trastornos de aprendizaje mediante un flujo de preguntas y decisiones. Está construida con React, Vite y Tailwind CSS.

## Versión sin frameworks

Para una versión completamente autónoma en HTML + JavaScript + CSS (sin dependencias externas), abre el archivo [`standalone/flujo-diagnostico-sin-frameworks.html`](standalone/flujo-diagnostico-sin-frameworks.html) directamente en el navegador. Replica la misma lógica del flujo sin necesidad de Node.js ni del bundler.

## Requisitos previos

- Node.js 18 o superior
- npm 9 o superior

## Instalación

```bash
npm install
```

## Scripts disponibles

- `npm run dev`: inicia el servidor de desarrollo en `http://localhost:5173`.
- `npm run build`: genera la versión de producción.
- `npm run preview`: sirve la compilación de producción de forma local.
- `npm run lint`: ejecuta ESLint sobre el código fuente.

## Estructura principal

- `src/components/FlujoDiagnosticoAprendizaje.tsx`: componente principal con la lógica del flujo.
- `src/components/ui`: componentes reutilizables de interfaz (`Button`, `Card`).
- `src/index.css`: estilos base y configuración de Tailwind CSS.

## Licencia

Este proyecto se distribuye con fines educativos.
