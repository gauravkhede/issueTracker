const mongoose=require('mongoose');


const bugsSchema=mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    labels:{
        type:String,
        required:true,
    },
    author:{
        type:String,
        required:true,
    },
    project:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Project',
    }

},{
    timestamps:true
});
const Bugs=mongoose.model('Bugs',bugsSchema);
module.exports=Bugs;