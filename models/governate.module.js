const mongoose = require(`mongoose`)
const governateSchema = new  mongoose.Schema({
    ctryName:{
        type:String
    },
    name:{
        type:String
    },
    arCtryName:{
        type:String
    },
    arName:{
        type:String
    }
},
{
    timestamps: true
}
);

module.exports = mongoose.model('Governate', governateSchema);