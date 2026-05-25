import { Injectable } from '@nestjs/common';
import { EmployeeRepository } from '../employees/employee.repository';
import { SalaryInsightsQueryDto } from './dto/salary-insights-query.dto';
import { SalaryStatsRow } from './types/salary-stats.row';

@Injectable()
export class SalaryInsightsService {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async getSalaryInsights(
    filters: SalaryInsightsQueryDto,
  ): Promise<SalaryStatsRow | null> {
    return this.employeeRepository.getSalaryStats(filters);
  }
}
