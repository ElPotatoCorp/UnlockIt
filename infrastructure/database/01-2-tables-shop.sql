DROP TABLE IF EXISTS stocks;
CREATE TABLE stocks(
   product_key VARCHAR(50),
   game_id     BIGINT,
   is_sold     BOOLEAN      DEFAULT FALSE,

   PRIMARY KEY(product_key),
   FOREIGN KEY(game_id) REFERENCES games(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS bundles;
CREATE TABLE bundles(
   id    BIGSERIAL,
   name  VARCHAR(255)  NOT NULL,
   price NUMERIC(10,2) NOT NULL,

   PRIMARY KEY(id),

   CONSTRAINT name_not_empty     CHECK (LENGTH(TRIM(name)) > 0),
   CONSTRAINT price_non_negative CHECK (price >= 0)
);

DROP TABLE IF EXISTS bundle_games;
CREATE TABLE bundle_games(
   bundle_id BIGINT,
   game_id   BIGINT,

   PRIMARY KEY(game_id, bundle_id),
   FOREIGN KEY(game_id)   REFERENCES games(id)   ON DELETE CASCADE,
   FOREIGN KEY(bundle_id) REFERENCES bundles(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS carts;
CREATE TABLE carts(
   id                 UUID         DEFAULT gen_random_uuid(),
   is_reserved        BOOLEAN      DEFAULT FALSE,
   transaction_status VARCHAR(10),
   reserved_at        TIMESTAMPTZ,

   PRIMARY KEY(id),

   CONSTRAINT transaction_status_valid CHECK (transaction_status IN ('pending', 'completed') OR transaction_status IS NULL)
);

DROP TABLE IF EXISTS cart_items;
CREATE TABLE cart_items(
   cart_id  UUID,
   game_id  BIGINT,
   quantity INT         DEFAULT 1,
   to_buy   BOOLEAN     DEFAULT TRUE,
   added_at TIMESTAMPTZ DEFAULT NOW(),

   PRIMARY KEY(cart_id, game_id),
   FOREIGN KEY(cart_id) REFERENCES carts(id) ON DELETE CASCADE,
   FOREIGN KEY(game_id) REFERENCES games(id) ON DELETE CASCADE
);
