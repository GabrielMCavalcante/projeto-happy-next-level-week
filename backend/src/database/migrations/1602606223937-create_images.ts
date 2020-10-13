import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class createImages1602606223937 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "orphanages_images",
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
                    name: "orphanage_id",
                    type: "integer",
                    isNullable: false
                },
                {
                    name: "path",
                    type: "varchar",
                    isNullable: false
                }
            ],
            foreignKeys: [
                {
                    name: "ImageOrphanage",
                    referencedTableName: "orphanages",
                    referencedColumnNames: ["id"],
                    columnNames: ["orphanage_id"],
                    onDelete: "CASCADE",
                    onUpdate: "CASCADE"
                }
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("orphanages_images")
    }

}
