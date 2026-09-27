import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import {
    CarState,
    PlayerId,
    PublicRaceRoom,
    RacePlayer,
    RaceRoom,
    RoomId,
} from '../domain/race.types.js';
import { InMemoryRaceRoomRepository } from '../infrastructure/race-room.repository.js';

@Injectable()
export class RaceService {
    constructor(private readonly rooms: InMemoryRaceRoomRepository) { }

    joinRoom(roomId: RoomId, playerId: PlayerId, playerName: string): PublicRaceRoom {
        let room = this.rooms.findById(roomId);

        if (!room) {
            room = { id: roomId, players: new Map(), started: false };
        }

        if (!room.players.has(playerId) && room.players.size >= 8) {
            throw new WsException('La sala está llena');
        }

        const player: RacePlayer = room.players.get(playerId) ?? {
            id: playerId,
            name: playerName,
            connected: true,
            car: this.initialCarState(),
        };

        player.connected = true;
        room.players.set(playerId, player);
        this.rooms.save(room);

        return this.toPublicRoom(room);
    }

    updateCar(
        roomId: RoomId,
        playerId: PlayerId,
        car: CarState,
    ): PublicRaceRoom {
        const room = this.requireRoom(roomId);
        const player = room.players.get(playerId);

        if (!player) {
            throw new WsException('El jugador no pertenece a la sala');
        }

        player.car = car;
        this.rooms.save(room);

        return this.toPublicRoom(room);
    }

    leaveRoom(playerId: PlayerId): PublicRaceRoom | undefined {
        const roomId = this.rooms.findRoomIdByPlayer(playerId);

        if (!roomId) {
            return undefined;
        }

        const room = this.requireRoom(roomId);
        room.players.delete(playerId);

        if (room.players.size === 0) {
            this.rooms.delete(room.id);
            return undefined;
        }

        this.rooms.save(room);
        return this.toPublicRoom(room);
    }

    getRoom(roomId: RoomId): PublicRaceRoom {
        return this.toPublicRoom(this.requireRoom(roomId));
    }

    private requireRoom(roomId: RoomId): RaceRoom {
        const room = this.rooms.findById(roomId);

        if (!room) {
            throw new WsException('La sala no existe');
        }

        return room;
    }

    private toPublicRoom(room: RaceRoom): PublicRaceRoom {
        return {
            id: room.id,
            players: [...room.players.values()],
            started: room.started,
        };
    }

    private initialCarState(): CarState {
        return { x: 100, y: 100, rotation: 0, speed: 0, turbo: 0 };
    }
}
