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
    phone:{
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
        required:[true,'specialization is required']
    },
    experience:{
        type: String,
        required:[true,'experience is required']
    },
    accessList:{
        type: Array,
        default: []
    },
    password:{
        type: String,
        required: [true, 'password is required']
    },
},
{ timestamps : true}
);

const doctorModel = mongoose.model("doctors", doctorSchema);
module.exports = doctorModel;