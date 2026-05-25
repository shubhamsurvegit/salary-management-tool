import './config/env';
import { DataSource, DataSourceOptions } from 'typeorm';
import { databaseConfig } from './config/database.config';
import { Employee } from './employees/entities/employee.entity';

const {
  autoLoadEntities: _,
  migrationsRun: __,
  ...connectionConfig
} = databaseConfig;

export default new DataSource({
  ...(connectionConfig as DataSourceOptions),
  entities: [Employee],
  migrations: ['dist/migrations/*.js'],
});
