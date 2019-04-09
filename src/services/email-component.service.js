module.exports = (() => {
  const mongoose = require('mongoose');
  const { EmailComponentModel } = require('../models');

  function getAllComponents() {
    return EmailComponentModel.find();
  }

  function addComponent(content) {
    const _id = mongoose.Types.ObjectId();
    const emailComponent = new EmailComponentModel({
      _id,
      content
    });
    return emailComponent.save();
  }

  function removeComponent(componentId) {
    return EmailComponentModel.remove({
      _id: mongoose.Types.ObjectId(componentId)
    });
  }

  return { addComponent, removeComponent, getAllComponents };
})();
