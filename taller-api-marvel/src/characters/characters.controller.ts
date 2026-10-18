import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';

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

    @Post()
    create(@Body() character: CharacterEntity): Promise<CharacterEntity> {
        return this.charactersService.create(character);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() character: CharacterEntity): Promise<CharacterEntity> {
        return this.charactersService.update(id, character, character.status);
    }

    @Patch(':id/:status')
    partialUpdate(@Param('id') id: number,@Param('status') status: string, @Body() character: Partial<CharacterEntity>): Promise<CharacterEntity> {
        return this.charactersService.update(id, character as CharacterEntity, status);
    }

    @Delete(':id')
    delete(@Param('id') id: number): Promise<void> {
        return this.charactersService.delete(id);
    }
}
