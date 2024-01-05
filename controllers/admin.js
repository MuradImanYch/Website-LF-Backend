const db = require('../db.js');
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');
const cheerio = require('cheerio');
const axios = require('axios');
const openai = new OpenAI({
    apiKey: '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',
});

module.exports.check = (req, res) => {
    db.query(`SELECT * FROM users WHERE token="${req.body.token}"`, ((err, result) =>{
        if(err) throw err;
        res.send(result[0]?.role);
    }));
}

module.exports.addNews = (req, res) => {
    db.query('INSERT INTO news (category, title, img, content, meta_description, meta_keywords, author) VALUES(?, ?, ?, ?, ?, ?, ?)', [req.body.category, req.body.title, req.body.img, req.body.content, req.body.metaDescr, req.body.metaKeywords, req.body.author], (err => {
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
module.exports.generateNews = (req, res) => {
    axios.get(req.body.link)
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        if(req.body.link.includes('liveresult.ru')) {
          async function main() {
            const jsonData = await openai.chat.completions.create({
                messages: [{ role: 'user', content: `${'Создай json объект под этот текст. Вот шаблон json: {title: Составь уникальные SEO заголовок этой статьи. Так же удали упоминание источника сайта и всяких ссылок. Не забудь поставить кавычки «» вместо "" для названий команд, description: Составь небольшое уникальное SEO превью. Так же удали упоминание источника сайта и всяких ссылок. Не забудь поставить кавычки «» вместо "" для названий команд, keywords: Составь ключевые слова под этот текст. Делай все через запятую и с маленькой буквой. Тут не надо обворачивать названия клубов в кавычки. Так же удали упоминание источника сайта и всяких ссылок, content: Сделай полный рерайтинг этой новости так, чтобы она была уникальная и SEO. Замени все слова, все предложения на аналогичный смысл, чтобы не был плагиатом. Так же составь правильную структуру текста, по грамматике, по абзацу и замени некоторые слова на синонимы или похожее по смыслу. Обязательно составь текст по абзацам и оберни абзац в тег "<p>". Так же удали упоминание источника сайта и всяких ссылок. Не забудь поставить кавычки «» вместо "" для названий команд} Перефразируй все слова от начала до конца. Вот текст:' + $('.article-text').find('p').text()}`}],
                model: 'gpt-3.5-turbo',
            });

            await res.send(jsonData.choices[0].message.content);
          }

          main();
        }
        if(req.body.link.includes('championat.com')) {
          async function main() {
            const jsonData = await openai.chat.completions.create({
                messages: [{ role: 'user', content: `${'Создай json объект под этот текст. Вот шаблон json: {title: Составь уникальные SEO заголовок этой статьи. Так же удали упоминание источника сайта и всяких ссылок. Не забудь поставить кавычки «» вместо "" для названий команд, description: Составь небольшое уникальное SEO превью. Так же удали упоминание источника сайта и всяких ссылок. Не забудь поставить кавычки «» вместо "" для названий команд, keywords: Составь ключевые слова под этот текст. Делай все через запятую и с маленькой буквой. Тут не надо обворачивать названия клубов в кавычки. Так же удали упоминание источника сайта и всяких ссылок, content: Сделай полный рерайтинг этой новости так, чтобы она была уникальная и SEO. Замени все слова, все предложения на аналогичный смысл, чтобы не был плагиатом. Так же составь правильную структуру текста, по грамматике, по абзацу и замени некоторые слова на синонимы или похожее по смыслу. Обязательно составь текст по абзацам и оберни абзац в тег "<p>". Так же удали упоминание источника сайта и всяких ссылок. Не забудь поставить кавычки «» вместо "" для названий команд} Перефразируй все слова от начала до конца. Вот текст:' + $('.article-content').find('p').text()}`}],
                model: 'gpt-3.5-turbo',
            });

            await res.send(jsonData.choices[0].message.content);
          }

          main();
        }
        if(req.body.link.includes('news.sportbox.ru')) {
          async function main() {
            const jsonData = await openai.chat.completions.create({
                messages: [{ role: 'user', content: `${'Создай json объект под этот текст. Вот шаблон json: {title: Составь уникальные SEO заголовок этой статьи. Так же удали упоминание источника сайта и всяких ссылок. Не забудь поставить кавычки «» вместо "" для названий команд, description: Составь небольшое уникальное SEO превью. Так же удали упоминание источника сайта и всяких ссылок. Не забудь поставить кавычки «» вместо "" для названий команд, keywords: Составь ключевые слова под этот текст. Делай все через запятую и с маленькой буквой. Тут не надо обворачивать названия клубов в кавычки. Так же удали упоминание источника сайта и всяких ссылок, content: Сделай полный рерайтинг этой новости так, чтобы она была уникальная и SEO. Замени все слова, все предложения на аналогичный смысл, чтобы не был плагиатом. Так же составь правильную структуру текста, по грамматике, по абзацу и замени некоторые слова на синонимы или похожее по смыслу. Обязательно составь текст по абзацам и оберни абзац в тег "<p>". Так же удали упоминание источника сайта и всяких ссылок. Не забудь поставить кавычки «» вместо "" для названий команд} Перефразируй все слова от начала до конца. Вот текст:' + $('.js-mediator-article').find('p').text()}`}],
                model: 'gpt-3.5-turbo',
            });

            await res.send(jsonData.choices[0].message.content);
          }

          main();
        }
    })
    .catch(err => console.log(err));
}