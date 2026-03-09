const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');
const ServerConfig = require('./server-config');

const connection = mysql.createConnection({
    host: ServerConfig.DB_HOST,
    user: ServerConfig.DB_USER,
    password: ServerConfig.DB_PASS,
    port: 3306,
    database: ServerConfig.DB_NAME,
    multipleStatements: true
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
    
    // Safe-to-ignore error codes during migrations
    const ignorableErrors = [
        'ER_DUP_FIELDNAME',     // Duplicate column name (column already exists)
        'ER_DUP_KEYNAME',       // Duplicate key name (index already exists)
        'ER_TABLE_EXISTS_ERROR', // Table already exists
        'ER_DUP_ENTRY'          // Duplicate entry for key (seed data already exists)
    ];

    sqlFiles.forEach(sqlFile => {
        const filePath = path.join(directoryPath, sqlFile);
        const sql = fs.readFileSync(filePath, 'utf8');

        connection.query(sql, (error, results, fields) => {
            if (error) {
                if (ignorableErrors.includes(error.code)) {
                    console.log(`[Migration] Skipped ${sqlFile}: ${error.sqlMessage}`);
                } else {
                    throw error;
                }
            }
        });
    });
}

module.exports = connection;
