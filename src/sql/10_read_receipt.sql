-- create-read-receipts-table.sql

CREATE TABLE
    IF NOT EXISTS read_receipts (
        id INT PRIMARY KEY AUTO_INCREMENT,
        journal_id INT NOT NULL,
        student_id INT NOT NULL,
        read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (journal_id) REFERENCES journals(id) ON DELETE CASCADE,
        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_read (journal_id, student_id),
        INDEX idx_read_receipts_journal_id (journal_id),
        INDEX idx_read_receipts_student_id (student_id)
    );
