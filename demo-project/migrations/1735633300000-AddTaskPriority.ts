import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTaskPriority1735633300000 implements MigrationInterface {
    name = 'AddTaskPriority1735633300000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" ADD "priority" character varying NOT NULL DEFAULT 'medium'`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "dueDate" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "dueDate"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "priority"`);
    }

}