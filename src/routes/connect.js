const express = require("express");
const connectRouter = express.Router();
const userAuth = require("../middlewares/auth");
const Connection = require("../models/connection");
const User = require("../models/user");

connectRouter.post(
  "/request/send/:status/:receiverId",
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
        .json({ message: `${req.user.firstName} sent a request to ${receiver.firstName} with status ${status}`, data: connection });
    } catch (error) {
      console.log("error=>", error);
      res
        .status(400)
        .json({ message: "Error creating connection", error: error.message });
    }
  }
);

connectRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const { requestId, status } = req.params;
      const allowedStatuses = ["accepted", "rejected"];
      if (!allowedStatuses.includes(status)) {
        // check if the status is valid
        return res.status(400).json({ message: "Invalid status" });
      }
      // check if the connection is valid and the receiver is the one who is reviewing the request
      const isConnectionValid = await Connection.findOne({
        _id: requestId,
        receiverId: req.user._id,
        status: "interested",
      });
      if (!isConnectionValid) {
        return res.status(400).json({ message: "Connection not found" });
      }
      isConnectionValid.status = status; // update the status of the connection
      await isConnectionValid.save(); // save the connection
      res.status(200).json({
        message: "Connection updated successfully",
        data: isConnectionValid,
      });
    } catch (error) {
      console.log("error=>", error);
      res
        .status(400)
        .json({ message: "Error accepting request", error: error.message });
    }
  }
);

module.exports = connectRouter;
