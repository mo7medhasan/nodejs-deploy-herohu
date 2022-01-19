// const mongoose = require(`mongoose`)
// const categorySchema = new  mongoose.Schema({
//     image:{
//         type:[String]
//     },
//     name:{
//         type:String
//     },
//     arName:{
//         type:String,
//     },
//     subCategories:[{
//         name:{type:String},
//         image:{type:String}
//     }],  
//     arSubCategories:[{
//         arName:{type:String},
//         image:{type:String}
//     }]  
    
// },
// {
//     timestamps: true
// }
// );

// module.exports = mongoose.model('Category', categorySchema);


const mongoose = require(`mongoose`)
const categorySchema = new  mongoose.Schema({
    image:{
        type:[String]
    },
    name:{
        type:String
    },
    arName:{
        type:String,
    },
    subCategories:[{
        name:{type:String},
        arName:{type:String},
        image:{type:[String]}
    }],  
    // arSubCategories:[{
        
    //     image:{type:String}
    // }]  
    
},  
{
    timestamps: true
}
);

module.exports = mongoose.model('Category', categorySchema);