/**
 * routes/dnsRecordRouter.js
 */
const router = require('express').Router();
const dnsController = require("../controller/dnsController");


// get records using POST
/** body{ hostedZoneId } */
router.post("/", dnsController.getRecords);

router.post('/create-hosted-zone/:userId', dnsController.createHostedZoneOnly);

router.post('/create-record', dnsController.createRecordFromId)

router.post("/bulk", dnsController.createBulkRecords);

// Routes for update and delete DNS record
router.put("/:recordId", dnsController.updateRecord)

router.delete("/:recordId", dnsController.deleteRecord)
    

module.exports = router;