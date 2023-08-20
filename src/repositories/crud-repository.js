const { DB } = require('../config');

class CrudRepository {
    constructor(tableName) {
        this.tableName = tableName;
    }

    async create(data) {
        const [result] = await DB.promise().query(`INSERT INTO ${this.tableName} SET ?`, data);
        return result.insertId;
    }

    async get(searchObject) {
        const columns = Object.keys(searchObject);
        const values = Object.values(searchObject);

        const conditions = columns.map(column => `${column} = ?`).join(' AND ');

        const query = `SELECT * FROM ${this.tableName} WHERE ${conditions}`;

        const [rows] = await DB.promise().query(query, values);
        return rows;
    }

    async updateById(id, data) {
        let sql = `UPDATE ${this.tableName} SET `;
        const values = [];
        for (const [key, value] of Object.entries(data)) {
            sql += `${key} = ?,`;
            values.push(value);
        }
        sql = sql.slice(0, -1) + ' WHERE id = ?';
        values.push(id);
        const [result] = await DB.promise().query(sql, values);
        return result.affectedRows > 0;
    }

    async deleteById(id) {
        const [result] = await DB.promise().query(`DELETE FROM ${this.tableName} WHERE id = ?`, [id]);
        return result.affectedRows > 0;
    }
}

module.exports = CrudRepository;
