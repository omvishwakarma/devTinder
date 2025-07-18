const express = require("express");
const profileRouter = express.Router();
const userAuth = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
//profile

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  const user = req.user;
  try {
    res.status(200).json({
        message: "Profile fetched successfully",
        data: user
    });
  } catch (error) {
    console.log("error=>", error);
    res.status(400).send("Error getting profile=> " + error.message);
  }
});

// delete a user by id
profileRouter.delete("/profile/delete", userAuth, async (req, res) => {
  const userID = req.body.userId;
  try {
    await User.findOneAndDelete(userID);
    res.status(200).send("User deleted successfully"); // send a response to the client
  } catch (error) {
    res.status(400).send("Error deleting user delete=>" + error.message);
  }
});

// update a user by id
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {

  const userID = req.body.userId;
  const loggedInUser = req.user;
  try {
    // validateEditProfileData(req.body);

    Object.keys(req.body).forEach(key => {
        loggedInUser[key] = req.body[key];
    })

    // const user = await User.findOneAndUpdate(userID, req.body); // old way
    await loggedInUser.save();
    res.status(200).json({
        message: `${loggedInUser.firstName} ${loggedInUser.lastName} Profile updated successfully`,
        data: loggedInUser
    }); // send a response to the client
  } catch (error) {
    res.status(400).send("Error updating user update=>" + error.message);
  }
});

module.exports = profileRouter;
