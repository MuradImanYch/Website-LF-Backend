const axios = require('axios');
const db = require('../db.js');
const cheerio = require('cheerio');
const CyrillicToTranslit = require('cyrillic-to-translit-js');
const iconv = require('iconv-lite');

let liveMatches = [],
    liveMatchesLinks = [],
    liveMatchesLeagueNameRoundDate = [],
    endedMatches = [],
    uefaCountryRank = [],
    uefaCountryRankSeason = [],
    transferList = [],
    transferListRpl = [],
    transferListEpl = [],
    transferListLaliga = [],
    transferListSeriea = [],
    transferListBundesliga = [],
    transferListLigue1 = [],
    rplStandings = [],
    eplStandings = [],
    laligaStandings = [],
    bundesligaStandings = [],
    serieaStandings = [],
    ligue1Standings = [],
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
    forecasts = [],
    matchesSchedule = [],
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
    euroQualTopScores = [],
    rplFixtures = [],
    fifaRanking = [],
    rplResults = [],
    rplInfo = [],
    eplInfo = [],
    eplFixtures = [],
    eplResults = [],
    laligaInfo = [],
    laligaFixtures = [],
    laligaResults = [],
    serieaInfo = [],
    serieaFixtures = [],
    serieaResults = [],
    bundesligaInfo = [],
    bundesligaFixtures = [],
    bundesligaResults = [],
    ligue1Info = [],
    ligue1Fixtures = [],
    ligue1Results = [],
    uclInfo = [],
    uclFixtures = [],
    uclResults = [],
    uelInfo = [],
    uelFixtures = [],
    uelResults = [],
    ueclInfo = [],
    ueclFixtures = [],
    ueclResults = [],
    euQualInfo = [],
    euQualFixtures = [],
    euQualResults = [],
    unlInfo = [],
    unlFixtures = [],
    unlResults = []

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
                /* lName: $(element).find('.game_block a').parent().parent().find('div:first-child a .img16 span').text() || $(element).find('.game_block a').parent().parent().find('div:first-child .img16 span').text().length > 25 ? $(element).find('.game_block a').parent().parent().find('div:first-child .img16 span').text().slice(0, 25) : $(element).find('.game_block a').parent().parent().find('div:first-child .img16 span').text(), */
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

    db.query('DELETE FROM livematches', (err => {
        if(err) throw err;
    }));

    liveMatches.map((e) => {
        db.query('INSERT INTO livematches (hName, aName, hScore, aScore, hLogo, aLogo, lLogo, lName, time, round, roundInfo) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.hName, e.aName, e.hScore, e.aScore, e.hLogo, e.aLogo, e.lLogo, e.lNameRoundDateTime[0]?.indexOf('Товарищеский') !== -1 ? 'Товарищеский' : e.lNameRoundDateTime[0], e.time, e.lNameRoundDateTime[1], e.lNameRoundDateTime[2]], (err => {
            if(err) throw err;
        }));
    });

    return true;
}

liveParsing();

