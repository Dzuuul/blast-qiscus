import { Module } from '@nestjs/common';
import { QiscusController } from './qiscus.controller';
import { QiscusService } from './qiscus.service';
// import { LogsDbModule } from 'src/datasource/databases/logs-db/logs-db.module';
import { AppConfigModule } from '@common/config/api/config.module';
import { CommonServiceModule } from '@common/services/services.module';
import { BullModule } from '@nestjs/bull';
import { ProjectDbModule } from 'src/datasource/databases/project-db/project-db.module';
import { ProcessPushTemplate } from './qiscus.process';

@Module({
  imports: [
    AppConfigModule,
    // LogsDbModule,
    ProjectDbModule,
    CommonServiceModule,
    BullModule.registerQueue({
      name: "push_template"
    }),
  ],
  controllers: [QiscusController],
  providers: [QiscusService, ProcessPushTemplate]
})
export class QiscusModule { }
