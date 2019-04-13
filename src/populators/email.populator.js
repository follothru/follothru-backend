module.exports = (() => {
  const EmailComponentPopulator = require('./email-component.populator.js');
  function populate(email) {
    const { _id, isSent, reminder, subreminder } = email;
    let { components } = email;
    if (email.components) {
      components = components.map(component =>
        EmailComponentPopulator.populate(component)
      );
    }
    return {
      id: _id,
      reminderId: reminder,
      subreminderId: subreminder,
      components,
      isSent
    };
  }
  return { populate };
})();
