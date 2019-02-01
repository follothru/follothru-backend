module.exports = (() => {
  const express = require('express');
  const { SubreminderService } = require('../services');
  const router = express.Router();

  router.get('/', (req, res) => {
    SubreminderService.findAllSubreminders()
      .then(subreminders => {
        res.send(subreminders);
      })
      .catch();
  });

  router.post('/', (req, res) => {
    SubreminderService.createSubreminders(req.body)
      .then(() => {
        res.send();
      })
      .catch();
  });

  return router;
})();
