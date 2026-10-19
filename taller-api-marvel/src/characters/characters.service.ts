import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOptionsWhere, Repository } from "typeorm";
import { CharacterEntity, CharacterStatus } from "./entities/character.entity.js";
import { TeamEntity } from "../teams/entities/teams.entity.js";
import { CreateCharacterDto } from "./dto/create-character.dto.js";
import { UpdateCharacterDto } from "./dto/update-character.dto.js";

@Injectable()
export class CharactersService {
    constructor(
        @InjectRepository(CharacterEntity)
        private readonly charactersRepository: Repository<CharacterEntity>,
        @InjectRepository(TeamEntity)
        private readonly teamsRepository: Repository<TeamEntity>,
    ) { }

    findAll(status?: CharacterStatus, teamId?: number): Promise<CharacterEntity[]> {
        const where: FindOptionsWhere<CharacterEntity> = {};
        if (status) where.status = status;
        if (teamId !== undefined) where.team_id = teamId;
        return this.charactersRepository.find({ where });
    }

    async findById(id: number): Promise<CharacterEntity> {
        const character = await this.charactersRepository.findOne({
            where: { id },
            relations: { team: true },
        });
        if (!character) {
            throw new NotFoundException(`Character with id ${id} not found`);
        }
        return character;
    }

    async create(dto: CreateCharacterDto): Promise<CharacterEntity> {
        await this.validateTeam(dto.team_id);
        return this.save(dto);
    }

    async update(id: number, dto: UpdateCharacterDto): Promise<CharacterEntity> {
        await this.findById(id);
        await this.validateTeam(dto.team_id);
        return this.save({ ...dto, team_id: dto.team_id ?? null, id });
    }

    async updateStatus(id: number, status: CharacterStatus): Promise<CharacterEntity> {
        const character = await this.findById(id);
        if (character.status === CharacterStatus.RETIRED && status === CharacterStatus.INJURED) {
            throw new BadRequestException('A RETIRED character cannot change directly to INJURED');
        }
        await this.charactersRepository.update(id, { status });
        return this.findById(id);
    }

    async delete(id: number): Promise<void> {
        await this.findById(id);
        await this.charactersRepository.delete(id);
    }

    private async validateTeam(teamId?: number | null): Promise<void> {
        if (teamId === undefined || teamId === null) return;
        const team = await this.teamsRepository.findOne({ where: { id: teamId } });
        if (!team) {
            throw new NotFoundException(`Team with id ${teamId} not found`);
        }
        if (!team.active) {
            throw new BadRequestException(`Team with id ${teamId} is not active`);
        }
    }

    private async save(data: DeepPartial<CharacterEntity>): Promise<CharacterEntity> {
        try {
            return await this.charactersRepository.save(data);
        } catch (e) {
            if ((e as { code?: string }).code === '23505') {
                throw new ConflictException('A character with that alias already exists');
            }
            throw e;
        }
    }
}