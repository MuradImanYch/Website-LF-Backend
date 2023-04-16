const express = require('express');
const router = express.Router();
const controller = require('../controllers/admin.js');

router.post('/check', controller.check);
router.post('/addNews', controller.addNews);
router.post('/delNews', controller.delNews);
router.post('/findEditedNews', controller.findEditedNews);
router.post('/editNews', controller.editNews);
router.post('/delBroadcast', controller.delBroadcast);
router.post('/editBroadcast', controller.editBroadcast);
router.post('/findEditedBroadcast', controller.findEditedBroadcast);

module.exports = router;