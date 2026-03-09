const { DB } = require('../config');
const CrudRepository = require('./crud-repository');

/**
 * CommentRepository
 * Handles database operations for journal comments
 */
class CommentRepository extends CrudRepository {
    constructor() {
        super('comments');
    }

    /**
     * Get a comment by ID with user details
     * @param {number} id - Comment ID
     * @returns {Object|null} Comment object with user info or null
     */
    async getById(id) {
        try {
            const [rows] = await DB.promise().query(
                `SELECT c.*, u.first_name, u.last_name, u.role 
                 FROM ${this.tableName} c
                 JOIN users u ON c.user_id = u.id
                 WHERE c.id = ?`,
                [id]
            );
            return rows[0] || null;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get all comments for a journal (with nested structure)
     * @param {number} journalId - Journal ID
     * @returns {Array} List of comments with user details
     */
    async getByJournalId(journalId) {
        try {
            const [rows] = await DB.promise().query(
                `SELECT c.*, u.first_name, u.last_name, u.role 
                 FROM ${this.tableName} c
                 JOIN users u ON c.user_id = u.id
                 WHERE c.journal_id = ?
                 ORDER BY c.created_at ASC`,
                [journalId]
            );
            return this.buildCommentTree(rows);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get flat list of comments for a journal
     * @param {number} journalId - Journal ID
     * @returns {Array} Flat list of comments
     */
    async getFlatByJournalId(journalId) {
        try {
            const [rows] = await DB.promise().query(
                `SELECT c.*, u.first_name, u.last_name, u.role 
                 FROM ${this.tableName} c
                 JOIN users u ON c.user_id = u.id
                 WHERE c.journal_id = ?
                 ORDER BY c.created_at ASC`,
                [journalId]
            );
            return rows;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get comment count for a journal
     * @param {number} journalId - Journal ID
     * @returns {number} Comment count
     */
    async getCountByJournalId(journalId) {
        try {
            const [rows] = await DB.promise().query(
                `SELECT COUNT(*) as count FROM ${this.tableName} WHERE journal_id = ?`,
                [journalId]
            );
            return rows[0].count;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Check if user owns a comment
     * @param {number} commentId - Comment ID
     * @param {number} userId - User ID
     * @returns {boolean} True if user owns the comment
     */
    async isOwner(commentId, userId) {
        try {
            const [rows] = await DB.promise().query(
                `SELECT id FROM ${this.tableName} WHERE id = ? AND user_id = ?`,
                [commentId, userId]
            );
            return rows.length > 0;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Build nested comment tree from flat list
     * @param {Array} comments - Flat list of comments
     * @returns {Array} Nested comment tree
     */
    buildCommentTree(comments) {
        const commentMap = new Map();
        const rootComments = [];

        // First pass: create map of all comments
        comments.forEach(comment => {
            comment.replies = [];
            commentMap.set(comment.id, comment);
        });

        // Second pass: build tree structure
        comments.forEach(comment => {
            if (comment.parent_id === null) {
                rootComments.push(comment);
            } else {
                const parent = commentMap.get(comment.parent_id);
                if (parent) {
                    parent.replies.push(comment);
                }
            }
        });

        return rootComments;
    }
}

module.exports = CommentRepository;
