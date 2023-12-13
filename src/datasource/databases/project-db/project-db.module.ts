import { Module } from '@nestjs/common';
import { ProjectDbService } from './project-db.service';
import { ProjectDBConfigModule } from '@common/config/db/project-db/config.module';
import { ProjectDBConfigService } from '@common/config/db/project-db/config.service';
import { baseModelProviders } from './models/model.base.providers';
import { ProjectDBProvider } from './project-db.providers';

@Module({
  imports: [ProjectDBConfigModule],
  providers: [ProjectDbService, ProjectDBConfigService, ...baseModelProviders, ...ProjectDBProvider],
  exports: [ProjectDbService, ...baseModelProviders, ...ProjectDBProvider]
})
export class ProjectDbModule {}
