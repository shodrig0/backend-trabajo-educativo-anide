<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://www.anide.gob.ar/wp-2023/wp-content/uploads/2024/12/logo-512.png" width="500" alt="Nest Logo" /></a>
</p>

# Taller Educativo de ANIDE

Backend en **NestJS** para un juego de carreras multiplayer, desarrollado como parte de un taller de programación educativa para chicos de 9 a 12 años, impulsado por la **Agencia Neuquina de Innovación para el Desarrollo**.

## Contexto del proyecto

Este repositorio tiene un doble propósito:

1. **Para el taller**: es la infraestructura que le da soporte multiplayer al juego que arman los estudiantes. Ellos no interactúan con este código ni saben que existe. Para ellos, la sincronización entre jugadores va a aparecer como "magia" en un momento puntual del taller, sin que necesiten entender websockets, estado compartido ni nada de lo que hay acá.
2. **Para portfolio**: al ser un proyecto propio y desacoplado del contenido pedagógico, sirve como pieza de portfolio que demuestra manejo de comunicación en tiempo real, sincronización de estado entre clientes y arquitectura de un backend de juego.

## El proyecto completo (frontend + backend)

El juego en sí es una carrera simple hecha en **Phaser 3**, pensada para que estudiantes de 9 a 12 años la programen de forma guiada. La mecánica del lado del frontend se construye en bloques progresivos:

- **Bloque 1 — Movimiento**: el auto se mueve libremente en las 4 direcciones dentro del canvas. Los estudiantes completan la lógica de movimiento (qué eje y en qué sentido corresponde a cada tecla).
- **Bloque 2 — Pista con items**: el auto queda encerrado en una pista más angosta que la pantalla, con colisión en los bordes. Aparecen items random dentro de la pista:
  - un charco de aceite que hace perder el control de arriba/abajo por un tiempo,
  - un bidón que recarga una barra de turbo,
  - un obstáculo que frena el auto al chocarlo.
  
  También se suma un sistema de turbo: la barra se carga sola mientras el auto se mueve, y con una tecla dedicada se consume toda de golpe para un pulso corto de mayor velocidad.
- **Próximos bloques**: se evalúa sumar scroll/cámara para que la pista se sienta como una carrera con recorrido real, y el modo multiplayer — que es donde entra este backend.

El código del frontend se entrega a los estudiantes como un esqueleto con huecos guiados (`// TODO: completar acá` + pistas en comentarios), de forma que cada bloque los deja ver un resultado visible e inmediato de lo que programaron.

## Rol de este backend

El objetivo es exponer la comunicación en tiempo real necesaria para que dos o más instancias del juego (cada una corriendo el frontend en Phaser) puedan:

- sincronizar la posición y el estado de cada auto entre los jugadores conectados,
- propagar eventos del juego (items, choques, turbo) a todos los clientes de una misma partida,
- manejar el ciclo de vida de una partida (creación de sala, unión de jugadores, desconexión).

## Stack tecnológico

- **NestJS** (Node.js + TypeScript)
- **Socket.IO** mediante gateways de NestJS
- También herramientas como **JWT**, **nanoid**, **Prisma 7**, entre otras.
- Frontend consumidor: HTML + CSS + JavaScript + Phaser 3 (repositorio aparte)

## Estructura del backend

El código está organizado por funcionalidad. La carrera es el primer módulo de
negocio y concentra el transporte WebSocket, los casos de uso y el estado de
las salas.

```text
src/
  common/
  game/
    application/
      race.service.ts             # Casos de uso de salas y jugadores
    domain/
      race.types.ts
    infrastructure/
      in-memory-race-room.repository.ts
    presentation/
      dto/
      race.gateway.ts              # Adaptador Socket.IO
    race.module.ts
  app.module.ts
  main.ts
```

El `RaceGateway` solo traduce eventos de Socket.IO y delega la lógica al
`RaceService`.

## Contrato WebSocket inicial

El namespace del juego es `/race`.

| Dirección | Evento | Payload | Respuesta |
| --- | --- | --- | --- |
| Phaser -> backend | `room:join` | `{ roomId, playerName }` | `room:joined` |
| Phaser -> backend | `race:car-update` | `{ roomId, car }` | `race:car-updated` |
| Backend -> Phaser | `room:state` | estado público de la sala | - |
| Backend -> Phaser | `player:left` | estado público de la sala | - |

Ejemplo de conexión desde Phaser:

```js
const socket = io('http://localhost:3000/race');

socket.emit('room:join', {
  roomId: 'sala-1',
  playerName: 'Jugador 1',
});

socket.on('room:state', (room) => { });
```

La implementación actual usa memoria local y limita cada sala a ocho
jugadores.

## Estado actual

En desarrollo. El frontend ya tiene resueltos los bloques de movimiento y de pista con items en modo singleplayer local; este backend todavía no está implementado.

## Cómo correr el proyecto

```bash
pnpm install
pnpm run start:dev
```

## Autor
- [Rodrigo Villablanca / shodrig0](https://github.com/shodrig0)