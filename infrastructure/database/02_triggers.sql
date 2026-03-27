-- Password Hashing Trigger
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION "hash_customer_password"()
   RETURNS TRIGGER
   LANGUAGE plpgsql
AS
$trigger$
BEGIN
   -- Hash the password using bcrypt if it's not already hashed
   -- Bcrypt hashes start with $2a$, $2b$, or $2y$
   IF NEW."password" IS NOT NULL AND NEW."password" !~ '^\$2[aby]\$' THEN
      NEW."password" := crypt(NEW."password", gen_salt('bf', 15));
   END IF;
   
   RETURN NEW;
END;
$trigger$;

-- Trigger for INSERT operations
CREATE OR REPLACE TRIGGER "trigger_hash_password_on_insert"
BEFORE INSERT
ON "users"
FOR EACH ROW
EXECUTE FUNCTION "hash_customer_password"();

-- Trigger for UPDATE operations (in case password is changed)
CREATE OR REPLACE TRIGGER "trigger_hash_password_on_update"
BEFORE UPDATE
ON "users"
FOR EACH ROW
WHEN (OLD."password" IS DISTINCT FROM NEW."password")
EXECUTE FUNCTION "hash_customer_password"();

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