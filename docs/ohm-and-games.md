# Ley de Ohm y minijuegos

## Alcance

Se amplía `feat/electro-lab-core` sobre la navegación móvil existente. No se modifican `electrostatics.js`, el estado ni los componentes del laboratorio de campo eléctrico, Android, Capacitor o las dependencias.

## Ley de Ohm

`calculateOhmsLaw` centraliza I = V/R y P = V×I. Los sliders utilizan V = 0–24 V y R = 1–100 Ω. La configuración inicial es 12 V, 6 Ω, 2 A y 24 W. La función acota las entradas al dominio del laboratorio y protege frente a resistencia cero y entradas no finitas.

El circuito SVG compartido representa fuente, cables, resistencia y bombillo en un lazo cerrado. Diez puntos recorren el circuito: la duración de su animación disminuye cuando aumenta la corriente. Con V = 0 la animación queda pausada, I = 0 y P = 0. El brillo usa una escala logarítmica acotada de la potencia para que el cambio sea perceptible sin efectos pesados. Los valores físicos no dependen de estas escalas visuales.

El texto del circuito especifica que el movimiento es simbólico: no representa la velocidad individual de electrones. Las lecturas de V, R, I y P se actualizan de inmediato, con mensajes breves según el último control manipulado.

## Reglas de los juegos

### Carga Clash

- Empieza cuando se pulsa EMPEZAR y dura 45 segundos de reloj, también al pasar la página a segundo plano. No se pausa al ocultarla.
- Las cuatro parejas posibles son ++, −−, +− y −+. Se generan desde una lista finita y se evalúan con una sola función.
- Signos iguales: repulsión. Diferentes: atracción. El movimiento y la explicación muestran siempre la relación correcta, incluso si la respuesta fue incorrecta.
- Acierto: +100 y racha +1. Error: mantiene la puntuación y reinicia la racha.
- Durante 850 ms se bloquea la respuesta para mostrar feedback y evitar puntos duplicados. No se aceptan respuestas cuando vence el plazo, aunque falte actualizar el contador visual.
- Al terminar muestra puntos, mejor racha y JUGAR DE NUEVO.

### Power Up

- Cinco objetivos, en orden: 2 A, 0,5 A, 3 A, 1 A y 1,5 A.
- Controles de 0–24 V y 1–24 Ω, con pasos enteros. La física se reutiliza del laboratorio de Ohm.
- PROBAR acepta una corriente a ±5 % del objetivo, incluyendo los extremos. Los errores dan indicaciones para corregir V/R, sin penalización, y permiten reintentar.
- Cada misión correcta suma 300 puntos una sola vez. El bombillo recibe una confirmación visual y la siguiente misión aparece después de 950 ms.
- Al completar las cinco misiones muestra puntuación, aciertos e intentos. Sin penalizaciones y con reintentos, la puntuación de una partida completada es 1500.

### Coulomb Shot

- Una fuente fija de +5 μC y una carga ajustable de +1 a +10 μC, separadas 1,5–8 m.
- La fuerza se calcula mediante `electricForce` y `magnitude`, importadas de `src/physics/electrostatics.js`. La fórmula de Coulomb no se duplica.
- Alcance visual = fuerza en N × 1800, expresado como porcentaje de pista y limitado a 0–100 %. Es una escala arcade consistente, no una integración de proyectiles ni una distancia física real.
- Los centros de las zonas son 32, 52, 72, 44 y 64 % de la pista, con tolerancia de ±6 puntos porcentuales. Las pruebas comprueban que todas son alcanzables usando los pasos de los sliders.
- LANZAR bloquea los controles mientras dura la animación. El resultado se presenta a los 700 ms. Un impacto suma 500 una sola vez y habilita SIGUIENTE RONDA; los fallos permiten reintentar con un consejo de fuerza insuficiente o excesiva.
- Después de cinco impactos muestra puntuación, impactos e intentos. Sin penalizaciones, una partida completada suma 2500 puntos.

## Estado y navegación

Los datos de las partidas viven en sus componentes React. App conserva los mejores puntos de cada juego durante la sesión y actualiza el récord en cada acierto. Salir conserva ese récord, pero al volver se inicia una nueva partida. Recargar la aplicación elimina los récords. No se usa backend ni almacenamiento persistente.

Cada juego vuelve al catálogo Minijuegos. Los temporizadores se cancelan al salir o reiniciar, impidiendo callbacks de partidas anteriores. Las respuestas y lanzamientos utilizan un bloqueo inmediato durante el feedback o el movimiento para impedir que varios clics puntúen una sola acción más de una vez.

El feedback se desplaza a la vista cuando hace falta; las nuevas misiones, rondas y resúmenes vuelven a la parte superior. El laboratorio de campo eléctrico mantiene su estado existente al navegar, sin cambios en este comportamiento.

## Archivos

