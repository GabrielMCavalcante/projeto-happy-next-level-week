import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class createUsers1603118523146 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: "users",
      columns: [
        {
          name: "id",
          type: "varchar",
          unsigned: true,
          isPrimary: true,
          isGenerated: false
        },
        {
          name: "password_recovery_token_id",
          type: "integer",
          unsigned: true,
          isNullable: true
        },
        {
          name: "email",
          type: "varchar",
          isNullable: false
        },
        {
          name: "password",
          type: "varchar",
          isNullable: false
        }
      ],
      foreignKeys: [
        {
          name: "fk_password_recovery_token",
          columnNames: ["password_recovery_token_id"],
          referencedColumnNames: ["id"],
          referencedTableName: "password_recovery_tokens",
          onDelete: "CASCADE",
          onUpdate: "CASCADE"
        }
      ]
    }))
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("users")
  }

}
