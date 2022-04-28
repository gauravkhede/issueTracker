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
        type:mongoose.Schema.Types.ObjectId,
        ref:'Label'
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Author',
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