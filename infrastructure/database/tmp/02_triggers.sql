-- ========================
-- | AUTO-UPDATE Counters |
-- ========================

-- Type Trigger
CREATE OR REPLACE FUNCTION "update_category_games_count"()
   RETURNS TRIGGER
   LANGUAGE plpgsql
AS
$trigger$
BEGIN
   -- When a game is added to a type (INSERT)
   IF (TG_OP = 'INSERT') THEN
      UPDATE "types"
      SET "games_count" = "games_count" + 1
      WHERE "id" = NEW."type_id";
      
      RETURN NEW;
   
   -- When a game is removed from a type (DELETE)
   ELSIF (TG_OP = 'DELETE') THEN
      UPDATE "types"
      SET "games_count" = "games_count" - 1
      WHERE "id" = OLD."type_id";
      
      RETURN OLD;
   END IF;
   
   RETURN NULL;
END;
$trigger$;

-- Trigger for INSERT operations
CREATE OR REPLACE TRIGGER "trigger_category_game_added"
AFTER INSERT
ON "games_types"
FOR EACH ROW
EXECUTE FUNCTION "update_category_games_count"();

-- Trigger for DELETE operations
CREATE OR REPLACE TRIGGER "trigger_category_game_removed"
AFTER DELETE
ON "games_types"
FOR EACH ROW
EXECUTE FUNCTION "update_category_games_count"();


-- Genre Trigger
CREATE OR REPLACE FUNCTION "update_genre_games_count"()
   RETURNS TRIGGER
   LANGUAGE plpgsql
AS
$trigger$
BEGIN
   -- When a game is added to a genre (INSERT)
   IF (TG_OP = 'INSERT') THEN
      UPDATE "genres"
      SET "games_count" = "games_count" + 1
      WHERE "id" = NEW."genre_id";
      
      RETURN NEW;
   
   -- When a game is removed from a genre (DELETE)
   ELSIF (TG_OP = 'DELETE') THEN
      UPDATE "genres"
      SET "games_count" = "games_count" - 1
      WHERE "id" = OLD."genre_id";
      
      RETURN OLD;
   END IF;
   
   RETURN NULL;
END;
$trigger$;

-- Trigger for INSERT operations
CREATE OR REPLACE TRIGGER "trigger_genre_game_added"
AFTER INSERT
ON "games_genres"
FOR EACH ROW
EXECUTE FUNCTION "update_genre_games_count"();

-- Trigger for DELETE operations
CREATE OR REPLACE TRIGGER "trigger_genre_game_removed"
AFTER DELETE
ON "games_genres"
FOR EACH ROW
EXECUTE FUNCTION "update_genre_games_count"();


-- Platform Trigger
CREATE OR REPLACE FUNCTION "update_platform_games_count"()
   RETURNS TRIGGER
   LANGUAGE plpgsql
AS
$trigger$
BEGIN
   -- When a game is added to a platform (INSERT)
   IF (TG_OP = 'INSERT') THEN
      UPDATE "platforms"
      SET "games_count" = "games_count" + 1
      WHERE "id" = NEW."platform_id";
      
      RETURN NEW;
   
   -- When a game is removed from a platform (DELETE)
   ELSIF (TG_OP = 'DELETE') THEN
      UPDATE "platforms"
      SET "games_count" = "games_count" - 1
      WHERE "id" = OLD."platform_id";
      
      RETURN OLD;
   END IF;
   
   RETURN NULL;
END;
$trigger$;

-- Trigger for INSERT operations
CREATE OR REPLACE TRIGGER "trigger_platform_game_added"
AFTER INSERT
ON "games_platforms"
FOR EACH ROW
EXECUTE FUNCTION "update_platform_games_count"();

-- Trigger for DELETE operations
CREATE OR REPLACE TRIGGER "trigger_platform_game_removed"
AFTER DELETE
ON "games_platforms"
FOR EACH ROW
EXECUTE FUNCTION "update_platform_games_count"();


-- Developer Trigger
CREATE OR REPLACE FUNCTION "update_developer_games_count"()
   RETURNS TRIGGER
   LANGUAGE plpgsql
