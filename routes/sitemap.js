const express = require('express');
const router = express.Router();
const controller = require('../controllers/sitemap.js');

router.post('/', controller.rewrite);

module.exports = router;