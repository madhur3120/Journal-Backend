const { DB } = require('../config');
const CrudRepository = require('./crud-repository');

/**
 * ReadReceiptRepository
 * Handles database operations for journal read receipts
 */
class ReadReceiptRepository extends CrudRepository {
    constructor() {
        super('read_receipts');
    }

    /**
     * Mark a journal as read by a student
     * Uses INSERT IGNORE to handle duplicate reads gracefully
     * @param {number} journalId - Journal ID
     * @param {number} studentId - Student ID
     * @returns {number|null} Insert ID or null if already exists
     */
    async markAsRead(journalId, studentId) {
        try {
            const [result] = await DB.promise().query(
                `INSERT IGNORE INTO ${this.tableName} (journal_id, student_id) VALUES (?, ?)`,
                [journalId, studentId]
            );
            return result.insertId || null;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Check if a student has read a journal
     * @param {number} journalId - Journal ID
     * @param {number} studentId - Student ID
     * @returns {Object|null} Read receipt or null
     */
    async hasRead(journalId, studentId) {
        try {
            const [rows] = await DB.promise().query(
                `SELECT * FROM ${this.tableName} WHERE journal_id = ? AND student_id = ?`,
                [journalId, studentId]
            );
            return rows[0] || null;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get all students who have read a journal
     * @param {number} journalId - Journal ID
     * @returns {Array} List of read receipts with student info
     */
    async getReadersForJournal(journalId) {
        try {
            const [rows] = await DB.promise().query(
                `SELECT rr.*, u.first_name, u.last_name, u.email
                 FROM ${this.tableName} rr
                 JOIN users u ON rr.student_id = u.id
                 WHERE rr.journal_id = ?
                 ORDER BY rr.read_at DESC`,
                [journalId]
            );
            return rows;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get read statistics for a journal
     * @param {number} journalId - Journal ID
     * @returns {Object} Read statistics { totalReaders, totalTagged, readPercentage }
     */
    async getReadStats(journalId) {
        try {
            const [readCount] = await DB.promise().query(
                `SELECT COUNT(*) as count FROM ${this.tableName} WHERE journal_id = ?`,
                [journalId]
            );

            const [taggedCount] = await DB.promise().query(
                `SELECT COUNT(*) as count FROM journal_student_mappings WHERE journal_id = ?`,
                [journalId]
            );

            const totalReaders = readCount[0].count;
            const totalTagged = taggedCount[0].count;
            const readPercentage = totalTagged > 0 
                ? Math.round((totalReaders / totalTagged) * 100) 
                : 0;

            return {
                totalReaders,
                totalTagged,
                readPercentage
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get all journals read by a student
     * @param {number} studentId - Student ID
     * @returns {Array} List of read journal IDs with timestamps
     */
    async getReadJournalsByStudent(studentId) {
        try {
            const [rows] = await DB.promise().query(
                `SELECT journal_id, read_at FROM ${this.tableName} WHERE student_id = ?`,
                [studentId]
            );
            return rows;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get unread journals for a student
     * @param {number} studentId - Student ID
     * @returns {Array} List of unread journal IDs
     */
    async getUnreadJournalsByStudent(studentId) {
        try {
            const [rows] = await DB.promise().query(
                `SELECT jsm.journal_id 
                 FROM journal_student_mappings jsm
                 LEFT JOIN ${this.tableName} rr 
                    ON jsm.journal_id = rr.journal_id AND rr.student_id = ?
                 JOIN publish_journals pj ON jsm.journal_id = pj.journal_id
                 WHERE jsm.student_id = ? 
                    AND rr.id IS NULL 
                    AND pj.published_at <= NOW()`,
                [studentId, studentId]
            );
            return rows.map(row => row.journal_id);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = ReadReceiptRepository;
