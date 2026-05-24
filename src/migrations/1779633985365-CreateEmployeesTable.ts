import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEmployeesTable1779633985365 implements MigrationInterface {
  name = 'CreateEmployeesTable1779633985365';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "employees" (
        "id" SERIAL NOT NULL,
        "full_name" character varying NOT NULL,
        "email" character varying NOT NULL,
        "job_title" character varying NOT NULL,
        "department" character varying,
        "country" character varying NOT NULL,
        "currency" character varying(3) NOT NULL DEFAULT 'INR',
        "salary" numeric(12,2) NOT NULL,
        "joining_date" date NOT NULL,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_765bc1ac8967533a04c74a9f6af" UNIQUE ("email"),
        CONSTRAINT "PK_b9535a98350d5b26e7eb0c26af4" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "employees"`);
  }
}
