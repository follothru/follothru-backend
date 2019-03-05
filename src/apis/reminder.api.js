module.exports = (() => {
  const express = require('express');
  const {
    ReminderService,
    SessionService,
    EventService,
    ActivityService,
    VaultService
  } = require('../services');

  const router = express.Router();

  router.delete(
    '/:reminderId',
    SessionService.authenticateSession,
    (req, res) => {
      const { reminderId } = req.params;
      VaultService.deleteReminderById(reminderId)
        .then(result => {
          res.send(result);
        })
        .catch(err => {
          res.send(err);
        });
    }
  );

  return router;
})();
