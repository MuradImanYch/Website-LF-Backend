const express = require('express');
const app = express();
const cheerio = require('cheerio');
const axios = require('axios');

let uefaCountryRank = [];
let uefaCountryRankSeason = [];
let transferNews = [];
let transferList = [];
let mainNews = [];
let mainNews2 = [];
let mainSlider = [];
let mainNews3 = [];
let mainNews4 = [];
let mainNews5 = [];
let videoNews = [];
let rplStandings = [];
let eplStandings = [];
let laligaStandings = [];
let bundesligaStandings = [];
let serieaStandings = [];
let ligue1Standings = [];
let endedMatches = [];
let forecasts = [];
let matchesSlider = [];
let matchesSliderCoefLinks = [];
let matchesSliderCoefsW1 = [];
let matchesSliderCoefsD = [];
let matchesSliderCoefsW2 = [];
let teams = ["Челси", "Манчестер Сити", "Манчестер Юнайтед", "Ливерпуль", "Арсенал", "Тоттенхэм", "Барселона", "Атлетико Мадрид", "Реал Мадрид", "Севилья", "ПСЖ", "Марсель", "Лион", "Монако", "Ювентус", "Интер", "Милан", "Лацио", "Аталанта", "Наполи", "Рома", "Бавария", "Боруссия Дортмунд", "РБ Лейпциг", "Зенит", "ЦСКА Москва", "Спартак", "Краснодар", "Локомотив Москва", "Динамо Москва", "Шахтер", "Динамо Киев", "Заря", "Порту", "Бенфика", "Спортинг Лиссабон", "Брага", "ПСВ", "Аякс", "Фейеноорд", "Кайрат", "Астана", "Карабах Агдам", "Нефтчи", "Шериф", "Фенербахче", "Бешикташ", "Галатасарай", "БАТЭ", "Динамо Минск", "Пахтакор", "Насаф", "Динамо Тбилиси", "Динамо Батуми", "Пюник", "Алашкерт", "Рига", "РФШ", "Жальгирис", "Судува", "Флора", "Левадия", "Дордой", "Абдыш-Ата", "Истиклол Душанбе", "Худжанд", "Алтын Асыр", "Ахал", "Россия", "Испания", "Франция", "Аргентина", "Португалия", "Бразилия", "Германия", "Бельгия", "Англия", "Италия", "Мексика", "Уругвай", "США", "Хорватия", "Сенегал", "Япония", "Камерун", "Алжир", "Турция", "Нидерланды", "Украина", "Азербайджан", "Южная Корея", "Грузия", "Казахстан", "Беларусь", "Узбекистан", "Молдова", "Армения", "Кыргызстан", "Кыргызстан", "Литва", "Латвия", "Эстония", "Туркменистан"];
let matchesSliderLeagueNameRoundDate = [];
let matchesSliderStadiums = [];
let matchesSliderVenue = [];
let matchesSliderReferee = [];
let matchesSliderWeatherIco = [];
let matchesSliderWeatherDescr = [];
let uclStandingsA = [];
let uclStandingsB = [];
let uclStandingsC = [];
let uclStandingsD = [];
let uclStandingsE = [];
let uclStandingsF = [];
let uclStandingsG = [];
let uclStandingsH = [];
let uelStandingsA = [];
let uelStandingsB = [];
let uelStandingsC = [];
let uelStandingsD = [];
let uelStandingsE = [];
let uelStandingsF = [];
let uelStandingsG = [];
let uelStandingsH = [];
let ueclStandingsA = [];
let ueclStandingsB = [];
let ueclStandingsC = [];
let ueclStandingsD = [];
let ueclStandingsE = [];
let ueclStandingsF = [];
let ueclStandingsG = [];
let ueclStandingsH = [];

