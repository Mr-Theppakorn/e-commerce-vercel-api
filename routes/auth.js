const express = require('express');
const { getUser, createUser, getOrder, orderStatus, updateUser } = require('../controllers/auth');
const { authCheck, adminCheck } = require('../middlewares/auth');

const router = express.Router();

router.post('/get-user', authCheck, getUser);

router.post('/create-user', authCheck, createUser)

router.patch('/update-user', authCheck, updateUser)

router.get('/admin/orders', authCheck, adminCheck, getOrder)

router.put('/admin/orders', authCheck, adminCheck, orderStatus)


module.exports = router;