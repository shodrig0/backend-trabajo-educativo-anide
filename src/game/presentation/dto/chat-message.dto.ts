import { IsString, Length } from 'class-validator';

export class ChatMessageDto {
    @IsString()
    @Length(1, 32)
    roomId: string;

    @IsString()
    @Length(1, 500)
    text: string;
}