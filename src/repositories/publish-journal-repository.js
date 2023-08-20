const { DB } = require('../config');
const CrudRepository = require('./crud-repository');

class PublishJournalRepository extends CrudRepository {
    constructor() {
        super('publishjournals');
    }
    async getById(id) {
        try {
            const [rows] = await DB.promise().query(`SELECT * FROM ${this.tableName} WHERE id = ?`, [id]);
            return rows[0]; 
        } catch (error) {
            throw error;
        }
    }
    async publishById(journalId) {
        try {
            const [checkRows] = await DB.promise().query(`SELECT id FROM ${this.tableName} WHERE journal_id = ?`, [journalId]);

            if (checkRows && checkRows.length > 0) {
                await DB.promise().query(`UPDATE ${this.tableName} SET published_at = NOW() WHERE journal_id = ?`, [journalId]);
            } else {
                await DB.promise().query(`INSERT INTO ${this.tableName} (journal_id, published_at) VALUES (?, NOW())`, [journalId]);
            }
            return true;
        } catch (error) {
            console.error('Error in setPublishedDateByJournalId:', error);
            throw error;
        }
    }

}

module.exports = PublishJournalRepository;
