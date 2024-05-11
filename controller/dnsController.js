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
  createRoute53RecordFromId,
  prepareRecord
} = require("../services/awsRoute53");
const dnsModal = require("../model/DNSRecord");
const { getHostedZones } = require("../services/route53HostedZones");

exports.createRecordFromId = async (req, res) => {
  /**
   * hostedZoneId: where to create Record
   */
  // console.log('body', req.body);
  const { record, hostedZoneId } = req.body;

  console.log(record);
  console.log(hostedZoneId);

  try {
    // call create record from HostedZone Id
    const response = await createRoute53RecordFromId(hostedZoneId, record)

    // insert record in DB;
    const { resourceRecords, recordName } = prepareRecord(record);

    const newRecord = await dnsModal.create({
      domain: recordName,
      type: record.type,
      ttl: parseInt(record.ttl),
      value: record.value,
      ResoureRecords: resourceRecords,
      hostedZoneId: hostedZoneId,
    })

    if(response.status === 400){
      throw new Error(response.message);
    }else{
      res.json({
        status: response.status,
        message: response.message,
        data: newRecord,
      });
    }

  } catch (err) {
    console.log('crfid 52',err);
    res.json({
      status: 400,
      message: err.message,
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
  try {
    const dnsRecords = await dnsModal.find();

    res.status(200).json({ message: "success", data: dnsRecords });
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

  try {
    // get the RECORD by ID
    const record = await dnsModal.findById(recordId);

    // send command to AWS
    const awsResponse = await deleteRoute53Record(record);
  } catch (err) {
    console.log(err);
    const resp = await dnsModal.deleteOne({
      _id: recordId,
    });

    // return success
    res.status(204).json({
      message: `${recordId} was not found\n Removing From Database`,
      db: resp,
    });
  }
};
