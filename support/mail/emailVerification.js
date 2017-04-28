const nodemailer = require('nodemailer');
const KEY = require('./config');

const DEFAULTS = {
    from: '<parwatkunwar11@gmail.com>',
    subject: 'Please confirm your Email account',
    text: 'verification for the email to create an account',
};

// only for gmail accounts
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'YOUR GMAIL',
        pass: 'YOUR GMAIL PASSWORD',
    },
});

module.exports = {
    send(helperOptions, cb) {
        const args = {
            from: DEFAULTS.from,
            to: helperOptions.to,
            subject: DEFAULTS.subject,
            text: DEFAULTS.text,
            html: helperOptions.html,
        };

        transporter.sendMail(args, cb);
    },
};
