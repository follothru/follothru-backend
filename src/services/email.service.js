module.exports = (() => {
  const mongoose = require('mongoose');
  const { EmailModel } = require('../models');
  const EmailComponentService = require('./email-component.service.js');
  const { Mailer } = require('../mailer');
  const fs = require('fs');
  const hbs = require('handlebars');

  function getAllEmails() {
    return EmailModel.find().populate('components');
  }

  function getEmailByReminderId(reminderId) {
    reminderId =
      reminderId instanceof mongoose.Types.ObjectId
        ? reminderId
        : new mongoose.Types.ObjectId(reminderId);
    return EmailModel.findOne({ reminder: reminderId }).populate('components');
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

  function getTemplates() {
    const AVAILABLE_TEMPLATES = [
      'header',
      'main-body',
      'do-it-now',
      'already-finished',
      'edit-reminders',
      'do-not-remind-again'
    ];
    const templateDir = __dirname + `/../../resources/email/templates`;
    const templates = AVAILABLE_TEMPLATES;
    let index = -1;
    return templates.map(templateId => {
      const path = `${templateDir}/${templateId}.hbs`;
      const content = openFile(path);
      index++;
      return {
        templateId,
        index,
        content
      };
    });
  }

  function getTemplate(config) {
    const inFile = __dirname + '/../mailer/template/template_1.hbs';
    const source = fs.readFileSync(inFile, 'utf8');
    const template = hbs.compile(source, { strict: true });
    const result = template(config);
    return result;
  }

  function openFile(path) {
    const fs = require('fs');
    return fs.readFileSync(path, 'utf8');
  }

  function sendEmail(emailId, recipients, emailComponents) {
    return new Promise((resolve, reject) => {
      const emails = recipients.map(recipient => {
        const html = getTemplate({ name: recipient, emailComponents });
        const obj = {
          to: recipient,
          from: {
            name: 'follothru',
            address: 'psytestemail@gmail.com'
          },
          subject: 'testing',
          html
        };
        return Mailer.sendEmail(obj);
      });
      Promise.all(emails)
        .then(() => {
          //update email to sent
          return EmailModel.updateOne({ _id: emailId }, { isSent: true });
        })
        .then(resolve(recipients))
        .catch(reject);
    });
  }
  return {
    addEmail,
    getAllEmails,
    getEmailByReminderId,
    addComponentsToEmail,
    sendEmail,
    getTemplates
  };
})();
