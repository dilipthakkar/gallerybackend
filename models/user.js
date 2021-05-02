const mongoose = require("mongoose");
const crypto = require("crypto");
const { v4 } = require("uuid");
const schema = mongoose.Schema;
const userSchema = new schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique : true
  },
  address : {
    type : String,
    required : true
  },
  contact_no : {
    type : Number,
    required : true
  },
  gender : {
    type : String,
    required : true
  },
  encrypassword: {
    type: String,
    required: true,
  },
  salt : {
      type : String,
      require : true
  },
  isVerify : {
      type : Boolean,
      required : true,
      default : false
  }
});


userSchema
  .virtual("password")
  .set(function(password) {
    this.salt = v4();
    this.encrypassword = this.securePassword(password);
  });

userSchema.methods = {
  mathcPassword: function(plainpassword) {
    return this.securePassword(plainpassword) === this.encrypassword;
  },

  securePassword: function(plainpassword) {
    if (!plainpassword) return "";
    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainpassword)
        .digest("hex");
    } catch (err) {
      return "";
    }
  }
};


const modal = mongoose.model('User' , userSchema);
module.exports = modal;
