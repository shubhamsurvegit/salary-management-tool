import './config/env';
import { DataSource, DataSourceOptions } from 'typeorm';
import { databaseConfig } from './config/database.config';

const { autoLoadEntities: _, ...connectionConfig } = databaseConfig;

export default new DataSource({
  ...(connectionConfig as DataSourceOptions),
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/*.js'],
});
