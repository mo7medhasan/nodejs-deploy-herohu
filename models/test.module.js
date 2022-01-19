const mongoose = require(`mongoose`)
const testSchema = new  mongoose.Schema({
    image:{
        type:[String]
    },
    name:{
        type:String,
        unique:true
    },
    arName:{
        type:String,
    },
    subCategories:[{
        name:{type:String},
        image:{type:String}
    }],  
    arSubCategories:[{
        arName:{type:String},
        image:{type:String}
    }]  
    
},
{
    timestamps: true
}
);

module.exports = mongoose.model('Tes', testSchema);
