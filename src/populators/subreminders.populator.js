module.exports = (() => {
  const SubreminderPopulator = require('./subreminder.populator.js');

  function populate(subreminders, forObj) {
    if (!subreminders || subreminders.length <= 0) {
      return [];
    }
    return subreminders.map(subreminder =>
      SubreminderPopulator.populate(subreminder, forObj)
    );
  }

  return { populate };
})();
