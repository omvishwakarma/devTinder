const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const {validatingSignupData} = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const userAuth = require("./middlewares/auth");

const app = express(); // create an express application
app.use(express.json()); // added middleware to parse the request body
app.use(cookieParser()); // added middleware to parse the cookies

app.post("/signup", async (req, res) => {

  const data = req.body;

    const {firstName, lastName, emailId, age, gender, password, skills} = data;
    // allowed fields to update
    const ALLOW_UPDATES = ['firstName', 'lastName', 'age', 'gender', 'password', 'skills'];


    const hashedPassword = await bcrypt.hash(password, 10);
    
    
    
    try {
      validatingSignupData(data); // validate the signup data
      console.log("hashedPassword=>", hashedPassword, emailId, password);
    
     // check if the request body is empty
    const isAllowUpdate = Object.keys(data).every(key => ALLOW_UPDATES.includes(key));
    if(!isAllowUpdate){
        return res.status(400).send("Invalid update fields");
    }
    if(data.skills.length > 10){
        // if the skills array is greater than 10, return an error
        return res.status(400).send("Skills should be less than 10");
    }
    console.log("validated data=>", data );
    const user =  await User.create({
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
    console.log("error=>", error);
    res.status(400).send("Error saving user=>", error.message);
  }
});

app.post("/login", async (req, res) => {
  const {emailId, password} = req.body;
  const user = await User.findOne({emailId});
  const isPasswordValid = await user.isValidPassword(password);
  try{
    if(!user){
      return res.status(400).send("Invalid email or password");
    }
    if(!isPasswordValid){
      return res.status(400).send("Invalid email or password");
    }
    // 
    const token = await user.getJWT(); 
    console.log("token=>", token);
    res.cookie("token", token, { expires: new Date(Date.now() + 1000 * 60 * 60 * 24)}); // expires in 24 hours
    res.status(200).send("login Successful");
  }catch(error){
    res.status(400).send("Error logging in=>", error.message);
  }
});

//profile

app.get("/profile", userAuth, async (req, res) => {
  const user = req.user;
  try{
    res.status(200).send(user);
  }catch(error){
    res.status(400).send("Error getting user=>", error.message);
  }

});

// get a user by id
app.get("/user/:userId", async (req, res) => {
  const userID = req.params.userId;
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
