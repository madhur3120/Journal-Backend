-- create-journals-table.sql

CREATE TABLE
    IF NOT EXISTS journals (
        id INT PRIMARY KEY AUTO_INCREMENT,
        teacher_id INT NOT NULL,
        description TEXT NOT NULL,
        attachment_id INT,
        FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (attachment_id) REFERENCES attachments(id) ON DELETE
        SET NULL
    );