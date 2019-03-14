module.exports = (() => {
  const ReminderPopulator = require('./reminder.populator.js');
  const SubreminderCategoriesPopulator = require('./subreminder-categories.populator.js');

  function populate(reminders) {
    if (!reminders || reminders.length <= 0) {
      return [];
    }
    const results = reminders.map(reminder =>
      ReminderPopulator.populate(reminder)
    );
    const subreminders = reminders
      .reduce(
        (prev, reminder) =>
          prev.concat(reminder.events).concat(reminder.activities),
        []
      )
      .reduce((prev, curr) => prev.concat(curr.subreminders), []);
    const categories = SubreminderCategoriesPopulator.populate(subreminders);

    return { reminders: results, categories };
  }

  return { populate };
})();
