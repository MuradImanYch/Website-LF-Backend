const db = require('../db.js');

module.exports.post = (req, res) => {
    db.query('INSERT INTO poll (clientIP, choice) VALUES(?, ?)', [req.body.clientIP, req.body.choiceVal], (err => {
        if(err) throw err;
    }));
}

module.exports.getYes = (req, res) => {
    db.query(`SELECT * FROM poll WHERE choice="yes"`, (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}

module.exports.getNo = (req, res) => {
    db.query(`SELECT * FROM poll WHERE choice="no"`, (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}