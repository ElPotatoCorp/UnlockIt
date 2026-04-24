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