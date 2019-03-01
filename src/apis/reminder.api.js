module.exports = (() => {
  const express = require('express');
  const {
    ReminderService,
    SessionService,
    EventService,
    ActivityService
  } = require('../services');

  const router = express.Router();

  router.get('/', SessionService.authenticateSession, (req, res) => {
    var all = [];
    ActivityService.findAllActivities()
      .then(activities => {
        all = all.concat(activities);
        return EventService.findAllEvents();
      })
      .then(events => {
        all = all.concat(events);
        res.send(events);
      })
      .catch(err => {
        console.log(err);
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
              res.send(reminder).status(200);
            })
            .catch(err => {
              console.log(err);
            });
        } else if (type.match(ACTIVITY)) {
          ActivityService.createActivity(req.body, reminderModelIds)
            .then(reminder => {
              res.send(reminder).status(200);
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
      ActivityService.deleteActivity(reminderId)
        .then(result => {
          if (result.n <= 0) {
            // try deleting it from Event Service
            return EventService.deleteEvent(reminderId);
          }
        })
        .then(result => {
          if (result.n <= 0) {
            throw 'reminder does not exist';
          }
          res.status(200).send('deleted successfully');
        })
        .catch(err => {
          console.log(err);
        });
    }
  );

  return router;
})();
