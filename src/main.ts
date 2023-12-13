import { NestFactory, NestApplication, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from "@nestjs/config";
import * as express from "express";
import { Queue } from 'bull';
import { createBullBoard } from "bull-board";
import { BullAdapter } from "bull-board/bullAdapter";
import * as expressWinston from "express-winston";
import * as winston from 'winston';
import * as winstonRotate from "winston-daily-rotate-file";
import { AllExceptionsFilter } from '@common/filter/exception.filter';
import transports from "@common/logs/transports.log";
import helmet from 'helmet';
import * as csruf from 'csurf';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
winstonRotate

async function bootstrap() {
  const app: NestApplication = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get("app.PORT");
  let adapters: BullAdapter[] = []
  let queues = ["push_template"]
  for (let index = 0; index < queues.length; index++) {
    const queue = queues[index]
    const adapter = new BullAdapter(app.get<Queue>(`BullQueue_${queue}`))
    adapters.push(adapter)
  }
  const { router: bullRouter } = createBullBoard(adapters)
  app.use(
    `/admin/queues`,
    bullRouter
  )

  const config = new DocumentBuilder()
    .addSecurity("authentication", { name: "authentication", type: "apiKey", in: "header" })
    .setTitle(process.env.SWAGGER_TITLE)
    .setVersion(process.env.SWAGGER_VERSION)
    .addTag(process.env.KEYWORD)
    .setContact("REDBOX", "https://redboxdigital.id/", "redbox@missiidea.com")
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document);

  app.enableCors();
  app.use(helmet())
  app.use(express.json({ limit: 50000000 }));
  app.use(expressWinston.logger({
    format: winston.format.combine(
      winston.format.timestamp({
        format: "DD-MM-YYYY HH:mm:ss",
      }),
      winston.format.json()
    ),
    meta: true,
    responseWhitelist: [...expressWinston.responseWhitelist, 'body'],
    requestWhitelist: ['body', 'query', 'params', 'method', 'originalUrl', 'headers.x-forwarded-for', 'connection.remoteAddress'],
    transports: process.env.NODE_ENV == "development" ? [transports.console] : [transports.combine]
  })
  )
  const httpAdapterHost = app.get(HttpAdapterHost)
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));
  await app.listen(port).then((v) => {
    console.log("RUNNING ON PORT ", port)
  })
  app.use(csruf())
}
bootstrap();
