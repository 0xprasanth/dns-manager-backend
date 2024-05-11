
const AWS = require('aws-sdk');
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_REGION = process.env.AWS_REGION;
const HOSTED_ZONE_ID = process.env.HOSTED_ZONE_ID;


const route53 = new AWS.Route53({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    region: AWS_REGION
  });

// Function to get hosted zone IDs
const getHostedZoneIds = async () => {
  try {
    const data = await route53.listHostedZones().promise();
    return data.HostedZones.map((zone) => zone.Id.replace("/hostedzone/", ""));
  } catch (error) {
    throw new Error("Error getting hosted zone IDs: " + error.message);
  }
};
// Function to get records from a hosted zone
const getRecordsFromHostedZone = async (hostedZoneId) => {
  try {
    const data = await route53
      .listResourceRecordSets({ HostedZoneId: hostedZoneId })
      .promise();
    return data.ResourceRecordSets;
  } catch (error) {
    throw new Error("Error getting records from hosted zone: " + error.message);
  }
};
// Function to get records from all hosted zones
const getAllRecords = async () => {
  try {
    const hostedZoneIds = await getHostedZoneIds();
    console.log("Hosted Zone IDs:", hostedZoneIds);

    const allRecords = await Promise.all(
      hostedZoneIds.map(async (zoneId) => {
        try {
          const records = await getRecordsFromHostedZone(zoneId);
          console.log(`Records from Hosted Zone ${zoneId}:`, records);
          return records;
        } catch (error) {
          console.error(
            `Error getting records from Hosted Zone ${zoneId}:`,
            error
          );
          return [];
        }
      })
    );

    return allRecords.flat();
  } catch (error) {
    throw new Error(
      "Error getting records from all hosted zones: " + error.message
    );
  }
};
exports.getHostedZones = async () => {
  try {
    // const command = new ListHostedZonesCommand()
    const records = await getAllRecords();
    return records;
  } catch (err) {
    console.log(err);
  }
};
