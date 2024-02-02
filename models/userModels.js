const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: [true, 'email is required']
    },
    mobile:{
        type: String,
    },
    password:{
        type: String,
        required: [true, 'password is required']
    },
    isUser:{
        type: Boolean,
        default: false
    },
    isDoctor:{
        type: Boolean,
        default: false
    },
    isHospital:{
        type: Boolean,
        default: false
    }
});
const userModel = mongoose.model("userModel", userSchema);
module.exports = userModel;
