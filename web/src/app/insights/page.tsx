'use client';

import { useEffect, useState } from 'react';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Loading } from '@/components/ui/Loading';
import { salaryInsightsApi } from '@/lib/api/salaryInsights';
import { ApiError } from '@/lib/errors';
import type { SalaryStatsRow } from '@/types/salary-stats';

export default function InsightsPage() {
  const [stats, setStats] = useState<SalaryStatsRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await salaryInsightsApi.get({ country: 'India' });
        if (!cancelled) {
          setStats(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError ? err.message : 'Failed to load insights.',
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section>
      <header className="page-header">
        <h1>Salary insights</h1>
        <p className="page-header__subtitle">
          Filters and stat cards will be built in the next steps.
        </p>
      </header>

      {loading && <Loading label="Loading insights…" />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && stats && (
        <p className="api-smoke-test">
          API connected — India average salary:{' '}
          {stats.averageSalary.toLocaleString()} ({stats.employeeCount}{' '}
          employees).
        </p>
      )}
    </section>
  );
}
