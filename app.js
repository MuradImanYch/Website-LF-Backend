const express = require('express');
const app = express();
const cheerio = require('cheerio');
const axios = require('axios');
const CyrillicToTranslit = require('cyrillic-to-translit-js');
const iconv = require('iconv-lite');
const fetch = require('node-fetch');

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
let liveMatches = [];
let liveMatchesLinks = [];
let liveMatchesLeagueNameRoundDate = [];
let rplTopScores = [];
let eplTopScores = [];
let laligaTopScores = [];
let bundesligaTopScores = [];
let serieaTopScores = [];
let ligue1TopScores = [];
let mainSliderLinks = [];
let mainSliderPostContent = [];
let transferNewsLinks = [];
let transferNewsPostContent = [];
let mainNews2Links = [];
let mainNews2PostContent = [];
let mainNews3Links = [];
let mainNews3PostContent = [];
let mainNews4Links = [];
let mainNews4PostContent = [];
let mainNews5Links = [];
let mainNews5PostContent = [];
let mainNewsLinks = [];
let mainNewsPostContent = [];
let uclTopScores = [];
let uelTopScores = [];
let ueclTopScores = [];
let euroQualTopScores = [];
let unlTopScores = [];

const parsing = async () => {
    const cyrillicToTranslit = new CyrillicToTranslit();

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
    app.get('/liveMatches', (req, res) => {
        res.send(liveMatches);
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
    app.get('/euroQualTopScores', (req, res) => {
        res.send(euroQualTopScores);
    });
    app.get('/unlTopScores', (req, res) => {
        res.send(unlTopScores);
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

    await axios.get('https://footballhd.ru/allnews/') // transfer news
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#dle-content .sh_art').each((i, element) => {
            transferNews.push({
                title: $(element).find('h2 a').text(),
                date: $(element).find('.date').text(),
                img: $(element).find('h2 .mg img').attr('src'),
                src: $(element).find('h2 a').attr('href'),
                id: cyrillicToTranslit.transform($(element).find('h2 a').text(), '-').replace(',', '').replace('.', '').replace('«', '').replace('»', '').replace('-', '').replace('–', '').replace(':', '').replace('»', '').replace('«', '').toLowerCase()
            }) && transferNewsLinks.push(`https://footballhd.ru/allnews/${$(element).find('h2 a').attr('href')}`); // push transfer news links;
        });
    })
    .catch(err => console.log(err));

    for await (e of transferNewsLinks) {
        await axios.get(`${e}`) // transferNews | scraping nested link
            .then(response => response.data)
            .then(response => {
                const $ = cheerio.load(response);

                transferNewsPostContent.push($('.txtbloc').html()); // scraping post text
                transferNews = transferNews.map((item, index) => ({ ...item,
                    description: transferNewsPostContent[index]
                }));
            })
            .catch(err => console.log(err));
    }

    await axios.get('https://soccer365.ru/transfers/') // popular transfer list
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

    await axios.get('https://www.sports.ru/') // main news
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('article').each((i, element) => {
            mainNews.push({
                title: $(element).find('h2 a').text(),
                src: $(element).find('h2 a').attr('href'),
                img: $(element).find('a img').attr('data-src'),
                date: $(element).find('.time-block_top').text(),
                id: cyrillicToTranslit.transform($(element).find('h2 a').text(), '-').replace(',', '').replace('.', '').replace('«', '').replace('»', '').replace('-', '').replace('–', '').replace(':', '').replace('»', '').replace('«', '').toLowerCase()
            }) && mainNewsLinks.push($(element).find('h2 a').attr('href')); // push main news links;
        });
    })
    .catch(err => console.log(err));

    for await (e of mainNewsLinks) {
        await axios.get(`${e}`) // mainNews | scraping nested link
            .then(response => response.data)
            .then(response => {
                const $ = cheerio.load(response);

                mainNewsPostContent.push($('.material-item__content').html()); // scraping post text
                mainNews = mainNews.map((item, index) => ({ ...item,
                    description: mainNewsPostContent[index]
                }));
            })
            .catch(err => console.log(err));
    }

    await axios.get('https://www.championat.com/') // main news 2
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('.article-preview-list .article-preview').each((i, element) => {
            mainNews2.push({
                title: $(element).find('.article-preview__info a:nth-child(1)').text(),
                src: $(element).find('.article-preview__info a').attr('href'),
                img: $(element).find('.article-preview__img a img').attr('data-src'),
                date: $(element).find('.article-preview__info .article-preview__details .article-preview__date').text(),
                id: cyrillicToTranslit.transform($(element).find('.article-preview__info a:nth-child(1)').text(), '-').replace(',', '').replace('.', '').replace('«', '').replace('»', '').replace('-', '').replace('–', '').replace(':', '').replace('»', '').replace('«', '').toLowerCase()
            }) && mainNews2Links.push($(element).find('.article-preview__info a').attr('href')); // push main news 2 links;
        });
    })
    .catch(err => console.log(err));

    for await (e of mainNews2Links) {
        await axios.get(`${e}`) // mainNews2 | scraping nested link
            .then(response => response.data)
            .then(response => {
                const $ = cheerio.load(response);

                mainNews2PostContent.push($('.lp_article_content').html()); // scraping post text
                mainNews2 = mainNews2.map((item, index) => ({ ...item,
                    description: mainNews2PostContent[index]
                }));
            })
            .catch(err => console.log(err));
    }

    await axios.get('https://footballhd.ru/articles/') // main slider
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('#art_list .sh_art').each((i, element) => {
            mainSlider.push({
                title: $(element).find('h2 a u').text(),
                src: $(element).find('h2 a').attr('href'),
                img: $(element).find('h2 a b img').attr('src'),
                date: $(element).find('span i').text(),
                id: cyrillicToTranslit.transform($(element).find('h2 a u').text(), '-').replace(',', '').replace('.', '').replace('«', '').replace('»', '').replace('-', '').replace('–', '').replace(':', '').replace('»', '').replace('«', '').toLowerCase()
            }) && mainSliderLinks.push(`https://footballhd.ru/articles/${$(element).find('h2 a').attr('href')}`); // push main slider links;
        });
    })
    .catch(err => console.log(err));

    for await (e of mainSliderLinks) {
        await axios.get(`${e}`) // mainSlider | scraping nested link
            .then(response => response.data)
            .then(response => {
                const $ = cheerio.load(response);

                mainSliderPostContent.push($('.txtbloc').html()); // scraping post text
                mainSlider = mainSlider.map((item, index) => ({ ...item,
                    description: mainSliderPostContent[index]
                }));
            })
            .catch(err => console.log(err));
    }

    await axios.get('https://www.euro-football.ru/') // main news 3
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('.additional-content-item').each((i, element) => {
            mainNews3.push({
                title: $(element).find('.additional-content-item__content a').text(),
                src: $(element).find('.additional-content-item__content a').attr('href'),
                img: $(element).find('.additional-content-item a img').attr('src'),
                date: $(element).find('.additional-content-item__content .additional-content-item__content-date').text(),
                id: cyrillicToTranslit.transform($(element).find('.additional-content-item__content a').text(), '-').replace(',', '').replace('.', '').replace('«', '').replace('»', '').replace('-', '').replace('–', '').replace(':', '').replace('»', '').replace('«', '').toLowerCase()
            }) && mainNews3Links.push($(element).find('.additional-content-item__content a').attr('href')); // push main news 3 links;
        });
    })
    .catch(err => console.log(err));

    for await (e of mainNews3Links) {
        await axios.get(`${e}`) // mainNews3 | scraping nested link
            .then(response => response.data)
            .then(response => {
                const $ = cheerio.load(response);

                mainNews3PostContent.push($('.article__text').html()); // scraping post text
                mainNews3 = mainNews3.map((item, index) => ({ ...item,
                    description: mainNews3PostContent[index]
                }));
            })
            .catch(err => console.log(err));
    }

    await axios.get('https://www.championat.com/football/_other.html') // main news 4
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('.article-preview').each((i, element) => {
            mainNews4.push({
                title: $(element).find('.article-preview__info a').text(),
                src: $(element).find('.article-preview__info a').attr('href'),
                img: $(element).find('.article-preview__img a img').attr('data-src'),
                date: $(element).find('.article-preview__info .article-preview__details .article-preview__date').text(),
                id: cyrillicToTranslit.transform($(element).find('.article-preview__info a').text(), '-').replace(',', '').replace('.', '').replace('«', '').replace('»', '').replace('-', '').replace('–', '').replace(':', '').replace('»', '').replace('«', '').toLowerCase()
            }) && mainNews4Links.push($(element).find('.article-preview__info a').attr('href')); // push main news 4 links;
        });
    })
    .catch(err => console.log(err));

    for await (e of mainNews4Links) {
        await axios.get(`${e}`) // mainNews4 | scraping nested link
            .then(response => response.data)
            .then(response => {
                const $ = cheerio.load(response);

                mainNews4PostContent.push($('.lp_article_content').html()); // scraping post text
                mainNews4 = mainNews4.map((item, index) => ({ ...item,
                    description: mainNews4PostContent[index]
                }));
            })
            .catch(err => console.log(err));
    }

    await axios.get('https://sport.business-gazeta.ru/') // main news 5
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('.line-article').each((i, element) => {
            mainNews5.push({
                title: $(element).find('h5').text(),
                src: $(element).find('a').attr('href'),
                img: $(element).find('a .image-container img').attr('data-src'),
                date: $(element).find('div div div div div div > div span').text(),
                id: cyrillicToTranslit.transform($(element).find('h5').text(), '-').replace(',', '').replace('.', '').replace('«', '').replace('»', '').replace('-', '').replace('–', '').replace(':', '').replace('»', '').replace('«', '').toLowerCase()
            }) && mainNews5Links.push($(element).find('a').attr('href')); // push main news 5 links;
        });
    })
    .catch(err => console.log(err));

    for await (e of mainNews5Links) {
        await axios.get(`${e}`) // mainNews5 | scraping nested link
            .then(response => response.data)
            .then(response => {
                const $ = cheerio.load(response);

                mainNews5PostContent.push($('#app > div.container.container-body > div > div > div:nth-child(2) > div.article-first-col > section > div.article__content > div:nth-child(5)').html()); // scraping post text
                mainNews5 = mainNews5.map((item, index) => ({ ...item,
                    description: mainNews5PostContent[index]
                }));
            })
            .catch(err => console.log(err));
    }

    await axios.get('https://football-video.org/') // news video
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

    await axios.get('https://www.liveresult.ru/football/Russia/Premier-League/standings') // rpl standings
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
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' ').split(" ").slice(-1)
            });
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://www.liveresult.ru/football/England/Premier-League/standings') // epl standings
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
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' ').split(" ").slice(-1)
            });
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://www.liveresult.ru/football/Spain/LaLiga/standings') // laliga standings
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
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' ').split(" ").slice(-1)
            });
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://www.liveresult.ru/football/Germany/Bundesliga-I/standings') // bundesliga standings
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
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' ').split(" ").slice(-1)
            });
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://www.liveresult.ru/football/Italy/Serie-A/standings') // serie a standings
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
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' ').split(" ").slice(-1)
            });
        });
    })
    .catch(err => console.log(err));

    await axios.get('https://www.liveresult.ru/football/France/Ligue-1/standings') // ligue 1 standings
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
                lLogo: $(element).find('a').parent().parent().find('div:first-child a .img16 img').attr('src') === '' ? $(element).find('a').parent().parent().find('div:first-child .img16 img').attr('src') : $(element).find('a').parent().parent().find('div:first-child a .img16 img').attr('src'),
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

    await axios.get('https://kushvsporte.ru/freeforcats/sports/football') // forecasts
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
                        lLogo: $(element).find('.game_block a').parent().parent().find('div:first-child a .img16 img').attr('src')
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
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' ').split(" ").slice(-1)
            });
        });
    })
    .catch(err => console.log(err));

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
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' ').split(" ").slice(-1)
            });
        });
    })
    .catch(err => console.log(err));

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
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' ').split(" ").slice(-1)
            });
        });
    })
    .catch(err => console.log(err));

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
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' ').split(" ").slice(-1)
            });
        });
    })
    .catch(err => console.log(err));

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
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' ').split(" ").slice(-1)
            });
        });
    })
    .catch(err => console.log(err));

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
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' ').split(" ").slice(-1)
            });
        });
    })
    .catch(err => console.log(err));

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
                descrLat: cyrillicToTranslit.transform($(element).find('.num').attr('title'), ' ').split(" ").slice(-1)
            });
        });
    })
    .catch(err => console.log(err));

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

    // const euroqualTopScoresRes = await fetch( // euroqualTopScores
    //     ''
    // );
    // const euroqualTopScoresCharset = (euroqualTopScoresRes.headers.get('content-type') ?? '').split(/\s*;\s*/).find((/** @type {string} */ x) => x.startsWith('charset'))?.replace(/charset=/, '');
    // const euroqualTopScoresBuf = await euroqualTopScoresRes.arrayBuffer();
    // const euroqualTopScoresHtml = iconv.decode(
    //     Buffer.from(euroqualTopScoresBuf),
    //     euroqualTopScoresCharset || 'windows-1251'
    // );
    // const $euroqualTopScores = cheerio.load(euroqualTopScoresHtml);

    // $euroqualTopScores('body > div.se-page-wrapper > section > div.se-grid2col.se-grid2col--one > div > div > div > table > tbody > tr:nth-child(1)').each((i, element) => {
    //     euroqualTopScores.push({
    //         place: $euroqualTopScores(element).find('.se19-table-statistics__td--place').text(),
    //         img: $euroqualTopScores(element).find('.se19-table-statistics__td--img a img').attr('src'),
    //         player: $euroqualTopScores(element).find('.se19-table-statistics__td--name a').text(),
    //         games: $euroqualTopScores(element).find('td').eq(4).text(),
    //         goals: $euroqualTopScores(element).find('td').eq(5).text().replace(/\s/g, '').split('(')[0],
    //         assists: '(' + $euroqualTopScores(element).find('td').eq(5).text().replace(/\s/g, '').split('(')[1],
    //         tLogo: $euroqualTopScores(element).find('td:nth-child(4) div img').attr('src'),
    //         tName: $euroqualTopScores(element).find('td:nth-child(4) div a').text()
    //     });
    // });

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
                lLogo: $(element).find('.game_block a').parent().parent().find('div:first-child a .img16 img').attr('src') === '' ? $(element).find('.game_block a').parent().parent().find('div:first-child .img16 img').attr('src') : $(element).find('.game_block a').parent().parent().find('div:first-child a .img16 img').attr('src'),
                lName: $(element).find('.game_block a').parent().parent().find('div:first-child a .img16 span').text() === '' ? $(element).find('.game_block a').parent().parent().find('div:first-child .img16 span').text() : $(element).find('.game_block a').parent().parent().find('div:first-child a .img16 span').text(),
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
}

