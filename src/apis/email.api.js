module.exports = (() => {
  const express = require('express');
  const router = express.Router();
  const { EmailService } = require('../services');
  const { EmailComponentService } = require('../services');
  const { EmailPopulator } = require('../populators');
  const { AuthService } = require('../services');
  const { userAuthenticatorFactory } = AuthService;
  const { UserModelEnum } = require('../models');

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

  router.get(
    '/templates',
    userAuthenticatorFactory([
      UserModelEnum.UserGroup.INSTRUCTOR,
      UserModelEnum.UserGroup.ADMIN
    ]),
    (req, res) => {
      res.send(EmailService.getTemplates());
    }
  );

  router.post('/', (req, res) => {
    EmailService.addEmail(req.body)
      .then(result => res.send(result._id))
      .catch();
  });

  router.post('/templates', (req, res) => {
    const { templateId, values } = req.body;
    EmailComponentService.addComponent(templateId, values)
      .then(emailComponent => {
        res.send({ id: emailComponent._id });
      })
      .catch(err => {
        console.error(err);
        res.send({ error: err.message });
      });
  });

  return router;
})();
