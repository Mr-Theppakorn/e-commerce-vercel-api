const User = require('../models/user');
const Cart = require('../models/cart');
const Order = require('../models/order');
const stripe = require('stripe')(process.env.STRIPE_API_SECRET);

exports.createPaymentSession = async (req, res, next) => {
    const { products } = req.body;

    try {
        const user = await User.findOne({ email: req.user.email });
        const productItems = products.map((product) => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: product.product.title,
                    images: [product.image],
                },
                unit_amount: product.price * 100,
            },
            quantity: product.count,
        }));

        const existingOrder = await Order.findOne({ orderBy: user._id, status: 'open' });

        let newOrder;

        if (!existingOrder) {
            newOrder = await new Order({
                status: 'open',
                paymentIntent: {},
                orderBy: user._id
            }).save();
        } else {

            newOrder = existingOrder;
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: productItems,
            mode: "payment",
            success_url: `https://e-commerce-client-liard.vercel.app/&order_id=${newOrder._id}`,
            cancel_url: `https://e-commerce-client-liard.vercel.app/`,
            metadata: {
                user_email: req.user.email
            },
        });

        return res.json(session);
    } catch (err) {
        console.log(err);
        res.status(400).send('Create sub category failed');
    }
}

exports.createPayment = async (req, res, next) => {
    const { couponApplied } = req.body;
    console.log(couponApplied);
    try {
        const user = await User.findOne({ email: req.user.email });
        const { cartTotal, totalAfterDiscount } = await Cart.findOne({ orderBy: user._id });

        let realTotal = 0;

        if (couponApplied && totalAfterDiscount) {
            realTotal = Math.round(totalAfterDiscount)
        } else {
            realTotal = Math.round(cartTotal)
        }

        const payment = await stripe.paymentIntents.create({
            amount: realTotal,
            currency: 'USD',
        });
        res.send({ clientSecret: payment.client_secret, cartTotal, totalAfterDiscount, payable: realTotal })
    } catch (err) {
        console.log(err);
        res.status(400).send('Create sub category failed');
    }
}