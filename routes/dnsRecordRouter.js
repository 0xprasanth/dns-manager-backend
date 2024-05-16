/**
 * routes/dnsRecordRouter.js
 */
const router = require('express').Router();
const dnsController = require("../controller/dnsController");


// get records using POST
/** body{ hostedZoneId } */

/** POST Methods */

    /**
     * @openapi
     * '/domain/records/':
     *  post:
     *     tags:
     *     - DNS Record Controller
     *     summary: Get All Records
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - hostedZoneId
     *            properties:
     *              hostedZoneId:
     *                type: string
     *                default: LO4D3YK6MDSBKVTU 
     *     responses:
     *      200:
     *        description: Success
     *      409:
     *        description: Conflict
     *      404:
     *        description: Not Found
     *      500:
     *        description: Server Error
     */
router.post("/", dnsController.getRecords);


    /**
     * @openapi
     * '/domain/records/create-hosted-zone/{userId}':
     *  post:
     *     tags:
     *     - DNS Record Controller
     *     summary: Create a new HostedZone by user ID
     *     parameters:
     *      - name: userId
     *        in: path
     *        description: ID of an USER
     *        required: true
     *        default: 66464ed8bd26fc0be75e3463
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - hostedZoneData
     *            properties:
     *              hostedZoneData:
     *                type: object
     *                default: { name : swaggerclient }
     * 
     *     responses:
     *      200:
     *        description: Success
     *      409:
     *        description: Conflict
     *      404:
     *        description: Not Found
     *      500:
     *        description: Server Error
     */
router.post('/create-hosted-zone/:userId', dnsController.createHostedZoneOnly);

router.post('/create-record', dnsController.createRecordFromId)

router.post("/bulk", dnsController.createBulkRecords);

// Routes for update and delete DNS record
router.put("/:recordId", dnsController.updateRecord)

router.delete("/:recordId", dnsController.deleteRecord)
    

module.exports = router;