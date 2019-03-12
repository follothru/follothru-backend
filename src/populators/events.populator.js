module.exports = (() => {
  const EventPopulator = require('./event.populator.js');

  function populate(events) {
    return events && events.length > 0
      ? events.map(event => EventPopulator.populate(event))
      : [];
  }

  return { populate };
})();
