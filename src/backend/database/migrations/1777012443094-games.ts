import { Table, TableForeignKey, TableIndex, type MigrationInterface, type QueryRunner } from "typeorm";

export class Games1777012443094 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        // ============================================================
        // Enum types
        // ============================================================

        await queryRunner.query(`CREATE TYPE game_type AS ENUM ('game', 'dlc', 'ost')`);
        await queryRunner.query(`CREATE TYPE game_platform AS ENUM ('windows', 'mac', 'linux', 'ios', 'android', 'switch', 'ps4', 'ps5', 'xbox_one', 'xbox_series')`);
        await queryRunner.query(`CREATE TYPE eu_age_rating AS ENUM ('3', '7', '12', '16', '18')`);
        await queryRunner.query(`
            -- Lang ISO 639-1
            CREATE TYPE lang_code AS ENUM (
                'aa',
                'ab',
                'ae',
                'af',
                'ak',
                'am',
                'an',
                'ar',
                'as',
                'av',
                'ay',
                'az',
                'ba',
                'be',
                'bg',
                'bi',
                'bm',
                'bn',
                'bo',
                'br',
                'bs',
                'ca',
                'ce',
                'ch',
                'co',
                'cr',
                'cs',
                'cu',
                'cv',
                'cy',
                'da',
                'de',
                'dv',
                'dz',
                'ee',
                'el',
                'en',
                'eo',
                'es',
                'et',
                'eu',
                'fa',
                'ff',
                'fi',
                'fj',
                'fo',
                'fr',
                'fy',
                'ga',
                'gd',
                'gl',
                'gn',
                'gu',
                'gv',
                'ha',
                'he',
                'hi',
                'ho',
                'hr',
                'ht',
                'hu',
                'hy',
                'hz',
                'ia',
                'id',
                'ie',
                'ig',
                'ii',
                'ik',
                'io',
                'is',
                'it',
                'iu',
                'ja',
                'jv',
                'ka',
                'kg',
                'ki',
                'kj',
                'kk',
                'kl',
                'km',
                'kn',
                'ko',
                'kr',
                'ks',
                'ku',
                'kv',
                'kw',
                'ky',
                'la',
                'lb',
                'lg',
                'li',
                'ln',
                'lo',
                'lt',
                'lu',
                'lv',
                'mg',
                'mh',
                'mi',
                'mk',
                'ml',
                'mn',
                'mr',
                'ms',
                'mt',
                'my',
                'na',
                'nb',
                'nd',
                'ne',
                'ng',
                'nl',
                'nn',
                'no',
                'nr',
                'nv',
                'ny',
                'oc',
                'oj',
                'om',
                'or',
                'os',
                'pa',
                'pi',
                'pl',
                'ps',
                'pt',
                'qu',
                'rm',
                'rn',
                'ro',
                'ru',
                'rw',
                'sa',
                'sc',
                'sd',
                'se',
                'sg',
                'si',
                'sk',
                'sl',
                'sm',
                'sn',
                'so',
                'sq',
                'sr',
                'ss',
                'st',
                'su',
                'sv',
                'sw',
                'ta',
                'te',
                'tg',
                'th',
                'ti',
                'tk',
                'tl',
                'tn',
                'to',
                'tr',
                'ts',
                'tt',
                'tw',
                'ty',
                'ug',
                'uk',
                'ur',
                'uz',
                've',
                'vi',
                'vo',
                'wa',
                'wo',
                'xh',
                'yi',
                'yo',
                'za',
                'zh',
                'zu'
            );`
        );

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
                },
                {
                    name: "type",
                    type: "game_type",
                    default: "'game'",
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
                    type: "eu_age_rating",
                    default: "'18'",
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
                    isNullable: false,
                },
                {
                    name: "cover_image",
                    type: "varchar",
                    length: "255",
                    isNullable: false,
                },
                {
                    name: "background_image",
                    type: "varchar",
                    length: "255",
                    isNullable: false,
                },
                {
                    name: "short_description",
                    type: "text",
                    isNullable: false,
                },
                {
                    name: "detailed_description",
                    type: "text",
                    isNullable: false,
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
                    type: "lang_code",
                    isArray: true,
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
        await queryRunner.query(`DROP TYPE IF EXISTS lang_code`);
        await queryRunner.query(`DROP TYPE IF EXISTS eu_age_rating`);
        await queryRunner.query(`DROP TYPE IF EXISTS game_platform`);
        await queryRunner.query(`DROP TYPE IF EXISTS game_type`);
    }

}
