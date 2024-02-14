const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const fs = require('fs');
const stripe = require('stripe')(process.env.STRIPE_API_SECRET);
const User = require('./models/user');
const Product = require('./models/product');
const Cart = require('./models/cart');
const Order = require('./models/order');
const endpointSecret = "whsec_7de8e5a8ee8343e4cfeb41f68fdb220540647a06dbf09d014d88252b7328627c";

const app = express();


app.post('/webhook', express.raw({ type: 'application/json' }), async (request, response) => {
    const sig = request.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const paymentData = event.data.object;
            const user = await User.findOne({ email: paymentData.metadata.user_email });
            let { products } = await Cart.findOne({ orderBy: user._id });


            const updatedOrder = await Order.findOneAndUpdate({ orderBy: user._id, status: 'open' }, {
                products,
                status: paymentData.status,
                paymentIntent: paymentData,
                orderBy: user._id
            });

            let sold = products.map((item) => {
                return {
                    updateOne: {
                        filter: { _id: item.product._id },
                        update: { $inc: { quantity: -item.count, sold: +item.count } }
                    }
                }
            });

            let updated = await Product.bulkWrite(sold, {});
            // Then define and call a function to handle the event payment_intent.succeeded
            break;
        // ... handle other event types
        case 'checkout.session.async_payment_failed':
            console.log('Payment Failed');
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send('ok');
});

app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "2mb" }));
app.use(cors());

fs.readdirSync("./routes/").map((r) =>
    app.use("/api", require("./routes/" + r))
)

app.get("/test", (req, res) => {
    res.json({
        data: "hello"
    });
})

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,

}).then(() => {
    console.log('DB CONNECTED');
}).catch((err) => {
    console.error('DB ERROR:', err);
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})