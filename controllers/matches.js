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