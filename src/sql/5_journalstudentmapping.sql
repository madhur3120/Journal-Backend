CREATE TABLE
    IF NOT EXISTS journalstudentmapping (
        id INT PRIMARY KEY AUTO_INCREMENT,
        journal_id INT,
        student_id INT,
        FOREIGN KEY (journal_id) REFERENCES journals(id) ON DELETE CASCADE,
        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
    );