const mongoose = require('mongoose');

const job_schema = new mongoose.Schema({
    job_designation: {
        type: String,
        required: true
    },
    job_description: {
        type: String,
        default: "No description available"
    },
    applicants: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            recruited: {
                type: Boolean,
                default: false
            }
        }
    ],
    employer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employer',
        required: true
    },
    vacancies_available: {
        type: Number,
        required: true
    },
    salary: {
        type: String,
        default: "Unavailable"
    },
    skills_required: [
        {
            type: String
        }
    ]
});

module.exports = mongoose.model('Job', job_schema, "jobs");