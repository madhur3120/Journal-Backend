-- create-publishjournals-table.sql

CREATE TABLE
    IF NOT EXISTS publishjournals (
        id INT PRIMARY KEY AUTO_INCREMENT,
        journal_id INT,
        published_at DATETIME,
        FOREIGN KEY (journal_id) REFERENCES journals(id) ON DELETE CASCADE
    );