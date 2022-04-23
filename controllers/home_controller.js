const Project=require('../models/project');


module.exports.home=function(req,res){
    Project.find({},function(err,project){
        if(err){ console.log('Error in fetching projects from database'); return; }
        return res.render('home',{
            title:'Through Controller | IssueTracker',
            projects:project,
        });
    });
    
}
module.exports.projects=function(req,res){
    
        console.log(req.body);
        Project.findById(req.body.project_id)
        .populate('bugs')
        .exec(function(err,project){
            // console.log(project.bugs[0].title,' is the project');
            return res.render('project',{
                name:project.name,
                project_id:req.body.project_id,
                bugs:project.bugs,
            });
            
        });
        
        
   
}
module.exports.projectPage=function(req,res){
    return res.render('project',{
        name:req.body.name,
        project_id:req.body.project_id,
        bugs:project.bugs,
        
    });
}