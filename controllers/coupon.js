const Coupon = require('../models/coupon');

exports.create = async (req, res, next) => {
    const { name, expiry, discount } = req.body;
    try {
        const createCoupon = await new Coupon({ name, expiry, discount });
        await createCoupon.save();
        res.json(createCoupon);
    } catch (err) {
        console.log(err);
        res.status(400).send('Create Coupon failed');
    }
}

exports.remove = async (req, res, next) => {
    try {
        const coupon = await Coupon.findByIdAndDelete(req.params.couponId);
        res.json(coupon);
    } catch (err) {
        console.log(err);
        res.status(400).send('Remove coupon failed');
    }
}

exports.list = async (req, res, next) => {
    try {
        const list = await Coupon.find({}).sort({ createdAt: -1 });
        res.json(list);
    } catch (err) {
        console.log(err);
        res.status(400).send('Get coupon failed');
    }
}