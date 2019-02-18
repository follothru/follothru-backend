module.exports = (() => {
  const {
    MyDateMessageKey,
    MessageKey,
    ValidationUtil,
    Exception
  } = require('../utils');
  const express = require('express');
  const { ReminderService, SessionService } = require('../services');

  const router = express.Router();

  router.get('/', SessionService.authenticateSession, (req, res) => {
    ReminderService.findAllReminders()
      .then(reminders =>
        reminders.map(reminder => {
          const id = reminder._id;
          const { name, startDate, endDate, course } = reminder;
          let event = null;
          if (reminder.event) {
            event = {
              id: reminder.event._id,
              name: reminder.event.name,
              date: reminder.event.date
            };
          }
          return { id, name, startDate, endDate, event, course };
        })
      )
      .then(reminders => res.send(reminders))
      .catch(err => {
        console.error(err);
        res.status(500).send(err);
      });
  });

  router.post('/', SessionService.authenticateSession, (req, res) => {
    const { name, courseId, startDate } = req.body;
    ReminderService.createReminder(name, courseId, startDate)
      .then(result => {
        const id = result._id;
        const { name } = result;
        res.send({
          id,
          name
        });
      })
      .catch(err => {
        console.error(err);
        res.status(500).send(err);
      });
  });

  router.delete(
    '/:reminderId',
    SessionService.authenticateSession,
    (req, res) => {
      const { reminderId } = req.params;
      ReminderService.deleteReminder(reminderId)
        .then(result => {
          if (result.n <= 0) {
            throw new Error('Failed to delete reminder.');
          }
          res.send({});
        })
        .catch(err => {
          console.error(err);
          res.status(400).send(err);
        });
    }
  );

  return router;
})();
