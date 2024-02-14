const express = require('express');
const { authCheck, adminCheck } = require('../middlewares/auth');
const { createCategory, getCategoryList, deleteCategory, updateCategory, getCategorySub, getCategoryOne } = require('../controllers/category');

const router = express.Router();

router.post('/category', authCheck, adminCheck, createCategory);

router.patch('/category', authCheck, adminCheck, updateCategory);

router.get('/category', getCategoryList)

router.get('/category', getCategoryList)

router.get('/category/:slug', getCategoryOne)

router.get('/category/subs/:_id', getCategorySub)

router.delete('/category/:slug', authCheck, adminCheck, deleteCategory)

module.exports = router;