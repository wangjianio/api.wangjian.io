const config = require('../../../config.json');
const nodemailer = require('nodemailer');

module.exports = function (subject, text) {

  const transporter = nodemailer.createTransport({
    host: 'smtp.exmail.qq.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: config.mailUser,
      pass: config.mailPass,
    }
  });

  const mailOptions = {
    from: `"${config.mailName}" <${config.mailUser}>`,
    to: config.mailReceiver,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
  });
  
}
