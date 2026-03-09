const express = require("express");

const { CommentController } = require("../../controllers");
const { isAuthenticated } = require("../../middlewares");

const router = express.Router();

// Update a comment (by owner only)
router.put("/:id", isAuthenticated, CommentController.updateComment);

// Delete a comment (by owner or journal's teacher)
router.delete("/:id", isAuthenticated, CommentController.deleteComment);

module.exports = router;
