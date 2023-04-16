const express = require('express');
const router = express.Router();
const controller = require('../controllers/transfers.js');

router.get('/all', controller.all);
router.get('/rpl', controller.rpl);
router.get('/epl', controller.epl);
router.get('/laliga', controller.laliga);
router.get('/seriea', controller.seriea);
router.get('/bundesliga', controller.bundesliga);
router.get('/ligue1', controller.ligue1);

module.exports = router;