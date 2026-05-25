'use client';

import { FormEvent, useState } from 'react';
import { CountrySelect } from '@/components/CountrySelect';
import { SalaryInput } from '@/components/SalaryInput';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { DEFAULT_COUNTRY } from '@/constants/countries';
import { employeesApi } from '@/lib/api/employees';
import { ApiError } from '@/lib/errors';
import type { CreateEmployeeInput } from '@/types/employee';

type EmployeeFormProps = {
  onCreated: () => void;
};

const initialForm = {
  fullName: '',
  email: '',
  jobTitle: '',
  department: '',
  country: DEFAULT_COUNTRY,
  salary: '',
  joiningDate: '',
};

export function EmployeeForm({ onCreated }: EmployeeFormProps) {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function updateField(field: keyof typeof initialForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (
      !form.fullName.trim() ||
      !form.email.trim() ||
      !form.jobTitle.trim() ||
      !form.country.trim() ||
      !form.salary.trim() ||
      !form.joiningDate
    ) {
      setError('Please fill in all required fields.');
      return;
    }

    const salary = Number(form.salary);
    if (Number.isNaN(salary) || salary < 0) {
      setError('Salary must be a valid number.');
      return;
    }

    const body: CreateEmployeeInput = {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      jobTitle: form.jobTitle.trim(),
      country: form.country.trim(),
      salary,
      joiningDate: form.joiningDate,
      ...(form.department.trim()
        ? { department: form.department.trim() }
        : {}),
    };

    setSubmitting(true);
    try {
      await employeesApi.create(body);
      setForm(initialForm);
      setSuccess('Employee added successfully.');
      onCreated();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Failed to add employee.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="employee-form" onSubmit={handleSubmit}>
      <h2 className="employee-form__title">Add employee</h2>

      <div className="employee-form__grid">
        <label className="field">
          Full name *
          <input
            value={form.fullName}
            onChange={(e) => updateField('fullName', e.target.value)}
            disabled={submitting}
          />
        </label>
        <label className="field">
          Email *
          <input
            type="email"
            value={form.email}
            onChange={(e) => updateField('email', e.target.value)}
            disabled={submitting}
          />
        </label>
        <label className="field">
          Job title *
          <input
            value={form.jobTitle}
            onChange={(e) => updateField('jobTitle', e.target.value)}
            disabled={submitting}
          />
        </label>
        <label className="field">
          Department
          <input
            value={form.department}
            onChange={(e) => updateField('department', e.target.value)}
            disabled={submitting}
          />
        </label>
        <label className="field">
          Country *
          <CountrySelect
            value={form.country}
            onChange={(value) => updateField('country', value)}
            disabled={submitting}
          />
        </label>
        <label className="field">
          Salary *
          <SalaryInput
            value={form.salary}
            onChange={(value) => updateField('salary', value)}
            disabled={submitting}
          />
        </label>
        <label className="field">
          Joining date *
          <input
            type="date"
            value={form.joiningDate}
            onChange={(e) => updateField('joiningDate', e.target.value)}
            disabled={submitting}
          />
        </label>
      </div>

      {error && <ErrorMessage message={error} />}
      {success && <p className="form-success">{success}</p>}

      <button type="submit" className="button button--primary" disabled={submitting}>
        {submitting ? 'Adding…' : 'Add employee'}
      </button>
    </form>
  );
}
