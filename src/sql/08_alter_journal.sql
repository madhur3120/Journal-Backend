-- alter-journals-table.sql
-- Add category_id and is_draft columns to journals table
-- Note: Duplicate column errors are safely ignored by db-config.js

ALTER TABLE journals
    ADD COLUMN category_id INT DEFAULT NULL,
    ADD COLUMN is_draft BOOLEAN DEFAULT FALSE,
    ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
