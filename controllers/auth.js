const User = require('../models/user');
const Order = require('../models/order');

exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.user.email });
        res.json(user);
    } catch (error) {
        console.log(error);
    }
}

exports.updateUser = async (req, res, next) => {
    const { text } = req.body;
    try {
        const user = await User.findOneAndUpdate({ email: req.user.email }, { name: text }, { new: true });
        res.json(user);
    } catch (error) {
        console.log(error);
    }
}

exports.createUser = async (req, res, next) => {
    const { name, picture, email } = req.user;
    try {

        const user = await User.findOneAndUpdate({ email }, { name, picture }, { new: true });
        if (user) {
            res.json(user);
        } else {
            const newUser = await new User({
                email,
                name,
                picture
            });
            newUser.save();
            res.json(newUser);
        }
    } catch (error) {
        console.log(error);
    }
}

exports.getOrder = async (req, res, next) => {
    try {

        const orders = await Order.find({})
            .sort("-createdAt")
            .populate("products.product");
        res.json(orders);

    } catch (error) {
        console.log(error);
    }
}

exports.orderStatus = async (req, res, next) => {
    const { orderId, orderStatus } = req.body;
    try {
        const orderUpdated = await Order.findOneAndUpdate(
            orderId,
            { orderStatus },
            { new: true }
        )
        res.json(orderUpdated);

    } catch (error) {
        console.log(error);
    }
}