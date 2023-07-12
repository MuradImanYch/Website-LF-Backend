const express = require('express');
const router = express.Router();
const controller = require('../controllers/like.js');

router.post('/post', controller.post);
router.post('/checkIP', controller.checkIP);

module.exports = router;