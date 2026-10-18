import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TeamEntity } from "./entities/teams.entity.js";
import { CharacterEntity } from "../characters/entities/character.entity.js";
import { DataSource, EntityManager, In, Not, Repository } from "typeorm";
import { CreateTeamDto } from "./dto/create-team.dto.js";
import { UpdateTeamDto } from "./dto/update-team.dto.js";

@Injectable()
export class TeamsService {
    constructor(
        @InjectRepository(TeamEntity)
        private readonly teamsRepository: Repository<TeamEntity>,
        @InjectRepository(CharacterEntity)
        private readonly charactersRepository: Repository<CharacterEntity>,
        private readonly dataSource: DataSource,
    ) { }

    //Traer todos los equipos
    findAll(): Promise<TeamEntity[]> {
        return this.teamsRepository.find({ order: { id: 'ASC' } });
    }

    //Traer un equipo por id
    async findById(id: number): Promise<TeamEntity> {
        const team = await this.teamsRepository.findOne({ where: { id } });
        if (!team) {
            throw new NotFoundException(`Team with id ${id} not found`);
        }
        return team;
    }

    //Traer los personajes de un equipo
    async findCharacters(id: number): Promise<CharacterEntity[]> {
        await this.findById(id);
        return this.charactersRepository.find({ where: { team_id: id }, order: { id: 'ASC' } });
    }

    //Crear un equipo y, opcionalmente, asignarle personajes
    async create(dto: CreateTeamDto): Promise<TeamEntity> {
        await this.validateUniqueName(dto.name);
        const active = dto.active ?? true;
        const characterIds = dto.characterIds ?? [];

        if (characterIds.length > 0) {
            if (!active) {
                throw new BadRequestException('Cannot assign characters to an inactive team');
            }
            await this.validateCharactersExist(characterIds);
        }

        // Transacción: si falla la asignación no queda el equipo creado a medias
        return this.dataSource.transaction(async (manager) => {
            const team = await manager.save(TeamEntity, manager.create(TeamEntity, {
                name: dto.name,
                base: dto.base ?? null,
                founded_year: dto.founded_year ?? null,
                active,
            }));
            await this.assignToTeam(manager, team.id, characterIds);
            return team;
        });
    }

    //Reemplazar un equipo completo
    async update(id: number, dto: UpdateTeamDto): Promise<TeamEntity> {
        const team = await this.findById(id);
        await this.validateUniqueName(dto.name, id);

        team.name = dto.name;
        team.base = dto.base ?? null;
        team.founded_year = dto.founded_year ?? null;
        team.active = dto.active;
        return this.teamsRepository.save(team);
    }

    //Asignar personajes a un equipo (si ya pertenecen a otro, se reasignan)
    async assignCharacters(id: number, characterIds: number[]): Promise<CharacterEntity[]> {
        const team = await this.findById(id);
        await this.validateCharactersExist(characterIds);
        if (!team.active) {
            throw new BadRequestException(`Team with id ${id} is not active`);
        }

        await this.assignToTeam(this.dataSource.manager, id, characterIds);
        return this.findCharacters(id);
    }

    //Eliminar un equipo (solo si no tiene personajes)
    async delete(id: number): Promise<void> {
        await this.findById(id);
        const hasCharacters = await this.charactersRepository.existsBy({ team_id: id });
        if (hasCharacters) {
            throw new ConflictException(`Team with id ${id} has associated characters; deactivate it with PUT (active: false) instead`);
        }
        await this.teamsRepository.delete(id);
    }

    private async validateUniqueName(name: string, excludeId?: number): Promise<void> {
        const exists = await this.teamsRepository.existsBy(
            excludeId === undefined ? { name } : { name, id: Not(excludeId) },
        );
        if (exists) {
            throw new ConflictException(`Team with name "${name}" already exists`);
        }
    }

    private async validateCharactersExist(characterIds: number[]): Promise<void> {
        const ids = [...new Set(characterIds)];
        const found = await this.charactersRepository.find({ select: { id: true }, where: { id: In(ids) } });
        const foundIds = new Set(found.map((character) => character.id));
        const missing = ids.filter((characterId) => !foundIds.has(characterId));
        if (missing.length > 0) {
            throw new NotFoundException(`Characters with ids ${missing.join(', ')} not found`);
        }
    }

    private async assignToTeam(manager: EntityManager, teamId: number, characterIds: number[]): Promise<void> {
        if (characterIds.length === 0) {
            return;
        }
        await manager.update(CharacterEntity, { id: In([...new Set(characterIds)]) }, { team_id: teamId });
    }
}