AS
$trigger$
BEGIN
   -- When a game is added to a developer (INSERT)
   IF (TG_OP = 'INSERT') THEN
      UPDATE "developers"
      SET "games_count" = "games_count" + 1
      WHERE "id" = NEW."developer_id";
      
      RETURN NEW;
   
   -- When a game is removed from a developer (DELETE)
   ELSIF (TG_OP = 'DELETE') THEN
      UPDATE "developers"
      SET "games_count" = "games_count" - 1
      WHERE "id" = OLD."developer_id";
      
      RETURN OLD;
   END IF;
   
   RETURN NULL;
END;
$trigger$;

-- Trigger for INSERT operations
CREATE OR REPLACE TRIGGER "trigger_developer_game_added"
AFTER INSERT
ON "games_developers"
FOR EACH ROW
EXECUTE FUNCTION "update_developer_games_count"();

-- Trigger for DELETE operations
CREATE OR REPLACE TRIGGER "trigger_developer_game_removed"
AFTER DELETE
ON "games_developers"
FOR EACH ROW
EXECUTE FUNCTION "update_developer_games_count"();


-- Publisher Trigger
CREATE OR REPLACE FUNCTION "update_publisher_games_count"()
   RETURNS TRIGGER
   LANGUAGE plpgsql
AS
$trigger$
BEGIN
   -- When a game is added to a publisher (INSERT)
   IF (TG_OP = 'INSERT') THEN
      UPDATE "publishers"
      SET "games_count" = "games_count" + 1
      WHERE "id" = NEW."publisher_id";
      
      RETURN NEW;
   
   -- When a game is removed from a publisher (DELETE)
   ELSIF (TG_OP = 'DELETE') THEN
      UPDATE "publishers"
      SET "games_count" = "games_count" - 1
      WHERE "id" = OLD."publisher_id";
      
      RETURN OLD;
   END IF;
   
   RETURN NULL;
END;
$trigger$;

-- Trigger for INSERT operations
CREATE OR REPLACE TRIGGER "trigger_publisher_game_added"
AFTER INSERT
ON "games_publishers"
FOR EACH ROW
EXECUTE FUNCTION "update_publisher_games_count"();

-- Trigger for DELETE operations
CREATE OR REPLACE TRIGGER "trigger_publisher_game_removed"
AFTER DELETE
ON "games_publishers"
FOR EACH ROW
EXECUTE FUNCTION "update_publisher_games_count"();


-- Stock Trigger
CREATE OR REPLACE FUNCTION "update_game_quantity"()
   RETURNS TRIGGER
   LANGUAGE plpgsql
AS
$trigger$
BEGIN
   IF (TG_OP = 'INSERT') THEN
      IF (NOT NEW."is_sold") THEN
         UPDATE "games"
         SET "quantity" = "quantity" + 1
         WHERE "id" = NEW."game_id";
      END IF;

      RETURN NEW;
   
   ELSIF (TG_OP = 'DELETE') THEN
      IF (NOT OLD."is_sold") THEN
         UPDATE "games"
         SET "quantity" = "quantity" - 1
         WHERE "id" = OLD."game_id";
      END IF;
      
      RETURN OLD;
   
   ELSIF (TG_OP = 'UPDATE') THEN
      IF (NEW."is_sold" IS NOT NULL AND OLD."is_sold" IS NULL) THEN
         UPDATE "games"
         SET "quantity" = "quantity" - 1
         WHERE "id" = NEW."game_id";
      END IF;
      
      RETURN NEW;
   END IF;
   
   RETURN NULL;
END;
$trigger$;

-- Trigger for INSERT operations
CREATE OR REPLACE TRIGGER "trigger_stock_added"
AFTER INSERT
ON "stocks"
FOR EACH ROW
EXECUTE FUNCTION "update_game_quantity"();

-- Trigger for DELETE operations
CREATE OR REPLACE TRIGGER "trigger_stock_removed"
AFTER DELETE
ON "stocks"
FOR EACH ROW
EXECUTE FUNCTION "update_game_quantity"();

-- Trigger for UPDATE operations
CREATE OR REPLACE TRIGGER "trigger_stock_updated"
BEFORE UPDATE
ON "stocks"
FOR EACH ROW
EXECUTE FUNCTION "update_game_quantity"();


