import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import configuration from './index';
import { ProjectDBConfigService } from './config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'development' ? `.env.${process.env.NODE_ENV}` : `.env`,
      load: [configuration],
      validationSchema: Joi.object({
        DB_PROJECT_HOST: Joi.string(),
        DB_PROJECT_PORT: Joi.number().default(3306),
        DB_PROJECT_USER: Joi.string(),
        DB_PROJECT_PASS: Joi.string().allow(""),
        DB_PROJECT_NAME: Joi.string()
      }),
    }),
  ],
  providers: [ConfigService, ProjectDBConfigService],
  exports: [ConfigService, ProjectDBConfigService],
})
export class ProjectDBConfigModule {}
