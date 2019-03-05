module.exports = (() => {
  const mongoose = require('mongoose');
  const { ValidationUtils } = require('../utils');
  const { SessionModel } = require('../models');
  const UserService = require('./user.service.js');
  const { Config } = require('../configs');

  function createUserSession(username, password) {
    return new Promise((resolve, reject) => {
      try {
        ValidationUtils.notNullOrEmpty(username, 'username');
        ValidationUtils.notNullOrEmpty(password, 'password');

        UserService.validateUser(username, password)
          .then(user => resolve(createOrUpdateUserSession(user)))
          .catch(reject);
      } catch (err) {
        reject(err);
      }
    });
  }

  function validateUserSession(_id) {
    return new Promise((resolve, reject) => {
      SessionModel.findOne({ _id })
        .populate('user')
        .then(result => {
          if (result === null) {
            const error = `Session '${_id}' not found.`;
            reject({ error });
            return;
          }
          resolve(result);
        });
    });
  }

  function createOrUpdateUserSession(user) {
    return new Promise((resolve, reject) => {
      const creationTime = new Date();
      const _id = new mongoose.Types.ObjectId();

      SessionModel.deleteMany({ user })
        .then(() => {
          resolve(new SessionModel({ _id, user, creationTime }).save());
        })
        .catch(reject);
    });
  }

  function authenticateSession(req, res, next) {
    const { authorization } = req.headers;
    validateUserSession(authorization)
      .then(result => {
        req.currentUser = result.user;
        next();
      })
      .catch(() => res.status(403).send());
  }

  return { createUserSession, validateUserSession, authenticateSession };
})();
