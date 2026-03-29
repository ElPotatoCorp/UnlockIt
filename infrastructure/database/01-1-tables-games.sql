DROP TABLE IF EXISTS series;
CREATE TABLE series(
  id    BIGSERIAL,
  name  VARCHAR(255) NOT NULL,
  slug  VARCHAR(255) NOT NULL UNIQUE,

  PRIMARY KEY(id),
  CONSTRAINT name_not_empty CHECK (LENGTH(TRIM(name)) > 0)
);

DROP TABLE IF EXISTS games;
CREATE TABLE games(
   id                   BIGSERIAL,
   slug                 VARCHAR(255)  NOT NULL,
   name                 VARCHAR(255)  NOT NULL,

   price                NUMERIC(10,2) NOT NULL,
   age_rating           VARCHAR(32),
   release_date         DATE,
   coming_soon          BOOLEAN       DEFAULT FALSE,

   header_image         VARCHAR(255),
   cover_image          VARCHAR(255),
   background_image     VARCHAR(255),
   short_description    TEXT,
   detailed_description TEXT,
   metacritic           SMALLINT,
   website              VARCHAR(255),
   pc_requirements      TEXT,
   supported_languages  TEXT,

   series_id            BIGINT,

   PRIMARY KEY(id),
   FOREIGN KEY(series_id) REFERENCES series(id) ON DELETE SET NULL,

   CONSTRAINT price_non_negative CHECK (price >= 0),
   CONSTRAINT metacritic_valid   CHECK (metacritic BETWEEN 0 AND 100 OR metacritic IS NULL)
);
CREATE INDEX idx_games_slug ON games(slug);

DROP TABLE IF EXISTS types;
CREATE TABLE types(
   id          BIGSERIAL,
   name        VARCHAR(100) UNIQUE NOT NULL,
   games_count INT          DEFAULT 0,

   PRIMARY KEY(id)
);

DROP TABLE IF EXISTS game_types;
CREATE TABLE game_types(
   game_id BIGINT,
   type_id BIGINT,
   
   PRIMARY KEY(game_id, type_id),
   FOREIGN KEY(game_id) REFERENCES games(id) ON DELETE CASCADE,
   FOREIGN KEY(type_id) REFERENCES types(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS genres;
CREATE TABLE genres(
   id          BIGSERIAL,
   name        VARCHAR(100) UNIQUE NOT NULL,
   games_count INT          DEFAULT 0,

   PRIMARY KEY(id)
);

DROP TABLE IF EXISTS game_genres;
CREATE TABLE game_genres(
   game_id  BIGINT,
   genre_id BIGINT,

   PRIMARY KEY(game_id, genre_id),
   FOREIGN KEY(game_id)  REFERENCES games(id)  ON DELETE CASCADE,
   FOREIGN KEY(genre_id) REFERENCES genres(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS platforms;
CREATE TABLE platforms(
   id          BIGSERIAL,
   name        VARCHAR(50) UNIQUE NOT NULL,
   games_count INT         DEFAULT 0,

   PRIMARY KEY(id),
   
   CONSTRAINT name_not_empty CHECK (LENGTH(TRIM(name)) > 0)
);

DROP TABLE IF EXISTS game_platforms;
CREATE TABLE game_platforms(
   game_id     BIGINT,
   platform_id BIGINT,

   PRIMARY KEY(game_id, platform_id),
   FOREIGN KEY(game_id)     REFERENCES games(id)     ON DELETE CASCADE,
   FOREIGN KEY(platform_id) REFERENCES platforms(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS developers;
CREATE TABLE developers(
   id          BIGSERIAL,
   name        VARCHAR(200) UNIQUE NOT NULL,
   games_count INT          DEFAULT 0,

   PRIMARY KEY(id),
   
   CONSTRAINT name_not_empty CHECK (LENGTH(TRIM(name)) > 0)
);

DROP TABLE IF EXISTS game_developers;
CREATE TABLE game_developers(
   game_id      BIGINT,
   developer_id BIGINT,

   PRIMARY KEY(game_id, developer_id),
   FOREIGN KEY(game_id)      REFERENCES games(id)      ON DELETE CASCADE,
   FOREIGN KEY(developer_id) REFERENCES developers(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS publishers;
CREATE TABLE publishers(
   id          BIGSERIAL,
   name        VARCHAR(200) UNIQUE NOT NULL,
   games_count INT          DEFAULT 0,

   PRIMARY KEY(id),
   
   CONSTRAINT name_not_empty CHECK (LENGTH(TRIM(name)) > 0)
);

DROP TABLE IF EXISTS game_publishers;
CREATE TABLE game_publishers(
   game_id      BIGINT,
   publisher_id BIGINT,

   PRIMARY KEY(game_id, publisher_id),
   FOREIGN KEY(game_id)      REFERENCES games(id)      ON DELETE CASCADE,
   FOREIGN KEY(publisher_id) REFERENCES publishers(id) ON DELETE CASCADE
);

CREATE TYPE media_type AS ENUM ('video', 'image');
DROP TABLE IF EXISTS media;
CREATE TABLE media(
   id      BIGSERIAL,
   game_id BIGINT       NOT NULL,
   url     VARCHAR(255) NOT NULL,
   type    media_type,

   PRIMARY KEY(id),
   FOREIGN KEY(game_id) REFERENCES games(id) ON DELETE CASCADE,

   CONSTRAINT url_format CHECK (url ~* '^(http|https)://')
);
