const { urlencoded } = require('express');
const express=require('express');
const db=require('./config/mongoose');
const Project=require('./models/project');
const Bugs=require('./models/bugs');
const Author=require('./models/author');
const app=express();
var http=require('http');
var path=require('path');
const res = require('express/lib/response');
const req = require('express/lib/request');
var port=8000;


app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded());
app.use(express.static('assets'));
app.use('/',require('./routes'));

// app.get('/',function(req,res){
//     Project.find({},function(err,project){
//         if(err){ console.log('Error in fetching projects from database'); return; }
//         return res.render('home',{
//             title:'Home | IssueTracker',
//             projects:project,
//         });
//     })
// });
app.post('/createProject',function(req,res){
    Author.find({name:req.body.author},function(err,new_author){
        console.log(new_author.length,' is the length of new_author');
        if(new_author.length==0){
            console.log('inside');
            Author.create({
                name:req.body.author,
            },function(err,newAuthor){
                if(err){ console.log('Error in Author creation',err); return; }
                console.log(newAuthor.name,'is newAuthor')
                Project.create({
                    name:req.body.name,
                    description:req.body.description,
                    author:newAuthor._id,
                },function(err,newProject){
                    if(err){ console.log('error in creating project',err); return; }
                    console.log('new Project details:',newProject);
                    console.log(newAuthor,'is newAuthor')
                    return res.redirect('back');
                });
 
            });

        }
        else{
            console.log('new_author name',new_author[0].name);
            Project.create({
            name:req.body.name,
            description:req.body.description,
            author:new_author[0]._id,
        },function(err,newProject){
            if(err){ console.log('error in creating project',err); return; }
            console.log('new Project details:',newProject);
            new_author[0].project.push(newProject);
            new_author[0].save();
            return res.redirect('back');
        });
        }
    });
    // Project.create({
    //     name:req.body.name,
    //     description:req.body.description,
    //     author:req.body.author,
    // },function(err,newProject){
    //     if(err){ console.log('error in creating project',err); return; }
    //     console.log('new Project details:',newProject);
    //     return res.render('project');
    // });
});


app.listen(port,function(err){
    if(err){
        console.log(err);
        return;
    }
    console.log('Server is up and running on port',port);
});