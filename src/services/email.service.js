module.exports = (() => {
  const mongoose = require('mongoose');
  const { EmailModel } = require('../models');
  const { Mailer } = require('../mailer');
  const EmailComponentService = require('./email-component.service.js');

  function getAllEmail() {
    return EmailModel.find().populate('components');
  }

  function addComponentsToEmail(emailId, components) {
    return new Promise((resolve, reject) => {
      emailId = mongoose.Types.ObjectId(emailId);
      components = components.map(component =>
        EmailComponentService.addComponent(component)
      );

      Promise.all(components)
        .then(results => {
          return results.map(res => res._id);
        })
        .then(componentIds => {
          return EmailModel.updateOne(
            { _id: emailId },
            { $push: { components: { $each: componentIds } } }
          );
        })
        .then(resolve)
        .catch(err => {
          reject(err);
          console.error(err);
        });
    });
  }

  function addEmail(req) {
    let { components } = req;
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

  function sendEmail() {
    return new Promise((resolve, reject) => {
      let obj = {
        to: ['gzchrisxjh@gmail.com', 'f2280c@gmail.com'],
        from: {
          name: 'follothru',
          address: 'psytestemail@gmail.com'
        },
        subject: 'testing',
        html: '<strong>sent from mailer</strong>',
        text: 'sent from mailer'
      };
      Mailer.sendEmail(obj, err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
  return { addEmail, getAllEmail, addComponentsToEmail, sendEmail };
})();
