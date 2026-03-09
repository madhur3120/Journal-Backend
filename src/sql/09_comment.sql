-- create-comments-table.sql

CREATE TABLE
    IF NOT EXISTS comments (
        id INT PRIMARY KEY AUTO_INCREMENT,
        journal_id INT NOT NULL,
        user_id INT NOT NULL,
        parent_id INT DEFAULT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (journal_id) REFERENCES journals(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE,
        INDEX idx_comments_journal_id (journal_id),
        INDEX idx_comments_parent_id (parent_id)
    );
