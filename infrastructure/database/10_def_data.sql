

WITH new_user AS (
	INSERT INTO users(username, email, password, wallet)
	VALUES('Admin', 'admin@admin.dev', 'Admin123&', 1000::NUMERIC)
	RETURNING id
)
INSERT INTO employees(id, role, created_by)
SELECT id, 'superadmin', id
FROM new_user;