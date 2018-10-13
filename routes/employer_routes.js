const EmployerController = require('../controllers/employer_controller');
const router = require('express').Router();

router.use((req, res, next) => {
    let token = req.headers["x-access-token"];
    let secret = process.env.JWT_SECRET;

    EmployerController.verify_employer_token(token, secret)
        .then(data => {
            req.decoded = data.decoded;
            next()
        })
        .catch(err => res.json(err));
});

// Route for fetching employer details
router.get('/details', (req, res) => {
    let emp_id = req.decoded._id;

    EmployerController.fetch_employer_details(emp_id)
        .then(data => res.json(data))
        .catch(err => res.json(err));
});

// Route for editing the resume of employer
router.put('/resume', (req, res) => {
    let emp_id = req.decoded._id;
    let hotel_name = req.body.hotel_name;
    let hotel_location = req.body.hotel_location;
    let hotel_contact = req.body.hotel_contact;
    let hotel_email = req.body.hotel_email;

    EmployerController.add_resume_employer(emp_id, hotel_name, hotel_location, hotel_contact, hotel_email)
        .then(data => res.json(data))
        .catch(err => res.json(err));
});

// Route for fetching all the jobs hosted by the employer
router.get('/alljobs', (req, res) => {
    let emp_id = req.decoded._id;

    EmployerController.fetch_all_hosted_jobs(emp_id)
        .then(data => res.json(data))
        .catch(err => res.json(err));
});

// Route for fetching the details of a job
router.get('/job/:job_id', (req, res) => {
    let job_id = req.params.job_id;

    EmployerController.fetch_job_details(job_id)
        .then(data => res.json(data))
        .catch(err => res.json(err));
});

// Route for hosting a job
router.post('/job', (req, res) => {
    let emp_id = req.decoded._id;
    let job_designation = req.body.job_designation;
    let job_description = req.body.job_description;
    let vacancies_available = req.body.vacancies_available;
    let salary = req.body.salary;
    let skills_required = req.body.skills_required;

    EmployerController.create_job(emp_id, job_designation, job_description, vacancies_available, salary, skills_required)
        .then(data => res.json(data))
        .catch(err => res.json(err));
});

// Route for removing a job
router.delete('/job', (req, res) => {
    let emp_id = req.decoded._id;
    let job_id = req.body.job_id;

    EmployerController.remove_job(emp_id, job_id)
        .then(data => res.json(data))
        .catch(err => res.json(err));
});

// Route for getting the list of applicants for a job

module.exports = router;