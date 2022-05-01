const mongoose=require('mongoose');
const projectSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Author',
        required:true
    },
    bugs:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Bugs',
    }],
    labels:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Label'
    }]

},{
    timestamps:true,
});
const Project=mongoose.model('Project',projectSchema);
module.exports=Project;