const mongoose = require('mongoose');
// name:
// dob:
// gender:
// mob:
// email:
// address:
const abhaSchema = new mongoose.Schema({
    abhaId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "ID is required"],
    },
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    dob:{
        type:Date,
        required: [true, "DOB is required"]
    },
    gender:{
        type: String,
        required: [true, "Gender is required"]
    },
    mobile:{
        type: Number,
        required: [true, "Mobile number is required"]
    },
    email:{
        type: String,
        required: [true, "email is required"]
    },
    address:{
        type: String,
        required: [true, "Address is required"]
    },
})

const abhaModel = mongoose.model("abha", abhaSchema);
module.exports = abhaModel;