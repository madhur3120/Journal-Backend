const { StatusCodes } = require('http-status-codes');

const { JournalService } = require("../services");
const { SuccessResponse, ErrorResponse } = require("../utils/commons");

/**
 * POST : /journals
 * req.body {description, tagged, publishedAt, categoryId, isDraft}
 */
async function addJournalEntry(req, res) {
    try {
        const journalData = {
            teacher_id: req.user.id,
            description: req.body.description,
            tagged: req.body.tagged,
            publishedAt: req.body.publishedAt,
            category_id: req.body.categoryId ? parseInt(req.body.categoryId) : null,
            is_draft: req.body.isDraft === 'true' || req.body.isDraft === true
        };

        // Parse tagged students
        if (req.body.tagged) {
            const taggedString = req.body.tagged;
            const taggedArray = typeof taggedString === 'string' 
                ? taggedString.split(',').map(Number).filter(n => !isNaN(n))
                : taggedString;
            journalData.tagged = taggedArray;
        }

        if (req.file) {
            journalData.attachment = req.file;
        }

        const journalId = await JournalService.addJournalEntry(journalData);
        
        SuccessResponse.data = { id: journalId };
        SuccessResponse.message = journalData.is_draft 
            ? "Draft saved successfully" 
            : "Journal entry created successfully";
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

/**
 * POST : /journals/drafts/:id/publish
 * Publish a draft journal
 */
async function publishDraft(req, res) {
    try {
        const journalId = parseInt(req.params.id);
        const teacherId = req.user.id;
        const publishedAt = req.body.publishedAt || null;

        const result = await JournalService.publishDraft(journalId, teacherId, publishedAt);
        
        SuccessResponse.data = result;
        SuccessResponse.message = "Draft published successfully";
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
 * GET : /journals/drafts
 * Get all drafts for the current teacher
 */
async function getDrafts(req, res) {
    try {
        const teacherId = req.user.id;
        const drafts = await JournalService.getDrafts(teacherId);
        
        SuccessResponse.data = drafts;
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
 * GET : /journals/:id
 * Get a journal by ID
 */
async function getJournalById(req, res) {
    try {
        const journalId = parseInt(req.params.id);
        const journal = await JournalService.getJournalById(journalId);
        
        SuccessResponse.data = journal;
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
    addJournalEntry,
    deleteJournalEntry,
    updateJournalEntry,
    publishJournalEntry,
    publishDraft,
    getDrafts,
    getJournalById
};
