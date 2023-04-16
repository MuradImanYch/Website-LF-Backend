const express = require('express');
const router = express.Router();
const controller = require('../controllers/tv.js');

router.get('/schedule', controller.schedule);

module.exports = router;