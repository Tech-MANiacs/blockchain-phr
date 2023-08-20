const mongoose = require('mongoose');

const encryptedFieldSchema = new mongoose.Schema({
    fieldName: {
        type: String,
        required: true,
    },
    iv: {
        type: String,
        required: true,
    },
    encryptedData: {
        type: String,
        required: true,
    }
});

const phrSchema = new mongoose.Schema({
    // userId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true,
    //     default: mongoose.Types.ObjectId // Generate a new ObjectId as the default value
    // },
    encryptedFields: [encryptedFieldSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const phrModel = mongoose.model('PHR', phrSchema);

module.exports = phrModel;
