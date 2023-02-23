const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.js');

router.post('/login', controller.login); // login
router.post('/registration', controller.registration); // registration

module.exports = router;