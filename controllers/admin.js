const db = require('../db.js');
const fs = require('fs');
const path = require('path');

module.exports.check = (req, res) => {
    db.query(`SELECT * FROM users WHERE token="${req.body.token}"`, ((err, result) =>{
        if(err) throw err;
        res.send(result[0]?.role);
    }));
}

module.exports.addNews = (req, res) => {
    db.query('INSERT INTO news (category, title, img, content, meta_description, meta_keywords) VALUES(?, ?, ?, ?, ?, ?)', [req.body.category, req.body.title, req.body.img, req.body.content, req.body.metaDescr, req.body.metaKeywords], (err => {
        if(err) throw err;
    }));
}

module.exports.delNews = (req, res) => {
    db.query(`DELETE FROM news WHERE id = ${+req.body.id}`);
    if(req.body.path.includes('http')) {
        return false;
    }
    else if(req.body.path.includes('/public')) {
        fs.unlink(path.join(__dirname + '/..' + req.body.path), (err) => {
            if(err) throw err;
        });
    }
    else {
        return false;
    }
}

module.exports.findEditedNews = (req, res) => {
    db.query(`SELECT * FROM news WHERE id = ${req.body.id}`, (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}

module.exports.editNews = (req, res) => {
    db.query(`UPDATE news SET category = '${req.body.category}', title = '${req.body.title}', img = '${req.body.img}', content = '${req.body.content}', meta_description = '${req.body.metaDescr}', meta_keywords = '${req.body.metaKeywords}' WHERE id = '${req.body.id}'`, (err, result) => {
        if(err) throw err;
    });
}

module.exports.delBroadcast = (req, res) => {
    db.query(`DELETE FROM broadcasts WHERE id = ${+req.body.id}`);
}

module.exports.editBroadcast = (req, res) => {
    db.query(`UPDATE broadcasts SET hName = '${req.body.hName}', hLogo = '${req.body.hLogo}', lName = '${req.body.lName}', lLogo = '${req.body.lLogo}', aName = '${req.body.aName}', aLogo = '${req.body.aLogo}', time = '${req.body.time}', broadcastLink = '${req.body.broadcastLink}' WHERE id = '${req.body.id}'`, (err, result) => {
        if(err) throw err;
    });
}

module.exports.findEditedBroadcast = (req, res) => {
    db.query(`SELECT * FROM broadcasts WHERE id = ${req.body.id}`, (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}