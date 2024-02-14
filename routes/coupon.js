const express = require('express');
const { authCheck } = require('../middlewares/auth');
const { list, create, remove } = require('../controllers/coupon');
const router = express.Router();

router.get('/coupon', list);

router.post('/coupon', authCheck, create);

router.delete('/coupon/:couponId', authCheck, remove);

module.exports = router;