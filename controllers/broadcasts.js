const db = require('../db.js');

module.exports.add = (req, res) => {
    db.query('INSERT INTO broadcasts (hName, hLogo, lName, lLogo, aName, aLogo, time, broadcastLink) VALUES(?, ?, ?, ?, ?, ?, ?, ?)', [req.body.hName, req.body.hLogo, req.body.lName, req.body.lLogo, req.body.aName, req.body.aLogo, req.body.time, req.body.broadcastLink], (err => {
        if(err) throw err;
    }));
}

module.exports.get = (req, res) => {
    db.query('SELECT * FROM broadcasts', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
}