const Queue = require('bull');
// const NodeMailer = require('nodemailer');
const { sgMail } = require('../config/config')

const emailQueue = new Queue('Sending email', 'redis://127.0.0.1:6379', {
    limiter: {
        max: 100,
        duration: 10000
    }
});

emailQueue.process((job, done) => {

    try {
        const msg = {
            to: job.data.toAddress, // Change to your recipient
            from: '', // Change to your verified sender
            templateId: job.data.templateId,
            dynamicTemplateData: job.data.templateData,
        }

        sgMail
            .send(msg)
            .then((response) => {
                // console.log(response[0].statusCode)
                // console.log(response[0].headers)
                done();
            })
    } catch (e) {
        done(new Error('error sending email'));
    }
});

const sendEmail = async (options) => {
    await emailQueue.add(options);
};

module.exports = {
    sendEmail,
};
