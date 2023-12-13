import { Module } from '@nestjs/common';
import { CommonService } from './services.service';
import { ProjectDbModule } from 'src/datasource/databases/project-db/project-db.module';
import { AppConfigModule } from '@common/config/api/config.module';

@Module({
  imports: [
    AppConfigModule,
    ProjectDbModule
  ],
  providers: [CommonService],
  exports: [CommonService]
})
export class CommonServiceModule { }
