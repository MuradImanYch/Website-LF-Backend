const db = require('../db');
const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const cyrillicToTranslit = require('cyrillic-to-translit-js');

module.exports.rewrite = (req, res) => {
    const filePath = path.join(__dirname, '../public/sitemap.xml');

    setTimeout(() => {
        db.query(`SELECT * FROM news WHERE title = '${req.body.title}' AND author = '${req.body.author}' AND category = '${req.body.category}'`, (err, result) => {
            if (err) throw err;

            if (result.length > 0) {
                const newsItem = result[0];

                const newUrl = {
                    loc: `https://legfootball.com/news/read/${newsItem.id + '-' + cyrillicToTranslit().transform(newsItem.title).replace(/[^a-zA-Z\s]/g, '').replace(/\s+/g, '-').toLowerCase()}`,
                    lastmod: `${req.body.formattedDate}`,
                    changefreq: 'monthly',
                    priority: '0.7'
                };

                // Read the contents of the XML file
                fs.readFile(filePath, 'utf8', (err, data) => {
                    if (err) {
                        console.error(err);
                        return;
                    }

                    // Parse XML
                    xml2js.parseString(data, (err, result) => {
                        if (err) {
                            console.error(err);
                            return;
                        }

                        // Add the new URL to the object sitemap
                        result.urlset.url.push(newUrl);

                        // Convert the object back to XML
                        const builder = new xml2js.Builder();
                        const newXml = builder.buildObject(result);

                        // Write the new content to the file
                        fs.writeFile(filePath, newXml, (err) => {
                            if (err) {
                                console.error(err);
                                return;
                            }
                        });
                    });
                });
            }
        });
    }, 2000);
}