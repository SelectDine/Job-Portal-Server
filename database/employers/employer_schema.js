const mongoose = require('mongoose');

const employer_schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    password: {
        type: String
    },
    hotel_details: {
        hotel_name: {
            type: String
        },
        hotel_location: {
            type: String
        },
        hotel_contact: {
            type: String
        },
        hotel_email: {
            type: String
        }
    }
});

module.exports = mongoose.model('Employer', employer_schema, "employers");