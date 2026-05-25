import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { SalaryInsightsQueryDto } from '../salary-insights/dto/salary-insights-query.dto';
import { SalaryStatsRow } from '../salary-insights/types/salary-stats.row';

export type EmployeeListFilters = Pick<
  SalaryInsightsQueryDto,
  'country' | 'jobTitle' | 'department'
>;

@Injectable()
export class EmployeeRepository {
  constructor(
    @InjectRepository(Employee)
    private readonly repository: Repository<Employee>,
  ) {}

  create(data: Partial<Employee>): Employee {
    return this.repository.create(data);
  }

  save(employee: Employee): Promise<Employee> {
    return this.repository.save(employee);
  }

  async findAll(
    page: number,
    limit: number,
    filters: EmployeeListFilters = {},
  ): Promise<{ data: Employee[]; total: number }> {
    const query = this.repository.createQueryBuilder('employee');

    if (filters.country) {
      query.andWhere('employee.country = :country', {
        country: filters.country,
      });
    }

    if (filters.jobTitle) {
      query.andWhere('employee.jobTitle = :jobTitle', {
        jobTitle: filters.jobTitle,
      });
    }

    if (filters.department) {
      query.andWhere('employee.department = :department', {
        department: filters.department,
      });
    }

    query.orderBy('employee.id', 'ASC');
    query.skip((page - 1) * limit);
    query.take(limit);

    const [data, total] = await query.getManyAndCount();
    return { data, total };
  }

  findById(id: number): Promise<Employee | null> {
    return this.repository.findOne({ where: { id } });
  }

  findByEmail(email: string): Promise<Employee | null> {
    return this.repository.findOne({ where: { email } });
  }

  async update(id: number, data: Partial<Employee>): Promise<Employee | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async getSalaryStats(
    filters: SalaryInsightsQueryDto,
  ): Promise<SalaryStatsRow | null> {
    const query = this.repository
      .createQueryBuilder('employee')
      .select('MIN(employee.salary)', 'minimumSalary')
      .addSelect('MAX(employee.salary)', 'maximumSalary')
      .addSelect('AVG(employee.salary)', 'averageSalary')
      .addSelect('COUNT(employee.id)', 'employeeCount');

    if (filters.country) {
      query.andWhere('employee.country = :country', {
        country: filters.country,
      });
    }

    if (filters.jobTitle) {
      query.andWhere('employee.jobTitle = :jobTitle', {
        jobTitle: filters.jobTitle,
      });
    }

    if (filters.department) {
      query.andWhere('employee.department = :department', {
        department: filters.department,
      });
    }

    const raw = await query.getRawOne<{
      minimumSalary: string | null;
      maximumSalary: string | null;
      averageSalary: string | null;
      employeeCount: string;
    }>();

    const employeeCount = Number(raw?.employeeCount ?? 0);
    if (employeeCount === 0) {
      return null;
    }

    return {
      employeeCount,
      minSalary: parseFloat(raw!.minimumSalary ?? '0'),
      maxSalary: parseFloat(raw!.maximumSalary ?? '0'),
      averageSalary: parseFloat(raw!.averageSalary ?? '0'),
    };
  }
}
