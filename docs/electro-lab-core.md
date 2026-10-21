# ElectroWorld · Núcleo del laboratorio

## Base e historial

Trabajo realizado en `feat/electro-lab-core`, partiendo del commit `11a9b8ebfb68f3cccd61e6b68ed3ce378538f307` de `feat/distance-control` (`feat: add dynamic distance control`). La copia inicial no tenía cambios sin guardar. Se verificó posteriormente que la rama local de base coincide exactamente con la rama remota. No se modificó ni se fusionó `main`.

## Funcionalidades

1. Colección de cargas `{ id, value, position }` con identificadores únicos. Los valores de interfaz se almacenan en μC; la física los convierte a C.
2. Estado inicial: Q1 de +5 μC en (−2, 0, 0), Q2 de −5 μC en (2, 0, 0), selección Q1 y punto P en (0, 2, 0).
3. Adición en posiciones libres, selección automática y eliminación segura incluso hasta dejar cero cargas. Los IDs no se reutilizan durante una sesión; el reinicio restaura Q1/Q2.
4. Selección por clic sobre una esfera o por los botones de la lista. Un anillo y la etiqueta identifican la carga seleccionada.
5. Edición inmediata de valor, signo y posición XY. Los campos admiten negativos y decimales; las entradas vacías conservan el último valor físico válido y se restauran al perder el foco.
6. Arrastre sobre XY con Z = 0 y actualización de fuerzas, distancias y campo. Se conserva el desplazamiento inicial respecto al puntero para evitar saltos. OrbitControls se desactiva durante el gesto y se restaura al terminar, cancelar, perder el foco o desmontar el objeto. Se admite soltar fuera del lienzo.
7. Slider original de 1,5–8 m adaptado a la primera pareja que quede en la lista. Conserva el eje y el punto medio de la pareja; cerca del borde ajusta el punto medio para mantener ambas cargas dentro del tablero. Las demás cargas no se mueven. Se desactiva si hay menos de dos cargas. El arrastre puede dejar una distancia fuera del rango y el panel lo indica.
8. Fuerza vectorial resultante sobre cada carga, sumando las contribuciones de todas las demás. Vectores ámbar; lecturas Fx, Fy y |F| en N para la selección.
9. Punto P independiente, con forma de octaedro verde y movimiento por arrastre o inputs. No participa como carga fuente ni altera las fuerzas sobre las cargas.
10. Campo eléctrico total en P, sumado vectorialmente. Vector verde y lecturas Ex, Ey y |E| en N/C. La física también calcula las componentes Z.
11. Cuadrícula moderada 9 × 9 de campo total sobre XY, con separación de 1,5 m y extensión de −6 a +6 m. Se omiten muestras a menos de 0,9 m de una carga y vectores nulos. Máximo 81 flechas de campo.
12. Interruptores independientes para fuerzas, cuadrícula de campo, punto P y línea/distancia de la primera pareja. Los resultados físicos siguen disponibles al ocultar las fuerzas. Ocultar P retira su vector, marcador y lectura.
13. Reinicio completo de cargas, posiciones, selección, punto P y capas. Valores iniciales: fuerzas activas, cuadrícula oculta, P activo y distancia activa. El botón Vista XY restablece por separado la cámara.
14. Panel oscuro adaptable a escritorio y móvil, con resultados en vivo, leyendas y avisos de proximidad. Etiquetas ancladas a los objetos 3D mediante Drei Html; no requieren descargar fuentes externas.

## Arquitectura y archivos

Tras integrar la navegación móvil, `App.jsx` conserva el estado mediante `useReducer` y selecciona la pantalla. `screens/ElectricFieldLab.jsx` deriva las fuerzas y el campo con `useMemo` y conecta el panel con la escena. El estado físico es independiente de los componentes y las fórmulas no se repiten en la presentación.

| Archivo creado | Responsabilidad |
| --- | --- |
| `src/physics/electrostatics.js` | Constante de Coulomb, conversión μC → C, desplazamiento, distancia, magnitud, fuerza de una fuente, fuerza neta, campo de una fuente y campo total; protecciones numéricas. |
| `src/lab/laboratory.js` | Configuración inicial, reducer, límites XY, generación de cargas en posiciones libres y ajuste simétrico de la primera pareja. |
| `src/lab/visuals.js` | Colores, formato de lecturas y escalas limitadas para fuerza, campo en P y cuadrícula. |
| `src/components/Charge.jsx` | Esfera, etiqueta, selección visual y conexión del arrastre. |
| `src/components/ForceVector.jsx` | Representación del vector de fuerza resultante. |
| `src/components/ElectricFieldVector.jsx` | Representación del campo en P con escala propia. |
| `src/components/VectorArrow.jsx` | Geometría de flecha compartida, orientación vectorial y ocultación de vectores nulos. |
| `src/components/DistanceLine.jsx` | Línea discontinua y distancia de la primera pareja. |
| `src/components/TestPoint.jsx` | Marcador verde independiente y arrastre de P. |
| `src/components/FieldGrid.jsx` | Muestreo y representación de la cuadrícula de campo total. |
| `src/components/ControlPanel.jsx` | Cargas, edición, simulación, interruptores, resultados y reinicio. |
| `src/components/LaboratoryScene.jsx` | Iluminación, plano de referencia, objetos de laboratorio y OrbitControls. |
| `src/components/usePlanarDrag.js` | Captura del puntero, intersección con XY, cancelación y coordinación con la cámara. |
| `tests/electrostatics.test.js` | 13 pruebas de física, protección numérica y escalas. |
| `tests/laboratory.test.js` | 6 pruebas de estado y operaciones del laboratorio. |
| `docs/electro-lab-core.md` | Esta guía. |

