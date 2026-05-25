export type SalaryStatsRow = {
  employeeCount: number;
  minSalary: number;
  maxSalary: number;
  averageSalary: number;
};

export type SalaryInsightsFilters = {
  country?: string;
  jobTitle?: string;
  department?: string;
};
