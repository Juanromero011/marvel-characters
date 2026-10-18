import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsInt, Min } from "class-validator";

export class AssignCharactersDto {
    @ApiProperty({ type: [Number], example: [16, 17], description: 'Ids de personajes a asignar al equipo' })
    @IsArray()
    @ArrayNotEmpty()
    @IsInt({ each: true })
    @Min(1, { each: true })
    characterIds: number[];
}
