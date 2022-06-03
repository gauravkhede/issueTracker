const mongoose=require('mongoose');
// gaurav
// Bt4qxnbYMolS3lol
// mongodb+srv://gaurav:<password>@cluster0.0tjt1.mongodb.net/?retryWrites=true&w=majority
mongoose.connect('mongodb+srv://gaurav:Bt4qxnbYMolS3lol@cluster0.0tjt1.mongodb.net/issueTracker_db?retryWrites=true');
const db= mongoose.connection;
db.on('error',console.error.bind(console,'error connecting to db'));
db.once('open',function(){
    console.log('connection with database is successfull');
});