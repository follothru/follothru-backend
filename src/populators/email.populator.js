module.exports = (() => {
  const EmailComponentPopulator = require('./email-component.populator.js');
  function populate(email) {
    const { _id } = email;
    let { components } = email;
    if (email.components) {
      components = components.map(component =>
        EmailComponentPopulator.populate(component)
      );
    }
    return {
      id: _id,
      components
    };
  }
  return { populate };
})();
