import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullModule } from "@nestjs/bull";
import { AppConfigModule } from './common/config/api/config.module';
import { QiscusModule } from './modules/qiscus/qiscus.module';
// import { WaUnofficialModule } from './modules/wa-unofficial/wa-unofficial.module';

@Module({
  imports: [
    AppConfigModule,
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    QiscusModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
