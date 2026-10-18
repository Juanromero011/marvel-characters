import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CharacterEntity } from "./entities/character.entity.js";
import { Repository } from "typeorm";

@Injectable()
export class CharactersService {
    constructor(
        @InjectRepository(CharacterEntity)
        private readonly charactersRepository: Repository<CharacterEntity>,
    ) { }

    findAll(): Promise<CharacterEntity[]> {
        return this.charactersRepository.find();
    }
    async findById(id: number): Promise<CharacterEntity> {
        const character = await this.charactersRepository.findOne({ where: { id } });
        if (!character) {
            throw new NotFoundException(`Character with id ${id} not found`);
        }
        return character;
    }

    create(character: CharacterEntity): Promise<CharacterEntity> {
        return this.charactersRepository.save(character);
    }

    update(id: number, character: CharacterEntity, status: string): Promise<CharacterEntity> {
        return this.charactersRepository.save({ ...character, id, status });
    }

    delete(id: number): Promise<void> {
        return this.charactersRepository.delete(id).then(() => { });
    }
}