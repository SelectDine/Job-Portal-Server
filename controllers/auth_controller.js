const UserTransactions = require('../database/users/user_db_transactions');
const EmployerTransactions = require('../database/employers/employer_db_transactions');
const Promise = require('bluebird');
const nodemailer = require('nodemailer');
const random_string = require('randomstring');
const sg_transport = require('nodemailer-sendgrid-transport');

// controller for the route -> /signup
module.exports.signup = (name, contact, email, user_type) => {
    return new Promise((resolve, reject) => {

        let password = random_string.generate(8);

        let options = {
            auth: {
                api_user: process.env.SENDGRID_USERNAME,
                api_key: process.env.SENDGRID_PASSWORD
            }
        };

        let email_body = {
            from: "admin@selectdine.com",
            to: email,
            subject: "Verification mail from SelectDine Job Portal",
            text: `Hello, ${name}`,
            html: `<h1>Your account password is ${password} </h1>`
        };

        let client = nodemailer.createTransport(sg_transport(options));

        client.sendMail(email_body, (err) => {
            if (err) {
                console.error(err);
                reject({success: false, message: "Problem sending verification email"});
            } else {
                console.log("email sent to " + JSON.stringify(email_body));
                if (user_type === 0) {
                    UserTransactions.create_user(name, contact, email, password, (err, output_user) => {
                        if (err){
                            console.error(err);
                            if (err.code === 11000)
                                reject({success: false, message: "User with same E-mail ID already exists"});
                            else
                                reject({success: false, message: "An error occurred"});
                        } else {
                            let secret = process.env.JWT_SECRET;
                            let token = UserTransactions.generate_token(output_user, secret);
                            resolve({success: true, message: "A verification mail containing your password has been sent to you", token: token});
                        }
                    });
                } else if (user_type === 1) {
                    EmployerTransactions.create_employer(name, contact, email, password, (err, output_employer) => {
                        if (err) {
                            console.error(err);
                            if (err.code === 11000)
                                reject({success: false, message: "Employer with same E-mail already exists"});
                            else
                                reject({success: false, message: "An error occurred"});
                        } else {
                            let secret = process.env.JWT_SECRET;
                            let token = EmployerTransactions.generate_token(output_employer, secret);

                            resolve({success: true, message: "A verification mail containing your password has been sent to you", token: token});
                        }
                    });
                } else {
                    reject({success: false, message: "Wrong user type provided"});
                }

            }
        });

    });
};


//controller for the route -> /login
module.exports.login = (email, password, user_type) => {
    return new Promise((resolve, reject) => {
        console.log("User type provided for login: " + user_type);
        if (user_type === 0) {
            UserTransactions.find_user_by_email(email, (err, output_user) => {
                if (err) {
                    console.error(err);
                    reject({success: false, message: "An error occurred"});
                } else {
                    if (!output_user)
                        reject({success: false, message: "User not found with this E-mail"});
                    else {
                        UserTransactions.compare_password(output_user, password, (err, valid_password) => {
                            if (err) {
                                console.error(err);
                                reject({success: false, message: "An error occurred"});
                            } else {
                                if (!valid_password)
                                    reject({success: false, message: "Wrong password entered"});
                                else {
                                    let jwt_secret = process.env.JWT_SECRET;
                                    let token = UserTransactions.generate_token(output_user, jwt_secret);
                                    resolve({success: true, message: "User logged in successfully", token: token});
                                }
                            }
                        });
                    }
                }
            });
        } else if (user_type === 1) {
            EmployerTransactions.find_employer_by_email(email, (err, output_employer) => {
                if (err) {
                    console.error(err);
                    reject({success: false, message: "An error occurred"});
                } else {
                    if (!output_employer)
                        reject({success: false, message: "No employer found with this E_mail"});
                    else {
                        let secret = process.env.JWT_SECRET;
                        let token = EmployerTransactions.generate_token(output_employer, secret);
                        resolve({success: true, message: "Employer logged in successfully", token: token});
                    }
                }
            });
        } else {
            reject({success: false, message: "Wrong user type provided"});
        }


    });
};