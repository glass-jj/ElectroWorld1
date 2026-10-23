# Rediseño oscuro y juegos arcade

> La portada y los menús recibieron una actualización visual posterior: [menús de vidrio oscuro y mini escenas](glass-menus.md). Este documento conserva las reglas arcade y las instrucciones de Spline.

## Interfaz

La portada y los menús usan negro, grafito, marfil y un acento oliva discreto. Se sustituyeron la ilustración de neón, los degradados de tarjetas y los encabezados saturados por tipografía ligera, jerarquía más clara y superficies neutras. La portada incluye una composición metálica SVG local que funciona sin conexión.

Los menús mantienen la navegación por estado, las zonas táctiles y los márgenes seguros. El laboratorio de campo eléctrico, sus fórmulas, estado y componentes 3D permanecen sin cambios. Ley de Ohm conserva sus cálculos; su circuito y controles reciben ajustes de color.

## Spline

Se añadió únicamente el runtime oficial `@splinetool/runtime` (2.0.107 en el archivo de bloqueo). No se añadieron Next.js ni el adaptador de React/Next. El runtime se importa dinámicamente solo si hay una escena válida configurada para la portada.

Todavía no hay una escena de Spline proporcionada por el usuario. La integración está lista, pero la portada entregada muestra la ilustración SVG incluida: no se presenta esa ilustración como una escena de Spline.

Para activar una escena:

1. En Spline, exporta la escena mediante Export → Code y copia la URL que termina en `.splinecode`.
2. Crea `.env.local` a partir de `.env.example` y configura:

   ```env
   VITE_SPLINE_SCENE_URL=https://prod.spline.design/TU_ESCENA/scene.splinecode
   ```

3. Reinicia Vite, o ejecuta `npm run build` para incorporar la configuración en la compilación.

También puedes guardar los archivos de la escena en `public/scenes/` y usar `/scenes/scene.splinecode`. Los recursos externos referenciados por la escena deben estar disponibles; copiar solo el archivo no garantiza que todas sus texturas o fuentes sean locales.

Se aceptan URLs HTTPS de escenas exportadas o rutas locales. No se usa un enlace de edición del proyecto ni se inventa una escena pública. Si falta la URL, falla la escena, se pierde WebGL, se solicita ahorro de datos o se prefiere movimiento reducido, se conserva la ilustración local y los botones siguen disponibles. La carga tiene un límite de 15 segundos y se cancela al salir. El contenido HTML de las escenas se desactiva: la integración se usa como portada 3D.

Una escena real y su rendimiento en Android no se pudieron validar sin el archivo o enlace del usuario. La compilación incluye los módulos de Spline; su descarga y ejecución en el navegador se difieren. La complejidad y el peso de la escena elegida también afectarán al rendimiento.

## Juegos renovados

### Carga Clash: captura y polaridad

- Elige el signo de tu carga con CARGA + / CARGA −.
- La carga entrante cae por una pista. Pulsa CAPTURAR al entrar en la zona y usando el signo opuesto.
- Capturar antes, después o con el mismo signo pierde una vida. Hay tres vidas y un máximo de 45 segundos.
- Cada captura suma 100 puntos, con hasta 100 puntos adicionales por racha. Las cargas llegan más rápido conforme progresas, con un límite de velocidad.
- La física educativa se mantiene: los signos opuestos se atraen y los iguales se repelen.

### Power Up: mantener y soltar

- Mantén pulsado para aumentar el voltaje y suelta cuando la corriente entre en la zona objetivo. Si mantienes demasiado tiempo, el nivel vuelve a bajar y puedes esperar al siguiente ciclo.
- Elige entre 2, 4 o 6 Ω; la corriente y la potencia siguen las fórmulas de Ohm.
- Hay cinco misiones y tres vidas. El margen arcade es ±8 %; la puntuación va de 300 a 500 por misión según precisión. El helper numérico original de ±5 % sigue disponible, pero esta interfaz utiliza el nuevo juez arcade.
- Cancelar el toque o perder el foco interrumpe la carga sin gastar una vida. También se puede mantener y soltar Espacio o Enter.

### Coulomb Shot: puntería y objetivo móvil

- Elige distancia: 2,5 / 4 / 5,5 m. Mantén para aumentar la magnitud de carga y suelta para lanzar.
- La marca de llegada muestra el alcance previsto y la zona se desplaza. La posición de la zona se fija durante el vuelo para evaluar el tiro de forma consistente.
- Se reutilizan `electricForce`, `magnitude` y el mapeo arcade anterior. No se reimplementa Coulomb ni se modifica la física del laboratorio.
- Cada ronda permite tres tiros. Un impacto termina la ronda; tres fallos también permiten avanzar. Hay cinco rondas y puntos variables por precisión e intentos.
- El movimiento reducido fija el objetivo y elimina la animación del tiro. La marca de puntería y los textos permiten jugar igualmente.

Los récords se mantienen en React durante la sesión. Las partidas se reinician al salir y volver; los mejores puntos permanecen hasta recargar. No hay backend ni audio.

## Archivos principales

- `App.css`, `index.css`, `WelcomeScreen`, `MainMenu`, `SimulatorsMenu`, `GamesMenu`, `MenuCard` y `ScreenLayout`: nuevo sistema visual y menús.
- `HeroArtwork.jsx`: ilustración local. `SplineHero.jsx`: carga, descarte de recursos y fallback. `config/spline.js`: validación de la URL. `.env.example`: configuración de ejemplo.
- `arcadeLogic.js`: lógica pura de captura, precisión, carga y movimiento de objetivo.
- `useHoldCharge.js`, `useArcadeLoop.js`, `useReducedMotion.js`: gestos, ciclos y accesibilidad.
- `ChargeClash.jsx`, `PowerUp.jsx`, `CoulombShot.jsx` y `Games.css`: nuevas partidas.
- `useCountdown.js`: permite detener el reloj al perder todas las vidas.
- `Circuit.css`: actualización de colores del circuito, sin cambiar las fórmulas.
- `tests/arcade-and-spline.test.js`: ocho pruebas nuevas; las 32 anteriores siguen pasando.

## Verificación

- `npm run build`, `npm run lint` y `npm test`: correctos. 40 pruebas aprobadas.
- Chromium con emulación táctil: portada, menús, ausencia de descarga de Spline sin configuración, capturas, combos, vidas, temporizador, partidas completas, precisión, objetivos móviles, reinicio, cancelación del toque y récords.
- Anchos de 320, 360, 390 y 430 px, además de horizontal: sin desbordamiento; botones de juegos de al menos 44 px.
- Movimiento reducido: objetivo de Coulomb Shot estático y Spline sin iniciar. La ilustración local permanece disponible.
- Escena de Spline ausente: portada local y navegación operativas; no se probó una escena real proporcionada por el usuario porque aún falta ese recurso.
- Las 16 comprobaciones anteriores del laboratorio eléctrico siguen aprobadas.
- Android y Capacitor no se modificaron. No se compiló un APK ni se validó un dispositivo físico.

## Vista previa

[Portada oscura](previews/welcome-dark.png) · [Menú principal](previews/dashboard-dark.png)
