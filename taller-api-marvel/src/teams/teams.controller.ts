import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put } from '@nestjs/common';
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TeamsService } from './teams.service.js';
import { TeamEntity } from './entities/teams.entity.js';
import { CharacterEntity } from '../characters/entities/character.entity.js';
import { CreateTeamDto } from './dto/create-team.dto.js';
import { UpdateTeamDto } from './dto/update-team.dto.js';
import { AssignCharactersDto } from './dto/assign-characters.dto.js';

@ApiTags('teams')
@Controller('teams')
export class TeamsController {
    constructor(private readonly teamsService: TeamsService) { }

    //Traer todos los equipos
    @Get()
    @ApiOperation({ summary: 'Lista todos los equipos' })
    @ApiOkResponse({ type: TeamEntity, isArray: true })
    findAll(): Promise<TeamEntity[]> {
        return this.teamsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtiene un equipo por su id' })
    @ApiOkResponse({ type: TeamEntity })
    @ApiNotFoundResponse({ description: 'El equipo no existe' })
    findById(@Param('id', ParseIntPipe) id: number): Promise<TeamEntity> {
        return this.teamsService.findById(id);
    }

    @Get(':id/characters')
    @ApiOperation({ summary: 'Lista los personajes que pertenecen al equipo' })
    @ApiOkResponse({ type: CharacterEntity, isArray: true })
    @ApiNotFoundResponse({ description: 'El equipo no existe' })
    findCharacters(@Param('id', ParseIntPipe) id: number): Promise<CharacterEntity[]> {
        return this.teamsService.findCharacters(id);
    }

    @Post()
    @ApiOperation({ summary: 'Crea un equipo y opcionalmente le asigna personajes (characterIds)' })
    @ApiCreatedResponse({ type: TeamEntity })
    @ApiBadRequestResponse({ description: 'Datos inválidos o equipo inactivo al asignar personajes' })
    @ApiNotFoundResponse({ description: 'Algún personaje no existe' })
    @ApiConflictResponse({ description: 'Ya existe un equipo con ese nombre' })
    create(@Body() team: CreateTeamDto): Promise<TeamEntity> {
        return this.teamsService.create(team);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Reemplaza el equipo completo' })
    @ApiOkResponse({ type: TeamEntity })
    @ApiBadRequestResponse({ description: 'Datos inválidos' })
    @ApiNotFoundResponse({ description: 'El equipo no existe' })
    @ApiConflictResponse({ description: 'Ya existe un equipo con ese nombre' })
    update(@Param('id', ParseIntPipe) id: number, @Body() team: UpdateTeamDto): Promise<TeamEntity> {
        return this.teamsService.update(id, team);
    }

    @Patch(':id/characters')
    @ApiOperation({ summary: 'Asigna uno o varios personajes al equipo' })
    @ApiOkResponse({ type: CharacterEntity, isArray: true, description: 'Personajes del equipo después de la asignación' })
    @ApiBadRequestResponse({ description: 'Datos inválidos o equipo inactivo' })
    @ApiNotFoundResponse({ description: 'El equipo o algún personaje no existe' })
    assignCharacters(@Param('id', ParseIntPipe) id: number, @Body() body: AssignCharactersDto): Promise<CharacterEntity[]> {
        return this.teamsService.assignCharacters(id, body.characterIds);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Elimina un equipo' })
    @ApiOkResponse({ description: 'Equipo eliminado' })
    @ApiNotFoundResponse({ description: 'El equipo no existe' })
    @ApiConflictResponse({ description: 'El equipo tiene personajes asociados' })
    delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.teamsService.delete(id);
    }
}
