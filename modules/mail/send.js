const config = require('../../../config.json');
const nodemailer = require('nodemailer');

const fs = require('fs');


module.exports = function (subject, text) {
  fs.writeFile('./mail', JSON.stringify({ subject, text }) + '\n', { flag: 'a' }, () => { });
  return;

  const transporter = nodemailer.createTransport({
    host: 'smtp.exmail.qq.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: config.mailUser,
      pass: config.mailPass,
    }
  });

  // setup email data with unicode symbols
  const mailOptions = {
    from: `"王建" <${config.mailUser}>`,
    to: '337034664@qq.com',
    // cc: '',
    // bcc: 'no-reply@wangjian.io',
    subject,
    text,
    // html,
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
  });
}
