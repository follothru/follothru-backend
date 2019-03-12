module.exports = (() => {
  const ReminderPopulator = require('./reminder.populator.js');

  function populate(reminders) {
    if (!reminders || reminders.length <= 0) {
      return [];
    }
    return reminders.map(reminder => ReminderPopulator.populate(reminder));
  }

  return { populate };
})();
