import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TeamEntity } from "./entities/teams.entity.js";
import { Repository } from "typeorm";
@Injectable()
export class TeamsService {
    constructor(
        @InjectRepository(TeamEntity)
        private readonly teamsRepository: Repository<TeamEntity>,
    ) { }

    //Traer todos los equipos
    findAll(): Promise<TeamEntity[]> {
        return this.teamsRepository.find();
    }

    //Traer un equipo por id
    async findById(id: number): Promise<TeamEntity> {
        const team = await this.teamsRepository.findOne({ where: { id } });
        if (!team) {
            throw new NotFoundException(`Team with id ${id} not found`);
        }
        return team;
    }
}