module.exports = (() => {
  function populate(activity) {
    return activity
      ? {
        id: activity._id,
        name: activity.name,
        type: activity.type,
        dateTime: activity.dateTime
      }
      : null;
  }

  return { populate };
})();
