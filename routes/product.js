const express = require('express');
const { authCheck, adminCheck } = require('../middlewares/auth');
const { listRelated, create, update, list, read, remove, list2, productCount, productStar, searchFilters } = require('../controllers/product');

const router = express.Router();

router.post('/product', authCheck, adminCheck, create);

router.post('/products', list2);

router.post('/search', searchFilters);

router.patch('/product/:_id', authCheck, adminCheck, update);

router.get('/products/:count', list)

router.get('/products/total', productCount)

router.get('/product/:_id', read)

router.get('/product/related/:_id', listRelated)

router.put('/product/star/:_id', authCheck, productStar)

router.delete('/product/:slug', authCheck, adminCheck, remove)

module.exports = router;