import type { SalaryStatsRow } from '@/types/salary-stats';
import { formatSalary } from '@/lib/format';
import { StatCard } from './StatCard';

type SalaryStatsGridProps = {
  stats: SalaryStatsRow;
};

export function SalaryStatsGrid({ stats }: SalaryStatsGridProps) {
  return (
    <div className="stats-grid">
      <StatCard label="Employees" value={stats.employeeCount.toLocaleString()} />
      <StatCard label="Min salary" value={formatSalary(stats.minSalary)} />
      <StatCard label="Max salary" value={formatSalary(stats.maxSalary)} />
      <StatCard
        label="Average salary"
        value={formatSalary(stats.averageSalary)}
      />
    </div>
  );
}
