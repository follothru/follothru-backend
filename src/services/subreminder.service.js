module.exports = (() => {
  const mongoose = require('mongoose');
  const { SubreminderModel } = require('../models');
  const ValidationUtils = require('../utils/validation.util.js');
  const EmailService = require('./email.service.js');

  function getSubremindersToSend() {
    return SubreminderModel.find({
      dateTime: { $gte: new Date() }
    })
      .populate('course')
      .populate({
        path: 'email',
        populate: {
          path: 'components'
        }
      });
  }

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

  function deleteSubremindersByIds(subreminderIds) {
    return new Promise((resolve, reject) => {
      try {
        ValidationUtils.notNullOrEmpty(subreminderIds, 'subreminderIds');
        if (subreminderIds.length <= 0) {
          resolve();
          return;
        }
        subreminderIds = subreminderIds.map(
          id => new mongoose.Types.ObjectId(id)
        );
        SubreminderModel.deleteMany({ _id: { $in: subreminderIds } })
          .then(resolve)
          .catch(reject);
      } catch (err) {
        reject(err);
      }
    });
  }

  function addEmail(subreminderId, emailComponents) {
    return new Promise((resolve, reject) => {
      EmailService.addEmail(emailComponents)
        .then(result => {
          // this is email id
          const { _id } = result;
          return SubreminderModel.updateOne(
            { _id: mongoose.Types.ObjectId(subreminderId) },
            { $set: { email: _id } }
          );
        })
        .then(resolve)
        .catch(reject);
    });
  }

  // should return all recipients
  function sendSubreminders() {
    return new Promise((resolve, reject) => {
      getSubremindersToSend()
        .then(subreminders => {
          subreminders.map(subreminder => {
            try {
              const { isSent } = subreminder.email.isSent;
              if (!isSent) {
                const { students } = subreminder.course;
                let emailComponents = subreminder.email.components;
                // grab only the content part
                emailComponents = emailComponents.map(
                  emailComponent => emailComponent.content
                );
                const emailId = subreminder.email._id;
                EmailService.sendEmail(emailId, students, emailComponents)
                  .then(resolve)
                  .catch(reject);
              }
            } catch (err) {
              console.error(err);
            }
          });
        })
        .catch();
    });
  }

  return {
    getSubreminderById,
    addEmail,
    getSubremindersToSend,
    sendSubreminders,
    deleteSubremindersByIds
  };
})();
