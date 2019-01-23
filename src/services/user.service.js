module.exports = (() => {
  const mongoose = require('mongoose');
  const UserModel = require('../models/user.model.js');
  const ValidationUtils = require('../utils/validation.util.js');

  function findAllUsers() {
    return UserModel.find();
  }

  function createUser(firstname, lastname, email, password) {
    return new Promise((resolve, reject) => {
      try {
        ValidationUtils.notNullOrEmpty(firstname);
        ValidationUtils.notNullOrEmpty(lastname);
        ValidationUtils.notNullOrEmpty(email);
        ValidationUtils.notNullOrEmpty(password);
        const _id = new mongoose.Types.ObjectId();
        const newUser = new UserModel({
          _id,
          firstname,
          lastname,
          email,
          password
        });
        newUser
          .save()
          .then(resolve)
          .catch(err => reject(err));
      } catch (err) {
        reject(err);
      }
    });
  }

  // array of ids
  function findUsersByIds(ids) {
    const objectIds = ids.map(id => {
      return new mongoose.Types.ObjectId(id);
    });
    return new Promise((resolve, reject) => {
      UserModel.find({ _id: { $in: objectIds } })
        .then(users => {
          resolve(users);
        })
        .catch(err => reject(err));
    });
  }

  return { findAllUsers, createUser, findUsersByIds };
})();
