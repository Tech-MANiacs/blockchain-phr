const mongoose = require('mongoose');

const phrSchema = new mongoose.Schema({
    phrId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    bloodType: {
        type: String,
        enum: ['A', 'B', 'AB', 'O', 'Unknown'],
        default: 'Unknown'
    },
    allergies: [{
        type: String
    }],
    medications: [{
        name: String,
        dosage: String,
        frequency: String,
        StartDate: Date,
        status: String
    }],
    appointment: [{
        doctorId: String,
        date: Date,
        diagnosis: String,
        prescription: String,
        description: String,
        status: String,
    }],
    conditions: [{
        type: String
    }],
    vaccinations: [{
        name: String,
        date: Date
    }],
    surgeries: [{
        name: String,
        date: Date
    }],
    familyHistory: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const phrModel = mongoose.model('PHR', phrSchema);

module.exports = phrModel;
