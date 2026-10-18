import { ApiPropertyOptional, OmitType } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsInt, IsOptional, Min } from "class-validator";
import { UpdateTeamDto } from "./update-team.dto.js";

// Igual que el PUT, pero active es opcional (por defecto true) y se pueden asignar personajes
export class CreateTeamDto extends OmitType(UpdateTeamDto, ['active'] as const) {
    @ApiPropertyOptional({ example: true, default: true })
    @IsOptional()
    @IsBoolean()
    active?: boolean;

    @ApiPropertyOptional({ type: [Number], example: [16, 17], description: 'Ids de personajes a asignar al equipo creado' })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @Min(1, { each: true })
    characterIds?: number[];
}
