CREATE OR REPLACE FUNCTION "CreateReview"(
    pCustomerId UUID,
    pGameId BIGINT,
    pRating SMALLINT,
    pContent TEXT
)
RETURNS UUID
LANGUAGE plpgsql
AS
$$
DECLARE
    vReviewId UUID;
BEGIN
    IF NOT "GameExists"(pGameId) THEN
        RAISE EXCEPTION 'Game does not exist';
    END IF;

    INSERT INTO "Review"("userId", "gameId", "rating", "content")
    VALUES (pCustomerId, pGameId, pRating, pContent)
    RETURNING "id" INTO vReviewId;

    RETURN vReviewId;
END;
$$;

CREATE OR REPLACE FUNCTION "GetGameReviews"(pGameId BIGINT)
RETURNS TABLE(
    "reviewId" UUID,
    "publicId" UUID,
    "username" VARCHAR(50),
    "profilePicture" VARCHAR(255),
    "content" TEXT,
    "rating" SMALLINT,
    "createdAt" TIMESTAMP,
    "helpfulCount" INT,
    "notHelpfulCount" INT
)
LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN QUERY
    SELECT 
        r."id" AS "reviewId",
        c."publicId",
        c."username",
        c."profilePicture",
        r."content",
        r."rating",
        r."creationDate",
        r."helpfulCount",
        r."notHelpfulCount"
    FROM "Review" r
    INNER JOIN "User" c ON r."userId" = c."id"
    WHERE r."gameId" = pGameId
    ORDER BY r."creationDate" DESC;
END;
$$;

CREATE OR REPLACE FUNCTION "GetUserReviews"(pCustomerId UUID, pGameId BIGINT)
RETURNS TABLE(
    "reviewId" UUID,
    "publicId" UUID,
    "username" VARCHAR(50),
    "profilePicture" VARCHAR(255),
    "content" TEXT,
    "rating" SMALLINT,
    "createdAt" TIMESTAMP,
    "helpfulCount" INT,
    "notHelpfulCount" INT
)
LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN QUERY
    SELECT 
        r."id" AS "reviewId",
        c."publicId",
        c."username",
        c."profilePicture",
        r."content",
        r."rating",
        r."creationDate",
        r."helpfulCount",
        r."notHelpfulCount"
    FROM "Review" r
    INNER JOIN "User" c ON r."userId" = c."id"
    WHERE r."userId" = pCustomerId
      AND (pGameId IS NULL OR r."gameId" = pGameId);
END;
$$;

CREATE OR REPLACE FUNCTION "UserHasReviewedGame"(pCustomerId UUID, pGameId BIGINT)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM "Review" 
        WHERE "userId" = pCustomerId 
        AND "gameId" = pGameId
    );
END;
$$;

CREATE OR REPLACE FUNCTION "GetReviewById"(pReviewId UUID)
RETURNS TABLE(
    "id" UUID,
    "userId" UUID,
    "gameId" BIGINT,
    "rating" SMALLINT,
    "content" TEXT,
    "creationDate" TIMESTAMP,
    "helpfulCount" INT,
    "notHelpfulCount" INT
)
LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN QUERY
    SELECT 
        r."id",
        r."userId",
        r."gameId",
        r."rating",
        r."content",
        r."creationDate",
        r."helpfulCount",
        r."notHelpfulCount"
    FROM "Review" r
    WHERE r."id" = pReviewId;
END;
$$;

CREATE OR REPLACE FUNCTION "UpdateReview"(
    pReviewId UUID,
    pCustomerId UUID,
    pRating SMALLINT,
    pContent TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS
$$
DECLARE
    vOwnerId UUID;
BEGIN
    SELECT "userId" INTO vOwnerId
    FROM "Review"
    WHERE "id" = pReviewId;

    IF vOwnerId IS NULL THEN
        RETURN FALSE;
    END IF;

    IF vOwnerId != pCustomerId THEN
        RAISE EXCEPTION 'Unauthorized: User is not the owner of this review';
    END IF;

    UPDATE "Review"
    SET "rating" = pRating,
        "content" = pContent
    WHERE "id" = pReviewId;

    RETURN TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION "DeleteReview"(pReviewId UUID, pCustomerId UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS
$$
DECLARE
    vOwnerId UUID;
BEGIN
    SELECT "userId" INTO vOwnerId
    FROM "Review"
    WHERE "id" = pReviewId;

    IF vOwnerId IS NULL THEN
        RETURN FALSE;
    END IF;

    IF vOwnerId != pCustomerId THEN
        RAISE EXCEPTION 'Unauthorized: User is not the owner of this review';
    END IF;

    DELETE FROM "Review"
    WHERE "id" = pReviewId;

    RETURN TRUE;
END;
$$;
