import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeRepository } from '../employees/employee.repository';
import { SalaryInsightsService } from './salary-insights.service';

describe('SalaryInsightsService', () => {
  let service: SalaryInsightsService;

  const mockRepository = {
    getSalaryStats: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SalaryInsightsService,
        {
          provide: EmployeeRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<SalaryInsightsService>(SalaryInsightsService);
    jest.clearAllMocks();
  });

  describe('getSalaryInsights', () => {
    it('returns minimum, maximum, and average salary for employees in a country', async () => {
      mockRepository.getSalaryStats.mockResolvedValue({
        employeeCount: 3,
        minSalary: 400_000,
        maxSalary: 900_000,
        averageSalary: 650_000,
      });

      await expect(
        service.getSalaryInsights({ country: 'India' }),
      ).resolves.toEqual({
        employeeCount: 3,
        minSalary: 400_000,
        maxSalary: 900_000,
        averageSalary: 650_000,
      });

      expect(mockRepository.getSalaryStats).toHaveBeenCalledWith({
        country: 'India',
      });
    });

    it('passes optional job title and department filters to the repository', async () => {
      mockRepository.getSalaryStats.mockResolvedValue({
        employeeCount: 1,
        minSalary: 500_000,
        maxSalary: 500_000,
        averageSalary: 500_000,
      });

      await service.getSalaryInsights({
        country: 'India',
        jobTitle: 'Software Engineer',
        department: 'Engineering',
      });

      expect(mockRepository.getSalaryStats).toHaveBeenCalledWith({
        country: 'India',
        jobTitle: 'Software Engineer',
        department: 'Engineering',
      });
    });

    it('returns zeroed stats when no employees match the filters', async () => {
      mockRepository.getSalaryStats.mockResolvedValue(null);

      await expect(
        service.getSalaryInsights({ country: 'Antarctica' }),
      ).resolves.toEqual({
        employeeCount: 0,
        minSalary: 0,
        maxSalary: 0,
        averageSalary: 0,
      });
    });
  });
});
