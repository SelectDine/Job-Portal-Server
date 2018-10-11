/**
 * Created by Yash 1300 on 11-10-2018.
 */

const UserTransactions = require('../database/users/user_db_transactions');
const Promise = require('bluebird');
const jwt = require('jsonwebtoken');

module.exports.verify_user_token = (token, secret) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                console.error(err);
                reject({success: false, message: "Error decoding the token"});
            } else {
                if (!decoded)
                    reject({success: false, message: "Corrupt token provided"});
                else
                    resolve({success: true, message: "Token decoded successfully", decoded: decoded});
            }
        });
    });
};

module.exports.fetch_user_details = (user_id) => {
    return new Promise((resolve, reject) => {
        UserTransactions.find_user_by_id(user_id, (err, output_user) => {
            if (err) {
                console.error(err);
                reject({success: false, message: "An error occurred"});
            } else {
                if (!output_user)
                    reject({success: false, message: "User not found"});
                else
                    resolve({success: true, message: "User details fetched successfully", user: output_user});
            }
        });
    });
};
