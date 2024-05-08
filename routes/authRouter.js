const express = require("express");

const authController = require("../controller/authController");

const router = express.Router();

/** routes */

// signup 
router
    .post("/signup", authController.signup)
    .post("/login", authController.login)

module.exports = router;
