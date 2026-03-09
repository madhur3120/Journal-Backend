const { StatusCodes } = require("http-status-codes");
const { ReadReceiptRepository, JournalRepository, JournalStudentMappingRepository } = require("../repositories");
const AppError = require("../utils/errors/app-error");

const readReceiptRepository = new ReadReceiptRepository();
const journalRepository = new JournalRepository();
const journalStudentMappingRepository = new JournalStudentMappingRepository();

/**
 * Mark a journal as read by a student
 * @param {number} journalId - Journal ID
 * @param {number} studentId - Student ID
 * @returns {Object} Result with read status
 */
async function markJournalAsRead(journalId, studentId) {
    try {
        // Check if journal exists
        const journal = await journalRepository.getById(journalId);
        if (!journal) {
            throw new AppError('Journal not found', StatusCodes.NOT_FOUND);
        }

        // Check if student is tagged to this journal
        const mapping = await journalStudentMappingRepository.get({
            journal_id: journalId,
            student_id: studentId
        });

        if (!mapping || mapping.length === 0) {
            throw new AppError('You are not authorized to view this journal', StatusCodes.FORBIDDEN);
        }

        // Check if already read
        const existingReceipt = await readReceiptRepository.hasRead(journalId, studentId);
        if (existingReceipt) {
            return {
                alreadyRead: true,
                readAt: existingReceipt.read_at
            };
        }

        // Mark as read
        await readReceiptRepository.markAsRead(journalId, studentId);
        
        return {
            alreadyRead: false,
            readAt: new Date()
        };
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError('Failed to mark journal as read', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

/**
 * Check if a student has read a journal
 * @param {number} journalId - Journal ID
 * @param {number} studentId - Student ID
 * @returns {Object|null} Read receipt or null
 */
async function hasStudentReadJournal(journalId, studentId) {
    try {
        const receipt = await readReceiptRepository.hasRead(journalId, studentId);
        return receipt;
    } catch (error) {
        throw new AppError('Failed to check read status', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

/**
 * Get read statistics for a journal (for teachers)
 * @param {number} journalId - Journal ID
 * @param {number} teacherId - Teacher ID (for authorization)
 * @returns {Object} Read statistics
 */
async function getJournalReadStats(journalId, teacherId) {
    try {
        const journal = await journalRepository.getById(journalId);
        if (!journal) {
            throw new AppError('Journal not found', StatusCodes.NOT_FOUND);
        }

        if (journal.teacher_id !== teacherId) {
            throw new AppError('You can only view stats for your own journals', StatusCodes.FORBIDDEN);
        }

        const stats = await readReceiptRepository.getReadStats(journalId);
        const readers = await readReceiptRepository.getReadersForJournal(journalId);

        return {
            ...stats,
            readers
        };
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError('Failed to fetch read statistics', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

/**
 * Get list of students who have read a journal
 * @param {number} journalId - Journal ID
 * @returns {Array} List of readers
 */
async function getJournalReaders(journalId) {
    try {
        const journal = await journalRepository.getById(journalId);
        if (!journal) {
            throw new AppError('Journal not found', StatusCodes.NOT_FOUND);
        }

        const readers = await readReceiptRepository.getReadersForJournal(journalId);
        return readers;
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError('Failed to fetch readers', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

/**
 * Get unread journal count for a student
 * @param {number} studentId - Student ID
 * @returns {number} Unread count
 */
async function getUnreadCount(studentId) {
    try {
        const unreadJournals = await readReceiptRepository.getUnreadJournalsByStudent(studentId);
        return unreadJournals.length;
    } catch (error) {
        throw new AppError('Failed to fetch unread count', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

/**
 * Get all unread journals for a student
 * @param {number} studentId - Student ID
 * @returns {Array} List of unread journal IDs
 */
async function getUnreadJournals(studentId) {
    try {
        const unreadJournals = await readReceiptRepository.getUnreadJournalsByStudent(studentId);
        return unreadJournals;
    } catch (error) {
        throw new AppError('Failed to fetch unread journals', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    markJournalAsRead,
    hasStudentReadJournal,
    getJournalReadStats,
    getJournalReaders,
    getUnreadCount,
    getUnreadJournals
};
