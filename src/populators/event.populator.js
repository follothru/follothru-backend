module.exports = (() => {
  function populate(event) {
    if (!event) {
      return null;
    }
    return {
      id: event._id,
      name: event.name,
      type: event.type,
      dateTime: event.dateTime
    };
  }
  return { populate };
})();
