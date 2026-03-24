CREATE OR REPLACE FUNCTION "IsInWishlist"(pCustomerId UUID, pGameId BIGINT)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM "Wishlist"
        WHERE "userId" = pCustomerId AND "gameId" = pGameId
    );
END;
$$;

CREATE OR REPLACE FUNCTION "GetWishlistRaw"(pCustomerId UUID)
RETURNS SETOF "Wishlist"
LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN QUERY
    SELECT *
    FROM "Wishlist"
    WHERE "userId" = pCustomerId
    ORDER BY "addedAt" DESC;
END;
$$;

CREATE OR REPLACE FUNCTION "GetWishlistContents"(pCustomerId UUID)
RETURNS TABLE(
    "gameId" BIGINT,
    "name" TEXT,
    "price" NUMERIC(19,4),
    "headerImage" TEXT,
    "addedAt" TIMESTAMPTZ
)
LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN QUERY
    SELECT w."gameId", g."name"::TEXT, g."price", g."headerImage"::TEXT, w."addedAt"
    FROM "Wishlist" w
    JOIN "Game" g ON w."gameId" = g."id"
    WHERE w."userId" = pCustomerId
    ORDER BY w."addedAt" DESC;
END;
$$;

CREATE OR REPLACE FUNCTION "AddToWishlist"(pCustomerId UUID, pGameId BIGINT)
RETURNS INT
LANGUAGE plpgsql
AS
$$
BEGIN
    IF ("GameExists"(pGameId) IS FALSE) THEN
        RETURN 1;
    END IF;

    IF ("IsInWishlist"(pCustomerId, pGameId)) THEN
        RETURN 2;
    END IF;

    INSERT INTO "Wishlist" ("userId", "gameId") VALUES (pCustomerId, pGameId);
    RETURN 0;
END;
$$;

CREATE OR REPLACE FUNCTION "RemoveFromWishlist"(pCustomerId UUID, pGameId BIGINT)
RETURNS VOID
LANGUAGE plpgsql
AS
$$
BEGIN
   DELETE FROM "Wishlist" WHERE "userId" = pCustomerId AND "gameId" = pGameId;
END;
$$;