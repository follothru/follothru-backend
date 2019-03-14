module.exports = (() => {
  const mongoose = require('mongoose');
  const { EmailComponentModel } = require('../models');
  function addComponent(component) {
    const { category, content } = component;
    const _id = mongoose.Types.ObjectId();
    const emailComponent = new EmailComponentModel({
      _id,
      category,
      content
    });
    return emailComponent.save();
  }

  function removeComponent() {}
  return { addComponent, removeComponent };
})();
