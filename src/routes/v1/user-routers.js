const express = require("express");

const { UserController } = require("../../controllers");
const { isAuthenticated } = require("../../middlewares");

const router = express.Router();

router.post("/register", UserController.registerUser);

router.post("/login", UserController.loginUser);

router.get("/feed", isAuthenticated, UserController.getFeed);

module.exports = router