const db = require('../db.js');

module.exports.odds = (req, res) => {
    db.query(`SELECT * FROM odds`, (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}