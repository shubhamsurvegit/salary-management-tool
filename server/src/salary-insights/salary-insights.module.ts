import { Module } from '@nestjs/common';
import { EmployeesModule } from '../employees/employees.module';
import { SalaryInsightsController } from './salary-insights.controller';
import { SalaryInsightsService } from './salary-insights.service';

@Module({
  imports: [EmployeesModule],
  controllers: [SalaryInsightsController],
  providers: [SalaryInsightsService],
})
export class SalaryInsightsModule {}
