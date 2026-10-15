import { Controller, Get, Param } from '@nestjs/common';
import { TeamsService } from './teams.service.js';
import { TeamEntity } from './entities/teams.entity.js';

@Controller('teams')
export class TeamsController {
    constructor(private readonly teamsService: TeamsService) { }

    //Traer todos los equipos
    @Get()
    findAll(): Promise<TeamEntity[]> {
        return this.teamsService.findAll();
    }

    @Get(':id')
    findById(@Param('id') id: number): Promise<TeamEntity> {
        return this.teamsService.findById(id);
    }
}