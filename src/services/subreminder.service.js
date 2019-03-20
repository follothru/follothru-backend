module.exports = (() => {
  const mongoose = require('mongoose');
  const { SubreminderModel } = require('../models');
  const EmailService = require('./email.service.js');
  const { SubreminderPopulator } = require('../populators');

  function addComponentsToEmail(subreminderId, components) {
    // get the email id
    return SubreminderModel.findOne({
      _id: mongoose.Types.ObjectId(subreminderId)
    }).then(result => {
      const { email } = result;
      EmailService.addComponentsToEmail(email, components)
        .then(result => {
          return result;
        })
        .catch(err => {
          console.error(err);
        });
    });
  }

  function getSubreminderById(id) {
    return SubreminderModel.findOne({
      _id: mongoose.Types.ObjectId(id)
    })
      .populate({
        path: 'email',
        populate: {
          path: 'components'
        }
      })
      .then(subreminder => {
        return SubreminderPopulator.populate(subreminder);
      });
  }

  function addEmail(subreminderId, email) {
    return EmailService.addEmail({
      components: email.components
    })
      .then(result => {
        // this is email id
        const { _id } = result;
        return SubreminderModel.updateOne(
          { _id: mongoose.Types.ObjectId(subreminderId) },
          { $set: { email: _id } }
        );
      })
      .then(result => {
        return result;
      });
  }

  return { getSubreminderById, addEmail, addComponentsToEmail };
})();
