import { Module } from '@nestjs/common';
import { DataAdapterService } from './data-adapter.service';
import { ProjectsRepository } from '~modules/projects/projects.repository';

@Module({
  providers: [DataAdapterService, ProjectsRepository],
})
export class DataAdapterModule {}
