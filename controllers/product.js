const Product = require('../models/product');
const User = require('../models/user');
const slugify = require('slugify');
const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImagesToCloudinary = async (images) => {
    let uploadedImages = [];
    for (let i = 0; i < images.length; i++) {
        let result = await cloudinary.uploader.upload(images[i], {
            public_id: `${Date.now()}_${i}`,
            resource_type: "auto"
        });
        uploadedImages.push({
            public_id: result.public_id,
            secure_url: result.secure_url
        });
    }
    return uploadedImages;
};

exports.createV2 = async (req, res, next) => {
    const { title, description, color, category, images, price, shipping, subs, quantity } = req.body
    try {
        let uploadedImages = [];
        if (images && images.length > 0) {
            uploadedImages = await uploadImagesToCloudinary(images);
        }
        req.body.slug = slugify(req.body.title);
        const createProduct = await new Product({
            title,
            slug: req.body.slug,
            description,
            color,
            category,
            images: uploadedImages,
            price,
            shipping,
            subs,
            quantity,
        });
        await createProduct.save(); // use await to wait for the database operation to complete
        res.json(createProduct);
    } catch (err) {
        console.log(err);
        res.status(400).send('Create sub category failed');
    }
};


exports.create = async (req, res, next) => {
    try {
        console.log(req.body);
        req.body.slug = slugify(req.body.title);
        const createProduct = await new Product(req.body);
        await createProduct.save();
        res.json(createProduct);
    } catch (err) {
        console.log(err);
        res.status(400).send('Create sub category failed');
    }
}

exports.list = async (req, res) => {
    try {
        const products = await Product.find({})
            .limit(parseInt(req.params.count))
            .populate("category")
            .populate("subs")
            .sort([["createdAt", "desc"]])
            .exec()
        res.json(products);
    } catch (err) {
        console.log(err);
        res.status(400).send('Get sub category failed');
    }
}

exports.list2 = async (req, res, next) => {
    try {
        const { sort, order, page, count } = req.body;
        const currentPage = page || 1;
        const perPage = page ? 8 : 20
        const products = await Product.find({ quantity: { $gte: 1 } })
            .skip((currentPage - 1) * perPage)
            .populate("category")
            .populate("subs")
            .sort([[sort, order]])
            .limit(perPage)
            .exec()
        res.json(products);
    } catch (err) {
        console.log(err);
        res.status(400).send('Get failed');
    }
}

exports.productCount = async (req, res) => {
    let total = await Product.find({}).estimatedDocumentCount()
    res.json(total);
}

exports.read = async (req, res, next) => {
    try {
        const product = await Product.findOne({ _id: req.params._id })
            .populate("category")
            .populate("subs")
            .exec();
        res.json(product);
    } catch (err) {
        console.log(err);
        res.status(400).send('Get sub category failed');
    }
}

exports.listRelated = async (req, res, next) => {
    try {
        const product = await Product.findById({ _id: req.params._id })
        const related = await Product.find({
            _id: { $ne: product._id },
            category: product.category
        }).limit(3).populate('category').populate('subs');
        res.json(related);
    } catch (err) {
        console.log(err);
        res.status(400).send('Get sub category failed');
    }
}

exports.update = async (req, res, next) => {
    const { _id } = req.body;
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const updated = await Product.findOneAndUpdate({ _id }, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        console.log(err);
        res.status(400).send('Update sub category failed');
    }
}

exports.remove = async (req, res, next) => {
    try {

        const deleted = await Product.findOneAndDelete({ _id: req.params.slug })
        res.json(deleted);
    } catch (err) {
        console.log(err);
        res.status(400).send('Delete sub category failed');
    }
}

exports.productStar = async (req, res, next) => {

    try {
        const { star, comment } = req.body;
        console.log(star, comment, "Rating Here");
        const product = await Product.findById({ _id: req.params._id });
        const user = await User.findOne({ email: req.user.email });

        let existingRating = product.ratings.find((i) => i.postedBy.toString() === user._id.toString());

        if (existingRating === undefined) {
            let ratingAdd = await Product.findByIdAndUpdate(product._id, {
                $push: {
                    ratings: {
                        star,
                        comment,
                        postedBy: user._id
                    }
                },
            },
                { new: true }
            );
            res.json(ratingAdd);
        } else {
            let ratingUpdated = await Product.updateOne(
                {
                    ratings: { $elemMatch: existingRating },
                },
                { $set: { "ratings.$.star": star, "ratings.$.comment": comment, } },
                { new: true }
            )
            res.json(ratingUpdated);
        }
    } catch (err) {
        console.log(err);
        res.status(400).send('Delete sub category failed');
    }
}

const handleQuery = async (req, res, text) => {
    try {
        const escapedSearchText = text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'); // Escape special characters
        const products = await Product.find(
            { $text: { $search: `"${escapedSearchText}"` } }
        )
            .populate('category', '_id name')
            .populate('subs', '_id name');

        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
};

const handlePrice = async (req, res, price) => {
    try {
        const products = await Product.find({ price: { $gte: price[0], $lte: price[1] } })
            .populate('category', '_id name')
            .populate('subs', '_id name');
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
};

const handleCategory = async (req, res, category) => {
    try {
        const products = await Product.find({ category })
            .populate('category', '_id name')
            .populate('subs', '_id name');
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
};

const handleSub = async (req, res, subs) => {
    try {
        const products = await Product.find({ subs })
            .populate('category', '_id name')
            .populate('subs', '_id name');
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
};

const handleColor = async (req, res, color) => {
    try {
        const products = await Product.find({ color })
            .populate('category', '_id name')
            .populate('subs', '_id name');
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
};

const handleBrand = async (req, res, brand) => {
    try {
        const products = await Product.find({ brand })
            .populate('category', '_id name')
            .populate('subs', '_id name');
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
};

const handleStar = async (req, res, stars) => {
    try {
        const aggregates = await Product.aggregate([
            {
                $project: {
                    document: "$$ROOT",
                    floorAverage: {
                        $floor: { $avg: "$ratings.star" }
                    },
                },
            },
            { $match: { floorAverage: stars } },
            { $limit: 12 } // Limit the number of aggregated results
        ]);

        const productIds = aggregates.map(agg => agg.document._id);

        const products = await Product.find({ _id: { $in: productIds } })
            .populate('category', '_id name')
            .populate('subs', '_id name');

        res.json(products);
    } catch (error) {
        console.log('Error:', error);
        res.status(500).json({ error: 'An error occurred.' });
    }
};




exports.searchFilters = async (req, res, next) => {
    const { text, price, category, stars, subs, brand, color } = req.body;
    try {
        if (text) {
            await handleQuery(req, res, text);
        }

        if (price !== undefined) {
            await handlePrice(req, res, price);
        }

        if (category) {
            await handleCategory(req, res, category);
        }

        if (stars) {
            await handleStar(req, res, stars);
        }

        if (subs) {
            console.log(subs);
            await handleSub(req, res, subs);
        }

        if (color) {
            console.log(subs);
            await handleColor(req, res, color);
        }
        if (brand) {
            console.log(subs);
            await handleBrand(req, res, brand);
        }

    } catch (err) {
        console.log(err);
        res.status(400).send('Get sub category failed');
    }
}