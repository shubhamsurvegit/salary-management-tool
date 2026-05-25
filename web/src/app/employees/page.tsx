'use client';

import { useEffect, useState } from 'react';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Loading } from '@/components/ui/Loading';
import { employeesApi } from '@/lib/api/employees';
import { ApiError } from '@/lib/errors';
import type { PaginatedEmployeesResult } from '@/types/employee';

export default function EmployeesPage() {
  const [result, setResult] = useState<PaginatedEmployeesResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await employeesApi.list({ page: 1, limit: 10 });
        if (!cancelled) {
          setResult(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError ? err.message : 'Failed to load employees.',
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
        <h1>Employees</h1>
        <p className="page-header__subtitle">
          Manage employee records. List and CRUD flows come in the next steps.
        </p>
      </header>

      {loading && <Loading label="Loading employees…" />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && result?.data.length === 0 && (
        <EmptyState
          title="No employees yet"
          description="Add employees via the API or run the seed script."
        />
      )}
      {!loading && !error && result && result.data.length > 0 && (
        <p className="api-smoke-test">
          API connected — {result.total.toLocaleString()} employees in database
          (showing page {result.page} of {result.totalPages}).
        </p>
      )}
    </section>
  );
}
