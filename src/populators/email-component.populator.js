module.exports = (() => {
  const { EmailComponentEnum } = require('../models');
  function populate(component) {
    const { _id, content } = component;
    let { category } = component;
    if (category == EmailComponentEnum.BUTTON) {
      category = 'button';
    } else if (category == EmailComponentEnum.MESSAGE) {
      category = 'message';
    }
    return {
      id: _id,
      category,
      content
    };
  }
  return { populate };
})();
