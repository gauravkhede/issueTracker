const mongoose=require('mongoose');
mongoose.connect('mongodb://localhost/issueTracker_db');
const db= mongoose.connection;
db.on('error',console.error.bind(console,'error connecting to db'));
db.once('open',function(){
    console.log('connection with database is successfull');
});