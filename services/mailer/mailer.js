var nodemailer = require('nodemailer');
var conf = require('./config.js');

var transporter = nodemailer.createTransport({
  service: conf.service,
  auth: {
      user: conf.auth.user,
      pass: conf.auth.pass
  }
});

exports.sendMail = function(to, subject, text){
  transporter.sendMail({
    from: conf.sender,
    to: to,
    subject: subject,
    text: text
  });
};