module.exports = (() => {
  const mongoose = require('mongoose');
  const { EventModel } = require('../models');
  const ReminderService = require('./reminder.service.js');
  const ValidationUtils = require('../utils/validation.util.js');

  function findAllEvents() {
    return EventModel.find().populate('reminders');
  }

  function createEvent(name, date, remindersToCreate) {
    return new Promise((resolve, reject) => {
      try {
        ValidationUtils.notNullOrEmpty(name);
        // ValidationUtils.notNullOrEmpty(date);
        const _id = new mongoose.Types.ObjectId();
        // date = new Date(date);
        remindersToCreate = remindersToCreate.map(config => {
          config.event = _id;
          return config;
        });
        ReminderService.createReminders(remindersToCreate)
          .then(newReminders => {
            const reminders = newReminders.map(newReminder => newReminder._id);
            const newEvent = new EventModel({ _id, name, date, reminders });
            return newEvent.save();
          })
          .then(resolve);
      } catch (err) {
        reject(err);
      }
    });
  }

  return { findAllEvents, createEvent };
})();
