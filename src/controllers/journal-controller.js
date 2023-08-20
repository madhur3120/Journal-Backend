const { StatusCodes } = require('http-status-codes');

const { JournalService } = require("../services");
const { SuccessResponse, ErrorResponse } = require("../utils/commons");

/**
 * POST : /journals
 * req.body {teacherId: 1, description: 'Sample description', attachmentId: 'sample_attachment_id'}
 */
async function addJournalEntry(req, res) {
    try {
        const journalData = {
            teacher_id: req.user.id,
            description: req.body.description,
            tagged: req.body.tagged,
            publishedAt: req.body.publishedAt
        }
        if (req.file) {
            journalData.attachment = req.file;
        }
        const journalId = await JournalService.addJournalEntry(journalData);
        SuccessResponse.data = { id: journalId };
        return res
            .status(StatusCodes.CREATED)
            .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(ErrorResponse);
    }
}

async function deleteJournalEntry(req, res) {
    try {
        const id = req.params.id;
        const result = await JournalService.deleteJournalById(id);

        if (!result) {
            throw new ErrorResponse('Journal entry not found or could not be deleted', StatusCodes.NOT_FOUND);
        }

        SuccessResponse.data = { message: 'Journal entry deleted successfully' };
        return res
            .status(StatusCodes.OK)
            .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(ErrorResponse);
    }
}

async function updateJournalEntry(req, res) {
    try {
        const journalId = req.params.id;
        const updatedFields = req.body;

        const result = await JournalService.updateJournalEntry(journalId, updatedFields);
        if (!result) {
            throw new ErrorResponse('Journal entry could not be updated', StatusCodes.BAD_REQUEST);
        }

        SuccessResponse.data = { message: 'Journal entry updated successfully' };
        return res
            .status(StatusCodes.OK)
            .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(ErrorResponse);
    }
}

async function publishJournalEntry(req, res) {
    try {
        const journalId = req.params.id;
        const result = await JournalService.publishJournalEntry(journalId);
        if (!result) {
            throw new ErrorResponse('Journal entry could not be published', StatusCodes.BAD_REQUEST);
        }
        SuccessResponse.data = result;
        SuccessResponse.message = "Journal entry published successfully";
        return res
            .status(StatusCodes.OK)
            .json(SuccessResponse);
    }
    catch (error) {
        ErrorResponse.error = error;
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(ErrorResponse);
    }
}

module.exports = {
    addJournalEntry,
    deleteJournalEntry,
    updateJournalEntry,
    publishJournalEntry
};
