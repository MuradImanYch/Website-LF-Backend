const express = require('express');
const router = express.Router();
const controller = require('../controllers/odds.js');

router.get('/odds', controller.odds);

module.exports = router;