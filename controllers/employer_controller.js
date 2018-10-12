const EmployerTransactions = require('../database/employers/employer_db_transactions');
const Promise = require('bluebird');

//controller for the route -> /resume
module.exports.add_resume_employer = (emp_id, hotel_name, hotel_location, hotel_contact, hotel_email) => {
    return new Promise((resolve, reject) => {
        EmployerTransactions.update_resume(emp_id, hotel_name, hotel_location, hotel_contact, hotel_email, (err) => {
            if (err) {
                console.error(err);
                reject({success: false, message: "An error occurred"});
            } else {
                resolve({success: true, message: "Resume made successfully for employer"});
            }
        });
    });
};
