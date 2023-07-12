const db = require('../db.js');

module.exports.allNews = (req, res) => {
    db.query('SELECT * FROM news', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
}

module.exports.mainNews = (req, res) => {
    db.query('SELECT * FROM news WHERE category NOT IN ("blog", "video")', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
}

module.exports.blogs = (req, res) => {
    db.query('SELECT * FROM news WHERE category = "blog"', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
}

module.exports.videoNews = (req, res) => {
    db.query('SELECT * FROM news WHERE category = "video"', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
}

module.exports.rplNews = (req, res) => {
    db.query('SELECT * FROM news WHERE category = "rpl"', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
}

module.exports.eplNews = (req, res) => {
    db.query('SELECT * FROM news WHERE category = "epl"', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
}

module.exports.laligaNews = (req, res) => {
    db.query('SELECT * FROM news WHERE category = "laliga"', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
}

module.exports.serieaNews = (req, res) => {
    db.query('SELECT * FROM news WHERE category = "seriea"', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
}

module.exports.bundesligaNews = (req, res) => {
    db.query('SELECT * FROM news WHERE category = "bundesliga"', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
}

module.exports.ligue1News = (req, res) => {
    db.query('SELECT * FROM news WHERE category = "ligue1"', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
}

module.exports.uclNews = (req, res) => {
    db.query('SELECT * FROM news WHERE category = "ucl"', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
}

module.exports.uelNews = (req, res) => {
    db.query('SELECT * FROM news WHERE category = "uel"', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
}

module.exports.ueclNews = (req, res) => {
    db.query('SELECT * FROM news WHERE category = "uecl"', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
}

module.exports.euQualNews = (req, res) => {
    db.query('SELECT * FROM news WHERE category = "eu-qualification"', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
}

module.exports.wcNews = (req, res) => {
    db.query('SELECT * FROM news WHERE category = "wc"', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
}

module.exports.ecNews = (req, res) => {
    db.query('SELECT * FROM news WHERE category = "ec"', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
}

module.exports.unlNews = (req, res) => {
    db.query('SELECT * FROM news WHERE category = "unl"', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
}

module.exports.transferNews = (req, res) => {
    db.query('SELECT * FROM news WHERE category = "transfer"', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
}

module.exports.otherNews = (req, res) => {
    db.query('SELECT * FROM news WHERE category = "other"', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
}