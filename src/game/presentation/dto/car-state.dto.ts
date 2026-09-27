import { IsNumber, Max, Min } from 'class-validator';

export class CarStateDto {
    @IsNumber()
    @Min(0)
    @Max(1_000_000)
    x: number;

    @IsNumber()
    @Min(0)
    @Max(1_000_000)
    y: number;

    @IsNumber()
    rotation: number;

    @IsNumber()
    speed: number;

    @IsNumber()
    @Min(0)
    @Max(100)
    turbo: number;
}
