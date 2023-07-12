const express = require('express');
const router = express.Router();
const controller = require('../controllers/leagueSeasonInfo.js');

router.get('/rpl', controller.rpl);
router.get('/epl', controller.epl);
router.get('/laliga', controller.laliga);
router.get('/seriea', controller.seriea);
router.get('/bundesliga', controller.bundesliga);
router.get('/ligue1', controller.ligue1);
router.get('/ucl', controller.ucl);
router.get('/uel', controller.uel);
router.get('/uecl', controller.uecl);
router.get('/euQual', controller.euQual);
router.get('/unl', controller.unl);

module.exports = router;