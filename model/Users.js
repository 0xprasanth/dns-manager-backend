// models/Users.js
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    id: mongoose.SchemaTypes.ObjectId,
    username: String,
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },

})

exports.userModel = mongoose.model("user", userSchema);

