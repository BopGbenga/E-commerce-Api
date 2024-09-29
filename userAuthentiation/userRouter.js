const express = require("express");
const controller = require("./userController");
const middleware = require("./userMiddleware");

const router = express.Router();

//Registration route
router.post("/signup", middleware.validateUser, controller.createUser);

// Email verification route
router.get("/verify-email", controller.verifyEmail);

//login route
router.post("/login", middleware.loginValidate, controller.login);

module.exports = router;
