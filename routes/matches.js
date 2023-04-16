const express = require('express');
const router = express.Router();
const controller = require('../controllers/matches.js');

router.get('/live', controller.live);
router.get('/ended', controller.ended);
router.get('/expected', controller.matchesslider);
// router.get('/favLive', controller.favLive);

module.exports = router;