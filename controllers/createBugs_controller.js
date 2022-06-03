const Bugs=require('../models/bugs');
const Project=require('../models/project');
const Author=require('../models/author');
const { populate } = require('../models/project');
const Label = require('../models/labels');
//  Function to cerate a bug 
module.exports.createBug=function(req,res){
    
    console.log(req.body.project_id,'....................................................');
    let author_id;
    let label_id;
    
    // we have to find a project in which we want to create a bug 
    Project.findById(req.body.project_id)
    .populate({
        path:'bugs',
        populate:[{
            path:'author',
        },{
            path:'labels'
        }]
    })
    .exec(function(err,project){
        if(err){ console.log('Error in finding project',err); return; }
        console.log('********************',project);
        Author.find({name:req.body.author})
        .populate({
            path:'bugs',
            populate:{
                path:'labels'
            }
        })
        .exec(function(err,author){
            
            if(err){ console.log('error in finding author',err); return; }
            console.log(author,'author find successfully');
            // If author is not present we have to create author and then we have to create a bug 
            if(author.length==0){
                console.log('Trying to create Author');
                Author.create({
                    name:req.body.author,
                    
                },function(err,newAuthor){
                    if(err){ console.log('Error in creating an author',err); return; }
                    console.log('Author created is ',newAuthor._id);

                    Label.find({labels:req.body.labels},function(err,labelsfound){
                        if(err){ console.log('error in finding labels',err); return; }
                        console.log('labelsfound.length is',labelsfound.length);
                        // if label is not already present we have to create a label for the same 
                        if(labelsfound.length!=0){
                            
                            label_id=labelsfound[0]._id;
                            console.log('newAuthor created and label_id is',label_id);
                        }
                        if(labelsfound.length==0){
                            Label.create({
                                labels:req.body.labels,

                          },function(err,newLabel){
                              if(err){ console.log('error in creating label',err); return; }
                              label_id=newLabel._id;
                            //   pushed that label into project so that we can use it for filter 
                              project.labels.push(newLabel);
                              console.log(project.labels,' is the labels present in the project');
                            //   project.save();
                              author_id=newAuthor._id;
                              console.log('................................................',label_id);
                        //    and then we create BUG  
                          Bugs.create({
                            title:req.body.title,
                            description:req.body.description,
                            labels:label_id,
                            author:author_id,
                            project:req.body.project.id
                        
                          },function(err,newBug){
                            if(err){ console.log('Error in creating a bug',err); return; }
                        
                                console.log('********************',newBug);
                                console.log('finally author is',author);
                                console.log('finally project is ',project);
                                project.bugs.push(newBug);
                                project.save();
                                newAuthor.bugs.push(newBug);
                                newAuthor.save();
                                newLabel.project.push(project);
                                newLabel.author.push(newAuthor);
                                newLabel.bugs.push(newBug);
                                newLabel.save();
                                // newBug.labels.push(newLabel);
                                // newBug.save();
                                return res.redirect('/');
                            });
                              
                          });
                        }
                        else{
                             
                            author_id=newAuthor._id;
                            // to create a bug when label is already present 
                            Bugs.create({
                                title:req.body.title,
                                description:req.body.description,
                                labels:label_id,
                                author:author_id,
                                project:req.body.project.id
                        
                                },function(err,newBug){
                                        if(err){ console.log('Error in creating a bug',err); return; }
                                        console.log('finally labels found is',labelsfound[0])
                                        console.log('********************',newBug);
                                        console.log('finally author is',author);
                                        console.log('finally project is ',project);
                                        // we have to push new bug to project 
                                        project.bugs.push(newBug);
                                        // we have to push label into that particular project 
                                        project.labels.push(labelsfound[0]);
                                        project.save();
                                        newAuthor.bugs.push(newBug);
                                         newAuthor.save();
                                        //  we have to push project and newly created author and newly created bug into label it helps in filtering 
                                        labelsfound[0].project.push(project);
                                        labelsfound[0].author.push(newAuthor);
                                        labelsfound[0].bugs.push(newBug);
                                        labelsfound[0].save();
                                        return res.redirect('/');
                    });
                                }
                        
                    });
                    

                });
            }
            else{
                // if author is already present in our schema we will find label
                Label.find({labels:req.body.labels},function(err,labelsfound){
                    if(err){ console.log('error in finding labels',err); return; }
                    if(labelsfound.length!=0){
                        label_id=labelsfound[0]._id;
                        console.log('author already present and label also already present so label_id is',label_id);
                    }
                    // if author is present and label is not present in our database then we will create labels 
                    if(labelsfound.length==0){
                        Label.create({
                            labels:req.body.labels,

                      },function(err,newLabel){
                          if(err){ console.log('error in creating label',err); return; }
                          label_id=newLabel._id;
                        
                          author_id=author[0]._id;
                console.log('author_id is ',author_id);
                Bugs.create({
                    title:req.body.title,
                    description:req.body.description,
                    labels:label_id,
                    author:author_id,
                    project:req.body.project.id
                    
                },function(err,newBug){
                    if(err){ console.log('Error in creating a bug',err); return; }
                    
                    console.log('********************',newBug);
                    console.log('finally author is',author);
                    console.log('finally project is ',project);
                    project.bugs.push(newBug);
                    project.labels.push(newLabel);
                    project.save();
                    author[0].bugs.push(newBug);
                    author[0].save();
                    newLabel.author.push(author[0]);
                    newLabel.project.push(project);
                    newLabel.bugs.push(newBug);
                    newLabel.save();
                    return res.redirect('/');
                });
                      });
                    }
                    else{
                        // if we have labels in our database we will not be creating the label with same title so we use existing one 
                    label_id=labelsfound[0]._id;
                    author_id=author[0]._id;
                console.log('author_id is ',author_id);
                // to create a bug 
                Bugs.create({
                    title:req.body.title,
                    description:req.body.description,
                    labels:label_id,
                    author:author_id,
                    project:req.body.project.id
                    
                },function(err,newBug){
                    if(err){ console.log('Error in creating a bug',err); return; }
                    
                    console.log('********************',newBug);
                    console.log('finally author is',author);
                    console.log('finally the labelsfound us ',labelsfound);
                    console.log('finally project is ',project);
                    project.bugs.push(newBug);
                    project.labels.push(labelsfound[0]);
                    project.save();
                    author[0].bugs.push(newBug);
                    author[0].save();
                    //  we have to push project and already existing author and newly created bug into label it helps in filtering 
                    labelsfound[0].project.push(project);
                    labelsfound[0].author.push(author[0]);
                    labelsfound[0].bugs.push(newBug);
                    labelsfound[0].save();
                    return res.redirect('/');
                });
                            }

                });
                
            }
            
        });
        
    });
    
}