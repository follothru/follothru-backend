module.exports = (() => {
  const express = require('express');
  const router = express.Router();

  const { EmailService } = require('../services');

  const { EmailPopulator } = require('../populators');

  router.get('/', (req, res) => {
    EmailService.getAllEmail()
      .then(results => {
        return results.map(result => EmailPopulator.populate(result));
      })
      .then(result => {
        res.send(result);
      })
      .catch();
  });

  router.post('/', (req, res) => {
    EmailService.addEmail(req.body)
      .then(result => res.send(result._id))
      .catch();
  });

  router.get('/sendEmail', (req, res) => {
    EmailService.sendEmail()
      .then(() => {
        res.send({ message: 'all emails are sent successfully' });
      })
      .catch(err => {
        console.error(err);
        res.status(500).send(err);
      });
  });

  return router;
})();
