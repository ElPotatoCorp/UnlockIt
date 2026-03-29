CREATE TYPE ticket_status AS ENUM ('open', 'resolved', 'closed');
DROP TABLE IF EXISTS tickets;
CREATE TABLE tickets(
   id          UUID          DEFAULT gen_random_uuid(),
   email       VARCHAR(255)  NOT NULL,
   reason      VARCHAR(255)  NOT NULL,
   content     TEXT          NOT NULL,
   status      ticket_status DEFAULT 'open',
   created_at  TIMESTAMPTZ   DEFAULT NOW(),
   is_customer BOOLEAN       DEFAULT FALSE,
   is_employee BOOLEAN       DEFAULT FALSE,
   user_id     UUID          DEFAULT NULL,

   PRIMARY KEY(id),
   FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL,

   CONSTRAINT email_format      CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
   CONSTRAINT reason_not_empty  CHECK (LENGTH(TRIM(reason)) > 0),
   CONSTRAINT content_not_empty CHECK (LENGTH(TRIM(content)) > 0)
);

DROP TABLE IF EXISTS wishlists;
CREATE TABLE wishlists(
   user_id  UUID,
   game_id  BIGSERIAL,
   added_at TIMESTAMPTZ DEFAULT NOW(),

   PRIMARY KEY(user_id, game_id),
   FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
   FOREIGN KEY(game_id) REFERENCES games(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS reviews;
CREATE TABLE reviews(
   id                UUID        DEFAULT gen_random_uuid(),
   rating            SMALLINT    NOT NULL,
   content           TEXT,
   creation_date     TIMESTAMPTZ DEFAULT NOW(),
   user_id           UUID        NOT NULL,
   game_id           BIGSERIAL   NOT NULL,
   helpful_count     INT         DEFAULT 0,
   not_helpful_count INT         DEFAULT 0,

   PRIMARY KEY(id),
   FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
   FOREIGN KEY(game_id) REFERENCES games(id) ON DELETE CASCADE,
   
   UNIQUE(user_id, game_id),

   CONSTRAINT rating_valid CHECK (rating BETWEEN 0 AND 10)
);

DROP TABLE IF EXISTS review_votes;
CREATE TABLE review_votes(
   user_id    UUID,
   review_id  UUID,
   is_helpful BOOLEAN NOT NULL,
   created_at TIMESTAMPTZ DEFAULT NOW(),
   
   PRIMARY KEY(user_id, review_id),
   FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
   FOREIGN KEY(review_id) REFERENCES reviews(id) ON DELETE CASCADE
);
