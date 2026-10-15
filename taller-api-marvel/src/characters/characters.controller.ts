import { Controller, Get, Param } from '@nestjs/common';

import { CharactersService } from './characters.service.js';
import { CharacterEntity } from './entities/character.entity.js';

@Controller('characters')
export class CharactersController {

    constructor(private readonly charactersService: CharactersService) { }

    //Traer todos los personajes
    @Get()
    findAll(): Promise<CharacterEntity[]> {
        return this.charactersService.findAll();
    }

    @Get(':id')
    findById(@Param('id') id: number): Promise<CharacterEntity> {
        return this.charactersService.findById(id);
    }
}
