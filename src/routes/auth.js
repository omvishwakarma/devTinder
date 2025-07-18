const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validatingSignupData } = require("../utils/validation");

authRouter.post("/signup", async (req, res) => {
  const data = req.body;

  const { firstName, lastName, emailId, age, gender, password, skills } = data;
  // allowed fields to update
  const ALLOW_UPDATES = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "emailId",
    "password",
    "skills",
  ];

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    validatingSignupData(data); // validate the signup data

    // check if the request body is empty
    const isAllowUpdate = Object.keys(data).every((key) =>
      ALLOW_UPDATES.includes(key)
    );
    if (!isAllowUpdate) {
      return res.status(400).send("Invalid update fields");
    }
    if (data.skills.length > 10) {
      // if the skills array is greater than 10, return an error
      return res.status(400).send("Skills should be less than 10");
    }

    const user = await User.create({
      firstName,
      lastName,
      emailId,
      age,
      gender,
      password: hashedPassword,
      skills,
    });

    await user.save();
    res.status(200).send("User created successfully"); // send a response to the client
  } catch (error) {
    console.log("error=>", error);
    res.status(400).send("Error saving user=>", error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  const user = await User.findOne({ emailId });
  const isPasswordValid = await user.isValidPassword(password);
  try {
    if (!user) {
      return res.status(400).send("Invalid email or password");
    }
    if (!isPasswordValid) {
      return res.status(400).send("Invalid email or password");
    }
    //
    const token = await user.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    }); // expires in 24 hours
    res.status(200).send("login Successful");
  } catch (error) {
    res.status(400).send("Error logging in=>", error.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(0) });
  res.status(200).send("logout Successful");
});

module.exports = authRouter;
