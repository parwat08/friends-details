const express = require('express');

const router = express.Router();
const routeHelpers = require('./../../support/routeHelpers');

router.get('/verify', routeHelpers.verifyEmail);
router.post('/signup', routeHelpers.signUp);
router.post('/login', routeHelpers.login);

module.exports = router;