const parsing = async () => {
    const cyrillicToTranslit = new CyrillicToTranslit();

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
                lName: $(element).find('a').parent().parent().find('div:first-child a .img16 span').text() === '' ? $(element).find('a').parent().parent().find('div:first-child .img16 span').text() || $(element).find('a').parent().parent().find('div:first-child .img16 span').text().length > 25 ? $(element).find('a').parent().parent().find('div:first-child .img16 span').text().slice(0, 25) : $(element).find('a').parent().parent().find('div:first-child .img16 span').text() : $(element).find('a').parent().parent().find('div:first-child a .img16 span').text() || $(element).find('a').parent().parent().find('div:first-child a .img16 span').text().length > 25 ? $(element).find('a').parent().parent().find('div:first-child a .img16 span').text().slice(0, 25) : $(element).find('a').parent().parent().find('div:first-child a .img16 span').text(),
                lRound: $(element).find('a .stage').text(),
                hScore: $(element).find('a .result .ht .gls').text(),
                aScore: $(element).find('a .result .at .gls').text(),
                hCards: $(element).find('a .result .ht .cards span').eq(0).attr('class') && $(element).find('a .result .ht .cards span').eq(0).attr('class').split(' ')[2].split('_')[1],
                aCards: $(element).find('a .result .at .cards span').eq(0).attr('class') && $(element).find('a .result .at .cards span').eq(0).attr('class').split(' ')[2].split('_')[1]
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM endedmatches', (err => {
        if(err) throw err;
    }));

    endedMatches.map((e) => {
        db.query('INSERT INTO endedmatches (hName, aName, hLogo, aLogo, lLogo, lName, lRound, hScore, aScore, hCards, aCards) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.hName, e.aName, e.hLogo, e.aLogo, e.lLogo, e.lName.indexOf('Товарищеский') !== -1 ? 'Товарищеский' : e.lName, e.lRound, e.hScore, e.aScore, e.hCards, e.aCards], (err => {
            if(err) throw err;
        }));
    });

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

        db.query('DELETE FROM uefacountryrankseason', (err => {
            if(err) throw err;
        }));
    
        uefaCountryRankSeason.map((e) => {
            db.query('INSERT INTO uefacountryrankseason (seasonLast5, seasonLast4, seasonLast3, seasonLast2, seasonCurrent) VALUES(?, ?, ?, ?, ?)', [e.seasonLast5, e.seasonLast4, e.seasonLast3, e.seasonLast2, e.seasonCurrent], (err => {
                if(err) throw err;
            }));
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

        db.query('DELETE FROM uefacountryrank', (err => {
            if(err) throw err;
        }));

        uefaCountryRank.map((e) => {
            db.query('INSERT INTO uefacountryrank (place, flag, name, total, quantity, totalLast5, totalLast4, totalLast3, totalLast2, totalCurrent) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.place, e.flag, e.name, e.total, e.quantity, e.totalLast5, e.totalLast4, e.totalLast3, e.totalLast2, e.totalCurrent], (err => {
                if(err) throw err;
            }));
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
                    clubIn: $(element).find('.gray div:last-child img').attr('src'),
                    clubInName: $(element).find('.gray div:last-child span').text(),
                    price: $(element).find('.green').text()
                });
            });

            db.query('DELETE FROM transferlistall', (err => {
                if(err) throw err;
            }));
    
            transferList.map((e) => {
                db.query('INSERT INTO transferlistall (img, name, flag, position, date, clubOut, clubOutName, clubIn, clubInName, price) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.img, e.name, e.flag, e.position, e.date, e.clubOut, e.clubOutName, e.clubIn, e.clubInName, e.price], (err => {
                    if(err) throw err;
                }));
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
                    clubIn: $(element).find('.gray div:last-child img').attr('src'),
                    clubInName: $(element).find('.gray div:last-child span').text(),
                    price: $(element).find('.green').text()
                });
            });
        })
        .catch(err => console.log(err));

        db.query('DELETE FROM transferlistrpl', (err => {
            if(err) throw err;
        }));

        transferListRpl.map((e) => {
            db.query('INSERT INTO transferlistrpl (img, name, flag, position, date, clubOut, clubOutName, clubIn, clubInName, price) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.img, e.name, e.flag, e.position, e.date, e.clubOut, e.clubOutName, e.clubIn, e.clubInName, e.price], (err => {
                if(err) throw err;
            }));
        });

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
                    clubIn: $(element).find('.gray div:last-child img').attr('src'),
                    clubInName: $(element).find('.gray div:last-child span').text(),
                    price: $(element).find('.green').text()
                });
            });
        })
        .catch(err => console.log(err));

        db.query('DELETE FROM transferlistepl', (err => {
            if(err) throw err;
        }));

        transferListEpl.map((e) => {
            db.query('INSERT INTO transferlistepl (img, name, flag, position, date, clubOut, clubOutName, clubIn, clubInName, price) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.img, e.name, e.flag, e.position, e.date, e.clubOut, e.clubOutName, e.clubIn, e.clubInName, e.price], (err => {
                if(err) throw err;
            }));
        });

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
                    clubIn: $(element).find('.gray div:last-child img').attr('src'),
                    clubInName: $(element).find('.gray div:last-child span').text(),
                    price: $(element).find('.green').text()
                });
            });
        })
        .catch(err => console.log(err));

        db.query('DELETE FROM transferlistlaliga', (err => {
            if(err) throw err;
        }));

        transferListLaliga.map((e) => {
            db.query('INSERT INTO transferlistlaliga (img, name, flag, position, date, clubOut, clubOutName, clubIn, clubInName, price) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.img, e.name, e.flag, e.position, e.date, e.clubOut, e.clubOutName, e.clubIn, e.clubInName, e.price], (err => {
                if(err) throw err;
            }));
        });

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
                    clubIn: $(element).find('.gray div:last-child img').attr('src'),
                    clubInName: $(element).find('.gray div:last-child span').text(),
                    price: $(element).find('.green').text()
                });
            });
        })
        .catch(err => console.log(err));

        db.query('DELETE FROM transferlistseriea', (err => {
            if(err) throw err;
        }));

        transferListSeriea.map((e) => {
            db.query('INSERT INTO transferlistseriea (img, name, flag, position, date, clubOut, clubOutName, clubIn, clubInName, price) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.img, e.name, e.flag, e.position, e.date, e.clubOut, e.clubOutName, e.clubIn, e.clubInName, e.price], (err => {
                if(err) throw err;
            }));
        });

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
                    clubIn: $(element).find('.gray div:last-child img').attr('src'),
                    clubInName: $(element).find('.gray div:last-child span').text(),
                    price: $(element).find('.green').text()
                });
            });
        })
        .catch(err => console.log(err));

        db.query('DELETE FROM transferlistbundesliga', (err => {
            if(err) throw err;
        }));

        transferListBundesliga.map((e) => {
            db.query('INSERT INTO transferlistbundesliga (img, name, flag, position, date, clubOut, clubOutName, clubIn, clubInName, price) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.img, e.name, e.flag, e.position, e.date, e.clubOut, e.clubOutName, e.clubIn, e.clubInName, e.price], (err => {
                if(err) throw err;
            }));
        });

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
                    clubIn: $(element).find('.gray div:last-child img').attr('src'),
                    clubInName: $(element).find('.gray div:last-child span').text(),
                    price: $(element).find('.green').text()
                });
            });
        })
        .catch(err => console.log(err));

        db.query('DELETE FROM transferlistligue1', (err => {
            if(err) throw err;
        }));

        transferListLigue1.map((e) => {
            db.query('INSERT INTO transferlistligue1 (img, name, flag, position, date, clubOut, clubOutName, clubIn, clubInName, price) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.img, e.name, e.flag, e.position, e.date, e.clubOut, e.clubOutName, e.clubIn, e.clubInName, e.price], (err => {
                if(err) throw err;
            }));
        });
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
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' '),
                win: $(element).find('.score').eq(1).text(),
                draw: $(element).find('.score').eq(2).text(),
                lose: $(element).find('.score').eq(3).text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM rplstandings', (err => {
        if(err) throw err;
    }));

    rplStandings.map((e) => {
        db.query('INSERT INTO rplstandings (name, place, description, logo, games, goalsFor, goalsAgainst, points, descrLat, win, draw, lose) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.name, e.place, e.description, e.logo, e.games, e.goalsFor, e.goalsAgainst, e.points, e.descrLat, e.win, e.draw, e.lose], (err => {
            if(err) throw err;
        }));
    });

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
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' '),
                win: $(element).find('.score').eq(1).text(),
                draw: $(element).find('.score').eq(2).text(),
                lose: $(element).find('.score').eq(3).text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM eplstandings', (err => {
        if(err) throw err;
    }));

    eplStandings.map((e) => {
        db.query('INSERT INTO eplstandings (name, place, description, logo, games, goalsFor, goalsAgainst, points, descrLat, win, draw, lose) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.name, e.place, e.description, e.logo, e.games, e.goalsFor, e.goalsAgainst, e.points, e.descrLat, e.win, e.draw, e.lose], (err => {
            if(err) throw err;
        }));
    });

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
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' '),
                win: $(element).find('.score').eq(1).text(),
                draw: $(element).find('.score').eq(2).text(),
                lose: $(element).find('.score').eq(3).text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM laligastandings', (err => {
        if(err) throw err;
    }));

    laligaStandings.map((e) => {
        db.query('INSERT INTO laligastandings (name, place, description, logo, games, goalsFor, goalsAgainst, points, descrLat, win, draw, lose) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.name, e.place, e.description, e.logo, e.games, e.goalsFor, e.goalsAgainst, e.points, e.descrLat, e.win, e.draw, e.lose], (err => {
            if(err) throw err;
        }));
    });

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
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' '),
                win: $(element).find('.score').eq(1).text(),
                draw: $(element).find('.score').eq(2).text(),
                lose: $(element).find('.score').eq(3).text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM bundesligastandings', (err => {
        if(err) throw err;
    }));

    bundesligaStandings.map((e) => {
        db.query('INSERT INTO bundesligastandings (name, place, description, logo, games, goalsFor, goalsAgainst, points, descrLat, win, draw, lose) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.name, e.place, e.description, e.logo, e.games, e.goalsFor, e.goalsAgainst, e.points, e.descrLat, e.win, e.draw, e.lose], (err => {
            if(err) throw err;
        }));
    });

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
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' '),
                win: $(element).find('.score').eq(1).text(),
                draw: $(element).find('.score').eq(2).text(),
                lose: $(element).find('.score').eq(3).text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM serieastandings', (err => {
        if(err) throw err;
    }));

    serieaStandings.map((e) => {
        db.query('INSERT INTO serieastandings (name, place, description, logo, games, goalsFor, goalsAgainst, points, descrLat, win, draw, lose) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.name, e.place, e.description, e.logo, e.games, e.goalsFor, e.goalsAgainst, e.points, e.descrLat, e.win, e.draw, e.lose], (err => {
            if(err) throw err;
        }));
    });

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
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' '),
                win: $(element).find('.score').eq(1).text(),
                draw: $(element).find('.score').eq(2).text(),
                lose: $(element).find('.score').eq(3).text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM ligue1standings', (err => {
        if(err) throw err;
    }));

    ligue1Standings.map((e) => {
        db.query('INSERT INTO ligue1standings (name, place, description, logo, games, goalsFor, goalsAgainst, points, descrLat, win, draw, lose) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.name, e.place, e.description, e.logo, e.games, e.goalsFor, e.goalsAgainst, e.points, e.descrLat, e.win, e.draw, e.lose], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://www.liveresult.ru/football/Champions-League/standings') // ucl standings (A)
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
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' '),
                win: $(element).find('.score').eq(1).text(),
                draw: $(element).find('.score').eq(2).text(),
                lose: $(element).find('.score').eq(3).text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM uclstandingsa', (err => {
        if(err) throw err;
    }));

    uclStandingsA.map((e) => {
        db.query('INSERT INTO uclstandingsa (standingsGroup, name, place, description, logo, games, goalsFor, goalsAgainst, points, descrLat, win, draw, lose) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.group, e.name, e.place, e.description, e.logo, e.games, e.goalsFor, e.goalsAgainst, e.points, e.descrLat, e.win, e.draw, e.lose], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://www.liveresult.ru/football/Champions-League/standings') // ucl standings (B)
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
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' '),
                win: $(element).find('.score').eq(1).text(),
                draw: $(element).find('.score').eq(2).text(),
                lose: $(element).find('.score').eq(3).text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM uclstandingsb', (err => {
        if(err) throw err;
    }));

    uclStandingsB.map((e) => {
        db.query('INSERT INTO uclstandingsb (standingsGroup, name, place, description, logo, games, goalsFor, goalsAgainst, points, descrLat, win, draw, lose) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.group, e.name, e.place, e.description, e.logo, e.games, e.goalsFor, e.goalsAgainst, e.points, e.descrLat, e.win, e.draw, e.lose], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://www.liveresult.ru/football/Champions-League/standings') // ucl standings (C)
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
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' '),
                win: $(element).find('.score').eq(1).text(),
                draw: $(element).find('.score').eq(2).text(),
                lose: $(element).find('.score').eq(3).text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM uclstandingsc', (err => {
        if(err) throw err;
    }));

    uclStandingsC.map((e) => {
        db.query('INSERT INTO uclstandingsc (standingsGroup, name, place, description, logo, games, goalsFor, goalsAgainst, points, descrLat, win, draw, lose) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.group, e.name, e.place, e.description, e.logo, e.games, e.goalsFor, e.goalsAgainst, e.points, e.descrLat, e.win, e.draw, e.lose], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://www.liveresult.ru/football/Champions-League/standings') // ucl standings (D)
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
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' '),
                win: $(element).find('.score').eq(1).text(),
                draw: $(element).find('.score').eq(2).text(),
                lose: $(element).find('.score').eq(3).text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM uclstandingsd', (err => {
        if(err) throw err;
    }));

    uclStandingsD.map((e) => {
        db.query('INSERT INTO uclstandingsd (standingsGroup, name, place, description, logo, games, goalsFor, goalsAgainst, points, descrLat, win, draw, lose) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.group, e.name, e.place, e.description, e.logo, e.games, e.goalsFor, e.goalsAgainst, e.points, e.descrLat, e.win, e.draw, e.lose], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://www.liveresult.ru/football/Champions-League/standings') // ucl standings (E)
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
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' '),
                win: $(element).find('.score').eq(1).text(),
                draw: $(element).find('.score').eq(2).text(),
                lose: $(element).find('.score').eq(3).text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM uclstandingse', (err => {
        if(err) throw err;
    }));

    uclStandingsE.map((e) => {
        db.query('INSERT INTO uclstandingse (standingsGroup, name, place, description, logo, games, goalsFor, goalsAgainst, points, descrLat, win, draw, lose) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.group, e.name, e.place, e.description, e.logo, e.games, e.goalsFor, e.goalsAgainst, e.points, e.descrLat, e.win, e.draw, e.lose], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://www.liveresult.ru/football/Champions-League/standings') // ucl standings (F)
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
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' '),
                win: $(element).find('.score').eq(1).text(),
                draw: $(element).find('.score').eq(2).text(),
                lose: $(element).find('.score').eq(3).text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM uclstandingsf', (err => {
        if(err) throw err;
    }));

    uclStandingsF.map((e) => {
        db.query('INSERT INTO uclstandingsf (standingsGroup, name, place, description, logo, games, goalsFor, goalsAgainst, points, descrLat, win, draw, lose) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.group, e.name, e.place, e.description, e.logo, e.games, e.goalsFor, e.goalsAgainst, e.points, e.descrLat, e.win, e.draw, e.lose], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://www.liveresult.ru/football/Champions-League/standings') // ucl standings (G)
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
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' '),
                win: $(element).find('.score').eq(1).text(),
                draw: $(element).find('.score').eq(2).text(),
                lose: $(element).find('.score').eq(3).text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM uclstandingsg', (err => {
        if(err) throw err;
    }));

    uclStandingsG.map((e) => {
        db.query('INSERT INTO uclstandingsg (standingsGroup, name, place, description, logo, games, goalsFor, goalsAgainst, points, descrLat, win, draw, lose) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.group, e.name, e.place, e.description, e.logo, e.games, e.goalsFor, e.goalsAgainst, e.points, e.descrLat, e.win, e.draw, e.lose], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://www.liveresult.ru/football/Champions-League/standings') // ucl standings (H)
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
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' '),
                win: $(element).find('.score').eq(1).text(),
                draw: $(element).find('.score').eq(2).text(),
                lose: $(element).find('.score').eq(3).text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM uclstandingsh', (err => {
        if(err) throw err;
    }));

    uclStandingsH.map((e) => {
        db.query('INSERT INTO uclstandingsh (standingsGroup, name, place, description, logo, games, goalsFor, goalsAgainst, points, descrLat, win, draw, lose) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.group, e.name, e.place, e.description, e.logo, e.games, e.goalsFor, e.goalsAgainst, e.points, e.descrLat, e.win, e.draw, e.lose], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://www.liveresult.ru/football/Europa-League/standings' && 'https://www.liveresult.ru/football/Europa-League/standings?st=0' && 'https://www.liveresult.ru/football/Europa-League/standings?st=1') // uel standings (A)
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
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' '),
                win: $(element).find('.score').eq(1).text(),
                draw: $(element).find('.score').eq(2).text(),
                lose: $(element).find('.score').eq(3).text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM uelstandingsa', (err => {
        if(err) throw err;
    }));

    uelStandingsA.map((e) => {
        db.query('INSERT INTO uelstandingsa (standingsGroup, name, place, description, logo, games, goalsFor, goalsAgainst, points, descrLat, win, draw, lose) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.group, e.name, e.place, e.description, e.logo, e.games, e.goalsFor, e.goalsAgainst, e.points, e.descrLat, e.win, e.draw, e.lose], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://www.liveresult.ru/football/Europa-League/standings' && 'https://www.liveresult.ru/football/Europa-League/standings?st=0' && 'https://www.liveresult.ru/football/Europa-League/standings?st=1') // uel standings (B)
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
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' '),
                win: $(element).find('.score').eq(1).text(),
                draw: $(element).find('.score').eq(2).text(),
                lose: $(element).find('.score').eq(3).text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM uelstandingsb', (err => {
        if(err) throw err;
    }));

    uelStandingsB.map((e) => {
        db.query('INSERT INTO uelstandingsb (standingsGroup, name, place, description, logo, games, goalsFor, goalsAgainst, points, descrLat, win, draw, lose) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.group, e.name, e.place, e.description, e.logo, e.games, e.goalsFor, e.goalsAgainst, e.points, e.descrLat, e.win, e.draw, e.lose], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://www.liveresult.ru/football/Europa-League/standings' && 'https://www.liveresult.ru/football/Europa-League/standings?st=0' && 'https://www.liveresult.ru/football/Europa-League/standings?st=1') // uel standings (C)
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
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' '),
                win: $(element).find('.score').eq(1).text(),
                draw: $(element).find('.score').eq(2).text(),
                lose: $(element).find('.score').eq(3).text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM uelstandingsc', (err => {
        if(err) throw err;
    }));

    uelStandingsC.map((e) => {
        db.query('INSERT INTO uelstandingsc (standingsGroup, name, place, description, logo, games, goalsFor, goalsAgainst, points, descrLat, win, draw, lose) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.group, e.name, e.place, e.description, e.logo, e.games, e.goalsFor, e.goalsAgainst, e.points, e.descrLat, e.win, e.draw, e.lose], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://www.liveresult.ru/football/Europa-League/standings' && 'https://www.liveresult.ru/football/Europa-League/standings?st=0' && 'https://www.liveresult.ru/football/Europa-League/standings?st=1') // uel standings (D)
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
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' '),
                win: $(element).find('.score').eq(1).text(),
                draw: $(element).find('.score').eq(2).text(),
                lose: $(element).find('.score').eq(3).text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM uelstandingsd', (err => {
        if(err) throw err;
    }));

    uelStandingsD.map((e) => {
        db.query('INSERT INTO uelstandingsd (standingsGroup, name, place, description, logo, games, goalsFor, goalsAgainst, points, descrLat, win, draw, lose) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.group, e.name, e.place, e.description, e.logo, e.games, e.goalsFor, e.goalsAgainst, e.points, e.descrLat, e.win, e.draw, e.lose], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://www.liveresult.ru/football/Europa-League/standings' && 'https://www.liveresult.ru/football/Europa-League/standings?st=0' && 'https://www.liveresult.ru/football/Europa-League/standings?st=1') // uel standings (E)
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
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' '),
                win: $(element).find('.score').eq(1).text(),
                draw: $(element).find('.score').eq(2).text(),
                lose: $(element).find('.score').eq(3).text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM uelstandingse', (err => {
        if(err) throw err;
    }));

    uelStandingsE.map((e) => {
        db.query('INSERT INTO uelstandingse (standingsGroup, name, place, description, logo, games, goalsFor, goalsAgainst, points, descrLat, win, draw, lose) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.group, e.name, e.place, e.description, e.logo, e.games, e.goalsFor, e.goalsAgainst, e.points, e.descrLat, e.win, e.draw, e.lose], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://www.liveresult.ru/football/Europa-League/standings' && 'https://www.liveresult.ru/football/Europa-League/standings?st=0' && 'https://www.liveresult.ru/football/Europa-League/standings?st=1') // uel standings (F)
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
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' '),
                win: $(element).find('.score').eq(1).text(),
                draw: $(element).find('.score').eq(2).text(),
                lose: $(element).find('.score').eq(3).text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM uelstandingsf', (err => {
        if(err) throw err;
    }));

    uelStandingsF.map((e) => {
        db.query('INSERT INTO uelstandingsf (standingsGroup, name, place, description, logo, games, goalsFor, goalsAgainst, points, descrLat, win, draw, lose) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.group, e.name, e.place, e.description, e.logo, e.games, e.goalsFor, e.goalsAgainst, e.points, e.descrLat, e.win, e.draw, e.lose], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://www.liveresult.ru/football/Europa-League/standings' && 'https://www.liveresult.ru/football/Europa-League/standings?st=0' && 'https://www.liveresult.ru/football/Europa-League/standings?st=1') // uel standings (G)
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
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' '),
                win: $(element).find('.score').eq(1).text(),
                draw: $(element).find('.score').eq(2).text(),
                lose: $(element).find('.score').eq(3).text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM uelstandingsg', (err => {
        if(err) throw err;
    }));

    uelStandingsG.map((e) => {
        db.query('INSERT INTO uelstandingsg (standingsGroup, name, place, description, logo, games, goalsFor, goalsAgainst, points, descrLat, win, draw, lose) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.group, e.name, e.place, e.description, e.logo, e.games, e.goalsFor, e.goalsAgainst, e.points, e.descrLat, e.win, e.draw, e.lose], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://www.liveresult.ru/football/Europa-League/standings' && 'https://www.liveresult.ru/football/Europa-League/standings?st=0' && 'https://www.liveresult.ru/football/Europa-League/standings?st=1') // uel standings (H)
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
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' '),
                win: $(element).find('.score').eq(1).text(),
                draw: $(element).find('.score').eq(2).text(),
                lose: $(element).find('.score').eq(3).text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM uelstandingsh', (err => {
        if(err) throw err;
    }));

    uelStandingsH.map((e) => {
        db.query('INSERT INTO uelstandingsh (standingsGroup, name, place, description, logo, games, goalsFor, goalsAgainst, points, descrLat, win, draw, lose) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.group, e.name, e.place, e.description, e.logo, e.games, e.goalsFor, e.goalsAgainst, e.points, e.descrLat, e.win, e.draw, e.lose], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://www.liveresult.ru/football/Europa-Conference-League/standings' && 'https://www.liveresult.ru/football/Europa-Conference-League/standings?st=0' && 'https://www.liveresult.ru/football/Europa-Conference-League/standings?st=1') // uecl standings (A)
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
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' '),
                win: $(element).find('.score').eq(1).text(),
                draw: $(element).find('.score').eq(2).text(),
                lose: $(element).find('.score').eq(3).text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM ueclstandingsa', (err => {
        if(err) throw err;
    }));

    ueclStandingsA.map((e) => {
        db.query('INSERT INTO ueclstandingsa (standingsGroup, name, place, description, logo, games, goalsFor, goalsAgainst, points, descrLat, win, draw, lose) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.group, e.name, e.place, e.description, e.logo, e.games, e.goalsFor, e.goalsAgainst, e.points, e.descrLat, e.win, e.draw, e.lose], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://www.liveresult.ru/football/Europa-Conference-League/standings' && 'https://www.liveresult.ru/football/Europa-Conference-League/standings?st=0' && 'https://www.liveresult.ru/football/Europa-Conference-League/standings?st=1') // uecl standings (B)
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
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' '),
                win: $(element).find('.score').eq(1).text(),
                draw: $(element).find('.score').eq(2).text(),
                lose: $(element).find('.score').eq(3).text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM ueclstandingsb', (err => {
        if(err) throw err;
    }));

    ueclStandingsB.map((e) => {
        db.query('INSERT INTO ueclstandingsb (standingsGroup, name, place, description, logo, games, goalsFor, goalsAgainst, points, descrLat, win, draw, lose) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.group, e.name, e.place, e.description, e.logo, e.games, e.goalsFor, e.goalsAgainst, e.points, e.descrLat, e.win, e.draw, e.lose], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://www.liveresult.ru/football/Europa-Conference-League/standings' && 'https://www.liveresult.ru/football/Europa-Conference-League/standings?st=0' && 'https://www.liveresult.ru/football/Europa-Conference-League/standings?st=1') // uecl standings (C)
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
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' '),
                win: $(element).find('.score').eq(1).text(),
                draw: $(element).find('.score').eq(2).text(),
                lose: $(element).find('.score').eq(3).text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM ueclstandingsc', (err => {
        if(err) throw err;
    }));

    ueclStandingsC.map((e) => {
        db.query('INSERT INTO ueclstandingsc (standingsGroup, name, place, description, logo, games, goalsFor, goalsAgainst, points, descrLat, win, draw, lose) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.group, e.name, e.place, e.description, e.logo, e.games, e.goalsFor, e.goalsAgainst, e.points, e.descrLat, e.win, e.draw, e.lose], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://www.liveresult.ru/football/Europa-Conference-League/standings' && 'https://www.liveresult.ru/football/Europa-Conference-League/standings?st=0' && 'https://www.liveresult.ru/football/Europa-Conference-League/standings?st=1') // uecl standings (D)
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
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' '),
                win: $(element).find('.score').eq(1).text(),
                draw: $(element).find('.score').eq(2).text(),
                lose: $(element).find('.score').eq(3).text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM ueclstandingsd', (err => {
        if(err) throw err;
    }));

    ueclStandingsD.map((e) => {
        db.query('INSERT INTO ueclstandingsd (standingsGroup, name, place, description, logo, games, goalsFor, goalsAgainst, points, descrLat, win, draw, lose) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.group, e.name, e.place, e.description, e.logo, e.games, e.goalsFor, e.goalsAgainst, e.points, e.descrLat, e.win, e.draw, e.lose], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://www.liveresult.ru/football/Europa-Conference-League/standings' && 'https://www.liveresult.ru/football/Europa-Conference-League/standings?st=0' && 'https://www.liveresult.ru/football/Europa-Conference-League/standings?st=1') // uecl standings (E)
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
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' '),
                win: $(element).find('.score').eq(1).text(),
                draw: $(element).find('.score').eq(2).text(),
                lose: $(element).find('.score').eq(3).text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM ueclstandingse', (err => {
        if(err) throw err;
    }));

    ueclStandingsE.map((e) => {
        db.query('INSERT INTO ueclstandingse (standingsGroup, name, place, description, logo, games, goalsFor, goalsAgainst, points, descrLat, win, draw, lose) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.group, e.name, e.place, e.description, e.logo, e.games, e.goalsFor, e.goalsAgainst, e.points, e.descrLat, e.win, e.draw, e.lose], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://www.liveresult.ru/football/Europa-Conference-League/standings' && 'https://www.liveresult.ru/football/Europa-Conference-League/standings?st=0' && 'https://www.liveresult.ru/football/Europa-Conference-League/standings?st=1') // uecl standings (F)
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
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' '),
                win: $(element).find('.score').eq(1).text(),
                draw: $(element).find('.score').eq(2).text(),
                lose: $(element).find('.score').eq(3).text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM ueclstandingsf', (err => {
        if(err) throw err;
    }));

    ueclStandingsF.map((e) => {
        db.query('INSERT INTO ueclstandingsf (standingsGroup, name, place, description, logo, games, goalsFor, goalsAgainst, points, descrLat, win, draw, lose) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.group, e.name, e.place, e.description, e.logo, e.games, e.goalsFor, e.goalsAgainst, e.points, e.descrLat, e.win, e.draw, e.lose], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://www.liveresult.ru/football/Europa-Conference-League/standings' && 'https://www.liveresult.ru/football/Europa-Conference-League/standings?st=0' && 'https://www.liveresult.ru/football/Europa-Conference-League/standings?st=1') // uecl standings (G)
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
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' '),
                win: $(element).find('.score').eq(1).text(),
                draw: $(element).find('.score').eq(2).text(),
                lose: $(element).find('.score').eq(3).text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM ueclstandingsg', (err => {
        if(err) throw err;
    }));

    ueclStandingsG.map((e) => {
        db.query('INSERT INTO ueclstandingsg (standingsGroup, name, place, description, logo, games, goalsFor, goalsAgainst, points, descrLat, win, draw, lose) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.group, e.name, e.place, e.description, e.logo, e.games, e.goalsFor, e.goalsAgainst, e.points, e.descrLat, e.win, e.draw, e.lose], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://www.liveresult.ru/football/Europa-Conference-League/standings' && 'https://www.liveresult.ru/football/Europa-Conference-League/standings?st=0' && 'https://www.liveresult.ru/football/Europa-Conference-League/standings?st=1') // uecl standings (H)
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
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' '),
                win: $(element).find('.score').eq(1).text(),
                draw: $(element).find('.score').eq(2).text(),
                lose: $(element).find('.score').eq(3).text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM ueclstandingsh', (err => {
        if(err) throw err;
    }));

    ueclStandingsH.map((e) => {
        db.query('INSERT INTO ueclstandingsh (standingsGroup, name, place, description, logo, games, goalsFor, goalsAgainst, points, descrLat, win, draw, lose) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.group, e.name, e.place, e.description, e.logo, e.games, e.goalsFor, e.goalsAgainst, e.points, e.descrLat, e.win, e.draw, e.lose], (err => {
            if(err) throw err;
        }));
    });

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

    db.query('DELETE FROM odds', (err => {
        if(err) throw err;
    }));

    forecasts.map((e) => {
        db.query('INSERT INTO odds (hName, aName, date, time, hLogo, aLogo, lName, lCountryName, w1, draw, w2, totalU, totalO) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.hName, e.aName, e.date, e.time, e.hLogo, e.aLogo, e.lName, e.lCountryName, e.w1, e.draw, e.w2, e.tu, e.to], (err => {
            if(err) throw err;
        }));
    });

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

    db.query('DELETE FROM tv', (err => {
        if(err) throw err;
    }));

    matchesSchedule.map((e) => {
        db.query('INSERT INTO tv (programme, channel, time) VALUES(?, ?, ?)', [e.programme, e.channel, e.time], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://www.liveresult.ru/football/UEFA-Nations-League/standings?st=0') // unl standings A1
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
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' '),
                win: $(element).find('.score').eq(1).text(),
                draw: $(element).find('.score').eq(2).text(),
                lose: $(element).find('.score').eq(3).text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM unlstandingsa1', (err => {
        if(err) throw err;
    }));

    unlStandingsA1.map((e) => {
        db.query('INSERT INTO unlstandingsa1 (name, description, place, logo, games, goalsFor, goalsAgainst, points, standingsGroup, descrLat, win, draw, lose) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.name, e.description, e.place, e.logo, e.games, e.goalsFor, e.goalsAgainst, e.points, e.group, e.descrLat, e.win, e.draw, e.lose], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://www.liveresult.ru/football/UEFA-Nations-League/standings?st=0') // unl standings A2
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
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' '),
                win: $(element).find('.score').eq(1).text(),
                draw: $(element).find('.score').eq(2).text(),
                lose: $(element).find('.score').eq(3).text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM unlstandingsa2', (err => {
        if(err) throw err;
    }));

    unlStandingsA2.map((e) => {
        db.query('INSERT INTO unlstandingsa2 (name, description, place, logo, games, goalsFor, goalsAgainst, points, standingsGroup, descrLat, win, draw, lose) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.name, e.description, e.place, e.logo, e.games, e.goalsFor, e.goalsAgainst, e.points, e.group, e.descrLat, e.win, e.draw, e.lose], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://www.liveresult.ru/football/UEFA-Nations-League/standings?st=0') // unl standings A3
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
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' '),
                win: $(element).find('.score').eq(1).text(),
                draw: $(element).find('.score').eq(2).text(),
                lose: $(element).find('.score').eq(3).text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM unlstandingsa3', (err => {
        if(err) throw err;
    }));

    unlStandingsA3.map((e) => {
        db.query('INSERT INTO unlstandingsa3 (name, description, place, logo, games, goalsFor, goalsAgainst, points, standingsGroup, descrLat, win, draw, lose) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.name, e.description, e.place, e.logo, e.games, e.goalsFor, e.goalsAgainst, e.points, e.group, e.descrLat, e.win, e.draw, e.lose], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://www.liveresult.ru/football/UEFA-Nations-League/standings?st=0') // unl standings A4
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
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' '),
                win: $(element).find('.score').eq(1).text(),
                draw: $(element).find('.score').eq(2).text(),
                lose: $(element).find('.score').eq(3).text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM unlstandingsa4', (err => {
        if(err) throw err;
    }));

    unlStandingsA4.map((e) => {
        db.query('INSERT INTO unlstandingsa4 (name, description, place, logo, games, goalsFor, goalsAgainst, points, standingsGroup, descrLat, win, draw, lose) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.name, e.description, e.place, e.logo, e.games, e.goalsFor, e.goalsAgainst, e.points, e.group, e.descrLat, e.win, e.draw, e.lose], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://www.liveresult.ru/football/UEFA-Nations-League/standings?st=0') // unl standings B1
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
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' '),
                win: $(element).find('.score').eq(1).text(),
                draw: $(element).find('.score').eq(2).text(),
                lose: $(element).find('.score').eq(3).text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM unlstandingsb1', (err => {
        if(err) throw err;
    }));

    unlStandingsB1.map((e) => {
        db.query('INSERT INTO unlstandingsb1 (name, description, place, logo, games, goalsFor, goalsAgainst, points, standingsGroup, descrLat, win, draw, lose) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.name, e.description, e.place, e.logo, e.games, e.goalsFor, e.goalsAgainst, e.points, e.group, e.descrLat, e.win, e.draw, e.lose], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://www.liveresult.ru/football/UEFA-Nations-League/standings?st=0') // unl standings B2
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
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' '),
                win: $(element).find('.score').eq(1).text(),
                draw: $(element).find('.score').eq(2).text(),
                lose: $(element).find('.score').eq(3).text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM unlstandingsb2', (err => {
        if(err) throw err;
    }));

    unlStandingsB2.map((e) => {
        db.query('INSERT INTO unlstandingsb2 (name, description, place, logo, games, goalsFor, goalsAgainst, points, standingsGroup, descrLat, win, draw, lose) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.name, e.description, e.place, e.logo, e.games, e.goalsFor, e.goalsAgainst, e.points, e.group, e.descrLat, e.win, e.draw, e.lose], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://www.liveresult.ru/football/UEFA-Nations-League/standings?st=0') // unl standings B3
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
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' '),
                win: $(element).find('.score').eq(1).text(),
                draw: $(element).find('.score').eq(2).text(),
                lose: $(element).find('.score').eq(3).text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM unlstandingsb3', (err => {
        if(err) throw err;
    }));

    unlStandingsB3.map((e) => {
        db.query('INSERT INTO unlstandingsb3 (name, description, place, logo, games, goalsFor, goalsAgainst, points, standingsGroup, descrLat, win, draw, lose) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.name, e.description, e.place, e.logo, e.games, e.goalsFor, e.goalsAgainst, e.points, e.group, e.descrLat, e.win, e.draw, e.lose], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://www.liveresult.ru/football/UEFA-Nations-League/standings?st=0') // unl standings B4
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
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' '),
                win: $(element).find('.score').eq(1).text(),
                draw: $(element).find('.score').eq(2).text(),
                lose: $(element).find('.score').eq(3).text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM unlstandingsb4', (err => {
        if(err) throw err;
    }));

    unlStandingsB4.map((e) => {
        db.query('INSERT INTO unlstandingsb4 (name, description, place, logo, games, goalsFor, goalsAgainst, points, standingsGroup, descrLat, win, draw, lose) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.name, e.description, e.place, e.logo, e.games, e.goalsFor, e.goalsAgainst, e.points, e.group, e.descrLat, e.win, e.draw, e.lose], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://www.liveresult.ru/football/UEFA-Nations-League/standings?st=0') // unl standings C1
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
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' '),
                win: $(element).find('.score').eq(1).text(),
                draw: $(element).find('.score').eq(2).text(),
                lose: $(element).find('.score').eq(3).text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM unlstandingsc1', (err => {
        if(err) throw err;
    }));

    unlStandingsC1.map((e) => {
        db.query('INSERT INTO unlstandingsc1 (name, description, place, logo, games, goalsFor, goalsAgainst, points, standingsGroup, descrLat, win, draw, lose) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.name, e.description, e.place, e.logo, e.games, e.goalsFor, e.goalsAgainst, e.points, e.group, e.descrLat, e.win, e.draw, e.lose], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://www.liveresult.ru/football/UEFA-Nations-League/standings?st=0') // unl standings C2
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
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' '),
                win: $(element).find('.score').eq(1).text(),
                draw: $(element).find('.score').eq(2).text(),
                lose: $(element).find('.score').eq(3).text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM unlstandingsc2', (err => {
        if(err) throw err;
    }));

    unlStandingsC2.map((e) => {
        db.query('INSERT INTO unlstandingsc2 (name, description, place, logo, games, goalsFor, goalsAgainst, points, standingsGroup, descrLat, win, draw, lose) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.name, e.description, e.place, e.logo, e.games, e.goalsFor, e.goalsAgainst, e.points, e.group, e.descrLat, e.win, e.draw, e.lose], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://www.liveresult.ru/football/UEFA-Nations-League/standings?st=0') // unl standings C3
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
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' '),
                win: $(element).find('.score').eq(1).text(),
                draw: $(element).find('.score').eq(2).text(),
                lose: $(element).find('.score').eq(3).text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM unlstandingsc3', (err => {
        if(err) throw err;
    }));

    unlStandingsC3.map((e) => {
        db.query('INSERT INTO unlstandingsc3 (name, description, place, logo, games, goalsFor, goalsAgainst, points, standingsGroup, descrLat, win, draw, lose) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.name, e.description, e.place, e.logo, e.games, e.goalsFor, e.goalsAgainst, e.points, e.group, e.descrLat, e.win, e.draw, e.lose], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://www.liveresult.ru/football/UEFA-Nations-League/standings?st=0') // unl standings C4
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
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' '),
                win: $(element).find('.score').eq(1).text(),
                draw: $(element).find('.score').eq(2).text(),
                lose: $(element).find('.score').eq(3).text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM unlstandingsc4', (err => {
        if(err) throw err;
    }));

    unlStandingsC4.map((e) => {
        db.query('INSERT INTO unlstandingsc4 (name, description, place, logo, games, goalsFor, goalsAgainst, points, standingsGroup, descrLat, win, draw, lose) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.name, e.description, e.place, e.logo, e.games, e.goalsFor, e.goalsAgainst, e.points, e.group, e.descrLat, e.win, e.draw, e.lose], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://www.liveresult.ru/football/UEFA-Nations-League/standings?st=0') // unl standings D1
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
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' '),
                win: $(element).find('.score').eq(1).text(),
                draw: $(element).find('.score').eq(2).text(),
                lose: $(element).find('.score').eq(3).text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM unlstandingsd1', (err => {
        if(err) throw err;
    }));

    unlStandingsD1.map((e) => {
        db.query('INSERT INTO unlstandingsd1 (name, description, place, logo, games, goalsFor, goalsAgainst, points, standingsGroup, descrLat, win, draw, lose) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.name, e.description, e.place, e.logo, e.games, e.goalsFor, e.goalsAgainst, e.points, e.group, e.descrLat, e.win, e.draw, e.lose], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://www.liveresult.ru/football/UEFA-Nations-League/standings?st=0') // unl standings D2
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
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' '),
                win: $(element).find('.score').eq(1).text(),
                draw: $(element).find('.score').eq(2).text(),
                lose: $(element).find('.score').eq(3).text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM unlstandingsd2', (err => {
        if(err) throw err;
    }));

    unlStandingsD2.map((e) => {
        db.query('INSERT INTO unlstandingsd2 (name, description, place, logo, games, goalsFor, goalsAgainst, points, standingsGroup, descrLat, win, draw, lose) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.name, e.description, e.place, e.logo, e.games, e.goalsFor, e.goalsAgainst, e.points, e.group, e.descrLat, e.win, e.draw, e.lose], (err => {
            if(err) throw err;
        }));
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
                win: $(element).find('td:nth-child(4)').text(),
                draw: $(element).find('td:nth-child(5)').text(),
                lose: $(element).find('td:nth-child(6)').text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM euroqualstandingsa', (err => {
        if(err) throw err;
    }));

    euroQualStandingsA.map((e) => {
        db.query('INSERT INTO euroqualstandingsa (name, descrClass, place, logo, games, goalsFor, goalsAgainst, points, standingsGroup, win, draw, lose) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.name, e.descrClass, e.place, e.logo, e.games, e.goalsFor, e.goalsAgainst, e.points, e.group, e.win, e.draw, e.lose], (err => {
            if(err) throw err;
        }));
    });

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
                win: $(element).find('td:nth-child(4)').text(),
                draw: $(element).find('td:nth-child(5)').text(),
                lose: $(element).find('td:nth-child(6)').text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM euroqualstandingsb', (err => {
        if(err) throw err;
    }));

    euroQualStandingsB.map((e) => {
        db.query('INSERT INTO euroqualstandingsb (name, descrClass, place, logo, games, goalsFor, goalsAgainst, points, standingsGroup, win, draw, lose) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.name, e.descrClass, e.place, e.logo, e.games, e.goalsFor, e.goalsAgainst, e.points, e.group, e.win, e.draw, e.lose], (err => {
            if(err) throw err;
        }));
    });

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
                win: $(element).find('td:nth-child(4)').text(),
                draw: $(element).find('td:nth-child(5)').text(),
                lose: $(element).find('td:nth-child(6)').text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM euroqualstandingsc', (err => {
        if(err) throw err;
    }));

    euroQualStandingsC.map((e) => {
        db.query('INSERT INTO euroqualstandingsc (name, descrClass, place, logo, games, goalsFor, goalsAgainst, points, standingsGroup, win, draw, lose) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.name, e.descrClass, e.place, e.logo, e.games, e.goalsFor, e.goalsAgainst, e.points, e.group, e.win, e.draw, e.lose], (err => {
            if(err) throw err;
        }));
    });

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
                win: $(element).find('td:nth-child(4)').text(),
                draw: $(element).find('td:nth-child(5)').text(),
                lose: $(element).find('td:nth-child(6)').text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM euroqualstandingsd', (err => {
        if(err) throw err;
    }));

    euroQualStandingsD.map((e) => {
        db.query('INSERT INTO euroqualstandingsd (name, descrClass, place, logo, games, goalsFor, goalsAgainst, points, standingsGroup, win, draw, lose) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.name, e.descrClass, e.place, e.logo, e.games, e.goalsFor, e.goalsAgainst, e.points, e.group, e.win, e.draw, e.lose], (err => {
            if(err) throw err;
        }));
    });

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
                win: $(element).find('td:nth-child(4)').text(),
                draw: $(element).find('td:nth-child(5)').text(),
                lose: $(element).find('td:nth-child(6)').text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM euroqualstandingse', (err => {
        if(err) throw err;
    }));

    euroQualStandingsE.map((e) => {
        db.query('INSERT INTO euroqualstandingse (name, descrClass, place, logo, games, goalsFor, goalsAgainst, points, standingsGroup, win, draw, lose) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.name, e.descrClass, e.place, e.logo, e.games, e.goalsFor, e.goalsAgainst, e.points, e.group, e.win, e.draw, e.lose], (err => {
            if(err) throw err;
        }));
    });

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
                win: $(element).find('td:nth-child(4)').text(),
                draw: $(element).find('td:nth-child(5)').text(),
                lose: $(element).find('td:nth-child(6)').text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM euroqualstandingsf', (err => {
        if(err) throw err;
    }));

    euroQualStandingsF.map((e) => {
        db.query('INSERT INTO euroqualstandingsf (name, descrClass, place, logo, games, goalsFor, goalsAgainst, points, standingsGroup, win, draw, lose) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.name, e.descrClass, e.place, e.logo, e.games, e.goalsFor, e.goalsAgainst, e.points, e.group, e.win, e.draw, e.lose], (err => {
            if(err) throw err;
        }));
    });

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
                win: $(element).find('td:nth-child(4)').text(),
                draw: $(element).find('td:nth-child(5)').text(),
                lose: $(element).find('td:nth-child(6)').text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM euroqualstandingsg', (err => {
        if(err) throw err;
    }));

    euroQualStandingsG.map((e) => {
        db.query('INSERT INTO euroqualstandingsg (name, descrClass, place, logo, games, goalsFor, goalsAgainst, points, standingsGroup, win, draw, lose) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.name, e.descrClass, e.place, e.logo, e.games, e.goalsFor, e.goalsAgainst, e.points, e.group, e.win, e.draw, e.lose], (err => {
            if(err) throw err;
        }));
    });

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
                win: $(element).find('td:nth-child(4)').text(),
                draw: $(element).find('td:nth-child(5)').text(),
                lose: $(element).find('td:nth-child(6)').text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM euroqualstandingsh', (err => {
        if(err) throw err;
    }));

    euroQualStandingsH.map((e) => {
        db.query('INSERT INTO euroqualstandingsh (name, descrClass, place, logo, games, goalsFor, goalsAgainst, points, standingsGroup, win, draw, lose) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.name, e.descrClass, e.place, e.logo, e.games, e.goalsFor, e.goalsAgainst, e.points, e.group, e.win, e.draw, e.lose], (err => {
            if(err) throw err;
        }));
    });

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
                win: $(element).find('td:nth-child(4)').text(),
                draw: $(element).find('td:nth-child(5)').text(),
                lose: $(element).find('td:nth-child(6)').text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM euroqualstandingsi', (err => {
        if(err) throw err;
    }));

    euroQualStandingsI.map((e) => {
        db.query('INSERT INTO euroqualstandingsi (name, descrClass, place, logo, games, goalsFor, goalsAgainst, points, standingsGroup, win, draw, lose) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.name, e.descrClass, e.place, e.logo, e.games, e.goalsFor, e.goalsAgainst, e.points, e.group, e.win, e.draw, e.lose], (err => {
            if(err) throw err;
        }));
    });

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
                win: $(element).find('td:nth-child(4)').text(),
                draw: $(element).find('td:nth-child(5)').text(),
                lose: $(element).find('td:nth-child(6)').text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM euroqualstandingsj', (err => {
        if(err) throw err;
    }));

    euroQualStandingsJ.map((e) => {
        db.query('INSERT INTO euroqualstandingsj (name, descrClass, place, logo, games, goalsFor, goalsAgainst, points, standingsGroup, win, draw, lose) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.name, e.descrClass, e.place, e.logo, e.games, e.goalsFor, e.goalsAgainst, e.points, e.group, e.win, e.draw, e.lose], (err => {
            if(err) throw err;
        }));
    });

    try {
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

        db.query('DELETE FROM rplts', (err => {
            if(err) throw err;
        }));

        rplTopScores.map((e) => {
            db.query('INSERT INTO rplts (place, img, player, games, goals, pen, tLogo, tName) VALUES(?, ?, ?, ?, ?, ?, ?, ?)', [e.place, e.img, e.player, e.games, e.goals, e.assists, e.tLogo, e.tName], (err => {
                if(err) throw err;
            }));
        });
    }
    catch (err) {
        console.error(err);
    }

    try {
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

        db.query('DELETE FROM eplts', (err => {
            if(err) throw err;
        }));

        eplTopScores.map((e) => {
            db.query('INSERT INTO eplts (place, img, player, games, goals, pen, tLogo, tName) VALUES(?, ?, ?, ?, ?, ?, ?, ?)', [e.place, e.img, e.player, e.games, e.goals, e.assists, e.tLogo, e.tName], (err => {
                if(err) throw err;
            }));
        });
    }
    catch (err) {
        console.error(err);
    }

    try {
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

        db.query('DELETE FROM laligats', (err => {
            if(err) throw err;
        }));

        laligaTopScores.map((e) => {
            db.query('INSERT INTO laligats (place, img, player, games, goals, pen, tLogo, tName) VALUES(?, ?, ?, ?, ?, ?, ?, ?)', [e.place, e.img, e.player, e.games, e.goals, e.assists, e.tLogo, e.tName], (err => {
                if(err) throw err;
            }));
        });
    }
    catch (err) {
        console.error(err);
    }

    try {
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

        db.query('DELETE FROM bundesligats', (err => {
            if(err) throw err;
        }));

        bundesligaTopScores.map((e) => {
            db.query('INSERT INTO bundesligats (place, img, player, games, goals, pen, tLogo, tName) VALUES(?, ?, ?, ?, ?, ?, ?, ?)', [e.place, e.img, e.player, e.games, e.goals, e.assists, e.tLogo, e.tName], (err => {
                if(err) throw err;
            }));
        });
    }
    catch (err) {
        console.error(err);
    }

    try {
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
        
        db.query('DELETE FROM serieats', (err => {
            if(err) throw err;
        }));

        serieaTopScores.map((e) => {
            db.query('INSERT INTO serieats (place, img, player, games, goals, pen, tLogo, tName) VALUES(?, ?, ?, ?, ?, ?, ?, ?)', [e.place, e.img, e.player, e.games, e.goals, e.assists, e.tLogo, e.tName], (err => {
                if(err) throw err;
            }));
        });
    }
    catch (err) {
        console.error(err);
    }

    try {
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

        db.query('DELETE FROM ligue1ts', (err => {
            if(err) throw err;
        }));

        ligue1TopScores.map((e) => {
            db.query('INSERT INTO ligue1ts (place, img, player, games, goals, pen, tLogo, tName) VALUES(?, ?, ?, ?, ?, ?, ?, ?)', [e.place, e.img, e.player, e.games, e.goals, e.assists, e.tLogo, e.tName], (err => {
                if(err) throw err;
            }));
        });
    }
    catch (err) {
        console.error(err);
    }

    try {
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

        db.query('DELETE FROM uclts', (err => {
            if(err) throw err;
        }));

        uclTopScores.map((e) => {
            db.query('INSERT INTO uclts (place, img, player, games, goals, pen, tLogo, tName) VALUES(?, ?, ?, ?, ?, ?, ?, ?)', [e.place, e.img, e.player, e.games, e.goals, e.assists, e.tLogo, e.tName], (err => {
                if(err) throw err;
            }));
        });
    }
    catch (err) {
        console.error(err);
    }

    try {
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

        db.query('DELETE FROM uelts', (err => {
            if(err) throw err;
        }));

        uelTopScores.map((e) => {
            db.query('INSERT INTO uelts (place, img, player, games, goals, pen, tLogo, tName) VALUES(?, ?, ?, ?, ?, ?, ?, ?)', [e.place, e.img, e.player, e.games, e.goals, e.assists, e.tLogo, e.tName], (err => {
                if(err) throw err;
            }));
        });
    }
    catch (err) {
        console.error(err);
    }

    try {
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

        db.query('DELETE FROM ueclts', (err => {
            if(err) throw err;
        }));

        ueclTopScores.map((e) => {
            db.query('INSERT INTO ueclts (place, img, player, games, goals, pen, tLogo, tName) VALUES(?, ?, ?, ?, ?, ?, ?, ?)', [e.place, e.img, e.player, e.games, e.goals, e.assists, e.tLogo, e.tName], (err => {
                if(err) throw err;
            }));
        });
    }
    catch (err) {
        console.error(err);
    }

    try {
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

        db.query('DELETE FROM unlts', (err => {
            if(err) throw err;
        }));

        unlTopScores.map((e) => {
            db.query('INSERT INTO unlts (place, img, player, games, goals, pen, tLogo, tName) VALUES(?, ?, ?, ?, ?, ?, ?, ?)', [e.place, e.img, e.player, e.games, e.goals, e.assists, e.tLogo, e.tName], (err => {
                if(err) throw err;
            }));
        });
    }
    catch (err) {
        console.error(err);
    }

    await axios.get('https://www.championat.com/football/_euro/tournament/5287/statistic/player/bombardir/')
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('body > div.page > div.mc-page.js-main-content > div.mc-page-content.tournament > div.page-content > div > div.js-table-component > table > tbody > tr').each((i, element) => {
            euroQualTopScores.push({
                place: $(element).find('td.table-responsive__row-item._center._hidden-td').text(),
                img: $(element).find('.se19-table-statistics__td--img a img').attr('src'),
                player: $(element).find('td.table-responsive__row-item._player.football._order_1._wm_basis_35._left-padding-cell > a > span.table-item__name').text(),
                games: $(element).find('td.table-responsive__row-item._pstat-game.football._order_3').text(),
                goals: $(element).find('td.table-responsive__row-item._data.football._order_2').text(),
                assists: $(element).find('td.table-responsive__row-item._pen.football._order_6._desktop').text(),
                tLogo: $(element).find('td.table-responsive__row-item._player.football._order_1._wm_basis_35._left-padding-cell > a > span.table-item__flag > img').attr('src'),
                tName: $(element).find('td.table-responsive__row-item._player.football._order_1._wm_basis_35._left-padding-cell > a > span.table-item__flag > img').attr('title')
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM euroqualts', (err => {
        if(err) throw err;
    }));

    euroQualTopScores.map((e) => {
        db.query('INSERT INTO euroqualts (place, img, player, games, goals, pen, tLogo, tName) VALUES(?, ?, ?, ?, ?, ?, ?, ?)', [e.place, e.img, e.player, e.games, e.goals, e.assists, e.tLogo, e.tName], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://soccer365.ru/ranking/fifa/') // fifa ranking
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#result_data > table > tbody > tr').each((i, element) => {
            fifaRanking.push({
                name: $(element).find('td:nth-child(3) > a > span').text(),
                place: $(element).find('td:nth-child(1)').text(),
                difference: $(element).find('td:nth-child(2) > span').text(),
                flag: $(element).find('td:nth-child(3) > a > span').css('background-image').replace(/^url\(['"](.+)['"]\)/, '$1'),
                points: $(element).find('td:nth-child(4) > b').text(),
                pointsDiff: $(element).find('td:nth-child(5)').text(),
                association: $(element).find('td:nth-child(6)').text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM fifaranking', (err => {
        if(err) throw err;
    }));

    fifaRanking.map((e) => {
        db.query('INSERT INTO fifaranking (name, place, difference, flag, points, pointsDiff, association) VALUES(?, ?, ?, ?, ?, ?, ?)', [e.name, e.place, e.difference, e.flag, e.points, e.pointsDiff, e.association], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://soccer365.ru/competitions/13/shedule/') // rpl fixtures
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('.game_block').each((i, element) => {
            rplFixtures.push({
                round: $(element).parent().parent().find('.cmp_stg_ttl').text(),
                hName: $(element).find('a .result .ht .name .img16 span').text(),
                aName: $(element).find('a .result .at .name .img16 span').text(),
                hLogo: $(element).find('a .result .ht .name .img16 img').attr('src'),
                aLogo: $(element).find('a .result .at .name .img16 img').attr('src'),
                hScore: $(element).find('a .result .ht .gls').text(),
                aScore: $(element).find('a .result .at .gls').text(),
                dateTime: $(element).find('a .status span').text() === '' ? $(element).find('a .status').text() : $(element).find('a .status span').text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM rplfixtures', (err => {
        if(err) throw err;
    }));

    rplFixtures.map((e) => {
        db.query('INSERT INTO rplfixtures (round, hName, aName, hLogo, aLogo, hScore, aScore, dateTime) VALUES(?, ?, ?, ?, ?, ?, ?, ?)', [e.round, e.hName, e.aName, e.hLogo, e.aLogo, e.hScore, e.aScore, e.dateTime], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://soccer365.ru/competitions/13/results/') // rpl results
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('.game_block').each((i, element) => {
            rplResults.push({
                round: $(element).parent().parent().find('.cmp_stg_ttl').text(),
                hName: $(element).find('a .result .ht .name .img16 span').text(),
                aName: $(element).find('a .result .at .name .img16 span').text(),
                hLogo: $(element).find('a .result .ht .name .img16 img').attr('src'),
                aLogo: $(element).find('a .result .at .name .img16 img').attr('src'),
                hScore: $(element).find('a .result .ht .gls').text(),
                aScore: $(element).find('a .result .at .gls').text(),
                dateTime: $(element).find('a .status span').text() === '' ? $(element).find('a .status').text() : $(element).find('a .status span').text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM rplresults', (err => {
        if(err) throw err;
    }));

    rplResults.map((e) => {
        db.query('INSERT INTO rplresults (round, hName, aName, hLogo, aLogo, hScore, aScore, dateTime) VALUES(?, ?, ?, ?, ?, ?, ?, ?)', [e.round, e.hName, e.aName, e.hLogo, e.aLogo, e.hScore, e.aScore, e.dateTime], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://soccer365.ru/competitions/13/') // rpl season info
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        rplInfo.push({
            seasonInfo: $('#main_container > div.breadcrumb > div:nth-child(9) > span').text()
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://www.sports.ru/rfpl/') // rpl last winner
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        rplInfo = rplInfo.map((item) => ({ ...item,
            lastWinner: $('#branding-layout > div > div.contentLayout.js-active > div.c-tag-header.tag-main-block > div > div.short-info > table > tbody > tr:nth-child(2) > td > a').text()
        }));
    })
    .catch(err => console.log(err));

    await axios.get('https://ru.wikipedia.org/wiki/%D0%A0%D0%BE%D1%81%D1%81%D0%B8%D0%B9%D1%81%D0%BA%D0%B0%D1%8F_%D0%BF%D1%80%D0%B5%D0%BC%D1%8C%D0%B5%D1%80-%D0%BB%D0%B8%D0%B3%D0%B0') // rpl most winner
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        rplInfo = rplInfo.map((item) => ({ ...item,
            mostWinner: $('#mw-content-text > div.mw-parser-output > table.infobox.infobox-e2da8df976be4920 > tbody > tr:nth-child(12) > td > a').text()
        }));
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM rplinfo', (err => {
        if(err) throw err;
    }));

    rplInfo.map((e) => {
        db.query('INSERT INTO rplinfo (seasonInfo, lastWinner, mostWinner) VALUES(?, ?, ?)', [e.seasonInfo, e.lastWinner, e.mostWinner], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://soccer365.ru/competitions/12/') // epl season info
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        eplInfo.push({
            seasonInfo: $('#main_container > div.breadcrumb > div:nth-child(9) > span').text()
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://www.sports.ru/epl/') // epl last winner
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        eplInfo = eplInfo.map((item) => ({ ...item,
            lastWinner: $('#branding-layout > div > div.contentLayout.js-active > div.c-tag-header.tag-main-block > div > div.short-info > table > tbody > tr:nth-child(2) > td > a').text()
        }));
    })
    .catch(err => console.log(err));

    await axios.get('https://ru.wikipedia.org/wiki/%D0%90%D0%BD%D0%B3%D0%BB%D0%B8%D0%B9%D1%81%D0%BA%D0%B0%D1%8F_%D0%9F%D1%80%D0%B5%D0%BC%D1%8C%D0%B5%D1%80-%D0%BB%D0%B8%D0%B3%D0%B0') // epl most winner
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        eplInfo = eplInfo.map((item) => ({ ...item,
            mostWinner: $('#mw-content-text > div.mw-parser-output > table.infobox.infobox-7ee08c9a5c78c3ed > tbody > tr:nth-child(14) > td > a').text()
        }));
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM eplinfo', (err => {
        if(err) throw err;
    }));

    eplInfo.map((e) => {
        db.query('INSERT INTO eplinfo (seasonInfo, lastWinner, mostWinner) VALUES(?, ?, ?)', [e.seasonInfo, e.lastWinner, e.mostWinner], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://soccer365.ru/competitions/12/shedule/') // epl fixtures
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('.game_block').each((i, element) => {
            eplFixtures.push({
                round: $(element).parent().parent().find('.cmp_stg_ttl').text(),
                hName: $(element).find('a .result .ht .name .img16 span').text(),
                aName: $(element).find('a .result .at .name .img16 span').text(),
                hLogo: $(element).find('a .result .ht .name .img16 img').attr('src'),
                aLogo: $(element).find('a .result .at .name .img16 img').attr('src'),
                hScore: $(element).find('a .result .ht .gls').text(),
                aScore: $(element).find('a .result .at .gls').text(),
                dateTime: $(element).find('a .status span').text() === '' ? $(element).find('a .status').text() : $(element).find('a .status span').text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM eplfixtures', (err => {
        if(err) throw err;
    }));

    eplFixtures.map((e) => {
        db.query('INSERT INTO eplfixtures (round, hName, aName, hLogo, aLogo, hScore, aScore, dateTime) VALUES(?, ?, ?, ?, ?, ?, ?, ?)', [e.round, e.hName, e.aName, e.hLogo, e.aLogo, e.hScore, e.aScore, e.dateTime], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://soccer365.ru/competitions/12/results/') // epl results
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('.game_block').each((i, element) => {
            eplResults.push({
                round: $(element).parent().parent().find('.cmp_stg_ttl').text(),
                hName: $(element).find('a .result .ht .name .img16 span').text(),
                aName: $(element).find('a .result .at .name .img16 span').text(),
                hLogo: $(element).find('a .result .ht .name .img16 img').attr('src'),
                aLogo: $(element).find('a .result .at .name .img16 img').attr('src'),
                hScore: $(element).find('a .result .ht .gls').text(),
                aScore: $(element).find('a .result .at .gls').text(),
                dateTime: $(element).find('a .status span').text() === '' ? $(element).find('a .status').text() : $(element).find('a .status span').text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM eplresults', (err => {
        if(err) throw err;
    }));

    eplResults.map((e) => {
        db.query('INSERT INTO eplresults (round, hName, aName, hLogo, aLogo, hScore, aScore, dateTime) VALUES(?, ?, ?, ?, ?, ?, ?, ?)', [e.round, e.hName, e.aName, e.hLogo, e.aLogo, e.hScore, e.aScore, e.dateTime], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://soccer365.ru/competitions/16/') // laliga season info
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        laligaInfo.push({
            seasonInfo: $('#main_container > div.breadcrumb > div:nth-child(9) > span').text()
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://www.sports.ru/la-liga/') // laliga last winner
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        laligaInfo = laligaInfo.map((item) => ({ ...item,
            lastWinner: $('#branding-layout > div > div.contentLayout.js-active > div.c-tag-header.tag-main-block > div > div.short-info > table > tbody > tr:nth-child(2) > td > a').text()
        }));
    })
    .catch(err => console.log(err));

    await axios.get('https://ru.wikipedia.org/wiki/%D0%A7%D0%B5%D0%BC%D0%BF%D0%B8%D0%BE%D0%BD%D0%B0%D1%82_%D0%98%D1%81%D0%BF%D0%B0%D0%BD%D0%B8%D0%B8_%D0%BF%D0%BE_%D1%84%D1%83%D1%82%D0%B1%D0%BE%D0%BB%D1%83') // laliga most winner
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        laligaInfo = laligaInfo.map((item) => ({ ...item,
            mostWinner: $('#mw-content-text > div.mw-parser-output > table.infobox.infobox-d57b29b3923a079c > tbody > tr:nth-child(13) > td > a').text()
        }));
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM laligainfo', (err => {
        if(err) throw err;
    }));

    laligaInfo.map((e) => {
        db.query('INSERT INTO laligainfo (seasonInfo, lastWinner, mostWinner) VALUES(?, ?, ?)', [e.seasonInfo, e.lastWinner, e.mostWinner], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://soccer365.ru/competitions/16/shedule/') // laliga fixtures
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('.game_block').each((i, element) => {
            laligaFixtures.push({
                round: $(element).parent().parent().find('.cmp_stg_ttl').text(),
                hName: $(element).find('a .result .ht .name .img16 span').text(),
                aName: $(element).find('a .result .at .name .img16 span').text(),
                hLogo: $(element).find('a .result .ht .name .img16 img').attr('src'),
                aLogo: $(element).find('a .result .at .name .img16 img').attr('src'),
                hScore: $(element).find('a .result .ht .gls').text(),
                aScore: $(element).find('a .result .at .gls').text(),
                dateTime: $(element).find('a .status span').text() === '' ? $(element).find('a .status').text() : $(element).find('a .status span').text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM laligafixtures', (err => {
        if(err) throw err;
    }));

    laligaFixtures.map((e) => {
        db.query('INSERT INTO laligafixtures (round, hName, aName, hLogo, aLogo, hScore, aScore, dateTime) VALUES(?, ?, ?, ?, ?, ?, ?, ?)', [e.round, e.hName, e.aName, e.hLogo, e.aLogo, e.hScore, e.aScore, e.dateTime], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://soccer365.ru/competitions/16/results/') // laliga results
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('.game_block').each((i, element) => {
            laligaResults.push({
                round: $(element).parent().parent().find('.cmp_stg_ttl').text(),
                hName: $(element).find('a .result .ht .name .img16 span').text(),
                aName: $(element).find('a .result .at .name .img16 span').text(),
                hLogo: $(element).find('a .result .ht .name .img16 img').attr('src'),
                aLogo: $(element).find('a .result .at .name .img16 img').attr('src'),
                hScore: $(element).find('a .result .ht .gls').text(),
                aScore: $(element).find('a .result .at .gls').text(),
                dateTime: $(element).find('a .status span').text() === '' ? $(element).find('a .status').text() : $(element).find('a .status span').text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM laligaresults', (err => {
        if(err) throw err;
    }));

    laligaResults.map((e) => {
        db.query('INSERT INTO laligaresults (round, hName, aName, hLogo, aLogo, hScore, aScore, dateTime) VALUES(?, ?, ?, ?, ?, ?, ?, ?)', [e.round, e.hName, e.aName, e.hLogo, e.aLogo, e.hScore, e.aScore, e.dateTime], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://soccer365.ru/competitions/15/') // seriea season info
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        serieaInfo.push({
            seasonInfo: $('#main_container > div.breadcrumb > div:nth-child(9) > span').text()
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://www.sports.ru/seria-a/') // seriea last winner
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        serieaInfo = serieaInfo.map((item) => ({ ...item,
            lastWinner: $('#branding-layout > div > div.contentLayout.js-active > div.c-tag-header.tag-main-block > div > div.short-info > table > tbody > tr:nth-child(2) > td > a').text()
        }));
    })
    .catch(err => console.log(err));

    await axios.get('https://ru.wikipedia.org/wiki/%D0%A7%D0%B5%D0%BC%D0%BF%D0%B8%D0%BE%D0%BD%D0%B0%D1%82_%D0%98%D1%82%D0%B0%D0%BB%D0%B8%D0%B8_%D0%BF%D0%BE_%D1%84%D1%83%D1%82%D0%B1%D0%BE%D0%BB%D1%83_(%D0%A1%D0%B5%D1%80%D0%B8%D1%8F_A)') // seriea most winner
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        serieaInfo = serieaInfo.map((item) => ({ ...item,
            mostWinner: $('#mw-content-text > div.mw-parser-output > table.infobox.infobox-74cb2b48a3f6d385 > tbody > tr:nth-child(13) > td > a').text()
        }));
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM serieainfo', (err => {
        if(err) throw err;
    }));

    serieaInfo.map((e) => {
        db.query('INSERT INTO serieainfo (seasonInfo, lastWinner, mostWinner) VALUES(?, ?, ?)', [e.seasonInfo, e.lastWinner, e.mostWinner], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://soccer365.ru/competitions/15/shedule/') // seriea fixtures
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('.game_block').each((i, element) => {
            serieaFixtures.push({
                round: $(element).parent().parent().find('.cmp_stg_ttl').text(),
                hName: $(element).find('a .result .ht .name .img16 span').text(),
                aName: $(element).find('a .result .at .name .img16 span').text(),
                hLogo: $(element).find('a .result .ht .name .img16 img').attr('src'),
                aLogo: $(element).find('a .result .at .name .img16 img').attr('src'),
                hScore: $(element).find('a .result .ht .gls').text(),
                aScore: $(element).find('a .result .at .gls').text(),
                dateTime: $(element).find('a .status span').text() === '' ? $(element).find('a .status').text() : $(element).find('a .status span').text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM serieafixtures', (err => {
        if(err) throw err;
    }));

    serieaFixtures.map((e) => {
        db.query('INSERT INTO serieafixtures (round, hName, aName, hLogo, aLogo, hScore, aScore, dateTime) VALUES(?, ?, ?, ?, ?, ?, ?, ?)', [e.round, e.hName, e.aName, e.hLogo, e.aLogo, e.hScore, e.aScore, e.dateTime], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://soccer365.ru/competitions/15/results/') // seriea results
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('.game_block').each((i, element) => {
            serieaResults.push({
                round: $(element).parent().parent().find('.cmp_stg_ttl').text(),
                hName: $(element).find('a .result .ht .name .img16 span').text(),
                aName: $(element).find('a .result .at .name .img16 span').text(),
                hLogo: $(element).find('a .result .ht .name .img16 img').attr('src'),
                aLogo: $(element).find('a .result .at .name .img16 img').attr('src'),
                hScore: $(element).find('a .result .ht .gls').text(),
                aScore: $(element).find('a .result .at .gls').text(),
                dateTime: $(element).find('a .status span').text() === '' ? $(element).find('a .status').text() : $(element).find('a .status span').text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM seriearesults', (err => {
        if(err) throw err;
    }));

    serieaResults.map((e) => {
        db.query('INSERT INTO seriearesults (round, hName, aName, hLogo, aLogo, hScore, aScore, dateTime) VALUES(?, ?, ?, ?, ?, ?, ?, ?)', [e.round, e.hName, e.aName, e.hLogo, e.aLogo, e.hScore, e.aScore, e.dateTime], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://soccer365.ru/competitions/17/') // bundesliga season info
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        bundesligaInfo.push({
            seasonInfo: $('#main_container > div.breadcrumb > div:nth-child(9) > span').text()
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://www.sports.ru/bundesliga/') // bundesliga last winner
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        bundesligaInfo = bundesligaInfo.map((item) => ({ ...item,
            lastWinner: $('#branding-layout > div > div.contentLayout.js-active > div.c-tag-header.tag-main-block > div > div.short-info > table > tbody > tr:nth-child(2) > td > a').text()
        }));
    })
    .catch(err => console.log(err));

    await axios.get('https://ru.wikipedia.org/wiki/%D0%A7%D0%B5%D0%BC%D0%BF%D0%B8%D0%BE%D0%BD%D0%B0%D1%82_%D0%93%D0%B5%D1%80%D0%BC%D0%B0%D0%BD%D0%B8%D0%B8_%D0%BF%D0%BE_%D1%84%D1%83%D1%82%D0%B1%D0%BE%D0%BB%D1%83') // bundesliga most winner
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        bundesligaInfo = bundesligaInfo.map((item) => ({ ...item,
            mostWinner: $('#mw-content-text > div.mw-parser-output > table.infobox.infobox-c4cf1e9f425e2c0e > tbody > tr:nth-child(13) > td > a').text()
        }));
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM bundesligainfo', (err => {
        if(err) throw err;
    }));

    bundesligaInfo.map((e) => {
        db.query('INSERT INTO bundesligainfo (seasonInfo, lastWinner, mostWinner) VALUES(?, ?, ?)', [e.seasonInfo, e.lastWinner, e.mostWinner], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://soccer365.ru/competitions/17/shedule/') // bundesliga fixtures
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('.game_block').each((i, element) => {
            bundesligaFixtures.push({
                round: $(element).parent().parent().find('.cmp_stg_ttl').text(),
                hName: $(element).find('a .result .ht .name .img16 span').text(),
                aName: $(element).find('a .result .at .name .img16 span').text(),
                hLogo: $(element).find('a .result .ht .name .img16 img').attr('src'),
                aLogo: $(element).find('a .result .at .name .img16 img').attr('src'),
                hScore: $(element).find('a .result .ht .gls').text(),
                aScore: $(element).find('a .result .at .gls').text(),
                dateTime: $(element).find('a .status span').text() === '' ? $(element).find('a .status').text() : $(element).find('a .status span').text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM bundesligafixtures', (err => {
        if(err) throw err;
    }));

    bundesligaFixtures.map((e) => {
        db.query('INSERT INTO bundesligafixtures (round, hName, aName, hLogo, aLogo, hScore, aScore, dateTime) VALUES(?, ?, ?, ?, ?, ?, ?, ?)', [e.round, e.hName, e.aName, e.hLogo, e.aLogo, e.hScore, e.aScore, e.dateTime], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://soccer365.ru/competitions/17/results/') // bundesliga results
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('.game_block').each((i, element) => {
            bundesligaResults.push({
                round: $(element).parent().parent().find('.cmp_stg_ttl').text(),
                hName: $(element).find('a .result .ht .name .img16 span').text(),
                aName: $(element).find('a .result .at .name .img16 span').text(),
                hLogo: $(element).find('a .result .ht .name .img16 img').attr('src'),
                aLogo: $(element).find('a .result .at .name .img16 img').attr('src'),
                hScore: $(element).find('a .result .ht .gls').text(),
                aScore: $(element).find('a .result .at .gls').text(),
                dateTime: $(element).find('a .status span').text() === '' ? $(element).find('a .status').text() : $(element).find('a .status span').text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM bundesligaresults', (err => {
        if(err) throw err;
    }));

    bundesligaResults.map((e) => {
        db.query('INSERT INTO bundesligaresults (round, hName, aName, hLogo, aLogo, hScore, aScore, dateTime) VALUES(?, ?, ?, ?, ?, ?, ?, ?)', [e.round, e.hName, e.aName, e.hLogo, e.aLogo, e.hScore, e.aScore, e.dateTime], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://soccer365.ru/competitions/18/') // ligue1 season info
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        ligue1Info.push({
            seasonInfo: $('#main_container > div.breadcrumb > div:nth-child(9) > span').text()
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://www.sports.ru/ligue-1/') // ligue1 last winner
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        ligue1Info = ligue1Info.map((item) => ({ ...item,
            lastWinner: $('#branding-layout > div > div.contentLayout.js-active > div.c-tag-header.tag-main-block > div > div.short-info > table > tbody > tr:nth-child(2) > td > a').text()
        }));
    })
    .catch(err => console.log(err));

    await axios.get('https://ru.wikipedia.org/wiki/%D0%A7%D0%B5%D0%BC%D0%BF%D0%B8%D0%BE%D0%BD%D0%B0%D1%82_%D0%A4%D1%80%D0%B0%D0%BD%D1%86%D0%B8%D0%B8_%D0%BF%D0%BE_%D1%84%D1%83%D1%82%D0%B1%D0%BE%D0%BB%D1%83') // ligue1 most winner
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        ligue1Info = ligue1Info.map((item) => ({ ...item,
            mostWinner: $('#mw-content-text > div.mw-parser-output > table.infobox.infobox-5112ef9b042787db > tbody > tr:nth-child(13) > td > a').text()
        }));
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM ligue1info', (err => {
        if(err) throw err;
    }));

    ligue1Info.map((e) => {
        db.query('INSERT INTO ligue1info (seasonInfo, lastWinner, mostWinner) VALUES(?, ?, ?)', [e.seasonInfo, e.lastWinner, e.mostWinner], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://soccer365.ru/competitions/18/shedule/') // ligue1 fixtures
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('.game_block').each((i, element) => {
            ligue1Fixtures.push({
                round: $(element).parent().parent().find('.cmp_stg_ttl').text(),
                hName: $(element).find('a .result .ht .name .img16 span').text(),
                aName: $(element).find('a .result .at .name .img16 span').text(),
                hLogo: $(element).find('a .result .ht .name .img16 img').attr('src'),
                aLogo: $(element).find('a .result .at .name .img16 img').attr('src'),
                hScore: $(element).find('a .result .ht .gls').text(),
                aScore: $(element).find('a .result .at .gls').text(),
                dateTime: $(element).find('a .status span').text() === '' ? $(element).find('a .status').text() : $(element).find('a .status span').text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM ligue1fixtures', (err => {
        if(err) throw err;
    }));

    ligue1Fixtures.map((e) => {
        db.query('INSERT INTO ligue1fixtures (round, hName, aName, hLogo, aLogo, hScore, aScore, dateTime) VALUES(?, ?, ?, ?, ?, ?, ?, ?)', [e.round, e.hName, e.aName, e.hLogo, e.aLogo, e.hScore, e.aScore, e.dateTime], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://soccer365.ru/competitions/18/results/') // ligue1 results
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('.game_block').each((i, element) => {
            ligue1Results.push({
                round: $(element).parent().parent().find('.cmp_stg_ttl').text(),
                hName: $(element).find('a .result .ht .name .img16 span').text(),
                aName: $(element).find('a .result .at .name .img16 span').text(),
                hLogo: $(element).find('a .result .ht .name .img16 img').attr('src'),
                aLogo: $(element).find('a .result .at .name .img16 img').attr('src'),
                hScore: $(element).find('a .result .ht .gls').text(),
                aScore: $(element).find('a .result .at .gls').text(),
                dateTime: $(element).find('a .status span').text() === '' ? $(element).find('a .status').text() : $(element).find('a .status span').text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM ligue1results', (err => {
        if(err) throw err;
    }));

    ligue1Results.map((e) => {
        db.query('INSERT INTO ligue1results (round, hName, aName, hLogo, aLogo, hScore, aScore, dateTime) VALUES(?, ?, ?, ?, ?, ?, ?, ?)', [e.round, e.hName, e.aName, e.hLogo, e.aLogo, e.hScore, e.aScore, e.dateTime], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://soccer365.ru/competitions/19/') // ucl season info
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        uclInfo.push({
            seasonInfo: $('#main_container > div.breadcrumb > div:nth-child(8) > span').text()
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://www.sports.ru/ucl/') // ucl last winner
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        uclInfo = uclInfo.map((item) => ({ ...item,
            lastWinner: $('#branding-layout > div > div.contentLayout.js-active > div.c-tag-header.tag-main-block > div > div.short-info > table > tbody > tr:nth-child(2) > td > a').text()
        }));
    })
    .catch(err => console.log(err));

    await axios.get('https://ru.wikipedia.org/wiki/%D0%9B%D0%B8%D0%B3%D0%B0_%D1%87%D0%B5%D0%BC%D0%BF%D0%B8%D0%BE%D0%BD%D0%BE%D0%B2_%D0%A3%D0%95%D0%A4%D0%90') // ucl most winner
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        uclInfo = uclInfo.map((item) => ({ ...item,
            mostWinner: $('#mw-content-text > div.mw-parser-output > table.infobox.infobox-b0df1c23385bf4f9.vcard > tbody > tr:nth-child(11) > td > a').text()
        }));
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM uclinfo', (err => {
        if(err) throw err;
    }));

    uclInfo.map((e) => {
        db.query('INSERT INTO uclinfo (seasonInfo, lastWinner, mostWinner) VALUES(?, ?, ?)', [e.seasonInfo, e.lastWinner, e.mostWinner], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://soccer365.ru/competitions/19/shedule/') // ucl fixtures
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('.game_block').each((i, element) => {
            uclFixtures.push({
                round: $(element).parent().parent().find('.cmp_stg_ttl').text(),
                hName: $(element).find('a .result .ht .name .img16 span').text(),
                aName: $(element).find('a .result .at .name .img16 span').text(),
                hLogo: $(element).find('a .result .ht .name .img16 img').attr('src'),
                aLogo: $(element).find('a .result .at .name .img16 img').attr('src'),
                hScore: $(element).find('a .result .ht .gls').text(),
                aScore: $(element).find('a .result .at .gls').text(),
                dateTime: $(element).find('a .status span').text() === '' ? $(element).find('a .status').text() : $(element).find('a .status span').text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM uclfixtures', (err => {
        if(err) throw err;
    }));

    uclFixtures.map((e) => {
        db.query('INSERT INTO uclfixtures (round, hName, aName, hLogo, aLogo, hScore, aScore, dateTime) VALUES(?, ?, ?, ?, ?, ?, ?, ?)', [e.round, e.hName, e.aName, e.hLogo, e.aLogo, e.hScore, e.aScore, e.dateTime], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://soccer365.ru/competitions/19/results/') // ucl results
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('.game_block').each((i, element) => {
            uclResults.push({
                round: $(element).parent().parent().find('.cmp_stg_ttl').text(),
                hName: $(element).find('a .result .ht .name .img16 span').text(),
                aName: $(element).find('a .result .at .name .img16 span').text(),
                hLogo: $(element).find('a .result .ht .name .img16 img').attr('src'),
                aLogo: $(element).find('a .result .at .name .img16 img').attr('src'),
                hScore: $(element).find('a .result .ht .gls').text(),
                aScore: $(element).find('a .result .at .gls').text(),
                dateTime: $(element).find('a .status span').text() === '' ? $(element).find('a .status').text() : $(element).find('a .status span').text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM uclresults', (err => {
        if(err) throw err;
    }));

    uclResults.map((e) => {
        db.query('INSERT INTO uclresults (round, hName, aName, hLogo, aLogo, hScore, aScore, dateTime) VALUES(?, ?, ?, ?, ?, ?, ?, ?)', [e.round, e.hName, e.aName, e.hLogo, e.aLogo, e.hScore, e.aScore, e.dateTime], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://soccer365.ru/competitions/20/') // uel season info
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        uelInfo.push({
            seasonInfo: $('#main_container > div.breadcrumb > div:nth-child(8) > span').text()
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://www.sports.ru/liga-europa/') // uel last winner
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        uelInfo = uelInfo.map((item) => ({ ...item,
            lastWinner: $('#branding-layout > div > div.contentLayout.js-active > div.c-tag-header.tag-main-block > div > div.short-info > table > tbody > tr:nth-child(2) > td > a').text()
        }));
    })
    .catch(err => console.log(err));

    await axios.get('https://ru.wikipedia.org/wiki/%D0%9B%D0%B8%D0%B3%D0%B0_%D0%95%D0%B2%D1%80%D0%BE%D0%BF%D1%8B_%D0%A3%D0%95%D0%A4%D0%90') // uel most winner
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        uelInfo = uelInfo.map((item) => ({ ...item,
            mostWinner: $('#mw-content-text > div.mw-parser-output > table.infobox.infobox-c7a44ef645d1233b.vcard > tbody > tr:nth-child(10) > td > a').text()
        }));
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM uelinfo', (err => {
        if(err) throw err;
    }));

    uelInfo.map((e) => {
        db.query('INSERT INTO uelinfo (seasonInfo, lastWinner, mostWinner) VALUES(?, ?, ?)', [e.seasonInfo, e.lastWinner, e.mostWinner], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://soccer365.ru/competitions/20/shedule/') // uel fixtures
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('.game_block').each((i, element) => {
            uelFixtures.push({
                round: $(element).parent().parent().find('.cmp_stg_ttl').text(),
                hName: $(element).find('a .result .ht .name .img16 span').text(),
                aName: $(element).find('a .result .at .name .img16 span').text(),
                hLogo: $(element).find('a .result .ht .name .img16 img').attr('src'),
                aLogo: $(element).find('a .result .at .name .img16 img').attr('src'),
                hScore: $(element).find('a .result .ht .gls').text(),
                aScore: $(element).find('a .result .at .gls').text(),
                dateTime: $(element).find('a .status span').text() === '' ? $(element).find('a .status').text() : $(element).find('a .status span').text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM uelfixtures', (err => {
        if(err) throw err;
    }));

    uelFixtures.map((e) => {
        db.query('INSERT INTO uelfixtures (round, hName, aName, hLogo, aLogo, hScore, aScore, dateTime) VALUES(?, ?, ?, ?, ?, ?, ?, ?)', [e.round, e.hName, e.aName, e.hLogo, e.aLogo, e.hScore, e.aScore, e.dateTime], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://soccer365.ru/competitions/20/results/') // uel results
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('.game_block').each((i, element) => {
            uelResults.push({
                round: $(element).parent().parent().find('.cmp_stg_ttl').text(),
                hName: $(element).find('a .result .ht .name .img16 span').text(),
                aName: $(element).find('a .result .at .name .img16 span').text(),
                hLogo: $(element).find('a .result .ht .name .img16 img').attr('src'),
                aLogo: $(element).find('a .result .at .name .img16 img').attr('src'),
                hScore: $(element).find('a .result .ht .gls').text(),
                aScore: $(element).find('a .result .at .gls').text(),
                dateTime: $(element).find('a .status span').text() === '' ? $(element).find('a .status').text() : $(element).find('a .status span').text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM uelresults', (err => {
        if(err) throw err;
    }));

    uelResults.map((e) => {
        db.query('INSERT INTO uelresults (round, hName, aName, hLogo, aLogo, hScore, aScore, dateTime) VALUES(?, ?, ?, ?, ?, ?, ?, ?)', [e.round, e.hName, e.aName, e.hLogo, e.aLogo, e.hScore, e.aScore, e.dateTime], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://soccer365.ru/competitions/2032/') // uecl season info
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        ueclInfo.push({
            seasonInfo: $('#main_container > div.breadcrumb > div:nth-child(8) > span').text()
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://www.sports.ru/uecl/') // uecl last winner
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        ueclInfo = ueclInfo.map((item) => ({ ...item,
            lastWinner: $('#branding-layout > div > div.contentLayout.js-active > div.c-tag-header.tag-main-block > div > div.short-info > table > tbody > tr:nth-child(2) > td > a').text()
        }));
    })
    .catch(err => console.log(err));

    await axios.get('https://ru.wikipedia.org/wiki/%D0%9B%D0%B8%D0%B3%D0%B0_%D0%BA%D0%BE%D0%BD%D1%84%D0%B5%D1%80%D0%B5%D0%BD%D1%86%D0%B8%D0%B9_%D0%A3%D0%95%D0%A4%D0%90') // uecl most winner
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        ueclInfo = ueclInfo.map((item) => ({ ...item,
            mostWinner: $('#mw-content-text > div.mw-parser-output > table.infobox.infobox-3cdf4dcef1db6aa2.vcard > tbody > tr:nth-child(10) > td > a:last-child').text()
        }));
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM ueclinfo', (err => {
        if(err) throw err;
    }));

    ueclInfo.map((e) => {
        db.query('INSERT INTO ueclinfo (seasonInfo, lastWinner, mostWinner) VALUES(?, ?, ?)', [e.seasonInfo, e.lastWinner, e.mostWinner], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://soccer365.ru/competitions/2032/shedule/') // uecl fixtures
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('.game_block').each((i, element) => {
            ueclFixtures.push({
                round: $(element).parent().parent().find('.cmp_stg_ttl').text(),
                hName: $(element).find('a .result .ht .name .img16 span').text(),
                aName: $(element).find('a .result .at .name .img16 span').text(),
                hLogo: $(element).find('a .result .ht .name .img16 img').attr('src'),
                aLogo: $(element).find('a .result .at .name .img16 img').attr('src'),
                hScore: $(element).find('a .result .ht .gls').text(),
                aScore: $(element).find('a .result .at .gls').text(),
                dateTime: $(element).find('a .status span').text() === '' ? $(element).find('a .status').text() : $(element).find('a .status span').text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM ueclfixtures', (err => {
        if(err) throw err;
    }));

    ueclFixtures.map((e) => {
        db.query('INSERT INTO ueclfixtures (round, hName, aName, hLogo, aLogo, hScore, aScore, dateTime) VALUES(?, ?, ?, ?, ?, ?, ?, ?)', [e.round, e.hName, e.aName, e.hLogo, e.aLogo, e.hScore, e.aScore, e.dateTime], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://soccer365.ru/competitions/2032/results/') // uecl results
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('.game_block').each((i, element) => {
            ueclResults.push({
                round: $(element).parent().parent().find('.cmp_stg_ttl').text(),
                hName: $(element).find('a .result .ht .name .img16 span').text(),
                aName: $(element).find('a .result .at .name .img16 span').text(),
                hLogo: $(element).find('a .result .ht .name .img16 img').attr('src'),
                aLogo: $(element).find('a .result .at .name .img16 img').attr('src'),
                hScore: $(element).find('a .result .ht .gls').text(),
                aScore: $(element).find('a .result .at .gls').text(),
                dateTime: $(element).find('a .status span').text() === '' ? $(element).find('a .status').text() : $(element).find('a .status span').text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM ueclresults', (err => {
        if(err) throw err;
    }));

    ueclResults.map((e) => {
        db.query('INSERT INTO ueclresults (round, hName, aName, hLogo, aLogo, hScore, aScore, dateTime) VALUES(?, ?, ?, ?, ?, ?, ?, ?)', [e.round, e.hName, e.aName, e.hLogo, e.aLogo, e.hScore, e.aScore, e.dateTime], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://soccer365.ru/competitions/24/&cmp=1253') // euro qual season info
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        euQualInfo.push({
            seasonInfo: $('#main_container > div.breadcrumb > div:nth-child(10) > span').text()
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM euqualinfo', (err => {
        if(err) throw err;
    }));

    euQualInfo.map((e) => {
        db.query('INSERT INTO euqualinfo (seasonInfo) VALUES(?)', [e.seasonInfo], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://soccer365.ru/competitions/24/shedule/&cmp=1253') // euro qual fixtures
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('.game_block').each((i, element) => {
            euQualFixtures.push({
                round: $(element).parent().parent().find('.cmp_stg_ttl').text(),
                hName: $(element).find('a .result .ht .name .img16 span').text(),
                aName: $(element).find('a .result .at .name .img16 span').text(),
                hLogo: $(element).find('a .result .ht .name .img16 img').attr('src'),
                aLogo: $(element).find('a .result .at .name .img16 img').attr('src'),
                hScore: $(element).find('a .result .ht .gls').text(),
                aScore: $(element).find('a .result .at .gls').text(),
                dateTime: $(element).find('a .status span').text() === '' ? $(element).find('a .status').text() : $(element).find('a .status span').text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM euqualfixtures', (err => {
        if(err) throw err;
    }));

    euQualFixtures.map((e) => {
        db.query('INSERT INTO euqualfixtures (round, hName, aName, hLogo, aLogo, hScore, aScore, dateTime) VALUES(?, ?, ?, ?, ?, ?, ?, ?)', [e.round, e.hName, e.aName, e.hLogo, e.aLogo, e.hScore, e.aScore, e.dateTime], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://soccer365.ru/competitions/24/results/&cmp=1253') // euro qual results
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('.game_block').each((i, element) => {
            euQualResults.push({
                round: $(element).parent().parent().find('.cmp_stg_ttl').text(),
                hName: $(element).find('a .result .ht .name .img16 span').text(),
                aName: $(element).find('a .result .at .name .img16 span').text(),
                hLogo: $(element).find('a .result .ht .name .img16 img').attr('src'),
                aLogo: $(element).find('a .result .at .name .img16 img').attr('src'),
                hScore: $(element).find('a .result .ht .gls').text(),
                aScore: $(element).find('a .result .at .gls').text(),
                dateTime: $(element).find('a .status span').text() === '' ? $(element).find('a .status').text() : $(element).find('a .status span').text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM euqualresults', (err => {
        if(err) throw err;
    }));

    euQualResults.map((e) => {
        db.query('INSERT INTO euQualresults (round, hName, aName, hLogo, aLogo, hScore, aScore, dateTime) VALUES(?, ?, ?, ?, ?, ?, ?, ?)', [e.round, e.hName, e.aName, e.hLogo, e.aLogo, e.hScore, e.aScore, e.dateTime], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://soccer365.ru/competitions/1658/') // unl season info
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        unlInfo.push({
            seasonInfo: $('#main_container > div.breadcrumb > div:nth-child(10) > span').text()
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://www.sports.ru/nations-league/') // unl last winner
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        unlInfo = unlInfo.map((item) => ({ ...item,
            lastWinner: $('#branding-layout > div > div.contentLayout.js-active > div.c-tag-header.tag-main-block > div > div.short-info > table > tbody > tr:nth-child(2) > td > a').text()
        }));
    })
    .catch(err => console.log(err));

    await axios.get('https://ru.wikipedia.org/wiki/%D0%9B%D0%B8%D0%B3%D0%B0_%D0%BD%D0%B0%D1%86%D0%B8%D0%B9_%D0%A3%D0%95%D0%A4%D0%90') // unl most winner
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        unlInfo = unlInfo.map((item) => ({ ...item,
            mostWinner: $('#mw-content-text > div.mw-parser-output > table.infobox.infobox-95f48d5a7d418b2d.vcard > tbody > tr:nth-child(9) > td > a:nth-child(2)').text()
        }));
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM unlinfo', (err => {
        if(err) throw err;
    }));

    unlInfo.map((e) => {
        db.query('INSERT INTO unlinfo (seasonInfo, lastWinner, mostWinner) VALUES(?, ?, ?)', [e.seasonInfo, e.lastWinner, e.mostWinner], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://soccer365.ru/competitions/1658/shedule/') // unl qual fixtures
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('.game_block').each((i, element) => {
            unlFixtures.push({
                round: $(element).parent().parent().find('.cmp_stg_ttl').text(),
                hName: $(element).find('a .result .ht .name .img16 span').text(),
                aName: $(element).find('a .result .at .name .img16 span').text(),
                hLogo: $(element).find('a .result .ht .name .img16 img').attr('src'),
                aLogo: $(element).find('a .result .at .name .img16 img').attr('src'),
                hScore: $(element).find('a .result .ht .gls').text(),
                aScore: $(element).find('a .result .at .gls').text(),
                dateTime: $(element).find('a .status span').text() === '' ? $(element).find('a .status').text() : $(element).find('a .status span').text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM unlfixtures', (err => {
        if(err) throw err;
    }));

    unlFixtures.map((e) => {
        db.query('INSERT INTO unlfixtures (round, hName, aName, hLogo, aLogo, hScore, aScore, dateTime) VALUES(?, ?, ?, ?, ?, ?, ?, ?)', [e.round, e.hName, e.aName, e.hLogo, e.aLogo, e.hScore, e.aScore, e.dateTime], (err => {
            if(err) throw err;
        }));
    });

    await axios.get('https://soccer365.ru/competitions/1658/results/') // unl qual results
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('.game_block').each((i, element) => {
            unlResults.push({
                round: $(element).parent().parent().find('.cmp_stg_ttl').text(),
                hName: $(element).find('a .result .ht .name .img16 span').text(),
                aName: $(element).find('a .result .at .name .img16 span').text(),
                hLogo: $(element).find('a .result .ht .name .img16 img').attr('src'),
                aLogo: $(element).find('a .result .at .name .img16 img').attr('src'),
                hScore: $(element).find('a .result .ht .gls').text(),
                aScore: $(element).find('a .result .at .gls').text(),
                dateTime: $(element).find('a .status span').text() === '' ? $(element).find('a .status').text() : $(element).find('a .status span').text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM unlresults', (err => {
        if(err) throw err;
    }));

    unlResults.map((e) => {
        db.query('INSERT INTO unlresults (round, hName, aName, hLogo, aLogo, hScore, aScore, dateTime) VALUES(?, ?, ?, ?, ?, ?, ?, ?)', [e.round, e.hName, e.aName, e.hLogo, e.aLogo, e.hScore, e.aScore, e.dateTime], (err => {
            if(err) throw err;
        }));
    });

    return true;
}

parsing();

setInterval(() => {
    liveParsing();
    liveMatches.splice(0, liveMatches.length);
    liveMatchesLinks.splice(0, liveMatchesLinks.length);
    liveMatchesLeagueNameRoundDate.splice(0, liveMatchesLeagueNameRoundDate.length);
}, 60000);

setInterval(() => {
    parsing();
    endedMatches.splice(0, endedMatches.length);
    uefaCountryRank.splice(0, uefaCountryRank.length);
    uefaCountryRankSeason.splice(0, uefaCountryRankSeason.length);
    transferList.splice(0, transferList.length);
    transferListRpl.splice(0, transferListRpl.length);
    transferListEpl.splice(0, transferListEpl.length);
    transferListLaliga.splice(0, transferListLaliga.length);
    transferListBundesliga.splice(0, transferListBundesliga.length);
    transferListLigue1.splice(0,transferListLigue1.length);
    rplStandings.splice(0, rplStandings.length);
    eplStandings.splice(0, eplStandings.length);
    laligaStandings.splice(0, laligaStandings.length);
    bundesligaStandings.splice(0, bundesligaStandings.length);
    serieaStandings.splice(0, serieaStandings.length);
    ligue1Standings.splice(0, ligue1Standings.length);
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
    forecasts.splice(0, forecasts.length);
    matchesSchedule.splice(0, matchesSchedule.length);
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
    euroQualTopScores.splice(0, euroQualTopScores.length);
    rplFixtures.splice(0, rplFixtures.length);
    fifaRanking.splice(0, fifaRanking.length);
    rplResults.splice(0, rplResults.length);
    rplInfo.splice(0, rplInfo.length);
    eplInfo.splice(0, eplInfo.length);
    eplFixtures.splice(0, eplFixtures.length);
    eplResults.splice(0, eplResults.length);
    laligaInfo.splice(0,laligaInfo.length);
    laligaFixtures.splice(0, laligaFixtures.length);
    laligaResults.splice(0, laligaResults.length);
    serieaInfo.splice(0,serieaInfo.length);
    serieaFixtures.splice(0, serieaFixtures.length);
    serieaResults.splice(0, serieaResults.length);
    bundesligaInfo.splice(0,bundesligaInfo.length);
    bundesligaFixtures.splice(0, bundesligaFixtures.length);
    bundesligaResults.splice(0, bundesligaResults.length);
    ligue1Info.splice(0,ligue1Info.length);
    ligue1Fixtures.splice(0, ligue1Fixtures.length);
    ligue1Results.splice(0, ligue1Results.length);
    uclInfo.splice(0, uclInfo.length);
    uclFixtures.splice(0, uclFixtures.length);
    uclResults.splice(0, uclResults.length);
    uelInfo.splice(0, uelInfo.length);
    uelFixtures.splice(0, uelFixtures.length);
    uelResults.splice(0, uelResults.length);
    ueclInfo.splice(0, ueclInfo.length);
    ueclFixtures.splice(0, ueclFixtures.length);
    ueclResults.splice(0, ueclResults.length);
    euQualInfo.splice(0, euQualInfo.length);
    euQualFixtures.splice(0, euQualFixtures.length);
    euQualResults.splice(0, euQualResults.length);
    unlInfo.splice(0, unlInfo.length);
    unlFixtures.splice(0, unlFixtures.length);
    unlResults.splice(0, unlResults.length);
}, 300000);