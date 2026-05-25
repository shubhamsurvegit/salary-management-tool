import dataSource from '../data-source';
import { EmployeeSeeder } from '../employees/seeds/employee.seeder';

async function main(): Promise<void> {
  await dataSource.initialize();

  try {
    await new EmployeeSeeder(dataSource).run();
  } finally {
    await dataSource.destroy();
  }
}

main().catch((error: unknown) => {
  console.error('Employee seed failed:', error);
  process.exit(1);
});
