/**
 * * controller/dnsController.js
 * Logic for CRUD operations on DB for DNS Records
 * TODO: handle for record in DB but not on AWS Route53
 */

const {
  createHostedZoneAndRecord,
  updateRoute53Record,
  deleteRoute53Record,
  createRoute53BulkRecord,
  createRoute53RecordFromId,
  prepareRecord,
  createHostedZoneForClient,
} = require("../services/awsRoute53");
const dnsModal = require("../model/DNSRecord");
const userModal = require("../model/Users");

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

    if (dns.length >= 1) {
      throw new Error("duplicte");
    } else {
      console.log("send to aws");
      // call create record from HostedZone Id
      const response = await createRoute53RecordFromId(hostedZoneId, record);



      if (response.status === 400) {
        throw new Error(response.message);
      } else {
              // insert record in DB;
      const { resourceRecords, recordName } = prepareRecord(record);

      const newRecord = await dnsModal.create({
        hostedZoneId: hostedZoneId,
        domain: recordName,
        type: record.type,
        ttl: parseInt(record.ttl),
        value: record.value,
        ResourceRecords: resourceRecords[0],
      });
        res.json({
          status: response.status,
          message: response.message,
          data: newRecord,
        });
      }
    }
  } catch (err) {
    console.log("crfid 52", err);
    res.json({
      status: 400,
      message: err.message,
    });
  }
};

exports.createHostedZoneOnly = async (req, res) => {
  const { hostedZoneData } = req.body;
  const { userId } = req.params;

  console.log("log hzdata 80", req.body);

  try {
    // check if hostedzone already exists

    // check if such user exist
    const isUser = await userModal.findOne({ _id: userId });

    // check if domain already exist
    // const isDomain = await

    if (!isUser) {
      // isUser = false
      res.status(200).send({
        success: false,
        message: "User does not exists",
      });
    } else {
      // console.log('else 96', isUser);

      const response = await createHostedZoneForClient(hostedZoneData);

      // create record
      const db = await dnsModal.create({
        hostedZoneId: response,
        domain: hostedZoneData.name,
        type: "NS",
        ttl: 17800,
        ResourceRecords: {
          Value: [
            "ns-896.awsdns-48.net.",
            "ns-1190.awsdns-20.org.",
            "ns-439.awsdns-54.com.",
            " ns-1972.awsdns-54.co.uk.",
          ],
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
        message: "HostedZone Created",
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
/** function to create record */
exports.createRecord = async (req, res) => {
  /**
   * hostedZoneData: HostedZoneDomainName
   * Domain Name: record[]
   */
  const { hostedZoneData, record } = req.body;

  // creating HostedZone along with RECORD
  try {
    // wait for response from AWS
    const response = await createHostedZoneAndRecord(hostedZoneData, record);

    // save new record in DB
    // const newRecord = await prisma.dNSRecord.create({
    //   data: {
    //     domain: record.domain,
    // type: record.type,
    // ttl: parseInt(record.ttl),
    // value: record.value,
    //   },
    // });
    console.log("create", response);
    const { resourceRecords, recordName } = prepareRecord(record);
    // const newRecord = undefined
    const newRecord = await dnsModal.create({
      domain: recordName,
      type: record.type,
      ttl: parseInt(record.ttl),
      value: record.value,
      ResoureRecords: resourceRecords,
      hostedZoneId: response.hostedZoneId,
    });

    res.status(201).json({
      message: "success",
      data: newRecord,
      response,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error",
      data: err.message,
      code: err.code,
    });
    console.log(err);
  }
};

/** function to create bulk records */
exports.createBulkRecords = async (req, res) => {
  // console.log(req.body);
  const { records } = req.body;

  try {
    const awsResponse = await createRoute53BulkRecord(records);

    const newRecords = async (record) => {
      console.log(record);
      await dnsModal.create({
        domain: record.domain,
        type: record.type,
        value: record.value,
        hostedZoneData: record.hostedZoneData.name,
      });

      res.status(201).json({
        message: "success",
        data: newRecords,
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
  if (!hostedZoneId) {
    res.status(200).send({
      "message": "HostZoneId is undefined. Please create a HostedZone"
    })
    
  }
  try {
    // const user = await userModal.where("_id").equals(userId);

    const dnsRecords = await dnsModal.find(
      {hostedZoneId: hostedZoneId}
    )

    // console.log("211 getRecords", user);
    console.log("211 getRecords", hostedZoneId);

    console.log("211 getRecords", dnsRecords);

    res.status(200).json({ message: "success", data: dnsRecords });
  } catch (error) {
    console.log("dc 215", error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateRecord = async (req, res) => {
  const { recordId } = req.params;
  const { record } = req.body;

  // send to route53 and update it in DB
  try {
    // send command to AWS Route 53
    const awsResponse = await updateRoute53Record(record);

    // Update record in the DB
    const updatedRecord = await prisma.dNSRecord.update({
      where: { id: recordId },
      data: {
        domain: record.domain,
        type: record.type,
        ttl: parseInt(record.ttl),
        value: record.value,
      },
    });

    res.status(200).json({
      message: "success",
      data: updatedRecord,
      awsResponse: awsResponse,
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
    const awsResponse = await deleteRoute53Record(record);
    // console.log("delete awsResp 291", awsResponse);
    // if record with HostedZone not found, Remove from DB
    if (awsResponse.status ==  false) {
      const resp = await dnsModal.deleteOne({
        _id: recordId,
      });
      console.log('db resp 301', resp);
      // return success
      res.status(204).send({
        message: `${recordId} was not found\n Removing From Database`,
        db: resp,
      });
    }
  } catch (err) {
    console.log(err);
    console.log("delete record 297", err);
  }
};
