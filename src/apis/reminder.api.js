module.exports = (() => {
  const express = require('express');
  const { ReminderService } = require('../services');
  const { UserModelEnum } = require('../models');
  const { AuthService } = require('../services');
  const { userAuthenticatorFactory } = AuthService;

  const router = express.Router();

  router.delete(
    '/:reminderId',
    userAuthenticatorFactory([
      UserModelEnum.UserGroup.INSTRUCTOR,
      UserModelEnum.UserGroup.ADMIN
    ]),
    (req, res) => {
      const { reminderId } = req.params;
      ReminderService.deleteReminderById(reminderId)
        .then(result => res.send(result))
        .catch(err => {
          console.error(err);
          res.status(500).send({
            error: err.message
          });
        });
    }
  );

  return router;
})();
