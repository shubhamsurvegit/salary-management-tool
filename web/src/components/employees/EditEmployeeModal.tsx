'use client';

import { FormEvent, useState } from 'react';
import { CountrySelect } from '@/components/CountrySelect';
import { SalaryInput } from '@/components/SalaryInput';
import { Modal } from '@/components/ui/Modal';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { employeesApi } from '@/lib/api/employees';
import { ApiError } from '@/lib/errors';
import type { Employee } from '@/types/employee';

type EditEmployeeModalProps = {
  employee: Employee;
  onClose: () => void;
  onUpdated: () => void;
};

function toDateInputValue(date: string): string {
  return date.slice(0, 10);
}

export function EditEmployeeModal({
  employee,
  onClose,
  onUpdated,
}: EditEmployeeModalProps) {
  const [form, setForm] = useState({
    fullName: employee.fullName,
    email: employee.email,
    jobTitle: employee.jobTitle,
    department: employee.department ?? '',
    country: employee.country,
    salary: String(employee.salary),
    joiningDate: toDateInputValue(employee.joiningDate),
    isActive: employee.isActive,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const salary = Number(form.salary);
    if (Number.isNaN(salary) || salary < 0) {
      setError('Salary must be a valid number.');
      return;
    }

    setSubmitting(true);
    try {
      await employeesApi.update(employee.id, {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        jobTitle: form.jobTitle.trim(),
        country: form.country.trim(),
        salary,
        joiningDate: form.joiningDate,
        department: form.department.trim() || null,
        isActive: form.isActive,
      });
      onUpdated();
      onClose();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Failed to update employee.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal title="Edit employee" onClose={onClose}>
      <form className="employee-form employee-form--modal" onSubmit={handleSubmit}>
        <div className="employee-form__grid">
          <label className="field">
            Full name
            <input
              value={form.fullName}
              onChange={(e) =>
                setForm((current) => ({ ...current, fullName: e.target.value }))
              }
              disabled={submitting}
            />
          </label>
          <label className="field">
            Email
            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((current) => ({ ...current, email: e.target.value }))
              }
              disabled={submitting}
            />
          </label>
          <label className="field">
            Job title
            <input
              value={form.jobTitle}
              onChange={(e) =>
                setForm((current) => ({ ...current, jobTitle: e.target.value }))
              }
              disabled={submitting}
            />
          </label>
          <label className="field">
            Department
            <input
              value={form.department}
              onChange={(e) =>
                setForm((current) => ({
                  ...current,
                  department: e.target.value,
                }))
              }
              disabled={submitting}
            />
          </label>
          <label className="field">
            Country
            <CountrySelect
              value={form.country}
              onChange={(value) =>
                setForm((current) => ({ ...current, country: value }))
              }
              disabled={submitting}
            />
          </label>
          <label className="field">
            Salary
            <SalaryInput
              value={form.salary}
              onChange={(value) =>
                setForm((current) => ({ ...current, salary: value }))
              }
              currency={employee.currency}
              disabled={submitting}
            />
          </label>
          <label className="field">
            Joining date
            <input
              type="date"
              value={form.joiningDate}
              onChange={(e) =>
                setForm((current) => ({
                  ...current,
                  joiningDate: e.target.value,
                }))
              }
              disabled={submitting}
            />
          </label>
          <label className="field field--checkbox">
            <span>Status</span>
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) =>
                setForm((current) => ({
                  ...current,
                  isActive: e.target.checked,
                }))
              }
              disabled={submitting}
            />
            Active
          </label>
        </div>

        {error && <ErrorMessage message={error} />}

        <div className="modal__actions">
          <button type="button" className="button" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button type="submit" className="button button--primary" disabled={submitting}>
            {submitting ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
