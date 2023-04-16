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

module.exports.matchesslider = (req, res) => {
    db.query('SELECT * FROM matchesslider', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
}

/* module.exports.favLive = (req, res) => {
    db.query('SELECT * FROM favmatcheslive', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
} */