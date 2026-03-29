CREATE TYPE discount_type AS ENUM ('percentage', 'fixed');
CREATE TYPE discount_target AS ENUM ('product', 'order');
DROP TABLE IF EXISTS discounts;
CREATE TABLE discounts(
   id              BIGSERIAL,
   code            VARCHAR(50),
   amount          INT             NOT NULL,
   type            discount_type   NOT NULL,
   condition       JSONB,
   target          discount_target NOT NULL,
   creation_date   DATE            DEFAULT NOW(),
   expiration_date DATE            DEFAULT NOW(),

   PRIMARY KEY(id),

   CONSTRAINT amount_positive           CHECK (amount > 0),
   CONSTRAINT amount_percentage_max     CHECK (type != 'percentage' OR amount BETWEEN 0 AND 100),
   CONSTRAINT expiration_after_creation CHECK (expiration_date >= creation_date)
);

CREATE TYPE discount_scope AS ENUM ('public', 'private');
DROP TABLE IF EXISTS game_discounts;
CREATE TABLE game_discounts(
   game_id     BIGINT,
   discount_id BIGINT,
   scope       discount_scope DEFAULT 'private',

   PRIMARY KEY(game_id, discount_id),
   FOREIGN KEY(game_id)     REFERENCES games(id)     ON DELETE CASCADE,
   FOREIGN KEY(discount_id) REFERENCES discounts(id) ON DELETE CASCADE
);


DROP TABLE IF EXISTS payment_methods;
CREATE TABLE payment_methods(
   id         VARCHAR(50),
   type       VARCHAR(255) NOT NULL,
   created_at TIMESTAMPTZ  DEFAULT NOW(),

   PRIMARY KEY(id),

   CONSTRAINT pm_id_format CHECK (id ~* '^pm_.+')
);

DROP TABLE IF EXISTS saved_payment_methods;
CREATE TABLE saved_payment_methods(
   user_id           UUID,
   payment_method_id VARCHAR(50),

   PRIMARY KEY(user_id, payment_method_id),
   FOREIGN KEY(user_id)           REFERENCES users(id)           ON DELETE CASCADE,
   FOREIGN KEY(payment_method_id) REFERENCES payment_methods(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS purchases;
CREATE TABLE purchases(
   id                UUID          DEFAULT gen_random_uuid(),
   user_id           UUID          NOT NULL,
   product_key       VARCHAR(50)   NOT NULL,
   game_id           BIGINT        NOT NULL,
   effective_price   NUMERIC(10,2) NOT NULL,
   discount_applied  VARCHAR(50),
   payment_method_id VARCHAR(50),
   purchase_date     TIMESTAMPTZ   DEFAULT NOW(),
   
   PRIMARY KEY(id),
   FOREIGN KEY(user_id)           REFERENCES users(id)           ON DELETE CASCADE,
   FOREIGN KEY(payment_method_id) REFERENCES payment_methods(id) ON DELETE SET NULL,
   
   CONSTRAINT effective_price_non_negative CHECK (effective_price >= 0)
);
