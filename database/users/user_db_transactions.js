/**
 * Created by Yash 1300 on 11-10-2018.
 */

const User = require('./user_schema');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');

module.exports.create_user = (name, contact, email, password, next) => {
    let user = new User({
        name: name,
        contact: contact,
        email: email,
        password: password
    });

    // Hashing the password
    bcrypt.genSalt(10, (err, salt) => {
        if (err)
            return next(err);
        bcrypt.hash(user.password, salt, null, (err, hash) => {
            if (err)
                return next(err);
            user.password = hash;
            user.save(next);
        });
    });
};

module.exports.update_resume = (user_id, applying_for, experiences, next) => {
    User.findOneAndUpdate({_id: user_id}, {applying_for: applying_for, experiences: experiences}).exec(next);
};

module.exports.find_user_by_email = (email, next) => {
    User.findOne({email: email}).exec(next);
};

module.exports.compare_password = (user, password, next) => {
    bcrypt.compare(password, user.password, (err, valid_password) => err ? next(err, null) : next(null, valid_password));
};

module.exports.generate_token = (user, secret) => {
    return jwt.sign(JSON.parse(JSON.stringify(user)), secret);
};

module.exports.find_user_by_id = (user_id, next) => {
    User.findOne({_id: user_id}).exec(next);
};