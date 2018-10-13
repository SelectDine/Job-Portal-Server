const Job = require('./job_schema');

module.exports.find_job_by_id = (job_id, next) => {
    Job.findOne({_id: job_id}).populate({path: employer, model: 'Employer'}).exec(next);
};

module.exports.find_applicants_of_a_job = (job_id, next) => {
    Job.findOne({_id: job_id}).select('applicants').populate('applicants.user').exec(next);
};

module.exports.find_recruits_of_a_job = (job_id, next) => {
    Job.findOne({_id: job_id, 'applicants.recruited': true}).select('applicants').populate('applicants.user').exec(next);
};

module.exports.fetch_jobs_hosted_by_an_employer = (emp_id, next) => {
    Job.find({employer: emp_id}, {applicants:0}).exec(next);
};

module.exports.create_job = (job_designation, job_description, employer_id, vacancies_available, salary, skills_required, next) => {
    let job = new Job({
        job_designation: job_designation,
        job_description: job_description,
        employer: employer_id,
        vacancies_available: parseInt(vacancies_available),
        salary: salary,
        skills_required: skills_required
    });

    job.save(next);
};

module.exports.delete_job = (job_id, next) => {
    Job.findOneAndDelete({_id: job_id}).exec(next);
};