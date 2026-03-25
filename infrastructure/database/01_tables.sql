CREATE TABLE IF NOT EXISTS "games"(
   "id" BIGSERIAL,
   "slug" VARCHAR(255) UNIQUE NOT NULL,
   "name" VARCHAR(255) NOT NULL,
   "quantity" INT DEFAULT 0,
   "price" NUMERIC(19,4) NOT NULL,
   "age_rating" VARCHAR(32),
   "release_date" DATE,
   "coming_soon" BOOLEAN DEFAULT FALSE,
   "metacritic" SMALLINT,
   "short_description" TEXT,
   "detailed_description" TEXT,
   "website" VARCHAR(255),
   "header_image" VARCHAR(255),
   "cover_image" VARCHAR(255),
   "background_image" VARCHAR(255),
   "pc_requirements" TEXT,
   "supported_languages" TEXT,

   PRIMARY KEY("id"),

   CONSTRAINT price_non_negative CHECK ("price" >= 0),
   CONSTRAINT quantity_non_negative CHECK ("quantity" >= 0),
   CONSTRAINT metacritic_valid CHECK ("metacritic" BETWEEN 0 AND 100 OR "metacritic" IS NULL)
);

CREATE TABLE IF NOT EXISTS "games_related_games"(
   "game_id" BIGSERIAL,
   "related_game_id" BIGSERIAL,

   PRIMARY KEY("game_id", "related_game_id"),
   FOREIGN KEY("game_id") REFERENCES "games"("id") ON DELETE CASCADE,
   FOREIGN KEY("related_game_id") REFERENCES "games"("id") ON DELETE CASCADE,

   CONSTRAINT different_games CHECK ("game_id" != "related_game_id")
);

