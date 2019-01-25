module.exports = (() => {
  const mongoose = require('mongoose');
  const ReminderModel = require('../models/reminder.model.js');
  const ValidationUtils = require('../utils/validation.util.js');

  function findAllReminders() {
    return ReminderModel.find().then(reminders =>
      reminders.map(reminder => {
        const id = reminder._id;
        const name = reminder.name;
        return { id, name };
      })
    );
  }

  function createReminders(remindersToCreate) {
    return new Promise((resolve, reject) => {
      const createPromises = remindersToCreate
        .map(reminderConfig => {
          const _id = new mongoose.Types.ObjectId();
          const { name, date } = reminderConfig;
          return new ReminderModel({ _id, name, date });
        })
        .map(reminderModels => reminderModels.save());
      Promise.all(createPromises)
        .then(newReminders => {
          resolve(newReminders);
        })
        .catch(reject);
    });
  }

  function createReminder(name) {
    return new Promise((resolve, reject) => {
      try {
        ValidationUtils.notNullOrEmpty(name);
        const newReminder = new ReminderModel({ name });
        newReminder
          .save()
          .then(result => resolve({ id: result._id }))
          .catch(err => reject(err));
      } catch (err) {
        reject(err);
      }
    });
  }

  return { findAllReminders, createReminder, createReminders };
})();
