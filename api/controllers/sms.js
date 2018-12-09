require('dotenv').config();
const twilio = require('twilio');

const accountSid = process.env.TWILIO_SID,
      authToken = process.env.TWILIO_TOKEN,
      TWILIO_PHONE_FULL = '+18016917144';
var twilioClient;
if (!accountSid || !authToken) {
  console.log(`accountSid: ${accountSid}\n authToken: ${authToken}`);
  console.error('CRITICAL!!! Need to set TWILIO_SID and TWILIO_TOKEN in env for texting to not break!');
} else {
  twilioClient = new twilio(accountSid, authToken);
}

const sendSms = (req, res) => {
  const msg = req.body.msg,
        to = req.body.to;
  twilioClient.messages.create({
    body: msg,
    to: to,
    from: TWILIO_PHONE_FULL,
  }).then(() => {
    return res.status(200).send('SMS sent');
  }).catch((err) => {
    return res.status(500).send(err);
  });
};

module.exports = sendSms;