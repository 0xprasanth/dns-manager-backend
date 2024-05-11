// models/Users.js
const mongoose = require("mongoose");
const { schema } = require("./DNSRecord");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    HostedZoneId: String,

  },
  {
    collection: "User",
  }
);

const model = mongoose.model("user", userSchema);

module.exports = model;
