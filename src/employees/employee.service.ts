import { ConflictException, Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { EmployeeRepository } from './employee.repository';
import { Employee } from './entities/employee.entity';

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
}
