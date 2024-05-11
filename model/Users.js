// models/Users.js
const mongoose = require("mongoose");

const DNSRecordSchema = new mongoose.Schema({
  id: mongoose.Schema.ObjectId,
  domain: { type: String, required: true},
  type: { type: String, required: true},
  value: { type: String, required: true},
  ttl: { type: Number, required: true},
  ResoureRecords: {
      type: [String],
  },
  hostedZoneId: {
      type: String
  },
  priority: Number,
  wieght: Number,
  port: Number,
  target: String,
  keyTag: Number,
  algorithm: Number,
  digestType: Number,
  digest: String,
})

const userSchema = new mongoose.Schema(
  {
    id: mongoose.Schema.ObjectId,
    username: String,
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
    },
    domain: {
      type: mongoose.SchemaTypes.ObjectId
    }
  },
  {
    collection: "User",
  }
);

const model = mongoose.model("user", userSchema);

module.exports = model;