liveParsing();

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
    rplTopScores.splice(0, rplTopScores.length);
    eplTopScores.splice(0, eplTopScores.length);
    laligaTopScores.splice(0, laligaTopScores.length);
    bundesligaTopScores.splice(0, bundesligaTopScores.length);
    serieaTopScores.splice(0, serieaTopScores.length);
    ligue1TopScores.splice(0, ligue1TopScores.length);
    liveMatchesLinks.splice(0, liveMatchesLinks.length);
    mainSliderLinks.splice(0, mainSliderLinks.length);
    transferNewsLinks.splice(0, transferNewsLinks.length);
    mainNews2Links.splice(0, mainNews2Links.length);
    mainNews3Links.splice(0, mainNews3Links.length);
    mainNews4Links.splice(0, mainNews4Links.length);
    mainNews5Links.splice(0, mainNews5Links.length);
    mainNewsLinks.splice(0, mainNewsLinks.length);
    uclTopScores.splice(0, uclTopScores.length);
    uelTopScores.splice(0, uelTopScores.length);
    ueclTopScores.splice(0, ueclTopScores.length);
    euroQualTopScores.splice(0, euroQualTopScores.length);
    unlTopScores.splice(0, unlTopScores.length);

    parsing();
}, 120000);

setInterval(() => {
    liveParsing();
    liveMatches.splice(0, liveMatches.length);
}, 30000);

app.listen(process.env.PORT || 8888, (err) => {
    if(err) return err;
    console.log('Server on 8888 is running...');
});