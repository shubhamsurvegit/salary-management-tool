export type Employee = {
  id: number;
  fullName: string;
  email: string;
  jobTitle: string;
  department: string | null;
  country: string;
  currency: string;
  salary: number;
  joiningDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateEmployeeInput = {
  fullName: string;
  email: string;
  jobTitle: string;
  country: string;
  salary: number;
  joiningDate: string;
  department?: string | null;
  currency?: string;
  isActive?: boolean;
};

export type UpdateEmployeeInput = Partial<CreateEmployeeInput>;

export type PaginatedEmployeesResult = {
  data: Employee[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
