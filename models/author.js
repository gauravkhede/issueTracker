const mongoose=require('mongoose');
const Project=require('../models/project');
const Bugs=require('../models/bugs');

const authorSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
    },
    project:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Project',
    }],
    bugs:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Bugs',
    }]
},{
    timestamps:true,
});
const Author=mongoose.model('Author',authorSchema);
module.exports=Author;