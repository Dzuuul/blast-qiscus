import { Module } from '@nestjs/common';
import { AppConfigService } from './config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from "./index"
import * as Joi from "joi"

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'development' ? `.env.${process.env.NODE_ENV}` : `.env`,
      load: [configuration],
      validationSchema: Joi.object({
        ENV: Joi.string(),
        PORT: Joi.string(),
        VERSION: Joi.string(),
        NAME_PROGRAM: Joi.string(),
        PROGRAM_ID: Joi.string(),
        KEYWORD: Joi.string().allow(""),
        DOMAIN_APP: Joi.string(),
        API_USER: Joi.string(),
        API_KEY: Joi.string(),
        VALIDATION_SERVICE_URL: Joi.string(),
        WHATSAPP_SERVICE_URL: Joi.string().allow(""),
        QISCUS_WA_GATEWAY_NUMBER: Joi.number().allow(""),
        QISCUS_APP_ID: Joi.string().allow(""),
        QISCUS_SECRET_KEY: Joi.string().allow(""),
        QISCUS_CHANNEL_ID: Joi.number().allow(""),
        QISCUS_TOKEN_UPLOAD: Joi.string().allow(""),
        QISCUS_TEMPLATE_NAMESPACE: Joi.string().allow(""),
        QISCUS_TEMPLATE_NAME_APPROVED_WA: Joi.string().allow(""),
        QISCUS_TEMPLATE_NAME_REJECT_WA: Joi.string().allow(""),
        QISCUS_SEND_MESSAGE_URL: Joi.string().allow(""),
        QISCUS_UPLOAD_URL: Joi.string().allow(""),
      }),
    }),
  ],
  providers: [ConfigService, AppConfigService],
  exports: [ConfigService, AppConfigService]
})
export class AppConfigModule { }
