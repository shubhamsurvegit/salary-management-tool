import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeeListFilters, EmployeeRepository } from './employee.repository';
import { Employee } from './entities/employee.entity';
import { PaginatedEmployeesResult } from './types/paginated-employees.result';

@Injectable()
export class EmployeeService {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async create(dto: CreateEmployeeDto): Promise<Employee> {
    const existing = await this.employeeRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException(
        `Employee with email ${dto.email} already exists`,
      );
    }

    const employee = this.employeeRepository.create({
      ...dto,
      currency: dto.currency ?? 'INR',
      isActive: dto.isActive ?? true,
      joiningDate: new Date(dto.joiningDate),
    });

    return this.employeeRepository.save(employee);
  }

  async findAll(
    page = 1,
    limit = 10,
    filters: EmployeeListFilters = {},
  ): Promise<PaginatedEmployeesResult> {
    const { data, total } = await this.employeeRepository.findAll(
      page,
      limit,
      filters,
    );

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: number): Promise<Employee> {
    const employee = await this.employeeRepository.findById(id);
    if (!employee) {
      throw new NotFoundException(`Employee with id ${id} not found`);
    }

    return employee;
  }

  async update(id: number, dto: UpdateEmployeeDto): Promise<Employee> {
    await this.findById(id);

    if (dto.email) {
      const existing = await this.employeeRepository.findByEmail(dto.email);
      if (existing && existing.id !== id) {
        throw new ConflictException(
          `Employee with email ${dto.email} already exists`,
        );
      }
    }

    const updated = await this.employeeRepository.update(id, {
      ...dto,
      joiningDate: dto.joiningDate ? new Date(dto.joiningDate) : undefined,
    });

    if (!updated) {
      throw new NotFoundException(`Employee with id ${id} not found`);
    }

    return updated;
  }

  async delete(id: number): Promise<void> {
    const deleted = await this.employeeRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Employee with id ${id} not found`);
    }
  }
}
