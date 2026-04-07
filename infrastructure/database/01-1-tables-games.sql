-- ============================================================
-- series
-- ============================================================
DROP TABLE IF EXISTS series;
CREATE TABLE series (
   id   BIGSERIAL,
   name VARCHAR(255) NOT NULL,
   slug VARCHAR(255) NOT NULL UNIQUE,

   PRIMARY KEY (id),
   CONSTRAINT series_name_not_empty CHECK (LENGTH(TRIM(name)) > 0)
);

-- ============================================================
-- games
-- ============================================================
DROP TABLE IF EXISTS games;
CREATE TABLE games (
   id                   BIGSERIAL,
   slug                 VARCHAR(255)  NOT NULL,
   name                 VARCHAR(255)  NOT NULL,
   type                 VARCHAR(50),

   price                NUMERIC(10,2) NOT NULL,
   age_rating           VARCHAR(32),
   release_date         DATE,
   coming_soon          BOOLEAN       DEFAULT FALSE,

   header_image         VARCHAR(255),
   cover_image          VARCHAR(255),
   background_image     VARCHAR(255),
   short_description    TEXT,
   detailed_description TEXT,
   metacritic_score     SMALLINT,
   website              VARCHAR(255),
   pc_requirements      TEXT,
   supported_languages  TEXT[],

   series_id            BIGINT,

   PRIMARY KEY (id),
   FOREIGN KEY (series_id) REFERENCES series (id) ON DELETE SET NULL,

   CONSTRAINT price_non_negative   CHECK (price >= 0),
   CONSTRAINT metacritic_valid     CHECK (metacritic_score BETWEEN 0 AND 100 OR metacritic_score IS NULL)
);

CREATE INDEX idx_games_slug ON games (slug);

-- ============================================================
-- tags  (unified taxonomy — replaces genres + types)
-- ============================================================
DROP TABLE IF EXISTS tags;
CREATE TABLE tags (
   id          BIGSERIAL,
   name        VARCHAR(150) NOT NULL UNIQUE,
   games_count INT          DEFAULT 0,

   PRIMARY KEY (id),
   CONSTRAINT tag_name_not_empty CHECK (LENGTH(TRIM(name)) > 0)
);

DROP TABLE IF EXISTS game_tags;
CREATE TABLE game_tags (
   game_id BIGINT,
   tag_id  BIGINT,

   PRIMARY KEY (game_id, tag_id),
   FOREIGN KEY (game_id) REFERENCES games (id) ON DELETE CASCADE,
   FOREIGN KEY (tag_id)  REFERENCES tags  (id) ON DELETE CASCADE
);

-- ============================================================
-- platforms  (one row per game, one boolean column per platform)
-- ============================================================
DROP TABLE IF EXISTS game_platforms;
CREATE TABLE game_platforms (
   game_id     BIGINT PRIMARY KEY,
   windows     BOOLEAN DEFAULT FALSE,
   mac         BOOLEAN DEFAULT FALSE,
   linux       BOOLEAN DEFAULT FALSE,
   ios         BOOLEAN DEFAULT FALSE,
   android     BOOLEAN DEFAULT FALSE,
   switch      BOOLEAN DEFAULT FALSE,
   ps4         BOOLEAN DEFAULT FALSE,
   ps5         BOOLEAN DEFAULT FALSE,
   xbox_one    BOOLEAN DEFAULT FALSE,
   xbox_series BOOLEAN DEFAULT FALSE,

   FOREIGN KEY (game_id) REFERENCES games (id) ON DELETE CASCADE
);

-- ============================================================
-- developers
-- ============================================================
DROP TABLE IF EXISTS developers;
CREATE TABLE developers (
   id          BIGSERIAL,
   name        VARCHAR(200) NOT NULL UNIQUE,
   games_count INT          DEFAULT 0,

   PRIMARY KEY (id),
   CONSTRAINT developer_name_not_empty CHECK (LENGTH(TRIM(name)) > 0)
);

DROP TABLE IF EXISTS game_developers;
CREATE TABLE game_developers (
   game_id      BIGINT,
   developer_id BIGINT,

   PRIMARY KEY (game_id, developer_id),
   FOREIGN KEY (game_id)      REFERENCES games      (id) ON DELETE CASCADE,
   FOREIGN KEY (developer_id) REFERENCES developers (id) ON DELETE CASCADE
);

-- ============================================================
-- publishers
-- ============================================================
DROP TABLE IF EXISTS publishers;
CREATE TABLE publishers (
   id          BIGSERIAL,
   name        VARCHAR(200) NOT NULL UNIQUE,
   games_count INT          DEFAULT 0,

   PRIMARY KEY (id),
   CONSTRAINT publisher_name_not_empty CHECK (LENGTH(TRIM(name)) > 0)
);

DROP TABLE IF EXISTS game_publishers;
CREATE TABLE game_publishers (
   game_id      BIGINT,
   publisher_id BIGINT,

   PRIMARY KEY (game_id, publisher_id),
   FOREIGN KEY (game_id)      REFERENCES games      (id) ON DELETE CASCADE,
   FOREIGN KEY (publisher_id) REFERENCES publishers (id) ON DELETE CASCADE
);

-- ============================================================
-- media  (screenshots, videos, etc.)
-- ============================================================
CREATE TYPE media_type AS ENUM ('video', 'image');

DROP TABLE IF EXISTS media;
CREATE TABLE media (
   id      BIGSERIAL,
   game_id BIGINT       NOT NULL,
   url     VARCHAR(255) NOT NULL,
   type    media_type,

   PRIMARY KEY (id),
   FOREIGN KEY (game_id) REFERENCES games (id) ON DELETE CASCADE,

   CONSTRAINT url_format CHECK (url ~* '^(http|https)://')
);
