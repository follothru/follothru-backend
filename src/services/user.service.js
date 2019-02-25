module.exports = (() => {
  const mongoose = require('mongoose');
  const UserModel = require('../models/user.model.js');
  const ValidationUtils = require('../utils/validation.util.js');

  class DuplicatedUserError extends Error {}

  const Errors = { DuplicatedUserError };

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
        findUserByEmail(email)
          .then(user => {
            if (user) {
              reject(
                new DuplicatedUserError(`Duplicated user with email: ${email}`)
              );
              return;
            }
            const _id = new mongoose.Types.ObjectId();
            const newUser = new UserModel({
              _id,
              firstname,
              lastname,
              email,
              password
            });
            newUser.groups = [newUser.UserGroup.INSTRUCTOR];
            newUser
              .save()
              .then(resolve)
              .catch(reject);
          })
          .catch(reject);
      } catch (err) {
        reject(err);
      }
    });
  }

  function findUserByEmail(email) {
    return UserModel.findOne({ email });
  }

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

  function validateUser(username, password) {
    return new Promise((resolve, reject) => {
      try {
        ValidationUtils.notNullOrEmpty(username, 'username');
        ValidationUtils.notNullOrEmpty(password, 'password');
        findUserByEmail(username).then(foundUsr => {
          if (foundUsr === null || foundUsr.password !== password) {
            reject(new Error('Incorrect username or password.'));
            return;
          }
          resolve(foundUsr);
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  function isSuperAdmin(user) {
    return user
      ? user.groups.some(group => group === user.UserGroup.SUPER_ADMIN)
      : false;
  }

  return {
    findAllUsers,
    createUser,
    findUsersByIds,
    validateUser,
    Errors,
    isSuperAdmin
  };
})();
