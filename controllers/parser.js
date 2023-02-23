const axios = require('axios');
const db = require('../db.js');
const cheerio = require('cheerio');

let liveMatches = [],
    liveMatchesLinks = [],
    liveMatchesLeagueNameRoundDate = [],
    endedMatches = []

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
                lName: $(element).find('.game_block a').parent().parent().find('div:first-child a .img16 span').text().length > 25 ? $(element).find('.game_block a').parent().parent().find('div:first-child a .img16 span').text().slice(0, 25) : $(element).find('.game_block a').parent().parent().find('div:first-child a .img16 span').text() || $(element).find('.game_block a').parent().parent().find('div:first-child .img16 span').text().length > 25 ? $(element).find('.game_block a').parent().parent().find('div:first-child .img16 span').text().slice(0, 25) : $(element).find('.game_block a').parent().parent().find('div:first-child .img16 span').text(),
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
        db.query('INSERT INTO livematches (hName, aName, hScore, aScore, hLogo, aLogo, lLogo, lName, time, round, roundInfo) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.hName, e.aName, e.hScore, e.aScore, e.hLogo, e.aLogo, e.lLogo, e.lName.indexOf('Товарищеский') !== -1 ? 'Товарищеский' : e.lName, e.time, e.lNameRoundDateTime[1], e.lNameRoundDateTime[2]], (err => {
            if(err) throw err;
        }));
    });

    return true;
}

liveParsing();

const parsing = async () => {
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
                aScore: $(element).find('a .result .at .gls').text()
            });
        });
    })
    .catch(err => console.log(err));

    db.query('DELETE FROM endedmatches', (err => {
        if(err) throw err;
    }));

    endedMatches.map((e) => {
        db.query('INSERT INTO endedmatches (hName, aName, hLogo, aLogo, lLogo, lName, lRound, hScore, aScore) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.hName, e.aName, e.hLogo, e.aLogo, e.lLogo, e.lName.indexOf('Товарищеский') !== -1 ? 'Товарищеский' : e.lName, e.lRound, e.hScore, e.aScore], (err => {
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
}, 30000);

setInterval(() => {
    parsing();
    endedMatches.splice(0, endedMatches.length);
}, 120000);