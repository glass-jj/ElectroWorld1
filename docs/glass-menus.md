# Menús oscuros y mini escenas

Esta actualización afecta únicamente a Bienvenida, Menú principal, Simuladores y Minijuegos. Sigue la especificación escrita del usuario: fondos `#05080D`, `#070D14` y `#09111B`, cyan `#63E6D2`, violeta `#8D7CFF`, ámbar `#FFB85C` y coral `#FF6F86`.

## Referencia y límite de fidelidad

La referencia solicitada es [el archivo de Figma](https://www.figma.com/design/a77knbrQbfwOoir3zjj7B1/Sin-t%C3%ADtulo?node-id=0-1). El conector aparece instalado, pero esta sesión no expone herramientas de lectura de Figma y el visor web no pudo abrir el enlace. Por tanto, esta versión implementa el brief escrito; **no se ha comparado con los frames de Figma y no se afirma una reproducción exacta**. Queda pendiente contrastar composición, tipografía y medidas con capturas o exportaciones de las cuatro pantallas.

## Implementación

- `src/styles/MenuTheme.css`: tema limitado a `.menu-theme`, aplicado solo a las cuatro pantallas de entrada. Vidrio ahumado con respaldo opaco, radios de 22 px, bordes suaves, reflejos discretos, botones y respuesta táctil de 150 ms.
- `src/components/MenuPreview.jsx`: cinco mini escenas SVG decorativas. Cargas y líneas de campo para Campo eléctrico; batería, resistencia, bombilla y corriente para Ohm; atracción para Carga Clash; circuito cálido para Power Up; trayectoria y objetivo para Coulomb Shot.
- `MenuCard` admite una preview opcional. Las miniaturas de los laboratorios se usan exclusivamente en el menú de simuladores. No se insertan dentro del laboratorio real.
- La portada conserva el comportamiento de Spline y su respaldo local. Solo se adapta la ilustración SVG a la nueva paleta; no se configura ni inventa una escena de Spline.

Las mini escenas no crean canvas, no cargan motores 3D y no usan bucles JavaScript. Sus animaciones pequeñas de posición y trazos se detienen con `prefers-reduced-motion`. `prefers-reduced-transparency` sustituye el material por paneles opacos; navegadores sin `backdrop-filter` también tienen un respaldo sólido.

## Pantallas preservadas

No se modifican `ElectricFieldLab`, `OhmsLawLab`, `ControlPanel`, `LaboratoryScene`, `Circuit`, `OhmControls`, sus estilos ni los componentes y hooks de las partidas. `ScreenLayout`, `App.css`, `index.css` y `Games.css` permanecen intactos para conservar también los tamaños y posiciones compartidos.

La navegación y sus estados no cambian. `App.jsx` únicamente importa la hoja del tema. La física de Coulomb, superposición, campo eléctrico, Ohm y minijuegos permanece intacta. No se añaden dependencias ni se modifican archivos nativos de Android o Capacitor.

## Capturas

- [Bienvenida](previews/glass-welcome.png).
- [Menú principal](previews/glass-main.png).
- [Simuladores](previews/glass-simulators.png).
- [Minijuegos](previews/glass-games.png).

## Validación

- `npm run build`: correcto. Persiste el aviso de chunks grandes de los motores 3D existentes; no se añadieron motores ni dependencias.
- `npm run lint`: correcto.
- `npm test`: 40 pruebas aprobadas, sin fallos.
- Chromium con emulación táctil: navegación de bienvenida a cada laboratorio y a cada partida, con sus regresos. Gauss y Magnetismo siguen desactivados.
- Los cuatro menús se revisaron a 390 × 844, 360 × 800, 430 × 932, 320 × 800 y 844 × 390. Sin desbordamiento horizontal; botones de al menos 44 px. En la bienvenida de 390 × 844, COMENZAR permanece visible sin desplazamiento.
- Comparación con una copia del commit anterior `c3bd7f2`: mismas posiciones, dimensiones y estilos calculados en controles y contenedores de Campo eléctrico, Ohm, Carga Clash, Power Up y Coulomb Shot. El signo inicial aleatorio de Carga Clash se excluyó de la comparación de textos.
- Los menús no crean canvas ni solicitan ilustraciones externas. Spline sin escena configurada sigue sin descargar su runtime.
- Movimiento normal, `prefers-reduced-motion` y `prefers-reduced-transparency` comprobados en Chromium. Sin errores JavaScript ni errores de consola en los recorridos revisados.

No se compiló un APK ni se probó un dispositivo Android físico. La comparación directa contra Figma sigue pendiente por el límite de acceso explicado arriba.
