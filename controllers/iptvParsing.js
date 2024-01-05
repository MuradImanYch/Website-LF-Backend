const fs = require('fs');
const M3U8FileParser = require('m3u8-file-parser');
const content = fs.readFileSync('public/static/iptv/Sharavoz.Tv.m3u8', { encoding: 'utf-8'});

module.exports.parsing = (req, res) => {
    const reader = new M3U8FileParser();
    reader.read(content);
    res.send(reader.getResult())
}