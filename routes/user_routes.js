const UserController = require('../controllers/user_controller');
const router = require('express').Router();

router.use((req, res, next) => {
    let token = req.headers["x-access-token"];
    let jwt_secret = process.env.JWT_SECRET;
    UserController.verify_user_token(token, jwt_secret)
        .then(data => {
            req.decoded = data.decoded;
            next();
        })
        .catch(err => res.json(err));
});

router.get('/details', (req, res) => {
    let user_id = req.decoded._id;

    UserController.fetch_user_details(user_id)
        .then(data => res.json(data))
        .catch(err => res.json(err));
});


router.put('/resume', (req, res) => {
    let user_id = req.decoded._id;
    let applying_for = req.body.applying_for;
    let experiences = req.body.experiences;
    let university_name = req.body.university_name;
    let reg_number = req.body.reg_number;

    UserController.add_resume_user(user_id, applying_for, experiences, university_name, reg_number)
        .then(data => res.json(data))
        .catch(err => res.json(err));
});


module.exports = router;