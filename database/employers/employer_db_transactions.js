const Employer = require('./employer_schema');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');

// For saving the employer in the database
module.exports.create_employer = (name, contact, email, password, next) => {
    let employer = new Employer({
        name: name,
        contact: contact,
        email: email,
        password: password
    });

    bcrypt.genSalt(10, (err, salt) => {
        if (err)
            return next(err);
        bcrypt.hash(employer.password, salt, null, (err, hash) => {
            if (err)
                return next(err);
            employer.password = hash;
            employer.save(next);
        });
    });
};

module.exports.find_employer_by_email = (email, next) => {
    Employer.findOne({email: email}).exec(next);
};

module.exports.find_employer_by_id = (emp_id, next) => {
    Employer.findOne({_id: emp_id}).exec(next);
};

module.exports.update_resume = (emp_id, hotel_name, hotel_location, hotel_contact, hotel_email, next) => {

    let hotel_details = {
        hotel_name: hotel_name,
        hotel_location: hotel_location,
        hotel_email: hotel_email,
        hotel_contact: hotel_contact
    };

    Employer.findOneAndUpdate({_id: id}, {hotel_details:hotel_details}).exec(next);
};

module.exports.generate_token = (employer, secret) => {
    return jwt.sign(JSON.parse(JSON.stringify(employer)), secret);
};

module.exports.compare_password = (employer, password, next) => {
    bcrypt.compare(password, employer.password, (err, valid_password) => err ? next(err, null) : next(null, valid_password));
};