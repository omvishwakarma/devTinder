const express = require("express");
const userRouter = express.Router();
const userAuth = require("../middlewares/auth");

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

// delete a user by id
userRouter.delete("/user", userAuth, async (req, res) => {
  const userID = req.body.userId;
  try {
    await User.findOneAndDelete(userID);
    res.status(200).send("User deleted successfully"); // send a response to the client
  } catch (error) {
    res.status(400).send("Error deleting user delete=>" + error.message);
  }
});

// update a user by id
userRouter.patch("/user", userAuth, async (req, res) => {
  const userID = req.body.userId;
  try {
    const user = await User.findOneAndUpdate(userID, req.body);
    res.status(200).send("User updated successfully"); // send a response to the client
  } catch (error) {
    res.status(400).send("Error updating user update=>" + error.message);
  }
});

module.exports = userRouter;
