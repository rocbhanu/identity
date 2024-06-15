const express = require('express');
const router = express.Router();
const { identify } = require('../controllers/identityController.js');

router.post('/identify', identify);

module.exports = router;