const express = require("express");
const connectRouter = express.Router();
const userAuth = require("../middlewares/auth");
const Connection = require("../models/connection");
const User = require("../models/user");

connectRouter.post(
  "/connect/:status/:receiverId",
  userAuth,
  async (req, res) => {
    const { status, receiverId } = req.params;
    const senderId = req.user._id;
    const allowedStatuses = ["interested", "ignored"];

    try {
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      const receiver = await User.findById(receiverId);
      if (!receiver) {
        return res.status(400).json({ message: "Receiver not found" });
      }
      const existingConnection = await Connection.findOne({
        $or: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      });
      if (existingConnection) {
        return res.status(400).json({ message: "Connection already exists" });
      }
      const connection = new Connection({ senderId, receiverId, status });
      await connection.save();
      res
        .status(200)
        .json({ message: "Connection created successfully", data: connection });
    } catch (error) {
      console.log("error=>", error);
      res
        .status(400)
        .json({ message: "Error creating connection", error: error.message });
    }
  }
);

module.exports = connectRouter;
