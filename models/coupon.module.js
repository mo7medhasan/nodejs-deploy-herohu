const mongoose = require("mongoose")

const couponSchema = new mongoose.Schema({
    name: {
        type: String, required: true, unique: true
    },
    Rate: {
        type: Number, required: true
    },
    ExpiryDate:{type:Date,default:Date.now},
    userId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],countUsers:{type:Number,default:0}
    , adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    adminName:{type:String,required: true }
}, {
    timestamps: true
});
module.exports = mongoose.model('Coupon', couponSchema)