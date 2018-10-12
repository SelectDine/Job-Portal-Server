const AuthController = require('../controllers/auth_controller');
const router = require('express').Router();

router.post('/signup', (req, res) => {
    let name = req.body.name;
    let contact = req.body.contact;
    let email = req.body.email;
    let user_type = parseInt(req.body.user_type);

    // user_type = 0 -> user
    // user_type = 1 -> employer

    AuthController.signup(name, contact, email, user_type)
        .then(data => res.json(data))
        .catch(err =>  res.json(err));
});

router.post('/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let user_type = parseInt(req.body.user_type);
    console.log("User type provided for login: " + req.body.user_type);

    // user_type = 0 -> user
    // user_type = 1 -> employer

    AuthController.login(email, password, user_type)
        .then(data => res.json(data))
        .catch(err => res.json(err));

});


router.put('/employer/resume', (req, res) => {
    let emp_id = req.body.emp_id;
    let hotel_name = req.body.hotel_name;
    let hotel_location = req.body.hotel_location;
    let hotel_contact = req.body.hotel_contact;
    let hotel_email = req.body.hotel_email;

    AuthController.add_resume_employer(emp_id, hotel_name, hotel_location, hotel_contact, hotel_email)
        .then(data => res.json(data))
        .catch(err => res.json(err));

});

module.exports = router;