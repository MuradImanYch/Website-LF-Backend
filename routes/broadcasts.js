const express = require('express');
const router = express.Router();
const controller = require('../controllers/broadcasts.js');

router.post('/add', controller.add);
router.get('/get', controller.get);

module.exports = router;