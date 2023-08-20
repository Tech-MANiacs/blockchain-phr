const mongoose = require('mongoose');

const healthInfoProviderSchema = new mongoose.Schema({
    doctorId:{
        type: String,
    },
    firstName:{
        type: String,
        required:[true,'first name is required']
    },
    lastName:{
        type:String,
        required:[true,'first name is required']
    },
    mobile:{
        type: String,
        required:[true,'phone number is  required']
    },
    email:{
        type: String,
        required:[true,'email is required']
    },
    city:{
        type: String,
        required:[true,'city is required']
    },
    address:{
        type: String,
        required: true
    },
    specialization:{
        type: String,
        default: ''
    },
    experience:{
        type: String,
        default: ''
    },
}, { _id: false }
);

const healthInfoProviderModel = mongoose.model("healthInfoProvider", healthInfoProviderSchema);
module.exports = healthInfoProviderModel;