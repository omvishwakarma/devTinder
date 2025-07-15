const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const {validatingSignupData} = require("./utils/validation");
const bcrypt = require("bcrypt");

const app = express(); // create an express application
app.use(express.json()); // added middleware to parse the request body

app.post("/signup", async (req, res) => {


    const {firstName, lastName, emailId, age, gender, password, skills} = req.body;
    // allowed fields to update
    const ALLOW_UPDATES = ['firstName', 'lastName', 'age', 'gender', 'password', 'skills'];

    const hashedPassword = await bcrypt.hash(password, 10);
    
  
  try {
    validatingSignupData(data); // validate the signup data
     // check if the request body is empty
    const isAllowUpdate = Object.keys(data).every(key => ALLOW_UPDATES.includes(key));
    if(!isAllowUpdate){
        return res.status(400).send("Invalid update fields");
    }
    if(data.skills.length > 10){
        // if the skills array is greater than 10, return an error
        return res.status(400).send("Skills should be less than 10");
    }
    const user = new User({
      firstName,
      lastName,
      emailId,
      age,
      gender,
      password: hashedPassword,
      skills
    });
    await user.save();
    res.status(200).send("User created successfully"); // send a response to the client
  } catch (error) {
    res.status(400).send("Error saving user=>", error.message);
  }
});

// get a user by id
app.get("/user", async (req, res) => {
  const userID = req.body.userId;
  console.log("userID=>", userID);
  try {
    const user = await User.findOne({ _id: userID });
    if(user){
        res.status(200).send(user);
    }else{
        res.status(400).send("User not found");
    }
    // send a response to the client
  } catch (error) {
    res.status(400).send("Error getting user=>", error.message);
  }
});

// get all users
app.get("/feed", async (req, res) => {
  try {
    const allUsers = await User.find({});
    res.status(200).send(allUsers); // send a response to the client
  } catch (error) {
    res.status(400).send("Error getting users=>", error.message);
  }
});

// delete a user by id
app.delete("/user", async (req, res) => {
  const userID = req.body.userId;
  try {
    await User.findOneAndDelete(userID);
    res.status(200).send("User deleted successfully"); // send a response to the client
  } catch (error) {
    res.status(400).send("Error deleting user=>", error.message);
  }
});

// update a user by id 
app.patch("/user", async (req, res) => {
  const userID = req.body.userId;
  try {
    const user = await User.findOneAndUpdate(userID, req.body);
    res.status(200).send("User updated successfully"); // send a response to the client
  } catch (error) {
    res.status(400).send("Error updating user=>", error.message);
  }
});
//find user by email id 
app.get("/user/:emailId", async (req, res) => {
  const emailId = req.params.emailId;
  try {
    const user = await User.findOne({emailId: emailId});
    res.status(200).send(user); // send a response to the client
  } catch (error) {
    res.status(400).send("Error finding user=>", error.message);
  }
});

connectDB()
  .then(() => {
    console.log("Connected to MongoDB");
    // start the server after connecting to the database
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
      // add a listener for the server to listen for requests
    });
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });
