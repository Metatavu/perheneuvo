var mailerConf = {
  api_key: process.env.MAILGUN_APIKEY,
  domain: process.env.MAILGUN_DOMAIN,
  sender: process.env.MAILGUN_SENDER
};

module.exports = mailerConf;