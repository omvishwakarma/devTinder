const express = require('express'); 
const connectDB = require('./config/database');

const app = express(); // create an express application

app.use('/user', [(req, res, next)=>{
    console.log('middleware 1');
    res.send('response from middleware 1'); // send a response to the client
    next();
}, (req, res, next)=>{
    console.log('middleware 2');
    // res.send('response from middleware 2'); // send a response to the client
}], (req, res, next)=>{
    console.log('middleware 3');
    res.send('response from middleware 3'); // send a response to the client
});

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






