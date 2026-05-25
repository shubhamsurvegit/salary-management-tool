import type {
  CreateEmployeeInput,
  Employee,
  PaginatedEmployeesResult,
  UpdateEmployeeInput,
} from '@/types/employee';
import { buildQuery, request } from './client';

export type ListEmployeesParams = {
  page?: number;
  limit?: number;
};

export const employeesApi = {
  list(params: ListEmployeesParams = {}): Promise<PaginatedEmployeesResult> {
    const query = buildQuery({
      page: params.page ?? 1,
      limit: params.limit ?? 10,
    });
    return request<PaginatedEmployeesResult>(`/employees${query}`);
  },

  getById(id: number): Promise<Employee> {
    return request<Employee>(`/employees/${id}`);
  },

  create(body: CreateEmployeeInput): Promise<Employee> {
    return request<Employee>('/employees', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  update(id: number, body: UpdateEmployeeInput): Promise<Employee> {
    return request<Employee>(`/employees/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  delete(id: number): Promise<void> {
    return request<void>(`/employees/${id}`, { method: 'DELETE' });
  },
};
