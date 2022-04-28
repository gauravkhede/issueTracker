const Author = require('../models/author');
const Bugs = require('../models/bugs');
const Project=require('../models/project');


module.exports.home=function(req,res){
    Project.find({})
    .populate('author')
    .exec(function(err,project){
        if(err){ console.log('Error in fetching projects from database'); return; }
        return res.render('home',{
            title:'Through Controller | IssueTracker',
            projects:project,
        });
    });
    
}
module.exports.projectFilter=function(req,res){
    console.log(req.body);
}

module.exports.projects=function(req,res){

       
    
        console.log(req.body);
        
        Project.findById(req.body.project_id)
        .populate({
            path:'bugs',
            populate:[{
                path:'author',
            },{
                path:'labels',
            }]
        })
        .populate('author')
        .exec(function(err,project){
            // console.log(project.bugs[0].title,' is the project');
            Author.find({},function(err,allAuthors){
                if(err){ console.log('error in finding all authors for filtering',err); return; }
                return res.render('project',{
                    name:project.name,
                    project_id:req.body.project_id,
                    bugs:project.bugs,
                    all_Authors:allAuthors,
                    
                });
            })
            // return res.render('project',{
            //     name:project.name,
            //     project_id:req.body.project_id,
            //     bugs:project.bugs,
            //     author_sample:project.bugs.author
                
            // });
            
        });
        
        
   
}

module.exports.filter=function(req,res){
    console.log(req.body.filterByAuthor,'is the filterByAuthor value');
    console.log(req.body.project_id,' is the project id');
    Author.find({name:req.body.filterByAuthor}, {project:1})
    .populate('project')
    .exec(function(err,project){
        console.log(project[0].project[0].name,'is the finding of the project');
    });
    Author.find({name:req.body.filterByAuthor})
    .populate('bugs')
    .exec(function(err,author){
        if(err){ console.log('error in finding author through filterByAuthor',err); return; }
        console.log(author,'is the author');
        console.log('author bigs',author[0].bugs);
        return res.render('filter',{
            bugs:author[0].bugs,
            author_name:author[0].name
        })
    })
}
module.exports.filterPage=function(req,res){
    Project.find({_id:req.body.project_id},{bug:1})
    .populate({
        path:'bugs',
        populate:{
            path:'author',
        }
    })
    .exec(function(err,project){
        console.log(project,'is the finding outcome');
        return res.render('filter',{
            bugs:project[0].bugs,
            author_name:req.body.filterByAuthor
        })
    });
}
module.exports.filterProject=function(req,res){
    if(req.body.project_description=='' && req.body.project_name!==''){
    Project.find({name:req.body.project_name})
    .populate('author')
    .exec(function(err,project){
        console.log(project);
        return res.render('filterByProjectName',{
            projects:project,
        });
    });
    }
    else if(req.body.name=='' && req.body.project_description!==''){
    Project.find({description:req.body.project_description})
    .populate('author')
    .exec(function(err,project){
        console.log(project);
        return res.render('filterByProjectName',{
            projects:project,
        });
    });
    }
    else if(req.body.name!=='' && req.body.project_description!==''){
        Project.find({
            "name" : { "$in": req.body.project_name },
            "description" : { "$in": req.body.project_description }
        })
        .exec(function(err,project){
            console.log(project,' findings of project description and name not being null');
            return res.render('filterByProjectName',{
                projects:project,
            })
        });
        
    }else{
        return res.render('filterByProjectName',{
            projects:[]
        });
    }
    
}