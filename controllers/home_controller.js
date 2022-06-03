const Author = require('../models/author');
const Bugs = require('../models/bugs');
const Label = require('../models/labels');
const Project=require('../models/project');

//  To render home page of our issueTracker 
module.exports.home=function(req,res){
    // find all projects 
    Project.find({})
    .populate('author')
    .populate('labels')
    .populate({
        path:'bugs',
        populate:[{
            path:'labels',
        },{
            path:'author',
        }]
    })
    .exec(function(err,project){
        // find all labels from labels schema 
        Label.find({},function(err,allLabels){
            if(err){ console.log('Error in fetching labels from database'); return; }
            return res.render('home',{
                    title:'Through Controller | IssueTracker',
                    projects:project,
                    labels:allLabels
                });
        })
        
    });
    
}


module.exports.projects=function(req,res){

       
    
        // console.log(req.body);
        // we will find request project through its id 
        Project.findById(req.body.project_id)
        .populate({
            path:'bugs',
            populate:[{
                path:'labels',
            },{
                path:'author',
            }]
        })
        
        .populate('author')
        .exec(function(err,project){
            
            // we will find all authors and send it to project.ejs page 
            Author.find({},function(err,allAuthors){
                if(err){ console.log('error in finding all authors for filtering',err); return; }
                console.log('all project bugs are:',project.bugs);
                return res.render('project',{
                    name:project.name,
                    project_id:req.body.project_id,
                    bugs:project.bugs,
                    all_Authors:allAuthors,
                    
                });
            })
            
            
        });
        
        
   
}

module.exports.filter=function(req,res){
    // console.log(req.body.filterByAuthor,'is the filterByAuthor value');
    // console.log(req.body.project_id,' is the project id');

    Author.find({name:req.body.filterByAuthor}, {project:1})
    .populate('project')
    .exec(function(err,project){
        console.log(project[0].project[0].name,'is the finding of the project');
    });
    // filter our page by author name so we will find author then throw it to result page that this all projects belong to this author 
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
module.exports.filterProjectByAuthor=function(req,res){
        Author.findById(req.body.project_author)
        .populate('project')
        .exec(function(err,project_author){
            // console.log(project_author,' is the author of the project');
        return res.render('filterByProjectName',{
            projects:project_author.project
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
//  To search a project by its name and it's description 
module.exports.filterProject=function(req,res){
    
    if(req.body.project_description=='' && req.body.project_name!==''){
    // if projects description is empty and name is not empty linear search to all projects using requested name 
    Project.find({name:req.body.project_name})
    .populate('author')
    .exec(function(err,project){
        console.log(project);
        return res.render('filterByProjectName',{
            projects:project,
        });
    });
    }
    else if(req.body.project_name=='' && req.body.project_description!==''){
    // if project name is null and we just have to search via project description only 
    
    Project.find({description:req.body.project_description})
    .populate('author')
    .exec(function(err,project){
        
        return res.render('filterByProjectName',{
            projects:project,
        });
    });
    }
    else if(req.body.name!=='' && req.body.project_description!==''){
    //  if we have both requested name and description then we have to search Project with both conditions 
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
// to create a function for this.multipleFilter functionality 
module.exports.multipleFilter=function(req,res){
   console.log('project_bug',req.body.project_bug);
//    find all projects 
   Project.find({})
   .populate({
    path:'bugs',
    populate:{
        path:'author',
    }
        })
    .populate('labels')
    .exec(function(err,allProjects){
        if(err){ console.log('error in finding projects',err); return; }
        // console.log(allProjects[0],' is the allprojects[0]');
        
        let projectArray=[];
        // lets take projects one by one 
        for(let p of allProjects){
        // variable b refers that bug having requested bug title found and then under this bugs we will be searching for labels
        let b=false;
        // if we found a required bug with bug title then under that bug we will look for required label if found than we return
        let l=false;
        //let's go for linear search in bugs of that particular project
        for(let bug of p.bugs){
            if(bug.author.name==req.body.project_bugAuthor){
                console.log(req.body.project_bug,' and bug title is',bug.title);
                console.log(req.body.project_bugAuthor,' and bug title is',bug.author.name);

            }
            
            if(bug.title==req.body.project_bug && bug.author.name==req.body.project_bugAuthor){
                // if we have found the bug with the bug title in our project than set b as true 
                b=true;
                console.log('b is true');
                console.log(p,' is the project');
                if(p.labels.length==0){
                    continue;
                }
                console.log(p,' is the project');
            // searh for all the labels in that particular project 
            for(let label of p.labels){
                console.log(label.labels,' is the label');
                // if we have found the bug with required bug title than only we are looking for labels 
                if(b==true){
                    console.log('label.labels is',label.labels);
                    }
                    console.log(label.labels,' is equal to',req.body.project_label);
                if(label.labels==req.body.project_label){
                    l=true;
                    }
             }
            }
        }
        
    //    if both the bug title and label matches than we are good to throw this project in result 
        if(b==true && l==true){
            projectArray.push(p);
        }
        
    }
    console.log(projectArray,' is the projectArray');
    return res.render('filterByProjectName',{
        projects:projectArray
    });

   })
    
}