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
    password:{
      type: String,
      required: [true, 'password is required']
  },
  },
  { timestamps: true }
);

const hospitalModel = mongoose.model("hospital", hospitalSchema);

module.exports = hospitalModel;