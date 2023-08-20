const express = require("express");

const { InfoController } = require("../../controllers");
const UserRoutes = require("./user-routers");
const JournalRoutes = require("./journal-routers");

const router = express.Router();

router.get("/info", InfoController.info);
router.use("/user", UserRoutes);
router.use("/journal", JournalRoutes);

module.exports = router;
