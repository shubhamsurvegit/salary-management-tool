'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { CountrySelect } from '@/components/CountrySelect';
import { EditEmployeeModal } from '@/components/employees/EditEmployeeModal';
import { EmployeeForm } from '@/components/employees/EmployeeForm';
import { EmployeeTable } from '@/components/employees/EmployeeTable';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Loading } from '@/components/ui/Loading';
import { employeesApi } from '@/lib/api/employees';
import { ApiError } from '@/lib/errors';
import type { Employee, PaginatedEmployeesResult } from '@/types/employee';

const PAGE_SIZE = 10;

type EmployeeFilterForm = {
  country: string;
  jobTitle: string;
  department: string;
};

const defaultFilters: EmployeeFilterForm = {
  country: '',
  jobTitle: '',
  department: '',
};

function toListParams(page: number, form: EmployeeFilterForm) {
  return {
    page,
    limit: PAGE_SIZE,
    country: form.country.trim() || undefined,
    jobTitle: form.jobTitle.trim() || undefined,
    department: form.department.trim() || undefined,
  };
}

function hasActiveFilters(form: EmployeeFilterForm): boolean {
  return Boolean(
    form.country.trim() || form.jobTitle.trim() || form.department.trim(),
  );
}

function describeFilters(form: EmployeeFilterForm): string {
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
  return parts.join(', ');
}

export default function EmployeesPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<EmployeeFilterForm>(defaultFilters);
  const [appliedFilters, setAppliedFilters] =
    useState<EmployeeFilterForm>(defaultFilters);
  const [result, setResult] = useState<PaginatedEmployeesResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadEmployees = useCallback(
    async (pageToLoad: number, form: EmployeeFilterForm) => {
      setLoading(true);
      setError(null);
      try {
        const data = await employeesApi.list(toListParams(pageToLoad, form));
        setResult(data);
      } catch (err) {
        setResult(null);
        setError(
          err instanceof ApiError ? err.message : 'Failed to load employees.',
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void loadEmployees(page, appliedFilters);
  }, [page, appliedFilters, loadEmployees]);

  function handleApplyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPage(1);
    setAppliedFilters(filters);
  }

  function updateFilter<K extends keyof EmployeeFilterForm>(
    key: K,
    value: EmployeeFilterForm[K],
  ) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  async function handleEmployeeCreated() {
    try {
      const summary = await employeesApi.list(
        toListParams(1, appliedFilters),
      );
      setPage(summary.totalPages);
    } catch {
      void loadEmployees(page, appliedFilters);
    }
  }

  async function handleDelete(employee: Employee) {
    const confirmed = window.confirm(
      `Delete ${employee.fullName}? This cannot be undone.`,
    );
    if (!confirmed) {
      return;
    }

    setError(null);
    setDeletingId(employee.id);
    try {
      await employeesApi.delete(employee.id);
      if (result && result.data.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        await loadEmployees(page, appliedFilters);
      }
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Failed to delete employee.',
      );
    } finally {
      setDeletingId(null);
    }
  }

  const totalPages = result?.totalPages ?? 1;
  const filtered = hasActiveFilters(appliedFilters);

  return (
    <section>
      <header className="page-header">
        <h1>Employees</h1>
        <p className="page-header__subtitle">
          {result
            ? `${result.total.toLocaleString()} employees${filtered ? ' matching filters' : ' total'}`
            : 'Employee directory'}
        </p>
      </header>

      <form className="insights-filters" onSubmit={handleApplyFilters}>
        <label className="field">
          Country
          <CountrySelect
            value={filters.country}
            onChange={(value) => updateFilter('country', value)}
            includeAll
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

      <EmployeeForm onCreated={() => void handleEmployeeCreated()} />

      {loading && <Loading label="Loading employees…" />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && result?.data.length === 0 && (
        <EmptyState
          title={filtered ? 'No employees match' : 'No employees yet'}
          description={
            filtered
              ? `No employees found for ${describeFilters(appliedFilters)}.`
              : 'Add an employee using the form above.'
          }
        />
      )}
      {!loading && !error && result && result.data.length > 0 && (
        <>
          <EmployeeTable
            employees={result.data}
            onEdit={setEditingEmployee}
            onDelete={(employee) => void handleDelete(employee)}
            deletingId={deletingId}
          />
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

      {editingEmployee && (
        <EditEmployeeModal
          employee={editingEmployee}
          onClose={() => setEditingEmployee(null)}
          onUpdated={() => void loadEmployees(page, appliedFilters)}
        />
      )}
    </section>
  );
}
