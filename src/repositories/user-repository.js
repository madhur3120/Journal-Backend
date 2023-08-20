const bcrypt = require('bcrypt');
const { DB } = require('../config');

const CrudRepository = require('./crud-repository');
const User = require('../models');

const { JWT } = require('../utils/commons')
const { generateToken } = JWT

class UserRepository extends CrudRepository {
    constructor() {
        super('users');
    }

    async register(data) {
        data.password = await bcrypt.hash(data.password, 10);
        const [result] = await DB.promise().query(`INSERT INTO ${this.tableName} SET ?`, data);
        const token = generateToken(result.insertId)
        return token;
    }

    async getById(id) {
        const [rows] = await DB.promise().query(`SELECT * FROM users_view WHERE id = ?`, [id]);
        return rows[0];
    }

    async findByEmail(email) {
        const [rows] = await DB.promise().query(`SELECT * FROM ${this.tableName} WHERE email = ?`, [email]);
        return rows[0];
    }
    async getTeacherFeed(searchObject) {
        const columns = Object.keys(searchObject);
        const values = Object.values(searchObject);

        const conditions = columns.map(column => `j.${column} = ?`).join(' AND ');

        const query = `
            SELECT j.teacher_id, j.description, a.url 
            FROM journals j
            LEFT JOIN attachments a ON j.attachment_id = a.id
            WHERE ${conditions};
        `;

        const [rows] = await DB.promise().query(query, values);
        return rows;
    }
    async getStudentFeed(searchObject) {
        const columns = Object.keys(searchObject);
        const values = Object.values(searchObject);

        const conditions = columns.map(column => `jsm.${column} = ?`).join(' AND ');

        const query = `
            SELECT j.id, j.teacher_id, j.description, a.url 
            FROM JournalStudentMapping jsm
            JOIN journals j ON jsm.journal_id = j.id
            LEFT JOIN attachments a ON j.attachment_id = a.id
            JOIN publishjournals pj ON j.id = pj.journal_id
            WHERE ${conditions} AND pj.published_at < NOW();
        `;

        const [rows] = await DB.promise().query(query, values);
        return rows;
    }


}

module.exports = UserRepository;
