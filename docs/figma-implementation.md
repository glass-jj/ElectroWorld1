# Implementación de las cuatro pantallas de Figma

La revisión anterior (`d794034`) cambió la paleta y añadió miniaturas, pero conservó la composición anterior. Esta actualización sí consulta los cuatro frames originales de [Figma](https://www.figma.com/design/a77knbrQbfwOoir3zjj7B1/Sin-t%C3%ADtulo?node-id=0-1) mediante contexto de diseño y capturas:

| Pantalla | Frame | Implementación |
| --- | --- | --- |
| Bienvenida | `5:7990` | Diagrama científico arriba, promesa abajo y botón «Comenzar a explorar». |
| Menú principal | `5:8027` | Cabecera, tarjeta principal de simuladores, acceso compacto a juegos, experimento sugerido y navegación inferior. |
| Simuladores | `5:8100` | Dos tarjetas con categoría, mini escena original, título y descripción. |
| Minijuegos | `5:8375` | Tres tarjetas compactas con mini escena a la derecha y navegación inferior. |

## Recursos y arquitectura

- `MenuShell.jsx` reúne la cabecera, el contenido desplazable, la navegación inferior y el diálogo de información. Solo se utiliza en los menús; `ScreenLayout` y los laboratorios permanecen intactos.
- `MenuCard.jsx` se adapta para las dos composiciones del Figma: tarjeta principal y tarjeta de laboratorio.
- `FigmaAsset.jsx`, `src/assets/figmaManifest.json` y `public/figma/` vinculan 26 recursos SVG locales a sus nodos originales. Se exportaron desde el conector de Figma sin editar el diseño. Las ilustraciones completas conservan sus capas, posiciones, efectos y proporciones. No se usan capturas de pantallas como interfaz ni URLs temporales en tiempo de ejecución.
- `public/fonts/` incluye Inter Variable (Fontsource 5.3.0) y su licencia. La familia `EWInter` se limita a los menús para no alterar las métricas de los laboratorios y las partidas.
- `MenuTheme.css` limita todas las reglas a las pantallas de entrada. Se mantienen el vidrio oscuro, los bordes discretos, el contraste, las áreas táctiles y el respaldo opaco.
- `SplineHero` admite un poster opcional: en esta portada muestra el instrumento original de Figma. La configuración opcional de una escena de Spline y su comportamiento de respaldo se conservan.
- `App.jsx` conecta los accesos nuevos con las rutas por estado ya existentes. No se instala React Router ni ninguna dependencia adicional.

Las miniaturas originales son SVG estáticos; no abren canvas, no cargan motores 3D y no ejecutan bucles de animación. Se retiró `MenuPreview.jsx`, que contenía los dibujos aproximados de la versión anterior.

## Adaptaciones intencionales

- Las barras de estado, la hora ficticia 9:41 y el indicador de gestos de Android pertenecen al sistema operativo. No se dibujan dentro del frontend. Para comparar las capturas, se toma el contenido del frame sin esos 32 px superiores y 28 px inferiores.
- Los botones y las pestañas de navegación son funcionales. El icono de usuario/ayuda abre información real de la app; no se añade autenticación.
- «Retoma tu experimento» pasa a «Experimento sugerido». Se muestra la configuración inicial real de Ohm: 12 V, 6 Ω y 2 A, y el acceso abre ese laboratorio. No se simula un historial que el proyecto no guarda.
- Los textos de progresión y juegos se adaptan a las capacidades existentes. No se anuncian 8/6/10 niveles ni partidas de 2/3 minutos. Se describen las mecánicas reales y se conservan los récords de sesión. Las barras pequeñas del menú son decoración, no una medición de progreso.
- El menú de simuladores presenta los dos laboratorios disponibles. Gauss y Magnetismo no se implementan.
- En móviles pequeños el contenido del menú se desplaza dentro de su región; la barra inferior ocupa su propio espacio y no tapa controles ni texto.

## Preservación

No se modificaron Campo Eléctrico, Ley de Ohm, los controles de los laboratorios, el circuito real, las partidas, sus hooks, las fórmulas, los estados ni sus estilos compartidos. No se modificaron `android/`, Gradle, archivos nativos ni configuración de Capacitor. `main` permanece intacta.

## Capturas

[Bienvenida](previews/figma-welcome.png) · [Menú principal](previews/figma-main.png) · [Simuladores](previews/figma-simulators.png) · [Minijuegos](previews/figma-games.png).

## Verificación

- Build, lint y las 40 pruebas existentes aprobados.
- Comparación en Chromium a 412 × 872 con los frames sin las barras nativas; minijuegos a 412 × 901. Revisión adicional a 390 × 844, 360 × 800, 430 × 932, 320 × 800 y horizontal.
- Los 26 recursos tienen archivo local no vacío, nodo de origen, uso en la interfaz y proporciones comprobadas. Fuente local y gráficos cargan correctamente.
- Navegación inferior, regresos, experimento sugerido y diálogo de ayuda comprobados. Sin desbordamiento horizontal; botones de al menos 44 px.
- Comparación automatizada con la versión previa: mismas posiciones, dimensiones, controles y estilos calculados en ambos laboratorios y en las tres partidas. Se excluye el signo aleatorio inicial de Carga Clash de la comparación textual.
- Persistencia de cargas al navegar y lectura de Ohm tras cambiar voltaje comprobadas. Variante de transparencia reducida comprobada. Sin errores JavaScript en los recorridos revisados.
- Partidas completas de los tres juegos comprobadas: captura por signo y tiempo, rachas, vidas, cinco misiones de mantener/soltar, cancelación táctil, puntería, intentos, rondas, reinicio y récords. Coulomb Shot mantiene el objetivo estático con movimiento reducido.

La validación se realiza en Chromium con emulación móvil. No se compiló un APK ni se probó un Android físico.
