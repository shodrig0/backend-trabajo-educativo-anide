import { Injectable } from '@nestjs/common';
import { PlayerId, RaceRoom, RoomId } from '../domain/race.types.js';

@Injectable()
export class InMemoryRaceRoomRepository {
    private readonly rooms = new Map<RoomId, RaceRoom>();
    private readonly playerRooms = new Map<PlayerId, RoomId>();

    findById(roomId: RoomId): RaceRoom | undefined {
        return this.rooms.get(roomId);
    }

    findRoomIdByPlayer(playerId: PlayerId): RoomId | undefined {
        return this.playerRooms.get(playerId);
    }

    save(room: RaceRoom): void {
        this.rooms.set(room.id, room);

        for (const playerId of room.players.keys()) {
            this.playerRooms.set(playerId, room.id);
        }
    }

    delete(roomId: RoomId): void {
        const room = this.rooms.get(roomId);

        if (!room) {
            return;
        }

        for (const playerId of room.players.keys()) {
            this.playerRooms.delete(playerId);
        }

        this.rooms.delete(roomId);
    }
}
