const { StatusCodes } = require("http-status-codes");
const { UserRepository, JournalRepository, AttachmentRepository, JournalStudentMappingRepository, PublishJournalRepository, CategoryRepository } = require("../repositories");
const AppError = require("../utils/errors/app-error");
const { Cloudinary, GenerateDate } = require("../utils/commons");
const { PublishJournal } = require("../models");

const journalRepository = new JournalRepository();
const attachmentRepository = new AttachmentRepository();
const journalStudentMappingRepository = new JournalStudentMappingRepository();
const publishJournalRepository = new PublishJournalRepository();
const userRepository = new UserRepository();
const categoryRepository = new CategoryRepository();

async function addJournalEntry(data) {
    try {
        // Handle attachment upload
        if (data.attachment) {
            const cloud = await Cloudinary.upload(data.attachment)
            const attachmentId = await attachmentRepository.create({
                public_id: cloud.public_id,
                url: cloud.secure_url
            })
            data.attachment_id = attachmentId;
        }

        // Validate category if provided
        if (data.category_id) {
            const category = await categoryRepository.getById(data.category_id);
            if (!category) {
                throw new AppError('Category not found', StatusCodes.NOT_FOUND);
            }
        }

        // Create journal entry
        const journalData = {
            teacher_id: data.teacher_id,
            description: data.description,
            attachment_id: data.attachment_id || null,
            category_id: data.category_id || null,
            is_draft: data.is_draft || false
        };

        const journalId = await journalRepository.create(journalData);

        // Tag students
        if (data.tagged && data.tagged.length > 0) {
            const studentsTagged = data.tagged;
            for (const student_id of studentsTagged) {
                let found = await userRepository.getById(student_id);
                if (found) {
                    await journalStudentMappingRepository.create({
                        journal_id: journalId,
                        student_id
                    });
                }
            }
        }

        // Create publish journal entry only if not a draft
        if (!data.is_draft) {
            let datetime = GenerateDate.getCurrentDateTime();
            if (data.publishedAt) {
                datetime = data.publishedAt;
            }
            await publishJournalRepository.create(new PublishJournal(journalId, datetime));
        }

        return journalId;
    } catch (error) {
        let message = 'Cannot create a new journal entry';
        if (error instanceof AppError) {
            throw error;
        }
        if (error) {
            message = error.message;
        }
        throw new AppError(message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function deleteJournalById(id) {
    try {
        const result = await journalRepository.deleteById(id);
        if (!result) {
            throw new AppError('Journal entry not found or could not be deleted', StatusCodes.NOT_FOUND);
        }
        return result;
    } catch (error) {
        let message = 'Error deleting journal entry';
        if (error) {
            message = error.message;
        }
        throw new AppError(message, error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR);
    }
}
async function updateJournalEntry(journalId, updatedFields) {
    try {
        const result = await journalRepository.updateById(journalId, updatedFields);
        if (!result) {
            throw new AppError('Journal entry not found or could not be updated', StatusCodes.NOT_FOUND);
        }
        return result;
    } catch (error) {
        let message = 'Error updating journal entry';
        if (error) {
            message = error.message;
        }
        throw new AppError(message, error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function publishJournalEntry(journalId) {
    try {
        let row = await publishJournalRepository.getById(journalId);
        if (!row) {
            throw new AppError('Journal entry not found or could not be published', StatusCodes.NOT_FOUND);
        }
        const result = await publishJournalRepository.publishById(journalId);
        if (!result) {
            throw new AppError('Journal entry not found or could not be published', StatusCodes.NOT_FOUND);
        }
        return result;
    }
    catch (error) {
        let message = 'Error publishing journal entry';
        if (error) {
            message = error.message;
        }
        throw new AppError(message, error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

/**
 * Publish a draft journal
 * @param {number} journalId - Journal ID
 * @param {number} teacherId - Teacher ID (for authorization)
 * @param {string} publishedAt - Optional publish datetime
 * @returns {Object} Result
 */
async function publishDraft(journalId, teacherId, publishedAt = null) {
    try {
        const journal = await journalRepository.getById(journalId);
        if (!journal) {
            throw new AppError('Journal not found', StatusCodes.NOT_FOUND);
        }

        if (journal.teacher_id !== teacherId) {
            throw new AppError('You can only publish your own journals', StatusCodes.FORBIDDEN);
        }

        if (!journal.is_draft) {
            throw new AppError('This journal is already published', StatusCodes.BAD_REQUEST);
        }

        // Update journal to not be a draft
        await journalRepository.updateById(journalId, { is_draft: false });

        // Create publish journal entry
        let datetime = GenerateDate.getCurrentDateTime();
        if (publishedAt) {
            datetime = publishedAt;
        }
        await publishJournalRepository.create(new PublishJournal(journalId, datetime));

        return { journalId, publishedAt: datetime };
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError('Failed to publish draft', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

/**
 * Get all drafts for a teacher
 * @param {number} teacherId - Teacher ID
 * @returns {Array} List of draft journals
 */
async function getDrafts(teacherId) {
    try {
        const drafts = await journalRepository.get({ teacher_id: teacherId, is_draft: true });
        return drafts;
    } catch (error) {
        throw new AppError('Failed to fetch drafts', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

/**
 * Get a journal by ID with full details
 * @param {number} journalId - Journal ID
 * @returns {Object} Journal with all details
 */
async function getJournalById(journalId) {
    try {
        const journal = await journalRepository.getById(journalId);
        if (!journal) {
            throw new AppError('Journal not found', StatusCodes.NOT_FOUND);
        }
        return journal;
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError('Failed to fetch journal', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    addJournalEntry,
    deleteJournalById,
    updateJournalEntry,
    publishJournalEntry,
    publishDraft,
    getDrafts,
    getJournalById
};
