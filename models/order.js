const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const orderSchema = new Schema({
    products: [
        {
            product: {
                type: ObjectId,
                ref: "Product"
            },
            count: Number,
            color: String,
        },
    ],
    paymentIntent: {},
    status: String,
    orderStatus: {
        type: String,
        default: 'Not Processed',
        enum: [
            "Not Processed",
            "Processing",
            "Dispatched",
            "Cancelled",
            "Completed",
        ]
    },
    orderBy: {
        type: ObjectId,
        ref: 'User',
    }

}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);