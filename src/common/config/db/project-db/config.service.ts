import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { writeFileSync } from 'fs';
import { resolve, join } from "path"
@Injectable()
export class ProjectDBConfigService {
  constructor(private configService: ConfigService) {
    writeFileSync(
      'ormconfig.json',
      JSON.stringify(this.typeORMConfig, null, 2),
    );
  }

  get typeORMConfig(): TypeOrmModuleOptions {
    return {
      type: 'mariadb',
      host: this.configService.get<string>('db.mariaDB.host'),
      port: Number(this.configService.get<string>('db.mariaDB.port')),
      username: this.configService.get<string>('db.mariaDB.username'),
      password: this.configService.get<string>('db.mariaDB.password'),
      database: this.configService.get<string>('db.mariaDB.database'),
      logging: false,
      synchronize: false,
      entities: [
        join(__dirname, '/../../../../datasource/databases/project-db/models/*.entity.{ts,js}'),
      ],
      //   cache: true,
    };
  }
}
