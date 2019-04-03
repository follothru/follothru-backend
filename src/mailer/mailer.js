module.exports = (() => {
  const nodeMailer = require('nodemailer');
  const { EmailConfig } = require('../configs/index.js');
  const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
      user: EmailConfig.username,
      pass: EmailConfig.password
    }
  });

  function sendEmail(obj) {
    const { to, from, subject, html } = obj;
    if (!to || !from || !subject || !html) {
      const message = 'fields are not satisfied';
      throw new Error({ message });
    } else {
      return transporter.sendMail(obj);
    }
  }
  return { sendEmail };
})();
