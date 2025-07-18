const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const profileRouter = require("./routes/profile");

const app = express(); // create an express application
app.use(express.json()); // added middleware to parse the request body
app.use(cookieParser()); // added middleware to parse the cookies

app.use("/", authRouter); // auth routes
app.use("/", userRouter); // user routes
app.use("/", profileRouter); // profile routes

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
