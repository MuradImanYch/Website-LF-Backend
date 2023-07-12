const express = require('express');
const router = express.Router();
const controller = require('../controllers/news.js');

router.get('/allNews', controller.allNews);
router.get('/mainNews', controller.mainNews);
router.get('/blogs', controller.blogs);
router.get('/videoNews', controller.videoNews);
router.get('/rplNews', controller.rplNews);
router.get('/eplNews', controller.eplNews);
router.get('/laligaNews', controller.laligaNews);
router.get('/serieaNews', controller.serieaNews);
router.get('/bundesligaNews', controller.bundesligaNews);
router.get('/ligue1News', controller.ligue1News);
router.get('/uclNews', controller.uclNews);
router.get('/uelNews', controller.uelNews);
router.get('/ueclNews', controller.ueclNews);
router.get('/euQualNews', controller.euQualNews);
router.get('/wcNews', controller.wcNews);
router.get('/ecNews', controller.ecNews);
router.get('/unlNews', controller.unlNews);
router.get('/transferNews', controller.transferNews);
router.get('/otherNews', controller.otherNews);

module.exports = router;