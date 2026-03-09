const { StatusCodes } = require("http-status-codes");
const { CommentRepository, JournalRepository, JournalStudentMappingRepository, PublishJournalRepository } = require("../repositories");
const AppError = require("../utils/errors/app-error");

const commentRepository = new CommentRepository();
const journalRepository = new JournalRepository();
const journalStudentMappingRepository = new JournalStudentMappingRepository();
const publishJournalRepository = new PublishJournalRepository();

/**
 * Add a comment to a journal
 * @param {Object} data - Comment data { journalId, userId, content, parentId }
 * @returns {number} Created comment ID
 */
async function addComment(data) {
    try {
        // Check if journal exists
        const journal = await journalRepository.getById(data.journalId);
        if (!journal) {
            throw new AppError('Journal not found', StatusCodes.NOT_FOUND);
        }

        // Check if parent comment exists (if replying to a comment)
        if (data.parentId) {
            const parentComment = await commentRepository.getById(data.parentId);
            if (!parentComment) {
                throw new AppError('Parent comment not found', StatusCodes.NOT_FOUND);
            }
            if (parentComment.journal_id !== data.journalId) {
                throw new AppError('Parent comment does not belong to this journal', StatusCodes.BAD_REQUEST);
            }
        }

        const commentId = await commentRepository.create({
            journal_id: data.journalId,
            user_id: data.userId,
            content: data.content,
            parent_id: data.parentId || null
        });

        return commentId;
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError('Failed to add comment', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

/**
 * Get all comments for a journal (nested structure)
 * @param {number} journalId - Journal ID
 * @returns {Array} Nested comments
 */
async function getCommentsByJournalId(journalId) {
    try {
        const journal = await journalRepository.getById(journalId);
        if (!journal) {
            throw new AppError('Journal not found', StatusCodes.NOT_FOUND);
        }

        const comments = await commentRepository.getByJournalId(journalId);
        return comments;
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError('Failed to fetch comments', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

/**
 * Get comment count for a journal
 * @param {number} journalId - Journal ID
 * @returns {number} Comment count
 */
async function getCommentCount(journalId) {
    try {
        const count = await commentRepository.getCountByJournalId(journalId);
        return count;
    } catch (error) {
        throw new AppError('Failed to fetch comment count', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

/**
 * Update a comment
 * @param {number} commentId - Comment ID
 * @param {number} userId - User ID (for ownership check)
 * @param {string} content - New content
 * @returns {boolean} Success status
 */
async function updateComment(commentId, userId, content) {
    try {
        const comment = await commentRepository.getById(commentId);
        if (!comment) {
            throw new AppError('Comment not found', StatusCodes.NOT_FOUND);
        }

        // Check ownership
        const isOwner = await commentRepository.isOwner(commentId, userId);
        if (!isOwner) {
            throw new AppError('You can only edit your own comments', StatusCodes.FORBIDDEN);
        }

        const result = await commentRepository.updateById(commentId, { content });
        return result;
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError('Failed to update comment', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

/**
 * Delete a comment
 * @param {number} commentId - Comment ID
 * @param {number} userId - User ID
 * @param {string} userRole - User role (TEACHER can delete any comment on their journal)
 * @returns {boolean} Success status
 */
async function deleteComment(commentId, userId, userRole) {
    try {
        const comment = await commentRepository.getById(commentId);
        if (!comment) {
            throw new AppError('Comment not found', StatusCodes.NOT_FOUND);
        }

        // Check if user is owner OR if user is the teacher who owns the journal
        const isOwner = await commentRepository.isOwner(commentId, userId);
        let canDelete = isOwner;

        if (!isOwner && userRole === 'TEACHER') {
            const journal = await journalRepository.getById(comment.journal_id);
            if (journal && journal.teacher_id === userId) {
                canDelete = true;
            }
        }

        if (!canDelete) {
            throw new AppError('You do not have permission to delete this comment', StatusCodes.FORBIDDEN);
        }

        const result = await commentRepository.deleteById(commentId);
        return result;
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError('Failed to delete comment', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    addComment,
    getCommentsByJournalId,
    getCommentCount,
    updateComment,
    deleteComment
};
