const mongoose = require('mongoose');


const connectDB = async () => {
   await mongoose.connect('mongodb+srv://om_panchal1301:DA3NJVp2dXhnaN8b@devtinder.kfip0p0.mongodb.net/');
  
}

connectDB().then(()=>{
    console.log('Connected to MongoDB');
}).catch((err)=>{
    console.log('Error connecting to MongoDB', err);
})



