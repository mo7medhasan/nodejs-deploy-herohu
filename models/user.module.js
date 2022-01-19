const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, unique: true },
    password: { type: String },
    isAdmin: { type: Boolean, default: false, required: true },
    isSeller: { type: Boolean, default: false, required: true },
    shop:{
        shopName: { type: String},
        // logo: { type: String,},
        description: { type: String}
    },
    sotialInfo: {
        google: { type: String },
        twitter: { type: String },
        youtube: { type: String },
        instagram: { type: String }
    },
    // arName: { type: String },
    // username: { type: String },
    // image: { type: String },
    // seller: {
    // name: { type: String, required: true },
    // logo: { type: String, required: true },
    // description: { type: String},
    // rating: { type: Number, default: 0, required: true, min:0,max:5},
    // numReviews: { type: Number, default: 0, required: true },
    // },
    // about: { type: String },
    // birthday: {
    //     year: { type: Number },
    //     month: { type: Number },
    //     day: { type: String }
    // },
    // paymentInfo: {
    //     method: ["cash on delivery", "paypal"],
    //     email: {
    //         type: String,
    //     }
    // }
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', userSchema);