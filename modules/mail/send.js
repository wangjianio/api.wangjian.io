const nodemailer = require('nodemailer');

module.exports = function (subject, text) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.exmail.qq.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'admin@wangjian.io',
      pass: 'nA7rdufWHS5Kihib',
    }
  });

  // setup email data with unicode symbols
  const mailOptions = {
    from: '"王建" <admin@wangjian.io>',
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