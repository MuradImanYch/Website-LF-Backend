const db = require('../db.js');

module.exports.all = (req, res) => {
    db.query('SELECT * FROM transferlistall', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}

module.exports.rpl = (req, res) => {
    db.query('SELECT * FROM transferlistrpl', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}

module.exports.epl = (req, res) => {
    db.query('SELECT * FROM transferlistepl', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}

module.exports.laliga = (req, res) => {
    db.query('SELECT * FROM transferlistlaliga', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}

module.exports.seriea = (req, res) => {
    db.query('SELECT * FROM transferlistseriea', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}

module.exports.bundesliga = (req, res) => {
    db.query('SELECT * FROM transferlistbundesliga', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}

module.exports.ligue1 = (req, res) => {
    db.query('SELECT * FROM transferlistligue1', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}