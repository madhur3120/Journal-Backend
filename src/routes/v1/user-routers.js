const express = require("express");

const { UserController, ReadReceiptController } = require("../../controllers");
const { isAuthenticated, isAuthorized } = require("../../middlewares");
const { ENUMS } = require("../../utils/commons");
const { USER_TYPE } = ENUMS;

const router = express.Router();

router.post("/register", UserController.registerUser);

router.post("/login", UserController.loginUser);

router.get("/feed", isAuthenticated, UserController.getFeed);

// Read receipt endpoints for students
router.get("/unread-count", isAuthenticated, isAuthorized(USER_TYPE.STUDENT), ReadReceiptController.getUnreadCount);
router.get("/unread-journals", isAuthenticated, isAuthorized(USER_TYPE.STUDENT), ReadReceiptController.getUnreadJournals);

module.exports = router;