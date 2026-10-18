import { Module } from '@nestjs/common';
import { TeamsController } from './teams.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamEntity } from './entities/teams.entity.js';
import { CharacterEntity } from '../characters/entities/character.entity.js';
import { TeamsService } from './teams.service.js';

@Module({
  controllers: [TeamsController],
  providers: [TeamsService],
  imports: [
    TypeOrmModule.forFeature([TeamEntity, CharacterEntity])
  ]
})
export class TeamsModule { }
