module.exports = (() => {
  function populate(event) {
    return event
      ? {
        id: event._id,
        name: event.name,
        type: event.type,
        dateTime: event.dateTime
      }
      : null;
  }
  return { populate };
})();
