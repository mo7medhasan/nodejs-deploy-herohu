
const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
        orderItems: [{
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number },
            price: { type: Number },
            sellerId:{ type:String}
        }],
        shippingAddress: {
            country: { type: String },
            fullName: { type: String },
            city: { type: String },
            phone: { type: Number },
            governate: { type: String }
        },
        paymentmethod: {
            type: String,
            default: 'CashOnDelivery'
        },
        shippingPrice: { type: Number },
        taxPrice: { type: Number },
        totalPrice: { type: Number },
        isPaid: { type: Boolean, default: false },
        isDelivered: { type: Boolean, default: false },
        isCancelled: { type: Boolean, default: false },
        // sellerId: { type: mongoose.Schema.Types.ObjectID, ref: 'User' },
    },
    {
        timestamps: true,
    }
);
module.exports = mongoose.model('Order', orderSchema);