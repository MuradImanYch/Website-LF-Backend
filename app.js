const express = require('express');
const PORT = process.env.PORT || 8080;
const cheerio = require('cheerio');
const axios = require('axios');
const CyrillicToTranslit = require('cyrillic-to-translit-js');
const iconv = require('iconv-lite');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('mysql');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use(express.json());

const con = db.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'legfootball'
});
con.connect(err => {
    if(err) throw err;
    console.log('Connected to DB');
});

// admin
app.post('/addNews', (req, res) => {
    con.query('INSERT INTO news (category, title, img, content) VALUES(?, ?, ?, ?)', [req.body.category, req.body.title, req.body.img, req.body.content], (err => {
        if(err) throw err;
    }));
});
app.post('/delNews', (req, res) => {
    con.query(`DELETE FROM news WHERE id = ${+req.body.id}`);
});
app.post('/findEditedNews', (req, res) => {
    con.query(`SELECT * FROM news WHERE id = ${req.body.id}`, (err, result) => {
        if(err) throw err;
        res.send(result);
    });
});
app.post('/editNews', (req, res) => {
    con.query(`UPDATE news SET category = '${req.body.category}', title = '${req.body.title}', img = '${req.body.img}', content = '${req.body.content}' WHERE id = '${req.body.id}'`, (err, result) => {
        if(err) throw err;
    });
});

let uefaCountryRank = [],
    uefaCountryRankSeason = [],
    transferList = [],
    rplStandings = [],
    eplStandings = [],
    laligaStandings = [],
    bundesligaStandings = [],
    serieaStandings = [],
    ligue1Standings = [],
    endedMatches = [],
    forecasts = [],
    matchesSlider = [],
    matchesSliderCoefLinks = [],
    matchesSliderCoefsW1 = [],
    matchesSliderCoefsD = [],
    matchesSliderCoefsW2 = [],
    teams = ["Челси", "Манчестер Сити", "Манчестер Юнайтед", "Ливерпуль", "Арсенал", "Тоттенхэм", "Барселона", "Атлетико Мадрид", "Реал Мадрид", "Севилья", "ПСЖ", "Марсель", "Лион", "Монако", "Ювентус", "Интер", "Милан", "Лацио", "Аталанта", "Наполи", "Рома", "Бавария", "Боруссия Дортмунд", "РБ Лейпциг", "Зенит", "ЦСКА Москва", "Спартак", "Краснодар", "Локомотив Москва", "Динамо Москва", "Шахтер", "Динамо Киев", "Заря", "Порту", "Бенфика", "Спортинг Лиссабон", "Брага", "ПСВ", "Аякс", "Фейеноорд", "Кайрат", "Астана", "Карабах Агдам", "Нефтчи", "Шериф", "Фенербахче", "Бешикташ", "Галатасарай", "БАТЭ", "Динамо Минск", "Пахтакор", "Насаф", "Динамо Тбилиси", "Динамо Батуми", "Пюник", "Алашкерт", "Рига", "РФШ", "Жальгирис", "Судува", "Флора", "Левадия", "Дордой", "Абдыш-Ата", "Истиклол Душанбе", "Худжанд", "Алтын Асыр", "Ахал", "Россия", "Испания", "Франция", "Аргентина", "Португалия", "Бразилия", "Германия", "Бельгия", "Англия", "Италия", "Мексика", "Уругвай", "США", "Хорватия", "Сенегал", "Япония", "Камерун", "Алжир", "Турция", "Нидерланды", "Украина", "Азербайджан", "Южная Корея", "Грузия", "Казахстан", "Беларусь", "Узбекистан", "Молдова", "Армения", "Кыргызстан", "Кыргызстан", "Литва", "Латвия", "Эстония", "Туркменистан", "Катар"],
    matchesSliderLeagueNameRoundDate = [],
    matchesSliderStadiums = [],
    matchesSliderVenue = [],
    matchesSliderReferee = [],
    matchesSliderWeatherIco = [],
    matchesSliderWeatherDescr = [],
    uclStandingsA = [],
    uclStandingsB = [],
    uclStandingsC = [],
    uclStandingsD = [],
    uclStandingsE = [],
    uclStandingsF = [],
    uclStandingsG = [],
    uclStandingsH = [],
    uelStandingsA = [],
    uelStandingsB = [],
    uelStandingsC = [],
    uelStandingsD = [],
    uelStandingsE = [],
    uelStandingsF = [],
    uelStandingsG = [],
    uelStandingsH = [],
    ueclStandingsA = [],
    ueclStandingsB = [],
    ueclStandingsC = [],
    ueclStandingsD = [],
    ueclStandingsE = [],
    ueclStandingsF = [],
    ueclStandingsG = [],
    ueclStandingsH = [],
    liveMatches = [],
    liveMatchesLinks = [],
    liveMatchesLeagueNameRoundDate = [],
    rplTopScores = [],
    eplTopScores = [],
    laligaTopScores = [],
    bundesligaTopScores = [],
    serieaTopScores = [],
    ligue1TopScores = [],
    uclTopScores = [],
    uelTopScores = [],
    ueclTopScores = [],
    unlTopScores = [],
    unlStandingsA1 = [],
    unlStandingsA2 = [],
    unlStandingsA3 = [],
    unlStandingsA4 = [],
    unlStandingsB1 = [],
    unlStandingsB2 = [],
    unlStandingsB3 = [],
    unlStandingsB4 = [],
    unlStandingsC1 = [],
    unlStandingsC2 = [],
    unlStandingsC3 = [],
    unlStandingsC4 = [],
    unlStandingsD1 = [],
    unlStandingsD2 = [],
    matchesSchedule = [],
    fifaRanking = [],
    euroQualStandingsA = [],
    euroQualStandingsB = [],
    euroQualStandingsC = [],
    euroQualStandingsD = [],
    euroQualStandingsE = [],
    euroQualStandingsF = [],
    euroQualStandingsG = [],
    euroQualStandingsH = [],
    euroQualStandingsI = [],
    euroQualStandingsJ = [],
    transferListRpl = [],
    transferListEpl = [],
    transferListLaliga = [],
    transferListSeriea = [],
    transferListBundesliga = [],
    transferListLigue1 = [],
    rplSeasonInfo,
    rplLastWinner,
    rplMostWinner
    

