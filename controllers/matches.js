const db = require('../db.js');

module.exports.live = (req, res) => {
    db.query('SELECT * FROM livematches', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
}

module.exports.ended = (req, res) => {
    db.query('SELECT * FROM endedmatches', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
}

module.exports.expectedPost = (req, res) => {
    db.query(`SELECT favMatchesExpected FROM users WHERE token="${req.body.token}"`, ((err, result) => {
        if(err) throw err;
        // res.send(result[0].favMatchesExpected);
    }));
}

module.exports.favLive = (req, res) => {
    db.query(`SELECT favMatchesLive FROM users WHERE token="${req.body.token}"`, ((err, result) => {
        if(err) throw err;
        // res.send(JSON.parse(result[0].favMatchesLive));
    }));
}