const express = require("express");

const { CategoryController } = require("../../controllers");
const { isAuthenticated, isAuthorized } = require("../../middlewares");
const { ENUMS } = require("../../utils/commons");
const { USER_TYPE } = ENUMS;

const router = express.Router();

// Get all categories (accessible to all authenticated users)
router.get("/", isAuthenticated, CategoryController.getAllCategories);

// Get category by ID (accessible to all authenticated users)
router.get("/:id", isAuthenticated, CategoryController.getCategoryById);

// Create category (Teacher only)
router.post("/", isAuthenticated, isAuthorized(USER_TYPE.TEACHER), CategoryController.createCategory);

// Update category (Teacher only)
router.put("/:id", isAuthenticated, isAuthorized(USER_TYPE.TEACHER), CategoryController.updateCategory);

// Delete category (Teacher only)
router.delete("/:id", isAuthenticated, isAuthorized(USER_TYPE.TEACHER), CategoryController.deleteCategory);

module.exports = router;