| Creado | Responsabilidad |
| --- | --- |
| `src/physics/ohmsLaw.js` | Ley de Ohm, potencia y escalas visuales del circuito. |
| `src/components/Circuit.jsx` | Circuito SVG y flujo/brillo; reutilizado por Ohm y Power Up. |
| `src/components/Circuit.css` | Circuito, controles, lecturas, animaciones y estilos compactos. |
| `src/components/OhmControls.jsx` | Sliders accesibles reutilizables con IDs únicos. |
| `src/games/gameLogic.js` | Parejas de signos, evaluación de misiones y fuerza/alcance/resultados arcade. |
| `src/games/ChargeClash.jsx` | Partida cronometrada de atracción/repulsión. |
| `src/games/PowerUp.jsx` | Cinco misiones de corriente. |
| `src/games/CoulombShot.jsx` | Cinco rondas de puntería. |
| `src/games/GameUI.jsx` | HUD, feedback y resumen compartidos. |
| `src/games/Games.css` | Catálogo, arenas, acciones y animaciones ligeras. |
| `src/games/useCountdown.js` | Plazo de reloj, contador y limpieza. |
| `src/games/useGameTimeout.js` | Un callback diferido cancelable por instancia. |
| `tests/ohm-games.test.js` | Trece pruebas nuevas de lógica pura. |
| `docs/ohm-and-games.md` | Esta guía. |

Modificados: `App.jsx` (pantallas y récords), `ScreenLayout.jsx` (clase de pantalla opcional), `GamesMenu.jsx` (catálogo funcional), `OhmsLawLab.jsx` (laboratorio funcional), `README.md` y `docs/mobile-navigation.md`.

## Accesibilidad y móvil

Botones de al menos 44 px y rangos táctiles de 44 px de alto. Los signos se muestran con + y − y nombres accesibles. Los mensajes de resultado usan `role="status"`; el significado no depende solo del color. El circuito tiene una descripción accesible de corriente y potencia. Se mantienen los márgenes seguros existentes.

Las animaciones son CSS/SVG y no hay sonido, recursos remotos ni bibliotecas nuevas. `prefers-reduced-motion` elimina movimiento de partículas y lanzamiento, pulsos y sacudidas; mantiene lecturas y feedback textual. La interfaz permite desplazamiento vertical en pantallas pequeñas.

## Validación

- `npm run build`: correcto. Se mantiene el aviso de Vite por el paquete del laboratorio 3D existente; no es un error de compilación.
- `npm run lint`: correcto.
- `npm test`: 32 pruebas aprobadas (19 anteriores y 13 nuevas).
- Pruebas puras: Ohm y potencia, entradas inválidas y resistencia cero, escalas de flujo/brillo, las cuatro parejas de Clash, tolerancia del 5 %, objetivos alcanzables, reutilización de Coulomb, relación inversa con el cuadrado de la distancia y tiros cortos/acertados/largos.
- Navegador: se comprobaron controles y animaciones de Ohm, cero voltios, explicación dinámica, catálogo y récords; partidas completas de los tres juegos, respuestas erróneas, clics repetidos, tiempo de Clash, reinicios, limpieza al salir y acceso al campo eléctrico.
- Se comprobó movimiento reducido y tamaños 320 px, 360×800, 390×844 y 430×932, sin desbordamiento horizontal y con botones de al menos 44 px.
- Se repitieron las 16 comprobaciones anteriores del campo eléctrico sobre la versión de producción.

Las comprobaciones de navegador usan Chromium con emulación táctil y Playwright ya disponible en el entorno. No se agregó como dependencia del proyecto. No se compiló un APK ni se probó un dispositivo Android físico; esta copia no contiene el proyecto nativo.

## Guía rápida de prueba manual

1. COMENZAR → SIMULADORES → LEY DE OHM. Comprueba 12 V / 6 Ω = 2 A y 24 W. Sube V: el flujo acelera. Sube R: se ralentiza. V = 0 detiene las partículas y apaga el bombillo.
2. Regresa al menú principal → MINIJUEGOS. Cada tarjeta tiene icono, descripción, récord y JUGAR.
3. Carga Clash: pulsa EMPEZAR, responde según los signos, falla una respuesta para comprobar la racha y espera 45 s. Repite la partida y vuelve al menú para ver el récord.
4. Power Up: con R = 6 Ω, los valores V = 12, 3, 18, 6 y 9 resuelven las cinco misiones. Antes de acertar prueba una corriente menor y otra mayor. Confirma el resumen y el reinicio.
5. Coulomb Shot: una carga de 1 μC a 8 m queda corta; 10 μC a 1,5 m se pasa. Con 6 μC, distancias aproximadas de 3,9 / 3,1 / 2,6 / 3,3 / 2,8 m permiten completar las cinco zonas. Pulsa SIGUIENTE RONDA después de cada impacto y VER RESULTADO al final.
6. Sal de un juego durante una animación y vuelve: no deben aparecer puntos ni callbacks de la partida anterior. Los récords anteriores deben conservarse hasta recargar.
7. Activa movimiento reducido en el sistema/navegador y prueba otra vez. Las animaciones deben desaparecer; los resultados siguen funcionando.
8. Abre CAMPO ELÉCTRICO y comprueba cargas, arrastre, slider, campo, capas y reinicio.
