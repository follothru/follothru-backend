module.exports = (() => {
  const mongoose = require('mongoose');
  const { EmailModel } = require('../models');
  const EmailComponentService = require('./email-component.service.js');
  const { Mailer } = require('../mailer');
  const fs = require('fs');

  function getAllEmails() {
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

  function addEmail(components) {
    const _id = mongoose.Types.ObjectId();
    let newEmail = new EmailModel({
      _id
    });

    newEmail.components = components;
    return newEmail.save();
  }

  function getEmailTemplate() {
    return new Promise((resolve, reject) => {
      fs.readFile(
        __dirname + '/../mailer/template/template_1.html',
        'utf8',
        (err, data) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(data);
        }
      );
    });
  }

  function sendEmail() {
    return new Promise((resolve, reject) => {
      // let obj = {
      //   to: ['gzchrisxjh@gmail.com', 'f2280c@gmail.com'],
      //   from: {
      //     name: 'follothru',
      //     address: 'psytestemail@gmail.com'
      //   },
      //   subject: 'testing',
      //   html,
      //   text: 'sent from mailer'
      // };
      // Mailer.sendEmail(obj, err => {
      //   if (err) {
      //     reject(err);
      //   } else {
      //     resolve();
      //   }
      // });
    });
  }
  return {
    addEmail,
    getAllEmails,
    addComponentsToEmail,
    sendEmail,
    getEmailTemplate
  };
})();