Archivos modificados: `src/App.jsx`, `src/App.css`, `src/index.css`, `package.json` (script de pruebas), `index.html` (idioma y título) y `README.md`. `src/main.jsx`, las dependencias y el archivo de bloqueo se conservaron.

## Modelo físico y límites

Se utiliza **k = 8,99 × 10⁹ N·m²/C²**. Para un objetivo y una fuente, el desplazamiento es `r = posiciónObjetivo − posiciónFuente`. La fuerza es `k · qObjetivo · qFuente · r / |r|³` y el campo es `k · qFuente · r / |r|³`. El signo determina atracción, repulsión y orientación del campo. La fuerza neta excluye la carga objetivo por su ID; el campo suma todas las fuentes.

Por debajo de **0,75 m**, se conserva la dirección y se limita la magnitud mediante `max(distancia, 0.75)²`. En coincidencia exacta se devuelve el vector cero para esa contribución, sin inventar una dirección. Esto es una protección didáctica y no el valor singular de la ley ideal de cargas puntuales. El panel avisa cuando ocurre entre cargas o entre P y una fuente.

Las posiciones editables están entre **−10 y +10 m** en XY, con Z = 0. Los valores están entre **−10 000 y +10 000 μC**. Las entradas no finitas se rechazan o normalizan antes de llegar a la escena. Las funciones físicas también limitan entradas extremas defensivamente. Las flechas usan escalas logarítmicas acotadas y ocultan magnitudes menores o iguales a 10⁻¹²; estas decisiones visuales no cambian las lecturas físicas.

La física y la cuadrícula se recalculan cuando cambian sus datos; no se calculan en cada frame. La escena usa renderizado bajo demanda y densidad de píxeles limitada. El arrastre reutiliza raycaster y vectores durante cada gesto. El coste de las fuerzas es O(n²); la cuadrícula cuesta O(81n). El alta busca espacio libre dentro de un tablero finito y se desactiva cuando no encuentra una posición segura. No se ha evaluado el rendimiento con centenares de cargas ni se ha fijado un límite arbitrario de cantidad.

## Validación realizada

Entorno: Node.js 24.19.0, npm 11.9.0, Chromium con WebGL mediante SwiftShader. Validación: 19 de octubre de 2026, zona America/Bogota.

- `npm run build`: correcto. Vite conserva un aviso sobre el tamaño del paquete principal, aproximadamente 1,13 MB sin comprimir y 313 kB gzip, asociado a la escena 3D. El aviso ya existía en la base, que producía aproximadamente 1,21 MB sin comprimir.
- `npm run lint`: correcto, sin errores.
- `npm test`: 19 pruebas aprobadas, sin fallos ni omisiones. Runner nativo de Node; no se agregó una biblioteca de pruebas.
- `git diff --check`: correcto.
- Chromium: 21 comprobaciones automatizadas de interacción aprobadas; sin errores JavaScript ni errores de consola. Se revisaron capturas de escritorio y móvil. Estas comprobaciones se ejecutaron con Playwright disponible en el entorno; no se agregó como dependencia del proyecto. La suite persistente del repositorio es la de física y estado.

Las 13 pruebas de física cubren conversión y distancia 3D, repulsión, atracción, inverso del cuadrado, cargas cero, superposición y cancelación, acción y reacción en 3D, campo positivo y negativo, campo de múltiples fuentes, relación F = qE, coincidencias, entradas extremas y escalas visuales. Las seis de estado cubren adición segura, IDs únicos, eliminación hasta cero, slider diagonal, bordes/coincidencia, validación de entradas y reinicio.

Las comprobaciones de navegador cubren configuración inicial, altas y bajas, edición de signo y XY, selección por arrastre y por clic, slider diagonal, movimiento de P, cuatro interruptores, reinicio, carga cero, avisos de coincidencia, estados de cero/una carga, órbita y recuperación de cámara, cancelación, teclado con negativos y decimales, campos vacíos, límites, liberación fuera del lienzo y vista móvil de 390 × 844 sin desbordamiento horizontal.

## Cómo probar manualmente

Ejecuta `npm ci` y `npm run dev`, y abre la dirección de Vite. En escritorio, el panel tiene desplazamiento vertical independiente; en móvil aparece debajo de la escena.

