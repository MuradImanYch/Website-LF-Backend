const express = require('express');
const router = express.Router();
const controller = require('../controllers/admin.js');

router.post('/addNews', controller.addNews);
router.post('/delNews', controller.delNews);
router.post('/findEditedNews', controller.findEditedNews);
router.post('/editNews', controller.editNews);

module.exports = router;