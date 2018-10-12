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

router.get('/details', (req, res) => {
    let emp_id = req.decoded._id;

    EmployerController.fetch_employer_details(emp_id)
        .then(data => res.json(data))
        .catch(err => res.json(err));
});

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
module.exports = router;