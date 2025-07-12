const app = express(); // create an express application


// this will match with get methods only


app.get('/user/:id/:password', (req, res)=>{
    console.log(req.query); // this will give the query parameters /http://localhost:3000/user?userID=1001&pass=abc@123
    console.log(req.params); // this will give the path parameters /http://localhost:3000/user/1001/abc@123
    res.send({
        name: 'John',
        age: 20,
        city: 'New York'
    }); // send a response to the client
});


app.get("/abc", (req, res)=>{
    res.send({
        name: 'Abc',
        age: 120,
        city: 'xyz'
    }); // send a response to the client
});


app.post('/user', (req, res)=>{
    res.send('user created'); // send a response to the client
});


// order of routes matters
// this will match with all http methods

app.use('/hello/2', (req, res)=>{
    res.send('abara ka dabra'); // send a response to the client
});

app.use("/hello", (req, res)=>{
    res.send('hello from server'); // send a response to the client
});

app.use("/", (req, res)=>{
    res.send('Home page from server'); // send a response to the client
});




app.listen(3000, () => {
    console.log('Server is running on port 3000');
    // add a listener for the server to listen for requests
});


----------- 06 - Database , schema and models | Mongoose  ---------------

database.js

const mongoose = require('mongoose');


const connectDB = async () => {
   await mongoose.connect('mongodb+srv://om_panchal1301:DA3NJVp2dXhnaN8b@devtinder.kfip0p0.mongodb.net/');
  
}

module.exports = connectDB;

app.js 
const connectDB = require('./config/database');

connectDB().then(()=>{
    console.log('Connected to MongoDB');
    // start the server after connecting to the database
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
        // add a listener for the server to listen for requests
    });
}).catch((err)=>{
    console.log('Error connecting to MongoDB', err);
})
