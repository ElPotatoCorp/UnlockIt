DROP TABLE IF EXISTS users;
CREATE TABLE users(
   id                 UUID          DEFAULT gen_random_uuid(),
   username           VARCHAR(50)   UNIQUE NOT NULL,
   password           VARCHAR(255)  NOT NULL,
   email              VARCHAR(255)  UNIQUE NOT NULL,
   phone_country_code VARCHAR(3),
   phone_number       VARCHAR(15),
   bio                TEXT,
   avatar             VARCHAR(255),
   wallet             NUMERIC(10,2) DEFAULT 0,
   created_at         TIMESTAMPTZ   DEFAULT NOW(),

   PRIMARY KEY(id),

   CONSTRAINT email_format        CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' OR email IS NULL),
   CONSTRAINT phone_format        CHECK ((phone_country_code ~ '^\d{1,3}$' AND phone_number ~ '^\d{7,15}$') OR (phone_country_code IS NULL AND phone_number IS NULL)),
   CONSTRAINT username_length     CHECK (LENGTH(TRIM(username)) >= 3),
   CONSTRAINT bio_length          CHECK (LENGTH(bio) <= 500 OR bio IS NULL),
   CONSTRAINT wallet_non_negative CHECK (wallet >= 0)
);

DROP TABLE IF EXISTS user_profile;
CREATE TABLE user_profile(
   user_id    UUID          NOT NULL,
   first_name VARCHAR(100),
   last_name  VARCHAR(100),
   birthdate  DATE,
   country    CHAR(2),
   city       VARCHAR(100),
   newsletter BOOLEAN       DEFAULT FALSE,

   PRIMARY KEY(user_id),
   FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,

   CONSTRAINT country_format    CHECK (country ~ '^[A-Z]{2}$' OR country IS NULL),
   CONSTRAINT birthdate_in_past CHECK (birthdate < NOW() OR birthdate IS NULL),
   CONSTRAINT min_age           CHECK (birthdate <= NOW() - INTERVAL '13 years' OR birthdate IS NULL)
);

DROP TABLE IF EXISTS user_billing;
CREATE TABLE user_billing(
   user_id        UUID          NOT NULL,
   first_name     VARCHAR(100)  NOT NULL,
   last_name      VARCHAR(100)  NOT NULL,
   country        CHAR(2)       NOT NULL,
   city           VARCHAR(100)  NOT NULL,
   postal_code    VARCHAR(20)   NOT NULL,
   address_line_1 VARCHAR(255)  NOT NULL,
   address_line_2 VARCHAR(255),

   PRIMARY KEY(user_id),
   FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,

   CONSTRAINT country_format CHECK (country ~ '^[A-Z]{2}$')
);

CREATE TYPE employee_role AS ENUM ('support', 'moderator', 'manager', 'admin', 'superadmin');

DROP TABLE IF EXISTS employees;
CREATE TABLE employees(
   id         UUID           NOT NULL,
   role       employee_role  NOT NULL DEFAULT 'support',
   created_at TIMESTAMPTZ    DEFAULT NOW(),
   created_by UUID,

   PRIMARY KEY(id),
   FOREIGN KEY(id)         REFERENCES users(id) ON DELETE CASCADE,
   FOREIGN KEY(created_by) REFERENCES users(id) ON DELETE SET NULL
);

DROP TABLE IF EXISTS sessions;
CREATE TABLE sessions(
   id                 UUID          DEFAULT gen_random_uuid(),
   user_id            UUID          NOT NULL,
   refresh_token_hash CHAR(64)      NOT NULL,
   created_at         TIMESTAMPTZ   DEFAULT NOW(),
   last_seen_at       TIMESTAMPTZ   DEFAULT NOW(),
   expires_at         TIMESTAMPTZ   NOT NULL DEFAULT NOW() + INTERVAL '30 days',
   ip_address         INET          NOT NULL,
   user_agent         VARCHAR(512)  NOT NULL,
   country            CHAR(2)       NOT NULL,
   device_name        VARCHAR(100),
   flagged            BOOLEAN       DEFAULT FALSE,

   PRIMARY KEY(id),
   FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,

   CONSTRAINT country_format            CHECK (country ~ '^[A-Z]{2}$'),
   CONSTRAINT refresh_token_hash_length CHECK (LENGTH(refresh_token_hash) = 64)
);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id    ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
