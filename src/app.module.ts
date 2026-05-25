import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from './config/database.config';
import { EmployeesModule } from './employees/employees.module';
import { SalaryInsightsModule } from './salary-insights/salary-insights.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    EmployeesModule,
    SalaryInsightsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
