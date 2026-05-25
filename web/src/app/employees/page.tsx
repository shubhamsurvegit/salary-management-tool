'use client';

import { useCallback, useEffect, useState } from 'react';
import { EmployeeTable } from '@/components/employees/EmployeeTable';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Loading } from '@/components/ui/Loading';
import { employeesApi } from '@/lib/api/employees';
import { ApiError } from '@/lib/errors';
import type { PaginatedEmployeesResult } from '@/types/employee';

const PAGE_SIZE = 10;

export default function EmployeesPage() {
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<PaginatedEmployeesResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEmployees = useCallback(async (pageToLoad: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await employeesApi.list({ page: pageToLoad, limit: PAGE_SIZE });
      setResult(data);
    } catch (err) {
      setResult(null);
      setError(
        err instanceof ApiError ? err.message : 'Failed to load employees.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadEmployees(page);
  }, [page, loadEmployees]);

  const totalPages = result?.totalPages ?? 1;

  return (
    <section>
      <header className="page-header">
        <h1>Employees</h1>
        <p className="page-header__subtitle">
          {result
            ? `${result.total.toLocaleString()} employees total`
            : 'Employee directory'}
        </p>
      </header>

      {loading && <Loading label="Loading employees…" />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && result?.data.length === 0 && (
        <EmptyState
          title="No employees yet"
          description="Add employees in the next step or run the seed script."
        />
      )}
      {!loading && !error && result && result.data.length > 0 && (
        <>
          <EmployeeTable employees={result.data} />
          <div className="pagination">
            <button
              type="button"
              className="button"
              disabled={page <= 1}
              onClick={() => setPage((current) => current - 1)}
            >
              Previous
            </button>
            <span className="pagination__info">
              Page {result.page} of {totalPages}
            </span>
            <button
              type="button"
              className="button"
              disabled={page >= totalPages}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </section>
  );
}
