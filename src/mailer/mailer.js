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

  // first param of cb should return any error
  function sendEmail(obj, cb) {
    const { to, from, subject, html } = obj;
    if (!to || !from || !subject || !html) {
      const message = 'fields are not satisfied';
      cb({ message });
      return;
    } else {
      return transporter.sendMail(obj, cb);
    }
  }
  return { sendEmail };
})();
