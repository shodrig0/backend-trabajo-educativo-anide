import { IsString, Length } from 'class-validator';

export class JoinRoomDto {
    @IsString()
    @Length(1, 32)
    roomId: string;

    @IsString()
    @Length(1, 32)
    playerName: string;
}
