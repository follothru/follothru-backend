module.exports = (() => {
  function populate(subreminder, forObj) {
    if (!subreminder) {
      return null;
    }

    return {
      id: subreminder._id,
      name: subreminder.name,
      dateTime: subreminder.dateTime,
      course: subreminder.course,
      parentReminder: subreminder.parentReminder,
      type: 'reminder',
      for: forObj
    };
  }

  return { populate };
})();
