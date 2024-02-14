const express = require('express');
const { authCheck } = require('../middlewares/auth');
const { userCart, getCart, getOrder, addWishlist, getWishlist, removedWishlist, userAddress, applyCoupon, createOrder, removeCart, getUsers } = require('../controllers/user');
const router = express.Router();

router.get('/login',);

router.get('/cart', authCheck, getCart);

router.get('/users', authCheck, getUsers);

router.post('/cart', authCheck, userCart);

router.delete('/cart', authCheck, removeCart);

router.post('/address', authCheck, userAddress);

router.post('/cart/coupon', authCheck, applyCoupon);

router.get('/order', authCheck, getOrder);

router.post('/order', authCheck, createOrder);

router.post('/wishlist', authCheck, addWishlist);

router.get('/wishlist', authCheck, getWishlist);

router.put('/wishlist', authCheck, removedWishlist);

module.exports = router;