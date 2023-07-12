const db = require('../db.js');

module.exports.rpl = (req, res) => {
    db.query('SELECT * FROM rplinfo', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
}

module.exports.epl = (req, res) => {
    db.query('SELECT * FROM eplinfo', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
}

module.exports.laliga = (req, res) => {
    db.query('SELECT * FROM laligainfo', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
}

module.exports.seriea = (req, res) => {
    db.query('SELECT * FROM serieainfo', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
}

module.exports.bundesliga = (req, res) => {
    db.query('SELECT * FROM bundesligainfo', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
}

module.exports.ligue1 = (req, res) => {
    db.query('SELECT * FROM ligue1info', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
}

module.exports.ucl = (req, res) => {
    db.query('SELECT * FROM uclinfo', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
}

module.exports.uel = (req, res) => {
    db.query('SELECT * FROM uelinfo', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
}

module.exports.uecl = (req, res) => {
    db.query('SELECT * FROM ueclinfo', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
}

module.exports.euQual = (req, res) => {
    db.query('SELECT * FROM euqualinfo', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
}

module.exports.unl = (req, res) => {
    db.query('SELECT * FROM unlinfo', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
}