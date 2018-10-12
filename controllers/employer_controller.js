const EmployerTransactions = require('../database/employers/employer_db_transactions');
const Promise = require('bluebird');
const jwt = require('jsonwebtoken');

module.exports.verify_employer_token = (token, secret) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                console.error(err);
                reject({success: false, message: "Error decoding the token"});
            } else {
                if (!decoded)
                    reject({success: false, message: "Corrupt token provided"});
                else
                    resolve({success: true, message: "Token decoded successfully", decoded: decoded});
            }
        });
    });
};

//controller for the route -> /details
module.exports.fetch_employer_details = (emp_id) => {
    return new Promise((resolve, reject) => {
        EmployerTransactions.find_employer_by_id(emp_id, (err, output_employer) => {
            if (err) {
                console.error(err);
                reject({success: false, message: "An error occurred"});
            } else {
                if (!output_employer)
                    reject({success: false, message: "Employer not found with this E-mail ID"});
                else
                    resolve({success: true, message: "Employer details fetched successfully", employer: output_employer});
            }
        });
    });
};

//controller for the route -> /resume
module.exports.add_resume_employer = (emp_id, hotel_name, hotel_location, hotel_contact, hotel_email) => {
    return new Promise((resolve, reject) => {
        EmployerTransactions.update_resume(emp_id, hotel_name, hotel_location, hotel_contact, hotel_email, (err, output_employer) => {
            if (err) {
                console.error(err);
                reject({success: false, message: "An error occurred"});
            } else {
                let secret = process.env.JWT_SECRET;
                let token = EmployerTransactions.generate_token(output_employer, secret);
                resolve({success: true, message: "Resume made successfully for employer", updated_token: token});
            }
        });
    });
};
