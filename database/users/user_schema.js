const mongoose = require('mongoose');

const user_schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String
    },
    college_details: {
        college_name: {
            type: String
        },
        reg_number: {
            type: String
        },
        approved: {
            type: Boolean,
            default: false
        }
    },
    applying_for: [
        {
            type: String
        }
    ],
    experiences: [
        {
            type: String
        }
    ]
});

module.exports = mongoose.model('User', user_schema, "users");