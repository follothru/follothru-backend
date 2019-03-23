module.exports = (() => {
  const mongoose = require('mongoose');
  const { UserModel, UserModelEnum } = require('../models');
  const ValidationUtils = require('../utils/validation.util.js');

  class DuplicatedUserError extends Error {}

  const Errors = { DuplicatedUserError };

  function findAllUsers() {
    return UserModel.find();
  }

  function createUser(firstname, lastname, email, password) {
    return new Promise((resolve, reject) => {
      try {
        ValidationUtils.notNullOrEmpty(firstname, 'firstname');
        ValidationUtils.notNullOrEmpty(lastname, 'lastname');
        ValidationUtils.notNullOrEmpty(email, 'email');
        ValidationUtils.notNullOrEmpty(password, 'password');

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

  function findUserById(id) {
    return new Promise((resolve, reject) => {
      UserModel.find({ _id: mongoose.Types.ObjectId(id) })
        .then(user => {
          resolve(user);
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
      ? user.groups.some(group => group === UserModelEnum.UserGroup.SUPER_ADMIN)
      : false;
  }

  function isAdmin(user) {
    return user
      ? user.groups.some(group => group === UserModelEnum.UserGroup.ADMIN)
      : false;
  }

  function deleteUser(id) {
    return UserModel.deleteOne({ _id: mongoose.Types.ObjectId(id) });
  }

  function assignAdmin(id) {
    return new Promise((resolve, reject) => {
      findUserById(id)
        .then(result => {
          let message = '';
          const userGroups = result.groups;
          // if user is not an admin yet
          if (
            !userGroups.some(group => group === UserModelEnum.UserGroup.ADMIN)
          ) {
            UserModel.updateOne(
              { _id: mongoose.Types.ObjectId(id) },
              { $push: { groups: UserModelEnum.UserGroup.ADMIN } }
            )
              .then(() => {
                message = 'successfully assigned user to admin';
                resolve({ message });
              })
              .catch(reject);
          } else {
            message = 'user is already an admin';
            resolve({ message });
          }
        })
        .catch(reject);
    });
  }

  function removeAdmin(id) {
    return new Promise((resolve, reject) => {
      UserModel.update(
        {
          _id: mongoose.Types.ObjectId(id)
        },
        { $pull: { groups: UserModelEnum.UserGroup.ADMIN } },
        {
          multi: true
        }
      )
        .then(resolve)
        .catch(err => reject(err));
    });
  }

  return {
    findAllUsers,
    createUser,
    findUsersByIds,
    validateUser,
    Errors,
    isSuperAdmin,
    isAdmin,
    deleteUser,
    assignAdmin,
    removeAdmin
  };
})();
