/**
 * routes/dnsRecordRouter.js
 */
const router = require('express').Router();
const dnsController = require("../controller/dnsController");

/**
 * Router to create a DNS Record
 */
router
    .post("/", dnsController.createRecord)
    .get("/", dnsController.getRecords);

router.post("/bulk", dnsController.createBulkRecords);

module.exports = router;