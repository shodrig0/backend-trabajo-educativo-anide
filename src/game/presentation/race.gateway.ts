import {
    ConnectedSocket,
    MessageBody,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from '../application/chat.service.js';
import { RaceService } from '../application/race.service.js';
import { ChatMessageDto } from './dto/chat-message.dto.js';
import { JoinRoomDto } from './dto/join-room.dto.js';
import { UpdateCarDto } from './dto/update-car.dto.js';

@WebSocketGateway({
    namespace: '/race',
    cors: { origin: process.env.FRONTEND_ORIGIN ?? '*' },
})
export class RaceGateway implements OnGatewayDisconnect {
    @WebSocketServer()
    private server: Server;

    constructor(
        private readonly raceService: RaceService,
        private readonly chatService: ChatService,
    ) { }

    @SubscribeMessage('room:join')
    async joinRoom(
        @ConnectedSocket() socket: Socket,
        @MessageBody() payload: JoinRoomDto,
    ) {
        const room = this.raceService.joinRoom(
            payload.roomId,
            socket.id,
            payload.playerName,
        );

        await socket.join(payload.roomId);
        this.server.to(payload.roomId).emit('room:state', room);

        return { event: 'room:joined', data: room };
    }

    @SubscribeMessage('race:car-update')
    updateCar(
        @ConnectedSocket() socket: Socket,
        @MessageBody() payload: UpdateCarDto,
    ) {
        const room = this.raceService.updateCar(
            payload.roomId,
            socket.id,
            payload.car,
        );

        this.server.to(payload.roomId).emit('race:car-updated', room);
        return room;
    }

    @SubscribeMessage('chat-message')
    sendChatMessage(
        @ConnectedSocket() socket: Socket,
        @MessageBody() payload: ChatMessageDto,
    ) {
        const message = this.chatService.createMessage(
            payload.roomId,
            socket.id,
            payload.text,
        );

        this.server.to(payload.roomId).emit('chat-message', message);
        return message;
    }

    handleDisconnect(socket: Socket): void {
        const room = this.raceService.leaveRoom(socket.id);

        if (room) {
            this.server.to(room.id).emit('player:left', room);
        }
    }
}
