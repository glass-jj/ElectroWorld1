# ElectroWorld

Laboratorio universitario de electrostática: cargas 3D editables, movimiento sobre XY, fuerzas y campo eléctrico por superposición.

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

No se agregaron dependencias. Se conserva React, JavaScript, Vite, Three.js, React Three Fiber y Drei.

## Uso

- Selecciona una carga en la escena o en la lista y edita su valor en μC y posición en metros.
- Arrastra las cargas o el punto P sobre XY. El fondo controla la cámara; la rueda hace zoom y el botón derecho desplaza la vista.
- Añade y elimina cargas. El slider mantiene una separación de 1,5–8 m entre las dos primeras cargas de la lista, conservando su dirección y punto medio salvo ajuste necesario en los límites del tablero.
- Activa las fuerzas resultantes, la cuadrícula de campo 9 × 9, el punto de prueba y la distancia de la primera pareja.
- Usa **Vista XY** para recuperar la cámara frontal y **Reiniciar laboratorio** para recuperar los datos y capas iniciales.

La fuerza es ámbar; el campo en P es verde. Las cargas positivas son azules, las negativas rojas y las neutras grises. Las lecturas numéricas muestran magnitudes físicas; las flechas utilizan escalas visuales limitadas.

La física es estática: no integra velocidades ni acelera automáticamente las cargas. El punto P no es una fuente. Para evitar singularidades, los cálculos se limitan por debajo de 0,75 m y se avisa en el panel. Una contribución exactamente coincidente se representa como cero porque su dirección es indefinida.

Consulta [la guía completa de implementación y pruebas](docs/electro-lab-core.md) para la arquitectura, archivos, casos manuales, resultados de validación y límites.
