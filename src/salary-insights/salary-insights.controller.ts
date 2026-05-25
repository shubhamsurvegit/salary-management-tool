import { Controller } from '@nestjs/common';
import { SalaryInsightsService } from './salary-insights.service';

@Controller('salary-insights')
export class SalaryInsightsController {
  constructor(private readonly salaryInsightsService: SalaryInsightsService) {}
}
