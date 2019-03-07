module.exports = (() => {
  const SubreminderPopulator = require('./subreminder.populator.js');

  function populate(subreminders, forObj) {
    return subreminders && subreminders.length > 0
      ? subreminders.map(subreminder =>
        SubreminderPopulator.populate(subreminder, forObj)
      )
      : [];
  }

  return { populate };
})();
