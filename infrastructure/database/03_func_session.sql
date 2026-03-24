CREATE OR REPLACE FUNCTION "GetUserIdFromSession"(pSessionId UUID)
RETURNS UUID
LANGUAGE plpgsql
AS
$$
DECLARE
    vCustomerId UUID;
BEGIN
    SELECT s."userId" INTO vCustomerId FROM "Session" s WHERE s."id" = pSessionId;
    RETURN vCustomerId;
END;
$$;

CREATE OR REPLACE FUNCTION "CreateSession"(pCustomerId UUID, pLastIp INET, pLastUa VARCHAR, pLastCountry CHAR)
RETURNS UUID
LANGUAGE plpgsql
AS
$$
DECLARE
    vSessionId UUID;
BEGIN
    INSERT INTO "Session" ("userId", "lastIpUsed", "lastUaUsed", "lastCountry")
    VALUES (pCustomerId, pLastIp, left(pLastUa,64), upper(left(pLastCountry,2)))
    RETURNING "id" INTO vSessionId;
    RETURN vSessionId;
END;
$$;

CREATE OR REPLACE FUNCTION "GetSession"(pSessionId UUID)
RETURNS SETOF "Session"
LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN QUERY
    SELECT *
    FROM "Session" s
    WHERE s."id" = pSessionId;
END;
$$;

CREATE OR REPLACE FUNCTION "UpdateLastSeen"(pSessionId UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS
$$
BEGIN
    UPDATE "Session" SET "lastSeenAt" = NOW() WHERE "id" = pSessionId;
    RETURN TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION "UpdateSessionMetadata"(pSessionId UUID, pLastIp INET, pLastUa VARCHAR, pLastCountry CHAR)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS
$$
BEGIN
    IF (EXISTS (SELECT 1 FROM "Session" WHERE "id" = pSessionId AND "lastIpUsed" != pLastIp)) THEN
        UPDATE "Session" SET "isUnsafe" = TRUE WHERE "id" = pSessionId;
    END IF;
    UPDATE "Session"
    SET "lastIpUsed" = pLastIp,
        "lastUaUsed" = left(pLastUa,64),
        "lastCountry" = upper(left(pLastCountry,2)),
        "lastSeenAt" = NOW()
    WHERE "id" = pSessionId;
    RETURN TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION "DestroySession"(pSessionId UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS
$$
BEGIN
    DELETE FROM "Session" WHERE "id" = pSessionId;
    RETURN TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION "DestroyAllUserSessions"(pCustomerId UUID)
RETURNS INT
LANGUAGE plpgsql
AS
$$
DECLARE
    vCount INT := 0;
BEGIN
    DELETE FROM "Session" WHERE "userId" = pCustomerId RETURNING 1 INTO vCount;
    GET DIAGNOSTICS vCount = ROW_COUNT;
    RETURN vCount;
END;
$$;

CREATE OR REPLACE FUNCTION "MarkSessionUnsafe"(pSessionId UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS
$$
BEGIN
    UPDATE "Session" SET "isUnsafe" = TRUE WHERE "id" = pSessionId;
    RETURN TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION "GetUserSessions"(pCustomerId UUID)
RETURNS TABLE("sessionId" UUID, "createdAt" TIMESTAMP, "lastSeenAt" TIMESTAMP, "lastIpUsed" INET, "lastUaUsed" VARCHAR, "lastCountry" CHAR, "isUnsafe" BOOLEAN)
LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN QUERY
    SELECT s."id", s."createdAt", s."lastSeenAt", s."lastIpUsed", s."lastUaUsed", s."lastCountry", s."isUnsafe"
    FROM "Session" s
    WHERE s."userId" = pCustomerId
    ORDER BY s."lastSeenAt" DESC;
END;
$$;

CREATE OR REPLACE FUNCTION "CleanupOldSessions"(pDays INT)
RETURNS INT
LANGUAGE plpgsql
AS
$$
DECLARE
    vCount INT := 0;
BEGIN
    DELETE FROM "Session" WHERE "lastSeenAt" < NOW() - (pDays || ' days')::interval RETURNING 1 INTO vCount;
    GET DIAGNOSTICS vCount = ROW_COUNT;
    RETURN vCount;
END;
$$;
