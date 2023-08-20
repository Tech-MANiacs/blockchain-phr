const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,'name is required']
    },
    abhaId:{
        type: String,
    },
    ethId:{
        type: String,
        required: [true, 'ethereum address is required']
    },
    key:{
        type: String,
        required: [true, 'secret key is required'],
    },
    privateKey:{
        type: String,
        required: [true, 'private key is required'],
    },
    phrId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PHR', // Reference to the PHR model
        default: null
    }
});
const patientModel = mongoose.model("patients", patientSchema);
module.exports = patientModel;


// name:
// dob:
// gender:
// mob:
// email:
// address: