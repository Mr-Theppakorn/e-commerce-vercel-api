const User = require('../models/user');
const Product = require('../models/product');
const Cart = require('../models/cart');
const Coupon = require('../models/coupon');
const Order = require('../models/order');

exports.userCart = async (req, res, next) => {
    const { cart } = req.body;
    let products = [];
    try {
        const user = await User.findOne({ email: req.user.email });
        let cartExistByThisUser = await Cart.findOne({ orderBy: user._id });


        if (cartExistByThisUser) {
            await Cart.deleteOne({ orderBy: user._id });
        }

        for (let i = 0; i < cart.length; i++) {
            let object = {};
            console.log(cart[i].images[0].url, 'url');
            object.product = cart[i]._id;
            object.image = cart[i].images[0].url;
            object.count = cart[i].count;
            object.color = cart[i].color;

            let { price } = await Product.findById(cart[i]._id).select("price");
            object.price = price;

            products.push(object);
        }

        const cartTotal = products.reduce((total, item) => total + item.price * item.count, 0);

        let newCart = await new Cart({
            products,
            cartTotal,
            orderBy: user._id
        }).save();

        res.json({ ok: true });
    } catch (err) {
        console.log(err);
        res.status(400).send('Create cart failed');
    }

}

exports.getUsers = async (req, res, next) => {
    try {
        const user = await User.find({});
        res.json(user.length);
    } catch (err) {
        console.log(err);
        res.status(400).send('get users failed');
    }

}

exports.getCart = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.user.email });
        let cart = await Cart.findOne({ orderBy: user._id })
            .populate('products.product', '_id title price');
        res.json(cart);
    } catch (err) {
        console.log(err);
        res.status(400).send('get cart failed');
    }

}

exports.removeCart = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.user.email });
        let cart = await Cart.findOneAndRemove({ orderBy: user._id })
            .populate('products.product', '_id title price');
        res.json(cart);
    } catch (err) {
        console.log(err);
        res.status(400).send('get cart failed');
    }

}

exports.userAddress = async (req, res, next) => {
    try {
        const user = await User.findOneAndUpdate({ email: req.user.email }, { address: req.body.address });
        res.json({ ok: true });
    } catch (err) {
        console.log(err);
        res.status(400).send('get cart failed');
    }

}

exports.applyCoupon = async (req, res, next) => {
    const { coupon } = req.body;
    try {
        console.log(coupon);
        const validCoupon = await Coupon.findOne({ name: coupon });

        if (validCoupon === null) {
            return res.json({ err: "Invalid Coupon!" });
        }
        const user = await User.findOne({ email: req.user.email });

        let { products, cartTotal } = await Cart.findOne({ orderBy: user._id })
            .populate("products.product", "_id title price");

        let totalAfterDiscount = (cartTotal - (cartTotal * validCoupon.discount) / 100).toFixed(2);
        console.log(totalAfterDiscount);
        const sum = await Cart.findOneAndUpdate({ orderBy: user._id }, { totalAfterDiscount }, { new: true });

        console.log(sum, 'here');
        res.json({ ok: true, totalAfterDiscount });
    } catch (err) {
        console.log(err);
        res.status(400).send('get cart failed');
    }

}

exports.createOrder = async (req, res, next) => {
    const { paymentIntent } = req.body.stripeResponse;
    try {
        const user = await User.findOne({ email: req.user.email });
        let { products } = await Cart.findOne({ orderBy: user._id });

        const newOrder = await new Order({
            products,
            paymentIntent,
            orderBy: user._id
        }).save();

        let sold = products.map((item) => {
            return {
                updateOne: {
                    filter: { _id: item.product._id },
                    update: { $inc: { quantity: -item.count, sold: +item.count } }
                }
            }
        });

        let updated = await Product.bulkWrite(sold, {});

        res.json({ ok: true });
    } catch (err) {
        console.log(err);
        res.status(400).send('create order failed');
    }

}

exports.getOrder = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.user.email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const order = await Order.find({ orderBy: user._id }, { status: 'complete' }).populate('products.product');
        res.json(order);
    } catch (err) {
        console.log(err);
        res.status(400).send('get cart failed');
    }

}

exports.addWishlist = async (req, res, next) => {
    const { productId } = req.body;
    try {
        const user = await User.findOneAndUpdate({ email: req.user.email }, { $addToSet: { wishlist: productId } }, { new: true });
        res.json({ ok: true });
    } catch (err) {
        console.log(err);
        res.status(400).send('get cart failed');
    }

}
exports.getWishlist = async (req, res, next) => {
    try {
        const wishlist = await User.findOne({ email: req.user.email }).select('wishlist').populate('wishlist');

        res.json(wishlist);
    } catch (err) {
        console.log(err);
        res.status(400).send('get cart failed');
    }

}
exports.removedWishlist = async (req, res, next) => {
    const { productId } = req.body;
    try {
        const wishlist = await User.findOneAndUpdate({ email: req.user.email }, { $pull: { wishlist: productId } });

        res.json({ ok: true });
    } catch (err) {
        console.log(err);
        res.status(400).send('get cart failed');
    }

}
