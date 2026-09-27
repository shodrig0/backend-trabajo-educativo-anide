import { IsString, Length, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CarStateDto } from './car-state.dto.js';

export class UpdateCarDto {
    @IsString()
    @Length(1, 32)
    roomId: string;

    @ValidateNested()
    @Type(() => CarStateDto)
    car: CarStateDto;
}
