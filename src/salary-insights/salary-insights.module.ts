import { Module } from '@nestjs/common';
import { SalaryInsightsController } from './salary-insights.controller';
import { SalaryInsightsService } from './salary-insights.service';

@Module({
  controllers: [SalaryInsightsController],
  providers: [SalaryInsightsService],
})
export class SalaryInsightsModule {}
