const express=require('express');
const router=express.Router();
const homeController=require('../controllers/home_controller');
const createBugsController=require('../controllers/createBugs_controller');

router.get('/',homeController.home);
router.post('/project',homeController.projects);
router.post('/createBug',createBugsController.createBug);
router.get('/project',homeController.projects);
router.post('/filter',homeController.filterPage);
router.post('/filterByProject',homeController.filterProject);
module.exports=router;