const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const cartSchema = new Schema({
    products: [
        {
            product: {
                type: ObjectId,
                ref: "Product"
            },
            image: String,
            count: Number,
            color: String,
            price: Number,

        }
    ],
    cartTotal: Number,
    totalAfterDiscount: Number,
    orderBy: {
        type: ObjectId,
        ref: 'User',
    }

}, { timestamps: true });

module.exports = mongoose.model("Cart", cartSchema);