import { Table, type MigrationInterface, type QueryRunner } from "typeorm";

export class Purchases1777016740761 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        // ============================================================
        // discounts
        // ============================================================

        await queryRunner.query(`CREATE TYPE discount_type   AS ENUM ('percentage', 'fixed')`);
        await queryRunner.query(`CREATE TYPE discount_target AS ENUM ('product', 'order')`);

        await queryRunner.createTable(new Table({
            name: "discounts",
            columns: [
                {
                    name: "id",
                    type: "bigint",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "code",
                    type: "varchar",
                    length: "50",
                    isNullable: true,
                },
                {
                    name: "amount",
                    type: "int",
                    isNullable: false,
                },
                {
                    name: "type",
                    type: "discount_type",
                    isNullable: false,
                },
                {
                    name: "condition",
                    type: "jsonb",
                    isNullable: true,
                },
                {
                    name: "target",
                    type: "discount_target",
                    isNullable: false,
                },
                {
                    name: "creation_date",
                    type: "date",
                    default: "NOW()",
                },
                {
                    name: "expiration_date",
                    type: "date",
                    default: "NOW()",
                },
            ],
            checks: [
                { name: "discount_amount_positive", expression: `amount > 0` },
                { name: "discount_amount_percentage_max", expression: `type != 'percentage' OR amount BETWEEN 0 AND 100` },
                { name: "discount_expiration_after_creation", expression: `expiration_date >= creation_date` },
            ],
        }), true);

        await queryRunner.query(`CREATE TYPE discount_scope AS ENUM ('public', 'private')`);

        await queryRunner.createTable(new Table({
            name: "game_discounts",
            columns: [
                {
                    name: "game_id",
                    type: "bigint",
                    isNullable: false,
                },
                {
                    name: "discount_id",
                    type: "bigint",
                    isNullable: false,
                },
                {
                    name: "scope",
                    type: "discount_scope",
                    default: "'private'",
                },
            ],
            indices: [
                { columnNames: ["game_id", "discount_id"], isUnique: true },
            ],
            foreignKeys: [
                {
                    name: "fk_game_discounts_game",
                    columnNames: ["game_id"],
                    referencedTableName: "games",
                    referencedColumnNames: ["id"],
                    onDelete: "CASCADE",
                },
                {
                    name: "fk_game_discounts_discount",
                    columnNames: ["discount_id"],
                    referencedTableName: "discounts",
                    referencedColumnNames: ["id"],
                    onDelete: "CASCADE",
                },
            ],
        }), true);

        // ============================================================
        // payment_methods
        // ============================================================

        await queryRunner.createTable(new Table({
            name: "payment_methods",
            columns: [
                {
                    name: "id",
                    type: "varchar",
                    length: "50",
                    isPrimary: true,
                    isNullable: false,
                },
                {
                    name: "type",
                    type: "varchar",
                    length: "255",
                    isNullable: false,
                },
                {
                    name: "created_at",
                    type: "timestamptz",
                    default: "NOW()",
                },
            ],
            checks: [
                { name: "pm_id_format", expression: `id ~* '^pm_.+'` },
            ],
        }), true);

        await queryRunner.createTable(new Table({
            name: "saved_payment_methods",
            columns: [
                {
                    name: "user_id",
                    type: "uuid",
                    isNullable: false,
                },
                {
                    name: "payment_method_id",
                    type: "varchar",
                    length: "50",
                    isNullable: false,
                },
            ],
            indices: [
                { columnNames: ["user_id", "payment_method_id"], isUnique: true },
            ],
            foreignKeys: [
                {
                    name: "fk_saved_pm_user",
                    columnNames: ["user_id"],
                    referencedTableName: "users",
                    referencedColumnNames: ["id"],
                    onDelete: "CASCADE",
                },
                {
                    name: "fk_saved_pm_payment_method",
                    columnNames: ["payment_method_id"],
                    referencedTableName: "payment_methods",
                    referencedColumnNames: ["id"],
                    onDelete: "CASCADE",
                },
            ],
        }), true);

        // ============================================================
        // purchases
        // ============================================================

        await queryRunner.createTable(new Table({
            name: "purchases",
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true,
                    default: "gen_random_uuid()",
                },
                {
                    name: "user_id",
                    type: "uuid",
                    isNullable: false,
                },
                {
                    name: "product_key",
                    type: "varchar",
                    length: "50",
                    isNullable: false,
                },
                {
                    name: "game_id",
                    type: "bigint",
                    isNullable: false,
                },
                {
                    name: "effective_price",
                    type: "numeric",
                    precision: 10,
                    scale: 2,
                    isNullable: false,
                },
                {
                    name: "discount_applied",
                    type: "varchar",
                    length: "50",
                    isNullable: true,
                },
                {
                    name: "payment_method_id",
                    type: "varchar",
                    length: "50",
                    isNullable: true,
                },
                {
                    name: "purchase_date",
                    type: "timestamptz",
                    default: "NOW()",
                },
            ],
            checks: [
                { name: "effective_price_non_negative", expression: `effective_price >= 0` },
            ],
            foreignKeys: [
                {
                    name: "fk_purchases_user",
                    columnNames: ["user_id"],
                    referencedTableName: "users",
                    referencedColumnNames: ["id"],
                    onDelete: "CASCADE",
                },
                {
                    name: "fk_purchases_stock",
                    columnNames: ["product_key"],
                    referencedTableName: "stocks",
                    referencedColumnNames: ["product_key"],
                    onDelete: "RESTRICT",
                },
                {
                    name: "fk_purchases_payment_method",
                    columnNames: ["payment_method_id"],
                    referencedTableName: "payment_methods",
                    referencedColumnNames: ["id"],
                    onDelete: "SET NULL",
                },
            ],
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("purchases");
        await queryRunner.dropTable("saved_payment_methods");
        await queryRunner.dropTable("payment_methods");
        await queryRunner.dropTable("game_discounts");
        await queryRunner.query(`DROP TYPE IF EXISTS discount_scope`);
        await queryRunner.dropTable("discounts");
        await queryRunner.query(`DROP TYPE IF EXISTS discount_target`);
        await queryRunner.query(`DROP TYPE IF EXISTS discount_type`);
    }

}
