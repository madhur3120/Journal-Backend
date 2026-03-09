const { StatusCodes } = require('http-status-codes');
const { ReadReceiptService } = require("../services");
const { SuccessResponse, ErrorResponse } = require("../utils/commons");

/**
 * POST : /journals/:journalId/read
 * Mark a journal as read (Student only)
 */
async function markAsRead(req, res) {
    try {
        const journalId = parseInt(req.params.journalId);
        const studentId = req.user.id;

        const result = await ReadReceiptService.markJournalAsRead(journalId, studentId);
        
        SuccessResponse.data = result;
        SuccessResponse.message = result.alreadyRead 
            ? "Journal was already marked as read" 
            : "Journal marked as read successfully";
        return res
            .status(StatusCodes.OK)
            .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res
            .status(error.statusCode || StatusCodes.BAD_REQUEST)
            .json(ErrorResponse);
    }
}

/**
 * GET : /journals/:journalId/read-status
 * Check if current user has read a journal
 */
async function checkReadStatus(req, res) {
    try {
        const journalId = parseInt(req.params.journalId);
        const studentId = req.user.id;

        const receipt = await ReadReceiptService.hasStudentReadJournal(journalId, studentId);
        
        SuccessResponse.data = {
            hasRead: !!receipt,
            readAt: receipt ? receipt.read_at : null
        };
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
 * GET : /journals/:journalId/read-stats
 * Get read statistics for a journal (Teacher only)
 */
async function getReadStats(req, res) {
    try {
        const journalId = parseInt(req.params.journalId);
        const teacherId = req.user.id;

        const stats = await ReadReceiptService.getJournalReadStats(journalId, teacherId);
        
        SuccessResponse.data = stats;
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
 * GET : /journals/:journalId/readers
 * Get list of students who have read a journal (Teacher only)
 */
async function getReaders(req, res) {
    try {
        const journalId = parseInt(req.params.journalId);
        const readers = await ReadReceiptService.getJournalReaders(journalId);
        
        SuccessResponse.data = readers;
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
 * GET : /user/unread-count
 * Get count of unread journals for current student
 */
async function getUnreadCount(req, res) {
    try {
        const studentId = req.user.id;
        const count = await ReadReceiptService.getUnreadCount(studentId);
        
        SuccessResponse.data = { unreadCount: count };
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
 * GET : /user/unread-journals
 * Get list of unread journal IDs for current student
 */
async function getUnreadJournals(req, res) {
    try {
        const studentId = req.user.id;
        const unreadJournals = await ReadReceiptService.getUnreadJournals(studentId);
        
        SuccessResponse.data = { unreadJournalIds: unreadJournals };
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
    markAsRead,
    checkReadStatus,
    getReadStats,
    getReaders,
    getUnreadCount,
    getUnreadJournals
};
