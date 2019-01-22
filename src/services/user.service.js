module.exports = (() => {
    const mongoose = require('mongoose');
    const { UserModel } = require('../models/user.model.js');
    const ValidationUtils = require('../utils/validation.util.js');
    
    function findAllUsers() {
        return UserModel.find().then(users =>
            users.map(user => {
                const id = user._id;
                const { firstname, lastname, email } = user;
                return { id, firstname, lastname, email };
            })
            );
        }
        
        function createUser(firstname, lastname, email, password) {
            return new Promise((resolve, reject) => {
                try {
                    ValidationUtils.notNullOrEmpty(firstname);
                    ValidationUtils.notNullOrEmpty(lastname);
                    ValidationUtils.notNullOrEmpty(email);
                    ValidationUtils.notNullOrEmpty(password);
                    const _id = new mongoose.Types.ObjectId();
                    const newUser = new UserModel({ _id, firstname, lastname, email, password });
                    newUser
                    .save()
                    .then(result => resolve({ id: result._id }))
                    .catch(err => reject(err));
                } catch (err) {
                    reject(err);
                }
            });
        }
        
        // array of ids
        function findUsersByIds(ids){
            const objectIds = ids.map(id => {
                return new mongoose.Types.ObjectId(id);
            });
            return new Promise((resolve, reject) => {
                UserModel.find({"_id": {"$in": objectIds}}).then(users => {
                    resolve(users);
                }).catch(err => reject(err));
            });
        }
        
        return { findAllUsers, createUser, findUsersByIds };
    })();
    