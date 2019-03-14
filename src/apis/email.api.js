module.exports = (() => {
  const express = require('express');
  const router = express.Router();

  const { EmailService } = require('../services');
  const { EmailPopulator } = require('../populators');

  router.get('/', (req, res) => {
    EmailService.getAllEmail()
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

  return router;
})();
