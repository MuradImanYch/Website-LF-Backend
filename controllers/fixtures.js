const db = require('../db.js');

module.exports.rpl = (req, res) => {
    db.query('SELECT * FROM rplfixtures', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
}

module.exports.epl = (req, res) => {
    db.query('SELECT * FROM eplfixtures', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
}

module.exports.laliga = (req, res) => {
    db.query('SELECT * FROM laligafixtures', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
}

module.exports.seriea = (req, res) => {
    db.query('SELECT * FROM serieafixtures', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
}

module.exports.bundesliga = (req, res) => {
    db.query('SELECT * FROM bundesligafixtures', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
}

module.exports.ligue1 = (req, res) => {
    db.query('SELECT * FROM ligue1fixtures', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
}

module.exports.ucl = (req, res) => {
    db.query('SELECT * FROM uclfixtures', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
}

module.exports.uel = (req, res) => {
    db.query('SELECT * FROM uelfixtures', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
}

module.exports.uecl = (req, res) => {
    db.query('SELECT * FROM ueclfixtures', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
}

module.exports.euQual = (req, res) => {
    db.query('SELECT * FROM euqualfixtures', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
}

module.exports.unl = (req, res) => {
    db.query('SELECT * FROM unlfixtures', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
}