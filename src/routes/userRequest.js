const express = require('express');
const auth = require('../middleware/auth');
const ConnectionRequest = require('../config/models/connectionRequest');
const User = require('../config/models/usermodel');

const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId", auth, async (req, res) => {
    try {
        const fromUserId = req.users._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ['ignore', 'interested'];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ error: "Status type is invalid" });
        }

        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(404).json({ error: "User not found" });
        }

        if (fromUserId.equals(toUserId)) {
            return res.status(400).json({ error: "You can't send a request to yourself" });
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });

        if (existingConnectionRequest) {
            return res.status(400).json({ message: "Connection request already exists" });
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        const data = await connectionRequest.save();
        res.json({ message: "Connection request sent successfully", data });
    } catch (error) {
        console.error("Error sending connection request:", error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});

module.exports = requestRouter;
