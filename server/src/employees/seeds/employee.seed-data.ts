import { faker } from '@faker-js/faker';

export const EMPLOYEE_SEED_COUNT = 10_000;
export const EMPLOYEE_SEED_BATCH_SIZE = 500;

const JOB_TITLES = [
  'Software Engineer',
  'Senior Software Engineer',
  'Product Manager',
  'Data Analyst',
  'HR Manager',
  'Finance Analyst',
  'DevOps Engineer',
  'QA Engineer',
  'UI/UX Designer',
  'Operations Manager',
];

const DEPARTMENTS = [
  'Engineering',
  'Product',
  'Human Resources',
  'Finance',
  'Operations',
  'Design',
  'Sales',
  'Marketing',
];

const COUNTRIES = [
  'India',
  'United States',
  'United Kingdom',
  'Germany',
  'Canada',
];

export type EmployeeSeedRecord = {
  fullName: string;
  email: string;
  jobTitle: string;
  department: string;
  country: string;
  currency: string;
  salary: number;
  joiningDate: string;
  isActive: boolean;
};

function identityForIndex(index: number): { fullName: string; email: string } {
  faker.seed(index);

  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const fullName = `${firstName} ${lastName}`;
  const emailLocal = `${slugify(firstName)}.${slugify(lastName)}${index}`;

  return {
    fullName,
    email: `${emailLocal}@example.com`,
  };
}

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function buildEmployeeSeedRecords(
  startIndex: number,
  count: number,
): EmployeeSeedRecord[] {
  const records: EmployeeSeedRecord[] = [];

  for (let i = 0; i < count; i++) {
    const index = startIndex + i + 1;
    const { fullName, email } = identityForIndex(index);

    records.push({
      fullName,
      email,
      jobTitle: JOB_TITLES[index % JOB_TITLES.length],
      department: DEPARTMENTS[index % DEPARTMENTS.length],
      country: COUNTRIES[index % COUNTRIES.length],
      currency: 'INR',
      salary: 300_000 + (index % 10) * 50_000,
      joiningDate: `2020-01-${String((index % 28) + 1).padStart(2, '0')}`,
      isActive: index % 10 !== 0,
    });
  }

  return records;
}
