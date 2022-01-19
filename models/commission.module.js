const mongoose = require(`mongoose`)
const CommissionSchema = new  mongoose.Schema({
    sellerId:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    commission:{type:Number}
},
{
    timestamps: true
}
);

module.exports = mongoose.model('Commission', CommissionSchema);