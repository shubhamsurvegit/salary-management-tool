import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
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
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedEmployeesResult> {
    return this.employeeService.findAll(query.page, query.limit);
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number): Promise<Employee> {
    return this.employeeService.findById(id);
  }
}
