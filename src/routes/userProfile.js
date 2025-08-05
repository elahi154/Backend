const express = require('express');
const auth = require('../middleware/auth');

const profileRouter = express.Router();

profileRouter.get("/user",auth,async(req,res)=>{
    try {
       const users =  req.users;
       res.send(users);
       
    } catch (error) {
        console.log("cant not get user",error);
    }
    
})

module.exports = profileRouter;