const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');
const ServerConfig = require('./server-config');

const connection = mysql.createConnection({
    host: ServerConfig.DB_HOST,
    user: ServerConfig.DB_USER,
    password: ServerConfig.DB_PASS,
    port: 3306,
    database: ServerConfig.DB_NAME
});

connection.connect();

const createDatabaseQuery = `CREATE DATABASE IF NOT EXISTS ${ServerConfig.DB_NAME}`;

connection.query(createDatabaseQuery, (error, results, fields) => {
    if (error) throw error;
    connection.changeUser({ database: ServerConfig.DB_NAME }, (useError) => {
        if (useError) throw useError;
        const sqlFilesPath = path.join(__dirname, '..', 'sql');
        executeSqlFilesInDirectory(sqlFilesPath);
    });
});

function executeSqlFilesInDirectory(directoryPath) {
    const sqlFiles = fs.readdirSync(directoryPath).filter(file => file.endsWith('.sql'));
    sqlFiles.forEach(sqlFile => {
        const filePath = path.join(directoryPath, sqlFile);
        const sql = fs.readFileSync(filePath, 'utf8');

        connection.query(sql, (error, results, fields) => {
            if (error) throw error;
        });
    });
}

module.exports = connection;
