import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { ListEmployeesQueryDto } from './dto/list-employees-query.dto';
import { EmployeeService } from './employee.service';
import { Employee } from './entities/employee.entity';
import { PaginatedEmployeesResult } from './types/paginated-employees.result';

@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  create(@Body() dto: CreateEmployeeDto): Promise<Employee> {
    return this.employeeService.create(dto);
  }

  @Get()
  findAll(
    @Query() query: ListEmployeesQueryDto,
  ): Promise<PaginatedEmployeesResult> {
    const { page, limit, country, jobTitle, department } = query;
    return this.employeeService.findAll(page, limit, {
      country,
      jobTitle,
      department,
    });
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number): Promise<Employee> {
    return this.employeeService.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEmployeeDto,
  ): Promise<Employee> {
    return this.employeeService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.employeeService.delete(id);
  }
}
