import { Body, Controller, Delete, Get, Param, ParseEnumPipe, ParseIntPipe, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

import { CharactersService } from './characters.service.js';
import { CharacterEntity, CharacterStatus } from './entities/character.entity.js';
import { CreateCharacterDto } from './dto/create-character.dto.js';
import { UpdateCharacterDto } from './dto/update-character.dto.js';
import { UpdateStatusDto } from './dto/update-status.dto.js';

@ApiTags('characters')
@Controller('characters')
export class CharactersController {

    constructor(private readonly charactersService: CharactersService) { }

    @Get()
    @ApiQuery({ name: 'status', enum: CharacterStatus, required: false })
    @ApiQuery({ name: 'teamId', type: Number, required: false })
    @ApiOperation({ summary: 'Lista los personajes. Acepta filtros opcionales por query: ?status={status} y ?teamId={id}.' })
    findAll(
        @Query('status', new ParseEnumPipe(CharacterStatus, { optional: true })) status?: CharacterStatus,
        @Query('teamId', new ParseIntPipe({ optional: true })) teamId?: number,
    ): Promise<CharacterEntity[]> {
        return this.charactersService.findAll(status, teamId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtiene un personaje por su id, incluyendo los datos de su equipo' })
    findById(@Param('id', ParseIntPipe) id: number): Promise<CharacterEntity> {
        return this.charactersService.findById(id);
    }

    @Post()
    @ApiOperation({ summary: 'Crea un personaje' })
    create(@Body() dto: CreateCharacterDto): Promise<CharacterEntity> {
        return this.charactersService.create(dto);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Reemplaza el personaje completo' })
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCharacterDto): Promise<CharacterEntity> {
        return this.charactersService.update(id, dto);
    }

    @Patch(':id/status')
    @ApiOperation({ summary: 'Cambia únicamente el estado (status) del personaje.' })
    updateStatus(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateStatusDto): Promise<CharacterEntity> {
        return this.charactersService.updateStatus(id, dto.status);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Elimina un personaje' })
    delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.charactersService.delete(id);
    }
}