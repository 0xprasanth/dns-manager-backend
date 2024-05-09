/**
 * * controller/dnsController.js
 * Logic for CRUD operations on DB for DNS Records
 * TODO: handle for record in DB but not on AWS Route53
*/

const { prisma } =  require("../db")
const {
    CreateHostedZoneAndRecord 
    
} = require('../services/awsRoute53')


/** function to create record */
exports.createRecord = async (req, res) => {
    const {
        hostedZoneData, 
        record 
    } = req.body;

    // creating HostedZone along with RECORD
    try{
        // wait for response from AWS
        const response = await CreateHostedZoneAndRecord(hostedZoneData, record);

        // save new record in DB
        const newRecord = await prisma.dNSRecord.create({
            data: {
                domain: record.domain,
                type: record.type,
                ttl: parseInt(record.ttl),
                value: record.value,
              }, 
        });

        res.status(201).json({
            message: "success",
            data: newRecord,
            response
        })
    }catch(err){
        res.status(500).json({
            message: 'Error',
            data: err.message
        })
    }
}


/** function to create bulk records */
exports.createBulkRecords = async (req, res) => {
    const { records } = req.body;

    try{
        // const awsResponse = await 
    }catch(err){
        res.status(500).json({
            status: "Error", 
            message: err.message
        })
    }
}

// Function to get DNS records for a domain
exports.getRecords = async (req, res) => {
    // Implementation logic to get DNS records
    try {
      const dnsRecords = await prisma.dNSRecord.findMany();
  
      res.status(200).json({ message: "success", data: dnsRecords });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };