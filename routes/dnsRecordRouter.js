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

// Routes for update and delete DNS record
router.put("/:recordId", dnsController.updateRecord)

router.delete(":/recordId", dnsController.deleteRecord)
    

module.exports = router;