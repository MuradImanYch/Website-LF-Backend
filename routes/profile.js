const express = require('express');
const router = express.Router();
const controller = require('../controllers/profile.js');

router.post('/username', controller.username);
router.post('/getFav', controller.getFav);
router.post('/setFav', controller.setFav);

module.exports = router;