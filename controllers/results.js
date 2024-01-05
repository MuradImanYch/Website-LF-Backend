const db = require('../db.js');

module.exports.rpl = (req, res) => {
    db.query('SELECT * FROM rplresults', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
}

module.exports.epl = (req, res) => {
    db.query('SELECT * FROM eplresults', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
}

module.exports.laliga = (req, res) => {
    db.query('SELECT * FROM laligaresults', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
}

module.exports.seriea = (req, res) => {
    db.query('SELECT * FROM seriearesults', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
}

module.exports.bundesliga = (req, res) => {
    db.query('SELECT * FROM bundesligaresults', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
}

module.exports.ligue1 = (req, res) => {
    db.query('SELECT * FROM ligue1results', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
}

module.exports.ucl = (req, res) => {
    db.query('SELECT * FROM uclresults', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
}

module.exports.uel = (req, res) => {
    db.query('SELECT * FROM uelresults', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
}

module.exports.uecl = (req, res) => {
    db.query('SELECT * FROM ueclresults', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
}

module.exports.euQual = (req, res) => {
    db.query('SELECT * FROM euqualresults', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
}

module.exports.unl = (req, res) => {
    db.query('SELECT * FROM unlresults', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
}