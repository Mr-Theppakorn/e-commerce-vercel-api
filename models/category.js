const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: {
        type: String,
        trim: true,
        require: "Name is required",
        minlength: [3, "too short"],
        maxlength: [32, "too long"],

    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        index: true,
    }

}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);