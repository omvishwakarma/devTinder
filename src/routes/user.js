const express = require("express");
const userRouter = express.Router();
const userAuth = require("../middlewares/auth");
const User = require("../models/user");
const Connection = require("../models/connection");

// get a user by id
userRouter.get("user/:userId", userAuth, async (req, res) => {
  const userID = req.params.userId;
  try {
    const user = await User.findOne({ _id: userID });
    if (user) {
      res.status(200).send(user);
    } else {
      res.status(400).send("User not found");
    }
    // send a response to the client
  } catch (error) {
    console.log("error=>", error);
    res.status(400).send("Error getting user userId =>" + error.message);
  }
});

// get all users
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const allUsers = await User.find({});
    res.status(200).send(allUsers); // send a response to the client
  } catch (error) {
    console.log("error=>", error);
    res.status(400).send("Error getting users feed=>" + error.message);
  }
});

// get all connections for a user
userRouter.get("/connections/requests/received", userAuth, async (req, res) => {
  const userID = req.user._id;
  try {
    const connections = await Connection.find({
      receiverId: userID,
      status: "interested",
    }).populate("senderId", ["firstName", "lastName", "age"]);

    console.log("connections=>", connections);

    return res.status(200).json({
      message: "Connections received",
      data: connections,
    });
  } catch (error) {
    console.log("error=>", error);
    res.status(400).send("Error getting connections=>" + error.message);
  }
});
module.exports = userRouter;
