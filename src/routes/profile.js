const express = require("express");
const profileRouter = express.Router();
const userAuth = require("../middlewares/auth");
//profile

profileRouter.get("/profile", userAuth, async (req, res) => {
    const user = req.user;
    try{
      res.status(200).send(user);
    }catch(error){
      console.log("error=>", error);
      res.status(400).send("Error getting profile=> " + error.message);
    }
  
  });

module.exports = profileRouter;