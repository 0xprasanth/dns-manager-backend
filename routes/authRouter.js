

const express = require("express");

const authController = require("../controller/authController");

const router = express.Router();

/** routes */

/** POST Methods */

    /**
     * @openapi
     * '/signup':
     *  post:
     *     tags:
     *     - User Controller
     *     summary: Create a user
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - username
     *              - email
     *              - password
     *            properties:
     *              username:
     *                type: string
     *                default: johndoe 
     *              email:
     *                type: string
     *                default: johndoe@gmail.com
     *              password:
     *                type: string
     *                default: johnDoe20!@
     *     responses:
     *      201:
     *        description: Created
     *      409:
     *        description: Conflict
     *      404:
     *        description: Not Found
     *      500:
     *        description: Server Error
     */
router.post("/signup", authController.signup)
  


    /**
     * @openapi
     * '/login':
     *  post:
     *     tags:
     *     - User Controller
     *     summary: Login as a user
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - email
     *              - password
     *            properties:
     *              email:
     *                type: string
     *                default: johndoe@gmail.com
     *              password:
     *                type: string
     *                default: johnDoe20!@
     *     responses:
     *      200:
     *        description: Logged In Successfully
     *      400:
     *        description: Conflict - Invalid username/password supplied
     *      404:
     *        description: Not Found
     *      500:
     *        description: Server Error
     */
router.post("/login", authController.login);

router
  .options("/login", function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.end();
  })
  .options("/signup", function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.end();
  });

module.exports = router;
