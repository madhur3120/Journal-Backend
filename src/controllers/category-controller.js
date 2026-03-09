const { StatusCodes } = require('http-status-codes');
const { CategoryService } = require("../services");
const { SuccessResponse, ErrorResponse } = require("../utils/commons");

/**
 * POST : /categories
 * Create a new category (Teacher only)
 */
async function createCategory(req, res) {
    try {
        const categoryData = {
            name: req.body.name,
            description: req.body.description
        };

        const categoryId = await CategoryService.createCategory(categoryData);
        
        SuccessResponse.data = { id: categoryId };
        SuccessResponse.message = "Category created successfully";
        return res
            .status(StatusCodes.CREATED)
            .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res
            .status(error.statusCode || StatusCodes.BAD_REQUEST)
            .json(ErrorResponse);
    }
}

/**
 * GET : /categories
 * Get all categories
 */
async function getAllCategories(req, res) {
    try {
        const categories = await CategoryService.getAllCategories();
        
        SuccessResponse.data = categories;
        return res
            .status(StatusCodes.OK)
            .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(ErrorResponse);
    }
}

/**
 * GET : /categories/:id
 * Get a category by ID
 */
async function getCategoryById(req, res) {
    try {
        const categoryId = req.params.id;
        const category = await CategoryService.getCategoryById(categoryId);
        
        SuccessResponse.data = category;
        return res
            .status(StatusCodes.OK)
            .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(ErrorResponse);
    }
}

/**
 * PUT : /categories/:id
 * Update a category (Teacher only)
 */
async function updateCategory(req, res) {
    try {
        const categoryId = req.params.id;
        const updatedData = {
            name: req.body.name,
            description: req.body.description
        };

        // Remove undefined fields
        Object.keys(updatedData).forEach(key => 
            updatedData[key] === undefined && delete updatedData[key]
        );

        await CategoryService.updateCategory(categoryId, updatedData);
        
        SuccessResponse.message = "Category updated successfully";
        return res
            .status(StatusCodes.OK)
            .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(ErrorResponse);
    }
}

/**
 * DELETE : /categories/:id
 * Delete a category (Teacher only)
 */
async function deleteCategory(req, res) {
    try {
        const categoryId = req.params.id;
        await CategoryService.deleteCategory(categoryId);
        
        SuccessResponse.message = "Category deleted successfully";
        return res
            .status(StatusCodes.OK)
            .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(ErrorResponse);
    }
}

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};
