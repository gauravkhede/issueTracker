const { urlencoded } = require('express');
//importing express
const express=require('express');
// importing database
const db=require('./config/mongoose');
// import Schemas 
const Project=require('./models/project');
const Bugs=require('./models/bugs');
const Author=require('./models/author');
const app=express();
var http=require('http');
var path=require('path');
const res = require('express/lib/response');
const req = require('express/lib/request');
var port=8000;

// setting up our view engine
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded());
app.use(express.static('assets'));
app.use('/',require('./routes'));

// post request for creating a page 
app.post('/createProject',function(req,res){
    //as this is not an async function so finding author
    Author.find({name:req.body.author},function(err,new_author){
        console.log(new_author.length,' is the length of new_author');
        // if author doesn't exist create one
        if(new_author.length==0){
            console.log('inside');
            Author.create({
                name:req.body.author,
            },function(err,newAuthor){
                if(err){ console.log('Error in Author creation',err); return; }
                console.log(newAuthor.name,'is newAuthor')
                // create project
                Project.create({
                    name:req.body.name,
                    description:req.body.description,
                    author:newAuthor._id,
                },function(err,newProject){
                    if(err){ console.log('error in creating project',err); return; }
                    console.log('new Project details:',newProject);
                    console.log(newAuthor,'is newAuthor')
                    newAuthor.project.push(newProject);
                    newAuthor.save();

                    return res.redirect('back');
                });
 
            });

        }
        else{
            console.log('new_author name',new_author[0].name);
            // if author already exist create project without creating author 
            Project.create({
            name:req.body.name,
            description:req.body.description,
            author:new_author[0]._id,
        },function(err,newProject){
            if(err){ console.log('error in creating project',err); return; }
            console.log('new Project details:',newProject);
            // push project into authors document 
            new_author[0].project.push(newProject);
            new_author[0].save();
            return res.redirect('back');
        });
        }
    });
    
});


app.listen(process.env.PORT || port,function(err){
    if(err){
        console.log(err);
        return;
    }
    console.log('Server is up and running on port',port);
});