/**
 * services/awsRoute53.js
 */
const {
  Route53Client,
  ChangeResourceRecordSetsCommand,
  CreateHostedZoneCommand,
  ListHostedZonesByNameCommand,
} = require("@aws-sdk/client-route-53");

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



exports.getHostedZoneId = async (dnsName, maxItems) => {
  const params = {
    DNSName: dnsName,
    maxItems: maxItems,
  };

  try {
    const command = new ListHostedZonesByNameCommand(params);

    const reponse = await this.client.send(command);

    if (
      reponse.HostedZones.length > 0 &&
      reponse.HostedZones[0].Name === dnsName
    ) {
      return reponse.HostedZones[0].Id.split("/").pop();
    } else {
      throw new Error(`NO hosted Zone found with the DNS Name: ${dnsName}`);
    }
  } catch (error) {
    console.error(error);
  }
};

exports.createHostedZone = async (hostedZoneData) => {
  const {
    name,
    // vpcId,
    // vpcRegion,
    // callerReference,
    // delegationSetId,
  } = hostedZoneData;

  const params = {
    Name: name,
    // VPC: {
    //   VPCRegion: vpcRegion,
    //   VPCId: vpcId,
    // },
    CallerReference: new Date().getTime().toString(),
    // DelegationSetId: delegationSetId,
  };

  const command = new CreateHostedZoneCommand(params);
  // console.log(command);
  const respone = await this.client.send(command);
  // console.log(respone);
  return respone  
};

exports.CreateHostedZoneAndRecord = async (hostedZoneData, recordData) => {
  const hostedZone = await this.createHostedZone(hostedZoneData);

  const hostedZoneId = hostedZone.HostedZone.Id.split("/").pop();
  
  console.log(hostedZone);

  const recordParams = {
    ...recordData,
    HostedZoneId: hostedZoneId,
  };

  return await this.createRoute53Record(recordParams);
};

/**
 * Logic for CRUD on records
 */
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

exports.createRoute53BulkRecord = async (records) => {
  const changes = records.map((record) => {
    const { resourceRecords, recordName } = this.prepareRecord(record);

    return {
      Action: "CREATE",
      ResourceRecordSet: {
        Name: recordName,
        Type: record.type,
        TTL: parseInt(record.ttl),
        ResourceRecords: resourceRecords,
      },
    };
  });

  const params = {
    HostedZoneId: process.env.HOSTED_ZONE_ID,
    ChangeBatch: {
      Changes: changes,
    },
  };

  const command = new ChangeResourceRecordSetsCommand(params);
  return await this.client.send(command);
};

exports.updateRoute53Record = async (req, res) => {
  const { resourceRecords, recordName } = this.prepareRecord(record);

  const hostedZoneId = await this.getHostedZoneId(recordName, 1);

  const params = {
    HostedZoneId: hostedZoneId,
    ChangeBatch: {
      Changes: [
        {
          Action: "UPSERT",
          ResourceRecordSet: {
            Name: recordName,
            Type: record.type,
            TTL: parseInt(record.ttl),
            ResourceRecords: resourceRecords,
          },
        },
      ],
    },
  };

  // change result
  const command = new ChangeResourceRecordSetsCommand(params);
  return await this.client.send(command);
};

// delete record
exports.deleteRoute53Record = async (record) => {
  const { resourceRecords, recordName } = this.prepareRecord(record);

  const hostedZoneId = await this.getHostedZoneId(recordName, 1);

  const params = {
    HostedZoneId: hostedZoneId,
    ChangeBatch: {
      Changes: [
        {
          Action: "DELETE",
          ResourceRecordSet: {
            Name: recordName,
            Type: record.type,
            TTL: parseInt(record.ttl),
            ResourceRecords: resourceRecords,
          },
        },
      ],
    },
  };

  const command = new ChangeResourceRecordSetsCommand(params);
  return await this.client.send(command);
};
