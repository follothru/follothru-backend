module.exports = (() => {
  const EmailPopulator = require('./email.populator.js');

  function populate(subreminder, forObj) {
    if (!subreminder) {
      return null;
    }
    let email;

    if (subreminder.email) {
      email = EmailPopulator.populate(subreminder.email);
    }

    return {
      id: subreminder._id,
      name: subreminder.name,
      dateTime: subreminder.dateTime,
      email,
      course: subreminder.course,
      parentReminder: subreminder.parentReminder,
      type: 'reminder',
      for: forObj
    };
  }

  return { populate };
})();
