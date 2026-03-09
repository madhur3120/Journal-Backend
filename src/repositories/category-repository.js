const { DB } = require('../config');
const CrudRepository = require('./crud-repository');

/**
 * CategoryRepository
 * Handles database operations for journal categories
 */
class CategoryRepository extends CrudRepository {
    constructor() {
        super('categories');
    }

    /**
     * Get a category by ID
     * @param {number} id - Category ID
     * @returns {Object|null} Category object or null
     */
    async getById(id) {
        try {
            const [rows] = await DB.promise().query(
                `SELECT * FROM ${this.tableName} WHERE id = ?`,
                [id]
            );
            return rows[0] || null;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get all categories
     * @returns {Array} List of all categories
     */
    async getAll() {
        try {
            const [rows] = await DB.promise().query(
                `SELECT * FROM ${this.tableName} ORDER BY name ASC`
            );
            return rows;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get category by name
     * @param {string} name - Category name
     * @returns {Object|null} Category object or null
     */
    async getByName(name) {
        try {
            const [rows] = await DB.promise().query(
                `SELECT * FROM ${this.tableName} WHERE name = ?`,
                [name]
            );
            return rows[0] || null;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = CategoryRepository;
