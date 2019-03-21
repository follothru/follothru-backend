module.exports = (() => {
  const mongoose = require('mongoose');
  const { SubreminderModel } = require('../models');
  const EmailService = require('./email.service.js');

  function getSubreminderById(id) {
    return SubreminderModel.findOne({
      _id: mongoose.Types.ObjectId(id)
    }).populate({
      path: 'email',
      populate: {
        path: 'components'
      }
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
      .catch(err => {
        return err;
      });
  }

  return { getSubreminderById, addEmail };
})();
