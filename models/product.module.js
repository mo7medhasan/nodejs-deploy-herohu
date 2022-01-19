const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        arname: { type: String, required: true },/////
        imagePath: { type: [String], required: true },
        brand: { type: String, required: true },
        category: { type: String, required: true },
        arcategory: { type: String, required: true },////
        subcategory: { type: String},
        arsubcategory: {type: String},
        ModelId: {type: mongoose.Schema.Types.ObjectId, ref: 'Model' },
        description: { type: String },
        ardescription: { type: String },//////
        priceafterdiscount: { type: Number },
        discount: { type: Number ,default: 0},
        price: { type: Number },
        countInStock: { type: Number, default: 1 },
        ratings: { type: Number, default: 0 },
        numReviews: { type: Number, default: 0 },
        reviews: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                },
                name: {
                    type: String
                },
                rating: {
                    type: Number,
                    min:1,
                    max:5
                },
                comment: {
                    type: String
                }
            }
        ],
        sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        // videosPath:{type:[String], required: true},
    },
    {
        timestamps: true,
    }
);


module.exports = mongoose.model('Product', productSchema);