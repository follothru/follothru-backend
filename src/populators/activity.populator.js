module.exports = (() => {
  function populate(activity) {
    if (!activity) {
      return null;
    }
    return {
      id: activity._id,
      name: activity.name,
      type: activity.type,
      dateTime: activity.dateTime
    };
  }

  return { populate };
})();
