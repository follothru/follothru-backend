module.exports = (() => {
  const mongoose = require('mongoose');
  const { EmailComponentModel } = require('../models');
  const { ValidationUtil } = require('../utils');

  function getAllComponents() {
    return EmailComponentModel.find();
  }

  function addComponent(templateId, values) {
    return new Promise((resolve, reject) => {
      try {
        ValidationUtil.notNullOrEmpty(templateId, 'templateId');
        ValidationUtil.notNull(values, 'values');

        const _id = mongoose.Types.ObjectId();
        const emailComponent = new EmailComponentModel({
          _id,
          templateId,
          values
        });
        emailComponent
          .save()
          .then(resolve)
          .catch(reject);
      } catch (err) {
        reject(err);
      }
    });
  }

  function removeComponent(componentId) {
    return EmailComponentModel.remove({
      _id: mongoose.Types.ObjectId(componentId)
    });
  }

  return { addComponent, removeComponent, getAllComponents };
})();
