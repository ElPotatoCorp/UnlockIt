-- Advanced search function with multiple filters
CREATE OR REPLACE FUNCTION "SearchGamesAdvanced"(
    pTerm TEXT,
    pMinPrice NUMERIC DEFAULT NULL,
    pMaxPrice NUMERIC DEFAULT NULL,
    pCategoryIds BIGINT[] DEFAULT NULL,
    pGenreIds BIGINT[] DEFAULT NULL,
    pPlatformIds BIGINT[] DEFAULT NULL,
    pDeveloperIds BIGINT[] DEFAULT NULL,
    pPublisherIds BIGINT[] DEFAULT NULL,
    pMinMetacritic INT DEFAULT NULL,
    pComingSoon BOOLEAN DEFAULT NULL,
    pSortBy VARCHAR DEFAULT 'name',
    pSortOrder VARCHAR DEFAULT 'asc',
    pLimit INT DEFAULT 20,
    pOffset INT DEFAULT 0
)
RETURNS TABLE(
    "id" BIGINT,
    "name" TEXT,
    "shortDescription" TEXT,
    "price" NUMERIC(19,4),
    "headerImage" TEXT,
    "releaseDate" TEXT,
    "metacritic" SMALLINT,
    "comingSoon" BOOLEAN
)
LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN QUERY
    WITH filtered_games AS (
        SELECT DISTINCT g.*
        FROM "Game" g
        LEFT JOIN "GameType" gc ON g."id" = gc."gameId"
        LEFT JOIN "GamePlatform" gp ON g."id" = gp."gameId"
        LEFT JOIN "GameDeveloper" gd ON g."id" = gd."gameId"
        LEFT JOIN "GamePublisher" gpu ON g."id" = gpu."gameId"
        WHERE
            -- Text search filter (by slug for better matching)
            (pTerm = '' OR pTerm IS NULL OR g."slug" ILIKE '%' || pTerm || '%')
            -- Price filters
            AND (pMinPrice IS NULL OR g."price" >= pMinPrice)
            AND (pMaxPrice IS NULL OR g."price" <= pMaxPrice)
            -- Type filter (game must have ALL of the specified categories)
            AND (pCategoryIds IS NULL OR ARRAY(SELECT gc."typeId" FROM "GameType" gc WHERE gc."gameId" = g."id") @> pCategoryIds)
            -- Genre filter (game must have ALL of the specified genres)
            AND (pGenreIds IS NULL OR ARRAY(SELECT gg."genreId" FROM "GameGenre" gg WHERE gg."gameId" = g."id") @> pGenreIds)
            -- Platform filter (game must have at least one of the specified platforms)
            AND (pPlatformIds IS NULL OR gp."platformId" = ANY(pPlatformIds))
            -- Developer filter (game must have at least one of the specified developers)
            AND (pDeveloperIds IS NULL OR gd."developerId" = ANY(pDeveloperIds))
            -- Publisher filter (game must have at least one of the specified publishers)
            AND (pPublisherIds IS NULL OR gpu."publisherId" = ANY(pPublisherIds))
            -- Metacritic filter
            AND (pMinMetacritic IS NULL OR g."metacritic" >= pMinMetacritic)
            -- Coming soon filter
            AND (pComingSoon IS NULL OR g."comingSoon" = pComingSoon)
    )
    SELECT
        fg."id",
        fg."name"::text,
        fg."shortDescription"::text,
        fg."price",
        fg."headerImage"::text,
        fg."releaseDate"::text,
        fg."metacritic",
        fg."comingSoon"
    FROM filtered_games fg
    ORDER BY
        CASE WHEN pSortBy = 'name' AND pSortOrder = 'asc' THEN fg."name" END ASC,
        CASE WHEN pSortBy = 'name' AND pSortOrder = 'desc' THEN fg."name" END DESC,
        CASE WHEN pSortBy = 'price' AND pSortOrder = 'asc' THEN fg."price" END ASC,
        CASE WHEN pSortBy = 'price' AND pSortOrder = 'desc' THEN fg."price" END DESC,
        CASE WHEN pSortBy = 'releaseDate' AND pSortOrder = 'asc' THEN fg."releaseDate" END ASC,
        CASE WHEN pSortBy = 'releaseDate' AND pSortOrder = 'desc' THEN fg."releaseDate" END DESC,
        CASE WHEN pSortBy = 'metacritic' AND pSortOrder = 'asc' THEN fg."metacritic" END ASC NULLS LAST,
        CASE WHEN pSortBy = 'metacritic' AND pSortOrder = 'desc' THEN fg."metacritic" END DESC NULLS LAST,
        fg."id" -- Secondary sort for consistency
    LIMIT pLimit
    OFFSET pOffset;
END;
$$;

-- Count search results with filters
CREATE OR REPLACE FUNCTION "CountSearchResults"(
    pTerm TEXT,
    pMinPrice NUMERIC DEFAULT NULL,
    pMaxPrice NUMERIC DEFAULT NULL,
    pCategoryIds BIGINT[] DEFAULT NULL,
    pGenreIds BIGINT[] DEFAULT NULL,
    pPlatformIds BIGINT[] DEFAULT NULL,
    pDeveloperIds BIGINT[] DEFAULT NULL,
    pPublisherIds BIGINT[] DEFAULT NULL,
    pMinMetacritic INT DEFAULT NULL,
    pComingSoon BOOLEAN DEFAULT NULL
)
RETURNS BIGINT
LANGUAGE plpgsql
AS
$$
DECLARE
    vCount BIGINT;
BEGIN
    SELECT COUNT(DISTINCT g."id") INTO vCount
    FROM "Game" g
    LEFT JOIN "GameType" gc ON g."id" = gc."gameId"
    LEFT JOIN "GamePlatform" gp ON g."id" = gp."gameId"
    LEFT JOIN "GameDeveloper" gd ON g."id" = gd."gameId"
    LEFT JOIN "GamePublisher" gpu ON g."id" = gpu."gameId"
    WHERE
        -- Text search filter (by slug for better matching)
        (pTerm = '' OR pTerm IS NULL OR g."slug" ILIKE '%' || pTerm || '%')
        -- Price filters
        AND (pMinPrice IS NULL OR g."price" >= pMinPrice)
        AND (pMaxPrice IS NULL OR g."price" <= pMaxPrice)
        -- Type filter (game must have ALL of the specified categories)
        AND (pCategoryIds IS NULL OR ARRAY(SELECT gc."typeId" FROM "GameType" gc WHERE gc."gameId" = g."id") @> pCategoryIds)
        -- Genre filter (game must have ALL of the specified genres)
        AND (pGenreIds IS NULL OR ARRAY(SELECT gg."genreId" FROM "GameGenre" gg WHERE gg."gameId" = g."id") @> pGenreIds)
        -- Platform filter
        AND (pPlatformIds IS NULL OR gp."platformId" = ANY(pPlatformIds))
        -- Developer filter
        AND (pDeveloperIds IS NULL OR gd."developerId" = ANY(pDeveloperIds))
        -- Publisher filter
        AND (pPublisherIds IS NULL OR gpu."publisherId" = ANY(pPublisherIds))
        -- Metacritic filter
        AND (pMinMetacritic IS NULL OR g."metacritic" >= pMinMetacritic)
        -- Coming soon filter
        AND (pComingSoon IS NULL OR g."comingSoon" = pComingSoon);

    RETURN vCount;
END;
$$;
