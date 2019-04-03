module.exports = (() => {
  const express = require('express');
  const router = express.Router();

  const { EmailService } = require('../services');

  const { EmailPopulator } = require('../populators');

  router.get('/', (req, res) => {
    EmailService.getAllEmails()
      .then(results => {
        return results.map(result => EmailPopulator.populate(result));
      })
      .then(result => {
        res.send(result);
      })
      .catch();
  });

  router.get('/template', (req, res) => {
    EmailService.getEmailTemplate()
      .then(template => {
        res.setHeader('content-type', 'text/html');
        res.send(template);
      })
      .catch(err => {
        console.error(err);
        res.send({ error: err.message });
      });
  });

  router.post('/', (req, res) => {
    EmailService.addEmail(req.body)
      .then(result => res.send(result._id))
      .catch();
  });

  return router;
})();
