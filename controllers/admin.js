const db = require('../db.js');

module.exports.addNews = (req, res) => {
    db.query('INSERT INTO news (category, title, img, content) VALUES(?, ?, ?, ?)', [req.body.category, req.body.title, req.body.img, req.body.content], (err => {
        if(err) throw err;
    }));
}

module.exports.delNews = (req, res) => {
    db.query(`DELETE FROM news WHERE id = ${+req.body.id}`);
}

module.exports.findEditedNews = (req, res) => {
    db.query(`SELECT * FROM news WHERE id = ${req.body.id}`, (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}

module.exports.editNews = (req, res) => {
    db.query(`UPDATE news SET category = '${req.body.category}', title = '${req.body.title}', img = '${req.body.img}', content = '${req.body.content}' WHERE id = '${req.body.id}'`, (err, result) => {
        if(err) throw err;
    });
}