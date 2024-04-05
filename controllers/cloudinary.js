const cloudinary = require('cloudinary');
const User = require('../models/user');
const Product = require('../models/product');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.upload = async (req, res, next) => {
    try {

        let result = await cloudinary.uploader.upload(req.body.image, {
            public_id: `${Date.now()}`,
            resource_type: "auto"
        });
        res.json({
            public_id: result.public_id,
            url: result.secure_url
        })

    } catch (err) {
        console.log(err);
        res.status(400).send('Upload Images to cloudinary fail');
    }
};

exports.uploadProfile = async (req, res, next) => {
    const { public_id } = req.body;
    try {
        let result = await cloudinary.uploader.upload(req.body.image, {
            public_id: `${Date.now()}`,
            resource_type: 'auto',
        });

        if (public_id !== undefined) {
            cloudinary.uploader.destroy(public_id);
            console.log('text destroy');
        }

        const newImageData = {
            public_id: result.public_id,
            url: result.secure_url
        };
        const user = await User.findOne({ email: req.user.email });
        const updateImage = await User.findOneAndUpdate(
            { _id: user._id },
            { $set: { image: newImageData } },
            { new: true }
        );
        res.json(newImageData);

    } catch (err) {
        console.log(err);
        res.status(400).send('Upload Images to cloudinary fail');
    }
};


exports.remove = async (req, res, next) => {
    const { public_id, _id } = req.body;
    await cloudinary.uploader.destroy(public_id);
    const product = await Product.findById(_id);
    const image = product.images.filter(image => image.public_id !== public_id);
    await Product.findByIdAndUpdate(_id, { $set: { images: image } }, { new: true });
    res.json({ status: 'ok' });
}