const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const couponSchema = new Schema({
    name: {
        type: String,
        trim: true,
        unique: true,
        uppercase: true,
        require: 'Name is required',
        minlength: [6, "Too short"],
        maxlength: [12, "Too long"],
    },
    expiry: {
        type: Date,
        required: true,
    },
    discount: {
        type: Number,
        required: true
    }

}, { timestamps: true });

module.exports = mongoose.model("Coupon", couponSchema);