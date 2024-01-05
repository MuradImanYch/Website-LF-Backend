const express = require('express');
const router = express.Router();
const controller = require('../controllers/iptvParsing.js');

router.get('/', controller.parsing);

module.exports = router;