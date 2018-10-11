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

module.exports = router;