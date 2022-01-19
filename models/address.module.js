const mongoose = require("mongoose")

const addressSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        country:{
            type: String,
            default: 'Egypt'
        },
        city:{
            type: String,
        },
        governate:{
            type: String,
        },
        isdefault:{
            type: Boolean, 
            default: false
        }
    },
    {
        timestamps: true
    }
    
);

module.exports = mongoose.model('Address', addressSchema)