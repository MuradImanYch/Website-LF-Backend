require('dotenv').config();
const db = require('../db.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.login = (req, res) => {
    db.query(`SELECT * FROM users WHERE username="${req.body.username}"`, (err, result) => {
        if(err) throw err;

        bcrypt.compare(req.body.password, result[0]?.password, (err, response) => {
            // if(err) throw err;

            response ? res.send({message: 'Вход разрешен', auth: true, token: result[0].token}) : res.send({message: 'Неверный логин или пароль', auth: false});
        });
    });
}

module.exports.registration = async (req, res) => {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const token = jwt.sign({
        username: req.body.username,
        password: passwordHash
    }, 'secretkey', {
        expiresIn: '30d'
    });

    db.query(`SELECT * FROM users WHERE username="${req.body.username}"`, (err, result) => {
        if(err) throw err;

        result.length > 0 ? res.send({message: 'Пользователь с таким ником уже существует', auth: false}) : db.query('INSERT INTO users (username, password, token) VALUES(?, ?, ?)', [req.body.username, passwordHash, token], (err => {
            if(err) throw err;
            res.send({
                token: `${token}`,
                message: 'Пользователь создан',
                auth: true
            });
        }));
    });
}