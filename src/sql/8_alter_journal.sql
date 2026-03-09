-- alter-journals-table.sql
-- Add category_id and is_draft columns to journals table

ALTER TABLE journals
    ADD COLUMN category_id INT DEFAULT NULL,
    ADD COLUMN is_draft BOOLEAN DEFAULT FALSE,
    ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ADD FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;
