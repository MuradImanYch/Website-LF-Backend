const express = require('express');
const router = express.Router();
const controller = require('../controllers/poll.js');

router.post('/post', controller.post);
router.get('/yes', controller.getYes);
router.get('/no', controller.getNo);

module.exports = router;