import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangingDataTypes1731932078643 implements MigrationInterface {
  name = "ChangingDataTypes1731932078643";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "sensor_data" DROP COLUMN "pressure"`);
    await queryRunner.query(
      `ALTER TABLE "sensor_data" ADD "pressure" double precision NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "sensor_data" DROP COLUMN "flowRate"`);
    await queryRunner.query(
      `ALTER TABLE "sensor_data" ADD "flowRate" double precision NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sensor_data" DROP COLUMN "vibration"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sensor_data" ADD "vibration" double precision NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sensor_data" DROP COLUMN "temperature"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sensor_data" ADD "temperature" double precision NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "sensor_data" DROP COLUMN "humidity"`);
    await queryRunner.query(
      `ALTER TABLE "sensor_data" ADD "humidity" double precision NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sensor_data" DROP COLUMN "precipitation"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sensor_data" ADD "precipitation" double precision NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sensor_data" DROP COLUMN "precipitation"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sensor_data" ADD "precipitation" numeric NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "sensor_data" DROP COLUMN "humidity"`);
    await queryRunner.query(
      `ALTER TABLE "sensor_data" ADD "humidity" numeric NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sensor_data" DROP COLUMN "temperature"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sensor_data" ADD "temperature" numeric NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sensor_data" DROP COLUMN "vibration"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sensor_data" ADD "vibration" numeric NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "sensor_data" DROP COLUMN "flowRate"`);
    await queryRunner.query(
      `ALTER TABLE "sensor_data" ADD "flowRate" numeric NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "sensor_data" DROP COLUMN "pressure"`);
    await queryRunner.query(
      `ALTER TABLE "sensor_data" ADD "pressure" numeric NOT NULL`,
    );
  }
}
