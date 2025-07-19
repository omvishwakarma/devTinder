const express = require("express");
const userRouter = express.Router();
const userAuth = require("../middlewares/auth");
const User = require("../models/user");
const Connection = require("../models/connection");

const SAFE_USER_FIELDS = "firstName lastName age";

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
userRouter.get(
  "/user/connections/requests/received",
  userAuth,
  async (req, res) => {
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
  }
);

// get all accepted connections for a user
userRouter.get("/user/connections", userAuth, async (req, res) => {
  const userID = req.user._id;
  try {
    const connections = await Connection.find({
      $or: [
        { senderId: userID, status: "accepted" },
        { receiverId: userID, status: "accepted" },
      ],
    })
      .populate("senderId", SAFE_USER_FIELDS)
      .populate("receiverId", SAFE_USER_FIELDS); // populate the sender and receiver ids

    const data = connections.map((connection) => {
      if (connection.senderId._id.toString() === userID.toString()) { // if the sender id is the same as the user id, return the receiver id
        return connection.receiverId;
      } else {
        return connection.senderId;
      }
    });
    return res.status(200).json({
      message: "Connections accepted",
      data: data, 
    });
  } catch (error) {
    console.log("error=>", error);
    res.status(400).send("Error getting connections=>" + error.message);
  }
});

module.exports = userRouter;
