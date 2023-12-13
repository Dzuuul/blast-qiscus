import { registerAs } from '@nestjs/config';

export default registerAs('db.mariaDB', () => ({
  host: process.env.DB_PROJECT_HOST,
  port: process.env.DB_PROJECT_PORT,
  username: process.env.DB_PROJECT_USER,
  password: process.env.DB_PROJECT_PASS,
  database: process.env.DB_PROJECT_NAME
}));
