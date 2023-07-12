require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT || 8080;
const cheerio = require('cheerio');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/auth.js');
const adminRoutes = require('./routes/admin.js');
const newsRoutes = require('./routes/news.js');
const matchesRoutes = require('./routes/matches.js');
const pollRoutes = require('./routes/poll.js');
const tablesStandings = require('./routes/tablesStandings.js');
const transfers = require('./routes/transfers.js');
const odds = require('./routes/odds.js');
const tv = require('./routes/tv.js');
const profile = require('./routes/profile.js');
const broadcastsRoutes = require('./routes/broadcasts.js');
const fixturesRoutes = require('./routes/fixtures.js');
const resultsRoutes = require('./routes/results.js');
const leagueSeasonInfoRoutes = require('./routes/leagueSeasonInfo.js');
const likeRoutes = require('./routes/like.js');
const viewsRoutes = require('./routes/views.js');
require('./controllers/parser.js');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/news', newsRoutes);
app.use('/matches', matchesRoutes);
app.use('/poll', pollRoutes);
app.use('/standings', tablesStandings);
app.use('/transfers', transfers);
app.use('/forecasts', odds);
app.use('/tv', tv);
app.use('/profile', profile);
app.use('/broadcasts', broadcastsRoutes);
app.use('/fixtures', fixturesRoutes);
app.use('/results', resultsRoutes);
app.use('/leagueinfo', leagueSeasonInfoRoutes);
app.use('/like', likeRoutes);
app.use('/views', viewsRoutes);
app.use(cookieParser());
const storage = multer.diskStorage({ // multer handler
    destination: (req, file, cb) => {
        cb(null, './public/static/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({storage});
app.use('/public/static/uploads', express.static('./public/static/uploads'));

let searchTeam = []
    
app.post('/searchTeam', async (req, res) => { // searching favorite team
    await axios.get(`https://soccer365.ru/?a=search&q=${encodeURI(req.body.team)}`) // search team
    .then(response => response.data)
    .then(response => {
        const $ = cheerio.load(response);

        $('.search_column .search_result').each((i, element) => {
            $(element).find('span a').parent().parent().parent().find('.block_header').text() === 'Клубы' ? searchTeam.push({
                name: $(element).find('span a').text(),
                img: $(element).find('span').attr('style').split('\'')
            }) : false;
        });
    })
    .catch(err => console.log(err));

    res.send(searchTeam);
    searchTeam.splice(0, searchTeam.length);
});
app.post('/upload', upload.single('image'), (req, res) => { // uploads handle
    res.send({
        url: `/public/static/uploads/${req.file.originalname}`
    });
});
app.post('/delUpload', (req, res) => {
    if(req.body.path.includes('http')) {
        return false;
    }
    else if(req.body.path.includes('/public')) {
        fs.unlink(path.join(__dirname + req.body.path), (err) => {
            if(err) throw err;
        });
    }
    else {
        return false;
    }
});

/* app.get('*', (req, res) =>{
    res.sendFile(path.join(__dirname + "/public/index.html"));
}); */

app.listen(PORT, (err) => {
    if(err) return err;
    console.log(`Server on ${PORT} is running...`);
});