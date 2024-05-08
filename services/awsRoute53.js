const {
    Route53Client,
    ChangeResourceRecordSetsCommand,
    CreateHostedZoneCommand,
    ListHostedZonesByNameCommand
} = require("@aws-sdk/client-route-53");

exports.client = new Route53Client({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
})