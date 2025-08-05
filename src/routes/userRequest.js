const express = require('express');
const auth = require('../middleware/auth');

const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest",auth,(req,res)=>{
    const users = req.users;
    res.send(fullName+"request send successfully");
})

module.exports = requestRouter;