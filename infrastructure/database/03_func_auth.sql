CREATE OR REPLACE FUNCTION "LoginWithEmail"(pEmail VARCHAR(255))
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
   WHERE c."email" = pEmail
   LIMIT 1;
END;
$$;

CREATE OR REPLACE FUNCTION "LoginWithPhone"(pWzc VARCHAR(3), pPhoneNumber VARCHAR(15))
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
    WHERE c."phoneWzc" = pWzc AND c."phoneNumber" = pPhoneNumber
    LIMIT 1;
END;
$$;

CREATE OR REPLACE FUNCTION "RegisterWithEmail"(pUsername VARCHAR(50), pPassword TEXT, pEmail VARCHAR(255))
RETURNS INT
LANGUAGE plpgsql
AS
$$
BEGIN
    IF (SELECT COUNT(*) FROM "User" WHERE "email" = pEmail) > 0 THEN
        RETURN 23505; -- Unique violation
    END IF;

    INSERT INTO "User" ("username", "password", "email")
    VALUES (pUsername, pPassword, pEmail);

    RETURN 0;
END;
$$;

CREATE OR REPLACE FUNCTION "RegisterWithPhone"(pUsername VARCHAR(50), pPassword TEXT, pPhoneWzc VARCHAR(3), pPhoneNumber VARCHAR(25))
RETURNS INT
LANGUAGE plpgsql
AS
$$
BEGIN
    IF (SELECT COUNT(*) FROM "User" WHERE "phoneWzc" = pPhoneWzc AND "phoneNumber" = pPhoneNumber) > 0 THEN
        RETURN 23505; -- Unique violation
    END IF;

    INSERT INTO "User" ("username", "password", "phoneWzc", "phoneNumber")
    VALUES (pUsername, pPassword, pPhoneWzc, pPhoneNumber);

    RETURN 0;
END;
$$;

CREATE OR REPLACE FUNCTION "PasswordResetRequest"(pEmail VARCHAR)
RETURNS UUID
LANGUAGE plpgsql
AS
$$
DECLARE
   vTicketId UUID := gen_random_uuid();
BEGIN
    INSERT INTO "Ticket"("id", "email", "reason", "content") VALUES(vTicketId, pEmail, 'PASSWORD RESET', 'This ticket has been automatically generated for password.\nPlease do not reply.\nIf you did not request a password reset, please ignore this ticket.\nOtherwise, please, follow <a href="https://placeholder.com/reset-password/' || vTicketId || '">this link</a> to reset your password.');
    RETURN vTicketId;
END;
$$;