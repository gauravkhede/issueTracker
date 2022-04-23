const Bugs=require('../models/bugs');
const Project=require('../models/project');

module.exports.createBug=function(req,res){
    
    console.log(req.body.project_id,'....................................................');
    Project.findById(req.body.project_id)
    .populate('bugs')
    .exec(function(err,project){
        if(err){ console.log('Error in finding project',err); return; }
        console.log('********************',project);
        Bugs.create({
            title:req.body.title,
            description:req.body.description,
            labels:req.body.labels,
            author:req.body.author,
            project:req.body.project.id
            
        },function(err,newBug){
            if(err){ console.log('Error in creating a bug',err); return; }
            console.log('********************',newBug);
            project.bugs.push(newBug);
            project.save();
            return res.render('project');
        });
    });
    
}