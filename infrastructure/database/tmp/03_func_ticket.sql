CREATE OR REPLACE FUNCTION "GetEmailFromTicketId"(pTicketId UUID)
RETURNS VARCHAR
LANGUAGE plpgsql
AS
$$
DECLARE
   vEmail VARCHAR;
BEGIN
    SELECT t."email" INTO vEmail
    FROM "Ticket" t
    WHERE t."id" = pTicketId
    LIMIT 1;
    RETURN vEmail;
END;
$$;

CREATE OR REPLACE FUNCTION "GetCustomerIdFromTicketId"(pTicketId UUID)
RETURNS UUID
LANGUAGE plpgsql
AS
$$
DECLARE
   vCustomerId UUID;
BEGIN
    SELECT t."userId" INTO vCustomerId
    FROM "Ticket" t
    WHERE t."id" = pTicketId
    LIMIT 1;
    RETURN vCustomerId;
END;
$$;
