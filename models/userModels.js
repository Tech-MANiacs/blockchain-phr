const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,'name is required']
    },
    email:{
        type: String,
        required: [true, 'email is required']
    },
    abhaId:{
        type: String,
    },

    ethId:{
        type: String,
        required: [true, 'ethereum address is required']
    },
    password:{
        type: String,
        required: [true, 'password is required']
    },
    phr: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PHR' // Reference to the PHR model
    },
    notification:{
        type: Array,
        default: [],
    },
    seennotification:{
        type: Array,
        default: [],
    },
});
const userModel = mongoose.model("users", userSchema);
module.exports = userModel;


// name:
// dob:
// gender:
// mob:
// email:
// address: