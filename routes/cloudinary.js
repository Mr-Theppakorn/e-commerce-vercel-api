const express = require('express');
const { authCheck, adminCheck } = require('../middlewares/auth');
const { upload, remove, uploadProfile } = require('../controllers/cloudinary');

const router = express.Router();

router.post('/upload-images', authCheck, adminCheck, upload);

router.post('/user/profile/image', authCheck, uploadProfile);

router.post('/remove-image', authCheck, adminCheck, remove);

module.exports = router;