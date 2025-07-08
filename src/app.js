const express = require('express');

const app = express(); // create an express application

app.use("/hello", (req, res)=>{
    console.log('Request received');
    res.send('response from server'); // send a response to the client
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
    // add a listener for the server to listen for requests
});

// app.get('/', (req, res) => {
//     res.send('Hello World');
// });


