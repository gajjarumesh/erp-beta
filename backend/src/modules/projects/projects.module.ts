import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import {
  Project,
  Task,
  TaskComment,
  Timesheet,
} from '../../database/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Project,
      Task,
      TaskComment,
      Timesheet,
    ]),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
