import { Body, Controller, Delete, Get, Param, ParseEnumPipe, ParseIntPipe, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';

import { CharactersService } from './characters.service.js';
import { CharacterEntity, CharacterStatus } from './entities/character.entity.js';

@ApiTags('characters')
@Controller('characters')
export class CharactersController {

    constructor(private readonly charactersService: CharactersService) { }

    @Get()
    @ApiQuery({ name: 'status', enum: CharacterStatus, required: false })
    @ApiQuery({ name: 'teamId', type: Number, required: false })
    findAll(
        @Query('status', new ParseEnumPipe(CharacterStatus, { optional: true })) status?: CharacterStatus,
        @Query('teamId', new ParseIntPipe({ optional: true })) teamId?: number,
    ): Promise<CharacterEntity[]> {
        return this.charactersService.findAll(status, teamId);
    }

    @Get(':id')
    findById(@Param('id', ParseIntPipe) id: number): Promise<CharacterEntity> {
        return this.charactersService.findById(id);
    }

    @Post()
    create(@Body() character: CharacterEntity): Promise<CharacterEntity> {
        return this.charactersService.create(character);
    }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() character: CharacterEntity): Promise<CharacterEntity> {
        return this.charactersService.update(id, character);
    }

    @Patch(':id/status')
    @ApiBody({ schema: { properties: { status: { type: 'string', enum: Object.values(CharacterStatus) } } } })
    updateStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', new ParseEnumPipe(CharacterStatus)) status: CharacterStatus,
    ): Promise<CharacterEntity> {
        return this.charactersService.updateStatus(id, status);
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.charactersService.delete(id);
    }
}
