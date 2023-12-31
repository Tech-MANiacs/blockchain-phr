const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema(
  {
    hospitalId: {
      type: String,
      required: true,
    },
    name:{
      type: String,
      required: true
    },
    city:{
        type: String,
        required: true
    },
    pinCode:{
        type: String,
        required: true
    },
    ethId:{
        type: String,
        required: [true, 'ethereum address is required']
    },
    privateKey:{
        type: String,
        required: [true, 'private key is required'],
    },
    mobile:{
        type: String,
        required:[true,'mobile number is  required']
    },
    email:{
        type: String,
        required:[true,'email is required']
    }
  },
  { timestamps: true }
);

const hospitalModel = mongoose.model("hospital", hospitalSchema);

module.exports = hospitalModel;