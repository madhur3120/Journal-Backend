const { StatusCodes } = require('http-status-codes');
const { CommentService } = require("../services");
const { SuccessResponse, ErrorResponse } = require("../utils/commons");

/**
 * POST : /journals/:journalId/comments
 * Add a comment to a journal
 */
async function addComment(req, res) {
    try {
        const commentData = {
            journalId: parseInt(req.params.journalId),
            userId: req.user.id,
            content: req.body.content,
            parentId: req.body.parentId ? parseInt(req.body.parentId) : null
        };

        const commentId = await CommentService.addComment(commentData);
        
        SuccessResponse.data = { id: commentId };
        SuccessResponse.message = "Comment added successfully";
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
 * GET : /journals/:journalId/comments
 * Get all comments for a journal (nested structure)
 */
async function getComments(req, res) {
    try {
        const journalId = parseInt(req.params.journalId);
        const comments = await CommentService.getCommentsByJournalId(journalId);
        
        SuccessResponse.data = comments;
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
 * GET : /journals/:journalId/comments/count
 * Get comment count for a journal
 */
async function getCommentCount(req, res) {
    try {
        const journalId = parseInt(req.params.journalId);
        const count = await CommentService.getCommentCount(journalId);
        
        SuccessResponse.data = { count };
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
 * PUT : /comments/:id
 * Update a comment (only by owner)
 */
async function updateComment(req, res) {
    try {
        const commentId = parseInt(req.params.id);
        const userId = req.user.id;
        const content = req.body.content;

        await CommentService.updateComment(commentId, userId, content);
        
        SuccessResponse.message = "Comment updated successfully";
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
 * DELETE : /comments/:id
 * Delete a comment (by owner or journal's teacher)
 */
async function deleteComment(req, res) {
    try {
        const commentId = parseInt(req.params.id);
        const userId = req.user.id;
        const userRole = req.user.role;

        await CommentService.deleteComment(commentId, userId, userRole);
        
        SuccessResponse.message = "Comment deleted successfully";
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
    addComment,
    getComments,
    getCommentCount,
    updateComment,
    deleteComment
};