app.get('/liveMatches', (req, res) => {
    res.send(liveMatches);
});
app.get('/uefaCountryRankSeason', (req, res) => {
    res.send(uefaCountryRankSeason);
});
app.get('/uefaCountryRank', (req, res) => {
    res.send(uefaCountryRank);
});
app.get('/transferList', (req, res) => {
    res.send(transferList);
});
app.get('/allNews', (req, res) => {
    con.query('SELECT * FROM news', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
});
app.get('/mainNews', (req, res) => {
    con.query('SELECT * FROM news WHERE category NOT IN ("blog", "video")', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
});
app.get('/blogs', (req, res) => {
    con.query('SELECT * FROM news WHERE category = "blog"', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
});
app.get('/videoNews', (req, res) => {
    con.query('SELECT * FROM news WHERE category = "video"', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
});
app.get('/rplNews', (req, res) => {
    con.query('SELECT * FROM news WHERE category = "rpl"', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
});
app.get('/eplNews', (req, res) => {
    con.query('SELECT * FROM news WHERE category = "epl"', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
});
app.get('/laligaNews', (req, res) => {
    con.query('SELECT * FROM news WHERE category = "laliga"', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
});
app.get('/serieaNews', (req, res) => {
    con.query('SELECT * FROM news WHERE category = "seriea"', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
});
app.get('/bundesligaNews', (req, res) => {
    con.query('SELECT * FROM news WHERE category = "bundesliga"', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
});
app.get('/ligue1News', (req, res) => {
    con.query('SELECT * FROM news WHERE category = "ligue1"', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
});
app.get('/uclNews', (req, res) => {
    con.query('SELECT * FROM news WHERE category = "ucl"', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
});
app.get('/uelNews', (req, res) => {
    con.query('SELECT * FROM news WHERE category = "uel"', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
});
app.get('/ueclNews', (req, res) => {
    con.query('SELECT * FROM news WHERE category = "uecl"', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
});
app.get('/wcNews', (req, res) => {
    con.query('SELECT * FROM news WHERE category = "wc"', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
});
app.get('/ecNews', (req, res) => {
    con.query('SELECT * FROM news WHERE category = "ec"', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
});
app.get('/unlNews', (req, res) => {
    con.query('SELECT * FROM news WHERE category = "unl"', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
});
app.get('/transferNews', (req, res) => {
    con.query('SELECT * FROM news WHERE category = "transfer"', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
});
app.get('/otherNews', (req, res) => {
    con.query('SELECT * FROM news WHERE category = "other"', ((err, result) => {
        if(err) throw err;
        res.send(result);
    }));
});
app.get('/rplStandings', (req, res) => {
    res.send(rplStandings);
});
app.get('/eplStandings', (req, res) => {
    res.send(eplStandings);
});
app.get('/laligaStandings', (req, res) => {
    res.send(laligaStandings);
});
app.get('/bundesligaStandings', (req, res) => {
    res.send(bundesligaStandings);
});
app.get('/serieaStandings', (req, res) => {
    res.send(serieaStandings);
});
app.get('/ligue1Standings', (req, res) => {
    res.send(ligue1Standings);
});
app.get('/endedMatches', (req, res) => {
    res.send(endedMatches);
});
app.get('/forecasts', (req, res) => {
    res.send(forecasts);
});
app.get('/matchesSlider', (req, res) => {
    res.send(matchesSlider);
});
app.get('/uclStandingsA', (req, res) => {
    res.send(uclStandingsA);
});
app.get('/uclStandingsB', (req, res) => {
    res.send(uclStandingsB);
});
app.get('/uclStandingsC', (req, res) => {
    res.send(uclStandingsC);
});
app.get('/uclStandingsD', (req, res) => {
    res.send(uclStandingsD);
});
app.get('/uclStandingsE', (req, res) => {
    res.send(uclStandingsE);
});
app.get('/uclStandingsF', (req, res) => {
    res.send(uclStandingsF);
});
app.get('/uclStandingsG', (req, res) => {
    res.send(uclStandingsG);
});
app.get('/uclStandingsH', (req, res) => {
    res.send(uclStandingsH);
});
app.get('/uelStandingsA', (req, res) => {
    res.send(uelStandingsA);
});
app.get('/uelStandingsB', (req, res) => {
    res.send(uelStandingsB);
});
app.get('/uelStandingsC', (req, res) => {
    res.send(uelStandingsC);
});
app.get('/uelStandingsD', (req, res) => {
    res.send(uelStandingsD);
});
app.get('/uelStandingsE', (req, res) => {
    res.send(uelStandingsE);
});
app.get('/uelStandingsF', (req, res) => {
    res.send(uelStandingsF);
});
app.get('/uelStandingsG', (req, res) => {
    res.send(uelStandingsG);
});
app.get('/uelStandingsH', (req, res) => {
    res.send(uelStandingsH);
});
app.get('/ueclStandingsA', (req, res) => {
    res.send(ueclStandingsA);
});
app.get('/ueclStandingsB', (req, res) => {
    res.send(ueclStandingsB);
});
app.get('/ueclStandingsC', (req, res) => {
    res.send(ueclStandingsC);
});
app.get('/ueclStandingsD', (req, res) => {
    res.send(ueclStandingsD);
});
app.get('/ueclStandingsE', (req, res) => {
    res.send(ueclStandingsE);
});
app.get('/ueclStandingsF', (req, res) => {
    res.send(ueclStandingsF);
});
app.get('/ueclStandingsG', (req, res) => {
    res.send(ueclStandingsG);
});
app.get('/ueclStandingsH', (req, res) => {
    res.send(ueclStandingsH);
});
app.get('/rplTopScores', (req, res) => {
    res.send(rplTopScores);
});
app.get('/eplTopScores', (req, res) => {
    res.send(eplTopScores);
});
app.get('/laligaTopScores', (req, res) => {
    res.send(laligaTopScores);
});
app.get('/bundesligaTopScores', (req, res) => {
    res.send(bundesligaTopScores);
});
app.get('/serieaTopScores', (req, res) => {
    res.send(serieaTopScores);
});
app.get('/ligue1TopScores', (req, res) => {
    res.send(ligue1TopScores);
});
app.get('/uclTopScores', (req, res) => {
    res.send(uclTopScores);
});
app.get('/uelTopScores', (req, res) => {
    res.send(uelTopScores);
});
app.get('/ueclTopScores', (req, res) => {
    res.send(ueclTopScores);
});
app.get('/unlTopScores', (req, res) => {
    res.send(unlTopScores);
});
app.get('/unlStandingsA1', (req, res) => {
    res.send(unlStandingsA1);
});
app.get('/unlStandingsA2', (req, res) => {
    res.send(unlStandingsA2);
});
app.get('/unlStandingsA3', (req, res) => {
    res.send(unlStandingsA3);
});
app.get('/unlStandingsA4', (req, res) => {
    res.send(unlStandingsA4);
});
app.get('/unlStandingsB1', (req, res) => {
    res.send(unlStandingsB1);
});
app.get('/unlStandingsB2', (req, res) => {
    res.send(unlStandingsB2);
});
app.get('/unlStandingsB3', (req, res) => {
    res.send(unlStandingsB3);
});
app.get('/unlStandingsB4', (req, res) => {
    res.send(unlStandingsB4);
});
app.get('/unlStandingsC1', (req, res) => {
    res.send(unlStandingsC1);
});
app.get('/unlStandingsC2', (req, res) => {
    res.send(unlStandingsC2);
});
app.get('/unlStandingsC3', (req, res) => {
    res.send(unlStandingsC3);
});
app.get('/unlStandingsC4', (req, res) => {
    res.send(unlStandingsC4);
});
app.get('/unlStandingsD1', (req, res) => {
    res.send(unlStandingsD1);
});
app.get('/unlStandingsD2', (req, res) => {
    res.send(unlStandingsD2);
});
app.get('/matchesSchedule', (req, res) => {
    res.send(matchesSchedule);
});
app.get('/fifaRanking', (req, res) => {
    res.send(fifaRanking);
});
app.get('/euroQualStandingsA', (req, res) => {
    res.send(euroQualStandingsA);
});
app.get('/euroQualStandingsB', (req, res) => {
    res.send(euroQualStandingsB);
});
app.get('/euroQualStandingsC', (req, res) => {
    res.send(euroQualStandingsC);
});
app.get('/euroQualStandingsD', (req, res) => {
    res.send(euroQualStandingsD);
});
app.get('/euroQualStandingsE', (req, res) => {
    res.send(euroQualStandingsE);
});
app.get('/euroQualStandingsF', (req, res) => {
    res.send(euroQualStandingsF);
});
app.get('/euroQualStandingsG', (req, res) => {
    res.send(euroQualStandingsG);
});
app.get('/euroQualStandingsH', (req, res) => {
    res.send(euroQualStandingsH);
});
app.get('/euroQualStandingsI', (req, res) => {
    res.send(euroQualStandingsI);
});
app.get('/euroQualStandingsJ', (req, res) => {
    res.send(euroQualStandingsJ);
});
app.post('/postPoll', (req, res) => {
    con.query('INSERT INTO poll (clientIP, choise) VALUES(?, ?)', [req.body.clientIP, req.body.choiseVal], (err => {
        if(err) throw err;
    }));
});
app.get('/getPollYes', (req, res) => {
    con.query(`SELECT * FROM poll WHERE choise="yes"`, (err, result) => {
        if(err) throw err;
        res.send(result);
    });
});
app.get('/getPollNo', (req, res) => {
    con.query(`SELECT * FROM poll WHERE choise="no"`, (err, result) => {
        if(err) throw err;
        res.send(result);
    });
});
app.get('/transferListRpl', (req, res) => {
    res.send(transferListRpl);
});
app.get('/transferListEpl', (req, res) => {
    res.send(transferListEpl);
});
app.get('/transferListLaliga', (req, res) => {
    res.send(transferListLaliga);
});
app.get('/transferListSeriea', (req, res) => {
    res.send(transferListSeriea);
});
app.get('/transferListBundesliga', (req, res) => {
    res.send(transferListBundesliga);
});
app.get('/transferListLigue1', (req, res) => {
    res.send(transferListLigue1);
});
app.get('/rplSeasonInfo', (req, res) => {
    res.send(rplSeasonInfo);
});
app.get('/rplLastWinner', (req, res) => {
    res.send(rplLastWinner);
});
app.get('/rplMostWinner', (req, res) => {
    res.send(rplMostWinner);
});

const parsing = async () => {
    const cyrillicToTranslit = new CyrillicToTranslit();

    await axios.get('https://terrikon.com/football/uefa_coefs') // last 5 uefa season || uefa rank
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('tbody tr').eq(0).each((i, element) => {
            uefaCountryRankSeason.push({
                seasonLast5: $(element).find('th').eq(3).text(),
                seasonLast4: $(element).find('th').eq(4).text(),
                seasonLast3: $(element).find('th').eq(5).text(),
                seasonLast2: $(element).find('th').eq(6).text(),
                seasonCurrent: $(element).find('th').eq(7).text(),
            });
        });
        $('tbody tr').each((i, element) => {
            uefaCountryRank.push({
                place: $(element).find('td').eq(0).text(),
                flag: $(element).find('td:nth-child(2) img').attr('src'),
                name: $(element).find('td').eq(2).text(),
                total: $(element).find('td').eq(8).text(),
                quantity: $(element).find('td').eq(9).text(),
                totalLast5: $(element).find('td').eq(3).text(),
                totalLast4: $(element).find('td').eq(4).text(),
                totalLast3: $(element).find('td').eq(5).text(),
                totalLast2: $(element).find('td').eq(6).text(),
                totalCurrent: $(element).find('td').eq(7).text(),
            });
        });
    })
    .catch(err => console.log(err));

    for(let i = 1; i <= 5; i++) {
        await axios.get(`https://soccer365.ru/transfers/&p=${i}`) // popular transfer list
        .then(response => response.data)
        .then(response => {
            const $ = cheerio.load(response);

            $('tbody tr').each((i, element) => {
                transferList.push({
                    img: $(element).find('.pl_info img').attr('src'),
                    name: $(element).find('.pl_info .name div span').text(),
                    flag: $(element).find('.pl_info .name div img').attr('src'),
                    position: $(element).find('td:nth-child(1) > div > div').text().slice($(element).find('.pl_info .name div span').text().length),
                    date: $(element).find('td:nth-child(3)').text(),
                    clubOut: $(element).find('.gray div:nth-child(1) img').attr('src'),
                    clubOutName: $(element).find('.gray div:nth-child(1) span').text(),
                    clubIn: $(element).find('.gray div:nth-child(2) img').attr('src'),
                    clubInName: $(element).find('.gray div:nth-child(2) span').text(),
                    price: $(element).find('.green').text()
                });
            });
        })
        .catch(err => console.log(err));

        await axios.get(`https://soccer365.ru/transfers/&cn_id=1&prd=2022-1&p=${i}`) // popular transfer list rpl
        .then(response => response.data)
        .then(response => {
            const $ = cheerio.load(response);

            $('tbody tr').each((i, element) => {
                transferListRpl.push({
                    img: $(element).find('.pl_info img').attr('src'),
                    name: $(element).find('.pl_info .name div span').text(),
                    flag: $(element).find('.pl_info .name div img').attr('src'),
                    position: $(element).find('td:nth-child(1) > div > div').text().slice($(element).find('.pl_info .name div span').text().length),
                    date: $(element).find('td:nth-child(3)').text(),
                    clubOut: $(element).find('.gray div:nth-child(1) img').attr('src'),
                    clubOutName: $(element).find('.gray div:nth-child(1) span').text(),
                    clubIn: $(element).find('.gray div:nth-child(2) img').attr('src'),
                    clubInName: $(element).find('.gray div:nth-child(2) span').text(),
                    price: $(element).find('.green').text()
                });
            });
        })
        .catch(err => console.log(err));

        await axios.get(`https://soccer365.ru/transfers/&cn_id=3&prd=2022-1&p=${i}`) // popular transfer list epl
        .then(response => response.data)
        .then(response => {
            const $ = cheerio.load(response);

            $('tbody tr').each((i, element) => {
                transferListEpl.push({
                    img: $(element).find('.pl_info img').attr('src'),
                    name: $(element).find('.pl_info .name div span').text(),
                    flag: $(element).find('.pl_info .name div img').attr('src'),
                    position: $(element).find('td:nth-child(1) > div > div').text().slice($(element).find('.pl_info .name div span').text().length),
                    date: $(element).find('td:nth-child(3)').text(),
                    clubOut: $(element).find('.gray div:nth-child(1) img').attr('src'),
                    clubOutName: $(element).find('.gray div:nth-child(1) span').text(),
                    clubIn: $(element).find('.gray div:nth-child(2) img').attr('src'),
                    clubInName: $(element).find('.gray div:nth-child(2) span').text(),
                    price: $(element).find('.green').text()
                });
            });
        })
        .catch(err => console.log(err));

        await axios.get(`https://soccer365.ru/transfers/&cn_id=4&prd=2022-1&p=${i}`) // popular transfer list laliga
        .then(response => response.data)
        .then(response => {
            const $ = cheerio.load(response);

            $('tbody tr').each((i, element) => {
                transferListLaliga.push({
                    img: $(element).find('.pl_info img').attr('src'),
                    name: $(element).find('.pl_info .name div span').text(),
                    flag: $(element).find('.pl_info .name div img').attr('src'),
                    position: $(element).find('td:nth-child(1) > div > div').text().slice($(element).find('.pl_info .name div span').text().length),
                    date: $(element).find('td:nth-child(3)').text(),
                    clubOut: $(element).find('.gray div:nth-child(1) img').attr('src'),
                    clubOutName: $(element).find('.gray div:nth-child(1) span').text(),
                    clubIn: $(element).find('.gray div:nth-child(2) img').attr('src'),
                    clubInName: $(element).find('.gray div:nth-child(2) span').text(),
                    price: $(element).find('.green').text()
                });
            });
        })
        .catch(err => console.log(err));

        await axios.get(`https://soccer365.ru/transfers/&cn_id=2&prd=2022-1&p=${i}`) // popular transfer list serie a
        .then(response => response.data)
        .then(response => {
            const $ = cheerio.load(response);

            $('tbody tr').each((i, element) => {
                transferListSeriea.push({
                    img: $(element).find('.pl_info img').attr('src'),
                    name: $(element).find('.pl_info .name div span').text(),
                    flag: $(element).find('.pl_info .name div img').attr('src'),
                    position: $(element).find('td:nth-child(1) > div > div').text().slice($(element).find('.pl_info .name div span').text().length),
                    date: $(element).find('td:nth-child(3)').text(),
                    clubOut: $(element).find('.gray div:nth-child(1) img').attr('src'),
                    clubOutName: $(element).find('.gray div:nth-child(1) span').text(),
                    clubIn: $(element).find('.gray div:nth-child(2) img').attr('src'),
                    clubInName: $(element).find('.gray div:nth-child(2) span').text(),
                    price: $(element).find('.green').text()
                });
            });
        })
        .catch(err => console.log(err));

        await axios.get(`https://soccer365.ru/transfers/&cn_id=6&prd=2022-1&p=${i}`) // popular transfer list bundesliga
        .then(response => response.data)
        .then(response => {
            const $ = cheerio.load(response);

            $('tbody tr').each((i, element) => {
                transferListBundesliga.push({
                    img: $(element).find('.pl_info img').attr('src'),
                    name: $(element).find('.pl_info .name div span').text(),
                    flag: $(element).find('.pl_info .name div img').attr('src'),
                    position: $(element).find('td:nth-child(1) > div > div').text().slice($(element).find('.pl_info .name div span').text().length),
                    date: $(element).find('td:nth-child(3)').text(),
                    clubOut: $(element).find('.gray div:nth-child(1) img').attr('src'),
                    clubOutName: $(element).find('.gray div:nth-child(1) span').text(),
                    clubIn: $(element).find('.gray div:nth-child(2) img').attr('src'),
                    clubInName: $(element).find('.gray div:nth-child(2) span').text(),
                    price: $(element).find('.green').text()
                });
            });
        })
        .catch(err => console.log(err));

        await axios.get(`https://soccer365.ru/transfers/&cn_id=7&prd=2022-1&p=${i}`) // popular transfer list ligue 1
        .then(response => response.data)
        .then(response => {
            const $ = cheerio.load(response);

            $('tbody tr').each((i, element) => {
                transferListLigue1.push({
                    img: $(element).find('.pl_info img').attr('src'),
                    name: $(element).find('.pl_info .name div span').text(),
                    flag: $(element).find('.pl_info .name div img').attr('src'),
                    position: $(element).find('td:nth-child(1) > div > div').text().slice($(element).find('.pl_info .name div span').text().length),
                    date: $(element).find('td:nth-child(3)').text(),
                    clubOut: $(element).find('.gray div:nth-child(1) img').attr('src'),
                    clubOutName: $(element).find('.gray div:nth-child(1) span').text(),
                    clubIn: $(element).find('.gray div:nth-child(2) img').attr('src'),
                    clubInName: $(element).find('.gray div:nth-child(2) span').text(),
                    price: $(element).find('.green').text()
                });
            });
        })
        .catch(err => console.log(err));
    }

    await axios.get('https://www.liveresult.ru/football/Russia/Premier-League/standings') // rpl standings
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('.tab-content .active tbody tr').each((i, element) => {
            rplStandings.push({
                name: $(element).find('.name a').text(),
                place: $(element).find('.num').text(),
                description: $(element).find('.num').attr('title'),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' ').split(" ").slice(-1),
                win: $(element).find('.score').eq(1).text(),
                draw: $(element).find('.score').eq(2).text(),
                lose: $(element).find('.score').eq(3).text()
            });
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://www.liveresult.ru/football/England/Premier-League/standings') // epl standings
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('.tab-content .active tbody tr').each((i, element) => {
            eplStandings.push({
                name: $(element).find('.name a').text(),
                place: $(element).find('.num').text(),
                description: $(element).find('.num').attr('title'),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' ').split(" ").slice(-1)
            });
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://www.liveresult.ru/football/Spain/LaLiga/standings') // laliga standings
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('.tab-content .active tbody tr').each((i, element) => {
            laligaStandings.push({
                name: $(element).find('.name a').text(),
                place: $(element).find('.num').text(),
                description: $(element).find('.num').attr('title'),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' ').split(" ").slice(-1)
            });
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://www.liveresult.ru/football/Germany/Bundesliga-I/standings') // bundesliga standings
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('.tab-content .active tbody tr').each((i, element) => {
            bundesligaStandings.push({
                name: $(element).find('.name a').text(),
                place: $(element).find('.num').text(),
                description: $(element).find('.num').attr('title'),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' ').split(" ").slice(-1)
            });
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://www.liveresult.ru/football/Italy/Serie-A/standings') // serie a standings
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('.tab-content .active tbody tr').each((i, element) => {
            serieaStandings.push({
                name: $(element).find('.name a').text(),
                place: $(element).find('.num').text(),
                description: $(element).find('.num').attr('title'),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' ').split(" ").slice(-1)
            });
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://www.liveresult.ru/football/France/Ligue-1/standings') // ligue 1 standings
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('.tab-content .active tbody tr').each((i, element) => {
            ligue1Standings.push({
                name: $(element).find('.name a').text(),
                place: $(element).find('.num').text(),
                description: $(element).find('.num').attr('title'),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' ').split(" ").slice(-1)
            });
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://soccer365.ru/online/') // ended matches
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('.game_block').each((i, element) => {
            $(element).find('a .status span').text() == 'Завершен' && endedMatches.push({
                hName: $(element).find('a .result .ht .name .img16 span').text() === '' ? $(element).find('a .result .ht .name').text() : $(element).find('a .result .ht .name .img16 span').text(),
                aName: $(element).find('a .result .at .name .img16 span').text() === '' ? $(element).find('a .result .at .name').text() : $(element).find('a .result .at .name .img16 span').text(),
                hLogo: $(element).find('a .result .ht .name .img16 img').attr('src'),
                aLogo: $(element).find('a .result .at .name .img16 img').attr('src'),
                lLogo: $(element).find('a').parent().parent().find('div:first-child a .img16 img').attr('src') === undefined ? $(element).find('a').parent().parent().find('div:first-child .img16 img').attr('src') : $(element).find('a').parent().parent().find('div:first-child a .img16 img').attr('src'),
                lName: $(element).find('a').parent().parent().find('div:first-child a .img16 span').text() === '' ? $(element).find('a').parent().parent().find('div:first-child .img16 span').text() : $(element).find('a').parent().parent().find('div:first-child a .img16 span').text(),
                lRound: $(element).find('a .stage').text(),
                hScore: $(element).find('a .result .ht .gls').text(),
                hCards: $(element).find('a .result .ht .cards span').eq(0).attr('class') && $(element).find('a .result .ht .cards span').eq(0).attr('class').split(' ')[1].split('_')[1],
                aCards: $(element).find('a .result .at .cards span').eq(0).attr('class') && $(element).find('a .result .at .cards span').eq(0).attr('class').split(' ')[1].split('_')[1],
                hCardPlayer: $(element).find('a .result .ht .cards span').eq(0).attr('title') && $(element).find('a .result .ht .cards span').eq(0).attr('title'),
                aCardPlayer: $(element).find('a .result .at .cards span').eq(0).attr('title') && $(element).find('a .result .at .cards span').eq(0).attr('title'),
                hCards2: $(element).find('a .result .ht .cards span').eq(1).attr('class') && $(element).find('a .result .ht .cards span').eq(1).attr('class').split(' ')[1].split('_')[1],
                aCards2: $(element).find('a .result .at .cards span').eq(1).attr('class') && $(element).find('a .result .at .cards span').eq(1).attr('class').split(' ')[1].split('_')[1],
                hCardPlayer2: $(element).find('a .result .ht .cards span').eq(1).attr('title') && $(element).find('a .result .ht .cards span').eq(1).attr('title'),
                aCardPlayer2: $(element).find('a .result .at .cards span').eq(1).attr('title') && $(element).find('a .result .at .cards span').eq(1).attr('title'),
                hCards3: $(element).find('a .result .ht .cards span').eq(2).attr('class') && $(element).find('a .result .ht .cards span').eq(2).attr('class').split(' ')[1].split('_')[1],
                aCards3: $(element).find('a .result .at .cards span').eq(2).attr('class') && $(element).find('a .result .at .cards span').eq(2).attr('class').split(' ')[1].split('_')[1],
                hCardPlayer3: $(element).find('a .result .ht .cards span').eq(2).attr('title') && $(element).find('a .result .ht .cards span').eq(2).attr('title'),
                aCardPlayer3: $(element).find('a .result .at .cards span').eq(2).attr('title') && $(element).find('a .result .at .cards span').eq(2).attr('title'),
                hCards4: $(element).find('a .result .ht .cards span').eq(3).attr('class') && $(element).find('a .result .ht .cards span').eq(3).attr('class').split(' ')[1].split('_')[1],
                aCards4: $(element).find('a .result .at .cards span').eq(3).attr('class') && $(element).find('a .result .at .cards span').eq(3).attr('class').split(' ')[1].split('_')[1],
                hCardPlayer4: $(element).find('a .result .ht .cards span').eq(3).attr('title') && $(element).find('a .result .ht .cards span').eq(3).attr('title'),
                aCardPlayer4: $(element).find('a .result .at .cards span').eq(3).attr('title') && $(element).find('a .result .at .cards span').eq(3).attr('title'),
                hCards5: $(element).find('a .result .ht .cards span').eq(4).attr('class') && $(element).find('a .result .ht .cards span').eq(4).attr('class').split(' ')[1].split('_')[1],
                aCards5: $(element).find('a .result .at .cards span').eq(4).attr('class') && $(element).find('a .result .at .cards span').eq(4).attr('class').split(' ')[1].split('_')[1],
                hCardPlayer5: $(element).find('a .result .ht .cards span').eq(4).attr('title') && $(element).find('a .result .ht .cards span').eq(4).attr('title'),
                aCardPlayer5: $(element).find('a .result .at .cards span').eq(4).attr('title') && $(element).find('a .result .at .cards span').eq(4).attr('title'),
                hCards6: $(element).find('a .result .ht .cards span').eq(5).attr('class') && $(element).find('a .result .ht .cards span').eq(5).attr('class').split(' ')[1].split('_')[1],
                aCards6: $(element).find('a .result .at .cards span').eq(5).attr('class') && $(element).find('a .result .at .cards span').eq(5).attr('class').split(' ')[1].split('_')[1],
                hCardPlayer6: $(element).find('a .result .ht .cards span').eq(5).attr('title') && $(element).find('a .result .ht .cards span').eq(5).attr('title'),
                aCardPlayer6: $(element).find('a .result .at .cards span').eq(5).attr('title') && $(element).find('a .result .at .cards span').eq(5).attr('title'),
                aScore: $(element).find('a .result .at .gls').text()
            });
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://legalbet.ru/match-center/') // forecasts
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('.matches-table-block').each((i, element) => {
            $(element).find('.match-sport-type .icon-football').parent().nextUntil('.match-sport-type').each((i, element) => {
                $(element).find('.match-table__item').each((i, element) => {
                    forecasts.push({
                        hName: $(element).find('.match-table__row .match-table__info a .match-table__team:nth-child(1) .match-table__team-name').text(),
                        aName: $(element).find('.match-table__row .match-table__info a .match-table__team:nth-child(2) .match-table__team-name').text(),
                        date: $(element).parent().parent().find('.heading-3').text(),
                        time: $(element).find('.match-table__row .match-table__info .match-table__time').text(),
                        hLogo: $(element).find('.match-table__row .match-table__info a .match-table__team:nth-child(1) .match-table__team-logo img').attr('src'),
                        aLogo: $(element).find('.match-table__row .match-table__info a .match-table__team:nth-child(2) .match-table__team-logo img').attr('src'),
                        lName: $(element).parent().find('.match-table__header .match-table__info .match-table__league a:last-child').text(),
                        lCountryName: $(element).parent().find('.match-table__header .match-table__info .match-table__league .icon').text(),
                        w1: $(element).find('.match-table__row .match-table__kefs .match-table__kefs-group:nth-child(1) .match-table__tooltip:nth-child(1) a .kef-btn__kef').text(),
                        draw: $(element).find('.match-table__row .match-table__kefs .match-table__kefs-group:nth-child(1) .match-table__tooltip:nth-child(2) a .kef-btn__kef').text(),
                        w2: $(element).find('.match-table__row .match-table__kefs .match-table__kefs-group:nth-child(1) .match-table__tooltip:nth-child(3) a .kef-btn__kef').text(),
                        tu: $(element).find('.match-table__row .match-table__kefs .match-table__kefs-group:nth-child(2) .match-table__tooltip:nth-child(1) a .kef-btn__kef').text(),
                        to: $(element).find('.match-table__row .match-table__kefs .match-table__kefs-group:nth-child(2) .match-table__tooltip:nth-child(2) a .kef-btn__kef').text()
                    });
                });
            });
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://soccer365.ru/online/') // matchesSlider
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

            teams && teams.map((e) => {
                $('.game_block').each((i, element) => {
                    $(element).find('a').parent().attr('dt-status') === 'u' && ($(element).find('a .result .ht .name .img16 span').text() === e || $(element).find('a .result .at .name .img16 span').text() === e) && matchesSlider.push({
                        hName: $(element).find('.game_block a .result .ht .name .img16 span').text(),
                        aName: $(element).find('.game_block a .result .at .name .img16 span').text(),
                        hLogo: $(element).find('.game_block a .result .ht .name .img16 img').attr('src'),
                        aLogo: $(element).find('.game_block a .result .at .name .img16 img').attr('src'),
                        lLogo: $(element).find('.game_block a').parent().parent().find('div:first-child a .img16 img').attr('src') || $(element).find('.game_block a').parent().parent().find('div:first-child .img16 img').attr('src')
                    }) && matchesSliderCoefLinks.push(`https://soccer365.ru${$(element).find('a').attr('href')}`); // push coef links
                });
            });
    })
    .catch(err => console.log(err));

    for await (e of matchesSliderCoefLinks) {
        await axios.get(`${e}`) // matchesSlider | scraping nested link
            .then(response => response.data)
            .then(response => {
                const $ = cheerio.load(response);
                
                $('.adv_kef_wgt_odd td').eq(1).each((i, element) => { // scraping coefs
                    matchesSliderCoefsW1.push($(element).find('a .koeff').text()); 
                    matchesSlider = matchesSlider.map((item, index) => ({ ...item,
                        w1: matchesSliderCoefsW1[index]
                    }));
                });
                $('.adv_kef_wgt_odd td').eq(2).each((i, element) => {
                    matchesSliderCoefsD.push($(element).find('a .koeff').text()); 
                    matchesSlider = matchesSlider.map((item, index) => ({ ...item,
                        d: matchesSliderCoefsD[index]
                    }));
                });
                $('.adv_kef_wgt_odd td').eq(3).each((i, element) => {
                    matchesSliderCoefsW2.push($(element).find('a .koeff').text()); 
                    matchesSlider = matchesSlider.map((item, index) => ({ ...item,
                        w2: matchesSliderCoefsW2[index]
                    }));
                });

                matchesSliderLeagueNameRoundDate.push($('#game_events h2').text().split(",")); // scraping round
                matchesSlider = matchesSlider.map((item, index) => ({ ...item,
                    lNameRoundDateTime: matchesSliderLeagueNameRoundDate[index]
                }));

                matchesSliderStadiums.push($('#preview > div.block_body > div.preview_item.st > div > span >').text()); // scraping stadiums
                matchesSlider = matchesSlider.map((item, index) => ({ ...item,
                    stadium: matchesSliderStadiums[index]
                }));

                matchesSliderVenue.push($('#preview > div.block_body > div.preview_item.st > span:nth-child(3)').text()); // scraping venue
                matchesSlider = matchesSlider.map((item, index) => ({ ...item,
                    venue: matchesSliderVenue[index]
                }));

                matchesSliderReferee.push($('#preview > div.block_body > div:nth-child(2)').text().replace(/\s/g, ' ')); // scraping refree
                matchesSlider = matchesSlider.map((item, index) => ({ ...item,
                    refree: matchesSliderReferee[index]
                }));

                matchesSliderWeatherIco.push($('#preview > div.block_body > div.preview_item.st > div.img16.weath_tmp > img').attr('src')); // scraping weather ico
                matchesSlider = matchesSlider.map((item, index) => ({ ...item,
                    weatherIco: matchesSliderWeatherIco[index]
                }));

                matchesSliderWeatherDescr.push($('#preview > div.block_body > div.preview_item.st > div.img16.weath_tmp > span').text() + ' | ' + $('#preview > div.block_body > div.preview_item.st > span:nth-child(5)').text()); // scraping weather ico
                matchesSlider = matchesSlider.map((item, index) => ({ ...item,
                    weatherDescr: matchesSliderWeatherDescr[index]
                }));
            })
            .catch(err => console.log(err));
    }

    await axios.get('https://www.liveresult.ru/football/Champions-League/standings?st=1') // ucl standings (A)
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t5109-regular-overall-table > div:nth-child(2) > table > tbody tr').each((i, element) => {
            uclStandingsA.push({
                name: $(element).find('.name a').text(),
                description: $(element).find('.num').attr('title'),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().parent().find('h3').eq(0).text(),
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' ').split(" ").slice(-1)
            });
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://www.liveresult.ru/football/Champions-League/standings?st=1') // ucl standings (B)
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t5109-regular-overall-table > div:nth-child(4) > table tr').each((i, element) => {
            uclStandingsB.push({
                name: $(element).find('.name a').text(),
                description: $(element).find('.num').attr('title'),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().parent().find('h3').eq(1).text(),
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' ').split(" ").slice(-1)
            });
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://www.liveresult.ru/football/Champions-League/standings?st=1') // ucl standings (C)
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t5109-regular-overall-table > div:nth-child(6) > table tr').each((i, element) => {
            uclStandingsC.push({
                name: $(element).find('.name a').text(),
                description: $(element).find('.num').attr('title'),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().parent().find('h3').eq(2).text(),
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' ').split(" ").slice(-1)
            });
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://www.liveresult.ru/football/Champions-League/standings?st=1') // ucl standings (D)
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t5109-regular-overall-table > div:nth-child(8) > table tr').each((i, element) => {
            uclStandingsD.push({
                name: $(element).find('.name a').text(),
                description: $(element).find('.num').attr('title'),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().parent().find('h3').eq(3).text(),
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' ').split(" ").slice(-1)
            });
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://www.liveresult.ru/football/Champions-League/standings?st=1') // ucl standings (E)
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t5109-regular-overall-table > div:nth-child(10) > table tr').each((i, element) => {
            uclStandingsE.push({
                name: $(element).find('.name a').text(),
                description: $(element).find('.num').attr('title'),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().parent().find('h3').eq(4).text(),
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' ').split(" ").slice(-1)
            });
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://www.liveresult.ru/football/Champions-League/standings?st=1') // ucl standings (F)
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t5109-regular-overall-table > div:nth-child(12) > table tr').each((i, element) => {
            uclStandingsF.push({
                name: $(element).find('.name a').text(),
                description: $(element).find('.num').attr('title'),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().parent().find('h3').eq(5).text(),
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' ').split(" ").slice(-1)
            });
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://www.liveresult.ru/football/Champions-League/standings?st=1') // ucl standings (G)
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t5109-regular-overall-table > div:nth-child(14) > table tr').each((i, element) => {
            uclStandingsG.push({
                name: $(element).find('.name a').text(),
                description: $(element).find('.num').attr('title'),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().parent().find('h3').eq(6).text(),
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' ').split(" ").slice(-1)
            });
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://www.liveresult.ru/football/Champions-League/standings?st=1') // ucl standings (H)
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t5109-regular-overall-table > div:nth-child(16) > table tr').each((i, element) => {
            uclStandingsH.push({
                name: $(element).find('.name a').text(),
                description: $(element).find('.num').attr('title'),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().parent().find('h3').eq(7).text(),
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' ').split(" ").slice(-1)
            });
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://www.liveresult.ru/football/Europa-League/standings') // uel standings (A)
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t5358-regular-overall-table > div:nth-child(2) > table > tbody tr').each((i, element) => {
            uelStandingsA.push({
                name: $(element).find('.name a').text(),
                description: $(element).find('.num').attr('title'),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().parent().find('h3').eq(0).text(),
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' ').split(" ").slice(-1)
            });
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://www.liveresult.ru/football/Europa-League/standings') // uel standings (B)
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t5358-regular-overall-table > div:nth-child(4) > table tr').each((i, element) => {
            uelStandingsB.push({
                name: $(element).find('.name a').text(),
                description: $(element).find('.num').attr('title'),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().parent().find('h3').eq(1).text(),
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' ').split(" ").slice(-1)
            });
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://www.liveresult.ru/football/Europa-League/standings') // uel standings (C)
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t5358-regular-overall-table > div:nth-child(6) > table tr').each((i, element) => {
            uelStandingsC.push({
                name: $(element).find('.name a').text(),
                description: $(element).find('.num').attr('title'),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().parent().find('h3').eq(2).text(),
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' ').split(" ").slice(-1)
            });
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://www.liveresult.ru/football/Europa-League/standings') // uel standings (D)
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t5358-regular-overall-table > div:nth-child(8) > table tr').each((i, element) => {
            uelStandingsD.push({
                name: $(element).find('.name a').text(),
                description: $(element).find('.num').attr('title'),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().parent().find('h3').eq(3).text(),
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' ').split(" ").slice(-1)
            });
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://www.liveresult.ru/football/Europa-League/standings') // uel standings (E)
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t5358-regular-overall-table > div:nth-child(10) > table tr').each((i, element) => {
            uelStandingsE.push({
                name: $(element).find('.name a').text(),
                description: $(element).find('.num').attr('title'),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().parent().find('h3').eq(4).text(),
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' ').split(" ").slice(-1)
            });
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://www.liveresult.ru/football/Europa-League/standings') // uel standings (F)
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t5358-regular-overall-table > div:nth-child(12) > table tr').each((i, element) => {
            uelStandingsF.push({
                name: $(element).find('.name a').text(),
                description: $(element).find('.num').attr('title'),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().parent().find('h3').eq(5).text(),
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' ').split(" ").slice(-1)
            });
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://www.liveresult.ru/football/Europa-League/standings') // uel standings (G)
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t5358-regular-overall-table > div:nth-child(14) > table tr').each((i, element) => {
            uelStandingsG.push({
                name: $(element).find('.name a').text(),
                description: $(element).find('.num').attr('title'),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().parent().find('h3').eq(6).text(),
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' ').split(" ").slice(-1)
            });
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://www.liveresult.ru/football/Europa-League/standings') // uel standings (H)
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t5358-regular-overall-table > div:nth-child(16) > table tr').each((i, element) => {
            uelStandingsH.push({
                name: $(element).find('.name a').text(),
                description: $(element).find('.num').attr('title'),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().parent().find('h3').eq(7).text(),
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' ').split(" ").slice(-1)
            });
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://www.liveresult.ru/football/Europa-Conference-League/standings') // uecl standings (A)
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t5132-regular-overall-table > div:nth-child(2) > table > tbody tr').each((i, element) => {
            ueclStandingsA.push({
                name: $(element).find('.name a').text(),
                description: $(element).find('.num').attr('title'),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().parent().find('h3').eq(0).text(),
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' ').split(" ").slice(-1)
            });
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://www.liveresult.ru/football/Europa-Conference-League/standings') // uecl standings (B)
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t5132-regular-overall-table > div:nth-child(4) > table tr').each((i, element) => {
            ueclStandingsB.push({
                name: $(element).find('.name a').text(),
                description: $(element).find('.num').attr('title'),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().parent().find('h3').eq(1).text(),
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' ').split(" ").slice(-1)
            });
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://www.liveresult.ru/football/Europa-Conference-League/standings') // uecl standings (C)
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t5132-regular-overall-table > div:nth-child(6) > table tr').each((i, element) => {
            ueclStandingsC.push({
                name: $(element).find('.name a').text(),
                description: $(element).find('.num').attr('title'),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().parent().find('h3').eq(2).text(),
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' ').split(" ").slice(-1)
            });
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://www.liveresult.ru/football/Europa-Conference-League/standings') // uecl standings (D)
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t5132-regular-overall-table > div:nth-child(8) > table tr').each((i, element) => {
            ueclStandingsD.push({
                name: $(element).find('.name a').text(),
                description: $(element).find('.num').attr('title'),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().parent().find('h3').eq(3).text(),
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' ').split(" ").slice(-1)
            });
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://www.liveresult.ru/football/Europa-Conference-League/standings') // uecl standings (E)
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t5132-regular-overall-table > div:nth-child(10) > table tr').each((i, element) => {
            ueclStandingsE.push({
                name: $(element).find('.name a').text(),
                description: $(element).find('.num').attr('title'),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().parent().find('h3').eq(4).text(),
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' ').split(" ").slice(-1)
            });
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://www.liveresult.ru/football/Europa-Conference-League/standings') // uecl standings (F)
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t5132-regular-overall-table > div:nth-child(12) > table tr').each((i, element) => {
            ueclStandingsF.push({
                name: $(element).find('.name a').text(),
                description: $(element).find('.num').attr('title'),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().parent().find('h3').eq(5).text(),
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' ').split(" ").slice(-1)
            });
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://www.liveresult.ru/football/Europa-Conference-League/standings') // uecl standings (G)
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t5132-regular-overall-table > div:nth-child(14) > table tr').each((i, element) => {
            ueclStandingsG.push({
                name: $(element).find('.name a').text(),
                description: $(element).find('.num').attr('title'),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().parent().find('h3').eq(6).text(),
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' ').split(" ").slice(-1)
            });
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://www.liveresult.ru/football/Europa-Conference-League/standings') // uecl standings (H)
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t5132-regular-overall-table > div:nth-child(16) > table tr').each((i, element) => {
            ueclStandingsH.push({
                name: $(element).find('.name a').text(),
                description: $(element).find('.num').attr('title'),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().parent().find('h3').eq(7).text(),
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' ').split(" ").slice(-1)
            });
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://www.liveresult.ru/football/UEFA-Nations-League/standings') // unl standings A1
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t5072-regular-overall-table > div:nth-child(2) > table > tbody tr').each((i, element) => {
            unlStandingsA1.push({
                name: $(element).find('.name a').text(),
                description: $(element).find('.num').attr('title'),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().prev('h3').text(),
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' ').split(" ").slice(-1)
            });
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://www.liveresult.ru/football/UEFA-Nations-League/standings') // unl standings A2
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t5072-regular-overall-table > div:nth-child(4) > table > tbody tr').each((i, element) => {
            unlStandingsA2.push({
                name: $(element).find('.name a').text(),
                description: $(element).find('.num').attr('title'),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().prev('h3').text(),
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' ').split(" ").slice(-1)
            });
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://www.liveresult.ru/football/UEFA-Nations-League/standings') // unl standings A3
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t5072-regular-overall-table > div:nth-child(6) > table > tbody tr').each((i, element) => {
            unlStandingsA3.push({
                name: $(element).find('.name a').text(),
                description: $(element).find('.num').attr('title'),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().prev('h3').text(),
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' ').split(" ").slice(-1)
            });
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://www.liveresult.ru/football/UEFA-Nations-League/standings') // unl standings A4
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t5072-regular-overall-table > div:nth-child(8) > table > tbody tr').each((i, element) => {
            unlStandingsA4.push({
                name: $(element).find('.name a').text(),
                description: $(element).find('.num').attr('title'),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().prev('h3').text(),
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' ').split(" ").slice(-1)
            });
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://www.liveresult.ru/football/UEFA-Nations-League/standings') // unl standings B1
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t5072-regular-overall-table > div:nth-child(10) > table > tbody tr').each((i, element) => {
            unlStandingsB1.push({
                name: $(element).find('.name a').text(),
                description: $(element).find('.num').attr('title'),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().prev('h3').text(),
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' ').split(" ").slice(-1)
            });
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://www.liveresult.ru/football/UEFA-Nations-League/standings') // unl standings B2
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t5072-regular-overall-table > div:nth-child(12) > table > tbody tr').each((i, element) => {
            unlStandingsB2.push({
                name: $(element).find('.name a').text(),
                description: $(element).find('.num').attr('title'),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().prev('h3').text(),
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' ').split(" ").slice(-1)
            });
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://www.liveresult.ru/football/UEFA-Nations-League/standings') // unl standings B3
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t5072-regular-overall-table > div:nth-child(14) > table > tbody tr').each((i, element) => {
            unlStandingsB3.push({
                name: $(element).find('.name a').text(),
                description: $(element).find('.num').attr('title'),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().prev('h3').text(),
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' ').split(" ").slice(-1)
            });
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://www.liveresult.ru/football/UEFA-Nations-League/standings') // unl standings B4
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t5072-regular-overall-table > div:nth-child(16) > table > tbody tr').each((i, element) => {
            unlStandingsB4.push({
                name: $(element).find('.name a').text(),
                description: $(element).find('.num').attr('title'),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().prev('h3').text(),
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' ').split(" ").slice(-1)
            });
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://www.liveresult.ru/football/UEFA-Nations-League/standings') // unl standings C1
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t5072-regular-overall-table > div:nth-child(18) > table > tbody tr').each((i, element) => {
            unlStandingsC1.push({
                name: $(element).find('.name a').text(),
                description: $(element).find('.num').attr('title'),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().prev('h3').text(),
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' ').split(" ").slice(-1)
            });
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://www.liveresult.ru/football/UEFA-Nations-League/standings') // unl standings C2
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t5072-regular-overall-table > div:nth-child(20) > table > tbody tr').each((i, element) => {
            unlStandingsC2.push({
                name: $(element).find('.name a').text(),
                description: $(element).find('.num').attr('title'),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().prev('h3').text(),
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' ').split(" ").slice(-1)
            });
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://www.liveresult.ru/football/UEFA-Nations-League/standings') // unl standings C3
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t5072-regular-overall-table > div:nth-child(22) > table > tbody tr').each((i, element) => {
            unlStandingsC3.push({
                name: $(element).find('.name a').text(),
                description: $(element).find('.num').attr('title'),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().prev('h3').text(),
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' ').split(" ").slice(-1)
            });
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://www.liveresult.ru/football/UEFA-Nations-League/standings') // unl standings C4
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t5072-regular-overall-table > div:nth-child(24) > table > tbody tr').each((i, element) => {
            unlStandingsC4.push({
                name: $(element).find('.name a').text(),
                description: $(element).find('.num').attr('title'),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().prev('h3').text(),
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' ').split(" ").slice(-1)
            });
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://www.liveresult.ru/football/UEFA-Nations-League/standings') // unl standings D1
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t5072-regular-overall-table > div:nth-child(26) > table > tbody tr').each((i, element) => {
            unlStandingsD1.push({
                name: $(element).find('.name a').text(),
                description: $(element).find('.num').attr('title'),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().prev('h3').text(),
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' ').split(" ").slice(-1)
            });
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://www.liveresult.ru/football/UEFA-Nations-League/standings') // unl standings D2
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t5072-regular-overall-table > div:nth-child(28) > table > tbody tr').each((i, element) => {
            unlStandingsD2.push({
                name: $(element).find('.name a').text(),
                description: $(element).find('.num').attr('title'),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().prev('h3').text(),
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' ').split(" ").slice(-1)
            });
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://soccer365.ru/tv/') // matches schedule
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#main_container > div.page_main_content .tv_item').each((i, element) => {
            matchesSchedule.push({
                programme: $(element).find('.tv_programme').text().replace(/(\r\n|\n|\r|\t)/gm,""),
                channel: $(element).find('.tv_channel a img').attr('src'),
                time: $(element).find('.tv_start').text().replace(/(\r\n|\n|\r|\t)/gm,"")
            });
        });
    })
    .catch(err => console.log(err));

    const rplTopScoresRes = await fetch( // rplTopScores
    'https://www.sport-express.ru/football/L/russia/premier/2022-2023/statistics/bombardiers/'
    );
    const rplTopScoresCharset = (rplTopScoresRes.headers.get('content-type') ?? '').split(/\s*;\s*/).find((/** @type {string} */ x) => x.startsWith('charset'))?.replace(/charset=/, '');
    const rplTopScoresBuf = await rplTopScoresRes.arrayBuffer();
    const rplTopScoresHtml = iconv.decode(
        Buffer.from(rplTopScoresBuf),
        rplTopScoresCharset || 'windows-1251'
    );
    const $rplTopScores = cheerio.load(rplTopScoresHtml);

    $rplTopScores('table.se19-table-statistics tr').each((i, element) => {
        rplTopScores.push({
            place: $rplTopScores(element).find('.se19-table-statistics__td--place').text(),
            img: $rplTopScores(element).find('.se19-table-statistics__td--img a img').attr('src'),
            player: $rplTopScores(element).find('.se19-table-statistics__td--name a').text(),
            games: $rplTopScores(element).find('td').eq(4).text(),
            goals: $rplTopScores(element).find('td').eq(5).text().replace(/\s/g, '').split('(')[0],
            assists: '(' + $rplTopScores(element).find('td').eq(5).text().replace(/\s/g, '').split('(')[1],
            tLogo: $rplTopScores(element).find('td:nth-child(4) div img').attr('src'),
            tName: $rplTopScores(element).find('td:nth-child(4) div a').text()
        });
    });

    const eplTopScoresRes = await fetch( // eplTopScores
        'https://www.sport-express.ru/football/L/foreign/england/premier/2022-2023/statistics/bombardiers/'
    );
    const eplTopScoresCharset = (eplTopScoresRes.headers.get('content-type') ?? '').split(/\s*;\s*/).find((/** @type {string} */ x) => x.startsWith('charset'))?.replace(/charset=/, '');
    const eplTopScoresBuf = await eplTopScoresRes.arrayBuffer();
    const eplTopScoresHtml = iconv.decode(
        Buffer.from(eplTopScoresBuf),
        eplTopScoresCharset || 'windows-1251'
    );
    const $eplTopScores = cheerio.load(eplTopScoresHtml);

    $eplTopScores('table.se19-table-statistics tr').each((i, element) => {
        eplTopScores.push({
            place: $eplTopScores(element).find('.se19-table-statistics__td--place').text(),
            img: $eplTopScores(element).find('.se19-table-statistics__td--img a img').attr('src'),
            player: $eplTopScores(element).find('.se19-table-statistics__td--name a').text(),
            games: $eplTopScores(element).find('td').eq(4).text(),
            goals: $eplTopScores(element).find('td').eq(5).text().replace(/\s/g, '').split('(')[0],
            assists: '(' + $eplTopScores(element).find('td').eq(5).text().replace(/\s/g, '').split('(')[1],
            tLogo: $eplTopScores(element).find('td:nth-child(4) div img').attr('src'),
            tName: $eplTopScores(element).find('td:nth-child(4) div a').text()
        });
    });

    const laligaTopScoresRes = await fetch( // laligaTopScores
        'https://www.sport-express.ru/football/L/foreign/spain/laleague/2022-2023/statistics/bombardiers/'
    );
    const laligaTopScoresCharset = (laligaTopScoresRes.headers.get('content-type') ?? '').split(/\s*;\s*/).find((/** @type {string} */ x) => x.startsWith('charset'))?.replace(/charset=/, '');
    const laligaTopScoresBuf = await laligaTopScoresRes.arrayBuffer();
    const laligaTopScoresHtml = iconv.decode(
        Buffer.from(laligaTopScoresBuf),
        laligaTopScoresCharset || 'windows-1251'
    );
    const $laligaTopScores = cheerio.load(laligaTopScoresHtml);

    $laligaTopScores('table.se19-table-statistics tr').each((i, element) => {
        laligaTopScores.push({
            place: $laligaTopScores(element).find('.se19-table-statistics__td--place').text(),
            img: $laligaTopScores(element).find('.se19-table-statistics__td--img a img').attr('src'),
            player: $laligaTopScores(element).find('.se19-table-statistics__td--name a').text(),
            games: $laligaTopScores(element).find('td').eq(4).text(),
            goals: $laligaTopScores(element).find('td').eq(5).text().replace(/\s/g, '').split('(')[0],
            assists: '(' + $laligaTopScores(element).find('td').eq(5).text().replace(/\s/g, '').split('(')[1],
            tLogo: $laligaTopScores(element).find('td:nth-child(4) div img').attr('src'),
            tName: $laligaTopScores(element).find('td:nth-child(4) div a').text()
        });
    });

    const bundesligaTopScoresRes = await fetch( // bundesligaTopScores
        'https://www.sport-express.ru/football/L/foreign/german/bundes1/2022-2023/statistics/bombardiers/'
    );
    const bundesligaTopScoresCharset = (bundesligaTopScoresRes.headers.get('content-type') ?? '').split(/\s*;\s*/).find((/** @type {string} */ x) => x.startsWith('charset'))?.replace(/charset=/, '');
    const bundesligaTopScoresBuf = await bundesligaTopScoresRes.arrayBuffer();
    const bundesligaTopScoresHtml = iconv.decode(
        Buffer.from(bundesligaTopScoresBuf),
        bundesligaTopScoresCharset || 'windows-1251'
    );
    const $bundesligaTopScores = cheerio.load(bundesligaTopScoresHtml);

    $bundesligaTopScores('table.se19-table-statistics tr').each((i, element) => {
        bundesligaTopScores.push({
            place: $bundesligaTopScores(element).find('.se19-table-statistics__td--place').text(),
            img: $bundesligaTopScores(element).find('.se19-table-statistics__td--img a img').attr('src'),
            player: $bundesligaTopScores(element).find('.se19-table-statistics__td--name a').text(),
            games: $bundesligaTopScores(element).find('td').eq(4).text(),
            goals: $bundesligaTopScores(element).find('td').eq(5).text().replace(/\s/g, '').split('(')[0],
            assists: '(' + $bundesligaTopScores(element).find('td').eq(5).text().replace(/\s/g, '').split('(')[1],
            tLogo: $bundesligaTopScores(element).find('td:nth-child(4) div img').attr('src'),
            tName: $bundesligaTopScores(element).find('td:nth-child(4) div a').text()
        });
    });

    const serieaTopScoresRes = await fetch( // serieaTopScores
        'https://www.sport-express.ru/football/L/foreign/italy/seriaa/2022-2023/statistics/bombardiers/'
    );
    const serieaTopScoresCharset = (serieaTopScoresRes.headers.get('content-type') ?? '').split(/\s*;\s*/).find((/** @type {string} */ x) => x.startsWith('charset'))?.replace(/charset=/, '');
    const serieaTopScoresBuf = await serieaTopScoresRes.arrayBuffer();
    const serieaTopScoresHtml = iconv.decode(
        Buffer.from(serieaTopScoresBuf),
        serieaTopScoresCharset || 'windows-1251'
    );
    const $serieaTopScores = cheerio.load(serieaTopScoresHtml);

    $serieaTopScores('table.se19-table-statistics tr').each((i, element) => {
        serieaTopScores.push({
            place: $serieaTopScores(element).find('.se19-table-statistics__td--place').text(),
            img: $serieaTopScores(element).find('.se19-table-statistics__td--img a img').attr('src'),
            player: $serieaTopScores(element).find('.se19-table-statistics__td--name a').text(),
            games: $serieaTopScores(element).find('td').eq(4).text(),
            goals: $serieaTopScores(element).find('td').eq(5).text().replace(/\s/g, '').split('(')[0],
            assists: '(' + $serieaTopScores(element).find('td').eq(5).text().replace(/\s/g, '').split('(')[1],
            tLogo: $serieaTopScores(element).find('td:nth-child(4) div img').attr('src'),
            tName: $serieaTopScores(element).find('td:nth-child(4) div a').text()
        });
    });

    const ligue1TopScoresRes = await fetch( // ligue1TopScores
        'https://www.sport-express.ru/football/L/foreign/france/league1/2022-2023/statistics/bombardiers/'
    );
    const ligue1TopScoresCharset = (ligue1TopScoresRes.headers.get('content-type') ?? '').split(/\s*;\s*/).find((/** @type {string} */ x) => x.startsWith('charset'))?.replace(/charset=/, '');
    const ligue1TopScoresBuf = await ligue1TopScoresRes.arrayBuffer();
    const ligue1TopScoresHtml = iconv.decode(
        Buffer.from(ligue1TopScoresBuf),
        ligue1TopScoresCharset || 'windows-1251'
    );
    const $ligue1TopScores = cheerio.load(ligue1TopScoresHtml);

    $ligue1TopScores('table.se19-table-statistics tr').each((i, element) => {
        ligue1TopScores.push({
            place: $ligue1TopScores(element).find('.se19-table-statistics__td--place').text(),
            img: $ligue1TopScores(element).find('.se19-table-statistics__td--img a img').attr('src'),
            player: $ligue1TopScores(element).find('.se19-table-statistics__td--name a').text(),
            games: $ligue1TopScores(element).find('td').eq(4).text(),
            goals: $ligue1TopScores(element).find('td').eq(5).text().replace(/\s/g, '').split('(')[0],
            assists: '(' + $ligue1TopScores(element).find('td').eq(5).text().replace(/\s/g, '').split('(')[1],
            tLogo: $ligue1TopScores(element).find('td:nth-child(4) div img').attr('src'),
            tName: $ligue1TopScores(element).find('td:nth-child(4) div a').text()
        });
    });

    const uclTopScoresRes = await fetch( // uclTopScores
        'https://www.sport-express.ru/football/L/eurocups/championsleague/2022-2023/statistics/bombardiers/'
    );
    const uclTopScoresCharset = (uclTopScoresRes.headers.get('content-type') ?? '').split(/\s*;\s*/).find((/** @type {string} */ x) => x.startsWith('charset'))?.replace(/charset=/, '');
    const uclTopScoresBuf = await uclTopScoresRes.arrayBuffer();
    const uclTopScoresHtml = iconv.decode(
        Buffer.from(uclTopScoresBuf),
        uclTopScoresCharset || 'windows-1251'
    );
    const $uclTopScores = cheerio.load(uclTopScoresHtml);

    $uclTopScores('body > div.se-page-wrapper > section > div.se-grid2col.se-grid2col--one > div > div > div > table > tbody > tr').each((i, element) => {
        uclTopScores.push({
            place: $uclTopScores(element).find('.se19-table-statistics__td--place').text(),
            img: $uclTopScores(element).find('.se19-table-statistics__td--img a img').attr('src'),
            player: $uclTopScores(element).find('.se19-table-statistics__td--name a').text(),
            games: $uclTopScores(element).find('td').eq(4).text(),
            goals: $uclTopScores(element).find('td').eq(5).text().replace(/\s/g, '').split('(')[0],
            assists: '(' + $uclTopScores(element).find('td').eq(5).text().replace(/\s/g, '').split('(')[1],
            tLogo: $uclTopScores(element).find('td:nth-child(4) div img').attr('src'),
            tName: $uclTopScores(element).find('td:nth-child(4) div a').text()
        });
    });

    const uelTopScoresRes = await fetch( // uelTopScores
        'https://www.sport-express.ru/football/L/eurocups/euroleague/2022-2023/statistics/bombardiers/'
    );
    const uelTopScoresCharset = (uelTopScoresRes.headers.get('content-type') ?? '').split(/\s*;\s*/).find((/** @type {string} */ x) => x.startsWith('charset'))?.replace(/charset=/, '');
    const uelTopScoresBuf = await uelTopScoresRes.arrayBuffer();
    const uelTopScoresHtml = iconv.decode(
        Buffer.from(uelTopScoresBuf),
        uelTopScoresCharset || 'windows-1251'
    );
    const $uelTopScores = cheerio.load(uelTopScoresHtml);

    $uelTopScores('body > div.se-page-wrapper > section > div.se-grid2col.se-grid2col--one > div > div > div > table > tbody > tr').each((i, element) => {
        uelTopScores.push({
            place: $uelTopScores(element).find('.se19-table-statistics__td--place').text(),
            img: $uelTopScores(element).find('.se19-table-statistics__td--img a img').attr('src'),
            player: $uelTopScores(element).find('.se19-table-statistics__td--name a').text(),
            games: $uelTopScores(element).find('td').eq(4).text(),
            goals: $uelTopScores(element).find('td').eq(5).text().replace(/\s/g, '').split('(')[0],
            assists: '(' + $uelTopScores(element).find('td').eq(5).text().replace(/\s/g, '').split('(')[1],
            tLogo: $uelTopScores(element).find('td:nth-child(4) div img').attr('src'),
            tName: $uelTopScores(element).find('td:nth-child(4) div a').text()
        });
    });

    const ueclTopScoresRes = await fetch( // ueclTopScores
        'https://www.sport-express.ru/football/L/eurocups/conferenceleague/2022-2023/statistics/bombardiers/'
    );
    const ueclTopScoresCharset = (ueclTopScoresRes.headers.get('content-type') ?? '').split(/\s*;\s*/).find((/** @type {string} */ x) => x.startsWith('charset'))?.replace(/charset=/, '');
    const ueclTopScoresBuf = await ueclTopScoresRes.arrayBuffer();
    const ueclTopScoresHtml = iconv.decode(
        Buffer.from(ueclTopScoresBuf),
        ueclTopScoresCharset || 'windows-1251'
    );
    const $ueclTopScores = cheerio.load(ueclTopScoresHtml);

    $ueclTopScores('body > div.se-page-wrapper > section > div.se-grid2col.se-grid2col--one > div > div > div > table > tbody > tr').each((i, element) => {
        ueclTopScores.push({
            place: $ueclTopScores(element).find('.se19-table-statistics__td--place').text(),
            img: $ueclTopScores(element).find('.se19-table-statistics__td--img a img').attr('src'),
            player: $ueclTopScores(element).find('.se19-table-statistics__td--name a').text(),
            games: $ueclTopScores(element).find('td').eq(4).text(),
            goals: $ueclTopScores(element).find('td').eq(5).text().replace(/\s/g, '').split('(')[0],
            assists: '(' + $ueclTopScores(element).find('td').eq(5).text().replace(/\s/g, '').split('(')[1],
            tLogo: $ueclTopScores(element).find('td:nth-child(4) div img').attr('src'),
            tName: $ueclTopScores(element).find('td:nth-child(4) div a').text()
        });
    });

    const unlTopScoresRes = await fetch( // unlTopScores
        'https://www.sport-express.ru/football/N/nation-league/stats/bombardiers/'
    );
    const unlTopScoresCharset = (unlTopScoresRes.headers.get('content-type') ?? '').split(/\s*;\s*/).find((/** @type {string} */ x) => x.startsWith('charset'))?.replace(/charset=/, '');
    const unlTopScoresBuf = await unlTopScoresRes.arrayBuffer();
    const unlTopScoresHtml = iconv.decode(
        Buffer.from(unlTopScoresBuf),
        unlTopScoresCharset || 'windows-1251'
    );
    const $unlTopScores = cheerio.load(unlTopScoresHtml);

    $unlTopScores('#__layout > section > section:nth-child(2) > section.app__holder > div > div > table > tbody > tr').each((i, element) => {
        unlTopScores.push({
            place: $unlTopScores(element).find('.statistics__td_number').text(),
            img: $unlTopScores(element).find('.se19-table-statistics__td--img a img').attr('src'),
            player: $unlTopScores(element).find('.statistics__td_player a').text(),
            games: $unlTopScores(element).find('td').eq(4).text(),
            goals: $unlTopScores(element).find('td').eq(5).text().replace(/\s/g, '').split('(')[0],
            assists: '(' + $unlTopScores(element).find('td').eq(5).text().replace(/\s/g, '').split('(')[1],
            tLogo: $unlTopScores(element).find('td:nth-child(4) .flag img').attr('src'),
            tName: $unlTopScores(element).find('td:nth-child(4) .name a').text()
        });
    });

    await axios.get('https://soccer365.ru/competitions/24/') // euro qual standings A
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#main_container > div.page_main_content > div > table:nth-child(9) tbody tr').each((i, element) => {
            euroQualStandingsA.push({
                name: $(element).find('td:nth-child(2) > div > span > a').text(),
                descrClass: $(element).find('td:nth-child(1) > div').attr('class').split(' ')[2],
                place: $(element).find('td:nth-child(1) > div').text(),
                logo: $(element).find('td:nth-child(2) > div > img').attr('src'),
                games: $(element).find('td:nth-child(3)').text(),
                goalsFor: $(element).find('td:nth-child(7)').text(),
                goalsAgainst: $(element).find('td:nth-child(8)').text(),
                points: $(element).find('td:nth-child(10) b').text(),
                group: $(element).parent().parent().find('.stngs_hdr .title').text(),
            });
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://soccer365.ru/competitions/24/') // euro qual standings B
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#main_container > div.page_main_content > div > table:nth-child(11) tbody tr').each((i, element) => {
            euroQualStandingsB.push({
                name: $(element).find('td:nth-child(2) > div > span > a').text(),
                descrClass: $(element).find('td:nth-child(1) > div').attr('class').split(' ')[2],
                place: $(element).find('td:nth-child(1) > div').text(),
                logo: $(element).find('td:nth-child(2) > div > img').attr('src'),
                games: $(element).find('td:nth-child(3)').text(),
                goalsFor: $(element).find('td:nth-child(7)').text(),
                goalsAgainst: $(element).find('td:nth-child(8)').text(),
                points: $(element).find('td:nth-child(10) b').text(),
                group: $(element).parent().parent().find('.stngs_hdr .title').text(),
            });
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://soccer365.ru/competitions/24/') // euro qual standings C
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#main_container > div.page_main_content > div > table:nth-child(13) tbody tr').each((i, element) => {
            euroQualStandingsC.push({
                name: $(element).find('td:nth-child(2) > div > span > a').text(),
                descrClass: $(element).find('td:nth-child(1) > div').attr('class').split(' ')[2],
                place: $(element).find('td:nth-child(1) > div').text(),
                logo: $(element).find('td:nth-child(2) > div > img').attr('src'),
                games: $(element).find('td:nth-child(3)').text(),
                goalsFor: $(element).find('td:nth-child(7)').text(),
                goalsAgainst: $(element).find('td:nth-child(8)').text(),
                points: $(element).find('td:nth-child(10) b').text(),
                group: $(element).parent().parent().find('.stngs_hdr .title').text(),
            });
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://soccer365.ru/competitions/24/') // euro qual standings D
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#main_container > div.page_main_content > div > table:nth-child(15) tbody tr').each((i, element) => {
            euroQualStandingsD.push({
                name: $(element).find('td:nth-child(2) > div > span > a').text(),
                descrClass: $(element).find('td:nth-child(1) > div').attr('class').split(' ')[2],
                place: $(element).find('td:nth-child(1) > div').text(),
                logo: $(element).find('td:nth-child(2) > div > img').attr('src'),
                games: $(element).find('td:nth-child(3)').text(),
                goalsFor: $(element).find('td:nth-child(7)').text(),
                goalsAgainst: $(element).find('td:nth-child(8)').text(),
                points: $(element).find('td:nth-child(10) b').text(),
                group: $(element).parent().parent().find('.stngs_hdr .title').text(),
            });
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://soccer365.ru/competitions/24/') // euro qual standings E
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#main_container > div.page_main_content > div > table:nth-child(17) tbody tr').each((i, element) => {
            euroQualStandingsE.push({
                name: $(element).find('td:nth-child(2) > div > span > a').text(),
                descrClass: $(element).find('td:nth-child(1) > div').attr('class').split(' ')[2],
                place: $(element).find('td:nth-child(1) > div').text(),
                logo: $(element).find('td:nth-child(2) > div > img').attr('src'),
                games: $(element).find('td:nth-child(3)').text(),
                goalsFor: $(element).find('td:nth-child(7)').text(),
                goalsAgainst: $(element).find('td:nth-child(8)').text(),
                points: $(element).find('td:nth-child(10) b').text(),
                group: $(element).parent().parent().find('.stngs_hdr .title').text(),
            });
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://soccer365.ru/competitions/24/') // euro qual standings F
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#main_container > div.page_main_content > div > table:nth-child(19) tbody tr').each((i, element) => {
            euroQualStandingsF.push({
                name: $(element).find('td:nth-child(2) > div > span > a').text(),
                descrClass: $(element).find('td:nth-child(1) > div').attr('class').split(' ')[2],
                place: $(element).find('td:nth-child(1) > div').text(),
                logo: $(element).find('td:nth-child(2) > div > img').attr('src'),
                games: $(element).find('td:nth-child(3)').text(),
                goalsFor: $(element).find('td:nth-child(7)').text(),
                goalsAgainst: $(element).find('td:nth-child(8)').text(),
                points: $(element).find('td:nth-child(10) b').text(),
                group: $(element).parent().parent().find('.stngs_hdr .title').text(),
            });
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://soccer365.ru/competitions/24/') // euro qual standings G
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#main_container > div.page_main_content > div > table:nth-child(21) tbody tr').each((i, element) => {
            euroQualStandingsG.push({
                name: $(element).find('td:nth-child(2) > div > span > a').text(),
                descrClass: $(element).find('td:nth-child(1) > div').attr('class').split(' ')[2],
                place: $(element).find('td:nth-child(1) > div').text(),
                logo: $(element).find('td:nth-child(2) > div > img').attr('src'),
                games: $(element).find('td:nth-child(3)').text(),
                goalsFor: $(element).find('td:nth-child(7)').text(),
                goalsAgainst: $(element).find('td:nth-child(8)').text(),
                points: $(element).find('td:nth-child(10) b').text(),
                group: $(element).parent().parent().find('.stngs_hdr .title').text(),
            });
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://soccer365.ru/competitions/24/') // euro qual standings H
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#main_container > div.page_main_content > div > table:nth-child(23) tbody tr').each((i, element) => {
            euroQualStandingsH.push({
                name: $(element).find('td:nth-child(2) > div > span > a').text(),
                descrClass: $(element).find('td:nth-child(1) > div').attr('class').split(' ')[2],
                place: $(element).find('td:nth-child(1) > div').text(),
                logo: $(element).find('td:nth-child(2) > div > img').attr('src'),
                games: $(element).find('td:nth-child(3)').text(),
                goalsFor: $(element).find('td:nth-child(7)').text(),
                goalsAgainst: $(element).find('td:nth-child(8)').text(),
                points: $(element).find('td:nth-child(10) b').text(),
                group: $(element).parent().parent().find('.stngs_hdr .title').text(),
            });
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://soccer365.ru/competitions/24/') // euro qual standings I
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#main_container > div.page_main_content > div > table:nth-child(25) tbody tr').each((i, element) => {
            euroQualStandingsI.push({
                name: $(element).find('td:nth-child(2) > div > span > a').text(),
                descrClass: $(element).find('td:nth-child(1) > div').attr('class').split(' ')[2],
                place: $(element).find('td:nth-child(1) > div').text(),
                logo: $(element).find('td:nth-child(2) > div > img').attr('src'),
                games: $(element).find('td:nth-child(3)').text(),
                goalsFor: $(element).find('td:nth-child(7)').text(),
                goalsAgainst: $(element).find('td:nth-child(8)').text(),
                points: $(element).find('td:nth-child(10) b').text(),
                group: $(element).parent().parent().find('.stngs_hdr .title').text(),
            });
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://soccer365.ru/competitions/24/') // euro qual standings J
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#main_container > div.page_main_content > div > table:nth-child(27) tbody tr').each((i, element) => {
            euroQualStandingsJ.push({
                name: $(element).find('td:nth-child(2) > div > span > a').text(),
                descrClass: $(element).find('td:nth-child(1) > div').attr('class').split(' ')[2],
                place: $(element).find('td:nth-child(1) > div').text(),
                logo: $(element).find('td:nth-child(2) > div > img').attr('src'),
                games: $(element).find('td:nth-child(3)').text(),
                goalsFor: $(element).find('td:nth-child(7)').text(),
                goalsAgainst: $(element).find('td:nth-child(8)').text(),
                points: $(element).find('td:nth-child(10) b').text(),
                group: $(element).parent().parent().find('.stngs_hdr .title').text(),
            });
        });
    })
    .catch(err => console.log(err));
    
    return true;
}

