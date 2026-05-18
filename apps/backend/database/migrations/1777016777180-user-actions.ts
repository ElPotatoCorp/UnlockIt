import { Table, type MigrationInterface, type QueryRunner } from "typeorm";

export class UserActions1777016777180 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        // ============================================================
        // tickets
        // ============================================================

        await queryRunner.query(`CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed')`);

        await queryRunner.createTable(new Table({
            name: "tickets",
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true,
                    default: "gen_random_uuid()",
                },
                {
                    name: "email",
                    type: "varchar",
                    length: "255",
                    isNullable: false,
                },
                {
                    name: "reason",
                    type: "varchar",
                    length: "255",
                    isNullable: false,
                },
                {
                    name: "content",
                    type: "text",
                    isNullable: false,
                },
                {
                    name: "status",
                    type: "ticket_status",
                    default: "'open'",
                },
                {
                    name: "created_at",
                    type: "timestamptz",
                    default: "NOW()",
                },
                {
                    name: "is_customer",
                    type: "boolean",
                    default: false,
                },
                {
                    name: "is_employee",
                    type: "boolean",
                    default: false,
                },
                {
                    name: "user_id",
                    type: "uuid",
                    isNullable: true,
                    default: null,
                },
            ],
            checks: [
                { name: "ticket_email_format", expression: `email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'` },
                { name: "ticket_reason_not_empty", expression: `LENGTH(TRIM(reason)) > 0` },
                { name: "ticket_content_not_empty", expression: `LENGTH(TRIM(content)) > 0` },
            ],
            foreignKeys: [
                {
                    name: "fk_tickets_user",
                    columnNames: ["user_id"],
                    referencedTableName: "users",
                    referencedColumnNames: ["id"],
                    onDelete: "SET NULL",
                },
            ],
        }), true);

        // ============================================================
        // wishlists
        // ============================================================

        await queryRunner.createTable(new Table({
            name: "wishlists",
            columns: [
                {
                    name: "user_id",
                    type: "uuid",
                    isNullable: false,
                },
                {
                    name: "game_id",
                    type: "bigint",
                    isNullable: false,
                },
                {
                    name: "added_at",
                    type: "timestamptz",
                    default: "NOW()",
                },
            ],
            indices: [
                { columnNames: ["user_id", "game_id"], isUnique: true },
            ],
            foreignKeys: [
                {
                    name: "fk_wishlists_user",
                    columnNames: ["user_id"],
                    referencedTableName: "users",
                    referencedColumnNames: ["id"],
                    onDelete: "CASCADE",
                },
                {
                    name: "fk_wishlists_game",
                    columnNames: ["game_id"],
                    referencedTableName: "games",
                    referencedColumnNames: ["id"],
                    onDelete: "CASCADE",
                },
            ],
        }), true);

        // ============================================================
        // reviews
        // ============================================================

        await queryRunner.createTable(new Table({
            name: "reviews",
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true,
                    default: "gen_random_uuid()",
                },
                {
                    name: "rating",
                    type: "smallint",
                    isNullable: false,
                },
                {
                    name: "content",
                    type: "text",
                    isNullable: true,
                },
                {
                    name: "creation_date",
                    type: "timestamptz",
                    default: "NOW()",
                },
                {
                    name: "user_id",
                    type: "uuid",
                    isNullable: false,
                },
                {
                    name: "game_id",
                    type: "bigint",
                    isNullable: false,
                },
                {
                    name: "helpful_count",
                    type: "int",
                    default: 0,
                },
                {
                    name: "not_helpful_count",
                    type: "int",
                    default: 0,
                },
            ],
            uniques: [
                { name: "uq_reviews_user_game", columnNames: ["user_id", "game_id"] },
            ],
            checks: [
                { name: "rating_valid", expression: `rating BETWEEN 0 AND 10` },
            ],
            foreignKeys: [
                {
                    name: "fk_reviews_user",
                    columnNames: ["user_id"],
                    referencedTableName: "users",
                    referencedColumnNames: ["id"],
                    onDelete: "CASCADE",
                },
                {
                    name: "fk_reviews_game",
                    columnNames: ["game_id"],
                    referencedTableName: "games",
                    referencedColumnNames: ["id"],
                    onDelete: "CASCADE",
                },
            ],
        }), true);

        // ============================================================
        // review_votes
        // ============================================================

        await queryRunner.createTable(new Table({
            name: "review_votes",
            columns: [
                {
                    name: "user_id",
                    type: "uuid",
                    isNullable: false,
                },
                {
                    name: "review_id",
                    type: "uuid",
                    isNullable: false,
                },
                {
                    name: "is_helpful",
                    type: "boolean",
                    isNullable: false,
                },
                {
                    name: "created_at",
                    type: "timestamptz",
                    default: "NOW()",
                },
            ],
            indices: [
                { columnNames: ["user_id", "review_id"], isUnique: true },
            ],
            foreignKeys: [
                {
                    name: "fk_review_votes_user",
                    columnNames: ["user_id"],
                    referencedTableName: "users",
                    referencedColumnNames: ["id"],
                    onDelete: "CASCADE",
                },
                {
                    name: "fk_review_votes_review",
                    columnNames: ["review_id"],
                    referencedTableName: "reviews",
                    referencedColumnNames: ["id"],
                    onDelete: "CASCADE",
                },
            ],
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("review_votes");
        await queryRunner.dropTable("reviews");
        await queryRunner.dropTable("wishlists");
        await queryRunner.dropTable("tickets");
        await queryRunner.query(`DROP TYPE IF EXISTS ticket_status`);
    }

}
