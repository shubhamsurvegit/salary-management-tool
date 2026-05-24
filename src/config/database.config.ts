import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const databaseUrl = process.env.DATABASE_URL;
const synchronize = process.env.DB_SYNCHRONIZE === 'true';
const sslEnabled = process.env.DB_SSL === 'true';

const sharedConfig = {
  autoLoadEntities: true,
  synchronize,
  migrations: ['dist/migrations/*.js'],
  migrationsRun: true,
};

export const databaseConfig: TypeOrmModuleOptions = databaseUrl
  ? {
      type: 'postgres',
      url: databaseUrl,
      ssl: sslEnabled ? { rejectUnauthorized: false } : false,
      ...sharedConfig,
    }
  : {
      type: 'postgres',
      host: process.env.DB_HOST ?? '127.0.0.1',
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      username: process.env.DB_USERNAME ?? 'postgres',
      password: process.env.DB_PASSWORD ?? 'postgres',
      database: process.env.DB_NAME ?? 'salary_management',
      ...sharedConfig,
    };