const parsing = async () => {
    app.get('/uefaCountryRankSeason', (req, res) => {
        res.send(uefaCountryRankSeason);
    });
    app.get('/uefaCountryRank', (req, res) => {
        res.send(uefaCountryRank);
    });
    app.get('/transferNews', (req, res) => {
        res.send(transferNews);
    });
    app.get('/transferList', (req, res) => {
        res.send(transferList);
    });
    app.get('/mainNews', (req, res) => {
        res.send(mainNews);
    });
    app.get('/mainNews2', (req, res) => {
        res.send(mainNews2);
    });
    app.get('/mainSlider', (req, res) => {
        res.send(mainSlider);
    });
    app.get('/mainNews3', (req, res) => {
        res.send(mainNews3);
    });
    app.get('/mainNews4', (req, res) => {
        res.send(mainNews4);
    });
    app.get('/mainNews5', (req, res) => {
        res.send(mainNews5);
    });
    app.get('/videoNews', (req, res) => {
        res.send(videoNews);
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

    await axios('https://terrikon.com/football/uefa_coefs') // last 5 uefa season || uefa rank
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

    await axios('https://footballhd.ru/allnews/') // transfer news
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#dle-content .sh_art').each((i, element) => {
            transferNews.push({
                title: $(element).find('h2 a').text(),
                date: $(element).find('.date').text(),
                img: $(element).find('h2 .mg img').attr('src'),
                src: $(element).find('h2 a').attr('href')
            });
        });
    })
    .catch(err => console.log(err));

    await axios('https://soccer365.ru/transfers/') // popular transfer list
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('tbody tr').each((i, element) => {
            transferList.push({
                img: $(element).find('.pl_info img').attr('src'),
                name: $(element).find('.pl_info .name div span').text(),
                clubOut: $(element).find('.gray div:nth-child(1) img').attr('src'),
                clubOutName: $(element).find('.gray div:nth-child(1) span').text(),
                clubIn: $(element).find('.gray div:nth-child(2) img').attr('src'),
                clubInName: $(element).find('.gray div:nth-child(2) span').text(),
                price: $(element).find('.green').text()
            });
        });
    })
    .catch(err => console.log(err));

    await axios('https://www.sports.ru/') // main news
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('article').each((i, element) => {
            mainNews.push({
                title: $(element).find('h2 a').text(),
                src: $(element).find('h2 a').attr('href'),
                img: $(element).find('a img').attr('data-src'),
                date: $(element).find('.time-block_top').text()
            });
        });
    })
    .catch(err => console.log(err));

    /* await axios('https://www.championat.com/') // main news 2
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('.article-preview-list .article-preview').each((i, element) => {
            mainNews2.push({
                title: $(element).find('.article-preview__info a:nth-child(1)').text(),
                src: $(element).find('.article-preview__info a').attr('href'),
                img: $(element).find('.article-preview__img a img').attr('data-src'),
                date: $(element).find('.article-preview__info .article-preview__details .article-preview__date').text()
            });
        });
    })
    .catch(err => console.log(err)); */

    await axios('https://footballhd.ru/articles/') // main slider
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#art_list .sh_art').each((i, element) => {
            mainSlider.push({
                title: $(element).find('h2 a u').text(),
                src: $(element).find('h2 a').attr('href'),
                img: $(element).find('h2 a b img').attr('src'),
                date: $(element).find('span i').text()
            });
        });
    })
    .catch(err => console.log(err));

    await axios('https://www.euro-football.ru/') // main news 3
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('.additional-content-item').each((i, element) => {
            mainNews3.push({
                title: $(element).find('.additional-content-item__content a').text(),
                src: $(element).find('.additional-content-item__content a').attr('href'),
                img: $(element).find('.additional-content-item a img').attr('src'),
                date: $(element).find('.additional-content-item__content .additional-content-item__content-date').text()
            });
        });
    })
    .catch(err => console.log(err));

    await axios('https://www.championat.com/football/_other.html') // main news 4
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('.article-preview').each((i, element) => {
            mainNews4.push({
                title: $(element).find('.article-preview__info a').text(),
                src: $(element).find('.article-preview__info a').attr('href'),
                img: $(element).find('.article-preview__img a img').attr('data-src'),
                date: $(element).find('.article-preview__info .article-preview__details .article-preview__date').text()
            });
        });
    })
    .catch(err => console.log(err));

    await axios('https://sport.business-gazeta.ru/') // main news 5
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('.line-article').each((i, element) => {
            mainNews5.push({
                title: $(element).find('h5').text(),
                src: $(element).find('a').attr('href'),
                img: $(element).find('a .image-container img').attr('data-src'),
                date: $(element).find('div div div div div div > div span').text()
            });
        });
    })
    .catch(err => console.log(err));

    await axios('https://football-video.org/') // news video
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('.row-last-videos1 figure').each((i, element) => {
            videoNews.push({
                title: $(element).find('.figure-wrap1 .bottom-figure-wrapper1 .nazv1 a').text(),
                src: $(element).find('.figure-wrap1 .bottom-figure-wrapper1 .nazv1 a').attr('href'),
                img: $(element).find('.figure-wrap1 a .image-wrapper1 img').attr('data-src'),
                date: $(element).find('.figure-wrap1 .bottom-figure-wrapper1 .datespan1').text()
            });
        });
    })
    .catch(err => console.log(err));

    await axios('https://www.liveresult.ru/football/Russia/Premier-League/standings') // rpl standings
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('.tab-content tbody tr').each((i, element) => {
            rplStandings.push({
                name: $(element).find('.name a').text(),
                place: $(element).find('.num').text(),
                description: $(element).find('.num').attr('title'),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
            });
        });
    })
    .catch(err => console.log(err));

    await axios('https://www.liveresult.ru/football/England/Premier-League/standings') // epl standings
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('.tab-content tbody tr').each((i, element) => {
            eplStandings.push({
                name: $(element).find('.name a').text(),
                place: $(element).find('.num').text(),
                description: $(element).find('.num').attr('title'),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
            });
        });
    })
    .catch(err => console.log(err));

    await axios('https://www.liveresult.ru/football/Spain/LaLiga/standings') // laliga standings
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('.tab-content tbody tr').each((i, element) => {
            laligaStandings.push({
                name: $(element).find('.name a').text(),
                place: $(element).find('.num').text(),
                description: $(element).find('.num').attr('title'),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
            });
        });
    })
    .catch(err => console.log(err));

    await axios('https://www.liveresult.ru/football/Germany/Bundesliga-I/standings') // bundesliga standings
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('.tab-content tbody tr').each((i, element) => {
            bundesligaStandings.push({
                name: $(element).find('.name a').text(),
                place: $(element).find('.num').text(),
                description: $(element).find('.num').attr('title'),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
            });
        });
    })
    .catch(err => console.log(err));

    await axios('https://www.liveresult.ru/football/Italy/Serie-A/standings') // serie a standings
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('.tab-content tbody tr').each((i, element) => {
            serieaStandings.push({
                name: $(element).find('.name a').text(),
                place: $(element).find('.num').text(),
                description: $(element).find('.num').attr('title'),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
            });
        });
    })
    .catch(err => console.log(err));

    await axios('https://www.liveresult.ru/football/France/Ligue-1/standings') // ligue 1 standings
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('.tab-content tbody tr').each((i, element) => {
            ligue1Standings.push({
                name: $(element).find('.name a').text(),
                place: $(element).find('.num').text(),
                description: $(element).find('.num').attr('title'),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
            });
        });
    })
    .catch(err => console.log(err));

    await axios('https://soccer365.ru/online/') // ended matches
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('.game_block').each((i, element) => {
            $(element).find('a .status span').text() == 'Завершен' && endedMatches.push({
                hName: $(element).find('a .result .ht .name .img16 span').text(),
                aName: $(element).find('a .result .at .name .img16 span').text(),
                hLogo: $(element).find('a .result .ht .name .img16 img').attr('src'),
                aLogo: $(element).find('a .result .at .name .img16 img').attr('src'),
                lLogo: $(element).find('a').parent().parent().find('div:first-child a .img16 img').attr('src'),
                lName: $(element).find('a').parent().parent().find('div:first-child a .img16 span').text(),
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

    await axios('https://kushvsporte.ru/freeforcats/sports/football') // forecasts
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('.betsList').each((i, element) => {
            forecasts.push({
                hName: $(element).find('.itemBet .bodyBet a .align-items-center div:nth-child(2) .medium-text').text(),
                aName: $(element).find('.itemBet .bodyBet a .align-items-center div:nth-child(6) .medium-text').text(),
                hLogo: $(element).find('.itemBet .bodyBet a .align-items-center div:nth-child(3) img').attr('src'),
                aLogo: $(element).find('.itemBet .bodyBet a .align-items-center div:nth-child(5) img').attr('src'),
                lName: $(element).find('.itemBet .bodyBet div:nth-child(1) div:nth-child(2) a').text(),
                date: $(element).find('.itemBet .bodyBet a .align-items-center div:nth-child(4) div:nth-child(1) div:nth-child(1)').text(),
                prediction: $(element).find('div .footerBet div div:nth-child(1) div div:nth-child(1) div span a').text(),
                coefficient: $(element).find('div .footerBet div div:nth-child(2) div:nth-child(1) a div span').text()
            });
        });
    })
    .catch(err => console.log(err));

    await axios('https://soccer365.ru/online/') // matchesSlider
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
                        lLogo: $(element).find('.game_block a').parent().parent().find('div:first-child a .img16 img').attr('src')
                    }) && matchesSliderCoefLinks.push(`https://soccer365.ru${$(element).find('a').attr('href')}`); // push coef links
                });
            });
    })
    .catch(err => console.log(err));

    for await (e of matchesSliderCoefLinks) {
        await axios(`${e}`) // matchesSlider | scraping nested link
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

                matchesSliderVenue.push($('#preview > div.block_body > div.preview_item.st > span.min_gray').text()); // scraping venue
                matchesSlider = matchesSlider.map((item, index) => ({ ...item,
                    venue: matchesSliderVenue[index]
                }));

                matchesSliderReferee.push($('#preview > div.block_body > div:nth-child(2)').text().replace(/\s/g, ' ')); // scraping refree
                matchesSlider = matchesSlider.map((item, index) => ({ ...item,
                    refree: matchesSliderReferee[index]
                }));

                $('#preview > div.block_body > div.preview_item.st > span.prview_weath_tmp').attr('style') &&matchesSliderWeatherIco.push($('#preview > div.block_body > div.preview_item.st > span.prview_weath_tmp').attr('style').slice(22, $('#preview > div.block_body > div.preview_item.st > span.prview_weath_tmp').attr('style').length - 2)); // scraping weather ico
                matchesSlider = matchesSlider.map((item, index) => ({ ...item,
                    weatherIco: matchesSliderWeatherIco[index]
                }));

                matchesSliderWeatherDescr.push($('#preview > div.block_body > div.preview_item.st > span.prview_weath_tmp').text()); // scraping weather ico
                matchesSlider = matchesSlider.map((item, index) => ({ ...item,
                    weatherDescr: matchesSliderWeatherDescr[index]
                }));
            })
            .catch(err => console.log(err));
    }

    await axios('https://www.liveresult.ru/football/Champions-League/2021-2022/standings?st=0') // ucl standings (A)
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t4352-regular-overall-table > div:nth-child(2) > table > tbody tr').each((i, element) => {
            uclStandingsA.push({
                name: $(element).find('.name a').text(),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().parent().find('h3').eq(0).text()
            });
        });
    })
    .catch(err => console.log(err));

    await axios('https://www.liveresult.ru/football/Champions-League/2021-2022/standings?st=0') // ucl standings (B)
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t4352-regular-overall-table > div:nth-child(4) > table tr').each((i, element) => {
            uclStandingsB.push({
                name: $(element).find('.name a').text(),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().parent().find('h3').eq(1).text()
            });
        });
    })
    .catch(err => console.log(err));

    await axios('https://www.liveresult.ru/football/Champions-League/2021-2022/standings?st=0') // ucl standings (C)
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t4352-regular-overall-table > div:nth-child(6) > table tr').each((i, element) => {
            uclStandingsC.push({
                name: $(element).find('.name a').text(),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().parent().find('h3').eq(2).text()
            });
        });
    })
    .catch(err => console.log(err));

    await axios('https://www.liveresult.ru/football/Champions-League/2021-2022/standings?st=0') // ucl standings (D)
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t4352-regular-overall-table > div:nth-child(8) > table tr').each((i, element) => {
            uclStandingsD.push({
                name: $(element).find('.name a').text(),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().parent().find('h3').eq(3).text()
            });
        });
    })
    .catch(err => console.log(err));

    await axios('https://www.liveresult.ru/football/Champions-League/2021-2022/standings?st=0') // ucl standings (E)
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t4352-regular-overall-table > div:nth-child(10) > table tr').each((i, element) => {
            uclStandingsE.push({
                name: $(element).find('.name a').text(),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().parent().find('h3').eq(4).text()
            });
        });
    })
    .catch(err => console.log(err));

    await axios('https://www.liveresult.ru/football/Champions-League/2021-2022/standings?st=0') // ucl standings (F)
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t4352-regular-overall-table > div:nth-child(12) > table tr').each((i, element) => {
            uclStandingsF.push({
                name: $(element).find('.name a').text(),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().parent().find('h3').eq(5).text()
            });
        });
    })
    .catch(err => console.log(err));

    await axios('https://www.liveresult.ru/football/Champions-League/2021-2022/standings?st=0') // ucl standings (G)
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t4352-regular-overall-table > div:nth-child(14) > table tr').each((i, element) => {
            uclStandingsG.push({
                name: $(element).find('.name a').text(),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().parent().find('h3').eq(6).text()
            });
        });
    })
    .catch(err => console.log(err));

    await axios('https://www.liveresult.ru/football/Champions-League/2021-2022/standings?st=0') // ucl standings (H)
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t4352-regular-overall-table > div:nth-child(16) > table tr').each((i, element) => {
            uclStandingsH.push({
                name: $(element).find('.name a').text(),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().parent().find('h3').eq(7).text()
            });
        });
    })
    .catch(err => console.log(err));

    await axios('https://www.liveresult.ru/football/Europa-League/2021-2022/standings?st=0') // uel standings (A)
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t4353-regular-overall-table > div:nth-child(2) > table > tbody tr').each((i, element) => {
            uelStandingsA.push({
                name: $(element).find('.name a').text(),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().parent().find('h3').eq(0).text()
            });
        });
    })
    .catch(err => console.log(err));

    await axios('https://www.liveresult.ru/football/Europa-League/2021-2022/standings?st=0') // uel standings (B)
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t4353-regular-overall-table > div:nth-child(4) > table tr').each((i, element) => {
            uelStandingsB.push({
                name: $(element).find('.name a').text(),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().parent().find('h3').eq(1).text()
            });
        });
    })
    .catch(err => console.log(err));

    await axios('https://www.liveresult.ru/football/Europa-League/2021-2022/standings?st=0') // uel standings (C)
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t4353-regular-overall-table > div:nth-child(6) > table tr').each((i, element) => {
            uelStandingsC.push({
                name: $(element).find('.name a').text(),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().parent().find('h3').eq(2).text()
            });
        });
    })
    .catch(err => console.log(err));

    await axios('https://www.liveresult.ru/football/Europa-League/2021-2022/standings?st=0') // uel standings (D)
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t4353-regular-overall-table > div:nth-child(8) > table tr').each((i, element) => {
            uelStandingsD.push({
                name: $(element).find('.name a').text(),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().parent().find('h3').eq(3).text()
            });
        });
    })
    .catch(err => console.log(err));

    await axios('https://www.liveresult.ru/football/Europa-League/2021-2022/standings?st=0') // uel standings (E)
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t4353-regular-overall-table > div:nth-child(10) > table tr').each((i, element) => {
            uelStandingsE.push({
                name: $(element).find('.name a').text(),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().parent().find('h3').eq(4).text()
            });
        });
    })
    .catch(err => console.log(err));

    await axios('https://www.liveresult.ru/football/Europa-League/2021-2022/standings?st=0') // uel standings (F)
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t4353-regular-overall-table > div:nth-child(12) > table tr').each((i, element) => {
            uelStandingsF.push({
                name: $(element).find('.name a').text(),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().parent().find('h3').eq(5).text()
            });
        });
    })
    .catch(err => console.log(err));

    await axios('https://www.liveresult.ru/football/Europa-League/2021-2022/standings?st=0') // uel standings (G)
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t4353-regular-overall-table > div:nth-child(14) > table tr').each((i, element) => {
            uelStandingsG.push({
                name: $(element).find('.name a').text(),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().parent().find('h3').eq(6).text()
            });
        });
    })
    .catch(err => console.log(err));

    await axios('https://www.liveresult.ru/football/Europa-League/2021-2022/standings?st=0') // uel standings (H)
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t4353-regular-overall-table > div:nth-child(16) > table tr').each((i, element) => {
            uelStandingsH.push({
                name: $(element).find('.name a').text(),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().parent().find('h3').eq(7).text()
            });
        });
    })
    .catch(err => console.log(err));

    await axios('https://www.liveresult.ru/football/Europa-Conference-League/2021-2022/standings?st=0') // uecl standings (A)
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t4377-regular-overall-table > div:nth-child(2) > table > tbody tr').each((i, element) => {
            ueclStandingsA.push({
                name: $(element).find('.name a').text(),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().parent().find('h3').eq(0).text()
            });
        });
    })
    .catch(err => console.log(err));

    await axios('https://www.liveresult.ru/football/Europa-Conference-League/2021-2022/standings?st=0') // uecl standings (B)
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t4377-regular-overall-table > div:nth-child(4) > table tr').each((i, element) => {
            ueclStandingsB.push({
                name: $(element).find('.name a').text(),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().parent().find('h3').eq(1).text()
            });
        });
    })
    .catch(err => console.log(err));

    await axios('https://www.liveresult.ru/football/Europa-Conference-League/2021-2022/standings?st=0') // uecl standings (C)
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t4377-regular-overall-table > div:nth-child(6) > table tr').each((i, element) => {
            ueclStandingsC.push({
                name: $(element).find('.name a').text(),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().parent().find('h3').eq(2).text()
            });
        });
    })
    .catch(err => console.log(err));

    await axios('https://www.liveresult.ru/football/Europa-Conference-League/2021-2022/standings?st=0') // uecl standings (D)
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t4377-regular-overall-table > div:nth-child(8) > table tr').each((i, element) => {
            ueclStandingsD.push({
                name: $(element).find('.name a').text(),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().parent().find('h3').eq(3).text()
            });
        });
    })
    .catch(err => console.log(err));

    await axios('https://www.liveresult.ru/football/Europa-Conference-League/2021-2022/standings?st=0') // uecl standings (E)
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t4377-regular-overall-table > div:nth-child(10) > table tr').each((i, element) => {
            ueclStandingsE.push({
                name: $(element).find('.name a').text(),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().parent().find('h3').eq(4).text()
            });
        });
    })
    .catch(err => console.log(err));

    await axios('https://www.liveresult.ru/football/Europa-Conference-League/2021-2022/standings?st=0') // uecl standings (F)
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t4377-regular-overall-table > div:nth-child(12) > table tr').each((i, element) => {
            ueclStandingsF.push({
                name: $(element).find('.name a').text(),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().parent().find('h3').eq(5).text()
            });
        });
    })
    .catch(err => console.log(err));

    await axios('https://www.liveresult.ru/football/Europa-Conference-League/2021-2022/standings?st=0') // uecl standings (G)
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t4377-regular-overall-table > div:nth-child(14) > table tr').each((i, element) => {
            ueclStandingsG.push({
                name: $(element).find('.name a').text(),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().parent().find('h3').eq(6).text()
            });
        });
    })
    .catch(err => console.log(err));

    await axios('https://www.liveresult.ru/football/Europa-Conference-League/2021-2022/standings?st=0') // uecl standings (H)
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#t4377-regular-overall-table > div:nth-child(16) > table tr').each((i, element) => {
            ueclStandingsH.push({
                name: $(element).find('.name a').text(),
                place: $(element).find('.num').text(),
                logo: $(element).find('.team-icon img').attr('src'),
                games: $(element).find('.score').eq(0).text(),
                goalsFor: $(element).find('.score').eq(4).text().split('-')[0],
                goalsAgainst: $(element).find('.score').eq(4).text().split('-')[1],
                points: $(element).find('.score').eq(5).text(),
                group: $(element).parent().parent().parent().parent().find('h3').eq(7).text()
            });
        });
    })
    .catch(err => console.log(err));
}

parsing();

setInterval(() => {
    uefaCountryRank.splice(0, uefaCountryRank.length);
    uefaCountryRankSeason.splice(0, uefaCountryRankSeason.length);
    transferNews.splice(0, transferNews.length);
    transferList.splice(0, transferList.length);
    mainNews.splice(0, mainNews.length);
    mainNews2.splice(0, mainNews2.length);
    mainSlider.splice(0, mainSlider.length);
    mainNews3.splice(0, mainNews3.length);
    mainNews4.splice(0, mainNews4.length);
    mainNews5.splice(0, mainNews5.length);
    videoNews.splice(0, videoNews.length);
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

    parsing();
}, 60000);

app.listen(process.env.PORT || 8888, (err) => {
    if(err) return err;
    console.log('Server on 8888 is running...');
});