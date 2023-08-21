const { StatusCodes } = require("http-status-codes");
const { UserRepository, JournalRepository, AttachmentRepository, JournalStudentMappingRepository, PublishJournalRepository } = require("../repositories");
const AppError = require("../utils/errors/app-error");
const { Cloudinary, GenerateDate } = require("../utils/commons");
const { PublishJournal } = require("../models");

const journalRepository = new JournalRepository();
const attachmentRepository = new AttachmentRepository();
const journalStudentMappingRepository = new JournalStudentMappingRepository();
const publishJournalRepository = new PublishJournalRepository();
const userRepository=new UserRepository();

async function addJournalEntry(data) {
    try {
        if (data.attachment) {
            const cloud = await Cloudinary.upload(data.attachment)
            const attachmentId = await attachmentRepository.create({
                public_id: cloud.public_id,
                url: cloud.secure_url
            })
            data.attachment_id = attachmentId;
        }
        const journalId = await journalRepository.create({
            teacher_id: data.teacher_id,
            description: data.description,
            attachment_id: data.attachment_id
        });
        if (data.tagged) {
            const studentsTagged = data.tagged;
            studentsTagged.forEach(async (student_id) => {
                let found = await userRepository.getById(student_id);
                if (found) {
                    await journalStudentMappingRepository.create({
                        journal_id: journalId,
                        student_id
                    })
                }
            });
        }
        let datetime = GenerateDate.getCurrentDateTime();
        if (data.publishedAt) {
            datetime = data.publishedAt
        }
        await publishJournalRepository.create(new PublishJournal(journalId, datetime))
        return journalId;
    } catch (error) {
        let message = 'Cannot create a new journal entry';
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
module.exports = {
    addJournalEntry,
    deleteJournalById,
    updateJournalEntry,
    publishJournalEntry
};
