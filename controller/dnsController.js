/**
 * * controller/dnsController.js
 * Logic for CRUD operations on DB for DNS Records
 * TODO: handle for record in DB but not on AWS Route53
 */

const { prisma } = require("../db");
const {
  createHostedZoneAndRecord,
  updateRoute53Record,
  deleteRoute53Record,
  createRoute53BulkRecord,
} = require("../services/awsRoute53");
const dnsModal = require('../model/DNSRecord');
const { getHostedZones } = require("../services/route53HostedZones");

/** function to create record */
exports.createRecord = async (req, res) => {
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
    console.log(response);
    // const newRecord = undefined
    const newRecord = await dnsModal.create({
        domain: record.domain,
        type: record.type,
        ttl: parseInt(record.ttl),
        value: record.value,
    })
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
  const { records } = req.body;

  console.log(records);

  try {
    const awsResponse = await createRoute53BulkRecord(records);

    const newRecords = await prisma.dNSRecord.createMany({
      data: records.map((record) => ({
        domain: record.domain,
        type: record.type,
        ttl: parseInt(record.ttl),
        value: record.value,
      })),
    });

    res.status(201).json({
      message: "success",
      data: newRecords,
      awsResponse: awsResponse,
    });
  } catch (err) {
    res.status(500).json({
      status: "Error",
      message: err.message,
    });
  }
};

// Function to get DNS records for a domain
exports.getRecords = async (req, res) => {
  // Implementation logic to get DNS records
  try {
    const dnsRecords = await dnsModal.find()

    res
      .status(200)
      .json({ message: "success", data: dnsRecords });

  } catch (error) {
    console.log(error);
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
    console.log(recordId);
  try {
    // get the RECORD by ID
    const record = await dnsModal.findById(recordId);
    console.log(record);
    // send command to AWS
    const awsResponse = await deleteRoute53Record(record);

    await dnsModal.deleteOne({
        "_id": recordId
    })

    // return success
    res.status(204).json({
      message: "success",
      awsResponse: awsResponse,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
