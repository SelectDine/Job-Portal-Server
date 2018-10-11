/**
 * Created by Yash 1300 on 11-10-2018.
 */

const AuthController = require('../controllers/auth_controller');
const router = require('express').Router();

router.post('/user/signup', (req, res) => {
    let name = req.body.name;
    let contact = req.body.contact;
    let email = req.body.email;

    AuthController.register_user(name, contact, email)
        .then(data => res.json(data))
        .catch(err => res.json(err));
});

router.put('/user/resume', (req, res) => {
    let user_id = req.body.user_id;
    let applying_for = req.body.applying_for;
    let experiences = req.body.experiences;

    AuthController.add_resume(user_id, applying_for, experiences)
        .then(data => res.json(data))
        .catch(err => res.json(err));
});

router.post('/user/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    AuthController.login_user(email, password)
        .then(data => res.json(data))
        .catch(err => res.json(err));
});

module.exports = router;