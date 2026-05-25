import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { EmployeesModule } from './employees/employees.module';
import { HealthController } from './health.controller';
import { SalaryInsightsModule } from './salary-insights/salary-insights.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    EmployeesModule,
    SalaryInsightsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
