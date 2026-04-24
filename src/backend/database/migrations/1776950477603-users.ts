import { Table, TableIndex, type MigrationInterface, type QueryRunner } from "typeorm";

export class Users1776950477603 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE employee_role AS ENUM ('support', 'moderator', 'manager', 'admin', 'superadmin')
        `);

        await queryRunner.createTable(new Table({
            name: "users",
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true,
                    default: "gen_random_uuid()",
                },
                {
                    name: "username",
                    type: "varchar",
                    length: "50",
                    isUnique: true,
                    isNullable: false,
                },
                {
                    name: "password",
                    type: "varchar",
                    length: "255",
                    isNullable: false,
                },
                {
                    name: "email",
                    type: "varchar",
                    length: "255",
                    isUnique: true,
                    isNullable: false,
                },
                {
                    name: "phone_number",
                    type: "varchar",
                    length: "20",
                    isUnique: true,
                    isNullable: true,
                },
                {
                    name: "bio",
                    type: "text",
                    isNullable: true,
                },
                {
                    name: "avatar",
                    type: "varchar",
                    length: "255",
                    isNullable: true,
                },
                {
                    name: "wallet",
                    type: "numeric",
                    precision: 10,
                    scale: 2,
                    default: 0,
                },
                {
                    name: "created_at",
                    type: "timestamptz",
                    default: "NOW()",
                },
            ],
            checks: [
                { name: "password_format", expression: `password ~* '^\\$2[aby]\\$'` },
                { name: "email_format", expression: `email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'` },
                { name: "phone_format", expression: `phone_number ~ '^\\+?[1-9]\\d{1,14}$' OR phone_number IS NULL` },
                { name: "username_length", expression: `LENGTH(TRIM(username)) >= 3` },
                { name: "bio_length", expression: `LENGTH(bio) <= 500 OR bio IS NULL` },
                { name: "wallet_non_negative", expression: `wallet >= 0` },
            ],
        }), true);

        await queryRunner.createTable(new Table({
            name: "user_profile",
            columns: [
                {
                    name: "user_id",
                    type: "uuid",
                    isPrimary: true,
                    isNullable: false,
                },
                {
                    name: "first_name",
                    type: "varchar",
                    length: "100",
                    isNullable: true,
                },
                {
                    name: "last_name",
                    type: "varchar",
                    length: "100",
                    isNullable: true,
                },
                {
                    name: "birthdate",
                    type: "date",
                    isNullable: true,
                },
                {
                    name: "country",
                    type: "char",
                    length: "2",
                    isNullable: true,
                },
                {
                    name: "city",
                    type: "varchar",
                    length: "100",
                    isNullable: true,
                },
                {
                    name: "newsletter",
                    type: "boolean",
                    default: false,
                },
            ],
            checks: [
                { name: "country_format", expression: `country ~ '^[A-Z]{2}$' OR country IS NULL` },
                { name: "birthdate_in_past", expression: `birthdate < NOW() OR birthdate IS NULL` },
                { name: "min_age", expression: `birthdate <= NOW() - INTERVAL '13 years' OR birthdate IS NULL` },
            ],
            foreignKeys: [
                {
                    name: "fk_user_profile_user",
                    columnNames: ["user_id"],
                    referencedTableName: "users",
                    referencedColumnNames: ["id"],
                    onDelete: "CASCADE",
                },
            ],
        }), true);

        await queryRunner.createTable(new Table({
            name: "user_billing",
            columns: [
                {
                    name: "user_id",
                    type: "uuid",
                    isPrimary: true,
                    isNullable: false,
                },
                {
                    name: "first_name",
                    type: "varchar",
                    length: "100",
                    isNullable: false,
                },
                {
                    name: "last_name",
                    type: "varchar",
                    length: "100",
                    isNullable: false,
                },
                {
                    name: "country",
                    type: "char",
                    length: "2",
                    isNullable: false,
                },
                {
                    name: "city",
                    type: "varchar",
                    length: "100",
                    isNullable: false,
                },
                {
                    name: "postal_code",
                    type: "varchar",
                    length: "20",
                    isNullable: false,
                },
                {
                    name: "address_line_1",
                    type: "varchar",
                    length: "255",
                    isNullable: false,
                },
                {
                    name: "address_line_2",
                    type: "varchar",
                    length: "255",
                    isNullable: true,
                },
            ],
            checks: [
                { name: "country_format", expression: `country ~ '^[A-Z]{2}$'` },
            ],
            foreignKeys: [
                {
                    name: "fk_user_billing_user",
                    columnNames: ["user_id"],
                    referencedTableName: "users",
                    referencedColumnNames: ["id"],
                    onDelete: "CASCADE",
                },
            ],
        }), true);

        await queryRunner.createTable(new Table({
            name: "employees",
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true,
                    isNullable: false,
                },
                {
                    name: "role",
                    type: "employee_role",
                    default: "'support'",
                },
                {
                    name: "created_at",
                    type: "timestamptz",
                    default: "NOW()",
                },
                {
                    name: "created_by",
                    type: "uuid",
                    isNullable: true,
                },
            ],
            foreignKeys: [
                {
                    name: "fk_employee_user",
                    columnNames: ["id"],
                    referencedTableName: "users",
                    referencedColumnNames: ["id"],
                    onDelete: "CASCADE",
                },
                {
                    name: "fk_employee_creator",
                    columnNames: ["created_by"],
                    referencedTableName: "users",
                    referencedColumnNames: ["id"],
                    onDelete: "SET NULL",
                },
            ],
        }), true);

        await queryRunner.createTable(new Table({
            name: "sessions",
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
                    name: "refresh_token_hash",
                    type: "char",
                    length: "64",
                    isNullable: false,
                },
                {
                    name: "ip_address",
                    type: "inet",
                    isNullable: false,
                },
                {
                    name: "user_agent",
                    type: "varchar",
                    length: "512",
                    isNullable: false,
                },
                {
                    name: "created_at",
                    type: "timestamptz",
                    default: "NOW()",
                },
                {
                    name: "expires_at",
                    type: "timestamptz",
                    isNullable: false,
                    default: "NOW() + INTERVAL '30 days'",
                },
                {
                    name: "last_seen_at",
                    type: "timestamptz",
                    default: "NOW()",
                },
                {
                    name: "flagged",
                    type: "boolean",
                    default: false,
                },
            ],
            checks: [
                { name: "refresh_token_hash_length", expression: `LENGTH(refresh_token_hash) = 64` },
            ],
            foreignKeys: [
                {
                    name: "fk_session_user",
                    columnNames: ["user_id"],
                    referencedTableName: "users",
                    referencedColumnNames: ["id"],
                    onDelete: "CASCADE",
                },
            ],
        }), true);

        await queryRunner.createIndex("sessions", new TableIndex({
            name: "idx_sessions_user_id",
            columnNames: ["user_id"],
        }));

        await queryRunner.createIndex("sessions", new TableIndex({
            name: "idx_sessions_expires_at",
            columnNames: ["expires_at"],
        }));

        // ============================================================
        // trigger to auto hash passwords on insert/update
        // ============================================================

        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);

        await queryRunner.query(`
            CREATE OR REPLACE FUNCTION hash_customer_password()
                RETURNS TRIGGER
                LANGUAGE plpgsql
            AS
            $trigger$
            BEGIN
                -- Hash the password using bcrypt if it's not already hashed
                -- Bcrypt hashes start with $2a$, $2b$, or $2y$
                IF NEW.password IS NOT NULL AND NEW.password !~ '^\$2[aby]\$' THEN
                    NEW.password := crypt(NEW.password, gen_salt('bf', 15));
                END IF;
                
                RETURN NEW;
            END;
            $trigger$;
        `);

        await queryRunner.query(`
            CREATE TRIGGER hash_password_before_insert
            BEFORE INSERT ON users
            FOR EACH ROW
            EXECUTE FUNCTION hash_customer_password();
        `);

        await queryRunner.query(`
            CREATE TRIGGER hash_password_before_update
            BEFORE UPDATE OF password ON users
            FOR EACH ROW
            EXECUTE FUNCTION hash_customer_password();
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropIndex("sessions", "idx_sessions_expires_at");
        await queryRunner.dropIndex("sessions", "idx_sessions_user_id");
        await queryRunner.dropTable("sessions");
        await queryRunner.dropTable("employees");
        await queryRunner.dropTable("user_billing");
        await queryRunner.dropTable("user_profile");
        await queryRunner.dropTable("users");
        await queryRunner.query(`DROP TYPE IF EXISTS employee_role`);
    }

}