parsing();

const liveParsing = async () => {
    await axios.get('https://soccer365.ru/online/') // liveMatches
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('.game_block').each((i, element) => {
            $(element).find('a').parent().attr('dt-status') === 'i' && liveMatches.push({
                hName: $(element).find('.game_block a .result .ht .name .img16 span').text() === '' ? $(element).find('.game_block a .result .ht .name').text() : $(element).find('.game_block a .result .ht .name .img16 span').text(),
                aName: $(element).find('.game_block a .result .at .name .img16 span').text() === '' ? $(element).find('.game_block a .result .at .name').text() : $(element).find('.game_block a .result .at .name .img16 span').text(),
                hLogo: $(element).find('.game_block a .result .ht .name .img16 img').attr('src'),
                aLogo: $(element).find('.game_block a .result .at .name .img16 img').attr('src'),
                lLogo: $(element).find('.game_block a').parent().parent().find('div:first-child a .img16 img').attr('src') || $(element).find('.game_block a').parent().parent().find('div:first-child .img16 img').attr('src'),
                lName: $(element).find('.game_block a').parent().parent().find('div:first-child a .img16 span').text() || $(element).find('.game_block a').parent().parent().find('div:first-child .img16 span').text(),
                time: $(element).find('.game_block a .status').text(),
                hScore: $(element).find('.game_block a .result .ht .gls').text(),
                aScore: $(element).find('.game_block a .result .at .gls').text()
            }) && liveMatchesLinks.push(`https://soccer365.ru${$(element).find('.game_block a').attr('href')}`); // push live matches links
        });
    })
    .catch(err => console.log(err));

    for await (e of liveMatchesLinks) {
        await axios.get(`${e}`) // liveMatches | scraping nested link
            .then(response => response.data)
            .then(response => {
                const $ = cheerio.load(response);

                liveMatchesLeagueNameRoundDate.push($('#game_events h2').text().split(",")); // scraping round
                liveMatches = liveMatches.map((item, index) => ({ ...item,
                    lNameRoundDateTime: liveMatchesLeagueNameRoundDate[index]
                }));
            })
            .catch(err => console.log(err));
    }

    await axios.get('https://soccer365.ru/ranking/fifa/') // fifa ranking
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#rankings > tbody tr').each((i, element) => {
            fifaRanking.push({
                name: $(element).find('td:nth-child(3) > a > span').text(),
                place: $(element).find('td.tb_center.tb_place').text(),
                difference: $(element).find('td.tb_center.tb_diff > span').text(),
                flag: $(element).find('td:nth-child(3) > a > span').css('background-image').replace(/^url\(['"](.+)['"]\)/, '$1'),
                points: $(element).find('td:nth-child(4) > b').text(),
                pointsDiff: $(element).find('td:nth-child(5)').text(),
                association: $(element).find('td:nth-child(6)').text()
            });
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://www.sports.ru/rfpl/') // rpl season info
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        rplSeasonInfo = $('#branding-layout > div > div.contentLayout.js-active > div.c-tag-header.tag-main-block > div > div.short-info > div.descr').text();
    })
    .catch(err => console.log(err));

    await axios.get('https://www.sports.ru/rfpl/') // rpl last winner
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        rplLastWinner = $('#branding-layout > div > div.contentLayout.js-active > div.c-tag-header.tag-main-block > div > div.short-info > table > tbody > tr:nth-child(2) > td > a').text();
    })
    .catch(err => console.log(err));

    await axios.get('https://ru.wikipedia.org/wiki/%D0%A0%D0%BE%D1%81%D1%81%D0%B8%D0%B9%D1%81%D0%BA%D0%B0%D1%8F_%D0%BF%D1%80%D0%B5%D0%BC%D1%8C%D0%B5%D1%80-%D0%BB%D0%B8%D0%B3%D0%B0') // rpl most winner
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        rplMostWinner = $('#mw-content-text > div.mw-parser-output > table.infobox.infobox-e2da8df976be4920 > tbody > tr:nth-child(12) > td > a').text();
    })
    .catch(err => console.log(err));

    return true;
}

