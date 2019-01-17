module.exports = (() => {
  const express = require('express');
  const { ReminderService } = require('../services');
  const router = express.Router();

  router.get('/', (req, res) => {
    ReminderService.findAllReminders()
      .then(result => res.send(result))
      .catch(err => {
        console.error(err);
        res.status(500).send(err);
      });
  });

  router.post('/', (req, res) => {
    const { name } = req.body;
    ReminderService.createReminder(name)
      .then(result => {
        res.send(result);
      })
      .catch(err => {
        res.status(500).send(err);
      });
  });

  return router;
})();
