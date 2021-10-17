const express = require('express').Router;
const router = express();
const userController = require('../Controllers/userController');


router.post('/otp-secret', userController.giveSecret);
router.post('/otp-validar', userController.validar, userController.admin);

module.exports = router;