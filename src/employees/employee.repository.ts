import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';

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

  findAll(): Promise<Employee[]> {
    return this.repository.find({ order: { id: 'ASC' } });
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

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