liveParsing();

setInterval(() => {
    uefaCountryRank.splice(0, uefaCountryRank.length);
    uefaCountryRankSeason.splice(0, uefaCountryRankSeason.length);
    transferList.splice(0, transferList.length);
    rplStandings.splice(0, rplStandings.length);
    eplStandings.splice(0, eplStandings.length);
    laligaStandings.splice(0, laligaStandings.length);
    bundesligaStandings.splice(0, bundesligaStandings.length);
    serieaStandings.splice(0, serieaStandings.length);
    ligue1Standings.splice(0, ligue1Standings.length);
    endedMatches.splice(0, endedMatches.length);
    forecasts.splice(0, forecasts.length);
    matchesSlider.splice(0, matchesSlider.length);
    matchesSliderCoefLinks.splice(0, matchesSliderCoefLinks.length);
    matchesSliderCoefsW1.splice(0, matchesSliderCoefsW1.length);
    matchesSliderCoefsD.splice(0, matchesSliderCoefsD.length);
    matchesSliderCoefsW2.splice(0, matchesSliderCoefsW2.length);
    matchesSliderLeagueNameRoundDate.splice(0, matchesSliderLeagueNameRoundDate.length);
    matchesSliderStadiums.splice(0, matchesSliderStadiums.length);
    matchesSliderVenue.splice(0, matchesSliderVenue.length);
    matchesSliderReferee.splice(0, matchesSliderReferee.length);
    matchesSliderWeatherIco.splice(0, matchesSliderWeatherIco.length);
    matchesSliderWeatherDescr.splice(0, matchesSliderWeatherDescr.length);
    uclStandingsA.splice(0, uclStandingsA.length);
    uclStandingsB.splice(0, uclStandingsB.length);
    uclStandingsC.splice(0, uclStandingsC.length);
    uclStandingsD.splice(0, uclStandingsD.length);
    uclStandingsE.splice(0, uclStandingsE.length);
    uclStandingsF.splice(0, uclStandingsF.length);
    uclStandingsG.splice(0, uclStandingsG.length);
    uclStandingsH.splice(0, uclStandingsH.length);
    uelStandingsA.splice(0, uelStandingsA.length);
    uelStandingsB.splice(0, uelStandingsB.length);
    uelStandingsC.splice(0, uelStandingsC.length);
    uelStandingsD.splice(0, uelStandingsD.length);
    uelStandingsE.splice(0, uelStandingsE.length);
    uelStandingsF.splice(0, uelStandingsF.length);
    uelStandingsG.splice(0, uelStandingsG.length);
    uelStandingsH.splice(0, uelStandingsH.length);
    ueclStandingsA.splice(0, ueclStandingsA.length);
    ueclStandingsB.splice(0, ueclStandingsB.length);
    ueclStandingsC.splice(0, ueclStandingsC.length);
    ueclStandingsD.splice(0, ueclStandingsD.length);
    ueclStandingsE.splice(0, ueclStandingsE.length);
    ueclStandingsF.splice(0, ueclStandingsF.length);
    ueclStandingsG.splice(0, ueclStandingsG.length);
    ueclStandingsH.splice(0, ueclStandingsH.length);
    rplTopScores.splice(0, rplTopScores.length);
    eplTopScores.splice(0, eplTopScores.length);
    laligaTopScores.splice(0, laligaTopScores.length);
    bundesligaTopScores.splice(0, bundesligaTopScores.length);
    serieaTopScores.splice(0, serieaTopScores.length);
    ligue1TopScores.splice(0, ligue1TopScores.length);
    uclTopScores.splice(0, uclTopScores.length);
    uelTopScores.splice(0, uelTopScores.length);
    ueclTopScores.splice(0, ueclTopScores.length);
    unlTopScores.splice(0, unlTopScores.length);
    unlStandingsA1.splice(0, unlStandingsA1.length);
    unlStandingsA2.splice(0, unlStandingsA2.length);
    unlStandingsA3.splice(0, unlStandingsA3.length);
    unlStandingsA4.splice(0, unlStandingsA4.length);
    unlStandingsB1.splice(0, unlStandingsB1.length);
    unlStandingsB2.splice(0, unlStandingsB2.length);
    unlStandingsB3.splice(0, unlStandingsB3.length);
    unlStandingsB4.splice(0, unlStandingsB4.length);
    unlStandingsC1.splice(0, unlStandingsC1.length);
    unlStandingsC2.splice(0, unlStandingsC2.length);
    unlStandingsC3.splice(0, unlStandingsC3.length);
    unlStandingsC4.splice(0, unlStandingsC4.length);
    unlStandingsD1.splice(0, unlStandingsD1.length);
    unlStandingsD2.splice(0, unlStandingsD2.length);
    matchesSchedule.splice(0, matchesSchedule.length);
    fifaRanking.splice(0, fifaRanking.length);
    euroQualStandingsA.splice(0, euroQualStandingsA.length);
    euroQualStandingsB.splice(0, euroQualStandingsB.length);
    euroQualStandingsC.splice(0, euroQualStandingsC.length);
    euroQualStandingsD.splice(0, euroQualStandingsD.length);
    euroQualStandingsE.splice(0, euroQualStandingsE.length);
    euroQualStandingsF.splice(0, euroQualStandingsF.length);
    euroQualStandingsG.splice(0, euroQualStandingsG.length);
    euroQualStandingsH.splice(0, euroQualStandingsH.length);
    euroQualStandingsI.splice(0, euroQualStandingsI.length);
    euroQualStandingsJ.splice(0, euroQualStandingsJ.length);
    rplSeasonInfo = '';
    rplLastWinner = '';
    rplMostWinner = '';

    parsing();
}, 120000);

setInterval(() => {
    liveParsing();
    liveMatches.splice(0, liveMatches.length);
    liveMatchesLinks.splice(0, liveMatchesLinks.length);
    liveMatchesLeagueNameRoundDate.splice(0, liveMatchesLeagueNameRoundDate.length);
}, 30000);

app.listen(PORT, (err) => {
    if(err) return err;
    console.log(`Server on ${PORT} is running...`);
});