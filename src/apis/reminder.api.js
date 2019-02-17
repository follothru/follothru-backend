module.exports = (() => {
  const express = require('express');
  const { ReminderService } = require('../services');
  const router = express.Router();

  router.get('/', (req, res) => {
    ReminderService.findAllReminders()
      .then(reminders =>
        reminders.map(reminder => {
          const id = reminder._id;
          const { name, startDate, endDate } = reminder;
          let event = null;
          if (reminder.event) {
            event = {
              id: reminder.event._id,
              name: reminder.event.name,
              date: reminder.event.date
            };
          }
          return { id, name, startDate, endDate, event };
        })
      )
      .then(reminders => res.send(reminders))
      .catch(err => {
        console.error(err);
        res.status(500).send(err);
      });
  });

  router.post('/', (req, res) => {
    const { name, courseId } = req.body;
    ReminderService.createReminder(name, courseId)
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

  return router;
})();
