# Navegación móvil de ElectroWorld

## Recorridos

- Bienvenida → COMENZAR → menú principal.
- Menú principal → SIMULADORES → menú de simuladores.
- Simuladores → CAMPO ELÉCTRICO → laboratorio existente.
- Simuladores → LEY DE OHM → circuito interactivo con V, R, I y P.
- Menú principal → MINIJUEGOS → Carga Clash / Power Up / Coulomb Shot.
- Botones de regreso en todas las pantallas secundarias. Cada juego vuelve a Minijuegos; cada simulador vuelve a Simuladores.

Gauss y magnetismo solo aparecen como tarjetas desactivadas con la etiqueta Próximamente. Ley de Ohm y los tres minijuegos ya son funcionales; consulta [su guía](ohm-and-games.md).

## Organización

| Archivo | Responsabilidad |
| --- | --- |
| `src/App.jsx` | Estado de navegación (`welcome`, `main-menu`, `simulators`, `games`, `charge-clash`, `power-up`, `coulomb-shot`, `electric-field`, `ohms-law`), conservación del estado del laboratorio, foco y título de cada pantalla. |
| `src/screens/WelcomeScreen.jsx` | Bienvenida, identidad de ElectroWorld, textos y botón COMENZAR. |
| `src/screens/MainMenu.jsx` | Tarjetas SIMULADORES y MINIJUEGOS. |
| `src/screens/SimulatorsMenu.jsx` | Acceso a Campo eléctrico y Ley de Ohm; tarjetas futuras. |
| `src/screens/GamesMenu.jsx` | Catálogo de tres juegos y récords de sesión. |
| `src/screens/ElectricFieldLab.jsx` | Laboratorio extraído del anterior App, con regreso a simuladores. |
| `src/screens/ElectricFieldLab.css` | Estilos existentes del laboratorio trasladados y ajustes de tamaños táctiles y márgenes seguros. |
| `src/screens/OhmsLawLab.jsx` | Circuito interactivo, sliders de V/R, lecturas de I/P y feedback breve. |
| `src/components/MenuCard.jsx` | Tarjetas táctiles reutilizables y estados Próximamente. |
| `src/components/MenuIcon.jsx` | Iconos SVG locales, sin librerías adicionales. |
| `src/components/ScreenLayout.jsx` | Encabezado, botón de regreso y estructura compartida por menús y pantalla de Ohm. |
| `src/App.css` | Diseño de bienvenida, tarjetas, menús y pantallas preparatorias. |
| `src/index.css` | Ancho mínimo adaptado a pantallas de 320 px. |
| `index.html` | Título de Física II, color del navegador y viewport con `viewport-fit=cover`. |

También se actualizaron `README.md` y la referencia de arquitectura de `docs/electro-lab-core.md`.

## Conservación del simulador

Se reutilizan sin cambios `src/physics/electrostatics.js`, `src/lab/`, los componentes de cargas, vectores, distancias, campo, panel, escena y el hook de arrastre. No se reescribió ninguna fórmula. Las pruebas de física y estado tampoco cambian.

`App.jsx` mantiene el reducer del laboratorio. Al cerrar la pantalla se desmonta el canvas para liberar los recursos 3D, pero permanecen cargas, valores, posiciones, selección, punto P y opciones visuales. Al volver, se reconstruye la escena con esos datos. La cámara vuelve a su vista inicial; el reinicio del laboratorio sigue siendo explícito. Recargar la aplicación inicia una nueva sesión en la bienvenida.

`React.lazy` y `Suspense` cargan el módulo 3D solo al entrar a Campo eléctrico. Los menús no crean un canvas ni descargan el paquete 3D. La compilación inicial queda en aproximadamente 221 kB de JavaScript sin comprimir y 70 kB gzip; el laboratorio tiene su paquete aparte.

No se instaló React Router ni ninguna dependencia. La navegación se resuelve con estado de React y botones visibles; no se añadieron rutas de servidor ni integraciones con el botón físico de Android.

## Adaptación móvil y Capacitor

Se utilizaron tarjetas grandes, botones de regreso de 48 px, acción principal de 58 px, controles del laboratorio ampliados y márgenes con `env(safe-area-inset-*)`. El contenido puede desplazarse verticalmente en pantallas pequeñas y horizontales. No se usan fuentes ni iconos descargados de servicios externos.

Esta copia del repositorio no contiene `android/`, `capacitor.config.*` ni dependencias de Capacitor. No se generaron, modificaron ni sincronizaron archivos nativos. Se conserva la salida estándar de Vite en `dist/`. La validación realizada corresponde a la aplicación web; no se compiló un APK ni se probó en un dispositivo Android físico.

## Validación

La navegación base se validó el 21 de octubre de 2026. La ampliación de Ohm y los juegos tiene su validación actualizada en [ohm-and-games.md](ohm-and-games.md).

- `npm run build`: correcto, con paquete independiente para ElectricFieldLab. Permanece el aviso de Vite por el tamaño del módulo 3D.
- `npm run lint`: correcto.
- `npm test`: las 19 pruebas existentes de física y estado aprobadas.
- `git diff --check`: correcto.
- Chromium sobre la compilación de producción: nueve grupos de comprobaciones de navegación con emulación táctil, sin errores de consola. Se probaron bienvenida, menús, estados Próximamente, pantalla base de Ohm, carga diferida del laboratorio, conservación del estado entre pantallas, reinicio y tamaños de 320, 360, 390 y 430 px, además de horizontal 844 × 390, sin desbordamiento horizontal.
- Se repitieron las 16 comprobaciones anteriores del laboratorio a través de la nueva navegación: altas, bajas, edición, selección, arrastre, slider diagonal, punto de prueba, capas, ceros, coincidencias, cámara, cancelación, reinicio y vista móvil. Todas aprobadas, sin errores JavaScript ni de consola.
- Se verificó con Git que física, modelo del laboratorio, componentes existentes, pruebas, dependencias y archivo de bloqueo permanecen sin modificaciones.

Las comprobaciones de navegador se ejecutaron con Playwright ya disponible en el entorno, sin añadirlo a las dependencias del proyecto.

## Prueba manual rápida

1. Ejecuta `npm ci` y `npm run dev`. Debe aparecer ELECTROWORLD, el subtítulo de Física II, Experimenta · Aprende · Juega y COMENZAR.
2. Pulsa COMENZAR. Comprueba las dos tarjetas grandes del menú principal.
3. Abre SIMULADORES. Verifica Campo eléctrico, Ley de Ohm y las tarjetas futuras desactivadas.
4. Abre Campo eléctrico. Añade una carga, cambia su valor/posición, mueve el slider, arrastra una esfera y P, y prueba las cuatro capas.
5. Regresa a simuladores y vuelve a Campo eléctrico. Comprueba que se conservaron los datos y las opciones.
6. Abre Ley de Ohm. Ajusta los sliders de V/R y comprueba corriente, potencia, flujo y brillo. Regresa al menú.
7. Abre MINIJUEGOS desde el menú principal. Abre los tres juegos, prueba sus botones de regreso y comprueba el récord después de sumar puntos.
8. Prueba un ancho de 320 px y orientación horizontal: las tarjetas siguen siendo táctiles y el contenido se desplaza verticalmente sin recortarse horizontalmente.
