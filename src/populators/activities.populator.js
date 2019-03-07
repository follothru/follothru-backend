module.exports = (() => {
  const ActivityPopulator = require('./activity.populator.js');

  function populate(activities) {
    return activities && activities.length > 0
      ? activities.map(activity => ActivityPopulator.populate(activity))
      : [];
  }

  return { populate };
})();
