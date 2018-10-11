/**
 * Created by Yash 1300 on 11-10-2018.
 */

const UserTransactions = require('../database/users/user_db_transactions');
const Promise = require('bluebird');
const nodemailer = require('nodemailer');
const random_string = require('randomstring');
const sg_transport = require('nodemailer-sendgrid-transport');

// controller for the route -> /user/signup
module.exports.register_user = (name, contact, email) => {
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
                UserTransactions.create_user(name, contact, email, password, (err, output_user) => {
                    if (err){
                        console.error(err);
                        if (err.code === 11000)
                            reject({success: false, message: "User with same E-mail ID already exists"});
                        else
                            reject({success: false, message: "An error occurred"});
                    } else {
                        resolve({success: true, message: "A verification mail containing your password has been sent to you", user_id: output_user._id});
                    }
                });
            }
        });

    });
};