-- Review Vote Trigger
CREATE OR REPLACE FUNCTION "update_review_helpfulness_count"()
   RETURNS TRIGGER
   LANGUAGE plpgsql
AS
$trigger$
BEGIN
   IF (TG_OP = 'INSERT') THEN
      IF NEW."is_helpful" THEN
         UPDATE "reviews"
         SET "helpful_count" = "helpful_count" + 1
         WHERE "id" = NEW."review_id";
      ELSE
         UPDATE "reviews"
         SET "not_helpful_count" = "not_helpful_count" + 1
         WHERE "id" = NEW."review_id";
      END IF;
    
      RETURN NEW;
   
   ELSIF (TG_OP = 'DELETE') THEN
      IF OLD."is_helpful" THEN
         UPDATE "reviews"
         SET "helpful_count" = "helpful_count" - 1
         WHERE "id" = OLD."review_id";
      ELSE
         UPDATE "reviews"
         SET "not_helpful_count" = "not_helpful_count" - 1
         WHERE "id" = OLD."review_id";
      END IF;

      RETURN OLD;
   
   ELSIF (TG_OP = 'UPDATE') THEN
      IF NOT OLD."is_helpful" AND NEW."is_helpful" THEN
         UPDATE "reviews"
         SET "helpful_count" = "helpful_count" + 1, "not_helpful_count" = "not_helpful_count" - 1
         WHERE "id" = OLD."review_id";
      ELSIF OLD."is_helpful" AND NOT NEW."is_helpful" THEN
         UPDATE "reviews"
         SET "helpful_count" = "helpful_count" - 1, "not_helpful_count" = "not_helpful_count" + 1
         WHERE "id" = OLD."review_id";
      END IF;
      
      RETURN NEW;
   END IF;
   
   RETURN NULL;
END;
$trigger$;

-- Trigger for INSERT operations
CREATE OR REPLACE TRIGGER "trigger_review_vote_added"
AFTER INSERT
ON "review_votes"
FOR EACH ROW
EXECUTE FUNCTION "update_review_helpfulness_count"();

-- Trigger for DELETE operations
CREATE OR REPLACE TRIGGER "trigger_review_vote_removed"
AFTER DELETE
ON "review_votes"
FOR EACH ROW
EXECUTE FUNCTION "update_review_helpfulness_count"();

-- Trigger for UPDATE operations
CREATE OR REPLACE TRIGGER "trigger_review_vote_updated"
AFTER UPDATE
ON "review_votes"
FOR EACH ROW
EXECUTE FUNCTION "update_review_helpfulness_count"();


-- Session Update Trigger
CREATE OR REPLACE FUNCTION "update_session_validity"()
   RETURNS TRIGGER
   LANGUAGE plpgsql
AS
$trigger$
BEGIN
   -- Check if session has expired (more than 1 day since last seen)
   IF NEW."last_seen_at" < NOW() - INTERVAL '1 day' THEN
      NEW."is_unsafe" := TRUE;
      RETURN NEW;
   END IF;

   -- Check if IP address has changed
   IF OLD."last_ip_used" <> NEW."last_ip_used" THEN
      NEW."is_unsafe" := TRUE;
   END IF;

   -- Check if user agent has changed
   IF OLD."last_ua_used" <> NEW."last_ua_used" THEN
      NEW."is_unsafe" := TRUE;
   END IF;

   -- Check if country has changed
   IF OLD."last_country" <> NEW."last_country" THEN
      NEW."is_unsafe" := TRUE;
   END IF;
   
   RETURN NEW;
END;
$trigger$;

-- Trigger for UPDATE operations
CREATE OR REPLACE TRIGGER "trigger_session_updated"
BEFORE UPDATE
ON "sessions"
FOR EACH ROW
EXECUTE FUNCTION "update_session_validity"();


-- Create User's Cart Trigger
CREATE OR REPLACE FUNCTION "create_user_cart"()
   RETURNS TRIGGER
   LANGUAGE plpgsql
AS
$trigger$
DECLARE
   newCartId UUID;
BEGIN
   -- Create a cart for the new user and capture the generated UUID
   INSERT INTO "carts" DEFAULT VALUES RETURNING "id" INTO newCartId;

   NEW."cart_id" := newCartId;

   RETURN NEW;
