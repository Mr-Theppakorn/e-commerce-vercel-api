const Category = require('../models/category');
const Product = require('../models/product');
const Sub = require('../models/sub');
const slugify = require('slugify');

exports.createCategory = async (req, res, next) => {
    const name = req.body.category;
    try {
        const category = await new Category({ name, slug: slugify(name) });
        category.save();
        res.json(category);
    } catch (err) {
        console.log(err);
        res.status(400).send('Create category failed');
    }
}

exports.getCategoryList = async (req, res, next) => {
    try {
        const category = await Category.find().exec();
        res.json(category);
    } catch (err) {
        console.log(err);
        res.status(400).send('Get category failed');
    }
}

exports.getCategoryOne = async (req, res, next) => {
    try {
        const category = await Category.findOne({ slug: req.params.slug })
        const products = await Product.find({ category: category })
            .populate('category')
        res.json({ category, products });
    } catch (err) {
        console.log(err);
        res.status(400).send('Get category failed');
    }
}

exports.getCategorySub = async (req, res, next) => {
    try {
        const { _id } = req.params;
        const categorySub = await Sub.find({ parent: _id });
        return res.json(categorySub);
    } catch (err) {
        return res.status(400).send(`Get category failed: ${err.message}`);
    }
};

exports.updateCategory = async (req, res, next) => {
    const { _id, name } = req.body;
    try {
        const updatedCategory = await Category.findOneAndUpdate({ _id }, { name, slug: slugify(name) }, { new: true });
        res.json(updatedCategory);
    } catch (err) {
        console.log(err);
        res.status(400).send('Update category failed');
    }
}

exports.deleteCategory = async (req, res, next) => {
    try {
        const deleted = await Category.findOneAndDelete({ _id: req.params.slug })
        res.json(deleted);
    } catch (err) {
        console.log(err);
        res.status(400).send('Delete category failed');
    }
}

