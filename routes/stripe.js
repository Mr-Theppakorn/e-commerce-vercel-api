const express = require('express');
const { authCheck } = require('../middlewares/auth');
const { createPaymentSession, webhook } = require('../controllers/stripe');
const router = express.Router();

router.post('/payment', authCheck, createPaymentSession);

module.exports = router;