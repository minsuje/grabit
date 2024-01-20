SELECT * FROM challenge;
SELECT * FROM users;




SELECT column_name, data_type, character_maximum_length
FROM INFORMATION_SCHEMA.COLUMNS
WHERE table_name = 'challenge';