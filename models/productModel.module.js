const mongoose = require(`mongoose`)
const ElecmodelSchema = new  mongoose.Schema({
   model:{type:[mongoose.Schema.Types.Mixed]}
},
{
    timestamps: true
}
);

module.exports = mongoose.model('Model', ElecmodelSchema);