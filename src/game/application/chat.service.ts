import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { RaceService } from './race.service.js';

export interface ChatMessage {
    userId: string;
    username: string;
    text: string;
    timestamp: Date;
}

@Injectable()
export class ChatService {
    constructor(private readonly raceService: RaceService) { }

    createMessage(roomId: string, userId: string, text: string): ChatMessage {
        const room = this.raceService.getRoom(roomId);
        const player = room.players.find((candidate) => candidate.id === userId);

        if (!player) {
            throw new WsException('El jugador no pertenece a la sala');
        }

        return {
            userId: player.id,
            username: player.name,
            text,
            timestamp: new Date(),
        };
    }
}
