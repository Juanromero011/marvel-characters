import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { CharacterStatus } from '../entities/character.entity.js';

export class UpdateStatusDto {
    @ApiProperty({ enum: CharacterStatus }) @IsEnum(CharacterStatus)
    status: CharacterStatus;
}