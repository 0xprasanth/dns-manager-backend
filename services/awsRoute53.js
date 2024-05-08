/**
 * services/awsRoute53.js
 */
const {
  Route53Client,
  ChangeResourceRecordSetsCommand,
  CreateHostedZoneCommand,
  ListHostedZonesByNameCommand,
} = require("@aws-sdk/client-route-53");
const { resource } = require("../app");

exports.client = new Route53Client({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Prepares the record ready to push
exports.prepareRecord = (record) => {
  let resourceRecords;
  let recordName = `${record.domain}`;

  /**
   * TODO: refactor with more simple approach.
   */
  if (record.type === "MX") {
    resourceRecords = [{ Value: `${record.priority} ${record.value}` }];
  } else if (record.type === "SRV") {
    resourceRecords = [
      {
        Value: `${record.priority} ${record.weight} ${record.port} ${record.target}`,
      },
    ];
  } else if (record.type === "DS") {
    resourceRecords = [
      {
        Value: `${record.keyTag} ${record.algorithm} ${record.digestType} ${record.digest}`,
      },
    ];
  } else if (record.type === "PTR" || record.type === "NS") {
    recordName = record.value;
    resourceRecords = [{ Value: record.value }];
  } else if (record.type === "TXT") {
    resourceRecords = [{ Value: `"${record.value}"` }];
  } else {
    resourceRecords = [{ Value: record.value }];
  }

  return { resourceRecords, recordName };
};

exports.createRoute53Record = async (recordParams) => {
  const { resourceRecords, recordName } = this.prepareRecord(recordParams);

  const params = {
    HostedZoneId: recordParams.HostedZoneId,
    changeBatch: {
      Changes: [
        {
          Action: "CREATE",
          ResourceRecordSet: {
            Name: recordName,
            Type: recordParams.type,
            TTL: parseInt(recordParams.ttl),
            ResourceRecords: resourceRecords,
          },
        },
      ],
    },
  };

  // send params and prepared record to AWS Route53 API
  const command = new ChangeResourceRecordSetsCommand(params);

  return await this.client.send(command);
};

exports.createHostedZone = async (hostedZoneData) => {
  const {
    name,
    // vpcId,
    // vpcRegion,
    // callerReference,

    delegationSetId,
  } = hostedZoneData;

  const params = {
    Name: name,
    // VPC: {
    //   VPCRegion: vpcRegion,
    //   VPCId: vpcId,
    // },
    CallerReference: new Date().getTime().toString(),
    DelegationSetId: delegationSetId,
  };
  const command = new CreateHostedZoneCommand(params);

  return await this.client.send(command);
};

exports.CreateHostedZoneAndRecord = async (hostedZoneData, recordData) => {
  const hostedZone = await this.createHostedZone(hostedZoneData);

  const hostedZoneId = hostedZone.HostedZone.Id.split("/").pop();

  const recordParams = {
    ...recordData,
    HostedZoneId: hostedZoneId,
  };

  return await this.createRoute53Record(recordParams);
};
