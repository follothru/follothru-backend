module.exports = (() => {
  const express = require('express');
  const { ReminderService } = require('../services');
  const { UserModelEnum } = require('../models');
  const { AuthService } = require('../services');
  const { userAuthenticatorFactory } = AuthService;
  const { SubremindersPopulator } = require('../populators');

  const router = express.Router();

  router.get(
    '/',
    userAuthenticatorFactory([
      UserModelEnum.UserGroup.INSTRUCTOR,
      UserModelEnum.UserGroup.ADMIN
    ]),
    (req, res) => {
      ReminderService.getUpcomingReminders(req.currentUser)
        .then(subreminders =>
          res.send(SubremindersPopulator.populate(subreminders))
        )
        .catch(err => {
          console.error(err);
          res.status(500).send({ error: err.message });
        });
    }
  );

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
