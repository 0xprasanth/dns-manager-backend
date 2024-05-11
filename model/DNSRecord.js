/** model/DNSRecord.js */
const mongoose = require('mongoose')

const DNSRecordSchema = new mongoose.Schema({
    id: mongoose.Schema.ObjectId,
    domain: { type: String, required: true},
    type: { type: String, required: true},
    value: { type: String, required: true},
    ttl: { type: Number, required: true},
    priority: Number,
    wieght: Number,
    port: Number,
    target: String,
    keyTag: Number,
    algorithm: Number,
    digestType: Number,
    digest: String,
})

const modal = mongoose.model("dnsrecord", DNSRecordSchema);

module.exports = modal;