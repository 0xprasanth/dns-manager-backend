const express = require("express");

const authController = require("../controller/authController");

const router = express.Router();

/** routes */

// signup 
router
    .post("/signup", authController.signup)
    .post("/login", authController.login)

router.options('/login', function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.end();
  })
  .options('/signup', function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.end();
  });

module.exports = router;
