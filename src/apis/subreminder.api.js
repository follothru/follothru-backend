module.exports = (() => {
  const express = require('express');
  const router = express.Router();
  const { SubreminderService } = require('../services');
  const { UserModelEnum } = require('../models');
  const { AuthService } = require('../services');
  const { userAuthenticatorFactory } = AuthService;

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

  router.delete(
    '/',
    userAuthenticatorFactory([
      UserModelEnum.UserGroup.INSTRUCTOR,
      UserModelEnum.UserGroup.ADMIN
    ]),
    (req, res) => {
      const { subreminderIds } = req.body;
      SubreminderService.deleteSubremindersByIds(subreminderIds)
        .then(() => res.send({ message: 'success' }))
        .catch(err => {
          console.error(err);
          res.status(500).send({ error: err.message });
        });
    }
  );
  return router;
})();
