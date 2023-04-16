const db = require('../db.js');

module.exports.rpl = (req, res) => {
    db.query('SELECT * FROM rplinfo', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
}