import { Table, TableForeignKey, TableIndex, type MigrationInterface, type QueryRunner } from "typeorm";

export class Games1777012443094 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        // ============================================================
        // series
        // ============================================================

        await queryRunner.createTable(new Table({
            name: "series",
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
                    name: "slug",
                    type: "varchar",
                    length: "255",
                    isNullable: false,
                    isUnique: true,
                },
            ],
            checks: [
                { name: "series_name_not_empty", expression: `LENGTH(TRIM(name)) > 0` },
            ],
        }), true);

        // ============================================================
        // games
        // ============================================================

        await queryRunner.createTable(new Table({
            name: "games",
            columns: [
                {
                    name: "id",
                    type: "bigint",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "slug",
                    type: "varchar",
                    length: "255",
                    isNullable: false,
                },
                {
                    name: "name",
                    type: "varchar",
                    length: "255",
                    isNullable: false,
                },
                {
                    name: "type",
                    type: "varchar",
                    length: "50",
                    isNullable: true,
                },
                {
                    name: "price",
                    type: "numeric",
                    precision: 10,
                    scale: 2,
                    isNullable: false,
                },
                {
                    name: "age_rating",
                    type: "varchar",
                    length: "32",
                    isNullable: true,
                },
                {
                    name: "release_date",
                    type: "date",
                    isNullable: true,
                },
                {
                    name: "coming_soon",
                    type: "boolean",
                    default: false,
                },
                {
                    name: "header_image",
                    type: "varchar",
                    length: "255",
                    isNullable: true,
                },
                {
                    name: "cover_image",
                    type: "varchar",
                    length: "255",
                    isNullable: true,
                },
                {
                    name: "background_image",
                    type: "varchar",
                    length: "255",
                    isNullable: true,
                },
                {
                    name: "short_description",
                    type: "text",
                    isNullable: true,
                },
                {
                    name: "detailed_description",
                    type: "text",
                    isNullable: true,
                },
                {
                    name: "metacritic_score",
                    type: "smallint",
                    isNullable: true,
                },
                {
                    name: "website",
                    type: "varchar",
                    length: "255",
                    isNullable: true,
                },
                {
                    name: "pc_requirements",
                    type: "text",
                    isNullable: true,
                },
                {
                    name: "supported_languages",
                    type: "text[]",
                    isNullable: true,
                },
                {
                    name: "series_id",
                    type: "bigint",
                    isNullable: true,
                },
            ],
            checks: [
                { name: "price_non_negative", expression: `price >= 0` },
                { name: "metacritic_valid", expression: `metacritic_score BETWEEN 0 AND 100 OR metacritic_score IS NULL` },
            ],
            foreignKeys: [
                {
                    name: "fk_games_series",
                    columnNames: ["series_id"],
                    referencedTableName: "series",
                    referencedColumnNames: ["id"],
                    onDelete: "SET NULL",
                },
            ],
        }), true);

        await queryRunner.createIndex("games", new TableIndex({
            name: "idx_games_slug",
            columnNames: ["slug"],
        }));

        // ============================================================
        // tags
        // ============================================================

        await queryRunner.createTable(new Table({
            name: "tags",
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
                    length: "150",
                    isNullable: false,
                    isUnique: true,
                },
                {
                    name: "games_count",
                    type: "int",
                    default: 0,
                },
            ],
            checks: [
                { name: "tag_name_not_empty", expression: `LENGTH(TRIM(name)) > 0` },
            ],
        }), true);

        await queryRunner.createTable(new Table({
            name: "game_tags",
            columns: [
                {
                    name: "game_id",
                    type: "bigint",
                    isNullable: false,
                },
                {
                    name: "tag_id",
                    type: "bigint",
                    isNullable: false,
                },
            ],
            indices: [
                { columnNames: ["game_id", "tag_id"], isUnique: true },
            ],
            foreignKeys: [
                {
                    name: "fk_game_tags_game",
                    columnNames: ["game_id"],
                    referencedTableName: "games",
                    referencedColumnNames: ["id"],
                    onDelete: "CASCADE",
                },
                {
                    name: "fk_game_tags_tag",
                    columnNames: ["tag_id"],
                    referencedTableName: "tags",
                    referencedColumnNames: ["id"],
                    onDelete: "CASCADE",
                },
            ],
        }), true);

        // ============================================================
        // game_platforms
        // ============================================================

        await queryRunner.createTable(new Table({
            name: "game_platforms",
            columns: [
                {
                    name: "game_id",
                    type: "bigint",
                    isPrimary: true,
                    isNullable: false,
                },
                { name: "windows", type: "boolean", default: false },
                { name: "mac", type: "boolean", default: false },
                { name: "linux", type: "boolean", default: false },
                { name: "ios", type: "boolean", default: false },
                { name: "android", type: "boolean", default: false },
                { name: "switch", type: "boolean", default: false },
                { name: "ps4", type: "boolean", default: false },
                { name: "ps5", type: "boolean", default: false },
                { name: "xbox_one", type: "boolean", default: false },
                { name: "xbox_series", type: "boolean", default: false },
            ],
            foreignKeys: [
                {
                    name: "fk_game_platforms_game",
                    columnNames: ["game_id"],
                    referencedTableName: "games",
                    referencedColumnNames: ["id"],
                    onDelete: "CASCADE",
                },
            ],
        }), true);

        // ============================================================
        // developers
        // ============================================================

        await queryRunner.createTable(new Table({
            name: "developers",
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
                    length: "200",
                    isNullable: false,
                    isUnique: true,
                },
                {
                    name: "games_count",
                    type: "int",
                    default: 0,
                },
            ],
            checks: [
                { name: "developer_name_not_empty", expression: `LENGTH(TRIM(name)) > 0` },
            ],
        }), true);

        await queryRunner.createTable(new Table({
            name: "game_developers",
            columns: [
                {
                    name: "game_id",
                    type: "bigint",
                    isNullable: false,
                },
                {
                    name: "developer_id",
                    type: "bigint",
                    isNullable: false,
                },
            ],
            indices: [
                { columnNames: ["game_id", "developer_id"], isUnique: true },
            ],
            foreignKeys: [
                {
                    name: "fk_game_developers_game",
                    columnNames: ["game_id"],
                    referencedTableName: "games",
                    referencedColumnNames: ["id"],
                    onDelete: "CASCADE",
                },
                {
                    name: "fk_game_developers_developer",
                    columnNames: ["developer_id"],
                    referencedTableName: "developers",
                    referencedColumnNames: ["id"],
                    onDelete: "CASCADE",
                },
            ],
        }), true);

        // ============================================================
        // publishers
        // ============================================================

        await queryRunner.createTable(new Table({
            name: "publishers",
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
                    length: "200",
                    isNullable: false,
                    isUnique: true,
                },
                {
                    name: "games_count",
                    type: "int",
                    default: 0,
                },
            ],
            checks: [
                { name: "publisher_name_not_empty", expression: `LENGTH(TRIM(name)) > 0` },
            ],
        }), true);

        await queryRunner.createTable(new Table({
            name: "game_publishers",
            columns: [
                {
                    name: "game_id",
                    type: "bigint",
                    isNullable: false,
                },
                {
                    name: "publisher_id",
                    type: "bigint",
                    isNullable: false,
                },
            ],
            indices: [
                { columnNames: ["game_id", "publisher_id"], isUnique: true },
            ],
            foreignKeys: [
                {
                    name: "fk_game_publishers_game",
                    columnNames: ["game_id"],
                    referencedTableName: "games",
                    referencedColumnNames: ["id"],
                    onDelete: "CASCADE",
                },
                {
                    name: "fk_game_publishers_publisher",
                    columnNames: ["publisher_id"],
                    referencedTableName: "publishers",
                    referencedColumnNames: ["id"],
                    onDelete: "CASCADE",
                },
            ],
        }), true);

        // ============================================================
        // media
        // ============================================================

        await queryRunner.query(`CREATE TYPE media_type AS ENUM ('video', 'image')`);

        await queryRunner.createTable(new Table({
            name: "media",
            columns: [
                {
                    name: "id",
                    type: "bigint",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "game_id",
                    type: "bigint",
                    isNullable: false,
                },
                {
                    name: "url",
                    type: "varchar",
                    length: "255",
                    isNullable: false,
                },
                {
                    name: "type",
                    type: "media_type",
                    isNullable: true,
                },
            ],
            checks: [
                { name: "url_format", expression: `url ~* '^(http|https)://'` },
            ],
            foreignKeys: [
                {
                    name: "fk_media_game",
                    columnNames: ["game_id"],
                    referencedTableName: "games",
                    referencedColumnNames: ["id"],
                    onDelete: "CASCADE",
                },
            ],
        }), true);

        // ============================================================
        // triggers — games_count counters
        // ============================================================

        await queryRunner.query(`
            CREATE OR REPLACE FUNCTION update_tag_games_count()
                RETURNS TRIGGER
                LANGUAGE plpgsql
            AS $trigger$
            BEGIN
                IF (TG_OP = 'INSERT') THEN
                    UPDATE tags SET games_count = games_count + 1 WHERE id = NEW.tag_id;
                    RETURN NEW;
                ELSIF (TG_OP = 'DELETE') THEN
                    UPDATE tags SET games_count = games_count - 1 WHERE id = OLD.tag_id;
                    RETURN OLD;
                END IF;
                RETURN NULL;
            END;
            $trigger$
        `);

        await queryRunner.query(`
            CREATE TRIGGER trigger_tag_game_added
                AFTER INSERT ON game_tags
                FOR EACH ROW EXECUTE FUNCTION update_tag_games_count()
        `);

        await queryRunner.query(`
            CREATE TRIGGER trigger_tag_game_removed
                AFTER DELETE ON game_tags
                FOR EACH ROW EXECUTE FUNCTION update_tag_games_count()
        `);

        await queryRunner.query(`
            CREATE OR REPLACE FUNCTION update_developer_games_count()
                RETURNS TRIGGER
                LANGUAGE plpgsql
            AS $trigger$
            BEGIN
                IF (TG_OP = 'INSERT') THEN
                    UPDATE developers SET games_count = games_count + 1 WHERE id = NEW.developer_id;
                    RETURN NEW;
                ELSIF (TG_OP = 'DELETE') THEN
                    UPDATE developers SET games_count = games_count - 1 WHERE id = OLD.developer_id;
                    RETURN OLD;
                END IF;
                RETURN NULL;
            END;
            $trigger$
        `);

        await queryRunner.query(`
            CREATE TRIGGER trigger_developer_game_added
                AFTER INSERT ON game_developers
                FOR EACH ROW EXECUTE FUNCTION update_developer_games_count()
        `);

        await queryRunner.query(`
            CREATE TRIGGER trigger_developer_game_removed
                AFTER DELETE ON game_developers
                FOR EACH ROW EXECUTE FUNCTION update_developer_games_count()
        `);

        await queryRunner.query(`
            CREATE OR REPLACE FUNCTION update_publisher_games_count()
                RETURNS TRIGGER
                LANGUAGE plpgsql
            AS $trigger$
            BEGIN
                IF (TG_OP = 'INSERT') THEN
                    UPDATE publishers SET games_count = games_count + 1 WHERE id = NEW.publisher_id;
                    RETURN NEW;
                ELSIF (TG_OP = 'DELETE') THEN
                    UPDATE publishers SET games_count = games_count - 1 WHERE id = OLD.publisher_id;
                    RETURN OLD;
                END IF;
                RETURN NULL;
            END;
            $trigger$
        `);

        await queryRunner.query(`
            CREATE TRIGGER trigger_publisher_game_added
                AFTER INSERT ON game_publishers
                FOR EACH ROW EXECUTE FUNCTION update_publisher_games_count()
        `);

        await queryRunner.query(`
            CREATE TRIGGER trigger_publisher_game_removed
                AFTER DELETE ON game_publishers
                FOR EACH ROW EXECUTE FUNCTION update_publisher_games_count()
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        // triggers and functions — must drop before their tables
        await queryRunner.query(`DROP TRIGGER IF EXISTS trigger_publisher_game_removed ON game_publishers`);
        await queryRunner.query(`DROP TRIGGER IF EXISTS trigger_publisher_game_added  ON game_publishers`);
        await queryRunner.query(`DROP FUNCTION IF EXISTS update_publisher_games_count`);

        await queryRunner.query(`DROP TRIGGER IF EXISTS trigger_developer_game_removed ON game_developers`);
        await queryRunner.query(`DROP TRIGGER IF EXISTS trigger_developer_game_added   ON game_developers`);
        await queryRunner.query(`DROP FUNCTION IF EXISTS update_developer_games_count`);

        await queryRunner.query(`DROP TRIGGER IF EXISTS trigger_tag_game_removed ON game_tags`);
        await queryRunner.query(`DROP TRIGGER IF EXISTS trigger_tag_game_added   ON game_tags`);
        await queryRunner.query(`DROP FUNCTION IF EXISTS update_tag_games_count`);

        // tables — reverse dependency order
        await queryRunner.dropTable("media");
        await queryRunner.query(`DROP TYPE IF EXISTS media_type`);
        await queryRunner.dropTable("game_publishers");
        await queryRunner.dropTable("publishers");
        await queryRunner.dropTable("game_developers");
        await queryRunner.dropTable("developers");
        await queryRunner.dropTable("game_platforms");
        await queryRunner.dropTable("game_tags");
        await queryRunner.dropTable("tags");
        await queryRunner.dropTable("games");
        await queryRunner.dropTable("series");
    }

}
