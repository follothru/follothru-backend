module.exports = (() => {
  const mongoose = require('mongoose');
  const ReminderModel = require('../models/reminder.model.js');
  const SubreminderService = require('../services/subreminder.service.js');
  const ValidationUtils = require('../utils/validation.util.js');

  function findAllReminders() {
    return ReminderModel.find().populate('event');
  }

  function createReminders(remindersToCreate) {
    return new Promise((resolve, reject) => {
      const createPromises = remindersToCreate.map(reminderConfig => {
        try {
          return createReminderWithConfig(reminderConfig);
        } catch (err) {
          console.error(
            `Failed to create reminder with config "${reminderConfig}": `,
            err
          );
        }
      });
      return Promise.all(createPromises)
        .then(newReminders =>
          newReminders.filter(reminder => reminder !== undefined)
        )
        .then(newReminders => {
          // console.log(newReminders);
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

  function createReminderWithConfig(config) {
    ValidationUtils.notNull(config);
    const { name, startDate, endDate, repeats, event } = config;
    ValidationUtils.notNullOrEmpty(name);
    ValidationUtils.notNullOrEmpty(startDate);
    const _id = new mongoose.Types.ObjectId();
    return SubreminderService.createSubreminders({ date: startDate, reminderId: _id }).then(subreminders => {
      const newReminder = new ReminderModel({
        _id,
        name,
        startDate,
        endDate,
        repeats,
        event
      });
      return newReminder.save();
    });
  }

  return { findAllReminders, createReminder, createReminders };
})();
