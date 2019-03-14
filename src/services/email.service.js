module.exports = (() => {
  const mongoose = require('mongoose');
  const { EmailModel } = require('../models');
  const EmailComponentService = require('./email-component.service.js');

  function getAllEmail() {
    return EmailModel.find().populate('components');
  }

  function addEmail(reqBody) {
    let { components } = reqBody;
    const _id = mongoose.Types.ObjectId();
    let newEmail = new EmailModel({
      _id
    });
    components = components.map(component =>
      EmailComponentService.addComponent(component)
    );

    return Promise.all(components)
      .then(results => {
        return results.map(res => res._id);
      })
      .then(componentIds => {
        newEmail.components = componentIds;
        return newEmail.save();
      })
      .catch();
  }
  return { addEmail, getAllEmail };
})();
