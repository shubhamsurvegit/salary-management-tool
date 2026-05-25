import { Controller, Get, Query } from '@nestjs/common';
import { SalaryInsightsQueryDto } from './dto/salary-insights-query.dto';
import { SalaryInsightsService } from './salary-insights.service';
import { SalaryStatsRow } from './types/salary-stats.row';

@Controller('salary-insights')
export class SalaryInsightsController {
  constructor(private readonly insightsService: SalaryInsightsService) {}

  @Get()
  async getSalaryInsights(
    @Query() query: SalaryInsightsQueryDto,
  ): Promise<SalaryStatsRow | null> {
    return this.insightsService.getSalaryInsights(query);
  }
}
