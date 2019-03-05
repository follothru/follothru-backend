module.exports = (() => {
  const express = require('express');
  const { SessionService, ReminderService } = require('../services');

  const router = express.Router();

  router.delete(
    '/:reminderId',
    SessionService.authenticateSession,
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
