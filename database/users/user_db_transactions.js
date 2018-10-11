/**
 * Created by Yash 1300 on 11-10-2018.
 */

const User = require('./user_schema');
const bcrypt = require('bcrypt-nodejs');

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