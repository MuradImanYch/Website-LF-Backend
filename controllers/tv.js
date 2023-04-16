const db = require('../db.js');

module.exports.schedule = (req, res) => {
    db.query(`SELECT * FROM tv`, (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}