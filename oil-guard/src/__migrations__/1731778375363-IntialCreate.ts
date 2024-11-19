import { MigrationInterface, QueryRunner } from "typeorm";

export class IntialCreate1731778375363 implements MigrationInterface {
  name = "IntialCreate1731778375363";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "pipeline" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "name" character varying NOT NULL, "status" character varying NOT NULL, "lastInspectionDate" TIMESTAMP NOT NULL, "pipeLineAge" integer NOT NULL, CONSTRAINT "PK_df8aedd50509192d995535d68cd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sensor" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "latitude" character varying NOT NULL, "longitude" character varying NOT NULL, "online" boolean NOT NULL DEFAULT false, "pipelineId" integer, CONSTRAINT "PK_ccc38b9aa8b3e198b6503d5eee9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sensor_data" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "avgInflow" integer NOT NULL, "avgOutflow" integer NOT NULL, "pressure" numeric NOT NULL, "flowRate" numeric NOT NULL, "vibration" numeric NOT NULL, "temperature" numeric NOT NULL, "humidity" numeric NOT NULL, "precipitation" numeric NOT NULL, "timestamp" TIMESTAMP NOT NULL, "sensorId" integer, CONSTRAINT "PK_1c0b5610a1a0f690d40239d408d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "names" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" character varying NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "reports" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "description" text NOT NULL, "status" character varying NOT NULL, "userId" integer, "pipelineId" integer, CONSTRAINT "PK_d9013193989303580053c0b5ef6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "notifications" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "message" character varying NOT NULL, "isRead" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "anomaly" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "detectedAt" TIMESTAMP NOT NULL, "severity" character varying NOT NULL, "predictionModel" character varying NOT NULL, "status" character varying NOT NULL, "pipelineId" integer, CONSTRAINT "PK_77cff63e8e328eae7769c0b839e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "sensor" ADD CONSTRAINT "FK_f8a0dd1f9b73da31502a48c4b8b" FOREIGN KEY ("pipelineId") REFERENCES "pipeline"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sensor_data" ADD CONSTRAINT "FK_7644419e32b5c253d2bb101f086" FOREIGN KEY ("sensorId") REFERENCES "sensor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reports" ADD CONSTRAINT "FK_bed415cd29716cd707e9cb3c09c" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reports" ADD CONSTRAINT "FK_0b831dda4d290905d031969d292" FOREIGN KEY ("pipelineId") REFERENCES "pipeline"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "anomaly" ADD CONSTRAINT "FK_b15804728fb6e2c12ff281baabd" FOREIGN KEY ("pipelineId") REFERENCES "pipeline"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "anomaly" DROP CONSTRAINT "FK_b15804728fb6e2c12ff281baabd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reports" DROP CONSTRAINT "FK_0b831dda4d290905d031969d292"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reports" DROP CONSTRAINT "FK_bed415cd29716cd707e9cb3c09c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sensor_data" DROP CONSTRAINT "FK_7644419e32b5c253d2bb101f086"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sensor" DROP CONSTRAINT "FK_f8a0dd1f9b73da31502a48c4b8b"`,
    );
    await queryRunner.query(`DROP TABLE "anomaly"`);
    await queryRunner.query(`DROP TABLE "notifications"`);
    await queryRunner.query(`DROP TABLE "reports"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "sensor_data"`);
    await queryRunner.query(`DROP TABLE "sensor"`);
    await queryRunner.query(`DROP TABLE "pipeline"`);
  }
}
