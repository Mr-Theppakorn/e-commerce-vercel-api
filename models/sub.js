const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const subSchema = new Schema({
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
    },
    parent: { type: ObjectId, ref: "Category", required: true }


}, { timestamps: true });

module.exports = mongoose.model('Sub', subSchema);