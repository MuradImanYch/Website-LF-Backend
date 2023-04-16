const db = require('../db.js');

module.exports.username = (req, res) => {
    db.query(`SELECT * FROM users WHERE token="${req.body.token}"`, (err, result) => {
        if(err) throw err;
        res.send(result[0]?.username);
    });
}
module.exports.getFav = (req, res) => {
    db.query(`SELECT favoriteTeams FROM users WHERE token="${req.body.token}"`, (err, result) => {
        res.send(result[0]?.favoriteTeams);
    });
}
module.exports.setFav = (req, res) => {
    db.query(`UPDATE users SET favoriteTeams='${req.body.team}' WHERE token="${req.body.token}"`);
}