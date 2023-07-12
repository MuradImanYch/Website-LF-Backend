const db = require('../db.js');
const cheerio = require('cheerio');
const axios = require('axios');

let matches = [],
    matchesCoefLinks = [],
    matchesCoefsW1 = [],
    matchesCoefsD = [],
    matchesCoefsW2 = [],
    matchesLeagueNameRoundDate = [],
    matchesStadiums = [],
    matchesVenue = [],
    matchesReferee = [],
    matchesWeatherIco = [],
    matchesWeatherDescr = [],
    liveMatches = [],
    liveMatchesLinks = [],
    matchesLeagueNameRoundDateLive = []

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
module.exports.setFav = async (req, res) => {
    db.query(`UPDATE users SET favoriteTeams='${req.body.team}' WHERE token="${req.body.token}"`);
    
    const fetchData = async () => {
        await axios.get('https://soccer365.ru/online/')
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);
            JSON.parse(req.body.team) && JSON.parse(req.body.team).map((e) => { // expected matches by favorite team
                $('.game_block').each((i, element) => {
                    $(element).find('a').parent().attr('dt-status') === 'u' && ($(element).find('a .result .ht .name .img16 span').text() === e.name || $(element).find('a .result .at .name .img16 span').text() === e.name) && matches.push({
                        hName: $(element).find('.game_block a .result .ht .name .img16 span').text(),
                        aName: $(element).find('.game_block a .result .at .name .img16 span').text(),
                        hLogo: $(element).find('.game_block a .result .ht .name .img16 img').attr('src'),
                        aLogo: $(element).find('.game_block a .result .at .name .img16 img').attr('src'),
                        lLogo: $(element).find('.game_block a').parent().parent().find('div:first-child a .img16 img').attr('src') || $(element).find('.game_block a').parent().parent().find('div:first-child .img16 img').attr('src')
                    }) && matchesCoefLinks.push(`https://soccer365.ru${$(element).find('a').attr('href')}`); // push coef links;
                });
            });
    })
    .catch(err => console.log(err));

    for await (e of matchesCoefLinks) {
        axios.get(`${e}`) // live matches | scraping nested link
            .then(response => response.data)
            .then(response => {
                const $ = cheerio.load(response);
                
                $('.adv_kef_wgt_odd td').eq(1).each((i, element) => { // scraping coefs
                    matchesCoefsW1.push($(element).find('a .koeff').text()); 
                    matches = matches.map((item, index) => ({ ...item,
                        w1: matchesCoefsW1[index]
                    }));
                });
                $('.adv_kef_wgt_odd td').eq(2).each((i, element) => {
                    matchesCoefsD.push($(element).find('a .koeff').text()); 
                    matches = matches.map((item, index) => ({ ...item,
                        d: matchesCoefsD[index]
                    }));
                });
                $('.adv_kef_wgt_odd td').eq(3).each((i, element) => {
                    matchesCoefsW2.push($(element).find('a .koeff').text()); 
                    matches = matches.map((item, index) => ({ ...item,
                        w2: matchesCoefsW2[index]
                    }));
                });

                matchesLeagueNameRoundDate.push($('#game_events h2').text().split(",")); // scraping round
                matches = matches.map((item, index) => ({ ...item,
                    lNameRoundDateTime: matchesLeagueNameRoundDate[index]
                }));

                matchesStadiums.push($('#preview > div.block_body > div.preview_item.st > div > span >').text()); // scraping stadiums
                matches = matches.map((item, index) => ({ ...item,
                    stadium: matchesStadiums[index]
                }));

                matchesVenue.push($('#preview > div.block_body > div.preview_item.st > span:nth-child(3)').text()); // scraping venue
                matches = matches.map((item, index) => ({ ...item,
                    venue: matchesVenue[index]
                }));

                matchesReferee.push($('#preview > div.block_body > div:nth-child(2)').text().replace(/\s/g, ' ')); // scraping refree
                matches = matches.map((item, index) => ({ ...item,
                    refree: matchesReferee[index]
                }));

                matchesWeatherIco.push($('#preview > div.block_body > div.preview_item.st > div.img16.weath_tmp > img').attr('src')); // scraping weather ico
                matches = matches.map((item, index) => ({ ...item,
                    weatherIco: matchesWeatherIco[index]
                }));

                matchesWeatherDescr.push($('#preview > div.block_body > div.preview_item.st > div.img16.weath_tmp > span').text() + ' | ' + $('#preview > div.block_body > div.preview_item.st > span:nth-child(5)').text()); // scraping weather ico
                matches = matches.map((item, index) => ({ ...item,
                    weatherDescr: matchesWeatherDescr[index]
                }));
            })
            .catch(err => console.log(err));
    }

    await axios.get('https://soccer365.ru/online/')
            .then(response => response.data)
            .then(response => {
                const $ = cheerio.load(response);
                    JSON.parse(req.body.team) && JSON.parse(req.body.team).map((e) => { // live matches by favorite team
                        $('.game_block').each((i, element) => {
                            $(element).find('a').parent().attr('dt-status') === 'i' && ($(element).find('a .result .ht .name .img16 span').text() === e.name || $(element).find('a .result .at .name .img16 span').text() === e.name) && liveMatches.push({
                                hName: $(element).find('.game_block a .result .ht .name .img16 span').text(),
                                aName: $(element).find('.game_block a .result .at .name .img16 span').text(),
                                hLogo: $(element).find('.game_block a .result .ht .name .img16 img').attr('src'),
                                aLogo: $(element).find('.game_block a .result .at .name .img16 img').attr('src'),
                                lLogo: $(element).find('.game_block a').parent().parent().find('div:first-child a .img16 img').attr('src') || $(element).find('.game_block a').parent().parent().find('div:first-child .img16 img').attr('src'),
                                hScore: $(element).find('.game_block a .result .ht .gls').text(),
                                aScore: $(element).find('.game_block a .result .at .gls').text(),
                                time: $(element).find('.game_block a .status').text().replace('\'', '')
                            }) && liveMatchesLinks.push(`https://soccer365.ru${$(element).find('a').attr('href')}`); // push links;
                        });
                    });
            })
            .catch(err => console.log(err));

            for await (e of liveMatchesLinks) {
                axios.get(`${e}`) // live matches | scraping nested link
                    .then(response => response.data)
                    .then(response => {
                        const $ = cheerio.load(response);
        
                        matchesLeagueNameRoundDateLive.push($('#game_events h2').text().split(",")); // scraping round
                        liveMatches = liveMatches.map((item, index) => ({ ...item,
                            lNameRoundDateTime: matchesLeagueNameRoundDateLive[index]
                        }));
                    })
                    .catch(err => console.log(err));
            }
    }

    fetchData();
    setInterval(() => {
        fetchData();

        db.query(`UPDATE users SET favMatchesExpected='${JSON.stringify(matches)}' WHERE token='${req.body.token}'`);
        db.query(`UPDATE users SET favMatchesLive='${JSON.stringify(liveMatches)}' WHERE token='${req.body.token}'`);

        matches.splice(0, matches.length);
        matchesCoefLinks.splice(0, matchesCoefLinks.length);
        matchesCoefsW1.splice(0, matchesCoefsW1.length);
        matchesCoefsD.splice(0, matchesCoefsD.length);
        matchesCoefsW2.splice(0, matchesCoefsW2.length);
        matchesLeagueNameRoundDate.splice(0, matchesLeagueNameRoundDate.length);
        matchesStadiums.splice(0, matchesStadiums.length);
        matchesVenue.splice(0, matchesVenue.length);
        matchesReferee.splice(0, matchesReferee.length);
        matchesWeatherIco.splice(0, matchesWeatherIco.length);
        matchesWeatherDescr.splice(0, matchesWeatherDescr.length);
        liveMatches.splice(0, liveMatches.length);
        liveMatchesLinks.splice(0, liveMatchesLinks.length);
        matchesLeagueNameRoundDateLive.splice(0, matchesLeagueNameRoundDateLive.length);
    }, 30000);
}