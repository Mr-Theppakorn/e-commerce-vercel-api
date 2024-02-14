const Sub = require('../models/sub');
const Product = require('../models/product');
const slugify = require('slugify');


exports.create = async (req, res, next) => {
    const { sub, parent } = req.body;
    try {
        const createSub = await new Sub({ name: sub, slug: slugify(sub), parent });
        createSub.save();
        res.json(createSub);
    } catch (err) {
        console.log(err);
        res.status(400).send('Create sub category failed');
    }
}

exports.list = async (req, res, next) => {
    try {
        const subs = await Sub.find().exec();
        res.json(subs);
    } catch (err) {
        console.log(err);
        res.status(400).send('Get category failed');
    }
}

exports.listProducts = async (req, res, next) => {
    try {
        const sub = await Sub.findOne({ slug: req.params.slug })
        const products = await Product.find({ subs: sub })
            .populate('subs')
        console.log(products);
        res.json({ sub, products });
    } catch (err) {
        console.log(err);
        res.status(400).send('Get category failed');
    }
}

exports.read = async (req, res, next) => {
    try {
        const sup = await Sub.findOne({ slug: req.params.slug }).exec();
        res.json(sup);
    } catch (err) {
        console.log(err);
        res.status(400).send('Get sub category failed');
    }
}

exports.update = async (req, res, next) => {
    const { _id, name } = req.body;
    try {
        const updatedSub = await Sub.findOneAndUpdate({ _id }, { name, slug: slugify(name) }, { new: true });
        res.json(updatedSub);
    } catch (err) {
        console.log(err);
        res.status(400).send('Update sub category failed');
    }
}

exports.remove = async (req, res, next) => {
    try {
        const deleted = await Sub.findOneAndDelete({ _id: req.params.slug })
        res.json(deleted);
    } catch (err) {
        console.log(err);
        res.status(400).send('Delete sub category failed');
    }
}