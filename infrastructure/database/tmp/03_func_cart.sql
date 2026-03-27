CREATE OR REPLACE FUNCTION "GetCartGameRaw"(pCartId UUID)
RETURNS SETOF "CartGame"
LANGUAGE plpgsql
AS
$$
BEGIN
	RETURN QUERY 
	SELECT *
	FROM "CartGame"
	WHERE "cartId" = pCartId;
END;
$$;

CREATE OR REPLACE FUNCTION "GetCartContents"(pCartId UUID)
RETURNS TABLE(
	"gameId" BIGINT,
	"quantity" INT,
	"toBuy" BOOLEAN,
	"addedAt" TIMESTAMPTZ,
	"name" TEXT,
	"price" NUMERIC(19,4),
	"headerImage" TEXT
)
LANGUAGE plpgsql
AS
$$
BEGIN
	RETURN QUERY
	SELECT cg."gameId", cg."quantity", cg."toBuy", cg."addedAt", g."name"::TEXT, g."price", g."headerImage"::TEXT
	FROM "CartGame" cg
	JOIN "Game" g ON cg."gameId" = g."id"
	WHERE cg."cartId" = pCartId
	ORDER BY cg."addedAt" DESC;
END;
$$;

CREATE OR REPLACE FUNCTION "AddToCart"(pCartId UUID, pGameId BIGINT, pQuantity INT)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS
$$
BEGIN
	IF EXISTS (SELECT 1 FROM "CartGame" WHERE "cartId" = pCartId AND "gameId" = pGameId) THEN
		UPDATE "CartGame"
		SET "quantity" = "quantity" + pQuantity
		WHERE "cartId" = pCartId AND "gameId" = pGameId;
	ELSE
		INSERT INTO "CartGame" ("cartId", "gameId", "quantity") VALUES (pCartId, pGameId, pQuantity);
	END IF;
	RETURN TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION "RemoveFromCart"(pCartId UUID, pGameId BIGINT)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS
$$
BEGIN
	DELETE FROM "CartGame" WHERE "cartId" = pCartId AND "gameId" = pGameId;
	RETURN TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION "SetCartQuantity"(pCartId UUID, pGameId BIGINT, pQuantity INT)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS
$$
BEGIN
	IF pQuantity < 1 THEN
		DELETE FROM "CartGame" WHERE "cartId" = pCartId AND "gameId" = pGameId;
		RETURN TRUE;
	END IF;

	IF EXISTS (SELECT 1 FROM "CartGame" WHERE "cartId" = pCartId AND "gameId" = pGameId) THEN
		UPDATE "CartGame" SET "quantity" = pQuantity WHERE "cartId" = pCartId AND "gameId" = pGameId;
	ELSE
		INSERT INTO "CartGame" ("cartId", "gameId", "quantity") VALUES (pCartId, pGameId, pQuantity);
	END IF;

	RETURN TRUE;
END;
$$;

