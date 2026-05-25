import type { Employee } from '@/types/employee';
import { TableShell } from '@/components/ui/TableShell';

type EmployeeTableProps = {
  employees: Employee[];
};

function formatSalary(amount: number, currency: string): string {
  return `${currency} ${amount.toLocaleString()}`;
}

export function EmployeeTable({ employees }: EmployeeTableProps) {
  return (
    <TableShell>
      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Job title</th>
            <th>Country</th>
            <th>Department</th>
            <th>Salary</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.fullName}</td>
              <td>{employee.jobTitle}</td>
              <td>{employee.country}</td>
              <td>{employee.department ?? '—'}</td>
              <td>{formatSalary(employee.salary, employee.currency)}</td>
              <td>{employee.isActive ? 'Active' : 'Inactive'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableShell>
  );
}
