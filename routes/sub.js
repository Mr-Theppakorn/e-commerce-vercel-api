const express = require('express');
const { authCheck, adminCheck } = require('../middlewares/auth');
const { create, update, list, read, remove, listProducts } = require('../controllers/sub');

const router = express.Router();

router.post('/sub', authCheck, adminCheck, create);

router.patch('/sub', authCheck, adminCheck, update);

router.get('/sub', list)

router.get('/sub/:slug', listProducts)

router.get('/sub', read)

router.delete('/sub/:slug', authCheck, adminCheck, remove)

module.exports = router;