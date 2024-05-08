// models/Users.js
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,

})

exports.userModel = mongoose.model("user", userSchema);

