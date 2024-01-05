const express = require('express');
const router = express.Router();
const controller = require('../controllers/suggestionsComplaints');

router.post('/', controller.send);

module.exports = router;