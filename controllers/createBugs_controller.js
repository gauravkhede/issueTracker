const Bugs=require('../models/bugs');
const Project=require('../models/project');
const Author=require('../models/author');
const { populate } = require('../models/project');

module.exports.createBug=function(req,res){
    
    console.log(req.body.project_id,'....................................................');
    let author_id;
    
    
    Project.findById(req.body.project_id)
    .populate({
        path:'bugs',
        populate:{
            path:'author',
        }
    })
    .exec(function(err,project){
        if(err){ console.log('Error in finding project',err); return; }
        console.log('********************',project);
        Author.find({name:req.body.author})
        .populate('bugs')
        .exec(function(err,author){
            if(err){ console.log('error in finding author',err); return; }
            console.log(author,'author find successfully');
            author_id=author[0]._id;
            console.log('author_id is ',author_id)
            if(author.length==0){
                console.log('Trying to create Author');
                Author.create({
                    name:req.body.author,
                    
                },function(err,newAuthor){
                    if(err){ console.log('Error in creating an author',err); return; }
                    console.log('Author created is ',newAuthor._id);
                    author_id=newAuthor._id;

                });
            }
            Bugs.create({
                title:req.body.title,
                description:req.body.description,
                labels:req.body.labels,
                author:author_id,
                project:req.body.project.id
                
            },function(err,newBug){
                if(err){ console.log('Error in creating a bug',err); return; }
                
                console.log('********************',newBug);
                console.log('finally author is',author);
                console.log('finally project is ',project);
                project.bugs.push(newBug);
                project.save();
                author[0].bugs.push(newBug);
                author[0].save();
                return res.render('project');
            });
        });
        
    });
    
}