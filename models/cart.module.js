const mongoose = require("mongoose")
const cartSchema = new mongoose.Schema(
    {
        items: [{
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
            quantity: {
                type: Number,
                required: true,
                min: [1, 'Quantity can not be less then 1.'],
                default: 1
            },
            price:{type:Number, required: true},
            sellerId: {type:Object}
        }],
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        totalCount: {
            type: Number
        },
        totalPrice:{
            type: Number           
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("Cart",cartSchema);