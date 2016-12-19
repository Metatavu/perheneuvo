var config = require('./config.js');
var mailgun = require('mailgun-js')({apiKey: config.api_key, domain: config.domain});
var sender = config.sender+'@'+config.domain;

exports.sendMail = function(to, subject, text, callback) {
  mailgun.messages().send({
    from: sender,
    to: to,
    subject: subject,
    html: text
  }, function (error, body) {
    if(typeof(callback) == 'function') {
      callback(error, body);
    }
  });
};