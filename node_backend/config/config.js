
const sgMail = require('@sendgrid/mail');
const dotenv = require('dotenv')
dotenv.config()

sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

module.exports = {
    sgMail,
}
