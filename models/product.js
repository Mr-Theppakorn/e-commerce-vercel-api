const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const productSchema = new Schema({
    title: {
        type: String,
        trim: true,
        require: true,
        maxlength: 32,
        text: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        index: true,
    },
    description: {
        type: String,
        require: true,
        maxlength: 2000,
        text: true
    },
    price: {
        type: Number,
        trim: true,
        require: true,
        maxlength: 32,
    },
    category: {
        type: ObjectId,
        ref: "Category"
    },
    subs: [{
        type: ObjectId,
        ref: "Sub"
    }],
    quantity: Number,
    sold: {
        type: Number,
        default: 0
    },
    images: {
        type: Array
    },
    shipping: {
        type: String,
        enum: ["Yes", "No"]
    },
    color: {
        type: String,
        enum: ["Black", "White", "Red", "Green", "Yellow"]
    },
    brand: {
        type: String,
        enum: ["Apple", "Microsoft", "Sony", "Samsung", "Lenovo", "Nintendo"]
    },
    ratings: [
        {
            star: Number,
            comment: String,
            postedBy: { type: ObjectId, ref: "User" },
        }
    ]

}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);