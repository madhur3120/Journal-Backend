const express = require(`express`);
const router = express.Router();
const { check } = require(`express-validator`);

const {
    getJournalById,
    createJournal,
    updateJournal,
    deleteJournal,
    getJournalFeed,
} = require(`../controllers/journalController`);
// const { protectAccess, restrictTo } = require(`../controllers/authController`);

// @desc get a specific journal by ID
// @access Tutor
router.get(
    `/journal/:journalId`,
    // protectAccess,
    // restrictTo(`teacher`),
    getJournalById
);

// @desc create a journal entry
// @access Tutor
router.post(
    `/journal`,
    [
        check(`description`, `Description must be more than 2 char`).isLength({
            min: 2,
        }),
    ],
    // protectAccess,
    // restrictTo(`teacher`),
    createJournal
);

// @desc update a journal entry
// @access Tutor
router.put(
    `/journal/:journalId`,
    // protectAccess,
    // restrictTo(`teacher`),
    updateJournal
);

// @desc delete a journal entry
// @access Tutor
router.delete(
    `/journal/:journalId`,
    // protectAccess,
    // restrictTo(`teacher`),
    deleteJournal
);

// @desc journal feed
// @access Tutor/Student
router.get(`/journalfeed`, getJournalFeed);

module.exports = router;
