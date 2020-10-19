import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class createPasswordRecoveryTokens1603123500888 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<void> {
		queryRunner.createTable(new Table({
			name: "password_recovery_tokens",
			columns: [
				{
					name: "id",
					type: "integer",
					unsigned: true,
					isPrimary: true,
					isGenerated: true,
					generationStrategy: "increment"
				},
				{
					name: "token",
					type: "varchar"
				}
			]
		}))
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		queryRunner.dropTable("password_recovery_tokens")
	}

}
