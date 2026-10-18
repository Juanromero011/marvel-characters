import { Module } from '@nestjs/common';
import { CharactersController } from './characters.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharacterEntity } from './entities/character.entity.js';
import { CharactersService } from './characters.service.js';
import { TeamEntity } from '../teams/entities/teams.entity.js';

@Module({
  controllers: [CharactersController],
  providers: [CharactersService],
  imports: [
    TypeOrmModule.forFeature([CharacterEntity, TeamEntity])
  ]
})
export class CharactersModule { }

