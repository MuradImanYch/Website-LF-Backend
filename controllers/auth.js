require('dotenv').config();
const db = require('../db.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.login = (req, res) => {
    db.query(`SELECT * FROM users WHERE username="${req.body.username}"`, (err, result) => {
        if(err) throw err;

        bcrypt.compare(req.body.password, result[0]?.password, (err, res) => {
            // if(err) throw err;

            res ? console.log('Вход разрешен') : console.log('Неверный логин или пароль');
        });
    });
}

module.exports.registration = async (req, res) => {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const token = jwt.sign({
        username: req.body.username
    }, 'secretkey', {
        expiresIn: '30d'
    });

    db.query(`SELECT * FROM users WHERE username="${req.body.username}"`, (err, result) => {
        if(err) throw err;

        result.length > 0 ? console.log('Пользователь с таким ником уже существует') : db.query('INSERT INTO users (username, password) VALUES(?, ?)', [req.body.username, passwordHash], (err => {
            if(err) throw err;
            res.send({
                token: `Bearer ${token}`
            });
            console.log('Пользователь создан');
        }));
    });
}