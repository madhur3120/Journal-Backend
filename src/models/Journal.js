const connection = require('../config/db')

const createJournalTable = () => {
    const createJournalTableSQL = `
        CREATE TABLE IF NOT EXISTS Journals (
            id INT AUTO_INCREMENT PRIMARY KEY,
            teacher_id INT,
            description TEXT,
            fileId VARCHAR(255) NOT NULL,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (teacher_id) REFERENCES Users(id)
        );
    `;

    connection.query(createJournalTableSQL, (err, results) => {
        if (err) throw err;
        console.log("Journal table created/verified.");
    });
};

const generateFileId = (currentCount) => {
    return "file" + (currentCount + 1); // Assuming count starts from 0
};

module.exports = {
    createJournalTable,
    generateFileId
};
