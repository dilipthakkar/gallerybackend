const mongoose = require("mongoose");
const schema = mongoose.Schema;
const User = require('./user');
const imageSchema = new schema({
  name : {
      type : String,
      require : true
  },
  user : {
      type : mongoose.Types.ObjectId,
      ref : User
  },
  ImageData : {
      type : Buffer,
      require : true
  },
  size : {
      type : Number,
      require : true
  }
});



const modal = mongoose.model('Image' , imageSchema);
module.exports = modal;
