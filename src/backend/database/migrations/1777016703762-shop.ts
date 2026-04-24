import { Table, type MigrationInterface, type QueryRunner } from "typeorm";

export class Shop1777016703762 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        // ============================================================
        // stocks
        // ============================================================

        await queryRunner.createTable(new Table({
            name: "stocks",
            columns: [
                {
                    name: "product_key",
                    type: "varchar",
                    length: "50",
                    isPrimary: true,
                    isNullable: false,
                },
                {
                    name: "game_id",
                    type: "bigint",
                    isNullable: true,
                },
                {
                    name: "is_sold",
                    type: "boolean",
                    default: false,
                },
            ],
            foreignKeys: [
                {
                    name: "fk_stocks_game",
                    columnNames: ["game_id"],
                    referencedTableName: "games",
                    referencedColumnNames: ["id"],
                    onDelete: "CASCADE",
                },
            ],
        }), true);

        // ============================================================
        // bundles
        // ============================================================

        await queryRunner.createTable(new Table({
            name: "bundles",
            columns: [
                {
                    name: "id",
                    type: "bigint",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "name",
                    type: "varchar",
                    length: "255",
                    isNullable: false,
                },
                {
                    name: "price",
                    type: "numeric",
                    precision: 10,
                    scale: 2,
                    isNullable: false,
                },
            ],
            checks: [
                { name: "bundle_name_not_empty", expression: `LENGTH(TRIM(name)) > 0` },
                { name: "bundle_price_non_negative", expression: `price >= 0` },
            ],
        }), true);

        await queryRunner.createTable(new Table({
            name: "bundle_games",
            columns: [
                {
                    name: "game_id",
                    type: "bigint",
                    isNullable: false,
                },
                {
                    name: "bundle_id",
                    type: "bigint",
                    isNullable: false,
                },
            ],
            indices: [
                { columnNames: ["game_id", "bundle_id"], isUnique: true },
            ],
            foreignKeys: [
                {
                    name: "fk_bundle_games_game",
                    columnNames: ["game_id"],
                    referencedTableName: "games",
                    referencedColumnNames: ["id"],
                    onDelete: "CASCADE",
                },
                {
                    name: "fk_bundle_games_bundle",
                    columnNames: ["bundle_id"],
                    referencedTableName: "bundles",
                    referencedColumnNames: ["id"],
                    onDelete: "CASCADE",
                },
            ],
        }), true);

        // ============================================================
        // carts
        // ============================================================

        await queryRunner.createTable(new Table({
            name: "carts",
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true,
                    default: "gen_random_uuid()",
                },
                {
                    name: "is_reserved",
                    type: "boolean",
                    default: false,
                },
                {
                    name: "transaction_status",
                    type: "varchar",
                    length: "10",
                    isNullable: true,
                },
                {
                    name: "reserved_at",
                    type: "timestamptz",
                    isNullable: true,
                },
            ],
            checks: [
                {
                    name: "transaction_status_valid",
                    expression: `transaction_status IN ('pending', 'completed') OR transaction_status IS NULL`,
                },
            ],
        }), true);

        await queryRunner.createTable(new Table({
            name: "cart_items",
            columns: [
                {
                    name: "cart_id",
                    type: "uuid",
                    isNullable: false,
                },
                {
                    name: "game_id",
                    type: "bigint",
                    isNullable: false,
                },
                {
                    name: "quantity",
                    type: "int",
                    default: 1,
                },
                {
                    name: "to_buy",
                    type: "boolean",
                    default: true,
                },
                {
                    name: "added_at",
                    type: "timestamptz",
                    default: "NOW()",
                },
            ],
            indices: [
                { columnNames: ["cart_id", "game_id"], isUnique: true },
            ],
            foreignKeys: [
                {
                    name: "fk_cart_items_cart",
                    columnNames: ["cart_id"],
                    referencedTableName: "carts",
                    referencedColumnNames: ["id"],
                    onDelete: "CASCADE",
                },
                {
                    name: "fk_cart_items_game",
                    columnNames: ["game_id"],
                    referencedTableName: "games",
                    referencedColumnNames: ["id"],
                    onDelete: "CASCADE",
                },
            ],
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("cart_items");
        await queryRunner.dropTable("carts");
        await queryRunner.dropTable("bundle_games");
        await queryRunner.dropTable("bundles");
        await queryRunner.dropTable("stocks");
    }

}
