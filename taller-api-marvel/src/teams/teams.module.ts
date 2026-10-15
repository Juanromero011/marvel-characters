import { Module } from '@nestjs/common';
import { TeamsController } from './teams.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamEntity } from './entities/teams.entity.js';
import { TeamsService } from './teams.service.js';

@Module({
  controllers: [TeamsController],
  providers: [TeamsService],
  imports: [
    TypeOrmModule.forFeature([TeamEntity])
  ]
})
export class TeamsModule { }

