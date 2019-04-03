module.exports = (() => {
  const express = require('express');
  const router = express.Router();
  const { SubreminderService } = require('../services');
  const { SubremindersPopulator } = require('../populators');

  router.post('/send', (req, res) => {
    SubreminderService.sendSubreminders()
      .then(recipients => {
        const message = `email sent to ${
          recipients && recipients.length > 0 ? recipients : 'no one'
        }`;
        res.send({ message });
      })
      .catch(err => {
        console.error(err);
        res.send({ error: err.message });
      });
  });

  return router;
})();