CREATE TABLE IF NOT EXISTS "types"(
   "id" BIGSERIAL,
   "name" VARCHAR(100) UNIQUE NOT NULL,
   "games_count" INT DEFAULT 0,

   PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "games_types"(
   "game_id" BIGSERIAL,
   "type_id" BIGSERIAL,
   
   PRIMARY KEY("game_id", "type_id"),
   FOREIGN KEY("game_id") REFERENCES "games"("id") ON DELETE CASCADE,
   FOREIGN KEY("type_id") REFERENCES "types"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "genres"(
   "id" BIGSERIAL,
   "name" VARCHAR(100) UNIQUE NOT NULL,
   "games_count" INT DEFAULT 0,

   PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "games_genres"(
   "game_id" BIGSERIAL,
   "genre_id" BIGSERIAL,

   PRIMARY KEY("game_id", "genre_id"),
   FOREIGN KEY("game_id") REFERENCES "games"("id") ON DELETE CASCADE,
   FOREIGN KEY("genre_id") REFERENCES "genres"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "platforms"(
   "id" BIGSERIAL,
   "name" VARCHAR(50) UNIQUE NOT NULL,
   "games_count" INT DEFAULT 0,

   PRIMARY KEY("id"),
   
   CONSTRAINT name_not_empty CHECK (LENGTH(TRIM("name")) > 0)
);

CREATE TABLE IF NOT EXISTS "games_platforms"(
   "game_id" BIGSERIAL,
   "platform_id" BIGSERIAL,

   PRIMARY KEY("game_id", "platform_id"),
   FOREIGN KEY("game_id") REFERENCES "games"("id") ON DELETE CASCADE,
   FOREIGN KEY("platform_id") REFERENCES "platforms"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "developers"(
   "id" BIGSERIAL,
   "name" VARCHAR(200) UNIQUE NOT NULL,
   "games_count" INT DEFAULT 0,

   PRIMARY KEY("id"),
   
   CONSTRAINT name_not_empty CHECK (LENGTH(TRIM("name")) > 0)
);

CREATE TABLE IF NOT EXISTS "games_developers"(
   "game_id" BIGSERIAL,
   "developer_id" BIGSERIAL,

   PRIMARY KEY("game_id", "developer_id"),
   FOREIGN KEY("game_id") REFERENCES "games"("id") ON DELETE CASCADE,
   FOREIGN KEY("developer_id") REFERENCES "developers"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "publishers"(
   "id" BIGSERIAL,
   "name" VARCHAR(200) UNIQUE NOT NULL,
   "games_count" INT DEFAULT 0,

   PRIMARY KEY("id"),
   
   CONSTRAINT name_not_empty CHECK (LENGTH(TRIM("name")) > 0)
);

CREATE TABLE IF NOT EXISTS "games_publishers"(
   "game_id" BIGSERIAL,
   "publisher_id" BIGSERIAL,

   PRIMARY KEY("game_id", "publisher_id"),
   FOREIGN KEY("game_id") REFERENCES "games"("id") ON DELETE CASCADE,
   FOREIGN KEY("publisher_id") REFERENCES "publishers"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "media"(
   "id" BIGSERIAL,
   "game_id" BIGSERIAL,
   "url" VARCHAR(255),
   "type" CHAR(3),

   PRIMARY KEY("id"),
   FOREIGN KEY("game_id") REFERENCES "games"("id") ON DELETE CASCADE,

   CONSTRAINT url_format CHECK ("url" ~* '^(http|https)://'),
   CONSTRAINT type_type CHECK("type" IN ('vid', 'pic'))
);

CREATE TABLE IF NOT EXISTS "bundles"(
   "id" BIGSERIAL,
   "name" VARCHAR(255) NOT NULL,
   "price" NUMERIC(19,4) NOT NULL,

   PRIMARY KEY("id"),

   CONSTRAINT name_not_empty CHECK (LENGTH(TRIM("name")) > 0),
   CONSTRAINT price_non_negative CHECK ("price" >= 0)
);

CREATE TABLE IF NOT EXISTS "bundles_games"(
   "game_id" BIGSERIAL,
   "bundle_id" BIGSERIAL,

   PRIMARY KEY("game_id", "bundle_id"),
   FOREIGN KEY("game_id") REFERENCES "games"("id") ON DELETE CASCADE,
   FOREIGN KEY("bundle_id") REFERENCES "bundles"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "discounts"(
   "id" BIGSERIAL,
   "code" VARCHAR(50),
   "amount" INT NOT NULL,
   "type" VARCHAR(10) NOT NULL,
   "condition" JSONB,
   "target" VARCHAR(7) NOT NULL,
   "creation_date" DATE DEFAULT NOW(),
   "expiration_date" DATE DEFAULT NOW(),

   PRIMARY KEY("id"),

   CONSTRAINT amount_positive CHECK ("amount" > 0),
   CONSTRAINT amount_percentage_max CHECK ("type" != 'percentage' OR "amount" <= 100),
   CONSTRAINT type_valid CHECK ("type" IN ('percentage', 'fixed')),
   CONSTRAINT target_valid CHECK ("target" IN ('product', 'order')),
   CONSTRAINT expiration_after_creation CHECK ("expiration_date" >= "creation_date")
);

CREATE TABLE IF NOT EXISTS "games_discounts"(
   "game_id" BIGSERIAL,
   "discount_id" BIGSERIAL,
   "scope" VARCHAR(7) DEFAULT 'private',

   PRIMARY KEY("game_id", "discount_id"),
   FOREIGN KEY("game_id") REFERENCES "games"("id") ON DELETE CASCADE,
   FOREIGN KEY("discount_id") REFERENCES "discounts"("id") ON DELETE CASCADE,

   CONSTRAINT scope_valid CHECK ("scope" IN ('public', 'private'))
);

CREATE TABLE IF NOT EXISTS "carts"(
   "id" UUID DEFAULT gen_random_uuid(),
   "is_reserved" BOOLEAN DEFAULT FALSE,
   "transaction_status" VARCHAR(10),
   "reserved_at" TIMESTAMPTZ,

   PRIMARY KEY("id"),

   CONSTRAINT transaction_status_valid CHECK ("transaction_status" IN ('pending', 'completed') OR "transaction_status" IS NULL)
);

CREATE TABLE IF NOT EXISTS "carts_games"(
   "cart_id" UUID,
   "game_id" BIGSERIAL,
   "quantity" INT DEFAULT 1,
   "to_buy" BOOLEAN DEFAULT TRUE,
   "added_at" TIMESTAMPTZ DEFAULT NOW(),

   PRIMARY KEY("cart_id", "game_id"),
   FOREIGN KEY("cart_id") REFERENCES "carts"("id") ON DELETE CASCADE,
   FOREIGN KEY("game_id") REFERENCES "games"("id") ON DELETE CASCADE
);

DROP TABLE IF EXISTS "users" CASCADE;
CREATE TABLE IF NOT EXISTS "users"(
   "id" UUID DEFAULT gen_random_uuid(),
   "username" VARCHAR(50) NOT NULL,
   "password" CHAR(60) NOT NULL,
   "email" VARCHAR(255) UNIQUE,
   "phone_wzc" VARCHAR(3),
   "phone_number" VARCHAR(15),
   "bio" TEXT,
   "avatar" varchar(255),
   "wallet" NUMERIC(19,4) DEFAULT 0,
   "creation_date" DATE DEFAULT NOW(),
   "cart_id" UUID UNIQUE NOT NULL,

   /* Extra infos */
   "first_name" VARCHAR(100),
   "last_name" VARCHAR(100),
   
   "country" VARCHAR(100),
   "billing_address" TEXT,

   "newsletter_subscription" BOOLEAN DEFAULT FALSE,

   "birthday_date" DATE,

   PRIMARY KEY("id"),
   FOREIGN KEY("cart_id") REFERENCES "carts"("id") ON DELETE CASCADE,
   UNIQUE("phone_wzc", "phone_number"),

   CONSTRAINT email_or_phone CHECK (("email" IS NOT NULL) OR ("phone_wzc" IS NOT NULL AND "phone_number" IS NOT NULL)),
   CONSTRAINT email_format CHECK ("email" ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' OR "email" IS NULL),
   CONSTRAINT phone_format CHECK ("phone_wzc" ~ '^\\d{1,3}$' AND "phone_number" ~ '^\\d{7,15}$' OR ("phone_wzc" IS NULL AND "phone_number" IS NULL)),
   CONSTRAINT birthday_in_past CHECK ("birthday_date" < NOW() OR "birthday_date" IS NULL),
   CONSTRAINT username_length CHECK (LENGTH(TRIM("username")) >= 3),
   CONSTRAINT password_length CHECK (LENGTH("password") >= 8),
   CONSTRAINT wallet_non_negative CHECK ("wallet" >= 0)
);

CREATE TABLE IF NOT EXISTS "employees"(
   "id" UUID,
   "permission_level" SMALLINT NOT NULL DEFAULT 0,

   PRIMARY KEY("id"),
   FOREIGN KEY("id") REFERENCES "users"("id") ON DELETE CASCADE,

   CONSTRAINT permission_level_valid CHECK ("permission_level" >= 0 AND "permission_level" <= 5)
);

CREATE TABLE IF NOT EXISTS "sessions"(
   "id" UUID DEFAULT gen_random_uuid(),
   "created_at" TIMESTAMP DEFAULT NOW(),
   "last_seen_at" TIMESTAMP DEFAULT NOW(),
   "last_ip_used" INET NOT NULL,
   "last_ua_used" VARCHAR(64) NOT NULL,
   "last_country" CHAR(2) NOT NULL,
   "is_unsafe" BOOLEAN DEFAULT FALSE,
   "user_id" UUID NOT NULL,

   PRIMARY KEY("id"),
   FOREIGN KEY("user_id") REFERENCES "users"("id") ON DELETE CASCADE,

   CONSTRAINT last_ua_length CHECK (LENGTH("last_ua_used") <= 64),
   CONSTRAINT last_country_format CHECK ("last_country" ~ '^[A-Z]{2}$')
);

CREATE TABLE IF NOT EXISTS "stocks"(
   "product_key" VARCHAR(50),
   "game_id" BIGSERIAL,
   "is_sold" BOOLEAN DEFAULT FALSE,

   PRIMARY KEY("product_key"),
   FOREIGN KEY("game_id") REFERENCES "games"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "payment_methods"(
   "id" VARCHAR(50),
   "type" VARCHAR(255) NOT NULL,
   "created_at" TIMESTAMPTZ DEFAULT NOW(),

   PRIMARY KEY("id"),

   CONSTRAINT pm_id_format CHECK ("id" ~* '^pm_.+')
);

CREATE TABLE IF NOT EXISTS "purchases"(
   "id" UUID DEFAULT gen_random_uuid(),
   "user_id" UUID NOT NULL,
   "product_key" VARCHAR(50) NOT NULL,
   "game_id" BIGSERIAL NOT NULL,
   "effective_price" NUMERIC(19,4) NOT NULL,
   "discount_applied" VARCHAR(50),
   "payment_method_id" VARCHAR(50),
   "purchase_date" TIMESTAMPTZ DEFAULT NOW(),
   
   PRIMARY KEY("id"),
   FOREIGN KEY("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
   FOREIGN KEY("payment_method_id") REFERENCES "payment_methods"("id") ON DELETE SET NULL,
   
   CONSTRAINT effective_price_non_negative CHECK ("effective_price" >= 0)
);

CREATE TABLE IF NOT EXISTS "tickets"(
   "id" UUID DEFAULT gen_random_uuid(),
   "email" VARCHAR(255) NOT NULL,
   "reason" VARCHAR(255) NOT NULL,
   "content" TEXT NOT NULL,
   "status" VARCHAR(20) DEFAULT 'Open',
   "created_at" TIMESTAMP DEFAULT NOW(),
   "is_customer" BOOLEAN DEFAULT FALSE,
   "is_employee" BOOLEAN DEFAULT FALSE,
   "user_id" UUID DEFAULT NULL,

   PRIMARY KEY("id"),
   FOREIGN KEY("user_id") REFERENCES "users"("id") ON DELETE SET NULL,

   CONSTRAINT email_format CHECK ("email" ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
   CONSTRAINT reason_not_empty CHECK (LENGTH(TRIM("reason")) > 0),
   CONSTRAINT content_not_empty CHECK (LENGTH(TRIM("content")) > 0),
   CONSTRAINT is_valid_status CHECK ("status" IN ('Open', 'Resolved', 'Closed'))
);

CREATE TABLE IF NOT EXISTS "saved_payment_methods"(
   "user_id" UUID,
   "payment_method_id" VARCHAR(50),

   PRIMARY KEY("user_id", "payment_method_id"),
   FOREIGN KEY("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
   FOREIGN KEY("payment_method_id") REFERENCES "payment_methods"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "wishlists"(
   "user_id" UUID,
   "game_id" BIGSERIAL,
   "added_at" TIMESTAMPTZ DEFAULT NOW(),

   PRIMARY KEY("user_id", "game_id"),
   FOREIGN KEY("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
   FOREIGN KEY("game_id") REFERENCES "games"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "reviews"(
   "id" UUID DEFAULT gen_random_uuid(),
   "rating" SMALLINT NOT NULL,
   "content" TEXT,
   "creation_date" TIMESTAMP DEFAULT NOW(),
   "user_id" UUID NOT NULL,
   "game_id" BIGSERIAL NOT NULL,
   "helpful_count" INT DEFAULT 0,
   "not_helpful_count" INT DEFAULT 0,

   PRIMARY KEY("id"),
   FOREIGN KEY("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
   FOREIGN KEY("game_id") REFERENCES "games"("id") ON DELETE CASCADE,
   
   UNIQUE("user_id", "game_id"),

   CONSTRAINT rating_valid CHECK ("rating" BETWEEN 0 AND 10)
);

CREATE TABLE IF NOT EXISTS "review_votes"(
   "user_id" UUID,
   "review_id" UUID,
   "is_helpful" BOOLEAN NOT NULL,
   
   PRIMARY KEY("user_id", "review_id"),
   FOREIGN KEY("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
   FOREIGN KEY("review_id") REFERENCES "reviews"("id") ON DELETE CASCADE
);
