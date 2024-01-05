const db = require('../db.js');

module.exports.seasons = (req, res) => {
    db.query('SELECT * FROM uefacountryrankseason', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.rank = (req, res) => {
    db.query('SELECT * FROM uefacountryrank', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.rpl = (req, res) => {
    db.query('SELECT * FROM rplstandings', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.epl = (req, res) => {
    db.query('SELECT * FROM eplstandings', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.laliga = (req, res) => {
    db.query('SELECT * FROM laligastandings', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.bundesliga = (req, res) => {
    db.query('SELECT * FROM bundesligastandings', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.seriea = (req, res) => {
    db.query('SELECT * FROM serieastandings', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.ligue1 = (req, res) => {
    db.query('SELECT * FROM ligue1standings', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.ucla = (req, res) => {
    db.query('SELECT * FROM uclstandingsa', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.uclb = (req, res) => {
    db.query('SELECT * FROM uclstandingsb', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.uclc = (req, res) => {
    db.query('SELECT * FROM uclstandingsc', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.ucld = (req, res) => {
    db.query('SELECT * FROM uclstandingsd', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.ucle = (req, res) => {
    db.query('SELECT * FROM uclstandingse', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.uclf = (req, res) => {
    db.query('SELECT * FROM uclstandingsf', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.uclg = (req, res) => {
    db.query('SELECT * FROM uclstandingsg', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.uclh = (req, res) => {
    db.query('SELECT * FROM uclstandingsh', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.uela = (req, res) => {
    db.query('SELECT * FROM uelstandingsa', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.uelb = (req, res) => {
    db.query('SELECT * FROM uelstandingsb', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.uelc = (req, res) => {
    db.query('SELECT * FROM uelstandingsc', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.ueld = (req, res) => {
    db.query('SELECT * FROM uelstandingsd', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.uele = (req, res) => {
    db.query('SELECT * FROM uelstandingse', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.uelf = (req, res) => {
    db.query('SELECT * FROM uelstandingsf', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.uelg = (req, res) => {
    db.query('SELECT * FROM uelstandingsg', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.uelh = (req, res) => {
    db.query('SELECT * FROM uelstandingsh', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.uecla = (req, res) => {
    db.query('SELECT * FROM ueclstandingsa', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.ueclb = (req, res) => {
    db.query('SELECT * FROM ueclstandingsb', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.ueclc = (req, res) => {
    db.query('SELECT * FROM ueclstandingsc', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.uecld = (req, res) => {
    db.query('SELECT * FROM ueclstandingsd', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.uecle = (req, res) => {
    db.query('SELECT * FROM ueclstandingse', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.ueclf = (req, res) => {
    db.query('SELECT * FROM ueclstandingsf', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.ueclg = (req, res) => {
    db.query('SELECT * FROM ueclstandingsg', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.ueclh = (req, res) => {
    db.query('SELECT * FROM ueclstandingsh', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.unla1 = (req, res) => {
    db.query('SELECT * FROM unlstandingsa1', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.unla2 = (req, res) => {
    db.query('SELECT * FROM unlstandingsa2', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.unla3 = (req, res) => {
    db.query('SELECT * FROM unlstandingsa3', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.unla4 = (req, res) => {
    db.query('SELECT * FROM unlstandingsa4', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.unlb1 = (req, res) => {
    db.query('SELECT * FROM unlstandingsb1', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.unlb2 = (req, res) => {
    db.query('SELECT * FROM unlstandingsb2', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.unlb3 = (req, res) => {
    db.query('SELECT * FROM unlstandingsb3', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.unlb4 = (req, res) => {
    db.query('SELECT * FROM unlstandingsb4', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.unlc1 = (req, res) => {
    db.query('SELECT * FROM unlstandingsc1', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.unlc2 = (req, res) => {
    db.query('SELECT * FROM unlstandingsc2', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.unlc3 = (req, res) => {
    db.query('SELECT * FROM unlstandingsc3', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.unlc4 = (req, res) => {
    db.query('SELECT * FROM unlstandingsc4', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.unld1 = (req, res) => {
    db.query('SELECT * FROM unlstandingsd1', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.unld2 = (req, res) => {
    db.query('SELECT * FROM unlstandingsd2', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.euroquala = (req, res) => {
    db.query('SELECT * FROM euroqualstandingsa', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.euroqualb = (req, res) => {
    db.query('SELECT * FROM euroqualstandingsb', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.euroqualc = (req, res) => {
    db.query('SELECT * FROM euroqualstandingsc', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.euroquald = (req, res) => {
    db.query('SELECT * FROM euroqualstandingsd', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.euroquale = (req, res) => {
    db.query('SELECT * FROM euroqualstandingse', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.euroqualf = (req, res) => {
    db.query('SELECT * FROM euroqualstandingsf', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.euroqualg = (req, res) => {
    db.query('SELECT * FROM euroqualstandingsg', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.euroqualh = (req, res) => {
    db.query('SELECT * FROM euroqualstandingsh', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.euroquali = (req, res) => {
    db.query('SELECT * FROM euroqualstandingsi', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.euroqualj = (req, res) => {
    db.query('SELECT * FROM euroqualstandingsj', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.rplTS = (req, res) => {
    db.query('SELECT * FROM rplts', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.eplTS = (req, res) => {
    db.query('SELECT * FROM eplts', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.laligaTS = (req, res) => {
    db.query('SELECT * FROM laligats', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.bundesligaTS = (req, res) => {
    db.query('SELECT * FROM bundesligats', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.serieaTS = (req, res) => {
    db.query('SELECT * FROM serieats', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.ligue1TS = (req, res) => {
    db.query('SELECT * FROM ligue1ts', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.uclTS = (req, res) => {
    db.query('SELECT * FROM uclts', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.uelTS = (req, res) => {
    db.query('SELECT * FROM uelts', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.ueclTS = (req, res) => {
    db.query('SELECT * FROM ueclts', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.unlTS = (req, res) => {
    db.query('SELECT * FROM unlTS', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.euroqualTS = (req, res) => {
    db.query('SELECT * FROM euroqualts', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}
module.exports.fifaRanking = (req, res) => {
    db.query('SELECT * FROM fifaranking', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
}