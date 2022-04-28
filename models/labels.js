const mongoose=require('mongoose');

const labelSchema=mongoose.Schema({
    labels:{
        type:String,
        unique:true,
    },
    project:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Porject'
    }],
    bugs:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Bugs'
    }],
    author:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Author'
    }]
},{
    timestamps:true,
});
const Label=mongoose.model('Label',labelSchema);
module.exports=Label;