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

module.exports = router;