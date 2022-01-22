const { verifyEmailtemplateId } = require('../helpers/constants');

const { sendEmail } = require('./emailQueue');

const sendVerificationEmail = data => {
    // sendEmail({
    //     toAddress: data.toAddress,
    //     templateId: verifyEmailtemplateId,
    //     templateData: {
    //         'Weblink': data.verifyUrl,
    //         'Sender_Name': data.toAddress,
    //     }
    // });
}

module.exports = {
    sendVerificationEmail,
}
