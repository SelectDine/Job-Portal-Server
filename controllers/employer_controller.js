const EmployerTransactions = require('../database/employers/employer_db_transactions');
const JobTransactions = require('../database/jobs/job_db_transactions');
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

//controller for the route -> GET /details
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

//controller for the route -> PUT /resume
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

//controller for the route -> POST /job
module.exports.create_job = (employer_id, job_designation, job_description, vacancies_available, salary, skills_required) => {
    return new Promise((resolve, reject) => {
        if (typeof(skills_required) === 'string')
            skills_required = [skills_required];
        JobTransactions.create_job(job_designation, job_description, employer_id, vacancies_available, salary, skills_required, (err) => {
            if (err) {
                console.error(err);
                reject({success: false, message: "An error occurred"});
            } else {
                resolve({success: true, message: "Job hosted successfully"});
            }
        });
    });
};

//controller for the route -> GET /job/:job_id
module.exports.fetch_job_details = (job_id) => {
    return new Promise((resolve, reject) => {
        JobTransactions.find_job_by_id(job_id, (err, output_job) => {
            if (err) {
                console.error(err);
                reject({success: false, message: "An error occurred"});
            } else {
                if (!output_job)
                    reject({success: false, message: "Job not found"});
                else
                    resolve({success: true, message: "Job details fetched successfully", job: output_job});
            }
        });
    });
};

//controller for the route -> GET /alljobs
module.exports.fetch_all_hosted_jobs = (employer_id) => {
    return new Promise((resolve, reject) => {
        JobTransactions.fetch_jobs_hosted_by_an_employer(employer_id, (err, output_jobs) => {
            if (err) {
                console.error(err);
                reject({success: false, message: "An error occurred"});
            } else {
                resolve({success: true, message: "All hosted jobs fetched successfully", jobs: output_jobs});
            }
        });
    });
};

//controller for the route -> DELETE /job
module.exports.remove_job = (employer_id, job_id) => {
    return new Promise((resolve, reject) => {
        JobTransactions.find_job_by_id(job_id, (err, output_job) => {
            if (err) {
                console.error(err);
                reject({success: false, message: "An error occurred"});
            } else {
                if (output_job.employer._id !== employer_id)
                    reject({success: false, message: "Not Authorized to remove this job!"});
                else {
                    JobTransactions.delete_job(job_id, (err) => {
                        if (err) {
                            console.error(err);
                            reject({success: false, message: "An error occurred"});
                        } else {
                            resolve({success: true, message: "Job removed successfully"});
                        }
                    });
                }
            }
        });
    });
};

//controller for the route -> GET /job/:job_id/applicants
module.exports.get_applicants_for_a_job = (employer_id, job_id) => {
    return new Promise((resolve, reject) => {
        JobTransactions.find_job_by_id(job_id, (err, output_job) => {
            if (err) {
                console.error(err);
                reject({success: false, message: "An error occurred"});
            } else {
                if (!output_job)
                    reject({success: false, message: "Job not found"});
                else {
                    if (output_job.employer._id !== employer_id)
                        reject({success: false, message: "Not authorized to view the applicants!"});
                    else {
                        JobTransactions.find_applicants_of_a_job(job_id, (err, output_applicants) => {
                            if (err) {
                                console.error(err);
                                reject({success: false, message: "An error occurred"});
                            } else {
                                if (!output_applicants)
                                    reject({success: false, message: "No applicants found"});
                                else
                                    resolve({success: true, message: "Applicants fetched successfully", applicants: output_applicants.applicants});
                            }
                        });
                    }
                }
            }
        });
    });
};