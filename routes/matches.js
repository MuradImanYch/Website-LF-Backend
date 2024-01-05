const express = require('express');
const router = express.Router();
const controller = require('../controllers/matches.js');

router.get('/live', controller.live);
router.get('/ended', controller.ended);
router.post('/expected', controller.expectedPost);
router.post('/favLive', controller.favLive);
router.get('/expected', controller.expected);

module.exports = router;