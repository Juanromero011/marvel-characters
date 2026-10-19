import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';
import { CharacterStatus } from '../entities/character.entity.js';

export class CreateCharacterDto {
    @ApiProperty() @IsString() @IsNotEmpty()
    real_name: string;

    @ApiProperty() @IsString() @IsNotEmpty()
    alias: string;

    @ApiProperty() @IsString() @IsNotEmpty()
    main_power: string;

    @ApiProperty({ minimum: 1, maximum: 100 }) @IsInt() @Min(1) @Max(100)
    power_level: number;

    @ApiPropertyOptional({ enum: CharacterStatus }) @IsOptional() @IsEnum(CharacterStatus)
    status?: CharacterStatus;

    @ApiPropertyOptional() @IsOptional() @IsBoolean()
    is_villain?: boolean;

    @ApiPropertyOptional({ nullable: true }) @IsOptional() @IsInt()
    team_id?: number | null;
}