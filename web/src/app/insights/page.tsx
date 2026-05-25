'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { CountrySelect } from '@/components/CountrySelect';
import { SalaryStatsGrid } from '@/components/insights/SalaryStatsGrid';
import { DEFAULT_COUNTRY } from '@/constants/countries';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Loading } from '@/components/ui/Loading';
import { salaryInsightsApi } from '@/lib/api/salaryInsights';
import { ApiError } from '@/lib/errors';
import type {
  SalaryInsightsFilters,
  SalaryStatsRow,
} from '@/types/salary-stats';

type InsightsFilterForm = {
  country: string;
  jobTitle: string;
  department: string;
};

const defaultFilters: InsightsFilterForm = {
  country: DEFAULT_COUNTRY,
  jobTitle: '',
  department: '',
};

function toApiFilters(form: InsightsFilterForm): SalaryInsightsFilters {
  return {
    country: form.country.trim() || undefined,
    jobTitle: form.jobTitle.trim() || undefined,
    department: form.department.trim() || undefined,
  };
}

function describeFilters(form: InsightsFilterForm): string {
  const parts: string[] = [];
  if (form.country.trim()) {
    parts.push(`country "${form.country.trim()}"`);
  }
  if (form.jobTitle.trim()) {
    parts.push(`job title "${form.jobTitle.trim()}"`);
  }
  if (form.department.trim()) {
    parts.push(`department "${form.department.trim()}"`);
  }
  return parts.length > 0 ? parts.join(', ') : 'your filters';
}

export default function InsightsPage() {
  const [filters, setFilters] = useState<InsightsFilterForm>(defaultFilters);
  const [appliedFilters, setAppliedFilters] =
    useState<InsightsFilterForm>(defaultFilters);
  const [stats, setStats] = useState<SalaryStatsRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadInsights = useCallback(async (form: InsightsFilterForm) => {
    setLoading(true);
    setError(null);
    try {
      const data = await salaryInsightsApi.get(toApiFilters(form));
      setStats(data);
    } catch (err) {
      setStats(null);
      setError(
        err instanceof ApiError ? err.message : 'Failed to load insights.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadInsights(appliedFilters);
  }, [appliedFilters, loadInsights]);

  function handleApply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAppliedFilters(filters);
  }

  function updateFilter<K extends keyof InsightsFilterForm>(
    key: K,
    value: InsightsFilterForm[K],
  ) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  return (
    <section>
      <header className="page-header">
        <h1>Salary insights</h1>
        <p className="page-header__subtitle">
          Minimum, maximum, and average salary by country, job title, and
          department.
        </p>
      </header>

      <form className="insights-filters" onSubmit={handleApply}>
        <label className="field">
          Country
          <CountrySelect
            value={filters.country}
            onChange={(value) => updateFilter('country', value)}
          />
        </label>
        <label className="field">
          Job title
          <input
            type="text"
            value={filters.jobTitle}
            placeholder="Software Engineer"
            onChange={(e) => updateFilter('jobTitle', e.target.value)}
          />
        </label>
        <label className="field">
          Department
          <input
            type="text"
            value={filters.department}
            placeholder="Engineering"
            onChange={(e) => updateFilter('department', e.target.value)}
          />
        </label>
        <button type="submit" className="button button--primary">
          Apply
        </button>
      </form>

      {loading && <Loading label="Loading insights…" />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && stats?.employeeCount === 0 && (
        <EmptyState
          title="No employees match"
          description={`No salary data found for ${describeFilters(appliedFilters)}.`}
        />
      )}
      {!loading && !error && stats && stats.employeeCount > 0 && (
        <SalaryStatsGrid stats={stats} />
      )}
    </section>
  );
}
