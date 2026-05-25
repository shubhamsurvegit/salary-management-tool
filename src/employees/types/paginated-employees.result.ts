import { Employee } from '../entities/employee.entity';

export type PaginatedEmployeesResult = {
  data: Employee[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
