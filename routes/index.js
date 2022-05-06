const express=require('express');
const Label=require('../models/labels');
const router=express.Router();
const homeController=require('../controllers/home_controller');
const createBugsController=require('../controllers/createBugs_controller');
var allLabels=Label.find({});
router.get('/',homeController.home);
router.post('/project',homeController.projects);
router.post('/createBug',createBugsController.createBug);
router.get('/project',homeController.projects);
router.post('/filter',homeController.filterPage);
router.post('/filterByProjectAuthor',homeController.filterProjectByAuthor);
router.post('/filterByProject',homeController.filterProject);
router.post('/multipleFilter',homeController.multipleFilter);
router.get('/autocomplete/',function(req,res,next){
    var regex=new RegExp(req.query['term'],'i');
    var labelFilter=Label.find({labels:regex},{'labels':1}).sort({'updatedAt':-1}).sort({'createdAt':-1}).limit(20);
    labelFilter.exec(function(err,data){
        console.log(data,'data ye aaraha hai');
        var result=[];
        if(!err){
            if(data && data.length && data.length>0){
                data.forEach(user=>{
                    let obj={
                        id:user._id,
                        label:user.labels
                    };
                    result.push(obj);

                });
            }
            console.log(result,' ye result ke yaha tk aaraha hai')
            res.jsonp(result);
        }
    })
})
module.exports=router;