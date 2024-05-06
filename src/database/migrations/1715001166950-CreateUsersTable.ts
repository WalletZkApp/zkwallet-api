import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersTable1715001166950 implements MigrationInterface {
    name = 'CreateUsersTable1715001166950'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_6f0c85ebf9fb0a29baf1d0ad7d9"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_114be9f76935da356b2870d3dd9"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "keyId"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "otpKeyId"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "sharedkeysId" uuid`);
        await queryRunner.query(`ALTER TABLE "user" ADD "sharedOtpsId" uuid`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_e846fe5ec997fad48eacea7a5c9" FOREIGN KEY ("sharedkeysId") REFERENCES "key"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_ca835c87541714929ccedd1394c" FOREIGN KEY ("sharedOtpsId") REFERENCES "key"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_ca835c87541714929ccedd1394c"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_e846fe5ec997fad48eacea7a5c9"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "sharedOtpsId"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "sharedkeysId"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "otpKeyId" uuid`);
        await queryRunner.query(`ALTER TABLE "user" ADD "keyId" uuid`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_114be9f76935da356b2870d3dd9" FOREIGN KEY ("keyId") REFERENCES "key"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_6f0c85ebf9fb0a29baf1d0ad7d9" FOREIGN KEY ("otpKeyId") REFERENCES "key"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
