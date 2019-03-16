module.exports = (() => {
  const ReminderPopulator = require('./reminder.populator.js');
  const DateTimeCategoriesPopulator = require('./datetime-categories.populator.js');
  const EventPopulator = require('./event.populator.js');
  const SubreminderPopulator = require('./subreminder.populator.js');

  function populate(reminders) {
    if (!reminders || reminders.length <= 0) {
      return [];
    }
    const results = reminders.map(reminder =>
      ReminderPopulator.populate(reminder)
    );
    const events = reminders.reduce(
      (prev, reminder) => prev.concat(reminder.events),
      []
    );
    const activities = reminders.reduce(
      (prev, reminder) => prev.concat(reminder.activities),
      []
    );
    const subreminders = events
      .concat(activities)
      .reduce((prev, curr) => prev.concat(curr.subreminders), []);
    const categories = {
      subreminders: DateTimeCategoriesPopulator.populate(
        subreminders,
        SubreminderPopulator
      ),
      events: DateTimeCategoriesPopulator.populate(events, EventPopulator)
    };

    return { reminders: results, categories };
  }

  return { populate };
})();
