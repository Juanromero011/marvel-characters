import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";

// PUT reemplaza el equipo completo: los campos opcionales que no se envíen quedan en null
export class UpdateTeamDto {
    @ApiProperty({ example: 'Avengers', maxLength: 100 })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name: string;

    @ApiPropertyOptional({ example: 'Avengers Tower, New York', maxLength: 150, nullable: true })
    @IsOptional()
    @IsString()
    @MaxLength(150)
    base?: string | null;

    @ApiPropertyOptional({ example: 1963, minimum: 1900, maximum: 2100, nullable: true })
    @IsOptional()
    @IsInt()
    @Min(1900)
    @Max(2100)
    founded_year?: number | null;

    @ApiProperty({ example: true })
    @IsBoolean()
    active: boolean;
}
