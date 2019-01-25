module.exports = (() => {
  const express = require('express');
  const { EventService } = require('../services');
  const router = express.Router();

  router.get('/', (req, res) => {
    EventService.findAllEvents()
      .then(events =>
        events.map(event => {
          const id = event._id;
          const { name, date } = event;
          const reminders = event.reminders.map(reminder => {
            const id = reminder._id;
            const { name } = reminder;
            return { id, name };
          });
          return { id, name, date, reminders };
        })
      )
      .then(events => res.send(events))
      .catch(err => {
        console.error(err);
        res.status(500).send(err);
      });
  });

  router.post('/', (req, res) => {
    const { name, date, reminders } = req.body;
    EventService.createEvent(name, date, reminders)
      .then(newEvent => newEvent._id)
      .then(id => res.send({ id }))
      .catch(err => {
        console.error(err);
        res.status(500).send(err);
      });
  });

  return router;
})();
