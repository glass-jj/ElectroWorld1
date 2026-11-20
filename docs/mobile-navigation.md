# Navegación móvil de ElectroWorld

- **Inicio → Iniciar** abre el menú principal.
- **Simuladores → Campo Eléctrico** abre Lab Coulomb.
- **Simuladores → Ley de Ohm** abre el circuito con sus controles.
- **Minijuego → Choque de Cargas** abre la partida.
- **Volver** regresa a la pantalla anterior del recorrido.

`App.jsx` guarda la pantalla activa y el estado de Lab Coulomb. Al volver al laboratorio se recuperan las cargas, la selección, el punto P y las capas. La escena 3D se carga al abrir el laboratorio y se desmonta al salir.

La validación web se hace con `npm run build`, `npm run lint` y `npm test`. Para probar con el navegador, recorre las siete pantallas y usa los controles de ambos simuladores y del minijuego.
