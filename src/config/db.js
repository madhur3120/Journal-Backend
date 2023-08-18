const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config({ path: `../../.env` });

// Create a connection object
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

module.exports = connection;