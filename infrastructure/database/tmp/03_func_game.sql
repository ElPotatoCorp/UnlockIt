CREATE OR REPLACE FUNCTION "GameExists"(pGameId BIGINT)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM "Game" WHERE "id" = pGameId
    );
END;
$$;

CREATE OR REPLACE FUNCTION "IsGameAvailable"(pGameId BIGINT, pQuantity INT)
RETURNS TABLE(
    "available" BOOLEAN,
    "quantity" INT
)
LANGUAGE plpgsql
AS
$$
DECLARE
    vGameQuantity INT;
BEGIN
    SELECT g."quantity" INTO vGameQuantity FROM "Game" g WHERE g."id" = pGameId;

    RETURN QUERY
    SELECT vGameQuantity >= pQuantity, vGameQuantity;
END;
$$;

CREATE OR REPLACE FUNCTION "GetGameFullById"(pGameId BIGINT)
RETURNS SETOF "Game"
LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN QUERY
    SELECT g.*
    FROM "Game" g
    WHERE g."id" = pGameId;
END;
$$;

CREATE OR REPLACE FUNCTION "GetGames"(pLimit INT, pOffset INT)
RETURNS TABLE(
    "id" BIGINT,
    "name" TEXT,
    "shortDescription" TEXT,
    "price" NUMERIC(19,4),
    "headerImage" TEXT
)
LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN QUERY
    SELECT g."id", g."name"::text, g."shortDescription"::text, g."price", g."headerImage"::text
    FROM "Game" g
    ORDER BY g."id"
    LIMIT pLimit
    OFFSET pOffset;
END;
$$;

CREATE OR REPLACE FUNCTION "GetGameBasicInfo"(pGameId BIGINT)
RETURNS TABLE(
    "id" BIGINT,
    "name" TEXT,
    "price" NUMERIC(19,4),
    "headerImage" TEXT
)
LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN QUERY
    SELECT g."id", g."name"::text, g."price", g."headerImage"::text
    FROM "Game" g
    WHERE g."id" = pGameId;
END;
$$;

CREATE OR REPLACE FUNCTION "CountGames"()
RETURNS BIGINT
LANGUAGE plpgsql
AS
$$
DECLARE
    vCount BIGINT;
BEGIN
    SELECT COUNT(*) INTO vCount FROM "Game";
    RETURN vCount;
END;
$$;

CREATE OR REPLACE FUNCTION "GetGameCategories"(pGameId BIGINT)
RETURNS SETOF "Type"
LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN QUERY
    SELECT c.*
    FROM "Type" c
    INNER JOIN "GameType" gc ON c."id" = gc."typeId"
    WHERE gc."gameId" = pGameId;
END;
$$;

CREATE OR REPLACE FUNCTION "GetGameGenres"(pGameId BIGINT)
RETURNS SETOF "Genre"
LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN QUERY
    SELECT g.*
    FROM "Genre" g
    INNER JOIN "GameGenre" gg ON g."id" = gg."genreId"
    WHERE gg."gameId" = pGameId;
END;
$$;

CREATE OR REPLACE FUNCTION "GetGamePlatforms"(pGameId BIGINT)
RETURNS SETOF "Platform"
LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN QUERY
    SELECT p.*
    FROM "Platform" p
    INNER JOIN "GamePlatform" gp ON p."id" = gp."platformId"
    WHERE gp."gameId" = pGameId;
END;
$$;

CREATE OR REPLACE FUNCTION "GetGameDevelopers"(pGameId BIGINT)
RETURNS SETOF "Developer"
LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN QUERY
    SELECT d.*
    FROM "Developer" d
    INNER JOIN "GameDeveloper" gd ON d."id" = gd."developerId"
    WHERE gd."gameId" = pGameId;
END;
$$;

CREATE OR REPLACE FUNCTION "GetGamePublishers"(pGameId BIGINT)
RETURNS SETOF "Publisher"
LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN QUERY
    SELECT p.*
    FROM "Publisher" p
    INNER JOIN "GamePublisher" gp ON p."id" = gp."publisherId"
    WHERE gp."gameId" = pGameId;
END;
$$;

CREATE OR REPLACE FUNCTION "GetGameMedia"(pGameId BIGINT)
RETURNS SETOF "Media"
LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN QUERY
    SELECT m.*
    FROM "Media" m
    WHERE m."gameId" = pGameId
    ORDER BY (m."type" != 'vid'), m."type";
END;
$$;