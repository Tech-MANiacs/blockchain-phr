const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    doctorId:{
        type:String
    },
    firstName:{
        type: String,
        required:[true,'first name is required']
    },
    lastName:{
        type:String,
        required:[true,'first name is required']
    },
    ethId:{
        type: String,
        required: [true, 'ethereum address is required']
    },
    privateKey:{
        type: String,
        required: [true, 'private key is required'],
    },
    city:{
        type: String,
        required:[true,'city is required']
    },
    mobile:{
        type: String,
        required:[true,'mobile number is  required']
    },
    email:{
        type: String,
        required:[true,'email is required']
    },
    address:{
        type: String,
        required: true
    },
    specialization:{
        type: String,
    },
    experience:{
        type: String,
    },
    accessList:{
        type: Array,
        default: []
    },
}
);

const doctorModel = mongoose.model("doctors", doctorSchema);
module.exports = doctorModel;