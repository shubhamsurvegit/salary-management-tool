import type { Employee } from '@/types/employee';
import { TableShell } from '@/components/ui/TableShell';

type EmployeeTableProps = {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
};

function formatSalary(amount: number, currency: string): string {
  return `${currency} ${amount.toLocaleString()}`;
}

export function EmployeeTable({ employees, onEdit }: EmployeeTableProps) {
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
            <th />
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
              <td>
                <button
                  type="button"
                  className="button button--small"
                  onClick={() => onEdit(employee)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableShell>
  );
}
