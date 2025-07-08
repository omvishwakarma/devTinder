const express = require('express');

const app = express(); // create an express application


// this will match with get methods only
app.get('/user', (req, res)=>{
    res.send({
        name: 'John',
        age: 20,
        city: 'New York'
    }); // send a response to the client
});

app.post('/user', (req, res)=>{
    res.send('user created'); // send a response to the client
});


// order of routes matters
// this will match with all http methods

// app.use('/hello/2', (req, res)=>{
//     res.send('abara ka dabra'); // send a response to the client
// });

// app.use("/hello", (req, res)=>{
//     res.send('hello from server'); // send a response to the client
// });

// app.use("/", (req, res)=>{
//     res.send('Home page from server'); // send a response to the client
// });




app.listen(3000, () => {
    console.log('Server is running on port 3000');
    // add a listener for the server to listen for requests
});

// app.get('/', (req, res) => {
//     res.send('Hello World');
// });


