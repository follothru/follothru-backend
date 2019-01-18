module.exports = (() => {
  const { ReminderModel } = require('../models/reminder.model.js');
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

  return { findAllReminders, createReminder };
})();
