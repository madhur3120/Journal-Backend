const express = require("express");

const { JournalController } = require("../../controllers");

const { SingleUpload, isAuthenticated, isAuthorized} = require("../../middlewares")

const { ENUMS } = require("../../utils/commons")
const { USER_TYPE }  = ENUMS;

const router = express.Router();

router.post("/", SingleUpload, isAuthenticated, isAuthorized(USER_TYPE.TEACHER), JournalController.addJournalEntry);

router.delete("/:id", isAuthenticated, isAuthorized(USER_TYPE.TEACHER),JournalController.deleteJournalEntry);

router.put("/:id", isAuthenticated, isAuthorized(USER_TYPE.TEACHER),JournalController.updateJournalEntry);

router.post("/publish/:id", isAuthenticated, isAuthorized(USER_TYPE.TEACHER),JournalController.publishJournalEntry);


module.exports = router;
