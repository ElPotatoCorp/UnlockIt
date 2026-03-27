-- Price Functions
CREATE OR REPLACE FUNCTION "GetEffectivePrice"(pGameId BIGINT, pDiscountId BIGINT)
RETURNS NUMERIC(19,4)
LANGUAGE plpgsql
AS
$func$
DECLARE
   vGamePrice NUMERIC(19,4);
   vDiscountAmount INT;
   vDiscountCategory VARCHAR(50);
BEGIN
   SELECT "price"
   INTO vGamePrice
   FROM "Game"
   WHERE "id" = pGameId
   LIMIT 1;

   IF vGamePrice IS NULL THEN
      RAISE EXCEPTION 'Game % not found', pGameId;
   END IF;

   IF pDiscountId IS NULL THEN
      RETURN vGamePrice;
   END IF;

   SELECT "amount", "type"
   INTO vDiscountAmount, vDiscountCategory
   FROM "Discount"
   WHERE "id" = pDiscountId;

   IF vDiscountCategory = 'percentage' THEN
      RETURN ROUND(vGamePrice * (100::NUMERIC - vDiscountAmount::NUMERIC) / 100::NUMERIC, 4);
   ELSIF vDiscountCategory = 'fixed' THEN
      RETURN ROUND(GREATEST(0::NUMERIC, vGamePrice - vDiscountAmount::NUMERIC), 4);
   ELSE
      -- unknown type -> no discount (Should not go here since it is normally handled)
      RETURN vGamePrice;
   END IF;
END;
$func$;

CREATE OR REPLACE FUNCTION "ComputeTotalPrice"(pCartId UUID)
RETURNS NUMERIC(19,4)
LANGUAGE plpgsql
AS
$func$
DECLARE
   vTotalPrice NUMERIC(19,4) := 0;
   rCartGame RECORD;
BEGIN
   FOR rCartGame IN
      SELECT "gameId", "quantity"
      FROM "CartGame"
      WHERE "cartId" = pCartId
   LOOP
      -- discount not available for now; call effective price with NULL
      vTotalPrice := vTotalPrice + ("GetEffectivePrice"(rCartGame."gameId", NULL::BIGINT) * rCartGame."quantity");
   END LOOP;

   RETURN vTotalPrice;
END;
$func$;