END;
$trigger$;

-- Trigger for INSERT operations
CREATE OR REPLACE TRIGGER "trigger_create_cart_on_customer_insert"
BEFORE INSERT
ON "users"
FOR EACH ROW
EXECUTE FUNCTION "create_user_cart"();


-- Discount Scope Trigger
CREATE OR REPLACE FUNCTION "check_discount_scope"()
   RETURNS TRIGGER
   LANGUAGE plpgsql
AS
$trigger$
BEGIN
   IF NEW."scope" = 'private' THEN
      RAISE EXCEPTION 'Private discounts should not be publicly listed.';
   END IF;

   RETURN NEW;
END;
$trigger$;

-- Trigger for INSERT operations
CREATE OR REPLACE TRIGGER "trigger_discount_scope_check"
BEFORE INSERT
ON "games_discounts"
FOR EACH ROW
EXECUTE FUNCTION "check_discount_scope"();


-- Cart Unreservation Trigger
-- When a cart is unreserved, restore game quantities if transaction wasn't completed
CREATE OR REPLACE FUNCTION "handle_cart_unreservation"()
   RETURNS TRIGGER
   LANGUAGE plpgsql
AS
$trigger$
BEGIN
   -- If cart is being unreserved (was reserved, now not reserved)
   IF OLD."is_reserved" = TRUE AND NEW."is_reserved" = FALSE THEN
      -- Only restore quantities if transaction was NOT completed
      IF NEW."transaction_status" IS NULL OR NEW."transaction_status" != 'completed' THEN
         -- Restore game quantities for all items in this cart
         UPDATE "games" g
         SET "quantity" = g."quantity" + cg."quantity"
         FROM "carts_games" cg
         WHERE cg."cart_id" = NEW."id"
         AND cg."game_id" = g."id";
      END IF;
   END IF;
   
   RETURN NEW;
END;
$trigger$;

-- Trigger for UPDATE operations on cart
CREATE OR REPLACE TRIGGER "trigger_cart_unreservation"
AFTER UPDATE
ON "carts"
FOR EACH ROW
WHEN (OLD."is_reserved" IS DISTINCT FROM NEW."is_reserved")
EXECUTE FUNCTION "handle_cart_unreservation"();


-- Cart Reservation Quantity Deduction Trigger
-- When a cart is reserved, deduct quantities immediately
CREATE OR REPLACE FUNCTION "handle_cart_reservation"()
   RETURNS TRIGGER
   LANGUAGE plpgsql
AS
$trigger$
BEGIN
   -- If cart is being reserved (was not reserved, now reserved)
   IF (OLD."is_reserved" = FALSE OR OLD."is_reserved" IS NULL) AND NEW."is_reserved" = TRUE THEN
      -- Deduct game quantities for all items in this cart
      UPDATE "games" g
      SET "quantity" = g."quantity" - cg."quantity"
      FROM "carts_games" cg
      WHERE cg."cart_id" = NEW."id"
      AND cg."game_id" = g."id";
   END IF;
   
   RETURN NEW;
END;
$trigger$;

-- Trigger for UPDATE operations on cart
CREATE OR REPLACE TRIGGER "trigger_cart_reservation"
AFTER UPDATE
ON "carts"
FOR EACH ROW
WHEN (OLD."is_reserved" IS DISTINCT FROM NEW."is_reserved")
EXECUTE FUNCTION "handle_cart_reservation"();


-- Ticket Trigger
CREATE OR REPLACE FUNCTION "add_customer_id_to_ticket"()
   RETURNS TRIGGER
   LANGUAGE plpgsql
AS
$trigger$
BEGIN
   -- When a ticket is created, link it to the user if email matches
   SELECT c."id" INTO NEW."user_id"
   FROM "users" c
   WHERE c."email" = NEW."email"
   LIMIT 1;
   RETURN NEW;
END;
$trigger$;

-- Trigger for INSERT operations
CREATE OR REPLACE TRIGGER "trigger_add_customer_id_to_ticket"
BEFORE INSERT
ON "tickets"
FOR EACH ROW
WHEN (NEW."user_id" IS NULL)
EXECUTE FUNCTION "add_customer_id_to_ticket"();