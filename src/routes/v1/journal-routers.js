const express = require("express");

const { JournalController, CommentController, ReadReceiptController } = require("../../controllers");

const { SingleUpload, isAuthenticated, isAuthorized } = require("../../middlewares");

const { ENUMS } = require("../../utils/commons");
const { USER_TYPE } = ENUMS;

const router = express.Router();

// ============= JOURNAL CRUD =============

// Create journal (with optional draft mode)
router.post("/", SingleUpload, isAuthenticated, isAuthorized(USER_TYPE.TEACHER), JournalController.addJournalEntry);

// Get journal by ID (authenticated users)
router.get("/:id", isAuthenticated, JournalController.getJournalById);

// Update journal
router.put("/:id", isAuthenticated, isAuthorized(USER_TYPE.TEACHER), JournalController.updateJournalEntry);

// Delete journal
router.delete("/:id", isAuthenticated, isAuthorized(USER_TYPE.TEACHER), JournalController.deleteJournalEntry);

// Publish journal
router.post("/publish/:id", isAuthenticated, isAuthorized(USER_TYPE.TEACHER), JournalController.publishJournalEntry);

// ============= DRAFT MODE =============

// Get all drafts for current teacher
router.get("/drafts/all", isAuthenticated, isAuthorized(USER_TYPE.TEACHER), JournalController.getDrafts);

// Publish a draft
router.post("/drafts/:id/publish", isAuthenticated, isAuthorized(USER_TYPE.TEACHER), JournalController.publishDraft);

// ============= COMMENTS =============

// Get comments for a journal
router.get("/:journalId/comments", isAuthenticated, CommentController.getComments);

// Get comment count for a journal
router.get("/:journalId/comments/count", isAuthenticated, CommentController.getCommentCount);

// Add comment to a journal
router.post("/:journalId/comments", isAuthenticated, CommentController.addComment);

// ============= READ RECEIPTS =============

// Mark journal as read (Student)
router.post("/:journalId/read", isAuthenticated, isAuthorized(USER_TYPE.STUDENT), ReadReceiptController.markAsRead);

// Check read status (Student)
router.get("/:journalId/read-status", isAuthenticated, isAuthorized(USER_TYPE.STUDENT), ReadReceiptController.checkReadStatus);

// Get read statistics for a journal (Teacher)
router.get("/:journalId/read-stats", isAuthenticated, isAuthorized(USER_TYPE.TEACHER), ReadReceiptController.getReadStats);

// Get list of readers for a journal (Teacher)
router.get("/:journalId/readers", isAuthenticated, isAuthorized(USER_TYPE.TEACHER), ReadReceiptController.getReaders);

module.exports = router;
