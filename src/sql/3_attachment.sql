-- create-attachments-table.sql

CREATE TABLE
    IF NOT EXISTS attachments (
        id INT PRIMARY KEY AUTO_INCREMENT,
        public_id VARCHAR(255) NOT NULL,
        url VARCHAR(255) NOT NULL
    );