| Función | Pasos | Resultado esperado |
| --- | --- | --- |
| Base conservada | Abre el laboratorio o pulsa Reiniciar laboratorio. | Q1 azul +5 μC en (−2,0), Q2 roja −5 μC en (2,0), etiquetas, distancia 4 m, P en (0,2). Q1 tiene Fx ≈ +0,014047 N, Fy = 0. |
| Atracción y repulsión | Selecciona Q2 y cambia −5 a +5. | Ambas cargas azules; fuerzas alejándose. Q1 tiene Fx negativo. Devuelve Q2 a −5: fuerzas hacia la otra carga. |
| Carga cero | Cambia Q1 a 0 con solo Q1 y Q2 presentes. | Q1 gris; fuerza nula sobre ambas, sin flechas de fuerza. P sigue midiendo el campo de Q2. |
| Selección | Haz clic en una esfera y luego en un botón de la lista. | El anillo, la etiqueta destacada, el editor y los resultados siguen a la selección. Clic sobre el fondo permite deseleccionar. |
| Añadir | Pulsa + Añadir carga varias veces. | Nuevos IDs y posiciones libres; la nueva carga queda seleccionada. Se recalculan todas las fuerzas. |
| Eliminar | Borra la selección varias veces, hasta quedar con una y después ninguna. | No hay errores. Slider desactivado con menos de dos cargas; campo cero sin fuentes. Puedes añadir de nuevo. |
| Editar XY | Cambia X e Y de una carga a valores distintos de cero. | Cambian la posición, distancia, dirección de la fuerza y campo. Z permanece en cero. |
| Arrastre | Arrastra una carga en diagonal y suéltala; repite soltando fuera del lienzo. | Carga sigue al puntero sobre XY; datos y flechas se actualizan; cámara disponible al terminar. |
| Cámara | Arrastra el fondo, desplaza con botón derecho y usa la rueda. Pulsa Vista XY. | OrbitControls funciona; Vista XY restaura la cámara frontal. |
| Slider | Con dos cargas en diagonal, mueve el slider de 1,5 a 8 m. | Se mantiene el eje de la pareja y su centro, salvo corrección en los bordes. Con más cargas solo se mueve la primera pareja. |
| Inverso del cuadrado | Reinicia y compara |F| con separaciones de 4 m y 8 m. | Al duplicar la distancia, la fuerza pasa a un cuarto: ≈ 0,014047 N a ≈ 0,0035117 N. |
| Superposición de fuerzas | Reinicia, añade Q3 y colócala en (0,3). Selecciona Q1. | La resultante deja de ser horizontal; Fy es no nulo. Al ocultar/mostrar fuerzas, la lectura no cambia. |
| Punto de prueba | Reinicia y arrastra el octaedro P o edita sus campos X/Y. | Cambian Ex, Ey, |E| y su flecha; la cantidad de cargas y las fuerzas sobre ellas no cambian. |
| Campo y signo | Reinicia, elimina Q2 y sitúa P a la derecha de Q1. Cambia el signo de Q1. | Campo sale de la positiva y entra en la negativa. |
| Cancelación del campo | Reinicia, cambia Q2 a +5 y mueve P a (0,0). | Campo total cero y flecha oculta por simetría. Vuelve Q2 a −5: Ex = +22 475 N/C y Ey = 0. |
| Cuadrícula | Activa Mostrar campo y mueve/cambia cargas. | Hasta 81 flechas pequeñas representan la suma de todas las fuentes. Se evitan muestras demasiado cercanas a cargas. |
| Capas | Cambia cada interruptor de visualización. | Se oculta o muestra su capa. Ocultar P también oculta su lectura; no cambia las fuentes. |
| Coincidencia | Sitúa dos cargas en el mismo XY; luego coloca P allí. | Avisos de proximidad y valores finitos; cada contribución coincidente se representa como cero. No aparecen NaN ni Infinity. |
| Límites y teclado | Borra un input, escribe −2.5; prueba X = 1000 y valor = 1000000. | Negativos/decimales válidos. Campo vacío restaura último valor al perder foco; posiciones y valores quedan limitados a ±10 y ±10000. |
| Reinicio completo | Añade, mueve, elimina, cambia selección, P y capas; pulsa Reiniciar laboratorio. | Se restauran Q1/Q2, valores, posiciones, selección Q1, P y opciones iniciales. |
| Móvil | Abre con ancho aproximado de 390 px. | Escena arriba, panel desplazable por la página, controles utilizables y sin desplazamiento horizontal. |

## Pendientes y alcance futuro

No se detectaron errores bloqueantes en las pruebas realizadas. Permanece el aviso de tamaño del paquete de Vite. Se requiere WebGL; hay un mensaje de recuperación si falla la escena y los cálculos del panel permanecen disponibles. Las pruebas de navegador se ejecutaron en Chromium de escritorio y con viewport móvil; no se validaron dispositivos táctiles físicos, Safari ni Firefox.

Las cargas se mueven manualmente, no por integración dinámica. La escena permite órbita 3D, pero la edición se limita al plano XY. Las distancias visibles corresponden a la primera pareja, y el campo muestreado cubre una región fija. El reinicio restaura el laboratorio; la cámara se restaura con Vista XY. No hay persistencia de sesiones.

Quedaron fuera del alcance minijuegos, niveles, puntuaciones, líneas de campo avanzadas, potencial y equipotenciales, Gauss, Ohm, circuitos y magnetismo.
