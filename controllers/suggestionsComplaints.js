const db = require('../db');
const nodemailer = require('nodemailer');

module.exports.send = (req, res) => {
    const transporter = nodemailer.createTransport({
    service: 'Yandex',
    auth: {
        user: 'murad-imanov-2002@yandex.com',
        pass: '0557558600webdev'
    }
    });

    const mailOptions = {
        from: 'murad-imanov-2002@yandex.com',
        to: 'mura.imanov@gmail.com',
        subject: `${req.body.topic === 'suggestion' ? 'Предложение' : 'Жалоба'} от ${req.body.name} ${req.body.lName} | ${req.body.title}`,
        text: `${req.body.text} — ${req.body.email}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        }
    });
}