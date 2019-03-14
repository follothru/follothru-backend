module.exports = (() => {
  const mongoose = require('mongoose');
  const ValidationUtils = require('../utils/validation.util.js');
  const { SessionModel } = require('../models');
  const UserService = require('./user.service.js');

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

  function validateUserSession(authToken) {
    return new Promise((resolve, reject) => {
      const token = authToken.replace('Bearer ', '');
      SessionModel.findOne({ _id: token })
        .populate('user')
        .then(result => {
          if (result === null) {
            const error = `Session '${authToken}' not found.`;
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

  function authenticateSession(req, res) {
    const { authorization } = req.headers;
    return validateUserSession(authorization)
      .then(result => result.user)
      .catch(() => {
        const error = 'failed to authenticate session';
        res.status(403).send({ error });
      });
  }

  return { createUserSession, validateUserSession, authenticateSession };
})();
