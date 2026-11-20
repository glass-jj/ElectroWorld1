# ElectroWorld

Aplicación móvil de laboratorio de Física II, con navegación entre pantallas y un laboratorio completo de campo eléctrico. Incluye un simulador visual de Ley de Ohm y un minijuego: Choque de Cargas.

## Ejecutar

Node.js 24 LTS recomendado (validado con 24.19.0) y npm. Las pruebas usan el runner nativo de Node con `--test-isolation=none`, disponible desde Node 22.8; utiliza una versión compatible con Vite 8.

```sh
npm ci
npm run dev
```

```sh
npm run build
npm run lint
npm test
```

Se conserva React, JavaScript, Vite, Three.js, React Three Fiber y Drei.

## Navegación móvil

Al abrir la aplicación aparece la bienvenida. Pulsa **INICIAR → SIMULADORES → CAMPO ELÉCTRICO** para acceder al laboratorio existente. Desde SIMULADORES también puedes abrir **LEY DE OHM**, con circuito animado, voltaje, resistencia, corriente y potencia. **MINIJUEGO** abre Choque de Cargas.

Cada pantalla tiene un botón de regreso. Las cargas, la selección, el punto de prueba y las capas del laboratorio se conservan al salir y volver durante la sesión. La navegación utiliza estado de React; no requiere React Router. El módulo 3D se carga al abrirlo, liberando su canvas al salir.

Consulta [la estructura de pantallas y la validación móvil](docs/mobile-navigation.md). Esta copia del repositorio no incluye `android/` ni configuración de Capacitor; no se añadió, modificó ni sincronizó un proyecto nativo.

## Uso del campo eléctrico

- Selecciona una carga en la escena o en la lista y edita su valor en μC y posición en metros.
- Arrastra las cargas o el punto P sobre XY. El fondo controla la cámara; la rueda hace zoom y el botón derecho desplaza la vista.
- Añade y elimina cargas. El slider mantiene una separación de 1,5–8 m entre las dos primeras cargas de la lista, conservando su dirección y punto medio salvo ajuste necesario en los límites del tablero.
- Activa las fuerzas resultantes, la cuadrícula de campo 9 × 9, el punto de prueba y la distancia de la primera pareja.
- Usa **Vista XY** para recuperar la cámara frontal y **Reiniciar** para recuperar los datos y capas iniciales.

La fuerza es ámbar; el campo en P es verde. Las cargas positivas son azules, las negativas rojas y las neutras grises. Las lecturas numéricas muestran magnitudes físicas; las flechas utilizan escalas visuales limitadas.

La física es estática: no integra velocidades ni acelera automáticamente las cargas. El punto P no es una fuente. Para evitar singularidades, los cálculos se limitan por debajo de 0,75 m y se avisa en el panel. Una contribución exactamente coincidente se representa como cero porque su dirección es indefinida.

Consulta [la guía completa de implementación y pruebas](docs/electro-lab-core.md) para la arquitectura, archivos, casos manuales, resultados de validación y límites.

## Ohm y minijuego

- **Ley de Ohm:** mueve V entre 0 y 24 V y R entre 1 y 100 Ω. Las lecturas cumplen I = V/R y P = V×I. La corriente controla la animación simbólica del flujo; la potencia controla el brillo. Con 0 V el flujo se detiene.
- **Choque de Cargas:** cambia tu polaridad y captura la carga entrante al llegar a la zona. Tres vidas, hasta 45 segundos y puntos por rachas.

Los intentos fallidos se pueden repetir. El minijuego permite volver al menú y jugar de nuevo. Las animaciones respetan movimiento reducido.

Consulta [la guía de Ohm y Choque de Cargas](docs/ohm-and-games.md).
