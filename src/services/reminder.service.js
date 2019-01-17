module.exports = (() => {
  const { ReminderModel } = require('../models/reminder.model.js');
  const ValidationUtils = require('../utils/validation.util.js');

  function findAllReminders() {
    return ReminderModel.find();
  }

  function createReminder(name) {
    return new Promise((resolve, reject) => {
      try {
        ValidationUtils.notNullOrEmpty(name);
        const newReminder = new ReminderModel({ name });
        newReminder
          .save()
          .then(result => resolve(result._id))
          .catch(err => reject(err));
      } catch (err) {
        reject(err);
      }
    });
  }

  return { findAllReminders, createReminder };
})();
