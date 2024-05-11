// models/Users.js
const mongoose = require("mongoose");

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
  },
  {
    collection: "User",
  }
);

const model = mongoose.model("user", userSchema);

module.exports = model;