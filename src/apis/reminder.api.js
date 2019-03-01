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

  router.get('/', SessionService.authenticateSession, (req, res) => {
    VaultService.findAll()
      .then(results => {
        res.send(results).status(500);
      })
      .catch(err => {
        res.send(err);
      });
  });

  router.post('/', SessionService.authenticateSession, (req, res) => {
    const { type } = req.body;
    const EVENT = /EVENT/i;
    const ACTIVITY = /ACTIVITY/i;

    ReminderService.createReminder(req.body)
      .then(reminderModelIds => {
        if (type.match(EVENT)) {
          EventService.createEvent(req.body, reminderModelIds)
            .then(reminder => {
              const { name } = reminder;
              res.send(name + ' created successfully').status(200);
            })
            .catch(err => {
              console.log(err);
            });
        } else if (type.match(ACTIVITY)) {
          ActivityService.createActivity(req.body, reminderModelIds)
            .then(reminder => {
              const { name } = reminder;
              res.send(name + ' created successfully').status(200);
            })
            .catch(err => {
              console.log(err);
            });
        }
      })
      .catch(err => {
        console.log(err);
      });
  });

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
          console.error(err);
        });
    }
  );

  return router;
})();
