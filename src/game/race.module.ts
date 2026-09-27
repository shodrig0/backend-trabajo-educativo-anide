import { Module } from '@nestjs/common';
import { ChatService } from './application/chat.service.js';
import { RaceService } from './application/race.service.js';
import { InMemoryRaceRoomRepository } from './infrastructure/race-room.repository.js';
import { RaceGateway } from './presentation/race.gateway.js';

@Module({
    providers: [RaceGateway, ChatService, RaceService, InMemoryRaceRoomRepository],
})
export class RaceModule { }
