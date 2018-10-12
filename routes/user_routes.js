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

module.exports = router;