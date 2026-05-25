import type {
  SalaryInsightsFilters,
  SalaryStatsRow,
} from '@/types/salary-stats';
import { buildQuery, request } from './client';

export const salaryInsightsApi = {
  get(filters: SalaryInsightsFilters = {}): Promise<SalaryStatsRow> {
    const query = buildQuery(filters);
    return request<SalaryStatsRow>(`/salary-insights${query}`);
  },
};
