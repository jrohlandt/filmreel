var emailConfig = require('../../config/email.json');
var nodemailer = require('nodemailer');

function sendWelcomeEmail(emailData, password) {
    
    var transporter = nodemailer.createTransport(emailConfig['smtpConfig']);

    var mailData = {
        from: 'postmaster@sandboxd37c679dad6b420eb248529fca01c861.mailgun.org',
        to: emailData.email,
        subject: 'Welcome!',
        html: `<h1>Welcome ${emailData.name}</h1>
                <h3>Your login details are as follows:</h3>
                <p>Your username is: ${emailData.email}</p>
                <p>passsword is: ${password} </p>`,
    };

    transporter.sendMail(mailData, function(err, result) {
        if (err) throw err;
        else console.log(result);
    });
}

module.exports = {
    send: sendWelcomeEmail,
}

