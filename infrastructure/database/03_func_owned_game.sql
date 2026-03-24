CREATE OR REPLACE FUNCTION "GetOwnedGamesByUser"(pUserId UUID)
RETURNS TABLE(
    "purchaseId" UUID,
    "effectivePrice" NUMERIC,
    "purchaseDate" TIMESTAMPTZ,
    "gameId" BIGINT,
    "gameName" TEXT,
    "currentPrice" NUMERIC,
    "headerImage" TEXT
)
LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN QUERY
    SELECT
        o."id",
        o."effectivePrice",
        o."purchaseDate"::TIMESTAMPTZ,
        g."id",
        g."name"::TEXT,
        g."price",
        g."headerImage"::TEXT
    FROM "Purchase" o
    INNER JOIN "Game" g ON o."gameId" = g."id"
    WHERE o."userId" = pUserId
    ORDER BY o."purchaseDate" DESC;
END;
$$;

CREATE OR REPLACE FUNCTION "GetOwnedGameByPurchaseId"(pUserId UUID, pPurchaseId UUID)
RETURNS TABLE(
    "effectivePrice" NUMERIC,
    "purchaseDate" TIMESTAMPTZ,
    "gameId" BIGINT,
    "gameName" TEXT,
    "currentPrice" NUMERIC,
    "shortDescription" TEXT,
    "headerImage" TEXT
)
LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN QUERY
    SELECT
        o."effectivePrice",
        o."purchaseDate"::TIMESTAMPTZ,
        g."id",
        g."name"::TEXT,
        g."price",
        g."shortDescription"::TEXT,
        g."headerImage"::TEXT
    FROM "Purchase" o
    INNER JOIN "Game" g ON o."gameId" = g."id"
    WHERE o."userId" = pUserId AND o."id" = pPurchaseId;
END;
$$;

CREATE OR REPLACE FUNCTION "GetKeyProductByPurchaseId"(pUserId UUID, pPurchaseId UUID)
RETURNS TEXT
LANGUAGE plpgsql
AS
$$
DECLARE
    vKey TEXT;
BEGIN
    SELECT "productKey"::TEXT INTO vKey
    FROM "Purchase"
    WHERE "userId" = pUserId AND "id" = pPurchaseId
    LIMIT 1;

    RETURN vKey;
END;
$$;

CREATE OR REPLACE FUNCTION "OwnsGame"(pUserId UUID, pGameId BIGINT)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN EXISTS(
        SELECT 1 FROM "Purchase" WHERE "userId" = pUserId AND "gameId" = pGameId
    );
END;
$$;

CREATE OR REPLACE FUNCTION "CountOwnedGames"(pUserId UUID)
RETURNS BIGINT
LANGUAGE plpgsql
AS
$$
DECLARE
    vTotal BIGINT;
BEGIN
    SELECT COUNT(*)::BIGINT INTO vTotal FROM "Purchase" WHERE "userId" = pUserId;
    RETURN vTotal;
END;
$$;