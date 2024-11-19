import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangingDataTypes1731932233636 implements MigrationInterface {
    name = 'ChangingDataTypes1731932233636'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sensor_data" DROP COLUMN "avgInflow"`);
        await queryRunner.query(`ALTER TABLE "sensor_data" ADD "avgInflow" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sensor_data" DROP COLUMN "avgOutflow"`);
        await queryRunner.query(`ALTER TABLE "sensor_data" ADD "avgOutflow" double precision NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sensor_data" DROP COLUMN "avgOutflow"`);
        await queryRunner.query(`ALTER TABLE "sensor_data" ADD "avgOutflow" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sensor_data" DROP COLUMN "avgInflow"`);
        await queryRunner.query(`ALTER TABLE "sensor_data" ADD "avgInflow" integer NOT NULL`);
    }

}
