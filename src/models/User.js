const connection = require('../config/db')

const createUserTable = () => {
    const createUserTableSQL = `
        CREATE TABLE IF NOT EXISTS Users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            firstName VARCHAR(255) NOT NULL,
            lastName VARCHAR(255),
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role ENUM('Teacher', 'Student') NOT NULL
        );
    `;

    connection.query(createUserTableSQL, (err, results) => {
        if (err) throw err;
        console.log("User table created/verified.");
    });
};
module.exports = {
    createUserTable
};