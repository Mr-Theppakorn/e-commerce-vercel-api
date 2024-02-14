const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    email: {
        type: String,
        require: true,
        index: true
    },
    role: {
        type: String,
        default: 'user'
    },
    cart: {
        type: Array,
        default: []
    },
    image: {
        public_id: String,
        url: String,
    },
    address: String,
    wishlist: [{ type: ObjectId, ref: 'Product' }],

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);