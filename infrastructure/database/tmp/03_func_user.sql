CREATE OR REPLACE FUNCTION "GetUserInfoFromId"(pCustomerId UUID)
RETURNS SETOF "User"
LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN QUERY
    SELECT *
    FROM "User" c
    WHERE c."id" = pCustomerId
    LIMIT 1;
END;
$$;

CREATE OR REPLACE FUNCTION "GetUserInfoFromEmail"(pEmail VARCHAR)
RETURNS SETOF "User"
LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN QUERY
    SELECT *
    FROM "User" c
    WHERE c."email" = pEmail
    LIMIT 1;
END;
$$;

CREATE OR REPLACE FUNCTION "GetUserSensitiveInfo"(pCustomerId UUID)
RETURNS TABLE(
    "id" UUID,
    "password" CHAR(60)
)
LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN QUERY
    SELECT c."id", c."password"
    FROM "User" c
    WHERE c."id" = pCustomerId
    LIMIT 1;
END;
$$;

CREATE OR REPLACE FUNCTION "GetUserPublicInfo"(pPublicId UUID)
RETURNS TABLE(
    "username" VARCHAR(50),
    "profilePicture" VARCHAR(255),
    "bio" TEXT,
    "numberOfGames" BIGINT,
    "numberOfReviews" BIGINT,
    "createdAt" TIMESTAMPTZ
)
LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN QUERY
    SELECT c."username", c."profilePicture", c."bio",
           (SELECT COUNT(*) FROM "Purchase" p WHERE p."userId" = c."id") AS "numberOfGames",
           (SELECT COUNT(*) FROM "Review" r WHERE r."userId" = c."id") AS "numberOfReviews",
           c."creationDate"::TIMESTAMPTZ
    FROM "User" c
    WHERE c."publicId" = pPublicId
    LIMIT 1;
END;
$$;

CREATE OR REPLACE FUNCTION "GetUserCartId"(pCustomerId UUID)
RETURNS UUID
LANGUAGE plpgsql
AS
$$
DECLARE
    vCartId UUID;
BEGIN
    SELECT c."cartId" INTO vCartId
    FROM "User" c
    WHERE c."id" = pCustomerId
    LIMIT 1;

    RETURN vCartId;
END;
$$;

CREATE OR REPLACE FUNCTION "ChangeUserPp"(pUserId UUID, pNewPath TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS
$$
DECLARE
    vOld TEXT;
BEGIN
    -- Lock the user row
    SELECT c."profilePicture" INTO vOld FROM "User" c WHERE c."id" = pUserId FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User % not found', pUserId;
    END IF;

    UPDATE "User" SET "profilePicture" = pNewPath WHERE "id" = pUserId;

    RETURN vOld;
END;
$$;

CREATE OR REPLACE FUNCTION "DeleteUserAccount"(pCustomerId UUID)
RETURNS VOID
LANGUAGE plpgsql
AS
$$
BEGIN
    DELETE FROM "User" c
    WHERE c."id" = pCustomerId;
END;
$$;