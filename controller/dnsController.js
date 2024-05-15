/**
 * * controller/dnsController.js
 * Logic for CRUD operations on DB for DNS Records
 * TODO: handle for record in DB but not on AWS Route53
 */

// AWS Route53 Services Logic
// const {
//   createHostedZoneAndRecord,
//   updateRoute53Record,
//   deleteRoute53Record,
//   createRoute53BulkRecord,
//   createRoute53RecordFromId,
//   prepareRecord,
//   createHostedZoneForClient,
// } = require("../services/awsRoute53");


const dnsModal = require("../model/DNSRecord");
const userModal = require("../model/Users");
const { prepareRecord } = require("../services/awsRoute53");
const returnHash = require("../utils/generateToken");



exports.createRecordFromId = async (req, res) => {
  /**
   * hostedZoneId: where to create Record
   */
  // console.log('body', req.body);

  const { record, hostedZoneId } = req.body;


  // console.log(record);
  // console.log(hostedZoneId);

  try {
    // check if domain of same exists
    const dns = await dnsModal
      .where("domain")
      .equals(record.domain)
      .where("type")
      .equals(record.type);

    if (dns.length >= 1) 
    {
      // throw error if domain exist
      // it will be GTE to 1
      throw new Error(`${record.domain} domain already exits`);
    } 
    else {
      // console.log("send to aws");

      // call create record from HostedZone Id
      // * uncomment to connect to aws
      // const response = await createRoute53RecordFromId(hostedZoneId, record);

      // prepare record in AWS Route53 formate
      const { resourceRecords, recordName } = prepareRecord(record);
      
      // insert record in DB;
        const newRecord = await dnsModal.create({
          hostedZoneId: hostedZoneId,
          domain: recordName,
          type: record.type,
          ttl: parseInt(record.ttl),
          value: record.value,
          priority: record?.priority || 0,
          weight: record?.weight || 0,
          port: record?.port || 0,
          target: record?.target || "",
          keyTag: record?.keyTag || 0,
          algorithm: record?.priority || 0,
          digestType: record?.digestType || 0,
          digest: record?.digest || "",
          ResourceRecords: resourceRecords[0],
        });

        res.json({
          status: 'success',
          message: `${recordName} created successfully`,
          code: 200,
          data: newRecord,
        });
      }

  } catch (err) {
    console.log("crfid 52", err);
    res.status(400).json({
      status: "failed",
      message: err.message,
      code: 400
    });
  }
};

exports.createHostedZoneOnly = async (req, res) => {
  // hostedZoneData: {
    // name:
  // }

  const { hostedZoneData } = req.body;
  const { userId } = req.params;

  console.log("log hzdata 80", req.body);

  try {
    // check if hostedzone already exists
    // check if such user exist
    const isUser = await userModal.findOne({ _id: userId });


    if (!isUser) {
      // isUser does not exist
      res.status(200).send({
        success: false,
        message: "User does not exists",
      });
 
    } else {
      // AWS Function CALL
      // const response = await createHostedZoneForClient(hostedZoneData);
      const response = returnHash();

      // create record
      const db = await dnsModal.create({
        hostedZoneId: response,
        domain: hostedZoneData.name,
        type: "NS",
        ttl: 17800,
        value:
          "ns-896.awsdns-48.net. ,ns-1190.awsdns-20.org. , ns-439.awsdns-54.com. , ns-1972.awsdns-54.co.uk.",
        ResourceRecords: {
          Value: [
            "ns-896.awsdns-48.net.",
            "ns-1190.awsdns-20.org.",
            "ns-439.awsdns-54.com.",
            " ns-1972.awsdns-54.co.uk.",
          ],
        },
      });

      await dnsModal.create({
        hostedZoneId: response,
        domain: hostedZoneData.name,
        type: "NS",
        ttl: 17800,
        value: "ns-89.awsdns-11.com., awsdns-hostmaster.amazon.com.",
        ResourceRecords: {
          Value: ["ns-89.awsdns-11.com.", "awsdns-hostmaster.amazon.com."],
        },
      });

      // const user = await userModal.findOneAndUpdate(
      //   {
      //     _id: userId
      //   },
      //   {
      //     dns: db._id
      //   }
      // )

      // use save()

      isUser.HostedZoneId = db.hostedZoneId;

      const user = await isUser.save();

      // console.log("log 82 user", user);
      // console.log("log 82 db", db);
      // console.log("log 82 user", isUser);
      // console.log("log 82 user save", user);

      res.status(200).send({
        success: true,
        message: "Hosted Zone Created",
        user: user,
      });
    }
  } catch (error) {
    console.log("dc chzo: 89", error);
    res.json({
      message: error.message,
    });
  }
};

