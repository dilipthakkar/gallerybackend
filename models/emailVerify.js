const mongoose = require("mongoose");
const crypto = require("crypto");
const { v4 } = require("uuid");
const User = require('./user');
const emailVerifySchema = new mongoose.Schema({
    user : {
        type : mongoose.Types.ObjectId,
        ref : User
    },
    salt : {
        type : String,
        require : true,
        default : v4(),
    },
    createdAt: { type: Date, expires: '100m', default: Date.now }
})
const model = mongoose.model('Email' , emailVerifySchema);
module.exports = model;
