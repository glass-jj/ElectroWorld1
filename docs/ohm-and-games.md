# Ley de Ohm y Choque de Cargas

## Ley de Ohm

`LabOhm.jsx` guarda el voltaje y la resistencia. `ControlesOhm.jsx` muestra los deslizadores y `ohmsLaw.js` calcula I = V/R y P = V × I. `Circuito.jsx` representa el flujo y el brillo del bombillo.

Para comprobarlo, ajusta a 12 V y 6 Ω. Deben aparecer 2 A y 24 W. Con 0 V, la corriente y la potencia bajan a cero. **Reiniciar** restaura 12 V y 6 Ω.

## Choque de Cargas

`ChoqueCargas.jsx` presenta la partida. `components/choqueCargas/logica.js` comprueba el signo y el momento de captura, y calcula los puntos.

Pulsa **Empezar**, elige el signo opuesto y pulsa **Capturar** cuando la carga llegue a la zona. La partida dura hasta 45 segundos y empieza con tres vidas. El resultado permite volver al menú o jugar de nuevo.
