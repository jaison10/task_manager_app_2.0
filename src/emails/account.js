const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeMessage = ( email, name )=>{
    sgMail.send({
        to: email,
        from: 'jaisonj1010@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. Let me know how you feel.`
    })
}

const sendLeaveMessage = ( email, name )=>{
    sgMail.send({
        to: email,
        from: 'jaisonj1010@gmail.com',
        subject: 'Sorry to see you go!',
        text: `Goodbye, ${name}. I hope you back sometime soon!`
    })
}

module.exports = {
    sendWelcomeMessage,
    sendLeaveMessage
}