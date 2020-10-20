import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class createOrphanages1602595494318 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: "orphanages",
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
          name: "name",
          type: "varchar",
          isNullable: false
        },
        {
          name: "latitude",
          type: "decimal",
          scale: 10,
          precision: 2,
          isNullable: false
        },
        {
          name: "longitude",
          type: "decimal",
          scale: 10,
          precision: 2,
          isNullable: false
        },
        {
          name: "about",
          type: "text",
          isNullable: false
        },
        {
          name: "instructions",
          type: "text",
          isNullable: false
        },
        {
          name: "open_on_weekends",
          type: "boolean",
          default: false
        },
        {
          name: "opening_hours",
          type: "varchar",
          isNullable: false
        },
        {
          name: "pending_approval",
          type: "boolean",
          default: true
        }
      ]
    }))
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("orphanages")
  }

}
