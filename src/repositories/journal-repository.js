const { DB } = require('../config');
const CrudRepository = require('./crud-repository');

class JournalRepository extends CrudRepository {
    constructor() {
        super('journals');
    }
    async getById(id) {
        try {
            const [rows] = await DB.promise().query(`SELECT * FROM ${this.tableName} WHERE id = ?`, [id]);
            return rows[0]; 
        } catch (error) {
            throw error;
        }
    }
    async create(data) {
        const [rows] = await DB.promise().query(`SELECT role FROM users WHERE id = ?`, [data.teacher_id]);
        if (!rows.length) {
            throw new Error("User not found");
        }
        const userRole = rows[0].role;
        if (userRole !== "TEACHER") {
            throw new Error("Only teachers can create a journal");
        }
        const [result] = await DB.promise().query(`INSERT INTO ${this.tableName} SET ?`, data);
        return result.insertId;
    }

}

module.exports = JournalRepository;
