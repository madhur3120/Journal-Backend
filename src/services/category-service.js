const { StatusCodes } = require("http-status-codes");
const { CategoryRepository } = require("../repositories");
const AppError = require("../utils/errors/app-error");

const categoryRepository = new CategoryRepository();

/**
 * Create a new category
 * @param {Object} data - Category data { name, description }
 * @returns {number} Created category ID
 */
async function createCategory(data) {
    try {
        const existing = await categoryRepository.getByName(data.name);
        if (existing) {
            throw new AppError('Category with this name already exists', StatusCodes.CONFLICT);
        }
        const categoryId = await categoryRepository.create({
            name: data.name,
            description: data.description || null
        });
        return categoryId;
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError('Failed to create category', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

/**
 * Get all categories
 * @returns {Array} List of all categories
 */
async function getAllCategories() {
    try {
        const categories = await categoryRepository.getAll();
        return categories;
    } catch (error) {
        throw new AppError('Failed to fetch categories', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

/**
 * Get category by ID
 * @param {number} id - Category ID
 * @returns {Object} Category object
 */
async function getCategoryById(id) {
    try {
        const category = await categoryRepository.getById(id);
        if (!category) {
            throw new AppError('Category not found', StatusCodes.NOT_FOUND);
        }
        return category;
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError('Failed to fetch category', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

/**
 * Update a category
 * @param {number} id - Category ID
 * @param {Object} data - Updated category data
 * @returns {boolean} Success status
 */
async function updateCategory(id, data) {
    try {
        const category = await categoryRepository.getById(id);
        if (!category) {
            throw new AppError('Category not found', StatusCodes.NOT_FOUND);
        }
        const result = await categoryRepository.updateById(id, data);
        return result;
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError('Failed to update category', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

/**
 * Delete a category
 * @param {number} id - Category ID
 * @returns {boolean} Success status
 */
async function deleteCategory(id) {
    try {
        const category = await categoryRepository.getById(id);
        if (!category) {
            throw new AppError('Category not found', StatusCodes.NOT_FOUND);
        }
        const result = await categoryRepository.deleteById(id);
        return result;
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError('Failed to delete category', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};
