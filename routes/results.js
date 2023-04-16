const express = require('express');
const router = express.Router();
const controller = require('../controllers/results.js');

router.get('/rpl', controller.rpl);

module.exports = router;