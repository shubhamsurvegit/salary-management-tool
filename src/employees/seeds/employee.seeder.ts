import { DataSource } from 'typeorm';
import { Employee } from '../entities/employee.entity';
import {
  buildEmployeeSeedRecords,
  EMPLOYEE_SEED_BATCH_SIZE,
  EMPLOYEE_SEED_COUNT,
} from './employee.seed-data';

export class EmployeeSeeder {
  constructor(private readonly dataSource: DataSource) {}

  async run(
    totalRecords = EMPLOYEE_SEED_COUNT,
    batchSize = EMPLOYEE_SEED_BATCH_SIZE,
  ): Promise<void> {
    const repository = this.dataSource.getRepository(Employee);

    console.log('Deleting existing employees...');
    await repository.clear();

    console.log(
      `Inserting ${totalRecords} employees in batches of ${batchSize}...`,
    );

    for (let offset = 0; offset < totalRecords; offset += batchSize) {
      const currentBatchSize = Math.min(batchSize, totalRecords - offset);
      const batch = buildEmployeeSeedRecords(offset, currentBatchSize);

      await repository.insert(batch);

      console.log(`Inserted ${offset + currentBatchSize}/${totalRecords}`);
    }

    console.log('Employee seed completed.');
  }
}
