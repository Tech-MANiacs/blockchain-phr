const mongoose = require("mongoose");

const healthFacilitySchema = new mongoose.Schema(
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

const healthFacilityModel = mongoose.model("healthFacilities", healthFacilitySchema);

module.exports = healthFacilityModel;