/** function to create bulk records */
/** not used for bulk records */
exports.createBulkRecords = async (req, res) => {
  // console.log(req.body);
  console.log(req);
  const { records, hostedZoneId } = req.body;
console.log(records);
  try{
      // const awsResponse = await createRoute53BulkRecord(records, hostedZoneId);

      const newRecords = async (record) => {
        console.log(record);

        const awsResponse = createRoute53RecordFromId(hostedZoneId, record);

        const { resourceRecords, recordName } = prepareRecord(record);

        const newrecord = await dnsModal.create({
          hostedZoneId: hostedZoneId,
          domain: recordName,
          type: record.type,
          ttl: parseInt(record.ttl),
          value: record.value,
          priority: record?.priority || 0,
          weight: record?.weight || 0,
          port: record?.port || 0,
          target: record?.target || "",
          keyTag: record?.keyTag || 0,
          algorithm: record?.priority || 0,
          digestType: record?.digestType || 0,
          digest: record?.digest || "",
          ResourceRecords: resourceRecords[0],
        });
        console.log('bulk 251', newrecord);

        res.status(201).json({
          message: "success",
          data: newrecord,
          awsResponse: awsResponse,
        });

      };
    } catch (err) {

    console.log(err);
    res.status(500).json({
      status: "Error",
      message: err.message,
    });
  }
};

// Function to get DNS records for a domain
exports.getRecords = async (req, res) => {
  // Implementation logic to get DNS records
  const { hostedZoneId } = req.body;

  // if (!hostedZoneId) {
  //   res.status(200).send({
  //     "message": "HostZoneId is undefined. Please create a HostedZone"
  //   })
  //   return; // [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client

  // }
  try {
    // const user = await userModal.where("_id").equals(userId);

    const dnsRecords = await dnsModal.find({
      hostedZoneId: `${hostedZoneId}`,
    });

    // console.log("211 getRecords", user);
    console.log("269 getRecords", hostedZoneId);

    // console.log("211 getRecords", dnsRecords, {
    //   hostedZoneId: `${hostedZoneId}`,
    // });

    res.status(200).json({ message: "success", data: dnsRecords });
  } catch (error) {
    console.log("dc 255", error);
    res.status(500).json({ message: error.message });
  }
};



exports.updateRecord = async (req, res) => {
  const { recordId } = req.params;
  const { record, hostedZoneId } = req.body;

  // send to route53 and update it in DB
  try {
    // send command to AWS Route 53
    // const response = await updateRoute53Record(record, hostedZoneId);
    console.log("update 288", record);
    // console.log("update aws resp", response);
    // Update record in the DB
    // const updatedRecord = await prisma.dNSRecord.update({
    //   where: { id: recordId },
    //   data: {
    //     domain: record.domain,
    //     type: record.type,
    //     ttl: parseInt(record.ttl),
    //     value: record.value,
    //   },
    // });

    const { resourceRecords, recordName } = prepareRecord(record);

    const updateRecord = await dnsModal.findOneAndUpdate(
      {
        _id: recordId,
      },
      {
        hostedZoneId: hostedZoneId,
        domain: recordName,
        type: record.type,
        ttl: parseInt(record.ttl),
        value: record.value,
        priority: record?.priority || 0,
        weight: record?.weight || 0,
        port: record?.port || 0,
        target: record?.target || "",
        keyTag: record?.keyTag || 0,
        algorithm: record?.priority || 0,
        digestType: record?.digestType || 0,
        digest: record?.digest || "",
        ResourceRecords: resourceRecords[0],
      }
    );

    res.json({
      status: 204,
      message: `${record.domain} Updated`,
      data: updateRecord,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteRecord = async (req, res) => {
  const { recordId } = req.params;

  try {
    // get the RECORD by ID
    const record = await dnsModal.findById(recordId);
    console.log("delete record 288", record);

    // send command to AWS
    // const awsResponse = await deleteRoute53Record(record);
    // console.log("delete awsResp 291", awsResponse);
    // if record with HostedZone not found, Remove from DB

    const resp = await dnsModal.deleteOne({
      _id: recordId,
    });
    console.log("db resp 301", resp);
    // return success
    res.status(204).send({
      message: `${recordId} was not found\n Removing From Database`,
      db: resp,
    });

  } catch (err) {
    console.log(err);
    console.log("delete record 297", err);
    res.status(500).send({
      message: err.message
    })
  }
};
