import { Test } from '@nestjs/testing';
import { SalaryInsightsService } from './salary-insights.service';

describe('SalaryInsightsService', () => {
  beforeEach(async () => {
    await Test.createTestingModule({
      providers: [SalaryInsightsService],
    }).compile();
  });

  describe('getSalaryInsights', () => {
    it.todo(
      'returns minimum, maximum, and average salary for employees in a country',
    );
  });
});
